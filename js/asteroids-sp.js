let scoreboard;
let gameover;
let mainmenu;

let ctx;
let w;
let h;

let update;
let draw;

let players = [];
let asteroids = [];
let enemies = [];
let stars = [];
let boosts = [];

const shoot_cooldown = 20;
const dmg_cooldown = 60 * 5;

Math.dist = function(x1, y1, x2, y2){
    return Math.hypot(y2 - y1, x2 - x1);
}

class Player {
    constructor(x, y, vx, vy, o, pshield, lives, keys, color){
        this.x = x;
		this.y = y;
		this.vx = vx;
        this.vy = vy;
        this.o = o;
        this.shield = false;
        this.forward = false;
        this.pshield = pshield;
        this.lives = lives;
        this.keys = keys;
        this.score = 0;
        this.color = color;
        this.cooldown = 0;
        this.dmg_cooldown = 0;
        this.lim_cooldown = shoot_cooldown;
        this.bullets = []
        this.r = 15;

        let pd = document.createElement('div');
        pd.className = 'player';
        scoreboard.appendChild(pd);

        let s1 = document.createElement('span');
        s1.appendChild(document.createTextNode('Player ' + (players.length + 1)));
        pd.appendChild(s1);
        
        this.scoreSpan = document.createElement('span');
        this.scoreSpan.appendChild(document.createTextNode('Score: ' + this.score));
        pd.appendChild(this.scoreSpan);

        this.livesSpan = document.createElement('span');
        this.livesSpan.appendChild(document.createTextNode('Lives: ' + this.lives));
        pd.appendChild(this.livesSpan);

        let progdiv = document.createElement('div');
        progdiv.className = 'progress d-inline-block w200';
        pd.appendChild(progdiv);

        this.progSlider = document.createElement('div');
        this.progSlider.className = 'progress-bar';
        this.progSlider.style.width = Math.round(this.pshield) + '%';
        progdiv.appendChild(this.progSlider);

        let shieldSpan = document.createElement('span');
        shieldSpan.appendChild(document.createTextNode('Shield'));
        this.progSlider.appendChild(shieldSpan)

        let icons = [
            ['⯇', 'key_left'],
            ['⯅', 'key_forward'],
            ['⯈', 'key_right'],
            ['⁍', 'key_shoot'],
            ['⯄', 'key_shield']
        ];
        icons.forEach(function(icon){
            let sp = document.createElement('span');
            sp.appendChild(document.createTextNode(icon[0]));
            pd.appendChild(sp);
            $(sp).on('click', {player: this},function(e){
                sp.innerHTML = '';
                sp.appendChild(document.createTextNode('?'));
                e.data.player.keys[icon[1]] = prompt(icon[1], e.data.player.keys[icon[1]]);
                sp.innerHTML = ''
                sp.appendChild(document.createTextNode(icon[0]));
            });
        }, this);
    }
    
    draw(){
        if(this.shield) {
            ctx.beginPath();
            ctx.strokeStyle = "#0000ff";
            ctx.shadowColor = "#0000ff";
            ctx.arc(this.x, this.y, this.r + 2, 0, Math.PI * 2);
            ctx.stroke();
        }
        if(this.forward){
            let bs = 0.8 * Math.max(0.5, Math.random());
            ctx.beginPath();
            ctx.strokeStyle = "#ff0000";
            ctx.shadowColor = "#ff0000";
    
            let x1 = (this.x + (bs * this.r * Math.cos(this.o + Math.PI))) + Math.cos(this.o + Math.PI) * this.r;
            let y1 = (this.y + (bs * this.r * Math.sin(this.o + Math.PI))) + Math.sin(this.o + Math.PI) * this.r;

            let x2 = (this.x + (bs * this.r * Math.cos(this.o + Math.PI + (0.75 * Math.PI)))) + Math.cos(this.o + Math.PI) * this.r;
            let y2 = (this.y + (bs * this.r * Math.sin(this.o + Math.PI + (0.75 * Math.PI)))) + Math.sin(this.o + Math.PI) * this.r;
    
            let x3 = (this.x + (bs * this.r * Math.cos(this.o + Math.PI + (1.25 * Math.PI)))) + Math.cos(this.o + Math.PI) * this.r;
            let y3 = (this.y + (bs * this.r * Math.sin(this.o + Math.PI + (1.25 * Math.PI)))) + Math.sin(this.o + Math.PI) * this.r;
    
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.moveTo(x3, y3);
            ctx.lineTo(x1, y1);
            ctx.stroke(); 
        }
        ctx.beginPath();
        ctx.strokeStyle = (this.dmg_cooldown % 20 < 10) ? this.color : '#ff8000';
        ctx.shadowColor = (this.dmg_cooldown % 20 < 10) ? this.color : '#ff8000';

        let x1 = this.x + (this.r * Math.cos(this.o));
        let y1 = this.y + (this.r * Math.sin(this.o));

        let x2 = this.x + (this.r * Math.cos(this.o + (0.75 * Math.PI)));
        let y2 = this.y + (this.r * Math.sin(this.o + (0.75 * Math.PI)));

        let x3 = this.x + (this.r * Math.cos(this.o + (1.25 * Math.PI)));
        let y3 = this.y + (this.r * Math.sin(this.o + (1.25 * Math.PI)));

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        this.bullets.forEach(function(bullet){
            bullet.draw();
        });
    }

    update(){
        const to = 0.1
        const vmax = 5;
        const v = 0.1;
        const vb = 0.99;
        if(this.forward = this.keys.pressed.forward == true){
            this.vx = this.vx > 0 ? Math.min(vmax, this.vx + (v * Math.cos(this.o))) : Math.max(-vmax, this.vx + (v * Math.cos(this.o)));
            this.vy = this.vy > 0 ? Math.min(vmax, this.vy + (v * Math.sin(this.o))) : Math.max(-vmax, this.vy + (v * Math.sin(this.o)));
        }
        else{
            this.vx = Math.abs(this.vx * vb) > 0.1 ? this.vx * vb : 0; 
            this.vy = Math.abs(this.vy * vb) > 0.1 ? this.vy * vb : 0;
        }
        if(this.keys.pressed.left) this.o -= to;
        if(this.keys.pressed.right) this.o += to;
        if(this.shield = this.keys.pressed.shield == true){
            this.pshield = Math.max(0, this.pshield - 0.3);
            if(this.pshield == 0) this.shield = false;
        }
        else{
            this.pshield = Math.min(100, this.pshield + 0.1);
        }
        this.progSlider.style.width = Math.round(this.pshield) + '%';


        this.cooldown = Math.max(0, this.cooldown - 1);
        this.dmg_cooldown = Math.max(0, this.dmg_cooldown - 1);

        if(this.keys.pressed.shoot && this.cooldown == 0){
            this.bullets.push(new Bullet(this.x, this.y, this.o, 4, 100, '#00ff00'))
            this.cooldown = this.lim_cooldown;
        }

        this.x = ((this.x + this.vx) % w) > 0 ? ((this.x + this.vx) % w) : w - ((this.x + this.vx) % w);
        this.y = ((this.y + this.vy) % h) > 0 ? ((this.y + this.vy) % h) : h - ((this.y + this.vy) % h);

        asteroids.forEach(function(asteroid, i, a_obj){
            let dist = Math.dist(asteroid.x, asteroid.y, this.x, this.y);
            
            if(dist < ((asteroid.lives + 1) / 3) * 4 * asteroid.r && this.dmg_cooldown == 0 && this.shield == false){
                this.lives--;
                this.livesSpan.innerHTML = '';
                this.livesSpan.appendChild(document.createTextNode('Lives: ' + this.lives));
                this.dmg_cooldown = dmg_cooldown;
                asteroid.lives--;
                if(asteroid.lives == 0){
                    this.score += 30;
                    this.scoreSpan.innerHTML = '';
                    this.scoreSpan.appendChild(document.createTextNode('Score: ' + this.score));
                    a_obj.splice(i, 1, Asteroid.newRandom());
                }
            }
        }, this);

        enemies.forEach(function(enemy, i, e_obj){
            let dist = Math.dist(enemy.x, enemy.y, this.x, this.y);
            if(dist < this.r && this.dmg_cooldown == 0 && this.shield == false){
                this.lives--;
                this.livesSpan.innerHTML = '';
                this.livesSpan.appendChild(document.createTextNode('Lives: ' + this.lives));
                this.dmg_cooldown = dmg_cooldown;
                e_obj.splice(i, 1, Enemy.newRandom());
            }
            enemy.bullets.forEach(function(bullet, j, b_obj){
                let dist = Math.dist(bullet.x, bullet.y, this.x, this.y);
                if(dist < this.r && this.dmg_cooldown == 0 && this.shield == false){
                    this.lives--;
                    this.livesSpan.innerHTML = '';
                    this.livesSpan.appendChild(document.createTextNode('Lives: ' + this.lives));    
                    this.dmg_cooldown = dmg_cooldown;
                    b_obj.splice(j, 1);
                }
            }, this);
        }, this);

        boosts.forEach(function(boost, i, b_obj){
            let dist = Math.dist(boost.x, boost.y, this.x, this.y);
            if(dist < boost.r + 10){
                boost.boost(this);
                b_obj.splice(i, 1);
            }

        }, this);

        this.bullets.forEach(function(bullet, i, b_obj){
            bullet.update();

            asteroids.forEach(function(asteroid, j, a_obj){
                let dist = Math.dist(bullet.x, bullet.y, asteroid.x, asteroid.y);
                if(dist < ((asteroid.lives + 1) / 3) * 4 * asteroid.r){
                    asteroid.lives--;
                    this.score += 10;
                    this.scoreSpan.innerHTML = '';
                    this.scoreSpan.appendChild(document.createTextNode('Score: ' + this.score));
                    b_obj.splice(i, 1);
                    if(asteroid.lives == 0){
                        this.score += 30;
                        this.scoreSpan.innerHTML = '';
                        this.scoreSpan.appendChild(document.createTextNode('Score: ' + this.score));    
                        a_obj.splice(j, 1, Asteroid.newRandom());
                    }
                }
            }, this);

            enemies.forEach(function(enemy, j, e_obj){
                let dist = Math.dist(bullet.x, bullet.y, enemy.x, enemy.y);
                if(dist < enemy.r){
                    this.score += 50;
                    this.scoreSpan.innerHTML = '';
                    this.scoreSpan.appendChild(document.createTextNode('Score: ' + this.score));
                    b_obj.splice(i, 1);
                    e_obj.splice(j, 1, Enemy.newRandom());
                }
            }, this);
        }, this);

        this.bullets = this.bullets.filter(function(bullet){
            return bullet.ttl > 0;
        });
    }
}

class Boost{
    constructor(x, y, vx, vy, boost){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.boost = boost;
        this.r = 10;
        this.ttl = 600;
    }

    static newRandom(){
        const pboosts = [
            function(player){
                player.lives++;
                player.livesSpan.innerHTML = '';
                player.livesSpan.appendChild(document.createTextNode('Lives: ' + player.lives));    
            },
            function(player){
                player.score += 100;
                player.scoreSpan.innerHTML = '';
                player.scoreSpan.appendChild(document.createTextNode('Score: ' + player.score));    
            },
            function(player){
                player.lim_cooldown = 10;
            },
            function(player){
                player.dmg_cooldown = 900;
            }
        ];
        return new Boost(
            Math.random() * w,
            Math.random() * h,
            1 - Math.random() * 2,
            1 - Math.random() * 2,
            pboosts[Math.round(Math.random() * (pboosts.length - 1))]
        );
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = '#0033ff';
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    update(){
        this.x = ((this.x + this.vx) % w) > 0 ? ((this.x + this.vx) % w) : w - ((this.x + this.vx) % w);
        this.y = ((this.y + this.vy) % h) > 0 ? ((this.y + this.vy) % h) : h - ((this.y + this.vy) % h);
        this.ttl--;
    }
}

class Bullet{
    constructor(x, y, o, v, ttl, color){
        this.x = x;
        this.y = y;
        this.o = o;
        this.v = v;
        this.ttl = ttl;
        this.color = color;
    }

    update(){
        this.x = ((this.x + Math.cos(this.o) * this.v) % w) > 0 ? ((this.x + Math.cos(this.o) * this.v) % w) : w - ((this.x + Math.cos(this.o) * this.v) % w);
        this.y = ((this.y + Math.sin(this.o) * this.v) % h) > 0 ? ((this.y + Math.sin(this.o) * this.v) % h) : h - ((this.y + Math.sin(this.o) * this.v) % h);
        this.ttl--;
    }

    draw(){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;

        let x1 = this.x + Math.cos(this.o) * 10;
        let y1 = this.y + Math.sin(this.o) * 10;

        ctx.moveTo(this.x, this.y);
        ctx.lineWidth = 4;
        ctx.globalAlpha = this.ttl > 30 ? 100 : this.ttl / 30;
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
    }
}

class Asteroid{
    constructor(x, y, vx, vy, o, r, n_segments, seed, lives){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.o = o;
        this.r = r;
        this.n_segments = n_segments;
        this.seed = seed;
        this.lives = lives;
    }

    static newRandom() {
        const va = 0.2;

        return new Asteroid(
            Math.random() * w, Math.random() * h, //x ,y
            Math.random() * va, Math.random() * va, // vx, vy
            Math.random() * Math.PI * 2, // o
            4 + Math.random() * 4, //r
            4 + Math.round(Math.random() * 4), //n_segments
            Math.random(), // seed
            3 // lives
        );
    }

    draw(){
        ctx.strokeStyle = '#444444';
        ctx.shadowColor = '#444444';
        ctx.beginPath();
        for(let i = 0; i < this.n_segments; i++){
            let x1 = this.x + Math.sin(i * this.seed) * 3 + ((this.lives + 1) / 3) * 4 * this.r * Math.cos(this.o + i * Math.PI * 2 / this.n_segments);
            let y1 = this.y + Math.sin(i * this.seed) * 3 + ((this.lives + 1) / 3) * 4 * this.r * Math.sin(this.o + i * Math.PI * 2 / this.n_segments);
            ctx.lineTo(x1, y1);
        }
        let x1 = this.x + ((this.lives + 1) / 3) * 4 * this.r * Math.cos(this.o);
        let y1 = this.y + ((this.lives + 1) / 3) * 4 * this.r * Math.sin(this.o);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, ((this.lives + 1) / 3) * 4 * this.r, 0, 6.28);
        // ctx.stroke();
    }

    update(){
        const to = 0.01
        this.o = this.o > 0 ? this.o += to : this.o -= to;
        this.x = ((this.x + this.vx) % w) > 0 ? ((this.x + this.vx) % w) : w - ((this.x + this.vx) % w);
        this.y = ((this.y + this.vy) % h) > 0 ? ((this.y + this.vy) % h) : h - ((this.y + this.vy) % h);
    }
}

class Star{
    constructor(){
        this.x = (0.33 + (Math.random() * 0.33)) * w;
        this.y = (0.33 + (Math.random() * 0.33)) * h;
        this.o = Math.atan2((this.y - (h / 2)), (this.x - (w / 2)))
    }
    
    draw(){
        ctx.strokeStyle = '#aaaaaa';
        ctx.shadowColor = '#aaaaaa';
        ctx.beginPath();
        let dist = Math.dist(this.x, this.y, w /2, h / 2);
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(this.o) * 5 * (1 + dist / (w / 2)),
                   this.y + Math.sin(this.o) * 5 * (1 + dist / (h / 2)))
        ctx.stroke();
    }
}

class Enemy{
    constructor(x, y, tx, ty, cooldown){
		this.x = x;
		this.y = y;
		this.tx = tx;
        this.ty = ty;
        this.bullets = [];
        this.cooldown = cooldown;
        this.r = 15
    }

    static newRandom(){
        return new Enemy(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h, 0) //x, y, vx, vy, cooldown
    }

    draw(){
        ctx.beginPath();
        ctx.strokeStyle = "#ff0000";
        ctx.shadowColor = "#ff0000";

        let x1 = this.x;
        let y1 = this.y - this.r;

        let x2 = this.x + this.r;
        let y2 = this.y;

        let x3 = this.x;
        let y3 = this.y + this.r;

        let x4 = this.x - this.r;
        let y4 = this.y;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        this.bullets.forEach(function(bullet){
            bullet.draw();
        });
    }

    update(){
        if(Math.dist(this.x, this.y, this.tx, this.ty) < 5){
            this.tx = Math.random() * w;
            this.ty = Math.random() * h;
        }
        let o = Math.atan2(this.ty - this.y, this.tx - this.x);
        this.x += Math.cos(o) * 0.5;
        this.y += Math.sin(o) * 0.5;

        if(Math.random() < 0.001){
            let p = players[Math.round(Math.random() * (players.length - 1))];
            o = Math.atan2(p.y - this.y, p.x - this.x);
            this.bullets.push(new Bullet(this.x, this.y, o, 3, 60, '#ff5000'));
        }

        this.bullets.forEach(function(bullet){
            bullet.update();
        });

        this.bullets = this.bullets.filter(function(bullet){
            return bullet.ttl > 0;
        });
    }
}

class Keys{
	constructor(key_forward, key_shield, key_left, key_right, key_shoot){
        this.key_forward = key_forward;
        this.key_shield = key_shield;
		this.key_left = key_left;
		this.key_right = key_right;
        this.key_shoot = key_shoot;
		this.pressed = {
            forward: false,
            shield: false,
			left: false,
			right: false,
			shoot: false
        };
        $(window).on('keydown', (function(self) {return function(e) {self.onKeyDown(e, self); };})(this));
        $(window).on('keyup', (function(self) {return function(e) {self.onKeyUp(e, self); };})(this));
    }
    
    onKeyDown(e, self){
        if(e.keyCode == self.key_forward) self.pressed.forward = true;
        else if(e.keyCode == self.key_shield) self.pressed.shield = true;
        else if(e.keyCode == self.key_left) self.pressed.left = true;
        else if(e.keyCode == self.key_right) self.pressed.right = true;
        else if(e.keyCode == self.key_shoot) self.pressed.shoot = true;
    }
    
    onKeyUp(e, self){
        if(e.keyCode == self.key_forward) self.pressed.forward = false;
        else if(e.keyCode == self.key_shield) self.pressed.shield = false;
        else if(e.keyCode == self.key_left) self.pressed.left = false;
        else if(e.keyCode == self.key_right) self.pressed.right = false;
        else if(e.keyCode == self.key_shoot) self.pressed.shoot = false;
    }
}

function updateBackground(){
    stars.forEach(function(star, i){
        let dist = Math.dist(star.x , star.y, w /2 , h / 2);
        star.x += Math.cos(star.o) * 1.5 * (1 + dist / (w / 2));
        star.y += Math.sin(star.o) * 1.5 * (1 + dist / (h / 2));
        if(star.x < 0 || star.x > w || star.y < 0 || star.y > h){
            stars.splice(i, 1, new Star());
        } 
    });
}

function updateGame(){
    updateBackground();

    players.forEach(function(player){
        player.update();
        if(player.lives <= 0) endGame();
    });

    enemies.forEach(function(enemy){
        enemy.update();
    });

    asteroids.forEach(function(asteroid){
        asteroid.update();
    });

    if(Math.random() < 0.001) boosts.push(Boost.newRandom());
    boosts.forEach(function(boost){
        boost.update();
    });

    boosts = boosts.filter(function(boost){
        return boost.ttl > 0;
    });
}

function updateMenu(){
    updateBackground();
    asteroids.forEach(function(asteroid){
        asteroid.update();
    });
}

function drawBackground(){
    ctx.fillStyle = '#172634';
    ctx.fillRect(0, 0, w, h);
    stars.forEach(function(star){
        star.draw();
    });
}

function drawGame(){
    drawBackground();

    players.forEach(function(player){
        player.draw();
    });

    enemies.forEach(function(enemy){
        enemy.draw();
    });

    asteroids.forEach(function(asteroid){
        asteroid.draw();
    });

    boosts.forEach(function(boost){
        boost.draw();
    });
}


function drawMenu(){
    drawBackground();
    asteroids.forEach(function(asteroid){
        asteroid.draw();
    });
}

function gameLoop(){
    setInterval(function() {
        update();
        draw();
    }, 1000 / 60);
}

function startGame(){
    scoreboard.innerHTML = ''
    gameover.style.visibility = 'hidden';
    mainmenu.style.visibility = 'hidden';
    players = [];
    boosts = [];
    players.push(new Player(w / 2 - 10, h / 2, 0, 0, Math.PI * 1.5, 100, 5, new Keys(87, 83, 65, 68, 32), '#ffffff')); // key_forward, key_shield, key_left, key_right, key_shoot

    enemies = [];
    for(let i = 0; i < 3; i++){
        enemies.push(Enemy.newRandom());
    }

    asteroids = []
    for(let i = 0; i < 10; i++){
        asteroids.push(Asteroid.newRandom());
    }
    update = updateGame;
    draw = drawGame;
}

function endGame(){
    update = updateMenu;
    draw = drawMenu;
    gameover.style.visibility = 'visible';
}

function init(){
    scoreboard = document.getElementById('scoreboard');
    gameover = document.getElementById('game-over');
    mainmenu = document.getElementById('main-menu');
    let canvas = document.getElementById('c');
    ctx = canvas.getContext('2d', {alpha : false});
    w = canvas.width;
    h = canvas.height;
    ctx.shadowBlur = 10;
    stars = []
    while(stars.length < 10){
        stars.push(new Star())
    }
    asteroids = []
    for(let i = 0; i < 5; i++){
        asteroids.push(Asteroid.newRandom());
    }
    update = updateMenu;
    draw = drawMenu;
    gameLoop();
}

window.addEventListener('load', init);