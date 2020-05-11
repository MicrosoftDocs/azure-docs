---
title: Azure Security Services and Technologies | Microsoft Docs
description: The article provides a curated list of Azure Security services and technologies.
services: security
documentationcenter: na
author: terrylanfear
manager: barbkess
editor: TomSh

ms.assetid: a5a7f60a-97e2-49b4-a8c5-7c010ff27ef8
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/29/2019
ms.author: terrylan

---
# Security services and technologies available on Azure

In our discussions with current and future Azure customers, we’re often asked “do you have a list of all the security-related services and technologies that Azure has to offer?”

When you evaluate cloud service provider options, it’s helpful to have this information. So we have provided this list to get you started.

Over time, this list will change and grow, just as Azure does. Make sure to check this page on a regular basis to stay up-to-date on our security-related services and technologies.

## General Azure security
|Service|Description|
|--------|--------|
|[Azure&nbsp;Security&nbsp;Center](/azure/security-center/security-center-intro)| A cloud workload protection solution that provides security management and advanced threat protection across hybrid cloud workloads.|
|[Azure Key Vault](/azure/key-vault/key-vault-overview)| A secure secrets store for the passwords, connection strings, and other information you need to keep your apps working. |
|[Azure Monitor logs](/azure/log-analytics/log-analytics-overview)|A monitoring service that collects telemetry and other data, and provides a query language and analytics engine to deliver operational insights for your apps and resources. Can be used alone or with other services such as Security Center. |
|[Azure Dev/Test Labs](/azure/lab-services/devtest-lab-overview)|A service that helps developers and testers quickly create environments in Azure while minimizing waste and controlling cost.  |

<!---|[Azure&nbsp;Disk&nbsp;Encryption](/azure/azure-security-disk-encryption-overview)| THIS WILL GO TO THE NEW OVERVIEW TOPIC MEGHAN STEWART IS WRITING|--->

## Storage security
|Service|Description|
|------|--------|
| [Azure&nbsp;Storage&nbsp;Service&nbsp;Encryption](/azure/storage/common/storage-service-encryption)|A security feature that automatically encrypts your data in Azure storage.   |
|[StorSimple Encrypted Hybrid Storage](/azure/storsimple/storsimple-ova-overview)| An integrated storage solution that manages storage tasks between on-premises devices and Azure cloud storage.|
|[Azure Client-Side Encryption](/azure/storage/common/storage-client-side-encryption)| A client-side encryption solution that encrypts data inside client applications before uploading to Azure Storage; also decrypts the data while downloading. |
| [Azure Storage Shared Access Signatures](/azure/storage/common/storage-dotnet-shared-access-signature-part-1)|A shared access signature provides delegated access to resources in your storage account.  |
|[Azure Storage Account Keys](/azure/storage/common/storage-create-storage-account)| An access control method for Azure storage that is used for authentication when the storage account is accessed. |
|[Azure File shares with SMB 3.0 Encryption](/azure/storage/files/storage-files-introduction)|A network security technology that enables automatic network encryption for the Server Message Block (SMB) file sharing protocol. |
|[Azure Storage Analytics](/rest/api/storageservices/Storage-Analytics)| A logging and metrics-generating technology for data in your storage account. |

<!------>

## Database security
|Service|Description|
|------|--------|
| [Azure&nbsp;SQL&nbsp;Firewall](/azure/sql-database/sql-database-firewall-configure)|A network access control feature that protects against network-based attacks to database. |
|[Azure&nbsp;SQL&nbsp;Cell&nbsp;Level Encryption](https://blogs.msdn.microsoft.com/sqlsecurity/2015/05/12/recommendations-for-using-cell-level-encryption-in-azure-sql-database/)| A database security technology that provides encryption at a granular level.  |
| [Azure&nbsp;SQL&nbsp;Connection Encryption](/azure/sql-database/sql-database-control-access)|To provide security, SQL Database controls access with firewall rules limiting connectivity by IP address, authentication mechanisms requiring users to prove their identity, and authorization mechanisms limiting users to specific actions and data. |
| [Azure SQL Always Encryption](/sql/relational-databases/security/encryption/always-encrypted-database-engine?view=sql-server-2017)|Protects sensitive data, such as credit card numbers or national identification numbers (for example, U.S. social security numbers), stored in Azure SQL Database or SQL Server databases.  |
| [Azure&nbsp;SQL&nbsp;Transparent Data Encryption](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql?view=azuresqldb-current)| A database security feature that encrypts the storage of an entire database. |
| [Azure SQL Database Auditing](/azure/sql-database/sql-database-auditing)|A database auditing feature that tracks database events and writes them to an audit log in your Azure storage account.  |


## Identity and access management
|Service|Description|
|------|--------|
| [Azure&nbsp;Role&nbsp;Based&nbsp;Access Control](/azure/active-directory/role-based-access-control-configure)|An access control feature designed to allow users to access only the resources they are required to access based on their roles within the organization.  |
| [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis)|A cloud-based authentication repository that supports a multi-tenant, cloud-based directory and multiple identity management services within Azure.  |
| [Azure Active Directory B2C](/azure/active-directory-b2c/active-directory-b2c-overview)|An identity management service that enables control over how customers sign-up, sign-in, and manage their profiles when using Azure-based applications.   |
| [Azure Active Directory Domain Services](/azure/active-directory-domain-services/overview)| A cloud-based and managed version of Active Directory Domain Services. |
| [Azure Multi-Factor Authentication](/azure/active-directory/authentication/multi-factor-authentication)| A security provision that employs several different forms of authentication and verification before allowing access to secured information. |

## Backup and disaster recovery
|Service|Description|
|------|--------|
| [Azure&nbsp;Backup](/azure/backup/backup-introduction-to-azure-backup)| An Azure-based service used to back up and restore data in the Azure cloud. |
| [Azure&nbsp;Site&nbsp;Recovery](/azure/site-recovery/site-recovery-overview)|An online service that replicates workloads running on physical and virtual machines (VMs) from a primary site to a secondary location to enable recovery of services after a failure. |

## Networking
|Service|Description|
|------|--------|
| [Network&nbsp;Security&nbsp;Groups](/azure/virtual-network/virtual-networks-nsg)| A network-based access control feature using a 5-tuple to make allow or deny decisions.  |
| [Azure VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways)| A network device used as a VPN endpoint to allow cross-premises access to Azure Virtual Networks.  |
| [Azure Application Gateway](/azure/application-gateway/application-gateway-introduction)|An advanced web application load balancer that can route based on URL and perform SSL-offloading. |
|[Web application firewall](/azure/frontdoor/waf-overview) (WAF)|A feature of Application Gateway that provides centralized protection of your web applications from common exploits and vulnerabilities|
| [Azure Load Balancer](/azure/load-balancer/load-balancer-overview)|A TCP/UDP application network load balancer. |
| [Azure ExpressRoute](/azure/expressroute/expressroute-introduction)| A dedicated WAN link between on-premises networks and Azure Virtual Networks. |
| [Azure Traffic Manager](/azure/traffic-manager/traffic-manager-overview)| A global DNS load balancer.|
| [Azure Application Proxy](/azure/active-directory/active-directory-application-proxy-get-started)| An authenticating front-end used to secure remote access for web applications hosted on-premises. |
|[Azure Firewall](/azure/firewall/overview)|A managed, cloud-based network security service that protects your Azure Virtual Network resources.|
|[Azure DDoS protection](/azure/virtual-network/ddos-protection-overview)|Combined with application design best practices, provides defense against DDoS attacks.|
|[Virtual Network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview)|Extends your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection.|