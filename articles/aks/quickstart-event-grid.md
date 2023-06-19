---
title: Subscribe to Azure Kubernetes Service (AKS) events with Azure Event Grid
description: Learn how to use Azure Event Grid to subscribe to Azure Kubernetes Service (AKS) events.
ms.topic: article
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 06/16/2023
---

# Quickstart: Subscribe to Azure Kubernetes Service (AKS) events with Azure Event Grid

Azure Event Grid is a fully managed event routing service that provides uniform event consumption using a publish-subscribe model.

In this quickstart, you create an Azure Kubernetes Service (AKS) cluster and subscribe to AKS events with Azure Event Grid.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install] installed.

## Create an AKS cluster

### [Azure CLI](#tab/azure-cli)

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --location eastus --node-count 1 --generate-ssh-keys
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Create an Azure resource group using the [`New-AzResourceGroup`][new-azresourcegroup] cmdlet.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name myResourceGroup -Location eastus
    ```

2. Create an AKS cluster using the [`New-AzAksCluster`][new-azakscluster] cmdlet.

    ```azurepowershell-interactive
    New-AzAksCluster -ResourceGroupName MyResourceGroup -Name MyAKS -Location eastus -NodeCount 1 -GenerateSshKey
    ```

---

## Subscribe to AKS events

### [Azure CLI](#tab/azure-cli)

1. Create a namespace using the [`az eventhubs namespace create`][az-eventhubs-namespace-create] command. Your namespace name must be unique.

    ```azurecli-interactive
    az eventhubs namespace create --location eastus --name myNamespace -g myResourceGroup
    ```

2. Create an event hub using the [`az eventhubs eventhub create`][az-eventhubs-eventhub-create] command.

    ```azurecli-interactive
    az eventhubs eventhub create --name myEventGridHub --namespace-name myNamespace -g myResourceGroup
    ```

3. Subscribe to the AKS events using the [`az eventgrid event-subscription create`][az-eventgrid-event-subscription-create] command.

    ```azurecli-interactive
    SOURCE_RESOURCE_ID=$(az aks show -g MyResourceGroup -n MyAKS --query id --output tsv)

    ENDPOINT=$(az eventhubs eventhub show -g MyResourceGroup -n MyEventGridHub --namespace-name MyNamespace --query id --output tsv)

    az eventgrid event-subscription create --name MyEventGridSubscription \
    --source-resource-id $SOURCE_RESOURCE_ID \
    --endpoint-type eventhub \
    --endpoint $ENDPOINT
    ```

4. Verify your subscription to AKS events using the [`az eventgrid event-subscription list`][az-eventgrid-event-subscription-list] command.

    ```azurecli-interactive
    az eventgrid event-subscription list --source-resource-id $SOURCE_RESOURCE_ID
    ```

    The following example output shows you're subscribed to events from the `myManagedCluster` cluster and those events are delivered to the `myEventGridHub` event hub:

    ```output
    [
      {
        "deadLetterDestination": null,
        "deadLetterWithResourceIdentity": null,
        "deliveryWithResourceIdentity": null,
        "destination": {
          "deliveryAttributeMappings": null,
          "endpointType": "EventHub",
          "resourceId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/myResourceGroup/providers/Microsoft.EventHub/namespaces/myNamespace/eventhubs/myEventGridHub"
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
        "id": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myManagedCluster/providers/Microsoft.EventGrid/eventSubscriptions/myEventGridSubscription",
        "labels": null,
        "name": "myEventGridSubscription",
        "provisioningState": "Succeeded",
        "resourceGroup": "myResourceGroup",
        "retryPolicy": {
          "eventTimeToLiveInMinutes": 1440,
          "maxDeliveryAttempts": 30
        },
        "systemData": null,
        "topic": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/myResourceGroup/providers/microsoft.containerservice/managedclusters/myManagedCluster",
        "type": "Microsoft.EventGrid/eventSubscriptions"
      }
    ]
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Create a namespace using the [`New-AzEventHubNamespace`][new-azeventhubnamespace] cmdlet. Your namespace name must be unique.

    ```azurepowershell-interactive
    New-AzEventHubNamespace -Location eastus -Name MyNamespace -ResourceGroupName MyResourceGroup
    ```

2. Create an event hub using the [`New-AzEventHub`][new-azeventhub] cmdlet.

    ```azurepowershell-interactive
    New-AzEventHub -Name MyEventGridHub -Namespace MyNamespace -ResourceGroupName MyResourceGroup
    ```

3. Subscribe to the AKS events using the [`New-AzEventGridSubscription`][new-azeventgridsubscription] cmdlet.

    ```azurepowershell-interactive
    $SOURCE_RESOURCE_ID = (Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myManagedCluster).Id

    $ENDPOINT = (Get-AzEventHub -ResourceGroupName myResourceGroup -EventHubName myEventGridHub -Namespace myNamespace).Id

    $params = @{
        EventSubscriptionName = 'myEventGridSubscription'
        ResourceId            = $SOURCE_RESOURCE_ID
        EndpointType          = 'eventhub'
        Endpoint              = $ENDPOINT
    }

    New-AzEventGridSubscription @params
    ```

4. Verify your subscription to AKS events using the [`Get-AzEventGridSubscription`][get-azeventgridsubscription] cmdlet.

    ```azurepowershell-interactive
    Get-AzEventGridSubscription -ResourceId $SOURCE_RESOURCE_ID | Select-Object -ExpandProperty PSEventSubscriptionsList
    ```

    The following example output shows you're subscribed to events from the `myManagedCluster` cluster and those events are delivered to the `myEventGridHub` event hub:

    ```Output
    EventSubscriptionName : myEventGridSubscription
    Id                    : /subscriptions/SUBSCRIPTION_ID/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myManagedCluster/providers/Microsoft.EventGrid/eventSubscriptions/myEventGridSubscription
    Type                  : Microsoft.EventGrid/eventSubscriptions
    Topic                 : /subscriptions/SUBSCRIPTION_ID/resourceGroups/myResourceGroup/providers/microsoft.containerservice/managedclusters/myManagedCluster
    Filter                : Microsoft.Azure.Management.EventGrid.Models.EventSubscriptionFilter
    Destination           : Microsoft.Azure.Management.EventGrid.Models.EventHubEventSubscriptionDestination
    ProvisioningState     : Succeeded
    Labels                : 
    EventTtl              : 1440
    MaxDeliveryAttempt    : 30
    EventDeliverySchema   : EventGridSchema
    ExpirationDate        : 
    DeadLetterEndpoint    : 
    Endpoint              : /subscriptions/SUBSCRIPTION_ID/resourceGroups/myResourceGroup/providers/Microsoft.EventHub/namespaces/myNamespace/eventhubs/myEventGridHub
    ```

---

When AKS events occur, the events appear in your event hub. For example, when the list of available Kubernetes versions for your clusters changes, you see a `Microsoft.ContainerService.NewKubernetesVersionAvailable` event. For more information on the events AKS emits, see [Azure Kubernetes Service (AKS) as an Event Grid source][aks-events].

## Delete the cluster and subscriptions

### [Azure CLI](#tab/azure-cli)

* Remove the resource group, AKS cluster, namespace, event hub, and all related resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name myResourceGroup --yes --no-wait
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Remove the resource group, AKS cluster, namespace, event hub, and all related resources using the [`Remove-AzResourceGroup`][remove-azresourcegroup] cmdlet.

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name myResourceGroup
    ```

---

  > [!NOTE]
  > When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster isn't removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete].
  >
  > If you used a managed identity, the identity is managed by the platform and doesn't require removal.

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then subscribed to AKS events in Azure Event Hubs.

To learn more about AKS, and walk through a complete code to deployment example, continue to the following Kubernetes cluster tutorial.

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
[az-group-create]: /cli/azure/group#az_group_create
[az-eventgrid-event-subscription-list]: /cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-list
[get-azeventgridsubscription]: /powershell/module/az.eventgrid/get-azeventgridsubscription
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
