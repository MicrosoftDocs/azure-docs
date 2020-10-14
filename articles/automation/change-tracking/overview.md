---
title: Azure Automation Change Tracking and Inventory overview
description: This article describes the Change Tracking and Inventory feature, which helps you identify software and Microsoft service changes in your environment.
services: automation
ms.subservice: change-inventory-management
ms.date: 10/14/2020
ms.topic: conceptual
---

# Change Tracking and Inventory overview

This article introduces you to Change Tracking and Inventory in Azure Automation. This feature tracks changes in virtual machines hosted in Azure, on-premises, and other cloud environments to help you pinpoint operational and environmental issues with software managed by the Distribution Package Manager. Items that are tracked by Change Tracking and Inventory include:

- Windows software
- Linux software (packages)
- Windows and Linux files
- Windows registry keys
- Microsoft services
- Linux daemons

> [!NOTE]
> To track Azure Resource Manager property changes, see the Azure Resource Graph [change history](../../governance/resource-graph/how-to/get-resource-changes.md).

Change Tracking and Inventory makes use of [Azure Security Center File Integrity Monitoring (FIM)](../../security-center/security-center-file-integrity-monitoring.md) to examines files and registries of operating systems. While FIM monitors those entities, Change Tracking and Inventory natively tracks:

- Software changes
- Microsoft services
- Linux daemons

Enabling all features included in Change Tracking and Inventory might cause additional charges. Before proceeding, review [Automation Pricing](https://azure.microsoft.com/pricing/details/automation/). We recommend that you monitor your linked Log Analytics workspace to keep track of your exact usage. For more information about analyzing Azure Monitor Logs data usage, see [Manage usage and cost](../../azure-monitor/platform/manage-cost-storage.md).

Change Tracking and Inventory forwards data to Azure Monitor Logs and this collected data is stored in a Log Analytics workspace. The File Integrity Monitoring (FIM) feature is available only when **Azure Defender for servers** is enabled. See [Pricing](../../security-center/security-center-pricing.md) to learn more. FIM uploads data to the same Log Analytics workspace as the one created to store data from Change Tracking and Inventory.

Machines connected to the Log Analytics workspace use the Log Analytics agent to collect data about changes to installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers. When data is available, the agent sends it to Azure Monitor Logs for processing. Azure Monitor Logs applies logic to the received data, records it, and makes it available.

> [!NOTE]
> Change Tracking and Inventory requires linking a Log Analytics workspace to your Automation account. For a definitive list of supported regions, see [Azure Workspace mappings](../how-to/region-mappings.md). The region mappings don't affect the ability to manage VMs in a separate region from your Automation account.

## Current limitations

Change Tracking and Inventory doesn't support or has the following limitations:

- Recursion for Windows registry tracking
- Network file systems
- Different installation methods
- ***.exe** files stored on Windows
- The **Max File Size** column and values are unused in the current implementation.
- If you try to collect more than 2500 files in a 30-minute collection cycle, Change Tracking and Inventory performance might be degraded.
- If network traffic is high, change records can take up to six hours to display.
- If you modify a configuration while a machine or server is shut down, it might post changes belonging to the previous configuration.
- Collecting Hotfix updates on Windows Server 2016 Core RS3 machines.
- Linux daemons might show a changed state even though no change has occurred. This issue arises because of the way the `SvcRunLevels` data in the Azure Monitor [ConfigurationChange](../../azure-monitor/reference/tables/configurationchange.md) table is written.

## Supported operating systems

Change Tracking and Inventory is supported on all operating systems that meet Log Analytics agent requirements. See [Supported operating systems](../../azure-monitor/platform/agents-overview.md#supported-operating-systems) for a list of the Windows and Linux operating system versions that are currently supported by the Log Analytics agent.

To understand client requirements for TLS 1.2, see [TLS 1.2 enforcement for Azure Automation](../automation-managing-data.md#tls-12-enforcement-for-azure-automation).

## Network requirements

The following addresses are required specifically for Change Tracking and Inventory. Communication to these addresses occurs over port 443.

|Azure Public  |Azure Government  |
|---------|---------|
|*.ods.opinsights.azure.com    | *.ods.opinsights.azure.us         |
|*.oms.opinsights.azure.com     | *.oms.opinsights.azure.us        |
|*.blob.core.windows.net | *.blob.core.usgovcloudapi.net|
|*.azure-automation.net | *.azure-automation.us|

When you create network group security rules or configure Azure Firewall to allow traffic to the Automation service and the Log Analytics workspace, use the [service tag](../../virtual-network/service-tags-overview.md#available-service-tags) **GuestAndHybridManagement** and **AzureMonitor**. This simplifies the ongoing management of your network security rules. To connect to the Automation service from your Azure VMs securely and privately, review [Use Azure Private Link](../how-to/private-link-security.md). To obtain the current service tag and range information to include as part of your on-premises firewall configurations, see [downloadable JSON files](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).

## Enable Change Tracking and Inventory

Here are the ways that you can enable Change Tracking and Inventory and select machines to be managed:

* [From an Azure virtual machine](enable-from-vm.md).
* [From browsing multiple Azure virtual machines](enable-from-portal.md).
* [From an Azure Automation account](enable-from-automation-account.md).
* For Arc enabled servers (preview) or non-Azure machines, install the [Log Analytics agent](/azure-monitor/platform/log-analytics-agent) and then [enable machines in the workspace](enable-from-automation-account.md/#enable-machines-in-the-workspace) to Change Tracking and Inventory.
* [Using an Automation runbook](enable-from-runbook.md).

## Tracking file changes

For tracking changes in files on both Windows and Linux, Change Tracking and Inventory uses MD5 hashes of the files. The feature uses the hashes to detect if changes have been made since the last inventory.

## Tracking file content changes

Change Tracking and Inventory allows you to view the contents of a Windows or Linux file. For each change to a file, Change Tracking and Inventory stores the contents of the file in an [Azure Storage account](/storage/common/storage-account-create). When you're tracking a file, you can view its contents before or after a change. The file content can be viewed either inline or side by side.

![View changes in a file](./media/change-tracking/view-file-changes.png)

## Tracking of registry keys

Change Tracking and Inventory allows monitoring of changes to Windows registry keys. Monitoring allows you to pinpoint extensibility points where third-party code and malware can activate. The following table lists preconfigured (but not enabled) registry keys. To track these keys, you must enable each one.

> [!div class="mx-tdBreakAll"]
> |Registry Key | Purpose |
> | --- | --- |
> |`HKEY\LOCAL\MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Startup` | Monitors scripts that run at startup.
> |`HKEY\LOCAL\MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Shutdown` | Monitors scripts that run at shutdown.
> |`HKEY\LOCAL\MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Run` | Monitors keys that are loaded before the user signs in to the Windows account. The key is used for 32-bit applications running on 64-bit computers.
> |`HKEY\LOCAL\MACHINE\SOFTWARE\Microsoft\Active Setup\Installed Components` | Monitors changes to application settings.
> |`HKEY\LOCAL\MACHINE\Software\Classes\Directory\ShellEx\ContextMenuHandlers` | Monitors context menu handlers that hook directly into Windows Explorer and usually run in-process with **explorer.exe**.
> |`HKEY\LOCAL\MACHINE\Software\Classes\Directory\Shellex\CopyHookHandlers` | Monitors copy hook handlers that hook directly into Windows Explorer and usually run in-process with **explorer.exe**.
> |`HKEY\LOCAL\MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers` | Monitors for icon overlay handler registration.
> |`HKEY\LOCAL\MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers` | Monitors for icon overlay handler registration for 32-bit applications running on 64-bit computers.
> |`HKEY\LOCAL\MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects` | Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation.
> |`HKEY\LOCAL\MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects` | Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation for 32-bit applications running on 64-bit computers.
> |`HKEY\LOCAL\MACHINE\Software\Microsoft\Internet Explorer\Extensions` | Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons.
> |`HKEY\LOCAL\MACHINE\Software\Wow6432Node\Microsoft\Internet Explorer\Extensions` | Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons for 32-bit applications running on 64-bit computers.
> |`HKEY\LOCAL\MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Drivers32` | Monitors 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc. Similar to the [drivers] section in the **system.ini** file.
> |`HKEY\LOCAL\MACHINE\Software\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Drivers32` | Monitors 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc for 32-bit applications running on 64-bit computers. Similar to the [drivers] section in the **system.ini** file.
> |`HKEY\LOCAL\MACHINE\System\CurrentControlSet\Control\Session Manager\KnownDlls` | Monitors the list of known or commonly used system DLLs. Monitoring prevents people from exploiting weak application directory permissions by dropping in Trojan horse versions of system DLLs.
> |`HKEY\LOCAL\MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Notify` | Monitors the list of packages that can receive event notifications from **winlogon.exe**, the interactive logon support model for Windows.

## Recursion support

Change Tracking and Inventory supports recursion, which allows you to specify wildcards to simplify tracking across directories. Recursion also provides environment variables to allow you to track files across environments with multiple or dynamic drive names. The following list includes common information you should know when configuring recursion:

- Wildcards are required for tracking multiple files.

- You can use wildcards only in the last segment of a file path, for example, **c:\folder\\file*** or **/etc/*.conf**.

- If an environment variable has an invalid path, validation succeeds but the path fails during execution.

- You should avoid general path names when setting the path, as this type of setting can cause too many folders to be traversed.

## Change Tracking and Inventory data collection

The next table shows the data collection frequency for the types of changes supported by Change Tracking and Inventory. For every type, the data snapshot of the current state is also refreshed at least every 24 hours.

| **Change Type** | **Frequency** |
| --- | --- |
| Windows registry | 50 minutes |
| Windows file | 30 minutes |
| Linux file | 15 minutes |
| Microsoft services | 10 seconds to 30 minutes</br> Default: 30 minutes |
| Linux daemons | 5 minutes |
| Windows software | 30 minutes |
| Linux software | 5 minutes |

The following table shows the tracked item limits per machine for Change Tracking and Inventory.

| **Resource** | **Limit** |
|---|---|---|
|File|500|
|Registry|250|
|Windows software (not including hotfixes) |250|
|Linux packages|1250|
|Services|250|
|Daemons|250|

The average Log Analytics data usage for a machine using Change Tracking and Inventory is approximately 40 MB per month, depending on your environment. With the Usage and Estimated Costs feature of the Log Analytics workspace, you can view the data ingested by Change Tracking and Inventory in a usage chart. Use this data view to evaluate your data usage and determine how it affects your bill. See [Understand your usage and estimate costs](/azure-monitor/platform/manage-cost-storage#understand-your-usage-and-estimate-costs).

### Microsoft service data

The default collection frequency for Microsoft services is 30 minutes. You can configure the frequency using a slider on the **Microsoft services** tab under **Edit Settings**.

![Microsoft services slider](./media/overview/windowservices.png)

To optimize performance, the Log Analytics agent only tracks changes. Setting a high threshold might miss changes if the service returns to its original state. Setting the frequency to a smaller value allows you to catch changes that might be missed otherwise.

> [!NOTE]
> While the agent can track changes down to a 10-second interval, the data still takes a few minutes to display in the Azure portal. Changes that occur during the time to display in the portal are still tracked and logged.

## Support for alerts on configuration state

A key capability of Change Tracking and Inventory is alerting on changes to the configuration state of your hybrid environment. Many useful actions are available to trigger in response to alerts. For example, actions on Azure functions, Automation runbooks, webhooks, and the like. Alerting on changes to the **c:\windows\system32\drivers\etc\hosts** file for a machine is one good application of alerts for Change Tracking and Inventory data. There are many more scenarios for alerting as well, including the query scenarios defined in the next table.

|Query  |Description  |
|---------|---------|
|ConfigurationChange <br>&#124; where ConfigChangeType == "Files" and FileSystemPath contains " c:\\windows\\system32\\drivers\\"|Useful for tracking changes to system-critical files.|
|ConfigurationChange <br>&#124; where FieldsChanged contains "FileContentChecksum" and FileSystemPath == "c:\\windows\\system32\\drivers\\etc\\hosts"|Useful for tracking modifications to key configuration files.|
|ConfigurationChange <br>&#124; where ConfigChangeType == "WindowsServices" and SvcName contains "w3svc" and SvcState == "Stopped"|Useful for tracking changes to system-critical services.|
|ConfigurationChange <br>&#124; where ConfigChangeType == "Daemons" and SvcName contains "ssh" and SvcState!= "Running"|Useful for tracking changes to system-critical services.|
|ConfigurationChange <br>&#124; where ConfigChangeType == "Software" and ChangeCategory == "Added"|Useful for environments that need locked-down software configurations.|
|ConfigurationData <br>&#124; where SoftwareName contains "Monitoring Agent" and CurrentVersion!= "8.0.11081.0"|Useful for seeing which machines have outdated or noncompliant software version installed. This query reports the last reported configuration state, but doesn't report changes.|
|ConfigurationChange <br>&#124; where RegistryKey == @"HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\QualityCompat"| Useful for tracking changes to crucial antivirus keys.|
|ConfigurationChange <br>&#124; where RegistryKey contains @"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\SharedAccess\\Parameters\\FirewallPolicy"| Useful for tracking changes to firewall settings.|

## Next steps

- To enable from an Automation account, see [Enable Change Tracking and Inventory from an Automation account](enable-from-automation-acount.md).

- To enable from the Azure portal, see [Enable Change Tracking and Inventory from the Azure portal](enable-from-portal.md).

- To enable from a runbook, see [Enable Change Tracking and Inventory from a runbook](enable-from-runbook.md).

- To enable from an Azure VM, see [Enable Change Tracking and Inventory from an Azure VM](enable-from-vm.md).
