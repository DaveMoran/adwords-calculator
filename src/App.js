import React, { Component } from 'react';
import fire from './fire';
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
    this.onItemBudgetChange = this.onItemBudgetChange.bind(this);
    this.calculateRemainingBudget = this.calculateRemainingBudget.bind(this);
    this.calculateSuggestedBudgets = this.calculateSuggestedBudgets.bind(this);
    this.addNewCampaign = this.addNewCampaign.bind(this);
    this.removeCampaign = this.removeCampaign.bind(this);
  }

  componentWillMount() {
    /* Create reference to campaigns in Firebase Database */
    let campaignsRef = fire.database().ref('campaigns').orderByKey().limitToLast(100);
    campaignsRef.on('child_added', snapshot => {
      /* Update React state when campaign is added at Firebase Database */
      let campaign = {
        [snapshot.key]: {
          name: snapshot.val().name,
          budget: snapshot.val().budget,
          suggestedBudget: snapshot.val().suggestedBudget
        }
      }      
      this.setState({ campaigns: [campaign].concat(this.state.campaigns) });
    }).bind(this);

    campaignsRef.on('child_removed', snapshot => {
    const currentCampaigns = this.state.campaigns;
      for(var i in currentCampaigns) {
        if(Object.keys(currentCampaigns[i])[0] === snapshot.key) {
          currentCampaigns.splice(i, 1);
        }
      }
      this.setState({
        campaigns: currentCampaigns
      })
    }).bind(this);

    

    let monthlyBudgetRef = fire.database().ref('monthlyBudget');
    monthlyBudgetRef.on('value', snapshot => {
      this.setState({ monthlyBudget: snapshot.val() })
    }).bind(this);
    
    let currentSpendRef = fire.database().ref('currentSpend');
    currentSpendRef.on('value', snapshot => {
      this.setState({ currentSpend: snapshot.val() })
    }).bind(this);
    
    let remainingBudgetRef = fire.database().ref('remainingBudget');
    remainingBudgetRef.on('value', snapshot => {
      this.setState({ remainingBudget: snapshot.val() })
    }).bind(this);

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
    fire.database().ref('monthlyBudget').set(parseInt(event.target.value, 10));
  }
  
  onSpendChange(event) {
    fire.database().ref('currentSpend').set(parseInt(event.target.value, 10));
  }

  onItemNameChange(event) {
    const itemID = event.target.id.replace('-label', '');
    let campaignRef = fire.database().ref('campaigns').child(itemID);
    campaignRef.child('name').set(event.target.value)
  }
  
  onItemBudgetChange(event) {
    const itemID = event.target.id.replace('-budget', '');
    const currentCampaigns = this.state.campaigns;
    for (var i in currentCampaigns) {
      if(currentCampaigns[i].id == itemID) {
        currentCampaigns[i].budget = event.target.value
      }
    }

    this.setState({
      campaigns: currentCampaigns
    })
  }

  calculateRemainingBudget(event) {
    event.preventDefault();    
    let monthlyBudget = this.state.monthlyBudget;
    let currentSpend = this.state.currentSpend;
    let remainingBudget = monthlyBudget - currentSpend;
    fire.database().ref('remainingBudget').set(parseInt(remainingBudget, 10));
  }

  addNewCampaign(event){
    event.preventDefault();
    let campaignsRef = fire.database().ref('campaigns');
    let newCampaignRef = campaignsRef.push();
    newCampaignRef.set({
      name: '',
      budget: 0,
      suggestedBudget: 0
    })
  }

  removeCampaign(event) {
    event.preventDefault();
    const itemID = event.target.id.replace('-delete', '');
    const campaignsRef = fire.database().ref('campaigns');
    const childRef = campaignsRef.child(itemID);
    if(this.state.campaigns.length === 1) {
      campaignsRef.set('')
    } else {
      childRef.remove();
    }
  }

  calculateSuggestedBudgets(event){
    event.preventDefault();

    const allCampaigns = this.state.campaigns;
    for(var i in allCampaigns) {
      let budgetRatio = (allCampaigns[i].budget * 30.4 / this.state.monthlyBudget);
      allCampaigns[i].suggestedBudget = Math.round(100 * (this.state.remainingBudget * budgetRatio / this.state.daysLeftInMonth)) / 100; 
    }

    this.setState({
      campaigns: allCampaigns
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
                removeCampaign={this.removeCampaign}
                onItemNameChange={this.onItemNameChange}
                onItemBudgetChange={this.onItemBudgetChange}
                calculateSuggestedBudgets={this.calculateSuggestedBudgets}
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
      removeCampaign,
      onItemNameChange,
      onItemBudgetChange,
      calculateSuggestedBudgets
     } = this.props;
    return (
      <form>
        { campaigns && campaigns.map( item => 
          <div key={Object.keys(item)[0]} className="row">
            <div className="col-sm-5">
              <div className="form-group">
                <label htmlFor={Object.keys(item)[0] + '-label'}>Campaign</label>
                <input 
                  id={Object.keys(item)[0] + '-label'}
                  className="form-control"
                  type="text"
                  value={item[ Object.keys(item)[0] ].name}
                  onChange={onItemNameChange}
                />
              </div>
            </div>
            <div className="col-sm-5">
              <div className="form-group">
                <label htmlFor={Object.keys(item)[0] + '-budget'}>Daily Budget</label>
                <input 
                  id={Object.keys(item)[0] + '-budget'}
                  className="form-control"
                  type="number"
                  value={item[ Object.keys(item)[0] ].budget}
                  onChange={onItemBudgetChange}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <label>Delete</label>
              <button
                id={Object.keys(item)[0] + '-delete'} 
                className="btn btn-danger" 
                onClick={removeCampaign}
              >
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        )}
        <button 
          className="btn btn-primary" 
          onClick={addNewCampaign}
        >
          Add New Campaign
        </button>
        <button 
          className="btn btn-success"
          onClick={calculateSuggestedBudgets}
        >
          Calculate Budgets
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
          <li key={Object.keys(item)[0]}>{item[ Object.keys(item)[0] ].name}: ${item[ Object.keys(item)[0] ].suggestedBudget}</li>  
        )}
        </ul>
      </div>
    )
  }
}

export default App;
