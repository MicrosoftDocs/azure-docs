---
title: "Tutorial: Set up the Visual Studio Code extension"
titleSuffix: Azure Machine Learning
description: Learn how to set up the Visual Studio Code Azure Machine Learning extension.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: luisquintanilla
ms.author: luquinta
ms.date: 04/13/2020
#Customer intent: As a professional data scientist, I want to Learn how to install and run scripts using the Azure Machine Learning Visual Studio Code extension.
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
- Visual Studio Code. If you don't have it, [install it](https://code.visualstudio.com/docs/setup/setup-overview).
- [Python 3](https://www.python.org/downloads/)

## Install the extension

1. Open Visual Studio Code.
1. Select **Extensions** icon from the **Activity Bar** to open the Extensions view.
1. In the Extensions view, search for "Azure Machine Learning".
1. Select **Install**.

    > [!div class="mx-imgBorder"]
    > ![Install Azure Machine Learning VS Code Extension](./media/tutorial-setup-vscode-extension/install-aml-vscode-extension.PNG)

> [!NOTE]
> Alternatively, you can install the Azure Machine Learning extension via the Visual Studio Marketplace by [downloading the installer directly](https://aka.ms/vscodetoolsforai). 

The rest of the steps in this tutorial have been tested with **version 0.6.8** of the extension.

## Sign in to your Azure Account

In order to provision resources and run workloads on Azure, you have to sign in with your Azure account credentials. To assist with account management, Azure Machine Learning automatically installs the Azure Account extension. Visit the following site to [learn more about the Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

1. Open the command palette by selecting **View > Command Palette** from the menu bar. 
1. Enter the command "Azure: Sign In" into the command palette to start the sign in process.

## Run a machine learning model training script in Azure

Now that you have signed into Azure with your account credentials, Use the steps in this section to learn how to use the extension to train a machine learning model.

1. Download and unzip the [VS Code Tools for AI repository](https://github.com/microsoft/vscode-tools-for-ai/archive/master.zip) anywhere on your computer.
1. Open the `mnist-vscode-docs-sample` directory in Visual Studio Code.
1. Select the **Azure** icon in the Activity Bar.
1. Select the **Run Experiment** icon at the top of the Azure Machine Learning View.

    > [!div class="mx-imgBorder"]
    > ![Run Experiment](./media/tutorial-setup-vscode-extension/run-experiment.PNG)

1. When the command palette expands, follow the prompts.

    1. Select your Azure subscription.
    1. From the list of environments, select **Conda dependencies file**.
    1. Press **Enter** to browse the Conda dependencies file. This file contains the dependencies required to run your script. In this case, the dependencies file is the `env.yml` file inside the `mnist-vscode-docs-sample` directory.
    1. Press **Enter** to browse the training script file. This is the file that contains code to a machine learning model that categorize images of handwritten digits. In this case, the script to train the model is the `train.py` file inside the `mnist-vscode-docs-sample` directory.

1. At this point, a configuration file similar to the one below appears in the text editor. The configuration contains the information required to run the training job like the file that contains the code to train the model and any Python dependencies specified in the previous step.

    ```json
    {
        "workspace": "WS04131142",
        "resourceGroup": "WS04131142-rg1",
        "location": "South Central US",
        "experiment": "WS04131142-exp1",
        "compute": {
            "name": "WS04131142-com1",
            "vmSize": "Standard_D1_v2, Cores: 1; RAM: 3.5GB;"
        },
        "runConfiguration": {
            "filename": "WS04131142-com1-rc1",
            "environment": {
                "name": "WS04131142-env1",
                "conda_dependencies": [
                    "python=3.6.2",
                    "tensorflow=1.15.0",
                    "pip"
                ],
                "pip_dependencies": [
                    "azureml-defaults"
                ],
                "environment_variables": {}
            }
        }
    }
    ```

1. Once you're satisfied with your configuration, submit your experiment by opening the command palette and entering the following command:

    ```text
    Azure ML: Submit Experiment
    ```

    This sends the `train.py` and configuration file to your Azure Machine Learning workspace. The training job is then started on a compute resource in Azure.

### Track the progress of the training script

Running your script can take several minutes. To track its progress:

1. Select the **Azure** icon from the activity bar.
1. Expand your subscription node.
1. Expand your currently running experiment's node. This is located inside the `{workspace}/Experiments/{experiment}` node where the values for your workspace and experiment are the same as the properties defined in the configuration file.
1. All of the runs for the experiment are listed, as well as their status. To get the most recent status, click the refresh icon at the top of the Azure Machine Learning View.

    > [!div class="mx-imgBorder"]
    > ![Track Experiment Progress](./media/tutorial-setup-vscode-extension/track-experiment-progress.PNG)

### Download the trained model

When the experiment run is complete, the output is a trained model. To download the outputs locally:

1. Right-click the most recent run and select **Download Outputs**.

    > [!div class="mx-imgBorder"]
    > ![Download Trained Model](./media/tutorial-setup-vscode-extension/download-trained-model.PNG)

1. Select a location where to save the outputs to.
1. A folder with the name of your run is downloaded locally. Navigate to it.
1. The model files are inside the `outputs/outputs/model` directory.

## Next steps

* [Tutorial: Train and deploy an image classification TensorFlow model using the Azure Machine Learning Visual Studio Code Extension](tutorial-train-deploy-image-classification-model-vscode.md).
