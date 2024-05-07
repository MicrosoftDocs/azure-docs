---
title: "Choose an Azure Kubernetes Fleet Manager option"
description: This article provides a conceptual overview of the various Azure Kubernetes Fleet Manager options and why you may choose a specific configuration.
ms.date: 05/01/2024
author: nickomang
ms.author: nickoman
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Choosing an Azure Kubernetes Fleet Manager option

This article provides an overview of the various Azure Kubernetes Fleet Manager (Fleet) options and the considerations you should use to guide your selection of a specific configuration.

## Fleet types

There are two main types of Fleet resources—hubless fleets and hubful fleets. As the names suggest, a hubful fleet has an associate Azure Kubernetes Service (AKS) cluster that acts as a hub to store and propagate configuration, while a hubless fleet doesn't. Both options are valid and in active development. There's no expectation that you need to migrate to hubful fleets unless you want to take advantage of the full set of features.

The following table compares the two options.

||Hubless fleet|Hubful fleet|
|----|----|----|
|**Hub cluster hosting**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>||
|**Member cluster limit**|Up to 100 clusters|Up to 20 clusters|
|**Update orchestration**|<span class='green-check'>&#9989;</span>|<span class='green-check'>&#9989;</span>|
|**Workload orchestration**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>|
|**Layer 4 load balancing**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>|
|**Billing considerations**|No cost|You pay cost associated with the hub, which is a standard-tier AKS-cluster.|
|**Converting fleet types**|Can convert a hubless fleet to a hubful fleet.|Can't convert a hubful fleet to a hubless fleet.|

## Hubless fleets

Without a hub cluster, Fleet acts solely as a grouping entity in Azure Resource Manager. Certain scenarios, such as update runs, don't require a Kubernetes API and thus don't require a hub cluster. To take full advantage of all the features available on Fleet, you need a hubful fleet.

For more information, see [Create a hubless fleet][create-hubless-fleet].

## Hubful fleets

A hubful fleet has an AKS-managed hub cluster, which is used to store configuration for workload orchestration and layer-4 load balancing.

Upon the creation of a hubful fleet, a hub cluster is automatically created in the same subscription under a managed resource group named `FL_*`. To improve reliability, hub clusters are locked down by denying any user initiated mutations to the corresponding AKS clusters (under the Fleet-managed resource group `FL_*`) and their underlying Azure resources (under the AKS-managed resource group `MC_FL_*`), such as VMs, via Azure deny assignments. Control plane operations, such as changing the hub cluster's configuration through Azure Resource Manager (ARM) or deleting the cluster entirely, are denied. Data plane operations, such as connecting to the hub cluster's Kubernetes API server in order to configure workload orchestration, are not denied.

Hub clusters are exempted from [Azure policies][azure-policy-overview] to avoid undesirable policy effects upon hub clusters.

### Public and private hubful fleets

For hubful fleets, there are two subtypes:

- **Public hubful fleets** expose the hub cluster to the internet. This means that with the right credentials, anyone on the internet can connect to the hub server. This configuration can be useful during the development and testing phase, but represents a security concern, which is largely undesirable in production.

For more information, see [Create a public hubful fleet][create-public-hubful-fleet].

- **Private hubful fleets** use a [private AKS cluster][aks-private-cluster] as the hub, which prevents open access over the internet. All considerations for a private AKS cluster apply, so review the prerequisites and limitations to determine whether a private hubful fleet meets your needs.

Some other details to consider:

- Whether you choose a public or private hub, the type can't be changed after creation.
- When using an AKS private cluster, you have the ability to configure fully qualified domain names (FQDNs) and FQDN subdomains. This functionality doesn't apply to the private cluster used in a private hubful fleet.
- When you connect to a private hub cluster, you can use the same methods that you would use to [connect to any private AKS cluster][aks-private-cluster-connect]. However, connecting using AKS command invoke and private endpoints aren't currently supported.
- When you use private hubful fleets, you're required to specify the subnet in which the Fleet hub cluster's node VMs reside. This process differs slightly from the AKS private cluster equivalent. For more information, see [Create a private hubful fleet][create-private-hubful-fleet].

<!-- TODO: NEED REVIEW ON THE WORDING OF ABOVE BULLETS -->

## Next steps

Now that you understand the different types of Kubernetes fleet resources, see [Create an Azure Kubernetes Fleet Manager resource and join member clusters][quickstart-create-fleet].

<!-- LINKS -->
[aks-private-cluster]: /azure/aks/private-clusters
[aks-private-cluster-connect]: /azure/aks/private-clusters?tabs=azure-portal#options-for-connecting-to-the-private-cluster
[azure-policy-overview]: /azure/governance/policy/overview
[quickstart-create-fleet]: quickstart-create-fleet-and-members.md
[create-hubless-fleet]: quickstart-create-fleet-and-members.md?tabs=hubless#create-a-fleet-resource
[create-public-hubful-fleet]: quickstart-create-fleet-and-members.md?tabs=hubful#public-hub
[create-private-hubful-fleet]: quickstart-create-fleet-and-members.md?tabs=hubful#private-hub