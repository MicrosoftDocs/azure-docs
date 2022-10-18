---
title: Angular plugin for Application Insights JavaScript SDK
description: How to install and use Angular plugin for Application Insights JavaScript SDK. 
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/07/2020
ms.devlang: javascript
ms.reviewer: mmcc
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

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

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
        connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE',
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

In JavaScript correlation is turned off by default in order to minimize the telemetry we send by default. To enable correlation please reference [JavaScript client-side correlation documentation](./javascript.md#enable-distributed-tracing).

### Route tracking

The Angular Plugin automatically tracks route changes and collects other Angular specific telemetry. 

> [!NOTE]
> `enableAutoRouteTracking` should be set to `false` if it set to true then when the route changes duplicate PageViews may be sent.

### PageView

If a custom `PageView` duration is not provided, `PageView` duration defaults to a value of 0. 

## Next steps

- To learn more about the JavaScript SDK, see the [Application Insights JavaScript SDK documentation](javascript.md)
- [Angular plugin on GitHub](https://github.com/microsoft/applicationinsights-angularplugin-js)
