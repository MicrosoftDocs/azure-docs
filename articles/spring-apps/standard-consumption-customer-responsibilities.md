---
title: Customer responsibilities for Azure Spring Apps Standard consumption and dedicated plan in a virtual network
description: Learn about the customer responsibilities for running an Azure Spring Apps Standard consumption and dedicated plan service instance in a virtual network.
author: KarlErickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: conceptual
ms.date: 03/21/2023
ms.custom: devx-track-java
---

# Customer responsibilities for Azure Spring Apps Standard consumption and dedicated plan in a virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

This article describes the customer responsibilities for running an Azure Spring Apps Standard consumption and dedicated plan service instance in a virtual network.

Use Network Security Groups (NSGs) to configure virtual networks to conform to the settings required by Kubernetes.

To control all inbound and outbound traffic for the Azure Container Apps environment, you can use NSGs to lock down a network with more restrictive rules than the default NSG rules.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules.

> [!NOTE]
> The subnet associated with a Azure Container Apps environment requires a CIDR prefix of `/23` or larger.

### Outbound with ServiceTags

| Protocol | Port         | ServiceTag                  | Description                                                                                                                                                                                     |
|----------|--------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| UDP      | `1194`       | `AzureCloud.<region>`       | Required for internal Azure Kubernetes Service (AKS) secure connection between underlying nodes and the control plane. Replace `<region>` with the region where your container app is deployed. |
| TCP      | `9000`       | `AzureCloud.<region>`       | Required for internal AKS secure connection between underlying nodes and the control plane. Replace `<region>` with the region where your container app is deployed.                            |
| TCP      | `443`        | `AzureMonitor`              | Allows outbound calls to Azure Monitor.                                                                                                                                                         |
| TCP      | `443`        | `Azure Container Registry`  | Enables the Azure Container Registry as described in [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).                                     |
| TCP      | `443`        | `MicrosoftContainerRegistry`| The service tag for container registry for Microsoft containers.                                                                                                                                |
| TCP      | `443`        | `AzureFrontDoor.FirstParty` | A dependency of the `MicrosoftContainerRegistry` service tag.                                                                                                                                   |
| TCP      | `443`, `445` | `Azure Files`               | Enables Azure Storage as described in [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).                                                    |

### Outbound with wild card IP rules

| Protocol | Port   | IP                                  | Description                                                                                                                                                      |
|----------|--------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TCP      | `443`  | \*                                  | Set all outbound traffic on port `443` to allow all fully qualified domain name (FQDN) based outbound dependencies that don't have a static IP.                  |
| UDP      | `123`  | \*                                  | NTP server.                                                                                                                                                      |
| TCP      | `5671` | \*                                  | Container Apps control plane.                                                                                                                                    |
| TCP      | `5672` | \*                                  | Container Apps control plane.                                                                                                                                    |
| Any      | \*     | Infrastructure subnet address space | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment - for example, `10.0.0.0/21`. |

### Outbound with FQDN requirements/application rules

| Protocol | Port  | FQDN                       | Description                                                     |
|----------|-------|----------------------------|-----------------------------------------------------------------|
| TCP      | `443` | `mcr.microsoft.com`        | Microsoft Container Registry (MCR).                             |
| TCP      | `443` | `*.cdn.mscr.io`            | MCR storage backed by the Azure Content Delivery Network (CDN). |
| TCP      | `443` | `*.data.mcr.microsoft.com` | MCR storage backed by the Azure CDN.                            |

### Outbound with FQDN for third-party application performance management (optional)

| Protocol | Port     | FQDN                          | Description                                                                                                                         |
|----------|----------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| TCP      | `443/80` | `collector*.newrelic.com`     | The required networks of New Relic application and performance monitoring (APM) agents from the US region. See APM Agents Networks. |
| TCP      | `443/80` | `collector*.eu01.nr-data.net` | The required networks of New Relic APM agents from the EU region. See APM Agents Networks.                                          |
| TCP      | `443`    | `*.live.dynatrace.com`        | The required network of Dynatrace APM agents.                                                                                       |
| TCP      | `443`    | `*.live.ruxit.com`            | The required network of Dynatrace APM agents.                                                                                       |
| TCP      | `443/80` | `*.saas.appdynamics.com`      | The required network of AppDynamics APM agents. See SaaS Domains and IP Ranges.                                                     |

#### Considerations

- If you're running HTTP servers, you might need to add ports `80` and `443`.
- Adding deny rules for some ports and protocols with lower priority than `65000` may cause service interruption and unexpected behavior.

## Next steps

- [Azure Spring Apps documentation](./index.yml)
