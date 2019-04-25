---
title: Use Visual Studio Code with
titleSuffix: Azure Machine Learning service
description: Learn how to install Azure Machine Learning for Visual Studio Code and create a simple experiment in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: shwinne
author: swinner95
ms.date: 12/04/2018
ms.custom: seodec18
---
# Get started with Azure Machine Learning for Visual Studio Code

In this article, you will learn how to use the **Azure Machine Learning for Visual Studio Code** extension to train and deploy machine learning and deep learning models with Azure Machine Learning service in Visual Studio Code (VS Code).

Azure Machine Learning service provides support for running experiments locally and on remote compute targets. For every experiment, you can keep track of multiple runs as often you need to iteratively try different techniques, hyperparameters, and more. You can use Azure Machine Learning to track custom metrics and experiment runs, enabling data science reproducibility and auditability.

And you can deploy these models for your testing and production needs.

## Prerequisites

+ If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

+ Visual Studio Code must be installed. VS Code is a lightweight but powerful source code editor that runs on your desktop. It comes with built-in support for Python and more.  [Learn how to install VS Code](https://code.visualstudio.com/docs/setup/setup-overview).

+ [Install Python 3.5 or greater](https://www.anaconda.com/download/).


## Install the Azure Machine Learning for VS Code extension

When you install the **Azure Machine Learning** extension, two more extensions are automatically installed (if you have internet access). They are the [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) extension and the [Microsoft Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension

To work with Azure Machine Learning, we need to turn VS Code into a Python IDE. Working with [Python in Visual Studio Code](https://code.visualstudio.com/docs/languages/python), requires the Microsoft Python extension, which gets installed with the Azure Machine Learning extension automatically. The extension makes VS Code an excellent IDE, and works on any operating system with a variety of Python interpreters. It leverages all of VS Code's power to provide auto complete and IntelliSense, linting, debugging, and unit testing, along with the ability to easily switch between Python environments, including virtual and conda environments. Check out this walk-through of editing, running, and debugging Python code, see the [Python Hello World Tutorial](https://code.visualstudio.com/docs/python/python-tutorial)

**To install the Azure Machine Learning extension:**

1. Launch VS Code.

1. In a browser, visit: [Azure Machine Learning for Visual Studio Code (Preview)](https://aka.ms/vscodetoolsforai) extension

1. In that web page, click **Install**. 

1. In the extension tab, click **Install**.

1. A welcome tab opens in VS Code for the extension and the Azure symbol (outlined in the red box in the picture below) is added to activity bar.

   ![Azure icon in the Visual Studio Code activity bar](./media/vscode-tools-for-ai/azure-activity-bar.png)

1. In the dialog box, click **Sign In** and follow the onscreen prompt to authenticate with Azure. 
   
   The Azure Account extension, which was installed along with the Azure Machine Learning for VS Code extension, helps you authenticate with your Azure account. See the list of commands in the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) page.

> [!Tip] 
> Check out the [IntelliCode extension for VS Code (preview)](https://go.microsoft.com/fwlink/?linkid=2006060). IntelliCode provides a set of AI-assisted capabilities for IntelliSense in Python, such as inferring the most relevant auto-completions based on the current code context.

## Azure ML SDK Installation

1. Make sure that Python 3.5 or greater is installed and recognized by VS Code. If you install it now, then  restart VS Code and select a Python interpreter using instructions at https://code.visualstudio.com/docs/python/python-tutorial.

1. In the integrated terminal window, specify the Python interpreter to use or you can hit **Enter** to use your default Python           interpreter.

   ![Choose the interpreter](./media/vscode-tools-for-ai/python.png)

1. In the bottom-right corner of the window, a notification will appear indicating that the Azure ML SDK is being automatically installed.    A local private Python environment is created that has the Visual Studio Code prerequisites for working with the Azure Machine Learning service.

   ![install Azure Machine Learning SDK for Python](./media/vscode-tools-for-ai/runtimedependencies.png)

## Get started with Azure Machine Learning

Before you start training and deploying machine learning models using VS Code, you need to create an [Azure Machine Learning service workspace](concept-azure-machine-learning-architecture.md#workspace) in the cloud to contain your models and resources. Learn how to create one and create your first experiment in that workspace.

1. Click the Azure icon in the Visual Studio Code activity bar. The Azure Machine Learning sidebar appears.

   [![install](./media/vscode-tools-for-ai/CreateaWorkspace.gif)](./media/vscode-tools-for-ai/CreateaWorkspace.gif#lightbox)


1. Right-click your Azure subscription and select **Create Workspace**. A list appears. In the animated image, the subscription name is 'Free Trial' and the workspace is 'TeamWorkspace'. 

1. Select an existing resource group from the list or create a new one using the wizard in the Command Palette.

1. In the field, type a unique and clear name for your new workspace. In the screenshots, the workspace is named 'TeamWorkspace'.

1. Hit enter and the new workspace is created. It appears in the tree below the subscription name.

1. Right-click on the Experiment node and choose **Create Experiment** from the context menu.  Experiments keep track of your runs using Azure Machine Learning.

1. In the field, enter a name your experiment. In the screenshots, the experiment is named 'MNIST'.
 
1. Hit enter and the new experiment is created. It appears in the tree below the workspace name.

1. You can right-click on an Experiment in a Workspace and select 'Set as Active Experiment'. The **'Active'** experiment is the experiment you are currently using and your open folder in VS Code will be linked to this experiment in the cloud. This folder should contain your local Python scripts.

   Now each of your experiment runs with your experiment, so all of your key metrics will be stored in the experiment history and the models you train will get automatically uploaded to Azure Machine Learning and stored with your experiment metrics and logs.

   [![Attach a folder in VS Code](./media/vscode-tools-for-ai/CreateAnExperiment.gif)](./media/vscode-tools-for-ai/CreateAnExperiment.gif#lightbox)


## Create and manage compute targets

With Azure Machine Learning for VS Code, you can prepare your data, train models, and deploy them both locally and on remote compute targets.

This extension supports several different remote compute targets for Azure Machine Learning. See the [full list of supported compute targets](how-to-set-up-training-targets.md) for Azure Machine Learning.

### Create compute targets for Azure Machine Learning in VS Code

**To create a compute target:**

1. Click the Azure icon in the Visual Studio Code activity bar. The Azure Machine Learning sidebar appears.

2. In the tree view, expand your Azure subscription and Azure Machine Learning service workspace. In the animated image, the subscription name is 'Free Trial' and the workspace is 'TeamWorkspace'. 

3. Under the workspace node, right-click the **Compute** node and choose **Create Compute**.

4. Choose the compute target type from the list. 

5. In the Command Palette, select a Virtual Machine size.

6. In the Command Palette, enter a name for the compute target in the field. 

7. Specify any advanced properties in the JSON config file that opens in a new tab. You can specify properties such as a maximum node count.

8. When you are done configuring your compute target, click **Submit** in the bottom-right corner of the screen.

Here is an example for creating an Azure Machine Learning Compute (AMLCompute):
[![Create AML Compute in VS Code](./media/vscode-tools-for-ai/CreateARemoteCompute.gif)](./media/vscode-tools-for-ai/CreateARemoteCompute.gif#lightbox)

#### The 'run configuration' file

The VS Code extension will automatically create a local compute target and run configurations for your **local** and **docker** environments on your local computer. The run configuration files can be found under the associated compute target node. 

## Train and tune models

Use Azure Machine Learning for VS Code (Preview) to rapidly iterate on your code, step through and debug, and use your source code control solution of choice. 

**To run your experiment locally with Azure Machine Learning:**

1. Click the Azure icon in the Visual Studio Code activity bar. The Azure Machine Learning sidebar appears.

1. In the tree view, expand your Azure subscription and Azure Machine Learning service workspace. 

1. Under the workspace node, expand the **Compute** node and right-click on the **Run Config** of compute you want to use. 

1. Select **Run Experiment**.

1. Select the script to run from the File Explorer. 

1. Click **View Experiment Run** to see the integrated Azure Machine Learning portal to monitor your runs and see your trained models.

Here is an example for running an experiment locally:
[![Running an experiment locally](./media/vscode-tools-for-ai/RunExperimentLocally.gif)](./media/vscode-tools-for-ai/RunExperimentLocally.gif#lightbox)

### Use remote computes for experiments in VS Code

To use a remote compute target when training, you need to create a run configuration file. This file tells Azure Machine Learning not only where to run your experiment but also how to prepare the environment.

#### The conda dependencies file

By default, a new conda environment is created for you and your installation dependencies are managed. However, you must specify your dependencies and their versions in the `aml_config/conda_dependencies.yml` file. 

This is a snippet from the default 'aml_config/conda_dependencies.yml'. For example, you can specify 'tensorflow=1.12.0' as seen below. If you do not specify the version of the dependency, then the latest version will be used.  
You can add additional dependencies in the config file.

```yaml
# The dependencies defined in this file will be automatically provisioned for runs with userManagedDependencies=False.

name: project_environment
dependencies:
  # The python interpreter version.

  # Currently Azure ML only supports 3.5.2 and later.

- python=3.6.2
- tensorflow=1.12.0

- pip:
    # Required packages for AzureML execution, history, and data preparation.

  - --index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
  - --extra-index-url https://pypi.python.org/simple
  - azureml-defaults

```

**To run your experiment with Azure Machine Learning on a remote compute target:**

1. Click the Azure icon in the Visual Studio Code activity bar. The Azure Machine Learning sidebar appears.

1. In the tree view, expand your Azure subscription and Azure Machine Learning service workspace. 

1. Right-click on your python script in the editor window and select **AML: Run as Experiment in Azure**. 

1. In the Command Palette, select the compute target. 

1. In the Command Palette, enter the run configuration name in the field. 

1. Edit the conda_dependencies.yml file to specify the experiment's runtime dependencies, then click **Submit** in the bottom-right corner of the screen. 

1. Click **View Experiment Run** to see the integrated Azure Machine Learning portal to monitor your runs and see your trained models.

Here is an example for running an experiment on a remote compute target:
[![Running an experiment on a remote target](./media/vscode-tools-for-ai/runningOnARemoteTarget.gif)](./media/vscode-tools-for-ai/runningOnARemoteTarget.gif#lightbox)


## Deploy and manage models
Azure Machine Learning enables deploying and managing your machine learning models in the cloud and on the edge. 

### Register your model to Azure Machine Learning from VS Code

Now that you have trained your model, you can register it in your workspace.
Registered models can be tracked and deployed.

**To register your model:**

1. Click the Azure icon in the Visual Studio Code activity bar. The Azure Machine Learning sidebar appears.

1. In the tree view, expand your Azure subscription and Azure Machine Learning service workspace.

1. Under the workspace node, right-click **Models** and choose **Register Model**.

1. In the Command Palette, enter a model name in the field. 

1. From the list, choose whether you want to upload a **model file** (for single models) a  **model folder** (for models with multiple files, such as Tensorflow). 

1. Select your folder or file.

1. When you are done configuring your model properties, click **Submit** in the bottom-right corner of the screen. 

Here is an example for registering your model to AML:
[![Registering a Model to AML](./media/vscode-tools-for-ai/RegisteringAModel.gif)](./media/vscode-tools-for-ai/RegisteringAModel.gif#lightbox)


### Deploy your service from VS Code

Using VS Code, you can deploy your web service to:
+ Azure Container Instance (ACI): for testing
+ Azure Kubernetes Service (AKS): for production 

You do not need to create an ACI container to test in advance since they are created on the fly. However, AKS clusters do need to be configured in advance. 

Learn more about [deployment with Azure Machine Learning](how-to-deploy-and-where.md) in general.

**To deploy a web service:**

1. Click the Azure icon in the Visual Studio Code activity bar. The Azure Machine Learning sidebar appears.

1. In the tree view, expand your Azure subscription and your Azure Machine Learning service workspace.

1. Under the workspace node, expand the **Models** node.

1. Right-click the model you want to deploy and choose **Deploy Service from Registered Model** command from the context menu.

1. In the Command Palette, choose the compute target to which to deploy from the list. 

1. In the Command Palette, enter a name for this service in the field.  

1. In the Command Palette, press the Enter key on your keyboard to browse and select the script file.

1. In the Command Palette, press the Enter key on your keyboard to browse and select the conda dependency file.

1. When you are done configuring your service properties, click **Submit** in the bottom-right corner of the screen to deploy. In this service properties file, you can specify a local Docker file or a schema.json file that you may want to use.

The web service is now deployed.

Here is an example for deploying a web service:
[![Deploying a web service](./media/vscode-tools-for-ai/CreatingAnImage.gif)](./media/vscode-tools-for-ai/CreatingAnImage.gif#lightbox)

### Use keyboard shortcuts

Like most of VS Code, the Azure Machine Learning features in VS Code are accessible from the keyboard. The most important key combination to know is Ctrl+Shift+P, which brings up the Command Palette. From here, you have access to all of the functionality of VS Code, including keyboard shortcuts for the most common operations.

[![Keyboard shortcuts for Azure Machine Learning for VS Code](./media/vscode-tools-for-ai/commands.gif)](./media/vscode-tools-for-ai/commands.gif#lightbox)

## Next steps

For a walk-through of training with Machine Learning outside of VS Code, read [Tutorial: Train models with Azure Machine Learning](tutorial-train-models-with-aml.md).

For a walk-through of editing, running, and debugging code locally, see the [Python Hello World Tutorial](https://code.visualstudio.com/docs/python/python-tutorial)
