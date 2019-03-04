---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 01/31/2019
ms.author: mbaldwin
---

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | All objects are encrypted. |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | All communication is via encrypted API calls |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | Customer controls all keys in their Key Vault. When hardware security module (HSM) backed keys are specifiecd, a FIPS Level 2 HSM protects the key, certificate, or secret. |
| Column Level Encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Using HTTPS. |

## Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes | Using Virtual Network (Vnet) service endpoints. |
| vNET Injection support| No |  |
| Network Isolation / Firewalling support| Yes | Using Vnet firewall rules. |
| Support for forced tunneling | No |  |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights etc)| Yes | Using Log Analytics. |

## IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Authentication is through Azure Active Directory. |
| Access management - Authorization| Yes | Using Key Vault Access Policy. |


## Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane Logging and Audit| Yes | Using Log Analytics. |
| Data plane Logging and Audit| Yes | Using Log Analytics. |

## Access controls

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane access controls | Yes | Azure Resource Manager Role-Based Access Control (RBAC) |
| Data plane access controls (At every service level) | Yes | Key Vault Access Policy |
