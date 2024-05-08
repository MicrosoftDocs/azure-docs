---
title: "How to upgrade an Azure Kubernetes Fleet Manager resource from hubless to hubful"
description: Learn how to upgrade an Azure Kubernetes Fleet Manager resource from hubless to hubful.
ms.topic: how-to
ms.date: 05/02/2024
author: nickomang
ms.author: nickoman
ms.service: kubernetes-fleet

#customer intent: As a fleet operator, I want to learn how to upgrade from hubless to hubful fleets so that I can take advantage of the full feature set.
---

# Upgrade an Azure Kubernetes Fleet Manager resource from hubless to hubful

In this article, you learn how to upgrade an Azure Kubernetes Fleet Manager (Fleet) resource from hubless to hubful. Fleet resources are hubless by default, which means they don't rely on a central Azure Kubernetes Service (AKS) cluster. A hubful fleet uses an AKS cluster to store and propagate configuration details to enable the full Fleet feature set, which includes scenarios such as workload orchestration and layer-4 load balancing.

For more information, see [Choosing an Azure Kubernetes Fleet Manager option][concepts-choose-fleet].

## Prerequisites and limitations

[!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]
- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to the latest version.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- You must have an existing hubless fleet resource. The steps in this article show you how to create a hubless fleet, but you already have one you can substitute your existing resource.
- This article also includes steps on joining member clusters. If you plan to follow along, you need at least one AKS cluster.

- Hubless fleet resources can be upgraded to hubful, but hubful resources can't be downgraded to hubless.
- All configuration options and settings associated with hubful fleets are immutable and can't be changed after creation or upgrade time.
- Upgrading from hubless to hubful can only be done through the Azure CLI, and currently there's no equivalent Azure portal experience.

## Initial setup

To begin, create a resource group and a hubless fleet resource, and join your existing AKS cluster as a member. You'll need to repeat the `az fleet member create` command for each individual member cluster you want to associate with the fleet resource.

```azurecli-interactive
RG=myResourceGroup
LOCATION=eastus
FLEET=myKubernetesFleet
FLEET_MEMBER=<name-identifying-member-cluster>
SUBSCRIPTION_ID=<your-subscription-id>
CLUSTER=<your-aks-cluster-name>

# Create resource group
az group create -n $RG -l $LOCATION

# Create a hubless fleet resource 
az fleet create -g $RG -n $FLEET

# Join member cluster to hubless fleet resource
az fleet member create -n $FLEET_MEMBER -f $FLEET -g $RG --member-cluster-id /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.ContainerService/managedClusters/$CLUSTER
```

## Upgrade the fleet resource

To upgrade your hubless fleet resource to hubful, use the `az fleet create` command with the `--enable-hub` flag set. Be sure to include any other relevant configuration options, as the fleet resource will become immutable after this operation is complete.

```azurecli-interactive
# Upgrade the hubless fleet resource to a hubful fleet resource
az fleet create -n $FLEET -g $RG --enable-hub 

```

## Validate the upgrade

After running the `az fleet create` command to upgrade the fleet resource, verify that the upgrade succeeded by viewing the output. The `provisioningState` should read `Succeeded` and the `hubProfile` field should exist. For example, see the following output:

```bash
{
  ...
  "hubProfile": {
    "agentProfile": {
      "subnetId": null,
      "vmSize": null
    },
    "apiServerAccessProfile": {
      "enablePrivateCluster": false,
      "enableVnetIntegration": false,
      "subnetId": null
    },
    "dnsPrefix": "contoso-user-xxxx-xxxxxxx",
    "fqdn": "contoso-user-flth-xxxxxx-xxxxxxxx.hcp.eastus.azmk8s.io",
    "kubernetesVersion": "1.28.5",
    "portalFqdn": "contoso-user-flth-xxxxxxx-xxxxxxxx.portal.hcp.eastus.azmk8s.io"
  },
  "provisioningState": "Succeeded"
  ...
}
```

## Rejoin member clusters

To rejoin member clusters to the newly upgrade fleet resource, use the `az fleet member reconcile` command for each individual member cluster. 

```azurecli-interactive
az fleet member reconcile -g $RG -f $FLEET -n $FLEET_MEMBER
```

> [!NOTE]
> Any AKS clusters that you're joining to the fleet resource for the first time after the upgrade has already taken place don't need to be reconciled using `az fleet member reconcile`.

## Verify member clusters joined successfully

For each member cluster that you rejoin to the newly upgraded fleet, view the output and verify that `provisioningState` reads `Succeeded`. For example:

```bash
{
  ...
  "provisioningState": "Succeeded"
  ...
}
```

## Verify functionality

To verify that your newly upgraded fleet resource is functioning properly and member clusters joined successfully, confirm that you're able to access the API server using the `kubectl get memberclusters` command.

If successful, your output should look similar to the following example output:

```bash
NAME           JOINED   AGE
aks-member-1   True     2m
aks-member-2   True     2m
aks-member-3   True     2m
```

## Clean up resources

Once you're finished, you can remove the fleet resource and related resources by deleting the resource group. Keep in mind that this operation won't remove your AKS clusters if they reside in a different resource group.

```azurecli-interactive
az group delete -n $RG
```

## Next steps

Now that your hubless fleet resource is upgraded to a hubful fleet resource, you can take advantage of features that were previously unavailable to you. For example, see:

> [!div class="nextstepaction"]
> [Layer-4 load balancing across Fleet member clusters](l4-load-balancing.md)

<!-- LINKS -->
[concepts-choose-fleet]: concepts-choosing-fleet.md
[quickstart-create-fleet]: quickstart-create-fleet-and-members.md?tabs=hubless
[workload-orchestration]: /azure/kubernetes-fleet/concepts-resource-propagation