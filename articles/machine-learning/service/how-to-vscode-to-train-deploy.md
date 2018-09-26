---
title: Using Visual Studio Code Tools for AI extension with Azure Machine Learning
description: Learn about Visual Studio Code Tools for AI and how to start training and deploy machine learning and deep learning models with Azure Machine Learning service in VS Code.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: jmartens
author: j-martens
ms.reviewer: jmartens
ms.date: 10/1/2018
---
# Getting started with Azure Machine Learning in Visual Studio Code

In this article, you'll learn about Visual Studio Code (VS Code) extension, **Tools for AI**, and how to start training and deploy machine learning and deep learning models with Azure Machine Learning service in VS Code.

Use the Tools for AI extension in Visual Studio code to use the Azure Machine Learning service to:
+ Prepare data
+ Train and test machine learning and deep learning models on local and remote compute targets
+ Deploy models as web services
+ Track custom metrics and experiments

## Prerequisite

+ [Have VS Code Tools for AI set up for Azure Machine Learning](how-to-vscode-tools.md).

+ If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create and manage Azure compute targets in Visual Studio Code

With Visual Studio Code Tools for AI, you can prepare your data, train models, and deploy them both locally and on remote compute targets.

This extension supports several different remote compute targets for Azure Machine Learning. See the [full list of supported compute targets](how-to-set-up-training-targets.md) for Azure Machine Learning.

### Create compute targets

To create a compute target:
1. In Visual Studio Code, open the Azure Machine Learning view in the Azure activity bar

2. In the tree view, expand your Azure subscription and Azure Machine Learning workspace.

3. In the tree view, right-click the **Compute** node and choose **Create Compute**.

4. Choose the compute target type from the list. 

5. In the field, enter a unique name for this compute target and specify the size of the virtual machine.

6. Specify any advanced properties in the JSON config file that opens in a new tab. 

7. When you are done configuring your compute target, click **Finish** in the lower right.

Here is an example for Azure Batch AI:
![Create Azure Batch AI compute in VS Code](./media/vscode-tools-for-ai/createcompute.gif)

### To use remote compute for experiments

To un a remote compute target when training, you need to create a run configuration file. This tells Azure Machine Learning not only where to run your experiment but also how to prepare the environment.

The VS Code extension will automatically create a run configuration for your **local** and **docker** environments on your local computer.
- By default,  Azure Machine Learning will create a new conda environment for you and manage all of your installation dependencies. You must specify your dependencies in the `aml_config/conda_dependencies.yml` file
- If you want to install all of your libraries/dependencies yourself, set `userManagedDependencies: True` and then local experiment runs will use your default Python environment as specified by the VS Code Python extension.

**Section of default generated run configuration**

```yaml
# user_managed_dependencies=True indicates that the environment will be user managed. False indicates that AzureML will manage the user environment.
    userManagedDependencies: False
# The python interpreter path
    interpreterPath: python
# Path to the conda dependencies file to use for this run. If a project
# contains multiple programs with different sets of dependencies, it may be
# convenient to manage those environments with separate files.
    condaDependenciesFile: aml_config/conda_dependencies.yml
# Docker details
    docker:
# Set True to perform this run inside a Docker container.
    enabled: false
```

**Section of default generated aml_config/conda_dependencies.yml**

Add additional dependencies in the config file

```yaml
# The dependencies defined in this file will be automatically provisioned for runs with userManagedDependencies=False.

name: project_environment
dependencies:
  # The python interpreter version.

  # Currently Azure ML only supports 3.5.2 and later.

- python=3.6.2

- pip:
    # Required packages for AzureML execution, history, and data preparation.

  - --index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
  - --extra-index-url https://pypi.python.org/simple
  - azureml-defaults

```

## Train and tune models in Visual Studio Code

Azure Machine Learning provides support for running experiments locally and on remote compute targets. For every experiment, you can keep track of multiple runs as often you will need to iteratively try different techniques, hyperparameters, and more. You can use Azure Machine Learning to track custom metrics and experiment runs, enabling data science reproducibility and auditability.

Using Azure Machine Learning in VS Code enables you to rapidly iterate on your code, step through and debug, and use your source code control solution of choice. For a walkthrough of editing, running, and debugging code locally, see the [Python Hello World Tutorial](https://code.visualstudio.com/docs/languages/python/docs/python/python-tutorial)

To run your experiment with Azure Machine Learning

1. Prepare Visual Studio Code to train and deploy your models using the [Getting started with Azure Machine Learning in Visual Studio Code](getting-started-aml-vscode.md)
2. Open the Azure Machine Learning view in the Azure activity bar
3. Expand your Azure subscription and Azure Machine Learning workspace
4. Right-click the **Run Config** of either local or remote compute you want to use. To learn more about Run Configs see [Create and manage compute targets in Visual Studio Code](manage-compute-aml-vscode.md)
5. Select **Run Experiment**
6. Click **View Experiment Run** to see the integrated Azure Machine Learning portal to monitor your runs and see your trained models

![compute](./media/vscode-tools-for-ai/runexperiment.gif)

## Deploy and manage models with Azure Machine Learning
Azure Machine Learning enables deploying and managing your machine learning models in the cloud and on the edge. 

### Register your model to Azure Machine Learning

Once your model is trained, you can register it with Azure Machine Learning to track it and deploy.
1. Open the Azure Machine Learning view in the Azure activity bar
2. Expand your Azure subscription and Azure Machine Learning workspace
3. Right-click Models in the tree control and click Register Model
4. Select either to upload a single model from a **model file** or if you have a model with multiple files (like a Tensorflow model often does) then select **model folder**
5. Use the file picker to select your file or path

![compute](./media/registermodel.gif)

> **Note**: For now, please remove the Tags from the generated json file

### Deploy your service

You can deploy your service to either an Azure Container Instance to test or select an Azure Kubernetes Service. Learn how to create Azure Kubernetes Service in [Create and manage compute targets in Visual Studio Code](manage-compute-aml-vscode.md)

You do not need to create an Azure Container Instance to test in advance, this will be created automatically.

- You can deploy a service from a registered model by right the "Models" node and select the model to be deployed
- Right-click the model to be deployed, select "Deploy Service from Registered Model" command from the context menu;
- Select the service type in the Command Palette.
- Input the service name.
- A dialog box will pop up in the lower right corner, click "**Browse**" button then select your scoring script
- **Optional**: Click "Browse" button and select the local docker file (otherwise will use Azure Machine Learning default)
- A dialog box will pop up in the lower right corner, click "Browse" button then select the local conda file path, or input the file path in json editor later;
- **Optional**: Click "Browse" button and select a schema.json file

**Example for Azure Container Instance**
![compute](./media/vscode-tools-for-ai/deploy.gif)

> **Note**: For now, please remove the Tags from the generated json file
