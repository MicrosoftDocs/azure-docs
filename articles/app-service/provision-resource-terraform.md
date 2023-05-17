---
title: 'Create an App Service app using a Terraform template'
description: Create your first app to Azure App Service in seconds using a Terraform template, which is one of many ways to deploy to App Service.
author: seligj95
ms.author: msangapu
ms.topic: article
ms.date: 10/20/2022
ms.tool: terraform
ms.custom: subject-terraform, devx-track-terraform
---

# Create App Service app using a Terraform template

Get started with [Azure App Service](overview.md) by deploying an app to the cloud using [Terraform](/azure/developer/terraform/). Because you use a free App Service tier, you incur no costs to complete this quickstart.

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to create a Windows app with Terraform.

## Prerequisites

Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

Configure Terraform: If you haven't already done so, configure Terraform using one of the following options:

* [Configure Terraform in Azure Cloud Shell with Bash](/azure/developer/terraform/get-started-cloud-shell-bash?tabs=bash)
* [Configure Terraform in Azure Cloud Shell with PowerShell](/azure/developer/terraform/get-started-cloud-shell-powershell?tabs=bash)
* [Configure Terraform in Windows with Bash](/azure/developer/terraform/get-started-windows-bash?tabs=bash)
* [Configure Terraform in Windows with PowerShell](/azure/developer/terraform/get-started-windows-powershell?tabs=bash)

The Azure Terraform Visual Studio Code extension enables you to work with Terraform from the editor. With this extension, you can author, test, and run Terraform configurations. The extension also supports resource graph visualization. See [this guide](/azure/developer/terraform/configure-vs-code-extension-for-terraform) for configuring the Azure Terraform Visual Studio Code extension.

## Review the template

The template used in this quickstart is shown below. It deploys an App Service plan and an App Service app on Linux and a sample Node.js "Hello World" app from the [Azure Samples](https://github.com/Azure-Samples) repo.

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
  https_only            = true
  site_config { 
    minimum_tls_version = "1.2"
  }
}

#  Deploy code from a public GitHub repo
resource "azurerm_app_service_source_control" "sourcecontrol" {
  app_id             = azurerm_linux_web_app.webapp.id
  repo_url           = "https://github.com/Azure-Samples/nodejs-docs-hello-world"
  branch             = "master"
  use_manual_integration = true
  use_mercurial      = false
}
```

Four Azure resources are defined in the template. Links to the [Azure Provider Terraform Registry](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) are given below for further details and usage information:

* [**Microsoft.Resources/resourcegroups**](/azure/templates/microsoft.resources/resourcegroups?tabs=json): create a Resource Group if one doesn't already exist.
  * [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) 
* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
  * [azurerm_service_plan](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan)
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create a Linux App Service app.
  * [azurerm_linux_web_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app)
* [**Microsoft.Web/sites/sourcecontrols**](/azure/templates/microsoft.web/sites/sourcecontrols): create an external git deployment configuration.
  * [azurerm_app_service_source_control](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/app_service_source_control)

For further information on how to construct Terraform templates, have a look at the [Terraform Learn documentation](https://learn.hashicorp.com/collections/terraform/azure-get-started?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS).

## Implement the Terraform code

Terraform provides many features for managing, building, deploying, and updating infrastructure. The steps below will just guide you through deploying and destroying your resources. The [Terraform Learn documentation](https://learn.hashicorp.com/collections/terraform/azure-get-started?utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) and [Terraform on Azure documentation](/azure/developer/terraform/) go into  more detail and should be reviewed if Terraform is part of your Azure infrastructure strategy.

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

    ```bash
    mkdir appservice_tf_quickstart
    cd appservice_tf_quickstart
    ```

1. Create a file named `main.tf` and insert the above code.

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

1. Provision the resources that are defined in the `main.tf` configuration file (Confirm the action by entering `yes` at the prompt).

    ```bash
    terraform apply
    ```

## Validate the deployment

1. On the main menu of the Azure portal, select **Resource groups** and navigate to the resource group you created with the above template. It will be named "myResourceGroup-" followed by a string of random integers.

1. You now see all the resources that Terraform has created (an App Service and an App Service Plan).

1. Select the **App Service** and navigate to the url to verify your site has been created properly. Instead, you can just browse to `http://<app_name>.azurewebsites.net/` where app name is "webapp-" followed by that same string of random integers from the resource group.

## Clean up resources

When no longer needed, either [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group) or head back to your terminal/command line and execute `terraform destroy` to delete all resources associated with this quickstart.

> [!NOTE]
> You can find more Azure App Service Terraform samples [here](./samples-terraform.md). You can find even more Terraform samples across all of the Azure services [here](https://github.com/hashicorp/terraform-provider-azurerm/tree/main/examples).
## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
> [!div class="nextstepaction"] 
> [Terraform samples for Azure App Service](./samples-terraform.md)
