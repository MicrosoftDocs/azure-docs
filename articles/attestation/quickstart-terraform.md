---
title: 'Quickstart: Create an Azure Attestation provider by using Terraform'
description: In this article, you learn how to create an Azure Attestation provider using Terraform
author: tomarchermsft
ms.service: attestation
ms.topic: quickstart
ms.custom: devx-track-terraform
ms.author: tarcher
ms.date: 07/26/2023
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure Attestation provider by using Terraform

[Microsoft Azure Attestation](overview.md) is a solution for attesting Trusted Execution Environments (TEEs). This quickstart focuses on the process of deploying a Bicep file to create a Microsoft Azure Attestation policy.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create an Azure Attestation provider using [azurerm_attestation_provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/attestation).

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

- **Policy Signing Certificate:** You need to upload an X.509 certificate, which is used by the attestation provider to validate signed policies. This certificate is either signed by a certificate authority or self-signed. Supported file extensions include `pem`, `txt`, and `cer`. This article assumes that you already have a valid X.509 certificate.

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-attestation-provider). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-attestation-provider/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-attestation-provider/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-attestation-provider/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-attestation-provider/variables.tf":::
    
    **Key points:**
    
    - Adjust the `policy_file` field as needed to point to your PEM file.
    
1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-attestation-provider/outputs.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## 6. Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Run [az attestation list](/cli/azure/attestation#az-attestation-list) to list the providers for the specified resource group name.

    ```azurecli
    az attestation list --resource-group $resource_group_name
    ```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Overview of Azure Attestation](overview.md).
