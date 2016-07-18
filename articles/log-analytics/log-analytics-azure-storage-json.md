<properties
	pageTitle="Using JSON files in blob storage | Microsoft Azure"
	description="Log Analytics can read the logs from Azure services that write diagnostics to blob storage in JSON format."
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
	ms.date="07/13/2016"
	ms.author="banders"/>


# JSON files in blob storage

Log Analytics can read the logs for the following services that write diagnostics to blob storage in JSON format:

+ Automation (Preview)
+ Key Vault (Preview)
+ Application Gateway (Preview)
+ Network Security Group (Preview)

The following sections will walk you through using PowerShell to:

+ Configure Log Analytics to collect the logs from storage for each resource  
+ Enable the Log Analytics solution for the Azure service

Before Log Analytics can collect data for these resources, Azure diagnostics must be enabled. You can use the  `Set-AzureRmDiagnosticSetting` cmdlet to enable logging.

Refer to the following articles for more information on how to enable diagnostic logging:

+ [Key Vault](../key-vault/key-vault-logging.md)
+ [Application Gateway](../application-gateway/application-gateway-diagnostics.md)
+ [Network Security Group](../virtual-network/virtual-network-nsg-manage-log.md)

This documentation also includes details on:

+ Troubleshooting data collection
+ Stopping data collection

## Configure Log Analytics to collect Azure Diagnostics written to blob in JSON format

Collecting logs for these services and enabling the solution to visualize the logs is performed using PowerShell scripts.

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


It is not currently possible to perform the above configuration from the portal.

## Configure Log Analytics to collect JSON logs from Azure blob storage

We have provided a PowerShell script module that exports two cmdlets to assist with configuring Log Analytics:

1. `Add-AzureDiagnosticsToLogAnalyticsUI` will prompt you for input and is able to set up simple configurations
2. `Add-AzureDiagnosticsToLogAnalytics` takes the resources to monitor as input and then configures Log Analytics  

### Pre-requisites

1. Azure PowerShell with version 1.0.8 or newer of the Operational Insights cmdlets.
  - [How to install and configure Azure PowerShell](../powershell-install-configure.md)
  - Verify your version of cmdlets: `Import-Module AzureRM.OperationalInsights -MinimumVersion 1.0.8 `
2. Diagnostic logging is configured for the Azure resource you want to monitor. Use `Set-AzureRmDiagnosticSetting` or refer to [Use Log Analytics to collect data from Azure storage accounts](log-analytics-azure-storage.md) for how to enable diagnostics.
3. A [Log Analytics](https://portal.azure.com/#create/Microsoft.LogAnalyticsOMS) workspace  
4. The AzureDiagnosticsAndLogAnalytics PowerShell module
  - Download the [AzureDiagnosticsAndLogAnalytics](https://www.powershellgallery.com/packages/AzureDiagnosticsAndLogAnalytics/) module from PowerShell gallery

### Option 1: Run the Interactive Configuration Scripts

Open PowerShell and run:

```
# Connect to Azure
Login-AzureRmAccount
# If you have diagnostics logs being written to classic storage you will also need to run
Add-AzureAccount

# Import the module
Install-Module -Name AzureDiagnosticsAndLogAnalytics

# Run the UI configuration script
Add-AzureDiagnosticsToLogAnalyticsUI

```

You are shown a list of available selections and given a prompt to make your selection.
You’ll be asked to make selections for each of the following:

+ Resource types (Azure Services) to collect logs from
+ Resource instances to collect logs from
+ Log Analytics workspace that will collect the data

After running this script you should see records in Log Analytics about 30 minutes after new diagnostic data is written to storage. If records are not available after this time refer to the troubleshooting section below.

### Option 2: Build a list of resources and pass them to the configuration cmdlet

You will build a list of resources that have Azure diagnostics enabled and then pass the resources to the configuration cmdlet.

You can see additional information about the cmdlet by running the following PowerShell:

`Get-Help Add-AzureDiagnosticsToLogAnalytics`

To find more details on OMS [Log Analytics PowerShell Cmdlets](https://msdn.microsoft.com/library/mt188224.aspx)

>[AZURE.NOTE] If resource and workspace are in different Azure Subscriptions, switch between them as needed using `Select-AzureRmSubscription -SubscriptionId <Subscription the resource is in>`

```
# Connect to Azure
Login-AzureRmAccount
# If you have diagnostics logs being written to classic storage you will also need to run
Add-AzureAccount

# Import the module
Install-Module -Name AzureDiagnosticsAndLogAnalytics

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


## Stopping Log Analytics from collecting Azure Diagnostics written to blob in JSON

If you need to delete the Log Analytics configuration for a resource use the cmdlet `Remove-AzureRmOperationalInsightsStorageInsight`

## Troubleshooting configuration for Azure Diagnostics written to blob in JSON

*Issue*

When configuring a resource that is logging to classic storage you get an exception saying "subscription not found": e.g.

```
Select-AzureSubscription : The subscription id 7691b0d1-e786-4757-857c-7360e61896c3 doesn't exist.

Parameter name: id
```

*Resolution*

Login to the service management API with `Add-AzureAccount`

## Troubleshooting data collection for Azure Diagnostics written to blob in JSON

If you are not seeing data for your Azure resource in Log Analytics you can use the following troubleshooting steps:

+ Verify data flowing to the storage account
+ Verify the Log Analytics solution for the service is enabled
+ Verify that Log Analytics is configured to read from storage
+ Update the storage account key

### Verify data is flowing to the storage account

You can check this with a tool that allows browsing Azure storage (e.g. Visual Studio) or by using PowerShell.

To find the Storage Account the resource is configured to log to use the following PowerShell:

`Find-AzureRmResource -ResourceType "Microsoft.KeyVault/Vaults" | select ResourceId | Get-AzureRmDiagnosticSetting `

The storage container used by Azure Diagnostics has a name with a format of:  

`insights-logs-<Category>`

Refer to [Using storage cmdlets to check a container for recent data](../storage/storage-powershell-guide-full.md) for more details on viewing the contents of the storage account.

### Verify the Log Analytics solution for the service is enabled

If you use `Add-AzureDiagnosticsToLogAnalyticsUI` the correct Log Analytics solution is automatically enabled for you.

To check if a solution is enabled, run the following PowerShell:

`Get-AzureRmOperationalInsightsIntelligencePacks -ResourceGroupName $logAnalyticsResourceGroup -WorkspaceName $logAnalyticsWorkspaceName`

If the solution is not enabled, you can enable it using the following PowerShell:

`Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName $logAnalyticsResourceGroup -WorkspaceName $logAnalyticsWorkspaceName -IntelligencePackName $solution -Enabled $true`

To find the name of the solution to enable for each resource type, use the following PowerShell (this variable is available once you have imported the module):

`$MonitorableResourcesToOMSSolutions`

### Verify that Log Analytics is configured to read from storage

If you add additional Azure Resources, you need to enable Diagnostics logging for them, as well as configure Log Analytics for them.
To check which resources and storage accounts Log Analytics is configured to collect logs for, use the following PowerShell:

```
# Find the Workspace ResourceGroup and Name
$logAnalyticsWorkspace = Get-AzureRmOperationalInsightsWorkspace

#Get the configuration for all resources:
Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName $logAnalyticsWorkspace.ResourceGroupName -WorkspaceName $logAnalyticsWorkspace.Name

#Get the just the resources configured:
Get-AzureRmOperationalInsightsStorageInsight -ResourceGroupName $logAnalyticsWorkspace.ResourceGroupName -WorkspaceName $logAnalyticsWorkspace.Name | select Containers
```

### Update the Storage Key

If you change the key for the storage account the Log Analytics configuration will also need to be updated with the new key.
You can update the Log Analytics configuration with a new key using the following PowerShell:

`Set-AzureRmOperationalInsightsStorageInsight -ResourceGroupName $logAnalyticsWorkspace.ResourceGroupName -WorkspaceName $logAnalyticsWorkspace.Name –Name <Storage Insight Name> -StorageAccountKey $newKey `

To find the Storage Insight Name, use the `Get-AzureRmOperationalInsightsStorageInsight` cmdlet, as shown in earlier examples.

## Next steps

- [Use blob storage for IIS and table storage for events](log-analytics-azure-storage-iis-table.md) to read the logs for Azure services that write diagnostics to table storage or IIS logs written to blob storage.
- [Enable Solutions](log-analytics-add-solutions.md) to provide insight into the data.
- [Use search queries](log-analytics-log-searches.md) to analyze the data.
