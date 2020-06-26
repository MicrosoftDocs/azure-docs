---
title: "Azure Resource Manager: Create a single database"
description: Create a single database in Azure SQL Database using the Azure Resource Manager template.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: subject-armqs sqldbrb=1
ms.devlang:
ms.topic: quickstart
author: mumian
ms.author: jgao
ms.reviewer: carlrab
ms.date: 06/24/2020
---

# Quickstart: Create a single database in Azure SQL Database using the Azure Resource Manager template

Creating a [single database](single-database-overview.md) is the quickest and simplest option for creating a database in Azure SQL Database. This quickstart shows you how to create a single database using the Azure Resource Manager template.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the Deploy to Azure button. The template will open in the Azure portal.

[![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-sql-database%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

## Review the template

A single database has a defined set of compute, memory, IO, and storage resources using one of two [purchasing models](purchasing-models.md). When you create a single database, you also define a [server](logical-servers.md) to manage it and place it within [Azure resource group](../../active-directory-b2c/overview.md) in a specified region.

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-sql-logical-server/).

:::code language="json" source="~/quickstart-templates/101-sql-database/azuredeploy.json" range="1-67" highlight="41-65":::

These resources are defined in the template:

- [**Microsoft.Sql/servers**](/azure/templates/microsoft.sql/servers)
- [**Microsoft.Sql/servers/databases**](/azure/templates/microsoft.sql/servers/databases)

More Azure SQL Database template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sql&pageNumber=1&sort=Popular).

## Deploy the template

Select **Try it** from the following PowerShell code block to open Azure Cloud Shell.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
$location = Read-Host -Prompt "Enter an Azure location (i.e. centralus)"
$adminUser = Read-Host -Prompt "Enter the SQL server administrator username"
$adminPassword = Read-Host -Prompt "Enter the SQl server administrator password" -AsSecureString

$resourceGroupName = "${projectName}rg"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-sql-database/azuredeploy.json" -administratorLogin $adminUser -administratorLoginPassword $adminPassword

Read-Host -Prompt "Press [ENTER] to continue ..."
```

## Validate the deployment

To query the database, see [Query the database](single-database-create-quickstart.md#query-the-database).

## Clean up resources

Keep this resource group, server, and single database if you want to go to the [Next steps](#next-steps). The next steps show you how to connect and query your database using different methods.

To delete the resource group:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
```

## Next steps

- Create a server-level firewall rule to connect to the single database from on-premises or remote tools. For more information, see [Create a server-level firewall rule](firewall-create-server-level-portal-quickstart.md).
- After you create a server-level firewall rule, [connect and query](connect-query-content-reference-guide.md) your database using several different tools and languages.
  - [Connect and query using SQL Server Management Studio](connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
- To create a single database using the Azure CLI, see [Azure CLI samples](az-cli-script-samples-content-guide.md).
- To create a single database using Azure PowerShell, see [Azure PowerShell samples](powershell-script-content-guide.md).
- To learn how to create Resource Manager templates, see [Create your first template](../../azure-resource-manager/templates/template-tutorial-create-first-template.md).
