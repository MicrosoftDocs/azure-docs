---
title: Azure policy definitions monitored in Azure Security Center | Microsoft Docs
description: Azure policy definitions monitored in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: ''

ms.assetid: c89cb1aa-74e8-4ed1-980a-02a7a25c1a2f
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 5/19/2019
ms.author: v-monhabe

---
# Azure security policies monitored by Security Center
This article provides a list of Azure Policy definitions that you can monitor in Azure Security Center. For more information about security policies, see [Working with security policies](tutorial-security-policy.md).

## Available security policies

To learn about the built-in policies that are monitored by Security Center, see the following table:

| Policy | What the policy does |
| --- | --- |
|Diagnostics logs in Virtual Machine Scale Sets should be enabled|We recommend that you enable logs so that an activity trail is available for investigation after an incident or compromise.|
|All authorization rules except RootManageSharedAccessKey should be removed from Event Hub namespace|Azure Event Hubs clients shouldn't use a namespace-level access policy that provides access to all queues and topics in a namespace. To align with the least-privilege security model, you should create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Authorization rules on the Event Hub entity should be defined|Audit the existence of authorization rules on Event Hubs entities to grant least-privilege access.|
|Access to storage accounts with firewall and virtual network configurations should be restricted|Audit unrestricted network access in your storage account firewall settings. Configure network rules so that only applications from allowed networks can access the storage account. To allow connections from specific internet or on-premises clients, grant access to traffic from specific Azure virtual networks or to public internet IP address ranges.|
|Audit usage of custom RBAC rules|Audit built-in roles, such as "Owner, Contributor, Reader" instead of custom role-based access control (RBAC) roles, which are error prone. Use of custom roles is treated as an exception and requires rigorous review and threat modeling.|
|Diagnostics logs in Azure Stream Analytics should be enabled|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Secure transfer to storage accounts should be enabled|Audit requirements of secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service. It also protects data in transit from network layer attacks, such as man-in-the-middle, eavesdropping, and session-hijacking.|
|Azure AD administrator for SQL server should be provisioned|Audit provisioning of an Azure Active Directory (Azure AD) administrator for SQL Server to enable Azure AD authentication. Azure AD authentication supports simplified permission management and centralized identity management of database users and other Microsoft services.|
|All authorization rules except RootManageSharedAccessKey should be removed from Service Bus namespace|Azure Service Bus clients shouldn't use a namespace-level access policy that provides access to all queues and topics in a namespace. To align with the least-privilege security model, create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Diagnostics logs in Service Bus should be enabled|Audit enabling of logs and keep them up for to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|The ClusterProtectionLevel property to EncryptAndSign in Service Fabric should be set|Service Fabric provides three levels of protection for node-to-node communication that uses a primary cluster certificate: None, Sign, and EncryptAndSign. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed.|
|Client authentication should use Azure Active Directory|Audit use of client authentication only via Azure AD in Service Fabric.|
|Diagnostics logs in Search services should be enabled|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Only secure connections to your Redis Cache should be enabled|Audit enabling only of connections via SSL to Azure Cache for Redis. Use of secure connections ensures authentication between the server and the service. It also protects data in transit from network layer attacks, such as man-in-the-middle, eavesdropping, and session-hijacking.|
|Diagnostics logs in Logic Apps should be enabled|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Diagnostics logs in Key Vault should be enabled|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Diagnostics logs in Event Hub should be enabled|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Diagnostics logs in Azure Data Lake Store should be enabled|Audit enabling of logs and keep them up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Diagnostics logs in Data Lake Analytics should be enabled|Audit enabling of logs and  keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Storage accounts should be migrated to new AzureRM resources|Use Azure Resource Manager for your storage accounts to provide security enhancements. These include: <br>- Stronger access control (RBAC)<br>- Better auditing<br>- Azure Resource Manager-based deployment and governance<br>- Access to managed identities<br>- Access to Azure Key Vault for secrets<br>- Azure AD-based authentication<br>- Support for tags and resource groups for easier security management|
|Virtual machines should be migrated to new AzureRM resources|Use Azure Resource Manager for your virtual machines to provide security enhancements.  These include: <br>- Stronger access control (RBAC)<br>- Better auditing<br>- Azure Resource Manager-based deployment and governance<br>- Access to managed identities<br>- Access to Azure Key Vault for secrets<br>- Azure AD-based authentication<br>- Support for tags and resource groups for easier security management|
|Metric alert rules should be configured on Batch accounts|Audit configuration of metric alert rules on Azure Batch accounts to enable the required metric.|
|Diagnostic logs in Batch accounts should be enabled|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Encryption should be enabled on Automation account variables|It's important to enable encryption of Azure Automation account variable assets when you store sensitive data.|
|Diagnostics logs in App Services should be enabled|Audit enabling of diagnostic logs on the app. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Transparent Data Encryption on SQL databases should be enabled|Audit transparent data encryption status for SQL databases.|
|SQL server auditing should be enabled|Audit the existence of SQL auditing at the server level.|
|\[Preview]: Monitor unencrypted SQL database in Azure Security Center|Azure Security Center monitors unencrypted SQL servers or databases as recommended.|
|\[Preview]: Monitor unaudited SQL database in Azure Security Center|Azure Security Center monitors SQL servers and databases that don't have SQL auditing turned on as recommended.|
|\[Preview]: System updates should be installed on your machines|Azure Security Center monitors missing security system updates on your servers as recommended.|
|\[Preview]: Audit missing blob encryption for storage accounts|Audit storage accounts that don't use blob encryption. This only applies to Microsoft storage resource types, not storage from other providers. Azure Security Center monitors possible network just-in-time access as recommended.|
|\[Preview]: Just-In-Time network access control should be applied on virtual machines|Azure Security Center monitors possible network just-in-time access as recommended.|
|\[Preview]: Adaptive Application Controls should be enabled on virtual machines|Azure Security Center monitors possible application whitelist configuration.|
|\[Preview]: Missing Network Security Groups for virtual machines should be configured|Azure Security Center monitors network security groups that have too-permissive rules, as recommended.|
|\[Preview]: Vulnerabilities in security configuration on your machines should be remediated|Azure Security Center monitors servers that don't satisfy the configured baseline as recommended.| 
|\[Preview]: Endpoint protection should be installed on virtual machines|Azure Security Center monitors servers that don't have an installed Microsoft System Center Endpoint Protection agent as recommended.|
|\[Preview]: Disk encryption should be applied on virtual machines|Azure Security Center monitors virtual machines that don't have disk encryption enabled as recommended.|
|\[Preview]: Vulnerabilities should be remediated by a Vulnerability Assessment solution|Monitor vulnerabilities that are detected by the vulnerability assessment solution and VMs that don't have a vulnerability assessment solution in Azure Security Center as recommended.|
|\[Preview]: Monitor unprotected web application in Azure Security Center|Azure Security Center monitors web applications that lack web application firewall protection as recommended.|
|\[Preview]: Endpoint protection solution should be installed on virtual machines|Azure Security Center monitors network endpoints that don't have next generation firewall protection as recommended.|
|\[Preview]: Vulnerabilities on your SQL databases should be remediated|Monitor vulnerability assessment scan results and recommend how to remediate database vulnerabilities.|
|\[Preview]: A maximum of 3 owners should be designated for your subscription|We recommend that you designate up to three subscription owners to reduce the potential for breach by a compromised owner.|
|\[Preview]: There should be more than one owner assigned to your subscription|We recommended that you designate more than one subscription owner to ensure administrator access redundancy.|
|\[Preview]: MFA should be enabled on accounts with owner permissions on your subscription |Multi-factor authentication (MFA) should be enabled for all subscription accounts that have owner permissions to prevent a breach of accounts or resources.|
|\[Preview]: MFA should be enabled on your subscription accounts with write permissions|Multi-factor authentication should be enabled for all subscription accounts that have write permissions to prevent breach of accounts or resources.|
|\[Preview]: MFA should be enabled on your subscription accounts with read permissions|Multi-factor authentication should be enabled for all subscription accounts that have read permissions to prevent breach of accounts or resources.|
|\[Preview]: Deprecated accounts with owner permissions should be removed from your subscription|Deprecated accounts that have owner permissions should be removed from your subscription. Deprecated accounts have been blocked from signing in.|
|\[Preview]: Deprecated accounts should be removed from your subscription|Deprecated accounts should be removed from your subscriptions. Deprecated accounts have been blocked from signing in.|
|\[Preview]: External accounts with owner permissions should be removed from your subscription|External accounts that have owner permissions should be removed from your subscription to prevent permissions access.|
|\[Preview]: External accounts with write permissions should be removed from your subscription|External accounts that have write permissions should be removed from your subscription to prevent unmonitored access.|
|\[Preview]: External accounts with read permissions should be removed  from your subscription|External accounts that have read permissions should be removed from your subscription to prevent unmonitored access.|




## Next steps
In this article, you learned how to configure security policies in Security Center. To learn more about Security Center, see the following articles.

* [Azure Security Center planning and operations guide](security-center-planning-and-operations-guide.md): Learn how to plan and understand design considerations in Azure Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md): Learn how to monitor the health of your Azure resources.
* [Manage and respond to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitor partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md): Get answers to frequently asked questions about using the service.
* [Azure Security Blog](https://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.

To learn more about Azure Policy, see [What is Azure Policy?](../governance/policy/overview.md).
