---
title: Tutorial - Create an Azure ML workspace - Resource Manager template
description: In this tutorial, you use an Azure Resource Manager template to quickly deploy an Azure workspace for machine learning
services: machine-learning
author: lobrien
ms.author: laobri
ms.custom: subject-armqs
ms.date: 05/26/2020
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
---

# Tutorial: Deploy an Azure machine learning workspace using an ARM template

[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

This tutorial will show you how to create an Azure machine learning workspace using an Azure Resource Manager template (ARM template). Azure machine learning workspaces organize all your machine learning assets from baseline datasets to deployed models. Workspaces are a single location to collaborate with colleagues on creating, running, and reviewing experiments, manage your training and inferencing compute resources, and monitor and version deployed models.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-machine-learning-create%2Fazuredeploy.json)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/services/machine-learning/) before you begin.

* To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-machine-learning-create/).

:::code language="json" source="~/quickstart-templates/101-machine-learning-create/azuredeploy.json" range="1-258" highlight="224-254":::

The following resources are defined in the template:

* [Microsoft.MachineLearningServices/workspaces](/azure/templates/microsoft.machinelearningservices/workspaces): Create an Azure ML workspace. In this template, the location and name are parameters that the user can pass in or interactively enter.

## Deploy the template

To use the template from the Azure CLI, login and choose your subscription (See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli)). Then run:

```azurecli-interactive
read -p "Enter a project name that is used for generating resource names:" projectName &&
read -p "Enter the location (i.e. centralus):" location &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-machine-learning-create/azuredeploy.json" &&
resourceGroupName="${projectName}rg" &&
workspaceName="${projectName}ws" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri $templateUri --parameters workspaceName=$workspaceName location=$location &&
echo "Press [ENTER] to continue ..." &&
read
```

When you run the above command, enter:

1. A project name that will form the basis of the names of the created resource group and Azure ML workspace.
1. The Azure location in which you wish to make the deployment.

## Review deployed resources

To see your Azure ML workspace:

1. Go to https://portal.azure.com.
1. Sign in.
1. Choose the workspace you just created.

You'll see the Azure Machine Learning homepage:

:::image type="content" source="media/tutorial-resource-manager-workspace/workspace-home.png" alt-text="Screenshot of the Azure ML workspace":::

To see all the resources associated with the deployment, click the link in the upper left with the workspace name (in the screenshot, `my_templated_ws`). That link takes you to the resource group in the Azure portal. The resource group name is `{projectName}rg` and the workspace is named `{projectName}ws`.

## Clean up resources

If you don't want to use this workspace, delete it. Since the workspace is associated with other resources such as a storage account, you'll probably want to delete the entire resource group you created. You can delete the resource group using the portal by clicking on the **Delete** button and confirming. Or, you can delete the resource group from the CLI with:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this tutorial, you created an Azure Machine Learning workspace from an ARM template. If you'd like to explore Azure Machine Learning, continue with the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Get started creating your first ML experiment with the Python SDK](tutorial-1st-experiment-sdk-setup.md)
