---
title: Create and access an environment by using the Azure Developer CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create an environment in an Azure Deployment Environments project by using the Azure Developer CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2023
ms.topic: how-to
ms.date: 01/26/2023

# Customer intent: As a developer, I want to be able to create an environment by using AZD so that I can create my coding environment.

---

# Create an environment by using the Azure Developer CLI

In this article, you install the Azure Developer CLI (AZD), create a new deployment environment by provisioning your app infrastructure to Azure Deployment Environments, and deploy your app code onto the provisioned deployment environment.

Azure Developer CLI (AZD) is an open-source tool that accelerates the time it takes for you to get your application from local development environment to Azure. AZD provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or CI/CD (continuous integration/continuous deployment).

To learn how to set up AZD to work with Azure Deployment Environments, see [Use Azure Developer CLI with Azure Deployment Environments](/azure/deployment-environments/concept-azure-developer-cli-with-deployment-environments).

## Prerequisites

You should:
- Be familiar with Azure Deployment Environments. Review [What is Azure Deployment Environments?](overview-what-is-azure-deployment-environments.md) and [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).
- Create and configure a dev center with a project, environment types, and a catalog. Use the following article as guidance:
   - [Quickstart: Configure Azure Deployment Environments](/azure/deployment-environments/quickstart-create-and-configure-devcenter).
- A catalog attached to your dev center.

## Prepare to work with AZD 

When you work with AZD for the first time, there are some one-time setup tasks you need to complete. These tasks include installing the Azure Developer CLI, signing in to your Azure account, and enabling AZD support for Azure Deployment Environments.

### Install the Azure Developer CLI extension for Visual Studio Code

When you install azd, the azd tools are installed within azd scope rather than globally, and are removed if azd is uninstalled. You can install azd in Visual Studio Code or from the command line.

# [Visual Studio Code](#tab/visual-studio-code)

To enable Azure Developer CLI features in Visual Studio Code, install the Azure Developer CLI extension, version v0.8.0-alpha.1-beta.3173884. Select the **Extensions** icon in the Activity bar, search for **Azure Developer CLI**, and then select **Install**.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/install-azure-developer-cli-small.png" alt-text="Screenshot of Visual Studio Code, showing the Sign in command in the command palette." lightbox="media/how-to-create-environment-with-azure-developer/install-azure-developer-cli-large.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)


```bash
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```

# [Visual Studio](#tab/visual-studio)

In Visual Studio 2022 17.3 Preview 2 or later, you can enable integration with azd as a preview feature. 

To enable the azd feature, go to **Tools** > **Options** > **Environment** > **Preview Features** and select **Integration with azd, the Azure Developer CLI**.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-visual-studio.png" alt-text="Screenshot showing the Visual Studio Preview features dialog, with Integration with azd, the Azure Developer CLI selected." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-visual-studio.png":::

When the feature is enabled, you can use the Azure Developer CLI from your terminal of choice on Windows, Linux, or macOS.

---

### Sign in with Azure Developer CLI

Access your Azure resources by logging in. When you initiate a log in, a browser window opens and prompts you to log in to Azure. After you sign in, the terminal displays a message that you're signed in to Azure.

Sign in to AZD using the command palette:

# [Visual Studio Code](#tab/visual-studio-code)

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-sign-in.png" alt-text="Screenshot of Visual Studio Code, showing the Extensions pane with the Azure Developer CLI and Install highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-sign-in.png":::

The output of commands issued from the command palette is displayed in an **azd dev** terminal like the following example:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/press-any-key.png" alt-text="Screenshot of the azd dev terminal, showing the press any key to close message." lightbox="media/how-to-create-environment-with-azure-developer/press-any-key.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)

Sign in to Azure at the CLI using the following command: 

```bash
 azd auth login
```

:::image type="content" source="media/how-to-create-environment-with-azure-developer/login.png" alt-text="Screenshot showing the azd auth login command and its result in the terminal." lightbox="media/how-to-create-environment-with-azure-developer/login.png":::

# [Visual Studio](#tab/visual-studio)

Access your Azure resources by logging in. When you initiate a log in, a browser window opens and prompts you to log in to Azure. After you sign in, the terminal displays a message that you're signed in to Azure.

To open the Developer Command prompt:

1. From the Tools menu, select **Terminal**.
1. In the **Terminal** window, select **Developer Command Prompt**.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-developer-command-prompt.png" alt-text="Screenshot showing the terminal window menu with Developer Command Prompt highlighted." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-developer-command-prompt.png":::

Sign in to AZD using the Developer Command Terminal:

```bash
 azd auth login
```

:::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-azure-developer-login.png" alt-text="Screenshot showing the azd auth login command and its result in the Developer Command Prompt." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-azure-developer-login.png":::

---

### Enable AZD support for ADE

You can configure AZD to provision and deploy resources to your deployment environments using standard commands such as `azd up` or `azd provision`. When `platform.type` is set to `devcenter`, all AZD remote environment state and provisioning uses dev center components. AZD uses one of the infrastructure templates defined in your dev center catalog for resource provisioning. In this configuration, the *infra* folder in your local templates isn’t used. 

# [Visual Studio Code](#tab/visual-studio-code)

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-enable-support.png" alt-text="Screenshot of Visual Studio Code, showing the Enable support command in the command palette." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-enable-support.png":::


# [Azure Developer CLI](#tab/azure-developer-cli)

```bash
 azd config set platform.type devcenter
```

# [Visual Studio](#tab/visual-studio)

```bash
 azd config set platform.type devcenter
```
---

## Create an environment from existing code

Now you're ready to create an environment to work in. You can begin with code in a local folder, or you can clone an existing repository. In this example, you create an environment by using code in a local folder. 

### Initialize a new application

Initializing a new application creates the files and folders that are required for AZD to work with your application.

AZD uses an *azure.yaml* file to define the environment. The azure.yaml file defines and describes the apps and types of Azure resources that the application uses. To learn more about azure.yaml, see [Azure Developer CLI's azure.yaml schema](/azure/developer/azure-developer-cli/azd-schema).

# [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open the folder that contains your application code.

1. Open the command palette, and enter *Azure Developer CLI init*, then from the list, select **Azure Developer CLI (azd): init**.
 
    :::image type="content" source="media/how-to-create-environment-with-azure-developer/command-palette-azure-developer-initialize.png" alt-text="Screenshot of the Visual Studio Code command palette with Azure Developer CLI (azd): init highlighted." lightbox="media/how-to-create-environment-with-azure-developer/command-palette-azure-developer-initialize.png":::
 
1. In the list of templates, to continue without selecting a template, press ENTER twice.
 
1. In the AZD terminal, select ***Use code in the current directory***. 
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/use-code-current-directory.png" alt-text="Screenshot of the AZD terminal in Visual Studio Code, showing the Use code in current directory prompt." lightbox="media/how-to-create-environment-with-azure-developer/use-code-current-directory.png":::

1. `azd init` identifies the services defined in your app code and prompts you to confirm and continue, remove a service, or add a service. Select ***Confirm and continue initializing my app***.  
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-services.png" alt-text="Screenshot showing the AZD init prompt to confirm and continue, remove a service, or add a service." lightbox="media/how-to-create-environment-with-azure-developer/initialize-services.png":::

1. `azd init` continues to gather information to configure your app. For this example application, you're prompted for the name of your MongoDB database instance, and ports that the services listen on.
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-app-services.png" alt-text="Screenshot showing the azd init prompt for a database name." lightbox="media/how-to-create-environment-with-azure-developer/initialize-app-services.png":::
 
1. Enter a name for your local AZD environment. 
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-new-environment-name.png" alt-text="Screenshot showing azd init prompt Enter a new environment name." lightbox="media/how-to-create-environment-with-azure-developer/initialize-new-environment-name.png":::

1. `azd init` displays a list of the projects you have access to. Select the project for your environment

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-select-project.png" alt-text="Screenshot showing azd init prompt Select project." lightbox="media/how-to-create-environment-with-azure-developer/initialize-select-project.png":::
 
1. `azd init` displays a list of environment definitions in the project. Select an environment definition.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/select-environment-definition.png" alt-text="Screenshot showing azd init prompt Select environment definitions." lightbox="media/how-to-create-environment-with-azure-developer/select-environment-definition.png":::


   AZD creates the project resources, including an *azure.yaml* file in the root of your project. 

# [Azure Developer CLI](#tab/azure-developer-cli)

1. At the CLI, navigate to the folder that contains your application code.
 
1. Run the following command to initialize your application and supply information when prompted:

   ```bash
   azd init
   ```
1. In the AZD terminal, select ***Use code in the current directory***.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-folder.png" alt-text="Screenshot showing the az init command and the prompt How do you want to initialize your app." lightbox="media/how-to-create-environment-with-azure-developer/initialize-folder.png":::

   AZD scans the current directory and gathers more information depending on the type of app you're building. Follow the prompts to configure your AZD environment.

1. `azd init` identifies the services defined in your app code and prompts you to confirm and continue, remove a service, or add a service. Select ***Confirm and continue initializing my app***.  
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-services.png" alt-text="Screenshot showing the AZD init prompt to confirm and continue, remove a service, or add a service." lightbox="media/how-to-create-environment-with-azure-developer/initialize-services.png":::

1. `azd init` continues to gather information to configure your app. For this example application, you're prompted for the name of your MongoDB database instance, and ports that the services listen on.
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-app-services.png" alt-text="Screenshot showing the azd init prompt for a database name." lightbox="media/how-to-create-environment-with-azure-developer/initialize-app-services.png":::
 
1. Enter a name for your local AZD environment. 
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-new-environment-name.png" alt-text="Screenshot showing azd init prompt Enter a new environment name." lightbox="media/how-to-create-environment-with-azure-developer/initialize-new-environment-name.png":::

1. `azd init` displays a list of the projects you have access to. Select the project for your environment.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/initialize-select-project.png" alt-text="Screenshot showing azd init prompt Select project." lightbox="media/how-to-create-environment-with-azure-developer/initialize-select-project.png":::
 
1. `azd init` displays a list of environment definitions in the project. Select an environment definition.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/select-environment-definition.png" alt-text="Screenshot showing azd init prompt Select environment definitions." lightbox="media/how-to-create-environment-with-azure-developer/select-environment-definition.png":::

   AZD creates the project resources, including an *azure.yaml* file in the root of your project. 

# [Visual Studio](#tab/visual-studio)

1. At the CLI, navigate to the folder that contains your application code.
 
1. Run the following command to initialize your application and supply information when prompted:

   ```bash
   azd init
   ```
1. In the AZD terminal, select ***Use code in the current directory***.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-folder.png" alt-text="Screenshot showing the az init command and the prompt How do you want to initialize your app." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-folder.png":::

   AZD scans the current directory and gathers more information depending on the type of app you're building. Follow the prompts to configure your AZD environment.

1. `azd init` identifies the services defined in your app code and prompts you to confirm and continue, remove a service, or add a service. Select ***Confirm and continue initializing my app***.  
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-services.png" alt-text="Screenshot showing the AZD init prompt to confirm and continue, remove a service, or add a service." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-services.png":::
 
1. `azd init` continues to gather information to configure your app. For this example application, you're prompted for the name of your MongoDB database instance, and ports that the services listen on.
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-app-services.png" alt-text="Screenshot showing the azd init prompt for a database name." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-app-services.png":::
   
1. Enter a name for your local AZD environment. 
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-new-environment-name.png" alt-text="Screenshot showing azd init prompt Enter a new environment name." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-new-environment-name.png":::
 
1. `azd init` displays a list of the projects you have access to. Select the project for your environment.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-select-project.png" alt-text="Screenshot showing azd init prompt Select project." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-initialize-select-project.png":::
  
1. `azd init` displays a list of environment definitions in the project. Select an environment definition.

   AZD creates the project resources, including an *azure.yaml* file in the root of your project. 

---

### Provision infrastructure to Azure Deployment Environment

When you're ready, you can provision your local environment to a remote Azure Deployment Environments environment in Azure. This process provisions the infrastructure and resources defined in the environment definition in your dev center catalog.

# [Visual Studio Code](#tab/visual-studio-code)

1. In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Provision Azure Resources (provision)**.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-provision.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Provision environment highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-provision.png":::

1. AZD scans Azure Deployment Environments for projects that you have access to. In the AZD terminal, select or enter the following information:
    1. Project
    1. Environment definition
    1. Environment type
    1. Location
 
1. AZD instructs ADE to create a new environment based on the information you gave in the previous step.
 
1. You can view the resources created in the Azure portal or in the [developer portal](https://devportal.microsoft.com).

# [Azure Developer CLI](#tab/azure-developer-cli)

Provision your application to Azure using the following command:

```bash
azd provision
```

1. 'azd provision' provides a list of projects that you have access to. Select the project that you want to provision your application to.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/select-project.png" alt-text="Screenshot showing the azd init prompt to select a project." lightbox="media/how-to-create-environment-with-azure-developer/select-project.png":::

1. 'azd provision' provides a list of environment definitions in the selected project. Select the environment definition that you want to use to provision your application.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/select-environment-definition.png" alt-text="Screenshot showing the azd init prompt to select an environment definition." lightbox="media/how-to-create-environment-with-azure-developer/select-environment-definition.png":::

1. 'azd provision' provides a list of environment types in the selected project. Select the environment type that you want to use to provision your application.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/select-environment-type.png" alt-text="Screenshot showing the azd init prompt to select an environment type." lightbox="media/how-to-create-environment-with-azure-developer/select-environment-type.png":::

1. AZD instructs ADE to create a new environment based on the information you gave in the previous step.
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/provision-progress.png" alt-text="Screenshot showing the AZD provisioning progress." lightbox="media/how-to-create-environment-with-azure-developer/provision-progress.png":::
 
1. You can view the resources created in the Azure portal or in the [developer portal](https://devportal.microsoft.com).

# [Visual Studio](#tab/visual-studio)

Provision your application to Azure using the following command:

```bash
azd provision
```

1. 'azd provision' provides a list of projects that you have access to. Select the project that you want to provision your application to.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-select-project.png" alt-text="Screenshot showing the azd init prompt to select a project." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-select-project.png":::

1. 'azd provision' provides a list of environment definitions in the selected project. Select the environment definition that you want to use to provision your application.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-select-environment-type.png" alt-text="Screenshot showing the azd init prompt to select an environment type." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-select-environment-type.png":::

1. 'azd provision' provides a list of environment types in the selected project. Select the environment type that you want to use to provision your application.

1. AZD instructs ADE to create a new environment based on the information you gave in the previous step.
 
1. You can view the resources created in the Azure portal or in the [developer portal](https://devportal.microsoft.com).
---

### List existing environments (optional)

Verify that your environment is created by listing the existing environments.

# [Visual Studio Code](#tab/visual-studio-code)

1. In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **View Local and Remote Environments (env list)**.

   :::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-list.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and View Local and Remote environments highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-list.png":::

   You're prompted to select a project and an environment definition.

# [Azure Developer CLI](#tab/azure-developer-cli)

Use the following command to view the environments that you have access to: the local AZD environment and the remote Azure Deployment Environments environment.

```bash
azd env list
```

`azd env list` prompts you to select a project and an environment definition.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/environments-list.png" alt-text="Screenshot showing the local AZD environment and the remote Azure environment." lightbox="media/how-to-create-environment-with-azure-developer/environments-list.png":::

# [Visual Studio](#tab/visual-studio)

Use the following command to view the environments that you have access to: the local AZD environment and the remote Azure Deployment Environments environment.

```bash
azd env list
```

`azd env list` prompts you to select a project and an environment definition.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/visual-studio-environment-list.png" alt-text="Screenshot showing the local AZD environment and the remote Azure environment." lightbox="media/how-to-create-environment-with-azure-developer/visual-studio-environment-list.png":::

---

### Deploy code to Azure Deployment Environments

When your environment is provisioned, you can deploy your code to the environment.

# [Visual Studio Code](#tab/visual-studio-code)

1. In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Deploy Azure Resources (deploy)**.
 
   :::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-env-deploy.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Deploy to Azure highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-env-deploy.png":::
 
1. You can verify that your code is deployed by selecting the end point URLs listed in the AZD terminal.

# [Azure Developer CLI](#tab/azure-developer-cli)

Deploy your application code to the remote Azure Deployment Environments environment you provisioned using the following command:

```bash
azd deploy
```
Deploying your code to the remote environment can take several minutes. 

You can view the progress of the deployment in the Azure portal:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-portal-deploy-in-progress.png" alt-text="Screenshot showing AZD provisioning progress in the Azure portal." lightbox="media/how-to-create-environment-with-azure-developer/azure-portal-deploy-in-progress.png":::

When deployment completes, you can view the resources that were provisioned in the Azure portal:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-portal-resources.png" alt-text="Screenshot showing AZD provisioned resources in the Azure portal." lightbox="media/how-to-create-environment-with-azure-developer/azure-portal-resources.png":::

You can verify that your code is deployed by selecting the end point URLs listed in the AZD terminal.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/deploy-endpoint.png" alt-text="Screenshot showing the endpoint AZD deploy creates." lightbox="media/how-to-create-environment-with-azure-developer/deploy-endpoint.png":::

For this sample application, you see something like this:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/test-swagger.png" alt-text="Screenshot showing application in swagger interface." lightbox="media/how-to-create-environment-with-azure-developer/test-swagger.png":::

# [Visual Studio](#tab/visual-studio)

Deploy your application code to the remote Azure Deployment Environments environment you provisioned using the following command:

```bash
azd deploy
```
Deploying your code to the remote environment can take several minutes. 

You can view the progress of the deployment in the Azure portal:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-portal-deploy-in-progress.png" alt-text="Screenshot showing AZD provisioning progress in the Azure portal." lightbox="media/how-to-create-environment-with-azure-developer/azure-portal-deploy-in-progress.png":::

When deployment completes, you can view the resources that were provisioned in the Azure portal:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-portal-resources.png" alt-text="Screenshot showing AZD provisioned resources in the Azure portal." lightbox="media/how-to-create-environment-with-azure-developer/azure-portal-resources.png":::

You can verify that your code is deployed by selecting the end point URLs listed in the AZD terminal.

---

## Clean up resources

When you're finished with your environment, you can delete the Azure resources.

# [Visual Studio Code](#tab/visual-studio-code)

In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Delete Deployment and Resources (down)**.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-down.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Delete Deployment and Resources (down) highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-menu-environment-down.png":::

Confirm that you want to delete the environment by entering `y` when prompted.

# [Azure Developer CLI](#tab/azure-developer-cli)

Delete your Azure resources by using the following command:

```bash
azd down --environment <environmentName>
```

# [Visual Studio](#tab/visual-studio)

Delete your Azure resources by using the following command:

```bash
azd down --environment <environmentName>
```

---

## Related content
- [Create and configure a dev center](/azure/deployment-environments/quickstart-create-and-configure-devcenter)
- [What is the Azure Developer CLI?](/azure/developer/azure-developer-cli/overview)
- [Install or update the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
