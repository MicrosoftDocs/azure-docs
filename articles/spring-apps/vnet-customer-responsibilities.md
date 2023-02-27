---
title:  "Customer responsibilities running Azure Spring Apps in a virtual network"
description: This article describes customer responsibilities running Azure Spring Apps in a virtual network.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: conceptual
ms.date: 27/02/2023
ms.custom: devx-track-java, event-tier1-build-2022
---

# Customer responsibilities for running Azure Spring Apps in a virtual network

#### [Standard/Enterprise Tier](#tab/Standard-Enterprise-Tier)

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article includes specifications for the use of Azure Spring Apps in a virtual network.

When Azure Spring Apps is deployed in your virtual network, it has outbound dependencies on services outside of the virtual network. For management and operational purposes, Azure Spring Apps must access certain ports and fully qualified domain names (FQDNs). Azure Spring Apps requires these endpoints to communicate with the management plane and to download and install core Kubernetes cluster components and security updates.

By default, Azure Spring Apps has unrestricted outbound (egress) internet access. This level of network access allows applications you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible for maintenance tasks. The simplest solution to secure outbound addresses is use of a firewall device that can control outbound traffic based on domain names. Azure Firewall, for example, can restrict outbound HTTP and HTTPS traffic based on the FQDN of the destination. You can also configure your preferred firewall and security rules to allow these required ports and addresses.

## Azure Spring Apps resource requirements

The following list shows the resource requirements for Azure Spring Apps services. As a general requirement, you shouldn't modify resource groups created by Azure Spring Apps and the underlying network resources.

- Don't modify resource groups created and owned by Azure Spring Apps.
  - By default, these resource groups are named as `ap-svc-rt_[SERVICE-INSTANCE-NAME]_[REGION]*` and `ap_[SERVICE-INSTANCE-NAME]_[REGION]*`.
  - Don't block Azure Spring Apps from updating resources in these resource groups.
- Don't modify subnets used by Azure Spring Apps.
- Don't create more than one Azure Spring Apps service instance in the same subnet.
- When using a firewall to control traffic, don't block the following egress traffic to Azure Spring Apps components that operate, maintain, and support the service instance.

## Azure Spring Apps network requirements

| Destination Endpoint                                                                                                                                                    | Port             | Use                                       | Note                                                                                                                                                            |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| \*:443 *or* [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - AzureCloud:443                                                           | TCP:443          | Azure Spring Apps Service Management.     | Information of service instance "requiredTraffics" could be known in resource payload, under "networkProfile" section.                                          |
| \*:123 *or* ntp.ubuntu.com:123                                                                                                                                          | UDP:123          | NTP time synchronization on Linux nodes.  |                                                                                                                                                                 |
| \*.azurecr.io:443 *or* [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - AzureContainerRegistry:443                                      | TCP:443          | Azure Container Registry.                 | Can be replaced by enabling *Azure Container Registry* [service endpoint in virtual network](../virtual-network/virtual-network-service-endpoints-overview.md). |
| \*.core.windows.net:443 and \*.core.windows.net:445 *or* [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Storage:443 and Storage:445 | TCP:443, TCP:445 | Azure Files                               | Can be replaced by enabling *Azure Storage* [service endpoint in virtual network](../virtual-network/virtual-network-service-endpoints-overview.md).            |
| \*.servicebus.windows.net:443 *or* [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - EventHub:443                                      | TCP:443          | Azure Event Hubs.                         | Can be replaced by enabling *Azure Event Hubs* [service endpoint in virtual network](../virtual-network/virtual-network-service-endpoints-overview.md).         |

## Azure Spring Apps FQDN requirements/application rules

Azure Firewall provides the FQDN tag **AzureKubernetesService** to simplify the following configurations:

| Destination FQDN                  | Port      | Use                                                                          |
|-----------------------------------|-----------|------------------------------------------------------------------------------|
| <i>*.azmk8s.io</i>                | HTTPS:443 | Underlying Kubernetes Cluster management.                                    |
| <i>mcr.microsoft.com</i>          | HTTPS:443 | Microsoft Container Registry (MCR).                                          |
| <i>*.cdn.mscr.io</i>              | HTTPS:443 | MCR storage backed by the Azure CDN.                                         |
| <i>*.data.mcr.microsoft.com</i>   | HTTPS:443 | MCR storage backed by the Azure CDN.                                         |
| <i>management.azure.com</i>       | HTTPS:443 | Underlying Kubernetes Cluster management.                                    |
| <i>*login.microsoftonline.com</i> | HTTPS:443 | Azure Active Directory authentication.                                       |
| <i>*login.microsoft.com</i>       | HTTPS:443 | Azure Active Directory authentication.                                       |
| <i>packages.microsoft.com</i>     | HTTPS:443 | Microsoft packages repository.                                               |
| <i>acs-mirror.azureedge.net</i>   | HTTPS:443 | Repository required to install required binaries like kubenet and Azure CNI. |
| *mscrl.microsoft.com*<sup>1</sup> | HTTPS:80  | Required Microsoft Certificate Chain Paths.                                  |
| *crl.microsoft.com*<sup>1</sup>   | HTTPS:80  | Required Microsoft Certificate Chain Paths.                                  |
| *crl3.digicert.com*<sup>1</sup>   | HTTPS:80  | Third-Party TLS/SSL Certificate Chain Paths.                                 |

<sup>1</sup> Please note that these FQDNs aren't included in the FQDN tag.

## Azure Spring Apps optional FQDN for third-party application performance management

| Destination FQDN                   | Port       | Use                                                                                                                                                                                                  |
|------------------------------------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <i>collector*.newrelic.com</i>     | TCP:443/80 | Required networks of New Relic APM agents from US region, also see [APM Agents Networks](https://docs.newrelic.com/docs/using-new-relic/cross-product-functions/install-configure/networks/#agents). |
| <i>collector*.eu01.nr-data.net</i> | TCP:443/80 | Required networks of New Relic APM agents from EU region, also see [APM Agents Networks](https://docs.newrelic.com/docs/using-new-relic/cross-product-functions/install-configure/networks/#agents). |
| <i>*.live.dynatrace.com</i>        | TCP:443    | Required network of Dynatrace APM agents.                                                                                                                                                            |
| <i>*.live.ruxit.com</i>            | TCP:443    | Required network of Dynatrace APM agents.                                                                                                                                                            |
| <i>*.saas.appdynamics.com</i>      | TCP:443/80 | Required network of AppDynamics APM agents, also see [SaaS Domains and IP Ranges](https://docs.appdynamics.com/display/PAA/SaaS+Domains+and+IP+Ranges).                                              |

#### [StandardGen2 Tier](#tab/StandardGen2-Tier)

Network Security Groups (NSGs) needed to configure virtual networks closely resemble the settings required by Kubernetes.

You can lock down a network via NSGs with more restrictive rules than the default NSG rules to control all inbound and outbound traffic for the Container App Environment.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules.

>[!NOTE]
> The subnet associated with a Container App Environment requires a CIDR prefix of `/23` or larger.

### Inbound

| Protocol | Port | ServiceTag | Description |
|--|--|--|--|
| Any | \* | Infrastructure subnet address space | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. |
| Any | \* | AzureLoadBalancer | Allow the Azure infrastructure load balancer to communicate with your environment. |

### Outbound with ServiceTags

| Protocol | Port | ServiceTag | Description
|--|--|--|--|
| UDP | `1194` | `AzureCloud.<REGION>` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | `9000` | `AzureCloud.<REGION>` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | `443` | `AzureMonitor` | Allows outbound calls to Azure Monitor. |
| TCP | `443` | `Azure Container Registry` |  Can be replaced by enabling *Azure Container Registry* [service endpoint in virtual network](../virtual-network/virtual-network-service-endpoints-overview.md). |
| TCP | `443`, `445` | `Azure Files` | Can be replaced by enabling *Azure Storage* [service endpoint in virtual network](../virtual-network/virtual-network-service-endpoints-overview.md). |

### Outbound with wild card IP rules

| Protocol | Port | IP | Description |
|--|--|--|--|
| TCP | `443` | \* | Allowing all outbound on port `443` provides a way to allow all FQDN based outbound dependencies that don't have a static IP. |
| UDP | `123` | \* | NTP server. |
| TCP | `5671` | \* | Container Apps control plane. |
| TCP | `5672` | \* | Container Apps control plane. |
| Any | \* | Infrastructure subnet address space | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. |

### Outbound with FQDN requirements/application rules
| Protocol | Port | FQDN | Description |
|--|--|--|--|
| TCP | `443` | `mcr.microsoft.com` | Microsoft Container Registry (MCR). |
| TCP | `443` | `*.cdn.mscr.io` | MCR storage backed by the Azure CDN. |
| TCP | `443` | `*.data.mcr.microsoft.com` | MCR storage backed by the Azure CDN. |

### [Optional] Outbound with FQDN for third-party application performance management

| Protocol | Port | FQDN | Description |
|--|--|--|--|
| TCP | `443/80` | `collector*.newrelic.com` | Required networks of New Relic APM agents from US region, also see APM Agents Networks. |
| TCP | `443/80` | `collector*.eu01.nr-data.net` | Required networks of New Relic APM agents from EU region, also see APM Agents Networks. |
| TCP | `443` | `*.live.dynatrace.com` | Required network of Dynatrace APM agents. |
| TCP | `443` | `*.live.ruxit.com` | Required network of Dynatrace APM agents. |
| TCP | `443/80` | `*.saas.appdynamics.com` | Required network of AppDynamics APM agents, also see SaaS Domains and IP Ranges. |

#### Considerations

- If you are running HTTP servers, you might need to add ports `80` and `443`.
- Adding deny rules for some ports and protocols with lower priority than `65000` may cause service interruption and unexpected behavior.


## Next steps

- [Access your application in a private network](access-app-virtual-network.md)
- [Expose applications with end-to-end TLS in a virtual network](expose-apps-gateway-end-to-end-tls.md)
