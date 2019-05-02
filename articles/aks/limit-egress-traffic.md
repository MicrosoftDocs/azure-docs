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

You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

To create an AKS cluster that can limit egress traffic, first enable a feature flag on your subscription. To register the *AKSLockingDownEgressPreview* feature flag, use the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --name AKSLockingDownEgressPreview --namespace Microsoft.ContainerService
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKSLockingDownEgressPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Egress traffic overview

For management and operational purposes, nodes in an AKS cluster need to access certain ports and fully qualified domain names (FQDNs). These actions could be to communicate with the API server, or to download and then install core Kubernetes cluster components and node security updates. By default, egress (outbound) internet traffic is not restricted for nodes in an AKS cluster.

To increase the security of your AKS cluster, you may wish to restrict egress traffic. If you lock down the egress traffic, you must whitelist specific ports and FQDNs to allow the AKS nodes to correctly communicate with the required external service. Without these whitelisted ports and FQDNs, your AKS nodes can't communicate with the API server or install core components.

You can use [Azure Firewall][azure-firewall] or a 3rd-party firewall appliance to secure your egress traffic and whitelist these required ports and addresses.

In AKS, there are two sets of ports and addresses:

* The [required ports and address for AKS clusters](#required-ports-and-addresses-for-aks-clusters) details the minimum requirements for whitelisting egress traffic.
* The [optional recommended addresses and ports for AKS clusters](#optional-recommended-addresses-and-ports-for-aks-clusters) aren't required for all scenarios, but integration with other services such as Azure Monitor won't work correctly. Review this list of optional ports and FQDNs, and whitelist any of the services and components used in your AKS cluster.

## Required ports and addresses for AKS clusters

The following outbound ports / network rules are required for an AKS cluster:

* TCP port *443*
* TCP port *9000*

The following FQDN / application rules are required:

| FQDN                      | Port      | Use      |
|---------------------------|-----------|----------|
| *.azmk8s.io               | HTTPS:443 | This address is the API server endpoint. |
| aksrepos.azurecr.io       | HTTPS:443 | This address is required to access images in Azure Container Registry (ACR). |
| *.blob.core.windows.net   | HTTPS:443 | This address is the backend store for images stored in ACR. |
| mcr.microsoft.com         | HTTPS:443 | This address is required to access images in Microsoft Container Registry (MCR). |
| management.azure.com      | HTTPS:443 | This address is required for Kubernetes GET/PUT operations. |
| login.microsoftonline.com | HTTPS:443 | This address is required for Azure Active Directory authentication. |

## Optional recommended addresses and ports for AKS clusters

The following outbound ports / network rules aren't required for AKS clusters to function correctly, but are recommended:

* UDP port *123* for NTP time sync
* UDP port *53* for DNS

The following FQDN / application rules are recommended for AKS clusters to function correctly:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| *.ubuntu.com                            | HTTP:80   | This address lets the Linux cluster nodes download the required security patches and updates. |
| packages.microsoft.com                  | HTTPS:443 | This address is the Microsoft packages repository used for cached *apt-get* operations. |
| dc.services.visualstudio.com            | HTTPS:443 | Recommended for correct metrics and monitoring using Azure Monitor. |
| *.opinsights.azure.com                  | HTTPS:443 | Recommended for correct metrics and monitoring using Azure Monitor. |
| *.monitoring.azure.com                  | HTTPS:443 | Recommended for correct metrics and monitoring using Azure Monitor. |
| gov-prod-policy-data.trafficmanager.net | HTTPS:443 | This address is used for correct operation of Azure Policy (currently in preview in AKS). |
| apt.dockerproject.org                   | HTTPS:443 | This address is used for correct driver installation and operation on GPU-based nodes. |
| nvidia.github.io                        | HTTPS:443 | This address is used for correct driver installation and operation on GPU-based nodes. |

## Next steps

In this article, you learned what ports and addresses to allow if you restrict egress traffic for the cluster. You can also define how the pods themselves can communicate and what restrictions they have within the cluster. For more information, see [Secure traffic between pods using network policies in AKS][network-policy].

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[network-policy]: use-network-policies.md
[azure-firewall]: ../firewall/overview.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register