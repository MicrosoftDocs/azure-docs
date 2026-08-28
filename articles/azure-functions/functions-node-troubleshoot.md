---
title: Troubleshoot Node.js apps in Azure Functions
description: Learn how to troubleshoot common errors when you deploy or run a Node.js app in Azure Functions.
ms.service: azure-functions
ms.date: 09/20/2023
ms.devlang: javascript
# ms.devlang: javascript, typescript
ms.custom: devx-track-js
ms.topic: troubleshooting-general
zone_pivot_groups: functions-nodejs-model
---

# Troubleshoot Node.js apps in Azure Functions

[!INCLUDE [functions-nodejs-model-pivot-description](../../includes/functions-nodejs-model-pivot-description.md)]

This article provides a guide for troubleshooting common scenarios in Node.js function apps.

The **Diagnose and solve problems** tab in the [Azure portal](https://portal.azure.com) is a useful resource to monitor and diagnose possible issues related to your application. It also supplies potential solutions to your problems based on the diagnosis. For more information, see [Azure Function app diagnostics](./functions-diagnostics.md). 

Another useful resource is the **Logs** tab in the [Azure portal](https://portal.azure.com) for your Application Insights instance so that you can run custom [KQL queries](/azure/data-explorer/kusto/query/). The following example query shows how to view errors and warnings for your app in the past day:

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

## No functions found

If you see any of the following errors in your logs:

> No HTTP triggers found.

> No job functions found. Try making your job classes and methods public. If you're using binding extensions (e.g. Azure Storage, ServiceBus, Timers, etc.) make sure you've called the registration method for the extension(s) in your startup code (e.g. builder.AddAzureStorage(), builder.AddServiceBus(), builder.AddTimers(), etc.).

Try the following fixes:

::: zone pivot="nodejs-model-v4"
- When running locally, make sure you're using Azure Functions Core Tools v4.0.5382 or higher.
- When running in Azure:
    - Make sure you're using [Azure Functions Runtime Version](./functions-versions.md) 4.25 or higher.
    - Make sure you're using Node.js v18 or higher.
    - Set the app setting `FUNCTIONS_NODE_BLOCK_ON_ENTRY_POINT_ERROR` to `true`. This setting is recommended for all model v4 apps and ensures that all entry point errors are visible in your application insights logs. For more information, see [App settings reference for Azure Functions](./functions-app-settings.md#functions_node_block_on_entry_point_error).
    - Check your function app logs for entry point errors. The following example query shows how to view entry point errors for your app in the past day:

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

Make sure you're using Node.js version 22.x or higher.

## Failed to detect the Azure Functions runtime

If you get the following error in your function app logs:

> WARNING: Failed to detect the Azure Functions runtime. Switching "@azure/functions" package to test mode - not all features are supported.

Check your `package.json` file for a reference to `applicationinsights` and make sure the version is `^2.7.1` or higher. After updating the version, run `npm install`

## HTTP streams not working

If HTTP streaming isn't working:

- Verify `@azure/functions` package version is 4.3.0 or later.
- Ensure Azure Functions runtime version is 4.28 or later.
- Check that `app.setup({ enableHttpStream: true })` is called.
- Verify `FUNCTIONS_REQUEST_BODY_SIZE_LIMIT` is set appropriately for large data.

## Hooks not executing

If your hooks aren't running:

- Confirm you're using programming model v4.
- Verify hook registration syntax: `app.hook.preInvocation()` or `app.hook.appStart()`.
- Check that you register hooks before function definitions.
- Review trigger filtering if hooks should only run for specific function types.
::: zone-end

## TypeScript compilation issues

For TypeScript-specific problems:

**Build failures:**
- Verify `tsconfig.json` has correct `outDir` pointing to your build output
- Ensure `scriptFile` in v3 model points to compiled `.js` files, not `.ts`
- Check that all TypeScript dependencies are installed: `npm install --save-dev typescript @types/node`

**Type errors:**
- Update `@azure/functions` package for latest type definitions
- Use proper imports: `import { app, HttpRequest, InvocationContext } from '@azure/functions'`
- Verify function signatures match expected types

## Module resolution problems

**Cannot find module errors:**
- Run `npm install` to ensure all dependencies are installed
- Check `node_modules` folder exists in deployment package
- For ES modules, ensure filenames use `.mjs` extension or `package.json` has `"type": "module"`
- Verify relative import paths are correct after TypeScript compilation

## Environment and configuration issues

**Missing environment variables:**
- Add variables to `local.settings.json` for local development
- Set Application Settings in Azure portal for cloud deployment
- Use `process.env["VARIABLE_NAME"]` to access values

**Logging problems:**
- Use `context.log()` instead of `console.log()` for function-specific logs
- Check Application Insights connection string is configured
- Verify log levels in `host.json` for filtering

## Get help from Microsoft

You can get more help from Microsoft in one of the following ways:

- Search the known issues in the [Azure Functions Node.js repository](https://github.com/Azure/azure-functions-nodejs-library/issues). If you don't see your issue mentioned, create a new issue and let us know what has happened.
- If you're not able to diagnose your problem using this guide, Microsoft support engineers are available to help diagnose issues with your application. Microsoft offers [various support plans](https://azure.microsoft.com/support/plans). Create a support ticket in the **Support + troubleshooting** section of your function app page in the [Azure portal](https://portal.azure.com).

## Next steps

- [Microsoft Q&A page for Azure Functions](/answers/tags/87/azure-functions)
- [Azure Functions Node.js developer guide](functions-reference-node.md)
