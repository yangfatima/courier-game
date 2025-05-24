class Game {
    constructor() {
        this.courier = document.getElementById('courier');
        this.recipient = document.getElementById('recipient');
        this.message = document.getElementById('message');
        this.moodValue = document.getElementById('mood-value');
        this.deliveryCount = document.getElementById('delivery-count');
        this.startButton = document.getElementById('start-game');
        
        this.mood = 100;
        this.deliveries = 0;
        this.isGameRunning = false;
        this.courierPosition = { x: 0, y: 0 };
        this.recipientPosition = { x: 0, y: 0 };
        
        this.recipientTypes = [
            {
                name: "挑剔型",
                messages: [
                    "这个包装怎么这么差？",
                    "我等了这么久，你们效率太低了！",
                    "我要投诉你们！"
                ],
                moodEffect: -20
            },
            {
                name: "友好型",
                messages: [
                    "谢谢，辛苦了！",
                    "天气这么热，喝点水吧！",
                    "你们真不容易，谢谢！"
                ],
                moodEffect: 10
            },
            {
                name: "冷漠型",
                messages: [
                    "放那吧",
                    "嗯",
                    "知道了"
                ],
                moodEffect: -5
            }
        ];

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        this.isGameRunning = true;
        this.mood = 100;
        this.deliveries = 0;
        this.updateUI();
        this.placeRecipient();
        this.placeCourier();
        this.startButton.disabled = true;
    }

    placeCourier() {
        this.courierPosition = {
            x: Math.random() * (this.getGameAreaWidth() - 40),
            y: Math.random() * (this.getGameAreaHeight() - 40)
        };
        this.updateCourierPosition();
    }

    placeRecipient() {
        this.recipientPosition = {
            x: Math.random() * (this.getGameAreaWidth() - 40),
            y: Math.random() * (this.getGameAreaHeight() - 40)
        };
        this.recipient.style.left = this.recipientPosition.x + 'px';
        this.recipient.style.top = this.recipientPosition.y + 'px';
    }

    getGameAreaWidth() {
        return document.querySelector('.game-area').offsetWidth;
    }

    getGameAreaHeight() {
        return document.querySelector('.game-area').offsetHeight;
    }

    updateCourierPosition() {
        this.courier.style.left = this.courierPosition.x + 'px';
        this.courier.style.top = this.courierPosition.y + 'px';
    }

    handleKeyPress(e) {
        if (!this.isGameRunning) return;

        const speed = 10;
        switch(e.key) {
            case 'ArrowUp':
                this.courierPosition.y = Math.max(0, this.courierPosition.y - speed);
                break;
            case 'ArrowDown':
                this.courierPosition.y = Math.min(this.getGameAreaHeight() - 40, this.courierPosition.y + speed);
                break;
            case 'ArrowLeft':
                this.courierPosition.x = Math.max(0, this.courierPosition.x - speed);
                break;
            case 'ArrowRight':
                this.courierPosition.x = Math.min(this.getGameAreaWidth() - 40, this.courierPosition.x + speed);
                break;
            case ' ':
                this.interactWithRecipient();
                break;
        }
        this.updateCourierPosition();
    }

    interactWithRecipient() {
        const distance = Math.sqrt(
            Math.pow(this.courierPosition.x - this.recipientPosition.x, 2) +
            Math.pow(this.courierPosition.y - this.recipientPosition.y, 2)
        );

        if (distance < 50) {
            const recipientType = this.recipientTypes[Math.floor(Math.random() * this.recipientTypes.length)];
            const message = recipientType.messages[Math.floor(Math.random() * recipientType.messages.length)];
            
            this.showMessage(message);
            this.updateMood(recipientType.moodEffect);
            this.deliveries++;
            this.updateUI();
            
            setTimeout(() => {
                this.placeRecipient();
            }, 2000);
        }
    }

    showMessage(text) {
        this.message.textContent = text;
        this.message.style.display = 'block';
        this.message.style.left = (this.courierPosition.x + 50) + 'px';
        this.message.style.top = (this.courierPosition.y - 30) + 'px';
        
        setTimeout(() => {
            this.message.style.display = 'none';
        }, 2000);
    }

    updateMood(value) {
        this.mood = Math.max(0, Math.min(100, this.mood + value));
        if (this.mood <= 0) {
            this.gameOver();
        }
    }

    updateUI() {
        this.moodValue.textContent = this.mood;
        this.deliveryCount.textContent = this.deliveries;
    }

    gameOver() {
        this.isGameRunning = false;
        this.startButton.disabled = false;
        alert(`游戏结束！\n你完成了 ${this.deliveries} 次派送\n最终心情值：${this.mood}`);
    }
}

// 初始化游戏
const game = new Game(); 