---
title: Azure Service Fabric - Setting up Monitoring with OMS Log Analytics | Microsoft Docs
description: Learn how to set up OMS for visualizing and analyzing events for monitoring your Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/31/2017
ms.author: dekapur

---

# Set up OMS Log Analytics for a cluster

You can set up an OMS workspace through Azure Resource Manager or from Azure Marketplace. Use the former when you want to maintain a template of your deployment for future use. Deploying via Marketplace is easier if you already have a cluster deployed with Diagnostics enabled.

> [!NOTE]
> You need to have Diagnostics enabled for your cluster to view cluster / platform level events to be able to set up OMS to successfully monitor your cluster.

## Deploying OMS using a Resource Manager template

When deploying a cluster using a Resource Manager template, the template should create a new OMS workspace, add the Service Fabric Solution to it, and configure it to read data from the appropriate storage tables.

[Here](https://azure.microsoft.com/resources/templates/service-fabric-oms/) is a sample template that you can use and modify as per requirements. More templates that give you different options for setting up an OMS workspace can be found at [Service Fabric and OMS templates](https://azure.microsoft.com/resources/templates/?term=service+fabric+OMS).

The main changes made are the following:

1. Add `omsWorkspaceName` and `omsRegion` to your parameters. This means adding the following snippet to the parameters defined in your *template.json* file. Feel free to modify the default values as you see fit. You should also add the two new parameters in your *parameters.json* to define their values for the resource deployment:
    
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

    The `omsRegion` values have to conform to a specific set of the values. You should pick the one that is closest to the deployment of your cluster.

2. If you will be sending any application logs to OMS, confirm that the `applicationDiagnosticsStorageAccountType` and `applicationDiagnosticsStorageAccountName` are included as parameters in your template. If they are not, add them to the variables section like so and edit their values as needed. You can also include them as parameters, if you would like, following the format used above.

    ```json
    "applicationDiagnosticsStorageAccountType": "Standard_LRS",
    "applicationDiagnosticsStorageAccountName": "[toLower(concat('oms', uniqueString(resourceGroup().id), '3' ))]",
    ```

3. Add the Service Fabric OMS solution to your template's variables:

    ```json
    "solution": "[Concat('ServiceFabric', '(', parameters('omsWorkspacename'), ')')]",
    "solutionName": "ServiceFabric",
    ```

4. Adding the following to the end of your resources section, after where the Service Fabric cluster resource is declared.

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
                "name": "[concat(variables('applicationDiagnosticsStorageAccountName'),parameters('omsWorkspacename'))]",
                "type": "storageinsightconfigs",
                "dependsOn": [
                    "[concat('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]",
                    "[concat('Microsoft.Storage/storageAccounts/', variables('applicationDiagnosticsStorageAccountName'))]"
                ],
                "properties": {
                    "containers": [ ],
                    "tables": [
                        "WADServiceFabric*EventTable",
                        "WADWindowsEventLogsTable",
                        "WADETWEventTable"
                    ],
                    "storageAccount": {
                        "id": "[resourceId('Microsoft.Storage/storageaccounts/', variables('applicationDiagnosticsStorageAccountName'))]",
                        "key": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('applicationDiagnosticsStorageAccountName')),'2015-06-15').key1]"
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

5. Deploy the template as an Resource Manager upgrade to your cluster. This is done using the `New-AzureRmResourceGroupDeployment` API in the AzureRM PowerShell module. An example command would be:

    ```powershell
    New-AzureRmResourceGroupDeployment -ResourceGroupName "sfcluster1" -TemplateFile "<path>\template.json" -TemplateParameterFile "<path>\parameters.json"
    ``` 

    Azure Resource Manager will be able to detect that this is an update to an existing resource. It will only process the changes between the template driving the existing deployment and the new template provided.

## Deploying OMS using Azure Marketplace

If you prefer to add an OMS workspace after you have deployed a cluster, head over to Azure Marketplace (in the Portal) and look for *"Service Fabric Analytics"*.

1. Click on **New** on the left navigation menu. 

2. Search for *Service Fabric Analytics*. Click on the resource that shows up.

3. Click on **Create**

    ![OMS SF Analytics in Marketplace](media/service-fabric-diagnostics-event-analysis-oms/service-fabric-analytics.png)

4. In the Service Fabric Analytics creation window, click **Select a workspace** for the *OMS Workspace* field, and then **Create a new workspace**. Fill out the required entries - the only requirement here is that the subscription for the Service Fabric cluster and the OMS workspace should be the same. Once your entries have been validated, your OMS workspace will start to deploy. This should only take a few minutes.

5. When finished, click **Create** again at the bottom of the Service Fabric Analytics creation window. Make sure that the new workspace shows up under *OMS Workspace*. This will add the solution to the workspace you just created.

6. The workspace still needs to be connected to the diagnostics data coming from your cluster. Navigate to the resource group you created the Service Fabric Analytics solution in. You should see a *ServiceFabric(\<nameOfOMSWorkspace\>)*. Click on the solution to navigate to its overview page, from where you can change solution settings, workspace settings, and navigate to the OMS portal.

7. On the left navigation menu, click on **Storage accounts logs**, under *Workspace Data Sources*.

8. On the *Storage account logs* page, click **Add** at the top to add your cluster's logs to the workspace.

9. Click into **Storage account** to add the appropriate account created in your cluster. If you used the default name, the storage account is named *sfdg\<resourceGroupName\>*. You can also confirm this by checking the Azure Resource Manager template used to deploy your cluster, by checking the value used for the `applicationDiagnosticsStorageAccountName`. You may also have to scroll down and click **Load more** if the name does not show up. Click on the right storage account name up to select it.

10. Next, you'll have to specify the *Data Type*, which should be set to **Service Fabric Events**.

11. The *Source* should automatically be set to *WADServiceFabric\*EventTable*.

12. Click **OK** to connect your workspace to your cluster's logs.

    ![Add storage account logs to OMS](media/service-fabric-diagnostics-event-analysis-oms/add-storage-account.png)

The account should now show up as part of your *Storage account logs* in your workspace's data sources.

With this you have now added the Service Fabric Analytics solution in an OMS Log Analytics workspace that is now correctly connected to your cluster's platform and application log table. You can add additional sources to the workspace in the same way.

## Next Steps
* [Deploy the OMS Agent](service-fabric-diagnostics-oms-agent.md) onto your nodes to gather performance counters and collect docker stats and logs for your containers
* Get familiarized with the [log search and querying](../log-analytics/log-analytics-log-searches.md) features offered as part of Log Analytics
* [Use View Designer to create custom views in Log Analytics](../log-analytics/log-analytics-view-designer.md)
