---
title: Create and manage Azure Cosmos DB with Resource Manager templates
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB for SQL (Core) API 
author: TheovanKraay
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/12/2019
ms.author: thvankra
---

# Manage Azure Cosmos DB SQL (Core) API resources with Azure Resource Manager templates

In this article, you learn how to use Azure Resource Manager templates to help automate management of your Azure Cosmos DB accounts, databases, and containers.

This article only shows Azure Resource Manager template examples for SQL API accounts. You can also find template examples for [Cassandra](manage-cassandra-with-resource-manager.md), [Gremlin](manage-gremlin-with-resource-manager.md),
[MongoDB](manage-mongodb-with-resource-manager.md), and [Table](manage-table-with-resource-manager.md) APIs.

<a id="create-resource"></a>

## Create an Azure Cosmos account, database, and container

The following Azure Resource Manager template creates an Azure Cosmos account with:

* Two containers that share 400 Requested Units per second (RU/s) throughput at the database level.
* One container with dedicated 400 RU/s throughput.

To create the Azure Cosmos DB resources, copy the following example template and deploy it as described, either via [PowerShell](#deploy-via-powershell) or [Azure CLI](#deploy-via-azure-cli).

* Optionally, you can visit the [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-sql/) and deploy the template from the Azure portal.
* You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

> [!IMPORTANT]
>
> * When you add or remove locations to an Azure Cosmos account, you can't simultaneously modify other properties. These operations must be done separately.
> * Account names are limited to 44 characters, all lowercase.
> * To change the throughput values, resubmit the template with updated RU/s.

[!code-json[create-cosmosdb-sql](~/quickstart-templates/101-cosmosdb-sql/azuredeploy.json)]

> [!NOTE]
> To create a container with large partition key, modify the previous template to include the `"version":2` property within the `partitionKey` object.

### Deploy via PowerShell

To use PowerShell to deploy the Azure Resource Manager template:

1. **Copy** the script.
2. Select **Try it** to open Azure Cloud Shell.
3. Right-click in the Azure Cloud Shell window, and then select **Paste**.

```azurepowershell-interactive

$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$accountName = Read-Host -Prompt "Enter the account name"
$location = Read-Host -Prompt "Enter the location (i.e. westus2)"
$primaryRegion = Read-Host -Prompt "Enter the primary region (i.e. westus2)"
$secondaryRegion = Read-Host -Prompt "Enter the secondary region (i.e. eastus2)"
$databaseName = Read-Host -Prompt "Enter the database name"
$sharedThroughput = Read-Host -Prompt "Enter the shared database throughput (i.e. 400)"
$sharedContainer1Name = Read-Host -Prompt "Enter the first shared container name"
$sharedContainer2Name = Read-Host -Prompt "Enter the second shared container name"
$dedicatedContainer1Name = Read-Host -Prompt "Enter the dedicated container name"
$dedicatedThroughput = Read-Host -Prompt "Enter the dedicated container throughput (i.e. 400)"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-sql/azuredeploy.json" `
    -accountName $accountName `
    -location $location `
    -primaryRegion $primaryRegion `
    -secondaryRegion $secondaryRegion `
    -databaseName $databaseName `
    -sharedThroughput $ $sharedThroughput `
    -sharedContainer1Name $sharedContainer1Name `
    -sharedContainer2Name $sharedContainer2Name `
    -dedicatedContainer1Name $dedicatedContainer1Name `
    -dedicatedThroughput $dedicatedThroughput

 (Get-AzResource --ResourceType "Microsoft.DocumentDb/databaseAccounts" --ApiVersion "2019-08-01" --ResourceGroupName $resourceGroupName).name
```

You can choose to deploy the template with a locally installed version of PowerShell instead of Azure Cloud Shell. You'll need to [install the Azure PowerShell module](/powershell/azure/install-az-ps). Run `Get-Module -ListAvailable Az` to find the required version.

### Deploy via Azure CLI

To use Azure CLI to deploy the Azure Resource Manager template:

1. **Copy** the script.
2. Select **Try it** to open Azure Cloud Shell.
3. Right-click in the Azure Cloud Shell window, and then select **Paste**.

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the database name: ' databaseName
read -p 'Enter the shared database throughput: sharedThroughput
read -p 'Enter the first shared container name: ' sharedContainer1Name
read -p 'Enter the second shared container name: ' sharedContainer2Name
read -p 'Enter the dedicated container name: ' dedicatedContainer1Name
read -p 'Enter the dedicated container throughput: dedicatedThroughput

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-sql/azuredeploy.json \
   --parameters accountName=$accountName \
   primaryRegion=$primaryRegion \
   secondaryRegion=$secondaryRegion \
   databaseName=$databaseName \
   sharedThroughput=$sharedThroughput \
   sharedContainer1Name=$sharedContainer1Name \
   sharedContainer2Name=$sharedContainer2Name \
   dedicatedContainer1Name=$dedicatedContainer1Name \
   dedicatedThroughput=$dedicatedThroughput

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

The `az cosmosdb show` command shows the newly created Azure Cosmos account after it's provisioned. You can choose to deploy the template with a locally installed version of Azure CLI instead Azure Cloud Shell. For more information, see the [Azure Command-Line Interface (CLI)](/cli/azure/) article.

<a id="create-sproc"></a>

## Create an Azure Cosmos DB container with server-side functionality

You can use an Azure Resource Manager template to create an Azure Cosmos DB container with a stored procedure, trigger, and user-defined function.

Copy the following example template and deploy it as described, either with [PowerShell](#deploy-with-powershell) or [Azure CLI](#deploy-with-azure-cli).

* Optionally, you can visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-sql-container-sprocs/) and deploy the template from the Azure portal.
* You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

[!code-json[create-cosmosdb-sql-sprocs](~/quickstart-templates/101-cosmosdb-sql-container-sprocs/azuredeploy.json)]

### Deploy with PowerShell

To use PowerShell to deploy the Azure Resource Manager template:

1. **Copy** the script.
1. Select **Try it** to open Azure Cloud Shell.
1. Right-click the Azure Cloud Shell window, and then select **Paste**.

```azurepowershell-interactive

$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$accountName = Read-Host -Prompt "Enter the account name"
$location = Read-Host -Prompt "Enter the location (i.e. westus2)"
$primaryRegion = Read-Host -Prompt "Enter the primary region (i.e. westus2)"
$secondaryRegion = Read-Host -Prompt "Enter the secondary region (i.e. eastus2)"
$databaseName = Read-Host -Prompt "Enter the database name"
$containerName = Read-Host -Prompt "Enter the container name"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-sql-container-sprocs/azuredeploy.json" `
    -accountName $accountName `
    -location $location `
    -primaryRegion $primaryRegion `
    -secondaryRegion $secondaryRegion `
    -databaseName $databaseName `
    -containerName $containerName

 (Get-AzResource --ResourceType "Microsoft.DocumentDb/databaseAccounts" --ApiVersion "2019-08-01" --ResourceGroupName $resourceGroupName).name
```

You can choose to deploy the template with a locally installed version of PowerShell instead of Azure Cloud Shell. You'll need to [install the Azure PowerShell module](/powershell/azure/install-az-ps). Run `Get-Module -ListAvailable Az` to find the required version.

### Deploy with Azure CLI

To use Azure CLI to deploy the Azure Resource Manager template:

1. **Copy** the script.
2. Select **Try it** to open Azure Cloud Shell.
3. Right-click in the Azure Cloud Shell window, and then select **Paste**.

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the database name: ' databaseName
read -p 'Enter the container name: ' containerName

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-sql-container-sprocs/azuredeploy.json \
   --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion databaseName=$databaseName \
   containerName=$containerName

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

## Next steps

Here are some additional resources:

* [Azure Resource Manager documentation](/azure/azure-resource-manager/)
* [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
* [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Documentdb&pageNumber=1&sort=Popular)
* [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/templates/common-deployment-errors.md)
