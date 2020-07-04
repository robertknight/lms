import { createElement } from 'preact';
import * as propTypes from 'prop-types';

import SvgIcon from './SvgIcon';
import { trustMarkup } from '../utils/trusted';

/**
 * A spinning loading indicator.
 */
export default function Spinner({ className }) {
  return (
    <SvgIcon
      className={className}
      // @ts-ignore
      src={trustMarkup(require('../../../images/spinner.svg'))}
      inline={true}
    />
  );
}

Spinner.propTypes = {
  className: propTypes.string,
};
