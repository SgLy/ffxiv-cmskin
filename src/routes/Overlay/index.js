import { connect } from 'dva';
import { Component } from 'react';
import classnames from 'classnames/bind';
import { View, Lang } from '../../components';
import ViewHeader from './ViewHeader';
import TabSplash from './TabSplash';
import TabList from './TabList';
import TabGroup from './TabGroup';
import { getSetting } from '../../utils/getSetting';
import _ from 'lodash';
import Package from '../../../package.json';
import style from './index.scss';

const { Header, Content, Bar, Footer, Split } = View;
const Setting = [
  'fullscreen',
  'uiMini',
  'uiTrans',
  'uiAutoMini',
  'uiAutoMiniActive',
  'normalFull',
  'normalMini',
  'normalDamage',
  'normalHeal',
  'normalTank',
];

const State = state => {
  const act = state.act[state.setting.historyPage];
  return {
    timeout: 0,
    Encounter: act ? act.Encounter : {},
    Combatant: act ? act.Combatant : {},
    Chart: act ? act.Chart : {},
    isActive: act ? act.isActive : false,
    ...getSetting(Setting, state.setting),
  };
};

class Overlay extends Component {
  state = {
    tab: 'dps',
  };

  tabClass = tab => {
    const tabClass = classnames.bind(style)('tab', { active: this.state.tab === tab });
    return (
      <span key={tab} className={tabClass} onClick={() => this.setState({ tab: tab })}>
        <Lang id={`footer.${tab}`} />
      </span>
    );
  };

  render() {
    const $ = this.props;

    let BarInner = (
      <span className={style.title}>
        <Lang id="normal.waiting" />
      </span>
    );
    let ContentInner = <TabSplash data={Package} />;
    let FooterInner = [];

    if ($.isActive) window.active = true;

    if (window.active) {
      if ($.uiAutoMiniActive) {
        const ifMini = $.Combatant.length > $.uiAutoMini;
        if ($.uiMini !== ifMini)
          this.props.dispatch({ type: 'setting/update', payload: { uiMini: ifMini } });
      }

      BarInner = $.normalFull.map(item => (
        <span key={item} className={style.title}>
          <Lang id={`encounter.${item}`} />: {_.result($.Encounter, item)}
        </span>
      ));
      // 暂时移出团队区域图
      // <TabGroup Encounter={$.Encounter} Combatant={$.Combatant} Chart={$.Chart} />
      ContentInner =
        this.state.tab === 'all' ? (
          <TabGroup Encounter={$.Encounter} Combatant={$.Combatant} />
        ) : (
          <TabList
            tab={this.state.tab}
            Combatant={$.Combatant}
            Encounter={$.Encounter}
            chart={$.Chart}
            time={$.Encounter ? $.Encounter.duration : ''}
          />
        );

      FooterInner = [
        this.tabClass('dps'),
        this.tabClass('heal'),
        this.tabClass('tank'),
        this.tabClass('all'),
      ];
    }

    BarInner = $.uiMini ? null : <Bar key="bar">{BarInner}</Bar>;

    return (
      <View
        transparent={$.uiTrans}
        style={$.fullscreen || this.state.tab === 'all' ? { height: '100%' } : {}}
      >
        <Header key="header" uiMini={$.uiMini}>
          <ViewHeader option={$.normalMini} data={$.Encounter} log={Package} uiMini={$.uiMini} />
        </Header>
        {BarInner}
        <Content key="body">{ContentInner}</Content>
        <Split key="split" />
        <Footer key="footer">{FooterInner}</Footer>
      </View>
    );
  }
}

export default connect(State)(Overlay);
