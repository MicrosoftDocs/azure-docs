---
title: 'Use batch endpoints for batch scoring'
titleSuffix: Azure Machine Learning
description: In this article, learn how to create a batch endpoint to continuously batch score large data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: tracych
ms.author: tracych
ms.reviewer: laobri
ms.date: 5/20/2021
ms.custom: how-to

# Customer intent: As an ML engineer or data scientist, I want to create an endpoint to host my models for batch scoring, so that I can use the same endpoint continuously for different large datasets on-demand or on-schedule.
---

# Use Batch Endpoints (preview) for batch scoring

In this article, you learn how to use [Batch Endpoints (preview)](concept-managed-endpoints.md) to run batch scoring. Batch endpoints simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. After you create a batch endpoint, you can use trigger batch scoring jobs with the Azure CLI or from any platform using an HTTP library and the REST API.

In this article, you learn to do the following tasks:

> [!div class="checklist"]
> * Create a batch endpoint with no-code experience for MLflow model
ƒ> * Check a batch endpoint detail
> * Start a batch scoring job using CLI
> * Monitor batch scoring job execution progress and check scoring results
> * Add a new deployment to a batch endpoint
> * Start a batch scoring job using REST

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure subscription

If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* The Azure Command Line Interface (CLI) and ML extension.

The Machine Learning extension requires Azure CLI version `>=2.15.0`. Check your version:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_version":::

* An Azure Machine Learning workspace

If you don't already have an Azure Machine Learning workspace or notebook virtual machine, complete [setup](https://github.com/Azure/azureml-examples/blob/cli-preview/experimental/using-cli/setup.sh).

* The example repository

Clone the [AzureML Example repository](https://github.com/Azure/azureml-examples/tree/cli-preview/experimental/using-cli/assets/endpoints/batch). This article uses the assets in `/cli-preview/experiment/using-cli/assets/endpoints/batch`.

## Create a compute target

Batch scoring runs only on cloud resources, not locally. The cloud resource is called a "compute target." A compute target is a reusable virtual computer where you can run batch scoring workflows.

Run the following code to create a CPU-enabled [`AmlCompute`](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute) target. For more information about compute targets, see the [conceptual article](./concept-compute-target.md).

```
az ml compute create -n cpu-cluster --type AmlCompute --min-instances 0 --max-instances 5
```

## Create a batch endpoint

If you're using an MLflow model, you can use no-code batch endpoint creation. That is, you don't need to prepare a scoring script and environment, both can be auto generated.

```
az ml endpoint create --type batch --file examples/endpoints/batch/create-batch-endpoint.yml
```

Below is the YAML file defining the MLFlow batch endpoint. To use a registered model, replace the `model` section in the YAML with `model:azureml:<modelName>:<modelVersion>`.

:::code language="yaml" source="~/azureml-examples/blob/cli-preview/cli/endpoints/batch/create-batch-endpoint.yml:::

## Check batch endpoint details

After a batch endpoint is created, you can use `show` to check the details. Use the [`--query parameter`](https://docs.microsoft.com/cli/azure/query-azure-cli) to get only specific attributes from the returned data.

```
az ml endpoint show -n mybatchedp -t batch
```

## Start a batch scoring job using CLI

A batch scoring workload runs as an offline job. It processes all the data inputs at once, and, by default, stores the scoring outputs. You can start a batch scoring job using CLI by passing in the data inputs. You can also configure the outputs location and overwrite some of the settings to get the best performance.

### Start a bath scoring job with different inputs options

You have three options to specify the data inputs.

Option 1: registered data

Use `--input-data` to pass in an AML registered data.

> **_NOTE:_** 
> During Preview, only FileDataset is supported. 

{>> Q: According to Cody, "`FileDataset` is strictly a v1 Python SDK concept.:" Does this require explanation here? <<}

```
az ml endpoint invoke --name mybatchedp --type batch --input-data azureml:<dataName>:<dataVersion>
```

Option 2: data in the cloud

Use `--input-datastore` to specify an AML registered datastore, and use `--input-path` to specify the relative path in the datastore.

```
az ml endpoint invoke --name mybatchedp --type batch --input-datastore azureml:<datastoreName> --input-path <relativePath>
```

If your data is publicly available, use `--input-path` to specify the public path.

If you're using the provided example, you can run below command to start a batch scoring job.

```
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv
```

Option 3: data in local

```
az ml endpoint invoke --name mybatchedp --type batch --input-local-path <localPath>
```

### Configure outputs location

The batch scoring results are by default stored in the workspace's default blob store within a folder named by Job ID (a system-generated GUID). You can configure where to store the scoring outputs when you start a batch scoring job. Use `--output-datastore` to configure any registered datastore, and use `--output-path` to configure the relative path.

> [!IMPORTANT]
> You must use a unique output location. If the output location exists, the batch scoring job will fail. 

```
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv --output-datastore azureml:workspaceblobstore --output-path mypath
```

### Overwrite settings

Some settings can be overwritten when you start a batch scoring job to make best use of the compute resource and to improve performance: 

* Use `--mini-batch-size` to overwrite `mini_batch_size` if different size of input data is used. 
* Use `--instance-count` to overwrite `instance_count` if different compute resource is needed for this job. 
* Use `--set` to overwrite other settings including `max_retries`, `timeout`, `error_threshold`, and `logging_level`.

```
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv --set retry_settings.max_retries=1
```

## Check batch scoring job execution progress

Batch scoring job usually takes time to process the entire inputs. You can monitor the job progress from Azure portal. The portal link is provided in the response of `invoke`, check `interactionEndpoints.studio`.

{>> Q: The text says to use portal, while the value refers to `studio`. Is monitoring from portal or studio? <<}

You can also check job details along with status using CLI.

Get the job name from the invoke response.

```
job_name=`az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv --query name -o tsv`
```

Use `job show` to check details and status of a batch scoring job.

```
az ml job show --name <job_name>
```

Stream the job logs using `job stream`.

```
az ml job stream --name <job_name>
```

## Check batch scoring results

To view the scoring results:

* In the tk, go to the batchscoring step tk
* Go to the batchscoring step’s Outputs + logs tab, click Show data outputs, and click View output icon.
* On the popup panel, copy the path and click Open Datastore link.
* On the blobstore page, paste the above path in the search box. You'll find the scoring outputs in the folder.

## Add a deployment to the batch endpoint

One batch endpoint can have multiple deployments, and one deployment hosts one model for batch scoring. 

### Add a new deployment

Use below command to add a new deployment to an existing batch endpoint.

```
az ml endpoint update --name mybatchedp --type batch --deployment mnist_deployment --deployment-file examples/endpoints/batch/add-deployment.yml
```

This sample uses a non-MLflow model, you'll need to provide environment and scoring script.

:::code language="yaml" source="~/azureml-examples/blob/cli-preview/cli/endpoints/batch/add-deployment.yml" :::

### Activate the new deployment

When invoking an endpoint, the deployment with 100 traffic is in use. Use the command below to activate the new deployment by switching the traffic (can only be 0 or 100). 

```
az ml endpoint update --name mybatchedp --type batch --traffic mnist_deployment:100
```

Now you can invoke a batch scoring job with this new deployment.

```
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/mnist --mini-batch-size 10 --instance-count 2
```

## Start a batch scoring job using REST

After you create a batch endpoint, you can get a `scoring_uri`. Use it from any HTTP library on any platform to start a batch scoring job.

Get the scoring_uri.

```
az ml endpoint show --name mybatchedp --type batch --query scoring_uri
```

Get the access token.

```
az account get-access-token
```

Use the scoring_uri and the token to POST a request and start a batch scoring job.

```JSON
{
    "properties": {
        "dataset": {
            "dataInputType": "DatasetId",
            "datasetId": "/subscriptions/{{subscription}}/resourceGroups/{{resourcegroup}}/providers/Microsoft.MachineLearningServices/workspaces/{{workspaceName}}/data/{{datasetName}}/versions/1"
            },
        "outputDataset" : {
          "datastoreId": "/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.MachineLearningServices/workspaces/{{workspaceName}}/datastores/{{datastorename}}",
          "path": "mypath"
      }
    }
}
```

## Clean up resources

Don't complete this section if you plan to run other Azure Machine Learning tutorials.

### Stop the compute instance

[!INCLUDE [aml-stop-server](../../includes/aml-stop-server.md)]

### Delete everything

If you don't plan to use the resources you created, delete them, so you don't incur any charges:

1. In the Azure portal, in the left menu, select **Resource groups**.
1. In the list of resource groups, select the resource group you created.
1. Select **Delete resource group**.
1. Enter the resource group name. Then, select **Delete**.

You can also keep the resource group but delete a single workspace. Display the workspace properties, and then select **Delete**.
