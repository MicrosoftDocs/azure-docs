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

# Common security attributes for Azure Service Fabric

Security is integrated into every aspect of an Azure service. This article documents the common security attributes built into Azure Service Fabric. 

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes |  |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Column Level Encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Service Fabric API calls are made through Azure Resource Manager. A valid JSON web token (JWT) is required. |

## Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes |  |
| vNET Injection support| Yes |  |
| Network Isolation / Firewalling support| Yes | Using networking security groups (NSG). |
| Support for forced tunneling | Yes | Azure networking provides forced tunneling. |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Azure monitoring support and third-party support. |

## IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Authentication is through Azure Active Directory. |
| Access management - Authorization| Yes | Identity and access management (IAM) for calls via SFRP. Calls directly to cluster end point supports two roles: User and Admin. The customer can map the APIs to either role. |


## Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit| Yes | All control plane operations run through processes for auditing and approvals. |
| Data plane Logging and Audit| N/A | Customer owns the cluster.  |

## Configuration Management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | The service configuration is versioned and deployed using Azure Deploy. The code (application and runtime) is versioned using Azure Build.