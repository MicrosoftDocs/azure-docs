---
title: "Tutorial: Get started in Jupyter Notebooks (Python)"
titleSuffix: Azure Machine Learning
description: Setup for Jupyter Notebook tutorials. Create  a workspace, clone  notebooks into the workspace, and create a compute instance where you run the notebooks.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: sdgilley
ms.author: sgilley
ms.date: 02/10/2020
ms.custom: devx-track-python
adobe-target: true
---

# Tutorial: Get started with Azure Machine Learning in Jupyter Notebooks

In this tutorial, you complete the steps to get started with Azure Machine Learning by using Jupyter Notebooks on a [managed cloud-based workstation (compute instance)](concept-compute-instance.md). This tutorial is a precursor to all other Jupyter Notebook tutorials.

In this tutorial, you:

> [!div class="checklist"]
> * Create an [Azure Machine Learning workspace](concept-workspace.md) to use in other Jupyter Notebook tutorials.
> * Clone the tutorials notebook to your folder in the workspace.
> * Create a cloud-based compute instance with the Azure Machine Learning Python SDK installed and preconfigured.

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Create a workspace

An Azure Machine Learning workspace is a foundational resource in the cloud that you use to experiment, train, and deploy machine learning models. It ties your Azure subscription and resource group to an easily consumed object in the service.

Skip to [Clone a notebook folder](#clone) if you already have an Azure Machine Learning workspace.  

There are many [ways to create a workspace](how-to-manage-workspace.md).  In this tutorial, you create a workspace via the Azure portal, a web-based console for managing your Azure resources.

[!INCLUDE [aml-create-portal](../../includes/aml-create-in-portal.md)]

>[!IMPORTANT]
> Take note of your *workspace* and *subscription*. You'll need this information to ensure you create your experiment in the right place.

## <a name="azure"></a>Run a notebook in your workspace

Azure Machine Learning includes a cloud notebook server in your workspace for an install-free and preconfigured experience. Use [your own environment](tutorial-1st-experiment-sdk-setup-local.md) if you prefer to have control over your environment, packages, and dependencies.

 Follow along with this video or use the detailed steps to clone and run the tutorial notebook from your workspace.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4mTUr]

### <a name="clone"></a> Clone a notebook folder

You complete the following experiment setup and run steps in Azure Machine Learning studio. This consolidated interface includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).

1. Select your subscription and the workspace you created.

1. On the left, select **Notebooks**.

1. At the top, select the **Samples** tab.

1. Open the **Python** folder.

1. Open the folder with a version number on it. This number represents the current release for the Python SDK.

1. Select the **...** button at the right of the **tutorials** folder, and then select **Clone**.

    :::image type="content" source="media/tutorial-1st-experiment-sdk-setup/clone-tutorials.png" alt-text="Screenshot that shows the Clone tutorials folder.":::

1. A list of folders shows each user who accesses the workspace. Select your folder to clone the **tutorials**  folder there.

### <a name="open"></a>Open the cloned notebook

1. Open the **tutorials** folder that was closed into your **User files** section.

    > [!IMPORTANT]
    > You can view notebooks in the **samples** folder but you can't run a notebook from there. To run a notebook, make sure you open the cloned version of the notebook in the **User Files** section.
    
1. Select the **img-classification-part1-training.ipynb** file in your **tutorials/image-classification-mnist-data** folder.

    :::image type="content" source="media/tutorial-1st-experiment-sdk-setup/expand-user-folder.png" alt-text="Screenshot that shows the Open tutorials folder.":::

1. On the top bar, select a compute instance to use to run the notebook. These virtual machines (VMs) are preconfigured with [everything you need to run Azure Machine Learning](concept-compute-instance.md#contents).

1. If no VMs are found, select **+ Add** to create the compute instance VM.

    1. When you create a VM, follow these rules:
 
        + A name is required, and the field can't be empty.
        + The name must be unique (in a case-insensitive fashion) across all existing compute instances in the Azure region of the workspace or compute instance. You'll get an alert if the name you choose isn't unique.
        + Valid characters are uppercase and lowercase letters, numbers 0 to 9, and the dash character (-).
        + The name must be between 3 and 24 characters long.
        + The name should start with a letter, not a number or a dash character.
        + If a dash character is used, it must be followed by at least one letter after the dash. For example, Test-, test-0, test-01 are invalid, while test-a0, test-0a are valid instances.

    1. Select the VM size from the available choices. For the tutorials, the default VM is a good choice.

    1. Then select **Create**. It can take approximately five minutes to set up your VM.

1. When the VM is available, it appears in the top toolbar. You can now run the notebook by using either **Run all** in the toolbar or **Shift+Enter** in the code cells of the notebook.

If you have custom widgets or prefer to use Jupyter or JupyterLab, select the **Jupyter** drop-down list on the far right. Then select **Jupyter** or **JupyterLab**. The new browser window opens.

## Next steps

Now that you have a development environment set up, continue on to train a model in a Jupyter Notebook.

> [!div class="nextstepaction"]
> [Tutorial: Train image classification models with MNIST data and scikit-learn](tutorial-train-models-with-aml.md)

<a name="stop-compute-instance"></a>
If you don't plan on following any other tutorials now, stop the cloud notebook server VM when you aren't using it to reduce cost.

[!INCLUDE [aml-stop-server](../../includes/aml-stop-server.md)]
