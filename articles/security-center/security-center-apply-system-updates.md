<properties
   pageTitle="Apply system updates in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendations **Apply system updates** and **Reboot after system updates**."
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
   ms.date="07/21/2016"
   ms.author="terrylan"/>

# Apply system updates in Azure Security Center

Azure Security Center monitors daily Windows and  Linux virtual machines (VMs) for missing operating system updates. Security Center retrieves a list of available security and critical updates from Windows Update or Windows Server Update Services (WSUS), depending on which service is configured on a Windows VM.  Security Center also checks for the latest updates in Linux systems. If your VM is missing a system update, Security Center will recommend that you apply system updates

> [AZURE.NOTE] This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Apply system updates**.
![Apply system updates][1]

2. The **Apply system updates** blade opens displaying a list of VMs missing system updates. Select a VM.
![Select a VM][2]

3. A blade opens displaying a list of missing updates for that VM. Select a system update. In this example, let’s select KB3156016.
![Missing security updates][3]

4. Follow the steps in the **Security Update** blade to apply the missing update.
![Security update][4]

## Reboot after system updates

5. Return to the **Recommendations** blade. A new entry was generated after you applied system updates, called **Reboot after system updates**. This entry lets you know that you need to reboot the VM to complete the process of applying system updates.
![Reboot after system updates][5]

6. Select **Reboot after system updates**. This opens **A restart is pending to complete system updates** blade displaying a list of VMs that you need to restart to complete the apply system updates process.
![Restart pending][6]

Restart the VM from Azure to complete the process.

## See also

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-apply-system-updates/recommendation.png
[2]:./media/security-center-apply-system-updates/select-vm.png
[3]: ./media/security-center-apply-system-updates/missing-security-updates.png
[4]: ./media/security-center-apply-system-updates/security-update.png
[5]: ./media/security-center-apply-system-updates/reboot-after-system-updates.png
[6]: ./media/security-center-apply-system-updates/restart-pending.png
