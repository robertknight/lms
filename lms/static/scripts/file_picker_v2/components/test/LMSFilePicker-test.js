import { Fragment, createElement } from 'preact';
import { act } from 'preact/test-utils';
import { mount } from 'enzyme';

import { AuthorizationError } from '../../utils/api';
import LMSFilePicker, { $imports } from '../LMSFilePicker';

describe('LMSFilePicker', () => {
  const FakeButton = () => null;
  // eslint-disable-next-line react/prop-types
  const FakeDialog = ({ buttons, children }) => (
    <Fragment>
      {buttons} {children}
    </Fragment>
  );
  const FakeFileList = () => null;

  let FakeAuthWindow;
  let fakeListFiles;

  const renderFilePicker = (props = {}) => {
    return mount(
      <LMSFilePicker
        authToken="auth-token"
        authUrl="https://lms.anno.co/authorize-lms"
        courseId="test-course"
        onAuthorized={sinon.stub()}
        onSelectFile={sinon.stub()}
        onCancel={sinon.stub()}
        {...props}
      />
    );
  };

  beforeEach(() => {
    FakeAuthWindow = sinon.stub().returns({
      authorize: sinon.stub().resolves(null),
      close: () => {},
    });

    fakeListFiles = sinon.stub().resolves([]);

    $imports.$mock({
      '../utils/AuthWindow': FakeAuthWindow,
      '../utils/api': {
        listFiles: fakeListFiles,
      },
      './Button': FakeButton,
      './Dialog': FakeDialog,
      './FileList': FakeFileList,
    });
  });

  afterEach(() => {
    $imports.$restore();
  });

  it('shows an LMS authorization window when mounted if the user has not authorized', () => {
    const authorized = new Promise(() => {});
    FakeAuthWindow.returns({
      authorize: sinon.stub().callsFake(() => authorized),
      close: () => {},
    });

    const wrapper = renderFilePicker();
    assert.called(FakeAuthWindow);
    assert.called(FakeAuthWindow.returnValues[0].authorize);

    const authMessage = wrapper
      .find('p')
      .filterWhere(el => el.text().match(/you must authorize/));
    assert.equal(authMessage.length, 1);

    const authBtn = wrapper.find('FakeButton[label="Authorize"]');
    assert.equal(authBtn.length, 1);
  });

  it('calls `onAuthorized` when authorization completes', done => {
    const onAuthorized = sinon.stub();
    renderFilePicker({ isAuthorized: false, onAuthorized });
    setTimeout(() => {
      assert.called(onAuthorized);
      done();
    }, 0);
  });

  it('fetches files once authorization completes', async () => {
    const wrapper = renderFilePicker();
    await FakeAuthWindow.returnValues[0].authorize.returnValues[0];
    assert.called(fakeListFiles);
    const expectedFiles = await fakeListFiles.returnValues[0];
    wrapper.update();
    const fileList = wrapper.find(FakeFileList);
    assert.deepEqual(fileList.prop('files'), expectedFiles);
  });

  it('shows the authorization prompt if fetching files fails with an AuthorizationError', async () => {
    fakeListFiles.rejects(new AuthorizationError('Not authorized'));

    const wrapper = renderFilePicker({ isAuthorized: true });
    assert.called(fakeListFiles);

    try {
      await fakeListFiles.returnValues[0];
    } catch (err) {
      /* unused */
    }

    wrapper.update();
    assert.isTrue(wrapper.exists('FakeButton[label="Authorize"]'));
  });

  it('closes the authorization window when canceling the dialog', () => {
    const closePopup = sinon.stub();
    FakeAuthWindow.returns({
      authorize: sinon.stub().resolves(null),
      close: closePopup,
    });

    const wrapper = renderFilePicker();
    wrapper
      .find(FakeDialog)
      .props()
      .onCancel();

    assert.called(closePopup);
  });

  it('does not show an authorization window when mounted if the user has authorized', () => {
    const wrapper = renderFilePicker({ isAuthorized: true });
    assert.notCalled(FakeAuthWindow);
    assert.isFalse(wrapper.exists('Button[label="Authorize"]'));
  });

  it('fetches and displays files from the LMS', async () => {
    const wrapper = renderFilePicker({ isAuthorized: true });
    assert.called(fakeListFiles);

    const expectedFiles = await fakeListFiles.returnValues[0];
    wrapper.update();

    const fileList = wrapper.find(FakeFileList);
    assert.deepEqual(fileList.prop('files'), expectedFiles);
  });

  it('shows a loading indicator while fetching files', async () => {
    const wrapper = renderFilePicker({ isAuthorized: true });
    assert.isTrue(wrapper.find(FakeFileList).prop('isLoading'));

    await fakeListFiles.returnValues[0];
    wrapper.update();

    assert.isFalse(wrapper.find(FakeFileList).prop('isLoading'));
  });

  it('maintains selected file state', () => {
    const wrapper = renderFilePicker({ isAuthorized: true });
    const file = { id: 123 };

    act(() => {
      wrapper
        .find(FakeFileList)
        .props()
        .onSelectFile(file);
    });
    wrapper.update();

    assert.equal(wrapper.find(FakeFileList).prop('selectedFile'), file);
  });

  it('invokes `onSelectFile` when user chooses a file', () => {
    const onSelectFile = sinon.stub();
    const file = { id: 123 };
    const wrapper = renderFilePicker({ isAuthorized: true, onSelectFile });
    wrapper
      .find(FakeFileList)
      .props()
      .onUseFile(file);
    assert.calledWith(onSelectFile, file);
  });

  it('shows disabled "Select" button when no file is selected', () => {
    const wrapper = renderFilePicker({ isAuthorized: true });
    assert.equal(
      wrapper.find('FakeButton[label="Select"]').prop('disabled'),
      true
    );
  });

  it('shows enabled "Select" button when a file is selected', () => {
    const wrapper = renderFilePicker({ isAuthorized: true });
    act(() => {
      wrapper
        .find(FakeFileList)
        .props()
        .onSelectFile({ id: 123 });
    });
    wrapper.update();
    assert.equal(
      wrapper.find('FakeButton[label="Select"]').prop('disabled'),
      false
    );
  });

  it('chooses selected file when uses clicks "Select" button', () => {
    const onSelectFile = sinon.stub();
    const file = { id: 123 };
    const wrapper = renderFilePicker({ isAuthorized: true, onSelectFile });

    act(() => {
      wrapper
        .find(FakeFileList)
        .props()
        .onSelectFile(file);
    });
    wrapper.update();

    act(() => {
      wrapper
        .find('FakeButton[label="Select"]')
        .props()
        .onClick();
    });

    assert.calledWith(onSelectFile, file);
  });
});