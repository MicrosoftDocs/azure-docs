---
title: 'Deploy an Azure Batch account and two pools with a start task - Terraform'
description: In this article, you deploy an Azure Batch account and two pools with a start task using Terraform.
ms.topic: quickstart
ms.date: 10/24/2024
ms.custom: devx-track-terraform
ms.service: azure-batch
author: Padmalathas
ms.author: padmalathas
#customer intent: As a Terraform user, I want to see how to create an Azure resource group, Storage account, Batch account, and two Batch pools with different scaling configurations.
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Deploy an Azure Batch account and two pools with a start task - Terraform

In this quickstart, you create an Azure Batch account, an Azure Storage account, and two Batch pools using Terraform. Batch is a cloud-based job scheduling service that parallelizes and distributes the processing of large volumes of data across many computers. It's typically used for tasks like rendering 3D graphics, analyzing large datasets, or processing video. In this case, the resources created include a Batch account (which is the central organizing entity for distributed processing tasks), a Storage account for holding the data to be processed, and two Batch pools, which are groups of virtual machines that execute the tasks.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Specify the required version of Terraform and the required providers.
> * Define the Azure provider with no additional features.
> * Define variables for the resource group location and name prefix.
> * Generate a random name for the Azure resource group.
> * Create a resource group with the generated name at a specified location.
> * Generate a random string for the Storage account name.
> * Create a Storage account with the generated name in the created resource group.
> * Generate a random string for the Batch account name.
> * Create a Batch account with the generated name in the created resource group and linked to the created Storage account.
> * Generate a random name for the Batch pool.
> * Create a Batch pool with a fixed scale in the created resource group and linked to the created Batch account.
> * Create a Batch pool with autoscale in the created resource group and linked to the created Batch account.
> * Output the names of the created resource group, Storage account, Batch account, and both Batch pools.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-batch-pools-with-start-task). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-batch-pools-with-start-task/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-batch-pools-with-start-task/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-batch-pools-with-start-task/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-batch-pools-with-start-task/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-batch-pools-with-start-task/variables.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

### [Azure CLI](#tab/azure-cli)

Run [`az batch account show`](/cli/azure/batch/account#az-batch-account-show) to view the Batch account.

```azurecli
az batch account show --name <batch_account_name> --resource-group <resource_group_name>
```

In the above command, replace `<batch_account_name>` with the name of your Batch account and `<resource_group_name>` with the name of your resource group.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Batch accounts](/search/?terms=Azure%20batch%20account%20and%20terraform).
