---
title:  "Customer Responsibilities Running Azure Spring Apps in a Virtual Network"
description: This article describes customer responsibilities running Azure Spring Apps in a virtual network.
author: KarlErickson
ms.author: karler
ms.service: azure-spring-apps
ms.topic: conceptual
ms.date: 08/28/2024
ms.custom: devx-track-java
---

# Customer responsibilities for running Azure Spring Apps in a virtual network

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article includes specifications for the use of Azure Spring Apps in a virtual network.

When Azure Spring Apps is deployed in your virtual network, it has outbound dependencies on services outside of the virtual network. For management and operational purposes, Azure Spring Apps must access certain ports and fully qualified domain names (FQDNs). Azure Spring Apps requires these endpoints to communicate with the management plane and to download and install core Kubernetes cluster components and security updates.

By default, Azure Spring Apps has unrestricted outbound (egress) internet access. This level of network access allows applications you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible for maintenance tasks. The simplest solution to secure outbound addresses is use of a firewall device that can control outbound traffic based on domain names. Azure Firewall, for example, can restrict outbound HTTP and HTTPS traffic based on the FQDN of the destination. You can also configure your preferred firewall and security rules to allow these required ports and addresses.

## Azure Spring Apps resource requirements

The following list shows the resource requirements for Azure Spring Apps services. As a general requirement, you shouldn't modify resource groups created by Azure Spring Apps and the underlying network resources.

- Don't modify resource groups created and owned by Azure Spring Apps.
  - By default, these resource groups are named `ap-svc-rt_<service-instance-name>_<region>*` and `ap_<service-instance-name>_<region>*`.
  - Don't block Azure Spring Apps from updating resources in these resource groups.
- Don't modify subnets used by Azure Spring Apps.
- Don't create more than one Azure Spring Apps service instance in the same subnet.
- When using a firewall to control traffic, don't block the following egress traffic to Azure Spring Apps components that operate, maintain, and support the service instance.

## Azure Global required network rules

| Destination endpoint                                                                                                                                                    | Port             | Use                                       | Note                                                                                                                                                                    |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| \*:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - AzureCloud:443                                                           | TCP:443          | Azure Spring Apps Service Management.     | For information about the service instance `requiredTraffics`, see the resource payload, under the `networkProfile` section.                                            |
| \*.azurecr.io:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - AzureContainerRegistry:443                                    | TCP:443          | Azure Container Registry.                 | Can be replaced by enabling the *Azure Container Registry* [service endpoint in the virtual network](../../virtual-network/virtual-network-service-endpoints-overview.md). |
| \*.core.windows.net:443 and \*.core.windows.net:445 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - Storage:443 and Storage:445 | TCP:443, TCP:445 | Azure Files                               | Can be replaced by enabling the *Azure Storage* [service endpoint in the virtual network](../../virtual-network/virtual-network-service-endpoints-overview.md).            |
| \*.servicebus.windows.net:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - EventHub:443                                      | TCP:443          | Azure Event Hubs.                         | Can be replaced by enabling the *Azure Event Hubs* [service endpoint in the virtual network](../../virtual-network/virtual-network-service-endpoints-overview.md).         |
| \*.prod.microsoftmetrics.com:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - AzureMonitor:443                                      | TCP:443          | Azure Monitor.                         | Allows outbound calls to Azure Monitor.    |

## Azure Global required FQDN / application rules

Azure Firewall provides the FQDN tag **AzureKubernetesService** to simplify the following configurations:

| Destination FQDN                  | Port      | Use                                                                          |
|-----------------------------------|-----------|------------------------------------------------------------------------------|
| <i>*.azmk8s.io</i>                | HTTPS:443 | Underlying Kubernetes Cluster management.                                    |
| <i>mcr.microsoft.com</i>          | HTTPS:443 | Microsoft Container Registry (MCR).                                          |
| <i>*.data.mcr.microsoft.com</i>   | HTTPS:443 | MCR storage backed by the Azure CDN.                                         |
| <i>management.azure.com</i>       | HTTPS:443 | Underlying Kubernetes Cluster management.                                    |
| <i>login.microsoftonline.com</i>  | HTTPS:443 | Microsoft Entra authentication.                                       |
| <i>packages.microsoft.com</i>     | HTTPS:443 | Microsoft packages repository.                                               |
| <i>acs-mirror.azureedge.net</i>   | HTTPS:443 | Repository required to install required binaries like kubenet and Azure CNI. |

## Microsoft Azure operated by 21Vianet required network rules

| Destination endpoint                                                                                                                                                              | Port             | Use                                       | Note                                                                                                                                                                    |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| \*:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - AzureCloud:443                                                                     | TCP:443          | Azure Spring Apps Service Management.     | For information about the service instance `requiredTraffics`, see the resource payload, under the `networkProfile` section.                                            |
| \*.azurecr.cn:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - AzureContainerRegistry:443                                              | TCP:443          | Azure Container Registry.                 | Can be replaced by enabling the *Azure Container Registry* [service endpoint in the virtual network](../../virtual-network/virtual-network-service-endpoints-overview.md). |
| \*.core.chinacloudapi.cn:443 and \*.core.chinacloudapi.cn:445 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - Storage:443 and Storage:445 | TCP:443, TCP:445 | Azure Files                               | Can be replaced by enabling the *Azure Storage* [service endpoint in the virtual network](../../virtual-network/virtual-network-service-endpoints-overview.md).            |
| \*.servicebus.chinacloudapi.cn:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - EventHub:443                                           | TCP:443          | Azure Event Hubs.                         | Can be replaced by enabling the *Azure Event Hubs* [service endpoint in the virtual network](../../virtual-network/virtual-network-service-endpoints-overview.md).         |
| \*.prod.microsoftmetrics.com:443 or [ServiceTag](../../virtual-network/service-tags-overview.md#available-service-tags) - AzureMonitor:443                                      | TCP:443          | Azure Monitor.                         | Allows outbound calls to Azure Monitor.    |

## Microsoft Azure operated by 21Vianet required FQDN / application rules

Azure Firewall provides the FQDN tag `AzureKubernetesService` to simplify the following configurations:

| Destination FQDN                   | Port      | Use                                                                          |
|------------------------------------|-----------|------------------------------------------------------------------------------|
| <i>*.cx.prod.service.azk8s.cn</i>  | HTTPS:443 | Underlying Kubernetes Cluster management.                                    |
| <i>mcr.microsoft.com</i>           | HTTPS:443 | Microsoft Container Registry (MCR).                                          |
| <i>*.data.mcr.microsoft.com</i>    | HTTPS:443 | MCR storage backed by the Azure CDN.                                         |
| <i>management.chinacloudapi.cn</i> | HTTPS:443 | Underlying Kubernetes Cluster management.                                    |
| <i>login.chinacloudapi.cn</i>      | HTTPS:443 | Microsoft Entra authentication.                                       |
| <i>packages.microsoft.com</i>      | HTTPS:443 | Microsoft packages repository.                                               |
| <i>*.azk8s.cn</i>                  | HTTPS:443 | Repository required to install required binaries like kubenet and Azure CNI. |

## Azure Spring Apps optional FQDN for third-party application performance management

| Destination FQDN                   | Port       | Use                                                                                                                                                                                                         |
|------------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <i>collector*.newrelic.com</i>     | TCP:443/80 | Required networks of New Relic APM agents from US region, also see [APM Agents Networks](https://docs.newrelic.com/docs/using-new-relic/cross-product-functions/install-configure/networks/#agents).        |
| <i>collector*.eu01.nr-data.net</i> | TCP:443/80 | Required networks of New Relic APM agents from EU region, also see [APM Agents Networks](https://docs.newrelic.com/docs/using-new-relic/cross-product-functions/install-configure/networks/#agents).        |
| <i>*.live.dynatrace.com</i>        | TCP:443    | Required network of Dynatrace APM agents.                                                                                                                                                                   |
| <i>*.live.ruxit.com</i>            | TCP:443    | Required network of Dynatrace APM agents.                                                                                                                                                                   |
| <i>*.saas.appdynamics.com</i>      | TCP:443/80 | Required network of AppDynamics APM agents, also see [SaaS Domains and IP Ranges](https://docs.appdynamics.com/appd/24.x/25.1/en/splunk-appdynamics-essentials/getting-started/saas-domains-and-ip-ranges). |

## Azure Spring Apps optional FQDN for Application Insights

You need to open some outgoing ports in your server's firewall to allow the Application Insights SDK or the Application Insights Agent to send data to the portal. For more information, see the [Outgoing ports](/azure/azure-monitor/ip-addresses#outgoing-ports) section of [IP addresses used by Azure Monitor](/azure/azure-monitor/ip-addresses).

## VirtualNetwork service tag

Azure network security groups can filter network traffic within an Azure virtual network. When you enable inbound network traffic using the `VirtualNetwork` service tag, it automatically includes all IP address ranges of the workload virtual network and any peered transit virtual networks.

For Azure Spring Apps running on Azure Kubernetes Service (AKS), the AKS infrastructure manages the IP address prefixes for workloads on all AKS node pools. These prefixes are implicitly included in the `VirtualNetwork` service tag. This design ensures that applications remain accessible within the virtual network, even if their IP addresses fall outside the defined IP range of the virtual network.

If you decide not to allow traffic using the `VirtualNetwork` service tag, you must configure specific rules to allow communication between the Azure Spring Apps service runtime subnet and the apps subnet. Furthermore, you need to explicitly allow traffic from the Azure Spring Apps reserved Classless Inter-Domain Routing (CIDR) range, which is used by the underlying AKS infrastructure. You can't add only part of the CIDR range to the allow list because the address prefix for workloads is dynamic.

## Next steps

- [Access your application in a private network](access-app-virtual-network.md)
- [Expose applications with end-to-end TLS in a virtual network](expose-apps-gateway-end-to-end-tls.md)
