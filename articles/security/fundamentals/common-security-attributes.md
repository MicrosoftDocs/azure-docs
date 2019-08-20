---
title: Security attributes for Azure services
description: A checklist of security attributes for evaluating Azure services
services: security
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 07/11/2019
ms.author: mbaldwin

---
# Security attributes for Azure services

This article collects the security attributes for selected Azure services. A security attribute is a quality or feature of an Azure service. It contributes to the service's ability to prevent, detect, and respond to security vulnerabilities.

Security attributes are categorized as:
* Preventative
* Network segmentation
* Detection
* Support for identity and access management
* Audit trail
* Access controls (if used)
* Configuration management (if used)

In each category, we show "Yes" or "No" to indicate whether an attribute is used. For some services, we show "N/A" for an attribute that is not applicable. We might also provide a note or a link to more information about an attribute.

## [API Management](/azure/api-management/api-management-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Sensitive data such as certificates, keys, and secret-named values are encrypted with service-managed, per service instance keys. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | [Express Route](/azure/expressroute/index) and VNet encryption is provided by [Azure networking](/azure/virtual-network/index). |
| Encryption key handling (CMK, BYOK, etc.)| No | All encryption keys are per service instance and are service managed. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Management plane calls are made through [Azure Resource Manager](/azure/azure-resource-manager/index) over TLS. A valid JSON web token (JWT) is required.  Data plane calls can be secured with TLS and one of supported authentication mechanisms (for example, client certificate or JWT).
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
| Control and management plane logging and audit| Yes | [Azure Monitor activity logs](/azure/azure-monitor/platform/activity-logs-overview) |
| Data plane logging and audit| Yes | [Azure Monitor diagnostic logs](/azure/azure-monitor/platform/diagnostic-logs-overview) and (optionally) [Azure Application Insights](/azure/azure-monitor/app/app-insights-overview).|

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Using the [Azure API Management DevOps Resource Kit](https://aka.ms/apimdevops) |

### Vulnerability scans false positives

This section documents common vulnerabilities, which do not affect Azure API Management.

| Vulnerability               | Description                                                                                                                                                                                                                                                                                                               |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Ticketbleed (CVE-2016-9244) | Ticketbleed is vulnerability in the implementation of the TLS SessionTicket extension found in some F5 products. It allows the leakage ("bleeding") of up to 31 bytes of data from uninitialized memory. This is caused by the TLS stack padding a Session ID, passed from the client, with data to make it 32 bits long. |


## [App Service](/azure/app-service/app-service-security-attributes)

### Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | Web site file content is stored in Azure Storage, which automatically encrypts the content at rest. See [Azure Storage encryption for data at rest](/azure/storage/common/storage-service-encryption).<br><br>Customer supplied secrets are encrypted at rest. The secrets are encrypted at rest while stored in App Service configuration databases.<br><br>Locally attached disks can optionally be used as temporary storage by websites (D:\local and %TMP%). Locally attached disks are not encrypted at rest. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | Customers can configure web sites to require and use HTTPS for inbound traffic. See the blog post [How to make an Azure App Service HTTPS only](https://blogs.msdn.microsoft.com/benjaminperkins/2017/11/30/how-to-make-an-azure-app-service-https-only/). |
| Encryption key handling (CMK, BYOK, etc.)| Yes | Customers can choose to store application secrets in Key Vault and retrieve them at runtime. See [Use Key Vault references for App Service and Azure Functions (preview)](/azure/app-service/app-service-key-vault-references).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Management calls to configure App Service occur via [Azure Resource Manager](/azure/azure-resource-manager/index) calls over HTTPS. |

### Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Currently available in preview for App Service. See [Azure App Service Access Restrictions](/azure/app-service/app-service-ip-restrictions). |
| VNet injection support| Yes | App Service Environments are private implementations of App Service dedicated to a single customer injected into a customer's virtual network. See [Introduction to the App Service Environments](/azure/app-service/environment/intro). |
| Network Isolation and Firewalling support| Yes | For the public multi-tenant variation of App Service, customers can configure network ACLs (IP Restrictions) to lock down allowed inbound traffic.  See [Azure App Service Access Restrictions](/azure/app-service/app-service-ip-restrictions).  App Service Environments are deployed directly into virtual networks and hence can be secured with NSGs. |
| Forced tunneling support| Yes | App Service Environments can be deployed into a customer's virtual network where forced tunneling is configured. Customers need to follow the directions in [Configure your App Service Environment with forced tunneling](/azure/app-service/environment/forced-tunnel-support). |

### Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | App Service integrates with Application Insights for languages that support Application Insights (Full .NET Framework, .NET Core, Java and Node.JS).  See [Monitor Azure App Service performance](/azure/azure-monitor/app/azure-web-apps). App Service also sends application metrics into Azure Monitor. See [Monitor apps in Azure App Service](/azure/app-service/web-sites-monitor). |

### Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Customers can build applications on App Service that automatically integrate with [Azure Active Directory (Azure AD)](/azure/active-directory/index) as well as other OAuth compatible identity providers; see [Authentication and authorization in Azure App Service](/azure/app-service/overview-authentication-authorization). For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles. |
| Authorization| Yes | For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles.  |


### Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | All management operations performed on App Service objects occur via [Azure Resource Manager](/azure/azure-resource-manager/index). Historical logs of these operations are available both in the portal and via the CLI; see [Azure Resource Manager resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftweb) and [az monitor activity-log](/cli/azure/monitor/activity-log). |
| Data plane logging and audit | No | The data plane for App Service is a remote file share containing a customer’s deployed web site content.  There is no auditing of the remote file share. |

### Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an App Service configuration can be exported as an Azure Resource Manager template and versioned over time. For runtime operations, customers can maintain multiple different live versions of an application using the App Service deployment slots feature. | 



## [Azure Resource Manager](/azure/azure-resource-manager/azure-resource-manager-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | HTTPS/TLS. |
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
| Control and management plane logging and audit| Yes | Activity logs expose all write operations (PUT, POST, DELETE) performed on your resources; see [View activity logs to audit actions on resources](/azure/azure-resource-manager/resource-group-audit). |
| Data plane logging and audit| N/A | |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  |


## [Azure Backup](/azure/backup/backup-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features)| Yes | Using storage service encryption for storage accounts. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | No | Using HTTPS. |
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
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Log Analytics is supported via diagnostic logs. See [Monitor Azure Backup protected workloads using Log Analytics](https://azure.microsoft.com/blog/monitor-all-azure-backup-protected-workloads-using-log-analytics/) for more information. |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Customer created and built-in RBAC roles are used. See [Use Role-Based Access Control to manage Azure Backup recovery points](/azure/backup/backup-rbac-rs-vault) for more information. |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | All customer triggered actions from the Azure portal are logged to activity logs. |
| Data plane logging and audit| No | Azure Backup data plane can't be reached directly.  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes|  |

## [Cosmos DB](/azure/cosmos-db/cosmos-db-security-attributes)

### Preventative

| Security attribute | Yes/no | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | All Cosmos DB databases and backups are encrypted by default; see [Data encryption in Azure Cosmos DB](/azure/cosmos-db/database-encryption-at-rest). Server-side encryption with customer-managed keys is not supported. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | All Azure Cosmos DB data is encrypted at transit. |
| Encryption key handling (CMK, BYOK, etc.)| No |  |
| Column level encryption (Azure Data Services)| Yes | Only in the Tables API Premium. Not all APIs support this feature. See [Introduction to Azure Cosmos DB: Table API](/azure/cosmos-db/table-introduction). |
| API calls encrypted| Yes | All connections to Azure Cosmos DB support HTTPS. Azure Cosmos DB also supports TLS 1.2 connections, but this is not yet enforced. If customers turn off lower level TLS on their end, they can ensure to connect to Cosmos DB.  |

### Network segmentation

| Security attribute | Yes/no | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| Yes | With VNet service endpoint, you can configure an Azure Cosmos DB account to allow access only from a specific subnet of a virtual network (VNet). You can also combine VNet access with firewall rules.  See [Access Azure Cosmos DB from virtual networks](/azure/cosmos-db/vnet-service-endpoint). |
| Network Isolation and Firewalling support| Yes | With firewall support, you can configure your Azure Cosmos account to allow access only from an approved set of IP addresses, a range of IP addresses and/or cloud services. See [Configure IP firewall in Azure Cosmos DB](/azure/cosmos-db/how-to-configure-firewall).|
| Forced tunneling support| Yes | Can be configured at the client side on the VNet where the virtual machines are located.   |

### Detection

| Security attribute | Yes/no | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | All requests that are sent to Azure Cosmos DB are logged. [Azure Monitoring](/azure/azure-monitor/overview), Azure Metrics, Azure Audit Logging are supported.  You can log information corresponding to data plane requests, query runtime statistics, query text, MongoDB requests. You can also setup alerts. |

### Identity and access management

| Security attribute | Yes/no | Notes|
|---|---|--|
| Authentication| Yes | Yes at the Database Account Level; at the data plane level, Cosmos DB uses resource tokens and key access. |
| Authorization| Yes | Supported at the Azure Cosmos account with Master keys (primary and secondary) and Resource tokens. You can get read/write or read only access to data with master keys. Resource tokens allow limited time access to resources such as documents and containers. |

### Audit trail

| Security attribute | Yes/no | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Azure Activity log for account level operations such as Firewalls, VNets, Keys access, and IAM. |
| Data plane logging and audit | Yes | Diagnostics monitoring logging for container level operations such as create container, provision throughput, indexing policies, and CRUD operations on documents. |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| No  | | 

### Additional security attributes for Cosmos DB

| Security attribute | Yes/no | Notes|
|---|---|--|
| Cross Origin Resource Sharing (CORS) | Yes | See [Configure Cross-Origin Resource Sharing (CORS)](/azure/cosmos-db/how-to-configure-cross-origin-resource-sharing). |


## [Event Hubs](/azure/event-hubs/event-hubs-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) |  Yes | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | |
| Encryption key handling (CMK, BYOK, etc.)| No |  |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes |  |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes |  |
| Forced tunneling support| No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | |
| Authorization|  Yes | |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit| Yes |   |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | |


## [ExpressRoute](/azure/expressroute/expressroute-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) |  N/A | ExpressRoute does not store customer data. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | No | |
| Encryption key handling (CMK, BYOK, etc.)| N/A |  |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Through [Azure Resource Manager](/azure/azure-resource-manager/index) and HTTPS. |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A |  |
| VNet injection support| N/A | |
| Network isolation and firewalling support| Yes | Each customer is contained in its own routing domain and tunneled to its own VNet |
| Forced tunneling support| N/A | Via Border Gateway Protocol (BGP). |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [ExpressRoute monitoring, metrics, and alerts](/azure/expressroute/expressroute-monitoring-metrics-alerts).|

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |
| Authorization|  Yes |Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |


### Audit trail

| Security Attribute | Yes/No | Notes| 
|---|---|--|
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit| No |   |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Via the Network Resource Provider (NRP). |


## [Key Vault](../../key-vault/key-vault-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | All objects are encrypted. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | All communication is via encrypted API calls |
| Encryption key handling (CMK, BYOK, etc.)| Yes | The customer controls all keys in their Key Vault. When hardware security module (HSM) backed keys are specified, a FIPS Level 2 HSM protects the key, certificate, or secret. |
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

## [Load Balancer](../../load-balancer/load-balancer-security-attributes.md)

### Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| N/A | |
| Encryption key handling (CMK, BYOK, etc.)| N/A | |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via the [Azure Resource Manager](/azure/azure-resource-manager/index). |

### Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A | |
| VNet injection support| N/A | . |
| Network Isolation and Firewalling support| N/A |  |
| Forced tunneling support| N/A | |

### Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Azure Monitor logs for public Basic Load Balancer](/azure/load-balancer/load-balancer-monitor-log). |

### Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| N/A |  |
| Authorization| N/A |  |

### Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | See [Azure Monitor logs for public Basic Load Balancer](/azure/load-balancer/load-balancer-monitor-log). |
| Data plane logging and audit | N/A |  |

### Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| N/A |  | 

## [Service Bus Messaging](/azure/service-bus-messaging/service-bus-messaging-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) |  Yes for server-side encryption-at-rest by default. | Customer managed keys and BYOK are not yet supported. Client side encryption is the client's responsibility |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | Supports standard HTTPS/TLS mechanism. |
| Encryption key handling (CMK, BYOK, etc.)| No |   |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | API calls are made through [Azure Resource Manager](/azure/azure-resource-manager/index) and HTTPS. |

### Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes (Premium tier only) | VNet service endpoints are supported for [Service Bus Premium tier](/azure/service-bus-messaging/service-bus-premium-messaging) only. |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes (Premium tier only) |  |
| Forced tunneling support| No |  |

### Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Supported via [Azure Monitor and Alerts](/azure/service-bus-messaging/service-bus-metrics-azure-monitor). |

### Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Managed through [Azure Active Directory Managed Service Identity](/azure/service-bus-messaging/service-bus-managed-service-identity); see [Service Bus authentication and authorization](/azure/service-bus-messaging/service-bus-authentication-and-authorization).|
| Authorization| Yes | Supports authorization via [RBAC](/azure/service-bus-messaging/service-bus-role-based-access-control) (Preview) and SAS token; see [Service Bus authentication and authorization](/azure/service-bus-messaging/service-bus-authentication-and-authorization). |


### Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Operations logs are available; see [Service Bus diagnostic logs](/azure/service-bus-messaging/service-bus-diagnostic-logs).  |
| Data plane logging and audit| No |  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Supports resource provider versioning through the [Azure Resource Manager API](/rest/api/resources/).|


## [Service Bus Relay](/azure/service-bus-relay/service-bus-relay-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) |  N/A | Relay is a web socket and does not persist data. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | Service requires TLS. |
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
| Control and management plane logging and audit| Yes | Through [Azure Resource Manager](/azure/azure-resource-manager/index). |
| Data plane logging and audit| Yes | Connection success / failure and errors and logged.  |

### Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Through [Azure Resource Manager](/azure/azure-resource-manager/index).|

## [Service Fabric](../../service-fabric/service-fabric-security-attributes.md)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | The customer owns the cluster and the virtual machine scale set on which the cluster is built. Azure disk encryption can be enabled on the virtual machine scale set. |
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
| Configuration management support (versioning of configuration, etc.)| Yes | |

## [SQL Database](../../sql-database/sql-database-security-attributes.md)

SQL Database includes both [single database](/azure/sql-database/sql-database-single-index) and [managed instance](/azure/sql-database/sql-database-managed-instance). The following entries apply to both offerings except where otherwise noted.

### Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | Called "encryption-in-use," as described in the article [Always Encrypted](/azure/sql-database/sql-database-always-encrypted). Server-side encryption uses [transparent data encryption](/azure/sql-database/transparent-data-encryption-azure-sql).|
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | Using HTTPS. |
| Encryption-key handling, such as CMK or BYOK| Yes | Both service-managed and customer-managed key handling are offered. The latter is offered through [Azure Key Vault](/azure/key-vault/index). |
| Column-level encryption provided by Azure data services| Yes | Through [Always Encrypted](/azure/sql-database/sql-database-always-encrypted). |
| Encrypted API calls| Yes | Using HTTPS/SSL. |

### Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Applies to [single database](/azure/sql-database/sql-database-single-index) only. |
| Azure Virtual Network injection support| Yes | Applies to [managed instance](/azure/sql-database/sql-database-managed-instance) only. |
| Network isolation and firewall support| Yes | Firewall at both database level and server level. Network isolation is for [managed instance](/azure/sql-database/sql-database-managed-instance) only. |
| Forced tunneling support| Yes | [Managed instance](/azure/sql-database/sql-database-managed-instance) via an [ExpressRoute](/azure/expressroute/index) VPN. |

### Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support, such as Log Analytics or Application Insights| Yes | SecureSphere, the SIEM solution from Imperva, is also supported through [Azure Event Hubs](/azure/event-hubs/index) integration via [SQL auditing](/azure/sql-database/sql-database-auditing). |

### Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory (Azure AD) |
| Authorization| Yes | None |

### Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control-plane and management-plane logging and audit| Yes | Yes for some events only |
| Data-plane logging and audit | Yes | Via [SQL audit](/azure/sql-database/sql-database-auditing) |

### Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration-management support, such as versioning of configuration| No  | None |

### Additional security attributes for SQL Database

| Security attribute | Yes/No | Notes|
|---|---|--|
| Preventative: vulnerability assessment | Yes | See [SQL Vulnerability Assessment service helps you identify database vulnerabilities](/azure/sql-database/sql-vulnerability-assessment). |
| Preventative: data discovery and classification  | Yes | See [Azure SQL Database and SQL Data Warehouse data discovery & classification](/azure/sql-database/sql-database-data-discovery-and-classification). |
| Detection: threat detection | Yes | See [Advanced Threat Protection for Azure SQL Database](/azure/sql-database/sql-database-threat-detection-overview). |


## [Storage](/azure/storage/common/storage-security-attributes)

### Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption ) | Yes | Support standard HTTPS/TLS mechanisms.  Users can also encrypt data before it is transmitted to the service. |
| Encryption key handling (CMK, BYOK, etc.)| Yes | See [Storage Service Encryption using customer-managed keys in Azure Key Vault](/azure/storage/common/storage-service-encryption-customer-managed-keys?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).|
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

## Virtual Machines and Virtual Machine Scale Sets

[Linux VMs](/azure/virtual-machines/windows/virtual-machines-windows-security-attributes) | [Windows VMs](/azure/virtual-machines/windows/virtual-machines-windows-security-attributes) | [Virtual machine scale sets](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-security-attributes)


### Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | See [How to encrypt a Linux virtual machine in Azure](/azure/virtual-machines/linux/encrypt-disks) and [Encrypt virtual disks on a Windows VM](/azure/virtual-machines/windows/encrypt-disks). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNet encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms). |
| Encryption key handling (CMK, BYOK, etc.)| Yes | Customer-managed keys is a supported Azure encryption scenario; see [Azure encryption overview](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and SSL. |

### Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | . |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm). |

### Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](/azure/virtual-machines/linux/tutorial-monitoring) and [Monitor and update a Windows virtual machine in Azure](/azure/virtual-machines/windows/tutorial-monitoring). |

### Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes |  |
| Authorization| Yes |  |


### Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit | No |  |

### Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  | 


## [VPN Gateway](/azure/vpn-gateway/vpn-gateway-security-attributes)

### Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | N/A | VPN gateway transit customer data, does NOT store customer data |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | VPN gateway encrypt customer packets between Azure VPN gateways and customer on-premises VPN devices (S2S) or VPN clients (P2S). VPN gateways also support VNet-to-VNet encryption. |
| Encryption key handling (CMK, BYOK, etc.)| No | Customer-specified pre-shared keys are encrypted at rest; but not integrated with CMK yet. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Through [Azure Resource Manager](/azure/azure-resource-manager/index) and HTTPS  |

### Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A | |
| VNet injection support| N/A | . |
| Network Isolation and Firewalling support| Yes | VPN gateways are dedicated VM instances for each customer Virtual Network  |
| Forced tunneling support| Yes |  |

### Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Azure Monitor Diagnostics Logs/alert](/azure/vpn-gateway/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log) & [Azure Monitor Metrics/alert](/azure/vpn-gateway/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric).  |

### Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis) for managing the service and configuring the Azure VPN gateway. |
| Authorization| Yes | Support Authorization via [RBAC](/azure/role-based-access-control/overview). |

### Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Azure Resource Manager Activity Log. |
| Data plane logging and audit | Yes | [Azure Monitor Diagnostic Logs](/azure/azure-resource-manager/resource-group-audit) for VPN connectivity logging and auditing. |

### Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an Azure VPN gateway configuration can be exported as an Azure Resource Manager template and versioned over time. | 

