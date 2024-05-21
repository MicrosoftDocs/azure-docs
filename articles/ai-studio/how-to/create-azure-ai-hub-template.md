---
title: Create an Azure AI Studio hub using a Bicep template
titleSuffix: Azure AI Studio
description: Use a Microsoft Bicep template to create a new Azure AI Studio hub.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom: devx-track-arm-template, devx-track-bicep, build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: larryfr
author: Blackmist
#Customer intent: As a DevOps person, I need to automate or customize the creation of a hub by using templates.
---

# Use an Azure Resource Manager template to create an Azure AI Studio hub

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Use a [Microsoft Bicep](/azure/azure-resource-manager/bicep/overview) template to create a hub for Azure AI Studio. A template makes it easy to create resources as a single, coordinated operation. A Bicep template is a text document that defines the resources that are needed for a deployment. It might also specify deployment parameters. Parameters are used to provide input values when using the template.

The template used in this article can be found at [https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/aistudio-basics](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/aistudio-basics). Both the source `main.bicep` file and the compiled Azure Resource Manager template (`main.json`) file are available. This template creates the following resources:

- An Azure resource group (if one doesn't already exist)
- An Azure AI Studio hub
- Azure Storage Account
- Azure Key Vault
- Azure Container Registry
- Azure Application Insights
- Azure AI services (created by the template)

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/).

- A copy of the template files from the GitHub repo. To clone the GitHub repo to your local machine, you can use [Git](https://git-scm.com/). Use the following command to clone the quickstart repository to your local machine and navigate to the `aistudio-basics` directory.

    # [Azure CLI](#tab/cli)

    ```azurecli
    git clone https://github.com/Azure/azure-quickstart-templates
    cd azure-quickstart-templates/quickstarts/microsoft.machinelearningservices/aistudio-basics
    ```

    # [Azure PowerShell](#tab/powershell)

    ```azurepowershell
    git clone https://github.com/Azure/azure-quickstart-templates
    cd azure-quickstart-templates\quickstarts\microsoft.machinelearningservices\aistudio-basics
    ```

    ---

- The Bicep command-line tools. To install the Bicep command-line tools, use the [Install the Bicep CLI](/azure/azure-resource-manager/bicep/install) article.

## Understanding the template

The Bicep template is made up of the following files:

| File | Description |
| ---- | ----------- |
| [main.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/aistudio-basics/main.bicep) | The main Bicep file that defines the parameters and variables. Passing parameters & variables to other modules in the `modules` subdirectory. |
| [ai-hub.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/aistudio-basics/modules/ai-hub.bicep)  | Defines the hub. |
| [dependent-resources.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/aistudio-basics/modules/dependent-resources.bicep) | Defines the dependent resources for the hub such as Azure Storage Account, Container Registry, Key Vault, and Application Insights. |

> [!IMPORTANT]
> The example templates may not always use the latest API version for the Azure resources it creates. Before using the template, we recommend modifying it to use the latest API versions. Each Azure service has its own set of API versions. For information on the API for a specific service, check the service information in the [Azure REST API reference](/rest/api/azure/).
>
> The hub is based on Azure Machine Learning. For information on the latest API versions for Azure Machine Learning, see the [Azure Machine Learning REST API reference](/rest/api/azureml/). To update this API version, find the `Microsoft.MachineLearningServices/<resource>` entry for the resource type and update it to the latest version. The following example is an entry for a hub that uses an API version of `2023-08-01-preview`:
>
>```bicep
>resource aiResource 'Microsoft.MachineLearningServices/workspaces@2023-08-01-preview' = {
>```

### Azure Resource Manager template

While the Bicep domain-specific language (DSL) is used to define the resources, the Bicep file is compiled into an Azure Resource Manager template when you deploy the template. The `main.json` file included in the GitHub repository is a compiled Azure Resource Manager version of the template. This file is generated from the `main.bicep` file using the Bicep command-line tools. For example, when you deploy the Bicep template it generates the `main.json` file. You can also manually create the `main.json` file using the `bicep build` command without deploying the template.

```azurecli
bicep build main.bicep
```

For more information, see the [Bicep CLI](/azure/azure-resource-manager/bicep/bicep-cli) article.


## Configure the template

To run the Bicep template, use the following commands from the `aistudio-basics` directory:

1. To create a new Azure Resource Group, use the following command. Replace `exampleRG` with the name of your resource group, and `eastus` with the Azure region to use:

    # [Azure CLI](#tab/cli)

    ```azurecli
    az group create --name exampleRG --location eastus
    ```
    # [Azure PowerShell](#tab/powershell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    ```

    ---

1. To run the template, use the following command. Replace `myai` with the name to use for your resources. This value is used, along with generated prefixes and suffixes, to create a unique name for the resources created by the template.

    > [!TIP]
    > The `aiResourceName` must be 5 or less characters. It can't be entirely numeric or contain the following characters: `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`.

    # [Azure CLI](#tab/cli)

    ```azurecli
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters aiResourceName=myai 
    ```

    # [Azure PowerShell](#tab/powershell)

    ```azurepowershell
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile main.bicep -aiResourceName myai
    ```

    ---

    Once the operation completes, you can use your hub to create projects, manage resources, and collaborate with others.

## Next steps

- [Create an Azure AI Studio project](create-projects.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about hubs](../concepts/ai-resources.md)
