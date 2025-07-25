---
title: Create an App by Using a Terraform Template
description: Follow this quickstart to learn how to create your first app in Azure App Service in seconds by using a Terraform template.
author: seligj95
ms.author: msangapu
ms.topic: quickstart
ms.date: 04/29/2025
ms.tool: terraform
ms.custom:
  - subject-terraform
  - devx-track-terraform
  - build-2025
---

# Quickstart: Create an App Service app by using a Terraform template

Get started with [Azure App Service](overview.md) by deploying an app to the cloud via [Terraform](/azure/developer/terraform/). When you use a free App Service tier, there's no charge to complete this quickstart.

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to create an app by using Terraform.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* A Terraform configuration. Use one of the following options:

  * [Configure Terraform in Azure Cloud Shell with Bash](/azure/developer/terraform/get-started-cloud-shell-bash?tabs=bash)
  * [Configure Terraform in Azure Cloud Shell with PowerShell](/azure/developer/terraform/get-started-cloud-shell-powershell?tabs=bash)
  * [Configure Terraform in Windows with Bash](/azure/developer/terraform/get-started-windows-bash?tabs=bash)
  * [Configure Terraform in Windows with PowerShell](/azure/developer/terraform/get-started-windows-powershell?tabs=bash)

* Azure Terraform Visual Studio Code extension. With this extension, you can work with Terraform from the editor to author, test, and run Terraform configurations. The extension also supports resource graph visualization. To learn how to install the extension, see [Install the Azure Terraform Visual Studio Code extension](/azure/developer/terraform/configure-vs-code-extension-for-terraform).

## Review the template

Choose the following Linux or Windows template to create an App Service plan and App Service app. Linux will create a sample Node.js `Hello World` app from the [Azure Samples](https://github.com/Azure-Samples) repo.  The Windows container template will create a sample ASP.NET app from the [Microsoft Container Registry](https://mcr.microsoft.com/).

# [Linux](#tab/linux)

```hcl
# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.0"
    }
  }
  required_version = ">= 0.14.9"
}
provider "azurerm" {
  features {}
}

# Generate a random integer to create a globally unique name
resource "random_integer" "ri" {
  min = 10000
  max = 99999
}

# Create the resource group
resource "azurerm_resource_group" "rg" {
  name     = "myResourceGroup-${random_integer.ri.result}"
  location = "eastus"
}

# Create the Linux App Service Plan
resource "azurerm_service_plan" "appserviceplan" {
  name                = "webapp-asp-${random_integer.ri.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}

# Create the web app, pass in the App Service Plan ID
resource "azurerm_linux_web_app" "webapp" {
  name                  = "webapp-${random_integer.ri.result}"
  location              = azurerm_resource_group.rg.location
  resource_group_name   = azurerm_resource_group.rg.name
  service_plan_id       = azurerm_service_plan.appserviceplan.id
  depends_on            = [azurerm_service_plan.appserviceplan]
  https_only            = true
  site_config { 
    minimum_tls_version = "1.2"
    application_stack {
      node_version = "16-lts"
    }
  }
}

#  Deploy code from a public GitHub repo
resource "azurerm_app_service_source_control" "sourcecontrol" {
  app_id             = azurerm_linux_web_app.webapp.id
  repo_url           = "https://github.com/Azure-Samples/nodejs-docs-hello-world"
  branch             = "main"
  use_manual_integration = true
  use_mercurial      = false
}
```

The template defines the following four Azure resources. For further details and usage information, see the [Azure Provider Terraform Registry](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs).

* [Microsoft.Resources/resourcegroups](/azure/templates/microsoft.resources/resourcegroups?tabs=json): Create a resource group if one doesn't already exist.
  * [`azurerm_resource_group`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) 
* [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms): Create an App Service plan.
  * [`azurerm_service_plan`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan)
* [Microsoft.Web/sites](/azure/templates/microsoft.web/sites): Create a Linux App Service app.
  * [`azurerm_linux_web_app`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app)
* [Microsoft.Web/sites/sourcecontrols](/azure/templates/microsoft.web/sites/sourcecontrols): Create an external Git deployment configuration.
  * [`azurerm_app_service_source_control`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/app_service_source_control)

# [Windows Container](#tab/windows-container)

```hcl
# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Generate a random integer to create a globally unique name
resource "random_integer" "ri" {
  min = 10000
  max = 99999
}

# Create the resource group
resource "azurerm_resource_group" "rg" {
  name     = "rg-${random_integer.ri.result}"
  location = "eastus"
}

# Create the Windows App Service Plan
resource "azurerm_service_plan" "windows_appserviceplan" {
  name                = "windows-asp-${random_integer.ri.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "WindowsContainer"
  sku_name            = "P1v3"
}

# Create the Windows Web App with a container
resource "azurerm_windows_web_app" "windows_webapp" {
  name                  = "windows-webapp-${random_integer.ri.result}"
  location              = azurerm_resource_group.rg.location
  resource_group_name   = azurerm_resource_group.rg.name
  service_plan_id       = azurerm_service_plan.windows_appserviceplan.id

  site_config {
    always_on = true
    app_command_line = ""
    application_stack {
      docker_container_name = "mcr.microsoft.com/dotnet/framework/samples"
      docker_container_tag = "aspnetapp"
    }
  }

  app_settings = {
    DOCKER_REGISTRY_SERVER_USERNAME     = ""
    DOCKER_REGISTRY_SERVER_PASSWORD     = ""
    DOCKER_REGISTRY_SERVER_URL          = "https://mcr.microsoft.com"
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
  }
}

```

For more information on how to construct Terraform templates, see [Terraform documentation](https://developer.hashicorp.com/terraform/tutorials/azure-get-started).

## Implement the Terraform code

Terraform provides many features that you can use to manage, build, deploy, and update infrastructure. The following steps show you how to deploy and destroy your resources. The [Terraform documentation](https://developer.hashicorp.com/terraform/tutorials/azure-get-started) and [Terraform on Azure documentation](/azure/developer/terraform/) provide more detail. We recommend that you review the preceding documentation if Terraform is part of your Azure infrastructure strategy.

1. Create a directory in which to test and run the sample Terraform code. Make it the current directory.

    ```bash
    mkdir appservice_tf_quickstart
    cd appservice_tf_quickstart
    ```

1. Create a file named `main.tf` and insert the code from the previous step.

    ```bash
    code main.tf
    ```

1. Initialize Terraform.

    ```bash
    terraform init
    ```

1. Create the Terraform plan.

    ```bash
    terraform plan
    ```

1. Provision the resources that are defined in the `main.tf` configuration file. Confirm the action by entering **yes** at the prompt.

    ```bash
    terraform apply
    ```

## Validate the deployment

1. On the main menu of the Azure portal, select **Resource groups** and go to the resource group that you created by using the preceding template. The name is `myResourceGroup-` followed by a string of random integers.

1. You can see the App Service and an App Service plan that Terraform created.

1. Select **App Service** and go to the URL to verify that your site was created properly. You can also browse to `http://<app_name>.azurewebsites.net`, where the app name is `webapp-` followed by that same string of random integers from the resource group.

## Clean up resources

When no longer needed, either [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group) or go back to your terminal and execute `terraform destroy` to delete all resources associated with this quickstart.

> [!NOTE]
> To find more Azure App Service Terraform samples, see [Terraform samples for Azure App Service](./samples-terraform.md). You can find even more Terraform samples across all of the Azure services on [GitHub](https://github.com/hashicorp/terraform-provider-azurerm/tree/main/examples).

## Related content

* [Terraform on Azure documentation](/azure/terraform)
* [Terraform samples for Azure App Service](./samples-terraform.md)
