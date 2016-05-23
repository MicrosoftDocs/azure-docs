<properties
	pageTitle="Use PowerShell to collect data from Azure Diagnostics Using Log Analytics  | Microsoft Azure"
	description="Azure resources can write logs and metrics to an Azure storage account, often by using Azure Diagnostics. Log Analytics can index this data and make it searchable. Use PowerShell to configure Log Analytics to collect data from Azure diagnostics storage."
	services="log-analytics"
	documentationCenter=""
	authors="richrundmsft"
	manager="jochan"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="powershell"
	ms.topic="article"
	ms.date="05/23/2016"
	ms.author="richrund"/>

# Collect data from Azure Using Azure diagnostics and Log Analytics

Many Azure resources are able to write logs and metrics to an Azure storage account. Log Analytics can consume this data and make it 
easier to monitor your Azure resources.

Refer to [Collect data from Azure Using Azure diagnostics and Log Analytics](log-analytics-azure-storage.md) for more information on Azure diagnostics.

[How to install and configure Azure PowerShell](../powershell-install-configure.md)

This article describes how to use PowerShell to configure Log Analytics to read from the storage used by Azure diagnostics.

>[AZURE.NOTE] You'll be charged normal Azure data rates for storage and transactions when you send diagnostics to a storage account and for when Log Analytics reads the data from your storage account.

## Collect data using Azure diagnostics written to blob in JSON (Preview)

Log Analytics can read the logs for the following services write diagnostics to blob storage in JSON format:

+ Automation (Private Preview)
+ Key Vault (Preview)
+ Application Gateway (Private Preview)
+ Network Security Group (Preview)

Before Log Analytics can collect data for these resources, Azure diagnostics must be enabled. Refer to the following articles for how 
to enable diagnostic logging:

+ Automation (details coming)
+ [Key Vault](../key-vault/key-vault-logging.md)
+ [Application Gateway](../application-gateway/application-gateway-diagnostics.md)
+ [Network Security Group](../virtual-network/virtual-network-nsg-manage-log.md)
 
The following sections will walk you through how to:

+ Enable the Log Analytics solution for the Azure service 
+ Configure Log Analytics to collect the logs for each resource  

### Enabling Log Analytics to Collect Azure Diagnostics Written to Blob in JSON

We have provided two PowerShell scripts to assist with configuring Log Analytics: 

1. A script that will prompt you for input and is able to set up simple configurations 
2. A script with PowerShell functions that take the resources as input and then configures log collection.  

#### Pre-requisites

1. Azure PowerShell with version 1.0.8 or newer of the Operational Insights cmdlets.
  - Verify your version of cmdlets: `Import-Module AzureRM.OperationalInsights -MinimumVersion 1.0.8 `
2. You have configured diagnostic logging for the Azure resource
  - Automation (details coming)
  - [Key Vault](../key-vault/key-vault-logging.md)
  - [Application Gateway](../application-gateway/application-gateway-diagnostics.md)
  - [Network Security Group](../virtual-network/virtual-network-nsg-manage-log.md)
3. You have a [Log Analytics](https://portal.azure.com/#create/Microsoft.LogAnalyticsOMS) workspace  
4. Download the scripts from PowerShell gallery to a local folder e.g. c:\OMSScript 

#### Option 1: Run the Interactive Configuration Scripts

Open PowerShell and run: 

```
# Connect to Azure
Login-AzureRmAccount
# If you have diagnostics logs being written to classic storage you will also need to run 
Add-AzureAccount

# Run the UI configuration script
Add-AzureDiagnostiToOMS-UI.ps1

```

The script will display a list of available selections and provide prompt for you to make your selection. 
You’ll be asked to make selections for each of the following: 

+ Resources Type (Azure Service) to collect logs from 
+ Resource instances to collect logs from
+ Log Analytics workspace that will collect the data 

After this has been run you should see data collected in about 20 minutes, if not see the troubleshooting info below 

#### Option 2: Finding Resources and Configuring 

You’ll be using a script we’ve included which wraps the OMS Log Analytics cmdlets to make configuring resources easier. 
To get the syntax: 

`Get-Help .\Add-AzureDiagnosticsToOMS.ps1` 

To find more details on OMS [Log Analytics PowerShell Cmdlets](https://msdn.microsoft.com//library/mt188224.aspx) 

Here’s the steps: 

>[AZURE.NOTE] If resource and workspace are in different Azure Subscriptions, switch between them as needed using `Select-AzureRmSubscription -SubscriptionId <Subscription the resource is in>` 

```
$resourceName = "DougVaultName"
$workspaceName = "Doug-Workspace"

# Find the Resource to monitor, for example: 
$resource = Find-AzureRmResource -ResourceType "Microsoft.KeyVault/Vaults" -ResourceNameContains $partialResourceName

# Find the OMS Log Analytics workspace to configure, for example: 
$workspace = Find-AzureRmResource -ResourceType "Microsoft.OperationalInsights/workspaces" -ResourceNameContains $workspaceName 

# Perform configuration
Add-AzureDiagnosticsToOMS.ps1 $resource $workspace 

# Enable the OMS Solution (if needed – it is automatically added when using the interactive script)
Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName $workspace.ResourceGroupName -WorkspaceName $workspace.Name -intelligencepackname KeyVault -Enabled $true 

```
After this has been run you should see data collected in about 20 minutes, if not see troubleshooting info below. 

>[AZURE.NOTE] You will not be able to see the configuration in the Azure portal. You can verify configuration using the `Get-AzureRmOperationalInsightsStorageInsight` cmdlet.  


### Stopping Log Analytics from Collecting Azure Diagnostics Written to Blob in JSON

If you need to delete the OMS configuration for a resource use the cmdlet `Remove-AzureRmOperationalInsightsStorageInsight`

### Troubleshooting Configuration for Azure Diagnostics Written to Blob in JSON

*Issue*
When configuring for a resource that is logging to Classic storage I get an exception saying subscription not found: 

```
Select-AzureSubscription : The subscription id 7691b0d1-e786-4757-857c-7360e61896c3 doesn't exist. 

Parameter name: id 
```

*Resolution*
Add your login account with the cmdlet: `Add-AzureAccount`

*Issue*
When running the scripts, I am getting an error of ‘\<Script Name\>’ is not digitally signed. 
You cannot run this script on the current system. 

*Resolution*
To enable running the script on your machine, right click on the file in a file explorer and choose the file properties. 
On the properties screen, please check the “unblock” button in the file security section to enable the file to run on your machine, click apply and try running it again from the PowerShell. 


### Troubleshooting Data Collection for Azure Diagnostics Written to Blob in JSON

If you are not seeing data collected to OMS for your diagnostic log, here are the high level troubleshooting steps: 

+ Verify data flowing to the storage account 
+ Verify the Log Analytics solution for the service is enabled
+ Verify that Log Analytics is configured to read from storage
+ Update the storage account key

#### Verify data is flowing to the storage account

You can check this with the Azure Storage Explorer of your choice or with PowerShell. 

To find the Storage Account the resource is configured to log to, you can use a command such as: 

`Find-AzureRmResource -ResourceType "Microsoft.KeyVault/Vaults" | select ResourceId | Get-AzureRmDiagnosticSetting `

The storage container Azure Diagnostics logs to has a name with a format of:  

insights-logs-<Category> 

Refer to [Using storage cmdlets to check a container for recent data](../storage/storage-powershell-guide-full.md) for more details.

#### Verify the Log Analytics solution for the service is enabled 

The needed Log Analytics solution is enabled for you if you configure Log Analytics for the resources using `Add-AzureDiagnostiToOMS-UI.ps1 `

To check the solution is enabled, go to Settings in the Log Analytics Portal, on the Solutions tab you can see which solutions are enabled. 

If the Log Analytics solution is in Private Preview then you need to enable with the PowerShell cmdlet `Set-AzureRmOperationalInsightsIntelligencePack `

See the name of the Solution to enable in table at the top of the document listing the supported resource / log types. 

For example: 

`Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName <Workspace Resource Group> -WorkspaceName <Workspace Name> -intelligencepackname KeyVault -Enabled $true `

#### Verify that Log Analytics is configured to read from storage 

If you add additional Azure Resources, you need to enable Diagnostics logging for them, as well as configure OMS for them. 
To check which resources OMS has configured you can use the cmdlet `Get-AzureRmOperationalInsightsStorageInsight` 

For example: 

```
# Find the Workspace ResourceGroup and Name (if you don’t know) 
Get-AzureRmOperationalInsightsWorkspace

#Get the configuration for all resources: 
Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName oi-default-east-us -WorkspaceName Doug-TryAzure

#Get the just the resources configured: 
Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName oi-default-east-us -WorkspaceName Doug-TryAzure | select Containers
```

#### Update the Storage Key 

If you change the key for the storage account the Log Analytics configuration will also need to be updated with the new key. 
You can update the Log Analytics configuration with a new key using the `Set-AzureRmOperationalInsightsStorageInsight` cmdlet.

For example:  

`Set-AzureRmOperationalInsightsStorageInsight –ResourceGroupName <Resource Group Name> –WorkspaceName <Resource Name> –Name <Storage Insight Name> -StorageAccountKey $newKey `

To find the Storage Insight Name, use the `Get-AzureRmOperationalInsightsStorageInsight` cmdlet.

## Collect data using Azure diagnostics written to table storage or IIS Logs written to blob 

Log Analytics can read the logs for the following services that write diagnostics to table storage or IIS Logs written to blob:

+ Service Fabric clusters
+ Virtual Machines
+ Web/Worker Roles

Before Log Analytics can collect data for these resources, Azure diagnostics must be enabled. 

For virtual machines, we recommend using the [Log Analytics VM extension for Azure VMs](log-analytics-windows-agents.md) to gain additional insights.
 
In addition to being able to analyze IIS logs and Event Logs you will also allow be able to perform additional analysis 
including configuration change tracking, SQL assessment and update assessment.

### Enable Azure diagnostics in a virtual machine for event log and IIS log collection using PowerShell

Using Azure PowerShell you can more precisely specify the events that are written to Azure Storage. 
Refer to [Enabling Diagnostics in Azure Virtual Machines](virtual-machines-dotnet-diagnostics.md) for more details.

You can enable and update the Agent using the following PowerShell script. 
You can also use this script with custom logging configuration. 
You will need to modify the script to set the storage account, service name and virtual machine name.

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

- [Enable Solutions](log-analytics-add-solutions.md) to provide insight into the data.
- [Use search queries](log-analytics-log-searches.md) to analyze the data.
