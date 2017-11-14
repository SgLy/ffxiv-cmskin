import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { Component } from 'react';
import { View, Lang } from '../../components';
import { getSetting } from '../../utils/getSetting';
import style from './index.scss';

const { Split } = View;
const Setting = ['fullscreen', 'uiTrans', 'uiScale', 'uiScaleActive', 'uiMini', 'hideName', 'lang'];
const State = state => getSetting(Setting, state.setting);

class App extends Component {
  handleUiSize = fontSize =>
    (document.getElementsByTagName('html')[0].style.fontSize = fontSize + 'px');

  handleClick = payload => this.props.dispatch({ type: 'setting/update', payload: payload });
  handleSetting = () => {
    if (window.websocket) {
      this.props.dispatch(routerRedux.push('/setting/basic'));
    } else {
      const Scale = this.props.uiScaleActive ? this.props.uiScale : 1;
      window.open('/setting/basic', '设置', `height=${640 * Scale}, width=${540 * Scale}`);
    }
  };
  handleReload = () => window.location.reload();
  handleDebug = () => (window.debug = true);

  componentWillMount() {
    this.props.dispatch({ type: 'setting/root' });
    setInterval(() => this.props.dispatch({ type: 'setting/root' }), 2000);
  }

  render() {
    const $ = this.props;
    // 设置UI缩放
    this.handleUiSize($.uiScaleActive ? 16 * $.uiScale : 16);

    // 判断路径和环境
    const isInSetting = window.location.pathname.indexOf('setting') !== -1;
    const isInDevelop = process.env.NODE_ENV === 'development';

    // 规划右键菜单
    const BuildMenuItem = (name, data) => (
      <MenuItem key={name} onClick={() => this.handleClick({ [name]: !data })}>
        <Lang id={data ? `menu.${name}.on` : `menu.${name}.off`} />
      </MenuItem>
    );
    const MenuItemGroup = isInSetting
      ? null
      : [
          <div key="group" className={style.item}>
            {BuildMenuItem('fullscreen', $.fullscreen)}
            {BuildMenuItem('uiTrans', $.uiTrans)}
            {BuildMenuItem('uiMini', $.uiMini)}
            {BuildMenuItem('hideName', $.hideName)}
          </div>,
          <Split key="split" />,
        ];

    const MenuItemGroupSec = [
      isInSetting ? null : (
        <MenuItem key="setting" onClick={this.handleSetting}>
          <Lang id="menu.setting" />
        </MenuItem>
      ),
      <MenuItem key="reload" onClick={this.handleReload}>
        <Lang id="menu.refresh" />
      </MenuItem>,
      !isInDevelop ? null : (
        <MenuItem key="debug" onClick={this.handleDebug}>
          <Lang id="menu.debug" />
        </MenuItem>
      ),
    ];

    const AppContent = [
      <ContextMenuTrigger key="menuTrigger" id="view" holdToDisplay={-1}>
        {$.children}
      </ContextMenuTrigger>,
      <ContextMenu key="menu" id="view" className={style.menu}>
        <div className={style.title}>
          <Lang id="menu.title" />
        </div>
        <Split />
        {MenuItemGroup}
        <div className={style.item}>{MenuItemGroupSec}</div>
      </ContextMenu>,
    ];

    return AppContent;
  }
}

export default connect(State)(App);
