---
title: 'Azure Resource Manager: Create a single database - Azure SQL Database | Microsoft Docs'
description: Create a single database in Azure SQL Database using the Azure Resource Manager template.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom:
ms.devlang:
ms.topic: quickstart
author: mumian
ms.author: jgao
ms.reviewer: carlrab
manager: craigg
ms.date: 06/28/2019
---

# Quickstart: Create a single database in Azure SQL Database using the Azure Resource Manager template

Creating a [single database](sql-database-single-database.md) is the quickest and simplest deployment option for creating a database in Azure SQL Database. This quickstart shows you how to create a single database using the Azure Resource Manager template. For more information, see [Azure Resource Manager documentation](/azure/azure-resource-manager/).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

## Create a single database

A single database has a defined set of compute, memory, IO, and storage resources using one of two [purchasing models](sql-database-purchase-models.md). When you create a single database, you also define a [SQL Database server](sql-database-servers.md) to manage it and place it within [Azure resource group](../azure-resource-manager/resource-group-overview.md) in a specified region.

The following JSON file is the template that is used in this article. The template is stored in [GitHub](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/SQLServerAndDatabase/azuredeploy.json). More Azure SQL database template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sql&pageNumber=1&sort=Popular).

[!code-json[create-azure-sql-database-server-and-database](~/resourcemanager-templates/SQLServerAndDatabase/azuredeploy.json)]

1. Select **Try it** from the following PowerShell code block to open Azure Cloud Shell.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter an Azure location (i.e. centralus)"
    $adminUser = Read-Host -Prompt "Enter the SQL server administrator username"
    $adminPassword = Read-Host -Prompt "Enter the SQl server administrator password" -AsSecureString

    $resourceGroupName = "${projectName}rg"


    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile "D:\GitHub\azure-docs-json-samples\SQLServerAndDatabase\azuredeploy.json" -projectName $projectName -adminUser $adminUser -adminPassword $adminPassword

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

1. Select **Copy** to copy the PowerShell script into clipboard.
1. Right-click the shell pane, and then select **Paste**.

    It takes a few moments to create the database server and the database.

## Query the database

To query the database, see [Query the database](./sql-database-single-database-get-started.md#query-the-database).

## Clean up resources

Keep this resource group, database server, and single database if you want to go to the [Next steps](#next-steps). The next steps show you how to connect and query your database using different methods.

To delete the resource group by Azure Powershell:

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -Name $resourceGroupName

Read-Host -Prompt "Press [ENTER] to continue ..."
```

## Next steps

- Create a server-level firewall rule to connect to the single database from on-premises or remote tools. For more information, see [Create a server-level firewall rule](sql-database-server-level-firewall-rule.md).
- After you create a server-level firewall rule, [connect and query](sql-database-connect-query.md) your database using several different tools and languages.
  - [Connect and query using SQL Server Management Studio](sql-database-connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
- To create a single database using Azure CLI, see [Azure CLI samples](sql-database-cli-samples.md).
- To create a single database using Azure PowerShell, see [Azure PowerShell samples](sql-database-powershell-samples.md).
