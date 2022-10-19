---
title: 'Quickstart: Create an Azure Front Door Standard/Premium using Terraform'
description: This quickstart describes how to create an Azure Front Door Standard/Premium using Terraform.
services: front-door
author: johndowns
ms.author: jodowns
ms.date: 10/18/2022
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
---

# Create a Front Door Standard/Premium using Terraform

This quickstart describes how to use Terraform to create a Front Door profile to set up high availability for a web endpoint.

The steps in this article were tested with the following Terraform and Terraform provider versions:

- [Terraform v1.3.2](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.27.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    TODO

1. Create a file named `app-service.tf` and insert the following code:

    TODO

1. Create a file named `front-door.tf` and insert the following code:

    TODO

1. Create a file named `variables.tf` and insert the following code:

    TODO

1. Create a file named `outputs.tf` and insert the following code:

    TODO

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

TODO

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you deployed a simple Front Door profile using Terraform. [Learn more about Azure Front Door.](front-door-overview.md)
