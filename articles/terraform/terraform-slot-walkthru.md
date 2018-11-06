---
title: Terraform with Azure provider deployment slots
description: Tutorial about using Terraform with Azure provider deployment slots
services: terraform
ms.service: terraform
keywords: terraform, devops, virtual machine, Azure, deployment slots
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 4/05/2018
---

# Use Terraform to provision infrastructure with Azure deployment slots

You can use [Azure deployment slots](/azure/app-service/web-sites-staged-publishing) to swap between different versions of your app. That ability helps you minimize the impact of broken deployments. 

This article illustrates an example use of deployment slots by walking you through the deployment of two apps via GitHub and Azure. One app is hosted in a production slot. The second app is hosted in a staging slot. (The names "production" and "staging" are arbitrary and can be anything you want that represents your scenario.) After you configure your deployment slots, you can use Terraform to swap between the two slots as needed.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **GitHub account**: You need a [GitHub](http://www.github.com) account to fork and use the test GitHub repo.

## Create and apply the Terraform plan

1. Browse to the [Azure portal](http://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview). If you didn't select an environment previously, select **Bash** as your environment.

    ![Cloud Shell prompt](./media/terraform-slot-walkthru/azure-portal-cloud-shell-button-min.png)

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

1. Use the `ls` bash command to verify that you successfully created both directories.

    ![Cloud shell after creating directories](./media/terraform-slot-walkthru/cloud-shell-after-creating-dirs.png)

1. Change directories to the `deploy` directory.

    ```bash
    cd deploy
    ```

1. By using the [vi editor](https://www.debian.org/doc/manuals/debian-tutorial/ch-editor.html), create a file named `deploy.tf`. This file will contain the [Terraform configuration](https://www.terraform.io/docs/configuration/index.html).

    ```bash
    vi deploy.tf
    ```

1. Enter insert mode by selecting the I key.

1. Paste the following code into the editor:

    ```JSON
    # Configure the Azure provider
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

1. Select the Esc key to exit insert mode.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

1. Now that you've created the file, verify its contents.

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

1. Provision the resources that are defined in the `deploy.tf` configuration file. (Confirm the action by entering `yes` at the prompt.)

    ```bash
    terraform apply
    ```

1. Close the Cloud Shell window.

1. On the main menu of the Azure portal, select **Resource groups**.

    !["Resource groups" selection in the portal](./media/terraform-slot-walkthru/resource-groups-menu-option.png)

1. On the **Resource groups** tab, select **slotDemoResourceGroup**.

    ![Resource group created by Terraform](./media/terraform-slot-walkthru/resource-group.png)

You now see all the resources that Terraform has created.

![Resources created by Terraform](./media/terraform-slot-walkthru/resources.png)

## Fork the test project

Before you can test the creation and swapping in and out of the deployment slots, you need to fork the test project from GitHub.

1. Browse to the [awesome-terraform repo on GitHub](https://github.com/Azure/awesome-terraform).

1. Fork the **awesome-terraform** repo.

    ![Fork the GitHub awesome-terraform repo](./media/terraform-slot-walkthru/fork-repo.png)

1. Follow any prompts to fork to your environment.

## Deploy from GitHub to your deployment slots

After you fork the test project repo, configure the deployment slots via the following steps:

1. On the main menu of the Azure portal, select **Resource groups**.

1. Select **slotDemoResourceGroup**.

1. Select **slotAppService**.

1. Select **Deployment options**.

    ![Deployment options for an App Service resource](./media/terraform-slot-walkthru/deployment-options.png)

1. On the **Deployment option** tab, select **Choose Source**, and then select **GitHub**.

    ![Select deployment source](./media/terraform-slot-walkthru/select-source.png)

1. After Azure makes the connection and displays all the options, select **Authorization**.

1. On the **Authorization** tab, select **Authorize**, and supply the credentials that Azure needs to access your GitHub account. 

1. After Azure validates your GitHub credentials, a message appears and says that the authorization process has finished. Select **OK** to close the **Authorization** tab.

1. Select **Choose your organization** and select your organization.

1. Select **Choose project**.

1. On the **Choose project** tab, select the **awesome-terraform** project.

    ![Choose the awesome-terraform project](./media/terraform-slot-walkthru/choose-project.png)

1. Select **Choose branch**.

1. On the **Choose branch** tab, select **master**.

    ![Choose the master branch](./media/terraform-slot-walkthru/choose-branch-master.png)

1. On the **Deployment option** tab, select **OK**.

At this point, you have deployed the production slot. To deploy the staging slot, perform all of the previous steps in this section with only the following modifications:

- In step 3, select the **slotAppServiceSlotOne** resource.

- In step 13, select the working branch instead of the master branch.

    ![Choose the working branch](./media/terraform-slot-walkthru/choose-branch-working.png)

## Test the app deployments

In the previous sections, you set up two slots--**slotAppService** and **slotAppServiceSlotOne**--to deploy from different branches in GitHub. Let's preview the web apps to validate that they were successfully deployed.

Perform the following steps 2 times. In step 3, you select **slotAppService** the first time, and then select **slotAppServiceSlotOne** the second time.

1. On the main menu of the Azure portal, select **Resource groups**.

1. Select **slotDemoResourceGroup**.

1. Select either **slotAppService** or **slotAppServiceSlotOne**.

1. On the overview page, select **URL**.

    ![Select the URL on the overview tab to render the app](./media/terraform-slot-walkthru/resource-url.png)

> [!NOTE]
> It can take several minutes for Azure to build and deploy the site from GitHub.
>
>

For the **slotAppService** web app, you see a blue page with a page title of **Slot Demo App 1**. For the **slotAppServiceSlotOne** web app, you see a green page with a page title of **Slot Demo App 2**.

![Preview the apps to test that they were deployed correctly](./media/terraform-slot-walkthru/app-preview.png)

## Swap the two deployment slots

To test swapping the two deployment slots, perform the following steps:
 
1. Switch to the browser tab that's running **slotAppService** (the app with the blue page). 

1. Return to the Azure portal on a separate tab.

1. Open Cloud Shell.

1. Change directories to the **clouddrive/swap** directory.

    ```bash
    cd clouddrive/swap
    ```

1. By using the vi editor, create a file named `swap.tf`.

    ```bash
    vi swap.tf
    ```

1. Enter insert mode by selecting the I key.

1. Paste the following code into the editor:

    ```JSON
    # Configure the Azure provider
    provider "azurerm" { }

    # Swap the production slot and the staging slot
    resource "azurerm_app_service_active_slot" "slotDemoActiveSlot" {
        resource_group_name   = "slotDemoResourceGroup"
        app_service_name      = "slotAppService"
        app_service_slot_name = "slotappServiceSlotOne"
    }
    ```

1. Select the Esc key to exit insert mode.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

1. Initialize Terraform.

    ```bash
    terraform init
    ```

1. Create the Terraform plan.

    ```bash
    terraform plan
    ```

1. Provision the resources that are defined in the `swap.tf` configuration file. (Confirm the action by entering `yes` at the prompt.)

    ```bash
    terraform apply
    ```

1. After Terraform has finished swapping the slots, return to the browser that is rendering the **slotAppService** web app and refresh the page. 

The web app in your **slotAppServiceSlotOne** staging slot has been swapped with the production slot and is now rendered in green. 

![The deployment slots have been swapped](./media/terraform-slot-walkthru/slots-swapped.png)

To return to the original production version of the app, reapply the Terraform plan that you created from the `swap.tf` configuration file.

```bash
terraform apply
```

After the app is swapped, you see the original configuration.