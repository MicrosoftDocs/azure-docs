---
title: Azure Security Services and Technologies | Microsoft Docs
description: The article provides a curated list of Azure Security services and technologies.
services: security
documentationcenter: na
author: terrylanfear
manager: rkarlin

ms.assetid: a5a7f60a-97e2-49b4-a8c5-7c010ff27ef8
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/16/2023
ms.author: terrylan

---
# Security services and technologies available on Azure

In our discussions with current and future Azure customers, we're often asked "do you have a list of all the security-related services and technologies that Azure has to offer?"

When you evaluate cloud service provider options, it's helpful to have this information. So we have provided this list to get you started.

Over time, this list will change and grow, just as Azure does. Make sure to check this page on a regular basis to stay up-to-date on our security-related services and technologies.

## General Azure security
|Service|Description|
|--------|--------|
|[Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md)| A cloud workload protection solution that provides security management and advanced threat protection across hybrid cloud workloads.|
|[Microsoft Sentinel](../../sentinel/overview.md)| A scalable, cloud-native solution that delivers intelligent security analytics and threat intelligence across the enterprise.|
|[Azure Key Vault](../../key-vault/general/overview.md)| A secure secrets store for the passwords, connection strings, and other information you need to keep your apps working. |
|[Azure Monitor logs](../../azure-monitor/logs/log-query-overview.md)|A monitoring service that collects telemetry and other data, and provides a query language and analytics engine to deliver operational insights for your apps and resources. Can be used alone or with other services such as Defender for Cloud. |
|[Azure Dev/Test Labs](../../devtest-labs/devtest-lab-overview.md)|A service that helps developers and testers quickly create environments in Azure while minimizing waste and controlling cost.  |

<!---|[Azure&nbsp;Disk&nbsp;Encryption](/azure/azure-security-disk-encryption-overview)| THIS WILL GO TO THE NEW OVERVIEW TOPIC MEGHAN STEWART IS WRITING|--->

## Storage security
|Service|Description|
|------|--------|
| [Azure&nbsp;Storage&nbsp;Service&nbsp;Encryption](../../storage/common/storage-service-encryption.md)|A security feature that automatically encrypts your data in Azure storage.   |
|[Azure StorSimple Virtual Array](../../storsimple/storsimple-ova-overview.md)| An integrated storage solution that manages storage tasks between an on-premises virtual array running in a hypervisor and Microsoft Azure cloud storage.|
|[Client-Side encryption for blobs](../../storage/blobs/client-side-encryption.md)| A client-side encryption solution that supports encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client. |
| [Azure Storage shared access signatures](../../storage/common/storage-sas-overview.md)|A shared access signature (SAS) provides delegated access to resources in your storage account.  |
|[Azure Storage Account Keys](../../storage/common/storage-account-create.md)| An access control method for Azure storage that is used authorize requests to the storage account using either the account access keys or a Microsoft Entra account (default). |
|[Azure File shares](../../storage/files/storage-files-introduction.md)| A storage security technology that offers fully managed file shares in the cloud that are accessible via the industry standard Server Message Block (SMB) protocol, Network File System (NFS) protocol, and Azure Files REST AP. |
|[Azure Storage Analytics](../../storage/common/storage-analytics.md)| A logging and metrics-generating technology for data in your storage account. |

<!------>

## Database security
|Service|Description|
|------|--------|
| [Azure&nbsp;SQL&nbsp;Firewall](/azure/azure-sql/database/firewall-configure)|A network access control feature that protects against network-based attacks to database. |
| [Azure&nbsp;SQL&nbsp;Connection Encryption](/azure/azure-sql/database/logins-create-manage)|To provide security, SQL Database controls access with firewall rules limiting connectivity by IP address, authentication mechanisms requiring users to prove their identity, and authorization mechanisms limiting users to specific actions and data. |
| [Azure SQL Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine)|Protects sensitive data, such as credit card numbers or national/regional identification numbers (for example, U.S. social security numbers), stored in Azure SQL Database, Azure SQL Managed Instance, and SQL Server databases.  |
| [Azure&nbsp;SQL&nbsp;transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql)| A database security feature that helps protect Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics against the threat of malicious offline activity by encrypting data at rest. |
| [Azure SQL Database Auditing](/azure/azure-sql/database/auditing-overview)|An auditing feature for Azure SQL Database and Azure Synapse Analytics that tracks database events and writes them to an audit log in your Azure storage account, Log Analytics workspace, or Event Hubs.  |
| [Virtual network rules](/azure/azure-sql/database/vnet-service-endpoint-rule-overview)|A firewall security feature that controls whether the server for your databases and elastic pools in Azure SQL Database or for your dedicated SQL pool (formerly SQL DW) databases in Azure Synapse Analytics accepts communications that are sent from particular subnets in virtual networks. |

## Identity and access management
|Service|Description|
|------|--------|
| [Azure&nbsp;role-based&nbsp;access control](../../role-based-access-control/role-assignments-portal.md)|An access control feature designed to allow users to access only the resources they are required to access based on their roles within the organization.  |
| [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md)|A cloud-based identity and access management service that supports a multi-tenant, cloud-based directory and multiple identity management services within Azure.  |
| [Azure Active Directory B2C](../../active-directory-b2c/overview.md)| A customer identity access management (CIAM) solution that enables control over how customers sign-up, sign-in, and manage their profiles when using Azure-based applications.   |
| [Microsoft Entra Domain Services](../../active-directory-domain-services/overview.md)| A cloud-based and managed version of Active Directory Domain Services that provides managed domain services such as domain join, group policy, lightweight directory access protocol (LDAP), and Kerberos/NTLM authentication. |
| [Microsoft Entra multifactor authentication](../../active-directory/authentication/concept-mfa-howitworks.md)| A security provision that employs several different forms of authentication and verification before allowing access to secured information. |

## Backup and disaster recovery
|Service|Description|
|------|--------|
| [Azure&nbsp;Backup](../../backup/backup-overview.md)| An Azure-based service used to back up and restore data in the Azure cloud. |
| [Azure&nbsp;Site&nbsp;Recovery](../../site-recovery/site-recovery-overview.md)|An online service that replicates workloads running on physical and virtual machines (VMs) from a primary site to a secondary location to enable recovery of services after a failure. |

## Networking
|Service|Description|
|------|--------|
| [Network&nbsp;Security&nbsp;Groups](../../virtual-network/network-security-groups-overview.md)| A network-based access control feature to filter network traffic between Azure resources in an Azure virtual network.  |
| [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)| A network device used as a VPN endpoint to allow cross-premises access to Azure Virtual Networks.  |
| [Azure Application Gateway](../../application-gateway/overview.md)|An advanced web traffic load balancer that enables you to manage traffic to your web applications. |
|[Web application firewall](../../web-application-firewall/overview.md) (WAF)|A feature that provides centralized protection of your web applications from common exploits and vulnerabilities|
| [Azure Load Balancer](../../load-balancer/load-balancer-overview.md)|A TCP/UDP application network load balancer. |
| [Azure ExpressRoute](../../expressroute/expressroute-introduction.md)| A feature that lets you extend your on-premises networks into the Microsoft cloud over a private connection with the help of a connectivity provider. |
| [Azure Traffic Manager](../../traffic-manager/traffic-manager-overview.md)| A DNS-based traffic load balancer.|
| [Microsoft Entra application proxy](../../active-directory/app-proxy/application-proxy.md)| An authenticating front-end used to secure remote access to on-premises web applications. |
|[Azure Firewall](../../firewall/overview.md)|A cloud-native and intelligent network firewall security service that provides threat protection for your cloud workloads running in Azure.|
|[Azure DDoS protection](../../ddos-protection/ddos-protection-overview.md)|Combined with application design best practices, provides defense against DDoS attacks.|
|[Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)| Provides secure and direct connectivity to Azure services over an optimized route over the Azure backbone network. |
|[Azure Private Link](../../private-link/private-link-overview.md)|Enables you to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer-owned/partner services over a private endpoint in your virtual network.|
|[Azure Bastion](../../bastion/bastion-overview.md)|A service you deploy that lets you connect to a virtual machine using your browser and the Azure portal, or via the native SSH or RDP client already installed on your local computer.|
|[Azure Front Door](../../frontdoor/front-door-application-security.md)|Provides web application protection capability to safeguard your web applications from network attacks and common web vulnerabilities exploits like SQL Injection or Cross Site Scripting (XSS).|

## Next steps

Learn more about Azure's [end-to-end security](end-to-end.md) and how Azure services can help you meet the security needs of your business and protect your users, devices, resources, data, and applications in the cloud.
