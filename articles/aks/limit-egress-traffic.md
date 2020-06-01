---
title: Restrict egress traffic in Azure Kubernetes Service (AKS)
description: Learn what ports and addresses are required to control egress traffic in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 03/10/2020


#Customer intent: As an cluster operator, I want to restrict egress traffic for nodes to only access defined ports and addresses and improve cluster security.
---

# Control egress traffic for cluster nodes in Azure Kubernetes Service (AKS)

By default, AKS clusters have unrestricted outbound (egress) internet access. This level of network access allows nodes and services you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible to maintain healthy cluster maintenance tasks. Your cluster is configured by default to only use base system container images from Microsoft Container Registry (MCR) or Azure Container Registry (ACR). Configure your preferred firewall and security rules to allow these required ports and addresses.

This article details what network ports and fully qualified domain names (FQDNs) are required and optional if you restrict egress traffic in an AKS cluster.

> [!IMPORTANT]
> This document covers only how to lock down the traffic leaving the AKS subnet. AKS has no ingress requirements.  Blocking internal subnet traffic using network security groups (NSGs) and firewalls is not supported. To control and block the traffic within the cluster, use [Network Policies][network-policy].

## Before you begin

You need the Azure CLI version 2.0.66 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Egress traffic overview

For management and operational purposes, nodes in an AKS cluster need to access certain ports and fully qualified domain names (FQDNs). These actions could be to communicate with the API server, or to download and then install core Kubernetes cluster components and node security updates. By default, egress (outbound) internet traffic is not restricted for nodes in an AKS cluster. The cluster may pull base system container images from external repositories.

To increase the security of your AKS cluster, you may wish to restrict egress traffic. The cluster is configured to pull base system container images from MCR or ACR. If you lock down the egress traffic in this manner, define specific ports and FQDNs to allow the AKS nodes to correctly communicate with required external services. Without these authorized ports and FQDNs, your AKS nodes can't communicate with the API server or install core components.

You can use [Azure Firewall][azure-firewall] or a 3rd-party firewall appliance to secure your egress traffic and define these required ports and addresses. AKS does not automatically create these rules for you. The following ports and addresses are for reference as you create the appropriate rules in your network firewall.

> [!IMPORTANT]
> When you use Azure Firewall to restrict egress traffic and create a user-defined route (UDR) to force all egress traffic, make sure you create an appropriate DNAT rule in Firewall to correctly allow ingress traffic. Using Azure Firewall with a UDR breaks the ingress setup due to asymmetric routing. (The issue occurs if the AKS subnet has a default route that goes to the firewall's private IP address, but you're using a public load balancer - ingress or Kubernetes service of type: LoadBalancer). In this case, the incoming load balancer traffic is received via its public IP address, but the return path goes through the firewall's private IP address. Because the firewall is stateful, it drops the returning packet because the firewall isn't aware of an established session. To learn how to integrate Azure Firewall with your ingress or service load balancer, see [Integrate Azure Firewall with Azure Standard Load Balancer](https://docs.microsoft.com/azure/firewall/integrate-lb).
> You can lock down the traffic for TCP port 9000, TCP port 22 and UDP port 1194 using a network rule between the egress worker node IP(s) and the IP for the API server.

In AKS, there are two sets of ports and addresses:

* The [required ports and address for AKS clusters](#required-ports-and-addresses-for-aks-clusters) details the minimum requirements for authorized egress traffic.
* The [optional recommended addresses and ports for AKS clusters](#optional-recommended-addresses-and-ports-for-aks-clusters) aren't required for all scenarios, but integration with other services such as Azure Monitor won't work correctly. Review this list of optional ports and FQDNs, and authorize any of the services and components used in your AKS cluster.

> [!NOTE]
> Limiting egress traffic only works on new AKS clusters. For existing clusters, [perform a cluster upgrade operation][aks-upgrade] using the `az aks upgrade` command before you limit the egress traffic.

## Required ports and addresses for AKS clusters

The following outbound ports / network rules are required for an AKS cluster:

* TCP port *443*
* TCP [IPAddrOfYourAPIServer]:443 is required if you have an app that needs to talk to the API server.  This change can be set after the cluster is created.
* TCP port *9000*, TCP port *22* and UDP port *1194* for the tunnel front pod to communicate with the tunnel end on the API server.
    * To get more specific, see the **.hcp.\<location\>.azmk8s.io* and **.tun.\<location\>.azmk8s.io* addresses in the following table.
* UDP port *123* for Network Time Protocol (NTP) time synchronization (Linux nodes).
* UDP port *53* for DNS is also required if you have pods directly accessing the API server.

The following FQDN / application rules are required:

> [!IMPORTANT]
> ***.blob.core.windows.net and aksrepos.azurecr.io** are no longer required FQDN rules for egress lockdown.  For existing clusters, [perform a cluster upgrade operation][aks-upgrade] using the `az aks upgrade` command to remove these rules.

> [!IMPORTANT]
> *.cdn.mscr.io has been replaced by *.data.mcr.microsoft.com for the Azure public cloud regions. Please upgrade your existing firewall rules for the changes to take effect.

- Azure Global

| FQDN                       | Port      | Use      |
|----------------------------|-----------|----------|
| *.hcp.\<location\>.azmk8s.io | HTTPS:443, TCP:22, TCP:9000, UDP:1194 | This address is required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| *.tun.\<location\>.azmk8s.io | HTTPS:443, TCP:22, TCP:9000, UDP:1194 | This address is required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| *.cdn.mscr.io       | HTTPS:443 | This address is required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| mcr.microsoft.com          | HTTPS:443 | This address is required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts(for example, moby, etc.) required for the functioning of the cluster during upgrade and scale of the cluster |
| *.data.mcr.microsoft.com             | HTTPS:443 | This address is required for MCR storage backed by the Azure content delivery network (CDN). |
| management.azure.com       | HTTPS:443 | This address is required for Kubernetes GET/PUT operations. |
| login.microsoftonline.com  | HTTPS:443 | This address is required for Azure Active Directory authentication. |
| ntp.ubuntu.com             | UDP:123   | This address is required for NTP time synchronization on Linux nodes. |
| packages.microsoft.com     | HTTPS:443 | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| acs-mirror.azureedge.net      | HTTPS:443 | This address is for the repository required to install required binaries like kubenet and Azure CNI. |

- Azure China 21Vianet

| FQDN                       | Port      | Use      |
|----------------------------|-----------|----------|
| *.hcp.\<location\>.cx.prod.service.azk8s.cn | HTTPS:443, TCP:22, TCP:9000, UDP:1194 | This address is required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| *.tun.\<location\>.cx.prod.service.azk8s.cn | HTTPS:443, TCP:22, TCP:9000, UDP:1194 | This address is required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| *.azk8s.cn        | HTTPS:443 | This address is required to download required binaries and images|
| mcr.microsoft.com          | HTTPS:443 | This address is required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts(for example, moby, etc.) required for the functioning of the cluster during upgrade and scale of the cluster |
| *.cdn.mscr.io       | HTTPS:443 | This address is required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| *.data.mcr.microsoft.com             | HTTPS:443 | This address is required for MCR storage backed by the Azure content delivery network (CDN). |
| management.chinacloudapi.cn       | HTTPS:443 | This address is required for Kubernetes GET/PUT operations. |
| login.chinacloudapi.cn  | HTTPS:443 | This address is required for Azure Active Directory authentication. |
| ntp.ubuntu.com             | UDP:123   | This address is required for NTP time synchronization on Linux nodes. |
| packages.microsoft.com     | HTTPS:443 | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |

- Azure Government

| FQDN                       | Port      | Use      |
|----------------------------|-----------|----------|
| *.hcp.\<location\>.cx.aks.containerservice.azure.us | HTTPS:443, TCP:22, TCP:9000, UDP:1194 | This address is required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| *.tun.\<location\>.cx.aks.containerservice.azure.us | HTTPS:443, TCP:22, TCP:9000, UDP:1194 | This address is required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| mcr.microsoft.com          | HTTPS:443 | This address is required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts(for example, moby, etc.) required for the functioning of the cluster during upgrade and scale of the cluster |
|*.cdn.mscr.io              | HTTPS:443 | This address is required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| *.data.mcr.microsoft.com             | HTTPS:443 | This address is required for MCR storage backed by the Azure content delivery network (CDN). |
| management.usgovcloudapi.net       | HTTPS:443 | This address is required for Kubernetes GET/PUT operations. |
| login.microsoftonline.us  | HTTPS:443 | This address is required for Azure Active Directory authentication. |
| ntp.ubuntu.com             | UDP:123   | This address is required for NTP time synchronization on Linux nodes. |
| packages.microsoft.com     | HTTPS:443 | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| acs-mirror.azureedge.net      | HTTPS:443 | This address is for the repository required to install required binaries like kubenet and Azure CNI. |

## Optional recommended addresses and ports for AKS clusters

The following outbound ports / network rules are optional for an AKS cluster:

The following FQDN / application rules are recommended for AKS clusters to function correctly:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| security.ubuntu.com, azure.archive.ubuntu.com, changelogs.ubuntu.com | HTTP:80   | This address lets the Linux cluster nodes download the required security patches and updates. |

## Required addresses and ports for GPU enabled AKS clusters

The following FQDN / application rules are required for AKS clusters that have GPU enabled:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| nvidia.github.io | HTTPS:443 | This address is used for correct driver installation and operation on GPU-based nodes. |
| us.download.nvidia.com | HTTPS:443 | This address is used for correct driver installation and operation on GPU-based nodes. |
| apt.dockerproject.org | HTTPS:443 | This address is used for correct driver installation and operation on GPU-based nodes. |

## Required addresses and ports with Azure Monitor for containers enabled

The following FQDN / application rules are required for AKS clusters that have the Azure Monitor for containers enabled:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| dc.services.visualstudio.com | HTTPS:443    | This is for correct metrics and monitoring telemetry using Azure Monitor. |
| *.ods.opinsights.azure.com    | HTTPS:443    | This is used by Azure Monitor for ingesting log analytics data. |
| *.oms.opinsights.azure.com | HTTPS:443 | This address is used by omsagent, which is used to authenticate the log analytics service. |
|*.microsoftonline.com | HTTPS:443 | This is used for authenticating and sending metrics to Azure Monitor. |
|*.monitoring.azure.com | HTTPS:443 | This is used to send metrics data to Azure Monitor. |

## Required addresses and ports with Azure Dev Spaces enabled

The following FQDN / application rules are required for AKS clusters that have the Azure Dev Spaces enabled:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| cloudflare.docker.com | HTTPS:443 | This address is used to pull linux alpine and other Azure Dev Spaces images |
| gcr.io | HTTPS:443 | This address is used to pull helm/tiller images |
| storage.googleapis.com | HTTPS:443 | This address is used to pull helm/tiller images |

Update your firewall or security configuration to allow network traffic to and from the all of the above FQDNs and [Azure Dev Spaces infrastructure services][dev-spaces-service-tags].

## Required addresses and ports for AKS clusters with Azure Policy (in public preview) enabled

> [!CAUTION]
> Some of the features below are in preview.  The suggestions in this article are subject to change as the feature moves to public preview and future release stages.

The following FQDN / application rules are required for AKS clusters that have the Azure Policy enabled.

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| gov-prod-policy-data.trafficmanager.net | HTTPS:443 | This address is used for correct operation of Azure Policy. (currently in preview in AKS) |
| raw.githubusercontent.com | HTTPS:443 | This address is used to pull the built-in policies from GitHub to ensure correct operation of Azure Policy. (currently in preview in AKS) |
| *.gk.\<location\>.azmk8s.io | HTTPS:443    | Azure Policy add-on that talks to Gatekeeper audit endpoint running in master server to get the audit results. |
| dc.services.visualstudio.com | HTTPS:443 | Azure Policy add-on that sends telemetry data to applications insights endpoint. |

## Required by Windows Server based nodes enabled

The following FQDN / application rules are required for using Windows Server based node pools:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| onegetcdn.azureedge.net, winlayers.blob.core.windows.net, winlayers.cdn.mscr.io, go.microsoft.com | HTTPS:443 | To install windows-related binaries |
| mp.microsoft.com, www<span></span>.msftconnecttest.com, ctldl.windowsupdate.com | HTTP:80 | To install windows-related binaries |
| kms.core.windows.net | TCP:1688 | To install windows-related binaries |

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
[aks-upgrade]: upgrade-cluster.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[dev-spaces-service-tags]: ../dev-spaces/configure-networking.md#virtual-network-or-subnet-configurations
