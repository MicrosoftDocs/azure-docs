---
title: Deploy MLflow models
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model to the deployment targets supported by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.date: 06/06/2022
ms.topic: how-to
ms.custom: deploy, mlflow, devplatv2, no-code-deployment, devx-track-azurecli, cliv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Deploy MLflow models

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning CLI extension you are using:"]
> * [v1](./v1/how-to-deploy-mlflow-models.md)
> * [v2 (current version)](how-to-deploy-mlflow-models.md)

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to Azure ML for both real-time and batch inference. Azure ML supports no-code deployment of models created and logged with MLflow. This means that you don't have to provide a scoring script or an environment.

For no-code-deployment, Azure Machine Learning 

* Dynamically installs Python packages provided in the `conda.yaml` file, this means the dependencies are installed during container runtime.
* Provides a MLflow base image/curated environment that contains the following items:
    * [`azureml-inference-server-http`](how-to-inference-server-http.md) 
    * [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst)
    * The scoring script baked into the image.

> [!IMPORTANT]
> If you are used to deploying models using scoring scripts and custom environments and you are looking to know how to achieve the same functionality using MLflow models, we recommend reading [Using MLflow models for no-code deployment](how-to-log-mlflow-models.md).

> [!NOTE]
> For information about inputs format and limitation in online endpoints, view [Considerations when deploying to real-time inference](#considerations-when-deploying-to-real-time-inference). For more information about the supported file types in batch endpoints, view [Considerations when deploying to batch inference](#considerations-when-deploying-to-batch-inference).

## Deployment tools

There are three workflows for deploying MLflow models to Azure Machine Learning:

- [Deploy using the MLflow plugin](#deploy-using-the-mlflow-plugin)
- [Deploy using Azure ML CLI/SDK (v2)](#deploy-using-azure-ml-clisdk-v2)
- [Deploy using Azure Machine Learning studio](#deploy-using-azure-machine-learning-studio)

Each workflow has different capabilities, particularly around which type of compute they can target. The following table shows them:

| Scenario | MLflow SDK | Azure ML CLI/SDK v2 | Azure ML studio |
| :- | :-: | :-: | :-: |
| Deploy MLflow models to managed online endpoints | **&check;** | **&check;** | **&check;** |
| Deploy MLflow models to managed batch endpoints |  | **&check;** | **&check;** |
| Deploy MLflow models to ACI/AKS | **&check;** |  |  |
| Deploy MLflow models to ACI/AKS (with a scoring script) | | | **&check;**<sup>1</sup> |

> [!NOTE]
> - <sup>1</sup> No-code deployment is not supported when deploying to ACI/AKS from Azure ML studio. We recommend switching to our [managed online endpoints](concept-endpoints.md) instead.

### Which option to use?

If you are familiar with MLflow or your platform support MLflow natively (like Azure Databricks) and you wish to continue using the same set of methods, use the `azureml-mlflow` plugin. On the other hand, if you are more familiar with the [Azure ML CLI v2](concept-v2.md), you want to automate deployments using automation pipelines, or you want to keep deployments configuration in a git repository; we recommend you to use the [Azure ML CLI v2](concept-v2.md). If you want to quickly deploy and test models trained with MLflow, you can use [Azure Machine Learning studio](https://ml.azure.com) UI deployment.

## Deploy using the MLflow plugin 

The MLflow plugin [azureml-mlflow](https://pypi.org/project/azureml-mlflow/) can deploy models to Azure ML, either to Azure Kubernetes Service (AKS), Azure Container Instances (ACI) and Managed Endpoints for real-time serving.

> [!WARNING]
> Deploying to managed batch endpoints is not supported in the MLflow plugin at the moment.

### Prerequisites

* Install the `azureml-mlflow` package.
* If you are running outside an Azure ML compute, configure the MLflow tracking URI or MLflow's registry URI to point to the workspace you are working on. For more information about how to Set up tracking environment, see [Track runs using MLflow with Azure Machine Learning](how-to-use-mlflow-cli-runs.md#set-up-tracking-environment) for more details.

### Steps

1. Ensure your model is registered in Azure Machine Learning registry. Deployment of unregistered models is not supported in Azure Machine Learning. You can register a new model using the MLflow SDK:
   
   # [From a training job](#tab/fromjob)
   
   ```python
   mlflow.register_model(f"runs:/{run_id}/{artifact_path}", "sample-sklearn-mlflow-model")
   ```
   
   # [From a local model](#tab/fromlocal)
   
   ```python
   model_local_path = os.path.abspath("sklearn-diabetes/model")
   mlflow.register_model(f"file://{model_local_path}", "sample-sklearn-mlflow-model")
   ```

2. Deployments can be generated using both the Python SDK for MLflow or MLflow CLI. In both cases, a JSON configuration file can be indicated with the details of the deployment you want to achieve. If not indicated, then a default deployment is done using Azure Container Instances (ACI) and a minimal configuration. 
   
   # [Managed endpoints](#tab/mir)
   
   ```json
   {
       "instance_type": "Standard_DS2_v2",
       "instance_count": 1,
   }
   ```
   
   > [!NOTE]
   > The full specification of this configuration can be found at [Managed online deployment schema (v2)](reference-yaml-deployment-managed-online.md).
   
   # [AKS](#tab/aks)
   
    ```json
   {
     "computeType": "aks",
     "computeTargetName": "aks-mlflow"
   }
   ```

   > [!NOTE]
   > - In above exmaple, `aks-mlflow` is the name of an Azure Kubernetes Cluster registered/created in Azure Machine Learning.
   > - The full specification of this configuration for ACI file can be checked at [Deployment configuration schema](v1/reference-azure-machine-learning-cli.md#deployment-configuration-schema).
   
   # [ACI](#tab/aci)
   
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
   > - The full specification of this configuration for ACI file can be checked at [Deployment configuration schema](v1/reference-azure-machine-learning-cli.md#deployment-configuration-schema).
   
3. Save the deployment configuration to a file:
   
   # [Managed endpoints](#tab/mir)
   
   ```python
   import json

   deploy_config = {
      "instance_type": "Standard_DS2_v2",
      "instance_count": 1,
   }

   deployment_config_path = "deployment_config.json"
   with open(deployment_config_path, "w") as outfile:
      outfile.write(json.dumps(deploy_config))
   ```
   
   # [AKS](#tab/aks)
   
   ```python
   import json
   
   deploy_config = {"computeType": "aks", "computeTargetName": "aks-mlflow" }
   
   deployment_config_path = "deployment_config.json"
   with open(deployment_config_path, "w") as outfile:
      outfile.write(json.dumps(deploy_config))
   ```
   
   # [ACI](#tab/aci)
   
   ```python
   import json

   deploy_config = {"computeType": "aci"}
   
   deployment_config_path = "deployment_config.json"
   with open(deployment_config_path, "w") as outfile:
      outfile.write(json.dumps(deploy_config))
   ```
   
4. Create a deployment client using the Azure Machine Learning Tracking URI.

   ```python
   from mlflow.deployments import get_deploy_client
   
   # Set the tracking uri in the deployment client.
   client = get_deploy_client("<azureml-mlflow-tracking-url>")
   ```
   
5. Run the deployment

   ```python
   model_name = "mymodel"
   model_version = 1

   # define the model path and the name is the service name
   # if model is not registered, it gets registered automatically and a name is autogenerated using the "name" parameter below
   client.create_deployment(
      model_uri=f"models:/{model_name}/{model_version}",
      config={ "deploy-config-file": deployment_config_path },
      name="mymodel-deployment",
   )
   ```
   
## Deploy using Azure ML CLI/SDK (v2)

You can use Azure ML CLI/SDK v2 to deploy models trained and logged with MLflow to [managed endpoints (Online/batch)](concept-endpoints.md). Deployment of MLflow models support no-code-deployment, so you don't have to provide a scoring script or an environment, but you can if needed.

### Prerequisites

[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

* You must have a MLflow model. If your model is not in MLflow format and you want to use this feature, you can [convert your custom ML model to MLflow format](how-to-convert-custom-model-to-mlflow.md).  

### Steps

This example shows how you can deploy an MLflow model to an online endpoint using CLI (v2).

> [!IMPORTANT]
> For MLflow no-code-deployment, **[testing via local endpoints](how-to-deploy-managed-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.

1. Connect to Azure Machine Learning workspace

   # [Azure ML CLI (v2)](#tab/cli)
   
   ```bash
   az account set --subscription <subscription>
   az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
   ```
   
   # [Azure ML SDK for Python (v2)](#tab/sdk)
   
   The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which you'll perform deployment tasks.
   
   1. Import the required libraries:
   
   ```python
   from azure.ai.ml import MLClient
   from azure.ai.ml.entities import ManagedOnlineEndpoint, ManagedOnlineDeployment, Model
   from azure.ai.ml.constants import AssetType
   from azure.identity import DefaultAzureCredential
   ```
   
   2. Configure workspace details and get a handle to the workspace:
   
   ```python
   subscription_id = "<subscription>"
   resource_group = "<resource-group>"
   workspace = "<workspace>"
   
   ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
   ```
   

1. The following example configures the name and authentication mode of the endpoint:
   
   # [Azure ML CLI (v2)](#tab/cli)
   
   Create a YAML configuration file for your endpoint:
   
   __create-endpoint.yaml__

   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/mlflow/create-endpoint.yaml":::
   
   # [Azure ML SDK for Python (v2)](#tab/sdk)
   
   Create an endpoint using the SDK:
   
   ```python
   endpoint = ManagedOnlineEndpoint(
      name="my-endpoint", 
      description="this is a sample local endpoint",
      auth_mode="key"
   )
   ```

1. Execute the endpoint creation. This operation will create the endpoint in the Azure Machine Learning workspace:
   
   # [Azure ML CLI (v2)](#tab/cli)
   
   To create a new endpoint using the YAML configuration, use the following command:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_endpoint":::
   
   # [Azure ML SDK for Python (v2)](#tab/sdk)
   
   To create a new endpoint using the endpoint configuration just created, use the following command:
   
   ```python
   ml_client.online_endpoints.begin_create_or_update(endpoint)
   ```

1. Before going further, we need to register the model we want to deploy. Deployment of unregistered models is not supported in Azure Machine Learning. 
   
   # [Azure ML CLI (v2)](#tab/cli)
   
   We first need to register the model we want to deploy. Deployment of unregistered models is not supported in Azure Machine Learning.
   
   #### From a training job

   In this example, the model is registered from a job previously run. Assuming that your model was registered with an instruction similar like this:

   ```python
   mlflow.sklearn.log_model(scikit_model, "model")
   ```

   To register the model from a previous run we would need the job name/run ID in question. For simplicity, let's assume that we are looking to register the model trained in the last run submitted to the workspace:

   ```bash
   JOB_NAME=$(az ml job list --query "[0].name" | tr -d '"')
   ```

   Then, let's register the model in the registry. 

   ```bash
   az ml model create --name "mir-sample-sklearn-mlflow-model" \
                      --type "mlflow_model" \
                      --path "azureml://jobs/$JOB_NAME/outputs/artifacts/model"
   ```
      
   #### From a local model
   
   If your model is located in the local file system or compute, then you can register it as follows:
   
   ```bash
   az ml model create --name "mir-sample-sklearn-mlflow-model" \
                      --type "mlflow_model" \
                      --path "sklearn-diabetes/model"
   ```
      
   # [Azure ML SDK for Python (v2)](#tab/sdk)
   
   We first need to register the model we want to deploy. Deployment of unregistered models is not supported in Azure Machine Learning.
   
   #### From a training job

   In this example, the model is registered from a job previously run. Assuming that your model was registered with an instruction similar like this:

   ```python
   mlflow.sklearn.log_model(scikit_model, "model)
   ```

   To register the model from a previous run we would need the job name/run ID in question. For simplicity, let's assume that we are looking to register the model trained in the last run submitted to the workspace:

   ```python
   job_name = ml_client.jobs.list()[0].name
   ```

   Then, let's register the model in the registry.

   ```python
   model = Model(name="mir-sample-sklearn-mlflow-model", 
                 path=f"azureml://jobs/{job_name}/outputs/artifacts/model",
                 type=AssetType.MLFLOW_MODEL)
   ml_client.models.create_or_update(model)
   ```
      
   #### From a local model
   
   If your model is located in the local file system or compute, then you can register it as follows:

   ```
   model = Model(name="mir-sample-sklearn-mlflow-model",
                 path="sklearn-diabetes/model",
                 type=AssetType.MLFLOW_MODEL)
   ml_client.models.create_or_update(model)
   ```
      
1. Once the endpoint is created, we need to create a deployment on it. Remember that endpoints can contain one or multiple deployments and traffic can be configured for each of them. In this example, we are going to create only one deployment to serve all the traffic, named `sklearn-deployment`.

   # [Azure ML CLI (v2)](#tab/cli)

   Create the deployment `YAML` file:

   __sklearn-deployment.yaml__

   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
   name: sklearn-deployment
   endpoint_name: my-endpoint
   model: azureml:mir-sample-sklearn-mlflow-model@latest
   instance_type: Standard_DS2_v2
   instance_count: 1
   ```

   # [Azure ML SDK for Python (v2)](#tab/sdk)
      
   ```python
   blue_deployment = ManagedOnlineDeployment(
                         name="sklearn-deployment",
                         endpoint_name="my-endpoint",
                         model=model,
                         instance_type="Standard_F2s_v2",
                         instance_count=1,
                     )
   ```
         
    
1. Create the deployment and assign all the traffic to it.
   
   # [Azure ML CLI (v2)](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_sklearn_deployment":::
   
   # [Azure ML SDK for Python (v2)](#tab/sdk)
   
   ```python
   ml_client.begin_create_or_update(blue_deployment)
   endpoint.traffic = {"sklearn-deployment": 100}
   ml_client.begin_create_or_update(endpoint)
   ```
   
1. Once the deployment is completed, the service is ready to receive requests. If you are not sure about how to submit requests to the service, see [Creating requests](#creating-requests).
    
## Deploy using Azure Machine Learning studio

You can use [Azure Machine Learning studio](https://ml.azure.com) to deploy models to Managed Online Endpoints.

> [!IMPORTANT]
> Although deploying to ACI or AKS with [Azure Machine Learning studio](https://ml.azure.com) is possible, no-code deployment feature is not available for these compute targets. We recommend the use of [managed online endpoints](concept-endpoints.md) as it provides a superior set of features.

1. Ensure your model is registered in the Azure Machine Learning registry. Deployment of unregistered models is not supported in Azure Machine Learning. You can register models from files in the local file system or from the output of a job:

   # [From a training job](#tab/fromjob)
   
   You can register the model directly from the job's output using Azure Machine Learning studio. To do so, navigate to the **Outputs + logs** tab in the run where your model was trained and select the option **Create model**.
   
   :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" alt-text="Animated gif that demonstrates how to register a model directly from outputs.":::
   
   # [From a local model](#tab/fromlocal)
   
   You can use the option *From local files* in the Models section of your workspace to select the MLflow model from [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/mlflow/sklearn-diabetes/model](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/mlflow/sklearn-diabetes/model):
   
   :::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

2. From [studio](https://ml.azure.com), select your workspace and then use either the __endpoints__ page to create the endpoint deployment:

    a. From the __Endpoints__ page, Select **+Create**.

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    b. Provide a name and authentication type for the endpoint, and then select __Next__.

    c. When selecting a model, select the MLflow model registered previously. Select __Next__ to continue.

    d. When you select a model registered in MLflow format, in the Environment step of the wizard, you don't need a scoring script or an environment.

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" alt-text="Screenshot showing no code and environment needed for MLflow models.":::

    e. Complete the wizard to deploy the model to the endpoint.

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" alt-text="Screenshot showing NCD review screen.":::


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
> - <sup>1</sup> We suggest you to use split orientation instead. Records orientation doesn't guarante column ordering preservation.
> - <sup>2</sup> We suggest you to explore batch inference for processing files.

Regardless of the input type used, Azure Machine Learning requires inputs to be provided in a JSON payload, within a dictionary key `input_data`. Note that such key is not required when serving models using the command `mlflow models serve` and hence payloads can't be used interchangeably.

### Creating requests

Your inputs should be submitted inside a JSON payload containing a dictionary with key `input_data`.

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

### Limitations

The following limitations apply to real time inference deployments:

> [!NOTE]
> Consider the following limitations when deploying MLflow models to Azure Machine Learning:
> - Spark flavor is not supported at the moment for deployment.
> - Data type `mlflow.types.DataType.Binary` is not supported as column type in signatures. For models that work with images, we suggest you to use or (a) tensors inputs using the [TensorSpec input type](https://mlflow.org/docs/latest/python_api/mlflow.types.html#mlflow.types.TensorSpec), or (b) `Base64` encoding schemes with a `mlflow.types.DataType.String` column type, which is commonly used when there is a need to encode binary data that needs be stored and transferred over media.
> - Signatures with tensors with unspecified shapes (`-1`) is only supported at the batch size by the moment. For instance, a signature with shape `(-1, -1, -1, 3)` is not supported but `(-1, 300, 300, 3)` is.

## Considerations when deploying to batch inference

Azure Machine Learning supports no-code deployment for batch inference in [managed endpoints](concept-endpoints.md). This represents a convenient way to deploy models that require processing of big amounts of data in a batch-fashion.

### How work is distributed on workers

Work is distributed at the file level, for both structured and unstructured data. As a consequence, only [file datasets](v1/how-to-create-register-datasets.md#filedataset) or [URI folders](reference-yaml-data.md) are supported for this feature. Each worker processes batches of `Mini batch size` files at a time. Further parallelism can be achieved if `Max concurrency per instance` is increased. 

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

- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use online endpoints in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-managed-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [Use batch endpoints for batch scoring](batch-inference/how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with an online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot online endpoint deployment](how-to-troubleshoot-managed-online-endpoints.md)
