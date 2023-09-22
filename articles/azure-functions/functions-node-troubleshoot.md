---
title: Troubleshoot Node.js apps in Azure Functions
description: Learn how to troubleshoot Node.js apps in Azure Functions.
ms.service: azure-functions
ms.date: 09/20/2023
ms.devlang: javascript, typescript
ms.custom: devx-track-js
ms.topic: how-to
zone_pivot_groups: functions-nodejs-model
---

# Troubleshoot Node.js apps in Azure Functions

[!INCLUDE [functions-nodejs-model-pivot-description](../../includes/functions-nodejs-model-pivot-description.md)]

This article provides a guide for troubleshooting common scenarios in Node.js function apps.

The **Diagnose and solve problems** tab in the Azure portal is a useful resource to monitor and diagnose possible issues related to your application. It also supplies potential solutions to your problems based on the diagnosis. For more information, see [Azure Function app diagnostics](./functions-diagnostics.md). 

Another useful resource is the **Logs** tab in the Azure Portal for your Application Insights instance so that you can run custom [KQL queries](/azure/data-explorer/kusto/query/). The following example query shows how to view errors and warnings for your app in the past day:

```kusto
let myAppName = "<your app name>";
let startTime = ago(1d);
let endTime = now();
union traces,requests,exceptions
| where cloud_RoleName =~ myAppName
| where timestamp between (startTime .. endTime)
| where severityLevel > 2
```

If those resources didn't solve your problem, the following sections provide advice for specific application issues:

## No Functions Found

If you see this error in your deployment logs:

> No HTTP triggers found.

Or this error in your function app logs:

> No job functions found. Try making your job classes and methods public. If you're using binding extensions (e.g. Azure Storage, ServiceBus, Timers, etc.) make sure you've called the registration method for the extension(s) in your startup code (e.g. builder.AddAzureStorage(), builder.AddServiceBus(), builder.AddTimers(), etc.).

Try the following fixes:

::: zone pivot="nodejs-model-v4"
- If you're running locally:
    - Make sure you're on Azure Functions Core Tools v4.0.5382 or higher.
- If you're running in Azure:
    - Make sure you're on [Azure Functions Runtime Version](./functions-versions.md) 4.25 or higher.
    - Make sure you're on Node.js v18 or higher.
    - Check your function app logs for entry point errors. First, set the app setting `FUNCTIONS_NODE_BLOCK_ON_ENTRY_POINT_ERROR` to `1` to ensure all errors are tracked in yours logs. The following example query shows how to view entry point errors for your app in the past day:

        ```kusto
        let myAppName = "<your app name>";
        let startTime = ago(1d);
        let endTime = now();
        union traces,requests,exceptions
        | where cloud_RoleName =~ myAppName
        | where timestamp between (startTime .. endTime)
        | where severityLevel > 2
        | where message has "entry point"
        ```

::: zone-end
::: zone pivot="nodejs-model-v3"
- Make sure your app has the [required folder structure](./functions-reference-node.md?pivots=nodejs-model-v3#folder-structure) with a *host.json* at the root and a folder for each function containing a *function.json* file.
::: zone-end

::: zone pivot="nodejs-model-v4"
## Undici request is not a constructor

If you get the following error in your function app logs:

> System.Private.CoreLib: Exception while executing function: Functions.httpTrigger1. System.Private.CoreLib: Result: Failure
> Exception: undici_1.Request is not a constructor

Try the following fixes:
- Make sure you're on Node.js version 18.x or higher.

## Failed to detect the Azure Functions runtime

If you get the following error in your function app logs:

> WARNING: Failed to detect the Azure Functions runtime. Switching "@azure/functions" package to test mode - not all features are supported.

Try the following fixes:
- Check your `package.json` file for a reference to `applicationinsights` and make sure the version is `^2.7.1` or higher. After updating the version, run `npm install`
::: zone-end

## Next steps

Microsoft support engineers are available to help diagnosing issues with your application. If you're not able to diagnose your problem using this guide, you can file a support ticket by accessing the **Support + troubleshooting** section of your function app page in the Azure portal.

You can also contact the Azure Functions Node.js team directly [on GitHub](https://github.com/Azure/azure-functions-nodejs-library/issues).
