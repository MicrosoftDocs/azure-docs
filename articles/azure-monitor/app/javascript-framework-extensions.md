---
title: Enable a framework extension for Application Insights JavaScript SDK
description: Learn how to install and use JavaScript framework extensions for the Application Insights JavaScript SDK. 
services: azure-monitor
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/10/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Enable a framework extension for Application Insights JavaScript SDK

In addition to the core SDK, there are also plugins available for specific frameworks, such as the [React plugin](javascript-framework-extensions.md?tabs=react), the [React Native plugin](javascript-framework-extensions.md?tabs=reactnative), and the [Angular plugin](javascript-framework-extensions.md?tabs=angular).

These plugins provide extra functionality and integration with the specific framework.

## Prerequisites

- Install the [JavaScript SDK](./javascript-sdk.md).

### [React](#tab/react)

None.

### [React Native](#tab/reactnative)

- You must be using a version >= 2.0.0 of `@microsoft/applicationinsights-web`. This plugin only works in react-native apps. It doesn't work with [apps using the Expo framework](https://docs.expo.io/) or Create React Native App, which is based on the Expo framework.

### [Angular](#tab/angular)

- The Angular plugin is NOT ECMAScript 3 (ES3) compatible.
- When we add support for a new Angular version, our npm package becomes incompatible with down-level Angular versions. Continue to use older npm packages until you're ready to upgrade your Angular version.

---

## What does the plug-in enable?

### [React](#tab/react)

The React plug-in for the Application Insights JavaScript SDK enables:

- Track router history
- Track exceptions
- Track components usage
- Use Application Insights with React Context

### [React Native](#tab/reactnative)

The React Native plugin for Application Insights JavaScript SDK enables: 

- Track exceptions 
- Collect device information

   By default, this plugin automatically collects:

  - **Unique Device ID** (Also known as Installation ID.)
  - **Device Model Name** (Such as iPhone XS, Samsung Galaxy Fold, Huawei P30 Pro etc.)
  - **Device Type** (For example, handset, tablet, etc.)

- Disable automatic device info collection
- Use your own device info collection class
- Override the device information

### [Angular](#tab/angular)

The Angular plugin for the Application Insights JavaScript SDK enables:

- Track router history
- Track exceptions
- Chain more custom exception handlers

---

## Add a plug-in

To add a plug-in, follow the steps in this section.

### Install the package

#### [React](#tab/react)

```bash

npm install @microsoft/applicationinsights-react-js

```

#### [React Native](#tab/reactnative)

- **React Native Plugin**

  By default, the React Native Plugin relies on the [`react-native-device-info` package](https://www.npmjs.com/package/react-native-device-info). You must install and link to this package. Keep the `react-native-device-info` package up to date to collect the latest device names using your app.

  Since v3, support for accessing the DeviceInfo has been abstracted into an interface `IDeviceInfoModule` to enable you to use / set your own device info module. This interface uses the same function names and result `react-native-device-info`.

  ```zsh

  npm install --save @microsoft/applicationinsights-react-native @microsoft/applicationinsights-web
  npm install --save react-native-device-info
  react-native link react-native-device-info

  ```

- **React Native Manual Device Plugin**

  If you're using React Native Expo, add the React Native Manual Device Plugin instead of the React Native Plugin. The React Native Plugin uses the `react-native-device-info package` package, which React Native Expo doesn't support.

  ```bash

  npm install --save @microsoft/applicationinsights-react-native @microsoft/applicationinsights-web

  ```



#### [Angular](#tab/angular)

```bash
npm install @microsoft/applicationinsights-angularplugin-js
```

---

### Add the extension to your code

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

#### [React](#tab/react)

Initialize a connection to Application Insights:

```javascript
import React from 'react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from "history";
const browserHistory = createBrowserHistory({ basename: '' });
var reactPlugin = new ReactPlugin();
// *** Add the Click Analytics plug-in. ***
/* var clickPluginInstance = new ClickAnalyticsPlugin();
   var clickPluginConfig = {
     autoCapture: true
}; */
var appInsights = new ApplicationInsights({
    config: {
        connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
        // *** If you're adding the Click Analytics plug-in, delete the next line. ***
        extensions: [reactPlugin],
     // *** Add the Click Analytics plug-in. ***
     // extensions: [reactPlugin, clickPluginInstance],
        extensionConfig: {
          [reactPlugin.identifier]: { history: browserHistory }
       // *** Add the Click Analytics plug-in. ***
       // [clickPluginInstance.identifier]: clickPluginConfig
        }
    }
});
appInsights.loadAppInsights();
```

#### [React Native](#tab/reactnative)

- **React Native Plug-in**

  To use this plugin, you need to construct the plugin and add it as an `extension` to your existing Application Insights instance.

  ```typescript
  import { ApplicationInsights } from '@microsoft/applicationinsights-web';
  import { ReactNativePlugin } from '@microsoft/applicationinsights-react-native';
  // *** Add the Click Analytics plug-in. ***
  // import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
  var RNPlugin = new ReactNativePlugin();
  // *** Add the Click Analytics plug-in. ***
  /* var clickPluginInstance = new ClickAnalyticsPlugin();
  var clickPluginConfig = {
  autoCapture: true
  }; */
  var appInsights = new ApplicationInsights({
      config: {
          connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
          // *** If you're adding the Click Analytics plug-in, delete the next line. ***
          extensions: [RNPlugin]
       // *** Add the Click Analytics plug-in. ***
       /* extensions: [RNPlugin, clickPluginInstance],
               extensionConfig: {
                   [clickPluginInstance.identifier]: clickPluginConfig
            } */
      }
  });
  appInsights.loadAppInsights();

  ```

- **React Native Manual Device Plugin**

  To use this plugin, you must either disable automatic device info collection or use your own device info collection class after you add the extension to your code.

  1. Construct the plugin and add it as an `extension` to your existing Application Insights instance.

     ```typescript
     import { ApplicationInsights } from '@microsoft/applicationinsights-web';
     import { ReactNativePlugin } from '@microsoft/applicationinsights-react-native';

     var RNMPlugin = new ReactNativePlugin();
     var appInsights = new ApplicationInsights({
         config: {
             instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
             extensions: [RNMPlugin]
         }
     });
     appInsights.loadAppInsights();
     ```

  1. Do one of the following:

     - Disable automatic device info collection.

       ```typescript
       import { ApplicationInsights } from '@microsoft/applicationinsights-web';

       var RNMPlugin = new ReactNativeManualDevicePlugin();
       var appInsights = new ApplicationInsights({
           config: {
               instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
               disableDeviceCollection: true,
               extensions: [RNMPlugin]
           }
       });
       appInsights.loadAppInsights();
       ```

     - Use your own device info collection class.

       ```typescript
       import { ApplicationInsights } from '@microsoft/applicationinsights-web';

       // Simple inline constant implementation
       const myDeviceInfoModule = {
           getModel: () => "deviceModel",
           getDeviceType: () => "deviceType",
           // v5 returns a string while latest returns a promise
           getUniqueId: () => "deviceId",         // This "may" also return a Promise<string>
       };

       var RNMPlugin = new ReactNativeManualDevicePlugin();
       RNMPlugin.setDeviceInfoModule(myDeviceInfoModule);

       var appInsights = new ApplicationInsights({
           config: {
               instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
               extensions: [RNMPlugin]
           }
       });

       appInsights.loadAppInsights();
       ```

#### [Angular](#tab/angular)

Set up an instance of Application Insights in the entry component in your app:

> [!IMPORTANT]
> When using the ErrorService, there is an implicit dependency on the `@microsoft/applicationinsights-analytics-js` extension. you MUST include either the `'@microsoft/applicationinsights-web'` or include the `@microsoft/applicationinsights-analytics-js` extension. Otherwise, unhandled exceptions caught by the error service will not be sent.

```js
import { Component } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
// *** Add the Click Analytics plug-in. ***
// import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private router: Router
    ){
        var angularPlugin = new AngularPlugin();
     // *** Add the Click Analytics plug-in. ***
     /* var clickPluginInstance = new ClickAnalyticsPlugin();
        var clickPluginConfig = {
          autoCapture: true
        }; */
        const appInsights = new ApplicationInsights({
            config: {
                connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
                // *** If you're adding the Click Analytics plug-in, delete the next line. ***  
                extensions: [angularPlugin],
             // *** Add the Click Analytics plug-in. ***
             // extensions: [angularPlugin, clickPluginInstance],
                extensionConfig: {
                    [angularPlugin.identifier]: { router: this.router }
                 // *** Add the Click Analytics plug-in. ***
                 // [clickPluginInstance.identifier]: clickPluginConfig
                }
            } 
         });
        appInsights.loadAppInsights();
    }
}
```

---

### (Optional) Add the Click Analytics plug-in
   
If you want to add the [Click Analytics plug-in](./javascript-feature-extensions.md):
 
1. Uncomment the lines for Click Analytics.
1. Do one of the following, depending on which plug-in you're adding:

   - For React, delete `extensions: [reactPlugin],`.
   - For React Native, delete `extensions: [RNPlugin]`.
   - For Angular, delete `extensions: [angularPlugin],`.

1. See [Use the Click Analytics plug-in](./javascript-feature-extensions.md#use-the-plug-in) to continue with the setup process.

## Configuration

This section covers configuration settings for the framework extensions for Application Insights JavaScript SDK.

### Track router history

#### [React](#tab/react)

| Name    | Type   | Required? | Default | Description |
|---------|--------|-----------|---------|------------------|
| history | object | Optional  | null    | Track router history. For more information, see the [React router package documentation](https://reactrouter.com/en/main).<br><br>To track router history, most users can use the `enableAutoRouteTracking` field in the [JavaScript SDK configuration](./javascript-sdk-configuration.md#sdk-configuration). This field collects the same data for page views as the `history` object.<br><br>Use the `history` object when you're using a router implementation that doesn't update the browser URL, which is what the configuration listens to. You shouldn't enable both the `enableAutoRouteTracking` field and `history` object, because you'll get multiple page view events. |

The following code example shows how to enable the `enableAutoRouteTracking` field.

```javascript
var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
    config: {
        connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
        enableAutoRouteTracking: true,
        extensions: [reactPlugin]
    }
});
appInsights.loadAppInsights();
```

#### [React Native](#tab/reactnative)

React Native doesn't track router changes but does track [page views](./api-custom-events-metrics.md#page-views).

#### [Angular](#tab/angular)

| Name    | Type   | Required? | Default | Description |
|---------|--------|-----------|---------|------------------|
| router  | object | Optional  | null    | Angular router for enabling Application Insights PageView tracking. |

The following code example shows how to enable tracking of router history.

```javascript
import { Component } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private router: Router
    ){
        var angularPlugin = new AngularPlugin();
        const appInsights = new ApplicationInsights({ config: {
        connectionString: 'YOUR_CONNECTION_STRING',
        extensions: [angularPlugin],
        extensionConfig: {
            [angularPlugin.identifier]: { router: this.router }
        }
        } });
        appInsights.loadAppInsights();
    }
}
```

---

### Track exceptions

#### [React](#tab/react)

[React error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) provide a way to gracefully handle an uncaught exception when it occurs within a React application. When such an exception occurs, it's likely that the exception needs to be logged. The React plug-in for Application Insights provides an error boundary component that automatically logs the exception when it occurs.

```javascript
import React from "react";
import { reactPlugin } from "./AppInsights";
import { AppInsightsErrorBoundary } from "@microsoft/applicationinsights-react-js";

const App = () => {
    return (
        <AppInsightsErrorBoundary onError={() => <h1>I believe something went wrong</h1>} appInsights={reactPlugin}>
            /* app here */
        </AppInsightsErrorBoundary>
    );
};
```

The `AppInsightsErrorBoundary` requires two props to be passed to it. They're the `ReactPlugin` instance created for the application and a component to be rendered when an exception occurs. When an unhandled exception occurs, `trackException` is called with the information provided to the error boundary, and the `onError` component appears.

#### [React Native](#tab/reactnative)

The tracking of uncaught exceptions is enabled by default. If you want to disable the tracking of uncaught exceptions, set `disableExceptionCollection` to `true`.

```javascript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

var RNPlugin = new ReactNativePlugin();
var appInsights = new ApplicationInsights({
    config: {
        connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
        disableExceptionCollection: true,
        extensions: [RNPlugin]
    }
});
appInsights.loadAppInsights();
```

#### [Angular](#tab/angular)

To track uncaught exceptions, set up ApplicationinsightsAngularpluginErrorService in `app.module.ts`:

> [!IMPORTANT]
> When using the ErrorService, there is an implicit dependency on the `@microsoft/applicationinsights-analytics-js` extension. you MUST include either the `'@microsoft/applicationinsights-web'` or include the `@microsoft/applicationinsights-analytics-js` extension. Otherwise, unhandled exceptions caught by the error service will not be sent.

```js
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

@NgModule({
  ...
  providers: [
    {
      provide: ErrorHandler,
      useClass: ApplicationinsightsAngularpluginErrorService
    }
  ]
  ...
})
export class AppModule { }
```

#### Chain more custom exception handlers

Chain more custom exception handlers when you want to want the application to gracefully handle what would previously have been an unhandled exception, but you still want to report this exception as an application failure.

To chain more custom exception handlers:

1. Create custom exception handlers that implement IErrorService.

   ```javascript
   import { IErrorService } from '@microsoft/applicationinsights-angularplugin-js';

   export class CustomErrorHandler implements IErrorService {
       handleError(error: any) {
           ...
       }
   }
   ```

1. Pass errorServices array through extensionConfig.

   ```javascript
   extensionConfig: {
           [angularPlugin.identifier]: {
             router: this.router,
             errorServices: [new CustomErrorHandler()]
           }
         }
   ```

---

### Collect device information

#### [React](#tab/react)

The device information, which includes Browser, OS, version, and language, is already being collected by the Application Insights web package.

#### [React Native](#tab/reactnative)

- **React Native Plugin**: In addition to user agent info from the browser, which is collected by Application Insights web package, React Native also collects device information. Device information is automatically collected when you add the plug-in.
- **React Native Manual Device Plugin**: Depending on how you configured the plugin when you added the extension to your code, this plugin either:
   - Doesn't collect device information
   - Uses your own device info collection class

#### [Angular](#tab/angular)

The device information, which includes Browser, OS, version, and language, is already being collected by the Application Insights web package.

---

### Configuration (other)

#### [React](#tab/react)

#### Track components usage

A feature that's unique to the React plug-in is that you're able to instrument specific components and track them individually.

To instrument React components with usage tracking, apply the `withAITracking` higher-order component function. To enable Application Insights for a component, wrap `withAITracking` around the component:

```javascript
import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from './AppInsights';

// To instrument various React components usage tracking, apply the `withAITracking` higher-order
// component function.

class MyComponent extends React.Component {
    ...
}

// withAITracking takes 4 parameters (reactPlugin, Component, ComponentName, className). 
// The first two are required and the other two are optional.

export default withAITracking(reactPlugin, MyComponent);
```

It measures time from the [`ComponentDidMount`](https://react.dev/reference/react/Component#componentdidmount) event through the [`ComponentWillUnmount`](https://react.dev/reference/react/Component#componentwillunmount) event. To make the result more accurate, it subtracts the time in which the user was idle by using `React Component Engaged Time = ComponentWillUnmount timestamp - ComponentDidMount timestamp - idle time`.

##### Explore your data

Use  [Metrics Explorer](../essentials/metrics-getting-started.md) to plot a chart for the custom metric name `React Component Engaged Time (seconds)` and [split](../essentials/metrics-getting-started.md#apply-dimension-filters-and-splitting) this custom metric by `Component Name`.

:::image type="content" source="./media/javascript-react-plugin/chart.png" lightbox="./media/javascript-react-plugin/chart.png" alt-text="Screenshot that shows a chart that displays the custom metric React Component Engaged Time (seconds) split by Component Name":::

You can also run [custom queries](../logs/log-analytics-tutorial.md) to divide Application Insights data to generate reports and visualizations as per your requirements. Here’s an example of a custom query. Go ahead and paste it directly into the query editor to test it out.

```Kusto
customMetrics
| where name contains "React Component Engaged Time (seconds)"
| summarize avg(value), count() by tostring(customDimensions["Component Name"])
```

It can take up to 10 minutes for new custom metrics to appear in the Azure portal.

#### Use Application Insights with React Context

We provide general hooks to allow you to customize the change tracking for individual components. Alternatively, you can use [useTrackMetric](#usetrackmetric) or [useTrackEvent](#usetrackevent), which are pre-defined contacts we provide for tracking the changes to components.

The React Hooks for Application Insights are designed to use [React Context](https://react.dev/learn/passing-data-deeply-with-context) as a containing aspect for it. To use Context, initialize Application Insights, and then import the Context object:

```javascript
import React from "react";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "./AppInsights";

const App = () => {
    return (
        <AppInsightsContext.Provider value={reactPlugin}>
            /* your application here */
        </AppInsightsContext.Provider>
    );
};
```

This Context Provider makes Application Insights available as a `useContext` Hook within all children components of it:

```javascript
import React from "react";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";

const MyComponent = () => {
    const appInsights = useAppInsightsContext();
    const metricData = {
        average: engagementTime,
        name: "React Component Engaged Time (seconds)",
        sampleCount: 1
      };
    const additionalProperties = { "Component Name": 'MyComponent' };
    appInsights.trackMetric(metricData, additionalProperties);
    
    return (
        <h1>My Component</h1>
    );
}
export default MyComponent;
```

##### useTrackMetric

The `useTrackMetric` Hook replicates the functionality of the `withAITracking` higher-order component, without adding another component to the component structure. The Hook takes two arguments:

- The Application Insights instance, which can be obtained from the `useAppInsightsContext` Hook.
- An identifier for the component for tracking, such as its name.

```javascript
import React from "react";
import { useAppInsightsContext, useTrackMetric } from "@microsoft/applicationinsights-react-js";

const MyComponent = () => {
    const appInsights = useAppInsightsContext();
    const trackComponent = useTrackMetric(appInsights, "MyComponent");
    
    return (
        <h1 onHover={trackComponent} onClick={trackComponent}>My Component</h1>
    );
}
export default MyComponent;
```

It operates like the higher-order component, but it responds to Hooks lifecycle events rather than a component lifecycle. If there's a need to run on particular interactions, the Hook needs to be explicitly provided to user events.

##### useTrackEvent

Use the `useTrackEvent` Hook to track any custom event that an application might need to track, such as a button click or other API call. It takes four arguments:

-   Application Insights instance, which can be obtained from the `useAppInsightsContext` Hook.
-   Name for the event.
-   Event data object that encapsulates the changes that have to be tracked.
-   skipFirstRun (optional) flag to skip calling the `trackEvent` call on initialization. The default value is set to `true` to mimic more closely the way the non-Hook version works. With `useEffect` Hooks, the effect is triggered on each value update _including_ the initial setting of the value. As a result, tracking starts too early, which causes potentially unwanted events to be tracked.

```javascript
import React, { useState, useEffect } from "react";
import { useAppInsightsContext, useTrackEvent } from "@microsoft/applicationinsights-react-js";

const MyComponent = () => {
    const appInsights = useAppInsightsContext();
    const [cart, setCart] = useState([]);
    const trackCheckout = useTrackEvent(appInsights, "Checkout", cart);
    const trackCartUpdate = useTrackEvent(appInsights, "Cart Updated", cart);
    useEffect(() => {
        trackCartUpdate({ cartCount: cart.length });
    }, [cart]);
    
    const performCheckout = () => {
        trackCheckout();
        // submit data
    };
    
    return (
        <div>
            <ul>
                <li>Product 1 <button onClick={() => setCart([...cart, "Product 1"])}>Add to Cart</button></li>
                <li>Product 2 <button onClick={() => setCart([...cart, "Product 2"])}>Add to Cart</button></li>
                <li>Product 3 <button onClick={() => setCart([...cart, "Product 3"])}>Add to Cart</button></li>
                <li>Product 4 <button onClick={() => setCart([...cart, "Product 4"])}>Add to Cart</button></li>
            </ul>
            <button onClick={performCheckout}>Checkout</button>
        </div>
    );
}

export default MyComponent;
```

When the Hook is used, a data payload can be provided to it to add more data to the event when it's stored in Application Insights.

#### [React Native](#tab/reactnative)

#### Disable automatic device info collection

If you don’t want to collect the device information, you can set `disableDeviceCollection` to `true`. 

```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

var RNPlugin = new ReactNativePlugin();
var appInsights = new ApplicationInsights({
    config: {
        connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
        disableDeviceCollection: true,
        extensions: [RNPlugin]
    }
});
appInsights.loadAppInsights();
```

#### Use your own device info collection class

If you want to override your own device’s information, you can use `myDeviceInfoModule` to collect your own device information. 

```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// Simple inline constant implementation
const myDeviceInfoModule = {
    getModel: () => "deviceModel",
    getDeviceType: () => "deviceType",
    // v5 returns a string while latest returns a promise
    getUniqueId: () => "deviceId",         // This "may" also return a Promise<string>
};

var RNPlugin = new ReactNativePlugin();
RNPlugin.setDeviceInfoModule(myDeviceInfoModule);

var appInsights = new ApplicationInsights({
    config: {
        connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
        extensions: [RNPlugin]
    }
});

appInsights.loadAppInsights();
```

#### Override the device information

Use the `IDeviceInfoModule` interface to abstract how the plug-in can access the Device Info. This interface is a stripped down version of the `react-native-device-info` interface and is mostly supplied for testing.

```typescript
export interface IDeviceInfoModule {
    /**
     * Returns the Device Model
     */
    getModel: () => string;

    /**
     * Returns the device type
     */
    getDeviceType: () => string;

    /**
     * Returns the unique Id for the device. To support both the current version and previous
     * versions react-native-device-info, this may return either a `string` or `Promise<string>`.
     * When a promise is returned, the plugin will "wait" for the promise to `resolve` or `reject`
     * before processing any events. This WILL cause telemetry to be BLOCKED until either of these
     * states, so when returning a Promise, it MUST `resolve` or `reject`. Tt can't just never resolve.
     * There is a default timeout configured via `uniqueIdPromiseTimeout` to automatically unblock
     * event processing when this issue occurs.
     */
    getUniqueId: () => Promise<string> | string;
}
```

If events are getting "blocked" because the `Promise` returned via `getUniqueId` is never resolved / rejected, you can call `setDeviceId()` on the plugin to "unblock" this waiting state. There is also an automatic timeout configured via `uniqueIdPromiseTimeout` (defaults to 5 seconds), which will internally call `setDeviceId()` with any previously configured value.

#### [Angular](#tab/angular)

N/A

---

## Sample app

### [React](#tab/react)

Check out the [Application Insights React demo](https://github.com/microsoft/applicationinsights-react-js/tree/main/sample/applicationinsights-react-sample).

### [React Native](#tab/reactnative)

Currently unavailable.

### [Angular](#tab/angular)

Check out the [Application Insights Angular demo](https://github.com/microsoft/applicationinsights-angularplugin-js/tree/main/sample/applicationinsights-angularplugin-sample).

---

## Next steps

- [Confirm data is flowing](javascript-sdk.md#confirm-data-is-flowing).
