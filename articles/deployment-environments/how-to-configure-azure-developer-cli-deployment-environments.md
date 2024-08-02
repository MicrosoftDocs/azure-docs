---
title: Configure Azure Developer CLI templates for use with ADE
description: Understand how ADE and AZD work together to provision application infrastructure and deploy application code to the new infrastructure.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 03/26/2024

# Customer intent: As a platform engineer, I want to use ADE and AZD together to provision application infrastructure and deploy application code to the new infrastructure.

---

# Configure Azure Developer CLI with Azure Deployment Environments

In this article, you create a new environment from an existing Azure Developer CLI (AZD) compatible template by using AZD. You learn how to configure Azure Deployment Environments (ADE) and AZD to work together to provision application infrastructure and deploy application code to the new infrastructure.

To learn the key concepts of how AZD and ADE work together, see [Use Azure Developer CLI with Azure Deployment Environments](concept-azure-developer-cli-with-deployment-environments.md).

## Prerequisites

- Create and configure a dev center with a project, environment types, and catalog. Use the following article as guidance:
   - [Quickstart: Configure Azure Deployment Environments](/azure/deployment-environments/quickstart-create-and-configure-devcenter).

## Attach Microsoft quick start catalog

Microsoft provides a quick start catalog that contains a set of AZD compatible templates that you can use to create environments. You can attach the quick start catalog to your dev center at creation or add it later. The quick start catalog contains a set of templates that you can use to create environments.

## Examine an AZD compatible template

You can use an existing AZD compatible template to create a new environment, or you can add an azure.yaml file to your repository. In this section, you examine an existing AZD compatible template.

AZD provisioning for environments relies on curated templates from the catalog. Templates in the catalog might assign tags to provisioned Azure resources for you to associate your app services with in the azure.yaml file, or specify the resources explicitly. In this example, resources are specified explicitly.

For more information on tagging resources, see [Tagging resources for Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration#tagging-resources-for-azure-deployment-environments).

1. In the [Azure portal](https://portal.azure.com), navigate to your dev center.

1. In the left menu under **Environment configuration**, select **Catalogs**, and then copy the quick start catalog **Clone URL**.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/catalog-url.png" alt-text="Screenshot of Azure portal showing the catalogs attached to a dev center, with clone URL highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/catalog-url.png":::

1. To view the quick start catalog in GitHub, paste the **Clone URL** into the address bar and press Enter.

1. In the GitHub repository, navigate to the **Environment-Definitions/ARMTemplates/Function-App-with-Cosmos_AZD-template** folder.

1. Open the **environment.yaml** file. At the end of the file, you see the allowed repositories that contain sample application source code.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/application-source-templates.png" alt-text="Screenshot of GitHub repository, showing the environment.yaml file with source templates highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/application-source-templates.png":::

1. Copy the **https://github.com/azure-samples/todo-python-mongo-swa-func** repository URL, and then navigate to the repository in GitHub.

1. In the root of the repository, open the **azure.yaml** file.

1. In the azure.yaml file, in the **services** section, you see the **web** and **API** services that are defined in the template.

> [!NOTE]
> Not all AZD compatible catalogs use the linked templates structure shown in the example. You can use a single catalog for all your environments by including the azure.yaml file. Using multiple catalogs and code repositories allows you more flexibility in configuring secure access for platform engineers and developers. 

If you're working with your own catalog & environment definition, you can create an azure.yaml file in the root of your repository. Use the azure.yaml file to define the services that you want to deploy to the environment.

## Create an environment from an existing template

Use an existing AZD compatible template to create a new environment.

### Prepare to work with AZD 

When you work with AZD for the first time, there are some one-time setup tasks you need to complete. These tasks include installing the Azure Developer CLI, signing in to your Azure account, and enabling AZD support for Azure Deployment Environments.

#### Install the Azure Developer CLI extension for Visual Studio Code

When you install AZD, the AZD tools are installed within an AZD scope rather than globally, and are removed if AZD is uninstalled. You can install AZD in Visual Studio Code or from the command line.

# [Visual Studio Code](#tab/visual-studio-code)

To enable Azure Developer CLI features in Visual Studio Code, install the Azure Developer CLI extension, version v0.8.0-alpha.1-beta.3173884. Select the **Extensions** icon in the Activity bar, search for **Azure Developer CLI**, and then select **Install**.

:::image type="content" source="media/how-to-create-environment-with-azure-developer/install-azure-developer-cli-small.png" alt-text="Screenshot of Visual Studio Code, showing the Sign in command in the command palette." lightbox="media/how-to-create-environment-with-azure-developer/install-azure-developer-cli-large.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)


```bash
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```
---

#### Sign in with Azure Developer CLI

Access your Azure resources by logging in. When you initiate a log in, a browser window opens and prompts you to log in to Azure. After you sign in, the terminal displays a message that you're signed in to Azure.

Sign in to AZD using the command palette:

# [Visual Studio Code](#tab/visual-studio-code)

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-sign-in.png" alt-text="Screenshot of Visual Studio Code, showing the Extensions pane with the Azure Developer CLI and Install highlighted." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-sign-in.png":::

The output of commands issued from the command palette is displayed in an **azd dev** terminal like the following example:

:::image type="content" source="media/how-to-create-environment-with-azure-developer/press-any-key.png" alt-text="Screenshot of the AZD developer terminal, showing the press any key to close message." lightbox="media/how-to-create-environment-with-azure-developer/press-any-key.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)

Sign in to Azure at the CLI using the following command: 

```bash
 azd auth login
```

:::image type="content" source="media/how-to-create-environment-with-azure-developer/login.png" alt-text="Screenshot showing the azd auth login command and its result in the terminal." lightbox="media/how-to-create-environment-with-azure-developer/login.png":::

---

#### Enable AZD support for ADE

When `platform.type` is set to `devcenter`, all AZD remote environment state and provisioning uses dev center components. AZD uses one of the infrastructure templates defined in your dev center catalog for resource provisioning. In this configuration, the *infra* folder in your local templates isn’t used. 

# [Visual Studio Code](#tab/visual-studio-code)

:::image type="content" source="media/how-to-create-environment-with-azure-developer/azure-developer-enable-support.png" alt-text="Screenshot of Visual Studio Code, showing the Enable support command in the command palette." lightbox="media/how-to-create-environment-with-azure-developer/azure-developer-enable-support.png":::

# [Azure Developer CLI](#tab/azure-developer-cli)

```bash
 azd config set platform.type devcenter
```
---

### Create a new environment

Now you're ready to create an environment to work in. You begin with an existing template. ADE defines the infrastructure for your application, and the AZD template provides sample application code.

# [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, open an empty folder.

1. Open the command palette, enter *Azure Developer CLI init*, and then from the list, select **Azure Developer CLI (azd): init**.
 
    :::image type="content" source="media/how-to-create-environment-with-azure-developer/command-palette-azure-developer-initialize.png" alt-text="Screenshot of the Visual Studio Code command palette with Azure Developer CLI (azd): init highlighted." lightbox="media/how-to-create-environment-with-azure-developer/command-palette-azure-developer-initialize.png":::
 
1. In the list of templates, select **Function-App-with-Cosmos_AZD-template**.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/command-palette-functionapp-template.png" alt-text="Screenshot of the Visual Studio Code command palette with a list of templates, Function App highlighted." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/command-palette-functionapp-template.png":::
  
1. In the AZD terminal, enter an environment name.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt for a new environment name." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png":::

1. Select a project.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select a project." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png":::

1. Select an environment definition.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select an environment definition." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png":::
 
   AZD creates the project resources, including an *azure.yaml* file in the root of your project.


# [Azure Developer CLI](#tab/azure-developer-cli)

1. At the CLI, navigate to an empty folder.

1. To list the templates available, in the AZD terminal, run the following command:

   ```bash
   azd template list
   
   ```
   Multiple templates are available. You can select the template that best fits your needs, depending on the application you want to build and the language you want to use.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/developer-cli-template-list.png" alt-text="Screenshot of the Azure Developer terminal, showing the templates available." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/developer-cli-template-list.png":::

1. Run the following command to initialize your application and supply information when prompted:

   ```bash
   azd init
   ```
1. In the AZD terminal, enter an environment name.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt for a new environment name." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/enter-environment-name.png":::

1. Select a project.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select a project." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-project.png":::

1. Select an environment definition.

   :::image type="content" source="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png" alt-text="Screenshot of the Azure Developer terminal, showing prompt to select an environment definition." lightbox="media/how-to-configure-azure-developer-cli-deployment-environments/initialize-select-environment-definition.png":::
 
   AZD creates the project resources, including an *azure.yaml* file in the root of your project.

---

## Configure your devcenter 

You can define AZD settings for your dev centers so that you don't need to specify them each time you update an environment. In this example, you define the names of the catalog, dev center, and project that you're using for your environment. 

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

You can use AZD to provision and deploy resources to your deployment environments using commands like `azd up` or `azd provision`. 

To learn more about provisioning your environment, see [Create an environment by using the Azure Developer CLI](how-to-create-environment-with-azure-developer.md#provision-infrastructure-to-azure-deployment-environment).

To how common AZD commands work with ADE, see [Work with Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration?branch=main#work-with-azure-deployment-evironments).


## Related content

- [Add and configure an environment definition](./configure-environment-definition.md)
- [Create an environment by using the Azure Developer CLI](./how-to-create-environment-with-azure-developer.md)
