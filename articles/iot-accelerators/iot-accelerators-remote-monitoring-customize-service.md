---
title: Add a service to the Remote Monitoring solution UI - Azure | Microsoft Docs 
description: This article shows you how to add a new service into the Remote Monitoring solution accelerator web UI.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/02/2018
ms.topic: conceptual

# As a developer, I want to add a new service to the solution accelerator web UI in order to start customizing the user experience.
---

# Add a custom service to the Remote Monitoring solution accelerator web UI

This article shows you how to add a new service into the Remote Monitoring solution accelerator web UI. The article describes:

- How to prepare a local development environment.
- How to add a new service to the web UI.

The example service in this article provides the data for a grid that the [Add a custom grid to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-grid.md) how-to article shows you how to add.

In a React application, a service typically interacts with a back-end service. Examples in the Remote Monitoring solution accelerator include services that interact with the IoT hub manager and configuration microservices.

## Prerequisites

To complete the steps in this how-to guide, you need the following software installed on your local development machine:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/download/)

## Before you start

You should complete the steps in the [Add a custom page to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-page.md) how-to article before continuing.

## Add a service

To add a service to the web UI, you need to add the source files that define the service, and modify some existing files to make the web UI aware of the new service.

### Add the new files that define the service

To get you started, the **src/walkthrough/services** folder contains the files that define a simple service:

**exampleService.js**

[!code-javascript[Example service](~/remote-monitoring-webui/src/walkthrough/services/exampleService.js?name=service "Example service")]

To learn more about how services are implemented, see [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

**model/exampleModels.js**

[!code-javascript[Example model](~/remote-monitoring-webui/src/walkthrough/services/models/exampleModels.js?name=models "Example model")]

Copy **exampleService.js** to the **src/services** folder and copy **exampleModels.js** to the **src/services/models** folder.

Update the **index.js** file in the **src/services** folder to export the new service:

```js
export * from './exampleService';
```

Update the **index.js** file in the **src/services/models** folder to export the new model:

```js
export * from './exampleModels';
```

### Set up the calls to the service from the store

To get you started, the **src/walkthrough/store/reducers** folder contains a sample reducer:

**exampleReducer.js**

[!code-javascript[Example reducer](~/remote-monitoring-webui/src/walkthrough/store/reducers/exampleReducer.js?name=reducer "Example reducer")]

Copy **exampleReducer.js** to the **src/store/reducers** folder.

To learn more about the reducer and **Epics**, see [redux-observable](https://redux-observable.js.org/).

### Configure the middleware

To configure the middleware, add the reducer to the **rootReducer.js** file in the **src/store** folder:

```js
import { reducer as exampleReducer } from './reducers/exampleReducer';

const rootReducer = combineReducers({
  ...appReducer,
  ...devicesReducer,
  ...rulesReducer,
  ...simulationReducer,
  ...exampleReducer
});
```

Add the epics to the **rootEpics.js** file in the **src/store** folder:

```js
import { epics as exampleEpics } from './reducers/exampleReducer';

// Extract the epic function from each property object
const epics = [
  ...appEpics.getEpics(),
  ...devicesEpics.getEpics(),
  ...rulesEpics.getEpics(),
  ...simulationEpics.getEpics(),
  ...exampleEpics.getEpics()
];
```

## Next steps

In this article, you learned about the resources available to help you add or customize services in the web UI in the Remote Monitoring solution accelerator.

Now you have defined a service, the next step is to [Add a custom grid to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-grid.md) that displays data returned by the service.

For more conceptual information about the Remote Monitoring solution accelerator, see [Remote Monitoring architecture](iot-accelerators-remote-monitoring-sample-walkthrough.md).
