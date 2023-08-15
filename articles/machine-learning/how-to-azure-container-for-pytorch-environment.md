---
title: How to create Azure Container for PyTorch Custom Curated environment
titleSuffix: Azure Machine Learning
description: Create custom curated Azure Container for PyTorch environments in Azure Machine Learning studio to run your machine learning models and reuse it in different scenarios.
services: machine-learning
author: sheetalarkadam
ms.author: parinitarahi
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.custom: build-2023, build-2023-dataai
ms.topic: how-to
ms.date: 03/20/2023
---

# Create custom curated Azure Container for PyTorch (ACPT) environments in Azure Machine Learning studio

If you're looking to extend curated environment and add Hugging Face (HF) transformers or datasets or any other external packages to be installed, Azure Machine Learning offers to create a new env with docker context containing ACPT curated environment as base image and additional packages on top of it as below.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- An Azure Machine Learning workspace. If you don't have one, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create one.

## Navigate to environments

In the [Azure Machine Learning studio](https://ml.azure.com/registries/environments), navigate to the "Environments" section by selecting the "Environments" option.

:::image type="content" source="./media/how-to-azure-container-for-pytorch-environment/navigate-to-environments.png" alt-text="Screenshot of navigating to environments from Azure Machine Learning studio." lightbox= "./media/how-to-azure-container-for-pytorch-environment/navigate-to-environments.png":::

## Navigate to curated environments

Navigate to curated environments and search "acpt" to list all the available ACPT curated environments. Selecting the environment shows details of the environment.

:::image type="content" source="./media/how-to-azure-container-for-pytorch-environment/navigate-to-curated-environments.png" alt-text="Screenshot of navigating to curated environments." lightbox= "./media/how-to-azure-container-for-pytorch-environment/navigate-to-curated-environments.png":::


## Get details of the curated environments

To create custom environment, you need the base docker image repository, which can be found in the "Description" section as "Azure Container Registry". Copy the "Azure Container Registry" name, which is used later when you create a new custom environment.

:::image type="content" source="./media/how-to-azure-container-for-pytorch-environment/get-details-curated-environments.png" alt-text="Screenshot of getting container registry name." lightbox= "./media/how-to-azure-container-for-pytorch-environment/get-details-curated-environments.png":::

## Navigate to custom environments

Go back and select the " Custom Environments" tab.

:::image type="content" source="./media/how-to-azure-container-for-pytorch-environment/navigate-to-custom-environment.png" alt-text="Screenshot of navigating to custom environments." lightbox= "./media/how-to-azure-container-for-pytorch-environment/navigate-to-custom-environment.png":::

## Create custom environments

Select **+ Create**. In the "Create Environment" window, name the environment, description and select "Create a new docker context" in Select environments type section.

:::image type="content" source="./media/how-to-azure-container-for-pytorch-environment/create-environment-window.png" alt-text="Screenshot of creating custom environment." lightbox= "./media/how-to-azure-container-for-pytorch-environment/create-environment-window.png":::

Paste the docker image name that you copied in previously. Configure your environment by declaring the base image and add any env variables you want to use and the packages that you want to include.

:::image type="content" source="./media/how-to-azure-container-for-pytorch-environment/configure-environment.png" alt-text="Screenshot of configuring the environment with name, packages with docker context." lightbox= "./media/how-to-azure-container-for-pytorch-environment/configure-environment.png":::

Review your environment settings, add any tags if needed and select on the **Create** button to create your custom environment.

That's it! You've now created a custom environment in Azure Machine Learning studio and can use it to run your machine learning models.

## Next steps

- Learn more about environment objects:
    - [What are Azure Machine Learning environments? ](concept-environments.md).
    -  Learn more about [curated environments](concept-environments.md).
- Learn more about [training models in Azure Machine Learning](concept-train-machine-learning-model.md).
- [Azure Container for PyTorch (ACPT) reference](resource-azure-container-for-pytorch.md)
