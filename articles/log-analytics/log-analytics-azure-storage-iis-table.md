<properties
	pageTitle="Using blob storage for IIS and table storage for events | Microsoft Azure"
	description="Log Analytics can read the logs for Azure services that write diagnostics to table storage or IIS logs written to blob storage."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/08/2016"
	ms.author="banders"/>


# Using blob storage for IIS and table storage for events

Log Analytics can read the logs for the following services that write diagnostics to table storage or IIS logs written to blob storage:

+ Service Fabric clusters (Preview)
+ Virtual Machines
+ Web/Worker Roles

Before Log Analytics can collect data for these resources, Azure diagnostics must be enabled.

Once diagnostics are enabled you can use the Azure portal or PowerShell configure Log Analytics to collect the logs.

Azure Diagnostics is an Azure extension that enables you to collect diagnostic data from a worker role, web role, or virtual machine running in Azure. The data is stored in an Azure storage account and can then be collected by Log Analytics.

For Log Analytics to collect these Azure Diagnostics logs, the logs must be in the following locations:

| Log Type | Resource Type | Location |
| -------- | ------------- | -------- |
| IIS logs | Virtual Machines <br> Web roles <br> Worker roles | wad-iis-logfiles (Blob Storage) |
| Syslog | Virtual Machines | LinuxsyslogVer2v0 (Table Storage) |
| Service Fabric Operational Events | Service Fabric nodes | WADServiceFabricSystemEventTable |
| Service Fabric Reliable Actor Events | Service Fabric nodes | WADServiceFabricReliableActorEventTable |
| Service Fabric Reliable Service Events | Service Fabric nodes | WADServiceFabricReliableServiceEventTable |
| Windows Event logs | Service Fabric nodes <br> Virtual Machines <br> Web roles <br> Worker roles | WADWindowsEventLogsTable (Table Storage) |
| Windows ETW logs | Service Fabric nodes <br> Virtual Machines <br> Web roles <br> Worker roles | WADETWEventTable (Table Storage) |

>[AZURE.NOTE] IIS logs from Azure Websites are not currently supported.

For virtual machines, you also have the option of installing the [Microsoft Monitoring Agent](http://go.microsoft.com/fwlink/?LinkId=517269) into your virtual machine to enable additional insights. In addition to being able to analyze IIS logs and Event Logs you will also allow be able to perform additional analysis including configuration change tracking, SQL assessment and update assessment.

## Enable Azure diagnostics in a virtual machine for event log and IIS log collection

Use the following procedure to enable Azure diagnostics in a virtual machine for Event Log and IIS log collection using the Microsoft Azure management portal.

### To enable Azure diagnostics in a virtual machine with the Azure management portal

1. Install the VM Agent when you create a virtual machine. If the virtual machine already exists, verify that the VM Agent is already installed.
	- In the Azure management portal, navigate to the virtual machine, select **Optional Configuration**, then **Diagnostics** and set **Status** to **On**.

	Upon completion, the VM will automatically have the Azure Diagnostics extension installed and running which will be responsible for collecting your diagnostics data.

2. Enable monitoring and configure event logging on an existing VM. You can enable diagnostics at the VM level. To enable diagnostics and then configure event logging, perform the following steps:
	1. Select the VM.
	2. Click **Monitoring**.
	3. Click **Diagnostics**.
	4. Set the **Status** to **ON**.
	5. Select each diagnostics log that you want to collect.
	7. Click **OK**.

Using Azure PowerShell you can more precisely specify the events that are written to Azure Storage. Refer to [Collect data using Azure diagnostics written to table storage or IIS Logs written to blob](log-analytics-azure-storage-json.md).


## Enable Azure diagnostics in a Web role for IIS log and event collection

Refer to [How To Enable Diagnostics in a Cloud Service](../cloud-services/cloud-services-dotnet-diagnostics.md). You’ll use the basic information from there and customize the steps here for use with Log Analytics.

With Azure diagnostics enabled:

- IIS logs are stored by default, with log data transferred at the scheduledTransferPeriod transfer interval.
- Windows Event Logs are not transferred by default.

### To enable diagnostics

To enable Windows Event Logs, or to change the scheduledTransferPeriod, configure Azure Diagnostics using the XML configuration file (diagnostics.wadcfg), as shown in [Step 4: Create your Diagnostics configuration file and install the extension](../cloud-services/cloud-services-dotnet-diagnostics.md)

The following example configuration file collects IIS Logs and all Events from the Application and System logs:

```
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

```
    <ConfigurationSettings>
       <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<AccountName>;AccountKey=<AccountKey>"/>
    </ConfigurationSettings>
```

The **AccountName** and **AccountKey** values are found in the Azure Management Portal in the storage account dashboard, under Manage Access Keys. The protocol for the connection string must be **https**.

Once the updated diagnostic configuration is applied to your cloud service and it is writing diagnostics to Azure Storage, then you are ready to configure Log Analytics.


## Use the Azure portal to collect logs from Azure Storage

You can use the Azure portal to configure Log Analytics to collect the logs for the following Azure services:

+ Service Fabric clusters
+ Virtual Machines
+ Web/Worker Roles

In the Azure portal, navigate to your Log Analytics workspace and perform the following tasks:

1. Click *Storage accounts logs*
2. Click the *Add* task
3. Select the Storage account that contains the diagnostics logs
  - This can be either a classic storage account or an Azure Resource Manager storage account
4. Select the Data Type you want to collect logs for
  - This will be one of IIS Logs; Events; Syslog (Linux); ETW Logs; Service Fabric Events
5. The value for Source will be automatically populated based on the data type and cannot be changed
6. Click OK to save the configuration

Repeat steps 2-6 for additional storage accounts and data types that you want Log Analytics to collect.

In approximately 30 minutes you will be able to see data from the storage account in Log Analytics. You will only see data that is written to storage after the configuration is applied. Log Analytics does not read the pre-existing data from the storage account.

>[AZURE.NOTE] The portal does not validate that the Source exists in the storage account or if new data is being written.

## Enable Azure diagnostics in a virtual machine for event log and IIS log collection using PowerShell

Using Azure PowerShell you can more precisely specify the events that are written to Azure Storage.
Refer to [Enabling Diagnostics in Azure Virtual Machines](../virtual-machines-dotnet-diagnostics.md) for more details.

You can enable and update the Agent using the following PowerShell script.
You can also use this script with a custom logging configuration.
You will need to modify the script to set the storage account, service name, and virtual machine name.
The script using cmdlets for classic virtual machines.

Review the following script sample, copy it, modify it as needed, save the sample as a PowerShell script file, and then run the script.

```
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

	$wad_storage_account_key = (Get-AzureStorageKey $wad_storage_account_name).Primary
	$wad_private_config = [string]::Format("{{""storageAccountName"":""{0}"",""storageAccountKey"":""{1}""}}",$wad_storage_account_name,$wad_storage_account_key)

	#Enable Diagnostics Extension for Virtual Machine

	$wad_extension_name = "IaaSDiagnostics"
	$wad_publisher = "Microsoft.Azure.Diagnostics"
	$wad_version = (Get-AzureVMAvailableExtension -Publisher $wad_publisher -ExtensionName $wad_extension_name).Version # Gets latest version of the extension

	(Get-AzureVM -ServiceName $service_name -Name $vm_name) | Set-AzureVMExtension -ExtensionName $wad_extension_name -Publisher $wad_publisher -PublicConfiguration $wad_public_config -PrivateConfiguration $wad_private_config -Version $wad_version | Update-AzureVM
```

## Next steps

- [Use JSON files in blob storage](log-analytics-azure-storage-json.md) to read the logs from Azure services that write diagnostics to blob storage in JSON format.
- [Enable Solutions](log-analytics-add-solutions.md) to provide insight into the data.
- [Use search queries](log-analytics-log-searches.md) to analyze the data.
