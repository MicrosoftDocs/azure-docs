---
title: Subscribe to Azure Kubernetes Service events with Azure Event Grid
description: Use Azure Event Grid to subscribe to Azure Kubernetes Service events
ms.topic: article
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 06/22/2023
---

# Quickstart: Subscribe to Azure Kubernetes Service (AKS) events with Azure Event Grid

Azure Event Grid is a fully managed event routing service that provides uniform event consumption using a publish-subscribe model.

In this quickstart, you create an AKS cluster and subscribe to AKS events.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install] installed.

> [!NOTE]
> In case there are issues specifically with EventGrid notifications, as can be seen here [Service Outages](https://azure.status.microsoft/status), please note that AKS operations wont be impacted and they are independent of Event Grid outages. 

## Create an AKS cluster

### [Azure CLI](#tab/azure-cli)

Create an AKS cluster using the [`az aks create`][az-aks-create] command. The following example creates a resource group *MyResourceGroup* and a cluster named *MyAKS* with one node in the *MyResourceGroup* resource group:

```azurecli-interactive
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus  --node-count 1 --generate-ssh-keys
```

### [Azure PowerShell](#tab/azure-powershell)

Create an AKS cluster using the [`New-AzAksCluster`][new-azakscluster] command. The following example creates a resource group *MyResourceGroup* and a cluster named *MyAKS* with one node in the *MyResourceGroup* resource group:

```azurepowershell-interactive
New-AzResourceGroup -Name MyResourceGroup -Location eastus
New-AzAksCluster -ResourceGroupName MyResourceGroup -Name MyAKS -Location eastus -NodeCount 1 -GenerateSshKey
```

---

## Subscribe to AKS events

### [Azure CLI](#tab/azure-cli)

Create a namespace and event hub using [`az eventhubs namespace create`][az-eventhubs-namespace-create] and [`az eventhubs eventhub create`][az-eventhubs-eventhub-create]. The following example creates a namespace *MyNamespace* and an event hub *MyEventGridHub* in *MyNamespace*, both in the *MyResourceGroup* resource group.

```azurecli-interactive
az eventhubs namespace create --location eastus --name MyNamespace -g MyResourceGroup
az eventhubs eventhub create --name MyEventGridHub --namespace-name MyNamespace -g MyResourceGroup
```

> [!NOTE]
> The *name* of your namespace must be unique.

Subscribe to the AKS events using [`az eventgrid event-subscription create`][az-eventgrid-event-subscription-create]:

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
        "Microsoft.ContainerService.NewKubernetesVersionAvailable","Microsoft.ContainerService.ClusterSupportEnded","Microsoft.ContainerService.ClusterSupportEnding","Microsoft.ContainerService.NodePoolRollingFailed","Microsoft.ContainerService.NodePoolRollingStarted","Microsoft.ContainerService.NodePoolRollingSucceeded"
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

When AKS events occur, you see those events appear in your event hub. For example, when the list of available Kubernetes versions for your clusters changes, you see a `Microsoft.ContainerService.NewKubernetesVersionAvailable` event. There are also new events available now for upgrades and cluster within support. For more information on the events AKS emits, see [Azure Kubernetes Service (AKS) as an Event Grid source][aks-events].

## Delete the cluster and subscriptions

### [Azure CLI](#tab/azure-cli)

Use the [az group delete][az-group-delete] command to remove the resource group, the AKS cluster, namespace, and event hub, and all related resources.

```azurecli-interactive
az group delete --name MyResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [`Remove-AzResourceGroup`][remove-azresourcegroup] cmdlet to remove the resource group, the AKS cluster, namespace, and event hub, and all related resources.

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
[az-group-delete]: /cli/azure/group#az_group_delete
[sp-delete]: kubernetes-service-principal.md#other-considerations
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
