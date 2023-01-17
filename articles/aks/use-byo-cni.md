---
title: Bring your own Container Network Interface (CNI) plugin
description: Learn how to utilize Azure Kubernetes Service with your own Container Network Interface (CNI) plugin
services: container-service
ms.topic: article
ms.date: 8/12/2022
---

# Bring your own Container Network Interface (CNI) plugin with Azure Kubernetes Service (AKS)

Kubernetes does not provide a network interface system by default; this functionality is provided by [network plugins][kubernetes-cni]. Azure Kubernetes Service provides several supported CNI plugins. Documentation for supported plugins can be found from the [networking concepts page][aks-network-concepts].

While the supported plugins meet most networking needs in Kubernetes, advanced users of AKS may desire to utilize the same CNI plugin used in on-premises Kubernetes environments or to make use of specific advanced functionality available in other CNI plugins.

This article shows how to deploy an AKS cluster with no CNI plugin pre-installed, which allows for installation of any third-party CNI plugin that works in Azure.

## Support

BYOCNI has support implications - Microsoft support will not be able to assist with CNI-related issues in clusters deployed with BYOCNI. For example, CNI-related issues would cover most east/west (pod to pod) traffic, along with `kubectl proxy` and similar commands. If CNI-related support is desired, a supported AKS network plugin can be used or support could be procured for the BYOCNI plugin from a third-party vendor.

Support will still be provided for non-CNI-related issues.

## Prerequisites

* For ARM/Bicep, use at least template version 2022-01-02-preview or 2022-06-01
* For Azure CLI, use at least version 2.39.0
* The virtual network for the AKS cluster must allow outbound internet connectivity.
* AKS clusters may not use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range, pod address range, or cluster virtual network address range.
* The cluster identity used by the AKS cluster must have at least [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) permissions on the subnet within your virtual network. If you wish to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, the following permissions are required:
  * `Microsoft.Network/virtualNetworks/subnets/join/action`
  * `Microsoft.Network/virtualNetworks/subnets/read`
* The subnet assigned to the AKS node pool cannot be a [delegated subnet](../virtual-network/subnet-delegation-overview.md).
* AKS doesn't apply Network Security Groups (NSGs) to its subnet and will not modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, you must ensure the security rules in the NSGs allow traffic within the node CIDR range. For more details, see [Network security groups][aks-network-nsg].

## Cluster creation steps

### Deploy a cluster

# [Azure CLI](#tab/azure-cli)

Deploying a BYOCNI cluster requires passing the `--network-plugin` parameter with the parameter value of `none`.

1. First, create a resource group to create the cluster in:
    ```azurecli-interactive
    az group create -l <Region> -n <ResourceGroupName>
    ```

1. Then create the cluster itself:
    ```azurecli-interactive
    az aks create -l <Region> -g <ResourceGroupName> -n <ClusterName> --network-plugin none
    ```

# [Azure Resource Manager](#tab/azure-resource-manager)

When using an Azure Resource Manager template to deploy, pass `none` to the `networkPlugin` parameter to the `networkProfile` object. See the [Azure Resource Manager template documentation][deploy-arm-template] for help with deploying this template, if needed.

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

When using a Bicep template to deploy, pass `none` to the `networkPlugin` parameter to the `networkProfile` object. See the [Bicep template documentation][deploy-bicep-template] for help with deploying this template, if needed.

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

### Deploy a CNI plugin

When AKS provisioning completes, the cluster will be online, but all of the nodes will be in a `NotReady` state:

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
* [Use an internal load balancer with Azure Container Service (AKS)](internal-lb.md)

* [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
* [Enable the HTTP application routing add-on][aks-http-app-routing]
* [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
* [Create an ingress controller with a dynamic public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-tls]
* [Create an ingress controller with a static public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-static-tls]

<!-- LINKS - External -->
[kubernetes-cni]: https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet

<!-- LINKS - Internal -->
[az-aks-create]: /cli/azure/aks#az_aks_create
[aks-ssh]: ssh.md
[ManagedClusterAgentPoolProfile]: /azure/templates/microsoft.containerservice/managedclusters#managedclusteragentpoolprofile-object
[aks-network-concepts]: concepts-network.md
[aks-network-nsg]: concepts-network.md#network-security-groups
[aks-ingress-basic]: ingress-basic.md
[aks-ingress-tls]: ingress-tls.md
[aks-ingress-static-tls]: ingress-static-ip.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-internal]: ingress-internal-ip.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[network-policy]: use-network-policies.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[network-comparisons]: concepts-network.md#compare-network-models
[system-node-pools]: use-system-pools.md
[prerequisites]: configure-azure-cni.md#prerequisites
[deploy-bicep-template]: ../azure-resource-manager/bicep/deploy-cli.md
