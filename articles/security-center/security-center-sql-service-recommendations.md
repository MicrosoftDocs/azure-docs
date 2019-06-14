---
title: Protecting Azure SQL service and data in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Azure Security Center that help you protect your data and Azure SQL service and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: ''

ms.assetid: bcae6987-05d0-4208-bca8-6a6ce7c9a1e3
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/27/2019
ms.author: monhaber

---
# Protecting Azure SQL service and data in Azure Security Center
Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL and data, and applications.


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
|Storage account|20|Secure transfer to storage accounts should be enabled|Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking.|
|Redis|20|Only secure connections to your Redis Cache should be enabled|Enable only connections via SSL to Azure Cache for Redis. Use of secure connections ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking.|
|SQL|15|Transparent Data Encryption on SQL databases should be enabled|Enable transparent data encryption to protect data-at-rest and meet compliance requirements.|
|SQL|15|SQL server auditing should be enabled|Enable auditing  for Azure SQL servers. (Azure SQL service only. Doesn't include SQL running on your virtual machines.)|
|Data lake analytics|5|Diagnostics logs in Data Lake Analytics should be enabled|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Data lake store|5|Diagnostics logs in Azure Data Lake Store should be enabled|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|SQL|30|Vulnerabilities on your SQL databases should be remediated|SQL Vulnerability Assessment scans your database for security vulnerabilities and exposes any deviations from best practices such as misconfigurations, excessive permissions and unprotected sensitive data. Resolving the vulnerabilities found can greatly improve your database security stature.|
|SQL|20|Provision an Azure AD administrator for SQL server|Provision an Azure AD administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services.|
|Storage account|15|Access to storage accounts with firewall and virtual network configurations should be restricted|Audit unrestricted network access in your storage account firewall settings. Instead, configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific Internet or on-premises clients, you can grant access to traffic from specific Azure virtual networks or to public Internet IP address ranges.|
|Storage account|1|Storage accounts should be migrated to new Azure Resource Manager resources|Use new Azure Resource Manager v2 for your storage accounts to provide security enhancements such as: stronger access control (RBAC), better auditing, Resource Manager-based deployment and governance, access to managed identities, access to key vault for secrets, and Azure AD-based authentication and support for tags and resource groups for easier security management.|

## See also
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
* [Protecting your applications in Azure Security Center](security-center-application-recommendations.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
