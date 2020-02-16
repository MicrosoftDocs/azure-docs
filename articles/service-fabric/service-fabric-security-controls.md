---
title: Security controls for Azure Service Fabric
description: Learn about security controls for Azure Service Fabric. Includes a checklist of built-in security controls.
author: msmbaldwin

ms.topic: conceptual
ms.date: 09/04/2019
ms.author: mbaldwin
---

# Security controls for Azure Service Fabric

This article documents the security controls built into Azure Service Fabric. 

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| Yes |  |
| Network isolation and firewalling support| Yes | Using networking security groups (NSG). |
| Forced tunneling support| Yes | Azure networking provides forced tunneling. |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Azure monitoring support and third-party support. |
| Control and management plane logging and audit| Yes | All control plane operations run through processes for auditing and approvals. |
| Data plane logging and audit| N/A | Customer owns the cluster.  |

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Identity and access management (IAM) for calls via SFRP. Calls directly to cluster end point supports two roles: User and Admin. The customer can map the APIs to either role. |

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Server-side encryption at rest: customer-managed keys (BYOK) | Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Column level encryption (Azure Data Services)| N/A |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes |  |
| API calls encrypted| Yes | Service Fabric API calls are made through Azure Resource Manager. A valid JSON web token (JWT) is required. |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | |

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).