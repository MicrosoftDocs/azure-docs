---
title: 'Quickstart: Use Terraform to create an Azure Database for MySQL - Flexible Server'
description: Learn how to deploy a database for Azure Database for MySQL - Flexible Server using Terraform
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: devx-track-terraform
ms.date: 8/28/2022
---

# Quickstart: Use Terraform to create an Azure Database for MySQL - Flexible Server

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.2.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.20.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [About Azure Database for MySQL - Flexible Server](../includes/azure-database-for-mysql-flexible-server-abstract.md)]

This article shows how to use Terraform to deploy an Azure MySQL Flexible Server Database in a virtual network (VNet).

In this article, you learn how to:

> [!div class="checklist"]

> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create an Azure VNet using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network)
> * Create an Azure subnet using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet)
> * Define a private DNS zone within an Azure DNS using [azurerm_private_dns_zone](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone)
> * Define a private DNS zone VNet link using using [azurerm_private_dns_zone_virtual_network_link](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone_virtual_network_link)
> * Deploy Flexible Server using [azurerm_mysql_flexible_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_server)
> * Deploy a database using [azurerm_mysql_flexible_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_database)

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-mysql-fs-db).

## Prerequisites

- [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

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

Run [az mysql flexible-server db show](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-show) to display the Azure MySQL database.

```azurecli
az mysql flexible-server db show \
    --resource-group <resource_group_name> \
    --server-name <azurerm_mysql_flexible_server> \
    --database-name <mysql_flexible_server_database_name>
```

**Key points:**

- The values for the `<resource_group_name>`, `<azurerm_mysql_flexible_server>`, and `<mysql_flexible_server_database_name>` are displayed in the `terraform apply` output. You can also run the [terraform output](https://www.terraform.io/cli/commands/output) command to view these output values.

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzMySqlFlexibleServerDatabase](/powershell/module/az.mysql/get-azmysqlflexibleserverdatabase) to display the Azure MySQL database.

```azurepowershell
Get-AzMySqlFlexibleServerDatabase `
    -ResourceGroupName <resource_group_name> `
    -ServerName <azurerm_mysql_flexible_server> `
    -Name <mysql_flexible_server_database_name>
```

**Key points:**

- The values for the `<resource_group_name>`, `<azurerm_mysql_flexible_server>`, and `<mysql_flexible_server_database_name>` are displayed in the `terraform apply` output. You can also run the [terraform output](https://www.terraform.io/cli/commands/output) command to view these output values.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Connect Azure Database for MySQL - Flexible Server with private access](./quickstart-create-connect-server-vnet.md)