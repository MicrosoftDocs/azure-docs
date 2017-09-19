---
title: Remediate OS vulnerabilities in Azure Security Center | Microsoft Docs
description: This document shows you how to implement the Azure Security Center recommendation **Remediate OS vulnerabilities**.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 991d41f5-1d17-468d-a66d-83ec1308ab79
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/11/2017
ms.author: terrylan

---
# Remediate OS vulnerabilities in Azure Security Center
Azure Security Center analyzes daily the operating system (OS) of your virtual machines (VMs) and computers for a configuration that could make the VMs and computers more vulnerable to attack. Security Center recommends that you resolve vulnerabilities when your OS configuration does not match the recommended configuration rules and recommends configuration changes to address these vulnerabilities.

> [!NOTE]
> For more information on the specific configurations being monitored, see the [list of recommended configuration rules](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335).
>
>

## Implement the recommendation
Remediate OS vulnerabilities is presented as a recommendation in Security Center. This recommendation will be displayed under **Recommendations** and under **Compute**.

In this example, we will look at the **Remediate OS vulnerabilities (by Microsoft)** recommendation under **Compute**.
1. Select **Compute** under the Security Center main menu.

   ![Remediate OS vulnerabilities][1]

2. Under **Compute**, select **Remediate OS vulnerabilities (by Microsoft)**. The **OS Vulnerabilities (by Microsoft) mismatch** dashboard opens.

   ![Remediate OS vulnerabilities][2]

  The top of the dashboard provides:

  - The total number of rules by severity that the OS configuration failed across your VM's and computer’s.
  - The total number of rules by type that the OS configuration failed across your VM's and computer’s.
  - The total number of rules failed by your Windows OS configurations and by your Linux OS configurations.

  The bottom of the dashboard lists all failed rules across your VMs and computers, and the severity of the missing update. The list includes:

  - **CCEID**: CCE unique identifier for the rule. Security Center uses Common Configuration Enumeration (CCE) to assign unique identifiers for configuration rules.
  - **NAME**: Name of the failed rule
  - **RULE TYPE**: Registry key, Security policy, or Audit policy
  - **NO. OF VMs & COMPUTERS**: Total number of VMs and computers that the fail ruled applies to
  - **RULE SEVERITY**: CCE severity value of critical, important, or warning
  - **STATE**: The current state of the recommendation:

    - **Open**: The recommendation has not been addressed yet
    - **In Progress**: The recommendation is currently being applied to those resources, and no action is required by you
    - **Resolved**: The recommendation was already finished. (When the issue has been resolved, the entry is dimmed)

3. Select a failed rule in the list to view details.

   ![Configuration rules that have failed][3]

  The following information is provided on this blade:

  - NAME -- Name of rule
  - CCIED -- CCE unique identifier for the rule
  - OS Version – OS Version of the VM or computer
  - RULE SEVERITY -- CCE severity value of critical, important, or warning
  - FULL DESCRIPTION -- Description of rule
  - VULNERABILITY -- Explanation of vulnerability or risk if rule is not applied
  - POTENTIAL IMPACT -- Business impact when rule is applied
  - COUNTERMEASURE – Remediation steps
  - EXPECTED VALUE -- Value expected when Security Center analyzes your VM OS configuration against the rule
  - ACTUAL VALUE -- Value returned after analysis of your VM OS configuration against the rule
  - RULE OPERATION -- Rule operation used by Security Center during analysis of your VM OS configuration against the rule

4. Select the **Search** icon in the top ribbon. Search opens listing workspaces that have VMs and computers with the selected OS vulnerability. This workspace selection blade is only shown if the selected rule applies to multiple VMs that are connected to different workspaces.

  ![Listed workspaces][4]

5. Select a workspace. A Log Analytics search query opens filtered to the workspace with the OS vulnerability.

  ![Workspace with OS vulnerability][5]

6. Select a computer from the list for more information. Another search result opens with information filtered only for that computer.

  ![Filtered for that computer][6]

## Next steps
This article showed you how to implement the Security Center recommendation "Remediate OS vulnerabilities." You can review the set of configuration rules [here](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335). Security Center uses CCE (Common Configuration Enumeration) to assign unique identifiers for configuration rules. Visit the [CCE](https://nvd.nist.gov/cce/index.cfm) site for more information.

To learn more about Security Center, see the following resources:

* [Supported platforms in Azure Security Center](security-center-os-coverage.md) - Provides a list of supported Windows and Linux VMs.
* [Setting security policies in Azure Security Center](security-center-policies.md) - Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) - Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) - Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) - Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) - Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) - Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) - Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-remediate-os-vulnerabilities/compute-blade.png
[2]:./media/security-center-remediate-os-vulnerabilities/os-vulnerabilities.png
[3]: ./media/security-center-remediate-os-vulnerabilities/vulnerability-details.png
[4]: ./media/security-center-remediate-os-vulnerabilities/search.png
[5]: ./media/security-center-remediate-os-vulnerabilities/log-search.png
[6]: ./media/security-center-remediate-os-vulnerabilities/search-results.png
