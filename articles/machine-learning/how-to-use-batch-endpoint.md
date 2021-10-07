---
title: 'Use batch endpoints for batch scoring'
titleSuffix: Azure Machine Learning
description: In this article, learn how to create a batch endpoint to continuously batch score large data.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: tracych
ms.author: tracych
ms.reviewer: laobri
ms.date: 10/01/2021
ms.custom: how-to, devplatv2

# Customer intent: As an ML engineer or data scientist, I want to create an endpoint to host my models for batch scoring, so that I can use the same endpoint continuously for different large datasets on-demand or on-schedule.
---

# Use batch endpoints (preview) for batch scoring

In this article, you learn how to use batch endpoints (preview) to do batch scoring. Batch endpoints simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. After you create a batch endpoint, you can trigger batch scoring jobs with the Azure CLI or from any platform using an HTTP library and the REST API. For more, see [What are Azure Machine Learning endpoints (preview)?](concept-endpoints.md)

In this article, you learn to do the following tasks:

> [!div class="checklist"]
> * Create a batch endpoint and a default batch deployment
> * Start a batch scoring job using Azure CLI
> * Monitor batch scoring job execution progress and check scoring results
> * Use a no-code experience to deploy an MLflow model
> * Test a new deployment and set it as the default deployment
> * Consume a batch endpoint using REST

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure subscription
If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Install and configure the Azure CLI and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md).

* Create an Azure resource group and an Azure Machine Learning workspace if you don't have one. Set up your default setting for the Azure CLI to avoid passing in the values for your subscription, workspace, and resource group multiple times. For more information, see [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md).

* The example repository

Clone the [AzureML Example repository](https://github.com/Azure/azureml-examples). This article uses the assets in `/cli/endpoints/batch`.

## Create a compute target

Batch scoring runs only on cloud computing resources, not locally. The cloud computing resource is a reusable virtual computer cluster where you can run batch scoring workflows.

Run the following code to create a general purpose [`AmlCompute`](/python/api/azureml-core/azureml.core.compute.amlcompute(class)?view=azure-ml-py&preserve-view=true) target. For more information about compute targets, see [What are compute targets in Azure Machine Learning?](./concept-compute-target.md).

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="create_compute" :::

## Create a batch endpoint

Create a batch endpoint using the following code. `auth_mode` defaults to `aad_token`.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="create_batch_endpoint" :::

You can also create a batch endpoint using a YAML file. For more information on the batch endpoint YAML schema, see [CLI (v2) batch endpoint YAML schema](./reference-yaml-endpoint-batch.md).

> [!NOTE]
> Batch endpoint names must be unique within an Azure region. For example, in the Azure westus2 region, there can be only batch one endpoint with the name `mybatchendpoint`.

## Check batch endpoint details

After a batch endpoint is created, you can use `show` to check the details. Use the [`--query parameter`](/cli/azure/query-azure-cli) to get only specific attributes from the returned data.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="check_batch_endpooint_detail" :::

## Create a batch deployment

Create a batch deployment under the batch endpoint and set it as the default deployment.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="create_batch_deployment_set_default" :::

Below is the YAML file defining the batch deployment:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/batch/nonmlflow-deployment.yml":::

For more information on the batch deployment YAML schema, see [CLI (v2) batch deployment YAML schema](./reference-yaml-deployment-batch.md).

## Check batch deployment details

After a batch deployment is created, you can use `show` to check the details. Use the [`--query parameter`](/cli/azure/query-azure-cli) to get only specific attributes from the returned data.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="check_batch_deployment_detail" :::

## Start a batch scoring job using the Azure CLI

A batch scoring workload runs as an offline job. Batch scoring is designed to process large data. Inputs are processed in parallel on the compute cluster. A data partition is assigned to a process on a node. A single node with multiple processes will have multiple partitions run in parallel. By default, batch scoring stores the scoring outputs in blob storage. You can start a batch scoring job using the Azure CLI by passing in the data inputs. You can also configure the outputs location and overwrite some of the settings to get the best performance.

### Start a batch scoring job with different input options

You have three options to specify the data inputs.

Option 1: Registered dataset

Use `--input-dataset` to pass in an AML registered data.

> [!NOTE]
> During Preview, only FileDataset is supported. 

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME --input-dataset azureml:<datasetName>:<datasetVersion>
```

Option 2: Data in the cloud

Use `--input-path` to specify a folder or a file in an AML registered datastore or publicly available datastore.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="start_batch_scoring_job" :::

Option 3: Data stored locally

Use `--input-local-path` to pass in data stored locally.

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME --input-local-path <localPath>
```

### Configure the output location and overwrite settings

The batch scoring results are by default stored in the workspace's default blob store within a folder named by Job Name (a system-generated GUID). You can configure where to store the scoring outputs when you start a batch scoring job. Use `--output-path` to configure any folder in an AML registered datastore. Use `--set output_file_name` to configure a new output file name if you prefer having one output file containing all scoring results (specify `output_action=append_row` in your deployment YAML).

> [!IMPORTANT]
> You must use a unique output location. If the output file exists, the batch scoring job will fail. 

Some settings can be overwritten when you start a batch scoring job to make best use of the compute resource and to improve performance: 

* Use `--mini-batch-size` to overwrite `mini_batch_size` if different size of input data is used. 
* Use `--instance-count` to overwrite `instance_count` if different compute resource is needed for this job. 
* Use `--set` to overwrite other settings including `max_retries`, `timeout`, and `error_threshold`.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="start_batch_scoring_job_configure_output_settings" :::

## Check batch scoring job execution progress

Batch scoring jobs usually take some time to process the entire set of inputs. You will get the job name from the invoke response. 

You can monitor the job progress from Azure Machine Learning studio. Run the following command to open the job in studio. The studio link is provided in the response of `invoke`, as the value of `interactionEndpoints.Studio.endpoint`.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="show_job_in_studio" :::

You can also monitor job status using `job show`.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="check_job_status" :::

Stream the job logs using `job stream`.

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="stream_job_logs_to_console" :::

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

## Deploy a new model

Once you have an endpoint, you can continue to refine your model and add new deployments.

### Create a new batch deployment hosting an MLflow model

If you're using an MLflow model, you can use no-code batch deployment creation. That is, you don't need to prepare a scoring script and environment, both can be auto generated. For more, see [Train and track ML models with MLflow and Azure Machine Learning (preview)](how-to-use-mlflow.md).

Use the following command to create a new batch deployment under an existing batch endpoint, but not set as the default deployment:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="create_new_deployment_not_default" :::

Below is the YAML file defining the MLFlow batch deployment:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/batch/mlflow-deployment.yml":::

> [Note]
> One batch endpoint can have multiple deployments. Each deployment hosts one model for batch scoring. 

### Test the new batch deployment

Before switching the default deployment, you can run the following commands to test it:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="test_new_deployment" :::

### Switch the default batch deployment

If the new deployment works as expected, you can now switch the default batch deployment for the batch endpoint by running the following command:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="update_default_deployment" :::

If you re-examine the details of your deployment, you will see your changes:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="check_batch_endpooint_detail" :::

Now, you can invoke a batch scoring job with this new default deployment:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="test_new_default_deployment" :::

## Start a batch scoring job using REST

Batch endpoints have scoring URIs for REST access. REST lets you use any HTTP library on any platform to start a batch scoring job.

1. Get the `scoring_uri`:  

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="get_scoring_uri" :::

2. Get the access token:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="get_token" :::


3. Use the `scoring_uri`, the access token, and JSON data to POST a request and start a batch scoring job:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="start_batch_scoring_job_rest":::

## Delete the endpoint and the deployment

If you aren't going use the batch endpoint, you should delete it by running the following code (it deletes the batch endpoint and all the underlying batch deployments):

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/batch-score.sh" ID="delete_endpoint" :::

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
