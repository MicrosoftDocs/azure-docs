---
title:  "Customer responsibilities running Azure Spring Apps Standard Consumption plan in a virtual network"
description: This article describes customer responsibilities running Azure Spring Apps Standard Consumption plan in a virtual network.
author: xuycao
ms.author: xuycao
ms.service: spring-apps
ms.topic: conceptual
ms.date: 02/27/2023
---

# Customer responsibilities for running Azure Spring Apps Standard Consumption plan in a virtual network

**This article applies to:** ✔️ Standard Consumption plan ❌ Basic/Standard tier ❌ Enterprise tier

Network Security Groups (NSGs) needed to configure virtual networks closely resemble the settings required by Kubernetes.

You can lock down a network via NSGs with more restrictive rules than the default NSG rules to control all inbound and outbound traffic for the Container App Environment.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules.

>[!NOTE]
> The subnet associated with a Container App Environment requires a CIDR prefix of `/23` or larger.

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
