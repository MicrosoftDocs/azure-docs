---
title: Azure policy definitions monitored in Azure Security Center | Microsoft Docs
description: Azure policy definitions monitored in Azure Security Center.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: c89cb1aa-74e8-4ed1-980a-02a7a25c1a2f
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/15/2019
ms.author: rkarlin

---
# Azure security policies monitored by Security Center
This article provides a list of Azure Policy definitions that you can monitor in Azure Security Center. For more information about security policies, see [Working with security policies](tutorial-security-policy.md).

## Available security policies

To learn about the built-in policies that are monitored by Security Center, see the following table:

| Policy | What the policy does |
| --- | --- |
|Audit enabling of diagnostics logs in Azure Service Fabric and virtual machine scale sets|We recommend that you enable logs so that an activity trail is available for investigation after an incident or compromise.|
|Audit authorization rules on Event Hubs namespaces|Azure Event Hubs clients shouldn't use a namespace-level access policy that provides access to all queues and topics in a namespace. To align with the least-privilege security model, you should create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Audit existence of authorization rules on Event Hubs entities|Audit the existence of authorization rules on Event Hubs entities to grant least-privilege access.|
|Audit unrestricted network access to storage accounts|Audit unrestricted network access in your storage account firewall settings. Configure network rules so that only applications from allowed networks can access the storage account. To allow connections from specific internet or on-premises clients, grant access to traffic from specific Azure virtual networks or to public internet IP address ranges.|
|Audit usage of custom RBAC rules|Audit built-in roles, such as "Owner, Contributor, Reader" instead of custom role-based access control (RBAC) roles, which are error prone. Use of custom roles is treated as an exception and requires rigorous review and threat modeling.|
|Audit enabling of diagnostic logs in Azure Stream Analytics|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit secure transfer to storage accounts|Audit requirements of secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service. It also protects data in transit from network layer attacks, such as man-in-the-middle, eavesdropping, and session-hijacking.|
|Audit provisioning of an Azure Active Directory administrator for SQL Server|Audit provisioning of an Azure Active Directory (Azure AD) administrator for SQL Server to enable Azure AD authentication. Azure AD authentication supports simplified permission management and centralized identity management of database users and other Microsoft services.|
|Audit authorization rules on Service Bus namespaces|Azure Service Bus clients shouldn't use a namespace-level access policy that provides access to all queues and topics in a namespace. To align with the least-privilege security model, create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Audit enabling of diagnostic logs in Service Bus|Audit enabling of logs and keep them up for to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit the setting of ClusterProtectionLevel property to EncryptAndSign in Service Fabric|Service Fabric provides three levels of protection for node-to-node communication that uses a primary cluster certificate: None, Sign, and EncryptAndSign. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed.|
|Audit usage of Azure Active Directory for client authentication in Service Fabric|Audit use of client authentication only via Azure AD in Service Fabric.|
|Audit enabling of diagnostic logs for Search service|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit enabling of only secure connections to Azure Cache for Redis|Audit enabling only of connections via SSL to Azure Cache for Redis. Use of secure connections ensures authentication between the server and the service. It also protects data in transit from network layer attacks, such as man-in-the-middle, eavesdropping, and session-hijacking.|
|Audit enabling of diagnostic logs in Logic Apps|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit enabling of diagnostic logs in Key Vault|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit enabling of diagnostic logs in Event Hubs|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit enabling of diagnostic logs in Azure Data Lake Store|Audit enabling of logs and keep them up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit enabling of diagnostic logs in Data Lake Analytics|Audit enabling of logs and  keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit use of classic storage accounts|Use Azure Resource Manager for your storage accounts to provide security enhancements. These include: <br>- Stronger access control (RBAC)<br>- Better auditing<br>- Azure Resource Manager-based deployment and governance<br>- Access to managed identities<br>- Access to Azure Key Vault for secrets<br>- Azure AD-based authentication<br>- Support for tags and resource groups for easier security management|
|Audit use of classic virtual machines|Use Azure Resource Manager for your virtual machines to provide security enhancements.  These include: <br>- Stronger access control (RBAC)<br>- Better auditing<br>- Azure Resource Manager-based deployment and governance<br>- Access to managed identities<br>- Access to Azure Key Vault for secrets<br>- Azure AD-based authentication<br>- Support for tags and resource groups for easier security management|
|Audit configuration of metric alert rules on Batch accounts|Audit configuration of metric alert rules on Azure Batch accounts to enable the required metric.|
|Audit enabling of diagnostic logs in Batch accounts|Audit enabling of logs and keep them for up to a year. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit enabling of encryption of Automation account variables|It's important to enable encryption of Azure Automation account variable assets when you store sensitive data.|
|Audit enabling of diagnostic logs in App Service|Audit enabling of diagnostic logs on the app. This creates activity trails for investigation when a security incident occurs or your network is compromised.|
|Audit transparent data encryption status|Audit transparent data encryption status for SQL databases.|
|Audit SQL Server-level Auditing settings|Audit the existence of SQL auditing at the server level.|
|\[Preview]: Monitor unencrypted SQL database in Azure Security Center|Azure Security Center monitors unencrypted SQL servers or databases as recommended.|
|\[Preview]: Monitor unaudited SQL database in Azure Security Center|Azure Security Center monitors SQL servers and databases that don't have SQL auditing turned on as recommended.|
|\[Preview]: Monitor missing system updates in Azure Security Center|Azure Security Center monitors missing security system updates on your servers as recommended.|
|\[Preview]: Audit missing blob encryption for storage accounts|Audit storage accounts that don't use blob encryption. This only applies to Microsoft storage resource types, not storage from other providers. Azure Security Center monitors possible network just-in-time access as recommended.|
|\[Preview]: Monitor possible network just-in-time access in Azure Security Center|Azure Security Center monitors possible network just-in-time access as recommended.|
|\[Preview]: Monitor possible app Whitelisting in Azure Security Center|Azure Security Center monitors possible application whitelist configuration.|
|\[Preview]: Monitor permissive network access in Azure Security Center|Azure Security Center monitors network security groups that have too-permissive rules, as recommended.|
|\[Preview]: Monitor OS vulnerabilities in Azure Security Center|Azure Security Center monitors servers that don't satisfy the configured baseline as recommended.| 
|\[Preview]: Monitor missing Endpoint Protection in Azure Security Center|Azure Security Center monitors servers that don't have an installed Microsoft System Center Endpoint Protection agent as recommended.|
|\[Preview]: Monitor unencrypted VM disks in Azure Security Center|Azure Security Center monitors virtual machines that don't have disk encryption enabled as recommended.|
|\[Preview]: Monitor VM vulnerabilities in Azure Security Center|Monitor vulnerabilities that are detected by the vulnerability assessment solution and VMs that don't have a vulnerability assessment solution in Azure Security Center as recommended.|
|\[Preview]: Monitor unprotected web application in Azure Security Center|Azure Security Center monitors web applications that lack web application firewall protection as recommended.|
|\[Preview]: Monitor unprotected network endpoints in Azure Security Center|Azure Security Center monitors network endpoints that don't have next generation firewall protection as recommended.|
|\[Preview]: Monitor SQL vulnerability assessment results in Azure Security Center|Monitor vulnerability assessment scan results and recommend how to remediate database vulnerabilities.|
|\[Preview]: Audit maximum number of owners for a subscription|We recommend that you designate up to three subscription owners to reduce the potential for breach by a compromised owner.|
|\[Preview]: Audit minimum number of owners for subscription|We recommended that you designate more than one subscription owner to ensure administrator access redundancy.|
|\[Preview]: Audit accounts with owner permissions who are not MFA enabled on a subscription|Multi-factor authentication (MFA) should be enabled for all subscription accounts that have owner permissions to prevent a breach of accounts or resources.|
|\[Preview]: Audit accounts with write permissions who are not MFA enabled on a subscription|Multi-factor authentication should be enabled for all subscription accounts that have write permissions to prevent breach of accounts or resources.|
|\[Preview]: Audit accounts with read permissions who are not MFA enabled on a subscription|Multi-factor authentication should be enabled for all subscription accounts that have read permissions to prevent breach of accounts or resources.|
|\[Preview]: Audit deprecated accounts with owner permissions on a subscription|Deprecated accounts that have owner permissions should be removed from your subscription. Deprecated accounts have been blocked from signing in.|
|\[Preview]: Audit deprecated accounts on a subscription|Deprecated accounts should be removed from your subscriptions. Deprecated accounts have been blocked from signing in.|
|\[Preview]: Audit external accounts with owner permissions on a subscription|External accounts that have owner permissions should be removed from your subscription to prevent permissions access.|
|\[Preview]: Audit external accounts with write permissions on a subscription|External accounts that have write permissions should be removed from your subscription to prevent unmonitored access.|
|\[Preview]: Audit external accounts with read permissions on a subscription|External accounts that have read permissions should be removed from your subscription to prevent unmonitored access.|




## Next steps
In this article, you learned how to configure security policies in Security Center. To learn more about Security Center, see the following articles.

* [Azure Security Center planning and operations guide](security-center-planning-and-operations-guide.md): Learn how to plan and understand design considerations in Azure Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md): Learn how to monitor the health of your Azure resources.
* [Manage and respond to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitor partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md): Get answers to frequently asked questions about using the service.
* [Azure Security Blog](https://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.

To learn more about Azure Policy, see [What is Azure Policy?](../governance/policy/overview.md).
