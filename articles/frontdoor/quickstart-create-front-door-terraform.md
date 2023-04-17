---
title: 'Quickstart: Create an Azure Front Door (classic) - Terraform'
description: This quickstart describes how to create an Azure Front Door Service using Terraform.
services: front-door
author: johndowns
ms.author: jodowns
ms.date: 10/25/2022
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.custom: devx-track-terraform
---

# Create a Front Door (classic) using Terraform

This quickstart describes how to use Terraform to create a Front Door (classic) profile to set up high availability for a web endpoint.

The steps in this article were tested with the following Terraform and Terraform provider versions:

- [Terraform v1.3.2](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.27.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform/quickstart/101-front-door-classic/providers.tf)]

1. Create a file named `resource-group.tf` and insert the following code:

   [!code-terraform[master](../../terraform/quickstart/101-front-door-classic/resource-group.tf)]

1. Create a file named `front-door.tf` and insert the following code:

    [!code-terraform[master](../../terraform/quickstart/101-front-door-classic/front-door.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform/quickstart/101-front-door-classic/variables.tf)]

1. Create a file named `terraform.tfvars` and insert the following code, being sure to update the value to your own backend hostname:

    ```terraform
    backend_address = "<your backend hostname>"
    ```

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [Portal](#tab/Portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the FrontDoor resource group.

1. Select the Front Door you created and you'll be able to see the endpoint hostname. Copy the hostname and paste it on to the address bar of a browser. Press enter and your request will automatically get routed to the web app.

    :::image type="content" source="./media/create-front-door-bicep/front-door-bicep-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content.":::

# [Azure CLI](#tab/CLI)

Run the following command:

```azurecli-interactive
az resource list --resource-group FrontDoor
```

# [PowerShell](#tab/PowerShell)

Run the following command:

```azurepowershell-interactive
Get-AzResource -ResourceGroupName FrontDoor
```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you deployed a simple Front Door (classic) profile using Terraform. [Learn more about Azure Front Door.](front-door-overview.md)
