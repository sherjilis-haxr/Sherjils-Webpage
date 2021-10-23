let world, ballHandler, menu;
let startMoney = 24;
let money = startMoney;
let clicked = false;
let clickDamage = 1;
let clickDamageDealt = 0;

let maxBalls = 1000;

const SHOP_BTN_WIDTH = 125;
const SHOP_BTN_HEIGHT = 95;
const SHOP_BTN_OFF_X = 10;
const SHOP_BTN_OFF_Y = 20;
const STAT_HEIGHT = 160;

const UPGRADE_BTN_WIDTH = 125;
const UPGRADE_BTN_RIGHT_PAD = 16;
const UPGRADE_BTN_TOP_PAD = SHOP_BTN_OFF_Y;
const UPGRADE_BTN_HEIGHT = 28;

const BASIC_START_PRICE = 25;
const BASIC_GROWTH = 1.5;

const PLASMA_START_PRICE = 200;
const PLASMA_GROWTH = 1.4;

const SNIPER_START_PRICE = 2500;
const SNIPER_GROWTH = 1.35;

const SCATTER_START_PRICE = 10000;
const SCATTER_GROWTH = 1.35;

const CANNON_START_PRICE = 75000;
const CANNON_GROWTH = 1.3;

const POISON_START_PRICE = 75000;
const POISON_GROWTH = 1.25;
