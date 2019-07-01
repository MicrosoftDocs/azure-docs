---
title: Send Guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows virtual machine
description: Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows virtual machine
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ancav
ms.subservice: metrics
---
# Send Guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows virtual machine

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

By using the Azure Monitor [Diagnostics extension](diagnostics-extension-overview.md), you can collect metrics and logs from the guest operating system (Guest OS) that's running as part of a virtual machine, cloud service, or Service Fabric cluster. The extension can send telemetry to [many different locations.](https://docs.microsoft.com/azure/monitoring/monitoring-data-collection?toc=/azure/azure-monitor/toc.json)

This article describes the process for sending Guest OS performance metrics for a Windows virtual machine to the Azure Monitor data store. Starting with Diagnostics version 1.11, you can write metrics directly to the Azure Monitor metrics store, where standard platform metrics are already collected.

Storing them in this location allows you to access the same actions for platform metrics. Actions include near-real time alerting, charting, routing, and access from a REST API and more. In the past, the Diagnostics extension wrote to Azure Storage, but not to the Azure Monitor data store.

If you're new to Resource Manager templates, learn about [template deployments](../../azure-resource-manager/resource-group-overview.md) and their structure and syntax.

## Prerequisites

- Your subscription must be registered with [Microsoft.Insights](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-supported-services).

- You need to have either [Azure PowerShell](/powershell/azure) or [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) installed.


## Set up Azure Monitor as a data sink
The Azure Diagnostics extension uses a feature called "data sinks" to route metrics and logs to different locations. The following steps show how to use a Resource Manager template and PowerShell to deploy a VM by using the new "Azure Monitor" data sink.

## Author Resource Manager template
For this example, you can use a publicly available sample template. The starting templates are at
https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows.

- **Azuredeploy.json** is a preconfigured Resource Manager template for the deployment of a virtual machine.

- **Azuredeploy.parameters.json** is a parameters file that stores information such as what user name and password you would like to set for your VM. During deployment, the Resource Manager template uses the parameters that are set in this file.

Download and save both files locally.

### Modify azuredeploy.parameters.json
Open the *azuredeploy.parameters.json* file

1. Enter values for **adminUsername** and **adminPassword** for the VM. These parameters are used for remote access to the VM. To avoid having your VM hijacked, DO NOT use the values in this template. Bots scan the internet for user names and passwords in public GitHub repositories. They are likely to be testing VMs with these defaults.

1. Create a unique dnsname for the VM.

### Modify azuredeploy.json

Open the *azuredeploy.json* file

Add a storage account ID to the **variables** section of the template after the entry for **storageAccountName.**

```json
// Find these lines.
"variables": {
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'sawinvm')]",

// Add this line directly below.
    "accountid": "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
```

Add this Managed Service Identity (MSI) extension to the template at the top of the **resources** section. The extension ensures that Azure Monitor accepts the metrics that are being emitted.

```json
//Find this code.
"resources": [
// Add this code directly below.
    {
        "type": "Microsoft.Compute/virtualMachines/extensions",
        "name": "[concat(variables('vmName'), '/', 'WADExtensionSetup')]",
        "apiVersion": "2017-12-01",
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

Add the **identity** configuration to the VM resource to ensure that Azure assigns a system identity to the MSI extension. This step ensures that the VM can emit guest metrics about itself to Azure Monitor.

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

Add the following configuration to enable the Diagnostics extension on a Windows virtual machine. For a simple Resource Manager-based virtual machine, we can add the extension configuration to the resources array for the virtual machine. The line "sinks"&mdash; "AzMonSink" and the corresponding "SinksConfig" later in the section&mdash;enable the extension to emit metrics directly to Azure Monitor. Feel free to add or remove performance counters as needed.


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
            "apiVersion": "2017-12-01",
            "location": "[resourceGroup().location]",
            "dependsOn": [
            "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
            ],
            "properties": {
            "publisher": "Microsoft.Azure.Diagnostics",
            "type": "IaaSDiagnostics",
            "typeHandlerVersion": "1.12",
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


Save and close both files.


## Deploy the Resource Manager template

> [!NOTE]
> You must be running the Azure Diagnostics extension version 1.5 or higher AND have the **autoUpgradeMinorVersion**: property set to ‘true’ in your Resource Manager template. Azure then loads the proper extension when it starts the VM. If you don't have these settings in your template, change them and redeploy the template.


To deploy the Resource Manager template, we leverage Azure PowerShell.

1. Launch PowerShell.
1. Log in to Azure using `Login-AzAccount`.
1. Get your list of subscriptions by using `Get-AzSubscription`.
1. Set the subscription that you're using to create/update the virtual machine in:

   ```powershell
   Select-AzSubscription -SubscriptionName "<Name of the subscription>"
   ```
1. To create a new resource group for the VM that's being deployed, run the following command:

   ```powershell
    New-AzResourceGroup -Name "<Name of Resource Group>" -Location "<Azure Region>"
   ```
   > [!NOTE]
   > Remember to [use an Azure region that is enabled for custom metrics](metrics-custom-overview.md).

1. Run the following commands to deploy the VM using the Resource Manager template.
   > [!NOTE]
   > If you wish to update an existing VM, simply add *-Mode Incremental* to the end of the following command.

   ```powershell
   New-AzResourceGroupDeployment -Name "<NameThisDeployment>" -ResourceGroupName "<Name of the Resource Group>" -TemplateFile "<File path of your Resource Manager template>" -TemplateParameterFile "<File path of your parameters file>"
   ```

1. After your deployment succeeds, the VM should be in the Azure portal, emitting metrics to Azure Monitor.

   > [!NOTE]
   > You might run into errors around the selected vmSkuSize. If this happens, go back to your azuredeploy.json file, and update the default value of the vmSkuSize parameter. In this case, we recommend trying "Standard_DS1_v2").

## Chart your metrics

1. Log in to the Azure portal.

2. On the left menu, select **Monitor**.

3. On the Monitor page, select **Metrics**.

   ![Metrics page](media/collect-custom-metrics-guestos-resource-manager-vm/metrics.png)

4. Change the aggregation period to **Last 30 minutes**.

5. In the resource drop-down menu, select the VM that you created. If you didn't change the name in the template, it should be *SimpleWinVM2*.

6. In the namespaces drop-down menu, select **azure.vm.windows.guest**

7. In the metrics drop down menu, select **Memory\%Committed Bytes in Use**.


## Next steps
- Learn more about [custom metrics](metrics-custom-overview.md).

