---
title: Upgrade pipeline endpoints to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade pipeline endpoints from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: santiagxf
ms.author: fasantia
ms.date: 05/01/2023
ms.reviewer: sgilley
ms.custom:
  - migration
  - ignite-2023
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade pipeline endpoints to SDK v2

Once you have a pipeline up and running, you can publish a pipeline so that it runs with different inputs. This was known as __Published Pipelines__. 

## What has changed?

[Batch Endpoint](concept-endpoints-batch.md) proposes a similar yet more powerful way to handle multiple assets running under a durable API which is why the Published pipelines functionality has been moved to [Pipeline component deployments in batch endpoints](concept-endpoints-batch.md#pipeline-component-deployment).

[Batch endpoints](concept-endpoints-batch.md) decouples the interface (endpoint) from the actual implementation (deployment) and allow the user to decide which deployment serves the default implementation of the endpoint. [Pipeline component deployments in batch endpoints](concept-endpoints-batch.md#pipeline-component-deployment) allow users to deploy pipeline components instead of pipelines, which make a better use of reusable assets for those organizations looking to streamline their MLOps practice.

The following table shows a comparison of each of the concepts:

| Concept                                           | SDK v1              | SDK v2                         |
|---------------------------------------------------|---------------------|--------------------------------|
| Pipeline's REST endpoint for invocation           | Pipeline endpoint   | Batch endpoint                 |
| Pipeline's specific version under the endpoint    | Published pipeline  | Pipeline component deployment  |
| Pipeline's arguments on invocation                | Pipeline parameter  | Job inputs                     |
| Job generated from a published pipeline           | Pipeline job        | Batch job                      |

To learn how to create your first pipeline component deployment see [How to deploy pipelines in Batch Endpoints](how-to-use-batch-pipeline-deployments.md).


## Moving to batch endpoints

Use the following guidelines to learn how to move from SDK v1 to SDK v2 using the concepts in Batch Endpoints.

### Publish a pipeline

Compare how publishing a pipeline has changed from v1 to v2:

# [SDK v1](#tab/v1)

1. First, we need to get the pipeline we want to publish:

    ```python
    pipeline1 = Pipeline(workspace=ws, steps=[step1, step2])
    ```

1. We can publish the pipeline as follows:

    ```python
    from azureml.pipeline.core import PipelineEndpoint
    
    endpoint_name = "PipelineEndpointTest"
    pipeline_endpoint = PipelineEndpoint.publish(
        workspace=ws, 
        name=endpoint_name,
        pipeline=pipeline, 
        description="A hello world endpoint for component deployments"
    )
    ```

# [SDK v2](#tab/v2)

1. First, we need to get the pipeline we want to publish. However, batch endpoints can't deploy pipelines but pipeline components. We need to convert the pipeline to a component.

    ```python
    @pipeline()
    def pipeline(input_data: Input(type=AssetTypes.URI_FOLDER)):
        (...)
    
        return {
            (..)
        }

    pipeline_component = pipeline.pipeline_builder.build()
    ```

1. As a best practice, we recommend registering pipeline components so you can keep versioning of them in a centralized way inside the workspace or even the shared registries.

    ```python
    ml_client.components.create(pipeline_component)
    ```

1. Then, we need to create the endpoint that will host all the pipeline deployments:

    ```python
    endpoint_name = "PipelineEndpointTest"
    endpoint = BatchEndpoint(
        name=endpoint_name,
        description="A hello world endpoint for component deployments",
    )

    ml_client.batch_endpoints.begin_create_or_update(endpoint)
    ```

1. Create a deployment for the pipeline component:

    ```python
    deployment_name = "hello-batch-dpl"
    deployment = BatchPipelineComponentDeployment(
        name=deployment_name,
        description="A hello world deployment with a single step.",
        endpoint_name=endpoint.name,
        component=pipeline_component
    )
    
    ml_client.batch_deployments.begin_create_or_update(deployment)
    ```
---

### Submit a job to a pipeline endpoint

# [SDK v1](#tab/v1)

To call the default version of the pipeline, you can use:

```python
pipeline_endpoint = PipelineEndpoint.get(workspace=ws, name="PipelineEndpointTest")
run_id = pipeline_endpoint.submit("PipelineEndpointExperiment")
```

# [SDK v2](#tab/v2)

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=batch_endpoint, 
)
```
---

You can also submit a job to a specific version:

# [SDK v1](#tab/v1)

```python
run_id = pipeline_endpoint.submit(endpoint_name, pipeline_version="0")
```

# [SDK v2](#tab/v2)

In batch endpoints, deployments are not versioned. However, you can deploy multiple pipeline components versions under the same endpoint. In this sense, each pipeline version in v1 will correspond to a different pipeline component version and its corresponding deployment under the endpoint.

Then, you can deploy a specific deployment running under the endpoint if that deployment runs the version you are interested in.

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint_name, 
    deployment_name=deployment_name, 
)
```
---

### Get all pipelines deployed

# [SDK v1](#tab/v1)

```python
all_pipelines = PublishedPipeline.get_all(ws)
```

# [SDK v2](#tab/v2)

The following code list all the endpoints existing in the workspace:

```python
all_endpoints = ml_client.batch_endpoints.list()
```

However, keep in mind that batch endpoints can host deployments [operationalizing either pipelines or models](concept-endpoints-batch.md#batch-deployments). If you want to get a list of all the deployments that host pipelines, you can do as follows:

```python
all_deployments = []

for endpoint in all_endpoints:
    all_deployments.extend(ml_client.batch_deployments.list(endpoint_name=endpoint.name))

all_pipeline_deployments = filter(all_endpoints, lamdba x: x is BatchPipelineComponentDeployment)
```
---

## Using the REST API

You can create jobs from the endpoints by using the REST API of the invocation URL. See the following examples to see how invocation has changed from v1 to v2.

# [SDK v1](#tab/v1)

```python
pipeline_endpoint = PipelineEndpoint.get(workspace=ws, name=endpoint_name)
rest_endpoint = pipeline_endpoint.endpoint

response = requests.post(
    rest_endpoint, 
    headers=aad_token, 
    json={
        "ExperimentName": "PipelineEndpointExperiment",
        "RunSource": "API",
        "ParameterAssignments": {"argument1": "united", "argument2":45}
    }
)
```

# [SDK v2](#tab/v2)

Batch endpoints support multiple inputs types. The following example shows how to indicate two different inputs of type `string` and `numeric`:

```python
batch_endpoint = ml_client.batch_endpoints.get(endpoint_name)
rest_endpoint = batch_endpoint.invocation_url

response = requests.post(
    rest_endpoint, 
    headers=aad_token, 
    json={
        "properties": {
            "InputData": {
                "argument1": {
                    "JobInputType": "Literal",
                    "Value": "united"
                },
                "argument2": {
                    "JobInputType": "Literal",
                    "Value": 45
                }
            }
        }
    }
)
```

To know how to indicate inputs and outputs in batch endpoints and all the supported types see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md).

---

## Next steps

- [How to deploy pipelines in Batch Endpoints](how-to-use-batch-pipeline-deployments.md)
- [How to operationalize a training routine in batch endpoints](how-to-use-batch-training-pipeline.md)
- [How to operationalize an scoring routine in batch endpoints](how-to-use-batch-scoring-pipeline.md)
