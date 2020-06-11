---
title: "Tutorial: Create your first ML experiment"
titleSuffix: Azure Machine Learning
description: In this tutorial, you'll to get started with the Azure Machine Learning Python SDK running in Jupyter notebooks.  In Part 1, you create a workspace in which you'll manage experiments and ML models. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: trevorbye
ms.author: trbye
ms.reviewer: trbye
ms.date: 02/10/2020
ms.custom: tracking-python
---

# Tutorial: Get started creating your first ML experiment with the Python SDK
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this tutorial, you complete the end-to-end steps to get started with the Azure Machine Learning Python SDK running in Jupyter notebooks. This tutorial is **part one of a two-part tutorial series**, and covers Python environment setup and configuration, as well as creating a workspace to manage your experiments and machine learning models. [**Part two**](tutorial-1st-experiment-sdk-train.md) builds on this to train multiple machine learning models and introduce the model management process using both Azure Machine Learning studio and the SDK.

In this tutorial, you:

> [!div class="checklist"]
> * Create an [Azure Machine Learning Workspace](concept-workspace.md) to use in the next tutorial.
> * Clone the tutorials notebook to your folder in the workspace.
> * Create a cloud-based compute instance with Azure Machine Learning Python SDK installed and pre-configured.


If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Create a workspace

An Azure Machine Learning workspace is a foundational resource in the cloud that you use to experiment, train, and deploy machine learning models. It ties your Azure subscription and resource group to an easily consumed object in the service. 

You create a workspace via the Azure portal, a web-based console for managing your Azure resources. 

[!INCLUDE [aml-create-portal](../../includes/aml-create-in-portal.md)]

>[!IMPORTANT] 
> Take note of your **workspace** and **subscription**. You'll need these to ensure you create your experiment in the right place. 

## <a name="azure"></a>Run notebook in your workspace

This tutorial uses the cloud notebook server in your workspace for an install-free and pre-configured experience. Use [your own environment](how-to-configure-environment.md#local) if you prefer to have control over your environment, packages and dependencies.

 Follow along with this video or use the detailed steps below to clone and run the tutorial from your workspace. 

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4mTUr]

### Clone a notebook folder

You complete the following experiment set-up and run steps in Azure Machine Learning studio, a consolidated interface that includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).

1. Select your subscription and the workspace you created.

1. Select **Notebooks** on the left.

1. Select the **Samples** tab at the top.

1. Open the **Python** folder.

1. Open the folder with a version number on it.  This number represents the current release for the Python SDK.

1. Select the **"..."** at the right of the **tutorials** folder and then select **Clone**.

    :::image type="content" source="media/tutorial-1st-experiment-sdk-setup/clone-tutorials.png" alt-text="Clone tutorials folder":::

1. A list of folders displays showing each user who accesses the workspace.  Select your folder to clone the **tutorials**  folder there.

### <a name="open"></a>Open the cloned notebook

1. Open the **tutorials** folder that was just closed into your **User files** section.

    > [!IMPORTANT]
    > You can view notebooks in the **samples** folder but you cannot run a notebook from there.  In order to run a notebook, make sure you open the cloned version of the notebook in the **User Files** section.
    
1. Select the **tutorial-1st-experiment-sdk-train.ipynb** file in your **tutorials/create-first-ml-experiment** folder.

    :::image type="content" source="media/tutorial-1st-experiment-sdk-setup/expand-user-folder.png" alt-text="Open tutorials folder":::


1. On the top bar, select a compute instance to use to run the notebook. These VMs are pre-configured with [everything you need to run Azure Machine Learning](concept-compute-instance.md#contents). 

1. If no VMs are found, select **+ Add** to create the compute instance VM. 

    1. When you create a VM, follow these rules:  
        + Name is required and can't be empty.
        + Name needs to be unique (in a case insensitive fashion) across all existing compute instances in the Azure region of the workspace/compute instance. You'll get an alert if the name you choose is not unique.
        + Valid characters are upper and lower case letters, numbers (0 to 9), and dash character (-).
        + Name must be between 3 and 24 characters long.
        + Name should start with a letter (not a number or a dash character).
        + If dash character is used, then it needs to be followed by at least one letter after the dash. Example: Test-, test-0, test-01 are invalid, while test-a0, test-0a are valid instances.

    1.  Select the Virtual Machine size from the available choices.

    1. Then select **Create**. It can take approximately 5 minutes to set up your VM.

1. Once the VM is available it will be displayed in the top toolbar.  You can now run the notebook either by using **Run all** in the toolbar, or by using **Shift+Enter** in the code cells of the notebook.

If you have custom widgets or prefer using Jupyter/JupyterLab select the **Jupyter** drop down on the far right, then select **Jupyter** or **JupyterLab**. The new browser window will be opened.

## Next steps

In this tutorial, you completed these tasks:

* Created an Azure Machine Learning workspace.
* Created and configured a cloud notebook server in your workspace.

In **part two** of the tutorial you run the code in `tutorial-1st-experiment-sdk-train.ipynb` to train a machine learning model. 

> [!div class="nextstepaction"]
> [Tutorial: Train your first model](tutorial-1st-experiment-sdk-train.md)

> [!IMPORTANT]
> If you do not plan on following part 2 of this tutorial or any other tutorials, you should [stop the cloud notebook server VM](tutorial-1st-experiment-sdk-train.md#clean-up-resources) when you are not using it to reduce cost.


