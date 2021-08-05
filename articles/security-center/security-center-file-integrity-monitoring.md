---
title: File integrity monitoring in Azure Security Center
description: Learn how to configure file integrity monitoring (FIM) in Azure Security Center using this walkthrough.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 07/01/2021
ms.author: memildin

---
# File integrity monitoring in Azure Security Center
Learn how to configure file integrity monitoring (FIM) in Azure Security Center using this walkthrough.


## Availability

|Aspect|Details|
|----|:----|
|Release state:|General Availability (GA)|
|Pricing:|Requires [Azure Defender for servers](defender-for-servers-introduction.md).<br>FIM uploads data to the Log Analytics workspace. Data charges apply, based on the amount of data you upload. See [Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/) to learn more.|
|Required roles and permissions:|**Workspace owner** can enable/disable FIM (for more information, see [Azure Roles for Log Analytics](/services-hub/health/azure-roles#azure-roles)).<br>**Reader** can view results.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National/Sovereign (US Gov, Azure China)<br>Supported only in regions where Azure Automation's change tracking solution is available.<br>:::image type="icon" source="./media/icons/yes-icon.png"::: [Azure Arc](../azure-arc/servers/overview.md) enabled devices.<br>See [Supported regions for linked Log Analytics workspace](../automation/how-to/region-mappings.md).<br>[Learn more about change tracking](../automation/change-tracking/overview.md).|
|||

## What is FIM in Security Center?
File integrity monitoring (FIM), also known as change monitoring, examines operating system files, Windows registries, application software, Linux system files, and more, for changes that might indicate an attack. 

Security Center recommends entities to monitor with FIM, and you can also define your own FIM policies or entities to monitor. FIM informs you about suspicious activity such as:

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

By comparing the current state of these items with the state during the previous scan, FIM notifies you if suspicious modifications have been made.

FIM uses the Azure Change Tracking solution to track and identify changes in your environment. When file integrity monitoring is enabled, you have a **Change Tracking** resource of type **Solution**. For data collection frequency details, see [Change Tracking data collection details](../automation/change-tracking/overview.md#change-tracking-and-inventory-data-collection).

> [!NOTE]
> If you remove the **Change Tracking** resource, you will also disable the file integrity monitoring feature in Security Center.

## Which files should I monitor?

When choosing which files to monitor, consider the files that are critical for your system and applications. Monitor files that you don’t expect to change without planning. If you choose files that are frequently changed by applications or operating system (such as log files and text files) it'll create a lot of noise, making it difficult to identify an attack.

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

   :::image type="content" source="./media/security-center-file-integrity-monitoring/open-file-integrity-monitoring.png" alt-text="Launching FIM." lightbox="./media/security-center-file-integrity-monitoring/open-file-integrity-monitoring.png":::

    The **File integrity monitoring** configuration page opens.

    The following information is provided for each workspace:

    - Total number of changes that occurred in the last week (you may see a dash "-“ if FIM is not enabled on the workspace)
    - Total number of computers and VMs reporting to the workspace
    - Geographic location of the workspace
    - Azure subscription that the workspace is under

1. Use this page to:

    - Access and view the status and settings of each workspace

    - ![Upgrade plan icon.][4] Upgrade the workspace to use Azure Defender. This icon Indicates that the workspace or subscription isn't protected by Azure Defender. To use the FIM features, your subscription must be protected by Azure Defender. For more information, see [Azure Security Center free vs Azure Defender enabled](security-center-pricing.md).

    - ![Enable icon][3] Enable FIM on all machines under the workspace and configure the FIM options. This icon indicates that FIM is not enabled for the workspace.

        :::image type="content" source="./media/security-center-file-integrity-monitoring/workspace-list-fim.png" alt-text="Enabling FIM for a specific workspace.":::


    > [!TIP]
    > If there's no enable or upgrade button, and the space is blank, it means that FIM is already enabled on the workspace.


1. Select **ENABLE**. The details of the workspace including the number of Windows and Linux machines under the workspace is shown.

    :::image type="content" source="./media/security-center-file-integrity-monitoring/workspace-fim-status.png" alt-text="FIM workspace details page.":::

   The recommended settings for Windows and Linux are also listed.  Expand **Windows files**, **Registry**, and **Linux files** to see the full list of recommended items.

1. Clear the checkboxes for any recommended entities you do not want to be monitored by FIM.

1. Select **Apply file integrity monitoring** to enable FIM.

> [!NOTE]
> You can change the settings at any time. See [Edit monitored entities](#edit-monitored-entities) below to learn more.



## Audit monitored workspaces 

The **File integrity monitoring** dashboard displays for workspaces where FIM is enabled. The FIM dashboard opens after you enable FIM on a workspace or when you select a workspace in the **file integrity monitoring** window that already has FIM enabled.

:::image type="content" source="./media/security-center-file-integrity-monitoring/fim-dashboard.png" alt-text="The FIM dashboard and its various informational panels.":::

The FIM dashboard for a workspace displays the following details:

- Total number of machines connected to the workspace
- Total number of changes that occurred during the selected time period
- A breakdown of change type (files, registry)
- A breakdown of change category (modified, added, removed)

Select **Filter** at the top of the dashboard to change the time period for which changes are shown.

:::image type="content" source="./media/security-center-file-integrity-monitoring/dashboard-filter.png" alt-text="Time period filter for the FIM dashboard.":::

The **Servers** tab lists the machines reporting to this workspace. For each machine, the dashboard lists:

- Total changes that occurred during the selected period of time
- A breakdown of total changes as file changes or registry changes

When you select a machine, the query appears along with the results that identify the changes made during the selected time period for the machine. You can expand a change for more information.

:::image type="content" source="./media/security-center-file-integrity-monitoring/query-machine-changes.png" alt-text="Log Analytics query showing the changes identified by Azure Security Center's file integrity monitoring" lightbox="./media/security-center-file-integrity-monitoring/query-machine-changes.png":::

The **Changes** tab (shown below) lists all changes for the workspace during the selected time period. For each entity that was changed, the dashboard lists the:

- Machine that the change occurred on
- Type of change (registry or file)
- Category of change (modified, added, removed)
- Date and time of change

:::image type="content" source="./media/security-center-file-integrity-monitoring/changes-tab.png" alt-text="Azure Security Center's file integrity monitoring changes tab" lightbox="./media/security-center-file-integrity-monitoring/changes-tab.png":::

**Change details** opens when you enter a change in the search field or select an entity listed under the **Changes** tab.

:::image type="content" source="./media/security-center-file-integrity-monitoring/change-details.png" alt-text="Azure Security Center's file integrity monitoring showing the details pane for a change" lightbox="./media/security-center-file-integrity-monitoring/change-details.png":::

## Edit monitored entities

1. From the **File integrity monitoring dashboard** for a workspace, select **Settings** from the toolbar. 

    :::image type="content" source="./media/security-center-file-integrity-monitoring/file-integrity-monitoring-dashboard-settings.png" alt-text="Accessing the file integrity monitoring settings for a workspace." lightbox="./media/security-center-file-integrity-monitoring/file-integrity-monitoring-dashboard-settings.png":::

   **Workspace Configuration** opens with tabs for each type of element that can be monitored:

      - Windows registry
      - Windows files
      - Linux Files
      - File content
      - Windows services

      Each tab lists the entities that you can edit in that category. For each entity listed, Security Center identifies whether FIM is enabled (true) or not enabled (false).  Editing the entity lets you enable or disable FIM.

    :::image type="content" source="./media/security-center-file-integrity-monitoring/file-integrity-monitoring-workspace-configuration.png" alt-text="Workspace configuration for file integrity monitoring in Azure Security Center.":::

1. Select an entry from one of the tabs and edit any of the available fields in the **Edit for Change Tracking** pane. Options include:

    - Enable (True) or disable (False) file integrity monitoring
    - Provide or change the entity name
    - Provide or change the value or path
    - Delete the entity

1. Discard or save your changes.


## Add a new entity to monitor

1. From the **File integrity monitoring dashboard** for a workspace, select **Settings** from the toolbar. 

    The **Workspace Configuration** opens.

1. One the **Workspace Configuration**:

    1. Select the tab for the type of entity that you want to add: Windows registry, Windows files, Linux Files, file content, or Windows services. 
    1. Select **Add**. 

        In this example, we selected **Linux Files**.

        :::image type="content" source="./media/security-center-file-integrity-monitoring/file-integrity-monitoring-add-element.png" alt-text="Adding an element to monitor in Azure Security Center's file integrity monitoring" lightbox="./media/security-center-file-integrity-monitoring/file-integrity-monitoring-add-element.png":::

1. Select **Add**. **Add for Change Tracking** opens.

1. Enter the necessary information and select **Save**.

## Folder and path monitoring using wildcards

Use wildcards to simplify tracking across directories. The following rules apply when you configure folder monitoring using wildcards:
-   Wildcards are required for tracking multiple files.
-   Wildcards can only be used in the last segment of a path, such as C:\folder\file or /etc/*.conf
-   If an environment variable includes a path that is not valid, validation will succeed but the path will fail when inventory runs.
-   When setting the path, avoid general paths such as c:\*.* which will result in too many folders being traversed.

## Disable FIM
You can disable FIM. FIM uses the Azure Change Tracking solution to track and identify changes in your environment. By disabling FIM, you remove the Change Tracking solution from selected workspace.

To disable FIM:

1. From the **File integrity monitoring dashboard** for a workspace, select **Disable**.

    :::image type="content" source="./media/security-center-file-integrity-monitoring/disable-file-integrity-monitoring.png" alt-text="Disable file integrity monitoring from the settings page.":::

1. Select **Remove**.

## Next steps
In this article, you learned to use file integrity monitoring (FIM) in Security Center. To learn more about Security Center, see the following pages:

* [Setting security policies](tutorial-security-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Azure Security blog](/archive/blogs/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[3]: ./media/security-center-file-integrity-monitoring/enable.png
[4]: ./media/security-center-file-integrity-monitoring/upgrade-plan.png