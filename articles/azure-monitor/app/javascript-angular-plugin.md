---
title: Angular plug-in for Application Insights JavaScript SDK
description: Learn how to install and use the Angular plug-in for the Application Insights JavaScript SDK. 
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 01/10/2023
ms.devlang: javascript
ms.reviewer: mmcc
---

# Angular plug-in for the Application Insights JavaScript SDK

The Angular plug-in for the Application Insights JavaScript SDK enables:

- Tracking of router changes.
- Tracking uncaught exceptions.

> [!WARNING]
> The Angular plug-in *isn't* ECMAScript 3 (ES3) compatible.

When we add support for a new Angular version, our npm package becomes incompatible with down-level Angular versions. Continue to use older npm packages until you're ready to upgrade your Angular version.

## Get started

Install an npm package:

```bash
npm install @microsoft/applicationinsights-angularplugin-js @microsoft/applicationinsights-web --save
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

To track uncaught exceptions, set up `ApplicationinsightsAngularpluginErrorService` in `app.module.ts`:

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

## Enable correlation

Correlation generates and sends data that enables distributed tracing and powers [Application Map](../app/app-map.md), the [end-to-end transaction view](../app/app-map.md#go-to-details), and other diagnostic tools.

In JavaScript, correlation is turned off by default to minimize the telemetry we send by default. To enable correlation, see the [JavaScript client-side correlation documentation](./javascript.md#enable-distributed-tracing).

### Route tracking

The Angular plug-in automatically tracks route changes and collects other Angular-specific telemetry.

> [!NOTE]
> Set `enableAutoRouteTracking` to `false`. If it's set to `true`, when the route changes, duplicate `PageViews` might be sent.

### PageView

If a custom `PageView` duration isn't provided, the `PageView` duration defaults to a value of `0`.

## Next steps

- To learn more about the JavaScript SDK, see the [Application Insights JavaScript SDK documentation](javascript.md).
- See the [Angular plug-in on GitHub](https://github.com/microsoft/applicationinsights-angularplugin-js).
