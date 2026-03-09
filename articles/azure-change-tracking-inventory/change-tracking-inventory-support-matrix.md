---
title: Azure Change Tracking and Inventory Support Matrix
description: Get a summary of support settings and limitations for enabling Azure Change Tracking and Inventory and tracking changes.
services: automation
ms.date: 12/03/2025
ms.topic: overview
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
#customer intent: As a customer, I want to understand the supported operating systems and identify the supported regions for Azure Change Tracking and Inventory so that I can ensure compatibility with my environment.
---

# Support matrix and regions for Azure Change Tracking and Inventory

Azure Change Tracking and Inventory monitors changes and provides inventory logs for servers across Azure, on-premises, and other cloud environments. This article summarizes support settings and limitations when you enable Change Tracking and Inventory and track changes. It also provides information about the supported regions and mappings for Change Tracking and Inventory by using the Azure Monitor Agent (AMA).

## Support matrix

|Component| Applies to|
|---|---|
|Operating systems| Windows </br> Linux | 
|Resource types | Azure virtual machines (VMs) </br> Azure Arc-enabled VMs </br> Virtual machine scale sets|
|Data types | Windows registry </br> Windows services </br> Linux daemons </br> Files </br> Software

> [!NOTE]
> Change Tracking and Inventory currently doesn't support configuration to collect data from only specific services (such as selected Windows services or Linux daemons).
> The service collects data from all services, and you can't customize this behavior. Additionally, DCR transformations aren't supported for Change Tracking DCRs.

## Limits

The following table shows the tracked item limits per machine for Change Tracking and Inventory.

| Resource | Limit| Notes |
|---|---|---|
|File|500||
|File size|5 MB||
|Registry|250||
|Windows software|250|Doesn't include software updates.|
|Linux packages|1,250||
|Windows services |250||
|Linux daemons | 250|| 

## Supported operating systems

Change Tracking and Inventory is supported on all operating systems that meet AMA requirements. For a list of the Windows and Linux operating system versions that are currently supported by the AMA, see [Supported operating systems](/azure/azure-monitor/agents/agents-overview#supported-operating-systems).

To understand client requirements for Transport Layer Security (TLS), see [TLS for Azure Automation](../automation/automation-managing-data.md#tls-for-azure-automation).

## Recursion support

Change Tracking and Inventory supports recursion, which you can use to specify wildcards to simplify tracking across directories. Recursion also provides environment variables that you can use to track files across environments with multiple or dynamic drive names. The following list includes common information that you should know when you configure recursion:

- Use wildcards to track multiple files.
- Use wildcards only in the last segment of a file path, for example, `c:\folder\\file*` or `/etc/*.conf`.
- Be aware that if an environment variable has an invalid path, validation succeeds but the path fails during execution.
- Avoid general path names when you set the path. This type of setting can cause too many folders to be traversed.

## Change Tracking and Inventory data collection

The following table shows the data collection frequency for the types of changes Change Tracking and Inventory supports. Inventory logs are populated every 10 hours by default for all data types. When a change is registered for any of the data types, the inventory and change logs are generated for this instance.

| Change type | Frequency |
| --- | --- |
| Windows registry | 50 minutes |
| Windows file | 30 to 40 minutes |
| Linux file | 15 minutes |
| Windows services | 10 minutes to 30 minutes</br> Default: 30 minutes |
| Windows software | 30 minutes |
| Linux software | 5 minutes |
| Linux daemons | 5 minutes | 

> [!NOTE]
> The ability to customize data collection frequency is limited.
> Currently, this option is available only for Windows files and Windows services. It must adhere to the ranges specified in the preceding table.

The following table shows the tracked item limits per machine for Change Tracking and Inventory.

| Resource | Limit |
|---|---|
|File|500|
|Registry|250|
|Windows software (not including hotfixes) |250|
|Linux packages|1,250|
|Windows services | 250 |
|Linux daemons| 500| 

### Windows services data

#### Prerequisites

To enable tracking of Windows services data, you must upgrade the Change Tracking extension and use extension 2.11.0.0 or later.

#### For Windows Azure VMs

```powershell-interactive
- az vm extension set --publisher Microsoft.Azure.ChangeTrackingAndInventory --version 2.11.0 --ids /subscriptions/<subscriptionids>/resourceGroups/<resourcegroupname>/providers/Microsoft.Compute/virtualMachines/<vmname> --name ChangeTracking-Windows --enable-auto-upgrade true
```

#### For Linux Azure VMs

```powershell-interactive
– az vm extension set --publisher Microsoft.Azure.ChangeTrackingAndInventory --version 2.11.0 --ids /subscriptions/<subscriptionids>/resourceGroups/<resourcegroupname>/providers/Microsoft.Compute/virtualMachines/<vmname> --name ChangeTracking-Linux --enable-auto-upgrade true
```

#### For Azure Arc-enabled Windows VMs

```powershell-interactive
– az connectedmachine extension create --name ChangeTracking-Windows --publisher Microsoft.Azure.ChangeTrackingAndInventory --type ChangeTracking-Windows --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
```

#### For Azure Arc-enabled Linux VMs

```powershell-interactive
- az connectedmachine extension create --name ChangeTracking-Linux --publisher Microsoft.Azure.ChangeTrackingAndInventory --type ChangeTracking-Linux --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
```

#### Configure frequency

The default collection frequency for Windows services is 30 minutes. To configure the frequency, under **Edit** settings, use a slider on the **Windows Services** tab.

:::image type="content" source="media/overview-monitoring-agent/frequency-slider-inline.png" alt-text="Screenshot of the frequency slider." lightbox="media/overview-monitoring-agent/frequency-slider-expanded.png":::

## Current limitations

Change Tracking and Inventory using the AMA doesn't support the following capabilities:

- Recursion for Windows registry tracking.
- Anything other than `HKEY_LOCAL_MACHINE`. You encounter this limitation whenever you add the registry key manually.
- Network file systems.
- Different installation methods.
- The `*.exe` files stored on Windows.
- The **Max File Size** column and values in the current implementation.
- Collecting hotfix updates on Windows Server 2016 Core RS3 machines.
- Any hardening standards for any Linux operating systems or distributions.
- Inventory for Microsoft store applications for any Windows operating systems or distributions.

Change Tracking and Inventory using the AMA has the following limitations:

- If your tracking file changes, it's limited to a file size of 5 MB or less.
- If the file size appears >1.25 MB, then `FileContentChecksum` is incorrect because of memory constraints in the checksum calculation.
- If you try to collect more than 2,500 files in a 30-minute collection cycle, Change Tracking and Inventory performance might be degraded.
- If network traffic is high, change records can take up to six hours to display.
- If you modify a configuration while a machine or server is shut down, it might post changes belonging to the previous configuration.
- Even if no change occurred, Linux daemons might show a changed state. This issue arises because of how the `SvcRunLevels` data in the Azure Monitor [ConfigurationChange](/azure/azure-monitor/reference/tables/configurationchange) table is written.

## Support for alerts on configuration state

A key capability of Change Tracking and Inventory is alerting on changes to the configuration state of your hybrid environment. Many useful actions are available to trigger in response to alerts. Examples include actions on Azure functions, Azure Automation runbooks, and webhooks. Alerting on changes to the `c:\windows\system32\drivers\etc\hosts` file for a machine is one good application of alerts for Change Tracking and Inventory data. There are many more scenarios for alerting, including the query scenarios defined in the following table.

|Query  |Description  |
|---------|---------|
|`ConfigurationChange <br>&#124; where ConfigChangeType == "Files" and FileSystemPath contains " c:\\windows\\system32\\drivers\\"`|Useful for tracking changes to system-critical files.|
|`ConfigurationChange <br>&#124; where FieldsChanged contains "FileContentChecksum" and FileSystemPath == "c:\\windows\\system32\\drivers\\etc\\hosts"`|Useful for tracking modifications to key configuration files.|
|`ConfigurationChange <br>&#124; where ConfigChangeType == "WindowsServices" and SvcName contains "w3svc" and SvcState == "Stopped"`|Useful for tracking changes to system-critical services.|
|`ConfigurationChange <br>&#124; where ConfigChangeType == "Daemons" and SvcName contains "ssh" and SvcState!= "Running"`|Useful for tracking changes to system-critical services.|
|`ConfigurationChange <br>&#124; where ConfigChangeType == "Software" and ChangeCategory == "Added"`|Useful for environments that need locked-down software configurations.|
|`ConfigurationData <br>&#124; where SoftwareName contains "Monitoring Agent" and CurrentVersion!= "8.0.11081.0"`|Useful for seeing which machines have outdated or noncompliant software versions installed. This query reports the last reported configuration state but doesn't report changes.|
|`ConfigurationChange <br>&#124; where RegistryKey == @"HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\QualityCompat"`| Useful for tracking changes to crucial antivirus keys.|
|`ConfigurationChange <br>&#124; where RegistryKey contains @"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\SharedAccess\\Parameters\\FirewallPolicy"`| Useful for tracking changes to firewall settings.|

## Supported regions and mappings for Change Tracking and Inventory with the Azure Monitor Agent

The following table lists the supported regions and mappings.

|Geography| Azure Monitor Agent workspace region|
|---| ---|
|Asia Pacific| East Asia </br> Southeast Asia|
|Australia| Australia East </br> Australia Southeast |
|Brazil| Brazil South|
|Canada| Canada Central|
|Europe| North Europe </br> West Europe|
|France| France Central|
|Germany | Germany West Central|
|India| Central India|
|Italy| Italy North|
|Japan| Japan East|
|Korea| Korea Central|
|Norway| Norway East|
|Spain| Spain Central|
|Sweden | Sweden Central|
|Switzerland| Switzerland North|
|United Arab Emirates| UAE North|
|United Kingdom| UK South|
|US Gov <sup>1</sup>| US Gov Virginia </br> US Gov Arizona |
|US| East US</br> East US2</br> West US </br> West US2 </br> North Central US </br> Central US </br> South Central US </br> West Central US|

<sup>1</sup> Currently, onboarding is supported only through the Azure portal.

## Related content

- To enable Change Tracking and Inventory from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](/azure/azure-change-tracking-inventory/quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory).
