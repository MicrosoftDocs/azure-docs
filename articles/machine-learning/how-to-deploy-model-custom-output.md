---
title: "Customize outputs in batch deployments"
titleSuffix: Azure Machine Learning
description: Learn how create deployments that generate custom outputs and files.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande
ms.custom: devplatv2
---

# Customize outputs in batch deployments

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

Sometimes you need to execute inference having a higher control of what is being written as output of the batch job. Those cases include:

> [!div class="checklist"]
> * You need to control how the predictions are being written in the output. For instance, you want to append the prediction to the original data (if data is tabular).
> * You need to write your predictions in a different file format from the one supported out-of-the-box by batch deployments.
> * Your model is a generative model that can't write the output in a tabular format. For instance, models that produce images as outputs.
> * Your model produces multiple tabular files instead of a single one. This is the case for instance of models that perform forecasting considering multiple scenarios.

In any of those cases, Batch Deployments allow you to take control of the output of the jobs by allowing you to write directly to the output of the batch deployment job. In this tutorial, we'll see how to deploy a model to perform batch inference and writes the outputs in `parquet` format by appending the predictions to the original input data.

## About this sample

This example shows how you can deploy a model to perform batch inference and customize how your predictions are written in the output. This example uses a model based on the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). The database contains 76 attributes, but we are using a subset of 14 of them. The model tries to predict the presence of heart disease in a patient. It is integer valued from 0 (no presence) to 1 (presence).

The model has been trained using an `XGBBoost` classifier and all the required preprocessing has been packaged as a `scikit-learn` pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

[!INCLUDE [machine-learning-batch-clone](includes/azureml-batch-clone-samples.md)]

The files for this example are in:

```azurecli
cd endpoints/batch/deploy-models/custom-outputs-parquet
```

### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the cloned repository, open the notebook: [custom-output-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb).

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](includes/azureml-batch-prereqs.md)]

## Creating a batch deployment with a custom output

In this example, we are going to create a deployment that can write directly to the output folder of the batch deployment job. The deployment will use this feature to write custom parquet files.

### Registering the model

Batch Endpoint can only deploy registered models. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="register_model" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=register_model)]
---

### Creating a scoring script

We need to create a scoring script that can read the input data provided by the batch deployment and return the scores of the model. We are also going to write directly to the output folder of the job. In summary, the proposed scoring script does as follows:

1. Reads the input data as CSV files.
2. Runs an MLflow model `predict` function over the input data.
3. Appends the predictions to a `pandas.DataFrame` along with the input data.
4. Writes the data in a file named as the input file, but in `parquet` format.

__code/batch_driver.py__

:::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/code/batch_driver.py" highlight="16,31-33" :::

__Remarks:__
* Notice how the environment variable `AZUREML_BI_OUTPUT_PATH` is used to get access to the output path of the deployment job. 
* The `init()` function is populating a global variable called `output_path` that can be used later to know where to write.
* The `run` method returns a list of the processed files. It is required for the `run` function to return a `list` or a `pandas.DataFrame` object.

> [!WARNING]
> Take into account that all the batch executors will have write access to this path at the same time. This means that you need to account for concurrency. In this case, we are ensuring each executor writes its own file by using the input file name as the name of the output folder.

## Creating the endpoint

We are going to create a batch endpoint named `heart-classifier-batch` where to deploy the model.

1. Decide on the name of the endpoint. The name of the endpoint will end-up in the URI associated with your endpoint. Because of that, __batch endpoint names need to be unique within an Azure region__. For example, there can be only one batch endpoint with the name `mybatchendpoint` in `westus2`.

    # [Azure CLI](#tab/cli)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="name_endpoint" :::
    
    # [Python](#tab/python)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=name_endpoint)]

1. Configure your batch endpoint

    # [Azure CLI](#tab/cli)

    The following YAML file defines a batch endpoint:
    
    __endpoint.yml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/endpoint.yml":::
    
    # [Python](#tab/python)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=configure_endpoint)]
    
1. Create the endpoint:

   # [Azure CLI](#tab/cli)

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="create_endpoint" :::

   # [Python](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=create_endpoint)]

### Creating the deployment

Follow the next steps to create a deployment using the previous scoring script:

1. First, let's create an environment where the scoring script can be executed:

   # [Azure CLI](#tab/cli)
   
   No extra step is required for the Azure Machine Learning CLI. The environment definition will be included in the deployment file.
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deployment.yml" range="7-10":::
   
   # [Python](#tab/python)
   
   Let's get a reference to the environment:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=configure_environment)]

2. Create the deployment. Notice that now `output_action` is set to `SUMMARY_ONLY`.

   > [!NOTE]
   > This example assumes you have aa compute cluster with name `batch-cluster`. Change that name accordinly.

   # [Azure CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deployment.yml":::
   
   Then, create the deployment with the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="create_deployment" :::
   
   # [Python](#tab/python)
   
   To create a new deployment under the created endpoint, use the following script:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=configure_deployment)]
   
   Then, create the deployment with the following command:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=create_deployment)]
   
3. At this point, our batch endpoint is ready to be used. 

## Testing out the deployment

For testing our endpoint, we are going to use a sample of unlabeled data located in this repository and that can be used with the model. Batch endpoints can only process data that is located in the cloud and that is accessible from the Azure Machine Learning workspace. In this example, we are going to upload it to an Azure Machine Learning data store. Particularly, we are going to create a data asset that can be used to invoke the endpoint for scoring. However, notice that batch endpoints accept data that can be placed in multiple type of locations.

1. Let's invoke the endpoint with data from a storage account:

   # [Azure CLI](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="start_batch_scoring_job" :::
   
   > [!NOTE]
   > The utility `jq` may not be installed on every installation. You can get instructions in [this link](https://stedolan.github.io/jq/download/).
   
   # [Python](#tab/python)

   > [!TIP]
   > [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]

   Configure the inputs:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=configure_inputs)]

   Create a job:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=start_batch_scoring_job)]
   
1. A batch job is started as soon as the command returns. You can monitor the status of the job until it finishes:

   # [Azure CLI](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="show_job_in_studio" :::
   
   # [Python](#tab/python)
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=get_job)]
   
## Analyzing the outputs

The job generates a named output called `score` where all the generated files are placed. Since we wrote into the directory directly, one file per each input file, then we can expect to have the same number of files. In this particular example we decided to name the output files the same as the inputs, but they will have a parquet extension.

> [!NOTE]
> Notice that a file `predictions.csv` is also included in the output folder. This file contains the summary of the processed files.

You can download the results of the job by using the job name:

# [Azure CLI](#tab/cli)

To download the predictions, use the following command:

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="download_outputs" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=download_outputs)]
---

Once the file is downloaded, you can open it using your favorite tool. The following example loads the predictions using `Pandas` dataframe.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=read_outputs)]

The output looks as follows:

| age |    sex |    ... |    thal       |    prediction |
|-----|------|-----|------------|--------------|
| 63  |    1   |    ... |    fixed      |    0          |
| 67  |    1   |    ... |    normal     |    1          |
| 67  |    1   |    ... |    reversible |    0          |
| 37  |    1   |    ... |    normal     |    0          |

## Clean up resources

# [Azure CLI](#tab/cli)

Run the following code to delete the batch endpoint and all the underlying deployments. Batch scoring jobs won't be deleted.

::: code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

Run the following code to delete the batch endpoint and all the underlying deployments. Batch scoring jobs won't be deleted.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb?name=delete_endpoint)]

---


## Next steps

* [Using batch deployments for image file processing](how-to-image-processing-batch.md)
* [Using batch deployments for NLP processing](how-to-nlp-processing-batch.md)
