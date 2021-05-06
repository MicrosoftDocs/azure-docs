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

# Use batch endpoints (preview) for batch scoring

In this article, you learn how to use batch endpoints (preview) to do batch scoring. Batch endpoints simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. After you create a batch endpoint, you can trigger batch scoring jobs with the Azure CLI or from any platform using an HTTP library and the REST API.

In this article, you learn to do the following tasks:

> [!div class="checklist"]
> * Create a batch endpoint with a no-code experience for MLflow model
> * Check a batch endpoint detail
> * Start a batch scoring job using CLI
> * Monitor batch scoring job execution progress and check scoring results
> * Add a new deployment to a batch endpoint
> * Start a batch scoring job using REST

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure subscription

If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* The Azure Command Line Interface (CLI) and ML extension.

The Machine Learning extension requires Azure CLI version `>=2.15.0`. Ensure this requirement is met:

```azurecli
az version
```

If necessary, upgrade the Azure CLI:

```azurecli
az upgrade
```

> [!IMPORTANT]
> The `az upgrade` command was added in version tk. If you are below that version, you need to manually install a newer version.
{>> 2021-05-05 sent q to teams ML Platform / CLI team <<}

* An Azure Machine Learning workspace

If you don't already have an Azure Machine Learning workspace or notebook virtual machine, complete your [setup](https://github.com/Azure/azureml-examples/blob/main/experimental/using-cli/setup.sh).

* The example repository

Clone the [AzureML Example repository](https://github.com/Azure/azureml-examples). This article uses the assets in `/cli-preview/experiment/using-cli/assets/endpoints/batch`.

## Create a compute target

Batch scoring runs only on cloud resources, not locally. The cloud resource is called a "compute target." A compute target is a reusable virtual computer where you can run batch scoring workflows.

Run the following code to create a CPU-enabled [`AmlCompute`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute(class)?view=azure-ml-py&preserve-view=true) target. For more information about compute targets, see [What are compute targets in Azure Machine Learning?](./concept-compute-target.md).

```
az ml compute create -n cpu-cluster --type AmlCompute --min-instances 0 --max-instances 5
```

## Create a batch endpoint

If you're using an MLflow model, you can use no-code batch endpoint creation. That is, you don't need to prepare a scoring script and environment, both can be auto generated.

```
az ml endpoint create --type batch --file cli/endpoints/batch/create-batch-endpoint.yml
```

Below is the YAML file defining the MLFlow batch endpoint. To use a registered model, replace the `model` section in the YAML with `model:azureml:<modelName>:<modelVersion>`.

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/batch/create-batch-endpoint.yml":::

## Check batch endpoint details

After a batch endpoint is created, you can use `show` to check the details. Use the [`--query parameter`](https://docs.microsoft.com/cli/azure/query-azure-cli) to get only specific attributes from the returned data.

```
az ml endpoint show -n mybatchedp -t batch
```

## Start a batch scoring job using CLI

A batch scoring workload runs as an offline job. Batch scoring is designed to process large data. Inputs are processed in parallel on the inferencing compute cluster. Any single node is assigned a partition of the total data. By default, batch scoring stores the scoring outputs in blob storage. You can start a batch scoring job using CLI by passing in the data inputs. You can also configure the outputs location and overwrite some of the settings to get the best performance.

### Start a bath scoring job with different inputs options

You have three options to specify the data inputs.

Option 1: Registered data

Use `--input-data` to pass in an AML registered data.

> **_NOTE:_** 
> During Preview, only FileDataset is supported. 

{>> Q: According to Cody, "`FileDataset` is strictly a v1 Python SDK concept.:" Does this require explanation here? <<}

```
az ml endpoint invoke --name mybatchedp --type batch --input-data azureml:<dataName>:<dataVersion>
```

Option 2: Data in the cloud

Use `--input-datastore` to specify an AML registered datastore, and use `--input-path` to specify the relative path in the datastore.

```
az ml endpoint invoke --name mybatchedp --type batch --input-datastore azureml:<datastoreName> --input-path <relativePath>
```

If your data is publicly available, use `--input-path` to specify the public path.

If you're using the provided example, you can run the following command to start a batch scoring job.

```
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv
```

Option 3: Data stored locally

```
az ml endpoint invoke --name mybatchedp --type batch --input-local-path <localPath>
```

### Configure the output location

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
* Use `--set` to overwrite other settings including `max_retries`, `timeout`, and `error_threshold`.

```
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv --set retry_settings.max_retries=1
```

## Check batch scoring job execution progress

Batch scoring jobs usually take some time to process the entire set of inputs. You can monitor the job progress from Azure Machine Learning studio. The studio link is provided in the response of `invoke`, as the value of `interactionEndpoints.studio`.

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

1. Go to studio
1. Navigate to **Experiments**
1. Navigate to your endpoint's run (the value of `interactionEndpoints.studio` in the response to `endpoint invoke`)
1. In the graph of the run, click inside the `batchscoring` step
1. Choose the Outputs + logs tab and choose **Show data outputs** 
1. Choose the **View output** icon
:::image type="content" source="media/how-to-use-batch-endpoint/view-data-outputs.png" alt-text="Studio screenshot showing view data outputs location":::
1. On the popup panel, copy the path and choose the "Open Datastore" link.
1. On the resulting blobstore page, paste the above path into the search box. You'll find the scoring outputs in the folder.
:::image type="content" source="media/how-to-use-batch-endpoint/scoring-view.gif" alt-text="Screencast of opening the score folder and scoring output":::

## Add a deployment to the batch endpoint

One batch endpoint can have multiple deployments. Each deployment hosts one model for batch scoring. 

### Add a new deployment

Use the following command to add a new deployment to an existing batch endpoint.

```
az ml endpoint update --name mybatchedp --type batch --deployment mnist_deployment --deployment-file cli/endpoints/batch/add-deployment.yml
```
{>> TODO: Confirm this command with final path <<}

This sample uses a non-MLflow model. When using non-MLflow, you'll need to specify the environment and a scoring script in the YAML file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/batch/add-deployment.yml" :::

In studio, you'll see that you now have two deployments: `mnist_deployment` and your original `autolog_model` deployment. The `autolog_model` deployment receives 100% of traffic. 

:::image type="content" source="media/how-to-use-batch-endpoint/two-deployments.png" alt-text="Screenshot showing that the one endpoint has two deployments, and that the original is receiving 100% of traffic" :::

### Activate the new deployment

For batch inference, you must send 100% of inquiries to the wanted deployment. To set your newly created deployment as the target, use:

```
az ml endpoint update --name mybatchedp --type batch --traffic mnist_deployment:100
```

Now you can invoke a batch scoring job with this new deployment:

```
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/mnist --mini-batch-size 10 --instance-count 2
```

## Start a batch scoring job using REST

Batch endpoints have scoring URIs for REST access. REST lets you use any HTTP library on any platform to start a batch scoring job.

1. Get the `scoring_uri`:  

```
az ml endpoint show --name mybatchedp --type batch --query scoring_uri
```

1. Get the access token:

```
az account get-access-token
```

1. Use the `scoring_uri` and access token to POST a request and start a batch scoring job:

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

```bash
tk curl command here
```
{>> Q: The JSON properties need to work with the mnist_deployment and use whatever key maps to `--input-path https://pipelinedata.blob.core.windows.net/sampledata/mnist` <<}

## Clean up resources

If you don't plan to use the resources you created, delete them, so you don't incur any charges:

1. In the Azure portal, in the left menu, select **Resource groups**.
1. In the list of resource groups, select the resource group you created.
1. Select **Delete resource group**.
1. Enter the resource group name. Then, select **Delete**.

You can also keep the resource group but delete a single workspace. Display the workspace properties, and then select **Delete**.

## Next steps

In this article, you learned how to create and call batch endpoints, allowing you to score large amounts of data. See these other articles to learn more about Azure Machine Learning:

* [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)
