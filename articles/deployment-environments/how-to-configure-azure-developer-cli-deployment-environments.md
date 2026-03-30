---
title: Create an environment with Azure Developer CLI
description: Use an `azd` template to provision application infrastructure and deploy application code to the new infrastructure.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: how-to
ms.date: 11/27/2024

# Customer intent: As a developer, I want to use ADE and `azd` together to provision application infrastructure and deploy application code to the new infrastructure.

---

# Create an environment from an Azure Developer CLI template

In this article, you create a new environment from an existing Azure Developer CLI (`azd`) compatible template by using `azd`. You learn how to configure Azure Deployment Environments (ADE) and `azd` to work together to provision application infrastructure and deploy application code to the new infrastructure.

To learn the key concepts of how `azd` and ADE work together, see [Use Azure Developer CLI with Azure Deployment Environments](concept-azure-developer-cli-with-deployment-environments.md).

## Prerequisites

- Create and configure a dev center with a project, environment types, and catalog. Use the following article as guidance:
   - [Quickstart: Configure Azure Deployment Environments](/azure/deployment-environments/quickstart-create-and-configure-devcenter).

## Attach Microsoft quick start catalog

Microsoft provides a quick start catalog that contains a set of `azd` compatible templates that you can use to create environments. You can attach the quick start catalog to your dev center at creation or add it later. The quick start catalog contains a set of templates that you can use to create environments.

## Examine an `azd` compatible template

You can use an existing `azd` compatible template to create a new environment, or you can add an azure.yaml file to your repository. In this section, you examine an existing `azd` compatible template.

`azd` provisioning for environments relies on curated templates from the catalog. Templates in the catalog might assign tags to provisioned Azure resources for you to associate your app services with in the azure.yaml file, or specify the resources explicitly. In this example, resources are specified explicitly.

For more information on tagging resources, see [Tagging resources for Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration#tagging-resources-for-azure-deployment-environments).

1. In the [Azure portal](https://portal.azure.com), navigate to your dev center.

1. In the left menu under **Environment configuration**, select **Catalogs**, and then copy the quick start catalog **Clone URL**.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/catalog-url.png" alt-text="Screenshot of Azure portal showing the catalogs attached to a dev center, with clone URL highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/catalog-url.png":::

1. To view the quick start catalog in GitHub, paste the **Clone URL** into the address bar and press Enter. Or, you can use the following URL: [Microsoft quick start catalog](https://aka.ms/deployment-environments/quickstart-catalog).

1. In the GitHub repository, navigate to the **Environment-Definitions/ARMTemplates/Function-App-with-Cosmos_AZD-template** folder.

1. Open the **environment.yaml** file. At the end of the file, you see the allowed repositories that contain sample application source code.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/application-source-templates.png" alt-text="Screenshot of GitHub repository, showing the environment.yaml file with source templates highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/application-source-templates.png":::

1. Copy the **https://github.com/azure-samples/todo-python-mongo-swa-func** repository URL, and then navigate to the repository in GitHub.

1. In the root of the repository, open the **azure.yaml** file.

1. In the azure.yaml file, in the **services** section, you see the **web** and **API** services that are defined in the template.

> [!NOTE]
> Not all `azd` compatible catalogs use the linked templates structure shown in the example. You can use a single catalog for all your environments by including the azure.yaml file. Using multiple catalogs and code repositories allows you more flexibility in configuring secure access for platform engineers and developers. 

If you're working with your own catalog & environment definition, you can create an azure.yaml file in the root of your repository. Use the azure.yaml file to define the services that you want to deploy to the environment.

## Create an environment from an existing template

Use an existing `azd` compatible template to create a new environment.

### Prepare to work with `azd` 

When you work with `azd` for the first time, there are some one-time setup tasks you need to complete. These tasks include installing the Azure Developer CLI, signing in to your Azure account, and enabling `azd` support for Azure Deployment Environments.

#### Install the Azure Developer CLI extension

When you install `azd`, the `azd` tools are installed within an `azd` scope rather than globally, and are removed if `azd` is uninstalled. You can install `azd` in Visual Studio Code, from the command line, or in Visual Studio.

# [Visual Studio Code](#tab/visual-studio-code)

To enable Azure Developer CLI features in Visual Studio Code, install the Azure Developer CLI extension. Select the **Extensions** icon in the Activity bar, search for **Azure Developer CLI**, and then select **Install**.

:::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/install-azure-developer-cli-small.png" alt-text="Screenshot of Visual Studio Code, showing the Sign in command in the command palette." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/install-azure-developer-cli-large.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)


```bash
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```
---

#### Sign in with Azure Developer CLI

Access your Azure resources by logging in. When you initiate a log in, a browser window opens and prompts you to log in to Azure. After you sign in, the terminal displays a message that you're signed in to Azure.

Sign in to `azd` using the command palette:

# [Visual Studio Code](#tab/visual-studio-code)

:::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/azure-developer-sign-in.png" alt-text="Screenshot of Visual Studio Code, showing the Extensions pane with the Azure Developer CLI and Install highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/azure-developer-sign-in.png":::

The output of commands issued from the command palette is displayed in an **azd dev** terminal like the following example:

:::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/press-any-key.png" alt-text="Screenshot of the AZD developer terminal, showing the press any key to close message." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/press-any-key.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)

Sign in to Azure at the CLI using the following command: 

```bash
 azd auth login
```

:::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/login.png" alt-text="Screenshot showing the azd auth login command and its result in the terminal." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/login.png":::

---

#### Enable `azd` support for ADE

When `platform.type` is set to `devcenter`, all `azd` remote environment state and provisioning uses dev center components. `azd` uses one of the infrastructure templates defined in your dev center catalog for resource provisioning. In this configuration, the *infra* folder in your local templates isn't used. 

# [Visual Studio Code](#tab/visual-studio-code)

:::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/azure-developer-enable-support.png" alt-text="Screenshot of Visual Studio Code, showing the Enable support command in the command palette." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/azure-developer-enable-support.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)

```bash
 azd config set platform.type devcenter
```
---

### Create a new environment

Now you're ready to create an environment to work in. You begin with an existing template. ADE defines the infrastructure for your application, and the `azd` template provides sample application code.

# [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open an empty folder.

1. Open the command palette, enter *Azure Developer CLI init*, and then from the list, select **Azure Developer CLI (azd): init**.
 
    :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/command-palette-azure-developer-initialize.png" alt-text="Screenshot of the Visual Studio Code command palette with Azure Developer CLI (azd): init highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/command-palette-azure-developer-initialize.png":::
 
1. In the list of templates, select **Function-App-with-Cosmos_AZD-template**.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/command-palette-functionapp-template.png" alt-text="Screenshot of the Visual Studio Code command palette with a list of templates, Function App highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/command-palette-functionapp-template.png":::
  
1. In the `azd` terminal, enter an environment name.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt for a new environment name." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png":::

1. Select a project.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select a project." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png":::

1. Select an environment definition.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select an environment definition." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png":::
 
   `azd` creates the project resources, including an *azure.yaml* file in the root of your project.


# [Azure Developer CLI](#tab/azure-developer-cli)

1. At the CLI, navigate to an empty folder.

1. To list the templates available, in the `azd` terminal, run the following command:

   ```bash
   azd template list
   
   ```
   Multiple templates are available. You can select the template that best fits your needs, depending on the application you want to build and the language you want to use.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/developer-cli-template-list.png" alt-text="Screenshot of the Azure Developer terminal, showing the templates available." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/developer-cli-template-list.png":::

1. Run the following command to initialize your application and supply information when prompted:

   ```bash
   azd init
   ```
1. In the `azd` terminal, enter an environment name.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt for a new environment name." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png":::

1. Select a project.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select a project." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png":::

1. Select an environment definition.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select an environment definition." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png":::
 
   `azd` creates the project resources, including an *azure.yaml* file in the root of your project.

---

## Configure your devcenter 

You can define `azd` settings for your dev centers so that you don't need to specify them each time you update an environment. In this example, you define the names of the catalog, dev center, and project that you're using for your environment. 

1. In Visual Studio Code, navigate to the *azure.yaml* file in the root of your project.
 
1. In the azure.yaml file, add the following settings:

   ```yaml
   platform:
       type: devcenter
       config:
           catalog: MS-cat
           name: Contoso-DevCenter
           project: Contoso-Dev-project
   ```

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/azure-yaml-dev-center-settings.png" alt-text="Screenshot of the azure.yaml file with dev center settings highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/azure-yaml-dev-center-settings.png":::

To learn more about the settings you can configure, see [Configure dev center settings](/azure/developer/azure-developer-cli/ade-integration#configure-dev-center-settings).

## Provision your environment

You can use `azd` to provision and deploy resources to your deployment environments using commands like `azd up` or `azd provision`. 

To learn more about provisioning your environment, see [Work with Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration?branch=main#work-with-azure-deployment-evironments).


## Related content

- [Azure Developer CLI and Azure Deployment Environments](concept-azure-developer-cli-with-deployment-environments.md)
