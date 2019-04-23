---
title: Restrict egress traffic in Azure Kubernetes Service (AKS)
description: Learn what ports and addresses are required to control egress traffic in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 05/06/2019
ms.author: iainfou

#Customer intent: As an cluster operator, I want to restrict egress traffic for nodes to only access defined ports and addresses and improve cluster security.
---

# Limit egress traffic for cluster nodes and control access to required ports and services in Azure Kubernetes Service (AKS)

By default, AKS clusters have unrestricted outbound (egress) internet access. This level of network access allows nodes and services you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible to maintain healthy cluster maintenance tasks.

This article details what network ports and fully qualified domain names (FQDNs) are required and optional if you restrict egress traffic in an AKS cluster.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Egress traffic overview

For management and operational purposes, nodes in an AKS cluster need to access certain ports and fully qualified domain names (FQDNs). These actions could be to communicate with the API server, or to download and then install core Kubernetes cluster components and node security updates. By default, egress (outbound) internet traffic is not restricted for nodes in an AKS cluster.

To increase the security of your AKS cluster, you may wish to restrict egress traffic. If you lock down the egress traffic, you must whitelist specific ports and FQDNs to allow the AKS nodes to correctly communicate with the required external service. Without these whitelisted ports and FQDNs, your AKS nodes can't communicate with the API server or install core components.

In AKS, there are two sets of ports and addresses:

* The [required ports and address for AKS clusters](#required-ports-and-addresses-for-aks-clusters) details the minimum requirements for whitelisting egress traffic.
* The [Optional recommended addresses and ports for AKS clusters](#optional-recommended-addresses-and-ports-for-aks-clusters) aren't required for all scenarios, but integration with other services such as Azure Container Registry or Azure Monitor won't work correctly. Review this list of optional ports and FQDNs, and whitelist any of the services and components used in your AKS cluster.

## Required ports and addresses for AKS clusters

The following outbound ports / network rules are required for an AKS cluster:

* TCP port *443*
* TCP port *22* (being replaced with TCP port *9000*)

The following FQDN / application rules are required. This list only applies to non-GPU clusters. For AKS clusters that include GPU-based nodes, see the [additional list of required ports and address](#additional-required-addresses-for-gpu-based-clusters)

| FQDN                    | Use |
|-------------------------|----------|
| *<region>.azmk8s.io     | This address is the API server endpoint. |
| k8s.gcr.io              | This address is Google’s Container Registry that allows `az aks upgrade` to work properly. |
| storage.googleapis.com  | This address is the underlying data store for Google’s Container Registry used by the previous entry. |
| *auth.docker.io         | This address is to authenticate to Docker Hub, even if you are not logged in. |
| *cloudflare.docker.io   | This address is a CDN endpoint for cached Container Images on Docker Hub. |
| *.cloudflare.docker.com | This address is a CDN endpoint for cached Container Images on Docker Hub. |
| *registry-1.docker.io   | This address is Docker Hub’s registry. |

### Additional required addresses for GPU-based clusters

If you use GPU-based nodes, some additional FQDNs are required for egress traffic. To allow the nodes to download and use additional drivers and tooling, the following addresses are required:

* *.azmk8s.io
* *.azureedge.net
* *.blob.core.windows.net
* *.azure-automation.net
* *.opinsights.azure.com
* *.management.azure.com
* *.login.microsoftonline.com
* *.ubuntu.com
* *.vo.msecnd.net

## Optional recommended addresses and ports for AKS clusters

The following outbound ports / network rules aren't required for AKS clusters to function correctly, but are recommended:

* TCP port *123* for time sync
* TCP port *53* (DNS) to correctly resolve Ubuntu patches

The following FQDN / application rules are recommended for AKS clusters to function correctly:

| FQDN                         | Use |
|------------------------------|----------|
| *.ubuntu.com                 | This address lets the cluster nodes download the required security patches and updates. If you only create new, short-lived clusters and won't update nodes, this address is not needed. |
| *azurecr.io                  | If you use Azure Container Registry (ACR) to store your container images, this address is needed. To restrict egress traffic to a specific registry, add the FQDN of the ACR instead of a wild-card entry. |
| *blob.core.windows.net       | If you use Azure Container Registry (ACR), Azure Blob Storage is the underlying data store. This address is needed to correctly pull from those container images. |
| *login.microsoftonline.com   | If you use Azure Active Directory (AD) integration, this address is needed for the authentication flow for cluster resource management. |
| *snapcraft.io                | If you install Ubuntu packages, this address is needed. |
| *packages.microsoft.com      | If you install Microsoft packages, this address is needed. |
| dc.services.visualstudio.com | If you use Azure Application Insights, this address is needed. |
| *.opinsights.azure.com       | If you use Azure Monitor, this address is needed. |
| *.monitoring.azure.com       | If you use Azure Monitor, this address is also needed. |
| *.management.azure.com       | If you use Azure Tooling, this address is needed. |

## Next steps

In this article, you learned what ports and addresses to allow if you restrict egress traffic for the cluster. You can also define how the pods themselves can communicate and what restrictions they have within the cluster. For more information, see [Secure traffic between pods using network policies in AKS][network-policy].

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[network-policy]: use-network-policies.md