---
title: 'Quickstart: Create an Azure Front Door (classic) using Terraform'
description: This quickstart describes how to create an Azure Front Door Service using Terraform.
services: front-door
author: johndowns
ms.author: jodowns
ms.date: 8/11/2023
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.custom: devx-track-terraform
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure Front Door (classic) using Terraform

This quickstart describes how to use Terraform to create a Front Door (classic) profile to set up high availability for a web endpoint.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create a random value for the Front Door endpoint host name using [random_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id).
> * Create a Front Door (classic) resource using - [azurerm_frontdoor](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/frontdoor).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-classic). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-classic/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-classic/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-classic/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-classic/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code, being sure to update the value to your own backend hostname:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-classic/outputs.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Get the Front Door endpoint:

    ```console
    terraform output -raw frontDoorEndpointHostName
    ```

1. Paste the endpoint into a browser.

    :::image type="content" source="./media/quickstart-create-front-door-terraform/endpoint.png" alt-text="Screenshot of a successful connection to endpoint.":::

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Overview of Azure Front Door](front-door-overview.md)
