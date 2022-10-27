---
title: "Using MLflow models in batch deployments"
titleSuffix: Azure Machine Learning
description: Learn how to deploy MLflow models in batch deployments
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: larryfr
ms.custom: devplatv2
---

# Use MLflow models in batch deployments

[!INCLUDE [cli v2](../../../includes/machine-learning-dev-v2.md)]

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to Azure ML for both batch inference using batch endpoints. Azure Machine Learning supports no-code deployment of models created and logged with MLflow. This means that you don't have to provide a scoring script or an environment.

For no-code-deployment, Azure Machine Learning 

* Provides a MLflow base image/curated environment that contains the required dependencies to run an Azure Machine Learning Batch job.
* Creates a batch job pipeline with a scoring script for you that can be used to process data using parallelization.

> [!NOTE]
> For more information about the supported file types in batch endpoints with MLflow, view [Considerations when deploying to batch inference](#considerations-when-deploying-to-batch-inference).

## Prerequisites

[!INCLUDE [basic cli prereqs](../../../includes/machine-learning-cli-prereqs.md)]

* You must have a MLflow model. If your model is not in MLflow format and you want to use this feature, you can [convert your custom ML model to MLflow format](../how-to-convert-custom-model-to-mlflow.md).

## About this example

This example shows how you can deploy an MLflow model to a batch endpoint to perform batch predictions. This example uses an MLflow model based on the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). The database contains 76 attributes, but we are using a subset of 14 of them. The model tries to predict the presence of heart disease in a patient. It is integer valued from 0 (no presence) to 1 (presence).

The model has been trained using an `XGBBoost` classifier and all the required preprocessing has been packaged as a `scikit-learn` pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

[!INCLUDE [clone repo & set defaults](../../../includes/machine-learning-cli-prepare.md)]

### Follow along in Jupyter Notebooks

You can follow along this sample in the following notebooks. In the cloned repository, open the notebook: [mlflow-for-batch-tabular.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/mlflow-for-batch-tabular.ipynb).

## Steps

Follow these steps to deploy an MLflow model to a batch endpoint for running batch inference over new data:

1. First, let's connect to Azure Machine Learning workspace where we are going to work on.

   # [Azure ML CLI](#tab/cli)
   
   ```bash
   az account set --subscription <subscription>
   az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which you'll perform deployment tasks.
   
   1. Import the required libraries:
   
   ```python
   from azure.ai.ml import MLClient, Input
   from azure.ai.ml.entities import BatchEndpoint, BatchDeployment, Model, AmlCompute, Data, BatchRetrySettings
   from azure.ai.ml.constants import AssetTypes, BatchDeploymentOutputAction
   from azure.identity import DefaultAzureCredential
   ```
   
   2. Configure workspace details and get a handle to the workspace:
   
   ```python
   subscription_id = "<subscription>"
   resource_group = "<resource-group>"
   workspace = "<workspace>"
   
   ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
   ```
   

2. Batch Endpoint can only deploy registered models. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
   # [Azure ML CLI](#tab/cli)
   
   ```bash
   MODEL_NAME='heart-classifier'
   az ml model create --name $MODEL_NAME --type "mlflow_model" --path "heart-classifier-mlflow/model"
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   model_name = 'heart-classifier'
   model_local_path = "heart-classifier-mlflow/model"
   model = ml_client.models.create_or_update(
        Model(name=model_name, path=model_local_path, type=AssetTypes.MLFLOW_MODEL)
   )
   ```
   
3. Before moving any forward, we need to make sure the batch deployments we are about to create can run on some infrastructure (compute). Batch deployments can run on any Azure ML compute that already exists in the workspace. That means that multiple batch deployments can share the same compute infrastructure. In this example, we are going to work on an AzureML compute cluster called `cpu-cluster`. Let's verify the compute exists on the workspace or create it otherwise.
   
   # [Azure ML CLI](#tab/cli)
   
   Create a compute definition `YAML` like the following one:
   
   __cpu-cluster.yml__
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/amlCompute.schema.json 
   name: cluster-cpu
   type: amlcompute
   size: STANDARD_DS3_v2
   min_instances: 0
   max_instances: 2
   idle_time_before_scale_down: 120
   ```
   
   Create the compute using the following command:
   
   ```bash
   az ml compute create -f cpu-cluster.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   To create a new compute cluster where to create the deployment, use the following script:
   
   ```python
   compute_name = "cpu-cluster"
   if not any(filter(lambda m : m.name == compute_name, ml_client.compute.list())):
       compute_cluster = AmlCompute(name=compute_name, description="amlcompute", min_instances=0, max_instances=2)
       ml_client.begin_create_or_update(compute_cluster)
   ```

4. Now it is time to create the batch endpoint and deployment. Let's start with the endpoint first. Endpoints only require a name and a description to be created:
   
   # [Azure ML CLI](#tab/cli)
   
   To create a new endpoint, create a `YAML` configuration like the following:
   
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/batchEndpoint.schema.json
   name: heart-classifier-batch
   description: A heart condition classifier for batch inference
   auth_mode: aad_token
   ```
   
   Then, create the endpoint with the following command:
   
   ```bash
   ENDPOINT_NAME='heart-classifier-batch'
   az ml batch-endpoint create -f endpoint.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   To create a new endpoint, use the following script:
   
   ```python
   endpoint = BatchEndpoint(
      name="heart-classifier-batch", 
      description="A heart condition classifier for batch inference",
   )
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

5. Now, let create the deployment. MLflow models don't require you to indicate an environment or a scoring script when creating the deployments as it is created for you. However, you can specify them if you want to customize how the deployment does inference.

   # [Azure ML CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following:
   
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json
   endpoint_name: heart-classifier-batch
   name: classifier-xgboost-mlflow
   description: A heart condition classifier based on XGBoost
   model: azureml:heart-classifier@latest
   compute: azureml:cpu-cluster
   resources:
     instance_count: 2
   max_concurrency_per_instance: 2
   mini_batch_size: 2
   output_action: append_row
   output_file_name: predictions.csv
   retry_settings:
     max_retries: 3
     timeout: 300
   error_threshold: -1
   logging_level: info
   ```
   
   Then, create the deployment with the following command:
   
   ```bash
   DEPLOYMENT_NAME="classifier-xgboost-mlflow"
   az ml batch-endpoint create -f endpoint.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   To create a new deployment under the created endpoint, use the following script:
   
   ```python
   deployment = BatchDeployment(
       name="classifier-xgboost-mlflow",
       description="A heart condition classifier based on XGBoost",
       endpoint_name=endpoint.name,
       model=model,
       compute=compute_name,
       instance_count=2,
       max_concurrency_per_instance=2,
       mini_batch_size=2,
       output_action=BatchDeploymentOutputAction.APPEND_ROW,
       output_file_name="predictions.csv",
       retry_settings=BatchRetrySettings(max_retries=3, timeout=300),
       logging_level="info",
   )
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```
   ---
   
   > [!NOTE]
   > `scoring_script` and `environment` auto generation only supports `pyfunc` model flavor. To use a different flavor, see [Using MLflow models with a scoring script](#using-mlflow-models-with-a-scoring-script).

6. Although you can invoke a specific deployment inside of an endpoint, you will usually want to invoke the endpoint itself and let the endpoint decide which deployment to use. Such deployment is named the "default" deployment. This gives you the possibility of changing the default deployment and hence changing the model serving the deployment without changing the contract with the user invoking the endpoint. Use the following instruction to update the default deployment:

   # [Azure ML CLI](#tab/cli)
   
   ```bash
   az ml batch-endpoint update --name $ENDPOINT_NAME --set defaults.deployment_name=$DEPLOYMENT_NAME
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   endpoint.defaults.deployment_name = deployment.name
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

7. At this point, our batch endpoint is ready to be used. 

## Testing out the deployment

For testing our endpoint, we are going to use a sample of unlabeled data located in this repository and that can be used with the model. Batch endpoints can only process data that is located in the cloud and that is accessible from the Azure Machine Learning workspace. In this example, we are going to upload it to an Azure Machine Learning data store. Particularly, we are going to create a data asset that can be used to invoke the endpoint for scoring. However, notice that batch endpoints accept data that can be placed in multiple type of locations.

1. Let's create the data asset first. This data asset consists of a folder with multiple CSV files that we want to process in parallel using batch endpoints. You can skip this step is your data is already registered as a data asset or you want to use a different input type.

   # [Azure ML CLI](#tab/cli)
   
   Create a data asset definition in `YAML`:
   
   __heart-dataset-unlabeled.yml__
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
   name: heart-dataset-unlabeled
   description: An unlabeled dataset for heart classification.
   type: uri_folder
   path: heart-classifier-mlflow/data
   ```
   
   Then, create the data asset:
   
   ```bash
   az ml data create -f heart-dataset-unlabeled.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   data_path = "heart-classifier-mlflow/data"
   dataset_name = "heart-dataset-unlabeled"

   heart_dataset_unlabeled = Data(
       path=data_path,
       type=AssetTypes.URI_FOLDER,
       description="An unlabeled dataset for heart classification",
       name=dataset_name,
   )
   ml_client.data.create_or_update(heart_dataset_unlabeled)
   ```
   
2. Now that the data is uploaded and ready to be used, let's invoke the endpoint:

   # [Azure ML CLI](#tab/cli)
   
   ```bash
   JOB_NAME = $(az ml batch-endpoint invoke --name $ENDPOINT_NAME --input azureml:heart-dataset-unlabeled@latest | jq -r '.name') 
   ```
   
   > [!NOTE]
   > The utility `jq` may not be installed on every installation. You can get installation instructions in [this link](https://stedolan.github.io/jq/download/).
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   input = Input(type=AssetTypes.URI_FOLDER, path=heart_dataset_unlabeled.id)
   job = ml_client.batch_endpoints.invoke(
      endpoint_name=endpoint.name,
      input=input,
   )
   ```
   ---
   
   > [!TIP]
   > Notice how we are not indicating the deployment name in the invoke operation. That's because the endpoint automatically routes the job to the default deployment. Since our endpoint only has one deployment, then that one is the default one. You can target an specific deployment by indicating the argument/parameter `deployment_name`.

3. A batch job is started as soon as the command returns. You can monitor the status of the job until it finishes:

   # [Azure ML CLI](#tab/cli)
   
   ```bash
   az ml job show --name $JOB_NAME
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   ml_client.jobs.get(job.name)
   ```
   
## Analyzing the outputs

Output predictions are generated in the `predictions.csv` file as indicated in the deployment configuration. The job generates a named output called `score` where this file is placed. Only one file is generated per batch job.

The file is structured as follows:

* There is one row per each data point that was sent to the model. For tabular data, this means that one row is generated for each row in the input files and hence the number of rows in the generated file (`predictions.csv`) equals the sum of all the rows in all the processed files. For other data types, there is one row per each processed file.
* Two columns are indicated:
   * The file name where the data was read from. In tabular data, use this field to know which prediction belongs to which input data. For any given file, predictions are returned in the same order they appear in the input file so you can rely on the row number to match the corresponding prediction.
   * The prediction associated with the input data. This value is returned "as-is" it was provided by the model's `predict().` function. 


You can download the results of the job by using the job name:

# [Azure ML CLI](#tab/cli)

To download the predictions, use the following command:

```bash
az ml job download --name $JOB_NAME --output-name score --download-path ./
```

# [Azure ML SDK for Python](#tab/sdk)

```python
ml_client.jobs.download(name=job.name, output_name='score', download_path='./')
```
---

Once the file is downloaded, you can open it using your favorite tool. The following example loads the predictions using `Pandas` dataframe.

```python
import pandas as pd
from ast import literal_eval

with open('named-outputs/score/predictions.csv', 'r') as f:
   pd.DataFrame(literal_eval(f.read().replace('\n', ',')), columns=['file', 'prediction'])
```

> [!WARNING]
> The file `predictions.csv` may not be a regular CSV file and can't be read correctly using `pandas.read_csv()` method.

The output looks as follows:

| file                       | prediction  |
| -------------------------- | ----------- |
| heart-unlabeled-0.csv      | 0           |
| heart-unlabeled-0.csv      | 1           |
| ...                        | 1           |
| heart-unlabeled-3.csv      | 0           |

> [!TIP]
> Notice that in this example the input data was tabular data in `CSV` format and there were 4 different input files (heart-unlabeled-0.csv, heart-unlabeled-1.csv, heart-unlabeled-2.csv and heart-unlabeled-3.csv).

## Considerations when deploying to batch inference

Azure Machine Learning supports no-code deployment for batch inference in [managed endpoints](../concept-endpoints.md). This represents a convenient way to deploy models that require processing of big amounts of data in a batch-fashion.

### How work is distributed on workers

Work is distributed at the file level, for both structured and unstructured data. As a consequence, only [file datasets](../v1/how-to-create-register-datasets.md#filedataset) or [URI folders](../reference-yaml-data.md) are supported for this feature. Each worker processes batches of `Mini batch size` files at a time. Further parallelism can be achieved if `Max concurrency per instance` is increased. 

> [!WARNING]
> Nested folder structures are not explored during inference. If you are partitioning your data using folders, make sure to flatten the structure beforehand.

> [!WARNING]
> Batch deployments will call the `predict` function of the MLflow model once per file. For CSV files containing multiple rows, this may impose a memory pressure in the underlying compute. When sizing your compute, take into account not only the memory consumption of the data being read but also the memory footprint of the model itself. This is specially true for models that processes text, like transformer-based models where the memory consumption is not linear with the size of the input. If you encouter several out-of-memory exceptions, consider splitting the data in smaller files with less rows or implement batching at the row level inside of the model/scoring script.

### File's types support

The following data types are supported for batch inference when deploying MLflow models without an environment and a scoring script:

| File extension | Type returned as model's input | Signature requirement |
| :- | :- | :- |
| `.csv` | `pd.DataFrame` | `ColSpec`. If not provided, columns typing is not enforced. |
| `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`, `.gif` | `np.ndarray` | `TensorSpec`. Input is reshaped to match tensors shape if available. If no signature is available, tensors of type `np.uint8` are inferred. For additional guidance read [Considerations for MLflow models processing images](how-to-image-processing-batch.md#considerations-for-mlflow-models-processing-images). |

> [!WARNING]
> Be advised that any unsupported file that may be present in the input data will make the job to fail. You will see an error entry as follows: *"ERROR:azureml:Error processing input file: '/mnt/batch/tasks/.../a-given-file.parquet'. File type 'parquet' is not supported."*.

> [!TIP]
> If you like to process a different file type, or execute inference in a different way that batch endpoints do by default you can always create the deploymnet with a scoring script as explained in [Using MLflow models with a scoring script](#using-mlflow-models-with-a-scoring-script).

### Signature enforcement for MLflow models

Input's data types are enforced by batch deployment jobs while reading the data using the available MLflow model signature. This means that your data input should comply with the types indicated in the model signature. If the data can't be parsed as expected, the job will fail with an error message similar to the following one: *"ERROR:azureml:Error processing input file: '/mnt/batch/tasks/.../a-given-file.csv'. Exception: invalid literal for int() with base 10: 'value'"*.

> [!TIP]
> Signatures in MLflow models are optional but they are highly encouraged as they provide a convenient way to early detect data compatibility issues. For more information about how to log models with signatures read [Logging models with a custom signature, environment or samples](../how-to-log-mlflow-models.md#logging-models-with-a-custom-signature-environment-or-samples).

You can inspect the model signature of your model by opening the `MLmodel` file associated with your MLflow model. For more details about how signatures work in MLflow see [Signatures in MLflow](../concept-mlflow-models.md#signatures).

### Flavor support

Batch deployments only support deploying MLflow models with a `pyfunc` flavor. If you need to deploy a different flavor, see [Using MLflow models with a scoring script](#using-mlflow-models-with-a-scoring-script).

## Using MLflow models with a scoring script

MLflow models can be deployed to batch endpoints without indicating a scoring script in the deployment definition. However, you can opt in to indicate this file (usually referred as the *batch driver*) to customize how inference is executed. 

You will typically select this workflow when: 
> [!div class="checklist"]
> * You need to process a file type not supported by batch deployments MLflow deployments.
> * You need to customize the way the model is run, for instance, use an specific flavor to load it with `mlflow.<flavor>.load()`.
> * You need to do pre/pos processing in your scoring routine when it is not done by the model itself.
> * The output of the model can't be nicely represented in tabular data. For instance, it is a tensor representing an image.
> * You model can't process each file at once because of memory constrains and it needs to read it in chunks.

> [!IMPORTANT]
> If you choose to indicate an scoring script for an MLflow model deployment, you will also have to specify the environment where the deployment will run.

### Steps

Use the following steps to deploy an MLflow model with a custom scoring script.

1. Create a scoring script:

   __batch_driver.py__

   ```python
   import os
   import mlflow
   import pandas as pd

   def init():
       global model

       # AZUREML_MODEL_DIR is an environment variable created during deployment
       # It is the path to the model folder
       model_path = os.path.join(os.environ["AZUREML_MODEL_DIR"], "model")
       model = mlflow.pyfunc.load(model_path)

   def run(mini_batch):
       results = pd.DataFrame(columns=['file', 'predictions'])

       for file_path in mini_batch:        
           data = pd.read_csv(file_path)
           pred = model.predict(data)

           df = pd.DataFrame(pred, columns=['predictions'])
           df['file'] = os.path.basename(file_path)
           results = pd.concat([results, df])

       return results
   ```

1. Let's create an environment where the scoring script can be executed:

   # [Azure ML CLI](#tab/cli)
   
   No extra step is required for the Azure ML CLI. The environment definition will be included in the deployment file.
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   Let's get a reference to the environment:
   
   ```python
   environment = Environment(
       conda_file="./heart-classifier-mlflow/environment/conda.yaml",
       image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest",
   )
   ```

1. Let's create the deployment now:

   # [Azure ML CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following:
   
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json
   endpoint_name: heart-classifier-batch
   name: classifier-xgboost-custom
   description: A heart condition classifier based on XGBoost
   model: azureml:heart-classifier@latest
   environment:
      image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest
      conda_file: ./heart-classifier-mlflow/environment/conda.yaml
   code_configuration:
     code: ./heart-classifier-custom/code/
     scoring_script: batch_driver.py
   compute: azureml:cpu-cluster
   resources:
     instance_count: 2
   max_concurrency_per_instance: 2
   mini_batch_size: 2
   output_action: append_row
   output_file_name: predictions.csv
   retry_settings:
     max_retries: 3
     timeout: 300
   error_threshold: -1
   logging_level: info
   ```
   
   Then, create the deployment with the following command:
   
   ```bash
   az ml batch-endpoint create -f endpoint.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   To create a new deployment under the created endpoint, use the following script:
   
   ```python
   deployment = BatchDeployment(
       name="classifier-xgboost-custom",
       description="A heart condition classifier based on XGBoost",
       endpoint_name=endpoint.name,
       model=model,
       environment=environment,
       code_configuration=CodeConfiguration(
           code="./heart-classifier-mlflow/code/",
           scoring_script="batch_driver.py",
       ),
       compute=compute_name,
       instance_count=2,
       max_concurrency_per_instance=2,
       mini_batch_size=2,
       output_action=BatchDeploymentOutputAction.APPEND_ROW,
       output_file_name="predictions.csv",
       retry_settings=BatchRetrySettings(max_retries=3, timeout=300),
       logging_level="info",
   )
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```
   ---
   
1. At this point, our batch endpoint is ready to be used. 

## Next steps

* [Customize outputs in batch deployments](how-to-deploy-model-custom-output.md)
