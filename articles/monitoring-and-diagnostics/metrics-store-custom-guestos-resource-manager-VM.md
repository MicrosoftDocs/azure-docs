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


## Setup Azure Monitor as a data sink 
The Azure Diagnostics extension uses a feature called “data sinks” to route metrics and logs to different locations.  Use the new data sink “Azure Monitor” for this process.  

The following steps show how to use a Resource Manager template and PowerShell to deploy a VM using the new “Azure Monitor” data sink. 


## Author Resource Manager template 
For this example, you can use a publicly available sample template. The starting templates are at
https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows 

- **Azuredeploy.json** is a pre-configured ARM template for deployment of a Virtual Machine. 

- **Azuredeploy.parameters.json** is a parameters file that stores information like what username and password you would like to set for your VM. During deployment the Resource Manager template uses the parameters set in this file. 

Alertnatively, the sample files with the modification listed in this are available at the following links. You will still have to skim the steps to fill in some variables.  

- [Modified **Azuredeploy.json**](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/monitoring-and-diagnostics/code/metrics-custom-guestos-resource-manager-VM/azuredeploy.json)

- [Modified **Azuredeploy.parameters.json**](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/monitoring-and-diagnostics/code/metrics-custom-guestos-resource-manager-VM/azuredeploy.parameters.json) 


### Steps to modify original template
1. Save both files locally. 

1. Open the *azuredeploy.parameters.json* file 

1. Enter values for *adminUsername* and *adminPassword* for the VM. These parameters are used for remote access to the VM. 

1. Open the *azuredeploy.json* file 

1. Add a storage account ID to the **variables** section of the template after the entry for **storageAccountName**.  

    [!code-json[](./code/metrics-custom-guestos-resource-manager-VM/azuredeploy.json?range=46-51&highlight=2)]

    ```json
    // Find these lines 
    "variables": { 
        "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'sawinvm')]", 
    
    // Add this line directly below.  
        "accountid": "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]", 
    ```
1. Add this Managed Service Identity (MSI) extension to the template at the top of the "resources" section.  The extension ensures that Azure Monitor accepts the metrics being emitted.  

    [!code-json[extension](./code/metrics-custom-guestos-resource-manager-VM/azuredeploy.json?range=56-77&highlight=3-19)]

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

1. Add the "identity" configuration to the VM resource to ensure Azure assigns the MSI extension a system identity. This step ensures the VM can emit guest metrics about itself to Azure Monitor 

    [!code-json[storageaccount](./code/metrics-custom-guestos-resource-manager-VM/azuredeploy.json?range=145-157&highlight=7-9)]

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

          "dependsOn": [
            "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
            "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
          ],
          "properties": {
            "hardwareProfile": {   
            ...
    ```

1. Add the following configuration to enable the diagnostics extension on a Windows Virtual Machine.  For a simple Resource Manager-based Virtual Machine, we can add the extension configuration to the resources array for the Virtual Machine. The highlighted sections enable the extension to emit metrics directly to Azure Monitor. Feel free to add/remove performance counters as needed 

```json
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

Note: You must be running the Azure Diagnostics extension version 1.5 or higher AND have the "autoUpgradeMinorVersion": property set to ‘true’ in your Resource Manager template.  Azure then loads the proper extension when it starts the VM. If you do not have these settings in your template, change them and redeploy the template. 

 

## Deploy the ARM template 

To deploy the ARM template we will leverage Azure PowerShell.  

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

   Note: Remember to use an Azure region that is enabled for custom metrics. 
 
1. Execute the following commands to deploy the VM with the  

   ```PowerShell
   New-AzureRmResourceGroupDeployment -Name "<NameThisDeployment>" -ResourceGroupName "<Name of the Resource Group>" -TemplateFile "<File path of your ARM template>" -TemplateParameterFile "File path of your parameters file>" 
   ```
   Note: If you wish to update an existing VM, simply add ‘-Mode Incremental’ to the end of the above command 
 
1. Once your deployment succeeds you should be able to find the VM in the Azure Portal, and it should be emitting metrics to Azure Monitor. 

    Note: You may run into errors around the selected vmSkuSize. If this happens, go back to your azuredeploy.json file and update the default value of the vmSkuSize parameter (we recommend “Standard_DS1_v2”). 


## Chart your metrics 

1. Log-in to the Azure Portal 
1. In the left-hand menu click **Monitor** 
1. On the Monitor page click **Metrics (preview)**. 
1. Change the aggregation period to **Last 30 minutes**.  
1. In the resource drop-down select the VM just created. If you didn't change the name in the template, it should be *SimpleWinVM2*.  
1. In the namespaces drop-down select **azure.vm.windows.guest** 
1. In the metrics drop down, select **Memory\%Committed Bytes in Use**.  

You should see something like the screen shot below.  


## Next steps
- Learn more about [alerts](monitoring-overview-alerts.md).


[!code-csharp[](intro/samples/cu/Controllers/StudentsController.cs?name=snippet_Create&highlight=4,6-7,14-21)]`