import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'AdWords Budget Planner',
      monthlyBudget: 3000,
      currentSpend: 1500,
      remainingBudget: 1500
    }

    this.onBudgetChange = this.onBudgetChange.bind(this);
    this.onSpendChange = this.onSpendChange.bind(this);
  }
  
  onBudgetChange(event) {
    const currentBudget = event.target.value;
    const currentSpend = this.state.currentSpend;
    this.setState({
      monthlyBudget: event.target.value,
      remainingBudget: currentBudget - currentSpend
    });
  }

  onSpendChange(event) {
    const currentBudget = this.state.monthlyBudget;
    const currentSpend = event.target.value;
    this.setState({
      currentSpend: event.target.value,
      remainingBudget: currentBudget - currentSpend
    });
  }

  render() {
    const {
      title, 
      monthlyBudget, 
      currentSpend,
      remainingBudget
    } = this.state;

    const campaigns = [
      {
        name: 'CoolSculpting',
        budget: 2000,
        ratio: (2000 / 3000)
      },
      {
        name: 'Weight Loss',
        budget: 1000,
        ratio: (1000 / 3000)
      }
    ]

    return (
      <div className="App">
        <div className="App-header">
          <h2>{title}</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <h2>Calculations</h2>
              <Budget 
                budget={monthlyBudget}
                spend={currentSpend}
                onBudgetChange={this.onBudgetChange}
                onSpendChange={this.onSpendChange}
              />
              <hr />
              <Campaigns
                campaigns={campaigns} 
              />
            </div>
            <div className="col-sm-6">
              <h2>Suggestions</h2>
              <Suggestions 
                remainingBudget={remainingBudget}
                campaigns={campaigns}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Budget extends Component {
  render() {
    const {
      budget, 
      spend,
      onBudgetChange,
      onSpendChange
    } = this.props;

    return (
      <form>
        <div className="form-group row">
          <label htmlFor="monthlyBudget" className="col-sm-6 col-form-label">Monthly Budget</label>
          <div className="col-sm-6">
            <input 
              id="monthlyBudget" 
              className="form-control"
              type="number" 
              value={budget} 
              onChange={onBudgetChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="remainingBudget" className="col-sm-6 col-form-label">Current Spend</label>
          <div className="col-sm-6">
            <input 
              id="remainingBudget" 
              className="form-control"
              type="number" 
              value={spend} 
              onChange={onSpendChange}
            />
          </div>
        </div>
      </form>
    )
  }
}

class Campaigns extends Component {
  render() {
    const { campaigns } = this.props;
    return (
      <form>
        { campaigns.map( item =>
          <div key={item.name} className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="campaign1">Campaign</label>
                <input 
                  id="campaign1"
                  className="form-control"
                  type="text"
                  defaultValue={item.name}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="campaign1">Budget</label>
                <input 
                  id="campaign1"
                  className="form-control"
                  type="number"
                  value={item.budget}
                />
              </div>
            </div>
          </div>
        )}
        
      </form>
    )
  }
}

class Suggestions extends Component {
  constructor(props){
    super(props);
  }

  calculateRemainingBudget(remainingBudget, ratio){
    return Math.round( (remainingBudget * ratio) * 100 ) / 100;
  }

  render() {
    const { 
      remainingBudget,
      campaigns
    } = this.props
    return (
      <div className="suggestions">
        <p>You currently have ${remainingBudget} left to spend this month</p>
        <p>To stay on track, update the following campaign's daily bids to the following:</p>
        <ul>
          { campaigns.map( item =>
            <li key={item.name}>{item.name}: ${this.calculateRemainingBudget(remainingBudget, item.ratio)}</li>
          )}
        </ul>
      </div>
    )
  }
}

export default App;
