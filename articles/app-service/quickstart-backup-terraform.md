---
title: 'Quickstart: Create an Azure windows web app using Terraform'
description: In this quickstart, you create an Azure windows web app with a backup schedule and a .NET application stack.
ms.topic: quickstart
ms.date: 06/25/2024
ms.custom: devx-track-terraform
ms.service: windows
author: msangapu-msft
ms.author: msangapu
customer intent: As a Terraform user, I want to see how to create an Azure windows web app with a backup schedule and a .NET application stack.
---

# Quickstart: Create an Azure windows web app using Terraform

In this quickstart, you use Terraform to create an Azure windows web app with a backup schedule and a .NET application stack using Terraform. Azure windows web app is a fully managed platform for building, deploying, and scaling web apps. It's designed to let you focus on your application code, without the worry of managing infrastructure or the underlying operating system. You can use it to host web apps, REST APIs, and backend services for mobile, desktop, and web applications.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Create an Azure storage account and container with the randomly generated name .
> * Create an Azure service plan with the randomly generated name .
> * Generate a Shared Access Signature (SAS) for the storage account.
> * Create an Azure Windows web app with the randomly generated name .
> * Configure a backup schedule for the web app.
> * Specify the application stack for the web app.
> * Output the names of key resources created with the Terraform script.
> * Output the default hostname of the Windows web app.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-app-service-backup). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-app-service-backup/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code.
:::code language="Terraform" source="~/terraform_samples_test/quickstart/101-app-service-backup/main.tf":::

1. Create a file named `outputs.tf` and insert the following code.
:::code language="Terraform" source="~/terraform_samples_test/quickstart/101-app-service-backup/outputs.tf":::

1. Create a file named `providers.tf` and insert the following code.
:::code language="Terraform" source="~/terraform_samples_test/quickstart/101-app-service-backup/providers.tf":::

1. Create a file named `variables.tf` and insert the following code.
:::code language="Terraform" source="~/terraform_samples_test/quickstart/101-app-service-backup/variables.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

Run [`az webapp show`](/cli/azure/webapp#az-webapp-show) to view the Azure windows web app.

```azurecli
az webapp show --name <web_app_name> --resource-group <resource_group_name>
```

You must replace `<web_app_name>` with the name of your Azure Windows web app and `<resource_group_name>` with the name of your resource group.

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure windows web app](/search/?terms=Azure%20windows%20web%20app%20and%20terraform)
