---
title: React Native plugin for Application Insights JavaScript SDK 
description: How to install and use the React Native plugin for Application Insights JavaScript SDK. 
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 08/06/2020
ms.devlang: javascript
ms.reviewer: mmcc
---

# React Native plugin for Application Insights JavaScript SDK

The React Native plugin for Application Insights JavaScript SDK collects device information, by default this plugin automatically collects:

- **Unique Device ID** (Also known as Installation ID.)
- **Device Model Name** (Such as iPhone X, Samsung Galaxy Fold, Huawei P30 Pro etc.)
- **Device Type** (For example, handset, tablet, etc.)

## Requirements

You must be using a version >= 2.0.0 of `@microsoft/applicationinsights-web`. This plugin will only work in react-native apps. It will not work with [apps using the Expo framework](https://docs.expo.io/), therefore it will not work with Create React Native App.

## Getting started

Install and link the [react-native-device-info](https://www.npmjs.com/package/react-native-device-info) package. Keep the `react-native-device-info` package up to date to collect the latest device names using your app.

```zsh

npm install --save @microsoft/applicationinsights-react-native @microsoft/applicationinsights-web
npm install --save react-native-device-info
react-native link react-native-device-info

```

## Initializing the plugin

To use this plugin, you need to construct the plugin and add it as an `extension` to your existing Application Insights instance.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactNativePlugin } from '@microsoft/applicationinsights-react-native';

var RNPlugin = new ReactNativePlugin();
var appInsights = new ApplicationInsights({
    config: {
        connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
        extensions: [RNPlugin]
    }
});
appInsights.loadAppInsights();

```

## Enable Correlation

Correlation generates and sends data that enables distributed tracing and powers the [application map](../app/app-map.md), [end-to-end transaction view](../app/app-map.md#go-to-details), and other diagnostic tools.

In JavaScript correlation is turned off by default in order to minimize the telemetry we send by default. To enable correlation please reference [JavaScript client-side correlation documentation](./javascript.md#enable-distributed-tracing).

### PageView

If a custom `PageView` duration is not provided, `PageView` duration defaults to a value of 0. 

## Next steps

- To learn more about the JavaScript SDK, see the [Application Insights JavaScript SDK documentation](javascript.md).
- To learn about the Kusto query language and querying data in Log Analytics, see the [Log query overview](../../azure-monitor/logs/log-query-overview.md).
