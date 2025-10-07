---
title: How to Log Events to Azure Event Hubs in Azure API Management | Microsoft Docs
description: Learn how to log events to Azure Event Hubs in Azure API Management. Event Hubs is a highly scalable data ingress service.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 10/01/2025
ms.author: danlep
ms.custom:
  - build-2025

#customer intent: As an API developer or admin, I want to learn how to log events to Event Hubs in API Management.
---
# How to log events to Azure Event Hubs in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to log API Management events by using Azure Event Hubs.

Azure Event Hubs is a highly scalable data ingress service that can ingest millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Event Hubs acts as the "front door" for an event pipeline, and after data is collected into an event hub, you can transform and store it by using any real-time analytics provider or batching/storage adapters. Event Hubs decouples the production of a stream of events from the consumption of those events, so that event consumers can access the events on their own schedule.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

## Prerequisites

* An API Management service instance. If you don't have one, see [Create an API Management service instance](get-started-create-service-instance.md).
* An Event Hubs namespace and event hub. For detailed steps, see [Create an Event Hubs namespace and an event hub using the Azure portal](../event-hubs/event-hubs-create.md).
    > [!NOTE]
    > The Event Hubs resource can be in a different subscription or even a different tenant from the API Management resource.

## Configure access to the event hub

To log events to the event hub, you need to configure credentials for access from API Management. API Management supports either of the two following access mechanisms:

* A managed identity for your API Management instance (recommended)
* An Event Hubs connection string

> [!NOTE]
> We recommend that you use managed identity credentials when possible, for enhanced security. 

### Option 1: Configure an API Management managed identity

1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.

    * If you enable a user-assigned managed identity, take note of the identity's **Object ID**.

1. Assign the identity the **Azure Event Hubs Data sender** role, scoped to the Event Hubs namespace or to the event hub used for logging. To assign the role, use the [Azure portal](../role-based-access-control/role-assignments-portal.yml) or another Azure tool.


### Option 2: Configure an Event Hubs connection string

To create an Event Hubs connection string, see [Get an Event Hubs connection string](../event-hubs/event-hubs-get-connection-string.md). 

* You can use a connection string for the Event Hubs namespace or for the specific event hub you use for logging from API Management.
* The shared access policy for the connection string must enable at least **Send** permissions.

## Create an API Management logger
The next step is to configure a [logger](/rest/api/apimanagement/current-ga/logger) in your API Management service so that it can log events to the event hub.

Create and manage API Management loggers by using the [API Management REST API](/rest/api/apimanagement/current-preview/logger/create-or-update) directly or by using other tools, like [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementlogger), a Bicep file, or an Azure Resource Management template.

### Option 1: Create a logger with managed identity credentials (recommended)

You can configure an API Management logger to an event hub by using either system-assigned or user-assigned managed identity credentials.

#### Create a logger with system-assigned managed identity credentials

For prerequisites, see [Configure an API Management managed identity](#option-1-configure-an-api-management-managed-identity).

#### [REST API](#tab/PowerShell)

Use the API Management [Logger - Create or Update](/rest/api/apimanagement/current-preview/logger/create-or-update) REST API member with the following request body.

```JSON
{
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event Hub logger with system-assigned managed identity",
    "credentials": {
         "endpointAddress":"<EventHubsNamespace>.servicebus.windows.net",
         "identityClientId":"SystemAssigned",
         "name":"<EventHubName>"
    }
  }
}

```

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep file.

```Bicep
resource ehLoggerWithSystemAssignedIdentity 'Microsoft.ApiManagement/service/loggers@2022-08-01' = {
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
  "apiVersion": "2022-08-01",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event Hub logger with system-assigned managed identity",
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
#### Create a logger with user-assigned managed identity credentials

For prerequisites, see [Configure an API Management managed identity](#option-1-configure-an-api-management-managed-identity).

#### [REST API](#tab/PowerShell)

Use the API Management [Logger - Create or Update](/rest/api/apimanagement/current-preview/logger/create-or-update) REST API member with the following request body.


```JSON
{
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event Hub logger with user-assigned managed identity",
    "credentials": {
         "endpointAddress":"<EventHubsNamespace>.servicebus.windows.net",
         "identityClientId":"<ClientID>",
         "name":"<EventHubName>"
    }
  }
}

```

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep file.

```Bicep
resource ehLoggerWithUserAssignedIdentity 'Microsoft.ApiManagement/service/loggers@2022-08-01' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'azureEventHub'
    description: 'Event Hub logger with user-assigned managed identity'
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
  "apiVersion": "2022-08-01",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event Hub logger with user-assigned managed identity",
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


### Option 2. Create a logger with connection string credentials

For prerequisites, see [Configure an Event Hubs connection string](#option-2-configure-an-event-hubs-connection-string).

> [!NOTE]
> We recommend that you configure the logger with managed identity credentials when possible. See [Configure a logger with managed identity credentials](#option-1-create-a-logger-with-managed-identity-credentials-recommended), earlier in this article.

#### [PowerShell](#tab/PowerShell)

The following example uses the [New-AzApiManagementLogger](/powershell/module/az.apimanagement/new-azapimanagementlogger) cmdlet to create a logger to an event hub by configuring a connection string.

```powershell
# Details specific to API Management 
$apimServiceName = "apim-hello-world"
$resourceGroupName = "myResourceGroup"

# Create logger
$context = New-AzApiManagementContext -ResourceGroupName $resourceGroupName -ServiceName $apimServiceName
New-AzApiManagementLogger -Context $context -LoggerId "ContosoLogger1" -Name "ApimEventHub" -ConnectionString "Endpoint=sb://<EventHubsNamespace>.servicebus.windows.net/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<key>" -Description "Event hub logger with connection string"
```

#### [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep file.

```Bicep
resource ehLoggerWithConnectionString 'Microsoft.ApiManagement/service/loggers@2022-08-01' = {
  name: 'ContosoLogger1'
  parent: '<APIManagementInstanceName>'
  properties: {
    loggerType: 'azureEventHub'
    description: 'Event Hub logger with connection string credentials'
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
  "apiVersion": "2022-08-01",
  "name": "ContosoLogger1",
  "properties": {
    "loggerType": "azureEventHub",
    "description": "Event Hub logger with connection string credentials",
    "resourceId": "<EventHubsResourceID>"
    "credentials": {
      "connectionString": "Endpoint=sb://<EventHubsNamespace>/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<key>",
      "name": "ApimEventHub"
    },
  }
}
```
---

## Configure a log-to-eventhub policy

After your logger is configured in API Management, you can configure your [log-to-eventhub](log-to-eventhub-policy.md) policy to log the desired events. For example, use the `log-to-eventhub` policy in the inbound policy section to log requests, or in the outbound policy section to log responses.

1. Go to your API Management instance.
1. Under **APIs**, select **APIs**, and then select the API to which you want to add the policy. In this example, we're adding a policy to the **Echo API** in the **Unlimited** product.
1. On the **Design** tab, select **All operations**.
1. In the **Inbound processing** or **Outbound processing** pane, select the **</>** (Policy code editor) button. For more information, see [How to set or edit policies](set-edit-policies.md).
1. Position your cursor in the `inbound` or `outbound` policy section.
1. Select **Show snippets** at the top of the tab. Select **Advanced policies** > **Log to EventHub**. This action inserts the `log-to-eventhub` policy statement template.

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

1. Select **Save** to save the updated policy configuration. As soon as the configuration is saved, the policy is active and events are logged to the designated event hub.

> [!NOTE]
> The maximum supported message size that can be sent to an event hub from this API Management policy is 200 kilobytes (KB). If a message that's sent to an event hub is larger than 200 KB, it's automatically truncated, and the truncated message is transferred to the event hub. For larger messages, consider using Azure Storage with API Management as a workaround to bypass the 200-KB limit. For more information, see [Send requests to Azure Storage from API Management](https://techcommunity.microsoft.com/t5/microsoft-developer-community/how-to-send-requests-to-azure-storage-from-azure-api-management/ba-p/3624955). 

## Preview the log in Event Hubs by using Azure Stream Analytics

You can preview the log in Event Hubs by using [Azure Stream Analytics queries](../event-hubs/process-data-azure-stream-analytics.md). 

1. In the Azure portal, go to the event hub that the logger sends events to. 
1. Under **Features**, select **Process data**.
1. On the **Enable real time insights from events** card, select **Start**.
1. You should be able to preview the log on the **Input preview** tab. If the data shown isn't current, select **Refresh** to see the latest events.

## Related content
* Learn more about Azure Event Hubs
  * [Get started with Azure Event Hubs](../event-hubs/event-hubs-c-getstarted-send.md)
  * [Send events to and receive events from Event Hubs using .NET](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
  * [Azure.Messaging.EventHubs Samples](../event-hubs/event-hubs-programming-guide.md)
* Learn more about API Management and Event Hubs integration
  * [Logger entity reference](/rest/api/apimanagement/current-preview/logger)
  * [log-to-eventhub](log-to-eventhub-policy.md) policy reference
* Learn more about [integration with Azure Application Insights](api-management-howto-app-insights.md)
