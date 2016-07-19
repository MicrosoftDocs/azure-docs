<properties
   pageTitle="Resolve mismatch baseline rules in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Resolve mismatch baseline rules**."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/15/2016"
   ms.author="terrylan"/>

# Resolve mismatch baseline rules in Azure Security Center

Azure Security Center analyzes daily your virtual machine (VM) operating system (OS) for configurations that could make the VM more vulnerable to attack and recommends configuration changes to address these vulnerabilities. See the [list of recommended baselines](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335) for more information on the specific configurations being monitored. Security Center will recommend that you resolve mismatch baseline rules when your VM’s OS configuration does not match the recommended baselines.

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center. This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Resolve mismatch baseline rules**. This opens the **Baseline rules mismatch** blade.
![Resolve mismatch baseline rules][1]

2. The **Baseline rules mismatch** blade lists your VMs with OS configurations that do not match the recommended baselines.  For each VM, the blade identifies:

 - **FAILED RULES** -- The number of baseline rules that the VM's OS configuration failed.
 - **LAST SCAN TIME** -- The date and time that Security Center last scanned the VM’s OS configuration.
 - **STATE** -- The current state of the mismatch:

      - Open: The mismatch has not been addressed yet
      - In Progress: The mismatch is currently being applied, no action is required by you
      - Resolved: The mismatch was already addressed (when the issue has been resolved, the entry is grayed out)
 - **SEVERITY** -- All baseline rules mismatch are set to a severity of Low, meaning a vulnerability should be addressed but does not require immediate attention.

   Select a VM. This opens the baseline rules mismatch blade for that VM and displays the rules that have failed.

   ![Baseline rules mismatch][2]

Select a rule. In this example, lets select **Password must meet complexity requirements**. A blade opens describing the baseline rule mismatch and the impact of the mismatch. Review the details and consider how operating system configurations will be applied.

  ![Description for the baseline rule mismatch][3]

  Security Center uses Common Configuration Enumeration (CCE) to assign unique identifiers for configuration rules. The following information is provided on this blade:

  - NAME -- Name of baseline rule
  - SEVERITY -- CCE severity value of critical, important, or warning
  - CCIED -- CCE unique identifier for the baseline rule
  - DESCRIPTION -- Description of baseline rule
  - VULNERABILITY -- Explanation of vulnerability or risk if baseline rule is not applied
  - IMPACT -- Business impact when baseline rule is applied
  - EXPECTED VALUE -- Value expected when Security Center analyzes your VM OS configuration against the baseline rule
  - RULE OPERATION -- Rule operation used by Security Center during analysis of your VM OS configuration against the baseline rule
  - ACTUAL VALUE -- Value returned after analysis of your VM OS configuration against the baseline rule
  - EVALUATION RESULT –- Result of analysis: Pass, Fail


## Next steps

This article showed you how to implement the Security Center recommendation "Resolve mismatch baseline rules." You can review the set of baselines [here](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335). Security Center uses CCE (Common Configuration Enumeration) to assign unique identifiers for configuration rules. Visit the [CCE](http://cce.mitre.org) site for more information.

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-resolve-mismatch-baseline-rules/recommendation.png
[2]:./media/security-center-resolve-mismatch-baseline-rules/vm-baseline-rules-mismatch.png
[3]: ./media/security-center-resolve-mismatch-baseline-rules/baseline-rules-details.png
