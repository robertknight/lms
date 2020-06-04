import queryString from 'query-string';

function contentItemWithLaunchParams(ltiLaunchUrl, params) {
  return {
    '@context': 'http://purl.imsglobal.org/ctx/lti/v1/ContentItem',
    '@graph': [
      {
        '@type': 'LtiLinkItem',
        mediaType: 'application/vnd.ims.lti.v1.ltilink',
        url: `${ltiLaunchUrl}?${queryString.stringify(params)}`,
      },
    ],
  };
}

/**
 * Return a JSON-LD `ContentItem` representation of the LTI activity launch
 * URL for a given document URL.
 */
export function contentItemForUrl(ltiLaunchUrl, documentUrl) {
  return contentItemWithLaunchParams(ltiLaunchUrl, { url: documentUrl });
}

export function contentItemForLmsFile(ltiLaunchUrl, file) {
  return contentItemWithLaunchParams(ltiLaunchUrl, {
    // We only support integration with Canvas's file storage at present, but
    // it is expected that the LMS file picker could be re-used with other LMSes
    // in future.
    canvas_file: true,
    file_id: file.id,
  });
}

export function contentItemForVitalSourceBook(ltiLaunchUrl, { book, chapter }) {
  return contentItemWithLaunchParams(ltiLaunchUrl, {
    vitalsource_book: true,
    book_id: book.id,
    cfi: chapter.cfi,
  });
}
