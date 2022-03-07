---
title: Use labels in an Azure Kubernetes Service (AKS) cluster
description: Learn how to use labels in an Azure Kubernetes Service (AKS) cluster.
author: erik-ha-msft
ms.author: erikha
ms.service: container-service
ms.topic: how-to 
ms.date: 03/03/2022
ms.custom: template-how-to
#Customer intent: As a cluster operator, I want to learn how to use labels in an AKS cluster so that I can set scheduling rules for nodes.
---

# Use labels in an Azure Kubernetes Service (AKS) cluster

If you have multiple node pools, you may want to add a label during node pool creation. Labels set at the node pool are added to each node in the node pool. These [labels are visible in Kubernetes][kubernetes-labels] for handling scheduling rules for nodes. 

In this how-to guide, you'll learn how to use labels in an AKS cluster.

## Prerequisites

You need the Azure CLI version 2.2.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

In addition, this article assumes you have an existing AKS cluster.

## Create a node pool with a label

To create a node pool with a label, use [az aks nodepool add][az-aks-nodepool-add]. Specify the name *labelnp* and use the `--labels` parameter to specify *dept=IT* and *costcenter=9999* for labels.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name labelnp \
    --node-count 1 \
    --labels dept=IT costcenter=9999 \
    --no-wait
```

> [!NOTE]
> Labels must be a key/value pair and have a [valid syntax][kubernetes-label-syntax].

The following example output from the [az aks nodepool list][az-aks-nodepool-list] command shows that *labelnp* is *Creating* nodes with the specified *nodeLabels*:

```azurecli
az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster

```output
[
  {
    ...
    "count": 1,
    ...
    "name": "labelnp",
    "orchestratorVersion": "1.15.7",
    ...
    "provisioningState": "Creating",
    ...
    "nodeLabels":  {
      "dept": "IT",
      "costcenter": "9999"
    },
    ...
  },
 ...
]
```

## Unavailable labels

### Reserved system labels

Since [Release 2021-08-19][aks-release-2021-gh], Azure Kubernetes Service (AKS) has stopped the ability to make changes to AKS reserved labels. Attempting to change these labels will result in an error message.

The following lists of labels are reserved for use by AKS. *Virtual node usage* specifies if these labels could be a supported system feature on virtual nodes. 

Some properties that these system features change aren't available on the virtual nodes, because they require modifying the host.

| Label | Value | Example/Options | Virtual node usage |
| ---- | --- | --- | --- |
| kubernetes.azure.com/agentpool | \<agent pool name> | nodepool1 | Same |
| kubernetes.io/arch | amd64 | runtime.GOARCH | N/A |
| kubernetes.io/os | \<OS Type> | Linux/Windows | Same |
| node.kubernetes.io/instance-type | \<VM size> | Standard_NC6 | Virtual |
| topology.kubernetes.io/region | \<Azure region> | westus2 | Same |
| topology.kubernetes.io/zone | \<Azure zone> | 0 | Same |
| kubernetes.azure.com/cluster | \<MC_RgName> | MC_aks_myAKSCluster_westus2 | Same |
| kubernetes.azure.com/mode | \<mode> | User or system | User |
| kubernetes.azure.com/role | agent | Agent | Same |
| kubernetes.azure.com/scalesetpriority | \<VMSS priority> | Spot or regular | N/A |
| kubernetes.io/hostname | \<hostname> | aks-nodepool-00000000-vmss000000 | Same |
| kubernetes.azure.com/storageprofile | \<OS disk storage profile> | Managed | N/A |
| kubernetes.azure.com/storagetier | \<OS disk storage tier> | Premium_LRS | N/A |
| kubernetes.azure.com/instance-sku | \<SKU family> | Standard_N | Virtual |
| kubernetes.azure.com/node-image-version | \<VHD version> | AKSUbuntu-1804-2020.03.05 | Virtual node version |
| kubernetes.azure.com/subnet | \<nodepool subnet name> | subnetName | Virtual node subnet name |
| kubernetes.azure.com/vnet | \<nodepool vnet name> | vnetName | Virtual node virtual network |
| kubernetes.azure.com/ppg  | \<nodepool ppg name> | ppgName | N/A |
| kubernetes.azure.com/encrypted-set | \<nodepool encrypted-set name> | encrypted-set-name | N/A |
| kubernetes.azure.com/accelerator | \<accelerator> | nvidia | N/A |
| kubernetes.azure.com/fips_enabled | \<is fips enabled?> | true | N/A |
| kubernetes.azure.com/os-sku | \<os/sku> | [Create or update OS SKU][create-or-update-os-sku] | Linux |

* *Same* is included in places where the expected values for the labels don't differ between a standard node pool and a virtual node pool. As virtual node pods don't expose any underlying virtual machine (VM), the VM SKU values are replaced with the SKU *Virtual*.
* *Virtual node version* refers to the current version of the [virtual Kubelet-ACI connector release][virtual-kubelet-release].
* *Virtual node subnet name* is the name of the subnet where virtual node pods are deployed into Azure Container Instance (ACI).
* *Virtual node virtual network* is the name of the virtual network, which contains the subnet where virtual node pods are deployed on ACI.

### Reserved prefixes

The following lists of prefixes are reserved for usage by AKS and aren't to be used for any node. 

| Prefix |
| --- |
| kubernetes.azure.com/ |

### Deprecated labels

The following lists of labels are planned for deprecated. Customers should change any label references to the recommended substitute. 

| Label | Recommended substitute | Maintainer |
| --- | --- | --- |
| failure-domain.beta.kubernetes.io/region | topology.kubernetes.io/region | [Kubernetes][kubernetes-labels]
| failure-domain.beta.kubernetes.io/zone | topology.kubernetes.io/zone | [Kubernetes][kubernetes-labels]
| beta.kubernetes.io/arch | kubernetes.io/arch | [Kubernetes][kubernetes-labels]
| beta.kubernetes.io/instance-type | node.kubernetes.io/instance-type | [Kubernetes][kubernetes-labels]
| beta.kubernetes.io/os  | kubernetes/io/os | [Kubernetes][kubernetes-labels]
| node-role.kubernetes.io/agent* | kubernetes.azure.com/role=agent | Azure Kubernetes Service
| kubernetes.io/role* | kubernetes.azure.com/role=agent | Azure Kubernetes Service
| Agentpool* | kubernetes.azure.com/agentpool | Azure Kubernetes Service
| Storageprofile* | kubernetes.azure.com/storageprofile | Azure Kubernetes Service
| Storagetier* | kubernetes.azure.com/storagetier | Azure Kubernetes Service
| Accelerator* | kubernetes.azure.com/accelerator | Azure Kubernetes Service

*Newly deprecated. For more information, see [Release Notes][aks-release-notes-gh] on when these labels will no longer be maintained.

<!-- LINKS - external -->
[aks-release-2021-gh]: https://github.com/Azure/AKS/releases/tag/2021-08-19
[aks-release-notes-gh]: https://github.com/Azure/AKS/releases
[kubernetes-labels]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
[kubernetes-label-syntax]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set
[virtual-kubelet-release]: https://github.com/virtual-kubelet/azure-aci/releases


<!-- LINKS - internal -->
[az-aks-nodepool-add]: /cli/azure/aks#az-aks-nodepool-add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az-aks-nodepool-list
[create-or-update-os-sku]: /rest/api/aks/agent-pools/create-or-update#ossku
[install-azure-cli]: /cli/azure/install-azure-cli