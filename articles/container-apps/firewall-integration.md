---
title: Securing a custom VNET in Azure Container Apps
description: Firewall settings to secure a custom VNET in Azure Container Apps
services: container-apps
author: JennyLawrance
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic:  reference
ms.date: 07/15/2022
ms.author: jennylaw
---

# Securing a custom VNET in Azure Container Apps

Network Security Groups (NSGs) needed to configure virtual networks closely resemble the settings required by Kubernetes.

You can lock down a network via NSGs with more restrictive rules than the default NSG rules to control all inbound and outbound traffic for the Container App Environment.

Using custom user-defined routes (UDRs) or ExpressRoutes, other than with UDRs of selected destinations that you own, are not yet supported for Container App Environments with VNETs. Therefore, securing outbound traffic with a firewall is not yet supported.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules.

### Inbound

| Protocol | Port | ServiceTag | Description |
|--|--|--|--|
| Any | \* | Infrastructure subnet address space | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/23`. |
| Any | \* | AzureLoadBalancer | Allow the Azure infrastructure load balancer to communicate with your environment. |

### Outbound with ServiceTags

| Protocol | Port | ServiceTag | Description
|--|--|--|--|
| UDP | `1194` | `AzureCloud.<REGION>` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | `9000` | `AzureCloud.<REGION>` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | `443` | `AzureMonitor` | Allows outbound calls to Azure Monitor. |

### Outbound with wild card IP rules

| Protocol | Port | IP | Description |
|--|--|--|--|
| TCP | `443` | \* | Allowing all outbound on port `443` provides a way to allow all FQDN based outbound dependencies that don't have a static IP. |
| UDP | `123` | \* | NTP server. |
| TCP | `5671` | \* | Container Apps control plane. |
| TCP | `5672` | \* | Container Apps control plane. |
| Any | \* | Infrastructure subnet address space | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/23`. |

#### Considerations

- If you are running HTTP servers, you might need to add ports `80` and `443`.
- Adding deny rules for some ports and protocols with lower priority than `65000` may cause service interruption and unexpected behavior.
