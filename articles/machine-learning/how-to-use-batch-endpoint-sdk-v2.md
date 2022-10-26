---
title: 'Use batch endpoints for batch scoring using Python SDK v2'
titleSuffix: Azure Machine Learning
description: In this article, learn how to create a batch endpoint to continuously batch score large data using Python SDK v2.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.reviewer: larryfr
ms.date: 05/25/2022
ms.custom: how-to, devplatv2, sdkv2, ignite-2022
#Customer intent: As an ML engineer or data scientist, I want to create an endpoint to host my models for batch scoring, so that I can use the same endpoint continuously for different large datasets on-demand or on-schedule.
---

# Use batch endpoints for batch scoring using Python SDK v2

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

Learn how to use batch endpoints to do batch scoring using Python SDK v2. Batch endpoints simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. For more information, see [What are Azure Machine Learning endpoints?](concept-endpoints.md).

In this article, you'll learn to:

* Connect to your Azure machine learning workspace from the Python SDK v2.
* Create a batch endpoint from Python SDK v2.
* Create deployments on that endpoint from Python SDK v2.
* Test a deployment with a sample request.

## Prerequisites

* A basic understanding of Machine Learning.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* An Azure ML workspace with computer cluster to run your batch scoring job.
* The [Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ml/installv2).

### Clone examples repository

To run the examples, first clone the examples repository and change into the `sdk` directory:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/sdk
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

## Connect to Azure Machine Learning workspace

The [workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which the job will be run.

1. Import the required libraries:

    ```python
    # import required libraries
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import (
        AmlCompute,
        BatchEndpoint,
        BatchDeployment,
        Model,
        Environment,
        BatchRetrySettings,
    )
    from azure.ai.ml.entities._assets import Dataset
    from azure.identity import DefaultAzureCredential
    from azure.ai.ml.constants import BatchDeploymentOutputAction
    ```

1. Configure workspace details and get a handle to the workspace:

    To connect to a workspace, we need identifier parameters - a subscription, resource group and workspace name. We'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. This example uses the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential).

    ```python
    # enter details of your AzureML workspace
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    workspace = "<AZUREML_WORKSPACE_NAME>"
    ```

    ```python
    # get a handle to the workspace
    ml_client = MLClient(
        DefaultAzureCredential(), subscription_id, resource_group, workspace
    )
    ```

## Create batch endpoint

Batch endpoints are endpoints that are used batch inferencing on large volumes of data over a period of time. Batch endpoints receive pointers to data and run jobs asynchronously to process the data in parallel on compute clusters. Batch endpoints store outputs to a data store for further analysis.

To create an online endpoint, we'll use `BatchEndpoint`. This class allows user to configure the following key aspects:

* `name` - Name of the endpoint. Needs to be unique at the Azure region level
* `auth_mode` - The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based (`aad_token`) authentication is supported.
* `identity`- The managed identity configuration for accessing Azure resources for endpoint provisioning and inference.
* `defaults` - Default settings for the endpoint.
    * `deployment_name` - Name of the deployment that will serve as the default deployment for the endpoint.
* `description`- Description of the endpoint.

1. Configure the endpoint:

    ```python
    # Creating a unique endpoint name with current datetime to avoid conflicts
    import datetime

    batch_endpoint_name = "my-batch-endpoint-" + datetime.datetime.now().strftime(
        "%Y%m%d%H%M"
    )

    # create a batch endpoint
    endpoint = BatchEndpoint(
        name=batch_endpoint_name,
        description="this is a sample batch endpoint",
        tags={"foo": "bar"},
    )
    ```

1. Create the endpoint:

    Using the `MLClient` created earlier, we'll now create the Endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.

    ```python
    ml_client.begin_create_or_update(endpoint)
    ```

## Create batch compute

Batch endpoint runs only on cloud computing resources, not locally. The cloud computing resource is a reusable virtual computer cluster. Run the following code to create an Azure Machine Learning compute cluster. The following examples in this article use the compute created here named `cpu-cluster`.

```python
compute_name = "cpu-cluster"
compute_cluster = AmlCompute(name=compute_name, description="amlcompute", min_instances=0, max_instances=5)
ml_client.begin_create_or_update(compute_cluster)
```

## Create a deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. We'll create a deployment for our endpoint using the `BatchDeployment` class. This class allows user to configure the following key aspects.

* `name` - Name of the deployment.
* `endpoint_name` - Name of the endpoint to create the deployment under.
* `model` - The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification.
* `environment` - The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification.
* `code_path`- Path to the source code directory for scoring the model
* `scoring_script` - Relative path to the scoring file in the source code directory
* `compute` - Name of the compute target to execute the batch scoring jobs on
* `instance_count`- The number of nodes to use for each batch scoring job.
* `max_concurrency_per_instance`- The maximum number of parallel scoring_script runs per instance.
* `mini_batch_size` - The number of files the code_configuration.scoring_script can process in one `run`() call.
* `retry_settings`- Retry settings for scoring each mini batch.
    * `max_retries`- The maximum number of retries for a failed or timed-out mini batch (default is 3)
    * `timeout`- The timeout in seconds for scoring a mini batch (default is 30)
* `output_action`- Indicates how the output should be organized in the output file. Allowed values are `append_row` or `summary_only`. Default is `append_row`
* `output_file_name`- Name of the batch scoring output file. Default is `predictions.csv`
* `environment_variables`- Dictionary of environment variable name-value pairs to set for each batch scoring job.
* `logging_level`- The log verbosity level. Allowed values are `warning`, `info`, `debug`. Default is `info`.

1. Configure the deployment:

    ```python
    # create a batch deployment
    model = Model(path="./mnist/model/")
    env = Environment(
        conda_file="./mnist/environment/conda.yml",
        image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest",
    )
    deployment = BatchDeployment(
        name="non-mlflow-deployment",
        description="this is a sample non-mlflow deployment",
        endpoint_name=batch_endpoint_name,
        model=model,
        code_path="./mnist/code/",
        scoring_script="digit_identification.py",
        environment=env,
        compute=compute_name,
        instance_count=2,
        max_concurrency_per_instance=2,
        mini_batch_size=10,
        output_action=BatchDeploymentOutputAction.APPEND_ROW,
        output_file_name="predictions.csv",
        retry_settings=BatchRetrySettings(max_retries=3, timeout=30),
        logging_level="info",
    )
    ```

1. Create the deployment:

    Using the `MLClient` created earlier, we'll now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.

    ```python
    ml_client.begin_create_or_update(deployment)
    ```

## Test the endpoint with sample data

Using the `MLClient` created earlier, we'll get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:

* `endpoint_name` - Name of the endpoint
* `input` - Path where input data is present
* `deployment_name` - Name of the specific deployment to test in an endpoint

1. Invoke the endpoint:

    ```python
    # create a dataset form the folderpath
    input = Input(path="https://pipelinedata.blob.core.windows.net/sampledata/mnist")

    # invoke the endpoint for batch scoring job
    job = ml_client.batch_endpoints.invoke(
        endpoint_name=batch_endpoint_name,
        input=input,
        deployment_name="non-mlflow-deployment",  # name is required as default deployment is not set
        params_override=[{"mini_batch_size": "20"}, {"compute.instance_count": "4"}],
    )
    ```

1. Get the details of the invoked job:

    Let us get details and logs of the invoked job

    ```python
    # get the details of the job
    job_name = job.name
    batch_job = ml_client.jobs.get(name=job_name)
    print(batch_job.status)
    # stream the job logs
    ml_client.jobs.stream(name=job_name)
    ```

## Clean up resources

Delete endpoint

```python
ml_client.batch_endpoints.begin_delete(name=batch_endpoint_name)
```

Delete compute: optional, as you may choose to reuse your compute cluster with later deployments.

```python
ml_client.compute.begin_delete(name=compute_name)
```

## Next steps

If you encounter problems using batch endpoints, see [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md).
