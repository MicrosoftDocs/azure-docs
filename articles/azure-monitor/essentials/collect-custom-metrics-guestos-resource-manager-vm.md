---
title: Collect Windows VM metrics in Azure Monitor with a template
description: Send guest OS metrics to the Azure Monitor metric database store by using a Resource Manager template for a Windows virtual machine.
author: anirudhcavale
services: azure-monitor
ms.reviewer: shijain
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 09/28/2023
ms.author: bwren
---
# Send guest OS metrics to the Azure Monitor metrics store by using an ARM template for a Windows VM

Performance data from the guest OS of Azure virtual machines (VMs) isn't collected automatically like other [platform metrics](./monitor-azure-resource.md#monitoring-data). Install the Azure Monitor [Diagnostics extension](../agents/diagnostics-extension-overview.md) to collect guest OS metrics into the metrics database so that it can be used with all features of Azure Monitor Metrics. These features include near real time alerting, charting, routing, and access from a REST API. This article describes the process for sending guest OS performance metrics for a Windows VM to the metrics database by using an Azure Resource Manager template (ARM template).

> [!NOTE]
> For details on configuring the diagnostics extension to collect guest OS metrics by using the Azure portal, see [Install and configure the Windows Azure Diagnostics (WAD) extension](../agents/diagnostics-extension-windows-install.md).

If you're new to ARM templates, learn about [template deployments](../../azure-resource-manager/management/overview.md) and their structure and syntax.

## Prerequisites

- Your subscription must be registered with [Microsoft.Insights](../../azure-resource-manager/management/resource-providers-and-types.md).
- You need to have either [Azure PowerShell](/powershell/azure) or [Azure Cloud Shell](../../cloud-shell/overview.md) installed.
- Your VM resource must be in a [region that supports custom metrics](./metrics-custom-overview.md#supported-regions).

## Set up Azure Monitor as a data sink
The Azure Diagnostics extension uses a feature called *data sinks* to route metrics and logs to different locations. The following steps show how to use an ARM template and PowerShell to deploy a VM by using the new Azure Monitor data sink.

## ARM template
For this example, you can use a publicly available sample template. The starting templates are on
[GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-simple-windows).

- **Azuredeploy.json**: A preconfigured ARM template for the deployment of a VM.
- **Azuredeploy.parameters.json**: A parameters file that stores information like what user name and password you want to set for your VM. During deployment, the ARM template uses the parameters that are set in this file.

Download and save both files locally.

### Modify azuredeploy.parameters.json
1. Open the *azuredeploy.parameters.json* file.

1. Enter values for `adminUsername` and `adminPassword` for the VM. These parameters are used for remote access to the VM. To avoid having your VM hijacked, *don't* use the values in this template. Bots scan the internet for user names and passwords in public GitHub repositories. They're likely to be testing VMs with these defaults.

1. Create a unique `dnsname` for the VM.

### Modify azuredeploy.json

1. Open the *azuredeploy.json* file.

1. Add a storage account ID to the `variables` section of the template after the entry for `storageAccountName`.
    
    ```json
    // Find these lines.
    "variables": {
        "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'sawinvm')]",
    
    // Add this line directly below.
        "accountid": "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
    ```
    
1. Add this Managed Service Identity (MSI) extension to the template at the top of the `resources` section. The extension ensures that Azure Monitor accepts the metrics that are being emitted.

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

1. Add the `identity` configuration to the VM resource to ensure that Azure assigns a system identity to the MSI extension. This step ensures that the VM can emit guest metrics about itself to Azure Monitor.

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

1. Add the following configuration to enable the diagnostics extension on a Windows VM. For a simple Resource Manager-based VM, you can add the extension configuration to the resources array for the VM. The line `"sinks": "AzMonSink"`, and the corresponding `"SinksConfig"` later in the section, enable the extension to emit metrics directly to Azure Monitor. Feel free to add or remove performance counters as needed.
    
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
                "type": "Microsoft.Compute/virtualMachines/extensions",
                "name": "[concat(variables('vmName'), '/', 'Microsoft.Insights.VMDiagnosticsSettings')]",
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

1. Save and close both files.

## Deploy the ARM template

> [!NOTE]
> You must be running Azure Diagnostics extension version 1.5 or higher *and* have the `autoUpgradeMinorVersion:` property set to `true` in your ARM template. Azure then loads the proper extension when it starts the VM. If you don't have these settings in your template, change them and redeploy the template.

To deploy the ARM template, we use Azure PowerShell.

1. Start PowerShell.
1. Sign in to Azure by using `Login-AzAccount`.
1. Get your list of subscriptions by using `Get-AzSubscription`.
1. Set the subscription that you're using to create/update the VM in:

   ```powershell
   Select-AzSubscription -SubscriptionName "<Name of the subscription>"
   ```

1. To create a new resource group for the VM that's being deployed, run the following command:

   ```powershell
    New-AzResourceGroup -Name "<Name of Resource Group>" -Location "<Azure Region>"
   ```

    > [!NOTE]
    > Remember to [use an Azure region that's enabled for custom metrics](./metrics-custom-overview.md).

1. Run the following commands to deploy the VM by using the ARM template.
   > [!NOTE]
   > If you want to update an existing VM, add *-Mode Incremental* to the end of the following command.

   ```powershell
   New-AzResourceGroupDeployment -Name "<NameThisDeployment>" -ResourceGroupName "<Name of the Resource Group>" -TemplateFile "<File path of your Resource Manager template>" -TemplateParameterFile "<File path of your parameters file>"
   ```

1. After your deployment succeeds, the VM should be in the Azure portal, emitting metrics to Azure Monitor.

   > [!NOTE]
   > You might run into errors around the selected `vmSkuSize`. If this error happens, go back to your *azuredeploy.json* file and update the default value of the `vmSkuSize` parameter. In this case, we recommend that you try `"Standard_DS1_v2"`).

## Chart your metrics

1. Sign in to the Azure portal.

1. On the left menu, select **Monitor**.

1. On the **Monitor** page, select **Metrics**.

   :::image type="content" source="media/collect-custom-metrics-guestos-resource-manager-vm/metrics.png" lightbox="media/collect-custom-metrics-guestos-resource-manager-vm/metrics.png" alt-text="Screenshot that shows the Metrics page.":::

1. Change the aggregation period to **Last 30 minutes**.

1. In the resource dropdown menu, select the VM that you created. If you didn't change the name in the template, it should be **SimpleWinVM2**.

1. In the namespaces dropdown list, select **azure.vm.windows.guestmetrics**.

1. In the metrics dropdown list, select **Memory\%Committed Bytes in Use**.

## Next steps
Learn more about [custom metrics](./metrics-custom-overview.md).
