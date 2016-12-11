import React        from 'react';
import ReactDOM     from 'react-dom';

import Timer        from './components/Timer.jsx';
import Results      from './components/Results.jsx';
import Profile      from './components/Profile.jsx';
import Instagram    from './components/Instagram.jsx';
import Day          from './components/Day.jsx';

// Render FluxCartApp Controller View
ReactDOM.render(
    <div>
        <Timer />
        <Day />
        <Results />
        <Instagram />
    </div>,
  document.getElementById('app')
);
