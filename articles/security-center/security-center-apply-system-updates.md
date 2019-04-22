---
title: Apply system updates in Azure Security Center | Microsoft Docs
description: This document shows you how to implement the Azure Security Center recommendations **Apply system updates** and **Reboot after system updates**.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: e5bd7f55-38fd-4ebb-84ab-32bd60e9fa7a
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/28/2018
ms.author: rkarlin

---
# Apply system updates in Azure Security Center
Azure Security Center monitors daily Windows and Linux virtual machines (VMs) and computers for missing operating system updates. Security Center retrieves a list of available security and critical updates from Windows Update or Windows Server Update Services (WSUS), depending on which service is configured on a Windows computer. Security Center also checks for the latest updates in Linux systems. If your VM or computer is missing a system update, Security Center will recommend that you apply system updates.

## Implement the recommendation
Apply system updates is presented as a recommendation in Security Center. If your VM or computer is missing a system update, this recommendation will be displayed under **Recommendations** and under **Compute**.  Selecting the recommendation opens the **Apply system updates** dashboard.

In this example, we will use **Compute**.

1. Select **Compute** under the Security Center main menu.

   ![Select Compute][1]

2. Under **Compute**, select **Missing system updates**. The **Apply system updates** dashboard opens.

   ![Apply system updates dashboard][2]

   The top of the dashboard provides:

    - The total number of Windows and Linux VMs and computers missing system updates.
    - The total number of critical updates missing across your VMs and computers.
    - The total number of security updates missing across your VMs and computers.

   The bottom of the dashboard lists all missing updates across your VMs and computers, and the severity of the missing update.  The list includes:

    - NAME: Name of the missing update.
    - NO. OF VMs & COMPUTERS: Total number of VMs and computers that are missing this update.
    - STATE: The current state of the recommendation:

      - Open: The recommendation has not been addressed yet.
      - In Progress: The recommendation is currently being applied to those resources, and no action is required by you.
      - Resolved: The recommendation was already finished. (When the issue has been resolved, the entry is dimmed).

    - SEVERITY: Describes the severity of that particular recommendation:

      - High: A vulnerability exists with a meaningful resource (application, virtual machine, or network security group) and requires attention.
      - Medium: Non-critical or additional steps are required to complete a process or eliminate a vulnerability.
      - Low: A vulnerability should be addressed but does not require immediate attention. (By default, low recommendations are not presented, but you can filter on low recommendations if you want to view them.)

3. Select a missing update in the list to view details.

   ![Missing security update][3]

4. Select the **Search** icon in the top ribbon.  An Azure Monitor logs search query opens filtered to the computers missing the update.

   ![Azure Monitor logs search][4]

5. Select a computer from the list for more information. Another search result opens with information filtered only for that computer.

    ![Azure Monitor logs search][5]

## Reboot after system updates
1. Return to the **Recommendations** blade. A new entry was generated after you applied system updates, called **Reboot after system updates**. This entry lets you know that you need to reboot the VM to complete the process of applying system updates.

   ![Reboot after system updates][6]
2. Select **Reboot after system updates**. This opens **A restart is pending to complete system updates** blade displaying a list of VMs that you need to restart to complete the apply system updates process.

   ![Restart pending][7]

Restart the VM from Azure to complete the process.

## Next steps
To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) -- Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-apply-system-updates/missing-system-updates.png
[2]:./media/security-center-apply-system-updates/apply-system-updates.png
[3]: ./media/security-center-apply-system-updates/detail-on-missing-update.png
[4]: ./media/security-center-apply-system-updates/log-search.png
[5]: ./media/security-center-apply-system-updates/search-details.png
[6]: ./media/security-center-apply-system-updates/reboot-after-system-updates.png
[7]: ./media/security-center-apply-system-updates/restart-pending.png
