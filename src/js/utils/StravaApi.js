import vars             from 'vars';
import axios            from 'axios';
import moment           from 'moment';
import ResultsActions   from '../actions/ResultsActions';
import ProfileActions   from '../actions/ProfileActions';

var StravaApi = class {
    constructor() {
      this.api = vars.strava;
    }

    getData() {
      axios.get(this.api.url+'athlete/activities', {
        params: {
          access_token: this.api.accessToken,
          after: moment("2016-12-01").unix()
        }
      })
      .then(function (response) {
          // console.log(response);
          ResultsActions.success(response.data);
      })
      .catch(function (response) {
        console.log('error');
        console.log(response);
        // ResultsActions.receivedAPIError({
        //   response: 'some error message'
        // });
      })
      ;
    }

    getProfile() {
      axios.get(this.api.url+'athlete', {
        params: {
          access_token: this.api.accessToken
        }
      })
      .then(function (response) {
          ProfileActions.success(response.data);
      })
      .catch(function (response) {
        console.log('profile fetch error');
        console.log(response);
        // ResultsActions.receivedAPIError({
        //   response: 'some error message'
        // });
      })
      ;
    }
}

module.exports = new StravaApi();