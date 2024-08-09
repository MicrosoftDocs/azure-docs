---
title: Deploy MLflow models in batch deployments
titleSuffix: Azure Machine Learning
description: Learn how to deploy MLflow models in batch deployments with Azure Machine Learning, and test deployments, analyze outputs, and perform batch predictions.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.date: 08/09/2024
ms.reviewer: cacrest
ms.custom: update-code, devplatv2

#customer intent: As a developer, I want to use batch deployments for MLflow models in Azure Machine Learning, so I can test deployments and analyze outputs.
---

# Deploy MLflow models in batch deployments in Azure Machine Learning

[!INCLUDE [cli v2](includes/machine-learning-dev-v2.md)]

This article describes how to deploy [MLflow](https://www.mlflow.org) models to Azure Machine Learning for batch inference by using batch endpoints. When you deploy MLflow models to batch endpoints, Azure Machine Learning completes the following tasks:

- Provides an MLflow base image or curated environment that contains the required dependencies to run a Machine Learning batch job.
- Creates a batch job pipeline with a scoring script for you that can be used to process data by using parallelization.

For more information about the supported input file types and details about how MLflow model works, see [Considerations for deploying to batch inference](#review-considerations-for-batch-inference).

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](includes/azureml-batch-prereqs.md)]

## Explore the example

The example in this article shows how to deploy an MLflow model to a batch endpoint to perform batch predictions. The MLflow model is based on the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). The database contains 76 attributes, but the example uses only a subset of 14. The model tries to predict the presence of heart disease in a patient with an integer value from 0 (no presence) to 1 (presence).

The model is trained by using an `XGBBoost` classifier. All required preprocessing is packaged as a `scikit-learn` pipeline, which makes the model an end-to-end pipeline that goes from raw data to predictions.

[!INCLUDE [machine-learning-batch-clone](includes/azureml-batch-clone-samples.md)]

The files for this example are located in the following folder:

```azurecli
cd endpoints/batch/deploy-models/heart-classifier-mlflow
```

### Follow along in Jupyter Notebooks

You can follow along with this sample by using a public Jupyter Notebook. In the cloned repository, open the [mlflow-for-batch-tabular.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb) notebook.

## Deploy the MLflow model

In this section, you deploy an MLflow model to a batch endpoint so you can run batch inference over new data. Before you move forward with the deployment, you need to ensure your model is registered and there's an available compute cluster on the workspace.

### Register the model

Batch endpoints can only deploy registered models. In this article, you use a local copy of the model in the repository. As a result, you only need to publish the model to the registry in the workspace. 

> [!NOTE]
> If the model you're deploying is already registered, you can continue to the [Create compute cluster](#create-compute-cluster) section.
   
# [Azure CLI](#tab/cli)
   
Register the model by running the following command:

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="register_model" :::
   
# [Python](#tab/python)

Register the model with the following code:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=register_model)]

---

### Create compute cluster

You need to ensure the batch deployments can run on some available infrastructure (_compute_). Batch deployments can run on any Machine Learning compute that already exists in the workspace. Multiple batch deployments can share the same compute infrastructure.

In this article, you work on a Machine Learning compute cluster named **cpu-cluster**. The following example verifies a compute exists on the workspace or creates a new compute.
   
# [Azure CLI](#tab/cli)
   
Create a compute cluster:
   
:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_compute" :::
   
# [Python](#tab/python)
   
To create a new compute cluster where to create the deployment, use the following script:
   
[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_compute)]

---

### Create batch endpoint

To create an endpoint, you need a name and description. The endpoint name appears in the URI associated with your endpoint, so it needs to be unique within an Azure region. For example, there can be only one batch endpoint with the name `mybatchendpoint` in the WestUS2 region.

1. Place the name of the endpoint in a variable for easy reference later:

   # [Azure CLI](#tab/cli)
   
   Run the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="name_endpoint" :::
   
   # [Python](#tab/python)
   
   Run the following code:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=name_endpoint)]

   ---

1. Create the endpoint:
   
   # [Azure CLI](#tab/cli)
   
   1. To create a new endpoint, create a `YAML` configuration like the following code:

      __endpoint.yml__
   
      :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/endpoint.yml" :::
   
   1. Create the endpoint with the following command:
   
      :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_endpoint" :::
   
   # [Python](#tab/python)
   
   1. To create a new endpoint, use the following script:
   
      [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_endpoint)]
   
   1. Create the endpoint with the following command:
   
      [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_endpoint)]

   ---

### Create batch deployment

MLflow models don't require you to indicate an environment or scoring script when you create the deployment. The environment or scoring script is created for you automatically. However, you can specify the environment or scoring script if you want to customize how the deployment does inference.

# [Azure CLI](#tab/cli)
   
1. To create a new deployment under the created endpoint, create a `YAML` configuration as shown in the following code. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.

   __deployment-simple/deployment.yml__
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-simple/deployment.yml" :::
   
1. Create the deployment with the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_deployment" :::
   
# [Python](#tab/python)
   
1. Prepare a new deployment under the created endpoint by defining the deployment:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_deployment)]
   
1. Create the deployment with the following command:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_deployment)]
   
---
   
> [!IMPORTANT]
> Configure the `timeout` value in your deployment based on how long it takes for your model to run inference on a single batch. The larger the batch size, the longer the `timeout` value. Keep in mind that the `mini_batch_size` value indicates the number of files in a batch and not the number of samples. When you work with tabular data, each file can contain multiple rows, which increases the time it takes for the batch endpoint to process each file. In such cases, use highed `timeout` values to avoid timeout errors.

### Invoke the endpoint

Although you can invoke a specific deployment inside of an endpoint, it's common to invoke the endpoint itself and let the endpoint decide which deployment to use. This type of deployment is named the "default" deployment. This approach lets you change the default deployment, which enables you to change the model serving the deployment without changing the contract with the user invoking the endpoint.

Use the following instruction to update the default deployment:

# [Azure CLI](#tab/cli)
   
:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="set_default_deployment" :::
   
# [Python](#tab/python)
   
[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=set_default_deployment)]

---

The batch endpoint is now ready for use.

## Test the deployment

To test your endpoint, you use a sample of unlabeled data located in this repository that can be used with the model. Batch endpoints can only process data located in the cloud and accessible from the Machine Learning workspace. In this example, you upload the sample to a Machine Learning data store. You create a data asset that can be used to invoke the endpoint for scoring. Keep in mind that batch endpoints accept data that can be placed in various locations.

1. First, create the data asset. The data asset consists of a folder with multiple CSV files that we want to process in parallel using batch endpoints. You can skip this step is your data is already registered as a data asset or you want to use a different input type.

   # [Azure CLI](#tab/cli)
   
   1. Create a data asset definition in YAML:
   
      __heart-dataset-unlabeled.yml__
   
      :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/heart-dataset-unlabeled.yml" :::
   
   1. Create the data asset:
   
      :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_data_asset" :::
   
   # [Python](#tab/python)
   
   1. Create a data asset definition:
   
      [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_data_asset)]
   
   1. Create the data asset:
   
      [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_data_asset)]
   
   1. To see the changes, refresh the object:
   
      [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=get_data_asset)]

   ---
   
1. After you upload the data, invoke the endpoint:

   # [Azure CLI](#tab/cli)

   Run the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="start_batch_scoring_job" :::
   
   > [!NOTE]
   > The utility `jq` might not be installed on every installation. For installation instructions, see [Download jq](https://stedolan.github.io/jq/download/).
   
   # [Python](#tab/python)

   [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=start_batch_scoring_job)]
   
   ---
   
   > [!TIP]
   > Notice that the deployment name isn't indicated in the `invoke` operation. The endpoint automatically routes the job to the default deployment because the endpoint has one deployment only. You can target a specific deployment by indicating the argument/parameter `deployment_name`.

1. A batch job is started as soon as the command returns. You can monitor the status of the job until it finishes:

   # [Azure CLI](#tab/cli)

   Run the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="show_job_in_studio" :::
   
   # [Python](#tab/python)
   
   Run the following command:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=get_job)]
   
   ---

## Analyze outputs

Output predictions are generated in the _predictions.csv_ file, as indicated in the deployment configuration. The job generates an output named **score**, where this file is placed. Only one file is generated per batch job.

The file is structured as follows:

- One row per each data point sent to the model. For tabular data, the file _predictions.csv_ contains one row for every row present in each processed file. For other data types (images, audio, text), there's one row per each processed file.

- The following columns are in the file (in the specified order):

   - `row` (optional): The corresponding row index in the input data file. This column applies only if the input data is tabular. Predictions are returned in the same order they appear in the input file. You can rely on the row number to match the corresponding prediction.

   - `prediction`: The prediction associated with the input data. This value is returned "as-is," as it was provided by the model's `predict().` function. 

   - `file_name`: The name of the file name where the data is read. In tabular data, use this field to determine which prediction belongs to each input data.

You can download the results of the job by using the job name.

# [Azure CLI](#tab/cli)

To download the predictions, use the following command:

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="download_outputs" :::

# [Python](#tab/python)

To download the predictions, use the following code:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=download_outputs)]

---

After you download the file, you can open the file with your preferred editing tool. The following example loads the predictions by using a `Pandas` dataframe.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=read_outputs)]

The output displays a table:

| Row  | Prediction  | File |
| :---: | :---: | --- |
| 0   | 0   | heart-unlabeled-0.csv |
| 1   | 1   | heart-unlabeled-0.csv |
| 2   | 0   | heart-unlabeled-0.csv |
| ... | ... | ...                   |
| 307 | 0   | heart-unlabeled-3.csv |

> [!TIP]
> Notice that in this example the input data was tabular data in `CSV` format and there were 4 different input files (heart-unlabeled-0.csv, heart-unlabeled-1.csv, heart-unlabeled-2.csv and heart-unlabeled-3.csv).

## Review considerations for batch inference

Machine Learning supports deployment of MLflow models to batch endpoints without indicating a scoring script. This approach is a convenient way to deploy models that require processing large amounts of data similar to batch processing. Machine Learning uses information in the MLflow model specification to orchestrate the inference process.

### Explore distribution of work on workers

Batch Endpoints distribute work at the file level, for both structured and unstructured data. As a consequence, only [URI file](reference-yaml-data.md) and [URI folders](reference-yaml-data.md) are supported for this feature. Each worker processes batches of `Mini batch size` files at a time. For tabular data, batch endpoints don't take into account the number of rows inside of each file when distributing the work.

> [!WARNING]
> Nested folder structures aren't explored during inference. If you partition your data by using folders, be sure to flatten the structure before you proceed.

Batch deployments call the `predict` function of the MLflow model once per file. For CSV files with multiple rows, this action can impose a memory pressure in the underlying compute. The behavior can increase the time it takes for the model to score a single file, especially for expensive models like large language models. If you encounter several out-of-memory exceptions or time-out entries in logs, consider splitting the data in smaller files with less rows, or implement batching at the row level inside of the model scoring script.

### Review support for file types

The following data types are supported for batch inference when deploying MLflow models without an environment or scoring script. To process a different file type, or execute inference differently, you can create the deployment by [customizing MLflow model deployment with a scoring script](#customize-model-deployment-with-scoring-script).

| File extension | Type returned as model input | Signature requirement |
| --- | --- | --- |
| `.csv`, `.parquet`, `.pqt` | `pd.DataFrame` | `ColSpec`. If not provided, columns typing isn't enforced. |
| `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`, `.gif` | `np.ndarray` | `TensorSpec`. Input is reshaped to match tensors shape, if available. If no signature is available, tensors of type `np.uint8` are inferred. For more information, see [Considerations for MLflow models processing images](how-to-image-processing-batch.md#considerations-for-mlflow-models-processing-images). |

> [!WARNING]
> Any unsupported file that might be present in the input data causes the job to fail. In such cases, you see an error similar to _ERROR:azureml:Error processing input file: '/mnt/batch/tasks/.../a-given-file.avro'. File type 'avro' is not supported_.

### Understand signature enforcement for MLflow models

Batch deployment jobs enforce the input's data types while reading the data by using the available MLflow model signature. As a result, your data input complies with the types indicated in the model signature. If the data can't be parsed as expected, the job fails with an error similar to _ERROR:azureml:Error processing input file: '/mnt/batch/tasks/.../a-given-file.csv'. Exception: invalid literal for int() with base 10: 'value'_.

> [!TIP]
> Signatures in MLflow models are optional, but they're highly encouraged. They provide a convenient way for early detection of data compatibility issues. For more information about how to log models with signatures, see [Logging models with a custom signature, environment or samples](how-to-log-mlflow-models.md#logging-models-with-a-custom-signature-environment-or-samples).

You can inspect the model signature of your model by opening the `MLmodel` file associated with your MLflow model. For more information about how signatures work in MLflow, see [Signatures in MLflow](concept-mlflow-models.md#model-signature).

### Examine flavor support

Batch deployments support deploying MLflow models with a `pyfunc` flavor only. To deploy a different flavor, see [Customize model deployment with scoring script](#customize-model-deployment-with-scoring-script).

## Customize model deployment with scoring script

MLflow models can be deployed to batch endpoints without indicating a scoring script in the deployment definition. However, you can opt in to indicate this file (commonly referred to as the *batch driver*) to customize inference execution. 

You typically select this workflow for the following scenarios: 

- Process file types not supported by batch deployments of MLflow deployments.
- Customize how the model runs, such as using a specific flavor to load it with the `mlflow.<flavor>.load()` function.
- Complete pre- or post- processing in your scoring routine, when not completed by the model itself.
- Adjust presentation of model that doesn't present well with tabular data, such as a tensor graph that represents an image.
- Allow model to read data in chunks because it can't process each file at once due to memory constraints.

> [!IMPORTANT]
> To indicate a scoring script for an MLflow model deployment, you need to specify the environment where the deployment runs.

### Use the scoring script

Use the following steps to deploy an MLflow model with a custom scoring script:

1. Identify the folder where your MLflow model is placed.

   1. In the [Azure Machine Learning portal](https://ml.azure.com), browse to **Models**.

   1. Select the model to deploy, and then select the **Artifacts** tab.

   1. Take note of the displayed folder. This folder was indicated when the model was registered.

      :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-model-folder-name.png" border="false" alt-text="Screenshot that shows the folder where the model artifacts are placed.":::

1. Create a scoring script. Notice how the previous folder name `model` is included in the `init()` function.

   __deployment-custom/code/batch_driver.py__

   :::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-custom/code/batch_driver.py" :::

1. Create an environment where the scoring script can be executed. Because the model in this example is MLflow, the conda requirements are also specified in the model package. For more information about MLflow models and the included files, see [The MLmodel format](concept-mlflow-models.md#the-mlmodel-format).

   In this step, you build the environment by using the conda dependencies from the file. You also need to include the `azureml-core` package, which is required for Batch Deployments.

   > [!TIP]
   > If your model is already registered in the model registry, you can download and copy the `conda.yml` file associated with your model. The file is available in [Azure Machine Learning studio](https://ml.azure.com) under **Models** > **Select your model from the list** > **Artifacts**. In the root folder, select the `conda.yml` file, and then select **Download** or copy its content. 
   
   > [!IMPORTANT]
   > This example uses a conda environment specified at `/heart-classifier-mlflow/environment/conda.yaml`. This file was created by combining the original MLflow conda dependencies file and adding the `azureml-core` package. You can't use the `conda.yml` file directly from the model.

   # [Azure CLI](#tab/cli)
   
   The environment definition is included in the deployment definition itself as an anonymous environment. You see the following lines in the deployment:
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-custom/deployment.yml" range="7-10":::
   
   # [Python](#tab/python)
   
   Get a reference to the environment:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_environment_custom)]

   ---

1. Configure the deployment: 

   # [Azure CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration as shown in the following code snippet. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.

   __deployment-custom/deployment.yml__
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-custom/deployment.yml" :::
   
   # [Python](#tab/python)

   Run the following code:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=configure_deployment_custom)]

   ---

1. Create the deployment:

   # [Azure CLI](#tab/cli)

   Run the following code:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="create_deployment_non_default" :::
   
   # [Python](#tab/python)

   Run the following code:
   
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=create_deployment_custom)]
   
   ---

The batch endpoint is now ready for use. 

## Clean up resources

After you complete the exercise, delete resources that are no longer required.

# [Azure CLI](#tab/cli)

Run the following code to delete the batch endpoint and all underlying deployments:

::: code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deploy-and-run.sh" ID="delete_endpoint" :::

This command doesn't delete batch scoring jobs.

# [Python](#tab/python)

Run the following code to delete the batch endpoint and all underlying deployments:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/mlflow-for-batch-tabular.ipynb?name=delete_endpoint)]

This command doesn't delete batch scoring jobs.

---

## Related content

- [Review considerations for deploying to batch inference](#review-considerations-for-batch-inference)
- [Customize outputs in batch deployments](how-to-deploy-model-custom-output.md)
