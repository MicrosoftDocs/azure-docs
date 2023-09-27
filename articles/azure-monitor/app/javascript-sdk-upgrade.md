---
title: Azure Application Insights JavaScript SDK upgrade information
description: Azure Application Insights JavaScript SDK upgrade information
ms.topic: conceptual
ms.date: 02/13/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Upgrade from old versions of the Application Insights JavaScript SDK

Upgrading to the new version of the Application Insights JavaScript SDK can provide several advantages such as:

> [!div class="checklist"]
> - Improved performance and bug fixes
> - New features and functionalities
> - Better compatibility with other technologies
> - Enhanced security and data privacy

## Breaking changes in the SDK V2 version:

- To allow for better API signatures, some of the API calls, such as trackPageView and trackException, have been updated. Running in Internet Explorer 8 and earlier versions of the browser isn't supported.
- The telemetry envelope has field name and structure changes due to data schema updates.
- Moved `context.operation` to `context.telemetryTrace`. Some fields were also changed (`operation.id` --> `telemetryTrace.traceID`).
  
  To manually refresh the current pageview ID, for example, in single-page applications, use `appInsights.properties.context.telemetryTrace.traceID = Microsoft.ApplicationInsights.Telemetry.Util.generateW3CId()`.

  > [!NOTE]
  > To keep the trace ID unique, now use `Util.generateW3CId()` where you previously used `Util.newId()`. Both ultimately end up being the operation ID.

If you're using the current application insights PRODUCTION SDK (1.0.20) and want to see if the new SDK works in runtime, update the URL depending on your current SDK loading scenario.

- Download via CDN scenario: Update the JavaScript (Web) SDK Loader Script that you currently use to point to the following URL:
   ```
   "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js"
   ```

- npm scenario: Call `downloadAndSetup` to download the full ApplicationInsights script from CDN and initialize it with a connection string:

   ```ts
   appInsights.downloadAndSetup({
     connectionString: "Copy connection string from Application Insights Resource Overview",
     url: "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js"
     });
   ```

Test in an internal environment to verify the monitoring telemetry is working as expected. If all works, update your API signatures appropriately to SDK v2 and deploy in your production environments.

## Next steps
- To learn more about the JavaScript SDK, see the [Application Insights JavaScript SDK documentation](javascript.md).
- To learn about the Kusto Query Language and querying data in Log Analytics, see the [Log query overview](../../azure-monitor/logs/log-query-overview.md).