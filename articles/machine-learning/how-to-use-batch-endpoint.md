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
ms.date: 8/11/2021
ms.custom: how-to, devplatv2

# Customer intent: As an ML engineer or data scientist, I want to create an endpoint to host my models for batch scoring, so that I can use the same endpoint continuously for different large datasets on-demand or on-schedule.
---

# Use batch endpoints (preview) for batch scoring

In this article, you learn how to use batch endpoints (preview) to do batch scoring. Batch endpoints simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. After you create a batch endpoint, you can trigger batch scoring jobs with the Azure CLI or from any platform using an HTTP library and the REST API. For more, see [What are Azure Machine Learning endpoints (preview)?](concept-endpoints.md).

In this article, you learn to do the following tasks:

> [!div class="checklist"]
> * Create a batch endpoint with a no-code experience for MLflow model
> * Check a batch endpoint detail
> * Start a batch scoring job using Azure CLI
> * Monitor batch scoring job execution progress and check scoring results
> * Add a new deployment to a batch endpoint
> * Start a batch scoring job using REST

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure subscription
If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* The Azure Command Line Interface (CLI) and ML extension.

The Machine Learning extension requires Azure CLI version `>=2.15.0`. Ensure this requirement is met:

```azurecli
az version
```

If necessary, upgrade the Azure CLI:

```azurecli
az upgrade
```

> [!NOTE]
>
> The `az upgrade` command was added in version 2.11.0 and will not work with versions prior to 2.11.0. Older versions can be updated by reinstalling as described in [Install the Azure CLI](/cli/azure/update-azure-cli).
>
> This command will also update all installed extensions by default. For more `az upgrade` options, please refer to the [command reference page](/cli/azure/reference-index#az_upgrade).

Add and configure the Azure ML extension:

```azurecli
az extension add -n ml
```

For more on configuring the ML extension, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md).

* The example repository

Clone the [AzureML Example repository](https://github.com/Azure/azureml-examples). This article uses the assets in `/cli/endpoints/batch`.

## Create a compute target

Batch scoring runs only on cloud computing resources, not locally. The cloud computing resource is called a "compute target." A compute target is a reusable virtual computer where you can run batch scoring workflows.

Run the following code to create a general purpose [`AmlCompute`](/python/api/azureml-core/azureml.core.compute.amlcompute(class)?view=azure-ml-py&preserve-view=true) target. For more information about compute targets, see [What are compute targets in Azure Machine Learning?](./concept-compute-target.md).

```azurecli
az ml compute create --name cpu-cluster --type amlcompute --min-instances 0 --max-instances 5
```

## Create a batch endpoint

If you're using an MLflow model, you can use no-code batch endpoint creation. That is, you don't need to prepare a scoring script and environment, both can be auto generated. For more, see [Train and track ML models with MLflow and Azure Machine Learning (preview)](how-to-use-mlflow.md).

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="create_batch_endpoint" :::

Below is the YAML file defining the MLFlow batch endpoint:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/create-batch-endpoint.yml":::

| Key | Description |
| --- | ----------- |
| $schema | [Optional] The YAML schema. You can view the schema in the above example in a browser to see all available options for a batch endpoint YAML file. |
| name | The name of the batch endpoint, which must be unique across the region. The `name` value will be used as part of the scoring URI. The value must start with an English-language character, continue as a mix of numbers, characters, and the `-` symbol, and it must end with a number or character. It must be at least 3 characters long. The validating regular expression is: `^[a-zA-Z][-a-zA-Z0-9]+[a-zA-Z0-9]$`|
| type | Type of the endpoint. Use `batch` for batch endpoint. |
| auth_mode | Use `aad_token` for Azure token-based authentication. |
| traffic | Percentage traffic routed to this deployment. For batch endpoints, the only valid values for `traffic` are `0` or `100`. The deployment with a value of `100` traffic is active. When invoked, all data is sent to the active deployment. |
| deployments | A list of deployments to be created in the batch endpoint. The example only has one deployment named `autolog-deployment`. |

Deployment Attributes:

| Key | Description |
| --- | ----------- |
| name | The name of the deployment. |
| model | The model to be used for batch scoring. Use `name`, `version`, and `local_path` to upload a model from your local machine. Use the `azureml:` prefix to reference an existing model resource in your workspace. For instance, `azureml: autolog:1` would point to version 1 of a model named `autolog`. |
| compute.target | The compute target. Use the `azureml:` prefix to reference an existing compute resource in your workspace. For instance, `azureml:cpu-cluster` would point to a compute target named `cpu-cluster`. |
| compute.instance_count | The number of compute nodes to be used for batch scoring. Default is `1`.|
| mini_batch_size | [Optional] The number of files the `scoring_script` can process in one `run()` call. Default is `10`. |
| output_file_name | [Optional] The name of the batch scoring output file. Default is `predictions.csv`. |
| retry_settings.max_retries | [Optional] The number of max tries for a failed `scoring_script` `run()`. Default is`3`. |
| retry_settings.timeout | [Optional] The timeout in seconds for a `scoring_script` `run()`. Default is `30`. |
| error_threshold | [Optional] The number of file failures that should be ignored. If the error count for the entire input goes above this value, the job will be terminated. The error threshold is for the entire input and not for individual mini-batch sent to the `run()` method. Default is `-1`, which specifies that any number of failures is allowed without terminating the run. | 
| logging_level | [Optional] Log verbosity. Values in increasing verbosity are: WARNING, INFO, and DEBUG. Default is INFO. |

## Check batch endpoint details

After a batch endpoint is created, you can use `show` to check the details. Use the [`--query parameter`](/cli/azure/query-azure-cli) to get only specific attributes from the returned data.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="check_batch_endpooint_detail" :::

## Start a batch scoring job using the Azure CLI

A batch scoring workload runs as an offline job. Batch scoring is designed to process large data. Inputs are processed in parallel on the compute cluster. A data partition is assigned to a process on a node. A single node with multiple processes will have multiple partitions run in parallel. By default, batch scoring stores the scoring outputs in blob storage. You can start a batch scoring job using the Azure CLI by passing in the data inputs. You can also configure the outputs location and overwrite some of the settings to get the best performance.

### Start a batch scoring job with different input options

You have three options to specify the data inputs.

Option 1: Registered data

Use `--input-data` to pass in an AML registered data.

> [!NOTE]
> During Preview, only FileDataset is supported. 

```azurecli
az ml endpoint invoke --name mybatchedp --type batch --input-data azureml:<dataName>:<dataVersion>
```

Option 2: Data in the cloud

Use `--input-datastore` to specify an AML registered datastore, and use `--input-path` to specify the relative path in the datastore.

```azurecli
az ml endpoint invoke --name mybatchedp --type batch --input-datastore azureml:<datastoreName> --input-path <relativePath>
```

If your data is publicly available, use `--input-path` to specify the public path.

If you're using the provided example, you can run the following command to start a batch scoring job.

```azurecli
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv
```

Option 3: Data stored locally

```azurecli
az ml endpoint invoke --name mybatchedp --type batch --input-local-path <localPath>
```

### Configure the output location

The batch scoring results are by default stored in the workspace's default blob store within a folder named by Job Name (a system-generated GUID). You can configure where to store the scoring outputs when you start a batch scoring job. Use `--output-datastore` to configure any registered datastore, and use `--output-path` to configure the relative path. Use `--set output_file_name` to configure a new output file name.

> [!IMPORTANT]
> You must use a unique output location. If the output file exists, the batch scoring job will fail. 

```azurecli
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv --output-datastore azureml:workspaceblobstore --output-path mypath --set output_file_name=mypredictions.csv
```

### Overwrite settings

Some settings can be overwritten when you start a batch scoring job to make best use of the compute resource and to improve performance: 

* Use `--mini-batch-size` to overwrite `mini_batch_size` if different size of input data is used. 
* Use `--instance-count` to overwrite `instance_count` if different compute resource is needed for this job. 
* Use `--set` to overwrite other settings including `max_retries`, `timeout`, and `error_threshold`.

```azurecli
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv --set retry_settings.max_retries=1
```
:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="start_batch_scoring_job_with_new_settings" :::

## Check batch scoring job execution progress

Batch scoring jobs usually take some time to process the entire set of inputs. You can monitor the job progress from Azure Machine Learning studio. The studio link is provided in the response of `invoke`, as the value of `interactionEndpoints.Studio.endpoint`.

You can also check job details along with status using the Azure CLI.

Get the job name from the invoke response.

```azurecli
job_name=$(az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv --query name -o tsv)
```

Use `job show` to check details and status of a batch scoring job.


:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="check_job_status" :::

Stream the job logs using `job stream`.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="stream_job_logs_to_console" :::


## Check batch scoring results

To view the scoring results:

1. Go to studio
1. Navigate to **Experiments**
1. Navigate to your endpoint's run (the value of `interactionEndpoints.Studio.endpoint` in the response to `endpoint invoke`)
1. In the graph of the run, click inside the `batchscoring` step
1. Choose the Outputs + logs tab and choose **Show data outputs** 
1. Choose the **View output** icon
:::image type="content" source="media/how-to-use-batch-endpoint/view-data-outputs.png" alt-text="Studio screenshot showing view data outputs location" lightbox="media/how-to-use-batch-endpoint/view-data-outputs.png" :::
1. On the popup panel, copy the path and choose the "Open Datastore" link.
1. On the resulting blobstore page, paste the above path into the search box. You'll find the scoring outputs in the folder.
:::image type="content" source="media/how-to-use-batch-endpoint/scoring-view.gif" alt-text="Screencast of opening the score folder and scoring output" lightbox="media/how-to-use-batch-endpoint/scoring-view.gif":::

## Add a deployment to the batch endpoint

One batch endpoint can have multiple deployments. Each deployment hosts one model for batch scoring. 

### Add a new deployment

Use the following command to add a new deployment to an existing batch endpoint.

```azurecli
az ml endpoint update --name mybatchedp --type batch --deployment-file cli/endpoints/batch/add-deployment.yml
```

This sample uses a non-MLflow model. When using non-MLflow, you'll need to specify the environment and a scoring script in the YAML file:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/add-deployment.yml" :::

More deployment attributes for the non-MLflow model:

| Key | Description |
| --- | ----------- |
| code_configuration.code.local_path | The directory that contains all the source code to score the model. |
| code_configuration.scoring_script | The python file in the above directory. This file must have an `init()` function and a `run()` function. Use the `init()` function for any costly or common preparation. For example, use it to load the model into a global object. This function will be called only once at beginning of process. Use `run(mini_batch)` to score each entry; the value of `mini_batch` is a list of file paths. The `run()` method should return a pandas `DataFrame` or an array. These returned elements are appended to the common output file. Each returned output element indicates one successful run of input element in the input mini-batch. Make sure that enough data is included in your run result to map the input to a specific run output result. Run output will be written in output file and is not guaranteed to be in order, so you should use some key in the output to map it to the correct input. |
| environment | The environment to score the model on the compute target. You can define the environment inline by specifying the name, version, and path. Use `conda_file` to include dependencies that will be installed on top of `docker.image`. Use the `azureml:` prefix to reference an existing environment. For instance, `azureml: mnist-env:1` would point to version 1 of an environment named `mnist-env`. |

To review the details of your deployment, run:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="check_batch_endpooint_detail" :::

### Activate the new deployment

For batch inference, you must send 100% of inquiries to the wanted deployment. To set your newly created deployment as the target, use:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="switch_traffic" :::

If you re-examine the details of your deployment, you will see your changes:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="check_batch_endpooint_detail" :::

Now you can invoke a batch scoring job with this new deployment:

```azurecli
az ml endpoint invoke --name mybatchedp --type batch --input-path https://pipelinedata.blob.core.windows.net/sampledata/mnist --mini-batch-size 10 --instance-count 2
```

## Start a batch scoring job using REST

Batch endpoints have scoring URIs for REST access. REST lets you use any HTTP library on any platform to start a batch scoring job.

1. Get the `scoring_uri`:  

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="get_scoring_uri" :::

2. Get the access token:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="get_token" :::


3. Use the `scoring_uri`, the access token, and JSON data to POST a request and start a batch scoring job:

```bash
curl --location --request POST "$scoring_uri" --header "Authorization: Bearer $auth_token" --header 'Content-Type: application/json' --data-raw '{
"properties": {
  "dataset": {
    "dataInputType": "DataUrl",
    "Path": "https://pipelinedata.blob.core.windows.net/sampledata/mnist"
    }
  }
}'
```


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
* [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
