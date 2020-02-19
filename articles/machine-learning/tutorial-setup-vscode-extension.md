---
title: "Tutorial: Set up Azure Machine Learning Visual Studio Code extension"
titleSuffix: Azure Machine Learning
description: Learn how to set up the Visual Studio Code Azure Machine Learning extension.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: luisquintanilla
ms.author: luquinta
ms.date: 01/16/2019
#Customer intent: As a professional data scientist, I want to learn how to get started with the Azure Machine Learning Visual Studio Code Extension.
---

# Set up Azure Machine Learning Visual Studio Code extension

Learn how to install and run scripts using the Azure Machine Learning Visual Studio Code extension.

In this tutorial, you learn the following tasks:

> [!div class="checklist"]
> * Install the Azure Machine Learning Visual Studio Code extension
> * Sign into your Azure account from Visual Studio Code
> * Use the Azure Machine Learning extension to run a sample script

## Prerequisites

- Azure subscription. If you don't have one, sign up to try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
- Install [Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview), a lightweight, cross-platform code editor. 

## Install the extension

1. Open Visual Studio Code.
1. Select **Extensions** icon from the **Activity Bar** to open the Extensions view.
1. In the Extensions view, search for "Azure Machine Learning".
1. Select **Install**.

> [!NOTE]
> Alternatively, you can install the Azure Machine Learning extension via the Visual Studio Marketplace by [downloading the installer directly](https://aka.ms/vscodetoolsforai). 

The rest of the steps in this tutorial have been tested with **version 0.6.8** of the extension.

## Sign in to your Azure Account

In order to provision resources and run workloads on Azure, you have to sign in with your Azure account credentials. To assist with account management, Azure Machine Learning automatically installs the Azure Account extension. Visit the following site to [learn more about the Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

1. Open the command palette by selecting **View > Command Palette** from the menu bar. 
1. Enter the command "Azure: Sign In" into the text box to start the sign in process.

## Run a script in Azure

Now that you have signed into Azure with your account credentials, Use the steps in this section to learn how to use the extension to train a machine learning model.

1. Download and unzip the [VS Code Tools for AI repository](https://github.com/microsoft/vscode-tools-for-ai/archive/master.zip) anywhere on your computer.
1. Open the `mnist-vscode-docs-sample` directory in Visual Studio Code.
1. Select the **Azure** icon in the Activity Bar.
1. Select the **Run Experiment** icon at the top of the Azure Machine Learning View.

    > [!div class="mx-imgBorder"]
    > ![Run Experiment](./media/tutorial-setup-vscode-extension/run-experiment.PNG)

1. When the command palette expands, follow the prompts.

    1. Select your Azure subscription.
    1. Select **Create a new Azure ML workspace**
    1. Select the **TensorFlow Single-Node Training** job type.
    1. Enter `train.py` as the script to train. This is the file that contains code to a machine learning model that categorize images of handwritten digits.
    1. Specify the following packages as requirements to run.

        ```text
        pip: azureml-defaults; conda: python=3.6.2, tensorflow=1.15.0
        ```

1. At this point, a configuration file similar to the one below appears in the text editor. The configuration contains the information required to run the training job like the file that contains the code to train the model and any Python dependencies specified in the previous step.

    ```json
    {
        "workspace": "WS12191742",
        "resourceGroup": "WS12191742-rg2",
        "location": "South Central US",
        "experiment": "WS12191742-exp2",
        "compute": {
            "name": "WS12191742-com2",
            "vmSize": "Standard_D1_v2, Cores: 1; RAM: 3.5GB;"
        },
        "runConfiguration": {
            "filename": "WS12191742-com2-rc1",
            "condaDependencies": [
                "python=3.6.2",
                "tensorflow=1.15.0"
            ],
            "pipDependencies": [
                "azureml-defaults"
            ]
        }
    }
    ```

1. Select **Submit experiment** to run your experiment in Azure. This sends the `train.py` and configuration file to your Azure Machine Learning workspace. The training job is then started on a compute resource in Azure.
1. After several minutes, a directory called `output` is created locally containing a trained TensorFlow model.

## Next steps

* [Tutorial: Train and deploy an image classification TensorFlow model using the Azure Machine Learning Visual Studio Code Extension](tutorial-train-deploy-image-classification-model-vscode.md).
