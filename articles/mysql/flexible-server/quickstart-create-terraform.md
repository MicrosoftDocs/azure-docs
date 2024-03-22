---
title: 'Quickstart: Create a flexible server by using Terraform'
description: In this quickstart, learn how to deploy a database in an instance of Azure Database for MySQL - Flexible Server by using Terraform.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: devx-track-terraform
ms.date: 8/28/2022
---

# Quickstart: Create an instance of Azure Database for MySQL - Flexible Server by using Terraform

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This quickstart was tested by using the following Terraform and Terraform provider versions:

- [Terraform v1.2.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.20.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [azure-database-for-mysql-flexible-server-abstract](../includes/azure-database-for-mysql-flexible-server-abstract.md)]

This article shows you how to use Terraform to deploy an instance of Azure Database for MySQL - Flexible Server and a database in a virtual network.

In this article, you learn how to:

> [!div class="checklist"]
> - Create an Azure resource group by using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> - Create an Azure virtual network by using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network).
> - Create an Azure subnet by using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet).
> - Define a private DNS zone within an instance of Azure DNS by using [azurerm_private_dns_zone](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone).
> - Define a private DNS zone virtual network link by using [azurerm_private_dns_zone_virtual_network_link](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone_virtual_network_link).
> - Deploy Azure Database for MySQL - Flexible Server by using [azurerm_mysql_flexible_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_server).
> - Deploy a database by using [azurerm_mysql_flexible_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_database).

> [!NOTE]
> The example code that appears in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-mysql-fs-db).

## Prerequisites

- [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

1. Create a directory that you can use to test the sample Terraform code. Make the Terraform directory the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-mysql-fs-db/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-mysql-fs-db/main.tf)]

1. Create a file named `mysql-fs-db.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-mysql-fs-db/mysql-fs-db.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-mysql-fs-db/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/201-mysql-fs-db/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

To display the Azure Database for MySQL - Flexible Server database, run [az mysql flexible-server db show](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-show):

```azurecli
az mysql flexible-server db show \
    --resource-group <resource_group_name> \
    --server-name <azurerm_mysql_flexible_server> \
    --database-name <mysql_flexible_server_database_name>
```

Consider the following *key points*:

- The values for `<resource_group_name>`, `<azurerm_mysql_flexible_server>`, and `<mysql_flexible_server_database_name>` are displayed in the `terraform apply` output. You can also run the [terraform output](https://www.terraform.io/cli/commands/output) command to view these values.

#### [Azure PowerShell](#tab/azure-powershell)

To display the Azure Database for MySQL flexible server database, run [Get-AzMySqlFlexibleServerDatabase](/powershell/module/az.mysql/get-azmysqlflexibleserverdatabase):

```azurepowershell
Get-AzMySqlFlexibleServerDatabase `
    -ResourceGroupName <resource_group_name> `
    -ServerName <azurerm_mysql_flexible_server> `
    -Name <mysql_flexible_server_database_name>
```

Consider the following *key points*:

- The values for the `<resource_group_name>`, `<azurerm_mysql_flexible_server>`, and `<mysql_flexible_server_database_name>` are displayed in the `terraform apply` output. You can also run the [terraform output](https://www.terraform.io/cli/commands/output) command to view these output values.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

Explore how to [troubleshoot common problems for using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next step

> [!div class="nextstepaction"]
> [Connect to an instance of Azure Database for MySQL - Flexible Server by using private access](./quickstart-create-connect-server-vnet.md)
