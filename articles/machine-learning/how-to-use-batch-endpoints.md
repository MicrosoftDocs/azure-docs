---
title: 'Use batch endpoints and deployments'
titleSuffix: Azure Machine Learning
description: Learn how to use batch endpoints to operationalize long running machine learning jobs under a stable API.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.date: 05/01/2023
ms.custom: how-to, devplatv2
---

# Use batch endpoints and deployments

Use Azure Machine Learning batch endpoints to operationalize your machine learning workloads in a repeatable and scalable way. Batch endpoints provide a unified interface to invoke and manage long running machine learning jobs.

In this article, you'll learn how to work with batch endpoints.

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs-studio](../../includes/machine-learning/azureml-batch-prereqs-with-studio.md)]


## Create a batch endpoint

A batch endpoint is an HTTPS endpoint that clients can call to trigger a batch inference job. A batch deployment is a set of compute resources hosting the model or pipeline (preview) that does the actual inferencing. One batch endpoint can have multiple batch deployments.

### Steps

1. Provide a name for the endpoint. The endpoint name appears in the URI associated with your endpoint; therefore, __batch endpoint names need to be unique within an Azure region__. For example, there can be only one batch endpoint with the name `mybatchendpoint` in `westus2`.

    # [Azure CLI](#tab/cli)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.
    
    ```azurecli
    ENDPOINT_NAME="mnist-batch"
    ```
    
    # [Python](#tab/python)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.

    ```python
    endpoint_name="mnist-batch"
    ```
    
    # [Studio](#tab/studio)
    
    *You'll configure the name of the endpoint later in the creation wizard.*
    

1. Configure your batch endpoint

    # [Azure CLI](#tab/cli)

    The following YAML file defines a batch endpoint. You can include the YAML file in the CLI command for [batch endpoint creation](#create-a-batch-endpoint).
    
    __endpoint.yml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/endpoint.yml":::

    The following table describes the key properties of the endpoint. For the full batch endpoint YAML schema, see [CLI (v2) batch endpoint YAML schema](./reference-yaml-endpoint-batch.md).
    
    | Key | Description |
    | --- | ----------- |
    | `name` | The name of the batch endpoint. Needs to be unique at the Azure region level.|
    | `description` | The description of the batch endpoint. This property is optional. |
    | `auth_mode` | The authentication method for the batch endpoint. Currently only Azure Active Directory token-based authentication (`aad_token`) is supported. |
    
    # [Python](#tab/python)
    
    ```python
    endpoint = BatchEndpoint(
        name=endpoint_name,
        description="A batch endpoint for scoring images from the MNIST dataset.",
    )
    ```
    
    | Key | Description |
    | --- | ----------- |
    | `name` | The name of the batch endpoint. Needs to be unique at the Azure region level.|
    | `description` | The description of the batch endpoint. This property is optional. |
    
    # [Studio](#tab/studio)
    
    *You'll create the endpoint in the same step you create the deployment.*
    

1. Create the endpoint:

    # [Azure CLI](#tab/cli)
    
    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="create_endpoint" :::

    # [Python](#tab/python)
    
    ```python
    ml_client.batch_endpoints.begin_create_or_update(endpoint)
    ```
    # [Studio](#tab/studio)
    
    *You'll create the endpoint at the same time that you create the deployment later.*

## Create a batch deployment

A deployment is a set of resources and computes required to implement the functionality the endpoint provides. There are two types of deployments depending on the asset you want to deploy:

* [Model deployment](concept-endpoints-batch.md#model-deployments): Use this to operationalize machine learning model inference routines. See [How to deploy a model in a batch endpoint](how-to-use-batch-model-deployments.md) for a guide to deploy models in batch endpoints.
* [Pipeline component deployment (preview)](concept-endpoints-batch.md#pipeline-component-deployment-preview): Use this to operationalize complex inference pipelines under a stable URI. See [How to deploy a pipeline component in a batch endpoint (preview)](how-to-use-batch-pipeline-deployments.md) for a guide to deploy pipeline components.


## Create jobs from batch endpoints

When you invoke a batch endpoint, it triggers a batch scoring job. The invoke response returns a job `name` that can be used to track the batch scoring progress.

# [Azure CLI](#tab/cli)
    
:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="start_batch_scoring_job" :::

# [Python](#tab/python)

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint_name,
    inputs=Input(path="https://azuremlexampledata.blob.core.windows.net/data/mnist/sample/", type=AssetTypes.URI_FOLDER)
)
```

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you just created.

1. Select __Create job__.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/create-batch-job.png" alt-text="Screenshot of the create job option to start batch scoring.":::

1. On __Deployment__, select the deployment you want to execute.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/job-setting-batch-scoring.png" alt-text="Screenshot of using the deployment to submit a batch job.":::

1. Select __Next__.

1. On __Select data source__, select the data input you want to use. For this example, select __Datastore__ and in the section __Path__ enter the full URL `https://azuremlexampledata.blob.core.windows.net/data/mnist/sample`. Notice that this only works because the given path has public access enabled. In general, you'll need to register the data source as a __Datastore__. See [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md) for details.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/select-datastore-job.png" alt-text="Screenshot of selecting datastore as an input option.":::

1. Start the job.

---

Batch endpoints support reading files or folders from different locations. To learn more about the supported types and how to specify them read [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md). 

> [!TIP]
> **Using the REST API:** Batch endpoints provide an open and durable API to invoke the endpoints and create jobs. See [Create jobs and input data for batch endpoints (REST)](how-to-access-data-batch-endpoints-jobs.md?tabs=rest) to learn how to use it.

## Accessing outputs from batch jobs

When you invoke a batch endpoint, it triggers a batch scoring job. The invoke response returns a job `name` that can be used to track the batch scoring progress. When the job is finished, you can access any output the endpoint provides. Each output has a name that allows you to access it.

For instance, the following example downloads the output __score__ from the job. All model deployments have an output with that name:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="download_outputs" :::

# [Python](#tab/python)

```python
ml_client.jobs.download(name=job.name, output_name='score', download_path='./')
```

# [Studio](#tab/studio)

1. In the graph of the job, select the `batchscoring` step.

1. Select the __Outputs + logs__ tab and then select **Show data outputs**.

1. From __Data outputs__, select the icon to open __Storage Explorer__.

    :::image type="content" source="media/how-to-use-batch-endpoint/view-data-outputs.png" alt-text="Studio screenshot showing view data outputs location." lightbox="media/how-to-use-batch-endpoint/view-data-outputs.png":::

    The scoring results in Storage Explorer are similar to the following sample page:

    :::image type="content" source="media/how-to-use-batch-endpoint/scoring-view.png" alt-text="Screenshot of the scoring output." lightbox="media/how-to-use-batch-endpoint/scoring-view.png":::

---

## Manage multiple deployments

Batch endpoints can handle multiple deployments under the same endpoint, allowing you to change the implementation of the endpoint without changing the URL your consumers use to invoke it.

You can add, remove, and update deployments without affecting the endpoint itself.

### Add non-default deployments

To add a new deployment to an existing endpoint, use the  code:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="create_deployment_non_default" :::

# [Python](#tab/python)

Using the `MLClient` created earlier, we'll now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.

```python
ml_client.batch_deployments.begin_create_or_update(deployment)
```

# [Studio](#tab/studio)

In the wizard, select __Create__ to start the deployment process.

:::image type="content" source="./media/how-to-use-batch-endpoints-studio/review-batch-wizard.png" alt-text="Screenshot of batch endpoints/deployment review screen.":::

---

Azure Machine Learning will add a new deployment to the endpoint but won't set it as default. Before you switch traffic to this deployment, you can test it to confirm that the results are what you expect.

### Change the default deployment

Batch endpoints can have one deployment marked as __default__. Changing the default deployment gives you the possibility of changing the model or pipeline (preview) serving the deployment without changing the contract with the user. Use the following instruction to update the default deployment:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="update_default_deployment" :::

# [Python](#tab/python)

```python
endpoint = ml_client.batch_endpoints.get(endpoint_name)
endpoint.defaults.deployment_name = deployment.name
ml_client.batch_endpoints.begin_create_or_update(endpoint)
```

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you want to configure.

1. Select __Update default deployment__.
    
    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/update-default-deployment.png" alt-text="Screenshot of updating default deployment.":::

1. On __Select default deployment__, select the name of the deployment you want to be the default one.

1. Select __Update__.

1. The selected deployment is now the default one.

---

### Delete a deployment

You can delete a given deployment as long as it's not the default one. Deleting a deployment doesn't delete the jobs or outputs it generated.

# [Azure CLI](#tab/cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="delete_deployment" :::


# [Python](#tab/python)

```python
ml_client.batch_deployments.begin_delete(name=deployment.name, endpoint_name=endpoint.name)
```

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint where the deployment is located. 

1. On the batch deployment you want to delete, select __Delete__.

1. Notice that deleting the endpoint won't affect the compute cluster where the deployment(s) run.

---

## Delete an endpoint

Deleting an endpoint will delete all the deployments under it. However, this deletion won't remove any previously executed jobs and their outputs from the workspace.

# [Azure CLI](#tab/cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

```python
ml_client.batch_endpoints.begin_delete(name=endpoint.name)
```

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you want to delete.

1. Select __Delete__.

Now, the endpoint all along with its deployments will be deleted. Notice that this deletion won't affect the compute cluster where the deployment(s) run.

---

## Next steps

- [Deploy models with batch endpoints](how-to-use-batch-model-deployments.md)
- [Deploy pipelines with batch endpoints (preview)](how-to-use-batch-pipeline-deployments.md)
- [Deploy MLFlow models in batch deployments](how-to-mlflow-batch.md)
- [Create jobs and input data to batch endpoints](how-to-access-data-batch-endpoints-jobs.md)
- [Network isolation for Batch Endpoints](how-to-secure-batch-endpoint.md)


