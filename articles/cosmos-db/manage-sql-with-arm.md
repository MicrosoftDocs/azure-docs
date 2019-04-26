---
title: Azure Resource Manager templates for Azure Cosmos DB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/08/2019
ms.author: mjbrown
---

# Create Azure Cosmos DB Core (SQL) API resources from a Resource Manager template

Learn how to create an Azure Cosmos DB resources using an Azure Resource Manager template. The following example creates an Azure Cosmos DB account from an [Azure Quickstart template](https://aka.ms/sql-arm-qs). This template will create an Azure Cosmos account with two containers that share 400 RU/s throughput at the database level.

Here is a copy of the template:

[!code-json[create-cosmosdb-sql](~/quickstart-templates/101-cosmosdb-create-account/azuredeploy.json)]

## Deploy via PowerShell

To deploy the Resource Manager template using PowerShell, **Copy** the script and select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurepowershell-interactive

$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$accountName = Read-Host -Prompt "Enter the account name"
$location = Read-Host -Prompt "Enter the location (i.e. westus2)"
$primaryRegion = Read-Host -Prompt "Enter the primary region (i.e. westus2)"
$secondaryRegion = Read-Host -Prompt "Enter the secondary region (i.e. eastus2)"
$databaseName = Read-Host -Prompt "Enter the database name"
$container1Name = Read-Host -Prompt "Enter the first container name"
$container2Name = Read-Host -Prompt "Enter the second container name"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-sql/azuredeploy.json" `
    -primaryRegion $primaryRegion `
    -secondaryRegion $secondaryRegion `
    -databaseName $databaseName `
    -container1Name $container1Name `
    -container2Name $container2Name

 (Get-AzResource --ResourceType "Microsoft.DocumentDb/databaseAccounts" --ApiVersion "2015-04-08" --ResourceGroupName $resourceGroupName).name
```

If you choose to use a locally installed version of PowerShell instead of from the Azure Cloud shell, you have to [install](/powershell/azure/install-az-ps) the Azure PowerShell module. Run `Get-Module -ListAvailable Az` to find the version. 

In the previous example, you have referenced a template that is stored in GitHub. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

## Deploy via Azure CLI

To deploy the Resource Manager template using Azure CLI, select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the database name: ' databaseName
read -p 'Enter the first container name: ' container1Name
read -p 'Enter the second container name: ' container2Name

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-sql/azuredeploy.json \
   --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion databaseName=$databaseName \
   container1Name=$container1Name container2Name=$container2Name

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

The `az cosmosdb show` command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of Azure CLI instead of using CloudShell, see [Azure Command-Line Interface (CLI)](/cli/azure/) article.

In the previous example, you have referenced a template that is stored in GitHub. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

## Next Steps

Here are some additional resources:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/)
- [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
- [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
- [Troubleshooting common ARM deployment errors](../azure-resource-manager/resource-manager-common-deployment-errors.md)