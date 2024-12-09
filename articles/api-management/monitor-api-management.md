---
title: Monitor Azure API Management
description: Learn how to monitor Azure API Management using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 12/10/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: dlepow
ms.author: danlep
ms.service: azure-api-management
---

# Monitor API Management

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure API Management metrics supported by Azure Monitor](monitor-api-management-reference.md#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure API Management resource log data supported by Azure Monitor](monitor-api-management-reference.md#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

## Built in monitoring for API Management


### Get API analytics in Azure API Management

Azure API Management provides analytics for your APIs so that you can analyze their usage and performance. Use analytics for high-level monitoring and troubleshooting of your APIs. For other monitoring features, including near real-time metrics and resource logs for diagnostics and auditing, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md).

:::image type="content" source="media/howto-use-analytics/analytics-report-portal.png" alt-text="Screenshot of API analytics in the portal." lightbox="media/howto-use-analytics/analytics-report-portal.png":::

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

- API Management provides analytics using an [Azure Monitor-based dashboard](/azure/azure-monitor/visualize/workbooks-overview). The dashboard aggregates data in an Azure Log Analytics workspace.
- In the classic API Management service tiers, your API Management instance also includes *legacy built-in analytics* in the Azure portal, and analytics data can be accessed using the API Management REST API. Closely similar data is shown in the Azure Monitor-based dashboard and built-in analytics.

> [!IMPORTANT]
> The Azure Monitor-based dashboard is the recommended way to access analytics data. Built-in (classic) analytics isn't available in the v2 tiers.

With API analytics, analyze the usage and performance of the APIs in your API Management instance across several dimensions, including:

- Time
- Geography
- APIs
- API operations
- Products
- Subscriptions
- Users
- Requests

API analytics provides data on requests, including failed and unauthorized requests. Geography values are , based on IP address mapping. There can be a delay in the availability of analytics data.

#### Azure Monitor-based dashboard

To use the Azure Monitor-based dashboard, you need a Log Analytics workspace as a data source for API Management gateway logs.

If you need to configure one, the following are brief steps to send gateway logs to a Log Analytics workspace. For more information, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md#resource-logs). This procedure is a one-time setup.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.
1. Enter a descriptive name for the diagnostic setting.
1. In **Logs**, select **Logs related to ApiManagement Gateway**.
1. In **Destination details**, select **Send to Log Analytics** and select a Log Analytics workspace in the same or a different subscription. If you need to create a workspace, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).
1. Make sure **Resource specific** is selected as the destination table.
1. Select **Save**.

> [!IMPORTANT]
> A new Log Analytics workspace can take up to 2 hours to start receiving data. An existing workspace should start receiving data within approximately 15 minutes.

#### Access the dashboard

After a Log Analytics workspace is configured, access the Azure Monitor-based dashboard to analyze the usage and performance of your APIs.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Analytics**. The analytics dashboard opens.
1. Select a time range for data.
1. Select a report category for analytics data, such as **Timeline**, **Geography**, and so on.

### Legacy built-in analytics

In certain API Management service tiers, built-in analytics (also called *legacy analytics* or *classic analytics*) is also available in the Azure portal, and analytics data can be accessed using the API Management REST API. 

To access the built-in (classic) analytics in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Analytics (classic)**.
1. Select a time range for data, or enter a custom time range.
1. Select a report category for analytics data, such as **Timeline**, **Geography**, and so on.
1. Optionally, filter the report by one or more other categories.

Use [Reports](/rest/api/apimanagement/reports) operations in the API Management REST API to retrieve and filter analytics data for your API Management instance.

Available operations return report records by API, geography, API operations, product, request, subscription, time, or user.

### How to integrate Azure API Management with Azure Application Insights

You can easily integrate Azure Application Insights with Azure API Management. Azure Application Insights is an extensible service for web developers building and managing apps on multiple platforms.

> [!NOTE]
> In an API Management [workspace](workspaces-overview.md), a workspace owner can independently integrate Application Insights and enable Application Insights logging for the workspace's APIs. The general guidance to integrate a workspace with Application Insights is similar to the guidance for an API Management instance; however, configuration is scoped to the workspace only. Currently, you must integrate Application Insights in a workspace by configuring a connection string (recommended) or an instrumentation key.

> [!WARNING]
> When using our [self-hosted gateway](self-hosted-gateway-overview.md), we do not guarantee all telemetry will be pushed to Azure Application Insights given it relies on [Application Insights' in-memory buffering](/azure/azure-monitor/app/telemetry-channels#built-in-telemetry-channels).

- You need an Azure API Management instance. [Create one](get-started-create-service-instance.md) first.
- To use Application Insights, [create an instance of the Application Insights service](/previous-versions/azure/azure-monitor/app/create-new-resource). To create an instance using the Azure portal, see [Workspace-based Application Insights resources](/azure/azure-monitor/app/create-workspace-resource).

  > [!NOTE]
  > The Application Insights resource **can be** in a different subscription or even a different tenant than the API Management resource.

- If you plan to configure managed identity credentials to use with Application Insights, complete the following steps:

  1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md). If you enable a user-assigned managed identity, take note of the identity's **Client ID**.
  1. Assign the identity the **Monitoring Metrics Publisher** role, scoped to the Application Insights resource. To assign the role, use the [Azure portal](../role-based-access-control/role-assignments-portal.yml) or other Azure tools.

#### Scenario overview

The following are high level steps for this scenario.

1. First, create a connection between Application Insights and API Management

   You can create a connection between Application Insights and your API Management using the Azure portal, the REST API, or related Azure tools. API Management configures a *logger* resource for the connection.

   > [!IMPORTANT]
   > Currently, in the portal, API Management only supports connections to Application Insights using an Application Insights instrumentation key. For enhanced security, we recommend using an Application Insights connection string with an API Management managed identity. To configure connection string with managed identity credentials, use the [REST API](#create-a-connection-using-the-rest-api-bicep-or-arm-template) or related tools as shown in a later section of this article. [Learn more](/azure/azure-monitor/app/sdk-connection-string) about Application Insights connection strings.

   > [!NOTE]
   > If your Application Insights resource is in a different tenant, then you must create the logger using the [REST API](#create-a-connection-using-the-rest-api-bicep-or-arm-template) or related tools as shown in a later section of this article.

1. Second, enable Application Insights logging for your API or APIs.

   In this section, you enable Application Insights logging for your API using the Azure portal. API Management configures a *diagnostic* resource for the API.

#### Create a connection using the Azure portal

Follow these steps to use the Azure portal to create a connection between Application Insights and API Management.

> [!NOTE]
> Where possible, Microsoft recommends using connection string with managed identity credentials for enhanced security. To configure these credentials, use the [REST API](#create-a-connection-using-the-rest-api-bicep-or-arm-template) or related tools as shown in a later section of this article.

1. Navigate to your **Azure API Management service instance** in the **Azure portal**.
1. Select **Application Insights** from the menu on the left.
1. Select **+ Add**.

   :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-1.png" alt-text="Screenshot that shows where to add a new connection":::

1. Select the **Application Insights** instance you created earlier and provide a short description.
1. To enable [availability monitoring](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) of your API Management instance in Application Insights, select the **Add availability monitor** checkbox.

   - This setting regularly validates whether the API Management gateway endpoint is responding.
   - Results appear in the **Availability** pane of the Application Insights instance.

1. Select **Create**.
1. Check that the new Application Insights logger now appears in the list.

   :::image type="content" source="media/api-management-howto-app-insights/apim-app-insights-logger-2.png" alt-text="Screenshot that shows where to view the newly created Application Insights logger.":::

> [!NOTE]
> Behind the scenes, a logger entity is created in your API Management instance, containing the instrumentation key of the Application Insights instance.

> [!TIP]
> If you need to update the instrumentation key configured in the Application Insights logger, select the logger's row in the list (not the name of the logger). Enter the instrumentation key, and select **Save**.

#### Create a connection using the REST API, Bicep, or ARM template

Follow these steps to use the REST API, Bicep, or ARM template to create an Application Insights logger for your API Management instance. You can configure a logger that uses connection string with managed identity credentials (recommended), or a logger that uses only a connection string.

- Logger with connection string with managed identity credentials (recommended)

  The Application Insights connection string appears in the **Overview** section of your Application Insights resource.

- Connection string with system-assigned managed identity

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

Include a snippet similar to the following example in your Bicep template.

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

Include a JSON snippet similar to the following example in your Azure Resource Manager template.

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

Include a snippet similar the following example in your Bicep template.

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

Include a JSON snippet similar to the following example in your Azure Resource Manager template.

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

- Logger with connection string credentials only

  The Application Insights connection string appears in the **Overview** section of your Application Insights resource.

#### [REST API](#tab/rest)

Use the API Management [Logger - Create or Update](/rest/api/apimanagement/current-preview/logger/create-or-update) REST API with the following request body.

If you're configuring the logger for a workspace, use the [Workspace Logger - Create or Update](/rest/api/apimanagement/workspace-logger/create-or-update?view=rest-apimanagement-2023-09-01-preview&preserve-view=true) REST API.

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

Include a snippet similar to the following example in your Bicep template.

If you're configuring the logger for a workspace, create a `Microsoft.ApiManagement/service.workspace/loggers@2023-09-01-preview` resource instead.

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

Include a JSON snippet similar to the following example in your Azure Resource Manager template.

If you're configuring the logger for a workspace, create a `Microsoft.ApiManagement/service.workspace/loggers` resource and set `apiVersion` to `2023-09-01-preview` instead.

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

#### Enable Application Insights logging for your API

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

#### Loggers for a single API or all APIs

You can specify loggers on different levels:

- Single API logger
- A logger for all APIs

Specifying *both*:

- By default, the single API logger (more granular level) overrides the one for all APIs.
- If the loggers configured at the two levels are different, and you need both loggers to receive telemetry (multiplexing), contact Microsoft Support. Multiplexing isn't supported if you're using the same logger (Application Insights destination) at the "All APIs" level and the single API level. For multiplexing to work correctly, you must configure different loggers at the "All APIs" and individual API level and request assistance from Microsoft support to enable multiplexing for your service.

#### What data is added to Application Insights

Application Insights receives:

| Telemetry item | Description |
| -------------- | ----------- |
| *Request* | For every incoming request: <ul><li>*frontend request*</li><li>*frontend response*</li></ul> |
| *Dependency* | For every request forwarded to a backend service: <ul><li>*backend request*</li><li>*backend response*</li></ul> |
| *Exception* | For every failed request: <ul><li>Failed because of a closed client connection</li><li>Triggered an *on-error* section of the API policies</li><li>Has a response HTTP status code matching 4xx or 5xx</li></ul> |
| *Trace* | If you configure a [trace](trace-policy.md) policy. <br /> The `severity` setting in the `trace` policy must be equal to or greater than the `verbosity` setting in the Application Insights logging. |

> [!NOTE]
> See [Application Insights limits](/azure/azure-monitor/service-limits#application-insights) for information about the maximum size and number of metrics and events per Application Insights instance.

#### Emit custom metrics

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

#### Limits for custom metrics

[!INCLUDE [api-management-custom-metrics-limits](../../includes/api-management-custom-metrics-limits.md)]

#### Performance implications and log sampling

> [!WARNING]
> Logging all events may have serious performance implications, depending on incoming requests rate.

Based on internal load tests, enabling the logging feature caused a 40%-50% reduction in throughput when request rate exceeded 1,000 requests per second. Application Insights is designed to assess application performances using statistical analysis. It's not:

- Intended to be an audit system.
- Suited for logging each individual request for high-volume APIs.

You can manipulate the number of logged requests by [adjusting the **Sampling** setting](#enable-application-insights-logging-for-your-api). A value of 100% means all requests are logged, while 0% reflects no logging.

**Sampling** helps to reduce telemetry volume, effectively preventing significant performance degradation while still carrying the benefits of logging.

To improve performance issues, skip:

- Request and responses headers.
- Body logging.

#### Video

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2pkXv]
>
>

#### Troubleshooting

Addressing the issue of telemetry data flow from API Management to Application Insights:

- Investigate whether a linked Azure Monitor Private Link Scope (AMPLS) resource exists within the virtual network where the API Management resource is connected. AMPLS resources have a global scope across subscriptions and are responsible for managing data query and ingestion for all Azure Monitor resources. It's possible that the AMPLS has been configured with a Private-Only access mode specifically for data ingestion. In such instances, include the Application Insights resource and its associated Log Analytics resource in the AMPLS. Once this addition is made, the API Management data are successfully ingested into the Application Insights resource, resolving the telemetry data transmission issue.

### Enable logging of developer portal usage in Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

This article shows you how to enable Azure Monitor logs for auditing and troubleshooting usage of the API Management [developer portal](developer-portal-overview.md). When enabled through a diagnostic setting, the logs collect information about the requests that are received and processed by the developer portal.

Developer portal usage logs include data about activity in the developer portal, including:

- User authentication actions, such as sign-in and sign-out
- Views of API details, API operation details, and products
- API testing in the interactive test console

#### Enable diagnostic setting for developer portal logs

To configure a diagnostic setting for developer portal usage logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.

   :::image type="content" source="media/developer-portal-enable-usage-logs/monitoring-menu.png" alt-text="Screenshot of adding a diagnostic setting in the portal.":::

1. On the **Diagnostic setting** page, enter or select details for the setting:

    1. **Diagnostic setting name**: Enter a descriptive name.
    1. **Category groups**: Optionally make a selection for your scenario.
    1. Under **Categories**: Select **Logs related to Developer Portal usage**. Optionally select other categories as needed.
    1. Under **Destination details**, select one or more options and specify details for the destination. For example, archive logs to a storage account or stream them to an event hub. [Learn more](/azure/azure-monitor/essentials/diagnostic-settings).
    1. Select **Save**.

#### View diagnostic log data

Depending on the log destination you choose, it can take a few minutes for data to appear.

If you send logs to a storage account, you can access the data in the Azure portal and download it for analysis.

1. In the [Azure portal](https://portal.azure.com), navigate to the storage account destination.
1. In the left menu, select **Storage Browser**.
1. Under **Blob containers**, select **insights-logs-developerportalauditlogs**.
1. Navigate to the container for the logs in your API Management instance. The logs are partitioned in intervals of 1 hour.
1. To retrieve the data for further analysis, select **Download**.

### Integrate Application Insights to developer portal

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

A popular feature of Azure Monitor is Application Insights. It's an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your developer portal and detect performance anomalies. Application Insights includes powerful analytics tools to help you learn what users actually do while visiting your developer portal.

#### Add Application Insights to your portal

Follow these steps to plug Application Insights into your managed or self-hosted developer portal.

> [!IMPORTANT]
> Steps 1 -3 are not required for managed portals. If you have a managed portal, skip to step 4.

1. Set up a [local environment](developer-portal-self-host.md#step-1-set-up-local-environment) for the latest release of the developer portal.

1. Install the **npm** package to add [Paperbits for Azure](https://github.com/paperbits/paperbits-azure):

   ```console
   npm install @paperbits/azure --save
   ```

1. In the `startup.publish.ts` file in the `src` folder, import and register the Application Insights module. Add the `AppInsightsPublishModule` after the existing modules in the dependency injection container:

   ```typescript
   import { AppInsightsPublishModule } from "@paperbits/azure";
   ...
   const injector = new InversifyInjector();
   injector.bindModule(new CoreModule());
   ...
   injector.bindModule(new AppInsightsPublishModule());
   injector.resolve("autostart");
   ```

1. Retrieve the portal's configuration using the [Content Item - Get](/rest/api/apimanagement/current-ga/content-item/get) REST API:

   ```http
   GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.ApiManagement/service/{api-management-service-name}/contentTypes/document/contentItems/configuration?api-version=2021-08-01
   ```

   Output is similar to:

   ```json
   {
       "id": "/contentTypes/document/contentItems/configuration",
       "type": "Microsoft.ApiManagement/service/contentTypes/contentItems",
         "name": "configuration",
         "properties": {
         "nodes": [
           {
               "site": {
                   "title": "Microsoft Azure API Management - developer portal",
                   "description": "Discover APIs, learn how to use them, try them out interactively, and sign up to acquire keys.",
                   "keywords": "Azure, API Management, API, developer",
                   "faviconSourceId": null,
                   "author": "Microsoft Azure API Management"
               }
           }
       ]
       }
   }
   ```

1. Extend the site configuration from the previous step with Application Insights configuration. Update the configuration using the [Content Item - Create or Update](/rest/api/apimanagement/current-ga/content-item/create-or-update) REST API. Pass the Application Insights instrumentation key in an `integration` node in the request body.

   ```http
   PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.ApiManagement/service/{api-management-service-name}/contentTypes/document/contentItems/configuration?api-version=2021-08-01
   ```

   ```json
   {
       "id": "/contentTypes/document/contentItems/configuration",
       "type": "Microsoft.ApiManagement/service/contentTypes/contentItems",
       "name": "configuration",
       "properties": {  
       "nodes": [
           {
               "site": { ... },
               "integration": {
                   "appInsights": {
                       "instrumentationKey": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx"
                   }
               }
           }
       ]
       }
   }
   ```

1. After you update the configuration, [republish the portal](developer-portal-overview.md#publish-the-portal) for the changes to take effect.






<!--## Use Azure Monitor tools to analyze the data-->
[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

### Visualize API Management monitoring data using a Managed Grafana dashboard

You can use [Azure Managed Grafana](../managed-grafana/index.yml) to visualize API Management monitoring data that is collected into a Log Analytics workspace. Use a prebuilt [API Management dashboard](https://grafana.com/grafana/dashboards/16604-azure-api-management) for real-time visualization of logs and metrics collected from your API Management instance.

- [Learn more about Azure Managed Grafana](../managed-grafana/overview.md)
- [Learn more about observability in Azure API Management](observability.md)

On your API Management instance:

- To visualize resource logs and metrics for API Management, configure [diagnostic settings](api-management-howto-use-azure-monitor.md#resource-logs) to collect resource logs and send them to a Log Analytics workspace.
- To visualize detailed data about requests to the API Management gateway, [integrate](api-management-howto-app-insights.md) your API Management instance with Application Insights.

  > [!NOTE]
  > To visualize data in a single dashboard, configure the Log Analytics workspace for the diagnostic settings and the Application Insights instance in the same resource group as your API Management instance.

On your Managed Grafana workspace:

- To create a Managed Grafana instance and workspace, see the quickstart for the [portal](../managed-grafana/quickstart-managed-grafana-portal.md) or the [Azure CLI](../managed-grafana/quickstart-managed-grafana-cli.md).
- The Managed Grafana instance must be in the same subscription as the API Management instance.
- When created, the Grafana workspace is automatically assigned a Microsoft Entra managed identity, which is assigned the Monitor Reader role on the subscription. This approach gives you immediate access to Azure Monitor from the new Grafana workspace without needing to set permissions manually. Learn more about [configuring data sources](../managed-grafana/how-to-data-source-plugins-managed-identity.md) for Managed Grafana.

#### Import API Management dashboard

First import the [API Management dashboard](https://grafana.com/grafana/dashboards/16604-azure-api-management) to your Management Grafana workspace.

To import the dashboard:

1. Go to your Azure Managed Grafana workspace. In the portal, on the **Overview** page of your Managed Grafana instance, select the **Endpoint** link. 
1. In the Managed Grafana workspace, go to **Dashboards** > **Browse** > **Import**.
1. On the **Import** page, under **Import via grafana.com**, enter *16604* and select **Load**. 
1. Select an **Azure Monitor data source**, review or update the other options, and select **Import**.

#### Use API Management dashboard

1. In the Managed Grafana workspace, go to **Dashboards** > **Browse** and select your API Management dashboard.
1. In the dropdowns at the top, make selections for your API Management instance. If configured, select an Application Insights instance and a Log Analytics workspace.  

Review the default visualizations on the dashboard, which appears similar to the following screenshot:

:::image type="content" source="media/visualize-using-managed-grafana-dashboard/api-management-dashboard.png" alt-text="Screenshot of API Management dashboard in Managed Grafana workspace." lightbox="media/visualize-using-managed-grafana-dashboard/api-management-dashboard.png":::

[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

To see how to set up an alert rule in Azure API Management, see [Set up an alert rule](api-management-howto-use-azure-monitor.md#set-up-an-alert-rule).

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

[!INCLUDE [azmon-horz-advisor](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-advisor.md)]

## Related content

- [API Management monitoring data reference](monitor-api-management-reference.md)
- [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
