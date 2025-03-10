---
title: Integrate Azure API Management with Application Insights
titleSuffix: Azure API Management
description: Learn how to set up a connection to Application Insights and enable logging for APIs in your Azure API Management instance.
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 09/04/2024
ms.author: danlep
ms.custom: engagement-fy23, devx-track-arm-template, devx-track-bicep
---

# How to integrate Azure API Management with Azure Application Insights

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

You can easily integrate Azure Application Insights with Azure API Management. Azure Application Insights is an extensible service for web developers building and managing apps on multiple platforms. In this guide, you will:
* Walk through Application Insights integration into API Management.
* Learn strategies for reducing performance impact on your API Management service instance.

> [!NOTE]
> In an API Management [workspace](workspaces-overview.md), a workspace owner can independently integrate Application Insights and enable Application Insights logging for the workspace's APIs. The general guidance to integrate a workspace with Application Insights is similar to the guidance for an API Management instance; however, configuration is scoped to the workspace only. Currently, you must integrate Application Insights in a workspace by configuring a connection string (recommended) or an instrumentation key. 

> [!WARNING]
> When using our [self-hosted gateway](self-hosted-gateway-overview.md), we do not guarantee all telemetry will be pushed to Azure Application Insights given it relies on [Application Insights' in-memory buffering](/azure/azure-monitor/app/telemetry-channels#built-in-telemetry-channels).

## Prerequisites

* You need an Azure API Management instance. [Create one](get-started-create-service-instance.md) first.

* To use Application Insights, [create an instance of the Application Insights service](/previous-versions/azure/azure-monitor/app/create-new-resource). To create an instance using the Azure portal, see [Workspace-based Application Insights resources](/azure/azure-monitor/app/create-workspace-resource).

    > [!NOTE]
    > The Application Insights resource **can be** in a different subscription or even a different tenant than the API Management resource.

* If you plan to configure managed identity credentials to use with Application Insights, complete the following steps:

    1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md).
    
        * If you enable a user-assigned managed identity, take note of the identity's **Client ID**.
    
    1. Assign the identity the **Monitoring Metrics Publisher** role, scoped to the Application Insights resource. To assign the role, use the [Azure portal](../role-based-access-control/role-assignments-portal.yml) or other Azure tools.
    
## Scenario overview

The following are high level steps for this scenario.

1. First, create a connection between Application Insights and API Management

    You can create a connection between Application Insights and your API Management using the Azure portal, the REST API, or related Azure tools. API Management configures a *logger* resource for the connection.

    > [!IMPORTANT]
    > Currently, in the portal, API Management only supports connections to Application Insights using an Application Insights instrumentation key. For enhanced security, we recommend using an Application Insights connection string with an API Management managed identity. To configure connection string with managed identity credentials, use the [REST API](#create-a-connection-using-the-rest-api-bicep-or-arm-template) or related tools as shown in a later section of this article. [Learn more](/azure/azure-monitor/app/sdk-connection-string) about Application Insights connection strings.
    > 

    > [!NOTE]
    > If your Application Insights resource is in a different tenant, then you must create the logger using the [REST API](#create-a-connection-using-the-rest-api-bicep-or-arm-template) or related tools as shown in a later section of this article.

1. Second, enable Application Insights logging for your API or APIs.

    In this article, you enable Application Insights logging for your API using the Azure portal. API Management configures a *diagnostic* resource for the API.

    
## Create a connection using the Azure portal

Follow these steps to use the Azure portal to create a connection between Application Insights and API Management. 

> [!NOTE]
> Where possible, Microsoft recommends using connection string with managed identity credentials for enhanced security. To configure these credentials, use the [REST API](#create-a-connection-using-the-rest-api-bicep-or-arm-template) or related tools as shown in a later section of this article.


1. Navigate to your **Azure API Management service instance** in the **Azure portal**.
1. Select **Application Insights** from the menu on the left.
1. Select **+ Add**.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-1.png" alt-text="Screenshot that shows where to add a new connection":::
1. Select the **Application Insights** instance you created earlier and provide a short description.
1. To enable [availability monitoring](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) of your API Management instance in Application Insights, select the **Add availability monitor** checkbox.
    * This setting regularly validates whether the API Management gateway endpoint is responding. 
    * Results appear in the **Availability** pane of the Application Insights instance.
1. Select **Create**.
1. Check that the new Application Insights logger now appears in the list. 

    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-2.png" alt-text="Screenshot that shows where to view the newly created Application Insights logger.":::

> [!NOTE]
> Behind the scenes, a logger entity is created in your API Management instance, containing the instrumentation key of the Application Insights instance.

> [!TIP]
> If you need to update the instrumentation key configured in the Application Insights logger, select the logger's row in the list (not the name of the logger). Enter the instrumentation key, and select **Save**.

## Create a connection using the REST API, Bicep, or ARM template

Follow these steps to use the REST API, Bicep, or ARM template to create an Application Insights logger for your API Management instance. You can configure a logger that uses connection string with managed identity credentials (recommended), or a logger that uses only a connection string.

### Logger with connection string with managed identity credentials (recommended)

See the [prerequisites](#prerequisites) for using an API Management managed identity.

The Application Insights connection string appears in the **Overview** section of your Application Insights resource.

#### Connection string with system-assigned managed identity 

#### [REST API](#tab/rest)

Use the API Management [Logger - Create or Update](/rest/api/apimanagement/current-preview/logger/create-or-update) REST API with the following request body.

```JSON
{
  "properties": {
    "loggerType": "applicationInsights",
    "description": "Application Insights logger with system-assigned managed identity",
    "credentials": {
         "connectionString":"InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;...",
         "identityClientId":"SystemAssigned"
    }
  }
}

```

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template.

```Bicep
resource aiLoggerWithSystemAssignedIdentity 'Microsoft.ApiManagement/service/loggers@2022-08-01' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'applicationInsights'
    description: 'Application Insights logger with system-assigned managed identity'
    credentials: {
      connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;...'
      identityClientId: 'systemAssigned'
    }
  }
}
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your Azure Resource Manager template.

```JSON
{
  "type": "Microsoft.ApiManagement/service/loggers",
  "apiVersion": "2022-08-01",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "applicationInsights",
    "description": "Application Insights logger with system-assigned managed identity",
    "resourceId": "<ApplicationInsightsResourceID>",
    "credentials": {
      "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;...",
      "identityClientId": "SystemAssigned"
    }
  }
}
```
---
#### Connection string with user-assigned managed identity

#### [REST API](#tab/rest)

Use the API Management [Logger - Create or Update](/rest/api/apimanagement/current-preview/logger/create-or-update) REST API with the following request body.

```JSON
{
  "properties": {
    "loggerType": "applicationInsights",
    "description": "Application Insights logger with user-assigned managed identity",
    "credentials": {
         "connectionString":"InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;...",
         "identityClientId":"<ClientID>"
    }
  }
}

```

#### [Bicep](#tab/bicep)

Include a snippet similar the following in your Bicep template.

```Bicep
resource aiLoggerWithUserAssignedIdentity 'Microsoft.ApiManagement/service/loggers@2022-08-01' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'applicationInsights'
    description: 'Application Insights logger with user-assigned managed identity'
    credentials: {
      connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;...'
      identityClientId: '<ClientID>'
    }
  }
}
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your Azure Resource Manager template.

```JSON
{
  "type": "Microsoft.ApiManagement/service/loggers",
  "apiVersion": "2022-08-01",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "applicationInsights",
    "description": "Application Insights logger with user-assigned managed identity",
    "resourceId": "<ApplicationInsightsResourceID>",
    "credentials": {
      "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;...",
      "identityClientId": "<ClientID>"
    }
  }
}
```
---

### Logger with connection string credentials only

The Application Insights connection string appears in the **Overview** section of your Application Insights resource.

#### [REST API](#tab/rest)

Use the API Management [Logger - Create or Update](/rest/api/apimanagement/current-preview/logger/create-or-update) REST API with the following request body.

If you are configuring the logger for a workspace, use the [Workspace Logger - Create or Update](/rest/api/apimanagement/workspace-logger/create-or-update?view=rest-apimanagement-2023-09-01-preview&preserve-view=true) REST API.

```JSON
{
  "properties": {
    "loggerType": "applicationInsights",
    "description": "Application Insights logger with connection string",
    "credentials": {
         "connectionString":"InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;..."    
    }
  }
}
```

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template.

If you are configuring the logger for a workspace, create a `Microsoft.ApiManagement/service.workspace/loggers@2023-09-01-preview` resource instead.


```Bicep
resource aiLoggerWithSystemAssignedIdentity 'Microsoft.ApiManagement/service/loggers@2022-08-01' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'applicationInsights'
    description: 'Application Insights logger with connection string'
    credentials: {
      connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;...'
    }
  }
}
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your Azure Resource Manager template.

If you are configuring the logger for a workspace, create a `Microsoft.ApiManagement/service.workspace/loggers` resource and set `apiVersion` to `2023-09-01-preview` instead.


```JSON
{
  "type": "Microsoft.ApiManagement/service/loggers",
  "apiVersion": "2022-08-01",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "applicationInsights",
    "description": "Application Insights logger with connection string",
    "resourceId": "<ApplicationInsightsResourceID>",
    "credentials": {
      "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/;..."
    },
  }
}
```
---


## Enable Application Insights logging for your API

Use the following steps to enable Application Insights logging for an API. You can also enable Application Insights logging for all APIs.

1. Navigate to your **Azure API Management service instance** in the **Azure portal**.
1. Select **APIs** > **APIs** from the menu on the left.
1. Select an API, such as **Swagger Petstore**. If configured, select a version.

   > [!TIP]
   > To enable logging for all APIs, select **All APIs**.
1. Go to the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostics Logs** section.  
    :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-api-1.png" alt-text="Screenshot of Diagnostic Logs configuration in the portal.":::
1. Check the **Enable** box.
1. Select your attached logger in the **Destination** dropdown.
1. Input **100** as **Sampling (%)** and select the **Always log errors** checkbox.
1. Leave the rest of the settings as is. For details about the settings, see [Diagnostic logs settings reference](diagnostic-logs-reference.md).

   > [!WARNING]
   > Overriding the default **Number of payload bytes to log** value **0** may significantly decrease the performance of your APIs.

1. Select **Save**.
1. Behind the scenes, a [Diagnostic](/rest/api/apimanagement/current-ga/diagnostic/create-or-update) entity named `applicationinsights` is created at the API level.

> [!NOTE]
> Requests are successful once API Management sends the entire response to the client.


## Loggers for a single API or all APIs

You can specify loggers on different levels: 
+ Single API logger
+ A logger for all APIs
 
Specifying *both*:
- By default, the single API logger (more granular level) overrides the one for all APIs.
- If the loggers configured at the two levels are different, and you need both loggers to receive telemetry (multiplexing), please contact Microsoft Support. Please note that multiplexing is not supported if you're using the same logger (Application Insights destination) at the "All APIs" level and the single API level. For multiplexing to work correctly, you must configure different loggers at the "All APIs" and individual API level and request assistance from Microsoft support to enable multiplexing for your service.

## What data is added to Application Insights

Application Insights receives:

| Telemetry item | Description |
| -------------- | ----------- |
| *Request* | For every incoming request: <ul><li>*frontend request*</li><li>*frontend response*</li></ul> |
| *Dependency* | For every request forwarded to a backend service: <ul><li>*backend request*</li><li>*backend response*</li></ul> |
| *Exception* | For every failed request: <ul><li>Failed because of a closed client connection</li><li>Triggered an *on-error* section of the API policies</li><li>Has a response HTTP status code matching 4xx or 5xx</li></ul> |
| *Trace* | If you configure a [trace](trace-policy.md) policy. <br /> The `severity` setting in the `trace` policy must be equal to or greater than the `verbosity` setting in the Application Insights logging. |

> [!NOTE]
> See [Application Insights limits](/azure/azure-monitor/service-limits#application-insights) for information about the maximum size and number of metrics and events per Application Insights instance.

## Emit custom metrics
You can emit [custom metrics](/azure/azure-monitor/essentials/metrics-custom-overview) to Application Insights from your API Management instance. API Management emits custom metrics using policies such as [emit-metric](emit-metric-policy.md) and [azure-openai-emit-token-metric](azure-openai-emit-token-metric-policy.md). The following section uses the `emit-metric` policy as an example.

> [!NOTE]
> Custom metrics are a [preview feature](/azure/azure-monitor/essentials/metrics-custom-overview) of Azure Monitor and subject to [limitations](/azure/azure-monitor/essentials/metrics-custom-overview#design-limitations-and-considerations).

To emit custom metrics, perform the following configuration steps. 

1. Enable **Custom metrics (Preview)** with custom dimensions in your Application Insights instance. 

    1. Navigate to your Application Insights instance in the portal.
    1. In the left menu, select **Usage and estimated costs**.
    1. Select **Custom metrics (Preview)** > **With dimensions**.
    1. Select **OK**. 

1. Add the `"metrics": true` property to the `applicationInsights` diagnostic entity that's configured in API Management. Currently you must add this property using the API Management [Diagnostic - Create or Update](/rest/api/apimanagement/current-ga/diagnostic/create-or-update) REST API. For example:

    ```http
    PUT https://management.azure.com/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/providers/Microsoft.ApiManagement/service/{APIManagementServiceName}/diagnostics/applicationinsights

    {
        [...]
        {
        "properties": {
            "loggerId": "/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/providers/Microsoft.ApiManagement/service/{APIManagementServiceName}/loggers/{ApplicationInsightsLoggerName}",
            "metrics": true
            [...]
        }
    }
    ```
1. Ensure that the Application Insights logger is configured at the scope you intend to emit custom metrics (either all APIs, or a single API). For more information, see [Enable Application Insights logging for your API](#enable-application-insights-logging-for-your-api), earlier in this article.
1. Configure the `emit-metric` policy at a scope where Application Insights logging is configured (either all APIs, or a single API) and is enabled for custom metrics. For policy details, see the [`emit-metric`](emit-metric-policy.md) policy reference.

### Limits for custom metrics

[!INCLUDE [api-management-custom-metrics-limits](../../includes/api-management-custom-metrics-limits.md)]
   

## Performance implications and log sampling

> [!WARNING]
> Logging all events may have serious performance implications, depending on incoming requests rate.

Based on internal load tests, enabling the logging feature caused a 40%-50% reduction in throughput when request rate exceeded 1,000 requests per second. Application Insights is designed to assess application performances using statistical analysis. It's not:
* Intended to be an audit system.
* Suited for logging each individual request for high-volume APIs.

You can manipulate the number of logged requests by [adjusting the **Sampling** setting](#enable-application-insights-logging-for-your-api). A value of 100% means all requests are logged, while 0% reflects no logging. 

**Sampling** helps to reduce telemetry volume, effectively preventing significant performance degradation while still carrying the benefits of logging.

To improve performance issues, skip:
* Request and responses headers.
* Body logging.

## Video

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=85acedcd-4200-4788-b7c0-41a11286fcab]
>
>

## Troubleshooting

Addressing the issue of telemetry data flow from API Management to Application Insights:
+ Investigate whether a linked Azure Monitor Private Link Scope (AMPLS) resource exists within the VNet where the API Management resource is connected. AMPLS resources have a global scope across subscriptions and are responsible for managing data query and ingestion for all Azure Monitor resources. It's possible that the AMPLS has been configured with a Private-Only access mode specifically for data ingestion. In such instances, include the Application Insights resource and its associated Log Analytics resource in the AMPLS. Once this addition is made, the API Management data will be successfully ingested into the Application Insights resource, resolving the telemetry data transmission issue.

## Related content

+ Learn more about [Azure Application Insights](/azure/azure-monitor/app/app-insights-overview).
+ Consider [logging with Azure Event Hubs](api-management-howto-log-event-hubs.md).
+ Learn about visualizing data from Application Insights using [Azure Managed Grafana](visualize-using-managed-grafana-dashboard.md)
