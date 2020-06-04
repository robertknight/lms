import { createElement } from 'preact';
import propTypes from 'prop-types';

import Table from './Table';

export default function BookList({
  books,
  isLoading = false,
  selectedBook,
  onSelectBook,
  onUseBook,
}) {
  const columns = [
    {
      label: 'Title',
    },
  ];

  return (
    <div className="BookList">
      <Table
        accessibleLabel="Book list"
        columns={columns}
        contentLoading={isLoading}
        items={books}
        onSelectItem={onSelectBook}
        onUseItem={onUseBook}
        renderItem={book => <td>{book.title}</td>}
        selectedItem={selectedBook}
      />
      {selectedBook && (
        <div className="BookList__cover-container">
          <img
            className="BookList__cover"
            alt="Book cover"
            src={selectedBook.cover_image}
          />
        </div>
      )}
    </div>
  );
}

BookList.propTypes = {
  /** List of available books. */
  books: propTypes.arrayOf(propTypes.object),

  /** Whether to show a loading indicator. */
  isLoading: propTypes.bool,

  /** The book within `books` which is currently selected. */
  selectedBook: propTypes.object,

  /**
   * Callback passed the selected book when the user clicks on a book in
   * order to select it before performing further actions on it.
   */
  onSelectBook: propTypes.func,

  /**
   * Callback passed when the user double-clicks a book to indicate that they
   * want to use it.
   */
  onUseBook: propTypes.func,
};
