---
title: Azure Change Tracking and Inventory Support matrix
description: Get a summary of support settings and limitations for enabling Azure CTI and tracking changes.
services: automation
ms.date: 12/03/2025
ms.topic: overview
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
#customer intent: As a customer, I want to understand the supported operating systems and identify the supported regions for Azure Change Tracking and Inventory so that I can ensure compatibility with my environment.
---

# Support matrix and regions for Azure Change Tracking and Inventory

Azure Change Tracking and Inventory (CTI) monitors changes and provide inventory logs for servers across Azure, on-premises, and other cloud environments. This article summarizes support settings and limitations when you enable Azure CTI and track changes. It also provides information about the supported regions and mappings for Azure CTI using Azure Monitor Agent.

## Support matrix

|**Component**| **Applies to**|
|---|---|
|Operating systems| Windows </br> Linux | 
|Resource types | Azure VMs </br> Azure Arc-enabled VMs </br> Virtual machines scale set|
|Data types | Windows registry </br> Windows services </br> Linux Daemons </br> Files </br> Software

> [!NOTE]
> Change Tracking and Inventory (CTI) currently does not support configuration to collect data from only specific services (such as selected Windows services or Linux daemons). 
> The service is designed to collect data from all services, and this behavior cannot be customized.
> Additionally, DCR transformations are not supported for Change Tracking DCRs.

## Limits

The following table shows the tracked item limits per machine for Azure CTI.

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

Azure CTI is supported on all operating systems that meet Azure Monitor agent requirements. See [supported operating systems](/azure/azure-monitor/agents/agents-overview#supported-operating-systems) for a list of the Windows and Linux operating system versions that are currently supported by the Azure Monitor agent.

To understand client requirements for TLS, see [TLS for Azure Automation](../automation/automation-managing-data.md#tls-for-azure-automation).

## Recursion support

Azure CTI supports recursion, which allows you to specify wildcards to simplify tracking across directories. Recursion also provides environment variables to allow you to track files across environments with multiple or dynamic drive names. The following list includes common information you should know when configuring recursion:

- Wildcards are required for tracking multiple files.

- You can use wildcards only in the last segment of a file path, for example, **c:\folder\\file*** or **/etc/*.conf**.

- If an environment variable has an invalid path, validation succeeds but the path fails during execution.

- You should avoid general path names when setting the path, as this type of setting can cause too many folders to be traversed.

## Change Tracking and Inventory data collection

The next table shows the data collection frequency for the types of changes supported by Azure CTI. Inventory logs will be populated every 10 hours by default for all data types. Additionally, when there is a change registered for any of the data types, the inventory and change logs will be generated for this instance.

| **Change Type** | **Frequency** |
| --- | --- |
| Windows registry | 50 minutes |
| Windows file | 30 to 40 minutes |
| Linux file | 15 minutes |
| Windows services | 10 minutes to 30 minutes</br> Default: 30 minutes |
| Windows software | 30 minutes |
| Linux software | 5 minutes |
| Linux Daemons | 5 minutes | 

> [!NOTE]
> The ability to customize data collection frequency is limited.
> Currently, this option is available only for Windows Files and Windows Services, and must adhere to the ranges specified in the preceding table.

The following table shows the tracked item limits per machine for Azure CTI.

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

#### For Windows Azure VMs

```powershell-interactive
- az vm extension set --publisher Microsoft.Azure.ChangeTrackingAndInventory --version 2.11.0 --ids /subscriptions/<subscriptionids>/resourceGroups/<resourcegroupname>/providers/Microsoft.Compute/virtualMachines/<vmname> --name ChangeTracking-Windows --enable-auto-upgrade true
```
#### For Linux Azure VMs

```powershell-interactive
– az vm extension set --publisher Microsoft.Azure.ChangeTrackingAndInventory --version 2.11.0 --ids /subscriptions/<subscriptionids>/resourceGroups/<resourcegroupname>/providers/Microsoft.Compute/virtualMachines/<vmname> --name ChangeTracking-Linux --enable-auto-upgrade true
```
#### For Arc-enabled Windows VMs

```powershell-interactive
– az connectedmachine extension create --name ChangeTracking-Windows --publisher Microsoft.Azure.ChangeTrackingAndInventory --type ChangeTracking-Windows --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
```

#### For Arc-enabled Linux VMs

```powershell-interactive
- az connectedmachine extension create --name ChangeTracking-Linux --publisher Microsoft.Azure.ChangeTrackingAndInventory --type ChangeTracking-Linux --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
```

#### Configure frequency

The default collection frequency for Windows services is 30 minutes. To configure the frequency, under **Edit** Settings, use a slider on the **Windows services** tab.

:::image type="content" source="media/overview-monitoring-agent/frequency-slider-inline.png" alt-text="Screenshot of frequency slider." lightbox="media/overview-monitoring-agent/frequency-slider-expanded.png":::

## Current limitations

Azure CTI using Azure Monitor Agent doesn't support or has the following limitations:

- Recursion for Windows registry tracking
- Currently, only the HKEY_LOCAL_MACHINE is supported. You will encounter this limitation whenever you manually add the registry key.
- Network file systems
- Different installation methods
- ***.exe** files stored on Windows
- The **Max File Size** column and values are unused in the current implementation.
- If you are tracking file changes, it is limited to a file size of 5 MB or less. 
- If the file size appears >1.25MB, then FileContentChecksum is incorrect due to memory constraints in the checksum calculation.
- If you try to collect more than 2500 files in a 30-minute collection cycle, Azure CTI performance might be degraded.
- If network traffic is high, change records can take up to six hours to display.
- If you modify a configuration while a machine or server is shut down, it might post changes belonging to the previous configuration.
- Collecting Hotfix updates on Windows Server 2016 Core RS3 machines.
- Linux daemons might show a changed state even though no change has occurred. This issue arises because of how the `SvcRunLevels` data in the Azure Monitor [ConfigurationChange](/azure/azure-monitor/reference/tables/configurationchange) table is written. 
- Change Tracking extension doesn't support any hardening standards for any Linux operating systems or Distros.
- Change Tracking extension doesn't support inventory for Microsoft store applications for any Windows operating systems or Distros.


## Support for alerts on configuration state

A key capability of Azure CTI is alerting on changes to the configuration state of your hybrid environment. Many useful actions are available to trigger in response to alerts. For example, actions on Azure functions, Automation runbooks, webhooks, and the like. Alerting on changes to the **c:\windows\system32\drivers\etc\hosts** file for a machine is one good application of alerts for Azure CTI data. There are many more scenarios for alerting as well, including the query scenarios defined in the next table.

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

## Supported regions and mappings for Change Tracking and Inventory with Azure Monitor Agent

The following table lists the supported regions and mappings:

|**Geography**| **Monitoring Agent workspace region**|
|---| ---|
|**Asia Pacific**| East Asia </br> Southeast Asia|
|**Australia**| Australia East </br> Australia Southeast |
|**Brazil**| Brazil South|
|**Canada**| Canada Central|
|**Europe**| North Europe </br> West Europe|
|**France**| France Central|
|**Germany** | Germany West Central|
|**India**| Central India|
|**Italy**| Italy North|
|**Japan**| Japan East|
|**Korea**| Korea Central|
|**Norway**| Norway East|
|**Spain**| Spain Central|
|**Sweden** | Sweden Central|
|**Switzerland**| Switzerland North|
|**United Arab Emirates**| UAE North|
|**United Kingdom**| UK South|
|**US Gov** <sup>1</sup>| US Gov Virginia </br> US Gov Arizona |
|**US**| East US</br> East US2</br> West US </br> West US2 </br> North Central US </br> Central US </br> South Central US </br> West Central US|

<sup>1</sup> Currently, onboarding is supported only through the Azure portal.

## Next steps

To enable Azure CTI from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](/azure/azure-change-tracking-inventory/quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory).
