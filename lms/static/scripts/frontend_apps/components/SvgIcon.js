import classNames from 'classnames';
import { createElement } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';
import * as propTypes from 'prop-types';

/**
 * Component that renders icons using inline `<svg>` elements.
 * This enables their appearance to be customized via CSS.
 *
 * This matches the way we do icons on the website, see
 * https://github.com/hypothesis/h/pull/3675
 */

export default function SvgIcon({ className = '', inline = false, src }) {
  if (!src) {
    throw new Error(`Unknown svg supplied to src prop`);
  }
  if (!src.trustedHTML) {
    throw new Error(
      'Un-trusted resource passed to SvgIcon. If this is a valid svg, use the `trustMarkup` wrapper.'
    );
  }

  const markup = { __html: src.trustedHTML };
  const element = useRef();

  useLayoutEffect(() => {
    const svg = element.current.querySelector('svg');
    svg.setAttribute('class', className);
  }, [
    className,
    // `markup` is a dependency of this effect because the SVG is replaced if
    // it changes.
    markup,
  ]);

  return (
    <span
      className={classNames('svg-icon', { 'svg-icon--inline': inline })}
      dangerouslySetInnerHTML={markup}
      ref={element}
    />
  );
}

SvgIcon.propTypes = {
  /** A CSS class to apply to the `<svg>` element. */
  className: propTypes.string,

  /** Apply a style allowing for inline display of icon wrapper */
  inline: propTypes.bool,

  /** Imported SVG resource with a trusted wrapper. */
  src: propTypes.shape({
    trustedHTML: propTypes.string,
  }),
};
