---
title: Add a panel to the Remote Monitoring solution UI - Azure | Microsoft Docs 
description: This article shows you how to add a new panel to the dashboard in the Remote Monitoring solution accelerator web UI.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/05/2018
ms.topic: conceptual

# As a developer, I want to add a new panel to a dashboard page in the solution accelerator web UI in order to customize the user experience.
---

# Add a custom panel to the dashboard in the Remote Monitoring solution accelerator web UI

This article shows you how to add a new panel onto a dashboard page in the Remote Monitoring solution accelerator web UI. The article describes:

- How to prepare a local development environment.
- How to add a new panel to a dashboard page in the web UI.

The example panel in this article displays on the existing dashboard page.

## Prerequisites

To complete the steps in this how-to guide, you need the following software installed on your local development machine:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/download/)

## Before you start

You should complete the steps in the [Add a custom page to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-page.md) article before continuing.

## Add a panel

To add a panel to the web UI, you need to add the source files that define the panel, and then modify the dashboard to display the panel.

### Add the new files that define the panel

To get you started, the **src/walkthrough/components/pages/dashboard/panels/examplePanel** folder contains the files that define a panel, including:

**examplePanel.js**

[!code-javascript[Example panel](~/remote-monitoring-webui/src/walkthrough/components/pages/dashboard/panels/examplePanel/examplePanel.js?name=panel "Example panel")]

Copy the **src/walkthrough/components/pages/dashboard/panels/examplePanel** folder to the **src/components/pages/dashboard/panels** folder.

Add the following export to the **src/walkthrough/components/pages/dashboard/panels/index.js** file:

```js
export * from './examplePanel';
```

### Add the panel to the dashboard

Modify the **src/components/pages/dashboard/dashboard.js** to add the panel.

Add the example panel to the list of imports from panels:

```js
import {
  OverviewPanel,
  AlertsPanel,
  TelemetryPanel,
  AnalyticsPanel,
  MapPanel,
  transformTelemetryResponse,
  chartColorObjects,
  ExamplePanel
} from './panels';
```

Add the following cell definition to the grid in the page content:

```js
          <Cell className="col-2">
            <ExamplePanel t={t} />
          </Cell>
```

## Test the flyout

If the web UI is not already running locally, run the following command in the root of your local copy of the repository:

```cmd/sh
npm start
```

The previous command runs the UI locally at `http://localhost:3000/dashboard`. Navigate to the **Dashboard** page to view the new panel.

## Next steps

In this article, you learned about the resources available to help you add or customize dashboards in the web UI in the Remote Monitoring solution accelerator.

For more conceptual information about the Remote Monitoring solution accelerator, see [Remote Monitoring architecture](iot-accelerators-remote-monitoring-sample-walkthrough.md).
