<properties
	pageTitle="Collect data from Azure Diagnostics Using Log Analytics  | Microsoft Azure"
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
	ms.date="04/28/2016"
	ms.author="banders"/>

# Collect data from Azure Using Log Analytics

Many Azure resources are able to write logs and metrics to an Azure storage account or EventHub. Log Analytics can consume this data and make it easier to monitor your Azure resources.

To write to Azure storage a resource may use Azure diagnostics, or have its own way to write data. This data may be written in various formats to one of the following locations:

+ Azure table
+ Azure blob
+ EventHub

Log Analytics is building support for Azure services that write data using Azure diagnostics to blob storage in JSON format. In addition, Log Analytics supports several other services that output logs and metrics in different formats and locations.  

## Supported Azure Resources

Log Analytics can read the logs / metrics for the following resources:

| Resource Type | Logs (Diagnostic Categories) | Log Analytics Solution |
| --------------------------------------- | -------------------------------- | --------------- |
| Application Insights | Availability <br> Custome Events <br> Exceptions <br> Requests <br> | Application Insights (Preview) |
| API Management | | *none* (Preview) |
| Automation <br> Microsoft.Automation/AutomationAccounts | JobLogs <br> JobStreams          | AzureAutomation (Preview) | 
| Key Vault <br> Microsoft.KeyVault/Vaults               | AuditEvent                       | KeyVault (Preview       |
| Application Gateway <br> Microsoft.Network/ApplicationGateways   | ApplicationGatewayAccessLog <br> ApplicationGatewayPerformanceLog | AzureNetworking (Preview) |
| Network Security Group <br> Microsoft.Network/NetworkSecurityGroups | NetworkSecurityGroupEvent <br> NetworkSecurityGroupRuleCounter | AzureNetworking (Preview) |
| Service Fabric                          | ETWEvent <br> Operational Event <br> ReliableActor Event <br> Reliable Service Event| ServiceFabric (Preview) |
| Virtual Machines | Linux Syslog <br> Windows Event <br> IIS Log <br> Windows ETWEvent | *none* |
| Web Roles <br> Worker Roles | Linux Syslog <br> Windows Event <br> IIS Log <br> Windows ETWEvent | *none* |

>[AZURE.NOTE] For monitoring Azure virtual machines (both Linux and Windows) we recommend installing the Microsoft Monitoring Agent VM extension. This will provide you with deeper insights on your virtual machines than if you use the diagnostics written to storage.

## Collect data using Azure diagnostics written to blob in JSON

Log Analytics can read the logs for the following services write diagnostics to blob storage in JSON format:

+ Automation
+ Key Vault
+ Application Gateway
+ Network Security Group

Before Log Analytics can collect data for these resources, Azure diagnostics must be enabled. Refer to the following articles for how to enable diagnostic logging:

+ Automation
+ [Key Vault](../key-vault/key-vault-logging.md)
+ [Application Gateway](../application-gateway/application-gateway-diagnostics.md)
+ [Network Security Group](../virtual-network/virtual-network-nsg-manage-log.md)
 
>[AZURE.NOTE] For the resource you want Log Analytics to collect logs, you will need to enable each log Category in Azure diagnostics. I.e. For Automation you need to collect both JobLogs and JobStreams; For Network Security Groups you need to collect both NetworkSecurityGroupEvent and NetworkSecurityGroupRuleCounter. If you only enable diagnostics for one of these Categories, then the data for the selected category will not be collected.   

+ Each resource needs to have diagnostics logging enabled / configured to a storage account 
+ Log Analytcis solution for the resource is enabled 
+ Log Analytics is configured to collect the log for each resource  

### Enabling Log Analytics to Collect Azure Diagnostics Written to Blob in JSON

We’ve provided two PowerShell script based options 

* One is a simple script based interactive UI for configuring basic topologies 

* Other is to use PowerShell to find the resources to monitor yourself, and pass them to the script.  

UI to configure is coming soon as well

#### Pre-requisites

1. Azure PowerShell 1.0.8 or newer is installed.  If needed, install from: http://aka.ms/webpi-azps  

To verify you have this, run: 

Import-Module AzureRM.Insights -MinimumVersion 1.0.8 

2. You have configured diagnostic logging for the azure resource, for example: https://azure.microsoft.com/en-us/documentation/articles/key-vault-logging/ https://azure.microsoft.com/en-us/documentation/articles/application-gateway-diagnostics/  https://azure.microsoft.com/en-us/documentation/articles/virtual-network-nsg-manage-log/ 

3. Your OMS Log Analytics workspace is created 

If you don’t have an OMS workspace, create for free from the Azure Portal: https://portal.azure.com/#create/Microsoft.LogAnalyticsOMS 

4. Unzip the helper scripts from Add-AzureDiagnosticsToOMS.zip and copy to a local folder e.g. c:\OMSScript 

#### Option 1: Run the Interactive Configuration Scripts

Open PowerShell and run: 

`PS E:\OMSScript>Login-AzureRmAccount`

If you have diagnostics logs being written to classic storage you will also need to run 

`PS E:\OMSScript>Add-AzureAccount`

Run the configuration script: 

`PS E:\OMSScript>.\Add-AzureDiagnostiToOMS-UI.ps1` 

You’ll be given a choice of options and asked the following: 

+ Resources Type to configure for 
+ Resources to configure for 
+ OMS workspace to configure for 

After this has been run you should see data collected in about 30 minutes, if not see troubleshooting info below 

#### Option 2: Finding Resources and Configuring 

You’ll be using a script we’ve included which wraps the OMS Log Analytics cmdLets to make configuring resources easier. To get the syntax: 

`PS E:\OMSScript> Get-Help .\Add-AzureDiagnosticsToOMS.ps1` 

To find more details on OMS [Log Analytics PowerShell Cmdlets](https://msdn.microsoft.com//library/mt188224.aspx) 

Here’s the steps: 

>[AZURE.NOTE] If resource and workspace are in different Azure Subscriptions, switch between them as needed using `Select-AzureRmSubscription -SubscriptionId <Subscription the resource is in>` 

1) Find the Resource to monitor, for example: 

`PS E:\OMSScript> $resource = Find-AzureRmResource -ResourceType "Microsoft.KeyVault/Vaults" -ResourceNameContains DougVaultName`

2) Find the OMS Log Analytics workspace to configure, for example: 

`PS E:\OMSScript> $workspace = Find-AzureRmResource -ResourceType "Microsoft.OperationalInsights/workspaces" -ResourceNameContains` Doug-Workspace 

3) Run Add-AzureDiagnosticsToOMS.ps1 

`PS E:\OMSScript> .\Add-AzureDiagnosticsToOMS.ps1 $resource $workspace `

4) Enable the OMS Solution (if needed – it is automatically added when using the interactive script) If the OMS Solution is in Private Preview then you need to enable with the PowerShell CmdLet Set-AzureRmOperationalInsightsIntelligencePack 

See the name of the Solution to enable in table at the top of the document listing the supported resource / log types. 

An example: 

`PS E:\OMSScript> Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName $workspace. ResourceGroupName -WorkspaceName $workspace.Name -intelligencepackname KeyVault -Enabled $true `

After this has been run you should see data collected in about 30 minutes, if not see troubleshooting info in the Appendix 

Notes:  

>[AZURE.NOTE] You will not be able to see the configuration in the Azure portal. You can verify configuration using the `Get-AzureRmOperationalInsightsStorageInsight` cmdlet.  


### Stopping Log Analytics from Collecting Azure Diagnostics Written to Blob in JSON

If you need to delete the OMS configuration for a resource use the cmdlet `Remove-AzureRmOperationalInsightsStorageInsight`

### Troubleshooting Configuration for Azure Diagnostics Written to Blob in JSON

Issue: 

When configuring for a resource that is logging to Classic storage I get an exception saying subscription not found: 

```
Select-AzureSubscription : The subscription id 7691b0d1-e786-4757-857c-7360e61896c3 doesn't exist. 

Parameter name: id 
```

Resolution: 

Add your login account with the CmdLet: `Add-AzureAccount`

Issue: 

When running the scripts, I am getting an error of ‘<Script Name>’ is not digitally signed. You cannot run this script on the current system. 

Resolution: 

To enable running the script on your machine, right click on the file in a file explorer and choose the file properties. On the properties screen, please check the “unblock” button in the file security section to enable the file to run on your machine, click apply and try running it again from the PowerShell. 


### Troubleshooting Data Collection for Azure Diagnostics Written to Blob in JSON

If you are not seeing data collected to OMS for your diagnostic log, here are the high level troubleshooting steps: 

+ Is Data flowing to the Storage Account? 
+ Is the OMS solution enabled? 
+ Is OMS configured for every resource? 

#### Is Data flowing to the Storage Account? 

You can check this with the Azure Storage Explorer of your choice or with PowerShell. 

To find the Storage Account the resource is configured to log to, you can use a command such as: 

`PS E:\> Find-AzureRmResource -ResourceType "Microsoft.KeyVault/Vaults" | select ResourceId | Get-AzureRmDiagnosticSetting `

The storage container Azure Diagnostics logs to has a name with a format of:  

insights-logs-<Category> 

For details on using the Storage CmdLets to check the container for recent data see: https://azure.microsoft.com/documentation/articles/storage-powershell-guide-full/ 

Is the OMS solution enabled? 

The needed OMS solution is enabled for you if you configure OMS for the resources using `Add-AzureDiagnostiToOMS-UI.ps1 `

To check the solution is enabled, go to Settings in the OMS Portal, on the Solutions tab you can see which solutions are enabled. 

 If the OMS Solution is in Private Preview then you need to enable with the PowerShell CmdLet `Set-AzureRmOperationalInsightsIntelligencePack `

See the name of the Solution to enable in table at the top of the document listing the supported resource / log types. 

For example: 

`PS E:\OMSScript> Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName <Workspace Resource Group> -WorkspaceName <Workspace Name> -intelligencepackname KeyVault -Enabled $true `

 

Is OMS configured for every resource? 

If you add additional Azure Resources, you need to enable Diagnostics logging for them, as well as configure OMS for them. To check which resources OMS has configured you can use the CmdLet Get-AzureRmOperationalInsightsStorageInsight 

For example: 

Find the Workspace ResourceGroup and Name (if you don’t know) 

`PS C:\ > Get-AzureRmOperationalInsightsWorkspace `

Get the configuration for all resources: 

`PS C:\ > Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName oi-default-east-us -WorkspaceName Doug-TryAzure `

Get the just the resources configured: 

`PS C:\ > Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName oi-default-east-us -WorkspaceName Doug-TryAzure | select Containers `

Updating the Storage Key 

If you change the key for the storage account, you will need to update OMS to have the new key using `Set-AzureRmOperationalInsightsStorageInsight` cmdlet. 

For example:  

`PS C:\> Set-AzureRmOperationalInsightsStorageInsight –ResourceGroupName <Resource Group Name> –WorkspaceName <Resource Name> –Name <Storage Insight Name> -StorageAccountKey foo `

To find the Storage Insight Name, use the CmdLet `Get-AzureRmOperationalInsightsStorageInsight `

## Collect data using Azure diagnostics written to table storage or IIS Logs written to blob 

Log Analytics can read the logs for the following services that write diagnostics to table storage or IIS Logs written to blob :

+ 

Before Log Analytics can collect data for these resources, Azure diagnostics must be enabled. Refer to the following articles for how to enable diagnostic logging:


OMS can analyze data written to Azure storage by Azure diagnostics. There are 2 main steps to perform:

- Configure the collection of diagnostic data to Azure storage
- Configure OMS to analyze data in the storage account

The topics below describe how to enable collection of diagnostics data to Azure storage and then how to configure OMS to analyze the data in Azure storage.

Azure Diagnostics is an Azure extension that enables you to collect diagnostic data from a worker role, web role, or virtual machine running in Azure. The data is stored in an Azure storage account and can then be used by OMS.

>[AZURE.NOTE] If you have a paid subscription, you'll be charged normal data rates for storage and transactions when you send diagnostics to a storage account and for when OMS reads the data from your storage account.

Azure Diagnostics can collect the following types of telemetry:

Data Source|Description
 ---|---
IIS Logs|Information about IIS web sites.
Azure Diagnostic infrastructure logs|Information about Diagnostics itself.
IIS Failed Request logs |Information about failed requests to an IIS site or application.
Windows Event logs|Information sent to the Windows event logging system.
Performance counters|Operating System and custom performance counters.
Crash dumps|Information about the state of the process in the event of an application crash.
Custom error logs|Logs created by your application or service.
NET EventSource|Events generated by your code using the .NET [EventSource class](https://msdn.microsoft.com/library/system.diagnostics.tracing.eventsource%28v=vs.110%29.aspx)
Manifest based ETW|ETW events generated by any process
Syslog|Events sent to the Syslog or Rsyslog daemons


Currently, OMS is able to analyze:

- IIS logs from Web roles and virtual machines
- Windows Event logs and ETW logs from Web roles, Worker roles and Azure virtual machines running a Windows operating system
- Syslog from Azure virtual machines running a Linux operating system
- Diagnostics written to blob storage in json format for Network Security Group, Application Gateway, and KeyVault resources

The logs must be in the following locations:

- WADWindowsEventLogsTable (Table Storage) – Contains information from Windows Event logs.
- WADETWEventTable (Table Storage) – Contains information from Windows ETW logs.
- WADServiceFabricSystemEventTable, WADServiceFabricReliableActorEventTable, WADServiceFabricReliableServiceEventTable (Table Storage) - Contains information on Service Fabric Operational, Actor and Service events.
- wad-iis-logfiles (Blob Storage) – Contains information about IIS logs.
- LinuxsyslogVer2v0 (Table Storage) – Contains Linux syslog events.

    >[AZURE.NOTE] IIS logs from Azure Websites are not currently supported.

For virtual machines, you also have the option of installing the [Microsoft Monitoring Agent](http://go.microsoft.com/fwlink/?LinkId=517269) into your virtual machine to enable additional insights. In addition to being able to analyze IIS logs and Event Logs you will also allow be able to perform additional analysis including configuration change tracking, SQL assessment and update assessment.

You can help us prioritize additional logs for OMS to analyze by voting on our [feedback page](http://feedback.azure.com/forums/267889-azure-log-analytics/category/88086-log-management-and-log-collection-policy).

## Enable Azure diagnostics in a Web role for IIS log and event collection

Refer to [How To Enable Diagnostics in a Cloud Service](https://msdn.microsoft.com/library/azure/dn482131.aspx). You’ll use the basic information from there and customize the steps here for use with OMS.

With Azure diagnostics enabled:

- IIS logs are stored by default, with log data transferred at the scheduledTransferPeriod transfer interval.

- Windows Event Logs are not transferred by default.

### To enable diagnostics

To enable Windows Event Logs, or to change the scheduledTransferPeriod, configure Azure Diagnostics using the XML configuration file (diagnostics.wadcfg), as shown in [Step 2: Add the diagnostics.wadcfg file to your Visual Studio solution](https://msdn.microsoft.com/library/azure/dn482131.aspx#BKMK_step2) and [Step 3: Configure diagnostics for your application](https://msdn.microsoft.com/library/azure/dn482131.aspx#BKMK_step3) in the How To Enable Diagnostics in a Cloud Service topic. The following example configuration file collects IIS Logs and all Events from the Application and System logs:

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

In [Step 4: Configure storage of your diagnostics data](https://msdn.microsoft.com/library/azure/dn482131.aspx#BKMK_step4) of the How To Enable Diagnostics in a Cloud Service topic, ensure that your ConfigurationSettings specifies a storage account, as in the following example:

```
    <ConfigurationSettings>
       <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<AccountName>;AccountKey=<AccountKey>"/>
    </ConfigurationSettings>
```

The **AccountName** and **AccountKey** values are found in the Microsoft Azure Management Portal in the storage account dashboard, under Manage Access Keys. The protocol for the connection string must be **https**.

Once the updated diagnostic configuration is applied to your cloud service and it is writing diagnostics to Azure Storage, then you are ready to configure OMS.

## Enable Azure diagnostics in a virtual machine for event log and IIS log collection

Use the following procedure to enable Azure diagnostics in a virtual machine for Event Log and IIS log collection using the Microsoft Azure management portal.

### To enable Azure diagnostics in a virtual machine with the Azure management portal

1. Install the VM Agent when you create a virtual machine. If the virtual machine already exists, verify that the VM Agent is already installed.
	- If you use the default Azure management portal to create the virtual machine, perform a **Custom Create** and select **Install the VM Agent**.
	- If you use the new Azure management portal to create a virtual machine, select **Optional Configuration**, then **Diagnostics** and set **Status** to **On**.

	Upon completion, the VM will automatically have the Azure Diagnostics extension installed and running which will be responsible for collecting your diagnostics data.

2. Enable monitoring and configure event logging on an existing VM. You can enable diagnostics at the VM level. To enable diagnostics and then configure event logging, perform the following steps:
	1. Select the VM.
	2. Click **Monitoring**.
	3. Click **Diagnostics**.
	4. Set the **Status** to **ON**.
	5. Select each diagnostics metric that you want to use. OMS can analyze Windows event system logs, Windows event application logs and IIS logs.
	7. Click **OK**.

Using Azure PowerShell you can more precisely specify the events that are written to Azure Storage. Refer to the Azure Diagnostics 1.2 Configuration Schema for a sample configuration file and detailed documentation on its schema. Ensure that you install and configure Azure PowerShell version 0.8.7 or later from [How to install and configure Azure PowerShell](../powershell-install-configure.md). If you have a version of Microsoft Azure Diagnostics installed that is earlier than version 1.2 you cannot use the new portal to enable or configure diagnostics.

You can enable and update the Agent using the following PowerShell script. You can also use this script with custom logging configuration. You will need to modify the script to set the storage account, service name and virtual machine name.

### To enable diagnostics in a virtual machine with Azure PowerShell

Review the following script sample, copy it, modify it as needed, save the sample as a PowerShell script file, and then run the script.


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


## Enable Azure Storage analysis by OMS

You can enable storage analysis and configure OMS to read from the Azure Storage account with Azure Diagnostics by using the information at [Data sources in Log Analytics](log-analytics-data-sources.md#collect-data-from-azure-diagnostics).

In approximately 1 hour you will begin to see data from the storage account available for analysis within OMS.


## Next steps

- [Configure proxy and firewall settings in Log Analytics](log-analytics-proxy-firewall.md) if your organization uses a proxy server or firewall so that agents can communicate with the Log Analytics service.
