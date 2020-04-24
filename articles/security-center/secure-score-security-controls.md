---
title: Secure score in Azure Security Center
description: Description of Azure Security Center's secure score and its security controls 
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetd: c42d02e4-201d-4a95-8527-253af903a5c6
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/10/2020
ms.author: memildin

---

# Enhanced secure score (preview) in Azure Security Center

## Introduction to secure score

Azure Security Center has two main goals: to help you understand your current security situation, and to help you efficiently and effectively improve your security. The central aspect of Security Center that enables you to achieve those goals is secure score.

Security Center continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can tell, at a glance, your current security situation: the higher the score, the lower the identified risk level. Use the score to track security efforts and projects in your organization. 

The secure score page of Security Center includes:

- **The score** - The secure score is shown as a percentage value, but the underlying values are also clear:

    [![Secure score shown as a percentage value with the underlying numbers clear too](media/secure-score-security-controls/secure-score-with-percentage.png)](media/secure-score-security-controls/secure-score-with-percentage.png#lightbox)

- **Security controls** - Each control is a logical group of related security recommendations, and reflects your vulnerable attack surfaces. A control is a set of security recommendations, with instructions that help you implement those recommendations. Your score only improves when you remediate *all* of the recommendations for a single resource within a control.

    To immediately see how well your organization is securing each individual attack surface, review the scores for each security control.

    For more information, see [How the secure score is calculated](secure-score-security-controls.md#how-the-secure-score-is-calculated) below. 


>[!TIP]
> Earlier versions of Security Center awarded points at the recommendation level: when you remediated a recommendation for a single resource, your secure score improved. 
> Today, your score only improves if you remediate *all* of the recommendations for a single resource within a control. So your score only improves when you've improved the security of a resource.
> While this enhanced version is still in preview, the earlier secure score experience is available as an option from the Azure Portal. 


## Locating your secure score

Security Center displays your score prominently: it's the first thing shown in the Overview page. If you click through to the dedicated secure score page, you'll see the score broken down by subscription. Click a single subscription to see the detailed list of prioritized recommendations and the potential impact that remediating them will have on the subscription's score.

## How the secure score is calculated 

The contribution of each security control towards the overall secure score is shown clearly on the recommendations page.

[![The enhanced secure score introduces security controls](media/secure-score-security-controls/security-controls.png)](media/secure-score-security-controls/security-controls.png#lightbox)

To get all the possible points for a security control, all your resources must comply with all of the security recommendations within the security control. For example, Security Center has multiple recommendations regarding how to secure your management ports. In the past, you could remediate some of those related and interdependent recommendations while leaving others unsolved, and your secure score would improve. When looked at objectively, it's easy to argue that your security hadn't improved until you had resolved them all. Now, you must remediate them all to make a difference to your secure score.

For example, the security control called "Apply system updates" has a maximum score of six points, which you can see in the tooltip on the potential increase value of the control:

[![The security control "Apply system updates"](media/secure-score-security-controls/apply-system-updates-control.png)](media/secure-score-security-controls/apply-system-updates-control.png#lightbox)

The potential for the security control "Apply system updates" in the screenshot above shows "2% (1 Point)". That means that if you remediate all the recommendations in this control, your score will increase by 2% (in this case, one point). For simplicity, values in the recommendations list's "Potential increase" column are rounded to whole numbers. The tooltips show the precise values:

* **Max score** - The maximum number of points you can gain by completing all recommendations within a control. The maximum score for a control indicates the relative significance of that control. Use the max score values to triage which issues to work on first. 
* **Potential increase** - The remaining points available to you within the control. To get these points added to your secure score, remediate all of the control's recommendations. In the example above, the one point shown for the control is actually 0.96 points.
* **Current score** - The current score for this control. Each control contributes towards the total score. In this example, the control is contributing 5.04 points to the total. 

### Calculations - understanding your score

|Metric|Formula and example|
|-|-|
|**Security control's current score**|<br>![Equation for calculating a security control's current score](media/secure-score-security-controls/security-control-scoring-equation.png)<br><br>Each individual security control contributes towards the Security Score. Each resource affected by a recommendation within the control, contributes towards the control's current score. The current score for each control is a measure of the status of the resources *within* the control.<br>![Tooltips showing the values used when calculating the security control's current score](media/secure-score-security-controls/security-control-scoring-tooltips.png)<br>In this example, the max score of 6 would be divided by 78 because that's the sum of the healthy and unhealthy resources.<br>6 / 78 = 0.0769<br>Multiplying that by the number of healthy resources (4) results in the current score:<br>0.0769 * 4 = **0.31**<br><br>|
|**Secure score**<br>Single subscription|<br>![Equation for calculating the current secure score](media/secure-score-security-controls/secure-score-equation.png)<br><br>![Single subscription secure score with all controls enabled](media/secure-score-security-controls/secure-score-example-single-sub.png)<br>In this example, there is a single subscription with all security controls available (a potential maximum score of 60 points). The score shows 28 points out of a possible 60 and the remaining 32 points are reflected in the "Potential score increase" figures of the security controls.<br>![List of controls and the potential score increase](media/secure-score-security-controls/secure-score-example-single-sub-recs.png)|
|**Secure score**<br>Multiple subscriptions|<br>The current score for all resources across all subscriptions are added and the calculation is then the same as for a single subscription<br><br>When viewing multiple subscriptions, secure score evaluates all resources within all enabled policies and groups their combined impact on each security control's maximum score.<br>![Secure score for multiple subscriptions with all controls enabled](media/secure-score-security-controls/secure-score-example-multiple-subs.png)<br>The combined score is **not** an average; rather it's the evaluated posture of the status of all resources across all subscriptions.<br>Here too, if you go to the recommendations page and add up the potential points available, you will find that it's the difference between the current score (24) and the maximum score available (60).|
||||

## Improving your secure score

To improve your secure score, remediate security recommendations from your recommendations list. You can remediate each recommendation manually for each resource, or by using the **Quick Fix!** option (when available) to apply a remediation for a recommendation to a group of resources quickly. For more information, see [Remediate recommendations](security-center-remediate-recommendations.md).

>[!IMPORTANT]
> Only built-in recommendations have an impact on the secure score.

## Security controls and their recommendations

The table below lists the security controls in Azure Security Center. For each control, you can see the maximum number of points you can add to your secure score if you remediate *all* of the recommendations listed in the control, for *all* of your resources. 

> [!TIP]
> If you'd like to filter or sort this list differently, copy and paste it into Excel.

|Security control|Maximum secure score points|Recommendations|
|----------------|:-------------------:|---------------|
|**Enable MFA**|10|- MFA should be enabled on accounts with owner permissions on your subscription<br>- MFA should be enabled on accounts with read permissions on your subscription<br>- MFA should be enabled accounts with write permissions on your subscription|
|**Secure management ports**|8|- Just-In-Time network access control should be applied on virtual machines<br>- Virtual machines should be associated with a Network Security Group<br>- Management ports should be closed on your virtual machines|
|**Apply system updates**|6|- Monitoring agent health issues should be resolved on your machines<br>- Monitoring agent should be installed on virtual machine scale sets<br>- Monitoring agent should be installed on your machines<br>- OS version should be updated for your cloud service roles<br>- System updates on virtual machine scale sets should be installed<br>- System updates should be installed on your machines<br>- Your machines should be restarted to apply system updates<br>- Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version<br>- Monitoring agent should be installed on your virtual machines|
|**Remediate vulnerabilities**|6|- Advanced data security should be enabled on your SQL servers<br>- Vulnerabilities in Azure Container Registry images should be remediated<br>- Vulnerabilities on your SQL databases should be remediated<br>- Vulnerabilities should be remediated by a Vulnerability Assessment solution<br>- Vulnerability assessment should be enabled on your SQL managed instances<br>- Vulnerability assessment should be enabled on your SQL servers<br>- Vulnerability assessment solution should be installed on your virtual machines|
|**Enable encryption at rest**|4|- Disk encryption should be applied on virtual machines<br>- Transparent Data Encryption on SQL databases should be enabled<br>- Automation account variables should be encrypted<br>- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign<br>- SQL server TDE protector should be encrypted with your own key|
|**Encrypt data in transit**|4|- API App should only be accessible over HTTPS<br>- Function App should only be accessible over HTTPS<br>- Only secure connections to your Redis Cache should be enabled<br>- Secure transfer to storage accounts should be enabled<br>- Web Application should only be accessible over HTTPS|
|**Manage access and permissions**|4|- A maximum of 3 owners should be designated for your subscription<br>- Deprecated accounts should be removed from your subscription (Preview)<br>- Deprecated accounts with owner permissions should be removed from your subscription (Preview)<br>- External accounts with owner permissions should be removed from your subscription (Preview)<br>- External accounts with read permissions should be removed from your subscription<br>- External accounts with write permissions should be removed from your subscription (Preview)<br>- There should be more than one owner assigned to your subscription<br>- Role-Based Access Control (RBAC) should be used on Kubernetes Services (Preview)<br>- Service Fabric clusters should only use Azure Active Directory for client authentication|
|**Remediate security configurations**|4|- Pod Security Policies should be defined on Kubernetes Services<br>- Vulnerabilities in container security configurations should be remediated<br>- Vulnerabilities in security configuration on your machines should be remediated<br>- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated<br>- Monitoring agent should be installed on your virtual machines<br>- Monitoring agent should be installed on your machines<br>- Monitoring agent should be installed on virtual machine scale sets<br>- Monitoring agent health issues should be resolved on your machines|
|**Restrict unauthorized network access**|4|- IP forwarding on your virtual machine should be disabled<br>- Authorized IP ranges should be defined on Kubernetes Services (Preview)<br>- (DEPRECATED) Access to App Services should be restricted (Preview)<br>- (DEPRECATED) The rules for web applications on IaaS NSGs should be hardened<br>- Virtual machines should be associated with a Network Security Group<br>- CORS should not allow every resource to access your API App<br>- CORS should not allow every resource to access your Function App<br>- CORS should not allow every resource to access your Web Application<br>- Remote debugging should be turned off for API App<br>- Remote debugging should be turned off for Function App<br>- Remote debugging should be turned off for Web Application<br>- Access should be restricted for permissive Network Security Groups with Internet-facing VMs<br>- Network Security Group Rules for Internet facing virtual machines should be hardened|
|**Apply adaptive application control**|3|- Adaptive Application Controls should be enabled on virtual machines<br>- Monitoring agent should be installed on your virtual machines<br>- Monitoring agent should be installed on your machines<br>- Monitoring agent health issues should be resolved on your machines|
|**Apply data classification**|2|- Sensitive data in your SQL databases should be classified (Preview)|
|**Protect applications against DDoS attacks**|2|- DDoS Protection Standard should be enabled|
|**Enable endpoint protection**|2|- Endpoint protection health failures should be remediated on virtual machine scale sets<br>- Endpoint protection health issues should be resolved on your machines<br>- Endpoint protection solution should be installed on virtual machine scale sets<br>- Install endpoint protection solution on virtual machines<br>- Monitoring agent health issues should be resolved on your machines<br>- Monitoring agent should be installed on virtual machine scale sets<br>- Monitoring agent should be installed on your machines<br>- Monitoring agent should be installed on your virtual machines<br>- Install endpoint protection solution on your machines|
|**Enable auditing and logging**|1|- Auditing on SQL server should be enabled<br>- Diagnostic logs in App Services should be enabled<br>- Diagnostic logs in Azure Data Lake Store should be enabled<br>- Diagnostic logs in Azure Stream Analytics should be enabled<br>- Diagnostic logs in Batch accounts should be enabled<br>- Diagnostic logs in Data Lake Analytics should be enabled<br>- Diagnostic logs in Event Hub should be enabled<br>- Diagnostic logs in IoT Hub should be enabled<br>- Diagnostic logs in Key Vault should be enabled<br>- Diagnostic logs in Logic Apps should be enabled<br>- Diagnostic logs in Search service should be enabled<br>- Diagnostic logs in Service Bus should be enabled<br>- Diagnostic logs in Virtual Machine Scale Sets should be enabled<br>- Metric alert rules should be configured on Batch accounts<br>- SQL Auditing settings should have Action-Groups configured to capture critical activities<br>- SQL servers should be configured with auditing retention days greater than 90 days.|
|**Implement security best practices**|0|- Access to storage accounts with firewall and virtual network configurations should be restricted<br>- All authorization rules except RootManageSharedAccessKey should be removed from Event Hub namespace<br>- An Azure Active Directory administrator should be provisioned for SQL servers<br>- Authorization rules on the Event Hub instance should be defined<br>- Storage accounts should be migrated to new Azure Resource Manager resources<br>- Virtual machines should be migrated to new Azure Resource Manager resources<br>- Advanced data security settings for SQL server should contain an email address to receive security alerts<br>- Advanced data security should be enabled on your managed instances<br>- All advanced threat protection types should be enabled in SQL managed instance advanced data security settings<br>- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings<br>- Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings<br>- Subnets should be associated with a Network Security Group<br>- All advanced threat protection types should be enabled in SQL server advanced data security settings|
||||

## Secure score FAQ

### Why has my secure score gone down?
Security Center has switched to an enhanced secure score (currently in preview status) which includes changes in the way the score is calculated. Now, you must solve all recommendation for a resource to receive points. The scores also changed to a scale of 0-10.

### If I address only three out of four recommendations in a security control, will my secure score change?
No. It won't change until you remediate all of the recommendations for a single resource. To get the maximum score for a control, you must remediate all recommendations, for all resources.

### Is the previous experience of the secure score still available? 
Yes. For a while they'll be running side by side to ease the transition. Expect the previous model to be phased out in time. 

### If a recommendation isn't applicable to me, and I disable it in the policy, will my security control be fulfilled and my secure score updated?
Yes. We recommend disabling recommendations when they're inapplicable in your environment. For instructions on how to disable a specific recommendation, see [Disable security policies](https://docs.microsoft.com/azure/security-center/tutorial-security-policy#disable-security-policies).

### If a security control offers me zero points towards my secure score, should I ignore it?
In some cases you'll see a control max score greater than zero, but the impact is zero. When the incremental score for fixing resources is negligible, it's rounded to zero. Don't ignore these recommendations as they still bring security improvements. The only exception is the "Additional Best Practice" control. Remediating these recommendations won't increase your score, but it will enhance your overall security.

## Next steps

This article described the secure score and the security controls it introduces. For related material, see the following articles:

- [Learn about the different elements of a recommendation](security-center-recommendations.md)
- [Learn how to remediate recommendations](security-center-remediate-recommendations.md)