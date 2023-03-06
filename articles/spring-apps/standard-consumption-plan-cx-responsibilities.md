---
title: Customer responsibilities for Azure Spring Apps Standard consumption plan in a virtual network
description: Learn about the customer responsibilities for running Azure Spring Apps Standard Consumption plan in a virtual network.
author: karlerickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: conceptual
ms.date: 02/27/2023
ms.custom: devx-trax-java
---

# Customer responsibilities for Azure Spring Apps Standard consumption plan in a virtual network

**This article applies to:** ✔️Standard consumption (Preview) ✔️Basic/Standard ✔️Enterprise

Use Network Security Groups (NSGs) to configure virtual networks to conform to the settings required by Kubernetes.

To control all inbound and outbound traffic, for the Azure Container Apps Environment, you can lock down a network using NSGs that have more restrictive rules than the default NSG rules.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules.

>[!NOTE]
> The subnet associated with a Azure Container Apps Environment requires a CIDR prefix of `/23` or larger.

### Outbound with ServiceTags

| Protocol | Port         | ServiceTag                 | Description                                                                                                                                                      |
|-----------|---------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| UDP      | `1194`       | `AzureCloud.<region>`      | Required for internal AKS secure connection between underlying nodes and the control plane. Replace `<region>` with the region where your container app is deployed. |
| TCP      | `9000`       | `AzureCloud.<region>`      | Required for internal AKS secure connection between underlying nodes and the control plane. Replace `<region>` with the region where your container app is deployed. |
| TCP      | `443`        | `AzureMonitor`             | Allows outbound calls to Azure Monitor.                                                                                                                          |
| TCP      | `443`        | `Azure Container Registry` | Enables the *Azure Container Registry* as described in [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).  |
| TCP      | `443`, `445` | `Azure Files`              | Enables the *Azure Storage*  as described in [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).             |

### Outbound with wild card IP rules

| Protocol | Port   | IP | Description                                                                                                                   |
|-----------|---------|-----|--------------------------------------------------------------------------------------------------------------------------------|
| TCP      | `443`  | \* | Set all outbound on port `443` to allow all FQDN based outbound dependencies that don't have a static IP. |
| UDP      | `123`  | \* | NTP server.                                                                                                                   |
| TCP      | `5671` | \* | Container Apps control plane.                                                                                                 |
| TCP      | `5672` | \* | Container Apps control plane.                                                                                                 |

### Outbound with FQDN requirements/application rules

| Protocol | Port  | FQDN                       | Description                          |
|-----------|--------|-----------------------------|---------------------------------------|
| TCP      | `443` | `mcr.microsoft.com`        | Microsoft Container Registry (MCR).  |
| TCP      | `443` | `*.cdn.mscr.io`            | MCR storage backed by the Azure CDN. |
| TCP      | `443` | `*.data.mcr.microsoft.com` | MCR storage backed by the Azure CDN. |

### Outbound with FQDN for third-party application performance management (Optional)

| Protocol | Port     | FQDN                          | Description                                                                             |
|-----------|-----------|--------------------------------|------------------------------------------------------------------------------------------|
| TCP      | `443/80` | `collector*.newrelic.com`     | Required networks of New Relic APM agents from the US region, see APM Agents Networks. |
| TCP      | `443/80` | `collector*.eu01.nr-data.net` | Required networks of New Relic APM agents from the EU region, see APM Agents Networks. |
| TCP      | `443`    | `*.live.dynatrace.com`        | Required network of Dynatrace APM agents.                                               |
| TCP      | `443`    | `*.live.ruxit.com`            | Required network of Dynatrace APM agents.                                               |
| TCP      | `443/80` | `*.saas.appdynamics.com`      | Required network of AppDynamics APM agents, see SaaS Domains and IP Ranges.        |

#### Considerations

- If you are running HTTP servers, you might need to add ports `80` and `443`.
- Deny rules for some ports and protocols with lower priority than `65000` may cause service interruption and unexpected behavior.
