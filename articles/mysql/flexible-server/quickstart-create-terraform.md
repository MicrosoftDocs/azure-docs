---
title: 'Quickstart: Use Terraform to create an Azure Database for MySQL - Flexible Server'
description: Learn how to deploy a database for Azure Database for MySQL Flexible Server using Terraform
author: tomarchermsft
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
ms.custom: devx-track-terraform
ms.author: tarcher
ms.date: 5/24/2022
---

# Quickstart: Use Terraform to create an Azure Database for MySQL - Flexible Server

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.2.1](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Learn more about using Terraform in Azure](/azure/developer/terraform)

In this article, you learn how to deploy an Azure MySQL Flexible Server Database using Terraform.

> [!div class="checklist"]

> * Define a virtual network
> * Define a subnet
> * Define a private DNS zone
> * Define a MySQL Flexible Server Database

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

    [!code-terraform[master](../../../terraform_samples/quickstart/201-mysql-fs-db/main.tf)]

1. Create a file named `mysql-fs-db.tf` and insert the following code:

    [!code-terraform[master](../../../terraform_samples/quickstart/201-mysql-fs-db/mysql-fs-db.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../../terraform_samples/quickstart/201-mysql-fs-db/variables.tf)]

1. Create a file named `output.tf` and insert the following code:

    [!code-terraform[master](../../../terraform_samples/quickstart/201-mysql-fs-db/output.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/developer/terraform/index)
