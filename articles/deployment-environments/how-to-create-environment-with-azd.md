---
title: Create and access an environment by using the Azure Developer CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create an environment in an Azure Deployment Environments project by using the Azure Developer CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2023
ms.topic: how-to
ms.date: 10/26/2023
---

# Create an environment by using the Azure Developer CLI

In this article, you install the Azure Developer CLI and use it to create an environment in an Azure Deployment Environments project.

Azure Developer CLI (`azd`) is an open-source tool that accelerates the time it takes for you to get your application from local development environment to Azure. `azd` provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or CI/CD (continuous integration/continuous deployment).

:::image type="content" source="media/how-to-create-environment-with-azd/workflow.png" alt-text="alt text":::

## Prerequisites

Verify your configuration meets the following prerequisites to work with Azure Deployment Environments using `azd`:

- [Installed `azd` locally](/azure/developer/azure-developer-cli/install-azd) or have access to `azd` via Cloud Shell
- [Created and configured a dev center](/azure/deployment-environments/quickstart-create-and-configure-devcenter) with a project, environment types, and 
- A catalog containing `azd` templates, attached to your dev center.

## What are `azd` templates?

`azd` templates are collections of application code, editor/IDE configurations, and infrastructure code written in Bicep or Terraform. You can create our own templates, or adapt sample templates to meet your requirements. `azd` can then be used to deploy your application on Azure. 

Each `azd` template includes an azure.yaml file that defines and describes the apps and types of Azure resources included in the template.

Sample templates are available in at [Awesome AZD](https://azure.github.io/awesome-azd/).

To learn more about how to create `azd` templates, see:
- [Azure Developer CLI templates](/azure/developer/azure-developer-cli/azd-templates?branch=main&tabs=csharp)
- [Make your project compatible with Azure Developer CLI](/azure/developer/azure-developer-cli/make-azd-compatible?branch=main&pivots=azd-create)

## Enable Azure Deployment Environment support

You can configure `azd` to provision and deploy resources to your deployment environments using standard commands such as `azd up` or `azd provision`. To enable support for Azure Deployment Environments, run the following command:

```bash
azd config set platform.type devcenter
```

When `platform.type` is set to `devcenter`, all `azd` remote environment state and provisioning uses new dev center components. This configuration also means that the `infra` folder in your local templates is effectively ignored. Instead, `azd` uses one of the infrastructure templates defined in your dev center catalog for resource provisioning.

## Create an Azure Deployment Environment by using `azd`

When you meet the prerequisites and enabled Azure Deployment Environment support, you can create an environment by using `azd`. The following steps show you how to create an environment by using the `azd` CLI.

1. Log in to your Azure subscription:
   ```bash
   azd auth login
   ```

2. Verify that you're logged in to the correct subscription:
   ```bash
   azd config show
   ```
   The output looks like this:
   ```
   {
     "defaults": {
       "location": "eastus2",
       "subscription": "1f62d343-a210-7897-7809-23450b730a15"
     },
     "platform": {
       "type": "devcenter"
     },
     "template": {
       "sources": {
         "awesome-azd": {
           "key": "awesome-azd",
           "location": "https://aka.ms/awesome-azd/templates.json",
           "name": "Awesome AZD",
           "type": "awesome-azd"
         }
       }
     }
   }
   ```
   The `subscription` value should match the subscription you want to use for your environment.

3. Enable dev center support:
   ```bash
   azd config set platform.type devcenter
   ```

4. Initialize a new project using a template from the connected `azd` catalog:
    ```bash
    azd init
    ```
    You're prompted to select a template from the catalog. Select the template you want to use for your environment.

5.  Package, provision, and deploy your application to Azure Deployment Environments:
    ```bash
    azd up
    ```
    This command packages your application, provisions the resources defined in your dev center catalog, and deploys your application to the environment. The process can take several minutes to complete, depending on the size of your application and the number of resources that need to be provisioned.

    You can watch the environment provisioning process in the Azure portal or in the developer portal.

      :::image type="content" source="media/how-to-create-environment-with-azd/dev-portal-environment-creating.png" alt-text="Screenshot of an Environment tile in the developer portal, showing a status of Creating.":::
 
6. You now have a local environment where you can make changes, and a remote environment where you can test your changes. You can view your environments by using the following command:
    ```bash
    azd env list
    ```
    The output looks like this:
    ```
    NAME      DEFAULT   LOCAL     REMOTE
    ToDo      true      true      false
    todo      false     false     true
    ```

7. To view the details of your environment, select the link provided by `azd up`, or in the developer portal, on the Environment tile, select the **Environment Resources** link.

   :::image type="content" source="media/how-to-create-environment-with-azd/environment-resources.png" alt-text="Screenshot of the Azure portal showing newly created environment resources.":::

## Clean up resources

When you're finished with your environment, you can delete it by using the following command:
```bash
azd down
```
Confirm that you want to delete the environment by entering `y` when prompted.

:::image type="content" source="media/how-to-create-environment-with-azd/delete-environment-azd-down.png" alt-text="Screenshot showing the output of the azd down command.":::

## Use the `azd` menu in Visual Studio Code

You can use the `azd` menu in Visual Studio Code for performing common `azd` tasks, such as creating a new environment, provisioning resources, and deploying your application.

To access the AZD menu, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** to display the menu.

:::image type="content" source="media/how-to-create-environment-with-azd/azd-context-menu.png" alt-text="Screenshot of Visual Studio Code showing the AZD context menu.":::


## Related content
- [Create and configure a dev center](/azure/deployment-environments/quickstart-create-and-configure-devcenter)
- [What is the Azure Developer CLI?](/azure/developer/azure-developer-cli/overview)
- [Install or update the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)