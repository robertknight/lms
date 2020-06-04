import { createElement } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import propTypes from 'prop-types';

export default function VitalSourceBookViewer({ launchParams, launchUrl }) {
  const iframe = useRef(null);

  useEffect(() => {
    const iframeDoc = iframe.current.contentDocument;
    const launchForm = iframeDoc.createElement('form');

    launchForm.method = 'POST';
    launchForm.action = launchUrl;

    Object.entries(launchParams).forEach(([key, value]) => {
      const field = iframeDoc.createElement('input');
      field.type = 'hidden';
      field.name = key;
      field.value = value;
      launchForm.appendChild(field);
    });
    iframeDoc.body.appendChild(launchForm);
    launchForm.submit();
  }, [launchParams, launchUrl]);

  return (
    <iframe
      ref={iframe}
      width="100%"
      height="100%"
      title="Course content with Hypothesis annotation viewer"
      src="about:blank"
    />
  );
}

VitalSourceBookViewer.propTypes = {
  launchUrl: propTypes.string,
  launchParams: propTypes.object,
};
