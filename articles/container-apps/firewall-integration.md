---
title: Securing a custom VNET in Azure Container Apps Preview
description: Firewall settings to secure a custom VNET in Azure Container Apps Preview
services: container-apps
author: JennyLawrance
ms.service: container-apps
ms.topic:  reference
ms.date: 4/15/2022
ms.author: jennylaw
---

# Securing a custom VNET in Azure Container Apps

Firewall settings Network Security Groups (NSGs) needed to configure virtual networks closely resemble the settings required by Kubernetes.

Some outbound dependencies of Azure Kubernetes Service (AKS) clusters rely exclusively on fully qualified domain names (FQDN), therefore securing an AKS cluster purely with NSGs isn't possible. Refer to [Control egress traffic for cluster nodes in Azure Kubernetes Service](/azure/aks/limit-egress-traffic) for details.

* You can lock down a network via NSGs with more restrictive rules than the default NSG rules.
* To fully secure a cluster, use a combination of NSGs and a firewall.

## NSG allow rules

The following tables describe how to configure a collection of NSG allow rules.

### Inbound

| Protocol | Port | ServiceTag | Description |
|--|--|--|--|
| Any | \* | Infrastructure subnet address space | Allow communication between IPs in the infrastructure subnet. This address is passed to as a parameter when you create an environment. For example, `10.0.0.0/21`. |

### Outbound with ServiceTags

| Protocol | Port | ServiceTag | Description
|--|--|--|--|
| UDP | `1194` | `AzureCloud.<REGION>` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | `9000` | `AzureCloud.<REGION>` | Required for internal AKS secure connection between underlying nodes and control plane. Replace `<REGION>` with the region where your container app is deployed. |
| TCP | `443` | `AzureMonitor` | Allows outbound calls to Azure Monitor. |

### Outbound with wild card IP rules

As the following rules require allowing all IPs, use a Firewall solution to lock down to specific FQDNs.

| Protocol | Port | IP | Description |
|--|--|--|--|
| TCP | `443` | \* | Allow all outbound on port `443` provides a way to allow all FQDN based outbound dependencies that don't have a static IP. |
| UDP | `123` | \* | NTP server. If using firewall, allowlist `ntp.ubuntu.com:123`. |
| Any | \* | Infrastructure subnet address space | Allow communication between IPs in the infrastructure subnet. This address is passed as a parameter when you create an environment. For example, `10.0.0.0/21`. |

## Firewall configuration

Using custom user-defined routes (UDRs) or ExpressRoutes, other than with UDRs of selected destinations that you own, are not yet supported for Container App Environments with VNETs. 
