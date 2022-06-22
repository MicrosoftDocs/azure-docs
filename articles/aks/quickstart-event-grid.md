---
title: Subscribe to Azure Kubernetes Service events with Azure Event Grid  (Preview)
description: Use Azure Event Grid to subscribe to Azure Kubernetes Service events
services: container-service
author: zr-msft
ms.topic: article
ms.date: 07/12/2021
ms.author: zarhoads
---

# Quickstart: Subscribe to Azure Kubernetes Service (AKS) events with Azure Event Grid (Preview)

Azure Event Grid is a fully managed event routing service that provides uniform event consumption using a publish-subscribe model.

In this quickstart, you'll create an AKS cluster and subscribe to AKS events.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install] installed.

### Register the `EventgridPreview` preview feature

To use the feature, you must also enable the `EventgridPreview` feature flag on your subscription.

### [Azure CLI](#tab/azure-cli)

Register the `EventgridPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EventgridPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EventgridPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

[!INCLUDE [event-grid-register-provider-cli.md](../../includes/event-grid-register-provider-cli.md)]

### [Azure PowerShell](#tab/azure-powershell)

Register the `EventgridPreview` feature flag by using the [Register-AzProviderPreviewFeature][register-azproviderpreviewfeature] cmdlet, as shown in the following example:

```azurepowershell-interactive
Register-AzProviderPreviewFeature -ProviderNamespace Microsoft.ContainerService -Name EventgridPreview
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [Get-AzProviderPreviewFeature][get-azproviderpreviewfeature] cmdlet:

```azurepowershell-interactive
Get-AzProviderPreviewFeature -ProviderNamespace Microsoft.ContainerService -Name EventgridPreview |
 Format-Table -Property Name, @{name='State'; expression={$_.Properties.State}}
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [Register-AzResourceProvider][register-azresourceprovider] command:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerService
```

[!INCLUDE [event-grid-register-provider-powershell.md](../../includes/event-grid-register-provider-powershell.md)]

---

## Create an AKS cluster

### [Azure CLI](#tab/azure-cli)

Create an AKS cluster using the [az aks create][az-aks-create] command. The following example creates a resource group *MyResourceGroup* and a cluster named *MyAKS* with one node in the *MyResourceGroup* resource group:

```azurecli-interactive
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus  --node-count 1 --generate-ssh-keys
```

### [Azure PowerShell](#tab/azure-powershell)

Create an AKS cluster using the [New-AzAksCluster][new-azakscluster] command. The following example creates a resource group *MyResourceGroup* and a cluster named *MyAKS* with one node in the *MyResourceGroup* resource group:

```azurepowershell-interactive
New-AzResourceGroup -Name MyResourceGroup -Location eastus
New-AzAksCluster -ResourceGroupName MyResourceGroup -Name MyAKS -Location eastus -NodeCount 1 -GenerateSshKey
```

---

## Subscribe to AKS events

### [Azure CLI](#tab/azure-cli)

Create a namespace and event hub using [az eventhubs namespace create][az-eventhubs-namespace-create] and [az eventhubs eventhub create][az-eventhubs-eventhub-create]. The following example creates a namespace *MyNamespace* and an event hub *MyEventGridHub* in *MyNamespace*, both in the *MyResourceGroup* resource group.

```azurecli-interactive
az eventhubs namespace create --location eastus --name MyNamespace -g MyResourceGroup
az eventhubs eventhub create --name MyEventGridHub --namespace-name MyNamespace -g MyResourceGroup
```

> [!NOTE]
> The *name* of your namespace must be unique.

Subscribe to the AKS events using [az eventgrid event-subscription create][az-eventgrid-event-subscription-create]:

```azurecli-interactive
SOURCE_RESOURCE_ID=$(az aks show -g MyResourceGroup -n MyAKS --query id --output tsv)
ENDPOINT=$(az eventhubs eventhub show -g MyResourceGroup -n MyEventGridHub --namespace-name MyNamespace --query id --output tsv)
az eventgrid event-subscription create --name MyEventGridSubscription \
--source-resource-id $SOURCE_RESOURCE_ID \
--endpoint-type eventhub \
--endpoint $ENDPOINT
```

Verify your subscription to AKS events using `az eventgrid event-subscription list`:

```azurecli-interactive
az eventgrid event-subscription list --source-resource-id $SOURCE_RESOURCE_ID
```

The following example output shows you're subscribed to events from the *MyAKS* cluster and those events are delivered to the *MyEventGridHub* event hub:

```output
[
  {
    "deadLetterDestination": null,
    "deadLetterWithResourceIdentity": null,
    "deliveryWithResourceIdentity": null,
    "destination": {
      "deliveryAttributeMappings": null,
      "endpointType": "EventHub",
      "resourceId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNamespace/eventhubs/MyEventGridHub"
    },
    "eventDeliverySchema": "EventGridSchema",
    "expirationTimeUtc": null,
    "filter": {
      "advancedFilters": null,
      "enableAdvancedFilteringOnArrays": null,
      "includedEventTypes": [
        "Microsoft.ContainerService.NewKubernetesVersionAvailable"
      ],
      "isSubjectCaseSensitive": null,
      "subjectBeginsWith": "",
      "subjectEndsWith": ""
    },
    "id": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/MyAKS/providers/Microsoft.EventGrid/eventSubscriptions/MyEventGridSubscription",
    "labels": null,
    "name": "MyEventGridSubscription",
    "provisioningState": "Succeeded",
    "resourceGroup": "MyResourceGroup",
    "retryPolicy": {
      "eventTimeToLiveInMinutes": 1440,
      "maxDeliveryAttempts": 30
    },
    "systemData": null,
    "topic": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/MyResourceGroup/providers/microsoft.containerservice/managedclusters/MyAKS",
    "type": "Microsoft.EventGrid/eventSubscriptions"
  }
]
```

### [Azure PowerShell](#tab/azure-powershell)

Create a namespace and event hub using [New-AzEventHubNamespace][new-azeventhubnamespace] and [New-AzEventHub][new-azeventhub]. The following example creates a namespace *MyNamespace* and an event hub *MyEventGridHub* in *MyNamespace*, both in the *MyResourceGroup* resource group.

```azurepowershell-interactive
New-AzEventHubNamespace -Location eastus -Name MyNamespace -ResourceGroupName MyResourceGroup
New-AzEventHub -Name MyEventGridHub -Namespace MyNamespace -ResourceGroupName MyResourceGroup
```

> [!NOTE]
> The *name* of your namespace must be unique.

Subscribe to the AKS events using [New-AzEventGridSubscription][new-azeventgridsubscription]:

```azurepowershell-interactive
$SOURCE_RESOURCE_ID = (Get-AzAksCluster -ResourceGroupName MyResourceGroup -Name MyAKS).Id
$ENDPOINT = (Get-AzEventHub -ResourceGroupName MyResourceGroup -EventHubName MyEventGridHub -Namespace MyNamespace).Id
$params = @{
    EventSubscriptionName = 'MyEventGridSubscription'
    ResourceId            = $SOURCE_RESOURCE_ID
    EndpointType          = 'eventhub'
    Endpoint              = $ENDPOINT 
}
New-AzEventGridSubscription @params
```

Verify your subscription to AKS events using `Get-AzEventGridSubscription`:

```azurepowershell-interactive
Get-AzEventGridSubscription -ResourceId $SOURCE_RESOURCE_ID | Select-Object -ExpandProperty PSEventSubscriptionsList
```

The following example output shows you're subscribed to events from the *MyAKS* cluster and those events are delivered to the *MyEventGridHub* event hub:

```Output
EventSubscriptionName : MyEventGridSubscription
Id                    : /subscriptions/SUBSCRIPTION_ID/resourceGroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/MyAKS/providers/Microsoft.EventGrid/eventSubscriptions/MyEventGridSubscription
Type                  : Microsoft.EventGrid/eventSubscriptions
Topic                 : /subscriptions/SUBSCRIPTION_ID/resourceGroups/myresourcegroup/providers/microsoft.containerservice/managedclusters/myaks
Filter                : Microsoft.Azure.Management.EventGrid.Models.EventSubscriptionFilter
Destination           : Microsoft.Azure.Management.EventGrid.Models.EventHubEventSubscriptionDestination
ProvisioningState     : Succeeded
Labels                : 
EventTtl              : 1440
MaxDeliveryAttempt    : 30
EventDeliverySchema   : EventGridSchema
ExpirationDate        : 
DeadLetterEndpoint    : 
Endpoint              : /subscriptions/SUBSCRIPTION_ID/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNamespace/eventhubs/MyEventGridHub
```

---

When AKS events occur, you'll see those events appear in your event hub. For example, when the list of available Kubernetes versions for your clusters changes, you'll see a `Microsoft.ContainerService.NewKubernetesVersionAvailable` event. For more information on the events AKS emits, see [Azure Kubernetes Service (AKS) as an Event Grid source][aks-events].

## Delete the cluster and subscriptions

### [Azure CLI](#tab/azure-cli)

Use the [az group delete][az-group-delete] command to remove the resource group, the AKS cluster, namespace, and event hub, and all related resources.

```azurecli-interactive
az group delete --name MyResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, the AKS cluster, namespace, and event hub, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```

---

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete].
> 
> If you used a managed identity, the identity is managed by the platform and does not require removal.

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then subscribed to AKS events in Azure Event Hubs.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[aks-events]: ../event-grid/event-schema-aks.md
[aks-tutorial]: ./tutorial-kubernetes-prepare-app.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[az-eventhubs-namespace-create]: /cli/azure/eventhubs/namespace#az-eventhubs-namespace-create
[new-azeventhubnamespace]: /powershell/module/az.eventhub/new-azeventhubnamespace
[az-eventhubs-eventhub-create]: /cli/azure/eventhubs/eventhub#az-eventhubs-eventhub-create
[new-azeventhub]: /powershell/module/az.eventhub/new-azeventhub
[az-eventgrid-event-subscription-create]: /cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create
[new-azeventgridsubscription]: /powershell/module/az.eventgrid/new-azeventgridsubscription
[az-feature-register]: /cli/azure/feature#az_feature_register
[register-azproviderpreviewfeature]: /powershell/module/az.resources/register-azproviderpreviewfeature
[az-feature-list]: /cli/azure/feature#az_feature_list
[get-azproviderpreviewfeature]: /powershell/module/az.resources/get-azproviderpreviewfeature
[az-provider-register]: /cli/azure/provider#az_provider_register
[register-azresourceprovider]: /powershell/module/az.resources/register-azresourceprovider
[az-group-delete]: /cli/azure/group#az_group_delete
[sp-delete]: kubernetes-service-principal.md#other-considerations
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
