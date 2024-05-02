---
title: "Choosing an Azure Kubernetes Fleet Manager option"
description: This article provides a conceptual overview of the various Azure Kubernetes Fleet Manager options and why you may choose a specific configuration.
ms.date: 05/01/2024
author: nickomang
ms.author: nickoman
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Choosing an Azure Kubernetes Fleet Manager option

This article provides an overview of the various Azure Kubernetes Fleet Manager (Fleet) options and the considerations you should use to guide your selection of a specific configuration.

## Hubless fleets and hubful fleets

There are two main types of Fleet resources — hubless fleets and hubful fleets. As the names suggest, a hubful fleet has an associated AKS-managed "hub" cluster, which is used to store configuration for workload orchestration and layer-4 load balancing, while a hubless fleet does not. Both options are valid and in active development. There's no expectation that you'll need to migrate to hubful fleets unless you want to take advantage of the additional features.

The following table compares the two options with respect to functionality.

||Hubless fleet|Hubful fleet|
|----|----|----|
|**Update orchestration**|<span class='green-check'>&#9989;</span>|<span class='green-check'>&#9989;</span>|
|**Workload orchestration**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>|
|**Layer 4 load balancing**|<span class='red-x'>&#10060;</span>|<span class='green-check'>&#9989;</span>|
|**Billing considerations**|No cost|Cost associated with hub cluster|
|**Upgrade path**|Can upgrade from a hubless fleet to a hubful fleet|Cannot downgrade from a hubful fleet to a hubless fleet|

For more details, see [Create a hubless fleet][quickstart-create-hubless-fleet] and [Create a hubful fleet][quickstart-create-hubful-fleet].

## Public hubful fleets and private hubful fleets

For hubful fleets, there are two subtypes:

- **Public hubful fleets** expose the hub cluster to the internet. This means that with the right credentials, anyone on the internet can connect to the hub server. This configuration can be useful during the development and testing phase, but represents a security concern which is largely undesirable in production.

- **Private hubful fleets** use a [private AKS cluster][aks-private-cluster] as the hub, which prevents open access over the internet. All considerations for a private AKS cluster will apply, so review the prerequisites and limitations to determine whether a private hubful fleet meets your needs.

Some additional details to consider:

- At this time, choosing a public or private hub cannot be changed after creation.
- When using an AKS private cluster, you have the ability to configure fully qualified domain names (FQDNs) and FQDN sub-domains. This functionality does not apply to the private cluster used in a private hubful fleet.
- You can connect to a private hub cluster using the same methods that you would to [connect to any private AKS cluster][aks-private-cluster-connect] with the exception of AKS command invoke and private endpoint, which are not currently supported.
- When using private hubful fleets, you're required to provide the subnet in which the Fleet hub cluster's node VMs will be placed. This process differs slightly from the AKS private cluster equivalent. For more details, see [Create a private hubful fleet][create-private-hubful-fleet].

<!-- NEED REVIEW ON THE WORDING OF ABOVE BULLETS -->

## Next steps

Now that you understand the different types of Kubernetes fleet resources, see [Create a hubless fleet][quickstart-create-hubless-fleet] and [Create a hubful fleet][quickstart-create-hubful-fleet].

<!-- LINKS -->
[quickstart-create-hubless-fleet]: quickstart-create-hubless-fleet.md
[quickstart-create-hubful-fleet]: quickstart-create-hubful-fleet.md
[aks-private-cluster]: /azure/aks/private-clusters
[aks-private-cluster-connect]: /azure/aks/private-clusters?tabs=azure-portal#options-for-connecting-to-the-private-cluster
[create-private-hubful-fleet]: create-private-hubful-fleet.md