---
title: React Native plugin for Application Insights JavaScript SDK 
description: How to install and use the React Native plugin for Application Insights JavaScript SDK. 
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 08/06/2020
ms.devlang: javascript
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

```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactNativePlugin } from '@microsoft/applicationinsights-react-native';

var RNPlugin = new ReactNativePlugin();
var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        extensions: [RNPlugin]
    }
});
appInsights.loadAppInsights();

```

## Enable Correlation

Correlation generates and sends data that enables distributed tracing and powers the [application map](../app/app-map.md), [end-to-end transaction view](../app/app-map.md#go-to-details), and other diagnostic tools.

The following example shows standard configuration options for enabling correlation:

```js
const configObj = {
  instrumentationKey: "YOUR INSTRUMENTATION KEY",
  disableFetchTracking: false,
  enableCorsCorrelation: true,
  enableRequestHeaderTracking: true,
  enableResponseHeaderTracking: true,
  correlationHeaderExcludedDomains: ['*.queue.core.windows.net'],
  extensions: [clickPluginInstance],
  extensionConfig: {
    [clickPluginInstance.identifier]: clickPluginConfig
  },
};
``` 

### Correlation header excluded domains

The `correlationHeaderExcludedDomains` configuration property is an exclude list that disables correlation headers for specific domains, this is useful for when including those headers would cause the request to fail or not be sent due to third-party server configuration. This property supports wildcards.
An example would be `*.queue.core.windows.net`, as seen in the code sample above.
Adding the application domain to this property should be avoided as it stops the SDK from including the required distributed tracing `Request-Id`, `Request-Context` and `traceparent` headers as part of the request.

### CORS configuration

The server-side needs to be able to accept connections with those headers present. Depending on the `Access-Control-Allow-Headers` configuration on the server-side it's often necessary to extend the server-side list by manually adding `Request-Id`, `Request-Context` and `traceparent` (W3C distributed header).

Access-Control-Allow-Headers: `Request-Id`, `traceparent`, `Request-Context`, `<your header>`

> [!NOTE]
> If you are using OpenTelemtry or Application Insights SDKs released in 2020 or later, we recommend using [WC3 TraceContext](https://www.w3.org/TR/trace-context/). See configuration guidance [here](../app/correlation.md#enable-w3c-distributed-tracing-support-for-web-apps).

### Route tracking

Currently, we offer a desktop client [React plugin](javascript-react-plugin.md), which you can initialize with the JS SDK. It sets up route change tracking, and collects other React specific telemetry.

> [!NOTE]
> Use `enableAutoRouteTracking: true` only if you are **not** using the React plugin. Both are capable of sending new PageViews when the route changes. If both are enabled, duplicate PageViews may be sent.

### PageView

If a custom `PageView` duration is not provided, `PageView` duration defaults to a value of 0. 

## Next steps

- To learn more about the JavaScript SDK, see the [Application Insights JavaScript SDK documentation](javascript.md).
- To learn about the Kusto query language and querying data in Log Analytics, see the [Log query overview](../../azure-monitor/logs/log-query-overview.md).
