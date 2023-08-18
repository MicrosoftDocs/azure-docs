---
title: Azure Automation Change Tracking and Inventory overview using Azure Monitoring Agent (Preview)
description: This article describes the Change Tracking and Inventory feature using Azure monitoring agent (Preview), which helps you identify software and Microsoft service changes in your environment.
services: automation
ms.subservice: change-inventory-management
ms.date: 08/01/2023
ms.topic: conceptual
---

# Overview of change tracking and inventory using Azure Monitoring Agent (Preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software :heavy_check_mark: Windows Services & Linux Daemons

> [!Important]
> Currently, Change tracking and inventory uses Log Analytics Agent and this is scheduled to retire by 31.August.2024. We recommend that you use Azure Monitoring Agent as the new supporting agent.

This article explains on the latest version of change tracking support using Azure Monitoring Agent (Preview) as a singular agent for data collection. 

## Key benefits

- **Compatibility with the unified monitoring agent** - Compatible with the [Azure Monitor Agent (Preview)](../../azure-monitor/agents/agents-overview.md) that enhances security, reliability, and facilitates multi-homing experience to store data.
- **Compatibility with tracking tool**- Compatible with the Change tracking (CT) extension deployed through the Azure Policy on the client's virtual machine. You can switch to Azure Monitor Agent (AMA), and then the CT extension pushes the software, files, and registry to AMA.
- **Multi-homing experience** – Provides standardization of management from one central workspace. You can [transition from Log Analytics (LA) to AMA](../../azure-monitor/agents/azure-monitor-agent-migration.md)
so that all VMs point to a single workspace for data collection and maintenance.
- **Rules management** – Uses [Data Collection Rules](https://azure.microsoft.com/updates/azure-monitor-agent-and-data-collection-rules-public-preview/) to configure or customize various aspects of data collection. For example, you can change the frequency of file collection.

## Current limitations

Change Tracking and Inventory using Azure Monitoring Agent (Preview) doesn't support or has the following limitations:

- Recursion for Windows registry tracking
- Network file systems
- Different installation methods
- ***.exe** files stored on Windows
- The **Max File Size** column and values are unused in the current implementation.
- If you are tracking file changes, it is limited to a file size of 5 MB or less. 
- If the file size appears >1.25MB, then FileContentChecksum is incorrect due to memory constraints in the checksum calculation.
- If you try to collect more than 2500 files in a 30-minute collection cycle, Change Tracking and Inventory performance might be degraded.
- If network traffic is high, change records can take up to six hours to display.
- If you modify a configuration while a machine or server is shut down, it might post changes belonging to the previous configuration.
- Collecting Hotfix updates on Windows Server 2016 Core RS3 machines.
- Linux daemons might show a changed state even though no change has occurred. This issue arises because of how the `SvcRunLevels` data in the Azure Monitor [ConfigurationChange](https://learn.microsoft.com/azure/azure-monitor/reference/tables/configurationchange) table is written. 


## Limits

The following table shows the tracked item limits per machine for change tracking and inventory.

| **Resource** | **Limit**| **Notes** |
|---|---|---|
|File|500||
|File size|5 MB||
|Registry|250||
|Windows software|250|Doesn't include software updates.|
|Linux packages|1,250||
|Windows Services |250||
|Linux Daemons | 250|| 

## Supported operating systems

Change Tracking and Inventory is supported on all operating systems that meet Azure Monitor agent requirements. See [supported operating systems](../../azure-monitor/agents/agents-overview.md#supported-operating-systems) for a list of the Windows and Linux operating system versions that are currently supported by the Azure Monitor agent.

To understand client requirements for TLS 1.2 or higher, see [TLS 1.2 or higher for Azure Automation](../automation-managing-data.md#tls-12-or-higher-for-azure-automation).


## Enable Change Tracking and Inventory

You can enable Change Tracking and Inventory in the following ways:

- Manually for non-Azure Arc-enabled machines, Refer to the Initiative *Enable Change Tracking and Inventory for Arc-enabled virtual machines* in **Policy > Definitions > Select Category = ChangeTrackingAndInventory**. To enable Change Tracking and Inventory at scale, use the **DINE Policy** based solution. For more information, see [Enable Change Tracking and Inventory using Azure Monitoring Agent (Preview)](enable-vms-monitoring-agent.md).

- For a single Azure VM from the [Virtual machine page](enable-from-vm.md) in the Azure portal. This scenario is available for Linux and Windows VMs.

- For [multiple Azure VMs](enable-from-portal.md) by selecting them from the Virtual machines page in the Azure portal.

## Tracking file changes

For tracking changes in files on both Windows and Linux, Change Tracking and Inventory uses SHA256 hashes of the files. The feature uses the hashes to detect if changes have been made since the last inventory.

## Tracking file content changes

Change Tracking and Inventory allows you to view the contents of a Windows or Linux file. For each change to a file, Change Tracking and Inventory stores the contents of the file in an [Azure Storage account](../../storage/common/storage-account-create.md). When you're tracking a file, you can view its contents before or after a change. The file content can be viewed either inline or side by side. [Learn more](manage-change-tracking-monitoring-agent.md#configure-file-content-changes).

![Screenshot of viewing changes in a Windows or Linux file.](./media/overview/view-file-changes.png)


## Tracking of registry keys

Change Tracking and Inventory allows monitoring of changes to Windows registry keys. Monitoring allows you to pinpoint extensibility points where third-party code and malware can activate. The following table lists pre-configured (but not enabled) registry keys. To track these keys, you must enable each one.

> [!div class="mx-tdBreakAll"]
> |Registry Key | Purpose |
> | --- | --- |
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Startup` | Monitors scripts that run at startup.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Group Policy\Scripts\Shutdown` | Monitors scripts that run at shutdown.
> |`HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Run` | Monitors keys that are loaded before the user signs in to the Windows account. The key is used for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Active Setup\Installed Components` | Monitors changes to application settings.
> |`HKEY_LOCAL_MACHINE\Software\Classes\Directory\ShellEx\ContextMenuHandlers` | Monitors context menu handlers that hook directly into Windows Explorer and usually run in-process with **explorer.exe**.
> |`HKEY_LOCAL_MACHINE\Software\Classes\Directory\Shellex\CopyHookHandlers` | Monitors copy hook handlers that hook directly into Windows Explorer and usually run in-process with **explorer.exe**.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers` | Monitors for icon overlay handler registration.
>|`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers` | Monitors for icon overlay handler registration for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects` | Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation.
> |`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects` | Monitors for new browser helper object plugins for Internet Explorer. Used to access the Document Object Model (DOM) of the current page and to control navigation for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Internet Explorer\Extensions` | Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons.
> |`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Internet Explorer\Extensions` | Monitors for new Internet Explorer extensions, such as custom tool menus and custom toolbar buttons for 32-bit applications running on 64-bit computers.
> |`HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Drivers32` | Monitors 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc. Similar to the [drivers] section in the **system.ini** file.
> |`HKEY_LOCAL_MACHINE\Software\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Drivers32` | Monitors 32-bit drivers associated with wavemapper, wave1 and wave2, msacm.imaadpcm, .msadpcm, .msgsm610, and vidc for 32-bit applications running on 64-bit computers. Similar to the [drivers] section in the **system.ini** file.
> |`HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\KnownDlls` | Monitors the list of known or commonly used system DLLs. Monitoring prevents people from exploiting weak application directory permissions by dropping in Trojan horse versions of system DLLs.
> |`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Notify` | Monitors the list of packages that can receive event notifications from **winlogon.exe**, the interactive logon support model for Windows.


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
| Windows file | 30 to 40 minutes |
| Linux file | 15 minutes |
| Windows services | 10 minutes to 30 minutes</br> Default: 30 minutes |
| Windows software | 30 minutes |
| Linux software | 5 minutes |
| Linux Daemons | 5 minutes | 

The following table shows the tracked item limits per machine for Change Tracking and Inventory.

| **Resource** | **Limit** |
|---|---|
|File|500|
|Registry|250|
|Windows software (not including hotfixes) |250|
|Linux packages|1250|
|Windows Services | 250 |
|Linux Daemons| 500| 

### Windows services data

#### Prerequisites

To enable tracking of Windows Services data, you must upgrade CT extension and use extension more than or equal to 2.11.0.0

#### [For Windows Azure VMs](#tab/win-az-vm)

```powershell-interactive
- az vm extension set --publisher Microsoft.Azure.ChangeTrackingAndInventory --version 2.11.0 --ids /subscriptions/<subscriptionids>/resourceGroups/<resourcegroupname>/providers/Microsoft.Compute/virtualMachines/<vmname> --name ChangeTracking-Windows --enable-auto-upgrade true
```
#### [For Linux Azure VMs](#tab/lin-az-vm)

```powershell-interactive
– az vm extension set --publisher Microsoft.Azure.ChangeTrackingAndInventory --version 2.11.0 --ids /subscriptions/<subscriptionids>/resourceGroups/<resourcegroupname>/providers/Microsoft.Compute/virtualMachines/<vmname> --name ChangeTracking-Linux --enable-auto-upgrade true
```
#### [For Arc-enabled Windows VMs](#tab/win-arc-vm)

```powershell-interactive
– az connectedmachine extension create --name ChangeTracking-Windows --publisher Microsoft.Azure.ChangeTrackingAndInventory --type ChangeTracking-Windows --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
```

#### [For Arc-enabled Linux VMs](#tab/lin-arc-vm)

```powershell-interactive
- az connectedmachine extension create --name ChangeTracking-Linux --publisher Microsoft.Azure.ChangeTrackingAndInventory --type ChangeTracking-Linux --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
```
---

#### Configure frequency

The default collection frequency for Windows services is 30 minutes. To configure the frequency,
- under **Edit** Settings, use a slider on the **Windows services** tab.

:::image type="content" source="media/overview-monitoring-agent/frequency-slider-inline.png" alt-text="Screenshot of frequency slider." lightbox="media/overview-monitoring-agent/frequency-slider-expanded.png":::


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

- To enable from the Azure portal, see [Enable Change Tracking and Inventory from the Azure portal](../change-tracking/enable-vms-monitoring-agent.md).
