import { createRef, createElement } from 'preact';
import * as propTypes from 'prop-types';

import Button from './Button';
import Dialog from './Dialog';

/**
 * A dialog that allows the user to enter or paste the URL of a web page or
 * PDF file to use for an assignment.
 */
export default function URLPicker({ onCancel, onSelectURL }) {
  const input = createRef();
  const form = createRef();
  const submit = event => {
    event.preventDefault();
    if (form.current.checkValidity()) {
      onSelectURL(input.current.value);
    } else {
      form.current.reportValidity();
    }
  };

  return (
    <Dialog
      contentClass="URLPicker__dialog"
      title="Enter URL"
      onCancel={onCancel}
      buttons={[<Button key="submit" label="Submit" onClick={submit} />]}
      initialFocus={input}
    >
      <p>Enter the URL of any publicly available web page or PDF.</p>
      <form ref={form} className="u-flex-row" onSubmit={submit}>
        <label className="label" htmlFor="url">
          URL:{' '}
        </label>
        <input
          className="u-stretch u-cross-stretch"
          name="path"
          type="url"
          placeholder="https://example.com/article.pdf"
          required={true}
          ref={input}
        />
      </form>
    </Dialog>
  );
}

URLPicker.propTypes = {
  onCancel: propTypes.func,

  /** Callback invoked when the entered URL when the user accepts the dialog. */
  onSelectURL: propTypes.func,
};
