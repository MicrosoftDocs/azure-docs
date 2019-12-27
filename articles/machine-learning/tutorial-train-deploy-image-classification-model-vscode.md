---
title: "Tutorial: Train and deploy an image classification TensorFlow model using the Azure Machine Learning Visual Studio Code Extension"
titleSuffix: Azure Machine Learning
description: Learn how to train and deploy an image classification model using TensorFlow and the Azure Machine Learning Visual Studio Code Extension
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: luisquintanilla
ms.author: luquinta
ms.date: 12/27/2019
#Customer intent: As a professional data scientist, I want to develop, deploy, and managge Azure Machine Learning projects locally in Visual Studio Code
---

# Train and deploy an image classification TensorFlow model using the Azure Machine Learning Visual Studio Code Extension

Learn how to train an image classification model to recognize hand-written numbers using TensorFlow and the Azure Machine Learning Visual Studio Code Extension.

In this tutorial, you learn the following tasks:

> [!div class="checklist"]
> * Create a workspace
> * Create an experiment
> * Configure Computer Targets
> * Run a configuration file
> * Train a model
> * Register a model
> * Deploy a model

## Prerequisites

- Azure subscription. If you don't have one, sign up to try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
- Install [Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview), a lightweight, cross-platform code editor.
- Azure Machine Learning Studio Visual Studio Code extension. For install instructions see the [Setup Azure Machine Learning Visual Studio Code extension tutorial](./tutorial-setup-vscode-extension.md)

## Create a workspace

The first thing you have to do to build an application in Azure Machine Learning is to create a workspace. A workspace is a space that contains the resources to train models as well as the trained models themselves. See the documentation to learn more about [what is a workspace](./concept-workspace.md). 

1. On the Visual Studio Code activity bar, select the **Azure** icon to open the Azure Machine Learning view.

    [![Create a workspace](./media/tutorial-train-deploy-image-classification-model-vscode/create-workspace.gif)](./media/tutorial-train-deploy-image-classification-model-vscode/create-workspace.gif#lightbox)

1. Right-click your Azure subscription and select **Create Workspace**. By default a name is generated containing the date and time of creation. Change the name to "TeamWorkspace" and press **Enter**.
1. Create a new resource group. It's recommended to choose a location that is closest to the location you plan to deploy your model. In this case, choose **West US 2** and press **Enter**.

Pressing enter will send a request to Azure to create a new workspace in your account. After a few minutes, if successful, your new workspace will appear in your subscription node. 

## Create an experiment

One or more experiments can be created in your workspace to track and analyze individual model training runs. Runs can be done in the Azure cloud or on your local machine.

1. Expand the **TeamWorkspace** workspace. 
1. Right-click the **Experiments** node, and select **Create Experiment** from the context menu.
1. In the prompt, name your experiment "MNIST".
1. Select *Enter* to create the new experiment. 

Like workspaces, a request is sent to Azure to create an experiment with the provided configurations. If successful, the new experiment will appear in the *Experiments* node of your workspace. 

Set the experiment to active by right-clicking the experiment. Setting an experiment to active links the experiment to the directory currently open in Visual Studio code. This is the directory should contain the Python scripts you want to run in Azure. Additionally, setting an experiment as active stores key metrics for all training runs within the experiment.

[![Create an Experiment](./media/tutorial-train-deploy-image-classification-model-vscode/create-experiment.gif)](./media/tutorial-train-deploy-image-classification-model-vscode/create-experiment.gif#lightbox)

## Configure Compute Targets

A compute target is the computing resource or environment where you run scripts and deploy trained models to. To learn more about compute targets, see the [Azure Machine Learning compute targets documentation](./concept-compute-target.md).

To create a compute target:

1. On the Visual Studio Code activity bar, select the **Azure** icon. The Azure Machine Learning sidebar appears.
1. Expand the **TeamWorkspace** workspace node. 
1. Under the workspace node, right-click the **Compute** node and choose **Create Compute**.
1. Choose the desired compute target type from the list.
1. In the command palette prompt, select a virtual machine size. You can filter the computes with text, such as "gpu".
1. In the command palette prompt, enter a name for the compute target.
1. After entering the name, the compute will be created using default parameters. 
1. In the json that is displayed, make desired changes then click the "Save and continue" CodeLens (using the keyboard you can press **Ctrl+Shift+P** (**Cmd+Shift+P**) to invoke the command palette and run the **Azure ML: Save and Continue** command).

[![Create AML compute in Visual Studio Code](./media/tutorial-train-deploy-image-classification-model-vscode/create-remote-compute.gif)](./media/tutorial-train-deploy-image-classification-model-vscode/create-remote-compute.gif#lightbox)

## Understand the run configuration file

To run an Azure Machine Learning experiment on a compute, that compute needs to be configured appropriately. A run configuration file is the mechanism by which this environment is specified.

[![Create a run configuration for a compute](./media/tutorial-train-deploy-image-classification-model-vscode/create-runconfig.gif)](./media/tutorial-train-deploy-image-classification-model-vscode/create-runconfig.gif#lightbox)

To run Azure ML experiments on your local machine a run configuration file is still required. When creating a local run configuration the Python environment used will default to the path to the interpreter you have set within VS Code.

## Train the model

Using the Azure ML extension for VS Code There are multiple ways of running a training script in an experiment.

1. Right click on the training script and choose **Azure ML: Run as Experiment in Azure**
1. Click the **Run Experiment** toolbar icon.
1. Right click on a run configuration node.
1. Use the VS Code command palette to execute **Azure ML: Run Experiment**

To run an Azure Machine Learning experiment:

1. On the Visual Studio Code activity bar, select the **Azure** icon. The Azure Machine Learning sidebar appears. 
1. Expand the **TeamWorkspace** workspace node. 
1. Under the workspace node, expand the **Experiments** node and right-click the experiment you want to run.
1. Select **Run Experiment**.
1. Choose the name of the Python file you want to run to train your model and press enter to submit the run. Note: The file chosen must reside in the folder you currently have open in VS Code.
1. After the run is submitted, a **Run node** will appear below the experiment you chose. Use this node to monitor the state of your runs. Note: It may be necessary to periodically refresh the window to see the latest status.

Here's an example of how to run an experiment on the compute previously created:

[![Run an experiment locally](./media/tutorial-train-deploy-image-classification-model-vscode/run-experiment.gif)](./media/tutorial-train-deploy-image-classification-model-vscode/run-experiment.gif#lightbox)

## Register the model

Now that you've trained your model, you can register it in your workspace. You can track and deploy registered models.

To register your model:

1. On the Visual Studio Code activity bar, select the **Azure** icon. The Azure Machine Learning sidebar appears.
1. Expand the **TeamWorkspace** workspace node. 
1. Under the workspace node, right-click **Models** and choose **Register Model**.
1. On the command palette, in the field, enter a model name.
1. From the list, choose whether to upload a **model file** (for single models) or a  **model folder** (for models with multiple files, such as TensorFlow). Since this is a TensorFlow model, select **model folder**.
1. Select the **output** folder.
1. When you finish configuring your model properties, in the lower-right corner of the window, select **Submit**.

Here's an example of how to register your model to Azure Machine Learning:

[![Registering a Model to AML](./media/tutorial-train-deploy-image-classification-model-vscode/register-model.gif)](./media/tutorial-train-deploy-image-classification-model-vscode/register-model.gif#lightbox)

## Deploy the model

In Visual Studio Code, you can deploy your web service to:

+ Azure Container Instances (ACI) for testing.
+ Azure Kubernetes Service (AKS) for production.

You don't need to create an ACI container to test in advance, because ACI containers are created as needed. However, you do need to configure AKS clusters in advance. For more information, see [deploy models with Azure Machine Learning](how-to-deploy-and-where.md) to learn about deployment options.

To deploy a web service:

1. On the Visual Studio Code activity bar, select the **Azure** icon. The Azure Machine Learning sidebar appears.
1. Expand the **TeamWorkspace** workspace node. 
1. Under the workspace node, expand the **Models** node.
1. Right-click the model you want to deploy, and choose **Deploy Service from Registered Model** from the context menu.
1. On the command palette, choose the compute target you want to deploy to.
1. On the command palette, in the field, enter a name for this service.
1. On the command palette, select the Enter key on your keyboard to browse for and select the script file.
1. On the command palette, select the Enter key on your keyboard to browse for and select the conda dependency file.
1. When you finish configuring your service properties, in the lower-right corner of the window, select **Submit** to deploy. In the service properties file, you can specify a local docker file or a schema.json file.

The web service is now deployed.

Here's an example of how to deploy a web service:

[![Deploy a web service](./media/tutorial-train-deploy-image-classification-model-vscode/create-image.gif)](./media/tutorial-train-deploy-image-classification-model-vscode/create-image.gif#lightbox)

## Next steps

* For a walkthrough of how to train with Azure Machine Learning outside of Visual Studio Code, see [Tutorial: Train models with Azure Machine Learning](tutorial-train-models-with-aml.md).
* For a walkthrough of how to edit, run, and debug code locally, see the [Python hello-world tutorial](https://code.visualstudio.com/docs/Python/Python-tutorial).

