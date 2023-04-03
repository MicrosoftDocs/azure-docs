---
title: "Customize outputs in batch deployments"
titleSuffix: Azure Machine Learning
description: Learn how create deployments that generate custom outputs and files.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande
ms.custom: devplatv2, devx-track-azurecli
---

# Customize outputs in batch deployments

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

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

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo and then change directories to the `cli/endpoints/batch/deploy-models/custom-outputs-parquet` if you are using the Azure CLI or `sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet` if you are using our SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/batch/deploy-models/custom-outputs-parquet
```

### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the cloned repository, open the notebook: [custom-output-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/custom-outputs-parquet/custom-output-batch.ipynb).

## Prerequisites

[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

* A model registered in the workspace. In this tutorial, we'll use an MLflow model. Particularly, we are using the *heart condition classifier* created in the tutorial [Using MLflow models in batch deployments](how-to-mlflow-batch.md).
* You must have an endpoint already created. If you don't, follow the instructions at [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md). This example assumes the endpoint is named `heart-classifier-batch`.
* You must have a compute created where to deploy the deployment. If you don't, follow the instructions at [Create compute](how-to-use-batch-endpoint.md#create-compute). This example assumes the name of the compute is `cpu-cluster`.

## Creating a batch deployment with a custom output

In this example, we are going to create a deployment that can write directly to the output folder of the batch deployment job. The deployment will use this feature to write custom parquet files.

### Registering the model

Batch Endpoint can only deploy registered models. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='heart-classifier-sklpipe'
az ml model create --name $MODEL_NAME --type "custom_model" --path "model"
```

# [Python](#tab/sdk)

```python
model_name = 'heart-classifier'
model = ml_client.models.create_or_update(
     Model(name=model_name, path='model', type=AssetTypes.CUSTOM_MODEL)
)
```
---

### Creating a scoring script

We need to create a scoring script that can read the input data provided by the batch deployment and return the scores of the model. We are also going to write directly to the output folder of the job. In summary, the proposed scoring script does as follows:

1. Reads the input data as CSV files.
2. Runs an MLflow model `predict` function over the input data.
3. Appends the predictions to a `pandas.DataFrame` along with the input data.
4. Writes the data in a file named as the input file, but in `parquet` format.

__code/batch_driver.py__

:::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/code/batch_driver.py" :::

__Remarks:__
* Notice how the environment variable `AZUREML_BI_OUTPUT_PATH` is used to get access to the output path of the deployment job. 
* The `init()` function is populating a global variable called `output_path` that can be used later to know where to write.
* The `run` method returns a list of the processed files. It is required for the `run` function to return a `list` or a `pandas.DataFrame` object.

> [!WARNING]
> Take into account that all the batch executors will have write access to this path at the same time. This means that you need to account for concurrency. In this case, we are ensuring each executor writes its own file by using the input file name as the name of the output folder.

### Creating the deployment

Follow the next steps to create a deployment using the previous scoring script:

1. First, let's create an environment where the scoring script can be executed:

   # [Azure CLI](#tab/cli)
   
   No extra step is required for the Azure Machine Learning CLI. The environment definition will be included in the deployment file.
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deployment.yml" range="8-11":::
   
   # [Python](#tab/sdk)
   
   Let's get a reference to the environment:
   
   ```python
   environment = Environment(
       name="batch-mlflow-xgboost",
       conda_file="environment/conda.yaml",
       image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest",
   )
   ```

2. Create the deployment

   > [!NOTE]
   > This example assumes you have an endpoint created with the name `heart-classifier-batch` and a compute cluster with name `cpu-cluster`. If you don't, please follow the steps in the doc [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md).

   # [Azure CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following:
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deployment.yml":::
   
   Then, create the deployment with the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/custom-outputs-parquet/deploy-and-run.sh" ID="create_batch_deployment_set_default" :::
   
   # [Python](#tab/sdk)
   
   To create a new deployment under the created endpoint, use the following script:
   
   ```python
   deployment = BatchDeployment(
       name="classifier-xgboost-parquet",
       description="A heart condition classifier based on XGBoost",
       endpoint_name=endpoint.name,
       model=model,
       environment=environment,
       code_configuration=CodeConfiguration(
           code="code/",
           scoring_script="batch_driver.py",
       ),
       compute=compute_name,
       instance_count=2,
       max_concurrency_per_instance=2,
       mini_batch_size=2,
       output_action=BatchDeploymentOutputAction.SUMMARY_ONLY,
       retry_settings=BatchRetrySettings(max_retries=3, timeout=300),
       logging_level="info",
   )
   ```
   
   Then, create the deployment with the following command:
   
   ```python
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```
   ---
   
   > [!IMPORTANT]
   > Notice that now `output_action` is set to `SUMMARY_ONLY`.

3. At this point, our batch endpoint is ready to be used. 

## Testing out the deployment

For testing our endpoint, we are going to use a sample of unlabeled data located in this repository and that can be used with the model. Batch endpoints can only process data that is located in the cloud and that is accessible from the Azure Machine Learning workspace. In this example, we are going to upload it to an Azure Machine Learning data store. Particularly, we are going to create a data asset that can be used to invoke the endpoint for scoring. However, notice that batch endpoints accept data that can be placed in multiple type of locations.

1. Let's create the data asset first. This data asset consists of a folder with multiple CSV files that we want to process in parallel using batch endpoints. You can skip this step is your data is already registered as a data asset or you want to use a different input type.

   # [Azure CLI](#tab/cli)
   
   Create a data asset definition in `YAML`:
   
   __heart-dataset-unlabeled.yml__
   
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
   name: heart-dataset-unlabeled
   description: An unlabeled dataset for heart classification.
   type: uri_folder
   path: heart-dataset
   ```
   
   Then, create the data asset:
   
   ```azurecli
   az ml data create -f heart-dataset-unlabeled.yml
   ```
   
   # [Python](#tab/sdk)
   
   ```python
   data_path = "resources/heart-dataset/"
   dataset_name = "heart-dataset-unlabeled"

   heart_dataset_unlabeled = Data(
       path=data_path,
       type=AssetTypes.URI_FOLDER,
       description="An unlabeled dataset for heart classification",
       name=dataset_name,
   )
   ```
   
   Then, create the data asset:
   
   ```python
   ml_client.data.create_or_update(heart_dataset_unlabeled)
   ```
   
   To get the newly created data asset, use:
   
   ```python
   heart_dataset_unlabeled = ml_client.data.get(name=dataset_name, label="latest")
   ```
   
1. Now that the data is uploaded and ready to be used, let's invoke the endpoint:

   # [Azure CLI](#tab/cli)
   
   ```azurecli
   JOB_NAME = $(az ml batch-endpoint invoke --name $ENDPOINT_NAME --deployment-name $DEPLOYMENT_NAME --input azureml:heart-dataset-unlabeled@latest | jq -r '.name')
   ```
   
   > [!NOTE]
   > The utility `jq` may not be installed on every installation. You can get instructions in [this link](https://stedolan.github.io/jq/download/).
   
   # [Python](#tab/sdk)
   
   ```python
   input = Input(type=AssetTypes.URI_FOLDER, path=heart_dataset_unlabeled.id)
   job = ml_client.batch_endpoints.invoke(
      endpoint_name=endpoint.name,
      deployment_name=deployment.name,
      input=input,
   )
   ```
   
1. A batch job is started as soon as the command returns. You can monitor the status of the job until it finishes:

   # [Azure CLI](#tab/cli)
   
   ```azurecli
   az ml job show --name $JOB_NAME
   ```
   
   # [Python](#tab/sdk)
   
   ```python
   ml_client.jobs.get(job.name)
   ```
   
## Analyzing the outputs

The job generates a named output called `score` where all the generated files are placed. Since we wrote into the directory directly, one file per each input file, then we can expect to have the same number of files. In this particular example we decided to name the output files the same as the inputs, but they will have a parquet extension.

> [!NOTE]
> Notice that a file `predictions.csv` is also included in the output folder. This file contains the summary of the processed files.

You can download the results of the job by using the job name:

# [Azure CLI](#tab/cli)

To download the predictions, use the following command:

```azurecli
az ml job download --name $JOB_NAME --output-name score --download-path ./
```

# [Python](#tab/sdk)

```python
ml_client.jobs.download(name=job.name, output_name='score', download_path='./')
```
---

Once the file is downloaded, you can open it using your favorite tool. The following example loads the predictions using `Pandas` dataframe.

```python
import pandas as pd
import glob

output_files = glob.glob("named-outputs/score/*.parquet")
score = pd.concat((pd.read_parquet(f) for f in output_files))
```

The output looks as follows:

| age |	sex |	... |	thal       |	prediction |
|-----|------|-----|------------|--------------|
| 63  |	1   |	... |	fixed      |	0          |
| 67  |	1   |	... |	normal     |	1          |
| 67  |	1   |	... |	reversible |	0          |
| 37  |	1   |	... |	normal     |	0          |


## Next steps

* [Using batch deployments for image file processing](how-to-image-processing-batch.md)
* [Using batch deployments for NLP processing](how-to-nlp-processing-batch.md)
