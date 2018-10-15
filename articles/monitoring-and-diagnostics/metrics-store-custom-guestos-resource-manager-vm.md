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

The Azure Monitor [Windows Azure Diagnostics extension](azure-diagnostics.md) (WAD) allows you to collect metrics and logs from the Guest Operating System (guest OS) running as part of a Virtual Machine, Cloud Service, or Service Fabric cluster.  The extension can send telemetry to many different locations listed in the previously linked article.  

This article describes the process to send guest OS performance metrics for a Windows Virtual Machine to the Azure Monitor data store. Starting with WAD version 1.11, you can write metrics directly to the Azure Monitor metrics store where standard platform metrics are already collected. Storing them in this location allows you to access the same actions available for platform metrics.  Actions include near-real time alerting, charting, routing, access from REST API and more.  In the past, the WAD extension wrote to Azure Storage, but not the Azure Monitor data store.   

If you're new to Resource Manager templates,  learn about [template deployments](../azure-resource-manager/resource-group-overview.md), and their structure and syntax.  

## Pre-requisites

- Your subscription must be registered with [Microsoft.Insights](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-6.8.1) 

- You need to have either [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-6.8.1) installed, or you can use [Azure CloudShell](https://docs.microsoft.com/azure/cloud-shell/overview.md) 

 
## Set up Azure Monitor as a data sink 
The Azure Diagnostics extension uses a feature called "data sinks" to route metrics and logs to different locations.  The following steps show how to use a Resource Manager template and PowerShell to deploy a VM using the new "Azure Monitor" data sink. 

## Author Resource Manager template 
For this example, you can use a publicly available sample template. The starting templates are at
https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows 

- **Azuredeploy.json** is a pre-configured Resource Manager template for deployment of a Virtual Machine. 

- **Azuredeploy.parameters.json** is a parameters file that stores information like what username and password you would like to set for your VM. During deployment, the Resource Manager template uses the parameters set in this file. 

Download and save both files locally. 

###  Modify azuredeploy.parameters.json
Open the *azuredeploy.parameters.json* file 

1. Enter values for *adminUsername* and *adminPassword* for the VM. These parameters are used for remote access to the VM. DO NOT use the ones in this template to avoid having your VM hijacked. Bots scan the internet for usernames and passwords in public Github repositories. They are likely to be testing VMs with these defaults.  

1. Create a unique dnsname for the VM.  

### Modify azuredeploy.json

Open the *azuredeploy.json* file 

Add a storage account ID to the **variables** section of the template after the entry for **storageAccountName**.  

```json
// Find these lines 
"variables": { 
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'sawinvm')]", 

// Add this line directly below.  
    "accountid": "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]", 
```

Add this managed identities for Azure resources extension to the template at the top of the "resources" section.  The extension ensures that Azure Monitor accepts the metrics being emitted.  

```json
//Find this code 
"resources": [
// Add this code directly below
    { 
        "type": "Microsoft.Compute/virtualMachines/extensions", 
        "name": "WADExtensionSetup", 
        "apiVersion": "2015-05-01-preview", 
        "location": "[resourceGroup().location]", 
        "dependsOn": [ 
            "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]" ], 
        "properties": { 
            "publisher": "Microsoft.ManagedIdentity", 
            "type": "ManagedIdentityExtensionForWindows", 
            "typeHandlerVersion": "1.0", 
            "autoUpgradeMinorVersion": true, 
            "settings": { 
                "port": 50342 
            } 
        } 
    }, 
```

Add the "identity" configuration to the VM resource to ensure Azure assigns the MSI extension a system identity. This step ensures the VM can emit guest metrics about itself to Azure Monitor 

```json
// Find this section
                "subnet": {
            "id": "[variables('subnetRef')]"
            }
        }
        }
    ]
    }
},
{ 
    "apiVersion": "2017-03-30", 
    "type": "Microsoft.Compute/virtualMachines", 
    "name": "[variables('vmName')]", 
    "location": "[resourceGroup().location]", 
    // add these 3 lines below
    "identity": {  
    "type": "SystemAssigned" 
    }, 
    //end of added lines
    "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
    ],
    "properties": {
    "hardwareProfile": {   
    ...
```

Add the following configuration to enable the diagnostics extension on a Windows Virtual Machine.  For a simple Resource Manager-based Virtual Machine, we can add the extension configuration to the resources array for the Virtual Machine. The line "sinks": "AzMonSink",  and the corresponding "SinksConfig" later in the section enable the extension to emit metrics directly to Azure Monitor. Feel free to add/remove performance counters as needed.  


```json
        "networkProfile": {
            "networkInterfaces": [
            {
                "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
            }
            ]
        },
"diagnosticsProfile": { 
    "bootDiagnostics": { 
    "enabled": true, 
    "storageUri": "[reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))).primaryEndpoints.blob]" 
    } 
} 
}, 
//Start of section to add 
"resources": [        
{ 
            "type": "extensions", 
            "name": "Microsoft.Insights.VMDiagnosticsSettings", 
            "apiVersion": "2015-05-01-preview", 
            "location": "[resourceGroup().location]", 
            "dependsOn": [ 
            "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]" 
            ], 
            "properties": { 
            "publisher": "Microsoft.Azure.Diagnostics", 
            "type": "IaaSDiagnostics", 
            "typeHandlerVersion": "1.4", 
            "autoUpgradeMinorVersion": true, 
            "settings": { 
                "WadCfg": { 
                "DiagnosticMonitorConfiguration": { 
    "overallQuotaInMB": 4096, 
    "DiagnosticInfrastructureLogs": { 
                    "scheduledTransferLogLevelFilter": "Error" 
        }, 
                    "Directories": { 
                    "scheduledTransferPeriod": "PT1M", 
    "IISLogs": { 
                        "containerName": "wad-iis-logfiles" 
                    }, 
                    "FailedRequestLogs": { 
                        "containerName": "wad-failedrequestlogs" 
                    } 
                    }, 
                    "PerformanceCounters": { 
                    "scheduledTransferPeriod": "PT1M", 
                    "sinks": "AzMonSink", 
                    "PerformanceCounterConfiguration": [ 
                        { 
                        "counterSpecifier": "\\Memory\\Available Bytes", 
                        "sampleRate": "PT15S" 
                        }, 
                        { 
                        "counterSpecifier": "\\Memory\\% Committed Bytes In Use", 
                        "sampleRate": "PT15S" 
                        }, 
                        { 
                        "counterSpecifier": "\\Memory\\Committed Bytes", 
                        "sampleRate": "PT15S" 
                        } 
                    ] 
                    }, 
                    "WindowsEventLog": { 
                    "scheduledTransferPeriod": "PT1M", 
                    "DataSource": [ 
                        { 
                        "name": "Application!*" 
                        } 
                    ] 
                    }, 
                    "Logs": { 
                    "scheduledTransferPeriod": "PT1M", 
                    "scheduledTransferLogLevelFilter": "Error" 
                    } 
                }, 
                "SinksConfig": { 
                    "Sink": [ 
                    { 
                        "name" : "AzMonSink", 
                        "AzureMonitor" : {} 
                    } 
                    ] 
                } 
                }, 
                "StorageAccount": "[variables('storageAccountName')]" 
            }, 
            "protectedSettings": { 
                "storageAccountName": "[variables('storageAccountName')]", 
                "storageAccountKey": "[listKeys(variables('accountid'),'2015-06-15').key1]", 
                "storageAccountEndPoint": "https://core.windows.net/" 
            } 
            } 
        } 
        ] 
//End of section to add 
```


Save and close both files 
 

## Deploy the Resource Manager template 

> [!NOTE]
> You must be running the Azure Diagnostics extension version 1.5 or higher AND have the "autoUpgradeMinorVersion": property set to ‘true’ in your Resource Manager template.  Azure then loads the proper extension when it starts the VM. If you do not have these settings in your template, change them and redeploy the template. 


To deploy the Resource Manager template we will leverage Azure PowerShell.  

1. Launch PowerShell 
1. Login to Azure using `Login-AzureRmAccount`
1. Get your list of subscriptions using `Get-AzureRmSubscription`
1. Set the subscription you will be creating/updating the virtual machine in 

   ```PowerShell
   Select-AzureRmSubscription -SubscriptionName "<Name of the subscription>" 
   ```
1. Create a new resource group for the VM being deployed, run the below command 

   ```PowerShell
    New-AzureRmResourceGroup -Name "<Name of Resource Group>" -Location "<Azure Region>" 
   ```
   > [!NOTE] 
   > Remember to [use an Azure region that is enabled for custom metrics](metrics-custom-overview.md). 
 
1. Execute the following commands to deploy the VM with the  
   > [!NOTE] 
   > If you wish to update an existing VM, simply add *-Mode Incremental* to the end of the following command. 
 
   ```PowerShell
   New-AzureRmResourceGroupDeployment -Name "<NameThisDeployment>" -ResourceGroupName "<Name of the Resource Group>" -TemplateFile "<File path of your Resource Manager template>" -TemplateParameterFile "<File path of your parameters file>" 
   ```
  
1. Once your deployment succeeds you should be able to find the VM in the Azure Portal, and it should be emitting metrics to Azure Monitor. 

   > [!NOTE] 
   > You may run into errors around the selected vmSkuSize. If this happens, go back to your azuredeploy.json file and update the default value of the vmSkuSize parameter. In this case, we recommend trying  "Standard_DS1_v2"). 

## Chart your metrics 

1. Log-in to the Azure Portal 

1. In the left-hand menu click **Monitor** 

1. On the Monitor page click **Metrics**. 

   ![Metrics page](./media/metrics-store-custom-rest-api/metrics.png) 

1. Change the aggregation period to **Last 30 minutes**.  

1. In the resource drop-down select the VM just created. If you didn't change the name in the template, it should be *SimpleWinVM2*.  

1. In the namespaces drop-down select **azure.vm.windows.guest** 

1. In the metrics drop down, select **Memory\%Committed Bytes in Use**.  
 

## Next steps
- Learn more about [custom metrics](metrics-custom-overview.md).