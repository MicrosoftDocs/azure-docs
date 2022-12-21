---
title: How to log events to Azure Event Hubs in Azure API Management | Microsoft Docs
description: Learn how to log events to Azure Event Hubs in Azure API Management. Event Hubs is a highly scalable data ingress service.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 12/20/2022
ms.author: danlep

---
# How to log events to Azure Event Hubs in Azure API Management
Azure Event Hubs is a highly scalable data ingress service that can ingest millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Event Hubs acts as the "front door" for an event pipeline, and once data is collected into an event hub, it can be transformed and stored using any real-time analytics provider or batching/storage adapters. Event Hubs decouples the production of a stream of events from the consumption of those events, so that event consumers can access the events on their own schedule.

This article describes how to log API Management events using Azure Event Hubs.

## Prerequisites

* An API Management service instance. If you don't have one, see [Create an API Management service instance](get-started-create-service-instance.md).
* An Azure Event Hubs namespace and event hub. For detailed steps, see [Create an Event Hubs namespace and an event hub using the Azure portal](../event-hubs/event-hubs-create.md).
    > [!NOTE]
    > The Event Hubs resource **can be** in a different subscription or even a different tenant than the API Management resource

## Configure access to the event hub

To log events to the event hub, you need credentials to enable access from API Management. API Management supports two access mechanisms: an Event Hubs connection string, or an API Management managed identity.

### Configure event hub connection string

To create an Event Hubs connection string, see [Get an Event Hubs connection string](../event-hubs/event-hubs-get-connection-string.md). You can get a connection string to the namespace or the specific event hub you use for logging from API Management

### Configure API Management managed identity

> [!NOTE]
> Using an API Management managed identity for logging events to an event hub is supported in API Management REST API version `2022-04-01-preview` or later.

1. Enable a system-assigned or user-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.

    * If you enable a user-assigned managed identity, take note of the identity's **Client ID**.

1. Assign the identity the **Azure Event Hubs Data Owner** role, scoped to the Event Hubs namespace or to the event hub used for logging. To assign the role, use the [Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md) or other Azure tools.


## Create an API Management logger
Now that you have an event hub, the next step is to configure a [Logger](/rest/api/apimanagement/current-ga/logger) in your API Management service so that it can log events to the event hub.

API Management loggers can be configured using the [API Management REST API](/rest/api/apimanagement/current-ga/logger/create-or-update) directly or tools including [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementlogger), a Bicep template, or an Azure Resource Management template.

### Logger with connection string credentials

#### [PowerShell](#tab/PowerShell)

The following example uses the [New-AzApiManagementLogger](/powershell/module/az.apimanagement/new-azapimanagementlogger) cmdlet to create a logger to an event hub by specifying a connection string.

```powershell
# API Management service-specific details
$apimServiceName = "apim-hello-world"
$resourceGroupName = "myResourceGroup"

$context = New-AzApiManagementContext -ResourceGroupName $resourceGroupName -ServiceName $apimServiceName
New-AzApiManagementLogger -Context $context -LoggerId "ContosoLogger1" -Name "ApimEventHub" -ConnectionString "Endpoint=sb://ContosoEventHubs.servicebus.windows.net/;SharedAccessKeyName=SendKey;SharedAccessKey=<key>" -Description "Event hub logger with connection string"
```

#### [Bicep](#tab/bicep)

Include the following snippet in your Bicep template.

```Bicep
@description('The name of the API Management service instance.')
param serviceName string

resource apimService 'Microsoft.ApiManagement/service@2022-04-01-preview' existing = {
  name: serviceName

resource ehLoggerWithConnectionString 'Microsoft.ApiManagement/service/loggers@2022-04-01-preview' = {
  name: 'ContosoLogger1'
  parent: apimService
  properties: {
    loggerType: 'azureEventHub'
    description: 'Event hub logger with connection string'
    credentials: {
      connectionString: 'Endpoint=sb://ContosoEventHubs.servicebus.windows.net/;SharedAccessKeyName=SendKey;SharedAccessKey=<key>'
      name: 'ApimEventHub'
    }
  }
}
```

#### [ARM](#tab/arm)

Include the following JSON snippet in your Azure Resource Manager template.

```JSON
{
  "type": "Microsoft.ApiManagement/service/loggers",
  "apiVersion": "2022-04-01-preview",
  "name": "ContosoLogger1",
  "properties": {
    "credentials": {
        "connectionString": "Endpoint=sb://ContosoEventHubs.servicebus.windows.net/;SharedAccessKeyName=SendKey;SharedAccessKey=<key>",
        "name": "ApimEventHub"
    },
    "description": "Event hub logger with connection string",
    "loggerType": "azureEventHub",
    "resourceId": "string"
  }
}
```
---

### Logger with system-assigned managed identity credentials


### Logger with user-assigned managed identity credentials


## Configure log-to-eventhub policy

Once your logger is configured in API Management, you can configure your [log-to-eventhub](api-management-advanced-policies.md#log-to-event-hub) policy to log the desired events. The `log-to-eventhub` policy can be used in either the inbound policy section or the outbound policy section.

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

1. Select **Save** to save the updated policy configuration. As soon as it is saved, the policy is active and events are logged to the designated event hub.

> [!NOTE]
> The maximum supported message size that can be sent to an event hub from this API Management policy is 200 kilobytes (KB). If a message that is sent to an event hub is larger than 200 KB, it will be automatically truncated, and the truncated message will be transferred to the event hub.

## Preview the log in Event Hubs by using Azure Stream Analytics

You can preview the log in Event Hubs by using [Azure Stream Analytics queries](../event-hubs/process-data-azure-stream-analytics.md). 

1. In the Azure portal, browse to the event hub that the logger sends events to. 
2. Under **Features**, select the **Process data** tab.
3. On the **Enable real time insights from events** card, select **Explore**.
4. You should be able to preview the log on the **Input preview** tab. If the data shown isn't current, select **Refresh** to see the latest events.

## Next steps
* Learn more about Azure Event Hubs
  * [Get started with Azure Event Hubs](../event-hubs/event-hubs-c-getstarted-send.md)
  * [Receive messages with EventProcessorHost](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
  * [Event Hubs programming guide](../event-hubs/event-hubs-programming-guide.md)
* Learn more about API Management and Event Hubs integration
  * [Logger entity reference](/rest/api/apimanagement/current-ga/logger)
  * [log-to-eventhub policy reference](./api-management-advanced-policies.md#log-to-eventhub)
  * [Monitor your APIs with Azure API Management, Event Hubs, and Moesif](api-management-log-to-eventhub-sample.md)  
* Learn more about [integration with Azure Application Insights](api-management-howto-app-insights.md)

[publisher-portal]: ./media/api-management-howto-log-event-hubs/publisher-portal.png
[create-event-hub]: ./media/api-management-howto-log-event-hubs/create-event-hub.png
[event-hub-connection-string]: ./media/api-management-howto-log-event-hubs/event-hub-connection-string.png
[event-hub-dashboard]: ./media/api-management-howto-log-event-hubs/event-hub-dashboard.png
[receiving-policy]: ./media/api-management-howto-log-event-hubs/receiving-policy.png
[sending-policy]: ./media/api-management-howto-log-event-hubs/sending-policy.png
[event-hub-policy]: ./media/api-management-howto-log-event-hubs/event-hub-policy.png
[add-policy]: ./media/api-management-howto-log-event-hubs/add-policy.png
