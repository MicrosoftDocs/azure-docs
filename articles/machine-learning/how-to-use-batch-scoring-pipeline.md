---
title: "Operationalize a scoring pipeline on batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to operationalize a pipeline that performs batch scoring with preprocessing.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 03/29/2023
reviewer: msakande
ms.reviewer: mopeakande
ms.custom: how-to, devplatv2, event-tier1-build-2023
---

# How to deploy a pipeline to perform batch scoring with preprocessing

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to deploy a scoring pipeline under a batch endpoint. The pipeline perform inference over a registered model, but it also reuses a preprocessing component that was used during the model training to ensure the same preprocessing is applied.

You'll learn to:

> [!div class="checklist"]
> * Create a pipeline that reuses existing components from the workspace
> * Deploy the pipeline to an endpoint
> * Consume predictions generated for the pipeline

## About this example

The model will perform predictions on tabular data from the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). In particular, this example will show you how to reuse preprocessing code and the parameters learned during preprocesing before you use your model for inferencing. By reusing the preprocessing code and the learned parameters, we can ensure that the same transformations (such as normalization and feature encoding) that were applied to the input data during training are also applied during inferencing.

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-scoring-pipeline/pipeline-overview.png" alt-text="Pipeline showing how the inference pipeline was created" lightbox=""media/how-to-use-batch-scoring-pipeline/pipeline-overview.png":::

[!INCLUDE [machine-learning-batch-clone](../../includes/machine-learning/azureml-batch-clone-samples.md)]

The files of this example are in:

```azurecli
cd endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing
```

### Follow along in Jupyter notebooks

You can follow along with this example in the following notebook. In the cloned repository, open the notebook: [sdk-deploy-and-test.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/sdk-deploy-and-test.ipynb).


## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](../../includes/machine-learning/azureml-batch-prereqs.md)]


## Create the inference pipeline

In this section, we will create all the assets required for our inference pipeline.

### Create the environment

The components in this example will use an environment with the `XGBoost` and `scikit-learn` libraries. Its conda file looks as follows:

__environment/conda.yml__

:::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/environment/conda.yml" :::

Create the environment as follows:

1. Define the environment:

    # [Azure CLI](#tab/cli)

    __environment/xgboost-sklearn-py38.yml__
    
    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/environment/xgboost-sklearn-py38.yml" :::
    
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
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="environment_registration" :::
    
    # [Python](#tab/python)
    
    ```python
    ml_client.environments.create_or_update(environment)
    ```

### Create a compute cluster

Batch endpoints and deployments run on compute clusters. They can run on any Azure Machine Learning compute cluster that already exists in the workspace. This means that multiple batch deployments can share the same compute infrastructure. In this example, we'll work on an Azure Machine Learning compute cluster called `batch-cluster`. Let's verify that the compute exists on the workspace or create it otherwise.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="create_compute" :::

# [Python](#tab/python)

```python
compute_name = "batch-cluster"
if not any(filter(lambda m: m.name == compute_name, ml_client.compute.list())):
    print(f"Compute {compute_name} is not created. Creating...")
    compute_cluster = AmlCompute(
        name=compute_name, description="amlcompute", min_instances=0, max_instances=5
    )
    ml_client.begin_create_or_update(compute_cluster)
```

The compute may take time to be created. Let's wait for it:

```python
from time import sleep

print(f"Waiting for compute {compute_name}", end="")
while ml_client.compute.get(name=compute_name).provisioning_state == "Creating":
    sleep(1)
    print(".", end="")

print(" [DONE]")
```
---


### Registering components and models

We are going to register components, models, and transformations we need to build our inference pipeline. Some of this assets will be reused for training routines.

> [!TIP]
> Both the models and the preprocessing components used in this tutorial will be reused from a training pipeline. You can see how they were created by following the example [How to deploy a training pipeline with batch endpoints](how-to-use-batch-training-pipeline.md).

1. Register the model that predicts the outcome:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="model_registration" :::
    
    # [Python](#tab/python)
    
    ```python
    model_name = "heart-classifier"
    model_local_path = "model"
    
    model = ml_client.models.create_or_update(
        Model(name=model_name, path=model_local_path, type=AssetTypes.MLFLOW_MODEL)
    )
    ```
    
1. The model registered before was not trained directly on the input data. Instead, data preprocessing (transformation) was done on the input data before training. We will register the component that was used for preprocessing:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="preprocessing_component_register" :::

    # [Python](#tab/python)

    ```python
    prepare_data = load_component(source="components/prepare/prepare.yml")

    ml_client.components.begin_create_or_update(prepare_data)    
    ```
    ---

    > [!TIP]
    > Now this component can be referenced from the workspace. For example: `azureml:uci_heart_prepare@latest` will get the last version of the prepare (preprocess) component.

1. Among the  transformations, data normalization was performed to ensure predictors were centered and in the range of [-1, 1]. The transformation parameters were captured in a scikit-learn transformation that we can also register in the registry so that we can apply the same transformation to new data. You can register the transformation as follows:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="transformation_registration" :::
    
    # [Python](#tab/python)
    
    ```python
    transformation_name = "heart-classifier-transforms"
    transformation_local_path = "transformations"
    
    model = ml_client.models.create_or_update(
        Model(name=transformation_name, path=transformation_local_path, type=AssetTypes.CUSTOM_MODEL)
    )
    ```

1. Inference for the registered model will be done using another component named `score` that compute the predictions using a given model. We could have registered the component and reference it from the pipeline. Actually, that would be the best practice. However, in this example we are going to refererence the component directly from its definition to help you see which components are reused from the training pipeline and which ones are new.


### Building the pipeline

Now it's time to bind all the elements together. The inference pipeline we are deploying looks as follows:

1. `preprocess_job`: This step reads the input data and returns the prepared data and the applied transformations. The step receives two inputs:
    - `data`: a folder containing the input data to score
    - `transformations`: (optional) the path to the transformations that will be applied. When provided, the transformations are read from the model that is indicated at the path. However, if the path isn't provided, then the transformations will be learned from the input data. For inferencing, though, you can't learn the transformation parameters (in this example, the normalization coefficients) from the input data because you need to use the exact parameters that were learned during training. Since this input is optional, the `preprocess_job` component can be used for both training and serving.
1. `score_job`: This step will perform inferencing on the transformed data using the input model. Notice that the component uses an MLflow model to perform inference. Finally, the scores are written back in the same format as they were read.

# [Azure CLI](#tab/cli)

The pipeline is defined in the following YAML file:

__pipeline.yml__

:::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/pipeline.yml" :::

# [Python](#tab/python)

```python
prepare_data = load_component(source="azureml:uci_heart_prepare@latest")
score_data = load_component(source="components/score/score.yml")

@pipeline()
def uci_heart_classifier_scorer(input_data: Input(type=AssetTypes.URI_FOLDER), score_mode: str):
    """This pipeline demonstrates how to make batch inference using a model from the Heart Disease Data Set problem, where pre and post processing is required as steps. The pre and post processing steps can be components reusable from the training pipeline."""
    prepared_data = prepare_data(
        data=input_data, 
        transformations=Input(
            type=AssetTypes.CUSTOM_MODEL, 
            path=transformations.id
        )
    )
    scored_data = score_data(
        data=prepared_data.outputs.prepared_data,
        model=Input(
            type=AssetTypes.MLFLOW_MODEL,
            path=model.id
        ), 
        score_mode=score_mode
    )

    return {
        "scores": scored_data.outputs.scores
    }
```

---

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-scoring-pipeline/pipeline-for-batch-scoring-with-preprocessing.png" alt-text="Pipeline showing batch scoring with preprocessing." lightbox="media/how-to-use-batch-scoring-pipeline/pipeline-for-batch-scoring-with-preprocessing.png":::

### Test the pipeline

Let's test the pipeline with some sample data. To do that, we'll create a job using the pipeline and the `batch-cluster` compute cluster created previously.

# [Azure CLI](#tab/cli)

The job is described in the following `pipeline-job.yml` file:

__pipeline-job.yml__

:::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/pipeline-job.yml" :::

# [Python](#tab/python)

```python
pipeline_job = uci_heart_classifier_scorer(
    input_data=Input(type="uri_folder", path="data/unlabeled/"),
    score_mode=Input(type="string", path="append")
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

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="test_pipeline" :::

# [Python](#tab/python)

```python
pipeline_job_run = ml_client.jobs.create_or_update(
    pipeline_job, 
    experiment_name="uci-heart-score-pipeline"
)
pipeline_job_run
```
---

## Create a batch endpoint

1. Decide on the name of the endpoint. A batch endpoint's name needs to be unique in each region since the name is used to construct the invocation URI. To ensure uniqueness, append any trailing characters in the name.

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="name_endpoint" :::

    # [Python](#tab/python)

    ```python
    endpoint_name="uci-classifier-score"
    ```

1. Configure the endpoint

    # [Azure CLI](#tab/cli)
    
    The `endpoint.yml` file contains the endpoint's configuration.

    __endpoint.yml__
    
    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/endpoint.yml" :::

    # [Python](#tab/python)

    ```python
    endpoint = BatchEndpoint(
        name=endpoint_name,
        description="Batch scoring endpoint of the Heart Disease Data Set prediction task",
    )
    ```

1. Create the endpoint:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="create_endpoint" :::

    # [Python](#tab/python)

    ```python
    ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
    ```

1. You can query the endpoint URI as follows:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="query_endpoint" :::

    # [Python](#tab/python)

    ```python
    endpoint = ml_client.batch_endpoints.get(name=endpoint_name)
    print(endpoint)
    ```

## Deploy the pipeline component

To deploy the pipeline component we have to create a batch deployment. A deployment is a set of resources required for hosting the asset that does the actual work.

1. Configure the deployment

    # [Azure CLI](#tab/cli)
    
    The `deployment.yml` file contains the deployment's configuration.

    __deployment.yml__

    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/deployment.yml" :::
    
    # [Python](#tab/python)

    Our pipeline is defined in a function. To transform it to a component, you will use the `build()` method. Pipeline components are reusable compute graphs that can be included in batch deployments or used to compose more complex pipelines.

    ```python
    pipeline_component = uci_heart_classifier_scorer.pipeline_builder.build()
    ```
    
    Now we can define the deployment:
    
    ```python
    deployment = BatchPipelineComponentDeployment(
        name="uci-classifier-prepros-xgb",
        description="A sample deployment with pre and post processing done before and after inference.",
        endpoint_name=endpoint.name,
        component=pipeline_component,
        settings={
            "continue_on_step_failure": False
        }
    )
    ```
    
1. Create the deployment

    # [Azure CLI](#tab/cli)
    
    Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="create_deployment" :::
    
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

1. Your deployment is ready to be used.


### Test the deployment

Once the deployment is created, it's ready to receive jobs. Follow this steps to test it:

1. Our deployment requires 1 data input and 1 literal input to be indicated.

    # [Azure CLI](#tab/cli)
    
    The input data asset definition is contained in the `inputs.yml` file:
    
    __inputs.yml__
    
    :::code language="yaml" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/inputs.yml" :::
    
    # [Python](#tab/python)
    
    The input data asset definition:
    
    ```python
    input_data = Input(type=AssetTypes.URI_FOLDER, path=heart_dataset_train.id)
    score_mode = Input(type="string", default="append")
    ```
    ---
    
    > [!TIP]
    > To learn more about how to indicate inputs, see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md).
    
1. Invoke the default deployment:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="invoke_deployment_file" :::
    
    # [Python](#tab/python)
    
    ```python
    job = ml_client.batch_endpoints.invoke(
        endpoint_name=endpoint.name, 
        inputs = { 
            "input_data": input_data,
            "score_mode": score_mode
            }
    )
    ```
    
1. You can monitor the progress of the show and stream the logs using:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="stream_job_logs" :::
    
    # [Python](#tab/python)
    
    ```python
    ml_client.jobs.get(name=job.name)
    ```
    
    To wait for the job to finish, run the following code:
    
    ```python
    ml_client.jobs.get(name=job.name).stream()
    ```

### Access job output

Once the job is completed, we can access some of its outputs. This job contains only one output named `scores`:

# [Azure CLI](#tab/cli)

You can download the associated results using `az ml job download`.

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="download_outputs" :::

# [Python](#tab/python)

```python
ml_client.jobs.download(name=score_step.name, download_path=".", output_name="scores")```
```

---

Read the scored data:

```python
import pandas as pd
import glob

output_files = glob.glob("named-outputs/scores/*.csv")
score = pd.concat((pd.read_csv(f) for f in output_files))
score
```

## Clean up resources

Once you're done, delete the associated resources from the workspace:

# [Azure CLI](#tab/cli)

Run the following code to delete the batch endpoint and its underlying deployment. `--yes` is used to confirm the deletion.

:::code language="azurecli" source="~/azureml-examples-batch-pup/cli/endpoints/batch/deploy-pipelines/batch-scoring-with-preprocessing/cli-deploy.sh" ID="delete_endpoint" :::

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

- [Create batch endpoints from pipeline jobs](how-to-use-batch-pipeline-from-job.md)
- [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md)
- [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)