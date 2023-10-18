---
title: Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters
description: Learn what ports and addresses are required to control egress traffic in Azure Kubernetes Service (AKS)
ms.subservice: aks-networking
ms.topic: article
ms.author: allensu
ms.date: 06/13/2023
author: asudbring

#Customer intent: As an cluster operator, I want to learn the network and FQDNs rules to control egress traffic and improve security for my AKS clusters.
---

# Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters

This article provides the necessary details that allow you to secure outbound traffic from your Azure Kubernetes Service (AKS). It contains the cluster requirements for a base AKS deployment and additional requirements for optional addons and features. You can apply this information to any outbound restriction method or appliance.

To see an example configuration using Azure Firewall, visit [Control egress traffic using Azure Firewall in AKS](limit-egress-traffic.md).

## Background

AKS clusters are deployed on a virtual network. This network can either be customized and pre-configured by you or it can be created and managed by AKS. In either case, the cluster has **outbound**, or egress, dependencies on services outside of the virtual network.

For management and operational purposes, nodes in an AKS cluster need to access certain ports and fully qualified domain names (FQDNs). These endpoints are required for the nodes to communicate with the API server or to download and install core Kubernetes cluster components and node security updates. For example, the cluster needs to pull base system container images from Microsoft Container Registry (MCR).

The AKS outbound dependencies are almost entirely defined with FQDNs, which don't have static addresses behind them. The lack of static addresses means you can't use network security groups (NSGs) to lock down the outbound traffic from an AKS cluster.

By default, AKS clusters have unrestricted outbound internet access. This level of network access allows nodes and services you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible to maintain healthy cluster maintenance tasks. The simplest solution to securing outbound addresses is using a firewall device that can control outbound traffic based on domain names. Azure Firewall can restrict outbound HTTP and HTTPS traffic based on the FQDN of the destination. You can also configure your preferred firewall and security rules to allow these required ports and addresses.

> [!IMPORTANT]
>
> This document covers only how to lock down the traffic leaving the AKS subnet. AKS has no ingress requirements by default. Blocking **internal subnet traffic** using network security groups (NSGs) and firewalls isn't supported. To control and block the traffic within the cluster, see [Secure traffic between pods using network policies in AKS][use-network-policies].

## Required outbound network rules and FQDNs for AKS clusters

The following network and FQDN/application rules are required for an AKS cluster. You can use them if you wish to configure a solution other than Azure Firewall.

* IP address dependencies are for non-HTTP/S traffic (both TCP and UDP traffic).
* FQDN HTTP/HTTPS endpoints can be placed in your firewall device.
* Wildcard HTTP/HTTPS endpoints are dependencies that can vary with your AKS cluster based on a number of qualifiers.
* AKS uses an admission controller to inject the FQDN as an environment variable to all deployments under kube-system and gatekeeper-system. This ensures all system communication between nodes and API server uses the API server FQDN and not the API server IP.
* If you have an app or solution that needs to talk to the API server, you must add an **additional** network rule to allow **TCP communication to port 443 of your API server's IP**.
* On rare occasions, if there's a maintenance operation, your API server IP might change. Planned maintenance operations that can change the API server IP are always communicated in advance.

### Azure Global required network rules

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| **`*:1194`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:1194`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:1194`** <br/> *Or* <br/> **`APIServerPublicIP:1194`** `(only known after cluster creation)`  | UDP           | 1194      | For tunneled secure communication between the nodes and the control plane. This isn't required for [private clusters][private-clusters], or for clusters with the *konnectivity-agent* enabled. |
| **`*:9000`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:9000`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:9000`** <br/> *Or* <br/> **`APIServerPublicIP:9000`** `(only known after cluster creation)`  | TCP           | 9000      | For tunneled secure communication between the nodes and the control plane. This isn't required for [private clusters][private-clusters], or for clusters with the *konnectivity-agent* enabled. |
| **`*:123`** or **`ntp.ubuntu.com:123`** (if using Azure Firewall network rules)  | UDP      | 123     | Required for Network Time Protocol (NTP) time synchronization on Linux nodes. This isn't required for nodes provisioned after March 2021.                 |
| **`CustomDNSIP:53`** `(if using custom DNS servers)`                             | UDP      | 53      | If you're using custom DNS servers, you must ensure they're accessible by the cluster nodes. |
| **`APIServerPublicIP:443`** `(if running pods/deployments that access the API Server)` | TCP      | 443     | Required if running pods/deployments that access the API Server, those pods/deployments would use the API IP. This port isn't required for [private clusters][private-clusters]. |

### Azure Global required FQDN / application rules

| Destination FQDN                 | Port            | Use      |
|----------------------------------|-----------------|----------|
| **`*.hcp.<location>.azmk8s.io`** | **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. This is required for clusters with *konnectivity-agent* enabled. Konnectivity also uses Application-Layer Protocol Negotiation (ALPN) to communicate between agent and server. Blocking or rewriting the ALPN extension will cause a failure. This isn't required for [private clusters][private-clusters]. |
| **`mcr.microsoft.com`**          | **`HTTPS:443`** | Required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts (for example, coreDNS, etc.). These images are required for the correct creation and functioning of the cluster, including scale and upgrade operations.  |
| **`*.data.mcr.microsoft.com`**   | **`HTTPS:443`** | Required for MCR storage backed by the Azure content delivery network (CDN). |
| **`management.azure.com`**       | **`HTTPS:443`** | Required for Kubernetes operations against the Azure API. |
| **`login.microsoftonline.com`**  | **`HTTPS:443`** | Required for Azure Active Directory authentication. |
| **`packages.microsoft.com`**     | **`HTTPS:443`** | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| **`acs-mirror.azureedge.net`**   | **`HTTPS:443`** | This address is for the repository required to download and install required binaries like kubenet and Azure CNI. |

### Microsoft Azure operated by 21Vianet required network rules


| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| **`*:1194`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.Region:1194`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:1194`** <br/> *Or* <br/> **`APIServerPublicIP:1194`** `(only known after cluster creation)`  | UDP           | 1194      | For tunneled secure communication between the nodes and the control plane. |
| **`*:9000`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:9000`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:9000`** <br/> *Or* <br/> **`APIServerPublicIP:9000`** `(only known after cluster creation)`  | TCP           | 9000      | For tunneled secure communication between the nodes and the control plane. |
| **`*:22`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:22`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:22`** <br/> *Or* <br/> **`APIServerPublicIP:22`** `(only known after cluster creation)`  | TCP           | 22      | For tunneled secure communication between the nodes and the control plane. |
| **`*:123`** or **`ntp.ubuntu.com:123`** (if using Azure Firewall network rules)  | UDP      | 123     | Required for Network Time Protocol (NTP) time synchronization on Linux nodes.                 |
| **`CustomDNSIP:53`** `(if using custom DNS servers)`                             | UDP      | 53      | If you're using custom DNS servers, you must ensure they're accessible by the cluster nodes. |
| **`APIServerPublicIP:443`** `(if running pods/deployments that access the API Server)` | TCP      | 443     | Required if running pods/deployments that access the API Server, those pod/deployments would use the API IP.  |

### Microsoft Azure operated by 21Vianet required FQDN / application rules

| Destination FQDN                               | Port            | Use      |
|------------------------------------------------|-----------------|----------|
| **`*.hcp.<location>.cx.prod.service.azk8s.cn`**| **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| **`*.tun.<location>.cx.prod.service.azk8s.cn`**| **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed. |
| **`mcr.microsoft.com`**                        | **`HTTPS:443`** | Required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts (for example, coreDNS, etc.). These images are required for the correct creation and functioning of the cluster, including scale and upgrade operations. |
| **`.data.mcr.microsoft.com`**                  | **`HTTPS:443`** | Required for MCR storage backed by the Azure Content Delivery Network (CDN). |
| **`management.chinacloudapi.cn`**              | **`HTTPS:443`** | Required for Kubernetes operations against the Azure API. |
| **`login.chinacloudapi.cn`**                   | **`HTTPS:443`** | Required for Azure Active Directory authentication. |
| **`packages.microsoft.com`**                   | **`HTTPS:443`** | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| **`*.azk8s.cn`**                               | **`HTTPS:443`** | This address is for the repository required to download and install required binaries like kubenet and Azure CNI. |

### Azure US Government required network rules

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| **`*:1194`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:1194`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:1194`** <br/> *Or* <br/> **`APIServerPublicIP:1194`** `(only known after cluster creation)`  | UDP           | 1194      | For tunneled secure communication between the nodes and the control plane. |
| **`*:9000`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:9000`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:9000`** <br/> *Or* <br/> **`APIServerPublicIP:9000`** `(only known after cluster creation)`  | TCP           | 9000      | For tunneled secure communication between the nodes and the control plane. |
| **`*:123`** or **`ntp.ubuntu.com:123`** (if using Azure Firewall network rules)  | UDP      | 123     | Required for Network Time Protocol (NTP) time synchronization on Linux nodes.                 |
| **`CustomDNSIP:53`** `(if using custom DNS servers)`                             | UDP      | 53      | If you're using custom DNS servers, you must ensure they're accessible by the cluster nodes. |
| **`APIServerPublicIP:443`** `(if running pods/deployments that access the API Server)` | TCP      | 443     | Required if running pods/deployments that access the API Server, those pods/deployments would use the API IP.  |

### Azure US Government required FQDN / application rules

| Destination FQDN                                        | Port            | Use      |
|---------------------------------------------------------|-----------------|----------|
| **`*.hcp.<location>.cx.aks.containerservice.azure.us`** | **`HTTPS:443`** | Required for Node <-> API server communication. Replace *\<location\>* with the region where your AKS cluster is deployed.|
| **`mcr.microsoft.com`**                                 | **`HTTPS:443`** | Required to access images in Microsoft Container Registry (MCR). This registry contains first-party images/charts (for example, coreDNS, etc.). These images are required for the correct creation and functioning of the cluster, including scale and upgrade operations. |
| **`*.data.mcr.microsoft.com`**                          | **`HTTPS:443`** | Required for MCR storage backed by the Azure content delivery network (CDN). |
| **`management.usgovcloudapi.net`**                      | **`HTTPS:443`** | Required for Kubernetes operations against the Azure API. |
| **`login.microsoftonline.us`**                          | **`HTTPS:443`** | Required for Azure Active Directory authentication. |
| **`packages.microsoft.com`**                            | **`HTTPS:443`** | This address is the Microsoft packages repository used for cached *apt-get* operations.  Example packages include Moby, PowerShell, and Azure CLI. |
| **`acs-mirror.azureedge.net`**                          | **`HTTPS:443`** | This address is for the repository required to install required binaries like kubenet and Azure CNI. |

## Optional recommended FQDN / application rules for AKS clusters

The following FQDN / application rules aren't required, but are recommended for AKS clusters:

| Destination FQDN                                                               | Port          | Use      |
|--------------------------------------------------------------------------------|---------------|----------|
| **`security.ubuntu.com`, `azure.archive.ubuntu.com`, `changelogs.ubuntu.com`** | **`HTTP:80`** | This address lets the Linux cluster nodes download the required security patches and updates. |

If you choose to block/not allow these FQDNs, the nodes will only receive OS updates when you do a [node image upgrade](node-image-upgrade.md) or [cluster upgrade](upgrade-cluster.md). Keep in mind that node image upgrades also come with updated packages including security fixes.

## GPU enabled AKS clusters required FQDN / application rules

| Destination FQDN                        | Port      | Use      |
|-----------------------------------------|-----------|----------|
| **`nvidia.github.io`**                  | **`HTTPS:443`** | This address is used for correct driver installation and operation on GPU-based nodes. |
| **`us.download.nvidia.com`**            | **`HTTPS:443`** | This address is used for correct driver installation and operation on GPU-based nodes. |
| **`download.docker.com`**             | **`HTTPS:443`** | This address is used for correct driver installation and operation on GPU-based nodes. |

## Windows Server based node pools required FQDN / application rules

| Destination FQDN                                                           | Port      | Use      |
|----------------------------------------------------------------------------|-----------|----------|
| **`onegetcdn.azureedge.net, go.microsoft.com`**                            | **`HTTPS:443`** | To install windows-related binaries |
| **`*.mp.microsoft.com, www.msftconnecttest.com, ctldl.windowsupdate.com`** | **`HTTP:80`**   | To install windows-related binaries |

If you choose to block/not allow these FQDNs, the nodes will only receive OS updates when you do a [node image upgrade](node-image-upgrade.md) or [cluster upgrade](upgrade-cluster.md). Keep in mind that Node Image Upgrades also come with updated packages including security fixes.

## AKS addons and integrations

### Microsoft Defender for Containers

#### Required FQDN / application rules

| FQDN                                                       | Port      | Use      |
|------------------------------------------------------------|-----------|----------|
| **`login.microsoftonline.com`** <br/> **`login.microsoftonline.us`** (Azure Government) <br/> **`login.microsoftonline.cn`** (Azure operated by 21Vianet) | **`HTTPS:443`** | Required for Active Directory Authentication. |
| **`*.ods.opinsights.azure.com`** <br/> **`*.ods.opinsights.azure.us`** (Azure Government) <br/> **`*.ods.opinsights.azure.cn`** (Azure operated by 21Vianet)| **`HTTPS:443`** | Required for Microsoft Defender to upload security events to the cloud.|
| **`*.oms.opinsights.azure.com`** <br/> **`*.oms.opinsights.azure.us`** (Azure Government) <br/> **`*.oms.opinsights.azure.cn`** (Azure operated by 21Vianet)| **`HTTPS:443`** | Required to Authenticate with LogAnalytics workspaces.|

### CSI Secret Store

#### Required FQDN / application rules

| FQDN                                          | Port      | Use      |
|-----------------------------------------------|-----------|----------|
| **`vault.azure.net`** | **`HTTPS:443`** | Required for CSI Secret Store addon pods to talk to Azure KeyVault server.|

### Azure Monitor for containers

There are two options to provide access to Azure Monitor for containers:

- Allow the Azure Monitor [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags).
- Provide access to the required FQDN/application rules.

#### Required network rules

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureMonitor:443`**  | TCP           | 443      | This endpoint is used to send metrics data and logs to Azure Monitor and Log Analytics. |

#### Required FQDN / application rules

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| **`dc.services.visualstudio.com`** | **`HTTPS:443`**    | This endpoint is used for metrics and monitoring telemetry using Azure Monitor. |
| **`*.ods.opinsights.azure.com`**    | **`HTTPS:443`**    | This endpoint is used by Azure Monitor for ingesting log analytics data. |
| **`*.oms.opinsights.azure.com`** | **`HTTPS:443`** | This endpoint is used by omsagent, which is used to authenticate the log analytics service. |
| **`*.monitoring.azure.com`** | **`HTTPS:443`** | This endpoint is used to send metrics data to Azure Monitor. |

### Azure Policy

#### Required FQDN / application rules

| FQDN                                          | Port      | Use      |
|-----------------------------------------------|-----------|----------|
| **`data.policy.core.windows.net`** | **`HTTPS:443`** | This address is used to pull the Kubernetes policies and to report cluster compliance status to policy service. |
| **`store.policy.core.windows.net`** | **`HTTPS:443`** | This address is used to pull the Gatekeeper artifacts of built-in policies. |
| **`dc.services.visualstudio.com`** | **`HTTPS:443`** | Azure Policy add-on that sends telemetry data to applications insights endpoint. |

#### Microsoft Azure operated by 21Vianet required FQDN / application rules

| FQDN                                          | Port      | Use      |
|-----------------------------------------------|-----------|----------|
| **`data.policy.azure.cn`** | **`HTTPS:443`** | This address is used to pull the Kubernetes policies and to report cluster compliance status to policy service. |
| **`store.policy.azure.cn`** | **`HTTPS:443`** | This address is used to pull the Gatekeeper artifacts of built-in policies. |

#### Azure US Government required FQDN / application rules

| FQDN                                          | Port      | Use      |
|-----------------------------------------------|-----------|----------|
| **`data.policy.azure.us`** | **`HTTPS:443`** | This address is used to pull the Kubernetes policies and to report cluster compliance status to policy service. |
| **`store.policy.azure.us`** | **`HTTPS:443`** | This address is used to pull the Gatekeeper artifacts of built-in policies. |

## Cluster extensions

### Required FQDN / application rules

| FQDN | Port               | Use |
|-----------------------------------------------|-----------|----------|
| **`<region>.dp.kubernetesconfiguration.azure.com`** | **`HTTPS:443`** | This address is used to fetch configuration information from the Cluster Extensions service and report extension status to the service.|
| **`mcr.microsoft.com, *.data.mcr.microsoft.com`** | **`HTTPS:443`** | This address is required to pull container images for installing cluster extension agents on AKS cluster.|
|**`arcmktplaceprod.azurecr.io`**|**`HTTPS:443`**|This address is required to pull container images for installing marketplace extensions on AKS cluster.|
|**`*.ingestion.msftcloudes.com, *.microsoftmetrics.com`**|**`HTTPS:443`**|This address is used to send agents metrics data to Azure.|
|**`marketplaceapi.microsoft.com`**|**`HTTPS: 443`**|This address is used to send custom meter-based usage to the commerce metering API.|

#### Azure US Government required FQDN / application rules

| FQDN | Port | Use |
|-----------------------------------------------|-----------|----------|
| **`<region>.dp.kubernetesconfiguration.azure.us`** | **`HTTPS:443`** | This address is used to fetch configuration information from the Cluster Extensions service and report extension status to the service. |
| **`mcr.microsoft.com, *.data.mcr.microsoft.com`** | **`HTTPS:443`** | This address is required to pull container images for installing cluster extension agents on AKS cluster.|

> [!NOTE]
>
> For any addons that aren't explicitly stated here, the core requirements cover it.

## Next steps

In this article, you learned what ports and addresses to allow if you want to restrict egress traffic for the cluster.

If you want to restrict how pods communicate between themselves and East-West traffic restrictions within cluster see [Secure traffic between pods using network policies in AKS][use-network-policies].

<!-- LINKS - internal -->

[private-clusters]: ./private-clusters.md
[use-network-policies]: ./use-network-policies.md
