---
title: Use blob storage for IIS and table storage for events in Azure Monitor | Microsoft Docs
description: Azure Monitor can read the logs for Azure services that write diagnostics to table storage or IIS logs written to blob storage.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: bf444752-ecc1-4306-9489-c29cb37d6045
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 04/12/2017
ms.author: magoedte
---
# Collect Azure diagnostic logs from Azure Storage

Azure Monitor can read the logs for the following services that write diagnostics to table storage or IIS logs written to blob storage:

* Service Fabric clusters (Preview)
* Virtual Machines
* Web/Worker Roles

Before Azure Monitor can collect data into a Log Analytics workspace for these resources, Azure diagnostics must be enabled.

Once diagnostics are enabled, you can use the Azure portal or PowerShell configure the workspace to collect the logs.

Azure Diagnostics is an Azure extension that enables you to collect diagnostic data from a worker role, web role, or virtual machine running in Azure. The data is stored in an Azure storage account and can then be collected by Azure Monitor.

For Azure Monitor to collect these Azure Diagnostics logs, the logs must be in the following locations:

| Log Type | Resource Type | Location |
| --- | --- | --- |
| IIS logs |Virtual Machines <br> Web roles <br> Worker roles |wad-iis-logfiles (Blob Storage) |
| Syslog |Virtual Machines |LinuxsyslogVer2v0 (Table Storage) |
| Service Fabric Operational Events |Service Fabric nodes |WADServiceFabricSystemEventTable |
| Service Fabric Reliable Actor Events |Service Fabric nodes |WADServiceFabricReliableActorEventTable |
| Service Fabric Reliable Service Events |Service Fabric nodes |WADServiceFabricReliableServiceEventTable |
| Windows Event logs |Service Fabric nodes <br> Virtual Machines <br> Web roles <br> Worker roles |WADWindowsEventLogsTable (Table Storage) |
| Windows ETW logs |Service Fabric nodes <br> Virtual Machines <br> Web roles <br> Worker roles |WADETWEventTable (Table Storage) |

> [!NOTE]
> IIS logs from Azure Websites are not currently supported.
>
>

For virtual machines, you have the option of installing the [Log Analytics agent](../../azure-monitor/learn/quick-collect-azurevm.md) into your virtual machine to enable additional insights. In addition to being able to analyze IIS logs and Event Logs, you can perform additional analysis including configuration change tracking, SQL assessment, and update assessment.

## Enable Azure diagnostics in a virtual machine for event log and IIS log collection

Use the following procedure to enable Azure diagnostics in a virtual machine for Event Log and IIS log collection using the Microsoft Azure portal.

### To enable Azure diagnostics in a virtual machine with the Azure portal

1. Install the VM Agent when you create a virtual machine. If the virtual machine already exists, verify that the VM Agent is already installed.

   * In the Azure portal, navigate to the virtual machine, select **Optional Configuration**, then **Diagnostics** and set **Status** to **On**.

     Upon completion, the VM has the Azure Diagnostics extension installed and running. This extension is responsible for collecting your diagnostics data.
2. Enable monitoring and configure event logging on an existing VM. You can enable diagnostics at the VM level. To enable diagnostics and then configure event logging, perform the following steps:

   1. Select the VM.
   2. Click **Monitoring**.
   3. Click **Diagnostics**.
   4. Set the **Status** to **ON**.
   5. Select each diagnostics log that you want to collect.
   6. Click **OK**.

## Enable Azure diagnostics in a Web role for IIS log and event collection

Refer to [How To Enable Diagnostics in a Cloud Service](../../cloud-services/cloud-services-dotnet-diagnostics.md) for general steps on enabling Azure diagnostics. The instructions below use this information and customize it for use with Log Analytics.

With Azure diagnostics enabled:

* IIS logs are stored by default, with log data transferred at the scheduledTransferPeriod transfer interval.
* Windows Event Logs are not transferred by default.

### To enable diagnostics

To enable Windows Event Logs, or to change the scheduledTransferPeriod, configure Azure Diagnostics using the XML configuration file (diagnostics.wadcfg), as shown in [Step 4: Create your Diagnostics configuration file and install the extension](../../cloud-services/cloud-services-dotnet-diagnostics.md)

The following example configuration file collects IIS Logs and all Events from the Application and System logs:

```xml
    <?xml version="1.0" encoding="utf-8" ?>
    <DiagnosticMonitorConfiguration xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration"
          configurationChangePollInterval="PT1M"
          overallQuotaInMB="4096">

      <Directories bufferQuotaInMB="0"
         scheduledTransferPeriod="PT10M">  
        <!-- IISLogs are only relevant to Web roles -->
        <IISLogs container="wad-iis" directoryQuotaInMB="0" />
      </Directories>

      <WindowsEventLog bufferQuotaInMB="0"
         scheduledTransferLogLevelFilter="Verbose"
         scheduledTransferPeriod="PT10M">
        <DataSource name="Application!*" />
        <DataSource name="System!*" />
      </WindowsEventLog>

    </DiagnosticMonitorConfiguration>
```

Ensure that your ConfigurationSettings specifies a storage account, as in the following example:

```xml
    <ConfigurationSettings>
       <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<AccountName>;AccountKey=<AccountKey>"/>
    </ConfigurationSettings>
```

The **AccountName** and **AccountKey** values are found in the Azure portal in the storage account dashboard, under Manage Access Keys. The protocol for the connection string must be **https**.

Once the updated diagnostic configuration is applied to your cloud service and it is writing diagnostics to Azure Storage, then you are ready to configure the Log Analytics workspace.

## Use the Azure portal to collect logs from Azure Storage

You can use the Azure portal to configure a Log Analytics workspace in Azure Monitor to collect the logs for the following Azure services:

* Service Fabric clusters
* Virtual Machines
* Web/Worker Roles

In the Azure portal, navigate to your Log Analytics workspace and perform the following tasks:

1. Click *Storage accounts logs*
2. Click the *Add* task
3. Select the Storage account that contains the diagnostics logs
   * This account can be either a classic storage account or an Azure Resource Manager storage account
4. Select the Data Type you want to collect logs for
   * The choices are IIS Logs; Events; Syslog (Linux); ETW Logs; Service Fabric Events
5. The value for Source is automatically populated based on the data type and cannot be changed
6. Click OK to save the configuration

Repeat steps 2-6 for additional storage accounts and data types that you want to collect into the workspace.

In approximately 30 minutes, you are able to see data from the storage account in the Log Analytics workspace. You will only see data that is written to storage after the configuration is applied. The workspace does not read the pre-existing data from the storage account.

> [!NOTE]
> The portal does not validate that the Source exists in the storage account or if new data is being written.
>
>

## Enable Azure diagnostics in a virtual machine for event log and IIS log collection using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Use the steps in [Configuring Azure Monitor to index Azure diagnostics](powershell-workspace-configuration.md#configuring-log-analytics-workspace-to-collect-azure-diagnostics-from-storage) to use PowerShell to read from Azure diagnostics that are written to table storage.

Using Azure PowerShell you can more precisely specify the events that are written to Azure Storage.
For more information, see [Enabling Diagnostics in Azure Virtual Machines](/azure/vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines).

You can enable and update Azure diagnostics using the following PowerShell script.
You can also use this script with a custom logging configuration.
Modify the script to set the storage account, service name, and virtual machine name.
The script uses cmdlets for classic virtual machines.

Review the following script sample, copy it, modify it as needed, save the sample as a PowerShell script file, and then run the script.

```powershell
    #Connect to Azure
    Add-AzureAccount

    # settings to change:
    $wad_storage_account_name = "myStorageAccount"
    $service_name = "myService"
    $vm_name = "myVM"

    #Construct Azure Diagnostics public config and convert to config format

    # Collect just system error events:
    $wad_xml_config = "<WadCfg><DiagnosticMonitorConfiguration><WindowsEventLog scheduledTransferPeriod=""PT1M""><DataSource name=""System!* "" /></WindowsEventLog></DiagnosticMonitorConfiguration></WadCfg>"

    $wad_b64_config = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($wad_xml_config))
    $wad_public_config = [string]::Format("{{""xmlCfg"":""{0}""}}",$wad_b64_config)

    #Construct Azure diagnostics private config

    $wad_storage_account_key = (Get-AzStorageKey $wad_storage_account_name).Primary
    $wad_private_config = [string]::Format("{{""storageAccountName"":""{0}"",""storageAccountKey"":""{1}""}}",$wad_storage_account_name,$wad_storage_account_key)

    #Enable Diagnostics Extension for Virtual Machine

    $wad_extension_name = "IaaSDiagnostics"
    $wad_publisher = "Microsoft.Azure.Diagnostics"
    $wad_version = (Get-AzureVMAvailableExtension -Publisher $wad_publisher -ExtensionName $wad_extension_name).Version # Gets latest version of the extension

    (Get-AzureVM -ServiceName $service_name -Name $vm_name) | Set-AzureVMExtension -ExtensionName $wad_extension_name -Publisher $wad_publisher -PublicConfiguration $wad_public_config -PrivateConfiguration $wad_private_config -Version $wad_version | Update-AzureVM
```


## Next steps

* [Collect logs and metrics for Azure services](collect-azure-metrics-logs.md) for supported Azure services.
* [Enable Solutions](../../azure-monitor/insights/solutions.md) to provide insight into the data.
* [Use search queries](../../azure-monitor/log-query/log-query-overview.md) to analyze the data.