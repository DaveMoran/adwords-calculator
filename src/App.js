import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'AdWords Budget Planner',
      monthlyBudget: 0,
      currentSpend: 0
    }

    this.onBudgetChange = this.onBudgetChange.bind(this);
    this.onSpendChange = this.onSpendChange.bind(this);
  }
  
  onBudgetChange(event) {
    this.setState({
      monthlyBudget: event.target.value
    })
  }

  onSpendChange(event) {
    this.setState({
      currentSpend: event.target.value
    })
  }

  render() {
    const {
      title, 
      monthlyBudget, 
      currentSpend
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>{title}</h2>
        </div>
        <div className="container">
          <div className="col-12 col-sm-6">
            <Budget 
              budget={monthlyBudget}
              spend={currentSpend}
              onBudgetChange={this.onBudgetChange}
              onSpendChange={this.onSpendChange}
            />
            <hr />
            <Campaigns />
            <Suggestions />
          </div>
          <div className="col-12 col-sm-6">

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
          <label htmlFor="remainingBudget" className="col-sm-6 col-form-label">Remaining Budget</label>
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
    return (
      <div className="suggestions">
        <div className="campaign-1">Campaign 1: $2000</div>
        <div className="campaign-2">Campaign 2: $1000</div>
      </div>
    )
  }
}

export default App;
