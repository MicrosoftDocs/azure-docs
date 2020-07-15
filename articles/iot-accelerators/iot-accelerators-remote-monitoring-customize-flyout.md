---
title: Add a flyout to the Remote Monitoring solution UI - Azure | Microsoft Docs 
description: This article shows you how to add a new flyout on a page in the Remote Monitoring solution accelerator web UI.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/05/2018
ms.topic: conceptual

# As a developer, I want to add a new flyout on a page in the solution accelerator web UI in order to customize the user experience.
---

# Add a custom flyout to the Remote Monitoring solution accelerator web UI

This article shows you how to add a new flyout onto a page in the Remote Monitoring solution accelerator web UI. The article describes:

- How to prepare a local development environment.
- How to add a new flyout to a page in the web UI.

The example flyout in this article displays on the page with the grid that the [Add a custom grid to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-grid.md) how-to article shows you how to add.

## Prerequisites

To complete the steps in this how-to guide, you need the following software installed on your local development machine:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/download/)

## Before you start

You should complete the steps in the following articles before continuing:

- [Add a custom page to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-page.md).
- [Add a custom service to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-service.md)
- [Add a custom grid to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-grid.md)

## Add a flyout

To add a flyout to the web UI, you need to add the source files that define the flyout, and modify some existing files to make the web UI aware of the new component.

### Add the new files that define the flyout

To get you started, the **src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout** folder contains the files that define a flyout:

**exampleFlyout.container.js**

[!code-javascript[Example flyout container](~/remote-monitoring-webui/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.container.js?name=flyoutcontainer "Example flyout container")]

**exampleFlyout.js**

[!code-javascript[Example flyout](~/remote-monitoring-webui/src/walkthrough/components/pages/pageWithFlyout/flyouts/exampleFlyout/exampleFlyout.js?name=flyout "Example flyout")]

Copy the **src/walkthrough/components/pages/pageWithFlyout/flyouts** folder to the **src/components/pages/example** folder.

### Add the flyout to the page

Modify the **src/components/pages/example/basicPage.js** to add the flyout.

Add **Btn** to the imports from **components/shared** and add imports for **svgs** and **ExampleFlyoutContainer**:

```js
import {
  AjaxError,
  ContextMenu,
  PageContent,
  RefreshBar,
  Btn
} from 'components/shared';
import { ExampleGrid } from './exampleGrid';
import { svgs } from 'utilities';
import { ExampleFlyoutContainer } from './flyouts/exampleFlyout';
```

Add a **const** definition for **closedFlyoutState** and add it to the state in the constructor:

```js
const closedFlyoutState = { openFlyoutName: undefined };

export class BasicPage extends Component {
  constructor(props) {
    super(props);
    this.state = { contextBtns: null, closedFlyoutState };
  }
```

Add the following functions to the **BasicPage** class:

```js
  closeFlyout = () => this.setState(closedFlyoutState);

  openFlyout = (name) => () => this.setState({ openFlyoutName: name });
```

Add the following **const** definitions to the **render** function:

```js
    const { openFlyoutName } = this.state;

    const isExampleFlyoutOpen = openFlyoutName === 'example';
```

Add a button to open the flyout to the context menu:

```js
      <ContextMenu key="context-menu">
        {this.state.contextBtns}
        <Btn svg={svgs.reconfigure} onClick={this.openFlyout('example')}>{t('walkthrough.pageWithFlyout.open')}</Btn>
      </ContextMenu>,
```

Add some text and the flyout container to the page content:

```js
      <PageContent className="basic-page-container" key="page-content">
        {t('walkthrough.pageWithFlyout.pageBody')}
        { isExampleFlyoutOpen && <ExampleFlyoutContainer onClose={this.closeFlyout} /> }
        <RefreshBar refresh={fetchData} time={lastUpdated} isPending={isPending} t={t} />
        {!!error && <AjaxError t={t} error={error} />}
        {!error && <ExampleGrid {...gridProps} />}
      </PageContent>
```

## Test the flyout

If the web UI is not already running locally, run the following command in the root of your local copy of the repository:

```cmd/sh
npm start
```

The previous command runs the UI locally at `http://localhost:3000/dashboard`. Navigate to the **Example** page and click **Open Flyout**.

## Next steps

In this article, you learned about the resources available to help you add or customize pages in the web UI in the Remote Monitoring solution accelerator.

Now you have defined a flyout on a page, the next step is to [Add a panel to the dashboard in the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-panel.md).

For more conceptual information about the Remote Monitoring solution accelerator, see [Remote Monitoring architecture](iot-accelerators-remote-monitoring-sample-walkthrough.md).
