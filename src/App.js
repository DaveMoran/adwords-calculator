import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'AdWords Budget Planner',
      monthlyBudget: 0,
      currentSpend: 0,
      remainingBudget: 0
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
              <Campaigns />
            </div>
            <div className="col-sm-6">
              <h2>Suggestions</h2>
              <Suggestions 
                remainingBudget={remainingBudget}
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
    return (
      <form>
        <label htmlFor="campaign-1">Campaign 1
          <input id="campaign-1" type="text" />
        </label>
        <label htmlFor="budget-1">Budget:
          <input id="budget-1" type="number" />
        </label> <br />
        <label htmlFor="campaign-2">Campaign 2
          <input id="campaign-2" type="text" />
        </label>
        <label htmlFor="budget-2">Budget:
          <input id="budget-2" type="number" />
        </label> <br />
      </form>
    )
  }
}

class Suggestions extends Component {
  render() {
    const { remainingBudget } = this.props
    return (
      <div className="suggestions">
        <p>You currently have ${remainingBudget} left to spend this month</p>
        <p>To stay on track, update the following campaign's daily bids to the following:</p>
        <ul>
          <li>Campaign 1: $$$</li>
          <li>Campaign 2: $$$</li>
        </ul>
      </div>
    )
  }
}

export default App;
