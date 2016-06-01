<properties
	pageTitle="Use PowerShell to configure Log Analytics to collect data from Azure Diagnostics storage | Microsoft Azure"
	description="Azure resources can write logs and metrics to an Azure storage account using Azure Diagnostics. Log Analytics can collect this data and make it easily searchable. Use PowerShell to configure Log Analytics to collect data from Azure diagnostics storage."
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
	ms.date="05/31/2016"
	ms.author="richrund"/>

# Configure Log Analytics to collect data from Azure Diagnostics storage

Many Azure resources use Azure diagnostics to write logs and metrics to an Azure storage account. Log Analytics can collect this data and make it easily searchable, allowing you to better monitor your Azure resources. 

This article describes how to use PowerShell to configure Log Analytics to collect data from Azure diagnostics storage.

Refer to [Use Log Analytics to collect data from Azure storage accounts](log-analytics-azure-storage.md) for more information on using Log Analytics with Azure diagnostics.

>[AZURE.NOTE] You'll be charged normal Azure data rates for storage and transactions when you send diagnostics to a storage account and for when Log Analytics reads the data from your storage account.

## Collect JSON logs from Azure blob storage (Preview)

Log Analytics can read the JSON logs written to blob storage for the following services:

+ Automation (Preview)
+ Key Vault (Preview)
+ Application Gateway (Preview)
+ Network Security Group (Preview)

The following sections will walk you through using PowerShell to:

+ Configure Log Analytics to collect the logs from storage for each resource  
+ Enable the Log Analytics solution for the Azure service 

### Configure Log Analytics to collect JSON logs from Azure blob storage

We have provided a PowerShell script module that exports two cmdlets to assist with configuring Log Analytics: 

1. `Add-AzureDiagnosticsToLogAnalyticsUI` will prompt you for input and is able to set up simple configurations 
2. `Add-AzureDiagnosticsToLogAnalytics` takes the resources to monitor as input and then configures Log Analytics  

#### Pre-requisites

1. Azure PowerShell with version 1.0.8 or newer of the Operational Insights cmdlets.
  - [How to install and configure Azure PowerShell](../powershell-install-configure.md)
  - Verify your version of cmdlets: `Import-Module AzureRM.OperationalInsights -MinimumVersion 1.0.8 `
2. Diagnostic logging is configured for the Azure resource you want to monitor. Refer to the following articles for configuring diagnostics:
  - Automation (details coming)
  - [Key Vault](../key-vault/key-vault-logging.md)
  - [Application Gateway](../application-gateway/application-gateway-diagnostics.md)
  - [Network Security Group](../virtual-network/virtual-network-nsg-manage-log.md)
3. A [Log Analytics](https://portal.azure.com/#create/Microsoft.LogAnalyticsOMS) workspace  
4. The Add-AzureDiagnosticsToLogAnalytics PowerShell module
  - Download the module from PowerShell gallery 

#### Option 1: Run the Interactive Configuration Scripts

Open PowerShell and run: 

```
# Connect to Azure
Login-AzureRmAccount
# If you have diagnostics logs being written to classic storage you will also need to run 
Add-AzureAccount

# Import the module
Import-Module ./Add-AzureDiagnosticsToLogAnalytics.psm1

# Run the UI configuration script
Add-AzureDiagnosticsToLogAnalyticsUI

```

You are shown a list of available selections and given a prompt to make your selection. 
You’ll be asked to make selections for each of the following: 

+ Resource types (Azure Services) to collect logs from 
+ Resource instances to collect logs from
+ Log Analytics workspace that will collect the data 

After running this script you should see records in Log Analytics about 30 minutes after new diagnostic data is written to storage. If records are not available after this time refer to the troubleshooting section below. 

#### Option 2: Build a list of resources and pass them to the configuration cmdlet 

You will build a list of resources that have Azure diagnostics enabled and then pass the resources to the configuration cmdlet.

You can see additional information about the cmdlet by running the following PowerShell: 

`Get-Help Add-AzureDiagnosticsToLogAnalytics` 

To find more details on OMS [Log Analytics PowerShell Cmdlets](https://msdn.microsoft.com//library/mt188224.aspx) 

>[AZURE.NOTE] If resource and workspace are in different Azure Subscriptions, switch between them as needed using `Select-AzureRmSubscription -SubscriptionId <Subscription the resource is in>` 

```
# Connect to Azure
Login-AzureRmAccount
# If you have diagnostics logs being written to classic storage you will also need to run 
Add-AzureAccount

# Import the module
Import-Module Add-AzureDiagnosticsToLogAnalytics.psm1

# Update the values below with the name of the resource that has Azure diagnostics enabled and the name of your Log Analytics workspace
$resourceName = "***example-resource***"
$workspaceName = "***log-analytics-workspace***"

# Find the resource to monitor: 
$resource = Find-AzureRmResource -ResourceType "Microsoft.KeyVault/Vaults" -ResourceNameContains $resourceName

# Find the Log Analytics workspace to configure, for example: 
$workspace = Find-AzureRmResource -ResourceType "Microsoft.OperationalInsights/workspaces" -ResourceNameContains $workspaceName 

# Perform configuration
Add-AzureDiagnosticsToLogAnalytics $resource $workspace 

# Enable the Log Analytics solution
Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName $workspace.ResourceGroupName -WorkspaceName $workspace.Name -intelligencepackname KeyVault -Enabled $true 

```
After running this script you should see records in Log Analytics about 30 minutes after new diagnostic data is written to storage. If records are not available after this time refer to the troubleshooting section below.  

>[AZURE.NOTE] You will not be able to see the configuration in the Azure portal. You can verify configuration using the `Get-AzureRmOperationalInsightsStorageInsight` cmdlet.  


### Stopping Log Analytics from collecting Azure Diagnostics written to blob in JSON

If you need to delete the Log Analytics configuration for a resource use the cmdlet `Remove-AzureRmOperationalInsightsStorageInsight`

### Troubleshooting configuration for Azure Diagnostics written to blob in JSON

*Issue*

When configuring a resource that is logging to classic storage you get an exception saying "subscription not found": e.g.

```
Select-AzureSubscription : The subscription id 7691b0d1-e786-4757-857c-7360e61896c3 doesn't exist. 

Parameter name: id 
```

*Resolution*

Login to the service management API with `Add-AzureAccount`

*Issue*

When attempting to import the module, you get an error of ‘\<Script Name\>’ is not digitally signed. 
You cannot run this script on the current system. 

*Resolution*

To enable importing the module on your machine, right click on the file in a file explorer and choose *properties*. 
On the properties screen, check the *unblock* button in the file security section to enable the file to run on your machine, click *apply* and try importing it again . 


### Troubleshooting data collection for Azure Diagnostics written to blob in JSON

If you are not seeing data for your Azure resource in Log Analytics you can use the following troubleshooting steps: 

+ Verify data flowing to the storage account 
+ Verify the Log Analytics solution for the service is enabled
+ Verify that Log Analytics is configured to read from storage
+ Update the storage account key

#### Verify data is flowing to the storage account

You can check this with a tool that allows browsing Azure storage (e.g. Visual Studio) or by using PowerShell. 

To find the Storage Account the resource is configured to log to use the following PowerShell: 

`Find-AzureRmResource -ResourceType "Microsoft.KeyVault/Vaults" | select ResourceId | Get-AzureRmDiagnosticSetting `

The storage container used by Azure Diagnostics has a name with a format of:  

`insights-logs-<Category>` 

Refer to [Using storage cmdlets to check a container for recent data](../storage/storage-powershell-guide-full.md) for more details on viewing the contents of the storage account.

#### Verify the Log Analytics solution for the service is enabled 

If you use `Add-AzureDiagnostiToLogAnalytics-UI` the correct Log Analytics solution is automatically enabled for you.

To check if a solution is enabled, run the following PowerShell:

`Get-AzureRmOperationalInsightsIntelligencePacks -ResourceGroupName $logAnalyticsResourceGroup -WorkspaceName $logAnalyticsWorkspaceName`

If the solution is not enabled, you can enable it using the following PowerShell:

`Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName $logAnalyticsResourceGroup -WorkspaceName $logAnalyticsWorkspaceName -IntelligencePackName $solution -Enabled $true`

To find the name of the solution to enable for each resource type, use the following PowerShell (this variable is available once you have imported the module):

`$MonitorableResourcesToOMSSolutions`

#### Verify that Log Analytics is configured to read from storage 

If you add additional Azure Resources, you need to enable Diagnostics logging for them, as well as configure Log Analytics for them. 
To check which resources and storage accounts Log Analytics is configured you collect logs for, use the following PowerShell:

```
# Find the Workspace ResourceGroup and Name 
$logAnalyticsWorkspace = Get-AzureRmOperationalInsightsWorkspace

#Get the configuration for all resources: 
Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName $logAnalyticsWorkspace.ResourceGroupName -WorkspaceName $logAnalyticsWorkspace.Name

#Get the just the resources configured: 
Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName $logAnalyticsWorkspace.ResourceGroupName -WorkspaceName $logAnalyticsWorkspace.Name | select Containers
```

#### Update the Storage Key 

If you change the key for the storage account the Log Analytics configuration will also need to be updated with the new key. 
You can update the Log Analytics configuration with a new key using the following PowerShell:

`Set-AzureRmOperationalInsightsStorageInsight -ResourceGroupName $logAnalyticsWorkspace.ResourceGroupName -WorkspaceName $logAnalyticsWorkspace.Name –Name <Storage Insight Name> -StorageAccountKey $newKey `

To find the Storage Insight Name, use the `Get-AzureRmOperationalInsightsStorageInsight` cmdlet, as shown in earlier examples.

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
Refer to [Enabling Diagnostics in Azure Virtual Machines](../virtual-machines-dotnet-diagnostics.md) for more details.

You can enable and update the Agent using the following PowerShell script. 
You can also use this script with a custom logging configuration. 
You will need to modify the script to set the storage account, service name and virtual machine name.
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

- [Enable Solutions](log-analytics-add-solutions.md) to provide insight into the data.
- [Use search queries](log-analytics-log-searches.md) to analyze the data.
