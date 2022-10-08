---
title: 'Use batch endpoints for batch scoring'
titleSuffix: Azure Machine Learning
description: In this article, learn how to create a batch endpoint to continuously batch score large data.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: dem108
ms.author: sehan
ms.reviewer: larryfr
ms.date: 05/24/2022
ms.custom: how-to, devplatv2, event-tier1-build-2022, ignite-2022
#Customer intent: As an ML engineer or data scientist, I want to create an endpoint to host my models for batch scoring, so that I can use the same endpoint continuously for different large datasets on-demand or on-schedule.
---

# Use batch endpoints for batch scoring

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]


Learn how to use batch endpoints to do batch scoring. Batch endpoints simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. For more information, see [What are Azure Machine Learning endpoints?](concept-endpoints.md).

In this article, you learn to do the following tasks:

> [!div class="checklist"]
> * Create a batch endpoint and a default batch deployment
> * Start a batch scoring job using Azure CLI
> * Monitor batch scoring job execution progress and check scoring results
> * Deploy a new MLflow model with auto generated code and environment to an existing endpoint without impacting the existing flow
> * Test the new deployment and set it as the default deployment
> * Delete the not in-use endpoint and deployment



## Prerequisites

* You must have an Azure subscription to use Azure Machine Learning. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Install the Azure CLI and the `ml` extension. Follow the installation steps in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

* Create an Azure resource group if you don't have one, and you (or the service principal you use) must have `Contributor` permission. For resource group creation, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* Create an Azure Machine Learning workspace if you don't have one. For workspace creation, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* Configure your default workspace and resource group for the Azure CLI. Machine Learning CLI commands require the `--workspace/-w` and `--resource-group/-g` parameters. Configure the defaults can avoid passing in the values multiple times. You can override these on the command line. Run the following code to set up your defaults. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

```azurecli
az account set -s "<subscription ID>"
az configure --defaults group="<resource group>" workspace="<workspace name>" location="<location>"
```

### Clone the example repository

Run the following commands to clone the [AzureML Example repository](https://github.com/Azure/azureml-examples) and go to the `cli` directory. This article uses the assets in `/cli/endpoints/batch`, and the end to end working example is `/cli/batch-score.sh`.

```azurecli
git clone https://github.com/Azure/azureml-examples 
cd azureml-examples/cli
```

Set your endpoint name. Replace `YOUR_ENDPOINT_NAME` with a unique name within an Azure region.

For Unix, run this command:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="set_variables" :::

For Windows, run this command:

```azurecli
set ENDPOINT_NAME="<YOUR_ENDPOINT_NAME>"
```

> [!NOTE]
> Batch endpoint names need to be unique within an Azure region. For example, there can be only one batch endpoint with the name mybatchendpoint in westus2.

### Create compute

Batch endpoint runs only on cloud computing resources, not locally. The cloud computing resource is a reusable virtual computer cluster. Run the following code to create an Azure Machine Learning compute cluster. The following examples in this article use the compute created here named `batch-cluster`. Adjust as needed and reference your compute using `azureml:<your-compute-name>`.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="create_compute" :::

> [!NOTE]
> You are not charged for compute at this point as the cluster will remain at 0 nodes until a batch endpoint is invoked and a batch scoring job is submitted. Learn more about [manage and optimize cost for AmlCompute](how-to-manage-optimize-cost.md#use-azure-machine-learning-compute-cluster-amlcompute).

## Understand batch endpoints and batch deployments

A batch endpoint is an HTTPS endpoint that clients can call to trigger a batch scoring job. A batch scoring job is a job that scores multiple inputs (for more, see [What are batch endpoints?](concept-endpoints.md#what-are-batch-endpoints)). A batch deployment is a set of compute resources hosting the model that does the actual batch scoring. One batch endpoint can have multiple batch deployments. 

> [!TIP]
> One of the batch deployments will serve as the default deployment for the endpoint. The default deployment will be used to do the actual batch scoring when the endpoint is invoked. Learn more about [batch endpoints and batch deployment](concept-endpoints.md#what-are-batch-endpoints).

The following YAML file defines a batch endpoint, which you can include in the CLI command for [batch endpoint creation](#create-a-batch-endpoint). In the repository, this file is located at `/cli/endpoints/batch/batch-endpoint.yml`.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/batch-endpoint.yml":::

The following table describes the key properties of the endpoint YAML. For the full batch endpoint YAML schema, see [CLI (v2) batch endpoint YAML schema](./reference-yaml-endpoint-batch.md).

| Key | Description |
| --- | ----------- |
| `$schema` | [Optional] The YAML schema. You can view the schema in the above example in a browser to see all available options for a batch endpoint YAML file. |
| `name` | The name of the batch endpoint. Needs to be unique at the Azure region level.|
| `auth_mode` | The authentication method for the batch endpoint. Currently only Azure Active Directory token-based authentication (`aad_token`) is supported. |
| `defaults.deployment_name` | The name of the deployment that will serve as the default deployment for the endpoint. |

To create a batch deployment, you need all the following items:
* Model files, or a registered model in your workspace referenced using `azureml:<model-name>:<model-version>`. 
* The code to score the model.
* The environment in which the model runs. It can be a Docker image with Conda dependencies, or an environment already registered in your workspace referenced using `azureml:<environment-name>:<environment-version>`.
* The pre-created compute referenced using `azureml:<compute-name>` and resource settings.

For more information about how to reference an Azure ML entity, see [Referencing an Azure ML entity](reference-yaml-core-syntax.md#referencing-an-azure-ml-entity).

The example repository contains all the required files. The following YAML file defines a batch deployment with all the required inputs and optional settings. You can include this file in your CLI command to [create your batch deployment](#create-a-batch-deployment). In the repository, this file is located at `/cli/endpoints/batch/nonmlflow-deployment.yml`.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/nonmlflow-deployment.yml":::

For the full batch deployment YAML schema, see [CLI (v2) batch deployment YAML schema](./reference-yaml-deployment-batch.md).

| Key | Description |
| --- | ----------- |
| `$schema` | [Optional] The YAML schema. You can view the schema in the above example in a browser to see all available options for a batch deployment YAML file. |
| `name` | The name of the deployment. |
| `endpoint_name` | The name of the endpoint to create the deployment under. |
| `model` | The model to be used for batch scoring. The example defines a model inline using `path`. Model files will be automatically uploaded and registered with an autogenerated name and version. Follow the [Model schema](reference-yaml-model.md#yaml-syntax) for more options. As a best practice for production scenarios, you should create the model separately and reference it here. To reference an existing model, use the `azureml:<model-name>:<model-version>` syntax. |
| `code_configuration.code.path` | The local directory that contains all the Python source code to score the model. |
| `code_configuration.scoring_script` | The Python file in the above directory. This file must have an `init()` function and a `run()` function. Use the `init()` function for any costly or common preparation (for example, load the model in memory). `init()` will be called only once at beginning of process. Use `run(mini_batch)` to score each entry; the value of `mini_batch` is a list of file paths. The `run()` function should return a pandas DataFrame or an array. Each returned element indicates one successful run of input element in the `mini_batch`. For more information on how to author scoring script, see [Understanding the scoring script](how-to-use-batch-endpoint.md#understanding-the-scoring-script). |
| `environment` | The environment to score the model. The example defines an environment inline using `conda_file` and `image`. The `conda_file` dependencies will be installed on top of the `image`. The environment will be automatically registered with an autogenerated name and version. Follow the [Environment schema](reference-yaml-environment.md#yaml-syntax) for more options. As a best practice for production scenarios, you should create the environment separately and reference it here. To reference an existing environment, use the `azureml:<environment-name>:<environment-version>` syntax. |
| `compute` | The compute to run batch scoring. The example uses the `batch-cluster` created at the beginning and reference it using `azureml:<compute-name>` syntax. |
| `resources.instance_count` | The number of instances to be used for each batch scoring job. |
| `max_concurrency_per_instance` | [Optional] The maximum number of parallel `scoring_script` runs per instance. |
| `mini_batch_size` | [Optional] The number of files the `scoring_script` can process in one `run()` call. |
| `output_action` | [Optional] How the output should be organized in the output file. `append_row` will merge all `run()` returned output results into one single file named `output_file_name`. `summary_only` won't merge the output results and only calculate `error_threshold`. |
| `output_file_name` | [Optional] The name of the batch scoring output file for `append_row` `output_action`. |
| `retry_settings.max_retries` | [Optional] The number of max tries for a failed `scoring_script` `run()`. |
| `retry_settings.timeout` | [Optional] The timeout in seconds for a `scoring_script` `run()` for scoring a mini batch. |
| `error_threshold` | [Optional] The number of input file scoring failures that should be ignored. If the error count for the entire input goes above this value, the batch scoring job will be terminated. The example uses `-1`, which indicates that any number of failures is allowed without terminating the batch scoring job. | 
| `logging_level` | [Optional] Log verbosity. Values in increasing verbosity are: WARNING, INFO, and DEBUG. |

###  Understanding the scoring script

As mentioned earlier, the `code_configuration.scoring_script` must contain two functions:

- `init()`: Use this function for any costly or common preparation. For example, use it to load the model into a global object. This function will be called once at the beginning of the process.
-  `run(mini_batch)`: This function will be called for each `mini_batch` and do the actual scoring. 
    -  `mini_batch`: The `mini_batch` value is a list of file paths.
    -  `response`: The `run()` method should return a pandas DataFrame or an array. Each returned output element indicates one successful run of an input element in the input `mini_batch`. Make sure that enough data is included in your `run()` response to correlate the input with the output. The resulting DataFrame or array is populated according to this scoring script. It's up to you how much or how little information you’d like to output to correlate output values with the input value, for example, the array can represent a list of tuples containing both the model's output and input. There's no requirement on the cardinality of the results. All elements in the result DataFrame or array will be written to the output file as-is (given that the `output_action` isn't `summary_only`).

The example uses `/cli/endpoints/batch/mnist/code/digit_identification.py`. The model is loaded in `init()` from `AZUREML_MODEL_DIR`, which is the path to the model folder created during deployment. `run(mini_batch)` iterates each file in `mini_batch`, does the actual model scoring and then returns output results.

## Deploy with batch endpoints and run batch scoring

Now, let's deploy the model with batch endpoints and run batch scoring.

### Create a batch endpoint

The simplest way to create a batch endpoint is to run the following code providing only a `--name`.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="create_batch_endpoint" :::

You can also create a batch endpoint using a YAML file. Add `--file` parameter in above command and specify the YAML file path.

### Create a batch deployment

Run the following code to create a batch deployment named `nonmlflowdp` under the batch endpoint and set it as the default deployment. 

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="create_batch_deployment_set_default" :::

> [!TIP]
> The `--set-default` parameter sets the newly created deployment as the default deployment of the endpoint. It's a convenient way to create a new default deployment of the endpoint, especially for the first deployment creation. As a best practice for production scenarios, you may want to create a new deployment without setting it as default, verify it, and update the default deployment later. For more information, see the [Deploy a new model](#deploy-a-new-model) section.

### Check batch endpoint and deployment details

Use `show` to check endpoint and deployment details.

To check a batch deployment, run the following code:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="check_batch_deployment_detail" :::

To check a batch endpoint, run the following code. As the newly created deployment is set as the default deployment, you should see `nonmlflowdp` in `defaults.deployment_name` from the response.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="check_batch_endpooint_detail" :::

### Invoke the batch endpoint to start a batch scoring job

Invoke a batch endpoint triggers a batch scoring job. A job `name` will be returned from the invoke response and can be used to track the batch scoring progress. The batch scoring job runs for a period of time. It splits the entire inputs into multiple `mini_batch` and processes in parallel on the compute cluster. One `scoring_script` `run()` takes one `mini_batch` and processes it by a process on an instance. The batch scoring job outputs will be stored in cloud storage, either in the workspace's default blob storage, or the storage you specified.

#### Invoke the batch endpoint with different input options

You can either use CLI or REST to `invoke` the endpoint. For REST experience, see [Use batch endpoints with REST](how-to-deploy-batch-with-rest.md)

There are several options to specify the data inputs in CLI `invoke`.

* __Option 1-1: Data in the cloud__

    Use `--input` and `--input-type` to specify a file or folder on an Azure Machine Learning registered datastore or a publicly accessible path. When you're specifying a single file, use `--input-type uri_file`, and when you're specifying a folder, use `--input-type uri_folder`). 

    When the file or folder is on Azure ML registered datastore, the syntax for the URI is `azureml://datastores/<datastore-name>/paths/<path-on-datastore>/` for folder, and `azureml://datastores/<datastore-name>/paths/<path-on-datastore>/<file-name>` for a specific file. When the file of folder is on a publicly accessible path, the syntax for the URI is `https://<public-path>/` for folder, `https://<public-path>/<file-name>` for a specific file.

    For more information about data URI, see [Azure Machine Learning data reference URI](reference-yaml-core-syntax.md#azure-ml-data-reference-uri).

    The example uses publicly available data in a folder from `https://pipelinedata.blob.core.windows.net/sampledata/mnist`, which contains thousands of hand-written digits. Name of the batch scoring job will be returned from the invoke response. Run the following code to invoke the batch endpoint using this data. `--query name` is added to only return the job name from the invoke response, and it will be used later to [Monitor batch scoring job execution progress](#monitor-batch-scoring-job-execution-progress) and [Check batch scoring results](#check-batch-scoring-results). Remove `--query name -o tsv` if you want to see the full invoke response. For more information on the `--query` parameter, see [Query Azure CLI command output](/cli/azure/query-azure-cli).

    :::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="start_batch_scoring_job" :::

* __Option 1-2: Registered data asset__

    Use `--input` to pass in an Azure Machine Learning registered V2 data asset (with the type of either `uri_file` or `url_folder`). You don't need to specify `--input-type` in this option. The syntax for this option is `azureml:<dataset-name>:<dataset-version>`.

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input azureml:<dataset-name>:<dataset-version>
    ```

* __Option 2: Data stored locally__

    Use `--input` to pass in data files stored locally. You don't need to specify `--input-type` in this option. The data files will be automatically uploaded as a folder to Azure ML datastore, and passed to the batch scoring job.

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input <local-path>
    ```

> [!NOTE]
> - If you are using existing V1 FileDataset for batch endpoint, we recommend migrating them to V2 data assets and refer to them directly when invoking batch endpoints. Currently only data assets of type `uri_folder` or `uri_file` are supported. Batch endpoints created with GA CLIv2 (2.4.0 and newer) or GA REST API (2022-05-01 and newer) will not support V1 Dataset.
> - You can also extract the URI or path on datastore extracted from V1 FileDataset by using `az ml dataset show` command with `--query` parameter and use that information for invoke.
> - While Batch endpoints created with earlier APIs will continue to support V1 FileDataset, we will be adding further V2 data assets support with the latest API versions for even more usability and flexibility. For more information on V2 data assets, see [Work with data using SDK v2](how-to-read-write-data-v2.md). For more information on the new V2 experience, see [What is v2](concept-v2.md).

#### Configure the output location and overwrite settings

The batch scoring results are by default stored in the workspace's default blob store within a folder named by job name (a system-generated GUID). You can configure where to store the scoring outputs when you invoke the batch endpoint. Use `--output-path` to configure any folder in an Azure Machine Learning registered datastore. The syntax for the `--output-path` is the same as `--input` when you're specifying a folder, that is, `azureml://datastores/<datastore-name>/paths/<path-on-datastore>/`. The prefix `folder:` isn't required anymore. Use `--set output_file_name=<your-file-name>` to configure a new output file name if you prefer having one output file containing all scoring results (specified `output_action=append_row` in your deployment YAML).

> [!IMPORTANT]
> You must use a unique output location. If the output file exists, the batch scoring job will fail. 

Some settings can be overwritten when invoke to make best use of the compute resources and to improve performance: 

* Use `--instance-count` to overwrite `instance_count`. For example, for larger volume of data inputs, you may want to use more instances to speed up the end to end batch scoring.
* Use `--mini-batch-size` to overwrite `mini_batch_size`. The number of mini batches is decided by total input file counts and mini_batch_size. Smaller mini_batch_size generates more mini batches. Mini batches can be run in parallel, but there might be extra scheduling and invocation overhead. 
* Use `--set` to overwrite other settings including `max_retries`, `timeout`, and `error_threshold`. These settings might impact the end to end batch scoring time for different workloads.

To specify the output location and overwrite settings when invoke, run the following code. The example stores the outputs in a folder with the same name as the endpoint in the workspace's default blob storage, and also uses a random file name to ensure the output location uniqueness. The code should work in Unix. Replace with your own unique folder and file name.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="start_batch_scoring_job_configure_output_settings" :::

### Monitor batch scoring job execution progress

Batch scoring jobs usually take some time to process the entire set of inputs. 

You can use CLI `job show` to view the job. Run the following code to check job status from the previous endpoint invoke. To learn more about job commands, run `az ml job -h`.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="check_job_status" :::

### Check batch scoring results

Follow the below steps to view the scoring results in Azure Storage Explorer when the job is completed:

1. Run the following code to open batch scoring job in Azure Machine Learning studio. The job studio link is also included in the response of `invoke`, as the value of `interactionEndpoints.Studio.endpoint`.

    :::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="show_job_in_studio" :::

1. In the graph of the job, select the `batchscoring` step.
1. Select the __Outputs + logs__ tab and then select **Show data outputs**.
1. From __Data outputs__, select the icon to open __Storage Explorer__.

:::image type="content" source="media/how-to-use-batch-endpoint/view-data-outputs.png" alt-text="Studio screenshot showing view data outputs location" lightbox="media/how-to-use-batch-endpoint/view-data-outputs.png" :::

The scoring results in Storage Explorer are similar to the following sample page:

:::image type="content" source="media/how-to-use-batch-endpoint/scoring-view.png" alt-text="Screenshot of the scoring output" lightbox="media/how-to-use-batch-endpoint/scoring-view.png":::

## Deploy a new model

Once you have a batch endpoint, you can continue to refine your model and add new deployments.

### Create a new batch deployment hosting an MLflow model

To create a new batch deployment under the existing batch endpoint but not set it as the default deployment, run the following code:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="create_new_deployment_not_default" :::

Notice that `--set-default` isn't used. If you `show` the batch endpoint again, you should see no change of the `defaults.deployment_name`. 

The example uses a model (`/cli/endpoints/batch/autolog_nyc_taxi`) trained and tracked with MLflow. `scoring_script` and `environment` can be auto generated using model's metadata, no need to specify in the YAML file. For more about MLflow, see [Train and track ML models with MLflow and Azure Machine Learning](how-to-use-mlflow.md).

Below is the YAML file the example uses to deploy an MLflow model, which only contains the minimum required properties. The source file in repository is `/cli/endpoints/batch/mlflow-deployment.yml`.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/mlflow-deployment.yml":::

> [!NOTE]
> `scoring_script` and `environment` auto generation only supports Python Function model flavor and column-based model signature.

### Test a non-default batch deployment

To test the new non-default deployment, run the following code. The example uses a different model that accepts a publicly available csv file from `https://pipelinedata.blob.core.windows.net/sampledata/nytaxi/taxi-tip-data.csv`.

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="test_new_deployment" :::

Notice `--deployment-name` is used to specify the new deployment name. This parameter allows you to `invoke` a non-default deployment, and it will not update the default deployment of the batch endpoint.

### Update the default batch deployment

To update the default batch deployment of the endpoint, run the following code:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="update_default_deployment" :::

Now, if you `show` the batch endpoint again, you should see `defaults.deployment_name` is set to `mlflowdp`. You can `invoke` the batch endpoint directly without the `--deployment-name` parameter.

### (Optional) Update the deployment

If you want to update the deployment (for example, update code, model, environment, or settings), update the YAML file, and then run `az ml batch-deployment update`. You can also update without the YAML file by using `--set`. Check `az ml batch-deployment update -h` for more information.

## Delete the batch endpoint and the deployment

If you aren't going to use the old batch deployment, you should delete it by running the following code. `--yes` is used to confirm the deletion.

::: code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="delete_deployment" :::

Run the following code to delete the batch endpoint and all the underlying deployments. Batch scoring jobs won't be deleted.

::: code language="azurecli" source="~/azureml-examples-main/cli/batch-score.sh" ID="delete_endpoint" :::

## Next steps

* [Batch endpoints in studio](how-to-use-batch-endpoints-studio.md)
* [Deploy models with REST for batch scoring](how-to-deploy-batch-with-rest.md)
* [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)
