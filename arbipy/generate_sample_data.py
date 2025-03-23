import json
import random
from datetime import datetime, timedelta
from pathlib import Path

def generate_sample_data(days=30, trades_per_day=5):
    """
    Generate sample arbitrage trade data for demonstration purposes
    
    Args:
        days: Number of days of historical data to generate
        trades_per_day: Average number of trades per day
    """
    exchanges = ["Binance", "Coinbase", "Kraken", "Huobi", "FTX"]
    base_price = 50000  # Base BTC price
    
    trades = []
    stats = {
        "total_trades": 0,
        "profitable_trades": 0,
        "total_profit": 0,
        "start_balance": 1000.0,
        "current_balance": 1000.0,
        "asset_balance": 10.0,
        "daily_profits": []
    }
    
    current_date = datetime.now() - timedelta(days=days)
    
    for day in range(days):
        daily_profit = 0
        daily_trades = random.randint(max(1, trades_per_day - 2), trades_per_day + 2)
        
        for _ in range(daily_trades):
            # Randomly select exchanges
            buy_exchange = random.choice(exchanges)
            sell_exchange = random.choice([e for e in exchanges if e != buy_exchange])
            
            # Generate random prices with a small spread
            price_volatility = random.uniform(-0.05, 0.05)
            buy_price = base_price * (1 + price_volatility)
            sell_price = buy_price * (1 + random.uniform(0.001, 0.02))  # Ensure some profit
            
            # Random trade amount
            amount = random.uniform(0.1, 0.5)
            
            # Calculate profit
            cost = buy_price * amount
            revenue = sell_price * amount
            profit = revenue - cost
            profit_percentage = (sell_price - buy_price) / buy_price
            
            # Create timestamp within the current day
            hours = random.randint(0, 23)
            minutes = random.randint(0, 59)
            seconds = random.randint(0, 59)
            timestamp = (current_date + timedelta(hours=hours, minutes=minutes, seconds=seconds)).isoformat()
            
            # Create trade record
            trade = {
                "buy_trade": {
                    "exchange": buy_exchange,
                    "type": "buy",
                    "amount": amount,
                    "price": buy_price,
                    "timestamp": timestamp
                },
                "sell_trade": {
                    "exchange": sell_exchange,
                    "type": "sell",
                    "amount": amount,
                    "price": sell_price,
                    "timestamp": timestamp
                },
                "profit": profit,
                "profit_percentage": profit_percentage,
                "timestamp": timestamp
            }
            
            trades.append(trade)
            daily_profit += profit
            
            # Update stats
            stats["total_trades"] += 1
            if profit > 0:
                stats["profitable_trades"] += 1
            stats["total_profit"] += profit
            stats["current_balance"] += profit
        
        # Add daily profit record
        stats["daily_profits"].append({
            "date": current_date.strftime("%Y-%m-%d"),
            "profit": daily_profit
        })
        
        # Move to next day
        current_date += timedelta(days=1)
    
    # Create data directory if it doesn't exist
    data_dir = Path("arbipy/data")
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Save trade history
    with open(data_dir / "trade_history.json", "w") as f:
        json.dump(trades, f, indent=2)
    
    # Save stats
    with open(data_dir / "stats.json", "w") as f:
        json.dump(stats, f, indent=2)
    
    print(f"Generated {len(trades)} sample trades over {days} days")
    print(f"Total profit: ${stats['total_profit']:.2f}")
    print(f"Final balance: ${stats['current_balance']:.2f}")

if __name__ == "__main__":
    generate_sample_data()

