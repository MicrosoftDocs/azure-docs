---
title: 'Quickstart: Create an Azure Front Door Standard/Premium profile using Terraform'
description: This quickstart describes how to create an Azure Front Door Standard/Premium using Terraform.
services: front-door
author: johndowns
ms.author: jodowns
ms.date: 8/10/2023
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

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

- IP address or FQDN of a website or web application.

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-standard-premium). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-standard-premium/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/providers.tf":::

1. Create a file named `resource-group.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/resource-group.tf":::

1. Create a file named `app-service.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/app-service.tf":::

1. Create a file named `front-door.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-front-door-standard-premium/front-door.tf":::

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

1. Paste the endpoint into a browser:

    :::image type="content" source="./media/create-front-door-bicep/front-door-bicep-web-app-origin-success.png" alt-text="Screenshot of the sample app.":::

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you deployed a simple Front Door profile using Terraform. [Learn more about Azure Front Door.](front-door-overview.md)
