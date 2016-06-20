<properties
	pageTitle="Use Log Analytics to collect data from Azure Diagnostics  | Microsoft Azure"
	description="Azure resources can write logs and metrics to an Azure storage account, often by using Azure Diagnostics. Log Analytics can index this data and make it searchable."
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
	ms.date="06/10/2016"
	ms.author="banders"/>

# Use Log Analytics to collect data from Azure storage accounts

Many Azure resources are able to write logs and metrics to an Azure storage account. Log Analytics can consume this data and make it easier to monitor your Azure resources.

To write to Azure storage a resource may use Azure diagnostics, or have its own way to write data. This data may be written in various formats to one of the following locations:

+ Azure table
+ Azure blob
+ EventHub

Log Analytics supports Azure services that write data using Azure diagnostics to blob storage in JSON format. In addition, Log Analytics supports other services that output logs and metrics in different formats and locations.  

>[AZURE.NOTE] You'll be charged normal Azure data rates for storage and transactions when you send diagnostics to a storage account and for when Log Analytics reads the data from your storage account.

## Supported Azure Resources

Log Analytics can collect data for the following Azure resources:

| Resource Type | Logs (Diagnostic Categories) | Log Analytics Solution |
| --------------------------------------- | -------------------------------- | --------------- |
| Application Insights | Availability <br> Custom Events <br> Exceptions <br> Requests <br> | Application Insights (Preview) |
| API Management | | *none* (Preview) |
| Automation <br> Microsoft.Automation/AutomationAccounts | JobLogs <br> JobStreams          | AzureAutomation (Preview) | 
| Key Vault <br> Microsoft.KeyVault/Vaults               | AuditEvent                       | KeyVault (Preview) |
| Application Gateway <br> Microsoft.Network/ApplicationGateways   | ApplicationGatewayAccessLog <br> ApplicationGatewayPerformanceLog | AzureNetworking (Preview) |
| Network Security Group <br> Microsoft.Network/NetworkSecurityGroups | NetworkSecurityGroupEvent <br> NetworkSecurityGroupRuleCounter | AzureNetworking (Preview) |
| Service Fabric                          | ETWEvent <br> Operational Event <br> Reliable Actor Event <br> Reliable Service Event| ServiceFabric (Preview) |
| Virtual Machines | Linux Syslog <br> Windows Event <br> IIS Log <br> Windows ETWEvent | *none* |
| Web Roles <br> Worker Roles | Linux Syslog <br> Windows Event <br> IIS Log <br> Windows ETWEvent | *none* |

>[AZURE.NOTE] For monitoring Azure virtual machines (both Linux and Windows) we recommend installing the Microsoft Monitoring Agent VM extension. This will provide you with deeper insights on your virtual machines than if you use the diagnostics written to storage.

You can help us prioritize additional logs for OMS to analyze by voting on our [feedback page](http://feedback.azure.com/forums/267889-azure-log-analytics/category/88086-log-management-and-log-collection-policy).


## Application Insights (Preview)

This functionality is currently in private preview. To join the private preview contact your Microsoft Account team or refer to the details on the [feedback site](https://feedback.azure.com/forums/267889-log-analytics/suggestions/6519248-integration-with-app-insights).

## JSON files in blob storage

Log Analytics can read the logs for the following services that write diagnostics to blob storage in JSON format:

+ Automation (Preview)
+ Key Vault (Preview)
+ Application Gateway (Preview)
+ Network Security Group (Preview)

Before Log Analytics can collect data for these resources, Azure diagnostics must be enabled. You can use the  `Set-AzureRmDiagnosticSetting` cmdlet to enable logging.

The example below will enable logging on all supported resources

```
# update to be the storage account that logs will be written to. Storage account must be in the same region as the resource to monitor
# format is similar to "/subscriptions/ec11ca60-ab12-345e-678d-0ea07bbae25c/resourceGroups/Default-Storage-WestUS/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
$storageAccountId = ""

$supportedResourceTypes = ("Microsoft.Automation/AutomationAccounts", "Microsoft.KeyVault/Vaults", "Microsoft.Network/NetworkSecurityGroups", "Microsoft.Network/ApplicationGateways")

# update location to match your storage account location
$resources = (Get-AzureRmResource).Where({$_.ResourceType -in $supportedResourceTypes -and $_.Location -eq "westus"})

foreach ($resource in $resources) {
    Set-AzureRmDiagnosticSetting -ResourceId $resource.ResourceId -StorageAccountId $storageAccountId -Enabled $true -RetentionEnabled $true -RetentionInDays 1
}
```

Refer to the following articles for more information on how to enable diagnostic logging:

+ [Key Vault](../key-vault/key-vault-logging.md)
+ [Application Gateway](../application-gateway/application-gateway-diagnostics.md)
+ [Network Security Group](../virtual-network/virtual-network-nsg-manage-log.md)
 

### Configure Log Analytics to collect Azure Diagnostics written to blob in JSON format

Collecting logs for these services and enabling the solution to visualize the logs is performed using PowerShell scripts.

Refer to [Configure Azure Diagnostics Written to Blob in JSON](log-analytics-powershell-azure-diagnostics-json.md).

This documentation also includes details on:

+ Troublehshooting data collection
+ Stopping data collection

It is not currently possible to perform the above configuration from the portal. 

## Events in table storage or IIS Logs in blob 

Log Analytics can read the logs for the following services that write diagnostics to table storage or IIS Logs written to blob:

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

### Enable Azure diagnostics in a virtual machine for event log and IIS log collection

Use the following procedure to enable Azure diagnostics in a virtual machine for Event Log and IIS log collection using the Microsoft Azure management portal.

#### To enable Azure diagnostics in a virtual machine with the Azure management portal

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

Using Azure PowerShell you can more precisely specify the events that are written to Azure Storage. Refer to [Collect data using Azure diagnostics written to table storage or IIS Logs written to blob](log-analytics-powershell-azure-diagnostics-json.md).


### Enable Azure diagnostics in a Web role for IIS log and event collection

Refer to [How To Enable Diagnostics in a Cloud Service](../cloud-services/cloud-services-dotnet-diagnostics.md). You’ll use the basic information from there and customize the steps here for use with Log Analytics.

With Azure diagnostics enabled:

- IIS logs are stored by default, with log data transferred at the scheduledTransferPeriod transfer interval.
- Windows Event Logs are not transferred by default.

#### To enable diagnostics

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


### Use the Azure portal to collect logs from Azure Storage 

You can use the Azure portal to configure Log Analytics to collect the logs for the following Azure services:

+ Service Fabric clusters
+ Virtual Machines
+ Web/Worker Roles

In the Azure portal, navigate to your Log Analytics workspace and perform the following tasks:

1. Click *Storage accounts logs*
2. Click the *Add* task
3. Select the Storage account that contains the diagnostics logs
  - This can be either a classic storage account or an ARM storage account
4. Select the Data Type you want to collect logs for
  - This will be one of IIS Logs; Events; Syslog (Linux); ETW Logs; Service Fabric Events
5. The value for Source will be automatically populated based on the data type and cannot be changed
6. Click OK to save the configuration

Repeat steps 2-6 for additional storage accounts and data types that you want Log Analytics to collect.

In approximately 30 minutes you will be able to see data from the storage account in Log Analytics. You will only see data that is written to storage after the configuration is applied. Log Analytics does not read the pre-existing data from the storage account. 

>[AZURE.NOTE] The portal does not validate that the Source exists in the storage account or if new data is being written.

## Next steps

- [Enable Solutions](log-analytics-add-solutions.md) to provide insight into the data.
- [Use search queries](log-analytics-log-searches.md) to analyze the data.
