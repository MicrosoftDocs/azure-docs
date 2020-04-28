---
title: Add a grid to the Remote Monitoring solution UI - Azure | Microsoft Docs 
description: This article shows you how to add a new gid on a page in the Remote Monitoring solution accelerator web UI.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/04/2018
ms.topic: conceptual

# As a developer, I want to add a new grid on a page in the solution accelerator web UI in order to customize the user experience.
---

# Add a custom grid to the Remote Monitoring solution accelerator web UI

This article shows you how to add a new grid onto a page in the Remote Monitoring solution accelerator web UI. The article describes:

- How to prepare a local development environment.
- How to add a new grid to a page in the web UI.

The example grid in this article displays the data from the service that the [Add a custom service to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-service.md) how-to article shows you how to add.

## Prerequisites

To complete the steps in this how-to guide, you need the following software installed on your local development machine:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/download/)

## Before you start

You should complete the steps in the following articles before continuing:

- [Add a custom page to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-page.md).
- [Add a custom service to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-service.md)

## Add a grid

To add a grid to the web UI, you need to add the source files that define the grid, and modify some existing files to make the web UI aware of the new component.

### Add the new files that define the grid

To get you started, the **src/walkthrough/components/pages/pageWithGrid/exampleGrid** folder contains the files that define a grid:

**exampleGrid.js**

[!code-javascript[Example grid](~/remote-monitoring-webui/src/walkthrough/components/pages/pageWithGrid/exampleGrid/exampleGrid.js?name=grid "Example grid")]

**exampleGridConfig.js**

[!code-javascript[Example grid configuration](~/remote-monitoring-webui/src/walkthrough/components/pages/pageWithGrid/exampleGrid/exampleGridConfig.js?name=gridconfig "Example grid configuration")]

Copy the **src/walkthrough/components/pages/pageWithGrid/exampleGrid** folder to the **src/components/pages/example** folder.

### Add the grid to the page

Modify the **src/components/pages/example/basicPage.container.js** as follows to import the service definitions:

```js
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  epics as exampleEpics,
  getExamples,
  getExamplesError,
  getExamplesLastUpdated,
  getExamplesPendingStatus
} from 'store/reducers/exampleReducer';
import { BasicPage } from './basicPage';

// Pass the data
const mapStateToProps = state => ({
  data: getExamples(state),
  error: getExamplesError(state),
  isPending: getExamplesPendingStatus(state),
  lastUpdated: getExamplesLastUpdated(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(exampleEpics.actions.fetchExamples())
});

export const BasicPageContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(BasicPage));
```

Modify the **src/components/pages/example/basicPage.js** as follows to add the grid:

```js
// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import {
  AjaxError,
  ContextMenu,
  PageContent,
  RefreshBar
} from 'components/shared';
import { ExampleGrid } from './exampleGrid';

import './basicPage.css';

export class BasicPage extends Component {
  constructor(props) {
    super(props);
    this.state = { contextBtns: null };
  }

  componentDidMount() {
    const { isPending, lastUpdated, fetchData } = this.props;
    if (!lastUpdated && !isPending) fetchData();
  }

  onGridReady = gridReadyEvent => this.gridApi = gridReadyEvent.api;

  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  render() {
    const { t, data, error, isPending, lastUpdated, fetchData } = this.props;
    const gridProps = {
      onGridReady: this.onGridReady,
      rowData: isPending ? undefined : data || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };

    return [
      <ContextMenu key="context-menu">
        {this.state.contextBtns}
      </ContextMenu>,
      <PageContent className="basic-page-container" key="page-content">
        <RefreshBar refresh={fetchData} time={lastUpdated} isPending={isPending} t={t} />
        {!!error && <AjaxError t={t} error={error} />}
        {!error && <ExampleGrid {...gridProps} />}
      </PageContent>
    ];
  }
}
```

Modify the **src/components/pages/example/basicPage.test.js** as follows to update the tests:

```js
// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { shallow } from 'enzyme';
import 'polyfills';

import { BasicPage } from './basicPage';

describe('BasicPage Component', () => {
  it('Renders without crashing', () => {

    const fakeProps = {
      data: undefined,
      error: undefined,
      isPending: false,
      lastUpdated: undefined,
      fetchData: () => { },
      t: () => { },
    };

    const wrapper = shallow(
      <BasicPage {...fakeProps} />
    );
  });
});
```

## Test the grid

If the web UI is not already running locally, run the following command in the root of your local copy of the repository:

```cmd/sh
npm start
```

The previous command runs the UI locally at `http://localhost:3000/dashboard`. Navigate to the **Example** page to see the grid display data from the service.

## Select rows

There are two options for enabling a user to select rows in the grid:

### Hard-select rows

If a user needs to act on multiple rows at the same time, use checkboxes on rows:

1. Enable hard-selection of rows by adding a **checkboxColumn** to the **columnDefs** provided to the grid. **checkboxColumn** is defined in **/src/components/shared/pcsGrid/pcsGrid.js**:

    ```js
    this.columnDefs = [
      checkboxColumn,
      exampleColumnDefs.id,
      exampleColumnDefs.description
    ];
    ```

1. To access the selected items, you get a reference to the internal grid API:

    ```js
    onGridReady = gridReadyEvent => {
      this.gridApi = gridReadyEvent.api;
      // Call the onReady props if it exists
      if (isFunc(this.props.onGridReady)) {
        this.props.onGridReady(gridReadyEvent);
      }
    };
    ```

1. Provide context buttons to the page when a row in the grid is hard-selected:

    ```js
    this.contextBtns = [
      <Btn key="context-btn-1" svg={svgs.reconfigure} onClick={this.doSomething()}>Button 1</Btn>,
      <Btn key="context-btn-2" svg={svgs.trash} onClick={this.doSomethingElse()}>Button 2</Btn>
    ];
    ```

    ```js
    onHardSelectChange = (selectedObjs) => {
      const { onContextMenuChange, onHardSelectChange } = this.props;
      // Show the context buttons when there are rows checked.
      if (isFunc(onContextMenuChange)) {
        onContextMenuChange(selectedObjs.length > 0 ? this.contextBtns : null);
      }
      //...
    }
    ```

1. When a context button is clicked, get the hard-selected items to do your work on:

    ```js
    doSomething = () => {
      //Just for demo purposes. Don't console log in a real grid.
      console.log('Hard selected rows', this.gridApi.getSelectedRows());
    };
    ```

### Soft-select rows

If the user only needs to act on a single row, configure a soft-select link for one or more columns in the **columnDefs**.

1. In **exampleGridConfig.js**, add **SoftSelectLinkRenderer** as the **cellRendererFramework** for a **columnDef**.

    ```js
    export const exampleColumnDefs = {
      id: {
        headerName: 'examples.grid.name',
        field: 'id',
        sort: 'asc',
        cellRendererFramework: SoftSelectLinkRenderer
      }
    };
    ```

1. When a soft-select link is clicked, it triggers the **onSoftSelectChange** event. Perform whatever action is desired for that row, such as opening a details flyout. This example simply writes to the console:

    ```js
    onSoftSelectChange = (rowId, rowData) => {
      //Note: only the Id is reliable, rowData may be out of date
      const { onSoftSelectChange } = this.props;
      if (rowId) {
        //Just for demo purposes. Don't console log a real grid.
        console.log('Soft selected', rowId);
        this.setState({ softSelectedId: rowId });
      }
      if (isFunc(onSoftSelectChange)) {
        onSoftSelectChange(rowId, rowData);
      }
    }
    ```

## Next steps

In this article, you learned about the resources available to help you add or customize pages in the web UI in the Remote Monitoring solution accelerator.

Now you have defined a grid, the next step is to [Add a custom flyout to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-flyout.md) that displays on the example page.

For more conceptual information about the Remote Monitoring solution accelerator, see [Remote Monitoring architecture](iot-accelerators-remote-monitoring-sample-walkthrough.md).
