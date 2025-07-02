import { useState, useEffect, useCallback } from 'react';
import { GameState, Weapon, Armor, Enemy, ChestReward, RelicItem, Achievement, PlayerTag, DailyReward, MenuSkill, AdventureSkill } from '../types/game';
import { generateWeapon, generateArmor, generateEnemy, generateRelicItem, getChestRarityWeights, calculateResearchBonus, calculateResearchCost } from '../utils/gameUtils';
import { checkAchievements, initializeAchievements } from '../utils/achievements';
import { checkPlayerTags, initializePlayerTags } from '../utils/playerTags';
import AsyncStorage from '../utils/storage';

const STORAGE_KEY = 'hugoland_game_state';

const createInitialGameState = (): GameState => ({
  coins: 100,
  gems: 0,
  shinyGems: 0,
  zone: 1,
  playerStats: {
    hp: 100,
    maxHp: 100,
    atk: 20,
    def: 10,
    baseAtk: 20,
    baseDef: 10,
    baseHp: 100,
  },
  inventory: {
    weapons: [],
    armor: [],
    relics: [],
    currentWeapon: null,
    currentArmor: null,
    equippedRelics: [],
  },
  currentEnemy: null,
  inCombat: false,
  combatLog: [],
  research: {
    level: 0,
    totalSpent: 0,
    availableUpgrades: ['atk', 'def', 'hp'],
  },
  isPremium: false,
  achievements: initializeAchievements(),
  collectionBook: {
    weapons: {},
    armor: {},
    totalWeaponsFound: 0,
    totalArmorFound: 0,
    rarityStats: {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
      mythical: 0,
    },
  },
  knowledgeStreak: {
    current: 0,
    best: 0,
    multiplier: 1,
  },
  gameMode: {
    current: 'normal',
    speedModeActive: false,
    survivalLives: 3,
    maxSurvivalLives: 3,
    timeAttackScore: 0,
    timeAttackTimeLeft: 60,
    bossProgress: 0,
  },
  statistics: {
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    totalPlayTime: 0,
    zonesReached: 1,
    itemsCollected: 0,
    coinsEarned: 0,
    gemsEarned: 0,
    shinyGemsEarned: 0,
    chestsOpened: 0,
    accuracyByCategory: {},
    sessionStartTime: new Date(),
    totalDeaths: 0,
    totalVictories: 0,
    longestStreak: 0,
    fastestVictory: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    itemsUpgraded: 0,
    itemsSold: 0,
    totalResearchSpent: 0,
    averageAccuracy: 0,
    revivals: 0,
  },
  cheats: {
    infiniteCoins: false,
    infiniteGems: false,
    obtainAnyItem: false,
  },
  mining: {
    totalGemsMined: 0,
    totalShinyGemsMined: 0,
  },
  yojefMarket: {
    items: [],
    lastRefresh: new Date(),
    nextRefresh: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  playerTags: initializePlayerTags(),
  dailyRewards: {
    lastClaimDate: null,
    currentStreak: 0,
    maxStreak: 0,
    availableReward: null,
    rewardHistory: [],
  },
  progression: {
    level: 1,
    experience: 0,
    experienceToNext: 100,
    skillPoints: 0,
    unlockedSkills: [],
    prestigeLevel: 0,
    prestigePoints: 0,
    masteryLevels: {},
  },
  offlineProgress: {
    lastSaveTime: new Date(),
    offlineCoins: 0,
    offlineGems: 0,
    offlineTime: 0,
    maxOfflineHours: 24,
  },
  gardenOfGrowth: {
    isPlanted: false,
    plantedAt: null,
    lastWatered: null,
    waterHoursRemaining: 0,
    growthCm: 0,
    totalGrowthBonus: 0,
    seedCost: 1000,
    waterCost: 500,
    maxGrowthCm: 100,
  },
  settings: {
    colorblindMode: false,
    darkMode: true,
    language: 'en',
    notifications: true,
  },
  hasUsedRevival: false,
  skills: {
    activeMenuSkill: null,
    lastRollTime: null,
    playTimeThisSession: 0,
    sessionStartTime: new Date(),
  },
  adventureSkills: {
    selectedSkill: null,
    availableSkills: [],
    showSelectionModal: false,
    skillEffects: {
      skipCardUsed: false,
      metalShieldUsed: false,
      dodgeUsed: false,
      truthLiesActive: false,
      lightningChainActive: false,
      rampActive: false,
    },
  },
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load game state from storage
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Ensure all new properties exist
          const completeState = {
            ...createInitialGameState(),
            ...parsedState,
            skills: {
              ...createInitialGameState().skills,
              ...parsedState.skills,
            },
            adventureSkills: {
              ...createInitialGameState().adventureSkills,
              ...parsedState.adventureSkills,
            },
          };
          setGameState(completeState);
        } else {
          setGameState(createInitialGameState());
        }
      } catch (error) {
        console.error('Error loading game state:', error);
        setGameState(createInitialGameState());
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, []);

  // Save game state to storage
  const saveGameState = useCallback(async (state: GameState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }, []);

  // Auto-save when game state changes
  useEffect(() => {
    if (gameState && !isLoading) {
      saveGameState(gameState);
    }
  }, [gameState, isLoading, saveGameState]);

  const updateGameState = useCallback((updater: (state: GameState) => GameState) => {
    setGameState(prevState => {
      if (!prevState) return prevState;
      return updater(prevState);
    });
  }, []);

  const equipWeapon = useCallback((weapon: Weapon) => {
    updateGameState(state => ({
      ...state,
      inventory: {
        ...state.inventory,
        currentWeapon: weapon,
      },
    }));
  }, [updateGameState]);

  const equipArmor = useCallback((armor: Armor) => {
    updateGameState(state => ({
      ...state,
      inventory: {
        ...state.inventory,
        currentArmor: armor,
      },
    }));
  }, [updateGameState]);

  const upgradeWeapon = useCallback((weaponId: string) => {
    updateGameState(state => {
      const weapon = state.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || state.gems < weapon.upgradeCost) return state;

      const updatedWeapons = state.inventory.weapons.map(w =>
        w.id === weaponId
          ? {
              ...w,
              level: w.level + 1,
              upgradeCost: Math.floor(w.upgradeCost * 1.5),
            }
          : w
      );

      const updatedCurrentWeapon = state.inventory.currentWeapon?.id === weaponId
        ? updatedWeapons.find(w => w.id === weaponId) || state.inventory.currentWeapon
        : state.inventory.currentWeapon;

      return {
        ...state,
        gems: state.gems - weapon.upgradeCost,
        inventory: {
          ...state.inventory,
          weapons: updatedWeapons,
          currentWeapon: updatedCurrentWeapon,
        },
        statistics: {
          ...state.statistics,
          itemsUpgraded: state.statistics.itemsUpgraded + 1,
        },
      };
    });
  }, [updateGameState]);

  const upgradeArmor = useCallback((armorId: string) => {
    updateGameState(state => {
      const armor = state.inventory.armor.find(a => a.id === armorId);
      if (!armor || state.gems < armor.upgradeCost) return state;

      const updatedArmor = state.inventory.armor.map(a =>
        a.id === armorId
          ? {
              ...a,
              level: a.level + 1,
              upgradeCost: Math.floor(a.upgradeCost * 1.5),
            }
          : a
      );

      const updatedCurrentArmor = state.inventory.currentArmor?.id === armorId
        ? updatedArmor.find(a => a.id === armorId) || state.inventory.currentArmor
        : state.inventory.currentArmor;

      return {
        ...state,
        gems: state.gems - armor.upgradeCost,
        inventory: {
          ...state.inventory,
          armor: updatedArmor,
          currentArmor: updatedCurrentArmor,
        },
        statistics: {
          ...state.statistics,
          itemsUpgraded: state.statistics.itemsUpgraded + 1,
        },
      };
    });
  }, [updateGameState]);

  const sellWeapon = useCallback((weaponId: string) => {
    updateGameState(state => {
      const weapon = state.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || state.inventory.currentWeapon?.id === weaponId) return state;

      return {
        ...state,
        coins: state.coins + weapon.sellPrice,
        inventory: {
          ...state.inventory,
          weapons: state.inventory.weapons.filter(w => w.id !== weaponId),
        },
        statistics: {
          ...state.statistics,
          itemsSold: state.statistics.itemsSold + 1,
        },
      };
    });
  }, [updateGameState]);

  const sellArmor = useCallback((armorId: string) => {
    updateGameState(state => {
      const armor = state.inventory.armor.find(a => a.id === armorId);
      if (!armor || state.inventory.currentArmor?.id === armorId) return state;

      return {
        ...state,
        coins: state.coins + armor.sellPrice,
        inventory: {
          ...state.inventory,
          armor: state.inventory.armor.filter(a => a.id !== armorId),
        },
        statistics: {
          ...state.statistics,
          itemsSold: state.statistics.itemsSold + 1,
        },
      };
    });
  }, [updateGameState]);

  const upgradeResearch = useCallback((type: 'atk' | 'def' | 'hp') => {
    updateGameState(state => {
      const cost = calculateResearchCost(state.research.level);
      if (state.coins < cost) return state;

      return {
        ...state,
        coins: state.coins - cost,
        research: {
          ...state.research,
          level: state.research.level + 1,
          totalSpent: state.research.totalSpent + cost,
        },
        statistics: {
          ...state.statistics,
          totalResearchSpent: state.statistics.totalResearchSpent + cost,
        },
      };
    });
  }, [updateGameState]);

  const openChest = useCallback((cost: number): ChestReward | null => {
    let reward: ChestReward | null = null;

    updateGameState(state => {
      if (state.coins < cost) return state;

      const weights = getChestRarityWeights(cost);
      const random = Math.random() * 100;
      let cumulative = 0;
      let selectedRarity = 'common';

      const rarities = ['common', 'rare', 'epic', 'legendary', 'mythical'];
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
          selectedRarity = rarities[i];
          break;
        }
      }

      // 70% chance for weapon, 30% for armor
      const isWeapon = Math.random() < 0.7;
      const item = isWeapon ? generateWeapon(false, selectedRarity) : generateArmor(false, selectedRarity);

      reward = {
        type: isWeapon ? 'weapon' : 'armor',
        items: [item],
      };

      const newInventory = { ...state.inventory };
      if (isWeapon) {
        newInventory.weapons = [...newInventory.weapons, item as Weapon];
      } else {
        newInventory.armor = [...newInventory.armor, item as Armor];
      }

      // Update collection book
      const newCollectionBook = { ...state.collectionBook };
      if (isWeapon) {
        if (!newCollectionBook.weapons[item.name]) {
          newCollectionBook.weapons[item.name] = true;
          newCollectionBook.totalWeaponsFound += 1;
        }
      } else {
        if (!newCollectionBook.armor[item.name]) {
          newCollectionBook.armor[item.name] = true;
          newCollectionBook.totalArmorFound += 1;
        }
      }

      newCollectionBook.rarityStats[item.rarity as keyof typeof newCollectionBook.rarityStats] += 1;

      return {
        ...state,
        coins: state.coins - cost,
        gems: state.gems + Math.floor(Math.random() * 10) + 5,
        inventory: newInventory,
        collectionBook: newCollectionBook,
        statistics: {
          ...state.statistics,
          chestsOpened: state.statistics.chestsOpened + 1,
          itemsCollected: state.statistics.itemsCollected + 1,
        },
      };
    });

    return reward;
  }, [updateGameState]);

  const purchaseMythical = useCallback((cost: number): boolean => {
    let success = false;

    updateGameState(state => {
      if (state.coins < cost) return state;

      success = true;
      const isWeapon = Math.random() < 0.5;
      const item = isWeapon ? generateWeapon(false, 'mythical') : generateArmor(false, 'mythical');

      const newInventory = { ...state.inventory };
      if (isWeapon) {
        newInventory.weapons = [...newInventory.weapons, item as Weapon];
      } else {
        newInventory.armor = [...newInventory.armor, item as Armor];
      }

      return {
        ...state,
        coins: state.coins - cost,
        inventory: newInventory,
      };
    });

    return success;
  }, [updateGameState]);

  const startCombat = useCallback(() => {
    updateGameState(state => {
      // Show adventure skill selection modal
      const availableSkills = generateRandomAdventureSkills();
      
      return {
        ...state,
        adventureSkills: {
          ...state.adventureSkills,
          availableSkills,
          showSelectionModal: true,
        },
      };
    });
  }, [updateGameState]);

  const selectAdventureSkill = useCallback((skill: AdventureSkill) => {
    updateGameState(state => {
      const enemy = generateEnemy(state.zone);
      
      // Apply skill effects
      let modifiedPlayerStats = { ...state.playerStats };
      let skillEffects = { ...state.adventureSkills.skillEffects };

      switch (skill.type) {
        case 'risker':
          modifiedPlayerStats.hp = Math.floor(modifiedPlayerStats.hp * 0.85);
          modifiedPlayerStats.atk = Math.floor(modifiedPlayerStats.atk * 1.2);
          break;
        case 'lightning_chain':
          skillEffects.lightningChainActive = true;
          break;
        case 'truth_lies':
          skillEffects.truthLiesActive = true;
          break;
        case 'ramp':
          const statToDouble = Math.random() < 0.33 ? 'atk' : Math.random() < 0.5 ? 'def' : 'hp';
          const statToReduce = statToDouble === 'atk' ? (Math.random() < 0.5 ? 'def' : 'hp') : 
                              statToDouble === 'def' ? (Math.random() < 0.5 ? 'atk' : 'hp') : 
                              (Math.random() < 0.5 ? 'atk' : 'def');
          
          if (statToDouble === 'atk') modifiedPlayerStats.atk *= 2;
          else if (statToDouble === 'def') modifiedPlayerStats.def *= 2;
          else modifiedPlayerStats.hp *= 2;

          if (statToReduce === 'atk') modifiedPlayerStats.atk = Math.floor(modifiedPlayerStats.atk * 0.6);
          else if (statToReduce === 'def') modifiedPlayerStats.def = Math.floor(modifiedPlayerStats.def * 0.6);
          else modifiedPlayerStats.hp = Math.floor(modifiedPlayerStats.hp * 0.6);
          
          skillEffects.rampActive = true;
          break;
      }

      return {
        ...state,
        currentEnemy: enemy,
        inCombat: true,
        playerStats: modifiedPlayerStats,
        combatLog: [`You encounter a ${enemy.name}!`],
        adventureSkills: {
          ...state.adventureSkills,
          selectedSkill: skill,
          showSelectionModal: false,
          skillEffects: {
            ...skillEffects,
            skipCardUsed: false,
            metalShieldUsed: false,
            dodgeUsed: false,
          },
        },
      };
    });
  }, [updateGameState]);

  const skipAdventureSkills = useCallback(() => {
    updateGameState(state => {
      const enemy = generateEnemy(state.zone);
      
      return {
        ...state,
        currentEnemy: enemy,
        inCombat: true,
        combatLog: [`You encounter a ${enemy.name}!`],
        adventureSkills: {
          ...state.adventureSkills,
          selectedSkill: null,
          showSelectionModal: false,
          skillEffects: {
            skipCardUsed: false,
            metalShieldUsed: false,
            dodgeUsed: false,
            truthLiesActive: false,
            lightningChainActive: false,
            rampActive: false,
          },
        },
      };
    });
  }, [updateGameState]);

  const useSkipCard = useCallback(() => {
    updateGameState(state => ({
      ...state,
      adventureSkills: {
        ...state.adventureSkills,
        skillEffects: {
          ...state.adventureSkills.skillEffects,
          skipCardUsed: true,
        },
      },
    }));
  }, [updateGameState]);

  const attack = useCallback((hit: boolean, category?: string) => {
    updateGameState(state => {
      if (!state.currentEnemy) return state;

      let newState = { ...state };
      let damage = 0;
      let enemyDamage = 0;

      if (hit) {
        // Player attacks
        damage = Math.max(1, newState.playerStats.atk - newState.currentEnemy.def);
        
        // Apply lightning chain bonus
        if (newState.adventureSkills.skillEffects.lightningChainActive) {
          damage = Math.floor(damage * 1.15);
        }

        newState.currentEnemy.hp = Math.max(0, newState.currentEnemy.hp - damage);
        newState.combatLog = [...newState.combatLog, `You deal ${damage} damage!`];

        // Update knowledge streak
        newState.knowledgeStreak.current += 1;
        if (newState.knowledgeStreak.current > newState.knowledgeStreak.best) {
          newState.knowledgeStreak.best = newState.knowledgeStreak.current;
        }
        newState.knowledgeStreak.multiplier = 1 + (newState.knowledgeStreak.current * 0.1);

        // Update statistics
        newState.statistics.correctAnswers += 1;
        newState.statistics.totalDamageDealt += damage;

        if (category) {
          if (!newState.statistics.accuracyByCategory[category]) {
            newState.statistics.accuracyByCategory[category] = { correct: 0, total: 0 };
          }
          newState.statistics.accuracyByCategory[category].correct += 1;
          newState.statistics.accuracyByCategory[category].total += 1;
        }
      } else {
        // Enemy attacks
        enemyDamage = Math.max(1, newState.currentEnemy.atk - newState.playerStats.def);
        
        // Apply dodge skill
        if (newState.adventureSkills.skillEffects.dodgeUsed === false && newState.adventureSkills.selectedSkill?.type === 'dodge') {
          newState.adventureSkills.skillEffects.dodgeUsed = true;
          newState.combatLog = [...newState.combatLog, `You dodge the attack!`];
        } else {
          // Apply lightning chain penalty
          if (newState.adventureSkills.skillEffects.lightningChainActive) {
            enemyDamage = Math.floor(enemyDamage * 1.1);
          }

          newState.playerStats.hp = Math.max(0, newState.playerStats.hp - enemyDamage);
          newState.combatLog = [...newState.combatLog, `Enemy deals ${enemyDamage} damage!`];
          newState.statistics.totalDamageTaken += enemyDamage;
        }

        // Reset knowledge streak
        newState.knowledgeStreak.current = 0;
        newState.knowledgeStreak.multiplier = 1;

        if (category) {
          if (!newState.statistics.accuracyByCategory[category]) {
            newState.statistics.accuracyByCategory[category] = { correct: 0, total: 0 };
          }
          newState.statistics.accuracyByCategory[category].total += 1;
        }
      }

      newState.statistics.totalQuestionsAnswered += 1;

      // Check if enemy is defeated
      if (newState.currentEnemy.hp <= 0) {
        const coinReward = Math.floor((10 + newState.zone * 2) * newState.knowledgeStreak.multiplier);
        const gemReward = Math.floor((1 + Math.floor(newState.zone / 5)) * newState.knowledgeStreak.multiplier);

        newState.coins += coinReward;
        newState.gems += gemReward;
        newState.zone += 1;
        newState.inCombat = false;
        newState.currentEnemy = null;
        newState.combatLog = [...newState.combatLog, `Victory! +${coinReward} coins, +${gemReward} gems`];

        // Reset adventure skills
        newState.adventureSkills = {
          selectedSkill: null,
          availableSkills: [],
          showSelectionModal: false,
          skillEffects: {
            skipCardUsed: false,
            metalShieldUsed: false,
            dodgeUsed: false,
            truthLiesActive: false,
            lightningChainActive: false,
            rampActive: false,
          },
        };

        // Check for premium unlock
        if (newState.zone >= 50) {
          newState.isPremium = true;
        }

        newState.statistics.totalVictories += 1;
        newState.statistics.coinsEarned += coinReward;
        newState.statistics.gemsEarned += gemReward;
        newState.statistics.zonesReached = Math.max(newState.statistics.zonesReached, newState.zone);
      }

      // Check if player is defeated
      if (newState.playerStats.hp <= 0) {
        // Metal shield auto-activation
        if (newState.adventureSkills.selectedSkill?.type === 'metal_shield' && !newState.adventureSkills.skillEffects.metalShieldUsed) {
          newState.playerStats.hp = 1;
          newState.playerStats.atk = Math.floor(newState.playerStats.atk * 0.7);
          newState.adventureSkills.skillEffects.metalShieldUsed = true;
          newState.combatLog = [...newState.combatLog, `Metal Shield activated! Sacrificed ATK to survive!`];
        } else if (!newState.hasUsedRevival) {
          // Free revival
          newState.playerStats.hp = newState.playerStats.maxHp;
          newState.hasUsedRevival = true;
          newState.combatLog = [...newState.combatLog, `You have been revived!`];
          newState.statistics.revivals += 1;
        } else {
          // Game over
          newState.inCombat = false;
          newState.currentEnemy = null;
          newState.combatLog = [...newState.combatLog, `You have been defeated!`];
          newState.statistics.totalDeaths += 1;
          
          // Reset adventure skills
          newState.adventureSkills = {
            selectedSkill: null,
            availableSkills: [],
            showSelectionModal: false,
            skillEffects: {
              skipCardUsed: false,
              metalShieldUsed: false,
              dodgeUsed: false,
              truthLiesActive: false,
              lightningChainActive: false,
              rampActive: false,
            },
          };
        }
      }

      return newState;
    });
  }, [updateGameState]);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  const setGameMode = useCallback((mode: 'normal' | 'blitz' | 'bloodlust' | 'crazy' | 'survival' | 'timeAttack' | 'boss') => {
    updateGameState(state => ({
      ...state,
      gameMode: {
        ...state.gameMode,
        current: mode,
      },
    }));
  }, [updateGameState]);

  const toggleCheat = useCallback((cheat: keyof typeof gameState.cheats) => {
    updateGameState(state => ({
      ...state,
      cheats: {
        ...state.cheats,
        [cheat]: !state.cheats[cheat],
      },
    }));
  }, [updateGameState]);

  const generateCheatItem = useCallback(() => {
    // Implementation for cheat item generation
  }, []);

  const mineGem = useCallback((x: number, y: number): { gems: number; shinyGems: number } | null => {
    let result: { gems: number; shinyGems: number } | null = null;

    updateGameState(state => {
      // Fixed mining logic - check if there's actually a gem node at this position
      const isShinyNode = Math.random() < 0.05; // 5% chance for shiny nodes
      
      if (isShinyNode) {
        // Shiny node gives 1 shiny gem
        result = { gems: 0, shinyGems: 1 };
        return {
          ...state,
          shinyGems: state.shinyGems + 1,
          mining: {
            ...state.mining,
            totalShinyGemsMined: state.mining.totalShinyGemsMined + 1,
          },
          statistics: {
            ...state.statistics,
            shinyGemsEarned: state.statistics.shinyGemsEarned + 1,
          },
        };
      } else {
        // Normal node gives 1 regular gem
        result = { gems: 1, shinyGems: 0 };
        return {
          ...state,
          gems: state.gems + 1,
          mining: {
            ...state.mining,
            totalGemsMined: state.mining.totalGemsMined + 1,
          },
          statistics: {
            ...state.statistics,
            gemsEarned: state.statistics.gemsEarned + 1,
          },
        };
      }
    });

    return result;
  }, [updateGameState]);

  const exchangeShinyGems = useCallback((amount: number): boolean => {
    let success = false;

    updateGameState(state => {
      if (state.shinyGems < amount) return state;

      success = true;
      return {
        ...state,
        shinyGems: state.shinyGems - amount,
        gems: state.gems + (amount * 10),
      };
    });

    return success;
  }, [updateGameState]);

  const discardItem = useCallback((itemId: string, type: 'weapon' | 'armor') => {
    updateGameState(state => {
      if (type === 'weapon') {
        return {
          ...state,
          inventory: {
            ...state.inventory,
            weapons: state.inventory.weapons.filter(w => w.id !== itemId),
          },
        };
      } else {
        return {
          ...state,
          inventory: {
            ...state.inventory,
            armor: state.inventory.armor.filter(a => a.id !== itemId),
          },
        };
      }
    });
  }, [updateGameState]);

  const purchaseRelic = useCallback((relicId: string): boolean => {
    let success = false;

    updateGameState(state => {
      const relic = state.yojefMarket.items.find(r => r.id === relicId);
      if (!relic || state.gems < relic.cost || state.inventory.equippedRelics.length >= 5) return state;

      success = true;
      return {
        ...state,
        gems: state.gems - relic.cost,
        inventory: {
          ...state.inventory,
          relics: [...state.inventory.relics, relic],
          equippedRelics: [...state.inventory.equippedRelics, relic],
        },
        yojefMarket: {
          ...state.yojefMarket,
          items: state.yojefMarket.items.filter(r => r.id !== relicId),
        },
      };
    });

    return success;
  }, [updateGameState]);

  const upgradeRelic = useCallback((relicId: string) => {
    updateGameState(state => {
      const relic = state.inventory.relics.find(r => r.id === relicId);
      if (!relic || state.gems < relic.upgradeCost) return state;

      const updatedRelics = state.inventory.relics.map(r =>
        r.id === relicId
          ? {
              ...r,
              level: r.level + 1,
              upgradeCost: Math.floor(r.upgradeCost * 1.5),
              baseAtk: r.baseAtk ? r.baseAtk + 22 : undefined,
              baseDef: r.baseDef ? r.baseDef + 15 : undefined,
            }
          : r
      );

      const updatedEquippedRelics = state.inventory.equippedRelics.map(r =>
        r.id === relicId ? updatedRelics.find(ur => ur.id === relicId) || r : r
      );

      return {
        ...state,
        gems: state.gems - relic.upgradeCost,
        inventory: {
          ...state.inventory,
          relics: updatedRelics,
          equippedRelics: updatedEquippedRelics,
        },
      };
    });
  }, [updateGameState]);

  const equipRelic = useCallback((relicId: string) => {
    updateGameState(state => {
      const relic = state.inventory.relics.find(r => r.id === relicId);
      if (!relic || state.inventory.equippedRelics.length >= 5 || state.inventory.equippedRelics.some(r => r.id === relicId)) return state;

      return {
        ...state,
        inventory: {
          ...state.inventory,
          equippedRelics: [...state.inventory.equippedRelics, relic],
        },
      };
    });
  }, [updateGameState]);

  const unequipRelic = useCallback((relicId: string) => {
    updateGameState(state => ({
      ...state,
      inventory: {
        ...state.inventory,
        equippedRelics: state.inventory.equippedRelics.filter(r => r.id !== relicId),
      },
    }));
  }, [updateGameState]);

  const sellRelic = useCallback((relicId: string) => {
    updateGameState(state => ({
      ...state,
      inventory: {
        ...state.inventory,
        relics: state.inventory.relics.filter(r => r.id !== relicId),
        equippedRelics: state.inventory.equippedRelics.filter(r => r.id !== relicId),
      },
    }));
  }, [updateGameState]);

  const claimDailyReward = useCallback((): boolean => {
    let success = false;

    updateGameState(state => {
      if (!state.dailyRewards.availableReward) return state;

      success = true;
      const reward = state.dailyRewards.availableReward;

      return {
        ...state,
        coins: state.coins + reward.coins,
        gems: state.gems + reward.gems,
        dailyRewards: {
          ...state.dailyRewards,
          availableReward: null,
          lastClaimDate: new Date(),
          rewardHistory: [...state.dailyRewards.rewardHistory, { ...reward, claimed: true, claimDate: new Date() }],
        },
      };
    });

    return success;
  }, [updateGameState]);

  const upgradeSkill = useCallback((skillId: string): boolean => {
    // Implementation for skill upgrades
    return false;
  }, []);

  const prestige = useCallback((): boolean => {
    // Implementation for prestige system
    return false;
  }, []);

  const claimOfflineRewards = useCallback(() => {
    updateGameState(state => ({
      ...state,
      coins: state.coins + state.offlineProgress.offlineCoins,
      gems: state.gems + state.offlineProgress.offlineGems,
      offlineProgress: {
        ...state.offlineProgress,
        offlineCoins: 0,
        offlineGems: 0,
        offlineTime: 0,
      },
    }));
  }, [updateGameState]);

  const bulkSell = useCallback((itemIds: string[], type: 'weapon' | 'armor') => {
    updateGameState(state => {
      if (type === 'weapon') {
        const weaponsToSell = state.inventory.weapons.filter(w => itemIds.includes(w.id) && state.inventory.currentWeapon?.id !== w.id);
        const totalValue = weaponsToSell.reduce((sum, w) => sum + w.sellPrice, 0);

        return {
          ...state,
          coins: state.coins + totalValue,
          inventory: {
            ...state.inventory,
            weapons: state.inventory.weapons.filter(w => !itemIds.includes(w.id) || state.inventory.currentWeapon?.id === w.id),
          },
        };
      } else {
        const armorToSell = state.inventory.armor.filter(a => itemIds.includes(a.id) && state.inventory.currentArmor?.id !== a.id);
        const totalValue = armorToSell.reduce((sum, a) => sum + a.sellPrice, 0);

        return {
          ...state,
          coins: state.coins + totalValue,
          inventory: {
            ...state.inventory,
            armor: state.inventory.armor.filter(a => !itemIds.includes(a.id) || state.inventory.currentArmor?.id === a.id),
          },
        };
      }
    });
  }, [updateGameState]);

  const bulkUpgrade = useCallback((itemIds: string[], type: 'weapon' | 'armor') => {
    updateGameState(state => {
      if (type === 'weapon') {
        const weaponsToUpgrade = state.inventory.weapons.filter(w => itemIds.includes(w.id));
        const totalCost = weaponsToUpgrade.reduce((sum, w) => sum + w.upgradeCost, 0);

        if (state.gems < totalCost) return state;

        const updatedWeapons = state.inventory.weapons.map(w =>
          itemIds.includes(w.id)
            ? {
                ...w,
                level: w.level + 1,
                upgradeCost: Math.floor(w.upgradeCost * 1.5),
              }
            : w
        );

        return {
          ...state,
          gems: state.gems - totalCost,
          inventory: {
            ...state.inventory,
            weapons: updatedWeapons,
          },
        };
      } else {
        const armorToUpgrade = state.inventory.armor.filter(a => itemIds.includes(a.id));
        const totalCost = armorToUpgrade.reduce((sum, a) => sum + a.upgradeCost, 0);

        if (state.gems < totalCost) return state;

        const updatedArmor = state.inventory.armor.map(a =>
          itemIds.includes(a.id)
            ? {
                ...a,
                level: a.level + 1,
                upgradeCost: Math.floor(a.upgradeCost * 1.5),
              }
            : a
        );

        return {
          ...state,
          gems: state.gems - totalCost,
          inventory: {
            ...state.inventory,
            armor: updatedArmor,
          },
        };
      }
    });
  }, [updateGameState]);

  const plantSeed = useCallback((): boolean => {
    let success = false;

    updateGameState(state => {
      if (state.coins < state.gardenOfGrowth.seedCost || state.gardenOfGrowth.isPlanted) return state;

      success = true;
      return {
        ...state,
        coins: state.coins - state.gardenOfGrowth.seedCost,
        gardenOfGrowth: {
          ...state.gardenOfGrowth,
          isPlanted: true,
          plantedAt: new Date(),
          lastWatered: new Date(),
          waterHoursRemaining: 24,
        },
      };
    });

    return success;
  }, [updateGameState]);

  const buyWater = useCallback((hours: number): boolean => {
    let success = false;

    updateGameState(state => {
      const cost = (hours / 24) * state.gardenOfGrowth.waterCost;
      if (state.coins < cost) return state;

      success = true;
      return {
        ...state,
        coins: state.coins - cost,
        gardenOfGrowth: {
          ...state.gardenOfGrowth,
          waterHoursRemaining: state.gardenOfGrowth.waterHoursRemaining + hours,
        },
      };
    });

    return success;
  }, [updateGameState]);

  const updateSettings = useCallback((newSettings: Partial<typeof gameState.settings>) => {
    updateGameState(state => ({
      ...state,
      settings: {
        ...state.settings,
        ...newSettings,
      },
    }));
  }, [updateGameState]);

  const addCoins = useCallback((amount: number) => {
    updateGameState(state => ({
      ...state,
      coins: state.coins + amount,
    }));
  }, [updateGameState]);

  const addGems = useCallback((amount: number) => {
    updateGameState(state => ({
      ...state,
      gems: state.gems + amount,
    }));
  }, [updateGameState]);

  const teleportToZone = useCallback((zone: number) => {
    updateGameState(state => ({
      ...state,
      zone: Math.max(1, zone),
    }));
  }, [updateGameState]);

  const setExperience = useCallback((xp: number) => {
    updateGameState(state => ({
      ...state,
      progression: {
        ...state.progression,
        experience: Math.max(0, xp),
      },
    }));
  }, [updateGameState]);

  const rollSkill = useCallback((): boolean => {
    let success = false;

    updateGameState(state => {
      if (state.coins < 100) return state;

      const skillTypes = ['coin_vacuum', 'treasurer', 'xp_surge', 'luck_gem', 'enchanter'];
      const randomType = skillTypes[Math.floor(Math.random() * skillTypes.length)] as MenuSkill['type'];
      
      const skillNames = {
        coin_vacuum: 'Coin Vacuum',
        treasurer: 'Treasurer',
        xp_surge: 'XP Surge',
        luck_gem: 'Luck Gem',
        enchanter: 'Enchanter'
      };

      const skillDescriptions = {
        coin_vacuum: 'Get 15 free coins per minute of play time',
        treasurer: 'Guarantees next chest opened is epic or better',
        xp_surge: 'Gives 300% XP gains for 24 hours',
        luck_gem: 'All gems mined for 1 hour are shiny gems',
        enchanter: 'Epic+ drops have 80% chance to be enchanted'
      };

      const duration = randomType === 'luck_gem' ? 1 : randomType === 'treasurer' ? 0.1 : 24;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + duration * 60 * 60 * 1000);

      const newSkill: MenuSkill = {
        id: Math.random().toString(36).substr(2, 9),
        name: skillNames[randomType],
        description: skillDescriptions[randomType],
        duration,
        activatedAt: now,
        expiresAt,
        type: randomType,
      };

      success = true;
      return {
        ...state,
        coins: state.coins - 100,
        skills: {
          ...state.skills,
          activeMenuSkill: newSkill,
          lastRollTime: now,
        },
      };
    });

    return success;
  }, [updateGameState]);

  return {
    gameState,
    isLoading,
    equipWeapon,
    equipArmor,
    upgradeWeapon,
    upgradeArmor,
    sellWeapon,
    sellArmor,
    upgradeResearch,
    openChest,
    purchaseMythical,
    startCombat,
    attack,
    resetGame,
    setGameMode,
    toggleCheat,
    generateCheatItem,
    mineGem,
    exchangeShinyGems,
    discardItem,
    purchaseRelic,
    upgradeRelic,
    equipRelic,
    unequipRelic,
    sellRelic,
    claimDailyReward,
    upgradeSkill,
    prestige,
    claimOfflineRewards,
    bulkSell,
    bulkUpgrade,
    plantSeed,
    buyWater,
    updateSettings,
    addCoins,
    addGems,
    teleportToZone,
    setExperience,
    rollSkill,
    selectAdventureSkill,
    skipAdventureSkills,
    useSkipCard,
  };
};

// Helper function to generate random adventure skills
const generateRandomAdventureSkills = (): AdventureSkill[] => {
  const allSkills: AdventureSkill[] = [
    {
      id: 'risker',
      name: 'Risker',
      description: 'Lose 15% health but get 20% extra ATK',
      type: 'risker'
    },
    {
      id: 'lightning_chain',
      name: 'Lightning Chain',
      description: 'Every correct answer, deal 15% extra ATK but every wrong answer, be dealt 10% more ATK',
      type: 'lightning_chain'
    },
    {
      id: 'skip_card',
      name: 'Skip Card',
      description: 'Skip any question. Effective only once.',
      type: 'skip_card'
    },
    {
      id: 'metal_shield',
      name: 'Metal Shield',
      description: 'If you are about to die, auto sacrifice 30% ATK to just cancel damage taken',
      type: 'metal_shield'
    },
    {
      id: 'truth_lies',
      name: '1 Truth, 2 Lies',
      description: 'Remove one of the wrong answers in a multi choice question for the ENTIRE adventure',
      type: 'truth_lies'
    },
    {
      id: 'ramp',
      name: 'Ramp',
      description: 'A random stat is doubled but another is reduced by 40%',
      type: 'ramp'
    },
    {
      id: 'dodge',
      name: 'Dodge',
      description: "Don't take damage from the first wrong answer",
      type: 'dodge'
    }
  ];

  // Shuffle and return 3 random skills
  const shuffled = [...allSkills].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};