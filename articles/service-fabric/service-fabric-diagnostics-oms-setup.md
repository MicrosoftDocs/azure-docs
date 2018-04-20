---
title: Azure Service Fabric - Set up monitoring with Log Analytics | Microsoft Docs
description: Learn how to set up Log Analytics for visualizing and analyzing events to monitor your Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 3/30/2018
ms.author: dekapur; srrengar

---

# Set up Log Analytics for a cluster

You can set up a Log Analytics workspace through Azure Resource Manager, PowerShell, or Azure Marketplace. If you maintain an updated Resource Manager template of your deployment for future use, use the same template to set up your OMS environment. Deployment via Marketplace is easier if you already have a cluster deployed with diagnostics enabled. If you do not have subscription-level access in the account to which you are deploying OMS, deploy by using PowerShell or the Resource Manager template.

> [!NOTE]
> To set up Log Analytics to monitor your cluster, you need to have diagnostics enabled to view cluster-level or platform-level events.

## Deploy OMS by using Azure Marketplace

If you want to add an OMS workspace after you have deployed a cluster, go to Azure Marketplace in the portal and look for **Service Fabric Analytics**:

1. Select **New** on the left navigation menu. 

2. Search for **Service Fabric Analytics**. Select the resource that appears.

3. Select **Create**.

    ![OMS SF Analytics in Marketplace](media/service-fabric-diagnostics-event-analysis-oms/service-fabric-analytics.png)

4. In the Service Fabric Analytics creation window, select **Select a workspace** for the **OMS Workspace** field, and then **Create a new workspace**. Fill out the required entries. The only requirement here is that the subscription for the Service Fabric cluster and the OMS workspace is the same. When your entries have been validated, your OMS workspace starts to deploy. The deployment takes only a few minutes.

5. When finished, select **Create** again at the bottom of the Service Fabric Analytics creation window. Make sure that the new workspace shows up under **OMS Workspace**. This action adds the solution to the workspace you created.

If you are using Windows, continue with the following steps to connect OMS to the storage account where your cluster events are stored. 

>[!NOTE]
>Enabling this experience for Linux clusters is not yet available. 

### Connect the OMS Workspace to your cluster 

1. The workspace needs to be connected to the diagnostics data coming from your cluster. Go to the resource group in which you created the Service Fabric Analytics solution. Select **ServiceFabric\<nameOfOMSWorkspace\>** and go to its overview page. From there, you can change solution settings, workspace settings, and access the OMS portal.

2. On the left navigation menu, under **Workspace Data Sources**, select **Storage accounts logs**.

3. On the **Storage account logs** page, select **Add** at the top to add your cluster's logs to the workspace.

4. Select **Storage account** to add the appropriate account created in your cluster. If you used the default name, the storage account is **sfdg\<resourceGroupName\>**. You can also confirm this with the Azure Resource Manager template used to deploy your cluster, by checking the value used for **applicationDiagnosticsStorageAccountName**. If the name does not show up, scroll down and select **Load more**. Select the storage account name.

5. Specify the Data Type. Set it to **Service Fabric Events**.

6. Ensure that the Source is automatically set to **WADServiceFabric\*EventTable**.

7. Select **OK** to connect your workspace to your cluster's logs.

    ![Add storage account logs to OMS](media/service-fabric-diagnostics-event-analysis-oms/add-storage-account.png)

The account now shows up as part of your storage account logs in your workspace's data sources.

You have added the Service Fabric Analytics solution in an OMS Log Analytics workspace that's now correctly connected to your cluster's platform and application log table. You can add additional sources to the workspace in the same way.


## Deploy OMS by using a Resource Manager template

When you deploy a cluster by using a Resource Manager template, the template creates a new OMS workspace, adds the Service Fabric solution to the workspace, and configures it to read data from the appropriate storage tables.

You can use and modify [this sample template](https://github.com/krnese/azure-quickstart-templates/tree/master/service-fabric-oms) to meet your requirements.

Make the following modifications:
1. Add `omsWorkspaceName` and `omsRegion` to your parameters by adding the following snippet to the parameters defined in your *template.json* file. Feel free to modify the default values as you see fit. Also, add the two new parameters in your *parameters.json* file to define their values for the resource deployment:
    
    ```json
    "omsWorkspacename": {
        "type": "string",
        "defaultValue": "sfomsworkspace",
        "metadata": {
            "description": "Name of your OMS Log Analytics Workspace"
        }
    },
    "omsRegion": {
        "type": "string",
        "defaultValue": "East US",
        "allowedValues": [
            "West Europe",
            "East US",
            "Southeast Asia"
        ],
        "metadata": {
            "description": "Specify the Azure Region for your OMS workspace"
        }
    }
    ```

    The `omsRegion` values have to conform to a specific set of the values. Choose the one that is closest to the deployment of your cluster.

2. If you send any application logs to OMS, first confirm that the `applicationDiagnosticsStorageAccountType` and `applicationDiagnosticsStorageAccountName` are included as parameters in your template. If they are not included, add them to the variables section and edit their values as needed. You can also include them as parameters by following the preceding format.

    ```json
    "applicationDiagnosticsStorageAccountType": "Standard_LRS",
    "applicationDiagnosticsStorageAccountName": "[toLower(concat('oms', uniqueString(resourceGroup().id), '3' ))]"
    ```

3. Add the Service Fabric OMS solution to your template's variables:

    ```json
    "solution": "[Concat('ServiceFabric', '(', parameters('omsWorkspacename'), ')')]",
    "solutionName": "ServiceFabric"
    ```

4. Add the following to the end of your resources section, after where the Service Fabric cluster resource is declared:

    ```json
    {
        "apiVersion": "2015-11-01-preview",
        "location": "[parameters('omsRegion')]",
        "name": "[parameters('omsWorkspacename')]",
        "type": "Microsoft.OperationalInsights/workspaces",
        "properties": {
            "sku": {
                "name": "Free"
            }
        },
        "resources": [
            {
                "apiVersion": "2015-11-01-preview",
                "name": "[concat(parameters('applicationDiagnosticsStorageAccountName'),parameters('omsWorkspacename'))]",
                "type": "storageinsightconfigs",
                "dependsOn": [
                    "[concat('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]",
                    "[concat('Microsoft.Storage/storageAccounts/', parameters('applicationDiagnosticsStorageAccountName'))]"
                ],
                "properties": {
                    "containers": [ ],
                    "tables": [
                        "WADServiceFabric*EventTable",
                        "WADWindowsEventLogsTable",
                        "WADETWEventTable"
                    ],
                    "storageAccount": {
                        "id": "[resourceId('Microsoft.Storage/storageaccounts/', parameters('applicationDiagnosticsStorageAccountName'))]",
                        "key": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('applicationDiagnosticsStorageAccountName')),'2015-06-15').key1]"
                    }
                }
            }
        ]
    },
    {
        "apiVersion": "2015-11-01-preview",
        "location": "[parameters('omsRegion')]",
        "name": "[variables('solution')]",
        "type": "Microsoft.OperationsManagement/solutions",
        "id": "[resourceId('Microsoft.OperationsManagement/solutions/', variables('solution'))]",
        "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('OMSWorkspacename'))]"
        ],
        "properties": {
            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]"
        },
        "plan": {
            "name": "[variables('solution')]",
            "publisher": "Microsoft",
            "product": "[Concat('OMSGallery/', variables('solutionName'))]",
            "promotionCode": ""
        }
    }
    ```
    
    > [!NOTE]
    > If you added the `applicationDiagnosticsStorageAccountName` as a variable, make sure to modify each reference to it to `variables('applicationDiagnosticsStorageAccountName')` instead of `parameters('applicationDiagnosticsStorageAccountName')`.

5. Deploy the template as a Resource Manager upgrade to your cluster by using the `New-AzureRmResourceGroupDeployment` API in the AzureRM PowerShell module. An example command would be:

    ```powershell
    New-AzureRmResourceGroupDeployment -ResourceGroupName "sfcluster1" -TemplateFile "<path>\template.json" -TemplateParameterFile "<path>\parameters.json"
    ``` 

    Azure Resource Manager detects that this command is an update to an existing resource. It only processes the changes between the template driving the existing deployment and the new template provided.

## Deploy OMS by using Azure PowerShell

You can also deploy your OMS Log Analytics resource via PowerShell by using the `New-AzureRmOperationalInsightsWorkspace` command. To use this method, make sure you have installed [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-5.1.1). Use this script to create a new OMS Log Analytics workspace and add the Service Fabric solution to it: 

```PowerShell

$SubscriptionName = "<Name of your subscription>"
$ResourceGroup = "<Resource group name>"
$Location = "<Resource group location>"
$WorkspaceName = "<OMS Log Analytics workspace name>"
$solution = "ServiceFabric"

# Log in to Azure and access the correct subscription
Connect-AzureRmAccount
Select-AzureRmSubscription -SubscriptionId $SubID 

# Create the resource group if needed
try {
    Get-AzureRmResourceGroup -Name $ResourceGroup -ErrorAction Stop
} catch {
    New-AzureRmResourceGroup -Name $ResourceGroup -Location $Location
}

New-AzureRmOperationalInsightsWorkspace -Location $Location -Name $WorkspaceName -Sku Standard -ResourceGroupName $ResourceGroup
Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName $ResourceGroup -WorkspaceName $WorkspaceName -IntelligencePackName $solution -Enabled $true

```

When you're done, follow the steps in the preceding section to connect OMS Log Analytics to the appropriate storage account.

You can also add other solutions or make other modifications to your OMS workspace by using PowerShell. To learn more, see [Manage Log Analytics using PowerShell](../log-analytics/log-analytics-powershell-workspace-configuration.md).

## Next steps
* [Deploy the OMS Agent](service-fabric-diagnostics-oms-agent.md) onto your nodes to gather performance counters and collect docker stats and logs for your containers
* Get familiarized with the [log search and querying](../log-analytics/log-analytics-log-searches.md) features offered as part of Log Analytics
* [Use View Designer to create custom views in Log Analytics](../log-analytics/log-analytics-view-designer.md)
