---
title: "Tutorial: Your first ML experiment: Setup"
titleSuffix: Azure Machine Learning
description: In this tutorial series, you complete the end-to-end steps to get started with the Azure Machine Learning R SDK running in Jupyter notebooks.  Part one covers creating a cloud notebook server environment as well as creating a workspace to manage your experiments and machine learning models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: j-martens
ms.author: jmartens
ms.date: 09/20/2019
---

# Tutorial: Get started with Azure Machine Learning and its R SDK

In this tutorial, you complete the end-to-end steps to get started with the Azure Machine Learning Python SDK running in Jupyter notebooks. This tutorial is **part one of a two-part tutorial series**, and covers Python environment setup and configuration, as well as creating a workspace to manage your experiments and machine learning models. [**Part two**](tutorial-1st-experiment-sdk-train.md) builds on this to train multiple machine learning models and introduce the model management process using both the Azure Machine Learning studio and the SDK.

In this tutorial, you:

> [!div class="checklist"]
> * Create an [Azure Machine Learning Workspace](concept-workspace.md) to use in the next tutorial.
> * Create a cloud-based Jupyter compute instance with Azure Machine Learning Python SDK installed and pre-configured.

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Create a workspace

An Azure Machine Learning workspace is a foundational resource in the cloud that you use to experiment, train, and deploy machine learning models. It ties your Azure subscription and resource group to an easily consumed object in the SDK. If you already have an Azure Machine Learning workspace, skip to the [next section](#azure). Otherwise, create one now.

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## <a name="azure"></a>Create a compute instance

This example uses a cloud workstation in your workspace for an install-free and pre-configured experience. Use [your own environment](how-to-configure-environment.md#local) if you prefer to have control over your environment, packages, and dependencies.

From your workspace, you create a cloud resource to get started using R Studio. This resource is a cloud-based Linux virtual machine pre-configured with everything you need to run Azure Machine Learning in R.

1. Open your workspace in the [Azure Machine Learning studio](https://ml.azure.com/). 

1. On your workspace page in the Azure Machine Learning studio, select **Compute** on the left.

1. Select **+ Add Compute** to create a new Azure Machine Learning compute instance.

1. Provide a name for your compute instance. 
   + The name must be between 2 to 16 characters. Valid characters are letters, digits, and the - character.  
   + The name must also be unique across your Azure subscription.

1. Then select **Create**. It can take a moment to set up your machine.

1. Wait until the status changes to **Running**.
   After your VM is running, use the **Compute** section to launch the RStudio web interface.

1. Select **RStudio** in the **URI** column for your VM.

   The link starts your notebook server and opens the RStudio a new browser tab.  


## Next steps

In this tutorial, you completed these tasks:

* Created an Azure Machine Learning workspace.
* Created and configured a cloud notebook server in your workspace.

In part two of the tutorial, you run the code in `tutorial-1st-experiment-sdk-train.ipynb` to train a machine learning model. 

> [!div class="nextstepaction"]
> [Tutorial: Train your first model](tutorial-1st-experiment-r-train-model.md)

> [!IMPORTANT]
> If you do not plan on following part 2 of this tutorial or any other tutorials, you should [stop the cloud notebook server VM](tutorial-1st-experiment-sdk-train.md#clean-up-resources) when you are not using it to reduce cost.


