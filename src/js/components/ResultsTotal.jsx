import React        from 'react';
import classNames   from 'classnames';
import moment       from 'moment';
import lodash       from 'lodash';

import ResultsStore from '../stores/ResultsStore';
import Profile      from './Profile.jsx';
import Format       from '../utils/Format'

var totalDuration = 0;
/**
 * get actual values from the store
 * @param   {Int}   type        direction of the flight 0/1
 * @return  Object              Component state
 */
function getStateFromStores(startDate, endDate) {
    return ResultsStore.getResultsState(startDate, endDate);
}

var ResultsTotal = React.createClass({

    getInitialState: function() {
        return getStateFromStores(this.props.startDate, this.props.endDate);
    },

    componentDidMount: function() {
        ResultsStore.addChangeListener(this._onChange);
    },

    /**
     * clean component before unmount
     * @return null
     */
    componentWillUnmount: function() {
        ResultsStore.removeChangeListener(this._onChange);
    },

    /**
     * Event handler for 'change' events coming from the MessageStore
     */
    _onChange: function() {
        this.setState(getStateFromStores(this.props.startDate, this.props.endDate));
    },

    infoDistance: function(distance) {
      if (distance > 0) {
        return <div className="sport-total__distance">distance: { distance }km</div>
      }
      return null;
    },

    infoListTypes: function(activities) {
      let types = [],
          rows = []
          ;
      if (activities.length) {
        for (let item of activities) {
          types.push(item.type);
        }
      } else {
        return null;
      }

      types = _.uniq(types);
      let i = 0;
      for (let item of types) {
        i++;
        rows.push(
          <p key={ i } className="sport-total__types-item">{ item }</p>
        );
      }

      return (
        <div className="sport-total__types">
          types:
          { rows }
        </div>
      );
    },

    getSportInfo: function(sport) {
        let activities = sport.activities,
            cls = classNames('results-sport', 'results-sport--' + sport.type),
            time = (activities) ? Format.getTimeFormat(sport.duration) : 0,
            sessions = activities.length,
            style = {
              height: sport.percentage + "%"
            }
            ;

        return (
            <div className={ cls }>
                <div className="results-sport__content">
                    <div className="sport-total">
                        <div className="sport-total__title">{ sport.type }</div>
                        <div className="sport-total__sessions">sessions: { sessions }</div>
                        <div className="sport-total__hours">time: { time }</div>
                        { this.infoDistance(Format.getTotalDistance(activities)) }
                        { this.infoListTypes(activities) }
                        <div className="sport-total__graph">
                          <div className="sport-total__graph-cursor" style={ style } >
                            <span className="sport-total__graph-text">{ sport.percentage }%</span>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    showSports: function() {
        if (!this.state.sports) {
          return null;
        }
        let sports = [{
            activities: this.state.sports.bike || [],
            type: 'bike',
            duration: 0,
            percentage: 0
        },
        {
            activities: this.state.sports.run || [],
            type: 'run',
            duration: 0,
            percentage: 0
        },
        {
            activities: this.state.sports.swim || [],
            type: 'swim',
            duration: 0,
            percentage: 0
        },
        {
            activities: this.state.sports.other || [],
            type: 'other',
            duration: 0,
            percentage: 0
        }]
        ;

        totalDuration = 0;
        for (let item of sports) {
            item.duration = Format.getTotalTime(item.activities);
            totalDuration += item.duration;
        }

        for (let item of sports) {
          item.percentage = (totalDuration > 0) ? Math.round(item.duration*100/totalDuration) : 0;
        }

        return (
            <div className="results-total__activities">
              { this.getSportInfo(sports[0]) }
              { this.getSportInfo(sports[1]) }
              { this.getSportInfo(sports[2]) }
              { this.getSportInfo(sports[3]) }
            </div>
        );
    },

    render: function() {
        let days = moment().diff(moment(this.props.startDate), 'days'),
            title = (this.props.type === "all") ? "Until today." : "My week."
            ;

        return (
            <div className="wrap">
              <div className="results-total">
                  <div className="results-total__intro">

                    <div className="results-intro__description">
                      <div className="results-intro__title">{ title }</div>
                      <div className="results-intro__stats">
                        <div className="results-intro__stats-col">
                          <div><span>Total days:</span><strong>{ days }</strong></div>
                          <div><span>Total Sessions:</span><strong>{ this.state.all.length }</strong></div>
                        </div>
                        <div className="results-intro__stats-col">
                          <div><span>Total time:</span><strong>{ Format.getTimeFormat(Format.getTotalTime(this.state.all)) }</strong></div>
                          <div><span>Total distance:</span><strong>{ Format.getTotalDistance(this.state.all) }km</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                { this.showSports() }
              </div>
            </div>
        );
    }
});

module.exports = ResultsTotal;
