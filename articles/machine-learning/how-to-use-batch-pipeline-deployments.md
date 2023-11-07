---
title: "Deploy pipelines with batch endpoints (preview)"
titleSuffix: Azure Machine Learning
description: Learn how to create a batch deploy a pipeline component and invoke it.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 04/21/2023
reviewer: msakande
ms.reviewer: mopeakande
ms.custom: how-to, devplatv2, event-tier1-build-2023
---

# How to deploy pipelines with batch endpoints (preview)

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

You can deploy pipeline components under a batch endpoint, providing a convenient way to operationalize them in Azure Machine Learning. In this article, you'll learn how to create a batch deployment that contains a simple pipeline. You'll learn to:

> [!div class="checklist"]
> * Create and register a pipeline component
> * Create a batch endpoint and deploy a pipeline component
> * Test the deployment

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## About this example

In this example, we're going to deploy a pipeline component consisting of a simple command job that prints "hello world!". This component requires no inputs or outputs and is the simplest pipeline deployment scenario.

[!INCLUDE [machine-learning-batch-clone](includes/azureml-batch-clone-samples.md)]

The files for this example are in:

```azurecli
cd endpoints/batch/deploy-pipelines/hello-batch
```

### Follow along in Jupyter notebooks

You can follow along with the Python SDK version of this example by opening the [sdk-deploy-and-test.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb) notebook in the cloned repository.

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](includes/azureml-batch-prereqs.md)]

## Create the pipeline component

Batch endpoints can deploy either models or pipeline components. Pipeline components are reusable, and you can streamline your MLOps practice by using [shared registries](concept-machine-learning-registries-mlops.md) to move these components from one workspace to another.

The pipeline component in this example contains one single step that only prints a "hello world" message in the logs. It doesn't require any inputs or outputs.

The `hello-component/hello.yml` file contains the configuration for the pipeline component:

__hello-component/hello.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/hello-component/hello.yml" :::

Register the component:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="register_component" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=register_component)]

---

## Create a batch endpoint

1. Provide a name for the endpoint. A batch endpoint's name needs to be unique in each region since the name is used to construct the invocation URI. To ensure uniqueness, append any trailing characters to the name specified in the following code.

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="name_endpoint" :::

    # [Python](#tab/python)

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=name_endpoint)]

1. Configure the endpoint:

    # [Azure CLI](#tab/cli)
    
    The `endpoint.yml` file contains the endpoint's configuration.

    __endpoint.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/endpoint.yml" :::

    # [Python](#tab/python)

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=configure_endpoint)]

1. Create the endpoint:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="create_endpoint" :::

    # [Python](#tab/python)

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=create_endpoint)]

1. Query the endpoint URI:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="query_endpoint" :::

    # [Python](#tab/python)

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=query_endpoint)]

## Deploy the pipeline component

To deploy the pipeline component, we have to create a batch deployment. A deployment is a set of resources required for hosting the asset that does the actual work.

1. Create a compute cluster. Batch endpoints and deployments run on compute clusters. They can run on any Azure Machine Learning compute cluster that already exists in the workspace. Therefore, multiple batch deployments can share the same compute infrastructure. In this example, we'll work on an Azure Machine Learning compute cluster called `batch-cluster`. Let's verify that the compute exists on the workspace or create it otherwise.

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="create_compute" :::
    
    # [Python](#tab/python)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=create_compute)]

1. Configure the deployment:

    # [Azure CLI](#tab/cli)
    
    The `deployment.yml` file contains the deployment's configuration. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.

    __deployment.yml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deployment.yml" :::
    
    # [Python](#tab/python)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=configure_deployment)]
    
1. Create the deployment:

    # [Azure CLI](#tab/cli)
    
    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="create_deployment" :::
    
    > [!TIP]
    > Notice the use of the `--set-default` flag to indicate that this new deployment is now the default.

    # [Python](#tab/python)

    This command will start the deployment creation and return a confirmation response while the deployment creation continues.

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=create_deployment)]
    
    Once created, let's configure this new deployment as the default one:

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=update_default_deployment)]

1. Your deployment is ready for use.

## Test the deployment

Once the deployment is created, it's ready to receive jobs. You can invoke the default deployment as follows:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="invoke_deployment_inline" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=invoke_deployment_inline)]

---

> [!TIP]
> In this example, the pipeline doesn't have inputs or outputs. However, if the pipeline component requires some, they can be indicated at invocation time. To learn about how to indicate inputs and outputs, see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md) or see the tutorial [How to deploy a pipeline to perform batch scoring with preprocessing (preview)](how-to-use-batch-scoring-pipeline.md).

You can monitor the progress of the show and stream the logs using:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="stream_job_logs" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=get_job)]

To wait for the job to finish, run the following code:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=stream_job_logs)]
---

## Clean up resources

Once you're done, delete the associated resources from the workspace:

# [Azure CLI](#tab/cli)

Run the following code to delete the batch endpoint and its underlying deployment. `--yes` is used to confirm the deletion.

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deploy-and-run.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

Delete the endpoint:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-pipelines/hello-batch/sdk-deploy-and-test.ipynb?name=delete_endpoint)]
---

(Optional) Delete compute, unless you plan to reuse your compute cluster with later deployments.

# [Azure CLI](#tab/cli)

```azurecli
az ml compute delete -n batch-cluster
```

# [Python](#tab/python)

```python
ml_client.compute.begin_delete(name="batch-cluster")
```
---

## Next steps

- [How to deploy a training pipeline with batch endpoints (preview)](how-to-use-batch-training-pipeline.md)
- [How to deploy a pipeline to perform batch scoring with preprocessing (preview)](how-to-use-batch-scoring-pipeline.md)
- [Create batch endpoints from pipeline jobs (preview)](how-to-use-batch-pipeline-from-job.md)
- [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md)
- [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)
