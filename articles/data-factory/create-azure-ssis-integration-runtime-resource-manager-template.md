---
title: Use an Azure Resource Manager template to create an integration runtime 
description: Learn how to use an Azure Resource Manager template to create an Azure-SSIS integration runtime in Azure Data Factory so you can deploy and run SSIS packages in Azure.
ms.service: data-factory
ms.subservice: integration-services
ms.custom: devx-track-arm-template
ms.topic: conceptual
ms.date: 04/12/2023
author: chugugrace
ms.author: chugu 
---

# Use an Azure Resource Manager template to create an integration runtime

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In this section, you use an Azure Resource Manager template to create the Azure-SSIS integration runtime in Azure Data Factory. 

## Sample Azure Resource Manager template

>[!NOTE] 
> For Azure-SSIS IR in Azure Synapse Analytics, use corresponding Azure Synapse Analytics ARM template [Microsoft.Synapse workspaces/integrationRuntimes](/azure/templates/microsoft.synapse/workspaces/integrationruntimes), and corresponding Azure Synapse Analytics PowerShell interfaces: [Set-AzSynapseIntegrationRuntime (Az.Synapse)](/powershell/module/az.synapse/set-azsynapseintegrationruntime), [Start-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/start-azsynapseintegrationruntime) and [Stop-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/stop-azsynapseintegrationruntime).

Following are steps to create an Azure-SSIS integration runtime with an Azure Resource Manager template:

1. Create a JSON file with the following Azure Resource Manager template. Replace values in the angle brackets (placeholders) with your own values.

    ```json
    {
        "contentVersion": "1.0.0.0",
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "parameters": {},
        "variables": {},
        "resources": [{
            "name": "<Specify a name for your data factory>",
            "apiVersion": "2018-06-01",
            "type": "Microsoft.DataFactory/factories",
            "location": "East US",
            "properties": {},
            "resources": [{
                "type": "integrationruntimes",
                "name": "<Specify a name for your Azure-SSIS IR>",
                "dependsOn": [ "<The name of the data factory you specified at the beginning>" ],
                "apiVersion": "2018-06-01",
                "properties": {
                    "type": "Managed",
                    "typeProperties": {
                        "computeProperties": {
                            "location": "East US",
                            "nodeSize": "Standard_D8_v3",
                            "numberOfNodes": 1,
                            "maxParallelExecutionsPerNode": 8
                        },
                        "ssisProperties": {
                            "catalogInfo": {
                                "catalogServerEndpoint": "<Azure SQL Database server name>.database.windows.net",
                                "catalogAdminUserName": "<Azure SQL Database server admin username>",
                                "catalogAdminPassword": {
                                    "type": "SecureString",
                                    "value": "<Azure SQL Database server admin password>"
                                },
                                "catalogPricingTier": "Basic"
                            }
                        }
                    }
                }
            }]
        }]
    }
    ```

2. To deploy the Azure Resource Manager template, run the `New-AzResourceGroupDeployment` command as shown in the following example. In the example, `ADFTutorialResourceGroup` is the name of your resource group. `ADFTutorialARM.json` is the file that contains the JSON definition for your data factory and the Azure-SSIS IR.

    ```powershell
    New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json
    ```

    This command creates your data factory and Azure-SSIS IR in it, but it doesn't start the IR.

3. To start your Azure-SSIS IR, run the `Start-AzDataFactoryV2IntegrationRuntime` command:

    ```powershell
    Start-AzDataFactoryV2IntegrationRuntime -ResourceGroupName "<Resource Group Name>" `
        -DataFactoryName "<Data Factory Name>" `
        -Name "<Azure SSIS IR Name>" `
        -Force
    ```

> [!NOTE]
> Excluding any custom setup time, this process should finish within 5 minutes. But it might take 20-30 minutes for the Azure-SSIS IR to join a virtual network.
>
> If you use SSISDB, the Data Factory service will connect to your database server to prepare SSISDB. It also configures permissions and settings for your virtual network, if specified, and joins your Azure-SSIS IR to the virtual network.
> 
> When you provision an Azure-SSIS IR, Access Redistributable and Azure Feature Pack for SSIS are also installed. These components provide connectivity to Excel files, Access files, and various Azure data sources, in addition to the data sources that built-in components already support. For more information about built-in/preinstalled components, see [Built-in/preinstalled components on Azure-SSIS IR](./built-in-preinstalled-components-ssis-integration-runtime.md). For more information about additional components that you can install, see [Custom setups for Azure-SSIS IR](./how-to-configure-azure-ssis-ir-custom-setup.md).


## Next steps

- [Learn how to provision an Azure-SSIS IR using the Azure portal](create-azure-ssis-integration-runtime-portal.md).
- [Learn how to provision an Azure-SSIS IR using Azure PowerShell](create-azure-ssis-integration-runtime-powershell.md).
- [Deploy and run your SSIS packages in Azure Data Factory](create-azure-ssis-integration-runtime-deploy-packages.md).

See other Azure-SSIS IR topics in this documentation:

- [Azure-SSIS integration runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides information about integration runtimes in general, including Azure-SSIS IR.
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
- [Deploy, run, and monitor SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial)   
- [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth) 
- [Schedule package executions in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)
