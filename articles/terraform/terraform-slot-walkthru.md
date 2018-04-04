---
title: Terraform with Azure provider deployment slot
description: Terraform with Azure provider deployment slot tutorial
keywords: terraform, devops, virtual machine, Azure, deployment slots
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 4/04/2018
ms.topic: article
---

# Using Terraform to provision infrastructure with Azure deployment slots

[Azure deployment slots](/azure/app-service/web-sites-staged-publishing) allow you to swap between different versions of your app - such as production and staging - to minimize the impact of broken deployments. This article illustrates an example use of deployment slots by walking you through the deployment of two apps via GitHub and Azure. One app is hosted in a "production slot", while the second app is hosted in a "staging" slot. (The names "production" and "staging" are arbitrary and can be anything you want that represents your scenario.) Once your deployment slots have been configured, you can then use Terraform to swap between the two slots as needed.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **GitHub account** - A [GitHub](http://www.github.com) account is needed to fork and use the test GitHub repo.

## Create and apply the Terraform plan

1. Browse to the [Azure portal](http://portal.azure.com)

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview), and - if not done previously - select **Bash** as your environment.

    ![Cloud Shell prompt](./media/terraform-slot-walkthru/azure-portal-cloud-shell-button.png)

1. Change directories to the `clouddrive` directory.

    ```bash
    cd clouddrive
    ```

1. Create a directory named `deploy`.

    ```bash
    mkdir deploy
    ```

1. Create a directory named `swap`.

    ```bash
    mkdir swap
    ```

1. Verify that both directories have been successfully created using the `ls` bash command.

1. Change directories to the `deploy` directory.

    ```bash
    cd deploy
    ```

1. Using the [vi editor](https://www.debian.org/doc/manuals/debian-tutorial/ch-editor.html), create a file named `deploy.tf`, which will contain the [Terraform configuration(https://www.terraform.io/docs/configuration/index.html).

    ```bash
    vi deploy.tf
    ```

1. Enter insert mode by pressing the letter `i` key.

1. Paste the following code into the editor:

    ```HCL
    # Configure the Azure Provider
    provider "azurerm" { }

    resource "azurerm_resource_group" "slotDemo" {
    name = "slotDemoResourceGroup"
    location = "westus2"
    }

    resource "azurerm_app_service_plan" "slotDemo" {
    name                = "slotAppServicePlan"
    location            = "${azurerm_resource_group.slotDemo.location}"
    resource_group_name = "${azurerm_resource_group.slotDemo.name}"
    sku {
        tier = "Standard"
        size = "S1"
    }
    }

    resource "azurerm_app_service" "slotDemo" {
    name                = "slotAppService"
    location            = "${azurerm_resource_group.slotDemo.location}"
    resource_group_name = "${azurerm_resource_group.slotDemo.name}"
    app_service_plan_id = "${azurerm_app_service_plan.slotDemo.id}"
    }

    resource "azurerm_app_service_slot" "slotDemo" {
    name                = "slotAppServiceSlotOne"
    location            = "${azurerm_resource_group.slotDemo.location}"
    resource_group_name = "${azurerm_resource_group.slotDemo.name}"
    app_service_plan_id = "${azurerm_app_service_plan.slotDemo.id}"
    app_service_name    = "${azurerm_app_service.slotDemo.name}"
    }
    ```

1. Press the **&lt;Esc>** key to exit insert/append mode.

1. Save the file and exit the vi editor by entering the following command, followed by pressing **&lt;Enter>**:

    ```bash
    :wq
    ```

1. Once the file has been created, you can verify its contents.

    ```bash
    cat deploy.tf
    ```

1. Initialize Terraform.

    ```bash
    terraform init
    ```

1. Create the Terraform plan.

    ```bash
    terraform plan
    ```

1. Provision the resources defined in the `deploy.tf` configuration file. (Confirm the action by entering `yes` at the prompt.)

    ```bash
    terraform apply
    ```

1. Select **Resource Groups** to see the resources that were provisioned by Terraform.

    ![Azure portal Resource Groups](./media/terraform-slot-walkthru/resource-groups.png)


1. Select **slotDemoResourceGroup** to display each of the created resources.

    ![Resources created from the Terraform configuration file](./media/terraform-slot-walkthru/resources.png)

## Fork the test project

Before you can test the creation and swapping in and out of the deployment slots, you need to fork the test project from GitHub.

1. Browse to the [awesome-terraform repo on GitHub](https://github.com/Azure/awesome-terraform).

1. Fork the **awesome-terraform repo**.

    ![Fork the GitHub awesome-terraform repo](./media/terraform-slot-walkthru/fork-repo.png)

1. Follow any prompts to fork to your environment.

## Deploy from GitHub to your deployment slots

Once you have forked the test project repo, it's time to create and use the deployment slots.

1. Return to the Azure portal.

1. Select **Resource Groups**

1. Select **slotDemoResourceGroup**.

1. Select the **slotAppService** App Service resource. (Make sure to click the actual resource name, and not the checkbox next to it.)

1. Select **Deployment options**.

    ![Deployment options for an App Service resource](./media/terraform-slot-walkthru/deployment-options.png)

1. On the **Deployment option** tab, select **Choose Source**, and then select **GitHub**.

    ![Select deployment source](./media/terraform-slot-walkthru/select-source.png)

1. Select **Authorization**.

1. On the **Authorization** tab, select **Authorize**, and supply the credentials needed for Azure to access your GitHub account. 

1. Once Azure has validated your GitHub credentials, a message displays indicating that the authorization process has completed. Select **OK** to close the **Authorization** tab.

1. Select **Choose your organization** and select your organization.

1. Select **Choose project**.

1. On the **Choose project** tab, select the **awesome-terraform** project.

    ![Choose the awesome-terraform project](./media/terraform-slot-walkthru/choose-project.png)

1. Select **Choose branch**.

1. On the **Choose branch** tab, select **master**.

    ![Choose the master branch](./media/terraform-slot-walkthru/choose-branch.png)

1. On the **Deployment option** tab, select **OK**. Once you select **OK**, the Azure portal builds the **awesome-terraform** project and deploys it to the **slotAppService** production slot.

At this point, you have deployed the production slot. To deploy the staging slot, perform all of the previous steps in this section with only the following modifications:

- In step 4, **slotAppServiceSlotOne** resource.
- In step 13, "working" branch instead of the master branch.
    ![Choose Working Branch](./media/terraform-slot-walkthru/choose-branch-working.png)

## Putting it all together

At this point, you have set up `slotAppService` and `slotAppServiceSlotOne` to deploy the web app from different branches in GitHub. You can now preview the web app to validate that it was successfully deployed to the slots by selecting the URL on the resource's overview page in the Azure portal.

![Resource URL](./media/terraform-slot-walkthru/resource-url.png)

 If everything is deployed correctly, slotAppService should render a blue page with the page title **Slot Demo App 1** while the slotAppServiceSlotOne should render a green page with the page title **Slot Demo App 2**.

 To test swapping the deployment slots, perform the following steps:
 
 1. In your browser, open a new tab, and navigate to the slotAppService URL. 
 
 1. Return to the cloud shell in Azure portal.

 1. Change directories to the **swap** directory.

 1. Using the vi editor, create a file named `swap.tf`.
 
    ```bash
    vi swap.tf
    ```

1. Enter insert mode by pressing the letter `i` key.

1. Paste the following code into the editor:

    ```HCL
    # Configure the Azure Provider
    provider "azurerm" { }

    # Swap the Production Slot with the Deployment Slot
    resource "azurerm_app_service_active_slot" "slotDemoActiveSlot" {
    resource_group_name   = "slotDemoResourceGroup"
    app_service_name      = "slotAppService"
    app_service_slot_name = "slotappServiceSlotOne"
    }
    ```

1. Initialize Terraform.

    ```bash
    terraform init
    ```

1. Create the Terraform plan.

    ```bash
    terraform plan
    ```

1. Provision the resources defined in the `deploy.tf` configuration file. (Confirm the action by entering `yes` at the prompt.)

    ```bash
    terraform apply
    ```

1. Once Terraform has finished swapping the slots, return to the browser that is rendering the slotAppService web app and refresh the page. 

Notice that the web app that was in your slotAppServiceSlotOne staging slot has been swapped with the production slot and that the page now renders green. To return to the original version that was originally in the production slot, rerun the swap.tf by typing `terraform apply` so the original code is swapped again from the staging slot to the production slot.

## Next steps

- [Use an Azure Marketplace image to create a Terraform Linux virtual machine with Managed Service Identity](./terraform-vm-msi.md)