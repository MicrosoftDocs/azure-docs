---
title: Enhanced Secure Score (preview) in Azure Security Center
description: Description of the enhanced Secure Score (Preview) and Security Controls in Azure Security Center
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
ms.date: 12/04/2019
ms.author: memildin

---

# The enhanced Secure Score (Preview) 

This article introduces the enhanced Secure Score (currently in preview), the accompanying Security Controls, and the advantages they bring. It also explains how your score is calculated.

## Introduction to Secure Score

Azure Security Center has two main goals: to help you understand your current security situation, and to help you efficiently and effectively improve your security. The central aspect of Security Center that enables you to achieve those goals is Secure Score.

Security Center continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can tell, at a glance, your current security situation: the higher the score, the lower the identified risk level. Use the score to track security efforts and projects in your organization. 

The *enhanced* Secure Score (currently in preview) is **attack surface focused** and brings three benefits:

- **Security Controls** - Security recommendations are now grouped into logical sets that better reflect your vulnerable attack surfaces. For more information, see [How the Secure Score is calculated](secure-score-security-controls.md#how-the-secure-score-is-calculated) below.

- **Overall score better reflects the overall posture** - Points were awarded at the recommendation level. With this enhancement, your score will only improve when you remediate *all* of the recommendations for a single resource within a control. That means that your score only improves when the security of a resource improves. 

- **Security status of individual attack surfaces is more visible** - By showing the score per Security Control, the Secure Score page becomes the place where you can get a granular view of how well your organization is securing each individual attack surface.

The enhanced Secure Score is shown as a percentage, as shown in the following screenshot:

[![The enhanced Secure Score (preview) now includes a percentage](media/secure-score-security-controls/secure-score-with-percentage.png)](media/secure-score-security-controls/secure-score-with-percentage.png#lightbox)


## Locating your Secure Score

Security Center displays your score prominently: it's the first thing shown in the Overview page. If you click through to the dedicated Secure Score page, you'll see the score broken down by subscription. Click a single subscription to see the detailed list of prioritized recommendations and the potential impact that remediating them will have on the subscription’s score.

## How the Secure Score is calculated 

Before this preview, Security Center considered each recommendation individually and assigned a value to it based on its severity. Security teams working to improve their security posture had to prioritize responses to Security Center recommendations based on the full list of findings. Every time you remediated a recommendation for a single resource, your Secure Score improved.

As part of the enhancements to the Secure Score, recommendations are now grouped into **Security Controls**. A control is a set of security recommendations and the instructions that help you implement those recommendations. Controls are logical groupings of related recommendations. Points are no longer awarded at the recommendation level. Instead, your score will only improve when you remediate *all* of the recommendations for a single resource within a control.

The contribution of each Security Control towards the overall Secure Score is shown clearly on the recommendations page.

[![The enhanced Secure Score (preview) introduces Security Controls](media/secure-score-security-controls/security-controls.png)](media/secure-score-security-controls/security-controls.png#lightbox)

To get all the possible points for a Security Control, all your resources must comply with all of the security recommendations within the Security Control. For example, Security Center has multiple recommendations regarding how to secure your management ports. In the past, you could remediate some of those related and interdependent recommendations while leaving others unsolved, and your Secure Score would improve. When looked at objectively, it's easy to argue that your security hadn't improved until you had resolved them all. Now, you must remediate them all to make a difference to your Secure Score.

For example, the Security Control called "Apply system updates" has a maximum score of six points, which you can see in the tooltip on the potential increase value of the control:

[![The Security Control "Apply system updates"](media/secure-score-security-controls/apply-system-updates-control.png)](media/secure-score-security-controls/apply-system-updates-control.png#lightbox)

The potential for the Security Control "Apply system updates" in the screenshot above shows "2% (1 Point)". That means that if you remediate all the recommendations in this control, your score will increase by 2% (in this case, one point). For simplicity, values in the recommendations list's "Potential increase" column are rounded to whole numbers. The tooltips show the precise values:

* **Potential increase** - The remaining points available to you within the control. To get these points  added to your Secure Score, remediate all of the control's recommendations. In the example above, the one point shown for the control is actually 0.96 points.
* **Current score** - The current score for this control. Each control contributes towards the total score. In this example, the control is contributing 5.04 points to the total. 
* **Max score** - The sum of the previous two values.

### Calculations - understanding your score

|Metric|Formula and example|
|-|-|
|**Security Control's current score**|<br>![Equation for calculating a Security Control's current score](media/secure-score-security-controls/security-control-scoring-equation.png)<br><br>Each individual Security Control contributes towards the Security Score. Each resource affected by a recommendation within the control, contributes towards the control's current score. The current score for each control is a measure of the status of the resources *within* the control.<br>![Tooltips showing the values used when calculating the Security Control's current score](media/secure-score-security-controls/security-control-scoring-tooltips.png)<br>In this example, the max score of 6 would be divided by 78 because that's the sum of the healthy and unhealthy resources.<br>6 / 78 = 0.0769<br>Multiplying that by the number of healthy resources (74) results in the current score:<br>0.0769 * 74 = **5.69**<br><br>|
|**Secure Score**<br>Single subscription|<br>![Equation for calculating the current Secure Score](media/secure-score-security-controls/secure-score-equation.png)<br><br>![Single subscription secure score with all controls enabled](media/secure-score-security-controls/secure-score-example-single-sub.png)<br>In this example, there is a single subscription with all Security Controls available (a potential maximum score of 60 points). The score shows 28 points out of a possible 60 and the remaining 32 points are reflected in the "Potential score increase" figures of the Security Controls.<br>![List of controls and the potential score increase](media/secure-score-security-controls/secure-score-example-single-sub-recs.png)|
|**Secure Score**<br>Multiple subscriptions|<br>The current score for all resources across all subscriptions are added and the calculation is then the same as for a single subscription<br><br>When viewing multiple subscriptions, Secure Score evaluates all resources within all enabled policies and groups their combined impact on each Security Control's maximum score.<br>![Secure Score for multiple subscriptions with all controls enabled](media/secure-score-security-controls/secure-score-example-multiple-subs.png)<br>The combined score is **not** an average; rather it's the evaluated posture of the status of all resources across all subscriptions.<br>Here too, if you go to the recommendations page and add up the potential points available, you will find that it's the difference between the current score (24) and the maximum score available (60).|
||||

## Improving your Secure Score

To improve your Secure Score, remediate security recommendations from your recommendations list. You can remediate each recommendation manually for each resource, or by using the **Quick Fix!** option (when available) to apply a remediation for a recommendation to a group of resources quickly. For more information, see [Remediate recommendations](security-center-remediate-recommendations.md).

Only built-in recommendations have an impact on the Secure Score.

## Security Controls and their recommendations

The table below lists the Security Controls in Azure Security Center. For each control, you can see the maximum number of points you can add to your Secure Score if you remediate *all* of the recommendations listed in the control, for *all* of your resources. 

> [!TIP]
> If you'd like to filter or sort this list differently, copy and paste it into Excel.

|Security Control|Maximum Secure Score points|Recommendations|
|----------------|:-------------------:|---------------|
|**Enable MFA**|10|- MFA should be enabled on accounts with owner permissions on your subscription<br>- MFA should be enabled on accounts with read permissions on your subscription<br>- MFA should be enabled accounts with write permissions on your subscription|
|**Secure management ports**|8|- Just-In-Time network access control should be applied on virtual machines<br>- Virtual machines should be associated with a Network Security Group<br>- Management ports should be closed on your virtual machines|
|**Apply system updates**|6|- Monitoring agent health issues should be resolved on your machines<br>- Monitoring agent should be installed on virtual machine scale sets<br>- Monitoring agent should be installed on your machines<br>- OS version should be updated for your cloud service roles<br>- System updates on virtual machine scale sets should be installed<br>- System updates should be installed on your machines<br>- Your machines should be restarted to apply system updates<br>- Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version<br>- Monitoring agent should be installed on your virtual machines|
|**Remediate vulnerabilities**|6|- Advanced data security should be enabled on your SQL servers<br>- Vulnerabilities in Azure Container Registry images should be remediated (Preview)<br>- Vulnerabilities on your SQL databases should be remediated<br>- Vulnerabilities should be remediated by a Vulnerability Assessment solution<br>- Vulnerability assessment should be enabled on your SQL managed instances<br>- Vulnerability assessment should be enabled on your SQL servers<br>- Vulnerability assessment solution should be installed on your virtual machines|
|**Enable encryption at rest**|4|- Disk encryption should be applied on virtual machines<br>- Transparent Data Encryption on SQL databases should be enabled<br>- Automation account variables should be encrypted<br>- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign<br>- SQL server TDE protector should be encrypted with your own key|
|**Encrypt data in transit**|4|- API App should only be accessible over HTTPS<br>- Function App should only be accessible over HTTPS<br>- Only secure connections to your Redis Cache should be enabled<br>- Secure transfer to storage accounts should be enabled<br>- Web Application should only be accessible over HTTPS|
|**Manage access and permissions**|4|- A maximum of 3 owners should be designated for your subscription<br>- Deprecated accounts should be removed from your subscription (Preview)<br>- Deprecated accounts with owner permissions should be removed from your subscription (Preview)<br>- External accounts with owner permissions should be removed from your subscription (Preview)<br>- External accounts with read permissions should be removed from your subscription<br>- External accounts with write permissions should be removed from your subscription (Preview)<br>- There should be more than one owner assigned to your subscription<br>- Role-Based Access Control (RBAC) should be used on Kubernetes Services (Preview)<br>- Service Fabric clusters should only use Azure Active Directory for client authentication|
|**Remediate security configurations**|4|- Pod Security Policies should be defined on Kubernetes Services (Preview)<br>- Vulnerabilities in container security configurations should be remediated<br>- Vulnerabilities in security configuration on your machines should be remediated<br>- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated<br>- Monitoring agent should be installed on your virtual machines<br>- Monitoring agent should be installed on your machines<br>- Monitoring agent should be installed on virtual machine scale sets<br>- Monitoring agent health issues should be resolved on your machines|
|**Restrict unauthorized network access**|4|- IP forwarding on your virtual machine should be disabled<br>- Authorized IP ranges should be defined on Kubernetes Services (Preview)<br>- Access to App Services should be restricted (Preview)<br>- The rules for web applications on IaaS NSGs should be hardened<br>- Virtual machines should be associated with a Network Security Group<br>- CORS should not allow every resource to access your API App<br>- CORS should not allow every resource to access your Function App<br>- CORS should not allow every resource to access your Web Application<br>- Remote debugging should be turned off for API App<br>- Remote debugging should be turned off for Function App<br>- Remote debugging should be turned off for Web Application<br>- Access should be restricted for permissive Network Security Groups with Internet-facing VMs<br>- Network Security Group Rules for Internet facing virtual machines should be hardened|
|**Apply adaptive application control**|3|- Adaptive Application Controls should be enabled on virtual machines<br>- Monitoring agent should be installed on your virtual machines<br>- Monitoring agent should be installed on your machines<br>- Monitoring agent health issues should be resolved on your machines|
|**Apply data classification**|2|- Sensitive data in your SQL databases should be classified (Preview)|
|**Protect applications against DDoS attacks**|2|- DDoS Protection Standard should be enabled|
|**Enable endpoint protection**|2|- Endpoint protection health failures should be remediated on virtual machine scale sets<br>- Endpoint protection health issues should be resolved on your machines<br>- Endpoint protection solution should be installed on virtual machine scale sets<br>- Install endpoint protection solution on virtual machines<br>- Monitoring agent health issues should be resolved on your machines<br>- Monitoring agent should be installed on virtual machine scale sets<br>- Monitoring agent should be installed on your machines<br>- Monitoring agent should be installed on your virtual machines<br>- Install endpoint protection solution on your machines|
|**Enable auditing and logging**|1|- Auditing on SQL server should be enabled<br>- Diagnostic logs in App Services should be enabled<br>- Diagnostic logs in Azure Data Lake Store should be enabled<br>- Diagnostic logs in Azure Stream Analytics should be enabled<br>- Diagnostic logs in Batch accounts should be enabled<br>- Diagnostic logs in Data Lake Analytics should be enabled<br>- Diagnostic logs in Event Hub should be enabled<br>- Diagnostic logs in IoT Hub should be enabled<br>- Diagnostic logs in Key Vault should be enabled<br>- Diagnostic logs in Logic Apps should be enabled<br>- Diagnostic logs in Search service should be enabled<br>- Diagnostic logs in Service Bus should be enabled<br>- Diagnostic logs in Virtual Machine Scale Sets should be enabled<br>- Metric alert rules should be configured on Batch accounts<br>- SQL Auditing settings should have Action-Groups configured to capture critical activities<br>- SQL servers should be configured with auditing retention days greater than 90 days.|
|**Implement security best practices**|0|- Access to storage accounts with firewall and virtual network configurations should be restricted<br>- All authorization rules except RootManageSharedAccessKey should be removed from Event Hub namespace<br>- An Azure Active Directory administrator should be provisioned for SQL servers<br>- Authorization rules on the Event Hub instance should be defined<br>- Storage accounts should be migrated to new Azure Resource Manager resources<br>- Virtual machines should be migrated to new Azure Resource Manager resources<br>- Advanced data security settings for SQL server should contain an email address to receive security alerts<br>- Advanced data security should be enabled on your managed instances<br>- All advanced threat protection types should be enabled in SQL managed instance advanced data security settings<br>- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings<br>- Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings<br>- Subnets should be associated with a Network Security Group<br>- All advanced threat protection types should be enabled in SQL server advanced data security settings|
||||

## Secure Score FAQ

### Why has my Secure Score gone down?
With the changes introduced in this enhanced Secure Score, you must solve all recommendation for a resource to receive points. The scores also changed to a scale of 0-10.

### If I address only three out of four recommendations in a Security Control, will my Secure Score change?
No; it won't change until you remediate all of the recommendations for a single resource. To get the maximum score for a control, you must remediate all recommendations, for all resources.

### Will this enhanced Secure Score replace the existing Secure Score? 
Yes, but for a while they'll be running side by side to ease the transition.

### If a recommendation isn't applicable to me, and I disable it in the policy, will my Security Control be fulfilled and my Secure Score updated?
Yes. We recommend disabling recommendations when they're inapplicable in your environment. For instructions on how to disable a specific recommendation, see [Disable security policies](https://docs.microsoft.com/azure/security-center/tutorial-security-policy#disable-security-policies).

### If a Security Control offers me zero points towards my Secure Score, should I ignore it?
In some cases you'll see a control max score greater than zero, but the impact is zero. When the incremental score for fixing resources is negligible, it's rounded to zero. Don't ignore these recommendations as they still bring security improvements. The only exception is the “Additional Best Practice” control. Remediating these recommendations won't increase your score, but it will enhance your overall security.

## Next steps

This article described the enhanced Secure Score and the new Security Controls it introduces. For related material, see the following articles:

- [Learn about the different elements of a recommendation](security-center-recommendations.md)
- [Learn how to remediate recommendations](security-center-remediate-recommendations.md)