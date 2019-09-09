---
title: Security controls for Azure services
description: A checklist of security controls for evaluating Azure services
services: security
documentationcenter: ''
author: msmbaldwin
manager: rkarlin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 07/11/2019
ms.author: mbaldwin

---
# Security controls for Azure services

This article aggregates the security controls for selected Azure services. 

[!INCLUDE [Security controls Header](../../../includes/security-controls-header.md)]

Security controls are categorized as:

* Network
* Monitoring & logging
* Identity
* Data protection
* Configuration management

Some services may specify "Additional security controls".

In each category, we show "Yes" or "No" to indicate whether an attribute is used. For some services, we show "N/A" for an attribute that is not applicable. We might also provide a note or a link to more information about an attribute.

## [API Management](../../api-management/api-management-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No | |
| VNet injection support| Yes | |
| Network isolation and firewalling support| Yes | Using networking security groups (NSG) and Azure Application Gateway (or other software appliance) respectively. |
| Forced tunneling support| Yes | Azure networking provides forced tunneling. |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |
| Control and management plane logging and audit| Yes | [Azure Monitor activity logs](../azure-monitor/platform/activity-logs-overview.md) |
| Data plane logging and audit| Yes | [Azure Monitor diagnostic logs](../azure-monitor/platform/diagnostic-logs-overview.md) and (optionally) [Azure Application Insights](../azure-monitor/app/app-insights-overview.md).  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | |
| Authorization| Yes | |

### Data Protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes (service-side encryption only) | Sensitive data such as certificates, keys, and secret-named values are encrypted with service-managed, per service instance keys. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | [Express Route](../expressroute/index.yml) and VNet encryption is provided by [Azure networking](../virtual-network/index.yml). |
| Server-side encryption at rest: customer managed keys (BYOK) | No | All encryption keys are per service instance and are service managed. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Management plane calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) over TLS. A valid JSON web token (JWT) is required.  Data plane calls can be secured with TLS and one of supported authentication mechanisms (for example, client certificate or JWT).
 |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Using the [Azure API Management DevOps Resource Kit](https://aka.ms/apimdevops) |

### Vulnerability scans false positives

This section documents common vulnerabilities, which do not affect Azure API Management.

| Vulnerability               | Description                                                                                                                                                                                                                                                                                                               |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Ticketbleed (CVE-2016-9244) | Ticketbleed is vulnerability in the implementation of the TLS SessionTicket extension found in some F5 products. It allows the leakage ("bleeding") of up to 31 bytes of data from uninitialized memory. This is caused by the TLS stack padding a Session ID, passed from the client, with data to make it 32 bits long. |


## [Azure App Service](../../app-service/app-service-security-controls.md)

### Network

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Service endpoint support| Yes | Currently available in preview for App Service.| [Azure App Service Access Restrictions](app-service-ip-restrictions.md)
| VNet injection support| Yes | App Service Environments are private implementations of App Service dedicated to a single customer injected into a customer's virtual network. | [Introduction to the App Service Environments](environment/intro.md)
| Network Isolation and Firewalling support| Yes | For the public multi-tenant variation of App Service, customers can configure network ACLs (IP Restrictions) to lock down allowed inbound traffic.  App Service Environments are deployed directly into virtual networks and hence can be secured with NSGs. | [Azure App Service Access Restrictions](app-service-ip-restrictions.md)
| Forced tunneling support| Yes | App Service Environments can be deployed into a customer's virtual network where forced tunneling is configured. | [Configure your App Service Environment with forced tunneling](environment/forced-tunnel-support.md)

### Monitoring & logging

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | App Service integrates with Application Insights for languages that support Application Insights (Full .NET Framework, .NET Core, Java and Node.JS).  See [Monitor Azure App Service performance](../azure-monitor/app/azure-web-apps.md). App Service also sends application metrics into Azure Monitor. | [Monitor apps in Azure App Service](web-sites-monitor.md)
| Control and management plane logging and audit| Yes | All management operations performed on App Service objects occur via [Azure Resource Manager](../azure-resource-manager/index.yml). Historical logs of these operations are available both in the portal and via the CLI. | [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftweb), [az monitor activity-log](/cli/azure/monitor/activity-log)
| Data plane logging and audit | No | The data plane for App Service is a remote file share containing a customer’s deployed web site content.  There is no auditing of the remote file share. |

### Identity

| Security control | Yes/No | Notes |  Documentation
|---|---|--|
| Authentication| Yes | Customers can build applications on App Service that automatically integrate with [Azure Active Directory (Azure AD)](../active-directory/index.yml) as well as other OAuth compatible identity providers For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles. | [Authentication and authorization in Azure App Service](overview-authentication-authorization.md)
| Authorization| Yes | For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles.  | [Authentication and authorization in Azure App Service](overview-authentication-authorization.md)

### Data protection

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | Web site file content is stored in Azure Storage, which automatically encrypts the content at rest. <br><br>Customer supplied secrets are encrypted at rest. The secrets are encrypted at rest while stored in App Service configuration databases.<br><br>Locally attached disks can optionally be used as temporary storage by websites (D:\local and %TMP%). Locally attached disks are not encrypted at rest. | [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | Customers can choose to store application secrets in Key Vault and retrieve them at runtime. | [Use Key Vault references for App Service and Azure Functions (preview)](app-service-key-vault-references.md)
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Customers can configure web sites to require and use HTTPS for inbound traffic.  | [How to make an Azure App Service HTTPS only](https://blogs.msdn.microsoft.com/benjaminperkins/2017/11/30/how-to-make-an-azure-app-service-https-only/) (blog post)
| API calls encrypted| Yes | Management calls to configure App Service occur via [Azure Resource Manager](../azure-resource-manager/index.yml) calls over HTTPS. |

### Configuration management

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an App Service configuration can be exported as an Azure Resource Manager template and versioned over time. For runtime operations, customers can maintain multiple different live versions of an application using the App Service deployment slots feature. | 



## [Azure Resource Manager](../../azure-resource-manager/azure-resource-manager-security-controls.md)

### Data Protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | HTTPS/TLS. |
| Server-side encryption at rest: customer managed keys (BYOK) | N/A | Azure Resource Manager stores no customer content, only control data. |
| Column level encryption (Azure Data Services)| Yes | |
| API calls encrypted| Yes | |

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No | |
| VNet injection support| Yes | |
| Network isolation and firewalling support| No |  |
| Forced tunneling support| No |  |

### Monitoring & Logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| No | |
| Control and management plane logging and audit| Yes | Activity logs expose all write operations (PUT, POST, DELETE) performed on your resources; see [View activity logs to audit actions on resources](resource-group-audit.md). |
| Data plane logging and audit| N/A | |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | [Azure Active Directory](/azure/active-directory) based.|
| Authorization| Yes | |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  |


## [Azure Backup](../../backup/backup-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No |  |
| VNet injection support| No |  |
| Network isolation and firewalling support| Yes | Forced tunneling is supported for VM backup. Forced tunneling is not supported for workloads running inside VMs. |
| Forced tunneling support| No |  |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Log Analytics is supported via diagnostic logs. See [Monitor Azure Backup protected workloads using Log Analytics](https://azure.microsoft.com/blog/monitor-all-azure-backup-protected-workloads-using-log-analytics/) for more information. |
| Control and management plane logging and audit| Yes | All customer triggered actions from the Azure portal are logged to activity logs. |
| Data plane logging and audit| No | Azure Backup data plane can't be reached directly.  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Customer created and built-in RBAC roles are used. See [Use Role-Based Access Control to manage Azure Backup recovery points](/azure/backup/backup-rbac-rs-vault) for more information. |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | Using storage service encryption for storage accounts. |
| Server-side encryption at rest: customer managed keys (BYOK) | No |  |
| Column level encryption (Azure Data Services)| No |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| No | Using HTTPS. |
| API calls encrypted| Yes |  |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes|  |

## [Azure Cosmos DB](../../cosmos-db/cosmos-db-security-controls.md)

### Network

| Security control | Yes/no | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| Yes | With VNet service endpoint, you can configure an Azure Cosmos DB account to allow access only from a specific subnet of a virtual network (VNet). You can also combine VNet access with firewall rules.  See [Access Azure Cosmos DB from virtual networks](VNet-service-endpoint.md). |
| Network Isolation and Firewalling support| Yes | With firewall support, you can configure your Azure Cosmos account to allow access only from an approved set of IP addresses, a range of IP addresses and/or cloud services. See [Configure IP firewall in Azure Cosmos DB](how-to-configure-firewall.md).|
| Forced tunneling support| Yes | Can be configured at the client side on the VNet where the virtual machines are located.   |

### Monitoring & logging

| Security control | Yes/no | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | All requests that are sent to Azure Cosmos DB are logged. [Azure Monitoring](../azure-monitor/overview.md), Azure Metrics, Azure Audit Logging are supported.  You can log information corresponding to data plane requests, query runtime statistics, query text, MongoDB requests. You can also set up alerts. |
| Control and management plane logging and audit| Yes | Azure Activity log for account level operations such as Firewalls, VNets, Keys access, and IAM. |
| Data plane logging and audit | Yes | Diagnostics monitoring logging for container level operations such as create container, provision throughput, indexing policies, and CRUD operations on documents. |

### Identity

| Security control | Yes/no | Notes|
|---|---|--|
| Authentication| Yes | Yes at the Database Account Level; at the data plane level, Cosmos DB uses resource tokens and key access. |
| Authorization| Yes | Supported at the Azure Cosmos account with Master keys (primary and secondary) and Resource tokens. You can get read/write or read only access to data with master keys. Resource tokens allow limited time access to resources such as documents and containers. |

### Data protection

| Security control | Yes/no | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | All Cosmos databases and backups are encrypted by default; see [Data encryption in Azure Cosmos DB](database-encryption-at-rest.md). Server-side encryption with customer-managed keys is not supported. |
| Server-side encryption at rest: customer managed keys (BYOK) | No |  |
| Column level encryption (Azure Data Services)| Yes | Only in the Tables API Premium. Not all APIs support this feature. See [Introduction to Azure Cosmos DB: Table API](table-introduction.md). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | All Azure Cosmos DB data is encrypted at transit. |
| API calls encrypted| Yes | All connections to Azure Cosmos DB support HTTPS. Azure Cosmos DB also supports TLS 1.2 connections, but this is not yet enforced. If customers turn off lower level TLS on their end, they can ensure to connect to Cosmos DB.  |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| No  | | 

### Additional security controls for Cosmos DB

| Security control | Yes/no | Notes|
|---|---|--|
| Cross Origin Resource Sharing (CORS) | Yes | See [Configure Cross-Origin Resource Sharing (CORS)](how-to-configure-cross-origin-resource-sharing.md). |


## [Azure Event Hubs](../../event-hubs/event-hubs-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes |  |
| Forced tunneling support| No |  |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit| Yes |   |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | |
| Authorization|  Yes | |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys |  Yes | |
| Server-side encryption at rest: customer managed keys (BYOK) | No |  |
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | |
| API calls encrypted| Yes |  |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | |


## [Azure ExpressRoute](../../expressroute/expressroute-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A |  |
| VNet injection support| N/A | |
| Network isolation and firewalling support| Yes | Each customer is contained in its own routing domain and tunneled to its own VNet |
| Forced tunneling support| N/A | Via Border Gateway Protocol (BGP). |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [ExpressRoute monitoring, metrics, and alerts](expressroute-monitoring-metrics-alerts.md).|
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit| No |   |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |
| Authorization|  Yes |Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys |  N/A | ExpressRoute does not store customer data. |
| Server-side encryption at rest: customer managed keys (BYOK) | N/A |  |
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| No | |
| API calls encrypted| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |


### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Via the Network Resource Provider (NRP). |


## [Azure Key Vault](../../key-vault/key-vault-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Using Virtual Network (VNet) service endpoints. |
| VNet injection support| No |  |
| Network isolation and firewalling support| Yes | Using VNet firewall rules. |
| Forced tunneling support| No |  |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Log Analytics. |
| Control/Management plane Logging and Audit| Yes | Using Log Analytics. |
| Data plane logging and audit| Yes | Using Log Analytics. |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Using Key Vault Access Policy. |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | All objects are encrypted. |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | The customer controls all keys in their Key Vault. When hardware security module (HSM) backed keys are specified, a FIPS Level 2 HSM protects the key, certificate, or secret. |
| Column level encryption (Azure Data Services)| N/A |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | All communication is via encrypted API calls |
| API calls encrypted| Yes | Using HTTPS. |

### Access controls

| Security control | Yes/No | Notes|
|---|---|--|
| Control/Management plane access controls | Yes | Azure Resource Manager Role-Based Access Control (RBAC) |
| Data plane access controls (At every service level) | Yes | Key Vault Access Policy |

## [Azure Load Balancer](../../load-balancer/load-balancer-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A | |
| VNet injection support| N/A | . |
| Network Isolation and Firewalling support| N/A |  |
| Forced tunneling support| N/A | |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Azure Monitor logs for public Basic Load Balancer](load-balancer-monitor-log.md). |
| Control and management plane logging and audit| Yes | See [Azure Monitor logs for public Basic Load Balancer](load-balancer-monitor-log.md). |
| Data plane logging and audit | N/A |  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| N/A |  |
| Authorization| N/A |  |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| N/A | |
| Server-side encryption at rest: customer managed keys (BYOK) | N/A | |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via the [Azure Resource Manager](../azure-resource-manager/index.yml). |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| N/A |  | 


## [Azure Service Bus Messaging](../../service-bus-messaging/service-bus-messaging-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes (Premium tier only) | VNet service endpoints are supported for [Service Bus Premium tier](service-bus-premium-messaging.md) only. |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes (Premium tier only) |  |
| Forced tunneling support| No |  |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Supported via [Azure Monitor and Alerts](service-bus-metrics-azure-monitor.md). |
| Control and management plane logging and audit| Yes | Operations logs are available; see [Service Bus diagnostic logs](service-bus-diagnostic-logs.md).  |
| Data plane logging and audit| No |  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Managed through [Azure Active Directory Managed Service Identity](service-bus-managed-service-identity.md); see [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md).|
| Authorization| Yes | Supports authorization via [RBAC](authenticate-application.md) and SAS token; see [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md). |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys |  Yes for server-side encryption-at-rest by default. | Customer managed keys and BYOK are not yet supported. Client side encryption is the client's responsibility |
| Server-side encryption at rest: customer managed keys (BYOK) | No |   |
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Supports standard HTTPS/TLS mechanism. |
| API calls encrypted| Yes | API calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Supports resource provider versioning through the [Azure Resource Manager API](/rest/api/resources/).|


## [Azure Service Bus Relay](../../service-bus-relay/service-bus-relay-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No |  |
| Network isolation and firewalling support| No |  |
| Forced tunneling support| N/A | Relay is the TLS tunnel  |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |
| Control and management plane logging and audit| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml). |
| Data plane logging and audit| Yes | Connection success / failure and errors and logged.  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Via SAS. |
| Authorization|  Yes | Via SAS. |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys |  N/A | Relay is a web socket and does not persist data. |
| Server-side encryption at rest: customer managed keys (BYOK) | No | Uses Microsoft TLS certs only.  |
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Service requires TLS. |
| API calls encrypted| Yes | HTTPS. |


### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml).|


## [Azure Service Fabric](../../service-fabric/service-fabric-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| Yes |  |
| Network isolation and firewalling support| Yes | Using networking security groups (NSG). |
| Forced tunneling support| Yes | Azure networking provides forced tunneling. |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Using Azure monitoring support and third-party support. |
| Control and management plane logging and audit| Yes | All control plane operations run through processes for auditing and approvals. |
| Data plane logging and audit| N/A | Customer owns the cluster.  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Identity and access management (IAM) for calls via SFRP. Calls directly to cluster end point supports two roles: User and Admin. The customer can map the APIs to either role. |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Column level encryption (Azure Data Services)| N/A |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes |  |
| API calls encrypted| Yes | Service Fabric API calls are made through Azure Resource Manager. A valid JSON web token (JWT) is required. |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | |

## [Azure SQL Database](../../sql-database/sql-database-security-controls.md)

SQL Database includes both [single database](sql-database-single-index.yml) and [managed instance](sql-database-managed-instance.md). The following entries apply to both offerings except where otherwise noted.

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Applies to [single database](sql-database-single-index.yml) only. |
| Azure Virtual Network injection support| Yes | Applies to [managed instance](sql-database-managed-instance.md) only. |
| Network isolation and firewall support| Yes | Firewall at both database level and server level. Network isolation is for [managed instance](sql-database-managed-instance.md) only. |
| Forced tunneling support| Yes | [Managed instance](sql-database-managed-instance.md) via an [ExpressRoute](../expressroute/index.yml) VPN. |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support, such as Log Analytics or Application Insights| Yes | SecureSphere, the SIEM solution from Imperva, is also supported through [Azure Event Hubs](../event-hubs/index.yml) integration via [SQL auditing](sql-database-auditing.md). |
| Control-plane and management-plane logging and audit| Yes | Yes for some events only |
| Data-plane logging and audit | Yes | Via [SQL audit](sql-database-auditing.md) |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory (Azure AD) |
| Authorization| Yes | None |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | Called "encryption-in-use," as described in the article [Always Encrypted](sql-database-always-encrypted.md). Server-side encryption uses [transparent data encryption](transparent-data-encryption-azure-sql.md).|
| Encryption in transit:<ul><li>Azure ExpressRoute encryption</li><li>Encryption in a virtual network</li><li>Encryption between virtual networks</ul>| Yes | Using HTTPS. |
| Encryption-key handling, such as CMK or BYOK| Yes | Both service-managed and customer-managed key handling are offered. The latter is offered through [Azure Key Vault](../key-vault/index.yml). |
| Column-level encryption provided by Azure data services| Yes | Through [Always Encrypted](sql-database-always-encrypted.md). |
| Encrypted API calls| Yes | Using HTTPS/SSL. |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration-management support, such as versioning of configuration| No  | None |

### Additional security controls for SQL Database

| Security control | Yes/No | Notes|
|---|---|--|
| Preventative: vulnerability assessment | Yes | See [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md). |
| Preventative: data discovery and classification  | Yes | See [Azure SQL Database and SQL Data Warehouse data discovery & classification](sql-database-data-discovery-and-classification.md). |
| Detection: threat detection | Yes | See [Advanced Threat Protection for Azure SQL Database](sql-database-threat-detection-overview.md). |


## [Azure Storage](../../storage/common/storage-security-controls.md)

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes |  |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | See [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).|
| Column level encryption (Azure Data Services)| N/A |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Support standard HTTPS/TLS mechanisms.  Users can also encrypt data before it is transmitted to the service. |
| API calls encrypted| Yes |  |

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| N/A |  |
| Network isolation and firewalling support| Yes | |
| Forced tunneling support| N/A |  |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Azure Monitor Metrics available now, Logs starting preview |
| Control and management plane logging and audit | Yes | Azure Resource Manager Activity Log |
| Data plane logging and audit| Yes | Service Diagnostic Logs, and Azure Monitor Logging starting preview  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory, Shared key, Shared access token. |
| Authorization| Yes | Support Authorization via RBAC, POSIX ACLs, and SAS Tokens |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Support Resource Provider versioning through Azure Resource Manager APIs |

## [Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | . |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm). |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](/azure/virtual-machines/linux/tutorial-monitoring) and [Monitor and update a Windows virtual machine in Azure](/azure/virtual-machines/windows/tutorial-monitoring). |
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit | No |  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes |  |
| Authorization| Yes |  |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | See [How to encrypt a Linux virtual machine in Azure](/azure/virtual-machines/linux/encrypt-disks) and [Encrypt virtual disks on a Windows VM](/azure/virtual-machines/windows/encrypt-disks). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNet encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms). |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | Customer-managed keys is a supported Azure encryption scenario; see [Azure encryption overview](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and SSL. |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  | 



## [Linux Virtual Machines](../../virtual-machines/linux/virtual-machines-linux-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | . |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm). |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](/azure/virtual-machines/linux/tutorial-monitoring) and [Monitor and update a Windows virtual machine in Azure](/azure/virtual-machines/windows/tutorial-monitoring). |
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit | No |  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes |  |
| Authorization| Yes |  |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | See [How to encrypt a Linux virtual machine in Azure](/azure/virtual-machines/linux/encrypt-disks) and [Encrypt virtual disks on a Windows VM](/azure/virtual-machines/windows/encrypt-disks). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNet encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms). |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | Customer-managed keys is a supported Azure encryption scenario; see [Azure encryption overview](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and SSL. |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  | 



## [Windows Virtual Machines](../../virtual-machines/windows/virtual-machines-windows-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | . |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm). |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](/azure/virtual-machines/linux/tutorial-monitoring) and [Monitor and update a Windows virtual machine in Azure](/azure/virtual-machines/windows/tutorial-monitoring). |
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit | No |  |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes |  |
| Authorization| Yes |  |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | See [How to encrypt a Linux virtual machine in Azure](/azure/virtual-machines/linux/encrypt-disks) and [Encrypt virtual disks on a Windows VM](/azure/virtual-machines/windows/encrypt-disks). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNet encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms). |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | Customer-managed keys is a supported Azure encryption scenario; see [Azure encryption overview](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and SSL. |



### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  | 



## [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-security-controls.md)

### Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A | |
| VNet injection support| N/A | . |
| Network Isolation and Firewalling support| Yes | VPN gateways are dedicated VM instances for each customer Virtual Network  |
| Forced tunneling support| Yes |  |

### Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Azure Monitor Diagnostics Logs/alert](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md) & [Azure Monitor Metrics/alert](vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric.md).  |
| Control and management plane logging and audit| Yes | Azure Resource Manager Activity Log. |
| Data plane logging and audit | Yes | [Azure Monitor Diagnostic Logs](../azure-resource-manager/resource-group-audit.md) for VPN connectivity logging and auditing. |

### Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) for managing the service and configuring the Azure VPN gateway. |
| Authorization| Yes | Support Authorization via [RBAC](../role-based-access-control/overview.md). |

### Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | N/A | VPN gateway transit customer data, does NOT store customer data |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | VPN gateway encrypt customer packets between Azure VPN gateways and customer on-premises VPN devices (S2S) or VPN clients (P2S). VPN gateways also support VNet-to-VNet encryption. |
| Server-side encryption at rest: customer managed keys (BYOK) | No | Customer-specified pre-shared keys are encrypted at rest; but not integrated with CMK yet. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS  |

### Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an Azure VPN gateway configuration can be exported as an Azure Resource Manager template and versioned over time. | 

