---
title: Protecting Azure SQL service and data in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Azure Security Center that help you protect your data and Azure SQL service and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: bcae6987-05d0-4208-bca8-6a6ce7c9a1e3
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/28/2018
ms.author: terrylan

---
# Protecting Azure SQL service and data in Azure Security Center
Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL and data, and applications.

This article addresses recommendations that apply to Azure SQL service and data. Recommendations center around enabling auditing for Azure SQL servers and databases, enabling encryption for SQL databases, and enabling encryption of your Azure storage account.  Use the table below as a reference to help you understand the available SQL service and data recommendations and what each one does if you apply it.
### Monitor data security

When you click **Data security** in the **Prevention** section, the **Data Resources** opens with recommendations for SQL and Storage. It also has [recommendations](security-center-sql-service-recommendations.md) for the general health state of the database. For more information about storage encryption, read [Enable encryption for Azure storage account in Azure Security Center](security-center-enable-encryption-for-storage-account.md).

![Data Resources](./media/security-center-monitoring/security-center-monitoring-fig13-newUI-2017.png)

Under **SQL Recommendations**, You can click any recommendation and get more details about further action to resolve an issue. The following example shows the expansion of the **Database Auditing & Threat detection on SQL databases** recommendation.

![Details about a SQL recommendation](./media/security-center-monitoring/security-center-monitoring-fig14-ga-new.png)

The **Enable Auditing & Threat detection on SQL databases** has the following information:

* A list of SQL databases
* The server on which they are located
* Information about whether this setting was inherited from the server or if it is unique in this database
* The current state
* The severity of the issue

When you click the database to address this recommendation, the **Auditing & Threat detection** opens as shown in the following screen.

![Auditing & Threat detection](./media/security-center-monitoring/security-center-monitoring-fig15-ga.png)

To enable auditing, select **ON** under the **Auditing** option.

## Data and storage recommendations

|Resource type|Secure score|Recommendation|Description|
|----|----|----|----|
|Storage account|20|Require secure transfer to storage account|Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking.|
|Redis|20|Enable only secure connections to your Azure Cache for Redis|Enable only connections via SSL to Azure Cache for Redis. Use of secure connections ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking.|
|SQL|15|Enable Transparent Data Encryption on SQL databases|Enable transparent data encryption to protect data-at-rest and meet compliance requirements.|
|SQL|15|Enable auditing on SQL servers|Enable auditing  for Azure SQL servers. (Azure SQL service only. Doesn't include SQL running on your virtual machines.)|
|SQL|15|Enable auditing on SQL databases|Enable auditing for Azure SQL databases. (Azure SQL service only. Doesn't include SQL running on your virtual machines.)|
|Data lake analytics|15|Enable encryption at rest of the Data Lake Analytics|Enable transparent data encryption to secure data at rest in your Data Lake Analytics. Encryption at rest is transparent, meaning that the Data Lake Analytics automatically encrypts data prior to persisting, and decrypts data prior to retrieval. There are no changes required in the in applications and services that interact with Data Lake Analytics because of encryption. Encryption at rest minimizes the risk of data loss from physical theft and also helps meet regulatory compliance requirements.|
|Data lake store|15|Enable encryption at rest for the Data Lake Store|Enable transparent data encryption to secure data at rest in your Data Lake Store. Encryption at rest is transparent, meaning that the Data Lake Store automatically encrypts data prior to persisting, and decrypts data prior to retrieval. You don't have to make any changes in the applications and services that interact with Data Lake Store to accommodate encryption. Encryption at rest minimizes the risk of data loss from physical theft and also helps meet regulatory compliance requirements.|
|Storage account|15|Enable encryption for Azure Storage Account|Enable Azure Storage Service Encryption for data at rest. Storage Service Encryption (SSE) works by encrypting the data when it is written to Azure storage and decrypts before retrieval. SSE is currently available only for the Azure Blob service and can be used for block blobs, page blobs, and append blobs.|
|Data lake analytics|5|Enable diagnostics logs in Data Lake Analytics|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Data lake store|5|Enable diagnostics logs in Azure Data Lake Store|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|SQL|30|Remediate vulnerabilities on your SQL databases|SQL Vulnerability Assessment scans your database for security vulnerabilities and exposes any deviations from best practices such as misconfigurations, excessive permissions and unprotected sensitive data. Resolving the vulnerabilities found can greatly improve your database security stature.|
|SQL|20|Provision an Azure AD administrator for SQL server|Provision an Azure AD administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services.|
|Storage account|15|Disable unrestricted network access to storage account|Audit unrestricted network access in your storage account firewall settings. Instead, configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific Internet or on-premise clients, access can be granted to traffic from specific Azure virtual networks or to public Internet IP address ranges.|
|Storage account|1||Migrate storage accounts to new AzureRM resources|Use new Azure Resource Manager v2, for your storage accounts to provide security enhancements such as: stronger access control (RBAC), better auditing, Resource Manager-based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management.|



## See also
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
* [Protecting your applications in Azure Security Center](security-center-application-recommendations.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-azure-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
