---
title: Safe rollout for managed online endpoints using Python SDK v2 (preview).
titleSuffix: Azure Machine Learning
description: Safe rollout for online endpoints using Python SDK v2 (preview).
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: sehan
ms.reviewer: larryfr
author: dem108
ms.date: 05/25/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, sdkv2, deployment
---

# Safe rollout for managed online endpoints using Python SDK v2 (preview)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

> [!IMPORTANT]
> SDK v2 is currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to deploy a new version of the model without causing any disruption. With blue-green deployment or safe rollout, an approach in which a new version of a web service is introduced to production by rolling out the change to a small subset of users/requests before rolling it out completely. This article assumes you're using online endpoints; for more information, see [Azure Machine Learning endpoints](concept-endpoints.md).

In this article, you'll learn to:

* Deploy a new online endpoint called "blue" that serves version 1 of the model.
* Scale this deployment so that it can handle more requests.
* Deploy version 2 of the model to an endpoint called "green" that accepts no live traffic.
* Test the green deployment in isolation.
* Send 10% of live traffic to the green deployment.
* Fully cut-over all live traffic to the green deployment.
* Delete the now-unused v1 blue deployment.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
* The [Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ml/installv2).
* You must have an Azure resource group, and you (or the service principal you use) must have Contributor access to it.
* You must have an Azure Machine Learning workspace.
* To deploy locally, you must install [Docker Engine](https://docs.docker.com/engine/) on your local computer. We highly recommend this option, so it's easier to debug issues.

### Clone examples repository

To run the training examples, first clone the examples repository and change into the `sdk` directory:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/sdk
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

## Connect to Azure Machine Learning workspace

The [workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which you'll perform deployment tasks.

1. Import the required libraries:

    ```python
    # import required libraries
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import (
        ManagedOnlineEndpoint,
        ManagedOnlineDeployment,
        Model,
        Environment,
        CodeConfiguration,
    )
    from azure.identity import DefaultAzureCredential
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

## Create online endpoint

Online endpoints are endpoints that are used for online (real-time) inferencing. Online endpoints contain deployments that are ready to receive data from clients and can send responses back in real time.

To create an online endpoint, we'll use `ManagedOnlineEndpoint`. This class allows user to configure the following key aspects:

* `name` - Name of the endpoint. Needs to be unique at the Azure region level
* `auth_mode` - The authentication method for the endpoint. Key-based authentication and Azure ML token-based authentication are supported. Key-based authentication doesn't expire but Azure ML token-based authentication does. Possible values are `key` or `aml_token`.
* `identity`- The managed identity configuration for accessing Azure resources for endpoint provisioning and inference.
    * `type`- The type of managed identity. Azure Machine Learning supports `system_assigned` or `user_assigned` identity.
    * `user_assigned_identities` - List (array) of fully qualified resource IDs of the user-assigned identities. This property is required if `identity.type` is user_assigned.
* `description`- Description of the endpoint.

1. Configure the endpoint:

    ```python
    # Creating a unique endpoint name with current datetime to avoid conflicts
    import datetime

    online_endpoint_name = "endpoint-" + datetime.datetime.now().strftime("%m%d%H%M%f")

    # create an online endpoint
    endpoint = ManagedOnlineEndpoint(
        name=online_endpoint_name,
        description="this is a sample online endpoint",
        auth_mode="key",
        tags={"foo": "bar"},
    )
    ```

1. Create the endpoint:

    Using the `MLClient` created earlier, we'll now create the Endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.

    ```python
    ml_client.begin_create_or_update(endpoint)
    ```

## Create the 'blue' deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. We'll create a deployment for our endpoint using the `ManagedOnlineDeployment` class. This class allows user to configure the following key aspects.

**Key aspects of deployment**
* `name` - Name of the deployment.
* `endpoint_name` - Name of the endpoint to create the deployment under.
* `model` - The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification.
* `environment` - The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification.
* `code_configuration` - the configuration for the source code and scoring script
    * `path`- Path to the source code directory for scoring the model
    * `scoring_script` - Relative path to the scoring file in the source code directory
* `instance_type` - The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).
* `instance_count` - The number of instances to use for the deployment

1. Configure blue deployment:

    ```python
    # create blue deployment
    model = Model(path="../model-1/model/sklearn_regression_model.pkl")
    env = Environment(
        conda_file="../model-1/environment/conda.yml",
        image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
    )

    blue_deployment = ManagedOnlineDeployment(
        name="blue",
        endpoint_name=online_endpoint_name,
        model=model,
        environment=env,
        code_configuration=CodeConfiguration(
            code="../model-1/onlinescoring", scoring_script="score.py"
        ),
        instance_type="Standard_F2s_v2",
        instance_count=1,
    )
    ```

1. Create the deployment:

    Using the `MLClient` created earlier, we'll now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.

    ```python
    ml_client.begin_create_or_update(blue_deployment)
    ```

    ```python
    # blue deployment takes 100 traffic
    endpoint.traffic = {"blue": 100}
    ml_client.begin_create_or_update(endpoint)
    ```

## Test the endpoint with sample data

Using the `MLClient` created earlier, we'll get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:

* `endpoint_name` - Name of the endpoint
* `request_file` - File with request data
* `deployment_name` - Name of the specific deployment to test in an endpoint

We'll send a sample request using a [json](https://github.com/Azure/azureml-examples/blob/main/sdk/endpoints/online/model-1/sample-request.json) file.

```python
# test the blue deployment with some sample data
ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    deployment_name="blue",
    request_file="../model-1/sample-request.json",
)
```

## Scale the deployment

Using the `MLClient` created earlier, we'll get a handle to the deployment. The deployment can be scaled by increasing or decreasing the `instance_count`.

```python
# scale the deployment
blue_deployment = ml_client.online_deployments.get(
    name="blue", endpoint_name=online_endpoint_name
)
blue_deployment.instance_count = 2
ml_client.online_deployments.begin_create_or_update(blue_deployment)
```

## Get endpoint details

```python
# Get the details for online endpoint
endpoint = ml_client.online_endpoints.get(name=online_endpoint_name)

# existing traffic details
print(endpoint.traffic)

# Get the scoring URI
print(endpoint.scoring_uri)
```

## Deploy a new model, but send no traffic yet

Create a new deployment named green:

```python
# create green deployment
model2 = Model(path="../model-2/model/sklearn_regression_model.pkl")
env2 = Environment(
    conda_file="../model-2/environment/conda.yml",
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
)

green_deployment = ManagedOnlineDeployment(
    name="green",
    endpoint_name=online_endpoint_name,
    model=model2,
    environment=env2,
    code_configuration=CodeConfiguration(
        code="../model-2/onlinescoring", scoring_script="score.py"
    ),
    instance_type="Standard_F2s_v2",
    instance_count=1,
)
```

```python
# use MLClient to create green deployment
ml_client.begin_create_or_update(green_deployment)
```

### Test the new deployment

Though green has 0% of traffic allocated, you can still invoke the endpoint and deployment with [json](https://github.com/Azure/azureml-examples/blob/main/sdk/endpoints/online/model-2/sample-request.json) file.

```python
ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    deployment_name="green",
    request_file="../model-2/sample-request.json",
)
```

## Test the deployment with mirrored traffic (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Once you've tested your `green` deployment, you can copy (or 'mirror') a percentage of the live traffic to it. Mirroring traffic doesn't change results returned to clients. Requests still flow 100% to the blue deployment. The mirrored percentage of the traffic is copied and submitted to the `green` deployment so you can gather metrics and logging without impacting your clients. Mirroring is useful when you want to validate a new deployment without impacting clients. For example, to check if latency is within acceptable bounds and that there are no HTTP errors.

> [!WARNING]
> Mirroring traffic uses your [endpoint bandwidth quota](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints) (default 5 MBPS). Your endpoint bandwidth will be throttled if you exceed the allocated quota. For information on monitoring bandwidth throttling, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md#metrics-at-endpoint-scope).

The following command mirrors 10% of the traffic to the `green` deployment:

```python
endpoint.mirror_traffic = {"green": 10}
ml_client.begin_create_or_update(endpoint)
```

> [!IMPORTANT]
> Mirroring has the following limitations:
> * You can only mirror traffic to one deployment.
> * Mirrored traffic is not currently supported with K8s.
> * The maximum mirrored traffic you can configure is 50%. This limit is to reduce the impact on your endpoint bandwidth quota.
>
> Also note the following behavior:
> * A deployment can only be set to live or mirror traffic, not both.
> * You can send traffic directly to the mirror deployment by specifying the deployment set for mirror traffic.
> * You can send traffic directly to a live deployment by specifying the deployment set for live traffic, but in this case the traffic won't be mirrored to the mirror deployment. Mirror traffic is routed from traffic sent to endpoint without specifying the deployment. 

:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing 10% traffic mirrored to one deployment.":::

After testing, you can set the mirror traffic to zero to disable mirroring:

```python
endpoint.mirror_traffic = {"green": 0}
ml_client.begin_create_or_update(endpoint)
```

## Test the new deployment with a small percentage of live traffic:

Once you've tested your green deployment, allocate a small percentage of traffic to it:

```python
endpoint.traffic = {"blue": 90, "green": 10}
ml_client.begin_create_or_update(endpoint)
```

Now, your green deployment will receive 10% of requests.
    
:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept.png" alt-text="Diagram showing traffic split between deployments.":::

## Send all traffic to your new deployment:

Once you're satisfied that your green deployment is fully satisfactory, switch all traffic to it.

```python
endpoint.traffic = {"blue": 0, "green": 100}
ml_client.begin_create_or_update(endpoint)
```

## Remove the old deployment:

```python
ml_client.online_deployments.delete(name="blue", endpoint_name=online_endpoint_name)
```

## Delete endpoint

If you aren't going use the deployment, you should delete it with:

```python
ml_client.online_endpoints.begin_delete(name=online_endpoint_name)
```

## Next steps
- [Explore online endpoint samples](https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints)
- [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md)
- [Troubleshooting  online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md)
