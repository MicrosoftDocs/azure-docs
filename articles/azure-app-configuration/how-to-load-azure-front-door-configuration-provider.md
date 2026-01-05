---
title: Load Configuration from Azure App Configuration via Azure Front Door (Preview) 
description: Learn how to set up applications to connect to Azure Front Door.
author: avanigupta
ms.author: avgupta
ms.service: azure-app-configuration
ms.topic: how-to
ms.date: 12/02/2025
---

# Load configuration from Azure Front Door in client applications (preview) 

Integrating Azure App Configuration with Azure Front Door enables your client applications to retrieve configuration from edge locations worldwide, ensuring optimal performance at any scale. The integration process involves the following steps:

1. **Create configuration data in Azure App Configuration** - Define your application's key-values, feature flags, or snapshots in Azure App Configuration.

1. **Connect Azure App Configuration to Azure Front Door** - Configure the connection between your App Configuration store and Azure Front Door through the Azure portal. The portal provides a guided experience to set up the configuration filters to control the data that is exposed through the Azure Front Door endpoint. [Set up Azure Front Door to connect to App Config](./how-to-connect-azure-front-door.md)

1. **Connect application to Azure Front Door** - Configure your client application to retrieve configuration from the Azure Front Door endpoint using the App Configuration provider. The provider handles anonymous authentication and dynamic configuration updates. This document explains how to set up this connection.

1. **Deploy and manage configuration** - Deploy your application to production. Your clients now retrieve configuration from the nearest Azure Front Door edge location automatically. Update configuration values in Azure App Configuration as needed - changes propagate globally based on your configured Azure Front Door cache expiration time without requiring application updates or redeployments.

> [!TIP]
> For a visual overview of the end‑to‑end setup, see the [configuration at scale walkthrough video](https://youtu.be/TzXvFgIAhUk).


## Client application samples

The following code demonstrates how to load configuration from Azure Front Door. The application retrieves all keys starting with an "App1:" prefix and checks for updates every minute. When the application requests updates, Azure Front Door returns cached values, if possible, otherwise it retrieves fresh configuration from App Configuration service.

Replace `{YOUR-AFD-ENDPOINT}` with your Azure Front Door endpoint, which looks something like `https://xxxx.azurefd.net`.

### [.NET MAUI](#tab/dotnet-maui)

Use the `ConnectAzureFrontDoor` API to load configuration settings from Azure Front Door. 

```cs
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.ConnectAzureFrontDoor(new Uri("{YOUR-AFD-ENDPOINT}"))
            .Select("App1:*")
            .ConfigureRefresh(refreshOptions =>
            {
                refreshOptions.RegisterAll()
                    .SetRefreshInterval(TimeSpan.FromMinutes(1));
            });
});
```

For a complete sample app, refer to [MAUI App with Azure App Configuration and Azure Front Door](https://github.com/Azure-Samples/appconfig-maui-app-with-afd/blob/main/README.md).

### [JavaScript](#tab/javascript)

Use the `loadFromAzureFrontDoor` API to load configuration settings from Azure Front Door. 

```javascript
import { loadFromAzureFrontDoor } from "@azure/app-configuration-provider";

const appConfig = await loadFromAzureFrontDoor("{YOUR-AFD-ENDPOINT}", {
    selectors: [{
        keyFilter: "App1:*"
    }],
    refreshOptions: {
        enabled: true,
        refreshIntervalInMs: 60_000
    }
});

const yoursetting = appConfig.get("App1:Version");

```

For a complete sample app, refer to [JavaScript App with Azure App Configuration and Azure Front Door](https://github.com/Azure-Samples/appconfig-javascript-clientapp-with-afd/blob/main/README.md).

---

## Considerations and edge cases

- **Request scoping**: The key-value filters used by your application must match exactly the filters configured for the Azure Front Door endpoint; any mismatch will cause the request to be rejected. For example, if your endpoint is configured to allow access to keys starting with an "App1:" prefix, the application code must also load keys starting with "App1:". However, if your application loads keys starting with a more specific prefix like "App1:Prod:", the request is rejected.
- **Exclusively loading feature flags**: If your application loads only feature flags, you should add two key filters in the Azure Front Door rules - one for ALL keys with no label and second for all keys starting with ".appconfig.featureflag/{YOUR-FEATURE-FLAG-PREFIX}".
- **Refresh strategy**: Applications loading from Azure Front Door cannot use sentinel key refresh. If refresh is enabled, the application must be configured to [monitor all selected keys](./howto-best-practices.md#monitoring-all-selected-keys) for changes.
- **Snapshot references**: If your application loads a key-value that is a [snapshot reference](./concept-snapshot-references.md), Azure Front Door must be configured to allowlist the referenced snapshot. Include the snapshot name in your Azure Front Door filters to enable snapshot resolution.

## Troubleshooting

### Configuration doesn't load

- Verify Azure Front Door endpoint URL is correctly configured in application code.
- Check for warnings in the App Config Portal and fix the issues if any.
- Make sure the correct scoping filters are set when configuring the Azure Front Door endpoint. These filters (for key-values, snapshots, and feature flags) define the regex rules that block requests that don't match specified filters. If your app can’t access its configuration, review Azure Front Door rules to find any blocking regex patterns. Update the rule with the right filter or create a new AFD endpoint from the App Configuration portal. Learn more about [Azure Front Door routing rules](/azure/frontdoor/front-door-rules-engine).

> [!NOTE]
> To modify Azure Front Door endpoint rules, use the Azure Front Door portal. Editing these settings from the App Configuration portal will be available in a future release. 

### Configuration doesn't refresh

- Verify that both the application refresh interval and Azure Front Door cache TTL are properly configured. For details on configuration refresh timing, see [Caching behavior in hyperscale configuration](./concept-hyperscale-client-configuration.md#caching).

## Language availability

| Language    | Minimum version / status  | Package Link |
|-------------|---------------------------|--------------|
| .NET        | 8.5.0-preview             | [Microsoft.Extensions.Configuration.AzureAppConfiguration](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.AzureAppConfiguration/8.5.0-preview) |
| JavaScript  | 2.3.0-preview             | [@azure/app-configuration-provider](https://www.npmjs.com/package/@azure/app-configuration-provider/v/2.3.0-preview) |
| Java        | Work in progress          | N/A |
| Python      | Work in progress          | N/A |
| Go          | Work in progress          | N/A |

## Related content

- [Hyperscale configuration for client applications](./concept-hyperscale-client-configuration.md)
- [Setup Azure Front Door to connect to App Config](./how-to-connect-azure-front-door.md)
- [Learn more about Azure Front Door](/azure/frontdoor/)
- [Monitor Azure Front Door performance](/azure/frontdoor/front-door-diagnostics)
