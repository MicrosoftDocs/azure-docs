---
title: Common security attributes for Azure Key Vault
description: A checklist of common security attributes for evaluating Azure Key Vault
services: key-vault
author: msmbaldwin
manager: barbkess

ms.service: key-vault
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: mbaldwin

---
# Security attributes for Azure Key Vault

This article documents the security attributes built into Azure Key Vault. 

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | All objects are encrypted. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | All communication is via encrypted API calls |
| Encryption key handling (CMK, BYOK, etc.)| Yes | The customer controls all keys in their Key Vault. When hardware security module (HSM) backed keys are specified, a FIPS Level 2 HSM protects the key, certificate, or secret. |
| Column level encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Using HTTPS. |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Using Virtual Network (VNet) service endpoints. |
| VNet injection support| No |  |
| Network isolation and firewalling support| Yes | Using VNet firewall rules. |
| Forced tunneling support| No |  |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Log Analytics. |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Using Key Vault Access Policy. |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane Logging and Audit| Yes | Using Log Analytics. |
| Data plane logging and audit| Yes | Using Log Analytics. |

## Access controls

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane access controls | Yes | Azure Resource Manager Role-Based Access Control (RBAC) |
| Data plane access controls (At every service level) | Yes | Key Vault Access Policy |