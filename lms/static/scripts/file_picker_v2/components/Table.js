import classnames from 'classnames';
import { createElement } from 'preact';
import propTypes from 'prop-types';

/**
 * Return the next item to select when advancing the selection by `step` items
 * forwards (if positive) or backwards (if negative).
 */
function nextItem(items, currentItem, step) {
  const index = items.indexOf(currentItem);
  if (index < 0) {
    return items[0];
  }

  if (index + step < 0) {
    return items[0];
  }

  if (index + step >= items.length) {
    return items[items.length - 1];
  }

  return items[index + step];
}

/**
 * An interactive table of items with a sticky header.
 */
export default function Table({
  columns,
  items,
  onSelectItem,
  onUseItem,
  renderItem,
  selectedItem,
}) {
  const onKeyDown = event => {
    let handled = false;
    if (event.key === 'Enter') {
      handled = true;
      onUseItem(selectedItem);
    } else if (event.key === 'ArrowUp') {
      handled = true;
      onSelectItem(nextItem(items, selectedItem, -1));
    } else if (event.key === 'ArrowDown') {
      handled = true;
      onSelectItem(nextItem(items, selectedItem, 1));
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div className="Table__wrapper">
      <table className="Table__table" tabIndex="0" onKeyDown={onKeyDown}>
        <thead className="Table__head">
          <tr>
            {columns.map(column => (
              <th
                key={column.label}
                className={classnames('Table__head-cell', column.className)}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="Table__body">
          {items.map(item => (
            <tr
              key={item.name}
              className={classnames({
                Table__row: true,
                'is-selected': selectedItem === item,
              })}
              onMouseDown={() => onSelectItem(item)}
              onClick={() => onSelectItem(item)}
              onDblClick={() => onUseItem(item)}
            >
              {renderItem(item, selectedItem === item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  /**
   * The columns to display in this table.
   */
  columns: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string,
      className: propTypes.string,
    })
  ).isRequired,

  /**
   * The items to display in this table.
   */
  items: propTypes.arrayOf(propTypes.object).isRequired,

  /**
   * A function called to render each item. The result should be a list of
   * `<td>` elements (one per column) wrapped inside a Fragment.
   *
   * The function takes two arguments: The item to render and a boolean
   * indicating whether the item is currently selected.
   */
  renderItem: propTypes.func.isRequired,

  /**
   * The currently selected item from `items` or `null` if no item is
   * selected.
   */
  selectedItem: propTypes.object,

  /**
   * Callback invoked when the user changes the selected item.
   */
  onSelectItem: propTypes.func,

  /**
   * Callback invoked when a user chooses to use an item by double-clicking it
   * or pressing Enter while it is selected.
   */
  onUseItem: propTypes.func,
};
