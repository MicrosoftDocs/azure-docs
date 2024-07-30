---
title: Check app's API calls for minimal permissions with Dev Proxy
description: Learn how to use Dev Proxy to check if your app is calling APIs using minimal permissions defined in Azure API Center.
author: waldekmastykarz
ms.service: api-center
ms.topic: how-to
ms.date: 07/17/2024
ms.author: wmastyka 
---

# Check if your app is calling APIs using minimal permissions with Dev Proxy

When building your app, you likely integrate with several APIs and operations. To ensure that your app is secure and follows the principle of least privilege, you should check if your app is calling APIs with minimal permissions. By using minimal permissions, you reduce the risk of unauthorized access to your data and resources.

What's hard about checking if your app is calling APIs with minimal permissions is that each time you integrate a new operation, you need to evaluate the set of permissions you use in your app. Manually tracking all operations and permissions is time-consuming and error-prone. Using Dev Proxy and Azure API Center you can automate checking if your app is calling APIs with minimal permissions.

To check if your app is calling APIs using minimal permissions, you can use Dev Proxy. Dev Proxy is an API simulator that intercepts and analyzes API requests from applications. One feature of Dev Proxy is comparing the permissions that your app uses with the permissions defined in Azure API Center and reporting on any excessive permissions. Dev Proxy also recommends the minimal set of permissions that you should use.

:::image type="content" source="./media/check-minimal-api-permissions-dev-proxy/api-center-minimal-permissions-plugin.png" alt-text="Screenshot of a command prompt showing Dev Proxy checking if the recorded API requests use tokens with minimal API permissions." lightbox="./media/check-minimal-api-permissions-dev-proxy/api-center-minimal-permissions-plugin.png":::

> [!VIDEO https://www.youtube.com/embed/fFr3tFBp1Z8]

## Before you start

To check if your app is calling APIs using minimal permissions, you need to have an Azure API Center instance with information about the APIs that you use in your organization. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md). Additionally, you need to install [Dev Proxy](https://aka.ms/devproxy).

> [!TIP]
> Download the preset for this how to article by running in the command prompt `devproxy preset get demo-apicenter-minimalpermissions`.

### Register APIs in your Azure API Center instance

Register APIs that you use in your organization. For each API, upload the OpenAPI specification file that describes the API operations and permissions.

:::image type="content" source="./media/check-minimal-api-permissions-dev-proxy/api-center-minimal-permissions-openapi-spec-security.png" alt-text="Screenshot of Azure API Center with an API and its OpenAPI spec with security information." lightbox="./media/check-minimal-api-permissions-dev-proxy/api-center-minimal-permissions-openapi-spec-security.png":::

The Dev Proxy `ApiCenterMinimalPermissionsPlugin` uses this information to check if your app is calling APIs using minimal permissions.

### Copy API Center information

From the Azure API Center instance Overview page, copy the **name** of the API Center instance, the name of the **resource group** and the **subscription ID**. You need this information to configure the `ApiCenterMinimalPermissionsPlugin` so that it can connect to your Azure API Center instance.

:::image type="content" source="./media/check-minimal-api-permissions-dev-proxy/api-center-overview.png" alt-text="Screenshot of Azure API Center overview page with several properties highlighted." lightbox="./media/check-minimal-api-permissions-dev-proxy/api-center-overview.png":::

## Configure Dev Proxy

To check if your app is calling APIs using minimal permissions, you need to enable the `ApiCenterMinimalPermissionsPlugin` in the Dev Proxy configuration file. To create a report of permissions that your app uses, add a reporter.

### Enable the `ApiCenterMinimalPermissionsPlugin`

In the `devproxyrc.json` file, add the following configuration:

```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/dev-proxy/main/schemas/v0.19.0/rc.schema.json",
  "plugins": [
    {
      "name": "ApiCenterMinimalPermissionsPlugin",
      "enabled": true,
      "pluginPath": "~appFolder/plugins/dev-proxy-plugins.dll",
      "configSection": "apiCenterMinimalPermissionsPlugin"
    }
  ],
  "urlsToWatch": [
    "https://api.northwind.com/*"
  ],
  "apiCenterMinimalPermissionsPlugin": {
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

The `ApiCenterMinimalPermissionsPlugin` produces a report of APIs that your app is using, and the minimal permissions required to call them. To view this report, add a reporter to your Dev Proxy configuration file. Dev Proxy offers several [reporters](/microsoft-cloud/dev/dev-proxy/technical-reference/overview#reporters). In this example, you use the [plain-text reporter](/microsoft-cloud/dev/dev-proxy/technical-reference/plaintextreporter).

Update your `devproxyrc.json` file with a reference to the plain-text reporter:

```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/dev-proxy/main/schemas/v0.19.0/rc.schema.json",
  "plugins": [
    {
      "name": "ApiCenterMinimalPermissionsPlugin",
      "enabled": true,
      "pluginPath": "~appFolder/plugins/dev-proxy-plugins.dll",
      "configSection": "apiCenterMinimalPermissionsPlugin"
    },
    {
      "name": "PlainTextReporter",
      "enabled": true,
      "pluginPath": "~appFolder/plugins/dev-proxy-plugins.dll"
    }
  ],
  "urlsToWatch": [
    "https://api.northwind.com/*"
  ],
  "apiCenterMinimalPermissionsPlugin": {
    "subscriptionId": "00000000-0000-0000-0000-000000000000",
    "resourceGroupName": "demo",
    "serviceName": "contoso-api-center",
    "workspaceName": "default"
  }
}
```

## Check if your app is calling APIs using minimal permissions

To check if your app is calling APIs using minimal permissions, you need to connect to your Azure subscription, run Dev Proxy, and let it intercept API requests from your app. Dev Proxy then compares the information about the API requests with the information from Azure API Center and reports on the minimal permissions.

### Connect to your Azure subscription

Dev Proxy uses information from Azure API Center to determine if your app is calling APIs using minimal permissions. To get this information, it needs a connection to your Azure subscription. You can connect to your Azure subscription in [several ways](/microsoft-cloud/dev/dev-proxy/technical-reference/apicenterproductionversionplugin#remarks).

### Run Dev Proxy

After connecting to your Azure subscription, start Dev Proxy. If you start Dev Proxy from the same folder where your `devproxyrc.json` file is located, it automatically loads the configuration. Otherwise, specify the path to the configuration file using the `--config-file` option.

When Dev Proxy starts, it checks that it can connect to your Azure subscription. When the connection is successful, you see a message similar to:

```text
 info    Plugin ApiCenterMinimalPermissionsPlugin connecting to Azure...
 info    Listening on 127.0.0.1:8000...

Hotkeys: issue (w)eb request, (r)ecord, (s)top recording, (c)lear screen
Press CTRL+C to stop Dev Proxy
```

Press <kbd>r</kbd> to start recording API requests from your app.

### Use your app

Use your app as you would normally do. In this tutorial, you can use the following request with a simulated access token with `customer.readwrite` permission:

```http
@readwriteToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJzY3AiOlsiY3VzdG9tZXIucmVhZHdyaXRlIl19.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

GET https://api.northwind.com/customers/ALFKI
Authorization: Bearer {{readwriteToken}}
```

Dev Proxy intercepts the API requests and stores information about them in memory. In the command line where Dev Proxy runs, you should see information about API requests that your app makes.

```text
 info    Plugin ApiCenterMinimalPermissionsPlugin connecting to Azure...
 info    Listening on 127.0.0.1:8000...

Hotkeys: issue (w)eb request, (r)ecord, (s)top recording, (c)lear screen
Press CTRL+C to stop Dev Proxy

◉ Recording... 

 req   ╭ GET https://api.northwind.com/customers/ALFKI
 mock  ╰ 200 /{customer-id}
```

### Check permissions

Stop the recording by pressing <kbd>s</kbd>. Dev Proxy connects to the API Center instance and compares the information about requests with the information from API Center.

```text
 info    Plugin ApiCenterMinimalPermissionsPlugin connecting to Azure...
 info    Listening on 127.0.0.1:8000...

Hotkeys: issue (w)eb request, (r)ecord, (s)top recording, (c)lear screen
Press CTRL+C to stop Dev Proxy

◉ Recording... 

 req   ╭ GET https://api.northwind.com/customers/ALFKI
 mock  ╰ 200 /{customer-id}
○ Stopped recording
 info    Checking if recorded API requests use minimal permissions as defined in API Center...
 info    Loading APIs from API Center...
 info    Loading API definitions from API Center...
 info    Checking minimal permissions for API https://api.northwind.com...
 info    Analyzing recorded requests...
 warn    Calling API Northwind with excessive permissions: customer.readwrite. Minimal permissions are: customer.read
 info    DONE
```

When Dev Proxy finishes its analysis, it creates a report in a file named `ApiCenterMinimalPermissionsPlugin_PlainTextReporter.txt` with the following contents:

```text
Azure API Center minimal permissions report

APIS

Northwind

x Called using excessive permissions

Permissions

- Minimal permissions: customer.read
- Permissions on the token: customer.readwrite
- Excessive permissions: customer.readwrite

Requests

- GET https://api.northwind.com/customers/ALFKI

UNMATCHED REQUESTS

No unmatched requests found.

ERRORS

No errors occurred.
```

## Summary

Using the `ApiCenterMinimalPermissionsPlugin`, you can check if your app is calling APIs using minimal permissions. The plugin compares the information about API requests from your app with information from Azure API Center and reports on excessive permissions. It also recommends the minimal permissions needed to call the APIs that you're using in your app. Verifying that your app is calling APIs using minimal permissions, helps you make your app more secure. You can run this check manually or integrate with your CI/CD pipeline to ensure that your app is calling APIs using minimal permissions before releasing it to production.

## Related content

- [Learn more about Dev Proxy](/microsoft-cloud/dev/dev-proxy/overview)
- [Learn more about Azure API Center](./key-concepts.md)
