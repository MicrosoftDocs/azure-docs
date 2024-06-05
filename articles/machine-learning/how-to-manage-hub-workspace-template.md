---
title: Create a hub workspace with Azure Resource Manager template
titleSuffix: Azure Machine Learning
description: Learn how to use a Bicep templates to create a new Azure Machine Learning hub workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: deeikele
author: deeikele
ms.reviewer: larryfr
ms.date: 02/29/2024
#Customer intent: As a DevOps person, I need to automate or customize the creation of Azure Machine Learning by using templates.
---

# Create an Azure Machine Learning hub workspace using a Bicep template

Use a [Microsoft Bicep](/azure/azure-resource-manager/bicep/overview) template to create a [hub workspace](concept-hub-workspace.md) for use in ML Studio and [AI Studio](../ai-studio/what-is-ai-studio.md). A template makes it easy to create resources as a single, coordinated operation. A Bicep template is a text document that defines the resources that are needed for a deployment. It might also specify deployment parameters. Parameters are used to provide input values when using the template.

The template used in this article can be found at [https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/aistudio-basics](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/aistudio-basics). Both the source `main.bicep` file and the compiled Azure Resource Manager template (`main.json`) file are available. This template creates the following resources:

- An Azure Resource Group (if one doesn't already exist)
- An Azure Machine Learning workspace of kind 'hub'
- Azure Storage Account
- Azure Key Vault
- Azure Container Registry
- Azure Application Insights
- Azure AI services (required for AI studio, and may be dropped for Azure Machine Learning use cases)

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
| [ai-resource.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/aistudio-basics/modules/ai-hub.bicep)  | Defines the Azure AI hub resource. |
| [dependent-resources.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/aistudio-basics/modules/dependent-resources.bicep) | Defines the dependent resources for the Azure AI hub. Azure Storage Account, Container Registry, Key Vault, and Application Insights. |

> [!IMPORTANT]
> The example templates may not always use the latest API version for the Azure resources it creates. Before using the template, we recommend modifying it to use the latest API versions. Each Azure service has its own set of API versions. For information on the API for a specific service, check the service information in the [Azure REST API reference](/rest/api/azure/).
>
> The AI hub resource is based on Azure Machine Learning. For information on the latest API versions for Azure Machine Learning, see the [Azure Machine Learning REST API reference](/rest/api/azureml/). To update this API version, find the `Microsoft.MachineLearningServices/<resource>` entry for the resource type and update it to the latest version. The following example is an entry for the Azure AI hub that uses an API version of `2023-08-01-preview`:
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
