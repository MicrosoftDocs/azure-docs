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
# Security attributes for Azure services

This article collects the common security attributes for selected Azure services. 

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## [Azure API Management(../api-management-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes (service-side encryption only) | Sensitive data such as certificates, keys, and secret-named values are encrypted with service-managed, per service instance keys. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | [Express Route](../expressroute/index.yml) and VNet encryption is provided by [Azure networking](../virtual-network/index.yml). |
| Encryption key handling (CMK, BYOK, etc.)| No | All encryption keys are per service instance and are service managed. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Management plane calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) over TLS. A valid JSON web token (JWT) is required.  Data plane calls can be secured with TLS and one of supported authentication mechanisms (e.g. client certificate or JWT).
 |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No | |
| VNet injection support| Yes | |
| Network isolation and firewalling support| Yes | Using networking security groups (NSG) and Azure Application Gateway (or other software appliance) respectively. |
| Forced tunneling support| Yes | Azure networking provides forced tunneling. |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | |
| Authorization| Yes | |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | [Azure Monitor activity logs](../azure-monitor/platform/activity-logs-overview.md) |
| Data plane logging and audit| Yes | [Azure Monitor diagnostic logs](../azure-monitor/platform/diagnostic-logs-overview.md) and (optionally) [Azure Application Insights](../azure-monitor/app/app-insights-overview.md).  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Using the [Azure API Management DevOps Resource Kit](https://aka.ms/apimdevops) |


## [Azure Backup](../backup/backup-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | Using storage service encryption for storage accounts. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| No | Using HTTPS. |
| Encryption key handling (CMK, BYOK, etc.)| No |  |
| Column level encryption (Azure Data Services)| No |  |
| API calls encrypted| Yes |  |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No |  |
| VNet injection support| No |  |
| Network isolation and firewalling support| Yes | Forced tunneling is supported for VM backup. Forced tunneling is not supported for workloads running inside VMs. |
| Forced tunneling support| No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Log Analytics is supported via diagnostic logs. See Monitor Azure Backup protected workloads using Log Analytics (https://azure.microsoft.com/blog/monitor-all-azure-backup-protected-workloads-using-log-analytics/) for more information. |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Customer created and built-in RBAC roles are used. See Use Role-Based Access Control to manage Azure Backup recovery points (/azure/backup/backup-rbac-rs-vault) for more information. |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | All customer triggered actions from the Azure portal are logged to activity logs. |
| Data plane logging and audit| No | Azure Backup data plane can't be reached directly.  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes|  |


## [Azure Key Vault](../key-vault/key-vault-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | All objects are encrypted. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | All communication is via encrypted API calls |
| Encryption key handling (CMK, BYOK, etc.)| Yes | Customer controls all keys in their Key Vault. When hardware security module (HSM) backed keys are specified, a FIPS Level 2 HSM protects the key, certificate, or secret. |
| Column level encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Using HTTPS. |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Using Virtual Network (VNet) service endpoints. |
| VNet injection support| No |  |
| Network isolation and firewalling support| Yes | Using VNet firewall rules. |
| Forced tunneling support| No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Log Analytics. |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Using Key Vault Access Policy. |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane Logging and Audit| Yes | Using Log Analytics. |
| Data plane logging and audit| Yes | Using Log Analytics. |

### Access controls

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management plane access controls | Yes | Azure Resource Manager Role-Based Access Control (RBAC) |
| Data plane access controls (At every service level) | Yes | Key Vault Access Policy |

## [Azure Relay](../service-bus-relay/service-bus-relay-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>|  N/A | Relay is a web socket and does not persist data. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | Service requires TLS. |
| Encryption key handling (CMK, BYOK, etc.)| No | Uses Microsoft TLS certs only.  |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | HTTPS. |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No |  |
| Network isolation and firewalling support| No |  |
| Forced tunneling support| N/A | Relay is the TLS tunnel  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Via SAS. |
| Authorization|  Yes | Via SAS. |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml). |
| Data plane logging and audit| Yes | Connection success / failure and errors and logged.  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml).|



## [Azure Resource Manager](../azure-resource-manager/azure-resource-manager-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes |  |
| Encryption in transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | HTTPS/TLS. |
| Encryption key handling (CMK, BYOK, etc.)| N/A | Azure Resource Manager stores no customer content, only control data. |
| Column level encryption (Azure Data Services)| Yes | |
| API calls encrypted| Yes | |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No | |
| VNet injection support| Yes | |
| Network isolation and firewalling support| No |  |
| Forced tunneling support| No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| No | |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | [Azure Active Directory](/azure/active-directory) based.|
| Authorization| Yes | |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Activity logs expose all write operations (PUT, POST, DELETE) performed on your resources; see [View activity logs to audit actions on resources](../azure-resource-manager/resource-group-audit.md). |
| Data plane logging and audit| N/A | |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  |


## [Azure Service Bus Messaging](../service-bus-messaging/service-bus-messaging-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>|  Yes for server-side encryption-at-rest by default. | Customer managed keys and BYOK are not yet supported. Client side encryption is the client's responsibility |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | Supports standard HTTPS/TLS mechanism. |
| Encryption key handling (CMK, BYOK, etc.)| No |   |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | API calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes (Premium tier only) | VNet service endpoints are supported for [Service Bus Premium tier](../service-bus-messaging/service-bus-premium-messaging.md) only. |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes (Premium tier only) |  |
| Forced tunneling support| No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Supported via [Azure Monitor and Alerts](../service-bus-messaging/service-bus-metrics-azure-monitor.md). |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Managed through [Azure Active Directory Managed Service Identity](../service-bus-messaging/service-bus-managed-service-identity.md); see [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md).|
| Authorization| Yes | Supports authorization via [RBAC](../service-bus-messaging/service-bus-role-based-access-control.md) (Preview) and SAS token; see [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md). |

### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Operations logs are available; see [Service Bus diagnostic logs](../service-bus-messaging/service-bus-diagnostic-logs.md).  |
| Data plane logging and audit| No |  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Supports resource provider versioning through the [Azure Resource Manager API](/rest/api/resources/).|


## [Azure Service Fabric](../service-fabric/service-fabric-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | The customer owns the cluster and the virtual machine (VM) scale set the cluster is built on. Azure disk encryption can be enabled on the virtual machine scale set. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes |  |
| Encryption key handling (CMK, BYOK, etc.)| Yes | The customer owns the cluster and the virtual machine (VM) scale set the cluster is built on. Azure disk encryption can be enabled on the virtual machine scale set. |
| Column level encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes | Service Fabric API calls are made through Azure Resource Manager. A valid JSON web token (JWT) is required. |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| Yes |  |
| Network isolation and firewalling support| Yes | Using networking security groups (NSG). |
| Forced tunneling support| Yes | Azure networking provides forced tunneling. |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Azure monitoring support and third-party support. |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Identity and access management (IAM) for calls via SFRP. Calls directly to cluster end point supports two roles: User and Admin. The customer can map the APIs to either role. |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | All control plane operations run through processes for auditing and approvals. |
| Data plane logging and audit| N/A | Customer owns the cluster.  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | The service configuration is versioned and deployed using Azure Deploy. The code (application and runtime) is versioned using Azure Build.
 |

## Azure Storage

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes |  |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | Support standard HTTPS/TLS mechanisms.  Users can also encrypt data before it is transmitted to the service. |
| Encryption key handling (CMK, BYOK, etc.)| Yes | See [Storage Service Encryption using customer-managed keys in Azure Key Vault](../storage/common/storage-service-encryption-customer-managed-keys.md).|
| Column level encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes |  |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| N/A |  |
| Network isolation and firewalling support| Yes | |
| Forced tunneling support| N/A |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Azure Monitor Metrics available now, Logs starting preview |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory, Shared key, Shared access token. |
| Authorization| Yes | Support Authorization via RBAC, POSIX ACLs, and SAS Tokens |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit | Yes | Azure Resource Manager Activity Log |
| Data plane logging and audit| Yes | Service Diagnostic Logs, and Azure Monitor Logging starting preview  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Support Resource Provider versioning through Azure Resource Manager APIs |