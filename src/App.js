import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'AdWords Budget Planner',
      monthlyBudget: 0,
      currentSpend: 0,
      remainingBudget: 0,
      daysLeftInMonth: 0,
      campaigns: []
    }

    this.onBudgetChange = this.onBudgetChange.bind(this);
    this.onSpendChange = this.onSpendChange.bind(this);
    this.onItemNameChange = this.onItemNameChange.bind(this);
    this.calculateRemainingBudget = this.calculateRemainingBudget.bind(this);
    this.addNewCampaign = this.addNewCampaign.bind(this);
  }

  componentDidMount(){
    const today = new Date();
    const now = today.getDate();
    const month = today.getMonth();

    const monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    this.setState({
      daysLeftInMonth: (monthArray[month] - now + 1)
    })
  }
  
  onBudgetChange(event) {
    this.setState({
      monthlyBudget: event.target.value,
    });
  }

  onItemNameChange(event) {
    const itemID = event.target.id.replace('-label', '');
    const currentCampaigns = this.state.campaigns;
    for (var i in currentCampaigns) {
      if(currentCampaigns[i].id == itemID) {
        currentCampaigns[i].name = event.target.value
      }
    }

    this.setState({
      campaigns: currentCampaigns
    })
  }

  onSpendChange(event) {
    this.setState({
      currentSpend: event.target.value,
    });
  }

  calculateRemainingBudget(event) {
    event.preventDefault();    
    this.setState({
      remainingBudget: this.state.monthlyBudget - this.state.currentSpend,
    })
  }

  addNewCampaign(event){
    event.preventDefault();
    const {campaigns} = this.state;
    let timestamp = Date.now();
    this.setState({
      campaigns: [
        ...campaigns,
        {
          id: [timestamp],
          name: '',
          budget: 0
        }
      ]
    })
  }

  render() {
    const {
      title, 
      monthlyBudget, 
      currentSpend,
      remainingBudget,
      daysLeftInMonth,
      campaigns
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
                calculateRemainingBudget={this.calculateRemainingBudget}
              />
              <hr />
              <Campaigns
                campaigns={campaigns}
                addNewCampaign={this.addNewCampaign}
                onItemNameChange={this.onItemNameChange}
              />
            </div>
            <div className="col-sm-6">
              <h2>Suggestions</h2>
              <Suggestions 
                remainingBudget={remainingBudget}
                campaigns={campaigns}
                daysLeftInMonth={daysLeftInMonth}
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
      onSpendChange,
      calculateRemainingBudget
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
        <button 
          type="submit" 
          className="btn btn-primary"
          onClick={calculateRemainingBudget}>Calculate</button>
      </form>
    )
  }
}

class Campaigns extends Component {
  render() {
    const { 
      campaigns,
      addNewCampaign,
      onItemNameChange
     } = this.props;
    return (
      <form>
        { campaigns && campaigns.map( item =>
          <div key={item.id} className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor={item.id + '-label'}>Campaign</label>
                <input 
                  id={item.id + '-label'}
                  className="form-control"
                  type="text"
                  value={item.name}
                  onChange={onItemNameChange}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor={item.id + '-budget'}>Budget</label>
                <input 
                  id={item.id + '-budget'}
                  className="form-control"
                  type="number"
                  value={item.budget}
                />
              </div>
            </div>
          </div>
        )}
        <button 
          className="btn btn-primary" 
          onClick={addNewCampaign}
        >
          Add New Campaign
        </button>
      </form>
    )
  }
}

class Suggestions extends Component {

  render() {
    const { 
      remainingBudget,
      daysLeftInMonth,
      campaigns
    } = this.props
    return (
      <div className="suggestions">
        <p>You currently have ${remainingBudget} left to spend in the next {daysLeftInMonth} day(s).</p>
        <ul>
        { campaigns && campaigns.map( item =>
          <li key={item.id}>{item.name}: ${item.budget}</li>  
        )}
        </ul>
      </div>
    )
  }
}

export default App;
