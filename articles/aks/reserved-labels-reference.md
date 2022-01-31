---
title: Reserved labels for Azure Kubernetes Service
description: Lists the reserved labels for Azure Kubernetes Service. These labels can't be changed by the end user.
ms.date: 1/25/2022
ms.topic: reference
---
# Reserved labels for Azure Kubernetes Service

## Reserved system labels

Since [Release 2021-08-19][aks-release-2021-gh], AKS has stopped the ability to make changes to AKS reserved system labels. The following list of labels are reserved for usage by AKS and are not to be used for any node. Use of these labels will result in an error or deny message. 

| Label                                   | Value                          | Example/Options                  | Virtual node usage |
|-----------------------------------------|--------------------------------|----------------------------------|--------------------|
| kubernetes.azure.com/agentpool          | \<agent pool name>             | nodepool1                        | same               |
| kubernetes.io/arch                      | amd64                          | N/A                              | N/A                |
| kubernetes.io/os                        | \<OS Type>                     | Linux/Windows                    | same               |
| node.kubernetes.io/instance-type        | \<VM size>                     | Standard_NC6                     | virtual            |
| topology.kubernetes.io/region           | \<Azure region>                | westus2                          | same               |
| topology.kubernetes.io/zone             | \<Azure zone>                  | 0                                | same               |
| kubernetes.azure.com/cluster            | \<MC_RgName>                   | MC_aks_myAKSCluster_westus2      | same               |
| kubernetes.azure.com/mode               | \<mode>                        | User or system                   | User               |
| kubernetes.azure.com/role               | agent                          | Agent                            | same               |
| kubernetes.azure.com/scalesetpriority   | \<VMSS priority>               | Spot or regular                  | N/A                |
| kubernetes.io/hostname                  | \<hostname>                    | aks-nodepool-00000000-vmss000000 | same               |
| kubernetes.azure.com/storageprofile     | \<OS disk storage profile>     | Managed                          | N/A                |
| kubernetes.azure.com/storagetier        | \<OS disk storage tier>        | Premium_LRS                      | N/A                |
| kubernetes.azure.com/instance-sku       | \<SKU family>                  | Standard_N                       | Virtual            |
| kubernetes.azure.com/node-image-version | \<VHD version>                 | AKSUbuntu-1804-2020.03.05        | VM version         |
| kubernetes.azure.com/subnet             | \<nodepool subnet name>        | subnetName                       | VM subnet name     |
| kubernetes.azure.com/vnet               | \<nodepool vnet name>          | vnetName                         | VM vnet name       |
| kubernetes.azure.com/ppg                | \<nodepool ppg name>           | ppgName                          | N/A                |
| kubernetes.azure.com/encrypted-set      | \<nodepool encrypted-set name> | encrypted-set-name               | N/A                |
| kubernetes.azure.com/accelerator        | \<accelerator>                 | nvidia                           |                    |
| kubernetes.azure.com/fips_enabled       | \<is fips enabled?>            | true                             |                    |
| kubernetes.azure.com/os-sku             | \<os/sku>                      |                                  |                    |


## Reserved prefixes

The following list of prefixes are reserved for usage by AKS and are not to be used for any node. 

| Prefix                |
|-----------------------|
| kubernetes.azure.com/ |

## Deprecated label keys

The following list of labels is planned for deprecation. See [Release Notes][aks-release-notes-gh] for details on when you will no longer be able to utilize these labels for your nodes. 

| Label                                    | Recommended substitute              |
|------------------------------------------|-------------------------------------|
| failure-domain.beta.kubernetes.io/region | topology.kubernetes.io/region       |
| failure-domain.beta.kubernetes.io/zone   | topology.kubernetes.io/zone         |
| beta.kubernetes.io/arch                  | kubernetes.io/arch                  |
| beta.kubernetes.io/instance-type         | node.kubernetes.io/instance-type    |
| beta.kubernetes.io/os                    | kubernetes/io/os                    |
| node-role.kubernetes.io/agent            | kubernetes.azure.com/role=agent     |
| kubernetes.io/role                       | kubernetes.azure.com/role=agent     |
| agentpool                                | kubernetes.azure.com/agentpool      |
| storageprofile                           | kubernetes.azure.com/storageprofile |
| storagetier                              | kubernetes.azure.com/storagetier    |
| accelerator                              | kubernetes.azure.com/accelerator    |



<!-- LINKS -->

<!-- EXTERNAL -->
[aks-release-2021-gh]: https://github.com/Azure/AKS/releases/tag/2021-08-19
[aks-release-notes-gh]: https://github.com/Azure/AKS/releases