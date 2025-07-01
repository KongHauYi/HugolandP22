import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Combat } from './components/Combat';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { PlayerStats } from './components/PlayerStats';
import { Research } from './components/Research';
import { CollectionBook } from './components/CollectionBook';
import { EnhancedGameModes } from './components/EnhancedGameModes';
import { PokyegMarket } from './components/PokyegMarket';
import { Tutorial } from './components/Tutorial';
import { CheatPanel } from './components/CheatPanel';
import { Mining } from './components/Mining';
import { YojefMarket } from './components/YojefMarket';
import { FloatingIcons } from './components/FloatingIcons';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { DailyRewards } from './components/DailyRewards';
import { OfflineProgress } from './components/OfflineProgress';
import { BulkActions } from './components/BulkActions';
import { HamburgerMenuPage } from './components/HamburgerMenuPage';
import { Shield, Package, User, Play, RotateCcw, Brain, Crown, Gift, Pickaxe, Package2, Menu, ArrowLeft } from 'lucide-react';

type GameView = 'stats' | 'shop' | 'inventory' | 'research' | 'mining' | 'menu';
type ModalView = 'collection' | 'gameMode' | 'pokyegMarket' | 'tutorial' | 'cheats' | 'resetConfirm' | 'yojefMarket' | 'dailyRewards' | 'offlineProgress' | 'bulkActions' | null;

function App() {
  const {
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
  } = useGameState();

  const [currentView, setCurrentView] = useState<GameView>('stats');
  const [currentModal, setCurrentModal] = useState<ModalView>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 sm:w-12 sm:h-12 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-lg sm:text-xl font-semibold">Loading Hugoland...</p>
        </div>
      </div>
    );
  }

  // ONLY show modals if NOT in combat
  if (!gameState.inCombat) {
    // Show offline progress modal if there are rewards
    if (gameState.offlineProgress.offlineCoins > 0 || gameState.offlineProgress.offlineGems > 0) {
      if (currentModal !== 'offlineProgress') {
        setCurrentModal('offlineProgress');
      }
    }
    // Show daily rewards modal if available (only after offline progress is handled)
    else if (gameState.dailyRewards.availableReward && currentModal !== 'dailyRewards') {
      setCurrentModal('dailyRewards');
    }
  }

  // Show welcome screen for new players
  if (showWelcome && gameState.zone === 1 && gameState.coins === 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <FloatingIcons />
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">🏰 Welcome to Hugoland! 🗡️</h1>
            <p className="text-purple-300 text-base sm:text-lg mb-4 sm:mb-6">
              The ultimate fantasy adventure game where knowledge is your greatest weapon!
            </p>
            <div className="bg-black/30 p-3 sm:p-4 rounded-lg border border-purple-500/50 mb-4 sm:mb-6">
              <h3 className="text-white font-bold mb-2 text-sm sm:text-base">🎮 What awaits you:</h3>
              <ul className="text-purple-200 text-xs sm:text-sm space-y-1">
                <li>• Answer trivia questions to defeat enemies</li>
                <li>• Collect powerful weapons and armor</li>
                <li>• Mine gems and find rare shiny gems</li>
                <li>• Unlock achievements and build knowledge streaks</li>
                <li>• Explore multiple game modes and challenges</li>
                <li>• Progress through infinite zones of adventure</li>
                <li>• Discover ancient relics in the Yojef Market</li>
                <li>• Level up and unlock powerful skills</li>
                <li>• Earn daily rewards and offline progress</li>
                <li>• Grow plants in the Garden of Growth</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => setShowWelcome(false)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 flex items-center gap-3 justify-center text-base sm:text-lg"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            Start Your Adventure
          </button>
          
          <p className="text-gray-400 text-xs sm:text-sm mt-4">
            Begin your journey in the magical world of Hugoland
          </p>
        </div>
      </div>
    );
  }

  const handleResetGame = () => {
    setCurrentModal('resetConfirm');
  };

  const confirmReset = () => {
    resetGame();
    setCurrentModal(null);
  };

  const renderCurrentView = () => {
    if (gameState.inCombat && gameState.currentEnemy) {
      return (
        <Combat
          enemy={gameState.currentEnemy}
          playerStats={gameState.playerStats}
          onAttack={attack}
          combatLog={gameState.combatLog}
          gameMode={gameState.gameMode}
          knowledgeStreak={gameState.knowledgeStreak}
        />
      );
    }

    switch (currentView) {
      case 'menu':
        return (
          <HamburgerMenuPage
            gameState={gameState}
            onPlantSeed={plantSeed}
            onBuyWater={buyWater}
            onUpgradeSkill={upgradeSkill}
            onPrestige={prestige}
            onUpdateSettings={updateSettings}
            onAddCoins={addCoins}
            onAddGems={addGems}
            onTeleportToZone={teleportToZone}
            onSetExperience={setExperience}
            onBack={() => setCurrentView('stats')}
          />
        );
      case 'stats':
        return (
          <div className="space-y-4 sm:space-y-6">
            <PlayerStats
              playerStats={gameState.playerStats}
              zone={gameState.zone}
              coins={gameState.coins}
              gems={gameState.gems}
              shinyGems={gameState.shinyGems}
              playerTags={gameState.playerTags}
              progression={gameState.progression}
            />

            {/* Garden Status */}
            {gameState.gardenOfGrowth.isPlanted && (
              <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-3 sm:p-4 rounded-lg border border-green-500/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-sm sm:text-base">Garden of Growth</h3>
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 font-bold text-sm">
                    {gameState.gardenOfGrowth.growthCm.toFixed(1)}cm
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((gameState.gardenOfGrowth.growthCm / gameState.gardenOfGrowth.maxGrowthCm) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      +{gameState.gardenOfGrowth.totalGrowthBonus.toFixed(1)}% all stats
                    </p>
                  </div>
                  <span className="text-blue-400 font-semibold text-sm">
                    {gameState.gardenOfGrowth.waterHoursRemaining.toFixed(1)}h water
                  </span>
                </div>
              </div>
            )}
            
            {/* Knowledge Streak Display */}
            {gameState.knowledgeStreak.current > 0 && (
              <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-3 sm:p-4 rounded-lg border border-yellow-500/50">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl sm:text-2xl">🔥</span>
                    <h3 className="text-yellow-400 font-bold text-sm sm:text-lg">Knowledge Streak!</h3>
                  </div>
                  <p className="text-white text-xs sm:text-sm">
                    {gameState.knowledgeStreak.current} correct answers in a row
                  </p>
                  <p className="text-yellow-300 text-xs sm:text-sm">
                    +{Math.round((gameState.knowledgeStreak.multiplier - 1) * 100)}% reward bonus
                  </p>
                </div>
              </div>
            )}

            <div className="text-center space-y-3 sm:space-y-4">
              <button
                onClick={startCombat}
                disabled={gameState.playerStats.hp <= 0 || (gameState.gameMode.current === 'survival' && gameState.gameMode.survivalLives <= 0)}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-white transition-all duration-200 transform flex items-center gap-3 justify-center text-sm sm:text-base ${
                  gameState.playerStats.hp > 0 && (gameState.gameMode.current !== 'survival' || gameState.gameMode.survivalLives > 0)
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 hover:scale-105 shadow-lg hover:shadow-green-500/25'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                {gameState.playerStats.hp <= 0 
                  ? 'You are defeated!' 
                  : gameState.gameMode.current === 'survival' && gameState.gameMode.survivalLives <= 0
                    ? 'No lives remaining!'
                    : 'Start Adventure'}
              </button>
              
              {(gameState.playerStats.hp <= 0 || (gameState.gameMode.current === 'survival' && gameState.gameMode.survivalLives <= 0)) && (
                <p className="text-red-400 mt-2 text-xs sm:text-sm">
                  {gameState.gameMode.current === 'survival' && gameState.gameMode.survivalLives <= 0
                    ? 'Change game mode or reset to continue!'
                    : 'Visit the shop to get better equipment and try again!'}
                </p>
              )}
              
              {gameState.isPremium && (
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-white font-bold text-xs sm:text-sm">🎉 PREMIUM MEMBER UNLOCKED! 🎉</span>
                  </div>
                  <p className="text-yellow-100 text-xs mt-1">
                    You've reached Zone 50! Enjoy exclusive rewards and special features!
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setCurrentModal('gameMode')}
                  className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-all duration-200 flex items-center gap-2 justify-center text-xs sm:text-sm"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  Game Mode
                </button>
                
                <button
                  onClick={() => setCurrentModal('dailyRewards')}
                  className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-200 flex items-center gap-2 justify-center text-xs sm:text-sm"
                >
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                  Daily Rewards
                </button>
                
                <button
                  onClick={handleResetGame}
                  className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-200 flex items-center gap-2 justify-center text-xs sm:text-sm"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        );
      case 'shop':
        return <Shop coins={gameState.coins} onOpenChest={openChest} onDiscardItem={discardItem} isPremium={gameState.isPremium} />;
      case 'inventory':
        return (
          <Inventory
            inventory={gameState.inventory}
            gems={gameState.gems}
            onEquipWeapon={equipWeapon}
            onEquipArmor={equipArmor}
            onUpgradeWeapon={upgradeWeapon}
            onUpgradeArmor={upgradeArmor}
            onSellWeapon={sellWeapon}
            onSellArmor={sellArmor}
            onUpgradeRelic={upgradeRelic}
            onEquipRelic={equipRelic}
            onUnequipRelic={unequipRelic}
            onSellRelic={sellRelic}
            onOpenYojefMarket={() => setCurrentModal('yojefMarket')}
          />
        );
      case 'research':
        return (
          <Research
            research={gameState.research}
            coins={gameState.coins}
            onUpgradeResearch={upgradeResearch}
            isPremium={gameState.isPremium}
          />
        );
      case 'mining':
        return (
          <Mining
            mining={gameState.mining}
            gems={gameState.gems}
            shinyGems={gameState.shinyGems}
            onMineGem={mineGem}
            onExchangeShinyGems={exchangeShinyGems}
          />
        );
      default:
        return null;
    }
  };

  const renderModal = () => {
    // Don't show any modals during combat except for reset confirmation
    if (gameState.inCombat && currentModal !== 'resetConfirm') {
      return null;
    }

    switch (currentModal) {
      case 'collection':
        return (
          <CollectionBook
            collectionBook={gameState.collectionBook}
            allWeapons={gameState.inventory.weapons}
            allArmor={gameState.inventory.armor}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'gameMode':
        return (
          <EnhancedGameModes
            currentMode={gameState.gameMode}
            onSelectMode={setGameMode}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'pokyegMarket':
        return (
          <PokyegMarket
            coins={gameState.coins}
            onPurchaseMythical={purchaseMythical}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'tutorial':
        return (
          <Tutorial
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'cheats':
        return (
          <CheatPanel
            cheats={gameState.cheats}
            onToggleCheat={toggleCheat}
            onGenerateItem={generateCheatItem}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'yojefMarket':
        return (
          <YojefMarket
            relicItems={gameState.yojefMarket.items}
            gems={gameState.gems}
            equippedRelicsCount={gameState.inventory.equippedRelics.length}
            onPurchaseRelic={purchaseRelic}
            onClose={() => setCurrentModal(null)}
            nextRefresh={gameState.yojefMarket.nextRefresh}
          />
        );
      case 'dailyRewards':
        return (
          <DailyRewards
            dailyRewards={gameState.dailyRewards}
            onClaimReward={claimDailyReward}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'offlineProgress':
        return (
          <OfflineProgress
            offlineProgress={gameState.offlineProgress}
            onClaimOfflineRewards={claimOfflineRewards}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'bulkActions':
        return (
          <BulkActions
            weapons={gameState.inventory.weapons}
            armor={gameState.inventory.armor}
            gems={gameState.gems}
            onBulkSell={bulkSell}
            onBulkUpgrade={bulkUpgrade}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'resetConfirm':
        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-red-900 to-gray-900 p-6 rounded-lg border border-red-500/50 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-white font-bold text-xl mb-4">Reset Game?</h2>
                <p className="text-gray-300 text-sm mb-6">
                  Are you sure you want to reset your game? This will permanently delete all your progress, including:
                </p>
                <div className="bg-black/30 p-3 rounded-lg mb-6 text-left">
                  <ul className="text-red-300 text-sm space-y-1">
                    <li>• All coins, gems, and shiny gems</li>
                    <li>• All weapons, armor, and relics</li>
                    <li>• Zone progress and achievements</li>
                    <li>• Research levels and statistics</li>
                    <li>• Collection book progress</li>
                    <li>• Player tags and streaks</li>
                    <li>• Character level and skills</li>
                    <li>• Daily reward streaks</li>
                    <li>• Garden of Growth progress</li>
                  </ul>
                </div>
                <p className="text-red-400 font-bold text-sm mb-6">
                  This action cannot be undone!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentModal(null)}
                    className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReset}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-bold"
                  >
                    Reset Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingIcons />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-violet-800 to-purple-800 shadow-2xl relative z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
                🏰 Hugoland 🗡️
              </h1>
              {gameState.isPremium && (
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-400 animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Only show bulk actions button when not in combat and not on menu page */}
              {!gameState.inCombat && currentView !== 'menu' && (
                <button
                  onClick={() => setCurrentModal('bulkActions')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
                >
                  <Package2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Bulk</span>
                </button>
              )}
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setCurrentView('menu')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
          
          {/* Quick Stats Bar - Hide during combat and on menu page */}
          {!gameState.inCombat && currentView !== 'menu' && (
            <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
              <button
                onClick={() => setCurrentModal('collection')}
                className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Collect</span>
              </button>

              {gameState.dailyRewards.availableReward && (
                <button
                  onClick={() => setCurrentModal('dailyRewards')}
                  className="flex items-center gap-1 text-green-300 hover:text-green-200 transition-colors animate-pulse"
                >
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Daily!</span>
                </button>
              )}
            </div>
          )}
          
          {/* Navigation - Disable during combat and hide on menu page */}
          {currentView !== 'menu' && (
            <nav className="flex justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
              {[
                { id: 'stats', label: 'Hero', icon: User },
                { id: 'research', label: 'Research', icon: Brain },
                { id: 'shop', label: 'Shop', icon: Package },
                { id: 'inventory', label: 'Inventory', icon: Shield },
                { id: 'mining', label: 'Mining', icon: Pickaxe },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id as GameView)}
                  disabled={gameState.inCombat}
                  className={`px-2 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap ${
                    currentView === id
                      ? 'bg-white text-purple-800 shadow-lg'
                      : gameState.inCombat
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-700 text-white hover:bg-purple-600 hover:scale-105'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Menu Page Back Button */}
          {currentView === 'menu' && (
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentView('stats')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Game
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {renderCurrentView()}
        </div>
      </div>

      {/* Modals */}
      {renderModal()}
    </div>
  );
}

export default App;