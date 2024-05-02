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

There are two main types of Fleet resources — hubless fleets and hubful fleets. Both options are valid and in active development. There's no expectation that you'll need to migrate to hubful fleets unless you want to take advantage of the full set of features.

The following table compares the two options.

||Hubless fleet|Hubful fleet|
|----|----|----|
|**Hub cluster hosting**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>||
|**Member cluster limit**|Up to 100 clusters|Up to 20 clusters|
|**Update orchestration**|<span class='green-check'>&#9989;</span>|<span class='green-check'>&#9989;</span>|
|**Workload orchestration**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>|
|**Layer 4 load balancing**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>|
|**Billing considerations**|No cost|You pay cost associated with the hub, which is a standard-tier AKS-cluster.|
|**Convert fleets between hubless and hubful**|Can upgrade from a hubless fleet to a hubful fleet|Cannot downgrade from a hubful fleet to a hubless fleet|

### Hubless fleets

Without a hub cluster, Fleet acts solely as a grouping entity in Azure Resource Manager. Certain scenarios, such as update runs, don't require a Kubernetes API and thus don't require a hub cluster, but to take full advantage of all the features available on Fleet, you'll need a hubful fleet.

### Hubful fleets

As the names suggest, a hubful fleet has an associated AKS-managed hub cluster, which is used to store configuration for workload orchestration and layer-4 load balancing.

Upon the creation of a hubful fleet, a hub cluster is automatically created in the same subscription under a managed resource group named `FL_*`.

To improve reliability, hub clusters are locked down by denying any user initiated mutations to the corresponding AKS clusters (under the Fleet-managed resource group `FL_*`) and their underlying Azure resources (under the AKS-managed resource group `MC_FL_*`), such as VMs, via Azure deny assignments.

Hub clusters are exempted from [Azure policies][azure-policy-overview] to avoid undesirable policy effects upon hub clusters.

#### Public and private hubful fleets

For hubful fleets, there are two subtypes:

- **Public hubful fleets** expose the hub cluster to the internet. This means that with the right credentials, anyone on the internet can connect to the hub server. This configuration can be useful during the development and testing phase, but represents a security concern which is largely undesirable in production.

- **Private hubful fleets** use a [private AKS cluster][aks-private-cluster] as the hub, which prevents open access over the internet. All considerations for a private AKS cluster will apply, so review the prerequisites and limitations to determine whether a private hubful fleet meets your needs.

Some additional details to consider:

- At this time, choosing a public or private hub cannot be changed after creation.
- When using an AKS private cluster, you have the ability to configure fully qualified domain names (FQDNs) and FQDN sub-domains. This functionality does not apply to the private cluster used in a private hubful fleet.
- You can connect to a private hub cluster using the same methods that you would to [connect to any private AKS cluster][aks-private-cluster-connect] with the exception of AKS command invoke and private endpoint, which are not currently supported.
- When using private hubful fleets, you're required to provide the subnet in which the Fleet hub cluster's node VMs will be placed. This process differs slightly from the AKS private cluster equivalent. For more details, see [Create a private hubful fleet][create-private-hubful-fleet].

<!-- TODO: NEED REVIEW ON THE WORDING OF ABOVE BULLETS -->

## Next steps

Now that you understand the different types of Kubernetes fleet resources, see [Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure portal][quickstart-create-hubless-fleet] and [Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI][quickstart-create-hubful-fleet].

<!-- LINKS -->
[aks-private-cluster]: /azure/aks/private-clusters
[aks-private-cluster-connect]: /azure/aks/private-clusters?tabs=azure-portal#options-for-connecting-to-the-private-cluster
[create-private-hubful-fleet]: quickstart-create-fleet-and-member-clusters.md
<!-- TODO: NEED TO MODIFY ABOVE LINK WHEN TABS FOR HUBLESS/HUBFUL IN QS -->
[azure-policy-overview]: /azure/governance/policy/overview