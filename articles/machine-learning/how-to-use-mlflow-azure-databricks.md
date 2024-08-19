---
title: MLflow tracking for Azure Databricks ML experiments
titleSuffix: Azure Machine Learning
description: Set up MLflow with Azure Machine Learning to log metrics and artifacts from Azure Databricks ML experiments.
services: machine-learning
author: msakande
ms.author: mopeakande
ms.service: azure-machine-learning
ms.subservice: core
ms.reviewer: fasantia
ms.date: 08/16/2024
ms.topic: how-to
ms.custom: sdkv2
#customer intent: As a data scientist, I want to integrate Azure Databricks with Azure Machine Learning to connect the products.
---

# Track Azure Databricks ML experiments with MLflow and Azure Machine Learning

[MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. You can use MLflow to integrate Azure Databricks with Azure Machine Learning to ensure you get the best from both of the products.

In this article, you learn:

> [!div class="checklist"]
> - The required libraries needed to use MLflow with Azure Databricks and Azure Machine Learning.
> - How to [track Azure Databricks runs with MLflow in Azure Machine Learning](#track-azure-databricks-runs-with-mlflow).
> - How to [log models with MLflow](#registering-models-in-the-registry-with-mlflow) to get them registered in Azure Machine Learning.
> - How to [deploy and consume models registered in Azure Machine Learning](#deploying-and-consuming-models-registered-in-azure-machine-learning).

## Prerequisites

- The `azureml-mlflow` package, which handles the connectivity with Azure Machine Learning, including authentication.
- An [Azure Databricks workspace and cluster](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal).
- An [Azure Machine Learning Workspace](quickstart-create-resources.md).

See which [access permissions](how-to-assign-roles.md#mlflow-operations) you need to perform your MLflow operations with your workspace.

### Example notebooks

The [Training models in Azure Databricks and deploying them on Azure Machine Learning](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/track_with_databricks_deploy_aml.ipynb) repository demonstrates how to train models in Azure Databricks and deploy them in Azure Machine Learning. It also describes how to track the experiments and models with the MLflow instance in Azure Databricks. It describes how to use Azure Machine Learning for deployment.

## Install libraries

To install libraries on your cluster:

1. Navigate to the **Libraries** tab and select **Install New**.

   :::image type="content" source="./media/how-to-use-mlflow-azure-databricks/azure-databricks-cluster-libraries.png" alt-text="mlflow with azure databricks":::

1. In the **Package** field, type *azureml-mlflow* and then select **Install**. Repeat this step as necessary to install other packages to your cluster for your experiment.

   :::image type="content" source="./media/how-to-use-mlflow-azure-databricks/install-libraries.png" alt-text="Azure DB install mlflow library":::

## Track Azure Databricks runs with MLflow

You can configure Azure Databricks to track experiments using MLflow in two ways:

- [Track in both Azure Databricks workspace and Azure Machine Learning workspace (dual-tracking)](#dual-tracking-on-azure-databricks-and-azure-machine-learning)
- [Track exclusively on Azure Machine Learning](#tracking-exclusively-on-azure-machine-learning-workspace)

By default, when you link your Azure Databricks workspace, dual-tracking is configured for you.

### Dual-tracking on Azure Databricks and Azure Machine Learning

Linking your Azure Databricks workspace to your Azure Machine Learning workspace enables you to track your experiment data in the Azure Machine Learning workspace and Azure Databricks workspace at the same time. This configuration is called *Dual-tracking*.

Dual-tracking in a [private link enabled Azure Machine Learning workspace](how-to-configure-private-link.md) isn't currently supported. Configure [exclusive tracking with your Azure Machine Learning workspace](#tracking-exclusively-on-azure-machine-learning-workspace) instead.

Dual-tracking isn't currently supported in Microsoft Azure operated by 21Vianet. Configure [exclusive tracking with your Azure Machine Learning workspace](#tracking-exclusively-on-azure-machine-learning-workspace) instead.

To link your Azure Databricks workspace to a new or existing Azure Machine Learning workspace:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Databricks workspace **Overview** page.
1. Select **Link Azure Machine Learning workspace**.

   :::image type="content" source="./media/how-to-use-mlflow-azure-databricks/link-workspaces.png" lightbox="./media/how-to-use-mlflow-azure-databricks/link-workspaces.png" alt-text="Screenshot shows the Link Azure Databricks and Azure Machine Learning workspaces option.":::

After you link your Azure Databricks workspace with your Azure Machine Learning workspace, MLflow tracking is automatically tracked in the following places:

- The linked Azure Machine Learning workspace.
- Your original Azure Databricks workspace.

You can use then MLflow in Azure Databricks in the same way that you're used to. The following example sets the experiment name as usual in Azure Databricks and start logging some parameters.

```python
import mlflow 

experimentName = "/Users/{user_name}/{experiment_folder}/{experiment_name}" 
mlflow.set_experiment(experimentName) 

with mlflow.start_run():
   mlflow.log_param('epochs', 20)
   pass
```

> [!NOTE]
> As opposed to tracking, model registries don't support registering models at the same time on both Azure Machine Learning and Azure Databricks. For more information, see [Registering models in the registry with MLflow](#registering-models-in-the-registry-with-mlflow).

### Tracking exclusively on Azure Machine Learning workspace

If you prefer to manage your tracked experiments in a centralized location, you can set MLflow tracking to *only* track in your Azure Machine Learning workspace. This configuration has the advantage of enabling easier path to deployment using Azure Machine Learning deployment options.

> [!WARNING]
> For [private link enabled Azure Machine Learning workspace](how-to-configure-private-link.md), you have to [deploy Azure Databricks in your own network (VNet injection)](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject) to ensure proper connectivity.

Configure the MLflow tracking URI to point exclusively to Azure Machine Learning, as shown in the following example:

#### Configure tracking URI

1. Get the tracking URI for your workspace.

   # [Azure CLI](#tab/cli)

   [!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

   1. Sign in and configure your workspace.

      ```bash
      az account set --subscription <subscription>
      az configure --defaults workspace=<workspace> group=<resource-group> location=<location> 
      ```

   1. You can get the tracking URI using the `az ml workspace` command.

      ```bash
      az ml workspace show --query mlflow_tracking_uri
      ```

   # [Python](#tab/python)

   [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

   You can get the Azure Machine Learning MLflow tracking URI using the [Azure Machine Learning SDK v2 for Python](concept-v2.md). Ensure you have the library `azure-ai-ml` installed in the compute that you're using. The following sample gets the unique MLFLow tracking URI associated with your workspace.

   1. Sign in into your workspace using the `MLClient`. The easier way to do that is by using the workspace config file.

      ```python
      from azure.ai.ml import MLClient
      from azure.identity import DefaultAzureCredential

      ml_client = MLClient.from_config(credential=DefaultAzureCredential())
      ```

      > [!TIP]
      > To download the workspace configuration file:
      >
      > 1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
      > 1. Select the upper-right corner of the page > **Download config file**.
      > 1. Save the file `config.json` in the same directory where you are working.

      Alternatively, you can use the subscription ID, resource group name, and workspace name to get it.

      ```python
      from azure.ai.ml import MLClient
      from azure.identity import DefaultAzureCredential

      #Enter details of your Azure Machine Learning workspace
      subscription_id = '<SUBSCRIPTION_ID>'
      resource_group = '<RESOURCE_GROUP>'
      workspace_name = '<WORKSPACE_NAME>'

      ml_client = MLClient(credential=DefaultAzureCredential(),
                              subscription_id=subscription_id, 
                              resource_group_name=resource_group)
      ```

      > [!IMPORTANT]
      > `DefaultAzureCredential` tries to pull the credentials from the available context. If you want to specify credentials in a different way, for instance using the web browser in an interactive way, you can use `InteractiveBrowserCredential` or any other method available in [`azure.identity`](https://pypi.org/project/azure-identity/) package.

   1. Get the Azure Machine Learning Tracking URI.

      ```python
      mlflow_tracking_uri = ml_client.workspaces.get(ml_client.workspace_name).mlflow_tracking_uri
      ```

   # [Studio](#tab/studio)

   Use the Azure Machine Learning portal to get the tracking URI.

   1. Open the [Azure Machine Learning studio portal](https://ml.azure.com) and sign in using your credentials.
   1. Select the name of your workspace to show the **Directory + Subscription + Workspace** page.
   1. Select **View all properties in Azure Portal**.
   1. On the **Essentials** section, find the property **MLflow tracking URI**.

   # [Manually](#tab/manual)

   You can construct the Azure Machine Learning Tracking URI using the subscription ID, region of where the resource is deployed, resource group name, and workspace name. The following code sample shows how.

   > [!WARNING]
   > If you're working in a private link-enabled workspace, the MLflow endpoint also uses a private link to communicate with Azure Machine Learning. Consequently, the tracking URI looks different than shown here. You need to get the tracking URI using the Azure Machine Learning SDK or CLI v2 on those cases.

   ```python
   region = "<LOCATION>"
   subscription_id = '<SUBSCRIPTION_ID>'
   resource_group = '<RESOURCE_GROUP>'
   workspace_name = '<AML_WORKSPACE_NAME>'

   mlflow_tracking_uri = f"azureml://{region}.api.azureml.ms/mlflow/v1.0/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.MachineLearningServices/workspaces/{workspace_name}"
   ```

1. Configure the tracking URI.

   # [Use MLflow SDK](#tab/mlflow)

   The method [`set_tracking_uri()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.set_tracking_uri) points the MLflow tracking URI to that URI.

   ```python
   import mlflow

   mlflow.set_tracking_uri(mlflow_tracking_uri)
   ```

   # [Use environment variables](#tab/environ)

   You can set the MLflow environment variables [MLFLOW_TRACKING_URI](https://mlflow.org/docs/latest/tracking.html#logging-to-a-tracking-server) in your compute to make any interaction with MLflow in the compute to point by default to Azure Machine Learning.

   ```bash
   MLFLOW_TRACKING_URI=$(az ml workspace show --query mlflow_tracking_uri | sed 's/"//g') 
   ```

   ---

> [!TIP]
> When working with shared environments, like an Azure Databricks cluster, Azure Synapse Analytics cluster, or similar, you can set the environment variable `MLFLOW_TRACKING_URI` at the cluster level. This approach allows you to automatically configure the MLflow tracking URI to point to Azure Machine Learning for all the sessions that run in the cluster rather than to do it on a per-session basis.
>
> :::image type="content" source="./media/how-to-use-mlflow-azure-databricks/env.png" alt-text="Screenshot shows Acvanced options where you can configure the environment variables in an Azure Databricks cluster.":::
>
> After you configure the environment variable, any experiment running in such cluster is tracked in Azure Machine Learning.

#### Configure authentication

After you configure tracking, configure how to authenticate to the associated workspace. By default, the Azure Machine Learning plugin for MLflow opens a browser to interactively prompt for credentials. For other ways to configure authentication for MLflow in Azure Machine Learning workspaces, see [Configure MLflow for Azure Machine Learning: Configure authentication](how-to-use-mlflow-configure-tracking.md#configure-authentication).

[!INCLUDE [configure-mlflow-auth](includes/machine-learning-mlflow-configure-auth.md)]

#### Experiment names in Azure Machine Learning

When you configure MLflow to exclusively track experiments in Azure Machine Learning workspace, the experiment naming convention has to follow the one used by Azure Machine Learning. In Azure Databricks, experiments are named with the path to where the experiment is saved, for instance `/Users/alice@contoso.com/iris-classifier`. However, in Azure Machine Learning, you provide the experiment name directly. The same experiment would be named `iris-classifier` directly.

```python
mlflow.set_experiment(experiment_name="experiment-name")
```

#### Tracking parameters, metrics and artifacts

After this configuration, you can use MLflow in Azure Databricks in the same way as you're used to. For more information, see [Log & view metrics and log files](how-to-log-view-metrics.md).

## Logging models with MLflow

After your model is trained, you can log it to the tracking server with the `mlflow.<model_flavor>.log_model()` method. `<model_flavor>` refers to the framework associated with the model. [Learn what model flavors are supported](https://mlflow.org/docs/latest/models.html#model-api).

In the following example, a model created with the Spark library MLLib is being registered.

```python
mlflow.spark.log_model(model, artifact_path = "model")
```

The flavor `spark` doesn't correspond to the fact that you're training a model in a Spark cluster. Instead, it follows from the training framework used. You can train a model using TensorFlow with Spark. The flavor to use would be `tensorflow`.

Models are logged inside of the run being tracked. That fact means that models are available in either both Azure Databricks and Azure Machine Learning (default) or exclusively in Azure Machine Learning if you configured the tracking URI to point to it.

> [!IMPORTANT]
> The parameter `registered_model_name` has not been specified. For more information about this parameter and the registry, see [Registering models in the registry with MLflow](#registering-models-in-the-registry-with-mlflow).

## Registering models in the registry with MLflow

As opposed to tracking, model registries can't operate at the same time in Azure Databricks and Azure Machine Learning. They have to use either one or the other. By default, model registries use the Azure Databricks workspace. If you choose to [set MLflow tracking to only track in your Azure Machine Learning workspace](#tracking-exclusively-on-azure-machine-learning-workspace), the model registry is the Azure Machine Learning workspace.

If you use the default configuration, the following code logs a model inside the corresponding runs of both Azure Databricks and Azure Machine Learning, but it registers it only on Azure Databricks.

```python
mlflow.spark.log_model(model, artifact_path = "model", 
                       registered_model_name = 'model_name')  
```

- If a registered model with the name doesn’t exist, the method registers a new model, creates version 1, and returns a `ModelVersion` MLflow object.
- If a registered model with the name already exists, the method creates a new model version and returns the version object.

### Using Azure Machine Learning Registry with MLflow

If you want to use Azure Machine Learning Model Registry instead of Azure Databricks, we recommend that you [set MLflow tracking to only track in your Azure Machine Learning workspace](#tracking-exclusively-on-azure-machine-learning-workspace). This approach removes the ambiguity of where models are being registered and simplifies the configuration.

If you want to continue using the dual-tracking capabilities but register models in Azure Machine Learning, you can instruct MLflow to use Azure Machine Learning for model registries by configuring the MLflow Model Registry URI. This URI has the same format and value that the MLflow that tracks URI.

```python
mlflow.set_registry_uri(azureml_mlflow_uri)
```

> [!NOTE]
> The value of `azureml_mlflow_uri` was obtained in the same way as described in [Set MLflow tracking to only track in your Azure Machine Learning workspace](#tracking-exclusively-on-azure-machine-learning-workspace).

For a complete example of this scenario, see [Training models in Azure Databricks and deploying them on Azure Machine Learning](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/track_with_databricks_deploy_aml.ipynb).

## Deploying and consuming models registered in Azure Machine Learning

Models registered in Azure Machine Learning Service using MLflow can be consumed as:

- An Azure Machine Learning endpoint (real-time and batch). This deployment allows you to use Azure Machine Learning deployment capabilities for both real-time and batch inference in Azure Container Instances, Azure Kubernetes, or Managed Inference Endpoints.
- MLFlow model objects or Pandas user-defined functions (UDFs), which can be used in Azure Databricks notebooks in streaming or batch pipelines.

### Deploy models to Azure Machine Learning endpoints

You can use the `azureml-mlflow` plugin to deploy a model to your Azure Machine Learning workspace. For more information about how to deploy models to the different targets [How to deploy MLflow models](how-to-deploy-mlflow-models.md).

> [!IMPORTANT]
> Models need to be registered in Azure Machine Learning registry in order to deploy them. If your models are registered in the MLflow instance inside Azure Databricks, register them again in Azure Machine Learning. For more information, see [Training models in Azure Databricks and deploying them on Azure Machine Learning](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/track_with_databricks_deploy_aml.ipynb)

### Deploy models to Azure Databricks for batch scoring using UDFs

You can choose Azure Databricks clusters for batch scoring. By using Mlflow, you can resolve any model from the registry you're connected to. You usually use one of the following methods:

- If your model was trained and built with Spark libraries like `MLLib`, use `mlflow.pyfunc.spark_udf` to load a model and used it as a Spark Pandas UDF to score new data.
- If your model wasn't trained or built with Spark libraries, either use `mlflow.pyfunc.load_model` or `mlflow.<flavor>.load_model` to load the model in the cluster driver. You need to orchestrate any parallelization or work distribution you want to happen in the cluster. MLflow doesn't install any library your model requires to run. Those libraries need to be installed in the cluster before running it.

The following example shows how to load a model from the registry named `uci-heart-classifier` and used it as a Spark Pandas UDF to score new data.

```python
from pyspark.sql.types import ArrayType, FloatType 

model_name = "uci-heart-classifier"
model_uri = "models:/"+model_name+"/latest"

#Create a Spark UDF for the MLFlow model 
pyfunc_udf = mlflow.pyfunc.spark_udf(spark, model_uri) 
```

For more ways to reference models from the registry, see [Loading models from registry](how-to-manage-models-mlflow.md#loading-models-from-registry).

After the model is loaded, you can use this command to score new data.

```python
#Load Scoring Data into Spark Dataframe 
scoreDf = spark.table({table_name}).where({required_conditions}) 

#Make Prediction 
preds = (scoreDf 
           .withColumn('target_column_name', pyfunc_udf('Input_column1', 'Input_column2', ' Input_column3', …)) 
        ) 

display(preds) 
```

## Clean up resources

If you want to keep your Azure Databricks workspace, but no longer need the Azure Machine Learning workspace, you can delete the Azure Machine Learning workspace. This action results in unlinking your Azure Databricks workspace and the Azure Machine Learning workspace.

If you don't plan to use the logged metrics and artifacts in your workspace, delete the resource group that contains the storage account and workspace.

1. In the Azure portal, search for *Resource groups*. Under **services**, select **Resource groups**.
1. In the **Resource groups** list, find and select the resource group that you created to open it.
1. In the **Overview** page, select **Delete resource group**.
1. To verify deletion, enter the resource group's name.

## Related content

- [Deploy MLflow models as an Azure web service](how-to-deploy-mlflow-models.md)
- [Manage your models](concept-model-management-and-deployment.md)
- [Track experiment jobs with MLflow and Azure Machine Learning](how-to-use-mlflow.md)
- [Azure Databricks and MLflow](/azure/databricks/applications/mlflow/)
