---
title: Reserved labels for Azure Kubernetes Service
description: Lists the reserved labels for Azure Kubernetes Service. These labels can't be changed by the end user.
ms.date: 1/25/2022
ms.topic: reference
---
# Reserved labels for Azure Kubernetes Service

Since [Release 2021-08-19][aks-release-2021-gh], AKS has stopped the ability to make changes to AKS reserved system labels. Attempted change of these labels will result in an error message.
## Reserved system labels

The following lists of labels are reserved for use by AKS. Virtual node usage specifies if these labels could be a supported system feature on virtual nodes. 

Some properties that these system features change aren't available on the virtual nodes because they require modifying the host.

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

## Reserved prefixes

The following lists of prefixes are reserved for usage by AKS and aren't to be used for any node. 

| Prefix |
| --- |
| kubernetes.azure.com/ |

## Deprecated labels

The following lists of labels are planned for deprecated. Customers should change any label references to the recommended substitute. 

| Label | Recommended substitute | Maintainer |
| --- | --- | --- |
| failure-domain.beta.kubernetes.io/region | topology.kubernetes.io/region | [Kubernetes][kubernetes-labels-selectors]
| failure-domain.beta.kubernetes.io/zone | topology.kubernetes.io/zone | [Kubernetes][kubernetes-labels-selectors]
| beta.kubernetes.io/arch | kubernetes.io/arch | [Kubernetes][kubernetes-labels-selectors]
| beta.kubernetes.io/instance-type | node.kubernetes.io/instance-type | [Kubernetes][kubernetes-labels-selectors]
| beta.kubernetes.io/os  | kubernetes/io/os | [Kubernetes][kubernetes-labels-selectors]
| node-role.kubernetes.io/agent | kubernetes.azure.com/role=agent | Azure Kubernetes Service
| kubernetes.io/role | kubernetes.azure.com/role=agent | Azure Kubernetes Service
| Agentpool* | kubernetes.azure.com/agentpool | Azure Kubernetes Service
| Storageprofile* | kubernetes.azure.com/storageprofile | Azure Kubernetes Service
| Storagetier* | kubernetes.azure.com/storagetier | Azure Kubernetes Service
| Accelerator* | kubernetes.azure.com/accelerator | Azure Kubernetes Service

*Newly deprecated. See [Release Notes][aks-release-notes-gh] for details on when these labels will no longer be maintained.

<!-- LINKS - external -->
[aks-release-2021-gh]: https://github.com/Azure/AKS/releases/tag/2021-08-19
[aks-release-notes-gh]: https://github.com/Azure/AKS/releases
[kubernetes-labels-selectors]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/

<!-- LINKS - internal -->
[create-or-update-os-sku]: /rest/api/aks/agent-pools/create-or-update#ossku