<properties
   pageTitle="Microsoft Azure Service Fabric How to collect logs with Windows Azure Diagnostics and Operational Insights"
   description="This article describes how you can setup Windows Azure Diagnostics and Operational Insights to collect logs from a Service Fabric cluster running in Azure"
   services="service-fabric"
   documentationCenter=".net"
   authors="kunaldsingh"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="10/20/2015"
   ms.author="kunalds"/>


# Collecting logs from a Service Fabric cluster in Azure using WAD(Windows Azure Diagnostics) and Operational Insights
When running a Service Fabric cluster in Azure you would want to collect the logs from all the nodes into a central location. Having the logs in a central location makes it easy to analyze and troubleshoot any issues that you may notice in your cluster or the applications and services running in that cluster. One of the ways to upload and collect logs is to use WAD(Windows Azure Diagnostics) extension which uploads logs to Azure Table storage. Operational Insights(part of the Microsoft Operations Management Suite) is a SaaS-based solution which makes it easy to analyze and search logs. The steps below describe how you can set up WAD on the VMs in the cluster to upload logs to a central store and then configure Operational Insights to pull the logs so that you can view them in the Operational Insights portal.

## Suggested Reading
* [Windows Azure Diagnostics](https://msdn.microsoft.com/en-us/library/azure/gg433048.aspx)
* [Operational Insights](https://azure.microsoft.com/en-us/services/operational-insights/)
* [Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/)

## Prerequisites
These tools will be used to perform some of the operations in this document:
* [Azure Powershell](https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/)
* [ARM Client](https://github.com/projectkudu/ARMClient)

## Different log sources that you may want to collect
1. Service Fabric logs: Emitted by the platform to standard ETW and EventSource channels. These can be one of these types:
  - Operational Events: These are logs for operations performed by the Service Fabric platform. Examples include creation of application and service, Node state changes and upgrade information.
  - [Actor Programming Model events](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-reliable-actors-diagnostics/)
  - [Reliable Services Programming Model events](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-reliable-services-diagnostics/)
2. Application Events: These are the events emitted from your services code and written out using the EventSource helper class provided in the Visual Studio templates. For more information on how to write logs from your application refer to this [article](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally/).


## Deploy WAD(Windows Azure Diagnostics) to a Service Fabric cluster to collect and upload logs
The first step to collecting logs will be to deploy the WAD extension on each of the VMs in the Service Fabric cluster. WAD will collect logs on each VM and upload them to the storage account you specify. The steps vary a little based on whether you use Portal or ARM and if the deployment is being done as part of cluster creation or for a cluster that already exists. Let's look at the steps for each scenario.

### Deploy WAD as part of cluster creation through the Portal
To deploy WAD to the VMs in the cluster as part of cluster creation the Diagnostics Setting shown in the image below is used. It is ON by default.
![WAD setting in Portal for cluster creation](./media/service-fabric-diagnostics-how-to-setup-wad-operational-insights/PortalClusterCreationDiagnosticsSetting.png)

### Deploy WAD as part of cluster creation using ARM
When creating a cluster using ARM you need to add this JSON to the Full cluster ARM template to add WAD.

### <a name="deploywadarm"></a>Deploy WAD to an existing cluster
If you have an existing cluster that does not have WAD deployed you can add WAD with these steps.
Create two files WadConfigUpdate.json and WadConfigUpdateParams.json with the JSON below.

##### WadConfigUpdate.json
```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmNamePrefix": {
            "type": "string"
        },
        "vmStorageAccountName": {
            "type": "string"
        }
    },

    "variables": {
        "wadconfig": {
            "DiagnosticMonitorConfiguration": {
                "overallQuotaInMB": "4096",
                "DiagnosticInfrastructureLogs": {
                    "scheduledTransferLogLevelFilter": "Verbose"
                },
                "EtwProviders": {
                    "EtwEventSourceProviderConfiguration": [
                        {
                            "provider": "Microsoft-ServiceFabric-Actors",
                            "scheduledTransferKeywordFilter": "1",
                            "DefaultEvents": { "eventDestination": "ServiceFabricReliableActorEventTable" }
                        },
                        {
                            "provider": "Microsoft-ServiceFabric-Services",
                            "DefaultEvents": { "eventDestination": "ServiceFabricReliableServiceEventTable" },
                            "scheduledTransferPeriod": "PT1M"
                        },
                        {
                            "provider": "MyCompany-AirTrafficControlApplication-AirTrafficControlWeb",
                            "DefaultEvents": { "eventDestination": "ETWEventTable" }
                        },
                        {
                            "provider": "MyCompany-AirTrafficControlApplication-AirTrafficControl",
                            "DefaultEvents": { "eventDestination": "ETWEventTable" }
                        }
                    ],
                    "EtwManifestProviderConfiguration": [
                        {
                            "provider": "cbd93bc2-71e5-4566-b3a7-595d8eeca6e8",
                            "scheduledTransferKeywordFilter": "4611686018427387904",
                            "DefaultEvents": { "eventDestination": "ServiceFabricSystemEventTable" }
                        }
                    ]
                }
            }
        }
    },

    "resources": [
        {
            "apiVersion": "2015-05-01-preview",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "name": "[concat(parameters('vmNamePrefix'),copyIndex(0),'/AzureDiagnostics')]",
            "location": "[resourceGroup().location]",
            "properties": {
                "type": "IaaSDiagnostics",
                "typeHandlerVersion": "0.5",
                "publisher": "WAD2AI.Diagnostics.Test",
                "autoUpgradeMinorVersion": true,
                "settings": {
                    "WadCfg": "[variables('wadConfig')]",
                    "StorageAccount": "[parameters('vmStorageAccountName')]"
                },
                "protectedSettings": {
                    "storageAccountName": "[parameters('vmStorageAccountName')]",
                    "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('vmStorageAccountName')),'2015-05-01-preview').key1]",
                    "storageAccountEndPoint": "https://core.windows.net/"
                }
            },
            "copy": {
                "name": "vmExtensionLoop",
                "count": 5
            }
        }
    ],
    "outputs": {
    }
}
```

##### WadConfigUpdateParams.json
Replace the vmNamePrefix with the prefix you chose for VM names while creating your cluster and edit the vmStorageAccountName to be the the storage account where you want to upload the logs from the VMs.
```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmNamePrefix": {
            "value": "VM"
        },
        "vmStorageAccountName": {
            "value": "kunaltestdiagstore"
        }
    }
}
```
After creating the json files as mentioned above and having changed them for the specifics of your environment, call this command passing in the name of the resource group for your Service Fabric cluster. Once this command is run successfully WAD will be deployed on all the VMs and will start uploading the logs from the cluster to tables in the specified Azure Storage account.
```powershell
New-AzureResourceGroupDeployment -ResourceGroupName kunaltestcluster -TemplateFile "C:\Users\kunalds\Desktop\TestWAD\WadConfigUpdate.json" -TemplateParameterFile "C:\Users\kunalds\Desktop\TestWAD\WadConfigUpdateParams.json"
```

## Set up Operational Insights to view and search cluster logs
Once WAD is setup on the cluster and is uploading logs to a storage account the next step is to setup Operational Insights so you can view, search and query all the cluster logs through the Portal UI of Operational Insights.
### Create an Operational Insights Workspace
To see the steps for creating an Operational Insights workspace see the article below. Note that it describes two different ways to create a workspace, choose the Azure Portal and Subscription based approach. You will need the name of the Operational Insights workspace in the later sections of this document.

[Operational Insights Onboarding](https://technet.microsoft.com/en-us/library/mt484118.aspx)

### Configure Operational Insights workspace to show the cluster logs
Once you have created the Operational Insights workspace as described above the next step is to configure the worksplace to pull the logs from the Azure tables where they are being uploaded from the cluster by WAD. Currently this configuration is not possible through the Operational Insights Portal and can only be done through Powershell commands. Run this PS script.
```powershell
<#
    This script will configure an Operations Management Suite workspace (aka Operational Insights workspace) to read
    Windows Azure Diagnostics from an Azure storage account.

    It will enable all supported data types (currently Windows Event Logs, Syslog, Service Fabric Events, ETW Events and IIS Logs).

    It supports both classic and ARM storage accounts.

    If you have more than one OMS workspace you will be prompted for the workspace to configure.

    If you have more than one storage account you will be prompted for which storage account to configure.
#>
Add-AzureAccount

Switch-AzureMode -Name AzureResourceManager

$validTables = "WADServiceFabric*EventTable", "WADETWEventTable"

function Select-Workspace {

    $workspace = ""

    $allWorkspaces = Get-AzureOperationalInsightsWorkspace  

    switch ($allWorkspaces.Count) {
        0 {Write-Error "No Operations Management Suite workspaces found"}
        1 {return $allWorkspaces}
        default {
            $uiPrompt = "Enter the number corresponding to the workspace you want to configure.`n"

            $count = 1
            foreach ($workspace in $allWorkspaces) {
                $uiPrompt += "$count. " + $workspace.Name + " (" + $workspace.CustomerId + ")`n"
                $count++
            }
            $answer = (Read-Host -Prompt $uiPrompt) - 1
            $workspace = $allWorkspaces[$answer]
        }  
    }
    return $workspace
}

function Select-StorageAccount {

    $storage = ""

    $allStorageAccounts = (get-azureresource -ResourceType Microsoft.ClassicStorage/storageAccounts) + (get-azureresource -ResourceType Microsoft.Storage/storageAccounts)

    switch ($allStorageAccounts.Count) {
        0 {Write-Error "No storage accounts found"}
        1 {$storage = $allStorageAccounts}
        default {

            $uiPrompt = "Enter the number corresponding to the storage account with diagnostics.`n"

            $count = 1
            foreach ($storageAccount in $allStorageAccounts) {
                $uiPrompt += "$count. " + $storageAccount.Name + " (" + $storageAccount.Location + ")`n"
                $count++
            }
            $answer = (Read-Host -Prompt $uiPrompt)

            $storage = $allStorageAccounts[$answer - 1]
        }
    }
    return $storage
}

$workspace = Select-Workspace
$storageAccount = Select-StorageAccount

$insightsName = $storageAccount.Name + $workspace.Name

$existingConfig = ""

try
{
    $existingConfig = Get-AzureOperationalInsightsStorageInsight -Workspace $workspace -Name $insightsName -ErrorAction Stop
}
catch [Hyak.Common.CloudException]
{
    # HTTP Not Found is returned if the storage insight doesn't exist
}

if ($existingConfig) {
    Set-AzureOperationalInsightsStorageInsight -Workspace $workspace -Name $insightsName -Tables $validTables -Containers $validContainers

} else {
    if ($storageAccount.ResourceType -eq "Microsoft.ClassicStorage/storageAccounts") {
        Switch-AzureMode -Name AzureServiceManagement
        $key = (Get-AzureStorageKey -StorageAccountName $storageAccount.Name).Primary
        Switch-AzureMode -Name AzureResourceManager
    } else {
        $key = (Get-AzureStorageAccountKey -ResourceGroupName $storageAccount.ResourceGroupName -Name $storageAccount.Name).Key1
    }
    New-AzureOperationalInsightsStorageInsight -Workspace $workspace -Name $insightsName -StorageAccountResourceId $storageAccount.ResourceId -StorageAccountKey $key -Tables $validTables -Containers $validContainers
}
```
Once you have configured the Operational Insights workspace to read from the Azure Tables in your storage account, you should log into the Azure Portal, and look up the Storage tab for the Operational Insights resource. It should show something like this:
![Operational Insights Storage Cnfiguration in the Azure Portal](./media/service-fabric-diagnostics-how-to-setup-wad-operational-insights/OIConnectedTables.png)

### Search and View logs in Operational Insights
After you have configured your Operational Insights workspace to read the logs from the specified storage account it may take up to 10 minutes for the logs to show up in Operational Insights UI. To ensure there are new logs generated you should deploy a Service Fabric application to your cluster since that will generate operational events from the Service Fabric platform.

1) To view the logs, select LogSearch on the main page of the Operational Insights portal.
![Operational Insights Log Search Option](./media/service-fabric-diagnostics-how-to-setup-wad-operational-insights/LogSearchOptionOI.png)

2) In the log search page use this query "Type=ServiceFabricOperationalEvent" and you should see the logs from your cluster as shown below.
![Operational Insights Log Query and View](./media/service-fabric-diagnostics-how-to-setup-wad-operational-insights/ViewOILogs.png)

## Update WAD to collect and upload logs from new EventSource channels
To update WAD to collect logs from a new EventSource channels representing a new application that you are about to deploy you just need to perform the same steps as in the [section above](#deploywadarm) describing setup of WAD for an existing cluster. You will need to update the EtwEventSourceProviderConfiguration section in the WadConfigUpdate.json to add entries for the new EventSources before you apply the config update through the ARM command. The table for upload will be the same(ETWEventTable), since that is the table that is configured for Operational Insights to read application ETW events from.
