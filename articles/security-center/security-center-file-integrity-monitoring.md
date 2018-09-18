---
title: File Integrity Monitoring in Azure Security Center | Microsoft Docs
description: " Learn how to enable File Integrity Monitoring in Azure Security Center. "
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 411d7bae-c9d4-4e83-be63-9f2f2312b075
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/21/2018
ms.author: rkarlin

---
# File Integrity Monitoring in Azure Security Center
Learn how to configure File Integrity Monitoring (FIM) in Azure Security Center using this walkthrough.

## What is FIM in Security Center?
File Integrity Monitoring (FIM), also known as change monitoring, examines files and registries of operating system, application software, and others for changes that might indicate an attack. A comparison method is used to determine if the current state of the file is different from the last scan of the file. You can leverage this comparison to determine if valid or suspicious modifications have been made to your files.

Security Center’s File Integrity Monitoring validates the integrity of Windows files, Windows registry, and Linux files. You select the files that you want monitored by enabling FIM. Security Center monitors files with FIM enabled for activity such as:

- File and Registry creation and removal
- File modifications (changes in file size, access control lists, and hash of the content)
- Registry modifications (changes in size, access conrol lists, type, and the content)

Security Center recommends entities to monitor, which you can easily enable FIM on. You can also define your own FIM policies or entities to monitor. This walkthrough shows you how.

> [!NOTE]
> The File Integrity Monitoring (FIM) feature works for Windows and Linux computers and VMs and is available on the Standard tier of Security Center. See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.
FIM uploads data to the Log Analytics workspace. Data charges apply, based on the amount of data you upload. See [Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/) to learn more.
>
>

> [!NOTE]
> FIM uses the Azure Change Tracking solution to track and identify changes in your environment. When File Integrity Monitoring is enabled, you have a **Change Tracking** resource of type Solution. If you remove the **Change Tracking** resource, you disable the File Integrity Monitoring feature in Security Center.
>
>

## Which files should I monitor?
You should think about the files that are critical for your system and applications when choosing which files to monitor. Consider choosing files that you don’t expect to change without planning. Choosing files that are frequently changed by applications or operating system (such as log files and text files) create a lot of noise which make it difficult to identify an attack.

Security Center recommends which files you should monitor as a default according to known attack patterns that include file and registry changes.

## Using File Integrity Monitoring
1. Open the **Security Center** dashboard.
2. In the left pane under **Advanced Cloud Defense**, select **File Integrity Monitoring**.
![Security Center dashboard][1]

**File Integrity Monitoring** opens.
  ![Security Center dashboard][2]

The following information is provided for each workspace:

- Total number of changes that occurred in the last week (you may see a dash "-“ if FIM is not enabled on the workspace)
- Total number of computers and VMs reporting to the workspace
- Geographic location of the workspace
- Azure subscription that the workspace is under

The following buttons may also be shown for a workspace:

- ![Enable icon][3] Indicates that FIM is not enabled for the workspace. Selecting the workspace lets you enable FIM on all machines under the workspace.
- ![Upgrade plan icon][4] Indicates that the workspace or subscription is not running under Security Center’s Standard tier. To use the FIM feature, your subscription must be running Standard.  Selecting the workspace enables you to upgrade to Standard. To learn more about the Standard tier and how to upgrade, see [Upgrade to Security Center's Standard tier for enhanced security](security-center-pricing.md).
- A blank (there is no button) means that FIM is already enabled on the workspace.

Under **File Integrity Monitoring**, you can select a workspace to enable FIM for that workspace, view the File Integrity Monitoring dashboard for that workspace, or [upgrade](security-center-pricing.md) the workspace to Standard.

## Enable FIM
To enable FIM on a workspace:

1. Under **File Integrity Monitoring**, select a workspace with the **Enable** button.
2. **Enable file integrity monitoring** opens displaying the number of Windows and Linux machines under the workspace.

   ![Enable file integrity monitoring][5]

   The recommended settings for Windows and Linux are also listed.  Expand **Windows files**, **Registry**, and **Linux files** to see the full list of recommended items.

3. Uncheck any recommended entities you do not want to apply FIM to.
4. Select **Apply file integrity monitoring** to enable FIM.

> [!NOTE]
> You can change the settings at any time. See [Edit monitored entities](security-center-file-integrity-monitoring.md#edit-monitored-items) below to learn more.
>
>

## View the FIM dashboard
The **File integrity monitoring** dashboard displays for workspaces where FIM is enabled. The FIM dashboard opens after you enable FIM on a workspace or when you select a workspace in the **File Integrity Monitoring** window that already has FIM enabled.

![File Integrity Monitoring dashboard][6]

The FIM dashboard for a workspace displays the following:

- Total number of machines connected to the workspace
- Total number of changes that occurred during the selected time period
- A breakdown of change type (files, registry)
- A breakdown of change category (modified, added, removed)

Selecting Filter at the top of the dashboard lets you apply the period of time that you want to see changes for.

![Time period filter][7]

The **Computers** tab (shown above) lists all machines reporting to this workspace. For each machine, the dashboard lists:

- Total changes that occurred during the selected period of time
- A breakdown of total changes as file changes or registry changes

**Log Search** opens when you enter a machine name in the search field or select a machine listed under the Computers tab. Log Search displays all the changes made during the selected time period for the machine. You can expand a change for more information.

![Log Search][8]

The **Changes** tab (shown below) lists all changes for the workspace during the selected time period. For each entity that was changed, the dashboard lists the:

- Computer that the change occurred on
- Type of change (registry or file)
- Category of change (modified, added, removed)
- Date and time of change

![Changes for the workspace][9]

**Change details** opens when you enter a change in the search field or select an entity listed under the **Changes** tab.

![Change details][10]

## Edit monitored entities

1. Return to the **File Integrity Monitoring dashboard** and select **Settings**.

  ![Settings][11]

  **Workspace Configuration** opens displaying three tabs: **Windows Registry**, **Windows Files**, and **Linux Files**. Each tab lists the entities that you can edit in that category. For each entity listed, Security Center identifies if FIM is enabled (true) or not enabled (false).  Editing the entity lets you enable or disable FIM.

  ![Workspace configuration][12]

2. Select an identityprotection. In this example, we selected an item under Windows Registry. **Edit for Change Tracking** opens.

  ![Edit or change tracking][13]

Under **Edit for Change Tracking** you can:

- Enable (True) or disable (False) file integrity monitoring
- Provide or change the entity name
- Provide or change the value or path
- Delete the entity, discard the change, or save the change

## Add a new entity to monitor
1. Return to the **File integirty monitoring dashboard** and select **Settings** at the top. **Workspace Configuration** opens.
2. Under **Workspace Configuration**, select the tab for the type of entity that you want to add: Windows Registry, Windows Files, or Linux Files. In this example, we selected **Linux Files**.

  ![Add a new item to monitor][14]

3. Select **Add**. **Add for Change Tracking** opens.

  ![Enter requested information][15]

4. On the **Add** page, type the requested information and select **Save**.

## Disable monitored entities
1. Return to the **File Integrity Monitoring** dashboard.
2. Select a workspace where FIM is currently enabled. A workspace is enabled for FIM if it is missing the Enable button or Upgrade Plan button.

  ![Select a workspace where FIM is enabled][16]

3. Under File Integrity Monitoring, select **Settings**.

  ![Select settings][17]

4. Under **Workspace Configuration**, select a group where **Enabled** is set to true.

  ![Workspace Configuration][18]

5. Under **Edit for Change Tracking** window set **Enabled** to False.

  ![Set Enabled to false][19]

6. Select **Save**.

## Folder and path monitoring using wildcards

Use wildcards to simplify tracking across directories. The following rules apply when you configure folder monitoring using wildcards:
-	Wildcards are required for tracking multiple files.
-	Wildcards can only be used in the last segment of a path, such as C:\folder\file or /etc/*.conf
-	If an environment variable includes a path that is not valid, validation will succeed but the path will fail when inventory runs.
-	When setting the path, avoid general paths such as c:\*.* which will result in too many folders being traversed.

## Disable FIM
You can disable FIM. FIM uses the Azure Change Tracking solution to track and identify changes in your environment. By disabling FIM, you remove the Change Tracking solution from selected workspace.

1. To disable FIM, return to the **File Integrity Monitoring** dashboard.
2. Select a workspace.
3. Under **File Integrity Monitoring**, select **Disable**.

  ![Disable FIM][20]

4. Select **Remove** to disable.

## Next steps
In this article you learned to use File Integrity Monitoring (FIM) in Security Center. To learn more about Security Center, see the following:

* [Setting security policies](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
* [Monitoring partner solutions](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
* [Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-file-integrity-monitoring/security-center-dashboard.png
[2]: ./media/security-center-file-integrity-monitoring/file-integrity-monitoring.png
[3]: ./media/security-center-file-integrity-monitoring/enable.png
[4]: ./media/security-center-file-integrity-monitoring/upgrade-plan.png
[5]: ./media/security-center-file-integrity-monitoring/enable-fim.png
[6]: ./media/security-center-file-integrity-monitoring/fim-dashboard.png
[7]: ./media/security-center-file-integrity-monitoring/filter.png
[8]: ./media/security-center-file-integrity-monitoring/log-search.png
[9]: ./media/security-center-file-integrity-monitoring/changes-tab.png
[10]: ./media/security-center-file-integrity-monitoring/change-details.png
[11]: ./media/security-center-file-integrity-monitoring/fim-dashboard-settings.png
[12]: ./media/security-center-file-integrity-monitoring/workspace-config.png
[13]: ./media/security-center-file-integrity-monitoring/edit.png
[14]: ./media/security-center-file-integrity-monitoring/add.png
[15]: ./media/security-center-file-integrity-monitoring/add-item.png
[16]: ./media/security-center-file-integrity-monitoring/fim-dashboard-disable.png
[17]: ./media/security-center-file-integrity-monitoring/fim-dashboard-settings-disabled.png
[18]: ./media/security-center-file-integrity-monitoring/workspace-config-disable.png
[19]: ./media/security-center-file-integrity-monitoring/edit-disable.png
[20]: ./media/security-center-file-integrity-monitoring/disable-fim.png
