---
title: Create and access an environment by using the Azure Developer CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create an environment in an Azure Deployment Environments project by using the Azure Developer CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2023
ms.topic: how-to
ms.date: 11/07/2023
---

# Create an environment by using the Azure Developer CLI

In this article, you install the Azure Developer CLI (AZD), create a new deployment environment by provisioning your app infrastructure to Azure Deployment Environments, and deploy your app code onto the provisioned deployment environment.

Azure Developer CLI (AZD) is an open-source tool that accelerates the time it takes for you to get your application from local development environment to Azure. AZD provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or CI/CD (continuous integration/continuous deployment).

## Prerequisites

You should:
- Be familiar with Azure Deployment Environments. Review [What is Azure Deployment Environments?](overview-what-is-azure-deployment-environments.md) and [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).
- Create and configure a dev center with a project, environment types, and a catalog. Use the following articles as guidance:
   - [Quickstart: Create and configure a dev center for Azure Deployment Environments](/azure/deployment-environments/quickstart-create-and-configure-devcenter).
   - [Quickstart: Create and configure an Azure Deployment Environments project](quickstart-create-and-configure-projects.md)
- A catalog attached to your dev center.

## AZD compatible catalogs

Azure Deployment Environments catalogs consist of environment definitions: IaC templates that define the resources that are provisioned for a deployment environment. Azure Developer CLI uses environment definitions in the attached catalog to provision new environments. 

> [!NOTE]
> Currently, Azure Developer CLI works with ARM templates stored in the Azure Deployment Environments dev center catalog.

To properly support certain Azure Compute services, Azure Developer CLI requires more configuration settings in the IaC template. For example, you must tag app service hosts with specific information so that AZD knows how to find the hosts and deploy the app to them.

You can see a list of supported Azure services here: [Supported Azure compute services (host)](/azure/developer/azure-developer-cli/supported-languages-environments).

To get help with AZD compatibility, see [Make your project compatible with Azure Developer CLI](/azure/developer/azure-developer-cli/make-azd-compatible?pivots=azd-create).  


## Prepare to work with AZD 

When you work with AZD for the first time, there are some one-time setup tasks you need to complete. These tasks include installing the Azure Developer CLI, signing in to your Azure account, and enabling AZD support for Azure Deployment Environments.

### Install the Azure Developer CLI extension for Visual Studio Code

To enable Azure Developer CLI features in Visual Studio Code, install the Azure Developer CLI extension, version v0.8.0-alpha.1-beta.3173884. Select the **Extensions** icon in the Activity bar, search for **Azure Developer CLI**, and then select **Install**.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/install-azure-developer-cli-small.png" alt-text="Screenshot of Visual Studio Code, showing the Sign in command in the command palette." lightbox="media/how-to-create-environment-with-azure-developer/install-azure-developer-cli-large.png":::

### Sign in with Azure Developer CLI

Sign in to AZD using the command palette:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-sign-in.png" alt-text="Screenshot of Visual Studio Code, showing the Extensions pane with the Azure Developer CLI and Install highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-sign-in.png":::

The output of commands issued from the command palette is displayed in an **azd dev** terminal like the following example:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/press-any-key.png" alt-text="Screenshot of the azd dev terminal, showing the press any key to close message." lightbox="media/how-to-create-environment-with-azure-developer/press-any-key.png":::

### Enable AZD support for ADE

You can configure AZD to provision and deploy resources to your deployment environments using standard commands such as `azd up` or `azd provision`. When `platform.type` is set to `devcenter`, all AZD remote environment state and provisioning uses dev center components. AZD uses one of the infrastructure templates defined in your dev center catalog for resource provisioning. In this configuration, the infra folder in your local templates isn’t used. 

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-enable-support.png" alt-text="Screenshot of Visual Studio Code, showing the Enable support command in the command palette." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-enable-support.png":::

## Create an environment from existing code

Now you're ready to create an environment to work in. You can begin with code in a local folder, or you can clone an existing repository. In this example, you create an environment by using code in a local folder. 

### Initialize a new application

Initializing a new application creates the files and folders that are required for AZD to work with your application.

AZD uses an *azure.yaml* file to define the environment. The azure.yaml file defines and describes the apps and types of Azure resources that the application uses. To learn more about azure.yaml, see [Azure Developer CLI's azure.yaml schema](/azure/developer/azure-developer-cli/azd-schema).

1. In Visual Studio Code, and then open the folder that contains your application code.

1. Open the command palette, and enter *Azure Developer CLI init*, then from the list, select **Azure Developer CLI (azd): init**.
 
    :::image type="content" source="media/how-to-create-environment-with-azure-developer/command-palette-azure-developer-initialize.png" alt-text="Screenshot of the Visual Studio Code command palette with Azure Developer CLI (azd): init highlighted." lightbox="media/how-to-create-environment-with-azure-developer/command-palette-azure-developer-initialize.png":::
 
1. In the list of templates, to continue without selecting a template, press ENTER twice.
 
1. In the AZD terminal, select ***Use code in the current directory***. 
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/use-code-current-directory.png" alt-text="Screenshot of the AZD terminal in Visual Studio Code, showing the Use code in current directory prompt." lightbox="media/how-to-create-environment-with-azure-developer/use-code-current-directory.png":::

1. AZD scans the current directory and gathers more information depending on the type of app you're building. Follow the prompts to configure your AZD environment.

1. Finally, enter a name for your environment. 

AZD creates an *azure.yaml* file in the root of your project. 

### Provision infrastructure to Azure Deployment Environment

When you're ready, you can provision your local environment to a remote Azure Deployment Environments environment in Azure. This process provisions the infrastructure and resources defined in the environment definition in your dev center catalog.

1. In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Provision Azure Resources (provision)**.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-provision.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Provision environment highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-provision.png":::

1. AZD scans Azure Deployment Environments for projects that you have access to. In the AZD terminal, select or enter the following:
    1. Project
    1. Environment definition
    1. Environment name
    1. Location
 
1. AZD instructs ADE to create a new environment based on the information you gave in the previous step.
 
1. You can view the resources created in the Azure portal or in the [developer portal](https://devportal.microsoft.com).

### List existing environments (optional)

Verify that your environment is created by listing the existing environments.

In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **View Local and Remote Environments (env list)**.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-list.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and View Local and Remote environments highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-list.png":::

You're prompted to select a project and an environment definition.

### Deploy code to Azure Deployment Environments

When your environment is provisioned, you can deploy your code to the environment.

1. In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Deploy Azure Resources (deploy)**.
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-env-deploy.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Deploy to Azure highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-env-deploy.png":::
 
1. You can verify that your code is deployed by selecting the end point URLs listed in the AZD terminal.

## Clean up resources

When you're finished with your environment, you can delete the Azure resources.

In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Delete Deployment and Resources (down)**.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-down.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Delete Deployment and Resources (down) highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-down.png":::

Confirm that you want to delete the environment by entering `y` when prompted.

## Related content
- [Create and configure a dev center](/azure/deployment-environments/quickstart-create-and-configure-devcenter)
- [What is the Azure Developer CLI?](/azure/developer/azure-developer-cli/overview)
- [Install or update the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)