---
title: Custom events for Azure Event Grid with PowerShell | Microsoft Docs
description: Use Azure Event Grid and PowerShell to publish a topic, and subscribe to that event. 
services: event-grid 
keywords: 
author: tfitzmac
ms.author: tomfitz
ms.date: 01/30/2018
ms.topic: hero-article
ms.service: event-grid
---
# Create and route custom events with Azure PowerShell and Event Grid

Azure Event Grid is an eventing service for the cloud. In this article, you use the Azure PowerShell to create a custom topic, subscribe to the topic, and trigger the event to view the result. Typically, you send events to an endpoint that responds to the event, such as, a webhook or Azure Function. However, to simplify this article, you send the events to a URL that merely collects the messages. You create this URL by using third-party tools from either [RequestBin](https://requestb.in/) or [Hookbin](https://hookbin.com/).

>[!NOTE]
>**RequestBin** and **Hookbin** are not intended for high throughput usage. The use of these tools is purely demonstrative. If you push more than one event at a time, you might not see all of your events in the tool.

When you are finished, you see that the event data has been sent to an endpoint.

![Event data](./media/custom-event-quickstart-powershell/request-result.png)

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

This article requires that you are running the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

## Create a resource group

Event Grid topics are Azure resources, and must be placed in an Azure resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command.

The following example creates a resource group named *gridResourceGroup* in the *westus2* location.

```powershell
New-AzureRmResourceGroup -Name gridResourceGroup -Location westus2
```

## Create a custom topic

A topic provides a user-defined endpoint that you post your events to. The following example creates the topic in your resource group. Replace `<topic_name>` with a unique name for your topic. The topic name must be unique because it is represented by a DNS entry.

```powershell
New-AzureRmEventGridTopic -ResourceGroupName gridResourceGroup -Location westus2 -Name <topic_name>
```

## Create a message endpoint

Before subscribing to the topic, let's create the endpoint for the event message. Rather than write code to respond to the event, let's create an endpoint that collects the messages so you can view them. RequestBin and Hookbin are third-party tools that enable you to create an endpoint, and view requests that are sent to it. Go to [RequestBin](https://requestb.in/), and click **Create a RequestBin**, or go to [Hookbin](https://hookbin.com/) and click **Create New Endpoint**.  Copy the bin URL, because you need it when subscribing to the topic.

## Subscribe to a topic

You subscribe to a topic to tell Event Grid which events you want to track. The following example subscribes to the topic you created, and passes the URL from RequestBin or Hookbin as the endpoint for event notification. Replace `<event_subscription_name>` with a unique name for your subscription, and `<endpoint_URL>` with the value from the preceding section. By specifying an endpoint when subscribing, Event Grid handles the routing of events to that endpoint. For `<topic_name>`, use the value you created earlier.

```powershell
New-AzureRmEventGridSubscription -EventSubscriptionName <event_subscription_name> -Endpoint <endpoint_URL> -ResourceGroupName gridResourceGroup -TopicName <topic_name>
```

## Send an event to your topic

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint. First, let's get the URL and key for the topic. Again, use your topic name for `<topic_name>`.

```powershell
$endpoint = (Get-AzureRmEventGridTopic -ResourceGroupName gridResourceGroup -Name <topic-name>).Endpoint
$keys = Get-AzureRmEventGridTopicKey -ResourceGroupName gridResourceGroup -Name <topic-name>
```

To simplify this article, let's set up sample event data to send to the topic. Typically, an application or Azure service would send the event data. The following example uses Hashtable to construct the event's data `htbody` and then coverts it to well-formed JSON payload object `$body`:

```powershell
$eventID = Get-Random 99999

#Date format should be SortableDateTimePattern (ISO 8601)
$eventDate = Get-Date -Format s

#Construct body using Hashtable
$htbody = @{
    id= $eventID
    eventType="recordInserted"
    subject="myapp/vehicles/motorcycles"
    eventTime= $eventDate   
    data= @{
        make="Ducati"
        model="Monster"
    }
    dataVersion="1.0"
}

#Use ConvertTo-Json to convert event body from Hashtable to JSON Object
#Append square brackets to the converted JSON payload since they are expected in the event's JSON payload syntax
$body = "["+(ConvertTo-Json $htbody)+"]"
```

If you view `$body`, you see the full event. The `data` element of the JSON is the payload of your event. Any well-formed JSON can go in this field. You can also use the subject field for advanced routing and filtering.

Now, send the event to your topic.

```powershell
Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
```

You have triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. Browse to the endpoint URL that you created earlier. Or, click refresh in your open browser. You see the event you just sent.

```json
[{
  "id": "1807",
  "eventType": "recordInserted",
  "subject": "myapp/vehicles/motorcycles",
  "eventTime": "2018-01-25T15:58:13",
  "data": {
    "make": "Ducati",
    "model": "Monster"
  },
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/topics/{topic}"
}]
```

## Clean up resources

If you plan to continue working with this event, do not clean up the resources created in this article. If you do not plan to continue, use the following command to delete the resources you created in this article.

```powershell
Remove-AzureRmResourceGroup -Name gridResourceGroup
```

## Next steps

Now that you know how to create topics and event subscriptions, learn more about what Event Grid can help you do:

- [About Event Grid](overview.md)
- [Route Blob storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
- [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md)
- [Stream big data into a data warehouse](event-grid-event-hubs-integration.md)
