TO DO
---
title: Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine
description: Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: howto
ms.date: 09/24/2018
ms.author: ancav
ms.component: metrics
---
# Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine

The Azure Monitor [Windows Azure Diagnostics extension](azure-diagnostics.md) (WAD) allows you to collect metrics and logs from the Guest Operation System (OS) running as part of a Virtual Machine, Cloud Service or Service Fabric cluster.  The extension can send telemetry to many different locations listed in the previously linked article.  

Starting with WAD version 1.11, you can write metrics directly to the Azure Monitor metrics store where standard platform metrics are already collected. Storing them in this location allows you to access the same actions available for platform metrics.  Actions include near-real time alerting, charting, routing, access from REST API and more.  In the past, the WAD extension wrote to Azure Storage, but not the Azure Monitor data store.  

If you are new to Resource Manager templates,  learn about [template deployments](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview.md), and their structure and syntax.  

## Pre-requisites: 

- You will need to be a [Service Administrator or co-administrator](https://docs.microsoft.com/en-us/azure/billing/billing-add-change-azure-subscription-administrator.d) on your Azure subscription 
- Your subscription must be registered with [Microsoft.Insights](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-6.8.1) 
- You will need to have [Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-6.8.1)  installed, or you can use [Azure CloudShell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview.md) 


Setup Azure Monitor as a data sink 

The Azure Diagnostics extension uses a feature called “data sinks” to route metrics and logs to different locations.  Use the new data sink “Azure Monitor” for this process.  

The following steps show how to use a Resource Manager template and PowerShell to deploy a VM using the new “Azure Monitor” data sink.  

Author an ARM Template for a VMSS with the diagnostics extension and sink configured 

For this example, you can use a publicly available sample template.  

https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-autoscale 

Azuredeploy.json is a pre-configured ARM template for deployment of a VMSS. 

Azuredeploy.parameters.json is a parameters file that stores information like what username and password you would like to set for your VMSS. During deployment the Resource Manager template uses the parameters set in this file. 

 

Save both files locally. 

Open the azuredeploy.parameters.json file 

Provide a vmSKU you would like to deploy (we recommend Standard_D2_v3) 

Specify a windowsOSVersion you would like for your VMSS (we recommend 2016-Datacenter) 

Name the VMSS resource to be deployed using the a vmssName property. For example, VMSS-WAD-TEST.    

Specify the number of VMs you would like to be running on the VMSS using the instanceCount property 

Enter values for adminUsername and adminPassword for the VMSS. These parameters are used for remote access to the VMs in the scale set. 

Open the azuredeploy.json file 

Add a variable to hold the storage account information in the Resource Manager template. You still must provide a Storage Account as part of the installation of the diagnostics extension. Any logs and/or performance counters specified in the diagnostics config file are written to the specified storage account in addition to being sent to the Azure Monitor metric store. 


"variables": {  
 
"storageAccountName": "[concat('storage', uniqueString(resourceGroup().id))]", 
 
 
Find the Virtual Machine Scale Set definition in the resources section and add the "identity" section to the configuration. This ensures Azure assigns it a system identity. This step ensures the VMs in the scale set can emit guest metrics about themselves to Azure Monitor.  

  { 
      "type": "Microsoft.Compute/virtualMachineScaleSets", 
      "name": "[variables('namingInfix')]", 
      "location": "[resourceGroup().location]", 
      "apiVersion": "2017-03-30", 
      "identity": { 
           "type": "systemAssigned" 
       }, 

 

In the virtual machine scale set resource, find the the “virtualMachineProfile” section. Here we will add a new profile called “extensionsProfile” to manage extensions. We will use this section in steps below. 

In the extensionProfile add a new extension to the template after the “networkProfile” section. . This is the MSI extension that ensures the metrics being emitted are accepted by Azure Monitor. The “name” field can contain  any name.  

"extensionProfile": { 
"extensions": [ 
    { 
     "name": "VMSS-WAD-extension", 
     "properties": { 
           "publisher": "Microsoft.ManagedIdentity", 
           "type": "ManagedIdentityExtensionForWindows", 
           "typeHandlerVersion": "1.0", 
           "autoUpgradeMinorVersion": true, 
           "settings": { 
                 "port": 50342 
               }, 
           "protectedSettings": {} 
         }, 
}, 
Next, we will add the diagnostics extension as an extension resource to the VMSS resource (below the MSI extension). The highlighted sections enable the extension to emit metrics directly to Azure Monitor. Feel free to add/remove performance counters as needed. 
{ 
   "name": "[concat('VMDiagnosticsVmExt','_vmNodeType0Name')]", 
   "properties": { 
        "type": "IaaSDiagnostics", 
        "autoUpgradeMinorVersion": true, 
        "protectedSettings": { 
             "storageAccountName": "[variables('storageAccountName')]", 
             "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')),'2015-05-01-preview').key1]", 
             "storageAccountEndPoint": "https://core.windows.net/" 
        }, 
        "publisher": "Microsoft.Azure.Diagnostics", 
        "settings": { 
             "WadCfg": { 
                   "DiagnosticMonitorConfiguration": { 
                        "overallQuotaInMB": "50000", 
                        "PerformanceCounters": { 
                            "scheduledTransferPeriod": "PT1M", 
                            "sinks": "AzMonSink", 
                            "PerformanceCounterConfiguration": [ 
                               { 
   "counterSpecifier": "\\Memory\\% Committed Bytes In Use", 
                                   "sampleRate": "PT15S" 
}, 
{ 
   "counterSpecifier": "\\Memory\\Available Bytes", 
   "sampleRate": "PT15S" 
}, 
{ 
   "counterSpecifier": "\\Memory\\Committed Bytes", 
   "sampleRate": "PT15S" 
} 
                            ] 
                      }, 
                      "EtwProviders": { 
                            "EtwEventSourceProviderConfiguration": [ 
                                { 
                                   "provider": "Microsoft-ServiceFabric-Actors", 
                                   "scheduledTransferKeywordFilter": "1", 
                                   "scheduledTransferPeriod": "PT5M", 
                                   "DefaultEvents": { 
                                   "eventDestination": "ServiceFabricReliableActorEventTable" 
                                } 
                                }, 
                                { 
                                   "provider": "Microsoft-ServiceFabric-Services", 
                                   "scheduledTransferPeriod": "PT5M", 
                                   "DefaultEvents": { 
                                        "eventDestination": "ServiceFabricReliableServiceEventTable" 
                                   } 
                                } 
                          ], 
                          "EtwManifestProviderConfiguration": [ 
                                { 
                                   "provider": "cbd93bc2-71e5-4566-b3a7-595d8eeca6e8", 
                                   "scheduledTransferLogLevelFilter": "Information", 
                                   "scheduledTransferKeywordFilter": "4611686018427387904", 
                                   "scheduledTransferPeriod": "PT5M", 
                                   "DefaultEvents": { 
                                        "eventDestination": "ServiceFabricSystemEventTable" 
                                   } 
                               } 
                          ] 
                    } 
                    }, 
                    "SinksConfig": { 
                          "Sink": [ 
                               { 
                                   "name": "AzMonSink", 
                                   "AzureMonitor": {} 
                               } 
                           ] 
                    } 
              }, 
              "StorageAccount": "[variables('storageAccountName')]" 
              }, 
             "typeHandlerVersion": "1.11" 
       } 
} 
Add a depends on gor the storage account. 
"dependsOn": [ 
"[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]", 
"[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]" 
"[concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]" 
 
Create a storage account.  

{ 
    "type": "Microsoft.Storage/storageAccounts", 
    "name": "[variables('storageAccountName')]", 
    "apiVersion": "2015-05-01-preview", 
    "location": "[resourceGroup().location]", 
    "properties": { 
      "accountType": "Standard_LRS" 
    } 
  }, 
 
Save and close both files 

Note: You must be running the Azure Diagnostics extension version 1.5 or higher AND have the "autoUpgradeMinorVersion": property set to ‘true’ in your Resource Manager template.  Azure then loads the proper extension when it starts the VMs. If you do not have these settings in your template, change them and redeploy the template. 
 

## Deploy the ARM template 

To deploy the ARM template we will leverage Azure PowerShell.  
Launch PowerShell 
Login to Azure 
Login-AzureRmAccount 
Get your list of subscriptions 
Get-AzureRmSubscription 
Set the subscription you will be creating/updating the virtual machine in 
Select-AzureRmSubscription -SubscriptionName "<Name of the subscription>" 
Create a new resource group for the VM being deployed, run the below command 
New-AzureRmResourceGroup -Name "VMSSWADtestGrp" -Location "<Azure Region>" 
Note: Remember to use an Azure region that is enabled for custom metrics. 
 
Execute the following commands to deploy the VM with the  
New-AzureRmResourceGroupDeployment -Name "VMSSWADTest" -ResourceGroupName "VMSSWADtestGrp" -TemplateFile "<File path of your azuredeploy.JSON file>" -TemplateParameterFile "<File path of your azuredeploy.parameters.JSON file>"  
Note: If you wish to update an existing VMSS, simply add ‘-Mode Incremental’ to the end of the above command 
 
Once your deployment succeeds you should be able to find the VMSS in the Azure Portal, and it should be emitting metrics to Azure Monitor. 
Note: You may run into errors around the selected vmSkuSize. If this happens, go back to your azuredeploy.json file and update the default value of the vmSkuSize parameter  
 
Chart your metrics 
Log-in to the Azure Portal 
In the left-hand menu click on “Monitor” 
On the Monitor page click on the “Metrics (preview)” tab 
 
In the resource drop-down select the VMSS just created 
In the namespaces drop-down select “azure.vm.windows.guest” 
In the metrics drop down, select ‘Memory\Committed Bytes in Use’ 
You can then also choose to use the dimensions on this metric to chart this metric for a particular VM in the scale set, or to plot each VM in the scale set. 

## Next steps
- Learn more about [alerts](monitoring-overview-alerts.md).

