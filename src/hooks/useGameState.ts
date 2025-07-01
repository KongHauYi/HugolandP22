import { useState, useCallback, useEffect } from 'react';
import { GameState, PlayerStats, Inventory, Enemy, Weapon, Armor, ChestReward, Research, Achievement, CollectionBook, KnowledgeStreak, GameMode, Statistics, CheatSettings, Mining, RelicItem, PlayerTag, DailyRewards, DailyReward, ProgressionSystem, OfflineProgress, GardenOfGrowth, GameSettings } from '../types/game';
import { generateWeapon, generateArmor, generateEnemy, generateMythicalWeapon, generateMythicalArmor, calculateResearchBonus, calculateResearchCost, getChestRarityWeights, generateRelicItem } from '../utils/gameUtils';
import { checkAchievements, initializeAchievements } from '../utils/achievements';
import { checkPlayerTags, initializePlayerTags } from '../utils/playerTags';
import AsyncStorage from '../utils/storage';

const STORAGE_KEY = 'hugoland_game_state';

const initialPlayerStats: PlayerStats = {
  hp: 200,
  maxHp: 200,
  atk: 50,
  def: 0,
  baseAtk: 50,
  baseDef: 0,
  baseHp: 200,
};

const initialInventory: Inventory = {
  weapons: [],
  armor: [],
  relics: [],
  currentWeapon: null,
  currentArmor: null,
  equippedRelics: [],
};

const initialResearch: Research = {
  atk: { level: 0, totalSpent: 0 },
  def: { level: 0, totalSpent: 0 },
  hp: { level: 0, totalSpent: 0 },
};

const initialCollectionBook: CollectionBook = {
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
};

const initialKnowledgeStreak: KnowledgeStreak = {
  current: 0,
  best: 0,
  multiplier: 1,
};

const initialGameMode: GameMode = {
  current: 'normal',
  speedModeActive: false,
  survivalLives: 3,
  maxSurvivalLives: 3,
  timeAttackScore: 0,
  timeAttackTimeLeft: 60,
  bossProgress: 0,
};

const initialStatistics: Statistics = {
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
};

const initialCheats: CheatSettings = {
  infiniteCoins: false,
  infiniteGems: false,
  obtainAnyItem: false,
};

const initialMining: Mining = {
  efficiency: 1,
  tools: {
    basic_pickaxe: false,
    steel_pickaxe: false,
    diamond_pickaxe: false,
    mythical_pickaxe: false,
  },
  totalGemsMined: 0,
  totalShinyGemsMined: 0,
};

const initialDailyRewards: DailyRewards = {
  lastClaimDate: null,
  currentStreak: 0,
  maxStreak: 0,
  availableReward: null,
  rewardHistory: [],
};

const initialProgression: ProgressionSystem = {
  level: 1,
  experience: 0,
  experienceToNext: 100,
  skillPoints: 0,
  unlockedSkills: [],
  prestigeLevel: 0,
  prestigePoints: 0,
  masteryLevels: {},
};

const initialOfflineProgress: OfflineProgress = {
  lastSaveTime: new Date(),
  offlineCoins: 0,
  offlineGems: 0,
  offlineTime: 0,
  maxOfflineHours: 8,
};

const initialGardenOfGrowth: GardenOfGrowth = {
  isPlanted: false,
  plantedAt: null,
  lastWatered: null,
  waterHoursRemaining: 0,
  growthCm: 0,
  totalGrowthBonus: 0,
  seedCost: 5000,
  waterCost: 1000,
  maxGrowthCm: 100,
};

const initialSettings: GameSettings = {
  colorblindMode: false,
  darkMode: true,
  language: 'en',
  notifications: true,
};

const generateYojefMarketItems = (): RelicItem[] => {
  const items: RelicItem[] = [];
  const numItems = 3 + Math.floor(Math.random() * 3); // 3-5 items
  
  for (let i = 0; i < numItems; i++) {
    items.push(generateRelicItem());
  }
  
  return items;
};

const initialGameState: GameState = {
  coins: 100,
  gems: 0,
  shinyGems: 0,
  zone: 1,
  playerStats: initialPlayerStats,
  inventory: initialInventory,
  currentEnemy: null,
  inCombat: false,
  combatLog: [],
  research: initialResearch,
  isPremium: false,
  achievements: initializeAchievements(),
  collectionBook: initialCollectionBook,
  knowledgeStreak: initialKnowledgeStreak,
  gameMode: initialGameMode,
  statistics: initialStatistics,
  cheats: initialCheats,
  mining: initialMining,
  yojefMarket: {
    items: generateYojefMarketItems(),
    lastRefresh: new Date(),
    nextRefresh: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  },
  playerTags: initializePlayerTags(),
  dailyRewards: initialDailyRewards,
  progression: initialProgression,
  offlineProgress: initialOfflineProgress,
  gardenOfGrowth: initialGardenOfGrowth,
  settings: initialSettings,
  hasUsedRevival: false,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoading, setIsLoading] = useState(true);

  // Update play time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          totalPlayTime: prev.statistics.totalPlayTime + 1,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // AFK gem mining - 2 gems per minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        gems: prev.gems + 2,
        statistics: {
          ...prev.statistics,
          gemsEarned: prev.statistics.gemsEarned + 2,
        },
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Garden growth system
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.gardenOfGrowth.isPlanted || prev.gardenOfGrowth.waterHoursRemaining <= 0) {
          return prev;
        }

        const now = new Date();
        const lastUpdate = new Date(prev.gardenOfGrowth.lastWatered || prev.gardenOfGrowth.plantedAt || now);
        const hoursSinceLastUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastUpdate >= 1) {
          const newWaterHours = Math.max(0, prev.gardenOfGrowth.waterHoursRemaining - hoursSinceLastUpdate);
          const growthRate = 0.5; // 0.5cm per hour
          const newGrowth = Math.min(
            prev.gardenOfGrowth.growthCm + (hoursSinceLastUpdate * growthRate),
            prev.gardenOfGrowth.maxGrowthCm
          );
          const newBonus = newGrowth * 5; // 5% per cm

          return {
            ...prev,
            gardenOfGrowth: {
              ...prev.gardenOfGrowth,
              waterHoursRemaining: newWaterHours,
              growthCm: newGrowth,
              totalGrowthBonus: newBonus,
              lastWatered: now,
            },
          };
        }

        return prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Yojef Market refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = new Date();
        const nextRefresh = new Date(prev.yojefMarket.nextRefresh);
        
        if (now >= nextRefresh) {
          return {
            ...prev,
            yojefMarket: {
              items: generateYojefMarketItems(),
              lastRefresh: now,
              nextRefresh: new Date(now.getTime() + 5 * 60 * 1000),
            },
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Daily rewards check
  useEffect(() => {
    const checkDailyRewards = () => {
      setGameState(prev => {
        const now = new Date();
        const lastClaim = prev.dailyRewards.lastClaimDate ? new Date(prev.dailyRewards.lastClaimDate) : null;
        
        if (!lastClaim || now.getDate() !== lastClaim.getDate() || now.getMonth() !== lastClaim.getMonth() || now.getFullYear() !== lastClaim.getFullYear()) {
          // Check if it's been more than 24 hours since last claim
          const hoursSinceLastClaim = lastClaim ? (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60) : 25;
          
          if (hoursSinceLastClaim >= 24) {
            const newDay = prev.dailyRewards.currentStreak + 1;
            const baseCoins = 50 + (newDay * 25);
            const baseGems = 5 + Math.floor(newDay / 2);
            
            const newReward: DailyReward = {
              day: newDay,
              coins: baseCoins,
              gems: baseGems,
              special: newDay === 7 ? 'Legendary Chest' : newDay === 14 ? 'Mythical Item' : undefined,
              claimed: false
            };
            
            return {
              ...prev,
              dailyRewards: {
                ...prev.dailyRewards,
                availableReward: newReward,
              },
            };
          }
        }
        
        return prev;
      });
    };

    checkDailyRewards();
    const interval = setInterval(checkDailyRewards, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Offline progress calculation
  useEffect(() => {
    const calculateOfflineProgress = () => {
      setGameState(prev => {
        const now = new Date();
        const lastSave = new Date(prev.offlineProgress.lastSaveTime);
        const offlineTimeSeconds = Math.floor((now.getTime() - lastSave.getTime()) / 1000);
        const maxOfflineSeconds = prev.offlineProgress.maxOfflineHours * 3600;
        const actualOfflineTime = Math.min(offlineTimeSeconds, maxOfflineSeconds);
        
        if (actualOfflineTime >= 300) { // 5 minutes minimum
          const offlineHours = actualOfflineTime / 3600;
          const researchBonus = 1 + (calculateResearchBonus(prev.research.atk.level) + calculateResearchBonus(prev.research.def.level) + calculateResearchBonus(prev.research.hp.level)) / 300;
          
          const offlineCoins = Math.floor(offlineHours * 50 * researchBonus);
          const offlineGems = Math.floor(offlineHours * 5 * researchBonus);
          
          return {
            ...prev,
            offlineProgress: {
              ...prev.offlineProgress,
              lastSaveTime: now,
              offlineCoins,
              offlineGems,
              offlineTime: actualOfflineTime,
            },
          };
        }
        
        return {
          ...prev,
          offlineProgress: {
            ...prev.offlineProgress,
            lastSaveTime: now,
          },
        };
      });
    };

    calculateOfflineProgress();
  }, []);

  // Load game state from storage
  useEffect(() => {
    const loadGameState = async () => {
      setIsLoading(true);
      
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          
          // Ensure research object is properly initialized
          const research = {
            atk: {
              level: parsedState.research?.atk?.level || 0,
              totalSpent: parsedState.research?.atk?.totalSpent || 0,
            },
            def: {
              level: parsedState.research?.def?.level || 0,
              totalSpent: parsedState.research?.def?.totalSpent || 0,
            },
            hp: {
              level: parsedState.research?.hp?.level || 0,
              totalSpent: parsedState.research?.hp?.totalSpent || 0,
            },
          };
          
          // Ensure yojefMarket dates are properly converted
          const yojefMarket = parsedState.yojefMarket ? {
            items: parsedState.yojefMarket.items || generateYojefMarketItems(),
            lastRefresh: new Date(parsedState.yojefMarket.lastRefresh || Date.now()),
            nextRefresh: new Date(parsedState.yojefMarket.nextRefresh || Date.now() + 5 * 60 * 1000),
          } : {
            items: generateYojefMarketItems(),
            lastRefresh: new Date(),
            nextRefresh: new Date(Date.now() + 5 * 60 * 1000),
          };
          
          setGameState({
            ...initialGameState,
            ...parsedState,
            currentEnemy: null,
            inCombat: false,
            combatLog: [],
            achievements: parsedState.achievements || initializeAchievements(),
            collectionBook: parsedState.collectionBook || initialCollectionBook,
            knowledgeStreak: parsedState.knowledgeStreak || initialKnowledgeStreak,
            gameMode: parsedState.gameMode || initialGameMode,
            statistics: {
              ...initialStatistics,
              ...parsedState.statistics,
              sessionStartTime: new Date(),
            },
            research: research,
            isPremium: parsedState.isPremium || parsedState.zone >= 50,
            cheats: parsedState.cheats || initialCheats,
            mining: parsedState.mining || initialMining,
            yojefMarket: yojefMarket,
            playerTags: parsedState.playerTags || initializePlayerTags(),
            shinyGems: parsedState.shinyGems || 0,
            inventory: {
              ...initialInventory,
              ...parsedState.inventory,
              weapons: parsedState.inventory?.weapons || [],
              armor: parsedState.inventory?.armor || [],
              relics: parsedState.inventory?.relics || [],
              equippedRelics: parsedState.inventory?.equippedRelics || [],
            },
            dailyRewards: parsedState.dailyRewards || initialDailyRewards,
            progression: parsedState.progression || initialProgression,
            offlineProgress: {
              ...initialOfflineProgress,
              ...parsedState.offlineProgress,
              lastSaveTime: new Date(parsedState.offlineProgress?.lastSaveTime || Date.now()),
            },
            gardenOfGrowth: {
              ...initialGardenOfGrowth,
              ...parsedState.gardenOfGrowth,
              plantedAt: parsedState.gardenOfGrowth?.plantedAt ? new Date(parsedState.gardenOfGrowth.plantedAt) : null,
              lastWatered: parsedState.gardenOfGrowth?.lastWatered ? new Date(parsedState.gardenOfGrowth.lastWatered) : null,
            },
            settings: {
              ...initialSettings,
              ...parsedState.settings,
            },
            hasUsedRevival: parsedState.hasUsedRevival || false,
          });
        } else {
          setGameState({
            ...initialGameState,
            achievements: initializeAchievements(),
            statistics: {
              ...initialStatistics,
              sessionStartTime: new Date(),
            },
            playerTags: initializePlayerTags(),
          });
        }
      } catch (error) {
        console.error('Error loading game state:', error);
        setGameState({
          ...initialGameState,
          achievements: initializeAchievements(),
          statistics: {
            ...initialStatistics,
            sessionStartTime: new Date(),
          },
          playerTags: initializePlayerTags(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, []);

  // Save game state to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveGameState = async () => {
        try {
          const stateToSave = {
            ...gameState,
            currentEnemy: null,
            inCombat: false,
            combatLog: [],
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
          console.error('Error saving game state:', error);
        }
      };

      saveGameState();
    }
  }, [gameState, isLoading]);

  const updateCollectionBook = useCallback((item: Weapon | Armor) => {
    setGameState(prev => {
      const isWeapon = 'baseAtk' in item;
      const collectionKey = isWeapon ? 'weapons' : 'armor';
      const countKey = isWeapon ? 'totalWeaponsFound' : 'totalArmorFound';
      
      if (prev.collectionBook[collectionKey][item.name]) {
        return prev;
      }

      return {
        ...prev,
        collectionBook: {
          ...prev.collectionBook,
          [collectionKey]: {
            ...prev.collectionBook[collectionKey],
            [item.name]: true,
          },
          [countKey]: prev.collectionBook[countKey] + 1,
          rarityStats: {
            ...prev.collectionBook.rarityStats,
            [item.rarity]: prev.collectionBook.rarityStats[item.rarity] + 1,
          },
        },
        statistics: {
          ...prev.statistics,
          itemsCollected: prev.statistics.itemsCollected + 1,
        },
      };
    });
  }, []);

  const updateKnowledgeStreak = useCallback((correct: boolean) => {
    setGameState(prev => {
      const newCurrent = correct ? prev.knowledgeStreak.current + 1 : 0;
      const newBest = Math.max(prev.knowledgeStreak.best, newCurrent);
      const newMultiplier = Math.min(1 + Math.floor(newCurrent / 5) * 0.1, 2);

      return {
        ...prev,
        knowledgeStreak: {
          current: newCurrent,
          best: newBest,
          multiplier: newMultiplier,
          lastCorrectTime: correct ? new Date() : prev.knowledgeStreak.lastCorrectTime,
        },
        statistics: {
          ...prev.statistics,
          longestStreak: Math.max(prev.statistics.longestStreak, newCurrent),
        },
      };
    });
  }, []);

  const updateStatistics = useCallback((category: string, correct: boolean) => {
    setGameState(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        totalQuestionsAnswered: prev.statistics.totalQuestionsAnswered + 1,
        correctAnswers: prev.statistics.correctAnswers + (correct ? 1 : 0),
        accuracyByCategory: {
          ...prev.statistics.accuracyByCategory,
          [category]: {
            correct: (prev.statistics.accuracyByCategory[category]?.correct || 0) + (correct ? 1 : 0),
            total: (prev.statistics.accuracyByCategory[category]?.total || 0) + 1,
          },
        },
        averageAccuracy: prev.statistics.totalQuestionsAnswered > 0 
          ? (prev.statistics.correctAnswers + (correct ? 1 : 0)) / (prev.statistics.totalQuestionsAnswered + 1) * 100
          : 0,
      },
    }));
  }, []);

  const updateProgression = useCallback((experienceGained: number) => {
    setGameState(prev => {
      let newExperience = prev.progression.experience + experienceGained;
      let newLevel = prev.progression.level;
      let newSkillPoints = prev.progression.skillPoints;
      let experienceToNext = prev.progression.experienceToNext;

      while (newExperience >= experienceToNext) {
        newExperience -= experienceToNext;
        newLevel++;
        newSkillPoints++;
        experienceToNext = Math.floor(100 * Math.pow(1.1, newLevel - 1));
      }

      return {
        ...prev,
        progression: {
          ...prev.progression,
          level: newLevel,
          experience: newExperience,
          experienceToNext,
          skillPoints: newSkillPoints,
        },
      };
    });
  }, []);

  const checkAndUnlockAchievements = useCallback(() => {
    setGameState(prev => {
      const newUnlocks = checkAchievements(prev);
      
      if (newUnlocks.length > 0) {
        let bonusCoins = 0;
        let bonusGems = 0;
        
        newUnlocks.forEach(achievement => {
          if (achievement.reward) {
            bonusCoins += achievement.reward.coins || 0;
            bonusGems += achievement.reward.gems || 0;
          }
        });

        const updatedAchievements = prev.achievements.map(existing => {
          const newUnlock = newUnlocks.find(nu => nu.id === existing.id);
          return newUnlock || existing;
        });

        return {
          ...prev,
          coins: prev.coins + bonusCoins,
          gems: prev.gems + bonusGems,
          achievements: updatedAchievements,
        };
      }

      return prev;
    });
  }, []);

  const checkAndUnlockPlayerTags = useCallback(() => {
    setGameState(prev => {
      const newUnlocks = checkPlayerTags(prev);
      
      if (newUnlocks.length > 0) {
        const updatedTags = prev.playerTags.map(existing => {
          const newUnlock = newUnlocks.find(nu => nu.id === existing.id);
          return newUnlock || existing;
        });

        return {
          ...prev,
          playerTags: updatedTags,
        };
      }

      return prev;
    });
  }, []);

  const updatePlayerStats = useCallback(() => {
    setGameState(prev => {
      const weaponAtk = prev.inventory.currentWeapon 
        ? prev.inventory.currentWeapon.baseAtk + (prev.inventory.currentWeapon.level - 1) * 10
        : 0;
      const armorDef = prev.inventory.currentArmor 
        ? prev.inventory.currentArmor.baseDef + (prev.inventory.currentArmor.level - 1) * 5
        : 0;

      // Add relic bonuses
      let relicAtkBonus = 0;
      let relicDefBonus = 0;
      
      prev.inventory.equippedRelics.forEach(relic => {
        if (relic.type === 'weapon' && relic.baseAtk) {
          relicAtkBonus += relic.baseAtk + (relic.level - 1) * 22;
        } else if (relic.type === 'armor' && relic.baseDef) {
          relicDefBonus += relic.baseDef + (relic.level - 1) * 15;
        }
      });

      const atkResearchBonus = calculateResearchBonus(prev.research.atk.level);
      const defResearchBonus = calculateResearchBonus(prev.research.def.level);
      const hpResearchBonus = calculateResearchBonus(prev.research.hp.level);

      // Add garden bonuses
      const gardenBonus = prev.gardenOfGrowth.totalGrowthBonus;

      let atkMultiplier = 1 + (atkResearchBonus + gardenBonus) / 100;
      let defMultiplier = 1 + (defResearchBonus + gardenBonus) / 100;
      let hpMultiplier = 1 + (hpResearchBonus + gardenBonus) / 100;

      // Apply game mode modifiers
      switch (prev.gameMode.current) {
        case 'bloodlust':
          atkMultiplier *= 2;
          defMultiplier *= 0.5;
          hpMultiplier *= 0.5;
          break;
        case 'crazy':
          atkMultiplier *= 0.5;
          defMultiplier *= 0.5;
          hpMultiplier *= 0.5;
          break;
      }

      const finalAtk = Math.floor(((prev.playerStats.baseAtk + weaponAtk + relicAtkBonus) * atkMultiplier));
      const finalDef = Math.floor(((prev.playerStats.baseDef + armorDef + relicDefBonus) * defMultiplier));
      const finalMaxHp = Math.floor(prev.playerStats.baseHp * hpMultiplier);

      return {
        ...prev,
        playerStats: {
          ...prev.playerStats,
          atk: finalAtk,
          def: finalDef,
          maxHp: finalMaxHp,
          hp: Math.min(prev.playerStats.hp, finalMaxHp),
        },
      };
    });
  }, []);

  const setGameMode = useCallback((mode: 'normal' | 'blitz' | 'bloodlust' | 'crazy' | 'survival' | 'timeAttack' | 'boss') => {
    setGameState(prev => ({
      ...prev,
      gameMode: {
        ...prev.gameMode,
        current: mode,
        speedModeActive: mode === 'blitz' || mode === 'bloodlust',
        survivalLives: mode === 'survival' ? 3 : prev.gameMode.survivalLives,
        timeAttackTimeLeft: mode === 'timeAttack' ? 60 : prev.gameMode.timeAttackTimeLeft,
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const toggleCheat = useCallback((cheat: keyof CheatSettings) => {
    setGameState(prev => ({
      ...prev,
      cheats: {
        ...prev.cheats,
        [cheat]: !prev.cheats[cheat],
      },
    }));
  }, []);

  const generateCheatItem = useCallback(() => {
    console.log('Generate cheat item functionality not implemented yet');
  }, []);

  const mineGem = useCallback((x: number, y: number): { gems: number; shinyGems: number } | null => {
    const isShiny = Math.random() < 0.1;
    const gemsEarned = isShiny ? 10 : gameState.mining.efficiency;
    const shinyGemsEarned = isShiny ? 1 : 0;

    setGameState(prev => ({
      ...prev,
      gems: prev.gems + gemsEarned,
      shinyGems: prev.shinyGems + shinyGemsEarned,
      mining: {
        ...prev.mining,
        totalGemsMined: prev.mining.totalGemsMined + gemsEarned,
        totalShinyGemsMined: prev.mining.totalShinyGemsMined + shinyGemsEarned,
      },
      statistics: {
        ...prev.statistics,
        gemsEarned: prev.statistics.gemsEarned + gemsEarned,
        shinyGemsEarned: prev.statistics.shinyGemsEarned + shinyGemsEarned,
      },
    }));

    return { gems: gemsEarned, shinyGems: shinyGemsEarned };
  }, [gameState.mining.efficiency]);

  const exchangeShinyGems = useCallback((amount: number): boolean => {
    setGameState(prev => {
      if (prev.shinyGems < amount) {
        return prev;
      }

      const gemsToAdd = amount * 10;

      return {
        ...prev,
        shinyGems: prev.shinyGems - amount,
        gems: prev.gems + gemsToAdd,
        statistics: {
          ...prev.statistics,
          gemsEarned: prev.statistics.gemsEarned + gemsToAdd,
        },
      };
    });

    return true;
  }, []);

  const plantSeed = useCallback((): boolean => {
    setGameState(prev => {
      if (prev.gardenOfGrowth.isPlanted || prev.coins < prev.gardenOfGrowth.seedCost) {
        return prev;
      }

      const now = new Date();
      return {
        ...prev,
        coins: prev.coins - prev.gardenOfGrowth.seedCost,
        gardenOfGrowth: {
          ...prev.gardenOfGrowth,
          isPlanted: true,
          plantedAt: now,
          lastWatered: now,
          waterHoursRemaining: 24, // Start with 24 hours of water
        },
      };
    });

    return true;
  }, []);

  const buyWater = useCallback((hours: number): boolean => {
    const waterCosts = {
      24: 1000,
      72: 2800,
      168: 6500,
      720: 25000,
    };

    const cost = waterCosts[hours as keyof typeof waterCosts] || 1000;

    setGameState(prev => {
      if (prev.coins < cost) {
        return prev;
      }

      return {
        ...prev,
        coins: prev.coins - cost,
        gardenOfGrowth: {
          ...prev.gardenOfGrowth,
          waterHoursRemaining: prev.gardenOfGrowth.waterHoursRemaining + hours,
          lastWatered: new Date(),
        },
      };
    });

    return true;
  }, []);

  const claimDailyReward = useCallback((): boolean => {
    setGameState(prev => {
      if (!prev.dailyRewards.availableReward) return prev;

      const reward = prev.dailyRewards.availableReward;
      const now = new Date();

      return {
        ...prev,
        coins: prev.coins + reward.coins,
        gems: prev.gems + reward.gems,
        dailyRewards: {
          ...prev.dailyRewards,
          lastClaimDate: now,
          currentStreak: reward.day,
          maxStreak: Math.max(prev.dailyRewards.maxStreak, reward.day),
          availableReward: null,
          rewardHistory: [...prev.dailyRewards.rewardHistory, { ...reward, claimed: true, claimDate: now }],
        },
        statistics: {
          ...prev.statistics,
          coinsEarned: prev.statistics.coinsEarned + reward.coins,
          gemsEarned: prev.statistics.gemsEarned + reward.gems,
        },
      };
    });

    return true;
  }, []);

  const upgradeSkill = useCallback((skillId: string): boolean => {
    setGameState(prev => {
      const skillCosts = {
        combat_mastery: 1,
        knowledge_boost: 2,
        treasure_hunter: 2,
        durability_expert: 3,
        streak_master: 3,
        health_regeneration: 4,
      };

      const cost = skillCosts[skillId as keyof typeof skillCosts] || 1;
      
      if (prev.progression.skillPoints < cost) return prev;

      return {
        ...prev,
        progression: {
          ...prev.progression,
          skillPoints: prev.progression.skillPoints - cost,
          unlockedSkills: [...prev.progression.unlockedSkills, skillId],
        },
      };
    });

    return true;
  }, []);

  const prestige = useCallback((): boolean => {
    setGameState(prev => {
      if (prev.progression.level < 50) return prev;

      const prestigePoints = Math.floor(prev.progression.level / 10);

      return {
        ...prev,
        progression: {
          ...initialProgression,
          prestigeLevel: prev.progression.prestigeLevel + 1,
          prestigePoints: prev.progression.prestigePoints + prestigePoints,
        },
      };
    });

    return true;
  }, []);

  const claimOfflineRewards = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + prev.offlineProgress.offlineCoins,
      gems: prev.gems + prev.offlineProgress.offlineGems,
      statistics: {
        ...prev.statistics,
        coinsEarned: prev.statistics.coinsEarned + prev.offlineProgress.offlineCoins,
        gemsEarned: prev.statistics.gemsEarned + prev.offlineProgress.offlineGems,
      },
      offlineProgress: {
        ...prev.offlineProgress,
        offlineCoins: 0,
        offlineGems: 0,
        offlineTime: 0,
      },
    }));
  }, []);

  const bulkSell = useCallback((itemIds: string[], type: 'weapon' | 'armor') => {
    setGameState(prev => {
      const items = type === 'weapon' ? prev.inventory.weapons : prev.inventory.armor;
      const selectedItems = items.filter(item => itemIds.includes(item.id));
      const totalValue = selectedItems.reduce((sum, item) => sum + item.sellPrice, 0);

      return {
        ...prev,
        coins: prev.coins + totalValue,
        inventory: {
          ...prev.inventory,
          weapons: type === 'weapon' 
            ? prev.inventory.weapons.filter(w => !itemIds.includes(w.id))
            : prev.inventory.weapons,
          armor: type === 'armor'
            ? prev.inventory.armor.filter(a => !itemIds.includes(a.id))
            : prev.inventory.armor,
        },
        statistics: {
          ...prev.statistics,
          itemsSold: prev.statistics.itemsSold + selectedItems.length,
        },
      };
    });
  }, []);

  const bulkUpgrade = useCallback((itemIds: string[], type: 'weapon' | 'armor') => {
    setGameState(prev => {
      const items = type === 'weapon' ? prev.inventory.weapons : prev.inventory.armor;
      const selectedItems = items.filter(item => itemIds.includes(item.id));
      const totalCost = selectedItems.reduce((sum, item) => sum + item.upgradeCost, 0);

      if (prev.gems < totalCost) return prev;

      const updatedItems = items.map(item => {
        if (itemIds.includes(item.id)) {
          return {
            ...item,
            level: item.level + 1,
            upgradeCost: Math.floor(item.upgradeCost * 1.5),
            sellPrice: Math.floor(item.sellPrice * 1.2),
          };
        }
        return item;
      });

      return {
        ...prev,
        gems: prev.gems - totalCost,
        inventory: {
          ...prev.inventory,
          weapons: type === 'weapon' ? updatedItems as Weapon[] : prev.inventory.weapons,
          armor: type === 'armor' ? updatedItems as Armor[] : prev.inventory.armor,
          currentWeapon: type === 'weapon' && prev.inventory.currentWeapon && itemIds.includes(prev.inventory.currentWeapon.id)
            ? updatedItems.find(w => w.id === prev.inventory.currentWeapon?.id) as Weapon || null
            : prev.inventory.currentWeapon,
          currentArmor: type === 'armor' && prev.inventory.currentArmor && itemIds.includes(prev.inventory.currentArmor.id)
            ? updatedItems.find(a => a.id === prev.inventory.currentArmor?.id) as Armor || null
            : prev.inventory.currentArmor,
        },
        statistics: {
          ...prev.statistics,
          itemsUpgraded: prev.statistics.itemsUpgraded + selectedItems.length,
        },
      };
    });
    updatePlayerStats();
  }, [updatePlayerStats]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setGameState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  }, []);

  const discardItem = useCallback((itemId: string, type: 'weapon' | 'armor') => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        weapons: type === 'weapon' 
          ? prev.inventory.weapons.filter(w => w.id !== itemId)
          : prev.inventory.weapons,
        armor: type === 'armor'
          ? prev.inventory.armor.filter(a => a.id !== itemId)
          : prev.inventory.armor,
      },
    }));
  }, []);

  const purchaseRelic = useCallback((relicId: string): boolean => {
    setGameState(prev => {
      const relic = prev.yojefMarket.items.find(r => r.id === relicId);
      if (!relic || prev.gems < relic.cost || prev.inventory.equippedRelics.length >= 5) {
        return prev;
      }

      return {
        ...prev,
        gems: prev.gems - relic.cost,
        inventory: {
          ...prev.inventory,
          relics: [...prev.inventory.relics, relic],
          equippedRelics: [...prev.inventory.equippedRelics, relic],
        },
        yojefMarket: {
          ...prev.yojefMarket,
          items: prev.yojefMarket.items.filter(r => r.id !== relicId),
        },
      };
    });

    return true;
  }, []);

  const upgradeRelic = useCallback((relicId: string) => {
    setGameState(prev => {
      const relic = prev.inventory.relics.find(r => r.id === relicId);
      if (!relic || prev.gems < relic.upgradeCost) return prev;

      const updatedRelics = prev.inventory.relics.map(r =>
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

      const updatedEquippedRelics = prev.inventory.equippedRelics.map(r =>
        r.id === relicId ? updatedRelics.find(ur => ur.id === relicId)! : r
      );

      return {
        ...prev,
        gems: prev.gems - relic.upgradeCost,
        inventory: {
          ...prev.inventory,
          relics: updatedRelics,
          equippedRelics: updatedEquippedRelics,
        },
      };
    });
    updatePlayerStats();
  }, [updatePlayerStats]);

  const equipRelic = useCallback((relicId: string) => {
    setGameState(prev => {
      const relic = prev.inventory.relics.find(r => r.id === relicId);
      if (!relic || prev.inventory.equippedRelics.length >= 5 || 
          prev.inventory.equippedRelics.some(r => r.id === relicId)) {
        return prev;
      }

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          equippedRelics: [...prev.inventory.equippedRelics, relic],
        },
      };
    });
    updatePlayerStats();
  }, [updatePlayerStats]);

  const unequipRelic = useCallback((relicId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        equippedRelics: prev.inventory.equippedRelics.filter(r => r.id !== relicId),
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const sellRelic = useCallback((relicId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        relics: prev.inventory.relics.filter(r => r.id !== relicId),
        equippedRelics: prev.inventory.equippedRelics.filter(r => r.id !== relicId),
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const equipWeapon = useCallback((weapon: Weapon) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentWeapon: weapon,
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const equipArmor = useCallback((armor: Armor) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentArmor: armor,
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const upgradeWeapon = useCallback((weaponId: string) => {
    setGameState(prev => {
      const weapon = prev.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || (prev.gems < weapon.upgradeCost && !prev.cheats.infiniteGems)) return prev;

      const updatedWeapons = prev.inventory.weapons.map(w =>
        w.id === weaponId
          ? { ...w, level: w.level + 1, upgradeCost: Math.floor(w.upgradeCost * 1.5), sellPrice: Math.floor(w.sellPrice * 1.2) }
          : w
      );

      const updatedCurrentWeapon = prev.inventory.currentWeapon?.id === weaponId
        ? updatedWeapons.find(w => w.id === weaponId) || null
        : prev.inventory.currentWeapon;

      return {
        ...prev,
        gems: prev.cheats.infiniteGems ? prev.gems : prev.gems - weapon.upgradeCost,
        inventory: {
          ...prev.inventory,
          weapons: updatedWeapons,
          currentWeapon: updatedCurrentWeapon,
        },
        statistics: {
          ...prev.statistics,
          itemsUpgraded: prev.statistics.itemsUpgraded + 1,
        },
      };
    });
    updatePlayerStats();
  }, [updatePlayerStats]);

  const upgradeArmor = useCallback((armorId: string) => {
    setGameState(prev => {
      const armor = prev.inventory.armor.find(a => a.id === armorId);
      if (!armor || (prev.gems < armor.upgradeCost && !prev.cheats.infiniteGems)) return prev;

      const updatedArmor = prev.inventory.armor.map(a =>
        a.id === armorId
          ? { ...a, level: a.level + 1, upgradeCost: Math.floor(a.upgradeCost * 1.5), sellPrice: Math.floor(a.sellPrice * 1.2) }
          : a
      );

      const updatedCurrentArmor = prev.inventory.currentArmor?.id === armorId
        ? updatedArmor.find(a => a.id === armorId) || null
        : prev.inventory.currentArmor;

      return {
        ...prev,
        gems: prev.cheats.infiniteGems ? prev.gems : prev.gems - armor.upgradeCost,
        inventory: {
          ...prev.inventory,
          armor: updatedArmor,
          currentArmor: updatedCurrentArmor,
        },
        statistics: {
          ...prev.statistics,
          itemsUpgraded: prev.statistics.itemsUpgraded + 1,
        },
      };
    });
    updatePlayerStats();
  }, [updatePlayerStats]);

  const sellWeapon = useCallback((weaponId: string) => {
    setGameState(prev => {
      const weapon = prev.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || prev.inventory.currentWeapon?.id === weaponId) return prev;

      return {
        ...prev,
        coins: prev.coins + weapon.sellPrice,
        inventory: {
          ...prev.inventory,
          weapons: prev.inventory.weapons.filter(w => w.id !== weaponId),
        },
        statistics: {
          ...prev.statistics,
          itemsSold: prev.statistics.itemsSold + 1,
        },
      };
    });
  }, []);

  const sellArmor = useCallback((armorId: string) => {
    setGameState(prev => {
      const armor = prev.inventory.armor.find(a => a.id === armorId);
      if (!armor || prev.inventory.currentArmor?.id === armorId) return prev;

      return {
        ...prev,
        coins: prev.coins + armor.sellPrice,
        inventory: {
          ...prev.inventory,
          armor: prev.inventory.armor.filter(a => a.id !== armorId),
        },
        statistics: {
          ...prev.statistics,
          itemsSold: prev.statistics.itemsSold + 1,
        },
      };
    });
  }, []);

  const upgradeResearch = useCallback((type: 'atk' | 'def' | 'hp') => {
    const researchCost = calculateResearchCost(gameState.research[type].level);
    setGameState(prev => {
      if (prev.coins < researchCost && !prev.cheats.infiniteCoins) return prev;

      const newLevel = prev.research[type].level + 1;

      return {
        ...prev,
        coins: prev.cheats.infiniteCoins ? prev.coins : prev.coins - researchCost,
        research: {
          ...prev.research,
          [type]: {
            level: newLevel,
            totalSpent: prev.research[type].totalSpent + researchCost,
          },
        },
        statistics: {
          ...prev.statistics,
          totalResearchSpent: prev.statistics.totalResearchSpent + researchCost,
        },
      };
    });
    updatePlayerStats();
    checkAndUnlockAchievements();
  }, [gameState.research, updatePlayerStats, checkAndUnlockAchievements]);

  const openChest = useCallback((chestCost: number): ChestReward | null => {
    if (gameState.coins < chestCost && !gameState.cheats.infiniteCoins) return null;

    const numItems = Math.floor(Math.random() * 3) + 2;
    const bonusGems = Math.floor(Math.random() * 15) + 10;
    const items: (Weapon | Armor)[] = [];

    // Get rarity weights based on chest cost
    const rarityWeights = getChestRarityWeights(chestCost);
    const rarities = ['common', 'rare', 'epic', 'legendary', 'mythical'];

    for (let i = 0; i < numItems; i++) {
      const isWeapon = Math.random() < 0.5;
      
      // Select rarity based on weights
      const random = Math.random() * 100;
      let cumulative = 0;
      let selectedRarity = 'common';
      
      for (let j = 0; j < rarityWeights.length; j++) {
        cumulative += rarityWeights[j];
        if (random <= cumulative) {
          selectedRarity = rarities[j];
          break;
        }
      }
      
      // 5% chance for enchanted items
      const isEnchanted = Math.random() < 0.05;
      
      const item = isWeapon ? generateWeapon(false, selectedRarity, isEnchanted) : generateArmor(false, selectedRarity, isEnchanted);
      items.push(item);
      updateCollectionBook(item);
    }

    const chestReward: ChestReward = {
      type: Math.random() < 0.5 ? 'weapon' : 'armor',
      items,
    };

    const streakMultiplier = gameState.knowledgeStreak.multiplier;
    const finalBonusGems = Math.floor(bonusGems * streakMultiplier);

    setGameState(prev => ({
      ...prev,
      coins: prev.cheats.infiniteCoins ? prev.coins : prev.coins - chestCost,
      gems: prev.gems + finalBonusGems,
      inventory: {
        ...prev.inventory,
        weapons: [...prev.inventory.weapons, ...items.filter(item => 'baseAtk' in item) as Weapon[]],
        armor: [...prev.inventory.armor, ...items.filter(item => 'baseDef' in item) as Armor[]],
      },
      statistics: {
        ...prev.statistics,
        chestsOpened: prev.statistics.chestsOpened + 1,
        gemsEarned: prev.statistics.gemsEarned + finalBonusGems,
      },
    }));

    checkAndUnlockAchievements();

    return chestReward;
  }, [gameState.coins, gameState.knowledgeStreak.multiplier, gameState.cheats.infiniteCoins, updateCollectionBook, checkAndUnlockAchievements]);

  const purchaseMythical = useCallback((): { item: Weapon | Armor; type: 'weapon' | 'armor' } | null => {
    const MYTHICAL_COST = 50000;
    if (gameState.coins < MYTHICAL_COST && !gameState.cheats.infiniteCoins) return null;

    const isWeapon = Math.random() < 0.5;
    const item = isWeapon ? generateMythicalWeapon() : generateMythicalArmor();
    const type = isWeapon ? 'weapon' : 'armor';

    updateCollectionBook(item);

    setGameState(prev => ({
      ...prev,
      coins: prev.cheats.infiniteCoins ? prev.coins : prev.coins - MYTHICAL_COST,
      inventory: {
        ...prev.inventory,
        weapons: isWeapon ? [...prev.inventory.weapons, item as Weapon] : prev.inventory.weapons,
        armor: !isWeapon ? [...prev.inventory.armor, item as Armor] : prev.inventory.armor,
      },
      statistics: {
        ...prev.statistics,
        itemsCollected: prev.statistics.itemsCollected + 1,
      },
    }));

    checkAndUnlockAchievements();

    return { item, type };
  }, [gameState.coins, gameState.cheats.infiniteCoins, updateCollectionBook, checkAndUnlockAchievements]);

  const startCombat = useCallback(() => {
    let enemy = generateEnemy(gameState.zone);
    
    if (gameState.gameMode.current === 'crazy') {
      enemy = {
        ...enemy,
        hp: enemy.hp * 3,
        maxHp: enemy.maxHp * 3,
        atk: enemy.atk * 3,
        def: enemy.def * 2,
      };
    }
    
    setGameState(prev => ({
      ...prev,
      currentEnemy: enemy,
      inCombat: true,
      playerStats: { 
        ...prev.playerStats, 
        hp: prev.playerStats.maxHp
      },
      combatLog: [`You encounter a ${enemy.name} in Zone ${enemy.zone}!`],
    }));
  }, [gameState.zone, gameState.gameMode.current]);

  const attack = useCallback((hit: boolean, category?: string) => {
    setGameState(prev => {
      if (!prev.currentEnemy || !prev.inCombat) return prev;

      if (category) {
        updateStatistics(category, hit);
      }
      updateKnowledgeStreak(hit);

      // Award experience for answering questions
      const experienceGained = hit ? 10 : 5;
      updateProgression(experienceGained);

      let newCombatLog = [...prev.combatLog];
      let newPlayerHp = prev.playerStats.hp;
      let newEnemyHp = prev.currentEnemy.hp;
      let combatEnded = false;
      let playerWon = false;

      if (hit) {
        let baseDamage = Math.max(1, prev.playerStats.atk - prev.currentEnemy.def);
        let finalDamage = baseDamage;

        // Reduce durability of equipped items
        const updatedInventory = { ...prev.inventory };
        if (updatedInventory.currentWeapon && updatedInventory.currentWeapon.durability > 0) {
          updatedInventory.currentWeapon = {
            ...updatedInventory.currentWeapon,
            durability: Math.max(0, updatedInventory.currentWeapon.durability - 1)
          };
          updatedInventory.weapons = updatedInventory.weapons.map(w => 
            w.id === updatedInventory.currentWeapon?.id ? updatedInventory.currentWeapon : w
          );
        }
        if (updatedInventory.currentArmor && updatedInventory.currentArmor.durability > 0) {
          updatedInventory.currentArmor = {
            ...updatedInventory.currentArmor,
            durability: Math.max(0, updatedInventory.currentArmor.durability - 1)
          };
          updatedInventory.armor = updatedInventory.armor.map(a => 
            a.id === updatedInventory.currentArmor?.id ? updatedInventory.currentArmor : a
          );
        }

        newEnemyHp = Math.max(0, prev.currentEnemy.hp - finalDamage);
        newCombatLog.push(`You deal ${finalDamage} damage to the ${prev.currentEnemy.name}!`);
        
        // Check if enemy is defeated
        if (newEnemyHp <= 0) {
          combatEnded = true;
          playerWon = true;
          newCombatLog.push(`You defeated the ${prev.currentEnemy.name}!`);
          
          // Handle victory rewards
          let coinMultiplier = 1;
          let gemMultiplier = 1;
          
          switch (prev.gameMode.current) {
            case 'blitz':
              coinMultiplier = 1.25;
              gemMultiplier = 1.1;
              break;
            case 'crazy':
              coinMultiplier = 6;
              gemMultiplier = 6;
              break;
          }

          coinMultiplier *= prev.knowledgeStreak.multiplier;
          gemMultiplier *= prev.knowledgeStreak.multiplier;

          const baseCoins = prev.zone * 8 + Math.floor(Math.random() * 15);
          const baseGems = Math.floor(Math.random() * 3) + 1;
          
          const coinsEarned = Math.floor(baseCoins * coinMultiplier);
          const gemsEarned = Math.floor(baseGems * gemMultiplier);
          
          newCombatLog.push(`You earned ${coinsEarned} coins and ${gemsEarned} gems!`);
          
          // Check for item drops from zone 10+
          let droppedItems: (Weapon | Armor)[] = [];
          if (prev.currentEnemy.canDropItems && Math.random() < 0.15) { // 15% drop chance
            const isWeapon = Math.random() < 0.5;
            const droppedItem = isWeapon ? generateWeapon() : generateArmor();
            droppedItems.push(droppedItem);
            newCombatLog.push(`The ${prev.currentEnemy.name} dropped a ${droppedItem.name}!`);
            updateCollectionBook(droppedItem);
          }
          
          const newZone = prev.zone + 1;
          const newIsPremium = newZone >= 50;
          
          return {
            ...prev,
            coins: prev.coins + coinsEarned,
            gems: prev.gems + gemsEarned,
            zone: newZone,
            isPremium: newIsPremium,
            currentEnemy: null,
            inCombat: false,
            combatLog: newCombatLog,
            inventory: {
              ...updatedInventory,
              weapons: [...updatedInventory.weapons, ...droppedItems.filter(item => 'baseAtk' in item) as Weapon[]],
              armor: [...updatedInventory.armor, ...droppedItems.filter(item => 'baseDef' in item) as Armor[]],
            },
            statistics: {
              ...prev.statistics,
              zonesReached: Math.max(prev.statistics.zonesReached, newZone),
              coinsEarned: prev.statistics.coinsEarned + coinsEarned,
              gemsEarned: prev.statistics.gemsEarned + gemsEarned,
              totalVictories: prev.statistics.totalVictories + 1,
              totalDamageDealt: prev.statistics.totalDamageDealt + finalDamage,
            },
          };
        }

        return {
          ...prev,
          currentEnemy: { ...prev.currentEnemy, hp: newEnemyHp },
          playerStats: { ...prev.playerStats, hp: newPlayerHp },
          combatLog: newCombatLog,
          inventory: updatedInventory,
          statistics: {
            ...prev.statistics,
            totalDamageDealt: prev.statistics.totalDamageDealt + finalDamage,
          },
        };
      } else {
        const damage = Math.max(1, prev.currentEnemy.atk - prev.playerStats.def);
        newPlayerHp = Math.max(0, prev.playerStats.hp - damage);
        newCombatLog.push(`You missed! The ${prev.currentEnemy.name} deals ${damage} damage to you!`);
        
        if (newPlayerHp <= 0) {
          // Check for revival
          if (!prev.hasUsedRevival) {
            newPlayerHp = Math.floor(prev.playerStats.maxHp * 0.5); // Revive with 50% HP
            newCombatLog.push(`💖 You used your free revival! You're back with ${newPlayerHp} HP!`);
            
            return {
              ...prev,
              playerStats: { ...prev.playerStats, hp: newPlayerHp },
              combatLog: newCombatLog,
              hasUsedRevival: true,
              statistics: {
                ...prev.statistics,
                totalDamageTaken: prev.statistics.totalDamageTaken + damage,
                revivals: prev.statistics.revivals + 1,
              },
            };
          }
          
          combatEnded = true;
          playerWon = false;
          newCombatLog.push(`You were defeated by the ${prev.currentEnemy.name}...`);
          
          // Handle survival mode
          if (prev.gameMode.current === 'survival') {
            const newLives = prev.gameMode.survivalLives - 1;
            return {
              ...prev,
              currentEnemy: null,
              inCombat: false,
              combatLog: newCombatLog,
              playerStats: { ...prev.playerStats, hp: newPlayerHp },
              gameMode: {
                ...prev.gameMode,
                survivalLives: newLives,
              },
              statistics: {
                ...prev.statistics,
                totalDeaths: prev.statistics.totalDeaths + 1,
                totalDamageTaken: prev.statistics.totalDamageTaken + damage,
              },
            };
          }
          
          return {
            ...prev,
            currentEnemy: null,
            inCombat: false,
            combatLog: newCombatLog,
            playerStats: { ...prev.playerStats, hp: newPlayerHp },
            statistics: {
              ...prev.statistics,
              totalDeaths: prev.statistics.totalDeaths + 1,
              totalDamageTaken: prev.statistics.totalDamageTaken + damage,
            },
          };
        }

        return {
          ...prev,
          currentEnemy: { ...prev.currentEnemy, hp: newEnemyHp },
          playerStats: { ...prev.playerStats, hp: newPlayerHp },
          combatLog: newCombatLog,
          statistics: {
            ...prev.statistics,
            totalDamageTaken: prev.statistics.totalDamageTaken + damage,
          },
        };
      }
    });

    setTimeout(() => {
      checkAndUnlockAchievements();
      checkAndUnlockPlayerTags();
    }, 100);
  }, [updateStatistics, updateKnowledgeStreak, updateProgression, checkAndUnlockAchievements, checkAndUnlockPlayerTags, updateCollectionBook]);

  const resetGame = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      
      setGameState({
        ...initialGameState,
        achievements: initializeAchievements(),
        statistics: {
          ...initialStatistics,
          sessionStartTime: new Date(),
        },
        playerTags: initializePlayerTags(),
      });
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  }, []);

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
    checkAndUnlockAchievements,
    mineGem,
    exchangeShinyGems,
    discardItem,
    purchaseRelic,
    upgradeRelic,
    equipRelic,
    unequipRelic,
    sellRelic,
    plantSeed,
    buyWater,
    claimDailyReward,
    upgradeSkill,
    prestige,
    claimOfflineRewards,
    bulkSell,
    bulkUpgrade,
    updateSettings,
  };
};