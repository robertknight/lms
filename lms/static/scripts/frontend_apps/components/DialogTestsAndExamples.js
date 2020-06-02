import { Fragment, createElement } from 'preact';
import propTypes from 'prop-types';
import { useState, useMemo, useContext } from 'preact/hooks';

import { Config } from '../config';
import { ApiError } from '../utils/api';

import ErrorDisplay from './ErrorDisplay';
import Dialog from './Dialog';
import URLPicker from './URLPicker';
import FilePickerApp from './FilePickerApp';
import FileList from './FileList';
import ErrorDialog from './ErrorDialog';
import Button from './Button';

/*
function FooBar({
  error
 }) {
   return (

   );
}
FooBar.propTypes = {
  error: propTypes.object
}
*/

function UrlPickerDialog({ onClose }) {
  return <URLPicker onCancel={onClose} onSelectURL={() => {}} />;
}
UrlPickerDialog.propTypes = {
  onClose: propTypes.func,
};

function FilePickerDialog({ onClose }) {
  const [dialogState, setDialogState] = useState('');
  const [selectedFile, setSelectedFile] = useState();

  const files = useMemo(() => {
    const base = new Date(); // now
    const f = [];
    for (let i = 0; i < 100; i++) {
      f.push({
        display_name: `File ${i.toString().padStart(3, '0')}`,
        updated_at: new Date(base - i * (86400 * 1000)).toISOString(), // ms in a day
      });
    }
    return f;
  }, []);

  return (
    <Dialog
      contentClass="LMSFilePicker__dialog"
      title={'File Picker Dialog'}
      onCancel={onClose}
      buttons={[
        <Button
          key="select"
          onClick={() => {
            setDialogState(null);
          }}
          label="No Error"
        />,
        <Button
          key="select"
          onClick={() => {
            setDialogState('error');
          }}
          label="Error 1"
        />,
        <Button
          key="select"
          onClick={() => {
            setDialogState('authorizing1');
          }}
          label="Error 2"
        />,
        <Button
          key="select"
          onClick={() => {
            setDialogState('authorizing2');
          }}
          label="Error 3"
        />,
        <Button
          key="select"
          onClick={() => {
            setDialogState('loading');
          }}
          label="Loading Files"
        />,
      ]}
    >
      {dialogState === 'error' && (
        <ErrorDisplay
          message="There was a problem fetching files"
          error={new Error('some sort of error')}
        />
      )}

      {dialogState === 'authorizing1' && (
        <ErrorDisplay
          message={<Fragment>{`Failed to authorize with Canvas`}</Fragment>}
          error={new Error('')}
        />
      )}

      {dialogState === 'authorizing2' && (
        <p>
          To select a file, you must authorize Hypothesis to access your files
          in Canvas.
        </p>
      )}
      {dialogState === 'loading' && (
        <FileList
          files={[]}
          isLoading={true}
          selectedFile={selectedFile}
          onUseFile={() => {}}
          onSelectFile={file => {
            setSelectedFile(file);
          }}
        />
      )}

      {!dialogState && (
        <FileList
          files={files}
          isLoading={false}
          selectedFile={selectedFile}
          onUseFile={() => {}}
          onSelectFile={file => {
            setSelectedFile(file);
          }}
        />
      )}
    </Dialog>
  );
}
FilePickerDialog.propTypes = {
  error: propTypes.object,
  onClose: propTypes.func,
};

function SimpleErrorDialog({ onClose }) {
  return (
    <ErrorDialog
      title="Error"
      error={{
        message: `Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

        “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
        The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
        
        The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.
        
        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

        “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
        The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
        
        The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.
        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

        “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
        The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
        
        The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.`,
      }}
      onCancel={() => {
        onClose();
      }}
    />
  );
}
SimpleErrorDialog.propTypes = {
  error: propTypes.object,
  onClose: propTypes.func,
};

function AuthorizeError() {
  return (
    <Dialog
      title="Authorize Hypothesis"
      role="alertdialog"
      buttons={[
        <Button
          onClick={() => {}}
          className="BasicLtiLaunchApp__button"
          label="Authorize"
          key="authorize"
        />,
      ]}
    >
      <p>Hypothesis needs your authorization to launch this assignment.</p>
    </Dialog>
  );
}
AuthorizeError.propTypes = {
  error: propTypes.object,
};

function ScopeError() {
  return (
    <Dialog
      title="Something went wrong (button)"
      contentClass="BasicLtiLaunchApp__dialog"
      role="alertdialog"
      buttons={[
        <Button
          onClick={() => {}}
          className="BasicLtiLaunchApp__button"
          label="Try again"
          key="retry"
        />,
      ]}
    >
      <div className="ErrorDisplay">
          <p>
            A Canvas admin needs to edit Hypothesis's developer key and add these
            scopes:
          </p>
          <ol>
              <li><code>url:GET|/api/v1/courses/:course_id/files</code></li>
            
              <li><code>url:GET|/api/v1/files/:id/public_url</code></li>
            
              <li><code>url:GET|/api/v1/courses/:id</code></li>
            
              <li><code>url:GET|/api/v1/courses/:course_id/sections</code></li>
            
              <li><code>url:GET|/api/v1/courses/:course_id/users/:id</code></li>
            
          </ol>

          <p>For more information see:
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/hypothesis/lms/wiki/Canvas-API-Endpoints-Used-by-the-Hypothesis-LMS-App">Canvas API Endpoints Used 
  y the Hypothesis LMS App</a>.
          </p>
        

        <p>To get help from Hypothesis
        <a href="mailto:support@hypothes.is?subject=Hypothesis%20LMS%20Support" target="_blank" rel="noopener noreferrer">send us an email</a>
        or <a href="https://web.hypothes.is/get-help/" target="_blank" rel="noopener noreferrer">open a support ticket</a>.
        You can also visit our <a href="https://web.hypothes.is/help/" target="_blank" rel="noopener noreferrer"> help documents</a>.</p>

        
          <details className="ErrorDisplay__details">
            <summary className="ErrorDisplay__details-summary">Error Details</summary>
            <p>The error message from Canvas was:</p>
            <pre className="ErrorDisplay__details-content">A requested scope is invalid, unknown, malformed, or exceeds the scope granted by the resource owner. The following scopes were requested, but not granted: url:GET|/api/v1/courses/:course_id/files, url:GET|/api/v1/files/:id/public_url, url:GET|/api/v1/courses/:id, url:GET|/api/v1/courses/:course_id/sections, and url:GET|/api/v1/courses/:course_id/users/:id</pre>
          </details>
      </div>
    </Dialog>
  );
}
ScopeError.propTypes = {
};

function SomethingWentWrongError({ title, error }) {
  return (
    <Dialog
      title={title}
      contentClass="BasicLtiLaunchApp__dialog"
      role="alertdialog"
    >
      <ErrorDisplay
        message="There was a problem submitting this Hypothesis assignment"
        error={error}
      />
      <b>To fix this problem, try reloading the page.</b>
    </Dialog>
  );
}

SomethingWentWrongError.propTypes = {
  error: propTypes.object,
  title: propTypes.string,
};

/**
 *  Helper to display all dialogs and errors in the app.
 *
 */
export default function DialogTestsAndExamples() {
  const config = useContext(Config);
  const [dialogName, setDialogName] = useState();

  const changeDialog = name => {
    setDialogName(name);
  };

  const close = () => {
    setDialogName('');
  };

  const apiErrorText = useMemo(() => {
    return new ApiError(400, {
      details: `Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

      “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
      The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
      
      The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.
      Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

      “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
      The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
      
      The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.
      Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

      “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
      The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
      
      The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.
      Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

      “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
      The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.
      
      The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.`,
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    });
  }, []);

  const apiErrorJson = useMemo(() => {
    return new ApiError(400, {
      details: { someTechnicalDetail: 123 },
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    });
  }, []);

  return (
    <div className="DialogTestsAndExamples">
      <div className="DialogTestsAndExamples__buttons">
        <button
          onClick={() => {
            changeDialog('1');
          }}
        >
          Dialog - ErrorDisplay (text)
        </button>
        <button
          onClick={() => {
            changeDialog('8');
          }}
        >
          Dialog - ErrorDisplay (json)
        </button>
        <button
          onClick={() => {
            changeDialog('3');
          }}
        >
          Missing Scope Error
        </button>
        <button
          onClick={() => {
            changeDialog('2');
          }}
        >
          AuthorizeError
        </button>
        <button
          onClick={() => {
            changeDialog('4');
          }}
        >
          SimpleErrorDialog
        </button>
        <button
          onClick={() => {
            changeDialog('5');
          }}
        >
          FilePickerDialog
        </button>
        <button
          onClick={() => {
            changeDialog('6');
          }}
        >
          UrlPickerDialog
        </button>
        <button
          onClick={() => {
            changeDialog('7');
          }}
        >
          FilePickerApp
        </button>
      </div>

      {dialogName === '1' && (
        <SomethingWentWrongError
          title="Something went wrong (text)"
          error={apiErrorText}
        />
      )}
      {dialogName === '8' && (
        <SomethingWentWrongError
          title="Something went wrong (json)"
          error={apiErrorJson}
        />
      )}
      {dialogName === '2' && <AuthorizeError />}
      {dialogName === '3' && <ScopeError/>}
      {dialogName === '4' && <SimpleErrorDialog onClose={close} />}
      {dialogName === '5' && <FilePickerDialog onClose={close} />}
      {dialogName === '6' && <UrlPickerDialog onClose={close} />}
      {dialogName === '7' && (
        <Config.Provider
          value={{
            filePicker: {
              formAction: 'https://www.shinylms.com/',
              formFields: { hidden_field: 'hidden_value' },
              canvas: {
                enabled: true,
                ltiLaunchUrl: 'https://lms.anno.co/lti_launch',
              },
              google: {},
            },
            ...config,
          }}
        >
          <FilePickerApp defaultActiveDialog="lms" />
        </Config.Provider>
      )}
    </div>
  );
}
DialogTestsAndExamples.propTypes = {};
