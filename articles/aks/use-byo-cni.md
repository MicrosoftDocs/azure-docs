---
title: Bring your own Container Network Interface (CNI) plugin with Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to bring your own Container Network Interface (CNI) plugin with Azure Kubernetes Service (AKS).
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 06/20/2023
---

# Bring your own Container Network Interface (CNI) plugin with Azure Kubernetes Service (AKS)

Kubernetes doesn't provide a network interface system by default. Instead, [network plugins][kubernetes-cni] provide this functionality. Azure Kubernetes Service (AKS) provides several supported CNI plugins. For information on supported plugins, see the [AKS networking concepts][aks-network-concepts].

The supported plugins meet most networking needs in Kubernetes. However, advanced AKS users might want the same CNI plugin used in on-premises Kubernetes environments or to use advanced functionalities available in other CNI plugins.

This article shows how to deploy an AKS cluster with no CNI plugin preinstalled. From there, you can then install any third-party CNI plugin that works in Azure.

## Support

Microsoft support can't assist with CNI-related issues in clusters deployed with Bring your own Container Network Interface (BYOCNI). For example, CNI-related issues would cover most east/west (pod to pod) traffic, along with `kubectl proxy` and similar commands. If you want CNI-related support, use a supported AKS network plugin or seek support from the BYOCNI plugin third-party vendor.

Support is still provided for non-CNI-related issues.

## Prerequisites

* For Azure Resource Manager (ARM) or Bicep, use at least template version 2022-01-02-preview or 2022-06-01.
* For Azure CLI, use at least version 2.39.0.
* The virtual network for the AKS cluster must allow outbound internet connectivity.
* AKS clusters may not use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range, pod address range, or cluster virtual network address range.
* The cluster identity used by the AKS cluster must have at least [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) permissions on the subnet within your virtual network. If you wish to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, the following permissions are required:
  * `Microsoft.Network/virtualNetworks/subnets/join/action`
  * `Microsoft.Network/virtualNetworks/subnets/read`
* The subnet assigned to the AKS node pool can't be a [delegated subnet](../virtual-network/subnet-delegation-overview.md).
* AKS doesn't apply Network Security Groups (NSGs) to its subnet or modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, you must ensure the security rules in the NSGs allow traffic within the node CIDR range. For more information, see [Network security groups][aks-network-nsg].

## Create an AKS cluster with no CNI plugin preinstalled

# [Azure CLI](#tab/azure-cli)

1. Create an Azure resource group for your AKS cluster using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create -l eastus -n myResourceGroup
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command. Pass the `--network-plugin` parameter with the parameter value of `none`.

    ```azurecli-interactive
    az aks create -l eastus -g myResourceGroup -n myAKSCluster --network-plugin none
    ```

# [Azure Resource Manager](#tab/azure-resource-manager)

> [!NOTE]
> For information on how to deploy this template, see the [ARM template documentation][deploy-arm-template].

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string",
      "defaultValue": "aksbyocni"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "kubernetesVersion": {
      "type": "string",
      "defaultValue": "1.22"
    },
    "nodeCount": {
      "type": "int",
      "defaultValue": 3
    },
    "nodeSize": {
      "type": "string",
      "defaultValue": "Standard_B2ms"
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2022-06-01",
      "name": "[parameters('clusterName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "agentPoolProfiles": [
          {
            "name": "nodepool1",
            "count": "[parameters('nodeCount')]",
            "mode": "System",
            "vmSize": "[parameters('nodeSize')]"
          }
        ],
        "dnsPrefix": "[parameters('clusterName')]",
        "kubernetesVersion": "[parameters('kubernetesVersion')]",
        "networkProfile": {
          "networkPlugin": "none"
        }
      }
    }
  ]
}
```

# [Bicep](#tab/bicep)

> [!NOTE]
> For information on how to deploy this template, see the [Bicep template documentation][deploy-bicep-template].

```bicep
param clusterName string = 'aksbyocni'
param location string = resourceGroup().location
param kubernetesVersion string = '1.22'
param nodeCount int = 3
param nodeSize string = 'Standard_B2ms'

resource aksCluster 'Microsoft.ContainerService/managedClusters@2022-06-01' = {
  name: clusterName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    agentPoolProfiles: [
      {
        name: 'nodepool1'
        count: nodeCount
        mode: 'System'
        vmSize: nodeSize
      }
    ]
    dnsPrefix: clusterName
    kubernetesVersion: kubernetesVersion
    networkProfile: {
      networkPlugin: 'none'
    }
  }
}
```

---

## Deploy a CNI plugin

Once the AKS provisioning completes, the cluster is online, but all the nodes are in a `NotReady` state, as shown in the following example:

  ```bash
    $ kubectl get nodes
    NAME                                STATUS     ROLES   AGE    VERSION
    aks-nodepool1-23902496-vmss000000   NotReady   agent   6m9s   v1.21.9

    $ kubectl get node -o custom-columns='NAME:.metadata.name,STATUS:.status.conditions[?(@.type=="Ready")].message'
    NAME                                STATUS
    aks-nodepool1-23902496-vmss000000   container runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized
  ```

At this point, the cluster is ready for installation of a CNI plugin.

## Next steps

Learn more about networking in AKS in the following articles:

* [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)
* [Use an internal load balancer with Azure Kubernetes Service (AKS)](internal-lb.md)
* [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
* [Enable the HTTP application routing add-on][aks-http-app-routing]
* [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
* [Create an ingress controller with a dynamic public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-tls]
* [Create an ingress controller with a static public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-static-tls]

<!-- LINKS - External -->
[kubernetes-cni]: https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/
<!-- LINKS - Internal -->
[az-aks-create]: /cli/azure/aks#az_aks_create
[aks-network-concepts]: concepts-network.md
[aks-network-nsg]: concepts-network.md#network-security-groups
[aks-ingress-basic]: ingress-basic.md
[aks-ingress-tls]: ingress-tls.md
[aks-ingress-static-tls]: ingress-static-ip.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-internal]: ingress-internal-ip.md
[deploy-bicep-template]: ../azure-resource-manager/bicep/deploy-cli.md
[az-group-create]: /cli/azure/group#az_group_create
[deploy-arm-template]: ../azure-resource-manager/templates/deploy-cli.md
