document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素引用 ---
    const selectCharButtons = document.querySelectorAll('.char-button'); // 選擇所有角色按鈕
    const charAvatar = document.getElementById('char-avatar');
    const charName = document.getElementById('char-name');
    const charJobName = document.getElementById('char-job-name'); // 職業名稱顯示
    const charLevel = document.getElementById('char-level');
    const charCurrentXp = document.getElementById('char-current-xp');
    const charXpNeeded = document.getElementById('char-xp-needed');
    const charXpBar = document.getElementById('char-xp-bar');
    const charMoney = document.getElementById('char-money'); // 金錢顯示
    const charHp = document.getElementById('char-hp'); // 生命力顯示
    const charAttack = document.getElementById('char-attack'); // 攻擊力顯示
    const charDefense = document.getElementById('char-defense'); // 防禦力顯示
    const taskList = document.getElementById('task-list');
    const skillList = document.getElementById('skill-list'); // 招式列表
    const resetDailyTasksBtn = document.getElementById('reset-daily-tasks-btn');
    const fullResetBtn = document.getElementById('full-reset-btn');
    const body = document.body;

    // 每日/週統計相關元素
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    const currentStatsWeekSpan = document.getElementById('current-stats-week');
    const chartTypeRadios = document.querySelectorAll('input[name="chart-type"]');
    const weeklyStatsChartCtx = document.getElementById('weeklyStatsChart').getContext('2d');
    let weeklyStatsChart; // Chart.js 實例

    // 角色設定彈出視窗相關元素
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalButtons = document.querySelectorAll('.close-button'); // 選擇所有關閉按鈕
    const charNameInput = document.getElementById('char-name-input');
    const jobSelectionDiv = document.getElementById('job-selection');
    const avatarSelectionDiv = document.getElementById('avatar-selection');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // 任務設定彈出視窗相關元素
    const manageTasksBtn = document.getElementById('manage-tasks-btn'); // 新增的任務設定按鈕
    const manageTasksModal = document.getElementById('manage-tasks-modal'); // 任務設定 Modal
    const newManagedTaskNameInput = document.getElementById('new-managed-task-name');
    const newManagedTaskXpInput = document.getElementById('new-managed-task-xp');
    const newManagedTaskMoneyInput = document.getElementById('new-managed-task-money');
    const addManagedTaskBtn = document.getElementById('add-managed-task-btn');
    const managedTaskList = document.getElementById('managed-task-list'); // 任務設定介面中的任務列表
    const saveManagedTasksBtn = document.getElementById('save-managed-tasks-btn');

    // 新增：日期導航元素
    const currentDateSpan = document.getElementById('current-date-display');
    const prevDayBtn = document.getElementById('prev-day-btn');
    const nextDayBtn = document.getElementById('next-day-btn');


    // --- 職業數據 (包含初始屬性、每級成長和招式列表) ---
    const jobs = {
        knight: {
            id: 'knight',
            name: '晨曦騎士',
            maleAvatar: 'images/male_knight.png',
            femaleAvatar: 'images/male_knight.png', // 騎士職業只有男性頭像，這裡也給一個預設
            bgImage: 'images/knight_background.png',
            primaryColor: '#4a6fa5',
            accentColor: '#ffc870',
            baseHp: 7, // 基礎生命力
            baseAttack: 10, // 基礎攻擊力
            baseDefense: 8, // 基礎防禦力
            hpPerLevel: 2, // 每級生命力成長
            attackPerLevel: 2, // 每級攻擊力成長
            defensePerLevel: 1, // 每級防禦力成長
            skills: [ // 招式列表，索引對應等級-1
                { name: '基礎斬擊', attack: 5 }, // Lv 1
                { name: '重擊', attack: 10 },    // Lv 2
                { name: '格擋反擊', attack: 15 },  // Lv 3
                { name: '聖光庇護', attack: 20, defenseBoost: 5 }, // Lv 4 (示例招式，可自訂)
                { name: '審判之刃', attack: 25 }, // Lv 5
                { name: '英勇衝鋒', attack: 30 }, // Lv 6
                { name: '神聖護甲', attack: 35, defenseBoost: 8 }, // Lv 7
                { name: '王者之劍', attack: 40 }, // Lv 8
                { name: '破曉之擊', attack: 45 }, // Lv 9
                { name: '無敵斬', attack: 50 }  // Lv 10
            ]
        },
        sage: {
            id: 'sage',
            name: '星語賢者',
            maleAvatar: 'images/female_sage.png', // 賢者職業只有女性頭像，這裡也給一個預設
            femaleAvatar: 'images/female_sage.png',
            bgImage: 'images/sage_background.png',
            primaryColor: '#c996ac',
            accentColor: '#e0d0bb',
            baseHp: 14,
            baseAttack: 6,
            baseDefense: 5,
            hpPerLevel: 1,
            attackPerLevel: 1,
            defensePerLevel: 1,
            skills: [
                { name: '魔力飛彈', attack: 5 }, // Lv 1
                { name: '寒冰箭', attack: 10 }, // Lv 2
                { name: '火焰衝擊', attack: 15 }, // Lv 3
                { name: '元素護盾', attack: 20, defenseBoost: 7 }, // Lv 4
                { name: '雷電術', attack: 25 }, // Lv 5
                { name: '暴風雪', attack: 30 }, // Lv 6
                { name: '地獄火', attack: 35 }, // Lv 7
                { name: '奧術漩渦', attack: 40 }, // Lv 8
                { name: '流星火雨', attack: 45 }, // Lv 9
                { name: '禁咒‧末日', attack: 50 } // Lv 10
            ]
        },
        explorer: {
            id: 'explorer',
            name: '探索者', // 新職業
            maleAvatar: 'images/male_explorer.png',
            femaleAvatar: 'images/female_explorer.png',
            bgImage: 'images/explorer_background.png',
            primaryColor: '#6c7a89',
            accentColor: '#f0ad4e',
            baseHp: 11,
            baseAttack: 8,
            baseDefense: 6,
            hpPerLevel: 1.5,
            attackPerLevel: 1.5,
            defensePerLevel: 1,
            skills: [
                { name: '快速射擊', attack: 5 }, // Lv 1
                { name: '陷阱設置', attack: 10 }, // Lv 2
                { name: '精準瞄準', attack: 15 }, // Lv 3
                { name: '煙霧彈', attack: 20, evasion: true }, // Lv 4
                { name: '毒箭', attack: 25 }, // Lv 5
                { name: '多重射擊', attack: 30 }, // Lv 6
                { name: '叢林潛行', attack: 35 }, // Lv 7
                { name: '爆裂箭', attack: 40 }, // Lv 8
                { name: '致命射擊', attack: 45 }, // Lv 9
                { name: '萬箭齊發', attack: 50 } // Lv 10
            ]
        },
        artisan: {
            id: 'artisan',
            name: '工匠', // 新職業
            maleAvatar: 'images/male_artisan.png',
            femaleAvatar: 'images/female_artisan.png',
            bgImage: 'images/artisan_background.png',
            primaryColor: '#a78864',
            accentColor: '#92b5b3',
            baseHp: 9,
            baseAttack: 7,
            baseDefense: 9,
            hpPerLevel: 1.5,
            attackPerLevel: 1,
            defensePerLevel: 2,
            skills: [
                { name: '工具揮擊', attack: 5 }, // Lv 1
                { name: '臨時護甲', attack: 10, defenseBoost: 8 }, // Lv 2
                { name: '機關陷阱', attack: 15 }, // Lv 3
                { name: '能量注入', attack: 20 }, // Lv 4
                { name: '強化裝甲', attack: 25, defenseBoost: 10 }, // Lv 5
                { name: '自動砲塔', attack: 30 }, // Lv 6
                { name: '電磁脈衝', attack: 35 }, // Lv 7
                { name: '超載打擊', attack: 40 }, // Lv 8
                { name: '終極機甲', attack: 45 }, // Lv 9
                { name: '自爆機器人', attack: 50 } // Lv 10
            ]
        },
        healer: {
            id: 'healer',
            name: '治療師', // 新職業 (可設定為中性頭像)
            maleAvatar: 'images/neutral_healer.png',
            femaleAvatar: 'images/neutral_healer.png',
            bgImage: 'images/healer_background.png',
            primaryColor: '#8dcb7b',
            accentColor: '#fffacd',
            baseHp: 13,
            baseAttack: 5,
            baseDefense: 7,
            hpPerLevel: 2,
            attackPerLevel: 1,
            defensePerLevel: 1.5,
            skills: [
                { name: '治癒微光', attack: 5, heal: 10 }, // Lv 1 (新增攻擊力)
                { name: '聖言術', attack: 10 }, // Lv 2
                { name: '淨化之光', attack: 15 }, // Lv 3
                { name: '群體治療', attack: 20, heal: 20 }, // Lv 4 (新增攻擊力)
                { name: '神聖新星', attack: 25 }, // Lv 5
                { name: '生命連結', attack: 30, heal: 25 }, // Lv 6
                { name: '驅散邪惡', attack: 35 }, // Lv 7
                { name: '天使之翼', attack: 40, defenseBoost: 10 }, // Lv 8 (新增攻擊力)
                { name: '聖療術', attack: 45, heal: 30 }, // Lv 9
                { name: '復活術', attack: 50 } // Lv 10
            ]
        }
    };

    // 所有可選頭像，方便在設定中選擇
    // 如果您有更多頭像，請在這裡添加
    const availableAvatars = [
        { id: 'avatar-knight-m', src: 'images/male_knight.png', gender: 'male', jobId: 'knight' },
        { id: 'avatar-sage-f', src: 'images/female_sage.png', gender: 'female', jobId: 'sage' },
        { id: 'avatar-explorer-m', src: 'images/male_explorer.png', gender: 'male', jobId: 'explorer' },
        { id: 'avatar-artisan-f', src: 'images/female_artisan.png', gender: 'female', jobId: 'artisan' },
        { id: 'avatar-healer-n', src: 'images/neutral_healer.png', gender: 'neutral', jobId: 'healer' }
    ];

    // --- 角色資料與預設任務 ---
    // 預設的 "每日任務" 列表，這些任務是固定的，不能被使用者刪除
    const defaultDailyTasks = {
        male: [
            { id: 'default-task-male-1', text: '吸地', xp: 15, money: 50, isDefault: true },
            { id: 'default-task-male-2', text: '洗碗', xp: 15, money: 50, isDefault: true },
            { id: 'default-task-male-3', text: '整理浴室', xp: 20, money: 50, isDefault: true },
            { id: 'default-task-male-4', text: '煮飯', xp: 30, money: 50, isDefault: true },
            { id: 'default-task-male-5', text: '倒垃圾', xp: 20, money: 50, isDefault: true },
            { id: 'default-task-male-6', text: '把飯吃光光', xp: 40, money: 200, isDefault: true }
        ],
        female: [
            { id: 'default-task-female-1', text: '拖地', xp: 15, money: 50, isDefault: true },
            { id: 'default-task-female-2', text: '整理餐桌', xp: 15, money: 50, isDefault: true },
            { id: 'default-task-female-3', text: '整理沙發', xp: 20, money: 50, isDefault: true },
            { id: 'default-task-female-4', text: '煮飯', xp: 30, money: 50, isDefault: true },
            { id: 'default-task-female-5', text: '倒垃圾', xp: 20, money: 50, isDefault: true },
            { id: 'default-task-female-6', text: '把飯吃光光', xp: 40, money: 200, isDefault: true }
        ]
    };

    // 預設的角色數據，將在載入時被儲存的數據覆蓋
    const defaultCharacters = {
        male: {
            name: '晨曦騎士',
            gender: 'male',
            jobId: 'knight',
            customAvatar: null,
            level: 1,
            xp: 0,
            money: 0,
            hp: 0,
            attack: 0,
            defense: 0,
            learnedSkills: [],
            tasks: JSON.parse(JSON.stringify(defaultDailyTasks.male)) // 初始任務為預設任務
        },
        female: {
            name: '星語賢者',
            gender: 'female',
            jobId: 'sage',
            customAvatar: null,
            level: 1,
            xp: 0,
            money: 0,
            hp: 0,
            attack: 0,
            defense: 0,
            learnedSkills: [],
            tasks: JSON.parse(JSON.stringify(defaultDailyTasks.female)) // 初始任務為預設任務
        }
    };

    let characters = {}; // 實際使用的角色數據，從 localStorage 載入或使用 defaultCharacters
    let currentPlayerType = 'male'; // 當前選擇的角色性別 (male/female)

    // 經驗值升級曲線 (最大等級為10)
    const XP_PER_LEVEL = [0, 100, 200, 350, 550, 800, 1100, 1500, 2000, 2600, 3300]; // 每個等級所需的總XP (索引10為Lv10所需總XP)

    // --- 本地儲存鍵名 ---
    const LOCAL_STORAGE_KEY = 'rpgDailyChecklistData_V4'; // 更改鍵名以避免舊數據衝突
    const LAST_RESET_DATE_KEY = 'rpgLastResetDate';
    const WEEKLY_STATS_KEY = 'rpgWeeklyStats'; // 儲存週統計數據
    const DAILY_COMPLETIONS_KEY = 'rpgDailyTaskCompletions_V4'; // 新增：儲存每日任務完成狀態

    let weeklyStats = {}; // 儲存每週任務完成情況的物件 { 'YYYY-MM-DD': { male: { tasks:X, xp:Y, money:Z }, female: { ... } } }
    let currentStatsWeekStartDate = getStartOfWeek(new Date()); // 當前顯示統計表的週開始日期
    let dailyTaskCompletions = {}; // 新增：儲存每日任務完成狀態 { 'YYYY-MM-DD': { 'taskId1': true, ... } }
    let currentSelectedDate = new Date(); // 新增：當前查看的任務日期


    // --- 日期工具函數 ---
    // **修改點 1: getTodayDateString 確保返回台灣時區的日期字串 (YYYY-MM-DD)**
    function getTodayDateString(date = new Date()) {
        const d = new Date(date.getTime()); // 複製日期物件，避免修改原始物件
        // 將 UTC 時間向前推 8 小時，使其在台灣時區的日期部分保持一致
        d.setUTCHours(d.getUTCHours() + 8); 
        const year = d.getUTCFullYear();
        const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = d.getUTCDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 格式化日期為可讀的字串 (e.g., 2023年10月26日 星期四)
    function formatDisplayDate(date) {
        // 使用 Intl.DateTimeFormat 確保在台灣時區正確顯示
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Taipei' };
        return date.toLocaleDateString('zh-TW', options);
    }

    // **修改點 2: getStartOfWeek 確保獲取一週的開始日期 (週日) 是基於台灣時間**
    function getStartOfWeek(date) {
        // 先獲取輸入日期在台灣時區下的日期字串
        const dateStringInTaiwan = getTodayDateString(date); 
        // 根據這個日期字串創建一個新的 Date 物件，這樣 d.getDay() 會對應台灣的星期幾
        const d = new Date(dateStringInTaiwan); 

        const day = d.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
        // 計算回到本週日需要減去的天數
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0); // 清除時間部分

        return d;
    }

    // 格式化日期範圍顯示 (YYYY/MM/DD -YYYY/MM/DD)
    function formatDateRange(startDate) {
        // 確保 startDate 和 endDate 都是基於台灣時區的日期字串
        const startYear = startDate.getFullYear();
        const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const startDay = startDate.getDate().toString().padStart(2, '0');

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // 加上六天得到週六

        const endYear = endDate.getFullYear();
        const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
        const endDay = endDate.getDate().toString().padStart(2, '0');

        return `${startYear}/${startMonth}/${startDay} - ${endYear}/${endMonth}/${endDay}`;
    }

    // **新增：重新計算角色累積經驗值和金錢的函數**
    function recalculateCharacterCumulativeStats(char) {
        let totalXp = 0;
        let totalMoney = 0;
        const charDailyCompletions = dailyTaskCompletions;

        // 遍歷所有日期，累加該角色在該日期已完成任務的 XP 和 Money
        for (const dateString in charDailyCompletions) {
            if (charDailyCompletions[dateString][char.gender]) {
                const completedTasksForDate = charDailyCompletions[dateString][char.gender];
                // 必須從 characters[char.gender].tasks 獲取任務的 XP 和 Money
                const currentCharacterTasks = characters[char.gender].tasks;
                currentCharacterTasks.forEach(task => { // 遍歷角色的所有任務定義
                    if (completedTasksForDate[task.id]) { // 檢查該任務在該日期是否已完成
                        totalXp += task.xp;
                        totalMoney += task.money;
                    }
                });
            }
        }
        char.xp = totalXp;
        char.money = totalMoney;
    }


    // --- 初始化與資料載入 ---
    function loadGameData() {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            characters = JSON.parse(savedData);
            // 確保新屬性 (hp, attack, defense, learnedSkills, isDefault) 存在於舊數據中
            for (const charType in characters) {
                const char = characters[charType];
                if (char.gender === undefined) char.gender = charType;
                if (char.jobId === undefined) char.jobId = charType === 'male' ? 'knight' : 'sage';
                if (char.customAvatar === undefined) char.customAvatar = null;
                if (char.money === undefined) char.money = 0;
                if (char.hp === undefined) char.hp = 0; // 新增生命力初始化
                if (char.attack === undefined) char.attack = 0;
                if (char.defense === undefined) char.defense = 0;
                if (char.learnedSkills === undefined) char.learnedSkills = [];

                // 合併任務：確保預設任務存在，並保留使用者自訂的任務
                // 注意：這裡移除了 isCompleted 屬性，因為它將由 dailyTaskCompletions 管理
                char.tasks = mergeTasks(defaultDailyTasks[char.gender], char.tasks.map(task => {
                    const { isCompleted, ...rest } = task; // 移除 isCompleted
                    return rest;
                }));

                char.tasks.forEach(task => {
                    if (task.money === undefined) task.money = 20;
                    if (task.xp === undefined) task.xp = 50;
                    if (task.isDefault === undefined) { // 標記舊數據中的預設任務
                        task.isDefault = task.id.startsWith('default-task-');
                    }
                });

                // 確保每個職業的預設招式都至少有基礎斬擊
                if (char.learnedSkills.length === 0 && char.level >= 1 && jobs[char.jobId]?.skills[0]) {
                    char.learnedSkills.push(jobs[char.jobId].skills[0]);
                }
            }
        } else {
            // 如果沒有儲存數據，使用預設數據並深拷貝，防止修改到 defaultCharacters 原始數據
            characters = JSON.parse(JSON.stringify(defaultCharacters));
            // 初始學習基礎招式
            Object.values(characters).forEach(char => {
                if (char.level >= 1 && jobs[char.jobId]?.skills[0]) {
                    char.learnedSkills.push(jobs[char.jobId].skills[0]);
                }
            });
        }

        const savedWeeklyStats = localStorage.getItem(WEEKLY_STATS_KEY);
        if (savedWeeklyStats) {
            weeklyStats = JSON.parse(savedWeeklyStats);
        } else {
            weeklyStats = {};
        }

        const savedDailyCompletions = localStorage.getItem(DAILY_COMPLETIONS_KEY);
        if (savedDailyCompletions) {
            dailyTaskCompletions = JSON.parse(savedDailyCompletions);
        } else {
            dailyTaskCompletions = {};
        }

        // **在載入數據後，為所有角色重新計算累積經驗值和金錢**
        for (const charType in characters) {
            recalculateCharacterCumulativeStats(characters[charType]);
        }

        // 檢查是否需要自動重置任務
        checkAndResetDailyTasks();
        renderCharacter(characters[currentPlayerType]); // 初始渲染當前角色
        renderTasks(); // 初始渲染任務列表 (將根據 currentSelectedDate)
        renderWeeklyStatsChart(); // 初始渲染週統計圖表
    }

    // 合併任務：保留使用者自訂的新增任務，並更新預設任務的狀態和屬性
    function mergeTasks(defaultTasks, loadedTasks) {
        const mergedTasksMap = new Map();

        // 1. 將所有預設任務加入地圖
        defaultTasks.forEach(task => {
            mergedTasksMap.set(task.id, { ...task }); // 深拷貝預設任務
        });

        // 2. 遍歷已載入任務，更新或新增
        loadedTasks.forEach(task => {
            if (mergedTasksMap.has(task.id)) {
                // 如果是預設任務，更新其名稱/XP/Money，但保留 isDefault 標記
                const defaultTemplate = defaultTasks.find(d => d.id === task.id);
                mergedTasksMap.set(task.id, {
                    ...defaultTemplate, // 從最新預設模板複製，確保 isDefault 為 true
                    text: task.text, // 允許修改名稱
                    xp: task.xp,      // 允許修改XP
                    money: task.money, // 允許修改Money
                    isDefault: true // 確保標記為預設任務
                });
            } else {
                // 如果是使用者新增的任務，直接加入
                mergedTasksMap.set(task.id, { ...task, isDefault: false }); // 確保自訂任務標記為非預設
            }
        });

        return Array.from(mergedTasksMap.values());
    }


    function saveGameData() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
        localStorage.setItem(WEEKLY_STATS_KEY, JSON.stringify(weeklyStats));
        localStorage.setItem(DAILY_COMPLETIONS_KEY, JSON.stringify(dailyTaskCompletions)); // 保存每日任務完成狀態
    }

    // --- 角色顯示與更新 ---
    function renderCharacter(char) {
        currentPlayerType = char.gender; // 確保 currentPlayerType 與當前渲染角色性別一致

        // **在渲染角色前，確保重新計算其累積經驗值和金錢**
        recalculateCharacterCumulativeStats(char);

        // 更新按鈕 active 狀態
        selectCharButtons.forEach(button => {
            button.classList.remove('active');
            // 根據按鈕的 dataset.job-id 和當前角色的 job-id 來判斷是否激活
            if (button.dataset.jobId === char.jobId) {
                if ((char.gender === 'male' && button.id === 'select-male') ||
                    (char.gender === 'female' && button.id === 'select-female')) {
                    button.classList.add('active');
                }
            }
            // 更新按鈕上的頭像 (確保預設顯示正確)
            // 由於已移除圖案，這段代碼不再需要實際更新 img.src，但保留結構以防未來添加
            // const img = button.querySelector('img');
            // const job = jobs[button.dataset.jobId];
            // if (job) {
            //     img.src = button.id === 'select-male' ? job.maleAvatar : job.femaleAvatar;
            // }
        });


        // 更新 body class 以應用主題顏色
        // 先移除所有 job- 相關的 class
        body.className = body.className.split(' ').filter(c => !c.startsWith('job-')).join(' ');
        body.classList.add(`job-${char.jobId}`); // 新增當前職業的 class

        // 更新角色資訊
        charAvatar.src = char.customAvatar || (char.gender === 'male' ? jobs[char.jobId].maleAvatar : jobs[char.jobId].femaleAvatar);
        charName.textContent = char.name;
        charJobName.textContent = jobs[char.jobId].name; // 顯示職業名稱
        charLevel.textContent = char.level;
        charMoney.textContent = char.money; // 更新金錢顯示 (現在會是重新計算後的準確值)

        // 計算並顯示戰鬥屬性
        const jobData = jobs[char.jobId];
        char.hp = jobData.baseHp + (char.level - 1) * jobData.hpPerLevel; // 計算生命力
        char.attack = jobData.baseAttack + (char.level - 1) * jobData.attackPerLevel;
        char.defense = jobData.baseDefense + (char.level - 1) * jobData.defensePerLevel;
        charHp.textContent = Math.round(char.hp); // 四捨五入顯示
        charAttack.textContent = Math.round(char.attack); // 四捨五入顯示
        charDefense.textContent = Math.round(char.defense); // 四捨五入顯示

        updateXpBar(char.xp, char.level); // XP 顯示也將是重新計算後的準確值

        // 更新背景圖片
        document.body.style.backgroundImage = `url('${jobs[char.jobId].bgImage}')`;

        // 重新渲染任務列表和招式列表
        renderTasks(); // 現在 renderTasks 會根據 currentSelectedDate 渲染
        renderSkills();
        saveGameData(); // 保存當前角色狀態
    }

    function updateXpBar(xp, level) {
        const currentLevelXpNeeded = XP_PER_LEVEL[level] || Infinity;
        const previousLevelXp = XP_PER_LEVEL[level - 1] || 0;
        const xpForCurrentLevel = xp - previousLevelXp;
        const totalXpForCurrentLevelSegment = currentLevelXpNeeded - previousLevelXp;

        let percentage = (totalXpForCurrentLevelSegment > 0) ? (xpForCurrentLevel / totalXpForCurrentLevelSegment) * 100 : 100;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;

        charXpBar.style.width = `${percentage}%`;
        charCurrentXp.textContent = xp;
        charXpNeeded.textContent = (currentLevelXpNeeded === Infinity) ? 'MAX' : currentLevelXpNeeded;

        // 檢查是否升級
        checkLevelUp();
    }

    function checkLevelUp() {
        const char = characters[currentPlayerType];
        const currentLevelXpNeeded = XP_PER_LEVEL[char.level] || Infinity;

        // 確保還有下一個等級 (最大等級為 XP_PER_LEVEL.length - 1)
        if (char.level < XP_PER_LEVEL.length - 1 && char.xp >= currentLevelXpNeeded) {
            char.level++;
            alert(`${char.name} 升級了！達到等級 ${char.level}！`);

            // 學習新招式
            const newSkill = jobs[char.jobId].skills[char.level - 1]; // 等級 N 對應 skills[N-1]
            if (newSkill && !char.learnedSkills.some(s => s.name === newSkill.name)) {
                char.learnedSkills.push(newSkill);
                alert(`${char.name} 學會了新招式: ${newSkill.name}！`);
                renderSkills(); // 更新招式列表顯示
            }

            // 重新計算並顯示戰鬥屬性
            const jobData = jobs[char.jobId];
            char.hp = jobData.baseHp + (char.level - 1) * jobData.hpPerLevel; // 更新生命力
            char.attack = jobData.baseAttack + (char.level - 1) * jobData.attackPerLevel;
            char.defense = jobData.baseDefense + (char.level - 1) * jobData.defensePerLevel;
            charHp.textContent = Math.round(char.hp);
            charAttack.textContent = Math.round(char.attack);
            charDefense.textContent = Math.round(char.defense);

            updateXpBar(char.xp, char.level); // 再次更新XP條以反映新等級的進度
            saveGameData();
        } else if (char.level >= XP_PER_LEVEL.length - 1) {
            charXpNeeded.textContent = 'MAX';
            charXpBar.style.width = '100%';
        }
    }

    // --- 任務管理 (主要顯示介面) ---
    function renderTasks() {
        taskList.innerHTML = ''; // 清空現有列表
        const char = characters[currentPlayerType];
        const dateString = getTodayDateString(currentSelectedDate); // 獲取當前選擇日期的字串

        // 更新日期顯示
        currentDateSpan.textContent = formatDisplayDate(currentSelectedDate);

        // 確保 dailyTaskCompletions 結構存在
        if (!dailyTaskCompletions[dateString]) {
            dailyTaskCompletions[dateString] = {};
        }
        if (!dailyTaskCompletions[dateString][char.gender]) {
            dailyTaskCompletions[dateString][char.gender] = {};
        }

        char.tasks.forEach(task => {
            // 從 dailyTaskCompletions 獲取該任務在該日期的完成狀態
            const isCompletedForThisDate = dailyTaskCompletions[dateString][char.gender][task.id] || false;

            const listItem = document.createElement('li');
            listItem.className = `task-item ${isCompletedForThisDate ? 'completed' : ''}`;
            listItem.dataset.taskId = task.id; // 儲存任務ID

            listItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${isCompletedForThisDate ? 'checked' : ''}>
                <span class="task-content">${task.text}</span>
                <span class="xp-award">+${task.xp} XP</span>
                <span class="money-award">+${task.money} 💰</span>
            `;

            const checkbox = listItem.querySelector('.task-checkbox');
            // 將 currentSelectedDate 傳遞給 toggleTaskCompletion
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id, checkbox.checked, currentSelectedDate));

            taskList.appendChild(listItem);
        });
        updateDateNavigationButtons(); // 更新日期導航按鈕狀態
    }

    function toggleTaskCompletion(taskId, isChecked, taskDate) {
        const char = characters[currentPlayerType];
        const task = char.tasks.find(t => t.id === taskId);
        const taskDateString = getTodayDateString(taskDate); // 任務所屬的日期
        const todayString = getTodayDateString(new Date());   // 實際的今天日期

        if (task) {
            // 確保 dailyTaskCompletions 結構存在
            if (!dailyTaskCompletions[taskDateString]) {
                dailyTaskCompletions[taskDateString] = {};
            }
            if (!dailyTaskCompletions[taskDateString][char.gender]) {
                dailyTaskCompletions[taskDateString][char.gender] = {};
            }

            const previousCompletionState = dailyTaskCompletions[taskDateString][char.gender][taskId] || false;

            // 只有當狀態發生實際變化時才進行 XP/金錢操作
            if (isChecked !== previousCompletionState) {
                // 週統計的處理 (無論任務日期是今天還是過去，都應更新週統計)
                const taskWeekStartString = getTodayDateString(getStartOfWeek(taskDate));

                if (!weeklyStats[taskWeekStartString]) {
                    weeklyStats[taskWeekStartString] = {};
                }
                if (!weeklyStats[taskWeekStartString][taskDateString]) {
                    weeklyStats[taskWeekStartString][taskDateString] = {
                        male: { tasks: 0, xp: 0, money: 0 },
                        female: { tasks: 0, xp: 0, money: 0 }
                    };
                }

                if (isChecked) { // 從未完成變為完成
                    // **移除直接修改 char.xp 和 char.money 的程式碼**
                    // char.xp += task.xp;
                    // char.money += task.money;
                    
                    weeklyStats[taskWeekStartString][taskDateString][char.gender].tasks++;
                    weeklyStats[taskWeekStartString][taskDateString][char.gender].xp += task.xp;
                    weeklyStats[taskWeekStartString][taskDateString][char.gender].money += task.money;

                    // 視覺效果：XP 和金錢提示 (僅限今天的任務)
                    if (taskDateString === todayString) {
                        const listItem = taskList.querySelector(`[data-task-id="${taskId}"]`);
                        if (listItem) {
                            const xpAwardSpan = listItem.querySelector('.xp-award');
                            const moneyAwardSpan = listItem.querySelector('.money-award');

                            if (xpAwardSpan) {
                                xpAwardSpan.style.opacity = 1;
                                xpAwardSpan.style.transform = 'translateY(-10px)';
                                setTimeout(() => { xpAwardSpan.style.opacity = 0; xpAwardSpan.style.transform = 'translateY(0)'; }, 800);
                            }
                            if (moneyAwardSpan) {
                                moneyAwardSpan.style.opacity = 1;
                                moneyAwardSpan.style.transform = 'translateY(-10px)';
                                setTimeout(() => { moneyAwardSpan.style.opacity = 0; moneyAwardSpan.style.transform = 'translateY(0)'; }, 800);
                            }
                        }
                    }

                } else { // 從完成變為未完成
                    // **移除直接修改 char.xp 和 char.money 的程式碼**
                    // char.xp -= task.xp;
                    // char.money -= task.money;
                    // if (char.xp < 0) char.xp = 0;
                    // if (char.money < 0) char.money = 0;
                    
                    // 確保 weeklyStats[taskWeekStartString][taskDateString] 存在 
                    if (weeklyStats[taskWeekStartString] && weeklyStats[taskWeekStartString][taskDateString] && weeklyStats[taskWeekStartString][taskDateString][char.gender]) {
                        weeklyStats[taskWeekStartString][taskDateString][char.gender].tasks = Math.max(0, weeklyStats[taskWeekStartString][taskDateString][char.gender].tasks - 1);
                        weeklyStats[taskWeekStartString][taskDateString][char.gender].xp = Math.max(0, weeklyStats[taskWeekStartString][taskDateString][char.gender].xp - task.xp);
                        weeklyStats[taskWeekStartString][taskDateString][char.gender].money = Math.max(0, weeklyStats[taskWeekStartString][taskDateString][char.gender].money - task.money);
                    }
                }
                // 更新 dailyTaskCompletions 中的完成狀態
                dailyTaskCompletions[taskDateString][char.gender][taskId] = isChecked;

                // **在 dailyTaskCompletions 狀態改變後，重新計算角色的累積經驗值和金錢**
                recalculateCharacterCumulativeStats(char);

                // 重新渲染UI (包括XP條、金錢和週統計圖表)
                updateXpBar(char.xp, char.level);
                charMoney.textContent = char.money;
                renderWeeklyStatsChart(); // 這裡確保了週統計圖表會根據最新的數據重新繪製
            }

            renderTasks(); // 重新渲染當前顯示日期的任務列表 (更新勾選狀態)
            saveGameData(); // 保存所有遊戲數據
        }
    }

    function resetDailyTasks() { // 此函數用於手動重置「今天」的任務
        const todayString = getTodayDateString();
        // 清除今天該角色類型在 dailyTaskCompletions 中的記錄
        if (dailyTaskCompletions[todayString] && dailyTaskCompletions[todayString][currentPlayerType]) {
            delete dailyTaskCompletions[todayString][currentPlayerType];
            // 如果該日期下沒有其他角色的記錄了，也可以刪除整個日期條目
            if (Object.keys(dailyTaskCompletions[todayString]).length === 0) {
                delete dailyTaskCompletions[todayString];
            }
        }

        // 將預設任務還原成 defaultDailyTasks 中的內容 (名稱、經驗、金錢)
        // 並保留使用者新增的任務
        const char = characters[currentPlayerType];
        const restoredDefaultTasks = JSON.parse(JSON.stringify(defaultDailyTasks[char.gender]));
        const customTasks = char.tasks.filter(task => !task.isDefault);
        char.tasks = [...restoredDefaultTasks, ...customTasks];

        // **手動重置任務後，也需重新計算角色的累積屬性**
        recalculateCharacterCumulativeStats(char);

        saveGameData();
        // 如果當前查看的日期是今天，則重新渲染任務列表
        if (getTodayDateString(currentSelectedDate) === todayString) {
            renderTasks();
        }
        alert('今日任務已重置！');
    }

    // --- 自動重置邏輯 ---
    function checkAndResetDailyTasks() { // 自動重置邏輯（新的一天開始時）
        const lastResetDate = localStorage.getItem(LAST_RESET_DATE_KEY);
        const today = getTodayDateString();

        if (lastResetDate !== today) {
            console.log('Detected new day. Auto-resetting daily tasks completion and ensuring default tasks.');

            // 新的一天，不需要清理 dailyTaskCompletions[today]
            // 因為 dailyTaskCompletions 是按日期記錄的，新的一天會有新的記錄
            // 只需要確保預設任務本身是最新狀態

            Object.values(characters).forEach(char => {
                const restoredDefaultTasks = JSON.parse(JSON.stringify(defaultDailyTasks[char.gender]));
                const customTasks = char.tasks.filter(task => !task.isDefault);
                char.tasks = [...restoredDefaultTasks, ...customTasks];
                // **自動重置時，也需重新計算每個角色的累積屬性**
                recalculateCharacterCumulativeStats(char);
            });

            localStorage.setItem(LAST_RESET_DATE_KEY, today);
            saveGameData();
            if (document.readyState === 'complete') {
                // 如果應用已經載入，且當前查看的是今天，則重新渲染任務
                if (getTodayDateString(currentSelectedDate) === today) {
                    renderTasks();
                }
                renderWeeklyStatsChart(); // 週統計可能需要更新
            }
        }
    }

    // --- 招式顯示 ---
    function renderSkills() {
        skillList.innerHTML = '';
        const char = characters[currentPlayerType];
        if (char.learnedSkills.length === 0) {
            const noSkillsItem = document.createElement('li');
            noSkillsItem.className = 'skill-item';
            noSkillsItem.textContent = '尚未學習任何招式。升級可學習新招式！';
            skillList.appendChild(noSkillsItem);
            return;
        }
        char.learnedSkills.forEach(skill => {
            const skillItem = document.createElement('li');
            skillItem.className = 'skill-item';
            let skillText = `<strong>${skill.name}</strong> - 攻擊力: ${skill.attack}`;
            if (skill.heal) {
                skillText += `, 治療: ${skill.heal}`;
            }
            if (skill.defenseBoost) {
                skillText += `, 防禦提升: ${skill.defenseBoost}`;
            }
            if (skill.evasion) {
                skillText += `, 閃避: 有`;
            }
            skillItem.innerHTML = skillText;
            skillList.appendChild(skillItem);
        });
    }

    // --- 完整重置遊戲 ---
    function fullResetGame() {
        if (confirm('這將清除所有遊戲數據，包括角色、任務和統計數據。您確定要重置嗎？')) {
            localStorage.clear();
            // 重置所有全局變量到初始狀態
            characters = JSON.parse(JSON.stringify(defaultCharacters));
            weeklyStats = {};
            dailyTaskCompletions = {};
            currentSelectedDate = new Date(); // 重置日期為今天

            // 確保所有預設角色也學習基礎招式
            Object.values(characters).forEach(char => {
                char.learnedSkills = []; // 清空招式
                if (char.level >= 1 && jobs[char.jobId]?.skills[0]) {
                    char.learnedSkills.push(jobs[char.jobId].skills[0]);
                }
            });

            currentPlayerType = 'male'; // 預設選中男性角色
            loadGameData(); // 重新載入數據以應用預設值
            alert('遊戲數據已完整重置！');
        }
    }

    // --- 週統計圖表 (使用 Chart.js) ---
    function renderWeeklyStatsChart() {
        if (weeklyStatsChart) {
            weeklyStatsChart.destroy(); // 銷毀舊圖表實例
        }

        const currentChartType = document.querySelector('input[name="chart-type"]:checked').value;
        const labels = []; // 日期標籤 (週日到週六，包含日期)
        const dataMale = []; // 男性角色數據
        const dataFemale = []; // 女性角色數據

        const daysInWeek = 7;
        let chartTitle = '';

        switch (currentChartType) {
            case 'tasks':
                chartTitle = '每週任務完成數';
                break;
            case 'xp':
                chartTitle = '每週獲得經驗值';
                break;
            case 'money':
                chartTitle = '每週獲得金錢';
                break;
        }

        // 獲取當前週的每日數據
        for (let i = 0; i < daysInWeek; i++) {
            const date = new Date(currentStatsWeekStartDate);
            date.setDate(currentStatsWeekStartDate.getDate() + i);
            const dateString = getTodayDateString(date);

            const weekdayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
            const dayOfWeek = weekdayNames[date.getDay()];
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            labels.push(`${dayOfWeek} ${month}/${day}`); // 例如: 星期日 07/01

            // 獲取男性角色數據
            const maleDayStats = weeklyStats[getTodayDateString(currentStatsWeekStartDate)]?.[dateString]?.['male'];
            dataMale.push(maleDayStats ? maleDayStats[currentChartType] : 0);

            // 獲取女性角色數據
            const femaleDayStats = weeklyStats[getTodayDateString(currentStatsWeekStartDate)]?.[dateString]?.['female'];
            dataFemale.push(femaleDayStats ? femaleDayStats[currentChartType] : 0);
        }

        currentStatsWeekSpan.textContent = formatDateRange(currentStatsWeekStartDate);

        weeklyStatsChart = new Chart(weeklyStatsChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'P1' + chartTitle,
                        data: dataMale,
                        backgroundColor: varColor('--primary-color'), // 使用一個通用顏色或為 P1 指定顏色
                        borderColor: varColor('--primary-color'),
                        borderWidth: 1
                    },
                    {
                        label: 'P2' + chartTitle,
                        data: dataFemale,
                        backgroundColor: varColor('--secondary-color'), // 使用一個通用顏色或為 P2 指定顏色
                        borderColor: varColor('--secondary-color'),
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: varColor('--text-color')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: varColor('--text-color')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: varColor('--text-color')
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 輔助函數：獲取 CSS 變量的值
    function varColor(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }


    // --- 任務設定 Modal 相關函數 ---
    function openManageTasksModal() {
        manageTasksModal.style.display = 'flex';
        renderManagedTasks(); // 每次打開時重新渲染任務列表
    }

    function renderManagedTasks() {
        managedTaskList.innerHTML = '';
        const char = characters[currentPlayerType];

        if (char.tasks.length === 0) {
            const noTasksItem = document.createElement('li');
            noTasksItem.className = 'managed-task-item';
            noTasksItem.textContent = '沒有可管理的任務。';
            managedTaskList.appendChild(noTasksItem);
            return;
        }

        char.tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'managed-task-item';
            listItem.dataset.taskId = task.id;

            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.value = task.text;
            inputName.placeholder = '任務名稱';
            

            const inputXp = document.createElement('input');
            inputXp.type = 'number';
            inputXp.value = task.xp;
            inputXp.min = '10';
            inputXp.placeholder = '經驗值';
            

            const inputMoney = document.createElement('input');
            inputMoney.type = 'number';
            inputMoney.value = task.money;
            inputMoney.min = '0';
            inputMoney.placeholder = '金錢';
           
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '刪除';
            removeBtn.className = 'remove-task-btn';
           

            removeBtn.addEventListener('click', () => removeManagedTask(task.id));

            // 實時更新任務數據
            inputName.addEventListener('change', (e) => {
                task.text = e.target.value;
                saveGameData();
                renderTasks(); // 更新主介面任務列表
            });
            inputXp.addEventListener('change', (e) => {
                task.xp = parseInt(e.target.value) || 0;
                saveGameData();
                renderTasks(); // 更新主介面任務列表
            });
            inputMoney.addEventListener('change', (e) => {
                task.money = parseInt(e.target.value) || 0;
                saveGameData();
                renderTasks(); // 更新主介面任務列表
            });


            listItem.appendChild(inputName);
            listItem.appendChild(inputXp);
            listItem.appendChild(inputMoney);
            listItem.appendChild(removeBtn);
            managedTaskList.appendChild(listItem);
        });
    }

    function addManagedTask() {
        const name = newManagedTaskNameInput.value.trim();
        const xp = parseInt(newManagedTaskXpInput.value);
        const money = parseInt(newManagedTaskMoneyInput.value);

        if (name && xp >= 10 && money >= 0) {
            const char = characters[currentPlayerType];
            const newTaskId = 'custom-task-' + Date.now(); // 確保ID唯一性
            char.tasks.push({ id: newTaskId, text: name, xp: xp, money: money, isDefault: false });

            newManagedTaskNameInput.value = '';
            newManagedTaskXpInput.value = '50';
            newManagedTaskMoneyInput.value = '20';

            saveGameData();
            renderManagedTasks(); // 重新渲染任務設定列表
            renderTasks(); // 更新主介面任務列表
        } else {
            alert('請輸入有效的任務名稱、經驗值 (至少10) 和金錢 (至少0)。');
        }
    }

    function removeManagedTask(taskId) {
        if (confirm('您確定要刪除這個任務嗎？')) {
            const char = characters[currentPlayerType];
            char.tasks = char.tasks.filter(task => task.id !== taskId);

            // 如果刪除了任務，需要檢查 dailyTaskCompletions 中是否有該任務的記錄，並清除它
            for (const dateString in dailyTaskCompletions) {
                if (dailyTaskCompletions[dateString][char.gender] && dailyTaskCompletions[dateString][char.gender][taskId]) {
                    delete dailyTaskCompletions[dateString][char.gender][taskId];
                }
            }
            // 同理，也需更新週統計 (雖然不會自動減少歷史數據，但未來不會再統計已刪除的任務)
            // 簡化處理：只清除 dailyTaskCompletions，並重新計算總XP/Money
            recalculateCharacterCumulativeStats(char);

            saveGameData();
            renderManagedTasks(); // 重新渲染任務設定列表
            renderTasks(); // 更新主介面任務列表
            updateXpBar(char.xp, char.level); // 更新 XP 條顯示
            charMoney.textContent = char.money; // 更新金錢顯示
            renderWeeklyStatsChart(); // 更新週統計圖表
        }
    }

    // --- 角色設定 Modal 相關函數 ---
    function openSettingsModal() {
        settingsModal.style.display = 'flex';
        const char = characters[currentPlayerType];
        charNameInput.value = char.name;
        renderJobOptions();
        renderAvatarOptions();
    }

    function renderJobOptions() {
        jobSelectionDiv.innerHTML = '';
        const char = characters[currentPlayerType];
        for (const jobId in jobs) {
            const job = jobs[jobId];
            const jobOption = document.createElement('div');
            jobOption.className = `job-option ${char.jobId === jobId ? 'selected' : ''}`;
            jobOption.dataset.jobId = jobId;
            jobOption.innerHTML = `
                <img src="${char.gender === 'male' ? job.maleAvatar : job.femaleAvatar}" alt="${job.name}頭像">
                <span>${job.name}</span>
            `;
            jobOption.addEventListener('click', () => selectJob(jobId));
            jobSelectionDiv.appendChild(jobOption);
        }
    }

    function selectJob(jobId) {
        const char = characters[currentPlayerType];
        if (char.jobId === jobId) return; // 如果已經是當前職業，不做任何事

        // 確認是否切換職業
        if (!confirm(`切換職業到 ${jobs[jobId].name} 將重置您的招式列表。您確定嗎？`)) {
            return;
        }

        char.jobId = jobId;
        char.learnedSkills = []; // 清空已學習招式

        // 學習新職業的基礎招式
        if (char.level >= 1 && jobs[char.jobId]?.skills[0]) {
            char.learnedSkills.push(jobs[char.jobId].skills[0]);
        }
        renderJobOptions(); // 更新選擇狀態
        renderCharacter(char); // 重新渲染角色以更新職業相關顯示
        saveGameData();
    }


    function renderAvatarOptions() {
        avatarSelectionDiv.innerHTML = '';
        const char = characters[currentPlayerType];
        availableAvatars.forEach(avatar => {
            // 只顯示與當前角色性別匹配的頭像，或中性頭像
            if (avatar.gender === char.gender || avatar.gender === 'neutral') {
                const avatarOption = document.createElement('div');
                avatarOption.className = `avatar-option ${char.customAvatar === avatar.src ? 'selected' : ''}`;
                avatarOption.innerHTML = `
                    <img src="${avatar.src}" alt="${avatar.id}">
                `;
                avatarOption.addEventListener('click', () => selectAvatar(avatar.src));
                avatarSelectionDiv.appendChild(avatarOption);
            }
        });

        // 添加一個選項，用於重置為職業預設頭像
        const defaultAvatarOption = document.createElement('div');
        defaultAvatarOption.className = `avatar-option ${char.customAvatar === null ? 'selected' : ''}`;
        defaultAvatarOption.innerHTML = `
            <img src="${char.gender === 'male' ? jobs[char.jobId].maleAvatar : jobs[char.jobId].femaleAvatar}" alt="預設頭像">
            <span>預設</span>
        `;
        defaultAvatarOption.addEventListener('click', () => selectAvatar(null));
        avatarSelectionDiv.appendChild(defaultAvatarOption);
    }

    function selectAvatar(avatarSrc) {
        const char = characters[currentPlayerType];
        char.customAvatar = avatarSrc;
        renderAvatarOptions(); // 更新選中狀態
        renderCharacter(char); // 重新渲染角色以更新頭像
        saveGameData();
    }

    function saveSettings() {
        const char = characters[currentPlayerType];
        char.name = charNameInput.value.trim();
        if (!char.name) {
            alert('角色名稱不能為空！');
            charNameInput.value = char.name; // 恢復舊名稱
            return;
        }
        saveGameData();
        renderCharacter(char); // 重新渲染以更新名稱
        settingsModal.style.display = 'none'; // 隱藏 Modal
    }


    // --- 事件監聽器 ---
    selectCharButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCharType = button.id === 'select-male' ? 'male' : 'female';
            if (selectedCharType !== currentPlayerType) {
                renderCharacter(characters[selectedCharType]);
            }
        });
    });

    resetDailyTasksBtn.addEventListener('click', resetDailyTasks);
    fullResetBtn.addEventListener('click', fullResetGame);

    // 角色設定 Modal 事件
    settingsBtn.addEventListener('click', openSettingsModal);
    saveSettingsBtn.addEventListener('click', saveSettings);

    // 任務設定 Modal 事件
    manageTasksBtn.addEventListener('click', openManageTasksModal);
    addManagedTaskBtn.addEventListener('click', addManagedTask);
    newManagedTaskNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addManagedTask();
    });
    newManagedTaskXpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addManagedTask();
    });
    newManagedTaskMoneyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addManagedTask();
    });
    saveManagedTasksBtn.addEventListener('click', () => {
        manageTasksModal.style.display = 'none'; // 隱藏 Modal
    });


    // 處理所有 Modal 的關閉按鈕
    closeModalButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.target.dataset.modalId;
            document.getElementById(modalId).style.display = 'none';
        });
    });

    // 點擊 Modal 外部關閉 Modal
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === manageTasksModal) {
            manageTasksModal.style.display = 'none';
        }
    });

    // 日期導航按鈕事件
    prevDayBtn.addEventListener('click', () => {
        currentSelectedDate.setDate(currentSelectedDate.getDate() - 1);
        renderTasks(); // 重新渲染任務列表以顯示新日期的任務
    });

    nextDayBtn.addEventListener('click', () => {
        currentSelectedDate.setDate(currentSelectedDate.getDate() + 1);
        renderTasks(); // 重新渲染任務列表以顯示新日期的任務
    });

    function updateDateNavigationButtons() {
        const todayString = getTodayDateString(new Date());
        const currentSelectedDateString = getTodayDateString(currentSelectedDate);

        // 如果當前日期是今天，禁用「下一天」按鈕
        nextDayBtn.disabled = (currentSelectedDateString === todayString);
    }

    // 週統計導航按鈕事件
    prevWeekBtn.addEventListener('click', () => {
        currentStatsWeekStartDate.setDate(currentStatsWeekStartDate.getDate() - 7);
        renderWeeklyStatsChart();
    });

    nextWeekBtn.addEventListener('click', () => {
        const nextWeekStart = new Date(currentStatsWeekStartDate);
        nextWeekStart.setDate(currentStatsWeekStartDate.getDate() + 7);
        const today = getStartOfWeek(new Date()); // 獲取今天所在週的週日

        // 如果下一週的開始日期晚於「今天所在週的週日」，則應該禁用按鈕
        // 因為我們不能查看未來的數據
        if (nextWeekStart > today) {
            nextWeekBtn.disabled = true;
            // 如果剛好是今天這一週，則設置為今天這一週的開始日期
            if (getTodayDateString(nextWeekStart) === getTodayDateString(today)) {
                 currentStatsWeekStartDate = today;
            } else {
                 return; // 阻止繼續移動到未來
            }
        } else {
            currentStatsWeekStartDate.setDate(currentStatsWeekStartDate.getDate() + 7);
            nextWeekBtn.disabled = false; // 如果移動到過去或當前週，確保按鈕啟用
        }
        renderWeeklyStatsChart();
    });


    // 圖表類型切換事件
    chartTypeRadios.forEach(radio => {
        radio.addEventListener('change', renderWeeklyStatsChart);
    });

    // 初始載入遊戲數據
    loadGameData();
});