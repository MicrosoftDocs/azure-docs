---
title: Find nonproduction API requests with Dev Proxy
description: Learn how to check if your app is using production-level APIs defined in Azure API Center using Dev Proxy.
author: waldekmastykarz
ms.service: azure-api-center
ms.topic: how-to
ms.date: 07/17/2024
ms.author: wmastyka 
---

# Find nonproduction API requests with Dev Proxy

When building your app, you might be using APIs that are still in preview. You often use preview APIs, when you're integrating with new features that are being built along with your app. Before you release your app to production, you should ensure that you're using production-level APIs. When you use stable APIs, which are supported and covered by Service Level Agreements (SLAs), your app is more robust.

One way to check if your app is using production-level APIs, is by using [Dev Proxy](https://aka.ms/devproxy). Dev Proxy is an API simulator that intercepts and analyzes API requests from applications. One feature of Dev Proxy is checking if the intercepted API requests belong to a nonproduction API. Dev Proxy also recommends the production version of the API you're using.

:::image type="content" source="./media/find-nonproduction-api-requests-dev-proxy/api-center-production-version-plugin.png" alt-text="Screenshot of a console showing Dev Proxy checking if the recorded API requests match production version APIs registered in Azure API Center." lightbox="./media/find-nonproduction-api-requests-dev-proxy/api-center-production-version-plugin.png":::

## Before you start

To detect nonproduction API requests, you need to have an Azure API Center instance with information about the APIs that you use in your organization. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md). Additionally, you need to install [Dev Proxy](https://aka.ms/devproxy).

### Register APIs in your API Center instance

Register APIs that you use in your organization. For each API, define the versions you use and specify their lifecycle stage.

:::image type="content" source="./media/find-nonproduction-api-requests-dev-proxy/api-center-api-versions.png" alt-text="Screenshot of Azure API Center showing an API with different versions." lightbox="./media/find-nonproduction-api-requests-dev-proxy/api-center-api-versions.png":::

The Dev Proxy's `ApiCenterProductionVersionPlugin` uses this information to check if the APIs, that your app is using, belong to production or nonproduction APIs.

### Copy API Center information

From the Azure API Center instance Overview page, copy the **name** of the API Center instance, the name of the **resource group** and the **subscription ID**. You need this information to configure the `ApiCenterProductionVersionPlugin` so that it can connect to your Azure API Center instance.

:::image type="content" source="./media/find-nonproduction-api-requests-dev-proxy/api-center-overview.png" alt-text="Screenshot of Azure API Center overview page with several properties highlighted." lightbox="./media/find-nonproduction-api-requests-dev-proxy/api-center-overview.png":::

## Configure Dev Proxy

To check if your app is using production-level APIs, you need to enable the `ApiCenterProductionVersionPlugin` in the Dev Proxy configuration file. To create a report of APIs that your app uses, add a reporter.

### Enable the `ApiCenterProductionVersionPlugin`

In the `devproxyrc.json` file, add the following configuration:

```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/dev-proxy/main/schemas/v0.19.0/rc.schema.json",
  "plugins": [
    {
      "name": "ApiCenterProductionVersionPlugin",
      "enabled": true,
      "pluginPath": "~appFolder/plugins/dev-proxy-plugins.dll",
      "configSection": "apiCenterProductionVersionPlugin"
    }
  ],
  "urlsToWatch": [
    "https://jsonplaceholder.typicode.com/*"
  ],
  "apiCenterProductionVersionPlugin": {
    "subscriptionId": "00000000-0000-0000-0000-000000000000",
    "resourceGroupName": "demo",
    "serviceName": "contoso-api-center",
    "workspaceName": "default"
  }
}
```

In the `subscriptionId`, `resourceGroupName`, and `serviceName` properties, provide the information about your Azure API Center instance.

In the `urlsToWatch` property, specify the URLs that your app uses.

> [!TIP]
> Use the [Dev Proxy Toolkit](https://aka.ms/devproxy/toolkit) Visual Studio Code extension to easily manage Dev Proxy configuration.

### Add a reporter

The `ApiCenterProductionVersionPlugin` produces a report of APIs that your app is using. To view this report, add a reporter to your Dev Proxy configuration file. Dev Proxy offers several [reporters](/microsoft-cloud/dev/dev-proxy/technical-reference/overview#reporters). In this example, you use the [plain-text reporter](/microsoft-cloud/dev/dev-proxy/technical-reference/plaintextreporter).

Update your `devproxyrc.json` file with a reference to the plain-text reporter:

```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/dev-proxy/main/schemas/v0.19.0/rc.schema.json",
  "plugins": [
    {
      "name": "ApiCenterProductionVersionPlugin",
      "enabled": true,
      "pluginPath": "~appFolder/plugins/dev-proxy-plugins.dll",
      "configSection": "apiCenterProductionVersionPlugin"
    },
    {
      "name": "PlainTextReporter",
      "enabled": true,
      "pluginPath": "~appFolder/plugins/dev-proxy-plugins.dll"
    }
  ],
  "urlsToWatch": [
    "https://jsonplaceholder.typicode.com/*"
  ],
  "apiCenterProductionVersionPlugin": {
    "subscriptionId": "00000000-0000-0000-0000-000000000000",
    "resourceGroupName": "demo",
    "serviceName": "contoso-api-center",
    "workspaceName": "default"
  }
}
```

## Check if your app is using production-level APIs

To check if your app is using production-level APIs, you need to connect to your Azure subscription, run Dev Proxy, and let it intercept API requests from your app. Dev Proxy then compares the information about the API requests with the information from Azure API Center and reports on any nonproduction APIs.

### Connect to your Azure subscription

Dev Proxy uses information from Azure API Center to determine if the APIs your app is using are production-level. To get this information, it needs a connection to your Azure subscription. You can connect to your Azure subscription in [several ways](/microsoft-cloud/dev/dev-proxy/technical-reference/apicenterproductionversionplugin#remarks).

### Run Dev Proxy

After connecting to your Azure subscription, start Dev Proxy. If you start Dev Proxy from the same folder where your `devproxyrc.json` file is located, it automatically loads the configuration. Otherwise, specify the path to the configuration file using the `--config-file` option.

When Dev Proxy starts, it checks that it can connect to your Azure subscription. When the connection is successful, you see a message similar to:

```text
 info    Plugin ApiCenterProductionVersionPlugin connecting to Azure...
 info    Listening on 127.0.0.1:8000...

Hotkeys: issue (w)eb request, (r)ecord, (s)top recording, (c)lear screen
Press CTRL+C to stop Dev Proxy
```

Press <kbd>r</kbd> to start recording API requests from your app.

### Use your app

Use your app as you would normally do. Dev Proxy intercepts the API requests and stores information about them in memory. In the command line where Dev Proxy runs, you should see information about API requests that your app makes.

```text
 info    Plugin ApiCenterProductionVersionPlugin connecting to Azure...
 info    Listening on 127.0.0.1:8000...

Hotkeys: issue (w)eb request, (r)ecord, (s)top recording, (c)lear screen
Press CTRL+C to stop Dev Proxy

◉ Recording... 

 req   ╭ GET https://jsonplaceholder.typicode.com/posts?api-version=v1.0
 api   ╰ Passed through

 req   ╭ GET https://jsonplaceholder.typicode.com/users?api-version=beta
 api   ╰ Passed through
```

### Check API versions

Stop the recording by pressing <kbd>s</kbd>. Dev Proxy connects to the API Center instance and compares the information about requests with the information from API Center.

```text
 info    Plugin ApiCenterProductionVersionPlugin connecting to Azure...
 info    Listening on 127.0.0.1:8000...

Hotkeys: issue (w)eb request, (r)ecord, (s)top recording, (c)lear screen
Press CTRL+C to stop Dev Proxy

◉ Recording... 

 req   ╭ GET https://jsonplaceholder.typicode.com/posts?api-version=v1.0
 api   ╰ Passed through

 req   ╭ GET https://jsonplaceholder.typicode.com/users?api-version=beta
 api   ╰ Passed through
○ Stopped recording
 info    Checking if recorded API requests use production APIs as defined in API Center...
 info    Loading APIs from API Center...
 info    Analyzing recorded requests...
 warn    Request GET https://jsonplaceholder.typicode.com/users?api-version=beta uses API version beta which is defined as Preview. Upgrade to a production version of the API. Recommended versions: v1.0
 info    DONE
```

When Dev Proxy finishes its analysis, it creates a report in a file named `ApiCenterProductionVersionPlugin_PlainTextReporter.txt` with the following contents:

```text
Non-production APIs:

  GET https://jsonplaceholder.typicode.com/users?api-version=beta
  
Production APIs:

  GET https://jsonplaceholder.typicode.com/posts?api-version=v1.0
```

## Summary

Using Dev Proxy and its `ApiCenterProductionVersionPlugin`, you can check if your app is using production-level APIs. The plugin compares the information about API requests from your app with information from Azure API Center and reports on any nonproduction API requests. It also recommends the production version of the APIs you're using. Verifying what APIs your app is using, helps you ensure that your app is using stable APIs, which are supported and covered by SLAs, making your app more robust. You can run this check manually or integrate with your CI/CD pipeline to ensure that your app is using production-level APIs before releasing it to production.

## Related content

- [Learn more about Dev Proxy](/microsoft-cloud/dev/dev-proxy/overview)
- [Learn more about Azure API Center](./key-concepts.md)
