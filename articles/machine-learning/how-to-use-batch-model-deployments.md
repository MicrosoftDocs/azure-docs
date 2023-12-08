---
title: 'Deploy models for scoring in batch endpoints'
titleSuffix: Azure Machine Learning
description: In this article, learn how to create a batch endpoint to continuously batch score large data.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.date: 11/04/2022
ms.custom: how-to, devplatv2
#Customer intent: As an ML engineer or data scientist, I want to create an endpoint to host my models for batch scoring, so that I can use the same endpoint continuously for different large datasets on-demand or on-schedule.
---

# Deploy models for scoring in batch endpoints

[!INCLUDE [cli v2](includes/machine-learning-dev-v2.md)]

Batch endpoints provide a convenient way to deploy models to run inference over large volumes of data. They simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. We call this type of deployments *model deployments*.

Use batch endpoints to deploy models when:

> [!div class="checklist"]
> * You have expensive models that requires a longer time to run inference.
> * You need to perform inference over large amounts of data, distributed in multiple files.
> * You don't have low latency requirements.
> * You can take advantage of parallelization.

In this article, you'll learn how to use batch endpoints to deploy a machine learning model to perform inference.

## About this example

In this example, we're going to deploy a model to solve the classic MNIST ("Modified National Institute of Standards and Technology") digit recognition problem to perform batch inferencing over large amounts of data (image files). In the first section of this tutorial, we're going to create a batch deployment with a model created using Torch. Such deployment will become our default one in the endpoint. In the second half, [we're going to see how we can create a second deployment](#adding-deployments-to-an-endpoint) using a model created with TensorFlow (Keras), test it out, and then switch the endpoint to start using the new deployment as default.

[!INCLUDE [machine-learning-batch-clone](includes/azureml-batch-clone-samples-with-studio.md)]

The files for this example are in:

```azurecli
cd endpoints/batch/deploy-models/mnist-classifier
```

### Follow along in Jupyter Notebooks

You can follow along this sample in the following notebooks. In the cloned repository, open the notebook: [mnist-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb).

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs-studio](includes/azureml-batch-prereqs-with-studio.md)]

### Create compute

Batch endpoints run on compute clusters. They support both [Azure Machine Learning Compute clusters (AmlCompute)](./how-to-create-attach-compute-cluster.md) or [Kubernetes clusters](./how-to-attach-kubernetes-anywhere.md). Clusters are a shared resource so one cluster can host one or many batch deployments (along with other workloads if desired).

This article uses a compute created here named `batch-cluster`. Adjust as needed and reference your compute using `azureml:<your-compute-name>` or create one as shown.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="create_compute" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=create_compute)]

# [Studio](#tab/studio)

*Create a compute cluster as explained in the following tutorial [Create an Azure Machine Learning compute cluster](./how-to-create-attach-compute-cluster.md?tabs=studio).*

---

> [!NOTE]
> You are not charged for compute at this point as the cluster will remain at 0 nodes until a batch endpoint is invoked and a batch scoring job is submitted. Learn more about [manage and optimize cost for AmlCompute](./how-to-manage-optimize-cost.md#use-azure-machine-learning-compute-cluster-amlcompute).


## Create a batch endpoint

A batch endpoint is an HTTPS endpoint that clients can call to trigger a batch scoring job. A batch scoring job is a job that scores multiple inputs (for more, see [What are batch endpoints?](concept-endpoints-batch.md)). A batch deployment is a set of compute resources hosting the model that does the actual batch scoring. One batch endpoint can have multiple batch deployments.

> [!TIP]
> One of the batch deployments will serve as the default deployment for the endpoint. The default deployment will be used to do the actual batch scoring when the endpoint is invoked. Learn more about [batch endpoints and batch deployment](concept-endpoints-batch.md).

### Steps

1. Decide on the name of the endpoint. The name of the endpoint will end-up in the URI associated with your endpoint. Because of that, __batch endpoint names need to be unique within an Azure region__. For example, there can be only one batch endpoint with the name `mybatchendpoint` in `westus2`.

    # [Azure CLI](#tab/cli)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="name_endpoint" :::
    
    # [Python](#tab/python)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=name_endpoint)]
    
    # [Studio](#tab/studio)
    
    *You'll configure the name of the endpoint later in the creation wizard.*
    

1. Configure your batch endpoint

    # [Azure CLI](#tab/cli)

    The following YAML file defines a batch endpoint, which you can include in the CLI command for [batch endpoint creation](#create-a-batch-endpoint).
    
    __endpoint.yml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/endpoint.yml":::

    The following table describes the key properties of the endpoint. For the full batch endpoint YAML schema, see [CLI (v2) batch endpoint YAML schema](./reference-yaml-endpoint-batch.md).
    
    | Key | Description |
    | --- | ----------- |
    | `name` | The name of the batch endpoint. Needs to be unique at the Azure region level.|
    | `description` | The description of the batch endpoint. This property is optional. |
    | `tags` | The tags to include in the endpoint. This property is optional.
    
    # [Python](#tab/python)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=configure_endpoint)]
    
    | Key | Description |
    | --- | ----------- |
    | `name` | The name of the batch endpoint. Needs to be unique at the Azure region level.|
    | `description` | The description of the batch endpoint. This property is optional. |
    | `tags` | The tags to include in the endpoint. This property is optional. |
    
    # [Studio](#tab/studio)
    
    *You'll create the endpoint in the same step you create the deployment.*
    

1. Create the endpoint:

    # [Azure CLI](#tab/cli)
    
    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="create_endpoint" :::

    # [Python](#tab/python)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=create_endpoint)]

    # [Studio](#tab/studio)
    
    *You'll create the endpoint in the same step you are creating the deployment later.*

## Create a batch deployment

A model deployment is a set of resources required for hosting the model that does the actual inferencing. To create a batch model deployment, you need all the following items:

* A registered model in the workspace.
* The code to score the model.
* The environment with the model's dependencies installed.
* The pre-created compute and resource settings.

1. Let's start by registering the model we want to deploy. Batch Deployments can only deploy models registered in the workspace. You can skip this step if the model you're trying to deploy is already registered. In this case, we're registering a Torch model for the popular digit recognition problem (MNIST).

    > [!TIP]
    > Models are associated with the deployment rather than with the endpoint. This means that a single endpoint can serve different models or different model versions under the same endpoint as long as they are deployed in different deployments.

   
    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="register_model" :::

    # [Python](#tab/python)

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=register_model)]

    # [Studio](#tab/studio)

    1. Navigate to the __Models__ tab on the side menu.

    1. Select __Register__ > __From local files__.

    1. In the wizard, leave the option *Model type* as __Unspecified type__.

    1. Select __Browse__ > __Browse folder__ > Select the folder `deployment-torch/model` > __Next__.

    1. Configure the name of the model: `mnist-classifier-torch`. You can leave the rest of the fields as they are.

    1. Select __Register__.

1. Now it's time to create a scoring script. Batch deployments require a scoring script that indicates how a given model should be executed and how input data must be processed. Batch Endpoints support scripts created in Python. In this case, we're deploying a model that reads image files representing digits and outputs the corresponding digit. The scoring script is as follows:

    > [!NOTE]
    > For MLflow models, Azure Machine Learning automatically generates the scoring script, so you're not required to provide one. If your model is an MLflow model, you can skip this step. For more information about how batch endpoints work with MLflow models, see the dedicated tutorial [Using MLflow models in batch deployments](how-to-mlflow-batch.md).

    > [!WARNING]
    > If you're deploying an Automated ML model under a batch endpoint, notice that the scoring script that Automated ML provides only works for online endpoints and is not designed for batch execution. Please see [Author scoring scripts for batch deployments](how-to-batch-scoring-script.md) to learn how to create one depending on what your model does.

    __deployment-torch/code/batch_driver.py__

    :::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-torch/code/batch_driver.py" :::

1. Create an environment where your batch deployment will run. Such environment needs to include the packages `azureml-core` and `azureml-dataset-runtime[fuse]`, which are required by batch endpoints, plus any dependency your code requires for running. In this case, the dependencies have been captured in a `conda.yaml`:
    
    __deployment-torch/environment/conda.yaml__
        
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-torch/environment/conda.yaml":::
    
    > [!IMPORTANT]
    > The packages `azureml-core` and `azureml-dataset-runtime[fuse]` are required by batch deployments and should be included in the environment dependencies.
    
    Indicate the environment as follows:
    
    # [Azure CLI](#tab/cli)
   
    The environment definition will be included in the deployment definition itself as an anonymous environment. You'll see in the following lines in the deployment:
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-torch/deployment.yml" range="12-15":::
   
    # [Python](#tab/python)
   
    Let's get a reference to the environment:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=configure_environment)]

    # [Studio](#tab/studio)
    
    On [Azure Machine Learning studio portal](https://ml.azure.com), follow these steps:
    
    1. Navigate to the __Environments__ tab on the side menu.
    
    1. Select the tab __Custom environments__ > __Create__.
    
    1. Enter the name of the environment, in this case `torch-batch-env`.
    
    1. On __Select environment type__ select __Use existing docker image with conda__.
    
    1. On __Container registry image path__, enter `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04`.
    
    1. On __Customize__ section copy the content of the file `deployment-torch/environment/conda.yaml` included in the repository into the portal. 
    
    1. Select __Next__ and then on __Create__.
    
    1. The environment is ready to be used.
    
    ---
    
    > [!WARNING]
    > Curated environments are not supported in batch deployments. You will need to indicate your own environment. You can always use the base image of a curated environment as yours to simplify the process.

1. Create a deployment definition

    # [Azure CLI](#tab/cli)
    
    __deployment-torch/deployment.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-torch/deployment.yml":::
    
    For the full batch deployment YAML schema, see [CLI (v2) batch deployment YAML schema](./reference-yaml-deployment-batch.md).
    
    | Key | Description |
    | --- | ----------- |
    | `name` | The name of the deployment. |
    | `endpoint_name` | The name of the endpoint to create the deployment under. |
    | `model` | The model to be used for batch scoring. The example defines a model inline using `path`. Model files will be automatically uploaded and registered with an autogenerated name and version. Follow the [Model schema](./reference-yaml-model.md#yaml-syntax) for more options. As a best practice for production scenarios, you should create the model separately and reference it here. To reference an existing model, use the `azureml:<model-name>:<model-version>` syntax. |
    | `code_configuration.code` | The local directory that contains all the Python source code to score the model. |
    | `code_configuration.scoring_script` | The Python file in the above directory. This file must have an `init()` function and a `run()` function. Use the `init()` function for any costly or common preparation (for example, load the model in memory). `init()` will be called only once at beginning of process. Use `run(mini_batch)` to score each entry; the value of `mini_batch` is a list of file paths. The `run()` function should return a pandas DataFrame or an array. Each returned element indicates one successful run of input element in the `mini_batch`. For more information on how to author scoring script, see [Understanding the scoring script](how-to-batch-scoring-script.md#understanding-the-scoring-script). |
    | `environment` | The environment to score the model. The example defines an environment inline using `conda_file` and `image`. The `conda_file` dependencies will be installed on top of the `image`. The environment will be automatically registered with an autogenerated name and version. Follow the [Environment schema](./reference-yaml-environment.md#yaml-syntax) for more options. As a best practice for production scenarios, you should create the environment separately and reference it here. To reference an existing environment, use the `azureml:<environment-name>:<environment-version>` syntax. |
    | `compute` | The compute to run batch scoring. The example uses the `batch-cluster` created at the beginning and references it using `azureml:<compute-name>` syntax. |
    | `resources.instance_count` | The number of instances to be used for each batch scoring job. |
    | `settings.max_concurrency_per_instance` | [Optional] The maximum number of parallel `scoring_script` runs per instance. |
    | `settings.mini_batch_size` | [Optional] The number of files the `scoring_script` can process in one `run()` call. |
    | `settings.output_action` | [Optional] How the output should be organized in the output file. `append_row` will merge all `run()` returned output results into one single file named `output_file_name`. `summary_only` won't merge the output results and only calculate `error_threshold`. |
    | `settings.output_file_name` | [Optional] The name of the batch scoring output file for `append_row` `output_action`. |
    | `settings.retry_settings.max_retries` | [Optional] The number of max tries for a failed `scoring_script` `run()`. |
    | `settings.retry_settings.timeout` | [Optional] The timeout in seconds for a `scoring_script` `run()` for scoring a mini batch. |
    | `settings.error_threshold` | [Optional] The number of input file scoring failures that should be ignored. If the error count for the entire input goes above this value, the batch scoring job will be terminated. The example uses `-1`, which indicates that any number of failures is allowed without terminating the batch scoring job. | 
    | `settings.logging_level` | [Optional] Log verbosity. Values in increasing verbosity are: WARNING, INFO, and DEBUG. |
    | `settings.environment_variables` | [Optional] Dictionary of environment variable name-value pairs to set for each batch scoring job.  |
    
    # [Python](#tab/python)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=configure_deployment)]
    
    This class allows user to configure the following key aspects:

    | Key | Description |
    | --- | ----------- |
    | `name` | Name of the deployment. |
    | `endpoint_name` | Name of the endpoint to create the deployment under. |
    | `model` | The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification. |
    | `environment` | The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification  (optional for MLflow models).  |
    | `code_configuration` | The configuration about how to run inference for the model (optional for MLflow models).  | 
    | `code_configuration.code` | Path to the source code directory for scoring the model  | 
    | `code_configuration.scoring_script` | Relative path to the scoring file in the source code directory |
    | `compute` | Name of the compute target to execute the batch scoring jobs on |
    | `instance_count` | The number of nodes to use for each batch scoring job. |
    | `settings` | The model deployment inference configuration |
    | `settings.max_concurrency_per_instance` | The maximum number of parallel scoring_script runs per instance.
    | `settings.mini_batch_size` | The number of files the code_configuration.scoring_script can process in one `run`() call.
    | `settings.retry_settings` | Retry settings for scoring each mini batch. |
    | `settings.retry_settingsmax_retries` | The maximum number of retries for a failed or timed-out mini batch (default is 3) |
    | `settings.retry_settingstimeout` | The timeout in seconds for scoring a mini batch (default is 30) |
    | `settings.output_action` | Indicates how the output should be organized in the output file. Allowed values are `append_row` or `summary_only`. Default is `append_row` |
    | `settings.logging_level` | The log verbosity level. Allowed values are `warning`, `info`, `debug`. Default is `info`. |
    | `settings.environment_variables` | Dictionary of environment variable name-value pairs to set for each batch scoring job.  |

    # [Studio](#tab/studio)
   
    On [Azure Machine Learning studio portal](https://ml.azure.com), follow these steps:
    
    1. Navigate to the __Endpoints__ tab on the side menu.
    
    1. Select the tab __Batch endpoints__ > __Create__.
    
    1. Give the endpoint a name, in this case `mnist-batch`. You can configure the rest of the fields or leave them blank.
    
    1. Select __Next__.
    
    1. On the model list, select the model `mnist` and select __Next__.
    
    1. On the deployment configuration page, give the deployment a name.
    
    1. On __Output action__, ensure __Append row__ is selected.
    
    1. On __Output file name__, ensure the batch scoring output file is the one you need. Default is `predictions.csv`.
    
    1. On __Mini batch size__, adjust the size of the files that will be included on each mini-batch. This will control the amount of data your scoring script receives per each batch.
    
    1. On __Scoring timeout (seconds)__, ensure you're giving enough time for your deployment to score a given batch of files. If you increase the number of files, you usually have to increase the timeout value too. More expensive models (like those based on deep learning), may require high values in this field.
    
    1. On __Max concurrency per instance__, configure the number of executors you want to have per each compute instance you get in the deployment. A higher number here guarantees a higher degree of parallelization but it also increases the memory pressure on the compute instance. Tune this value altogether with __Mini batch size__.
    
    1. Once done, select __Next__.
    
    1. On environment, go to __Select scoring file and dependencies__ and select __Browse__.
    
    1. Select the scoring script file on `deployment-torch/code/batch_driver.py`.
    
    1. On the section __Choose an environment__, select the environment you created a previous step.
    
    1. Select __Next__.
    
    1. On the section __Compute__, select the compute cluster you created in a previous step.

        > [!WARNING]
        > Azure Kubernetes cluster are supported in batch deployments, but only when created using the Azure Machine Learning CLI or Python SDK.

    1. On __Instance count__, enter the number of compute instances you want for the deployment. In this case, we'll use 2.
    
    1. Select __Next__.

1. Create the deployment:

    # [Azure CLI](#tab/cli)
    
    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="create_deployment" :::

    > [!TIP]
    > The `--set-default` parameter sets the newly created deployment as the default deployment of the endpoint. It's a convenient way to create a new default deployment of the endpoint, especially for the first deployment creation. As a best practice for production scenarios, you may want to create a new deployment without setting it as default, verify it, and update the default deployment later. For more information, see the [Deploy a new model](#adding-deployments-to-an-endpoint) section.
    
    # [Python](#tab/python)

    Using the `MLClient` created earlier, we'll now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=create_deployment)]

    Once the deployment is completed, we need to ensure the new deployment is the default deployment in the endpoint:

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=set_default_deployment)]

    # [Studio](#tab/studio)
    
    In the wizard, select __Create__ to start the deployment process.
    
    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/review-batch-wizard.png" alt-text="Screenshot of batch endpoints/deployment review screen.":::

    ---

1. Check batch endpoint and deployment details.

    # [Azure CLI](#tab/cli)

    Use `show` to check endpoint and deployment details. To check a batch deployment, run the following code:
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="query_deployment" :::

    # [Python](#tab/python)
    
    To check a batch deployment, run the following code:

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=query_deployment)]

    # [Studio](#tab/studio)
    
    1. Navigate to the __Endpoints__ tab on the side menu.
    
    1. Select the tab __Batch endpoints__.
    
    1. Select the batch endpoint you want to get details from.
    
    1. In the endpoint page, you'll see all the details of the endpoint along with all the deployments available.
        
        :::image type="content" source="./media/how-to-use-batch-endpoints-studio/batch-endpoint-details.png" alt-text="Screenshot of the check batch endpoints and deployment details.":::
    
## Run batch endpoints and access results

Invoking a batch endpoint triggers a batch scoring job. The job `name` will be returned from the invoke response and can be used to track the batch scoring progress. When running models for scoring in Batch Endpoints, you need to indicate the input data path where the endpoints should look for the data you want to score. The following example shows how to start a new job over a sample data of the MNIST dataset stored in an Azure Storage Account.

You can run and invoke a batch endpoint using Azure CLI, Azure Machine Learning SDK, or REST endpoints. Read [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md) for details about all the options.

> [!NOTE]
> __How does parallelization work?__:
> 
> Batch deployments distribute work at the file level, which means that a folder containing 100 files with mini-batches of 10 files will generate 10 batches of 10 files each. Notice that this will happen regardless of the size of the files involved. If your files are too big to be processed in large mini-batches we suggest to either split the files in smaller files to achieve a higher level of parallelism or to decrease the number of files per mini-batch. At this moment, batch deployment can't account for skews in the file's size distribution.

# [Azure CLI](#tab/cli)
    
:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="start_batch_scoring_job" :::

# [Python](#tab/python)

> [!NOTE]
> [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=start_batch_scoring_job)]

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

Batch endpoints support reading files or folders that are located in different locations. To learn more about how the supported types and how to specify them read [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md). 

### Monitor batch job execution progress

Batch scoring jobs usually take some time to process the entire set of inputs.

# [Azure CLI](#tab/cli)

The following code checks the job status and outputs a link to the Azure Machine Learning studio for further details.

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="show_job_in_studio" :::

# [Python](#tab/python)

The following code checks the job status and outputs a link to the Azure Machine Learning studio for further details.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=get_job)]

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you want to monitor.

1. Select the tab __Jobs__.

    :::image type="content" source="media/how-to-use-batch-endpoints-studio/summary-jobs.png" alt-text="Screenshot of summary of jobs submitted to a batch endpoint.":::

1. You'll see a list of the jobs created for the selected endpoint.

1. Select the last job that is running.

1. You'll be redirected to the job monitoring page.

---

### Check batch scoring results

The job outputs will be stored in cloud storage, either in the workspace's default blob storage, or the storage you specified. See [Configure the output location](#configure-the-output-location) to know how to change the defaults. Follow the following steps to view the scoring results in Azure Storage Explorer when the job is completed:

1. Run the following code to open batch scoring job in Azure Machine Learning studio. The job studio link is also included in the response of `invoke`, as the value of `interactionEndpoints.Studio.endpoint`.

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="show_job_in_studio" :::

1. In the graph of the job, select the `batchscoring` step.

1. Select the __Outputs + logs__ tab and then select **Show data outputs**.

1. From __Data outputs__, select the icon to open __Storage Explorer__.

    :::image type="content" source="media/how-to-use-batch-endpoint/view-data-outputs.png" alt-text="Studio screenshot showing view data outputs location." lightbox="media/how-to-use-batch-endpoint/view-data-outputs.png":::

    The scoring results in Storage Explorer are similar to the following sample page:

    :::image type="content" source="media/how-to-use-batch-endpoint/scoring-view.png" alt-text="Screenshot of the scoring output." lightbox="media/how-to-use-batch-endpoint/scoring-view.png":::

### Configure the output location

The batch scoring results are by default stored in the workspace's default blob store within a folder named by job name (a system-generated GUID). You can configure where to store the scoring outputs when you invoke the batch endpoint.

# [Azure CLI](#tab/cli)
    
Use `output-path` to configure any folder in an Azure Machine Learning registered datastore. The syntax for the `--output-path` is the same as `--input` when you're specifying a folder, that is, `azureml://datastores/<datastore-name>/paths/<path-on-datastore>/`. Use `--set output_file_name=<your-file-name>` to configure a new output file name.

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="start_batch_scoring_job_set_output" :::

# [Python](#tab/python)

Use `params_override` to configure any folder in an Azure Machine Learning registered data store. Only registered data stores are supported as output paths. In this example we will use the default data store:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=get_data_store)]

Once you identified the data store you want to use, configure the output as follows:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=start_batch_scoring_job_set_output)]

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you just created.

1. Select __Create job__.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/create-batch-job.png" alt-text="Screenshot of the create job option to start batch scoring.":::

1. On __Deployment__, select the deployment you want to execute.

1. Select __Next__.

1. Check the option __Override deployment settings__.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/overwrite-setting.png" alt-text="Screenshot of the overwrite setting when starting a batch job.":::

1. You can now configure __Output file name__ and some extra properties of the deployment execution. Just this execution will be affected.

1. On __Select data source__, select the data input you want to use.

1. On __Configure output location__, check the option __Enable output configuration__.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/configure-output-location.png" alt-text="Screenshot of optionally configuring output location.":::

1. Configure the __Blob datastore__ where the outputs should be placed.

---

> [!WARNING]
> You must use a unique output location. If the output file exists, the batch scoring job will fail.

> [!IMPORTANT]
> As opposite as for inputs, only Azure Machine Learning data stores running on blob storage accounts are supported for outputs.

## Overwrite deployment configuration per each job

Some settings can be overwritten when invoke to make best use of the compute resources and to improve performance. The following settings can be configured in a per-job basis:

* Use __instance count__ to overwrite the number of instances to request from the compute cluster. For example, for larger volume of data inputs, you may want to use more instances to speed up the end to end batch scoring.
* Use __mini-batch size__  to overwrite the number of files to include on each mini-batch. The number of mini batches is decided by total input file counts and mini_batch_size. Smaller mini_batch_size generates more mini batches. Mini batches can be run in parallel, but there might be extra scheduling and invocation overhead.
* Other settings can be overwritten other settings including __max retries__, __timeout__, and __error threshold__. These settings might impact the end to end batch scoring time for different workloads.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="start_batch_scoring_job_overwrite" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=start_batch_scoring_job_overwrite)]

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you just created.

1. Select __Create job__.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/create-batch-job.png" alt-text="Screenshot of the create job option to start batch scoring.":::

1. On __Deployment__, select the deployment you want to execute.

1. Select __Next__.

1. Check the option __Override deployment settings__.

    :::image type="content" source="./media/how-to-use-batch-endpoints-studio/overwrite-setting.png" alt-text="Screenshot of the overwrite setting when starting a batch job.":::

1. Configure the job parameters. Only the current job execution will be affected by this configuration.

---

## Adding deployments to an endpoint

Once you have a batch endpoint with a deployment, you can continue to refine your model and add new deployments. Batch endpoints will continue serving the default deployment while you develop and deploy new models under the same endpoint. Deployments can't affect one to another.

In this example, you'll learn how to add a second deployment __that solves the same MNIST problem but using a model built with Keras and TensorFlow__.

### Adding a second deployment

1. Create an environment where your batch deployment will run. Include in the environment any dependency your code requires for running. You'll also need to add the library `azureml-core` as it is required for batch deployments to work. The following environment definition has the required libraries to run a model with TensorFlow.

    # [Azure CLI](#tab/cli)
   
    The environment definition will be included in the deployment definition itself as an anonymous environment. You'll see in the following lines in the deployment:
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-keras/deployment.yml" range="12-15":::
   
    # [Python](#tab/python)
   
    Let's get a reference to the environment:
   
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=configure_environment_non_default)]

    # [Studio](#tab/studio)
    
    1. Navigate to the __Environments__ tab on the side menu.
    
    1. Select the tab __Custom environments__ > __Create__.
    
    1. Enter the name of the environment, in this case `keras-batch-env`.
    
    1. On __Select environment type__ select __Use existing docker image with conda__.
    
    1. On __Container registry image path__, enter `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.0`.
    
    1. On __Customize__ section copy the content of the file `deployment-keras/environment/conda.yaml` included in the repository into the portal.
    
    1. Select __Next__ and then on __Create__.
    
    1. The environment is ready to be used.
    
    ---
    
    The conda file used looks as follows:
    
    __deployment-keras/environment/conda.yaml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-keras/environment/conda.yaml":::
    
1. Create a scoring script for the model:
   
   __deployment-keras/code/batch_driver.py__
   
   :::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-keras/code/batch_driver.py" :::
   
3. Create a deployment definition

    # [Azure CLI](#tab/cli)
    
    __deployment-keras/deployment.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-keras/deployment.yml":::
    
    # [Python](#tab/python)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=configure_deployment_non_default)]
    
    # [Studio](#tab/studio)

    1. Navigate to the __Endpoints__ tab on the side menu.
    
    1. Select the tab __Batch endpoints__.
    
    1. Select the existing batch endpoint where you want to add the deployment.
    
    1. Select __Add deployment__.

        :::image type="content" source="./media/how-to-use-batch-endpoints-studio/add-deployment-option.png" alt-text="Screenshot of add new deployment option.":::

    1. On the model list, select the model `mnist` and select __Next__.
    
    1. On the deployment configuration page, give the deployment a name.
    
    1. On __Output action__, ensure __Append row__ is selected.
    
    1. On __Output file name__, ensure the batch scoring output file is the one you need. Default is `predictions.csv`.
    
    1. On __Mini batch size__, adjust the size of the files that will be included on each mini-batch. This will control the amount of data your scoring script receives per each batch.
    
    1. On __Scoring timeout (seconds)__, ensure you're giving enough time for your deployment to score a given batch of files. If you increase the number of files, you usually have to increase the timeout value too. More expensive models (like those based on deep learning), may require high values in this field.
    
    1. On __Max concurrency per instance__, configure the number of executors you want to have per each compute instance you get in the deployment. A higher number here guarantees a higher degree of parallelization but it also increases the memory pressure on the compute instance. Tune this value altogether with __Mini batch size__.
    1. Once done, select __Next__.
    
    1. On environment, go to __Select scoring file and dependencies__ and select __Browse__.
    
    1. Select the scoring script file on `deployment-keras/code/batch_driver.py`.
    
    1. On the section __Choose an environment__, select the environment you created a previous step.
    
    1. Select __Next__.
    
    1. On the section __Compute__, select the compute cluster you created in a previous step.
    
    1. On __Instance count__, enter the number of compute instances you want for the deployment. In this case, we'll use 2.
    
    1. Select __Next__.

1. Create the deployment:

    # [Azure CLI](#tab/cli)
    
    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="create_deployment_non_default" :::

    > [!TIP]
    > The `--set-default` parameter is missing in this case. As a best practice for production scenarios, you may want to create a new deployment without setting it as default, verify it, and update the default deployment later.
    
    # [Python](#tab/python)

    Using the `MLClient` created earlier, we'll now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.

    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=create_deployment_non_default)]

    # [Studio](#tab/studio)
    
    In the wizard, select __Create__ to start the deployment process.


### Test a non-default batch deployment

To test the new non-default deployment, you'll need to know the name of the deployment you want to run.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="test_deployment_non_default" :::

Notice `--deployment-name` is used to specify the deployment we want to execute. This parameter allows you to `invoke` a non-default deployment, and it will not update the default deployment of the batch endpoint.

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=test_deployment_non_default)]

Notice `deployment_name` is used to specify the deployment we want to execute. This parameter allows you to `invoke` a non-default deployment, and it will not update the default deployment of the batch endpoint.

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you just created.

1. Select __Create job__.

1. On __Deployment__, select the deployment you want to execute. In this case, `mnist-keras`.

1. Complete the job creation wizard to get the job started.

---

### Update the default batch deployment

Although you can invoke a specific deployment inside of an endpoint, you'll usually want to invoke the endpoint itself and let the endpoint decide which deployment to use. Such deployment is named the "default" deployment. This gives you the possibility of changing the default deployment and hence changing the model serving the deployment without changing the contract with the user invoking the endpoint. Use the following instruction to update the default deployment:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="update_default_deployment" :::

# [Python](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=update_default_deployment)]

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

## Delete the batch endpoint and the deployment

# [Azure CLI](#tab/cli)

If you aren't going to use the old batch deployment, you should delete it by running the following code. `--yes` is used to confirm the deletion.

::: code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="delete_deployment" :::

Run the following code to delete the batch endpoint and all the underlying deployments. Batch scoring jobs won't be deleted.

::: code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deploy-and-run.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

If you aren't going to use the old batch deployment, you should delete it by running the following code. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=delete_deployment)]

Run the following code to delete the batch endpoint and all the underlying deployments. Batch scoring jobs won't be deleted.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/batch/deploy-models/mnist-classifier/mnist-batch.ipynb?name=delete_endpoint)]

# [Studio](#tab/studio)

1. Navigate to the __Endpoints__ tab on the side menu.

1. Select the tab __Batch endpoints__.

1. Select the batch endpoint you want to delete.

1. Select __Delete__.

1. The endpoint all along with its deployments will be deleted.

1. Notice that this won't affect the compute cluster where the deployment(s) run.

---

## Next steps

* [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md).
* [Authentication on batch endpoints](how-to-authenticate-batch-endpoint.md).
* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md).
* [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md).
