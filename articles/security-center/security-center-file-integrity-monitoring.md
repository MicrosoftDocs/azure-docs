---
title: File integrity monitoring in Azure Security Center | Microsoft Docs
description: Learn how to configure file integrity monitoring (FIM) in Azure Security Center using this walkthrough.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin

ms.assetid: 411d7bae-c9d4-4e83-be63-9f2f2312b075
ms.service: security-center
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/22/2020
ms.author: memildin

---
# File integrity monitoring in Azure Security Center
Learn how to configure file integrity monitoring (FIM) in Azure Security Center using this walkthrough.


## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|Requires [Azure Defender for servers](defender-for-servers-introduction.md).<br>FIM uploads data to the Log Analytics workspace. Data charges apply, based on the amount of data you upload. See [Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/) to learn more.|
|Required roles and permissions:|**Workspace owner** can enable/disable FIM (for more information, see [Azure Roles for Log Analytics](/services-hub/health/azure-roles#azure-roles)).<br>**Reader** can view results.|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) US Gov<br>![No](./media/icons/no-icon.png) China Gov, Other Gov<br>Supported only in regions where Azure Automation's change tracking solution is available.<br>See [Supported regions for linked Log Analytics workspace](../automation/how-to/region-mappings.md).<br>[Learn more about change tracking](../automation/change-tracking/overview.md).|
|||

## What is FIM in Security Center?
File integrity monitoring (FIM), also known as change monitoring, examines operating system files, Windows registries, application software, Linux system files, and more, for changes that might indicate an attack. 

Security Center recommends entities to monitor with FIM, and you can also define your own FIM policies or entities to monitor. FIM alerts you for suspicious activity such as:

- File and registry key creation or removal
- File modifications (changes in file size, access control lists, and hash of the content)
- Registry modifications (changes in size, access control lists, type, and the content)

In this tutorial you'll learn how to:

> [!div class="checklist"]
> * Review the list of suggested entities to monitor with FIM
> * Define your own, custom FIM rules
> * Audit changes to your monitored entities
> * Use wildcards to simplify tracking across directories


## How does FIM work?

By comparing the current state of these items with the state during the previous scan, FIM alerts you if suspicious modifications have been made.

FIM uses the Azure Change Tracking solution to track and identify changes in your environment. When file integrity monitoring is enabled, you have a **Change Tracking** resource of type **Solution**. For data collection frequency details, see [Change Tracking data collection details](../automation/change-tracking/overview.md#change-tracking-and-inventory-data-collection).

> [!NOTE]
> If you remove the **Change Tracking** resource, you will also disable the file integrity monitoring feature in Security Center.

## Which files should I monitor?
When choosing which files to monitor, consider which files are critical for your system and applications. Monitor files that you don’t expect to change without planning. If you choose files that are frequently changed by applications or operating system (such as log files and text files) it'll create a lot of noise, making it difficult to identify an attack.

Security Center provides the following list of recommended items to monitor based on known attack patterns.

|Linux files|Windows files|Windows registry keys (HKLM = HKEY_LOCAL_MACHINE)|
|:----|:----|:----|
|/bin/login|C:\autoexec.bat|HKLM\SOFTWARE\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{C689AAB8-8E78-11D0-8C47-00C04FC295EE}|
|/bin/passwd|C:\boot.ini|HKLM\SOFTWARE\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{603BCC1F-4B59-4E08-B724-D2C6297EF351}|
|/etc/*.conf|C:\config.sys|HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\IniFileMapping\SYSTEM.ini\boot|
|/usr/bin|C:\Windows\system.ini|HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows|
|/usr/sbin|C:\Windows\win.ini|HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon|
|/bin|C:\Windows\regedit.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders|
|/sbin|C:\Windows\System32\userinit.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders|
|/boot|C:\Windows\explorer.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run|
|/usr/local/bin|C:\Program Files\Microsoft Security Client\msseces.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce|
|/usr/local/sbin||HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnceEx|
|/opt/bin||HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunServices|
|/opt/sbin||HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunServicesOnce|
|/etc/crontab||HKLM\SOFTWARE\WOW6432Node\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{C689AAB8-8E78-11D0-8C47-00C04FC295EE}|
|/etc/init.d||HKLM\SOFTWARE\WOW6432Node\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{603BCC1F-4B59-4E08-B724-D2C6297EF351}|
|/etc/cron.hourly||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows NT\CurrentVersion\IniFileMapping\system.ini\boot|
|/etc/cron.daily||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows NT\CurrentVersion\Windows|
|/etc/cron.weekly||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows NT\CurrentVersion\Winlogon|
|/etc/cron.monthly||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnce|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnceEx|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunServices|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunServicesOnce|
|||HKLM\SYSTEM\CurrentControlSet\Control\hivelist|
|||HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\KnownDLLs|
|||HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\DomainProfile|
|||HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\PublicProfile|
|||HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\StandardProfile|


## Enable file integrity monitoring 

FIM is only available from Security Center's pages in the Azure portal. There is currently no REST API for working with FIM.

1. From **Azure Defender** dashboard's **Advanced protection** area, select **File integrity monitoring**.

   :::image type="content" source="./media/security-center-file-integrity-monitoring/open-file-integrity-monitoring.png" alt-text="Launching FIM" lightbox="./media/security-center-file-integrity-monitoring/open-file-integrity-monitoring.png":::

    The **File integrity monitoring** configuration page opens.

    The following information is provided for each workspace:

    - Total number of changes that occurred in the last week (you may see a dash "-“ if FIM is not enabled on the workspace)
    - Total number of computers and VMs reporting to the workspace
    - Geographic location of the workspace
    - Azure subscription that the workspace is under

1. Use this page to:

    - Access and view the status and settings of each workspace

    - ![Upgrade plan icon][4] Upgrade the workspace to use Azure Defender. This icon Indicates that the workspace or subscription isn't protected by Azure Defender. To use the FIM features, your subscription must be protected by Azure Defender. [Learn more](security-center-pricing.md).

    - ![Enable icon][3] Enable FIM on all machines under the workspace and configure the FIM options. This icon indicates that FIM is not enabled for the workspace.

        :::image type="content" source="./media/security-center-file-integrity-monitoring/workspace-list-fim.png" alt-text="Enabling FIM for a specific workspace":::


    > [!TIP]
    > If there's no enable or upgrade button, and the space is blank, it means that FIM is already enabled on the workspace.


1. Select **ENABLE**. The details of the workspace including the number of Windows and Linux machines under the workspace is shown.

    :::image type="content" source="./media/security-center-file-integrity-monitoring/workspace-fim-status.png" alt-text="FIM workspace details page":::

   The recommended settings for Windows and Linux are also listed.  Expand **Windows files**, **Registry**, and **Linux files** to see the full list of recommended items.

1. Clear the checkboxes for any recommended entities you do not want to be monitored by FIM.

1. Select **Apply file integrity monitoring** to enable FIM.

> [!NOTE]
> You can change the settings at any time. See [Edit monitored entities](#edit-monitored-entities) below to learn more.



## Audit monitored workspaces 

The **File integrity monitoring** dashboard displays for workspaces where FIM is enabled. The FIM dashboard opens after you enable FIM on a workspace or when you select a workspace in the **file integrity monitoring** window that already has FIM enabled.

:::image type="content" source="./media/security-center-file-integrity-monitoring/fim-dashboard.png" alt-text="The FIM dashboard and its various informational panels":::

The FIM dashboard for a workspace displays the following details:

- Total number of machines connected to the workspace
- Total number of changes that occurred during the selected time period
- A breakdown of change type (files, registry)
- A breakdown of change category (modified, added, removed)

Select **Filter** at the top of the dashboard to change the time period for which changes are shown.

:::image type="content" source="./media/security-center-file-integrity-monitoring/dashboard-filter.png" alt-text="Time period filter for the FIM dashboard":::

The **Servers** tab lists the machines reporting to this workspace. For each machine, the dashboard lists:

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

1. Return to the **file integrity monitoring dashboard** and select **Settings**.

   ![Settings][11]

   **Workspace Configuration** opens displaying three tabs: **Windows Registry**, **Windows Files**, and **Linux Files**. Each tab lists the entities that you can edit in that category. For each entity listed, Security Center identifies if FIM is enabled (true) or not enabled (false).  Editing the entity lets you enable or disable FIM.

   ![Workspace configuration][12]

2. Select an identity protection. In this example, we selected an item under Windows Registry. **Edit for Change Tracking** opens.

   ![Edit or change tracking][13]

Under **Edit for Change Tracking** you can:

- Enable (True) or disable (False) file integrity monitoring
- Provide or change the entity name
- Provide or change the value or path
- Delete the entity, discard the change, or save the change

## Add a new entity to monitor
1. Return to the **File integrity monitoring dashboard** and select **Settings** at the top. **Workspace Configuration** opens.
2. Under **Workspace Configuration**, select the tab for the type of entity that you want to add: Windows Registry, Windows Files, or Linux Files. In this example, we selected **Linux Files**.

   ![Add a new item to monitor][14]

3. Select **Add**. **Add for Change Tracking** opens.

   ![Enter requested information][15]

4. On the **Add** page, type the requested information and select **Save**.

## Disable monitored entities
1. Return to the **File integrity monitoring** dashboard.
2. Select a workspace where FIM is currently enabled. A workspace is enabled for FIM if it is missing the Enable button or Upgrade Plan button.

   ![Select a workspace where FIM is enabled][16]

3. Under file integrity monitoring, select **Settings**.

   ![Select settings][17]

4. Under **Workspace Configuration**, select a group where **Enabled** is set to true.

   ![Workspace Configuration][18]

5. Under **Edit for Change Tracking** window set **Enabled** to False.

   ![Set Enabled to false][19]

6. Select **Save**.

## Folder and path monitoring using wildcards

Use wildcards to simplify tracking across directories. The following rules apply when you configure folder monitoring using wildcards:
-   Wildcards are required for tracking multiple files.
-   Wildcards can only be used in the last segment of a path, such as C:\folder\file or /etc/*.conf
-   If an environment variable includes a path that is not valid, validation will succeed but the path will fail when inventory runs.
-   When setting the path, avoid general paths such as c:\*.* which will result in too many folders being traversed.

## Disable FIM
You can disable FIM. FIM uses the Azure Change Tracking solution to track and identify changes in your environment. By disabling FIM, you remove the Change Tracking solution from selected workspace.

1. To disable FIM, return to the **File integrity monitoring** dashboard.
2. Select a workspace.
3. Under **File integrity monitoring**, select **Disable**.

   ![Disable FIM][20]

4. Select **Remove** to disable.

## Next steps
In this article, you learned to use file integrity monitoring (FIM) in Security Center. To learn more about Security Center, see the following pages:

* [Setting security policies](tutorial-security-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Azure Security blog](/archive/blogs/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-file-integrity-monitoring/security-center-dashboard.png
[3]: ./media/security-center-file-integrity-monitoring/enable.png
[4]: ./media/security-center-file-integrity-monitoring/upgrade-plan.png
[5]: ./media/security-center-file-integrity-monitoring/enable-fim.png
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