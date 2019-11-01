---
title: 'Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template'
description: Learn how to create an Azure Data Explorer cluster and database by using an Azure Resource Manager template
author: orspod
ms.author: orspodek 
ms.reviewer: oflipman
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/26/2019
---

# Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template

> [!div class="op_single_selector"]
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
> * [ARM template](create-cluster-database-resource-manager.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. 

In this article, you create an Azure Data Explorer cluster and database by using an [Azure Resource Manager template](../azure-resource-manager/resource-group-overview.md). The article shows how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements. For information about creating templates, see [authoring Azure Resource Manager templates](/azure/azure-resource-manager/resource-group-authoring-templates). For the JSON syntax and properties to use in a template, see [Microsoft.Kusto resource types](/azure/templates/microsoft.kusto/allversions).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Azure Resource Manager template for cluster and database creation

In this article, you use an [existing quickstart template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-kusto-cluster-database/azuredeploy.json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "clusters_kustocluster_name": {
          "type": "string",
          "defaultValue": "[concat('kusto', uniqueString(resourceGroup().id))]",
          "metadata": {
            "description": "Name of the cluster to create"
          }
      },
      "databases_kustodb_name": {
          "type": "string",
          "defaultValue": "kustodb",
          "metadata": {
            "description": "Name of the database to create"
          }
      },
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "Location for all resources."
        }
      }
  },
  "variables": {},
  "resources": [
      {
          "name": "[parameters('clusters_kustocluster_name')]",
          "type": "Microsoft.Kusto/clusters",
          "sku": {
              "name": "Standard_D13_v2",
              "tier": "Standard",
              "capacity": 2
          },
          "apiVersion": "2019-05-15",
          "location": "[parameters('location')]",
          "tags": {
            "Created By": "GitHub quickstart template"
          }
      },
      {
          "name": "[concat(parameters('clusters_kustocluster_name'), '/', parameters('databases_kustodb_name'))]",
          "type": "Microsoft.Kusto/clusters/databases",
          "apiVersion": "2019-05-15",
          "location": "[parameters('location')]",
          "dependsOn": [
              "[resourceId('Microsoft.Kusto/clusters', parameters('clusters_kustocluster_name'))]"
          ],
          "properties": {
              "softDeletePeriodInDays": 365,
              "hotCachePeriodInDays": 31
          }
      }
  ]
}
```

To find more template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/).

## Deploy the template and verify template deployment

You can deploy the Azure Resource Manager template by [using the Azure portal](#use-the-azure-portal-to-deploy-the-template-and-verify-template-deployment) or [using powershell](#use-powershell-to-deploy-the-template-and-verify-template-deployment).

### Use the Azure portal to deploy the template and verify template deployment

1. To create a cluster and database, use the following button to start the deployment. Right-click and select **Open in new window**, so you can follow the rest of the steps in this article.

    [![Deploy to Azure](media/create-cluster-database-resource-manager/deploybutton.png)](https://github.com/Azure/azure-quickstart-templates/blob/master/101-kusto-cluster-database/azuredeploy.json)

    The **Deploy to Azure** button takes you to the Azure portal to fill out a deployment form.

    ![Deploy to Azure](media/create-cluster-database-resource-manager/deploy-2-azure.png)

    You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) by using the form.

1. Complete **BASICS** and **SETTINGS** sections. Select unique cluster and database names.
It takes a few minutes to create an Azure Data Explorer cluster and database.

1. To verify the deployment, you open the resource group in the [Azure portal](https://portal.azure.com) to find your new cluster and database. 

### Use powershell to deploy the template and verify template deployment

#### Deploy the template using powershell

1. Select **Try it** from the following code block, and then follow the instructions to sign in to the Azure Cloud shell.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $resourceGroupName = "${projectName}rg"
    $clusterName = "${projectName}cluster"
    $parameters = @{}
    $parameters.Add("clusters_kustocluster_name", $clusterName)
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-kusto-cluster-database/azuredeploy.json"
    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -TemplateParameterObject $parameters
    Write-Host "Press [ENTER] to continue ..."
    ```

1. Select **Copy** to copy the PowerShell script.
1. Right-click the shell console, and then select **Paste**.
It takes a few minutes to create an Azure Data Explorer cluster and database.

#### Verify the deployment using PowerShell

To verify the deployment, use the following Azure PowerShell script.  If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host). For more information regarding managing Azure Data Explorer resources in PowerShell, read [Az.Kusto](/powershell/module/az.kusto/?view=azps-2.7.0). 

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"

Install-Module -Name Az.Kusto
$resourceGroupName = "${projectName}rg"
$clusterName = "${projectName}cluster"

Get-AzKustoCluster -ResourceGroupName $resourceGroupName -Name $clusterName
Write-Host "Press [ENTER] to continue ..."
```

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group. 

### Clean up resources using the Azure portal

Delete the resources in the Azure portal by following the steps in [clean up resources](create-cluster-database-portal.md#clean-up-resources).

### Clean up resources using PowerShell

If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."
```

## Next steps

[Ingest data into Azure Data Explorer cluster and database](ingest-data-overview.md)
