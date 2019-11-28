---
title: Azure secure score enhancements | Microsoft Docs
description: "Azure secure score enhancements (Preview)"
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: c42d02e4-201d-4a95-8527-253af903a5c6
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/04/2019
ms.author: memildin

---
# An introduction to Secure Score (Preview)

Azure Security Center has two main goals:

* To help you understand your current security situation
* To help you efficiently and effectively improve your security

The central aspect of Security Center that enables you to achieve those goals is **Secure Score**.

Security Center continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can tell, at a glance, your current security situation: the higher the score, the lower the identified risk level.

You can also use this score to track your security posture over time and track security efforts and projects in your organization. The enhanced Secure Score (currently in preview) adds a percentage to the display to make it even simpler to track over time:

[![The enhanced Secure Score (preview) now includes a percentage](media/secure-score-and-controls/secure-score-with-percentage.png)](media/secure-score-and-controls/secure-score-with-percentage.png#lightbox)


## Where is your secure score? 

Security Center displays your score prominently: it's the first thing shown in the Overview page. If you click through to the dedicated Secure Score page, you'll see the score broken down by subscription. If you then click a single subscription, you'll see the detailed list of prioritized recommendations and the potential impact that remediating them will have on the subscription’s score. 

## How is the Secure Score calculated? 

Before this preview, Security Center considered each recommendation individually and assigned a value to it based on its severity. Security teams working to improve their security posture had to prioritize responses to Security Center recommendations based on the full list of findings. Every time you remediated a recommendation for a single resource, your Secure Score improved.

As part of the enhancements to the Secure Score, recommendations are now grouped into **controls**. These are a logical grouping of related recommendations. Points are no longer awarded at the recommendation level; instead your score will only improve when you remediate *all* of the recommendations for a single resource within a control. 

The contribution of each security control towards the overall Secure Score is shown clearly on the recommendations page.

[![The enhanced Secure Score (preview) introduces Security Controls](media/secure-score-and-controls/security-controls.png)](media/secure-score-and-controls/security-controls.png#lightbox)

To get all the possible points for a security control, all your resources must comply with all of the security recommendations within the security control. For example, Security Center has multiple recommendations regarding how to secure your management ports. In the past, you could remediate some of those related and interdependent recommendations while leaving others unsolved, and your secure score would improve. When looked at objectively, it's easy to argue that your security hadn't improved until you had resolved them all. Now, you must remediate them all to make a difference to your secure score.  

For example, the security control Apply system updates has a maximum score of 6: 

![The enhanced Secure Score (preview) introduces Security Controls](media/secure-score-and-controls/apply-system-updates-control.png)

If you have three virtual machines, each one can potentially contribute a score of 0 or 2 (since it must meet all recommendations). 

## How to improve your secure score? 

To improve your secure score, remediate the security recommendations from your recommendations list. You can remediate each recommendation manually for each resource, or by using the **quick fix** label (when available) to quickly apply a remediation for a recommendation to a group of resources. For more information, see [Remediate recommendations](security-center-remediate-recommendations.md). 


## Security controls and their recommendations

The table below lists the security controls in Azure Security Center. For each control, you can see the maximum number of points you can add to your secure score if you remediate *all* of the recommendations listed in the control, for *all* of your resources. 

> [!TIP]
> If you'd like to filter or sort this list differently, copy and paste it into Excel.

|Security Control|Maximum secure score points|Recommendations|
|----------------|-------------------|---------------|
|**Enable MFA**|10|MFA should be enabled on accounts with owner permissions on your subscription<br>MFA should be enabled on accounts with read permissions on your subscription<br>MFA should be enabled accounts with write permissions on your subscription|
|**Apply system updates**|6|Monitoring agent health issues should be resolved on your machines<br>Monitoring agent should be installed on virtual machine scale sets<br>Monitoring agent should be installed on your machines<br>OS version should be updated for your cloud service roles<br>System updates on virtual machine scale sets should be installed<br>System updates should be installed on your machines<br>Your machines should be restarted to apply system updates<br>Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version<br>Monitoring agent should be installed on your virtual machines|
|**Remediate vulnerabilities**|6|Vulnerabilities in Azure Container Registry images should be remediated (Preview)<br>Vulnerabilities on your SQL databases should be remediated<br>Vulnerabilities should be remediated by a Vulnerability Assessment solution<br>Vulnerability assessment should be enabled on your SQL managed instances<br>Vulnerability assessment should be enabled on your SQL servers<br>Vulnerability assessment solution should be installed on your virtual machines|
|**Enable encryption at rest**|4|Disk encryption should be applied on virtual machines<br>Transparent Data Encryption on SQL databases should be enabled<br>Automation account variables should be encrypted<br>Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign<br>SQL server TDE protector should be encrypted with your own key|
|**Encrypt data in transit**|4|API App should only be accessible over HTTPS<br>Function App should only be accessible over HTTPS<br>Only secure connections to your Redis Cache should be enabled<br>Secure transfer to storage accounts should be enabled<br>Web Application should only be accessible over HTTPS|
|**Manage access and permissions**|4|A maximum of 3 owners should be designated for your subscription<br>Deprecated accounts should be removed from your subscription (Preview)<br>Deprecated accounts with owner permissions should be removed from your subscription (Preview)<br>External accounts with owner permissions should be removed from your subscription (Preview)<br>External accounts with read permissions should be removed from your subscription<br>External accounts with write permissions should be removed from your subscription (Preview)<br>There should be more than one owner assigned to your subscription<br>Role-Based Access Control (RBAC) should be used on Kubernetes Services (Preview)<br>Service Fabric clusters should only use Azure Active Directory for client authentication|
|**Remediate security configurations**|4|Pod Security Policies should be defined on Kubernetes Services (Preview)<br>Vulnerabilities in container security configurations should be remediated<br>Vulnerabilities in security configuration on your machines should be remediated<br>Vulnerabilities in security configuration on your virtual machine scale sets should be remediated<br>Monitoring agent should be installed on your virtual machines<br>Monitoring agent should be installed on your machines<br>Monitoring agent should be installed on virtual machine scale sets<br>Monitoring agent health issues should be resolved on your machines|
|**Restrict unauthorized network access**|4|IP forwarding on your virtual machine should be disabled<br>Authorized IP ranges should be defined on Kubernetes Services (Preview)<br>Access to App Services should be restricted (Preview)<br>The rules for web applications on IaaS NSGs should be hardened<br>Virtual machines should be associated with a Network Security Group<br>CORS should not allow every resource to access your API App<br>CORS should not allow every resource to access your Function App<br>CORS should not allow every resource to access your Web Application<br>Remote debugging should be turned off for API App<br>Remote debugging should be turned off for Function App<br>Remote debugging should be turned off for Web Application<br>Access should be restricted for permissive Network Security Groups with Internet-facing VMs<br>Network Security Group Rules for Internet facing virtual machines should be hardened|
|**Adaptive application control**|3|Adaptive Application Controls should be enabled on virtual machines<br>Monitoring agent should be installed on your virtual machines<br>Monitoring agent should be installed on your machines<br>Monitoring agent health issues should be resolved on your machines|
|**Apply data classification**|2|Sensitive data in your SQL databases should be classified (Preview)|
|**Enable DDoS protection on Vnet**|2|DDoS Protection Standard should be enabled|
|**Enable endpoint protection**|2|Endpoint protection health failures should be remediated on virtual machine scale sets<br>Endpoint protection health issues should be resolved on your machines<br>Endpoint protection solution should be installed on virtual machine scale sets<br>Install endpoint protection solution on virtual machines<br>Monitoring agent health issues should be resolved on your machines<br>Monitoring agent should be installed on virtual machine scale sets<br>Monitoring agent should be installed on your machines<br>Monitoring agent should be installed on your virtual machines<br>Install endpoint protection solution on your machines|
|**Enable auditing and logging**|1|Auditing on SQL server should be enabled<br>Diagnostic logs in App Services should be enabled<br>Diagnostic logs in Azure Data Lake Store should be enabled<br>Diagnostic logs in Azure Stream Analytics should be enabled<br>Diagnostic logs in Batch accounts should be enabled<br>Diagnostic logs in Data Lake Analytics should be enabled<br>Diagnostic logs in Event Hub should be enabled<br>Diagnostic logs in IoT Hub should be enabled<br>Diagnostic logs in Key Vault should be enabled<br>Diagnostic logs in Logic Apps should be enabled<br>Diagnostic logs in Search service should be enabled<br>Diagnostic logs in Service Bus should be enabled<br>Diagnostic logs in Virtual Machine Scale Sets should be enabled<br>Metric alert rules should be configured on Batch accounts<br>SQL Auditing settings should have Action-Groups configured to capture critical activities<br>SQL servers should be configured with auditing retention days greater than 90 days.|
|**Additional best practices**|0|Access to storage accounts with firewall and virtual network configurations should be restricted<br>All authorization rules except RootManageSharedAccessKey should be removed from Event Hub namespace<br>An Azure Active Directory administrator should be provisioned for SQL servers<br>Authorization rules on the Event Hub instance should be defined<br>Storage accounts should be migrated to new Azure Resource Manager resources<br>Virtual machines should be migrated to new Azure Resource Manager resources<br>Advanced data security settings for SQL server should contain an email address to receive security alerts<br>Advanced data security should be enabled on your managed instances<br>Advanced data security should be enabled on your SQL servers<br>All advanced threat protection types should be enabled in SQL managed instance advanced data security settings<br>Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings<br>Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings<br>Subnets should be associated with a Network Security Group<br>All advanced threat protection types should be enabled in SQL server advanced data security settings|
||||

## Next steps

This article described the enhanced Secure Score and the new Security Controls it introduces. For related material, see the following articles: 

- [Learn about the different elements of a recommendation](security-center-recommendations.md)
- [Learn how to remediate recommendations](security-center-remediate-recommendations.md)