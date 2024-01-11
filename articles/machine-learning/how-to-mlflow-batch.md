---
title: Deploy MLflow models in batch deployments
titleSuffix: Azure Machine Learning
description: Learn how to deploy MLflow models in batch deployments
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

# Deploy MLflow models in batch deployments

[!INCLUDE [cli v2](includes/machine-learning-dev-v2.md)]

In this article, learn how to deploy [MLflow](https://www.mlflow.org) models to Azure Machine Learning for both batch inference using batch endpoints. When deploying MLflow models to batch endpoints, Azure Machine Learning:

* Provides a MLflow base image/curated environment that contains the required dependencies to run an Azure Machine Learning Batch job.
* Creates a batch job pipeline with a scoring script for you that can be used to process data using parallelization.

> [!NOTE]
> For more information about the supported input file types in model deployments with MLflow, view [Considerations when deploying to batch inference](#considerations-when-deploying-to-batch-inference).

## About this example

This example shows how you can deploy an MLflow model to a batch endpoint to perform batch predictions. This example uses an MLflow model based on the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). The database contains 76 attributes, but we are using a subset of 14 of them. The model tries to predict the presence of heart disease in a patient. It is integer valued from 0 (no presence) to 1 (presence).

The model has been trained using an `XGBBoost` classifier and all the required preprocessing has been packaged as a `scikit-learn` pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

[!INCLUDE [machine-learning-batch-clone](includes/azureml-batch-clone-samples.md)]

The files for this example are in:

```azurecli
cd endpoints/batch/deploy-models/heart-classifier-mlflow
```

### Follow along in Jupyter Notebooks

You can follow along this sample in the following notebooks. In the cloned repository, open the notebook: [mlflow-for-batch-tabular.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb).

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](includes/azureml-batch-prereqs.md)]

## Steps

Follow these steps to deploy an MLflow model to a batch endpoint for running batch inference over new data:

1. Batch Endpoint can only deploy registered models. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
    # [Azure CLI](#tab/cli)
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="register_model" :::
   
    # [Python](#tab/python)
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=register_model)]
   
1. Before moving any forward, we need to make sure the batch deployments we are about to create can run on some infrastructure (compute). Batch deployments can run on any Azure Machine Learning compute that already exists in the workspace. That means that multiple batch deployments can share the same compute infrastructure. In this example, we are going to work on an Azure Machine Learning compute cluster called `cpu-cluster`. Let's verify the compute exists on the workspace or create it otherwise.
   
    # [Azure CLI](#tab/cli)
   
    Create a compute cluster as follows:
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_compute" :::
   
    # [Python](#tab/python)
   
    To create a new compute cluster where to create the deployment, use the following script:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_compute)]

1. Now it is time to create the batch endpoint and deployment. Let's start with the endpoint first. Endpoints only require a name and a description to be created. The name of the endpoint will end-up in the URI associated with your endpoint. Because of that, __batch endpoint names need to be unique within an Azure region__. For example, there can be only one batch endpoint with the name `mybatchendpoint` in `westus2`.

    # [Azure CLI](#tab/cli)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="name_endpoint" :::
    
    # [Python](#tab/python)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=name_endpoint)]

1. Create the endpoint:
   
    # [Azure CLI](#tab/cli)
   
    To create a new endpoint, create a `YAML` configuration like the following:

    __endpoint.yml__
   
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/endpoint.yml" :::
   
    Then, create the endpoint with the following command:
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_endpoint" :::
   
    # [Python](#tab/python)
   
    To create a new endpoint, use the following script:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_endpoint)]
   
    Then, create the endpoint with the following command:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_endpoint)]

5. Now, let create the deployment. MLflow models don't require you to indicate an environment or a scoring script when creating the deployments as it is created for you. However, you can specify them if you want to customize how the deployment does inference.

    # [Azure CLI](#tab/cli)
   
    To create a new deployment under the created endpoint, create a `YAML` configuration like the following. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.

    __deployment-simple/deployment.yml__
   
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-simple/deployment.yml" :::
   
    Then, create the deployment with the following command:
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_deployment" :::
   
    # [Python](#tab/python)
   
    To create a new deployment under the created endpoint, first define the deployment:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_deployment)]
   
    Then, create the deployment with the following command:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_deployment)]
    
    ---
   
    > [!NOTE]
    > Batch deployments only support deploying MLflow models with a `pyfunc` flavor. To use a different flavor, see [Customizing MLflow models deployments with a scoring script](#customizing-mlflow-models-deployments-with-a-scoring-script)..

7. Although you can invoke a specific deployment inside of an endpoint, you will usually want to invoke the endpoint itself and let the endpoint decide which deployment to use. Such deployment is named the "default" deployment. This gives you the possibility of changing the default deployment and hence changing the model serving the deployment without changing the contract with the user invoking the endpoint. Use the following instruction to update the default deployment:

    # [Azure CLI](#tab/cli)
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="set_default_deployment" :::
   
    # [Python](#tab/python)
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=set_default_deployment)]

8. At this point, our batch endpoint is ready to be used. 

## Testing out the deployment

For testing our endpoint, we are going to use a sample of unlabeled data located in this repository and that can be used with the model. Batch endpoints can only process data that is located in the cloud and that is accessible from the Azure Machine Learning workspace. In this example, we are going to upload it to an Azure Machine Learning data store. Particularly, we are going to create a data asset that can be used to invoke the endpoint for scoring. However, notice that batch endpoints accept data that can be placed in various locations.

1. Let's create the data asset first. This data asset consists of a folder with multiple CSV files that we want to process in parallel using batch endpoints. You can skip this step is your data is already registered as a data asset or you want to use a different input type.

    # [Azure CLI](#tab/cli)
   
    a. Create a data asset definition in `YAML`:
   
    __heart-dataset-unlabeled.yml__
   
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/heart-dataset-unlabeled.yml" :::
   
    b. Create the data asset:
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_data_asset" :::
   
    # [Python](#tab/python)
   
    a. Create a data asset definition:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_data_asset)]
   
    b. Create the data asset:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_data_asset)]
   
    c. Refresh the object to reflect the changes:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=get_data_asset)]
   
2. Now that the data is uploaded and ready to be used, let's invoke the endpoint:

    # [Azure CLI](#tab/cli)
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="start_batch_scoring_job" :::
   
    > [!NOTE]
    > The utility `jq` may not be installed on every installation. You can get installation instructions in [this link](https://stedolan.github.io/jq/download/).
   
    # [Python](#tab/python)

    > [!TIP]
    > [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=start_batch_scoring_job)]
    
    ---
   
    > [!TIP]
    > Notice how we are not indicating the deployment name in the invoke operation. That's because the endpoint automatically routes the job to the default deployment. Since our endpoint only has one deployment, then that one is the default one. You can target an specific deployment by indicating the argument/parameter `deployment_name`.

3. A batch job is started as soon as the command returns. You can monitor the status of the job until it finishes:

    # [Azure CLI](#tab/cli)
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="show_job_in_studio" :::
   
    # [Python](#tab/python)
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=get_job)]
   
## Analyzing the outputs

Output predictions are generated in the `predictions.csv` file as indicated in the deployment configuration. The job generates a named output called `score` where this file is placed. Only one file is generated per batch job.

The file is structured as follows:

* There is one row per each data point that was sent to the model. For tabular data, this means that one row is generated for each row in the input files and hence the number of rows in the generated file (`predictions.csv`) equals the sum of all the rows in all the processed files. For other data types, there is one row per each processed file.

* Two columns are indicated:

    * The file name where the data was read from. In tabular data, use this field to know which prediction belongs to which input data. For any given file, predictions are returned in the same order they appear in the input file so you can rely on the row number to match the corresponding prediction.
    * The prediction associated with the input data. This value is returned "as-is" it was provided by the model's `predict().` function. 


You can download the results of the job by using the job name:

# [Azure CLI](#tab/cli)

To download the predictions, use the following command:

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="download_outputs" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=download_outputs)]
---

Once the file is downloaded, you can open it using your favorite tool. The following example loads the predictions using `Pandas` dataframe.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=read_outputs)]

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

Azure Machine Learning supports no-code deployment for batch inference in [managed endpoints](concept-endpoints.md). This represents a convenient way to deploy models that require processing of big amounts of data in a batch-fashion.

### How work is distributed on workers

Work is distributed at the file level, for both structured and unstructured data. As a consequence, only [file datasets (v1 API)](v1/how-to-create-register-datasets.md#filedataset) or [URI folders](reference-yaml-data.md) are supported for this feature. Each worker processes batches of `Mini batch size` files at a time. Further parallelism can be achieved if `Max concurrency per instance` is increased. 

> [!WARNING]
> Nested folder structures are not explored during inference. If you are partitioning your data using folders, make sure to flatten the structure beforehand.

Batch deployments will call the `predict` function of the MLflow model once per file. For CSV files containing multiple rows, this may impose a memory pressure in the underlying compute. When sizing your compute, take into account not only the memory consumption of the data being read but also the memory footprint of the model itself. This is specially true for models that processes text, like transformer-based models where the memory consumption is not linear with the size of the input. If you encounter several out-of-memory exceptions, consider splitting the data in smaller files with less rows or implement batching at the row level inside of the model/scoring script.

### File's types support

The following data types are supported for batch inference when deploying MLflow models without an environment and a scoring script. If you like to process a different file type, or execute inference in a different way that batch endpoints do by default you can always create the deployment with a scoring script as explained in [Using MLflow models with a scoring script](#customizing-mlflow-models-deployments-with-a-scoring-script).

| File extension | Type returned as model's input | Signature requirement |
| :- | :- | :- |
| `.csv`, `.parquet`, `.pqt` | `pd.DataFrame` | `ColSpec`. If not provided, columns typing is not enforced. |
| `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`, `.gif` | `np.ndarray` | `TensorSpec`. Input is reshaped to match tensors shape if available. If no signature is available, tensors of type `np.uint8` are inferred. For additional guidance read [Considerations for MLflow models processing images](how-to-image-processing-batch.md#considerations-for-mlflow-models-processing-images). |

> [!WARNING]
> Be advised that any unsupported file that may be present in the input data will make the job to fail. You will see an error entry as follows: *"ERROR:azureml:Error processing input file: '/mnt/batch/tasks/.../a-given-file.avro'. File type 'avro' is not supported."*.

### Signature enforcement for MLflow models

Input's data types are enforced by batch deployment jobs while reading the data using the available MLflow model signature. This means that your data input should comply with the types indicated in the model signature. If the data can't be parsed as expected, the job will fail with an error message similar to the following one: *"ERROR:azureml:Error processing input file: '/mnt/batch/tasks/.../a-given-file.csv'. Exception: invalid literal for int() with base 10: 'value'"*.

> [!TIP]
> Signatures in MLflow models are optional but they are highly encouraged as they provide a convenient way to early detect data compatibility issues. For more information about how to log models with signatures read [Logging models with a custom signature, environment or samples](how-to-log-mlflow-models.md#logging-models-with-a-custom-signature-environment-or-samples).

You can inspect the model signature of your model by opening the `MLmodel` file associated with your MLflow model. For more details about how signatures work in MLflow see [Signatures in MLflow](concept-mlflow-models.md#model-signature).

### Flavor support

Batch deployments only support deploying MLflow models with a `pyfunc` flavor. If you need to deploy a different flavor, see [Using MLflow models with a scoring script](#customizing-mlflow-models-deployments-with-a-scoring-script).

## Customizing MLflow models deployments with a scoring script

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

1. Identify the folder where your MLflow model is placed.

    a. Go to [Azure Machine Learning portal](https://ml.azure.com).

    b. Go to the section __Models__.

    c. Select the model you are trying to deploy and click on the tab __Artifacts__.

    d. Take note of the folder that is displayed. This folder was indicated when the model was registered.

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-model-folder-name.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-model-folder-name.png" alt-text="Screenshot showing the folder where the model artifacts are placed.":::

1. Create a scoring script. Notice how the folder name `model` you identified before has been included in the `init()` function.

   __deployment-custom/code/batch_driver.py__

   :::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-custom/code/batch_driver.py" :::

1. Let's create an environment where the scoring script can be executed. Since our model is MLflow, the conda requirements are also specified in the model package (for more details about MLflow models and the files included on it see [The MLmodel format](concept-mlflow-models.md#the-mlmodel-format)). We are going then to build the environment using the conda dependencies from the file. However, __we need also to include__ the package `azureml-core` which is required for Batch Deployments.

    > [!TIP]
    > If your model is already registered in the model registry, you can download/copy the `conda.yml` file associated with your model by going to [Azure Machine Learning studio](https://ml.azure.com) > Models > Select your model from the list > Artifacts. Open the root folder in the navigation and select the `conda.yml` file listed. Click on Download or copy its content. 
   
    > [!IMPORTANT]
    > This example uses a conda environment specified at `/heart-classifier-mlflow/environment/conda.yaml`. This file was created by combining the original MLflow conda dependencies file and adding the package `azureml-core`. __You can't use the `conda.yml` file from the model directly__.

    # [Azure CLI](#tab/cli)
   
    The environment definition will be included in the deployment definition itself as an anonymous environment. You'll see in the following lines in the deployment:
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-custom/deployment.yml" range="7-10":::
   
    # [Python](#tab/python)
   
    Let's get a reference to the environment:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_environment_custom)]

1. Configure the deployment: 

    # [Azure CLI](#tab/cli)
   
    To create a new deployment under the created endpoint, create a `YAML` configuration like the following. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.

    __deployment-custom/deployment.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-custom/deployment.yml" :::
   
    # [Python](#tab/python)
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_deployment_custom)]

1. Let's create the deployment now:

    # [Azure CLI](#tab/cli)
   
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_deployment_non_default" :::
   
    # [Python](#tab/python)
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_deployment_custom)]
   
1. At this point, our batch endpoint is ready to be used. 

## Clean up resources

# [Azure CLI](#tab/cli)

Run the following code to delete the batch endpoint and all the underlying deployments. Batch scoring jobs won't be deleted.

::: code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

Run the following code to delete the batch endpoint and all the underlying deployments. Batch scoring jobs won't be deleted.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=delete_endpoint)]

---

## Next steps

* [Customize outputs in batch deployments](how-to-deploy-model-custom-output.md)
