---
title: How to filter events for Azure Event Grid
description: Shows how to create Azure Event Grid subscriptions that filter events.
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: tomfitz
---

# Filter events for Event Grid

This article shows how to filter events when creating an Event Grid subscription. To learn about the options for event filtering, see [Understand event filtering for Event Grid subscriptions](event-filtering.md).

## Filter by event type

When creating an Event Grid subscription, you can specify which [event types](event-schema.md) to send to the endpoint. The examples in this section create event subscriptions for a resource group but limit the events that are sent to `Microsoft.Resources.ResourceWriteFailure` and `Microsoft.Resources.ResourceWriteSuccess`. If you need more flexibility when filtering events by event types, see [Filter by advanced operators and data fields](#filter-by-advanced-operators-and-data-fields).

For PowerShell, use the `-IncludedEventType` parameter when creating the subscription.

```powershell
$includedEventTypes = "Microsoft.Resources.ResourceWriteFailure", "Microsoft.Resources.ResourceWriteSuccess"

New-AzureRmEventGridSubscription `
  -EventSubscriptionName demoSubToResourceGroup `
  -ResourceGroupName myResourceGroup `
  -Endpoint <endpoint-URL> `
  -IncludedEventType $includedEventTypes
```

For Azure CLI, use the `--included-event-types` parameter. The following example uses Azure CLI in a Bash shell:

```azurecli
includedEventTypes="Microsoft.Resources.ResourceWriteFailure Microsoft.Resources.ResourceWriteSuccess"

az eventgrid event-subscription create \
  --name demoSubToResourceGroup \
  --resource-group myResourceGroup \
  --endpoint <endpoint-URL> \
  --included-event-types $includedEventTypes
```

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

## Filter by subject

You can filter events by the subject in the event data. You can specify a value to match for the beginning or end of the subject. If you need more flexibility when filtering events by subject, see [Filter by advanced operators and data fields](#filter-by-advanced-operators-and-data-fields).

In the following PowerShell example, you create an event subscription that filters by the beginning of the subject. You use the `-SubjectBeginsWith` parameter to limit events to ones for a specific resource. You pass the resource ID of a network security group.

```powershell
$resourceId = (Get-AzureRmResource -ResourceName demoSecurityGroup -ResourceGroupName myResourceGroup).ResourceId

New-AzureRmEventGridSubscription `
  -Endpoint <endpoint-URL> `
  -EventSubscriptionName demoSubscriptionToResourceGroup `
  -ResourceGroupName myResourceGroup `
  -SubjectBeginsWith $resourceId
```

The next PowerShell example creates a subscription for a blob storage. It limits events to ones with a subject that ends in `.jpg`.

```powershell
$storageId = (Get-AzureRmStorageAccount -ResourceGroupName myResourceGroup -AccountName $storageName).Id

New-AzureRmEventGridSubscription `
  -EventSubscriptionName demoSubToStorage `
  -Endpoint <endpoint-URL> `
  -ResourceId $storageId `
  -SubjectEndsWith ".jpg"
```

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

## Filter by operators and data

To use advanced filtering, you must install a preview extension for Azure CLI. You can use [CloudShell](/azure/cloud-shell/quickstart) or install Azure CLI locally.

### Install extension

In CloudShell:

* If you've installed the extension previously, update it `az extension update -n eventgrid`
* If you haven't installed the extension previously, install it `az extension add -n eventgrid`

For a local installation:

1. Uninstall Azure CLI locally.
1. Install the [latest version](/cli/azure/install-azure-cli) of Azure CLI.
1. Launch command window.
1. Uninstall previous versions of the extension `az extension remove -n eventgrid`
1. Install the extension `az extension add -n eventgrid`

You're now ready to use advanced filtering.

### Subscribe with advanced filters

To learn about the operators and keys that you can use for advanced filtering, see [Advanced filtering](event-filtering.md#advanced-filtering).

The following example creates a custom topic. It subscribes to the custom topic and filters by a value in the data object. Events that have the color property set to blue, red, or green are sent to the subscription.

```azurecli-interactive
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
  --expiration-date "2018-11-30"
```

Notice an expiration date is set for the subscription. The event subscription is automatically expired after that date. Set an expiration for event subscriptions that are only needed for a limited time.

### Test filter

To test the filter, send an event with the color field set to green.

```azurecli-interactive
topicEndpoint=$(az eventgrid topic show --name $topicName -g gridResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name $topicName -g gridResourceGroup --query "key1" --output tsv)

event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/cars", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "model": "SUV", "color": "green"},"dataVersion": "1.0"} ]'

curl -X POST -H "aeg-sas-key: $key" -d "$event" $topicEndpoint
```

The event is sent to your endpoint.

To test a scenario where the event isn't sent, send an event with the color field set to yellow.

```azurecli-interactive
event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/cars", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "model": "SUV", "color": "yellow"},"dataVersion": "1.0"} ]'

curl -X POST -H "aeg-sas-key: $key" -d "$event" $topicEndpoint
```

Yellow isn't one of the values specified in the subscription, so the event isn't delivered to your subscription.

## Next steps

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
