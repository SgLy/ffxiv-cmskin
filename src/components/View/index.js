import classnames from 'classnames/bind';
import { Lang, Back } from '../';
import { Icon } from 'antd';
import { Link } from 'dva/router';
import style from './index.scss';

const View = ({ transparent, children, ...other }) => {
  return (
    <div
      className={classnames.bind(style)({
        view: !transparent,
        viewTrans: transparent,
      })}
      {...other}
    >
      <div className={style.inner}>{children}</div>
    </div>
  );
};

View.Header = ({ className, children, uiMini, ...other }) => (
  <div className={classnames.bind(style)('header', className, { uiMini: uiMini })} {...other}>
    {children}
  </div>
);
View.Content = ({ className, children, ...other }) => (
  <div className={style.content}>
    <div className={classnames.bind(style)('body', className)} {...other}>
      {children}
    </div>
  </div>
);
View.Footer = ({ className, children, hasBtn, ...other }) => {
  const FooterClass = classnames.bind(style)('footer', { hasBtn: hasBtn });
  const InFooterClass = classnames.bind(style)('infooter', className);
  const Copyright = (
    <a
      className={style.copyright}
      href="https://github.com/canisminor1990/ffxiv-cmskin"
      rel="noopener noreferrer"
      target="_blank"
    >
      By CanisMinor
    </a>
  );
  const History = (
    <Link className={style.history} to="/history">
      <Icon type="clock-circle-o" />
    </Link>
  );
  const FooterContent = window.location.pathname === '/' && window.active ? History : Copyright;
  let FooterDiv = [];
  if (window.websocket && hasBtn) {
    FooterDiv = (
      <div className={FooterClass}>
        <Back />
        <div className={InFooterClass} {...other}>
          {children}
        </div>
      </div>
    );
  } else {
    FooterDiv = (
      <div className={FooterClass}>
        <div className={InFooterClass} {...other}>
          {children}
        </div>
        {FooterContent}
      </div>
    );
  }
  return FooterDiv;
};
View.Bar = ({ className, children, ...other }) => (
  <div className={classnames.bind(style)('bar', className)} {...other}>
    {children}
  </div>
);
View.Split = ({ right, className, title, id, ...other }) => {
  const rightContent = right ? <div>{right}</div> : null;
  return [
    id ? (
      <div key="title" className={style.title}>
        <Lang id={id} />
        {rightContent}
      </div>
    ) : null,
    title ? (
      <div key="title" className={style.title}>
        {title}
        {rightContent}
      </div>
    ) : null,
    <div key="split" className={classnames.bind(style)('split', className)} {...other} />,
  ];
};
export default View;
