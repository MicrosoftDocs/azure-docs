---
title: Enable File Integrity Monitoring (Log Analytics agent)
description: Learn how to enable File Integrity Monitoring when you collect data with the Log Analytics agent
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 11/14/2022
---
# File Integrity Monitoring using the Log Analytics agent

To provide [File Integrity Monitoring (FIM)](file-integrity-monitoring-overview.md), the Log Analytics agent uploads data to the Log Analytics workspace. By comparing the current state of these items with the state during the previous scan, FIM notifies you if suspicious modifications have been made.

In this article, you'll learn how to:

- [Enable File Integrity Monitoring with the Log Analytics agent](#enable-file-integrity-monitoring-with-the-log-analytics-agent)
- [Disable File Integrity Monitoring](#disable-file-integrity-monitoring)
- [Monitor workspaces, entities, and files](#monitor-workspaces-entities-and-files)
- [Compare baselines using File Integrity Monitoring](#compare-baselines-using-file-integrity-monitoring)

> [!NOTE]
> File Integrity Monitoring may create the following account on monitored SQL Servers: `NT Service\HealthService` \
> If you delete the account, it will be automatically recreated.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features).<br>Using the Log Analytics agent, FIM uploads data to the Log Analytics workspace. Data charges apply, based on the amount of data you upload. See [Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/) to learn more.|
|Required roles and permissions:|**Workspace owner** can enable/disable FIM (for more information, see [Azure Roles for Log Analytics](/services-hub/health/azure-roles#azure-roles)).<br>**Reader** can view results.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)<br>Supported only in regions where Azure Automation's change tracking solution is available.<br>:::image type="icon" source="./media/icons/yes-icon.png"::: [Azure Arc](../azure-arc/servers/overview.md) enabled devices.<br>See [Supported regions for linked Log Analytics workspace](../automation/how-to/region-mappings.md).<br>[Learn more about change tracking](../automation/change-tracking/overview.md).<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts|

## Enable File Integrity Monitoring with the Log Analytics agent

FIM is only available from Defender for Cloud's pages in the Azure portal. There's currently no REST API for working with FIM.

1. From the **Workload protections** dashboard's **Advanced protection** area, select **File integrity monitoring**.

   :::image type="content" source="./media/file-integrity-monitoring-overview/open-file-integrity-monitoring.png" alt-text="Screenshot of screenshot of opening the File Integrity Monitoring dashboard." lightbox="./media/file-integrity-monitoring-overview/open-file-integrity-monitoring.png":::

    The following information is provided for each workspace:

    - Total number of changes that occurred in the last week (you may see a dash "-“ if FIM isn't enabled on the workspace)
    - Total number of computers and VMs reporting to the workspace
    - Geographic location of the workspace
    - Azure subscription that the workspace is under

1. Use this page to:

    - Access and view the status and settings of each workspace

    - ![Upgrade plan icon.][4] Upgrade the workspace to use enhanced security features. This icon indicates that the workspace or subscription isn't protected with Microsoft Defender for Servers. To use the FIM features, your subscription must be protected with this plan. Learn about how to [enable Defender for Servers](plan-defender-for-servers-select-plan.md).

    - ![Enable icon][3] Enable FIM on all machines under the workspace and configure the FIM options. This icon indicates that FIM isn't enabled for the workspace. If there's no enable or upgrade button, and the space is blank, it means that FIM is already enabled on the workspace.

        :::image type="content" source="./media/file-integrity-monitoring-overview/workspace-list-fim.png" alt-text="Screenshot of enabling FIM for a specific workspace.":::

1. Select **ENABLE**. The details of the workspace including the number of Windows and Linux machines under the workspace is shown.

    :::image type="content" source="./media/file-integrity-monitoring-overview/workspace-fim-status.png" alt-text="Screenshot of FIM workspace details page.":::

   The recommended settings for Windows and Linux are also listed.  Expand **Windows files**, **Registry**, and **Linux files** to see the full list of recommended items.

1. Clear the checkboxes for any recommended entities you don't want to be monitored by FIM.

1. Select **Apply file integrity monitoring** to enable FIM.

You can change the settings at any time. Learn more about [editing monitored entities](#edit-monitored-entities).

### Disable File Integrity Monitoring

FIM uses the Azure Change Tracking solution to track and identify changes in your environment. By disabling FIM, you remove the Change Tracking solution from selected workspace.

To disable FIM:

1. From the **File Integrity Monitoring dashboard** for a workspace, select **Disable**.

    :::image type="content" source="./media/file-integrity-monitoring-overview/disable-file-integrity-monitoring.png" alt-text="Screenshot of disabling file integrity monitoring from the settings page.":::

1. Select **Remove**.

## Monitor workspaces, entities, and files

### Audit monitored workspaces 

The **File integrity monitoring** dashboard displays for workspaces where FIM is enabled. The FIM dashboard opens after you enable FIM on a workspace or when you select a workspace in the **file integrity monitoring** window that already has FIM enabled.

:::image type="content" source="./media/file-integrity-monitoring-overview/fim-dashboard.png" alt-text="Screenshot of the FIM dashboard and its various informational panels.":::

The FIM dashboard for a workspace displays the following details:

- Total number of machines connected to the workspace
- Total number of changes that occurred during the selected time period
- A breakdown of change type (files, registry)
- A breakdown of change category (modified, added, removed)

Select **Filter** at the top of the dashboard to change the time period for which changes are shown.

:::image type="content" source="./media/file-integrity-monitoring-overview/dashboard-filter.png" alt-text="Screenshot of time period filter for the FIM dashboard.":::

The **Servers** tab lists the machines reporting to this workspace. For each machine, the dashboard lists:

- Total changes that occurred during the selected period of time
- A breakdown of total changes as file changes or registry changes

When you select a machine, the query appears along with the results that identify the changes made during the selected time period for the machine. You can expand a change for more information.

:::image type="content" source="./media/file-integrity-monitoring-overview/query-machine-changes.png" alt-text="Screenshot of log Analytics query showing the changes identified by Microsoft Defender for Cloud's file integrity monitoring." lightbox="./media/file-integrity-monitoring-overview/query-machine-changes.png":::

The **Changes** tab (shown below) lists all changes for the workspace during the selected time period. For each entity that was changed, the dashboard lists the:

- Machine that the change occurred on
- Type of change (registry or file)
- Category of change (modified, added, removed)
- Date and time of change

:::image type="content" source="./media/file-integrity-monitoring-overview/changes-tab.png" alt-text="Screenshot of Microsoft Defender for Cloud's file integrity monitoring changes tab." lightbox="./media/file-integrity-monitoring-overview/changes-tab.png":::

**Change details** opens when you enter a change in the search field or select an entity listed under the **Changes** tab.

:::image type="content" source="./media/file-integrity-monitoring-overview/change-details.png" alt-text="Screenshot of Microsoft Defender for Cloud's file integrity monitoring showing the details pane for a change." lightbox="./media/file-integrity-monitoring-overview/change-details.png":::

### Edit monitored entities

1. From the **File Integrity Monitoring dashboard** for a workspace, select **Settings** from the toolbar. 

    :::image type="content" source="./media/file-integrity-monitoring-overview/file-integrity-monitoring-dashboard-settings.png" alt-text="Screenshot of accessing the file integrity monitoring settings for a workspace." lightbox="./media/file-integrity-monitoring-overview/file-integrity-monitoring-dashboard-settings.png":::

   **Workspace Configuration** opens with tabs for each type of element that can be monitored:

      - Windows registry
      - Windows files
      - Linux Files
      - File content
      - Windows services

      Each tab lists the entities that you can edit in that category. For each entity listed, Defender for Cloud identifies whether FIM is enabled (true) or not enabled (false). Edit the entity to enable or disable FIM.

    :::image type="content" source="./media/file-integrity-monitoring-overview/file-integrity-monitoring-workspace-configuration.png" alt-text="Screenshot of workspace configuration for file integrity monitoring in Microsoft Defender for Cloud.":::

1. Select an entry from one of the tabs and edit any of the available fields in the **Edit for Change Tracking** pane. Options include:

    - Enable (True) or disable (False) file integrity monitoring
    - Provide or change the entity name
    - Provide or change the value or path
    - Delete the entity

1. Discard or save your changes.

### Add a new entity to monitor

1. From the **File Integrity Monitoring dashboard** for a workspace, select **Settings** from the toolbar. 

    The **Workspace Configuration** opens.

1. On the **Workspace Configuration**:

    1. Select the tab for the type of entity that you want to add: Windows registry, Windows files, Linux Files, file content, or Windows services. 
    1. Select **Add**. 

        In this example, we selected **Linux Files**.

        :::image type="content" source="./media/file-integrity-monitoring-overview/file-integrity-monitoring-add-element.png" alt-text="Screenshot of adding an element to monitor in Microsoft Defender for Cloud's file integrity monitoring." lightbox="./media/file-integrity-monitoring-overview/file-integrity-monitoring-add-element.png":::

1. Select **Add**. **Add for Change Tracking** opens.

1. Enter the necessary information and select **Save**.

### Folder and path monitoring using wildcards

Use wildcards to simplify tracking across directories. The following rules apply when you configure folder monitoring using wildcards:
-   Wildcards are required for tracking multiple files.
-   Wildcards can only be used in the last segment of a path, such as C:\folder\file or /etc/*.conf
-   If an environment variable includes a path that isn't valid, validation will succeed but the path will fail when inventory runs.
-   When setting the path, avoid general paths such as c:\*.* which will result in too many folders being traversed.

## Compare baselines using File Integrity Monitoring

[File Integrity Monitoring (FIM)](file-integrity-monitoring-overview.md) informs you when changes occur to sensitive areas in your resources, so you can investigate and address unauthorized activity. FIM monitors Windows files, Windows registries, and Linux files.

### Enable built-in recursive registry checks

The FIM registry hive defaults provide a convenient way to monitor recursive changes within common security areas.  For example, an adversary may configure a script to execute in LOCAL_SYSTEM context by configuring an execution at startup or shutdown.  To monitor changes of this type, enable the built-in check.  

![Registry.](./media/file-integrity-monitoring-enable-log-analytics/baselines-registry.png)

>[!NOTE]
> Recursive checks apply only to recommended security hives and not to custom registry paths.  

### Add a custom registry check

FIM baselines start by identifying characteristics of a known-good state for the operating system and supporting application.  For this example, we'll focus on the password policy configurations for Windows Server 2008 and higher.

|Policy Name                 | Registry Setting|
|----------------------------|-----------------|
|Domain controller: Refuse machine account password changes| MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\RefusePasswordChange|
|Domain member: Digitally encrypt or sign secure channel data (always)|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\RequireSignOrSeal|
|Domain member: Digitally encrypt secure channel data (when possible)|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\SealSecureChannel|
|Domain member: Digitally sign secure channel data (when possible)|MACHINE\System\CurrentControlSet\Services   \Netlogon\Parameters\SignSecureChannel|
|Domain member: Disable machine account password changes|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\DisablePasswordChange|
|Domain member: Maximum machine account password age|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\MaximumPasswordAge|
|Domain member: Require strong (Windows 2000 or later) session key|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\RequireStrongKey|
|Network security: Restrict NTLM:  NTLM authentication in this domain|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\RestrictNTLMInDomain|
|Network security: Restrict NTLM: Add server exceptions in this domain|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\DCAllowedNTLMServers|
|Network security: Restrict NTLM: Audit NTLM authentication in this domain|MACHINE\System\CurrentControlSet\Services  \Netlogon\Parameters\AuditNTLMInDomain|

> [!NOTE]
> To learn more about registry settings supported by various operating system versions, refer to the [Group Policy Settings reference spreadsheet](https://www.microsoft.com/download/confirmation.aspx?id=25250).

To configure FIM to monitor registry baselines:

1. In the **Add Windows Registry for Change Tracking** window, select the **Windows Registry Key** text box.
1. Enter the following registry key:

    ```
    HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters
    ```

    :::image type="content" source="./media/file-integrity-monitoring-enable-log-analytics/baselines-add-registry.png" alt-text="Screenshot of enable FIM on a registry.":::

### Track changes to Windows files

1. In the **Add Windows File for Change Tracking** window, in the **Enter path** text box, enter the folder that contains the files that you want to track.
In the example in the following figure, 
**Contoso Web App** resides in the D:\ drive within the **ContosWebApp** folder structure.  
1. Create a custom Windows file entry by providing a name of the setting class, enabling recursion, and specifying the top folder with a wildcard (*) suffix.

    :::image type="content" source="./media/file-integrity-monitoring-enable-log-analytics/baselines-add-file.png" alt-text="Screenshot of enable FIM on a file.":::

### Retrieve change data

File Integrity Monitoring data resides within the Azure Log Analytics/ConfigurationChange table set.  

 1. Set a time range to retrieve a summary of changes by resource.

    In the following example, we're retrieving all changes in the last 14 days in the categories of registry and files:

    ```
    ConfigurationChange
    | where TimeGenerated > ago(14d)
    | where ConfigChangeType in ('Registry', 'Files')
    | summarize count() by Computer, ConfigChangeType
    ```

1. To view details of the registry changes:

    1. Remove **Files** from the **where** clause. 
    1. Remove the summarization line and replace it with an ordering clause:

    ```
    ConfigurationChange
    | where TimeGenerated > ago(14d)
    | where ConfigChangeType in ('Registry')
    | order by Computer, RegistryKey
    ```

Reports can be exported to CSV for archival and/or channeled to a Power BI report.  

![FIM data.](./media/file-integrity-monitoring-enable-log-analytics/baselines-data.png)

<!--Image references-->
[3]: ./media/file-integrity-monitoring-overview/enable.png
[4]: ./media/file-integrity-monitoring-overview/upgrade-plan.png

## Next steps

Learn more about Defender for Cloud in:

- [Setting security policies](tutorial-security-policy.md) - Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations](review-security-recommendations.md) - Learn how recommendations help you protect your Azure resources.
- [Azure Security blog](https://azure.microsoft.com/blog/topics/security/) - Get the latest Azure security news and information.
