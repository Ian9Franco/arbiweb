import json
import random
import time
import argparse
from datetime import datetime
from pathlib import Path

class Exchange:
    def __init__(self, name, base_price, volatility):
        """
        Simulated exchange with configurable volatility
        
        Args:
            name: Exchange name
            base_price: Starting price for the asset
            volatility: How much the price can fluctuate (percentage)
        """
        self.name = name
        self.base_price = base_price
        self.volatility = volatility
        self.current_price = base_price
        
    def update_price(self):
        """Simulate price movement with random fluctuations"""
        change = random.uniform(-self.volatility, self.volatility)
        self.current_price = self.base_price * (1 + change)
        return self.current_price
    
    def get_price(self):
        """Get the current price from the exchange"""
        return self.current_price
    
    def execute_trade(self, amount, is_buy):
        """
        Simulate a trade execution
        
        Args:
            amount: Amount of asset to trade
            is_buy: True for buy, False for sell
        
        Returns:
            dict: Trade details
        """
        execution_price = self.get_price() * (1 + random.uniform(-0.001, 0.001))  # Small slippage
        
        return {
            "exchange": self.name,
            "type": "buy" if is_buy else "sell",
            "amount": amount,
            "price": execution_price,
            "timestamp": datetime.now().isoformat()
        }

class ArbitrageBot:
    def __init__(self, exchanges, min_profit_threshold=0.005, trade_amount=1.0):
        """
        Arbitrage trading bot simulator
        
        Args:
            exchanges: List of Exchange objects
            min_profit_threshold: Minimum profit percentage to execute a trade
            trade_amount: Standard amount to trade
        """
        self.exchanges = exchanges
        self.min_profit_threshold = min_profit_threshold
        self.trade_amount = trade_amount
        self.trades = []
        self.balance = 1000.0  # Starting balance in USD
        self.assets = 10.0     # Starting assets (e.g., BTC)
        self.trade_history_file = Path("arbipy/data/trade_history.json")
        self.stats_file = Path("arbipy/data/stats.json")
        
        # Create data directory if it doesn't exist
        self.trade_history_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize files if they don't exist
        if not self.trade_history_file.exists():
            with open(self.trade_history_file, "w") as f:
                json.dump([], f)
        
        if not self.stats_file.exists():
            with open(self.stats_file, "w") as f:
                json.dump({
                    "total_trades": 0,
                    "profitable_trades": 0,
                    "total_profit": 0,
                    "start_balance": self.balance,
                    "current_balance": self.balance,
                    "asset_balance": self.assets
                }, f)
    
    def find_arbitrage_opportunities(self):
        """Find price differences between exchanges that exceed the threshold"""
        opportunities = []
        
        # Update prices on all exchanges
        for exchange in self.exchanges:
            exchange.update_price()
        
        # Check each pair of exchanges for arbitrage opportunities
        for i, exchange1 in enumerate(self.exchanges):
            for j, exchange2 in enumerate(self.exchanges):
                if i == j:
                    continue
                
                price1 = exchange1.get_price()
                price2 = exchange2.get_price()
                
                # Calculate potential profit percentage
                profit_percentage = (price2 - price1) / price1
                
                if profit_percentage > self.min_profit_threshold:
                    opportunities.append({
                        "buy_exchange": exchange1,
                        "sell_exchange": exchange2,
                        "buy_price": price1,
                        "sell_price": price2,
                        "profit_percentage": profit_percentage
                    })
        
        return opportunities
    
    def execute_arbitrage(self, opportunity):
        """Execute an arbitrage trade based on the identified opportunity"""
        buy_exchange = opportunity["buy_exchange"]
        sell_exchange = opportunity["sell_exchange"]
        
        # Execute buy trade
        buy_trade = buy_exchange.execute_trade(self.trade_amount, True)
        
        # Execute sell trade
        sell_trade = sell_exchange.execute_trade(self.trade_amount, False)
        
        # Calculate profit
        cost = buy_trade["price"] * buy_trade["amount"]
        revenue = sell_trade["price"] * sell_trade["amount"]
        profit = revenue - cost
        
        # Update balances
        self.balance = self.balance - cost + revenue
        
        # Record the arbitrage trade
        arbitrage_record = {
            "buy_trade": buy_trade,
            "sell_trade": sell_trade,
            "profit": profit,
            "profit_percentage": opportunity["profit_percentage"],
            "timestamp": datetime.now().isoformat()
        }
        
        self.trades.append(arbitrage_record)
        
        # Save to file
        self._save_trade(arbitrage_record)
        self._update_stats(profit > 0, profit)
        
        return arbitrage_record
    
    def _save_trade(self, trade):
        """Save a trade to the trade history file"""
        try:
            with open(self.trade_history_file, "r") as f:
                trades = json.load(f)
            
            trades.append(trade)
            
            with open(self.trade_history_file, "w") as f:
                json.dump(trades, f, indent=2)
        except Exception as e:
            print(f"Error saving trade: {e}")
    
    def _update_stats(self, is_profitable, profit):
        """Update the trading statistics"""
        try:
            with open(self.stats_file, "r") as f:
                stats = json.load(f)
            
            stats["total_trades"] += 1
            if is_profitable:
                stats["profitable_trades"] += 1
            stats["total_profit"] += profit
            stats["current_balance"] = self.balance
            stats["asset_balance"] = self.assets
            
            with open(self.stats_file, "w") as f:
                json.dump(stats, f, indent=2)
        except Exception as e:
            print(f"Error updating stats: {e}")
    
    def run_simulation(self, iterations, interval=1.0):
        """
        Run the arbitrage simulation for a specified number of iterations
        
        Args:
            iterations: Number of simulation cycles to run
            interval: Time between iterations in seconds
        """
        print(f"Starting arbitrage simulation for {iterations} iterations...")
        
        for i in range(iterations):
            print(f"\nIteration {i+1}/{iterations}")
            
            # Find arbitrage opportunities
            opportunities = self.find_arbitrage_opportunities()
            
            if opportunities:
                # Sort by profit percentage and execute the best opportunity
                best_opportunity = max(opportunities, key=lambda x: x["profit_percentage"])
                
                print(f"Found arbitrage opportunity: Buy on {best_opportunity['buy_exchange'].name} at {best_opportunity['buy_price']:.2f}, "
                      f"Sell on {best_opportunity['sell_exchange'].name} at {best_opportunity['sell_price']:.2f}")
                
                trade_result = self.execute_arbitrage(best_opportunity)
                
                print(f"Executed trade with profit: ${trade_result['profit']:.2f} "
                      f"({trade_result['profit_percentage']*100:.2f}%)")
            else:
                print("No arbitrage opportunities found in this iteration.")
            
            # Display current prices
            print("Current prices:")
            for exchange in self.exchanges:
                print(f"  {exchange.name}: ${exchange.get_price():.2f}")
            
            print(f"Current balance: ${self.balance:.2f}")
            
            # Wait before next iteration
            if i < iterations - 1:
                time.sleep(interval)
        
        print("\nSimulation completed.")
        print(f"Final balance: ${self.balance:.2f}")
        print(f"Total trades executed: {len(self.trades)}")

def main():
    """Main entry point for the arbitrage bot simulator"""
    parser = argparse.ArgumentParser(description="Arbitrage Trading Bot Simulator")
    parser.add_argument("--iterations", type=int, default=10, help="Number of simulation iterations")
    parser.add_argument("--interval", type=float, default=1.0, help="Time between iterations (seconds)")
    parser.add_argument("--threshold", type=float, default=0.005, help="Minimum profit threshold (percentage)")
    args = parser.parse_args()
    
    # Create simulated exchanges
    exchanges = [
        Exchange("Binance", 50000, 0.02),  # Base price $50,000, 2% volatility
        Exchange("Coinbase", 50100, 0.025), # Base price $50,100, 2.5% volatility
        Exchange("Kraken", 49900, 0.03)     # Base price $49,900, 3% volatility
    ]
    
    # Create and run the arbitrage bot
    bot = ArbitrageBot(exchanges, min_profit_threshold=args.threshold)
    bot.run_simulation(args.iterations, args.interval)

if __name__ == "__main__":
    main()

