import { Fragment, createElement } from 'preact';
import propTypes from 'prop-types';

import Table from './Table';

export default function ChapterList({
  chapters,
  isLoading = false,
  selectedChapter,
  onSelectChapter,
  onUseChapter,
}) {
  const columns = [
    {
      label: 'Title',
    },
    {
      label: 'Page',
    },
  ];

  return (
    <Table
      accessibleLabel="Table of Contents"
      columns={columns}
      contentLoading={isLoading}
      items={chapters}
      onSelectItem={onSelectChapter}
      onUseItem={onUseChapter}
      selectedItem={selectedChapter}
      renderItem={chapter => (
        <Fragment>
          <td aria-label={chapter.title}>{chapter.title}</td>
          <td>{chapter.page}</td>
        </Fragment>
      )}
    />
  );
}

ChapterList.propTypes = {
  /** List of available chapters. */
  chapters: propTypes.arrayOf(propTypes.object),

  /** Whether to show a loading indicator. */
  isLoading: propTypes.bool,

  /** The chapter within `chapters` which is currently selected. */
  selectedChapter: propTypes.object,

  /**
   * Callback passed the selected chapter when the user clicks on a chapter in
   * order to select it before performing further actions on it.
   */
  onSelectChapter: propTypes.func,

  /**
   * Callback passed when the user double-clicks a chapter to indicate that they
   * want to use it.
   */
  onUseChapter: propTypes.func,
};
