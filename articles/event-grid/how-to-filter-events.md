---
title: How to filter events for Azure Event Grid
description: This article shows how to filter events (by event type, by subject, by operators and data, etc.) when creating an Event Grid subscription. 
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 09/25/2023
---

# Filter events for Event Grid

This article shows how to filter events when creating an Event Grid subscription. To learn about the options for event filtering, see [Understand event filtering for Event Grid subscriptions](event-filtering.md).

## Filter by event type

When creating an Event Grid subscription, you can specify which [event types](event-schema.md) to send to the endpoint. The examples in this section create event subscriptions for a resource group but limit the events that are sent to `Microsoft.Resources.ResourceWriteFailure` and `Microsoft.Resources.ResourceWriteSuccess`. If you need more flexibility when filtering events by event types, see [Filter by operators and data](#filter-by-operators-and-data).

### Azure PowerShell
For PowerShell, use the `-IncludedEventType` parameter when creating the subscription.

```powershell
$includedEventTypes = "Microsoft.Resources.ResourceWriteFailure", "Microsoft.Resources.ResourceWriteSuccess"

New-AzEventGridSubscription `
  -EventSubscriptionName demoSubToResourceGroup `
  -ResourceGroupName myResourceGroup `
  -Endpoint <endpoint-URL> `
  -IncludedEventType $includedEventTypes
```

### Azure CLI
For Azure CLI, use the `--included-event-types` parameter. The following example uses Azure CLI in a Bash shell:

```azurecli
includedEventTypes="Microsoft.Resources.ResourceWriteFailure Microsoft.Resources.ResourceWriteSuccess"

az eventgrid event-subscription create \
  --name demoSubToResourceGroup \
  --resource-group myResourceGroup \
  --endpoint <endpoint-URL> \
  --included-event-types $includedEventTypes
```

### Azure portal

While creating an event subscription to a **system topic**, use the drop-down list to select the event types as shown in the following image. 

:::image type="content" source="./media/how-to-filter-events/filter-create-subscription-system-topic.png" alt-text="Screenshot showing the Create Subscription page with event types selected.":::

For an existing subscription to a system topic, use the **Filters** tab of the **Event Subscription** page as shown in the following image. 

:::image type="content" source="./media/how-to-filter-events/filter-existing-subscription-system-topic.png" alt-text="Screenshot showing the Event Subscription page with the Filters tab selected.":::

You can specify filters while creating a **custom topic** by selecting **Add Event Type** link as shown in the following image.

:::image type="content" source="./media/how-to-filter-events/custom-topic-subscription-create-filter.png" alt-text="Screenshot showing the Create Event Subscription page for a custom topic.":::

To specify a filter for an existing subscription to a custom topic, use the **Filters** tab in the **Event Subscription** page. 

:::image type="content" source="./media/how-to-filter-events/add-event-type-button.png" alt-text="Screenshot of the Event Subscription page with Add Event Type button selected.":::    
      
### Azure Resource Manager template
For a Resource Manager template, use the `includedEventTypes` property.

```json
"resources": [
  {
    "type": "Microsoft.EventGrid/eventSubscriptions",
    "name": "[parameters('eventSubName')]",
    "apiVersion": "2018-09-15-preview",
    "properties": {
      "destination": {
        "endpointType": "WebHook",
        "properties": {
          "endpointUrl": "[parameters('endpoint')]"
        }
      },
      "filter": {
        "subjectBeginsWith": "",
        "subjectEndsWith": "",
        "isSubjectCaseSensitive": false,
        "includedEventTypes": [
          "Microsoft.Resources.ResourceWriteFailure",
          "Microsoft.Resources.ResourceWriteSuccess"
        ]
      }
    }
  }
]
```

> [!NOTE]
> To learn more about these filters (event types, subject, and advanced), see [Understand event filtering for Event Grid subscriptions](event-filtering.md). 

## Filter by subject

You can filter events by the subject in the event data. You can specify a value to match for the beginning or end of the subject. If you need more flexibility when filtering events by subject, see [Filter by operators and data](#filter-by-operators-and-data).

In the following PowerShell example, you create an event subscription that filters by the beginning of the subject. You use the `-SubjectBeginsWith` parameter to limit events to ones for a specific resource. You pass the resource ID of a network security group.

### Azure PowerShell
```powershell
$resourceId = (Get-AzResource -ResourceName demoSecurityGroup -ResourceGroupName myResourceGroup).ResourceId

New-AzEventGridSubscription `
  -Endpoint <endpoint-URL> `
  -EventSubscriptionName demoSubscriptionToResourceGroup `
  -ResourceGroupName myResourceGroup `
  -SubjectBeginsWith $resourceId
```

The next PowerShell example creates a subscription for a blob storage. It limits events to ones with a subject that ends in `.jpg`.

```powershell
$storageId = (Get-AzStorageAccount -ResourceGroupName myResourceGroup -AccountName $storageName).Id

New-AzEventGridSubscription `
  -EventSubscriptionName demoSubToStorage `
  -Endpoint <endpoint-URL> `
  -ResourceId $storageId `
  -SubjectEndsWith ".jpg"
```

### Azure CLI
In the following Azure CLI example, you create an event subscription that filters by the beginning of the subject. You use the `--subject-begins-with` parameter to limit events to ones for a specific resource. You pass the resource ID of a network security group.

```azurecli
resourceId=$(az resource show --name demoSecurityGroup --resource-group myResourceGroup --resource-type Microsoft.Network/networkSecurityGroups --query id --output tsv)

az eventgrid event-subscription create \
  --name demoSubscriptionToResourceGroup \
  --resource-group myResourceGroup \
  --endpoint <endpoint-URL> \
  --subject-begins-with $resourceId
```

The next Azure CLI example creates a subscription for a blob storage. It limits events to ones with a subject that ends in `.jpg`.

```azurecli
storageid=$(az storage account show --name $storageName --resource-group myResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --resource-id $storageid \
  --name demoSubToStorage \
  --endpoint <endpoint-URL> \
  --subject-ends-with ".jpg"
```

### Azure portal

For an existing event subscription: 

1. On the **Event Subscription** page, select **Enable subject filtering**. 
1. Enter values for one or more of the following fields: **Subject begins with** and **Subject ends with**. In the following options both options are selected. 

    :::image type="content" source="./media/how-to-filter-events/subject-filter-example.png" alt-text="Screenshot of Event Subscription page with subject filtering example.":::
1. Select **Case-sensitive subject matching** option if you want the subject of the event to match the case of the filters specified. 

When creating an event subscription, use the **Filters** tab on the creation wizard. 

:::image type="content" source="./media/how-to-filter-events/create-subscription-custom-topic-subject-filter.png" alt-text="Screenshot of Create Event Subscription page with the Filters tab selected.":::


### Azure Resource Manager template
In the following Resource Manager template example, you create an event subscription that filters by the beginning of the subject. You use the `subjectBeginsWith` property to limit events to ones for a specific resource. You pass the resource ID of a network security group.

```json
"resources": [
  {
    "type": "Microsoft.EventGrid/eventSubscriptions",
    "name": "[parameters('eventSubName')]",
    "apiVersion": "2018-09-15-preview",
    "properties": {
      "destination": {
        "endpointType": "WebHook",
        "properties": {
          "endpointUrl": "[parameters('endpoint')]"
        }
      },
      "filter": {
        "subjectBeginsWith": "[resourceId('Microsoft.Network/networkSecurityGroups','demoSecurityGroup')]",
        "subjectEndsWith": "",
        "isSubjectCaseSensitive": false,
        "includedEventTypes": [ "All" ]
      }
    }
  }
]
```

The next Resource Manager template example creates a subscription for a blob storage. It limits events to ones with a subject that ends in `.jpg`.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts/providers/eventSubscriptions",
    "name": "[concat(parameters('storageName'), '/Microsoft.EventGrid/', parameters('eventSubName'))]",
    "apiVersion": "2018-09-15-preview",
    "properties": {
      "destination": {
        "endpointType": "WebHook",
        "properties": {
          "endpointUrl": "[parameters('endpoint')]"
        }
      },
      "filter": {
        "subjectEndsWith": ".jpg",
        "subjectBeginsWith": "",
        "isSubjectCaseSensitive": false,
        "includedEventTypes": [ "All" ]
      }
    }
  }
]
```

> [!NOTE]
> To learn more about these filters (event types, subject, and advanced), see [Understand event filtering for Event Grid subscriptions](event-filtering.md). 

## Filter by operators and data

For more flexibility in filtering, you can use operators and data properties to filter events.

### Subscribe with advanced filters

To learn about the operators and keys that you can use for advanced filtering, see [Advanced filtering](event-filtering.md#advanced-filtering).

These examples create a custom topic. They subscribe to the custom topic and filter by a value in the data object. Events that have the color property set to blue, red, or green are sent to the subscription.

### Azure PowerShell

For PowerShell, use:

```powershell
$topicName = <your-topic-name>
$endpointURL = <endpoint-URL>

New-AzResourceGroup -Name gridResourceGroup -Location eastus2
New-AzEventGridTopic -ResourceGroupName gridResourceGroup -Location eastus2 -Name $topicName

$topicid = (Get-AzEventGridTopic -ResourceGroupName gridResourceGroup -Name $topicName).Id

$expDate = '<mm/dd/yyyy hh:mm:ss>' | Get-Date
$AdvFilter1=@{operator="StringIn"; key="Data.color"; Values=@('blue', 'red', 'green')}

New-AzEventGridSubscription `
  -ResourceId $topicid `
  -EventSubscriptionName <event_subscription_name> `
  -Endpoint $endpointURL `
  -ExpirationDate $expDate `
  -AdvancedFilter @($AdvFilter1)
```

### Azure CLI

For Azure CLI, use:

```azurecli
topicName=<your-topic-name>
endpointURL=<endpoint-URL>

az group create -n gridResourceGroup -l eastus2
az eventgrid topic create --name $topicName -l eastus2 -g gridResourceGroup

topicid=$(az eventgrid topic show --name $topicName -g gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --source-resource-id $topicid \
  -n demoAdvancedSub \
  --advanced-filter data.color stringin blue red green \
  --endpoint $endpointURL \
  --expiration-date "<yyyy-mm-dd>"
```

Notice that an [expiration date](concepts.md#event-subscription-expiration) is set for the subscription.


### Azure portal

1. On the **Event Subscription** page, select **Add new filter** in the **ADVANCED FILTERS** section. 

    :::image type="content" source="./media/how-to-filter-events/add-new-filter-button.png" alt-text="Screenshot showing the Event Subscription page with Add new filter link highlighted.":::    
2. Specify a key, operator, and value or values to compared. In the following example, **data.color** is used as a key, **String is in** as an operator, and **blue**, **red**, and **green** values are specified for values. 

    :::image type="content" source="./media/how-to-filter-events/advanced-filter-example.png" alt-text="Screenshot showing an example of an advanced filter."::: 

    > [!NOTE]
    > To learn more about advanced filters, see [Understand event filtering for Event Grid subscriptions](event-filtering.md). 


### Test the filter
To test the filter, send an event with the color field set to green. Because green is one of the values in the filter, the event is delivered to the endpoint.

### Azure PowerShell
For PowerShell, use:

```powershell
$endpoint = (Get-AzEventGridTopic -ResourceGroupName gridResourceGroup -Name $topicName).Endpoint
$keys = Get-AzEventGridTopicKey -ResourceGroupName gridResourceGroup -Name $topicName

$eventID = Get-Random 99999
$eventDate = Get-Date -Format s

$htbody = @{
    id= $eventID
    eventType="recordInserted"
    subject="myapp/vehicles/cars"
    eventTime= $eventDate
    data= @{
        model="SUV"
        color="green"
    }
    dataVersion="1.0"
}

$body = "["+(ConvertTo-Json $htbody)+"]"

Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
```

To test a scenario where the event isn't sent, send an event with the color field set to yellow. Yellow isn't one of the values specified in the subscription, so the event isn't delivered to your subscription.

```powershell
$htbody = @{
    id= $eventID
    eventType="recordInserted"
    subject="myapp/vehicles/cars"
    eventTime= $eventDate
    data= @{
        model="SUV"
        color="yellow"
    }
    dataVersion="1.0"
}

$body = "["+(ConvertTo-Json $htbody)+"]"

Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
```


### Azure CLI
For Azure CLI, use:

```azurecli
topicEndpoint=$(az eventgrid topic show --name $topicName -g gridResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name $topicName -g gridResourceGroup --query "key1" --output tsv)

event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/cars", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "model": "SUV", "color": "green"},"dataVersion": "1.0"} ]'

curl -X POST -H "aeg-sas-key: $key" -d "$event" $topicEndpoint
```

To test a scenario where the event isn't sent, send an event with the color field set to yellow. Yellow isn't one of the values specified in the subscription, so the event isn't delivered to your subscription.

For Azure CLI, use:

```azurecli
event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/cars", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "model": "SUV", "color": "yellow"},"dataVersion": "1.0"} ]'

curl -X POST -H "aeg-sas-key: $key" -d "$event" $topicEndpoint
```

## Next steps
To learn more about filters (event types, subject, and advanced), see [Understand event filtering for Event Grid subscriptions](event-filtering.md). 
