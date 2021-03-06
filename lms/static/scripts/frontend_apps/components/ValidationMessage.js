import { createElement } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import classNames from 'classnames';
import propTypes from 'prop-types';

/**
 * Shows a single validation error message that can be open or closed.
 * A user can also close the message by clicking on it.
 */

export default function ValidationMessage({
  message,
  open = false,
  onClose = () => {},
}) {
  const [showError, setShowError] = useState(open);

  useEffect(() => {
    setShowError(open);
  }, [open]);

  /**
   * Closes the validation error message and notifies parent
   */
  const closeValidationError = e => {
    e.preventDefault();
    setShowError(false);
    onClose();
  };

  const errorClass = classNames('ValidationMessage', {
    'ValidationMessage--open': showError,
    'ValidationMessage--closed': !showError,
  });

  return (
    <input
      type="button"
      onClick={closeValidationError}
      className={errorClass}
      value={message}
      tabIndex={showError ? '0' : '-1'}
    />
  );
}

ValidationMessage.propTypes = {
  // Error message text
  message: propTypes.string.isRequired,
  // Should this be open or closed
  open: propTypes.bool,
  // Optional callback when the error message closes itself via onClick
  onClose: propTypes.func,
};
