---
title: Deploy an AutoML model with an online endpoint (preview)
titleSuffix: Azure Machine Learning
description: Learn to deploy your AutoML model as a web service that's automatically managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
ms.reviewer: larryfr
author: shivanissambare
ms.date: 03/31/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, devx-track-azurecli, cliv2
ms.devlang: azurecli
---

# How to deploy an AutoML model to an online endpoint (preview)

[!INCLUDE [cli v2 how to update](../../includes/machine-learning-cli-v2-update-note.md)]

In this article, you'll learn how to deploy an AutoML-trained machine learning model to an online endpoint. Automated machine learning, also referred to as automated ML or AutoML, is the process of automating the time-consuming, iterative tasks of developing a machine learning model. For more, see [What is automated machine learning (AutoML)?](concept-automated-ml.md).

In this article you'll know how to deploy AutoML trained machine learning model to online endpoints using: 

- Azure Machine Learning studio
- Azure Machine Learning CLI (v2))

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

An AutoML-trained machine learning model. For more, see [Tutorial: Train a classification model with no-code AutoML in the Azure Machine Learning studio](tutorial-first-experiment-automated-ml.md) or [Tutorial: Forecast demand with automated machine learning](tutorial-automated-ml-forecast.md).

## Deploy from Azure Machine Learning studio and no code

Deploying an AutoML-trained model from the Automated ML page is a no-code experience. That is, you don't need to prepare a scoring script and environment, both are auto generated. 

1. Go to the Automated ML page in the studio
1. Select your experiment and run
1. Choose the Models tab
1. Select the model you want to deploy 
1. Once you select a model, the Deploy button will light up with a drop-down menu
1. Select *Deploy to real-time endpoint (preview)* option

   :::image type="content" source="media/how-to-deploy-automl-endpoint/deploy-button.png" lightbox="media/how-to-deploy-automl-endpoint/deploy-button.png" alt-text="Screenshot showing the Deploy button's drop-down menu":::

   The system will generate the Model and Environment needed for the deployment. 

   :::image type="content" source="media/how-to-deploy-automl-endpoint/model.png" lightbox="media/how-to-deploy-automl-endpoint/model.png" alt-text="Screenshot showing the generated Model":::

   :::image type="content" source="media/how-to-deploy-automl-endpoint/environment.png" lightbox="media/how-to-deploy-automl-endpoint/environment.png" alt-text="Screenshot showing the generated Environment":::

5. Complete the wizard to deploy the model to a real-time endpoint

 :::image type="content" source="media/how-to-deploy-automl-endpoint/complete-wizard.png" lightbox="media/how-to-deploy-automl-endpoint/complete-wizard.png"  alt-text="Screenshot showing the review-and-create page":::


## Deploy manually from the studio or command line

If you wish to have more control over the deployment, you can download the training artifacts and deploy them. 

To download the components you'll need for deployment:

1. Go to your Automated ML experiment and run in your machine learning workspace
1. Choose the Models tab
1. Select the model you wish to use. Once you select a model, the *Download* button will become enabled
1. Choose *Download*

:::image type="content" source="media/how-to-deploy-automl-endpoint/download-model.png" lightbox="media/how-to-deploy-automl-endpoint/download-model.png" alt-text="Screenshot showing the selection of the model and download button":::

You'll receive a zip file containing:
* A conda environment specification file named `conda_env_<VERSION>.yml`
* A Python scoring file named `scoring_file_<VERSION>.py`
* The model itself, in a Python `.pkl` file named `model.pkl`

To deploy using these files, you can use either the studio or the Azure CLI.

# [Studio](#tab/Studio)

1. Go to the Models page in Azure Machine Learning studio

1. Select + Register Model option

1. Register the model you downloaded from Automated ML run

1. Go to Environments page, select Custom environment, and select + Create option to create an environment for your deployment. Use the downloaded conda yaml to create a custom environment

1. Select the model, and from the Deploy drop-down option, select Deploy to real-time endpoint

1. Complete all the steps in wizard to create an online endpoint and deployment

 
# [CLI](#tab/CLI)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

## Configure the CLI 

To create a deployment from the CLI, you'll need the Azure CLI with the ML v2 extension. Run the following command to confirm that you've both:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_version":::

If you receive an error message or you don't see `Extensions: ml` in the response, follow the steps at [Install and set up the CLI (v2)](how-to-configure-cli.md).

Sign in:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_login":::

If you've access to multiple Azure subscriptions, you can set your active subscription:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_account_set":::

Set the default resource group and workspace to where you wish to create the deployment:

:::code language="azurecli" source="~/azureml-examples-main/cli/setup.sh" id="az_configure_defaults":::

## Put the scoring file in its own directory

Create a directory called `src/` and place the scoring file you downloaded into it. This directory is uploaded to Azure and contains all the source code necessary to do inference. For an AutoML model, there's just the single scoring file. 

## Create the endpoint and deployment yaml file

To create an online endpoint from the command line, you'll need to create an *endpoint.yml* and a *deployment.yml* file. The following code, taken from the [Azure Machine Learning Examples repo](https://github.com/Azure/azureml-examples) shows the _endpoints/online/managed/sample/_, which captures all the required inputs:

__automl_endpoint.yml__

::: code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/endpoint.yml" :::

__automl_deployment.yml__

::: code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/blue-deployment.yml" :::

You'll need to modify this file to use the files you downloaded from the AutoML Models page.

1. Create a file `automl_endpoint.yml` and `automl_deployment.yml` and paste the contents of the above example.

1. Change the value of the `name` of the endpoint. The endpoint name needs to be unique within the Azure region. The name for an endpoint must start with an upper- or lowercase letter and only consist of '-'s and alphanumeric characters.

1. In the `automl_deployment` file, change the value of the keys at the following paths:

    | Path | Change to |
    | --- | --- |
    | `model:path` | The path to the `model.pkl` file you downloaded. |
    | `code_configuration:code:path` | The directory in which you placed the scoring file. | 
    | `code_configuration:scoring_script` | The name of the Python scoring file (`scoring_file_<VERSION>.py`). |
    | `environment:conda_file` | A file URL for the downloaded conda environment file (`conda_env_<VERSION>.yml`). |

    > [!NOTE]
    > For a full description of the YAML, see [Online endpoint (preview) YAML reference](reference-yaml-endpoint-online.md).

1. From the command line, run: 

    [!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

    ```azurecli
    az ml online-endpoint create -f automl_endpoint.yml
    az ml online-deployment create -f automl_deployment.yml
    ```
    
---

After you create a deployment, you can score it as described in [Invoke the endpoint to score data by using your model](how-to-deploy-managed-online-endpoints.md#invoke-the-endpoint-to-score-data-by-using-your-model).

## Next steps

- [Troubleshooting online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-managed-endpoints.md)
