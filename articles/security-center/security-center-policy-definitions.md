---
title: Azure policy definitions monitored in Azure Security Center | Microsoft Docs
description: Azure policy definitions monitored in Azure Security Center.
services: security-center
documentationcenter: na
author: rkarlin
manager: mbaldwin
editor: ''

ms.assetid: c89cb1aa-74e8-4ed1-980a-02a7a25c1a2f
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/22/2018
ms.author: rkarlin

---
# Azure security policies monitored by Azure Security Center
This article provides you with a list of Azure Policy definitions that can be monitored in Security Center.

## Available security policies

To understand the built-in policies that are monitored by Security Center, refer to the following table:

| Policy | What the policy does |
| --- | --- |
|Audit enabling of diagnostics logs in Service Fabric and Virtual Machine Scale Sets|It is recommended to enable Logs so that activity trail can be recreated when investigations are required in the event of an incident or a compromise.|
|Audit authorization rules on Event Hub namespaces|Event Hub clients should not use a namespace level access policy that provides access to all queues and topics in a namespace. To align with the least privilege security model, you should create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Audit existence of authorization rules on Event Hub entities|Audit existence of authorization rules on Event Hub entities to grant least-privileged access.|
|Audit unrestricted network access to storage accounts|Audit unrestricted network access in your storage account firewall settings. Instead, configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific Internet or on-premise clients, access can be granted to traffic from specific Azure virtual networks or to public Internet IP address ranges.|
|Audit usage of custom RBAC rules|Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling.|
|Audit enabling of diagnostic logs in Azure Stream Analytics|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.|
|Audit secure transfer to storage accounts|Audit requirement of Secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking.|
|Audit provisioning of an Azure Active Directory administrator for SQL server|Audit provisioning of an Azure Active Directory administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services.|
|Audit authorization rules on Service Bus namespaces|Service Bus clients should not use a namespace level access policy that provides access to all queues and topics in a namespace. To align with the least privilege security model, you should create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Audit enabling of diagnostic logs in Service Bus|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.|
|Audit the setting of ClusterProtectionLevel property to EncryptAndSign in Service Fabric|Service Fabric provides three levels of protection (None, Sign and EncryptAndSign) for node-to-node communication using a primary cluster certificate. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed.| 
|Audit usage of Azure Active Directory for client authentication in Service Fabric|Audit usage of client authentication only via Azure Active Directory in Service Fabric| 
|Audit enabling of diagnostic logs for Search service|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.| 
|Audit enabling of only secure connections to your Azure Cache for Redis|Audit enabling of only connections via SSL to Azure Cache for Redis. Use of secure connections ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking| 
|Audit enabling of diagnostic logs in Logic Apps|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.| 
|Audit enabling of diagnostic logs in Key Vault|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.|
|Audit enabling of diagnostic logs in Event Hub|Audit enabling of logs and retain them up to a year. This enables recreation of activity trails for investigation purposes when a security incident occurs or your network is compromised.| 
|Audit enabling of diagnostic logs in Azure Data Lake Store|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.| 
|Audit enabling of diagnostic logs in Data Lake Analytics|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.| 
|Audit use of classic storage accounts|Use Azure Resource Manager for your storage accounts to provide security enhancements such as: stronger access control (RBAC), better auditing, Azure Resource Manager based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management.| 
|Audit use of classic virtual machines|Use Azure Resource Manager for your virtual machines to provide security enhancements such as: stronger access control (RBAC), better auditing, Azure Resource Manager based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management.| 
|Audit configuration of metric alert rules on Batch accounts|Audit configuration of metric alert rules on Batch account to enable the required metric.| 
|Audit configuration of metric alert rules on Batch accounts|Audit configuration of metric alert rules on Batch account to enable the required metric.| 
|Audit enabling of diagnostic logs in Batch accounts|Audit enabling of logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.| 
|Audit enablement of encryption of Automation account variables|It is important to enable encryption of Automation account variable assets when storing sensitive data.| 
|Audit enabling of diagnostic logs in App Services|Audit enabling of diagnostic logs on the app. This enables you to recreate activity trails for investigation purposes if a security incident occurs or your network is compromised.| 
|Audit transparent data encryption status|Audit transparent data encryption status for SQL databases.| 
|Audit SQL server level Auditing settings|Audits the existence of SQL Auditing at the server level.| 
|[Preview]: Monitor unencrypted SQL database in Azure Security Center|Unencrypted SQL servers or databases will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor unaudited SQL database in Azure Security Center|SQL servers and databases which doesn't have SQL auditing turned on will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor missing system updates in Azure Security Center|Missing security system updates on your servers will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Audit missing blob encryption for storage accounts|This policy audits storage accounts without blob encryption. It only applies to Microsoft.Storage resource types, not other storage providers. Possible network Just In Time access will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor possible network Just In Time (JIT) access in Azure Security Center|Possible network Just In Time (JIT) access will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor possible app Whitelisting in Azure Security Center|Possible Application Whitelist configuration will be monitored by Azure Security Center.| 
|[Preview]: Monitor permissive network access in Azure Security Center|Network Security Groups with too permissive rules will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor OS vulnerabilities in Azure Security Center|Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor missing Endpoint Protection in Azure Security Center|Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor unencrypted VM Disks in Azure Security Center|VMs without an enabled disk encryption will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor VM Vulnerabilities in Azure Security Center|Monitors vulnerabilities detected by Vulnerability Assessment solution and VMs without a Vulnerability Assessment solution in Azure Security Center as recommendations.| 
|[Preview]: Monitor unprotected web application in Azure Security Center|Web applications without a Web Application Firewall protection will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor unprotected network endpoints in Azure Security Center|Network endpoints without a Next Generation Firewall's protection will be monitored by Azure Security Center as recommendations.| 
|[Preview]: Monitor SQL vulnerability assessment results in Azure Security Center|Monitor Vulnerability Assessment scan results and recommendations for how to remediate database vulnerabilities.| 
|[Preview]: Audit maximum number of owners for a subscription|It is recommended to designate up to 3 subscription owners in order to reduce the potential for breach by a compromised owner.| 
|[Preview]: Audit minimum number of owners for subscription|It is recommended to designate more than one subscription owner in order to have administrator access redundancy.| 
|[Preview]: Audit accounts with owner permissions who are not MFA enabled on a subscription|Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with owner permissions to prevent a breach of accounts or resources.| 
|[Preview]: Audit accounts with write permissions who are not MFA enabled on a subscription|Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources.| 
|[Preview]: Audit accounts with read permissions who are not MFA enabled on a subscription|Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with read privileges to prevent a breach of accounts or resources.| 
|[Preview]: Audit deprecated accounts with owner permissions on a subscription|Deprecated accounts with owner permissions should be removed from your subscription. Deprecated accounts are accounts that have been blocked from signing in.| 
|[Preview]: Audit deprecated accounts on a subscription|Deprecated accounts should be removed from your subscriptions. Deprecated accounts are accounts that have been blocked from signing in.| 
|[Preview]: Audit external accounts with owner permissions on a subscription|External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access.| 
|[Preview]: Audit external accounts with write permissions on a subscription|External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access.| 
|[Preview]: Audit external accounts with read permissions on a subscription|External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access.| 




## Next steps
In this article, you learned how to configure security policies in Security Center. To learn more about Security Center, see the following articles:

* [Azure Security Center planning and operations guide](security-center-planning-and-operations-guide.md): Learn how to plan and understand the design considerations about Azure Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md): Learn how to monitor the health of your Azure resources.
* [Manage and respond to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitor partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md): Get answers to frequently asked questions about using the service.
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.

To learn more about Azure Policy, see [What is Azure Policy?](../azure-policy/azure-policy-introduction.md)
