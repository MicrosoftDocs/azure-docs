---
title: 'Quickstart: Create an Azure Front Door Standard/Premium profile using Terraform'
description: This quickstart describes how to create an Azure Front Door Standard/Premium using Terraform.
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

# Quickstart: Create an Azure Front Door Standard/Premium profile using Terraform

This quickstart describes how to use Terraform to create a Front Door profile to set up high availability for a web endpoint.

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create a random value for the Front Door endpoint resource name and App Service app name using [random_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id).
> * Create a Front Door profile using [azurerm_cdn_frontdoor_profile](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_frontdoor_profile).
> * Create a Front Door endpoint using [azurerm_cdn_frontdoor_endpoint](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_frontdoor_endpoint).
> * Create a Front Door origin group using [azurerm_cdn_frontdoor_origin_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_frontdoor_origin_group)
> * Create a Front Door origin, which refers to the App Service app, using [azurerm_cdn_frontdoor_origin](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_frontdoor_origin).
> * Create a Front Door route using [azurerm_cdn_frontdoor_route](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_frontdoor_route).
> * Create an App Service plan using [azurerm_service_plan](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan).
> * Create an App Service app using [azurerm_windows_web_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/windows_web_app).

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-standard-premium). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-standard-premium/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/main.tf":::

1. Create a file named `app-service.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/app-service.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/outputs.tf":::

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

    :::image type="content" source="./media/create-front-door-terraform/endpoint.png" alt-text="Screenshot of a successful connection to endpoint.":::

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Overview of Azure Front Door](front-door-overview.md)
