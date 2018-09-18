---
title: Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine Scale Set
description: Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine Scale Set
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: howto
ms.date: 09/24/2018
ms.author: ancav
ms.component: metrics
---
# Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows virtual machine scale set

The Azure Monitor [Windows Azure Diagnostics extension](azure-diagnostics.md) (WAD) allows you to collect metrics and logs from the Guest Operation System (guest OS) running as part of a Virtual Machine, Cloud Service, or Service Fabric cluster.  The extension can send telemetry to many different locations listed in the previously linked article.  

Starting with WAD version 1.11, you can write metrics directly to the Azure Monitor metrics store where standard platform metrics are already collected. Storing them in this location allows you to access the same actions available for platform metrics.  Actions include near-real time alerting, charting, routing, access from REST API and more.  In the past, the WAD extension wrote to Azure Storage, but not the Azure Monitor data store.  

This article describes the process to send guest OS performance metrics for a Windows virtual machine scale set to the Azure Monitor data store. The Azure Monitor data store is where the Azure platform metrics are stored. From there, you can do the same things as you can with Azure platform metrics. Actions include near-real time alerting, charting, routing, access from REST API and more.   

If you are new to Resource Manager templates,  learn about [template deployments](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview.md), and their structure and syntax.  

## Pre-requisites

- You must be a [Service Administrator or co-administrator](https://docs.microsoft.com/en-us/azure/billing/billing-add-change-azure-subscription-administrator.md) on your Azure subscription 

- Your subscription must be registered with [Microsoft.Insights](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-6.8.1) 

- You need to have either [Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-6.8.1) installed, or you can use [Azure CloudShell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview.md) 


## Set up Azure Monitor as a data sink 
The Azure Diagnostics extension uses a feature called "data sinks" to route metrics and logs to different locations.  The following steps show how to use a Resource Manager template and PowerShell to deploy a VM using the new "Azure Monitor" data sink. 

## Author Resource Manager template 
For this example, you can use a publicly available sample template. The starting templates are at
https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-autoscale  

- **Azuredeploy.json** is a pre-configured Resource Manager template for deployment of a virtual machine scale set

- **Azuredeploy.parameters.json** is a parameters file that stores information like what username and password you would like to set for your VM. During deployment, the Resource Manager template uses the parameters set in this file. 

Alternatively, the sample files with the modification listed in this article are available at the following links. You will still have to skim the steps to fill in some variables.  

- [Modified **Azuredeploy.json**](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/monitoring-and-diagnostics/code/metrics-custom-guestos-resource-manager-VMSS/azuredeploy.json)

- [Modified **Azuredeploy.parameters.json**](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/monitoring-and-diagnostics/code/metrics-custom-guestos-resource-manager-VMSS/azuredeploy.parameters.json) 

### Steps to modify original template

Save both files locally. 

Open the *azuredeploy.parameters.json* file 
- Provide a **vmSKU** you would like to deploy (we recommend Standard_D2_v3) 
- Specify a **windowsOSVersion** you would like for your virtual machine scale set (we recommend 2016-Datacenter) 
- Name the virtual machine scale set resource to be deployed using a **vmssName** property. For example, *VMSS-WAD-TEST*.    
- Specify the number of VMs you would like to be running on the virtual machine scale set using the **instanceCount** property
- Enter values for **adminUsername** and **adminPassword** for the virtual machine scale set. These parameters are used for remote access to the VMs in the scale set. These parameters are used for remote access to the VM. DO NOT use the ones in this template to avoid having your VM hijacked. Bots scan the internet for usernames and passwords in public Github repositories. They are likely to be testing VMs with these defaults. 

Open the *azuredeploy.json* file 

Add a variable to hold the storage account information in the Resource Manager template. You still must provide a Storage Account as part of the installation of the diagnostics extension. Any logs and/or performance counters specified in the diagnostics config file are written to the specified storage account in addition to being sent to the Azure Monitor metric store. 

```json
"variables": {  
"storageAccountName": "[concat('storage', uniqueString(resourceGroup().id))]", 
 ```
 
Find the Virtual Machine Scale Set definition in the resources section and add the "identity" section to the configuration. This ensures Azure assigns it a system identity. This step ensures the VMs in the scale set can emit guest metrics about themselves to Azure Monitor.  

```json
  { 
      "type": "Microsoft.Compute/virtualMachineScaleSets", 
      "name": "[variables('namingInfix')]", 
      "location": "[resourceGroup().location]", 
      "apiVersion": "2017-03-30", 
      "identity": { 
           "type": "systemAssigned" 
       }, 
 ```

In the virtual machine scale set resource, find the **virtualMachineProfile** section. Add a new profile called **extensionsProfile** to manage extensions.  


In the **extensionProfile**, add a new extension to the template after the **networkProfile** section. This section is the Managed Service Identity (MSI) extension that ensures the metrics being emitted are accepted by Azure Monitor. The “name” field can contain  any name.  

```json
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
```

```json
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
```

Add a dependsOn for the storage account to ensure it's created in the correct order. 
```json
"dependsOn": [ 
"[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]", 
"[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]" 
"[concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]" 
 ```

Create a storage account  
```json
{ 
    "type": "Microsoft.Storage/storageAccounts", 
    "name": "[variables('storageAccountName')]", 
    "apiVersion": "2015-05-01-preview", 
    "location": "[resourceGroup().location]", 
    "properties": { 
      "accountType": "Standard_LRS" 
    } 
  }, 
```

Save and close both files 

## Deploy the Resource Manager template 

> [!NOTE]
> You must be running the Azure Diagnostics extension version 1.5 or higher AND have the "autoUpgradeMinorVersion": property set to *true* in your Resource Manager template.  Azure then loads the proper extension when it starts the VM. If you do not have these settings in your template, change them and redeploy the template. 


To deploy the Resource Manager template, we will leverage Azure PowerShell.  

1. Launch PowerShell 
1. Sign in to Azure using `Login-AzureRmAccount`
1. Get your list of subscriptions using `Get-AzureRmSubscription`
1. Set the subscription you will be creating/updating the virtual machine in 

   ```PowerShell
   Select-AzureRmSubscription -SubscriptionName "<Name of the subscription>" 
   ```
1. Create a new resource group for the VM being deployed, run the below command 

   ```PowerShell
    New-AzureRmResourceGroup -Name "VMSSWADtestGrp" -Location "<Azure Region>" 
   ```

   Note: Remember to use an Azure region that is enabled for custom metrics. 
 
1. Execute the following commands to deploy the VM with the  
   > [!NOTE] 
   > If you wish to update an existing VMSS, simply add *-Mode Incremental* to the end of the following command. 
 
   ```PowerShell
   New-AzureRmResourceGroupDeployment -Name "VMSSWADTest" -ResourceGroupName "VMSSWADtestGrp" -TemplateFile "<File path of your azuredeploy.JSON file>" -TemplateParameterFile "<File path of your azuredeploy.parameters.JSON file>"  
   ```

1. Once your deployment succeeds you should be able to find the virtual machine scale set in the Azure portal, and it should be emitting metrics to Azure Monitor. 

   > [!NOTE] 
   > You may run into errors around the selected vmSkuSize. If this happens, go back to your azuredeploy.json file and update the default value of the vmSkuSize parameter. In this case, we recommend trying  "Standard_DS1_v2"). 


## Chart your metrics 

1. Sign in to the Azure portal 

1. In the left-hand menu, click **Monitor** 

1. On the Monitor page, click **Metrics**. 

   ![Metrics page](./media/metrics-store-custom-rest-api/metrics.png) 

1. Change the aggregation period to **Last 30 minutes**.  

1. In the resource drop-down, select the virtual machine scale set you just created.  

1. In the namespaces drop-down, select **azure.vm.windows.guest** 

1. In the metrics drop down, select **Memory\%Committed Bytes in Use**.  

You can then also choose to use the dimensions on this metric to chart this metric for a particular VM in the scale set, or to plot each VM in the scale set. 



## Next steps
- Learn more about [alerts](monitoring-overview-alerts.md).

