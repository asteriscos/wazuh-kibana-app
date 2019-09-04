/*
 * Wazuh app - React component for building the reports table.
 *
 * Copyright (C) 2015-2019 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import {
  EuiFlexItem,
  EuiFilePicker,
  EuiButton,
  EuiListGroupItem,
  EuiFlexGroup,
  EuiCallOut
} from '@elastic/eui';

export class UploadFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: {},
    };
    this.maxSize = 307200; // 300Kb
  }

  onChange = files => {
    this.setState({
      files: files,
    });
  };

  renderWarning(title) {
    return (
      <EuiCallOut
        size="s"
        title={title}
        color="warning"
        iconType="iInCircle"
        className="upload-file-advise"
      />
    );
  }

  checkOverSize() {
    const result = Object.keys(this.state.files).filter(item => { return this.state.files[item].size > this.maxSize });
    return result.length;
  }

  renderFiles() {
    return (
      <Fragment>
        <EuiFlexGroup className="list-of-files">
          {Object.keys(this.state.files).map((item, i) => (
            <EuiListGroupItem
              id={i}
              key={i}
              label={`${this.state.files[item].name} (${this.state.files[item].size} Bytes)`}
              onClick={() => window.alert('Button clicked')}
              isActive
              extraAction={{
                color: 'subdued',
                onClick: () => { window.alert('Go to remove this file') },
                iconType: 'cross',
                iconSize: 's',
                'aria-label': 'Remove file'
              }}
            />
          ))}
        </EuiFlexGroup>
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <EuiFlexItem>
          <EuiFilePicker
            id="filePicker"
            multiple
            initialPromptText={this.props.msg}
            className="no-max-width"
            onChange={files => {
              this.onChange(files);
            }}
          />
        </EuiFlexItem>

        {(this.state.files.length > 0 &&
          this.state.files.length < 6 &&
          !this.checkOverSize() > 0 && (
            <Fragment>
              <EuiFlexItem>
                {this.renderFiles()}
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton className="upload-files-button"
                  fill
                  iconType="sortUp"
                  onClick={() => this.props.upload(this.state.files, this.props.path)}>
                  Upload
          </EuiButton>
              </EuiFlexItem>
            </Fragment>
          ))}

        {(this.state.files.length > 5 && (
          <Fragment>
            {this.renderWarning('The max number of concurrent files uploads is 5.')}
          </Fragment>
        ))}
        {(this.checkOverSize() > 0 && (
          <Fragment>
            {this.renderWarning(`The max size per file allowd is ${this.maxSize / 1024} Kb`)}
          </Fragment>
        ))}
      </Fragment>


    );
  }
}

UploadFiles.propTypes = {
  msg: PropTypes.string,
  path: PropTypes.string,
  upload: PropTypes.func
};