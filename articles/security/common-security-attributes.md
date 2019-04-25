---
title: Security attributes for Azure services
description: A checklist of common security attributes for evaluating Azure Service Fabric
services: security
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: security
ms.topic: conceptual
ms.date: 04/03/2019
ms.author: mbaldwin

---
# Common security attributes for Azure services

Security is integrated into every aspect of an Azure service. This article collects the common security attributes for selected Azure services. 

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]


## [Azure Backup](../backup/backup-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | Using storage service encryption for storage accounts. |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| No | Using HTTPS. |
| Encryption Key Handling (CMK, BYOK, etc.)| No |  |
| Column Level Encryption (Azure Data Services)| No |  |
| API calls encrypted| Yes |  |

### Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| No |  |
| vNET Injection support| No |  |
| Network Isolation / Firewalling support| Yes | Forced tunneling is supported for VM backup. Forced tunneling is not supported for workloads running inside VMs. |
| Support for forced tunneling | No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Log Analytics is supported via diagnostic logs. See Monitor Azure Backup protected workloads using Log Analytics (https://azure.microsoft.com/blog/monitor-all-azure-backup-protected-workloads-using-log-analytics/) for more information. |

### IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Authentication is through Azure Active Directory. |
| Access management - Authorization| Yes | Customer created and built-in RBAC roles are used. See Use Role-Based Access Control to manage Azure Backup recovery points (/azure/backup/backup-rbac-rs-vault) for more information. |


### Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit| Yes | All customer triggered actions from the Azure portal are logged to activity logs. |
| Data plane Logging and Audit| No | Azure Backup data plane can't be reached directly.  |

### Configuration Management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes|  |

## [Azure Key Vault](../key-vault/key-vault-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | All objects are encrypted. |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | All communication is via encrypted API calls |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | Customer controls all keys in their Key Vault. When hardware security module (HSM) backed keys are specified, a FIPS Level 2 HSM protects the key, certificate, or secret. |
| Column Level Encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Using HTTPS. |

### Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes | Using Virtual Network (Vnet) service endpoints. |
| vNET Injection support| No |  |
| Network Isolation / Firewalling support| Yes | Using Vnet firewall rules. |
| Support for forced tunneling | No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Log Analytics. |

### IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Authentication is through Azure Active Directory. |
| Access management - Authorization| Yes | Using Key Vault Access Policy. |


### Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane Logging and Audit| Yes | Using Log Analytics. |
| Data plane Logging and Audit| Yes | Using Log Analytics. |

### Access controls

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane access controls | Yes | Azure Resource Manager Role-Based Access Control (RBAC) |
| Data plane access controls (At every service level) | Yes | Key Vault Access Policy |

## [Azure Service Fabric](../service-fabric/service-fabric-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | The customer owns the cluster and the virtual machine (VM) scale set the cluster is built on. Azure disk encryption can be enabled on the virtual machine scale set. |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes |  |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | The customer owns the cluster and the virtual machine (VM) scale set the cluster is built on. Azure disk encryption can be enabled on the virtual machine scale set. |
| Column Level Encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Service Fabric API calls are made through Azure Resource Manager. A valid JSON web token (JWT) is required. |

### Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes |  |
| vNET Injection support| Yes |  |
| Network Isolation / Firewalling support| Yes | Using networking security groups (NSG). |
| Support for forced tunneling | Yes | Azure networking provides forced tunneling. |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Azure monitoring support and third-party support. |

### IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Authentication is through Azure Active Directory. |
| Access management - Authorization| Yes | Identity and access management (IAM) for calls via SFRP. Calls directly to cluster end point supports two roles: User and Admin. The customer can map the APIs to either role. |


### Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit| Yes | All control plane operations run through processes for auditing and approvals. |
| Data plane Logging and Audit| N/A | Customer owns the cluster.  |

### Configuration Management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | The service configuration is versioned and deployed using Azure Deploy. The code (application and runtime) is versioned using Azure Build.
 |

## Azure Storage

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes |  |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | Support standard HTTPS/TLS mechanisms.  Users can also encrypt data before it is transmitted to the service. |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | See [Storage Service Encryption using customer-managed keys in Azure Key Vault](../storage/common/storage-service-encryption-customer-managed-keys.md).|
| Column Level Encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes |  |

### Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes |  |
| vNET Injection support| N/A |  |
| Network Isolation / Firewalling support| Yes | |
| Support for forced tunneling | N/A |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Azure Monitor Metrics available now, Logs starting preview |

### IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Azure Active Directory, Shared key, Shared access token. |
| Access management - Authorization| Yes | Support Authorization via RBAC, POSIX ACLs, and SAS Tokens |


### Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit | Yes | Azure Resource Manager Activity Log |
| Data plane Logging and Audit| Yes | Service Diagnostic Logs, and Azure Monitor Logging starting preview  |

### Configuration Management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Support Resource Provider versioning through Azure Resource Manager APIs |