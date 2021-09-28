---
title: Angular plugin for Application Insights JavaScript SDK
description: How to install and use Angular plugin for Application Insights JavaScript SDK. 
services: azure-monitor
author: lgayhardt

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/07/2020
ms.author: lagayhar
---

# Angular plugin for Application Insights JavaScript SDK

The Angular plugin for the Application Insights JavaScript SDK, enables:

- Tracking of router changes
- Tracking uncaught exceptions

> [!WARNING]
> Angular plugin is NOT ECMAScript 3 (ES3) compatible.

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

## Next steps

- To learn more about the JavaScript SDK, see the [Application Insights JavaScript SDK documentation](javascript.md)
- [Angular plugin on GitHub](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-angularplugin-js)
