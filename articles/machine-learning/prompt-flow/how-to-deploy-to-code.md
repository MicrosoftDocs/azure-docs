---
title: Deploy a flow in prompt flow to online endpoint for real-time inference with CLI
titleSuffix: Azure Machine Learning
description: Learn how to deploy your flow to a managed online endpoint or Kubernetes online endpoint in Azure Machine Learning prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom: devx-track-azurecli
ms.topic: how-to
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Deploy a flow to online endpoint for real-time inference with CLI

In this article, you'll learn to deploy your flow to a [managed online endpoint](../concept-endpoints-online.md#managed-online-endpoints-vs-kubernetes-online-endpoints) or a [Kubernetes online endpoint](../concept-endpoints-online.md#managed-online-endpoints-vs-kubernetes-online-endpoints) for use in real-time inferencing with Azure Machine Learning v2 CLI.

Before beginning make sure that you have tested your flow properly, and feel confident that it's ready to be deployed to production. To learn more about testing your flow, see [test your flow](how-to-bulk-test-evaluate-flow.md). After testing your flow you'll learn how to create managed online endpoint and deployment, and how to use the endpoint for real-time inferencing.

- For the **CLI** experience, all the sample yaml files can be found in the [prompt flow CLI GitHub folder](https://aka.ms/pf-deploy-mir-cli). This article will cover how to use the CLI experience.
- For the **Python SDK** experience, sample notebook is [prompt flow SDK GitHub folder](https://aka.ms/pf-deploy-mir-sdk). The Python SDK isn't covered in this article, see the GitHub sample notebook instead. To use the Python SDK, you must have The Python SDK v2 for Azure Machine Learning. To learn more, see [Install the Python SDK v2 for Azure Machine Learning](/python/api/overview/azure/ai-ml-readme).

## Prerequisites

- The Azure CLI and the Azure Machine Learning extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](../how-to-configure-cli.md).
- An Azure Machine Learning workspace. If you don't have one, use the steps in the [Quickstart: Create workspace resources article](../quickstart-create-resources.md) to create one.
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role allowing "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/". If you use studio to create/manage online endpoints/deployments, you will need an additional permission "Microsoft.Resources/deployments/write" from the resource group owner. For more information, see [Manage access to an Azure Machine Learning workspace](../how-to-assign-roles.md).

### Virtual machine quota allocation for deployment

For managed online endpoints, Azure Machine Learning reserves 20% of your compute resources for performing upgrades. Therefore, if you request a given number of instances in a deployment, you must have a quota for `ceil(1.2 * number of instances requested for deployment) * number of cores for the VM SKU` available to avoid getting an error. For example, if you request 10 instances of a Standard_DS3_v2 VM (that comes with four cores) in a deployment, you should have a quota for 48 cores (12 instances four cores) available. To view your usage and request quota increases, see [View your usage and quotas in the Azure portal](../how-to-manage-quotas.md#view-your-usage-and-quotas-in-the-azure-portal).

## Get the flow ready for deploy

Each flow will have a folder which contains codes/prompts, definition and other artifacts of the flow. If you have developed your flow with UI, you can download the flow folder from the flow details page. If you have developed your flow with CLI or SDK, you should have the flow folder already.

This article will use the [sample flow "basic-chat"](https://github.com/microsoft/promptflow/tree/main/examples/flows/chat/basic-chat) as an example to deploy to Azure Machine Learning managed online endpoint.

> [!IMPORTANT]
>
> If you have used `additional_includes` in your flow, then you need to use `pf flow build --source <path-to-flow> --output <output-path> --format docker` first to get a resolved version of flow folder.

## Set default workspace

Use the following commands to set the default workspace and resource group for the CLI.

```Azure CLI
az account set --subscription <subscription ID>
az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
```

## Register the flow as a model (optional)

In the online deployment, you can either refer to a registered model, or specify the model path (where to upload the model files from) inline. It's recommended to register the model and specify the model name and version in the deployment definition. Use the form `model:<model_name>:<version>`.

Following is a model definition example for a chat flow.

> [!NOTE]
> If your flow is not a chat flow, then you don't need to add these `properties`.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/model.schema.json
name: basic-chat-model
path: ../../../../examples/flows/chat/basic-chat
description: register basic chat flow folder as a custom model
properties:
  # In AuzreML studio UI, endpoint detail UI Test tab needs this property to know it's from prompt flow
  azureml.promptflow.source_flow_id: basic-chat
  
  # Following are properties only for chat flow 
  # endpoint detail UI Test tab needs this property to know it's a chat flow
  azureml.promptflow.mode: chat
  # endpoint detail UI Test tab needs this property to know which is the input column for chat flow
  azureml.promptflow.chat_input: question
  # endpoint detail UI Test tab needs this property to know which is the output column for chat flow
  azureml.promptflow.chat_output: answer
```

Use `az ml model create --file model.yaml` to register the model to your workspace.

## Define the endpoint

To define an endpoint, you need to specify:

- **Endpoint name**: The name of the endpoint. It must be unique in the Azure region. For more information on the naming rules, see [managed online endpoint limits](../how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).
- **Authentication mode**: The authentication method for the endpoint. Choose between key-based authentication and Azure Machine Learning token-based authentication. A key doesn't expire, but a token does expire. For more information on authenticating, see [Authenticate to an online endpoint](../how-to-authenticate-online-endpoint.md).
Optionally, you can add a description and tags to your endpoint.
- Optionally, you can add a description and tags to your endpoint.
- If you want to deploy to a Kubernetes cluster (AKS or Arc enabled cluster)  which is attaching to your workspace, you can deploy the flow to be a **Kubernetes online endpoint**.

Following is an endpoint definition example which by default uses system-assigned identity.

# [Managed online endpoint](#tab/managed)

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: basic-chat-endpoint
auth_mode: key
properties:
# this property only works for system-assigned identity.
# if the deploy user has access to connection secrets, 
# the endpoint system-assigned identity will be auto-assigned connection secrets reader role as well
  enforce_access_to_default_secret_stores: enabled
```

# [Kubernetes online endpoint](#tab/kubernetes)


```yaml
$schema: https://azuremlschemas.azureedge.net/latest/kubernetesOnlineEndpoint.schema.json
name: basic-chat-endpoint
compute: azureml:<Kubernetes compute name>
auth_mode: key
```

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
![image](https://github.com/MicrosoftDocs/azure-docs-pr/assets/23491583/e8c42689-d107-494b-8e89-5d1fb155ddb7)

---

| Key | Description |
|--|--|
| `$schema` | (Optional) The YAML schema. To see all available options in the YAML file, you can view the schema in the preceding code snippet in a browser. |
| `name` | The name of the endpoint. |
| `auth_mode` | Use `key` for key-based authentication. Use `aml_token` for Azure Machine Learning token-based authentication. To get the most recent token, use the `az ml online-endpoint get-credentials` command. |
|`property: enforce_access_to_default_secret_stores` (preview)|- By default the endpoint will use system-asigned identity. This property only works for system-assigned identity. <br> - This property means if you have the connection secrets reader permission, the endpoint system-assigned identity will be auto-assigned Azure Machine Learning Workspace Connection Secrets Reader role of the workspace, so that the endpoint can access connections correctly when performing inferencing. <br> - By default this property is `disabled``.|

If you want to use user-assigned identity, you can specify the following additional attributes:

```yaml
identity:
  type: user_assigned
  user_assigned_identities:
    - resource_id: user_identity_ARM_id_place_holder
```
> [!IMPORTANT]
>
> You need to give the following permissions to the user-assigned identity **before create the endpoint**. Learn more about [how to grant permissions to your endpoint identity](how-to-deploy-for-real-time-inference.md#grant-permissions-to-the-endpoint).

|Scope|Role|Why it's needed|
|---|---|---|
|Azure Machine Learning Workspace|**Azure Machine Learning Workspace Connection Secrets Reader** role **OR** a customized role with "Microsoft.MachineLearningServices/workspaces/connections/listsecrets/action" | Get workspace connections|
|Workspace container registry |ACR pull |Pull container image |
|Workspace default storage| Storage Blob Data Reader| Load model from storage |
|(Optional) Azure Machine Learning Workspace|Workspace metrics writer| After you deploy then endpoint, if you want to monitor the endpoint related metrics like CPU/GPU/Disk/Memory utilization, you need to give this permission to the identity.|


If you create a Kubernetes online endpoint, you need to specify the following additional attributes:

| Key       | Description                                              |
|-----------|----------------------------------------------------------|
| `compute` | The Kubernetes compute target to deploy the endpoint to. |

> [!IMPORTANT]
>
> By default, when you create an online endpoint, a system-assigned managed identity is automatically generated for you. You can also specify an existing user-assigned managed identity for the endpoint.
> You need to grant permissions to your endpoint identity so that it can access the Azure resources to perform inference. See [Grant permissions to your endpoint identity](how-to-deploy-for-real-time-inference.md#grant-permissions-to-the-endpoint) for more information.
>
> For more configurations of endpoint, see [managed online endpoint schema](../reference-yaml-endpoint-online.md).

### Define the deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. To deploy a flow, you must have:

- **Model files (or the name and version of a model that's already registered in your workspace).** In the example, we have a scikit-learn model that does regression.
- **A scoring script**, that is, code that executes the model on a given input request. The scoring script receives data submitted to a deployed web service and passes it to the model. The script then executes the model and returns its response to the client. The scoring script is specific to your model and must understand the data that the model expects as input and returns as output. In this example, we have a score.py file.
An environment in which your model runs. The environment can be a Docker image with Conda dependencies or a Dockerfile.
Settings to specify the instance type and scaling capacity.

Following is a deployment definition example.

# [Managed online endpoint](#tab/managed)

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: blue
endpoint_name: basic-chat-endpoint
model: azureml:basic-chat-model:1
  # You can also specify model files path inline
  # path: examples/flows/chat/basic-chat
environment: 
  image: mcr.microsoft.com/azureml/promptflow/promptflow-runtime:latest
  # inference config is used to build a serving container for online deployments
  inference_config:
    liveness_route:
      path: /health
      port: 8080
    readiness_route:
      path: /health
      port: 8080
    scoring_route:
      path: /score
      port: 8080
instance_type: Standard_E16s_v3
instance_count: 1
environment_variables:

  # "compute" mode is the default mode, if you want to deploy to serving mode, you need to set this env variable to "serving"
  PROMPTFLOW_RUN_MODE: serving

  # for pulling connections from workspace
  PRT_CONFIG_OVERRIDE: deployment.subscription_id=<subscription_id>,deployment.resource_group=<resource_group>,deployment.workspace_name=<workspace_name>,deployment.endpoint_name=<endpoint_name>,deployment.deployment_name=<deployment_name>

  # (Optional) When there are multiple fields in the response, using this env variable will filter the fields to expose in the response.
  # For example, if there are 2 flow outputs: "answer", "context", and I only want to have "answer" in the endpoint response, I can set this env variable to '["answer"]'.
  # If you don't set this environment, by default all flow outputs will be included in the endpoint response.
  # PROMPTFLOW_RESPONSE_INCLUDED_FIELDS: '["category", "evidence"]'
```

# [Kubernetes online endpoint](#tab/kubernetes)

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/kubernetesOnlineDeployment.schema.json
name: blue
type: kubernetes
endpoint_name: basic-chat-endpoint
model: azureml:basic-chat-model:1
  # You can also specify model files path inline
  # path: examples/flows/chat/basic-chat
environment: 
  image: mcr.microsoft.com/azureml/promptflow/promptflow-runtime:latest
  # inference config is used to build a serving container for online deployments
  inference_config:
    liveness_route:
      path: /health
      port: 8080
    readiness_route:
      path: /health
      port: 8080
    scoring_route:
      path: /score
      port: 8080
instance_type: <kubernetes custom instance type>
instance_count: 1
environment_variables:

  # "compute" mode is the default mode, if you want to deploy to serving mode, you need to set this env variable to "serving"
  PROMPTFLOW_RUN_MODE: serving

  # for pulling connections from workspace
  PRT_CONFIG_OVERRIDE: deployment.subscription_id=<subscription_id>,deployment.resource_group=<resource_group>,deployment.workspace_name=<workspace_name>,deployment.endpoint_name=<endpoint_name>,deployment.deployment_name=<deployment_name>

  # (Optional) When there are multiple fields in the response, using this env variable will filter the fields to expose in the response.
  # For example, if there are 2 flow outputs: "answer", "context", and I only want to have "answer" in the endpoint response, I can set this env variable to '["answer"]'.
  # If you don't set this environment, by default all flow outputs will be included in the endpoint response.
  # PROMPTFLOW_RESPONSE_INCLUDED_FIELDS: '["category", "evidence"]'
```

---

| Attribute | Description |
|--|--|
| Name | The name of the deployment. |
| Endpoint name | The name of the endpoint to create the deployment under. |
| Model | The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification. |
| Environment | The environment to host the model and code. It contains: <br>    - `image`<br>      - `inference_config`: is used to build a serving container for online deployments, including `liveness route`, `readiness_route`, and `scoring_route` . |
| Instance type | The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](../reference-managed-online-endpoints-vm-sku-list.md). |
| Instance count | The number of instances to use for the deployment. Base the value on the workload you expect. For high availability, we recommend that you set the value to at least `3`. We reserve an extra 20% for performing upgrades. For more information, see [managed online endpoint quotas](../how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints). |
| Environment variables | Following environment variables need to be set for endpoints deployed from a flow: <br> - (required) `PROMPTFLOW_RUN_MODE: serving`: specify the mode to serving <br> - (required) `PRT_CONFIG_OVERRIDE`: for pulling connections from workspace <br> - (optional) `PROMPTFLOW_RESPONSE_INCLUDED_FIELDS:`: When there are multiple fields in the response, using this env variable will filter the fields to expose in the response. <br> For example, if there are two flow outputs: "answer", "context", and if you only want to have "answer" in the endpoint response, you can set this env variable to '["answer"]'. <br> - if you want to use user-assigned identity, you need to specify `UAI_CLIENT_ID: "uai_client_id_place_holder"`<br> |

If you create a Kubernetes online deployment, you need to specify the following additional attributes:

| Attribute | Description |
|--|--|
| Type | The type of the deployment. Set the value to `kubernetes`. |
| Instance type | The instance type you have created in your kubernetes cluster to use for the deployment, represent the request/limit compute resource of the  deployment. For more detail, see [Create and manage instance type](../how-to-manage-kubernetes-instance-types.md). |

### Deploy your online endpoint to Azure

To create the endpoint in the cloud, run the following code:

```Azure CLI
az ml online-endpoint create --file endpoint.yml
```

To create the deployment named `blue` under the endpoint, run the following code:

```Azure CLI
az ml online-deployment create --file blue-deployment.yml --all-traffic
```

> [!NOTE]
>
> This deployment might take more than 15 minutes. 


> [!TIP]
>
> If you prefer not to block your CLI console, you can add the flag `--no-wait` to the command. However, this will stop the interactive display of the deployment status.

> [!IMPORTANT]
>
> The `--all-traffic` flag in the above `az ml online-deployment create` allocates 100% of the endpoint traffic to the newly created blue deployment. Though this is helpful for development and testing purposes, for production, you might want to open traffic to the new deployment through an explicit command. For example, `az ml online-endpoint update -n $ENDPOINT_NAME --traffic "blue=100"`.

### Check status of the endpoint and deployment

To check the status of the endpoint, run the following code:

```Azure CLI
az ml online-endpoint show -n basic-chat-endpoint
```

To check the status of the deployment, run the following code:

```Azure CLI
az ml online-deployment get-logs --name blue --endpoint basic-chat-endpoint
```

### Invoke the endpoint to score data by using your model

You can create a sample-request.json file like this:

```json
{
  "question": "What is Azure Machine Learning?",
  "chat_history":  []
}
```

```Azure CLI
az ml online-endpoint invoke --name basic-chat-endpoint --request-file sample-request.json
```

You can also call it with an HTTP client, for example with curl:

```bash
ENDPOINT_KEY=<your-endpoint-key>
ENDPOINT_URI=<your-endpoint-uri>

curl --request POST "$ENDPOINT_URI" --header "Authorization: Bearer $ENDPOINT_KEY" --header 'Content-Type: application/json' --data '{"question": "What is Azure Machine Learning?", "chat_history":  []}'
```

Note that you can get your endpoint key and your endpoint URI from the Azure Machine Learning workspace in **Endpoints** > **Consume** > **Basic consumption info**.

## Advanced configurations

### Deploy with different connections from flow development

You might want to override connections of the flow during deployment.

For example, if your flow.dag.yaml file uses a connection named `my_connection`, you can override it by adding environment variables of the deployment yaml like following:

**Option 1**: override connection name

```yaml
environment_variables:
  my_connection: <override_connection_name>
```

**Option 2**: override by referring to asset

```yaml
environment_variables:
  my_connection: ${{azureml://connections/<override_connection_name>}}
```

> [!NOTE]
>
> You can only refer to a connection within the same workspace.

### Deploy with a custom environment

This section will show you how to use a docker build context to specify the environment for your deployment, assuming you have knowledge of [Docker](https://www.docker.com/) and [Azure Machine Learning environments](../concept-environments.md).

1. In your local environment, create a folder named `image_build_with_reqirements` contains following files:

    ```
    |--image_build_with_reqirements
    |  |--requirements.txt
    |  |--Dockerfile
    ```
    - The `requirements.txt` should be inherited from the flow folder, which has been used to track the dependencies of the flow. 

    - The `Dockerfile` content is as following: 

        ```
        FROM mcr.microsoft.com/azureml/promptflow/promptflow-runtime:latest
        COPY ./requirements.txt .
        RUN pip install -r requirements.txt
        ```

1. replace the environment section in the deployment definition yaml file with the following content:

    ```yaml
    environment: 
      build:
        path: image_build_with_reqirements
        dockerfile_path: Dockerfile
      # deploy prompt flow is BYOC, so we need to specify the inference config
      inference_config:
        liveness_route:
          path: /health
          port: 8080
        readiness_route:
          path: /health
          port: 8080
        scoring_route:
          path: /score
          port: 8080
    ```

### Monitor the endpoint

#### Monitor prompt flow deployment metrics

You can monitor general metrics of online deployment (request numbers, request latency, network bytes, CPU/GPU/Disk/Memory utilization, and more), and prompt flow deployment specific metrics (token consumption, flow latency, etc.) by adding `app_insights_enabled: true` in the deployment yaml file. Learn more about [metrics of prompt flow deployment](./how-to-deploy-for-real-time-inference.md#view-endpoint-metrics).


## Next steps

- Learn more about [managed online endpoint schema](../reference-yaml-endpoint-online.md) and [managed online deployment schema](../reference-yaml-deployment-managed-online.md).
- Learn more about how to [test the endpoint in UI](./how-to-deploy-for-real-time-inference.md#test-the-endpoint-with-sample-data) and [monitor the endpoint](./how-to-deploy-for-real-time-inference.md#view-managed-online-endpoints-common-metrics-using-azure-monitor-optional).
- Learn more about how to [troubleshoot managed online endpoints](../how-to-troubleshoot-online-endpoints.md).
- Once you improve your flow, and would like to deploy the improved version with safe rollout strategy, see [Safe rollout for online endpoints](../how-to-safely-rollout-online-endpoints.md).
