---
title: Azure Security Services and Technologies | Microsoft Docs
description: The article provides a curated list of Azure Security services and technologies.
services: security
documentationcenter: na
author: barclayn
manager: barbkess
editor: TomSh

ms.assetid: a5a7f60a-97e2-49b4-a8c5-7c010ff27ef8
ms.service: security
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/29/2019
ms.author: barclayn

---
# Security services and technologies available on Azure

In our discussions with current and future Azure customers, we’re often asked “do you have a list of all the security-related services and technologies that Azure has to offer?”

When you evaluate cloud service provider options, it’s helpful to have this information. So we have provided this list to get you started.

Over time, this list will change and grow, just as Azure does. Make sure to check this page on a regular basis to stay up-to-date on our security-related services and technologies.

## General Azure security
|Service|Description|
|--------|--------|
|[Azure&nbsp;Security&nbsp;Center](../security-center/security-center-intro.md)| A cloud workload protection solution that provides security management and advanced threat protection across hybrid cloud workloads.|
|[Azure Key Vault](../key-vault/key-vault-overview.md)| A secure secrets store for the passwords, connection strings, and other information you need to keep your apps working. |
|[Azure Monitor logs](../log-analytics/log-analytics-overview.md)|A monitoring service that collects telemetry and other data, and provides a query language and analytics engine to deliver operational insights for your apps and resources. Can be used alone or with other services such as Security Center. |
|[Azure Dev/Test Labs](../devtest-lab/devtest-lab-overview.md)|A service that helps developers and testers quickly create environments in Azure while minimizing waste and controlling cost.  |

<!---|[Azure&nbsp;Disk&nbsp;Encryption](azure-security-disk-encryption-overview.md)| THIS WILL GO TO THE NEW OVERVIEW TOPIC MEGHAN STEWART IS WRITING|--->

## Storage security
|Service|Description|
|------|--------|
| [Azure&nbsp;Storage&nbsp;Service&nbsp;Encryption](../storage/common/storage-service-encryption.md)|A security feature that automatically encrypts your data in Azure storage.   |
|[StorSimple Encrypted Hybrid Storage](../storsimple/storsimple-ova-overview.md)| An integrated storage solution that manages storage tasks between on-premises devices and Azure cloud storage.|
|[Azure Client-Side Encryption](../storage/common/storage-client-side-encryption.md)| A client-side encryption solution that encrypts data inside client applications before uploading to Azure Storage; also decrypts the data while downloading. |
| [Azure Storage Shared Access Signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md)|A shared access signature provides delegated access to resources in your storage account.  |
|[Azure Storage Account Keys](../storage/common/storage-create-storage-account.md)| An access control method for Azure storage that is used for authentication when the storage account is accessed. |
|[Azure File shares with SMB 3.0 Encryption](../storage/files/storage-files-introduction.md)|A network security technology that enables automatic network encryption for the Server Message Block (SMB) file sharing protocol. |
|[Azure Storage Analytics](https://docs.microsoft.com/rest/api/storageservices/Storage-Analytics)| A logging and metrics-generating technology for data in your storage account. |

<!------>

## Database security
|Service|Description|
|------|--------|
| [Azure&nbsp;SQL&nbsp;Firewall](../sql-database/sql-database-firewall-configure.md)|A network access control feature that protects against network-based attacks to database. |
|[Azure&nbsp;SQL&nbsp;Cell&nbsp;Level Encryption](https://blogs.msdn.microsoft.com/sqlsecurity/2015/05/12/recommendations-for-using-cell-level-encryption-in-azure-sql-database/)| A database security technology that provides encryption at a granular level.  |
| [Azure&nbsp;SQL&nbsp;Connection Encryption](../sql-database/sql-database-control-access.md)|To provide security, SQL Database controls access with firewall rules limiting connectivity by IP address, authentication mechanisms requiring users to prove their identity, and authorization mechanisms limiting users to specific actions and data. |
| [Azure SQL Always Encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine?view=sql-server-2017)|Protects sensitive data, such as credit card numbers or national identification numbers (for example, U.S. social security numbers), stored in Azure SQL Database or SQL Server databases.  |
| [Azure&nbsp;SQL&nbsp;Transparent Data Encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql?view=azuresqldb-current)| A database security feature that encrypts the storage of an entire database. |
| [Azure SQL Database Auditing](../sql-database/sql-database-auditing.md)|A database auditing feature that tracks database events and writes them to an audit log in your Azure storage account.  |


## Identity and access management
|Service|Description|
|------|--------|
| [Azure&nbsp;Role&nbsp;Based&nbsp;Access Control](../active-directory/role-based-access-control-configure.md)|An access control feature designed to allow users to access only the resources they are required to access based on their roles within the organization.  |
| [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md)|A cloud-based authentication repository that supports a multi-tenant, cloud-based directory and multiple identity management services within Azure.  |
| [Azure Active Directory B2C](../active-directory-b2c/active-directory-b2c-overview.md)|An identity management service that enables control over how customers sign-up, sign-in, and manage their profiles when using Azure-based applications.   |
| [Azure Active Directory Domain Services](../active-directory-domain-services/overview.md)| A cloud-based and managed version of Active Directory Domain Services. |
| [Azure Multi-Factor Authentication](../active-directory/authentication/multi-factor-authentication.md)| A security provision that employs several different forms of authentication and verification before allowing access to secured information. |

## Backup and disaster recovery
|Service|Description|
|------|--------|
| [Azure&nbsp;Backup](../backup/backup-introduction-to-azure-backup.md)| An Azure-based service used to back up and restore data in the Azure cloud. |
| [Azure&nbsp;Site&nbsp;Recovery](../site-recovery/site-recovery-overview.md)|An online service that replicates workloads running on physical and virtual machines (VMs) from a primary site to a secondary location to enable recovery of services after a failure. |

## Networking
|Service|Description|
|------|--------|
| [Network&nbsp;Security&nbsp;Groups](../virtual-network/virtual-networks-nsg.md)| A network-based access control feature using a 5-tuple to make allow or deny decisions.  |
| [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)| A network device used as a VPN endpoint to allow cross-premises access to Azure Virtual Networks.  |
| [Azure Application Gateway](../application-gateway/application-gateway-introduction.md)|An advanced web application load balancer that can route based on URL and perform SSL-offloading. |
|[Web application firewall](../application-gateway/waf-overview.md) (WAF)|A feature of Application Gateway that provides centralized protection of your web applications from common exploits and vulnerabilities|
| [Azure Load Balancer](../load-balancer/load-balancer-overview.md)|A TCP/UDP application network load balancer. |
| [Azure ExpressRoute](../expressroute/expressroute-introduction.md)| A dedicated WAN link between on-premises networks and Azure Virtual Networks. |
| [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md)| A global DNS load balancer.|
| [Azure Application Proxy](../active-directory/active-directory-application-proxy-get-started.md)| An authenticating front-end used to secure remote access for web applications hosted on-premises. |
|[Azure Firewall](../firewall/overview.md)|A managed, cloud-based network security service that protects your Azure Virtual Network resources.|
|[Azure DDoS protection](../virtual-network/ddos-protection-overview.md)|Combined with application design best practices, provides defense against DDoS attacks.|
|[Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)|Extends your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection.|