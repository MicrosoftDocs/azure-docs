---
title: Angular plugin for Application Insights JavaScript SDK
description: How to install and use Angular plugin for Application Insights JavaScript SDK. 
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/07/2020
ms.devlang: javascript
---

# Angular plugin for Application Insights JavaScript SDK

The Angular plugin for the Application Insights JavaScript SDK, enables:

- Tracking of router changes
- Tracking uncaught exceptions

> [!WARNING]
> Angular plugin is NOT ECMAScript 3 (ES3) compatible.

> [!IMPORTANT]
> When we add support for a new Angular version, our NPM package becomes incompatible with down-level Angular versions. Continue to use older NPM packages until you're ready to upgrade your Angular version.

## Getting started

Install npm package:

```bash
npm install @microsoft/applicationinsights-angularplugin-js
```

## Basic usage

Set up an instance of Application Insights in the entry component in your app:

```js
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
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        extensions: [angularPlugin],
        extensionConfig: {
            [angularPlugin.identifier]: { router: this.router }
        }
        } });
        appInsights.loadAppInsights();
    }
}
```

To track uncaught exceptions, setup ApplicationinsightsAngularpluginErrorService in `app.module.ts`:

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

The Angular Plugin automatically tracks route changes and collects other Angular specific telemetry. 

> [!NOTE]
> `enableAutoRouteTracking` should be set to `false` if it set to true then when the route changes duplicate PageViews may be sent.

### PageView

If a custom `PageView` duration is not provided, `PageView` duration defaults to a value of 0. 

## Next steps

- To learn more about the JavaScript SDK, see the [Application Insights JavaScript SDK documentation](javascript.md)
- [Angular plugin on GitHub](https://github.com/microsoft/applicationinsights-angularplugin-js)
