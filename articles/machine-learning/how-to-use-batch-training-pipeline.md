---
title: "Operationalize a training pipeline on batch endpoints (preview)"
titleSuffix: Azure Machine Learning
description: Learn how to deploy a training pipeline under a batch endpoint.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 04/21/2023
reviewer: msakande
ms.reviewer: mopeakande
ms.custom: how-to, devplatv2, event-tier1-build-2023
---

# How to operationalize a training pipeline with batch endpoints (preview)

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to operationalize a training pipeline under a batch endpoint. The pipeline uses multiple components (or steps) that include model training, data preprocessing, and model evaluation.

You'll learn to:

> [!div class="checklist"]
> * Create and test a training pipeline
> * Deploy the pipeline to a batch endpoint
> * Modify the pipeline and create a new deployment in the same endpoint
> * Test the new deployment and set it as the default deployment

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## About this example

This example deploys a training pipeline that takes input training data (labeled) and produces a predictive model, along with the evaluation results and the transformations applied during preprocessing. The pipeline will use tabular data from the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease) to train an XGBoost model. We use a data preprocessing component to preprocess the data before it is sent to the training component to fit and evaluate the model.

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-training-pipeline/pipeline-overview.png" alt-text="Pipeline showing the preprocessing and training components." lightbox="media/how-to-use-batch-training-pipeline/pipeline-overview.png":::

[!INCLUDE [machine-learning-batch-clone](../../includes/machine-learning/azureml-batch-clone-samples.md)]

The files for this example are in:

```azurecli
cd endpoints/batch/deploy-pipelines/training-with-components
```

### Follow along in Jupyter notebooks

You can follow along with the Python SDK version of this example by opening the [sdk-deploy-and-test.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-pipelines/training-with-components/sdk-deploy-and-test.ipynb) notebook in the cloned repository.

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](../../includes/machine-learning/azureml-batch-prereqs.md)]

## Create the training pipeline component

In this section, we'll create all the assets required for our training pipeline. We'll begin by creating an environment that includes necessary libraries to train the model. We'll then create a compute cluster on which the batch deployment will run, and finally, we'll register the input data as a data asset.

### Create the environment

The components in this example will use an environment with the `XGBoost` and `scikit-learn` libraries. The `environment/conda.yml` file contains the environment's configuration:

__environment/conda.yml__

:::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/environment/conda.yml" :::

Create the environment as follows:

1. Define the environment:

    # [Azure CLI](#tab/cli)

    __environment/xgboost-sklearn-py38.yml__
    
    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/environment/xgboost-sklearn-py38.yml" :::
    
    # [Python](#tab/python)
    
    ```python
    environment = Environment(
        name="xgboost-sklearn-py38",
        description="An environment for models built with XGBoost and Scikit-learn.",
        image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest",
        conda_file="environment/conda.yml"
    )
    ```

1. Create the environment: 

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="environment_registration" :::
    
    # [Python](#tab/python)
    
    ```python
    ml_client.environments.create_or_update(environment)
    ```

### Create a compute cluster

Batch endpoints and deployments run on compute clusters. They can run on any Azure Machine Learning compute cluster that already exists in the workspace. Therefore, multiple batch deployments can share the same compute infrastructure. In this example, we'll work on an Azure Machine Learning compute cluster called `batch-cluster`. Let's verify that the compute exists on the workspace or create it otherwise.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="create_compute" :::

# [Python](#tab/python)

```python
compute_name = "batch-cluster"
compute_cluster = AmlCompute(
    name=compute_name, description="Batch endpoints compute cluster", min_instances=0, max_instances=5
)
ml_client.begin_create_or_update(compute_cluster).result()
```
---

### Register the training data as a data asset

Our training data is represented in CSV files. To mimic a more production-level workload, we're going to register the training data in the `heart.csv` file as a data asset in the workspace. This data asset will later be indicated as an input to the endpoint.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="data_asset_registration":::

# [Python](#tab/python)

```python
data_path = "data/train"
dataset_name = "heart-dataset-train"

heart_dataset_train = Data(
    path=data_path,
    type=AssetTypes.URI_FOLDER,
    description="A training dataset for heart classification",
    name=dataset_name,
)
```

Create the data asset:

```python
ml_client.data.create_or_update(heart_dataset_train)
```

Let's get a reference to the new data asset:

```python
heart_dataset_train = ml_client.data.get(name=dataset_name, label="latest")
```

---

### Create the pipeline

The pipeline we want to operationalize takes 1 input, the training data, and produces 3 outputs, the trained model, the evaluation results, and the data transformations applied as preprocessing. It is composed of 2 components:

1. `preprocess_job`: This step reads the input data and returns the prepared data and the applied transformations. The step receives three inputs:
    - `data`: a folder containing the input data to transform and score
    - `transformations`: (optional) Path to the transformations that will be applied, if available. If the path isn't provided, then the transformations will be learned from the input data. Since the `transformations` input is optional, the `preprocess_job` component can be used during training and scoring.
    - `categorical_encoding`: the encoding strategy for the categorical features (`ordinal` or `onehot`).
1. `train_job`: This step will train an XGBoost model based on the prepared data and return the evaluation results and the trained model. The step receives three inputs:
    - `data`: the preprocessed data.
    - `target_column`: the column that we want to predict.
    - `eval_size`: indicates the proportion of the input data used for evaluation.

# [Azure CLI](#tab/cli)

The pipeline configuration is defined in the `deployment-ordinal/pipeline.yml` file:

__deployment-ordinal/pipeline.yml__

:::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/deployment-ordinal/pipeline.yml" :::

> [!NOTE]
> In the `pipeline.yml` file, the `transformations` input is missing from the `preprocess_job`; therefore, the script will learn the transformation parameters from the input data.

# [Python](#tab/python)

The configurations for the pipeline components are in the `prepare.yml` and `train_xgb.yml` files. Load the components:

```python
prepare_data = load_component(source="components/prepare/prepare.yml")
train_xgb = load_component(source="components/train_xgb/train_xgb.yml")
```

Construct the pipeline:

```python
@pipeline()
def uci_heart_classifier_trainer(input_data: Input(type=AssetTypes.URI_FOLDER)):
    prepared_data = prepare_data(data=input_data)
    trained_model = train_xgb(
        data=prepared_data.outputs.prepared_data, 
        target_column="target",
        register_best_model=False,
        eval_size=0.3)

    return {
        "model": trained_model.outputs.model,
        "evaluation_results": trained_model.outputs.evaluation_results,
        "transformations_output": prepared_data.outputs.transformations_output,
    }
```

> [!NOTE]
> In the pipeline, the `transformations` input is missing; therefore, the script will learn the parameters from the input data.

---

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-training-pipeline/pipeline-with-transform-and-training-components.png" alt-text="An image of the pipeline showing the job input, pipeline components, and the outputs at each step of the pipeline." lightbox="media/how-to-use-batch-training-pipeline/pipeline-with-transform-and-training-components.png":::

### Test the pipeline

Let's test the pipeline with some sample data. To do that, we'll create a job using the pipeline and the `batch-cluster` compute cluster created previously.

# [Azure CLI](#tab/cli)

The following `pipeline-job.yml` file contains the configuration for the pipeline job:

__deployment-ordinal/pipeline-job.yml__

:::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/deployment-ordinal/pipeline-job.yml" :::


# [Python](#tab/python)

```python
pipeline_job = uci_heart_classifier_trainer(
    Input(type="uri_folder", path=heart_dataset_train.id)
)
```

Now, we'll configure some run settings to run the test:

```python
pipeline_job.settings.default_datastore = "workspaceblobstore"
pipeline_job.settings.default_compute = "batch-cluster"
```

---

Create the test job:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="test_pipeline" :::

# [Python](#tab/python)

```python
pipeline_job_run = ml_client.jobs.create_or_update(
    pipeline_job, 
    experiment_name="uci-heart-train-pipeline"
)
pipeline_job_run
```

---

## Create a batch endpoint

1. Provide a name for the endpoint. A batch endpoint's name needs to be unique in each region since the name is used to construct the invocation URI. To ensure uniqueness, append any trailing characters to the name specified in the following code.

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="name_endpoint" :::

    # [Python](#tab/python)

    ```python
    endpoint_name="uci-classifier-train"
    ```

1. Configure the endpoint:

    # [Azure CLI](#tab/cli)
    
    The `endpoint.yml` file contains the endpoint's configuration.

    __endpoint.yml__
    
    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/endpoint.yml" :::

    # [Python](#tab/python)

    ```python
    endpoint = BatchEndpoint(
        name=endpoint_name,
        description="An endpoint to perform training of the Heart Disease Data Set prediction task",
    )
    ```

1. Create the endpoint:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="create_endpoint" :::

    # [Python](#tab/python)

    ```python
    ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
    ```

1. Query the endpoint URI:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="query_endpoint" :::

    # [Python](#tab/python)

    ```python
    endpoint = ml_client.batch_endpoints.get(name=endpoint_name)
    print(endpoint)
    ```

## Deploy the pipeline component

To deploy the pipeline component, we have to create a batch deployment. A deployment is a set of resources required for hosting the asset that does the actual work.

1. Configure the deployment:

    # [Azure CLI](#tab/cli)
    
    The `deployment-ordinal/deployment.yml` file contains the deployment's configuration.

    __deployment-ordinal/deployment.yml__

    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/deployment-ordinal/deployment.yml" :::
    
    # [Python](#tab/python)

    Our pipeline is defined in a function. To transform it to a component, you'll use the `build()` method. Pipeline components are reusable compute graphs that can be included in batch deployments or used to compose more complex pipelines.

    ```python
    pipeline_component = uci_heart_classifier_trainer.pipeline_builder.build()
    ```
    
    Now we can define the deployment:
    
    ```python
    deployment = BatchPipelineComponentDeployment(
        name="uci-classifier-train-xgb",
        description="A sample deployment that trains an XGBoost model for the UCI dataset.",
        endpoint_name=endpoint.name,
        component=pipeline_component,
        settings={
            "continue_on_step_failure": False
        }
    )
    ```

1. Create the deployment:

    # [Azure CLI](#tab/cli)

    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="create_deployment" :::

    > [!TIP]
    > Notice the use of the `--set-default` flag to indicate that this new deployment is now the default.

    # [Python](#tab/python)

    This command will start the deployment creation and return a confirmation response while the deployment creation continues.

    ```python
    ml_client.batch_deployments.begin_create_or_update(deployment).result()
    ```
    
    Once created, let's configure this new deployment as the default one:

    ```python
    endpoint = ml_client.batch_endpoints.get(endpoint.name)
    endpoint.defaults.deployment_name = deployment.name
    ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
    ```

1. Your deployment is ready for use.

### Test the deployment

Once the deployment is created, it's ready to receive jobs. Follow these steps to test it:

1. Our deployment requires that we indicate one data input.

    # [Azure CLI](#tab/cli)
    
    The `inputs.yml` file contains the definition for the input data asset: 
    
    __inputs.yml__
    
    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/inputs.yml" :::
    
    # [Python](#tab/python)
    
    Define the input data asset:
    
    ```python
    input_data = Input(type=AssetTypes.URI_FOLDER, path=heart_dataset_train.id)
    ```

    ---
    
    > [!TIP]
    > To learn more about how to indicate inputs, see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md).
    
1. You can invoke the default deployment as follows:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="invoke_deployment_file" :::
    
    # [Python](#tab/python)
    
    ```python
    job = ml_client.batch_endpoints.invoke(
        endpoint_name=endpoint.name, 
        inputs = { 
            "input_data": input_data
            }
    )
    ```
    
1. You can monitor the progress of the show and stream the logs using:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="stream_job_logs" :::
    
    # [Python](#tab/python)
    
    ```python
    ml_client.jobs.get(name=job.name)
    ```
    
    To wait for the job to finish, run the following code:
    
    ```python
    ml_client.jobs.get(name=job.name).stream()
    ```

It's worth to be mentioned that only the pipeline's inputs are published as inputs in the Batch Endpoint. For instance, `categorical_encoding` is an input of a step of the pipeline, but not an input in the pipeline itself. Use this fact to control which inputs do you want to expose to your clients and which ones you do not.

### Access job outputs

Once the job is completed, we can access some of its outputs. This pipeline produces the following outputs for its components:
- `preprocess job`: output is `transformations_output`
- `train job`: outputs are `model` and `evaluation_results`

You can download the associated results using:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="download_outputs" :::

# [Python](#tab/python)

```python
ml_client.jobs.download(name=job.name, download_path=".", output_name="transformations")
ml_client.jobs.download(name=job.name, download_path=".", output_name="model")
ml_client.jobs.download(name=job.name, download_path=".", output_name="evaluation_results")
```

---

## Create a new deployment in the endpoint

Endpoints can host multiple deployments at once, while keeping only one deployment as the default. Therefore, you can iterate over your different models, deploy the different models to your endpoint and test them, and finally, switch the default deployment to the model deployment that works best for you.

Let's change the way preprocessing is done in the pipeline to see if we get a model that performs better.

### Change a parameter in the pipeline's preprocessing component

The preprocessing component has an input called `categorical_encoding`, which can have values `ordinal` or `onehot`. These values correspond to two different ways of encoding categorical features. 

- `ordinal`: Encodes the feature values with numeric values (ordinal) from `[1:n]`, where `n` is the number of categories in the feature. Ordinal encoding implies that there's a natural rank order among the feature categories.
- `onehot`: Doesn't imply a natural rank ordered relationship but introduces a dimensionality problem if the number of categories is large.
 
By default, we used `ordinal` previously. Let's now change the categorical encoding to use `onehot` and see how the model performs.

> [!TIP]
> Alternatively, we could have exposed the `categorial_encoding` input to clients as an input to the pipeline job itself. However, we chose to change the parameter value in the preprocessing step so that we can hide and control the parameter inside of the deployment and take advantage of the opportunity to have multiple deployments under the same endpoint.

1. Modify the pipeline. It looks as follows: 

    # [Azure CLI](#tab/cli)

    The pipeline configuration is defined in the `deployment-onehot/pipeline.yml` file:
    
    __deployment-onehot/pipeline.yml__
    
    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/deployment-onehot/pipeline.yml" highlight="29" :::
    
    # [Python](#tab/python)
    
    ```python
    @pipeline()
    def uci_heart_classifier_onehot(input_data: Input(type=AssetTypes.URI_FOLDER)):
        prepared_data = prepare_data(data=input_data, categorical_encoding="onehot")
        trained_model = train_xgb(
            data=prepared_data.outputs.prepared_data, 
            target_column="target",
            register_best_model=False,
            eval_size=0.3)
    
        return {
            "model": trained_model.outputs.model,
            "evaluation_results": trained_model.outputs.evaluation_results,
            "transformations_output": prepared_data.outputs.transformations_output,
        }
    ```

1. Configure the deployment:

    # [Azure CLI](#tab/cli)
    
    The `deployment-onehot/deployment.yml` file contains the deployment's configuration.

    __deployment-onehot/deployment.yml__

    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/deployment-onehot/deployment.yml" :::
    
    # [Python](#tab/python)

    Our pipeline is defined in a function. To transform it to a component, you'll use the `build()` method. Pipeline components are reusable compute graphs that can be included in batch deployments or used to compose more complex pipelines.

    ```python
    pipeline_component = uci_heart_classifier_onehot.pipeline_builder.build()
    ```
    
    Now we can define the deployment:
    
    ```python
    deployment_onehot = BatchPipelineComponentDeployment(
        name="uci-classifier-train-onehot",
        description="A sample deployment that trains an XGBoost model for the UCI dataset with one hot encoding of categorical variables.",
        endpoint_name=endpoint.name,
        component=pipeline_component,
        settings={
            "continue_on_step_failure": False,
            "default_compute": "batch-cluster"
        }
    )
    ```
    
1. Create the deployment:

    # [Azure CLI](#tab/cli)
    
    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="create_nondefault_deployment" :::

    Your deployment is ready for use.   

    # [Python](#tab/python)

    This command will start the deployment creation and return a confirmation response while the deployment creation continues.

    ```python
    ml_client.batch_deployments.begin_create_or_update(deployment_onehot).result()
    ```

    Your deployment is ready for use.

### Test a non-default deployment

Once the deployment is created, it's ready to receive jobs. We can test it in the same way we did before, but now we'll invoke a specific deployment:

1. Invoke the deployment as follows, specifying the deployment parameter to trigger the specific deployment `uci-classifier-train-onehot`:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="invoke_nondefault_deployment_file" :::
    
    # [Python](#tab/python)
    
    ```python
    job = ml_client.batch_endpoints.invoke(
        endpoint_name=endpoint.name, 
        deployment_name=deployment_onehot.name
        inputs = { 
            "input_data": input_data
            }
    )
    ```
    
1. You can monitor the progress of the show and stream the logs using:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="stream_job_logs" :::
    
    # [Python](#tab/python)
    
    ```python
    ml_client.jobs.get(name=job.name)
    ```
    
    To wait for the job to finish, run the following code:
    
    ```python
    ml_client.jobs.get(name=job.name).stream()
    ```


### Configure the new deployment as the default one

Once we're satisfied with the performance of the new deployment, we can set this new one as the default:

# [Azure CLI](#tab/cli)
    
:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="update_default_deployment" :::

# [Python](#tab/python)

```python
endpoint = ml_client.batch_endpoints.get(endpoint.name)
endpoint.defaults.deployment_name = deployment.name
ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
```
---

### Delete the old deployment

Once you're done, you can delete the old deployment if you don't need it anymore:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="delete_deployment" :::

# [Python](#tab/python)

```python
ml_client.batch_deployments.begin_delete(name="uci-classifier-train-xgb", endpoint_name=endpoint.name).result()
```
---

## Clean up resources

Once you're done, delete the associated resources from the workspace:

# [Azure CLI](#tab/cli)

Run the following code to delete the batch endpoint and its underlying deployment. `--yes` is used to confirm the deletion.

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/training-with-components/cli-deploy.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

Delete the endpoint:

```python
ml_client.batch_endpoints.begin_delete(endpoint.name).result()
```
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

- [How to deploy a pipeline to perform batch scoring with preprocessing (preview)](how-to-use-batch-scoring-pipeline.md)
- [Create batch endpoints from pipeline jobs (preview)](how-to-use-batch-pipeline-from-job.md)
- [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md)
- [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)