---
title: How to log events to Azure Event Hubs in Azure API Management | Microsoft Docs
description: Learn how to log events to Azure Event Hubs in Azure API Management. Event Hubs is a highly scalable data ingress service.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 03/31/2023
ms.author: danlep

---
# How to log events to Azure Event Hubs in Azure API Management

This article describes how to log API Management events using Azure Event Hubs.

Azure Event Hubs is a highly scalable data ingress service that can ingest millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Event Hubs acts as the "front door" for an event pipeline, and once data is collected into an event hub, it can be transformed and stored using any real-time analytics provider or batching/storage adapters. Event Hubs decouples the production of a stream of events from the consumption of those events, so that event consumers can access the events on their own schedule.

## Prerequisites

* An API Management service instance. If you don't have one, see [Create an API Management service instance](get-started-create-service-instance.md).
* An Azure Event Hubs namespace and event hub. For detailed steps, see [Create an Event Hubs namespace and an event hub using the Azure portal](../event-hubs/event-hubs-create.md).
    > [!NOTE]
    > The Event Hubs resource **can be** in a different subscription or even a different tenant than the API Management resource

## Configure access to the event hub

To log events to the event hub, you need to configure credentials for access from API Management. API Management supports either of the two following access mechanisms:

* An Event Hubs connection string
* A managed identity for your API Management instance.

### Option 1: Configure Event Hubs connection string

To create an Event Hubs connection string, see [Get an Event Hubs connection string](../event-hubs/event-hubs-get-connection-string.md). 

* You can use a connection string for the Event Hubs namespace or for the specific event hub you use for logging from API Management.
* The shared access policy for the connection string must enable at least **Send** permissions.

### Option 2: Configure API Management managed identity

> [!NOTE]
> Using an API Management managed identity for logging events to an event hub is supported in API Management REST API version `2022-04-01-preview` or later.

1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.

    * If you enable a user-assigned managed identity, take note of the identity's **Client ID**.

1. Assign the identity the **Azure Event Hubs Data sender** role, scoped to the Event Hubs namespace or to the event hub used for logging. To assign the role, use the [Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md) or other Azure tools.

## Create an API Management logger
The next step is to configure a [logger](/rest/api/apimanagement/current-ga/logger) in your API Management service so that it can log events to the event hub.

Create and manage API Management loggers by using the [API Management REST API](/rest/api/apimanagement/current-preview/logger/create-or-update) directly or by using tools including [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementlogger), a Bicep template, or an Azure Resource Management template.

### Logger with connection string credentials

For prerequisites, see [Configure Event Hubs connection string](#option-1-configure-event-hubs-connection-string).

#### [PowerShell](#tab/PowerShell)

The following example uses the [New-AzApiManagementLogger](/powershell/module/az.apimanagement/new-azapimanagementlogger) cmdlet to create a logger to an event hub by configuring a connection string.

```powershell
# API Management service-specific details
$apimServiceName = "apim-hello-world"
$resourceGroupName = "myResourceGroup"

# Create logger
$context = New-AzApiManagementContext -ResourceGroupName $resourceGroupName -ServiceName $apimServiceName
New-AzApiManagementLogger -Context $context -LoggerId "ContosoLogger1" -Name "ApimEventHub" -ConnectionString "Endpoint=sb://<EventHubsNamespace>.servicebus.windows.net/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<key>" -Description "Event hub logger with connection string"
```

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template.

```Bicep
resource ehLoggerWithConnectionString 'Microsoft.ApiManagement/service/loggers@2022-04-01-preview' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'azureEventHub'
    description: 'Event hub logger with connection string'
    credentials: {
      connectionString: 'Endpoint=sb://<EventHubsNamespace>.servicebus.windows.net/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<key>'
      name: 'ApimEventHub'
    }
  }
}
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your Azure Resource Manager template.

```JSON
{
  "type": "Microsoft.ApiManagement/service/loggers",
  "apiVersion": "2022-04-01-preview",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event hub logger with connection string",
    "resourceId": "<EventHubsResourceID>"
    "credentials": {
      "connectionString": "Endpoint=sb://<EventHubsNamespace>/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<key>",
      "name": "ApimEventHub"
    },
  }
}
```
---

### Logger with system-assigned managed identity credentials

For prerequisites, see [Configure API Management managed identity](#option-2-configure-api-management-managed-identity).

#### [REST API](#tab/PowerShell)

Use the API Management [REST API](/rest/api/apimanagement/current-preview/logger/create-or-update) or a Bicep or ARM template to configure a logger to an event hub with system-assigned managed identity credentials.

```JSON
{
  "properties": {
    "loggerType": "azureEventHub",
    "description": "adding a new logger with system assigned managed identity",
    "credentials": {
         "endpointAddress":"<EventHubsNamespace>.servicebus.windows.net",
         "identityClientId":"SystemAssigned",
         "name":"<EventHubName>"
    }
  }
}

```

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template.

```Bicep
resource ehLoggerWithSystemAssignedIdentity 'Microsoft.ApiManagement/service/loggers@2022-04-01-preview' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'azureEventHub'
    description: 'Event hub logger with system-assigned managed identity'
    credentials: {
      endpointAddress: '<EventHubsNamespace>.servicebus.windows.net'
      identityClientId: 'systemAssigned'
      name: '<EventHubName>'
    }
  }
}
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your Azure Resource Manager template.

```JSON
{
  "type": "Microsoft.ApiManagement/service/loggers",
  "apiVersion": "2022-04-01-preview",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event hub logger with system-assigned managed identity",
    "resourceId": "<EventHubsResourceID>",
    "credentials": {
      "endpointAddress": "<EventHubsNamespace>.servicebus.windows.net",
      "identityClientId": "SystemAssigned",
      "name": "<EventHubName>"
    },
  }
}
```
---
### Logger with user-assigned managed identity credentials

For prerequisites, see [Configure API Management managed identity](#option-2-configure-api-management-managed-identity).

#### [REST API](#tab/PowerShell)

Use the API Management [REST API](/rest/api/apimanagement/current-preview/logger/create-or-update) or a Bicep or ARM template to configure a logger to an event hub with user-assigned managed identity credentials.

```JSON
{
  "properties": {
    "loggerType": "azureEventHub",
    "description": "adding a new logger with system assigned managed identity",
    "credentials": {
         "endpointAddress":"<EventHubsNamespace>.servicebus.windows.net",
         "identityClientId":"<ClientID>",
         "name":"<EventHubName>"
    }
  }
}

```

#### [Bicep](#tab/bicep)

Include a snippet similar the following in your Bicep template.

```Bicep
resource ehLoggerWithUserAssignedIdentity 'Microsoft.ApiManagement/service/loggers@2022-04-01-preview' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'azureEventHub'
    description: 'Event hub logger with user-assigned managed identity'
    credentials: {
      endpointAddress: '<EventHubsNamespace>.servicebus.windows.net'
      identityClientId: '<ClientID>'
      name: '<EventHubName>'
    }
  }
}
```

#### [ARM](#tab/arm)

Include a JSON snippet similar to the following in your Azure Resource Manager template.

```JSON
{
  "type": "Microsoft.ApiManagement/service/loggers",
  "apiVersion": "2022-04-01-preview",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event hub logger with user-assigned managed identity",
    "resourceId": "<EventHubsResourceID>",
    "credentials": {
      "endpointAddress": "<EventHubsNamespace>.servicebus.windows.net",
      "identityClientId": "<ClientID>",
      "name": "<EventHubName>"
    },
  }
}
```
---

## Configure log-to-eventhub policy

Once your logger is configured in API Management, you can configure your [log-to-eventhub](log-to-eventhub-policy.md) policy to log the desired events. For example, use the `log-to-eventhub` policy in the inbound policy section to log requests, or in the outbound policy section to log responses.

1. Browse to your API Management instance.
1. Select **APIs**, and then select the API to which you want to add the policy. In this example, we're adding a policy to the **Echo API** in the **Unlimited** product.
1. Select **All operations**.
1. On the top of the screen, select the **Design** tab.
1. In the Inbound processing or Outbound processing window, select the `</>` (code editor) icon. For more information, see [How to set or edit policies](set-edit-policies.md).
1. Position your cursor in the `inbound` or `outbound` policy section.
1. In the window on the right, select **Advanced policies** > **Log to EventHub**. This inserts the `log-to-eventhub` policy statement template.

    ```xml
    <log-to-eventhub logger-id="logger-id">
        @{
            return new JObject(
                new JProperty("EventTime", DateTime.UtcNow.ToString()),
                new JProperty("ServiceName", context.Deployment.ServiceName),
                new JProperty("RequestId", context.RequestId),
                new JProperty("RequestIp", context.Request.IpAddress),
                new JProperty("OperationName", context.Operation.Name)
            ).ToString();
        }
    </log-to-eventhub>
    ```

      1. Replace `logger-id` with the name of the logger that you created in the previous step.
      1. You can use any expression that returns a string as the value for the `log-to-eventhub` element. In this example, a string in JSON format containing the date and time, service name, request ID, request IP address, and operation name is logged.

1. Select **Save** to save the updated policy configuration. As soon as it's saved, the policy is active and events are logged to the designated event hub.

> [!NOTE]
> The maximum supported message size that can be sent to an event hub from this API Management policy is 200 kilobytes (KB). If a message that is sent to an event hub is larger than 200 KB, it will be automatically truncated, and the truncated message will be transferred to the event hub.

## Preview the log in Event Hubs by using Azure Stream Analytics

You can preview the log in Event Hubs by using [Azure Stream Analytics queries](../event-hubs/process-data-azure-stream-analytics.md). 

1. In the Azure portal, browse to the event hub that the logger sends events to. 
2. Under **Features**, select the **Process data** tab.
3. On the **Enable real time insights from events** card, select **Start**.
4. You should be able to preview the log on the **Input preview** tab. If the data shown isn't current, select **Refresh** to see the latest events.

## Next steps
* Learn more about Azure Event Hubs
  * [Get started with Azure Event Hubs](../event-hubs/event-hubs-c-getstarted-send.md)
  * [Receive messages with EventProcessorHost](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
  * [Event Hubs programming guide](../event-hubs/event-hubs-programming-guide.md)
* Learn more about API Management and Event Hubs integration
  * [Logger entity reference](/rest/api/apimanagement/current-preview/logger)
  * [log-to-eventhub](log-to-eventhub-policy.md) policy reference
* Learn more about [integration with Azure Application Insights](api-management-howto-app-insights.md)
