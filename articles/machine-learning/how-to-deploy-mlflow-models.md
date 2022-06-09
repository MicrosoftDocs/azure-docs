---
title: Deploy MLflow models
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model to the deployment targets supported by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: fasantia
author: santiagxf
ms.date: 06/06/2022
ms.topic: how-to
ms.custom: deploy, mlflow, devplatv2, no-code-deployment, devx-track-azurecli, cliv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Deploy MLflow models

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]


> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning CLI extension you are using:"]
> * [v1](./v1/how-to-deploy-mlflow-models.md)
> * [v2 (current version)](how-to-deploy-mlflow-models-online-endpoints.md)

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to Azure ML for both real-time and batch inference. Azure ML supports no-code deployment of models created and logged with MLflow. This means that you don't have to provide a scoring script or an environment. Those models can be deployed to ACI (Azure Container Instances), AKS (Azure Kubernetes Services) or our managed inference services (usually referred as MIR).

For no-code-deployment, Azure Machine Learning 

* Dynamically installs Python packages provided in the `conda.yaml` file, this means the dependencies are installed during container runtime.
    * The base container image/curated environment used for dynamic installation is `mcr.microsoft.com/azureml/mlflow-ubuntu18.04-py37-cpu-inference` or `AzureML-mlflow-ubuntu18.04-py37-cpu-inference`
* Provides a MLflow base image/curated environment that contains the following items:
    * [`azureml-inference-server-http`](how-to-inference-server-http.md) 
    * [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst)
    * `pandas`
    * The scoring script baked into the image.

## Supported targets for MLflow models:

The following table shows the target support for MLflow models in Azure ML:


| Scenario | Azure Container Instance | Azure Kubernetes | Managed Inference |
| :- | :-: | :-: | :-: |
| Deploying models logged with MLflow to real time inference | **&check;**<sup>1</sup> | **&check;**<sup>1</sup> | **&check;**<sup>1</sup> |
| Deploying models logged with MLflow to batch inference | <sup>2</sup> | <sup>2</sup> | **&check;** |
| Deploying models with ColSpec signatures | **&check;**<sup>4</sup> | **&check;**<sup>4</sup> | **&check;**<sup>4</sup> |
| Deploying models with TensorSpec signatures | **&check;** | **&check;** | **&check;** |
| Run models logged with MLflow in you local compute with Azure ML CLI v2 | **&check;** | **&check;** | <sup>3</sup> |
| Debug online endpoints locally in Visual Studio Code (preview) |  |  |  |

> [!NOTE]
> - <sup>1</sup> Spark flavor is not supported at the moment.
> - <sup>2</sup> We suggest you to use Azure Machine Learning Pipelines with Parallel Run Step.
> - <sup>3</sup> For deploying MLflow models locally, use the command `mlflow models serve -m <MODEL_NAME>`. Configure the environment variable `MLFLOW_TRACKING_URI` with the URL of your tracking server.
> - <sup>4</sup> Data type `mlflow.types.DataType.Binary` is not supported as column type. For models that works with images, we suggest you to use or (a) tensors inputs using the [TensorSpec input type](https://mlflow.org/docs/latest/python_api/mlflow.types.html#mlflow.types.TensorSpec), or (b) `Base64` encoding schemes with a `mlflow.types.DataType.String` column type, which is commonly used when there is a need to encode binary data that needs be stored and transferred over media.

## Options

There are three workflows for deploying models to Azure ML:

- [Deploy using the MLflow plugin](#Deploy-using-the-MLflow-plugin)
- [Deploy using CLI (v2)](#Deploy-using-CLI-(v2))
- [Deploy using Azure Machine Learning Studioo](#Deploy-using-Azure-Machine-Learning-Studio)

### Which option to use?

If you are familiar with MLflow or your platform support MLflow natively (like Azure Databricks) and you wish to continue using the same set of methods, use the `azureml-mlflow` plugin. If, on the other hand, you are more familiar with the Azure ML CLI, you want to automate deployments using CI/CD pipelines, or you want to keep deployments configuration in a git repository, we recommend you to use the Azure ML CLI v2. If you want to quickly test models 

## Deploy using the MLflow plugin 

The MLflow plugin [azureml-mlflow](https://pypi.org/project/azureml-mlflow/) can deploy models to Azure ML, either to Azure Kubernetes Service (AKS), Azure Container Instances (ACI) and Managed Inference Service (MIR) for real-time serving.

> [!WARNING]
> Deploying to Managed Inference Service - Batch endpoints is not supported in the MLflow plugin at the moment.

### Prerequisites

* Install the `azureml-mlflow` package.
* If you are running outside an Azure ML compute, configure the MLflow tracking URI or MLflow's registry URI to point to the workspace you are working on. See [MLflow Tracking URI to connect with Azure Machine Learning)[https://docs.microsoft.com/en-us/azure/machine-learning/how-to-use-mlflow] for more details.

### Deploying models to ACI or AKS

Deployments can be generated using both the Python API for MLflow or MLflow CLI. In both cases, a JSON configuration file can be indicated with the details of the deployment you want to achieve. If not indicated, then a default deployment is done using Azure Container Instances (ACI) and a minimal configuration. The full specification of this configuration for ACI and AKS file can be checked at [Deployment configuration schema](https://docs.microsoft.com/en-us/azure/machine-learning/reference-azure-machine-learning-cli#deployment-configuration-schema).

#### Configuration example for ACI deployment

```json
{
  "computeType": "aci",
  "containerResourceRequirements":
  {
    "cpu": 1,
    "memoryInGB": 1
  },
  "location": "eastus2",
}
```

> [!NOTE]
> - If `containerResourceRequirements` is not indicated, a deployment with minimal compute configuration is applied (cpu: 0.1 and memory: 0.5).
> - If `location` is not indicated, it defaults to the location of the workspace.

#### Configuration example for an AKS deployment

```json
{
  "computeType": "aks",
  "computeTargetName": "aks-mlflow"
}
```

> [!NOTE]
> - In above exmaple, `aks-mlflow` is the name of an Azure Kubernetes Cluster registered/created in Azure Machine Learning.

#### Running the deployment

The following sample creates a deployment using an ACI:

  ```python
  import json
  from mlflow.deployments import get_deploy_client

  # Create the deployment configuration.
  # If no deployment configuration is provided, then the deployment happens on ACI.
  deploy_config = {"computeType": "aci"}

  # Write the deployment configuration into a file.
  deployment_config_path = "deployment_config.json"
  with open(deployment_config_path, "w") as outfile:
      outfile.write(json.dumps(deploy_config))

  # Set the tracking uri in the deployment client.
  client = get_deploy_client("<azureml-mlflow-tracking-url>")

  # MLflow requires the deployment configuration to be passed as a dictionary.
  config = {"deploy-config-file": deployment_config_path}
  model_name = "mymodel"
  model_version = 1

  # define the model path and the name is the service name
  # if model is not registered, it gets registered automatically and a name is autogenerated using the "name" parameter below
  client.create_deployment(
      model_uri=f"models:/{model_name}/{model_version}",
      config=config,
      name="mymodel-aci-deployment",
  )
  ```

### Deploying models to Managed Inference

Deployments can be generated using both the Python API for MLflow or MLflow CLI. In both cases, a JSON configuration file needs to be indicated with the details of the deployment you want to achieve. The full specification of this configuration can be found at [Managed online deployment schema (v2)](https://docs.microsoft.com/en-us/azure/machine-learning/reference-yaml-deployment-managed-online).

#### Configuration example for an Managed Inference Service deployment (real time)

```json
{
    "instance_type": "Standard_DS2_v2",
    "instance_count": 1,
}
```

#### Running the deployment

The following sample deploys a model to a real time Managed Inference Endpoint:

  ```python
  import json
  from mlflow.deployments import get_deploy_client

  # Create the deployment configuration.
  deploy_config = {
      "instance_type": "Standard_DS2_v2",
      "instance_count": 1,
  }

  # Write the deployment configuration into a file.
  deployment_config_path = "deployment_config.json"
  with open(deployment_config_path, "w") as outfile:
      outfile.write(json.dumps(deploy_config))

  # Set the tracking uri in the deployment client.
  client = get_deploy_client("<azureml-mlflow-tracking-url>")

  # MLflow requires the deployment configuration to be passed as a dictionary.
  config = {"deploy-config-file": deployment_config_path}
  model_name = "mymodel"
  model_version = 1

  # define the model path and the name is the service name
  # if model is not registered, it gets registered automatically and a name is autogenerated using the "name" parameter below
  client.create_deployment(
      model_uri=f"models:/{model_name}/{model_version}",
      config=config,
      name="mymodel-mir-deployment",
  )
  ```

## Deploy using CLI (v2)

You can use Azure ML CLI v2 to deploy models trained and logged with MLflow to Managed Inference. When you deploy your MLflow model using the Azure ML CLI v2, it's a no-code-deployment so you don't have to provide a scoring script or an environment, but you can if needed.

### Prerequisites

[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

* You must have a MLflow model. The examples in this article are based on the models from [https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow](https://github.com/Azure/azureml-examples/blob/main/notebooks/using-mlflow/).

    * If you don't have an MLflow formatted model, you can [convert your custom ML model to MLflow format](how-to-convert-custom-model-to-mlflow.md).  

[!INCLUDE [clone repo & set defaults](../../includes/machine-learning-cli-prepare.md)]

In this code snippets used in this article, the `ENDPOINT_NAME` environment variable contains the name of the endpoint to create and use. To set this, use the following command from the CLI. Replace `<YOUR_ENDPOINT_NAME>` with the name of your endpoint:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="set_endpoint_name":::

### Steps

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

This example shows how you can deploy an MLflow model to an online endpoint using CLI (v2).

> [!IMPORTANT]
> For MLflow no-code-deployment, **[testing via local endpoints](how-to-deploy-managed-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.

1. Create a YAML configuration file for your endpoint. The following example configures the name and authentication mode of the endpoint:

    __create-endpoint.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/mlflow/create-endpoint.yaml":::

1. To create a new endpoint using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_endpoint":::

1. Create a YAML configuration file for the deployment. The following example configures a deployment of the `sklearn-diabetes` model to the endpoint created in the previous step:

    > [!IMPORTANT]
    > For MLflow no-code-deployment (NCD) to work, setting **`type`** to **`mlflow_model`** is required, `type: mlflow_model​`. For more information, see [CLI (v2) model YAML schema](reference-yaml-model.md).

    __sklearn-deployment.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/mlflow/sklearn-deployment.yaml":::

1. To create the deployment using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_sklearn_deployment":::
    
## Deploy using Azure Machine Learning Studio

This example shows how you can deploy an MLflow model to an online endpoint using [Azure Machine Learning studio](https://ml.azure.com).

1. From [studio](https://ml.azure.com), select your workspace and then use the __models__ page to create a new model in the registry. You can use the option *From local files* to select the MLflow model from [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/mlflow/sklearn-diabetes/model](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/mlflow/sklearn-diabetes/model):

   :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/register-model-ui.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/register-model-ui.png" alt-text="Screenshot showing create option on the Models UI page.":::

2. From [studio](https://ml.azure.com), select your workspace and then use either the __endpoints__ or __models__ page to create the endpoint deployment:

    # [Endpoints page](#tab/endpoint)

    1. From the __Endpoints__ page, Select **+Create**.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    1. Provide a name and authentication type for the endpoint, and then select __Next__.
    1. When selecting a model, select the MLflow model registered previously. Select __Next__ to continue.

    1. When you select a model registered in MLflow format, in the Environment step of the wizard, you don't need a scoring script or an environment.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" alt-text="Screenshot showing no code and environment needed for MLflow models":::

    1. Complete the wizard to deploy the model to the endpoint.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" alt-text="Screenshot showing NCD review screen":::

    # [Models page](#tab/models)

    1. Select the MLflow model, and then select __Deploy__. When prompted, select __Deploy to real-time endpoint (preview)__.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" alt-text="Screenshot showing how to deploy model from Models UI":::

    1. Complete the wizard to deploy the model to the endpoint.

    ---

### Deploy models after a training job

This section helps you understand how to deploy models to an online endpoint once you have completed your [training job](how-to-train-cli.md).

1. Download the outputs from the training job. The outputs contain the model folder. 

    > [!NOTE]
    > If you have used `mlflow.autolog()` in your training script, you will see model artifacts in the job's run history. Azure Machine Learning integrates with MLflow's tracking functionality. You can use `mlflow.autolog()` for several common ML frameworks to log model parameters, performance metrics, model artifacts, and even feature importance graphs.
    >
    > For more information, see [Train models with CLI](how-to-train-cli.md#model-tracking-with-mlflow). Also see the [training job samples](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step) in the GitHub repository.

    # [Azure Machine Learning studio](#tab/studio)

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/download-output-logs.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/download-output-logs.png" alt-text="Screenshot showing how to download Outputs and logs from Experimentation run":::

    # [CLI](#tab/cli)

    ```azurecli
    az ml job download -n $run_id --outputs
    ```

2. To deploy using the downloaded files, you can use either studio or the Azure command-line interface. Use the model folder from the outputs for deployment:

    * [Deploy using Azure Machine Learning studio](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-azure-machine-learning-studio).
    * [Deploy using Azure Machine Learning CLI (v2)](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-cli-v2).

## Considerations when deploying to real time inference

The following input's types are supported in Azure ML when deploying models with no-code deployment. Take a look at *Notes* in the bottom of the table for additional considerations.

| Input type | Support in MLflow models (serve) | Support in Azure ML|
| :- | :-: | :-: |
| JSON-serialized pandas DataFrames in the split orientation | **&check;** | **&check;** |
| JSON-serialized pandas DataFrames in the records orientation | **&check;** | <sup>1</sup> |
| CSV-serialized pandas DataFrames | **&check;** | <sup>2</sup> |
| Tensor input format as JSON-serialized lists (tensors) and dictionary of lists (named tensors) |  | **&check;** |
| Tensor input formatted as in TF Serving’s API | **&check;** |  |

> [!NOTE]
> <sup>1</sup> We suggest you to use split orientation instead. Records orientation doesn't guarante column ordering preservation.
> <sup>2</sup> We suggest you to explore batch inference for processing files.

### Creating requests

Your inputs should be submitted inside the a JSON payload containing a dictionary with key `input_data`.

#### Payload example for a JSON-serialized pandas DataFrames in the split orientation

```json
{
    "input_data": {
        "columns": [
            "age", "sex", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ],
        "index": [1],
        "data": [
            [1, 1, 145, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
        ]
    }
}
```

#### Payload example for a tensor input

```json
{
    "input_data": [
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2],
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2],
          [1, 1, 145, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
    ]
}
```

#### Payload example for a named-tensor input

```json
{
    "input_data": {
        "tokens": [
          [0, 655, 85, 5, 23, 84, 23, 52, 856, 5, 23, 1]
        ],
        "mask": [
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
        ]
    }
}
```

## Considerations when deploying to batch inference

Azure ML supports no-code deployment for batch inference in Managed Inference service. This represents a convenient way to deploy models that require processing of big amounts of data in a batch-fashion.

### How work is distributed on workers

Work is distributed at the file level, for both structured and unstructured data. As a consequence, only [file datasets](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-create-register-datasets#filedataset) or [URI folders](https://docs.microsoft.com/en-us/azure/machine-learning/reference-yaml-data) are supported for this feature. Each worker processes batches of `Mini batch size` files at a time. Further parallelism can be achieved if `Max concurrency per instance` is increased. 

> [!WARNING]
> Nested folder structures are not explored during inference. If you are partitioning your data using folders, make sure to flatten the structure beforehand.

### File's types support

The following data types are supported for batch inference.

| File extension | Type returned as model's input | Signature requirement |
| :- | :- | :- |
| `.csv` | `pd.DataFrame` | `ColSpec`. If not provided, columns typing is not enforced. |
| `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`, `.gif` | `np.ndarray` | `TensorSpec`. Input is reshaped to match tensors shape if available. If no signature is available, tensors of type `np.uint8` are inferred. |


## Next steps

To learn more, review these articles:

- [Deploy models with REST (preview)](how-to-deploy-with-rest.md)
- [Create and use online endpoints (preview) in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [Use batch endpoints (preview) for batch scoring](how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with an online endpoint and managed identity (preview)](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot online endpoint deployment](how-to-troubleshoot-managed-online-endpoints.md)
