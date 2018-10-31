---
title: Remediate security configurations in Azure Security Center | Microsoft Docs
description: This document shows you how to implement the Azure Security Center recommendation, "Remediate security configurations."
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 991d41f5-1d17-468d-a66d-83ec1308ab79
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/10/2018
ms.author: terrylan

---
# Remediate security configurations in Azure Security Center
Azure Security Center analyzes daily the operating system (OS) of your virtual machines (VMs) and computers for a configuration that could make the VMs and computers more vulnerable to attack. Security Center recommends that you resolve vulnerabilities when your OS configuration does not match the recommended security configuration rules, and it recommends configuration changes to address these vulnerabilities.

For more information about the specific configurations that are being monitored, see the [list of recommended configuration rules](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335). To learn how to customize security configuration assessments, see [Customize OS security configurations in Azure Security Center (Preview)](security-center-customize-os-security-config.md).

## Implement the recommendation
"Remediate security configurations" is presented as a recommendation in Security Center. The recommendation is displayed under **Recommendations** > **Compute & apps**.

This example covers the "Remediate security configurations" recommendation under **Compute & apps**.
1. In Security Center, in the left pane, select **Compute & apps**.  
  The **Compute & apps** window opens.

   ![Remediate security configurations][1]

2. Select **Remediate security configurations**.  
  The **Security configurations** window opens.

   ![The "Security configurations" window][2]

  The upper section of the dashboard displays:

  - **Failed rules by severity**: The total number of rules that the OS configuration failed across your VMs and computers, broken out by severity.
  - **Failed rules by type**: The total number of rules that the OS configuration failed across your VMs and computers, broken out by type.
  - **Failed Windows rules**: The total number of rules failed by your Windows OS configurations.
  - **Failed Linux rules**: The total number of rules failed by your Linux OS configurations.

  The lower section of the dashboard lists all failed rules for your VMs and computers, and the severity of the missing update. The list contains the following elements:

  - **CCEID**: The CCE unique identifier for the rule. Security Center uses Common Configuration Enumeration (CCE) to assign unique identifiers to configuration rules.
  - **Name**: The name of the failed rule.
  - **Rule type**: The *Registry key*, *Security policy*, *Audit policy*, or *IIS* rule type.
  - **No. of VMs & computers**: The total number of VMs and computers that the failed rule applies to.
  - **Rule severity**: The CCE value *Critical*, *Important*, or *Warning*.
  - **State**: The current state of the recommendation:

    - **Open**: The recommendation has not been addressed yet.
    - **In Progress**: The recommendation is currently being applied to the resources, and no action is required by you.
    - **Resolved**: The recommendation has been applied. When the issue is resolved, the entry is dimmed.

3. To view the details of a failed rule, select it in the list.

   ![Detailed view of a failed configuration rule][3]

   The detailed view displays the following information:

   - **Name**: The name of the rule.
   - **CCIED**: The CCE unique identifier for the rule.
   - **OS version**: The OS version of the VM or computer.
   - **Rule severity**: The CCE value *Critical*, *Important*, or *Warning*.
   - **Full description**: The description of the rule.
   - **Vulnerability**: The explanation of vulnerability or risk if the rule is not applied.
   - **Potential impact**: The business impact when the rule is applied.
   - **Countermeasure**: The remediation steps.
   - **Expected value**: The value that's expected when Security Center analyzes your VM OS configuration against the rule.
   - **Actual value**: The value that's returned after an analysis of your VM OS configuration against the rule.
   - **Rule operation**: The rule operation that's used by Security Center during the analysis of your VM OS configuration against the rule.

4. At the top of the detailed view window, select **Search**.  
  Search opens a list of workspaces that have VMs and computers with the selected security configurations mismatch. The workspace selection is shown only if the selected rule applies to multiple VMs that are connected to different workspaces.

   ![Listed workspaces][4]

5. Select a workspace.  
  A Log Analytics search query opens filtered to the workspace with the security configurations mismatch.

   ![Workspace with OS vulnerability][5]

6. Select a computer in the list.  
  A new search result opens with information filtered only for that computer.

   ![Detailed information about the selected computer][6]

## Next steps
This article showed you how to implement the Security Center recommendation "Remediate security configurations." To learn how to customize security configuration assessments, see [Customize OS security configurations in Azure Security Center (Preview)](security-center-customize-os-security-config.md).

To review the specific configurations that are being monitored, see [list of recommended configuration rules](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335). Security Center uses Common Configuration Enumeration (CCE) to assign unique identifiers to configuration rules. For more information, go to the [CCE](https://nvd.nist.gov/cce/index.cfm) site.

To learn more about Security Center, see the following resources:

* For a list of supported Windows and Linux VMs, see [Supported platforms in Azure Security Center](security-center-os-coverage.md).
* To learn how to configure security policies for your Azure subscriptions and resource groups, see [Setting security policies in Azure Security Center](security-center-policies.md).
* To learn how recommendations help you protect your Azure resources, see [Managing security recommendations in Azure Security Center](security-center-recommendations.md).
* To learn how to monitor the health of your Azure resources, see [Security health monitoring in Azure Security Center](security-center-monitoring.md).
* To learn how to manage and respond to security alerts, see [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md).
* To learn how to monitor the health status of your partner solutions, see [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md).
* For answers to frequently asked questions about using the service, see [Azure Security Center FAQ](security-center-faq.md).
* For blog posts about Azure security and compliance, see [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/).

<!--Image references-->
[1]: ./media/security-center-remediate-os-vulnerabilities/compute-blade.png
[2]:./media/security-center-remediate-os-vulnerabilities/os-vulnerabilities.png
[3]: ./media/security-center-remediate-os-vulnerabilities/vulnerability-details.png
[4]: ./media/security-center-remediate-os-vulnerabilities/search.png
[5]: ./media/security-center-remediate-os-vulnerabilities/log-search.png
[6]: ./media/security-center-remediate-os-vulnerabilities/search-results.png
