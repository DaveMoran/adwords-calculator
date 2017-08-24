import React, { Component } from 'react';
import './App.css';

const list = [
  {
    adgroup: 'CoolSculpting',
    budget: 3000
  },
  {
    adgroup: 'Weight Loss',
    budget: 1000
  }
]

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'AdWords Budget Planner'
    }
  }

  render() {
    const {title} = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>{title}</h2>
        </div>
        <Budget />
        <Campaigns />
        <Suggestions />
      </div>
    );
  }
}

class Budget extends Component {
  render() {
    return (
      <form>
        <label for="monthlyBudget">Monthly Budget
          <input id="monlthyBudget" type="number" />
        </label> <br />
        <label for="remainingBudget">Remaining Budget
          <input id="remainingBudget" type="number" />
        </label>
      </form>
    )
  }
}

class Campaigns extends Component {
  render() {
    return (
      <form>
        <label for="campaign-1">Campaign 1
          <input id="campaign-1" type="text" />
        </label>
        <label for="budget-1">Budget:
          <input id="budget-1" type="number" />
        </label> <br />
        <label for="campaign-2">Campaign 2
          <input id="campaign-2" type="text" />
        </label>
        <label for="budget-2">Budget:
          <input id="budget-2" type="number" />
        </label> <br />
      </form>
    )
  }
}

class Suggestions extends Component {
  render() {
    return (
      <div class="suggestions">
        <div class="campaign-1">Campaign 1: $2000</div>
        <div class="campaign-2">Campaign 2: $1000</div>
      </div>
    )
  }
}

export default App;
