---
title: Common security attributes for Azure Service Fabric
description: A checklist of common security attributes for evaluating Azure Service Fabric
services: service-fabric
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.service: service-fabric
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: mbaldwin

---

# Security attributes for Azure Service Fabric

This article documents the security attributes built into Azure Service Fabric. 

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes |  |
| Encryption key handling (CMK, BYOK, etc.)| Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Column level encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Service Fabric API calls are made through Azure Resource Manager. A valid JSON web token (JWT) is required. |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| Yes |  |
| Network isolation and firewalling support| Yes | Using networking security groups (NSG). |
| Forced tunneling support| Yes | Azure networking provides forced tunneling. |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Azure monitoring support and third-party support. |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Identity and access management (IAM) for calls via SFRP. Calls directly to cluster end point supports two roles: User and Admin. The customer can map the APIs to either role. |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | All control plane operations run through processes for auditing and approvals. |
| Data plane logging and audit| N/A | Customer owns the cluster.  |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | |