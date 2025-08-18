---
title: Use session pools in Azure Container Apps
description: Learn to use and manage session pools in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 04/07/2025
ms.author: cshoe
---

# Use session pools in Azure Container Apps

Session pools provide subsecond session allocation times for new pools, and are responsible for the management and lifecycle of each session.

## Configuration

You can control the behavior of session pools using the following parameters available to `az containerapp sessionpool create`.

| Purpose | Property | Description |
|---|---|---|
| **Set max number of sessions** | `max-sessions` | The maximum number of concurrent sessions allowed in a pool. Requests that come in after the max limit is met are returned a `404` server error indicating there are no more sessions being allocated to the pool. |
| **Wait duration** | `cooldown-period` | The number of seconds that a session can be idle before the session is terminated. The idle period is reset each time the session's API is called. Value must be between `300` and `3600`. |
| **Target session quantity** | `ready-sessions` | The target number of sessions to keep ready in a pool. |

## Create a pool

The process for creating a pool is slightly different depending on whether you're creating a code interpreter pool or a custom container pool.

### Code interpreter pool

To create a code interpreter session pool using the Azure CLI, ensure you have the latest versions of the Azure CLI and the Azure Container Apps extension with the following commands:

```bash
# Upgrade the Azure CLI
az upgrade

# Install or upgrade the Azure Container Apps extension
az extension add --name containerapp --upgrade --allow-preview true -y
```

Use the `az containerapps sessionpool create` command to create the pool. The following example creates a Python code interpreter session pool named `my-session-pool`. Make sure to replace `<RESOURCE_GROUP>` with your resource group name before you run the command.

```bash
az containerapp sessionpool create \
    --name my-session-pool \
    --resource-group <RESOURCE_GROUP> \
    --location westus2 \
    --container-type PythonLTS \
    --max-sessions 100 \
    --cooldown-period 300 \
    --network-status EgressDisabled
```

You can define the following settings when you create a session pool:

| Setting | Description |
|---------|-------------|
| `--container-type` | The type of code interpreter to use. The only supported value is `PythonLTS`. |
| `--max-sessions` | The maximum number of allocated sessions allowed concurrently. The maximum value is `600`. |
| `--cooldown-period` | The number of allowed idle seconds before termination. The idle period is reset each time the session's API is called. The allowed range is between `300` and `3600`. |
| `--network-status` | Designates whether outbound network traffic is allowed from the session. Valid values are `EgressDisabled` (default) and `EgressEnabled`. |

> [!IMPORTANT]
> If you enable egress, code running in the session can access the internet. Use caution when the code is untrusted as it can be used to perform malicious activities such as denial-of-service attacks.

### Get the management API endpoint

To use code interpreter sessions with LLM framework integrations or by calling the management API endpoints directly, you need the pool's management API endpoint.

The endpoint is in the format `https://<REGION>.dynamicsessions.io/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/sessionPools/<SESSION_POOL_NAME>`.

To retrieve the management API endpoint for a session pool, use the `az containerapps sessionpool show` command. Make sure to replace `<RESOURCE_GROUP>` with your resource group name before you run the command.

```bash
az containerapp sessionpool show \
    --name my-session-pool \
    --resource-group <RESOURCE_GROUP> \
    --query 'properties.poolManagementEndpoint' -o tsv
```

### Custom container pool

To create a custom container session pool, you need to provide a container image and pool configuration settings.

You invoke or communicate with each session using HTTP requests. The custom container must expose an HTTP server on a port that you specify to respond to these requests.

# [Azure CLI](#tab/azure-cli)

To create a custom container session pool using the Azure CLI, ensure you have the latest versions of the Azure CLI and the Azure Container Apps extension with the following commands:

```bash
az upgrade
az extension add --name containerapp --upgrade --allow-preview true -y
```

Custom container session pools require a workload profile enabled Azure Container Apps environment. If you don't have an environment, use the `az containerapp env create -n <ENVIRONMENT_NAME> -g <RESOURCE_GROUP> --location <LOCATION> --enable-workload-profiles` command to create one.

Use the `az containerapp sessionpool create` command to create a custom container session pool.

The following example creates a session pool named `my-session-pool` with a custom container image `myregistry.azurecr.io/my-container-image:1.0`.

Before you send the request, replace the placeholders between the `<>` brackets with the appropriate values for your session pool and session identifier.

```bash
az containerapp sessionpool create \
    --name my-session-pool \
    --resource-group <RESOURCE_GROUP> \
    --environment <ENVIRONMENT> \
    --registry-server myregistry.azurecr.io \
    --registry-username <USER_NAME> \
    --registry-password <PASSWORD> \
    --container-type CustomContainer \
    --image myregistry.azurecr.io/my-container-image:1.0 \
    --cpu 0.25 --memory 0.5Gi \
    --target-port 80 \
    --cooldown-period 300 \
    --network-status EgressDisabled \
    --max-sessions 10 \
    --ready-sessions 5 \
    --env-vars "key1=value1" "key2=value2" \
    --location <LOCATION>
```

This command creates a session pool with the following settings:

| Parameter | Value | Description |
|---------|-------|-------------|
| `--name` | `my-session-pool` | The name of the session pool. |
| `--resource-group` | `my-resource-group` | The resource group that contains the session pool. |
| `--environment` | `my-environment` | The name or resource ID of the container app's environment. |
| `--container-type` | `CustomContainer` | The container type of the session pool. Must be `CustomContainer` for custom container sessions. |
| `--image` | `myregistry.azurecr.io/my-container-image:1.0` | The container image to use for the session pool. |
| `--registry-server` | `myregistry.azurecr.io` | The container registry server hostname. |
| `--registry-username` | `my-username` | The username to log in to the container registry. |
| `--registry-password` | `my-password` | The password to log in to the container registry. |
| `--cpu` | `0.25` | The required CPU in cores. |
| `--memory` | `0.5Gi` | The required memory. |
| `--target-port` | `80` | The session port used for ingress traffic. |
| `--cooldown-period` | `300` | The number of seconds that a session can be idle before the session is terminated. The idle period is reset each time the session's API is called. Value must be between `300` and `3600`. |
| `--network-status` | `EgressDisabled` |Designates whether outbound network traffic is allowed from the session. Valid values are `EgressDisabled` (default) and `EgressEnabled`. |
| `--max-sessions` | `10` | The maximum number of sessions that can be allocated at the same time. |
| `--ready-sessions` | `5` | The target number of sessions that are ready in the session pool all the time. Increase this number if sessions are allocated faster than the pool is being replenished. |
| `--env-vars` | `"key1=value1" "key2=value2"` | The environment variables to set in the container. |
| `--location` | `"Supported Location"` | The location of the session pool. |

To check on the status of the session pool, use the `az containerapp sessionpool show` command:

```bash
az containerapp sessionpool show \
    --name <SESSION_POOL_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --query "properties.poolManagementEndpoint" \
    --output tsv
```

To update the session pool, use the `az containerapp sessionpool update` command.

# [Azure Resource Manager](#tab/arm)

To create a custom container session pool using Azure Resource Manager, create a session pool resource with the `Microsoft.ContainerApps/sessionPools` resource type. The following example shows an ARM template snippet that creates a custom container session pool.

Before you send the request, replace the placeholders between the `<>` brackets with the appropriate values for your session pool and session identifier.

```json
{
  "type": "Microsoft.App/sessionPools",
  "apiVersion": "2024-08-02-preview",
  "name": "my-session-pool",
  "location": "westus2",
  "properties": {
    "environmentId": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerApps/environments/<ENVIRONMENT_NAME>",
    "poolManagementType": "Dynamic",
    "containerType": "CustomContainer",
    "scaleConfiguration": {
      "maxConcurrentSessions": 10,
      "readySessionInstances": 5
    },
    "dynamicPoolConfiguration": {
      "executionType": "Timed",
      "cooldownPeriodInSeconds": 600
    },
    "secrets": [
      {
        "name": "registrypassword",
        "value": "<REGISTRY_PASSWORD>"
      }
    ],
    "customContainerTemplate": {
      "registryCredentials": {
          "server": "myregistry.azurecr.io",
          "username": "myregistry",
          "passwordSecretRef": "registrypassword"
      },
      "containers": [
        {
          "image": "myregistry.azurecr.io/my-container-image:1.0",
          "name": "mycontainer",
          "resources": {
            "cpu": 0.25,
            "memory": "0.5Gi"
          },
          "command": [
            "/bin/sh"
          ],
          "args": [
            "-c",
            "while true; do echo hello; sleep 10;done"
          ],
          "env": [
            {
              "name": "key1",
              "value": "value1"
            },
            {
              "name": "key2",
              "value": "value2"
            }
          ]
        }
      ],
      "ingress": {
        "targetPort": 80
      }
    },
    "sessionNetworkConfiguration": {
      "status": "EgressEnabled"
    }
  }
}
```

This template creates a session pool with the following settings:

| Parameter | Value | Description |
|---------|-------|-------------|
| `name` | `my-session-pool` | The name of the session pool. |
| `location` | `westus2` | The location of the session pool. |
| `environmentId` | `/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerApps/environments/<ENVIRONMENT_NAME>` | The resource ID of the container app's environment. |
| `poolManagementType` | `Dynamic` | Must be `Dynamic` for custom container sessions. |
| `containerType` | `CustomContainer` | The container type of the session pool. Must be `CustomContainer` for custom container sessions. |
| `scaleConfiguration.maxConcurrentSessions` | `10` | The maximum number of sessions that can be allocated at the same time. |
| `scaleConfiguration.readySessionInstances` | `5` | The target number of sessions that are ready in the session pool all the time. Increase this number if sessions are allocated faster than the pool is being replenished. |
| `dynamicPoolConfiguration.executionType` | `Timed` | The type of execution for the session pool. Must be `Timed` for custom container sessions. |
| `dynamicPoolConfiguration.cooldownPeriodInSeconds` | `600` | The number of seconds that a session can be idle before the session is terminated. The idle period is reset each time the session's API is called. Value must be between `300` and `3600`. |
| `secrets` | `[{ "name": "registrypassword", "value": "<REGISTRY_PASSWORD>" }]` | A list of secrets. |
| `customContainerTemplate.registryCredentials.server` | `myregistry.azurecr.io` | The container registry server hostname. |
| `customContainerTemplate.registryCredentials.username` | `myregistry` | The username to log in to the container registry. |
| `customContainerTemplate.registryCredentials.passwordSecretRef` | `registrypassword` | The name of the secret that contains the password to log in to the container registry. |
| `customContainerTemplate.containers[0].image` | `myregistry.azurecr.io/my-container-image:1.0` | The container image to use for the session pool. |
| `customContainerTemplate.containers[0].name` | `mycontainer` | The name of the container. |
| `customContainerTemplate.containers[0].resources.cpu` | `0.25` | The required CPU in cores. |
| `customContainerTemplate.containers[0].resources.memory` | `0.5Gi` | The required memory. |
| `customContainerTemplate.containers[0].env` | Array of name-value pairs | The environment variables to set in the container. |
| `customContainerTemplate.containers[0].command` | `["/bin/sh"]` | The command to run in the container. |
| `customContainerTemplate.containers[0].args` | `["-c", "while true; do echo hello; sleep 10;done"]` | The arguments to pass to the command. |
| `customContainerTemplate.containers[0].ingress.targetPort` | `80` | The session port used for ingress traffic. |
| `sessionNetworkConfiguration.status` | `EgressDisabled` | Designates whether outbound network traffic is allowed from the session. Valid values are `EgressDisabled` (default) and `EgressEnabled`. |

---

> [!IMPORTANT]
> If the session is used to run untrusted code, don't include information or data that you don't want the untrusted code to access. Assume the code is malicious and has full access to the container, including its environment variables, secrets, and files.

## Management endpoint

> [!IMPORTANT]
> The session identifier is sensitive information which requires a secure process as you create and manage its value. To protect this value, your application must ensure each user or tenant only has access to their own sessions.
>
> Failure to secure access to sessions could result in misuse or unauthorized access to data stored in your users' sessions. For more information, see [Session identifiers](./sessions-usage.md#identifiers)

The following endpoints are available for managing sessions in a pool:

| Endpoint path | Method | Description |
|----------|--------|-------------|
| `code/execute` | `POST` | Execute code in a session. |
| `files/upload` | `POST` | Upload a file to a session. |
| `files/content/{filename}` | `GET` | Download a file from a session. |
| `files` | `GET` | List the files in a session. |

You build the full URL for each endpoint by concatenating the pool's management API endpoint with the endpoint path. The query string must include an `identifier` parameter containing the session identifier, and an `api-version` parameter with the value `2024-02-02-preview`.

For example: `https://<REGION>.dynamicsessions.io/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/sessionPools/<SESSION_POOL_NAME>/code/execute?api-version=2024-02-02-preview&identifier=<IDENTIFIER>`

To retrieve the session pool's management endpoint, use the `az containerapp sessionpool show` command:

```bash
az containerapp sessionpool show \
    --name <SESSION_POOL_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --query "properties.poolManagementEndpoint" \
    --output tsv
```

All requests to the pool management endpoint must include an `Authorization` header with a bearer token. To learn how to authenticate with the pool management API, see [Authentication](sessions-usage.md#authentication).

Each API request must also include the query string parameter `identifier` with the session ID. This unique session ID enables your application to interact with specific sessions. To learn more about session identifiers, see [Session identifiers](sessions-usage.md#identifiers).

## Image caching

When a session pool is created or updated, Azure Container Apps caches the container image in the pool. This caching helps speed-up the process of creating new sessions.

Any changes to the image aren't automatically reflected in the sessions. To update the image, update the session pool with a new image tag. Use a unique tag for each image update to ensure that the new image is pulled.

## Related content

- **Session types**: Learn about the different types of dynamic sessions:
  - [Code interpreter sessions](./sessions-code-interpreter.md)
  - [Custom container sessions](./sessions-custom-container.md)

- **Tutorials**: Work directly with the REST API or via an LLM agent:
  - Use an LLM agent:
    - [AutoGen](./sessions-tutorial-autogen.md)
    - [LangChain](./sessions-tutorial-langchain.md)
    - [LlamaIndex](./sessions-tutorial-llamaindex.md)
    - [Semantic Kernel](./sessions-tutorial-semantic-kernel.md)
  - Use the REST API
    - [JavaScript Code interpreter](./sessions-tutorial-nodejs.md)
