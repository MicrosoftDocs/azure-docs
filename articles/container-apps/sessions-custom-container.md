---
title: Custom container sessions in Azure Container Apps (preview)
description: Learn to run a container in a custom session in Azure Container Apps.
services: container-apps
author: anthonychu
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/06/2024
ms.author: antchu
---

# Azure Container Apps custom container sessions (preview)

In addition to the built-in code interpreter that Azure Container Apps dynamic sessions provide, you can also use custom containers to define your own session sandboxes.

> [!NOTE]
> Azure Container Apps dynamic sessions is currently in preview. See [preview limitations](sessions.md#preview-limitations) for more information.

## Uses for custom container sessions

Custom containers allow you to build solutions tailored to your needs. They enable you to execute code or applications in environments that are fast and ephemeral and offer secure, sandboxed spaces with Hyper-V. Additionally, they can be configured with optional network isolation. Some examples include:

* **Code interpreters**: When you need to execute untrusted code in secure sandboxes by a language not supported in the built-in interpreter, or you need full control over the code interpreter environment.

* **Isolated execution**: When you need to run applications in hostile, multitenant scenarios where each tenant or user has their own sandboxed environment. These environments are isolated from each other and from the host application. Some examples include applications that run user-provided code, code that grants end user access to a cloud-based shell, and development environments.

## Using custom container sessions

To use custom container sessions, you first create a session pool with a custom container image. Azure Container Apps automatically starts containers in their own Hyper-V sandboxes using the provided image. Once the container starts up, it's available to the session pool.

When your application requests a session, an instance is instantly allocated from the pool. The session remains active until it enters an idle state, which is then automatically stopped and destroyed.

### Creating a custom container session pool

To create a custom container session pool, you need to provide a container image and pool configuration settings.

You communicate with each session using HTTP requests. The custom container must expose an HTTP server on a port that you specify to respond to these requests.

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
    --cpu 1.0 --memory 2.0Gi \
    --target-port 80 \
    --cooldown-period 300 \
    --network-status EgressDisabled \
    --max-sessions 10 \
    --ready-sessions 5 \
    --env-vars "key1=value1" "key2=value2"
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
| `--cpu` | `1.0` | The required CPU in cores. |
| `--memory` | `2.0Gi` | The required memory. |
| `--target-port` | `80` | The session port used for ingress traffic. |
| `--cooldown-period` | `300` | The number of seconds that a session can be idle before the session is terminated. The idle period is reset each time the session's API is called. Value must be between `300` and `3600`. |
| `--network-status` | Designates whether outbound network traffic is allowed from the session. Valid values are `EgressDisabled` (default) and `EgressEnabled`. |
| `--max-sessions` | `10` | The maximum number of sessions that can be allocated at the same time. |
| `--ready-sessions` | `5` | The target number of sessions that are ready in the session pool all the time. Increase this number if sessions are allocated faster than the pool is being replenished. |
| `--env-vars` | `"key1=value1" "key2=value2"` | The environment variables to set in the container. |

To update the session pool, use the `az containerapp sessionpool update` command.

# [Azure Resource Manager](#tab/arm)

To create a custom container session pool using Azure Resource Manager, create a session pool resource with the `Microsoft.ContainerApps/sessionPools` resource type. The following example shows an ARM template snippet that creates a custom container session pool.

Before you send the request, replace the placeholders between the `<>` brackets with the appropriate values for your session pool and session identifier.

```json
{
  "type": "Microsoft.ContainerApps/sessionPools",
  "apiVersion": "2024-02-02-preview",
  "name": "my-session-pool",
  "location": "westus2",
  "properties": {
    "environmentId": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerApps/environments/<ENVIRONMENT_NAME>",
    "containerType": "CustomContainer",
    "scaleConfiguration": {
      "maxConcurrentSessions": 10,
      "readySessionInstances": 5
    },
    "dynamicPoolConfiguration": {
      "executionType": "Timed",
      "cooldownPeriodInSeconds": 300
    },
    "customContainerTemplate": {
      "containers": [
        {
          "image": "myregistry.azurecr.io/my-container-image:1.0",
          "resources": {
            "cpu": 1.0,
            "memory": "2.0Gi"
          },
          "env": [
            {
              "name": "key1",
              "value": "value1"
            },
            {
              "name": "key2",
              "value": "value2"
            }
          ],
          "command": ["/bin/sh"],
          "args": ["-c", "while true; do echo hello; sleep 10; done"]
        }
      ],
      "ingress": {
        "targetPort": 80
      }
    },
    "sessionNetworkConfiguration": {
      "status": "EgressDisabled"
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
| `containerType` | `CustomContainer` | The container type of the session pool. Must be `CustomContainer` for custom container sessions. |
| `scaleConfiguration.maxConcurrentSessions` | `10` | The maximum number of sessions that can be allocated at the same time. |
| `scaleConfiguration.readySessionInstances` | `5` | The target number of sessions that are ready in the session pool all the time. Increase this number if sessions are allocated faster than the pool is being replenished. |
| `dynamicPoolConfiguration.executionType` | `Timed` | The type of execution for the session pool. Must be `Timed` for custom container sessions. |
| `dynamicPoolConfiguration.cooldownPeriodInSeconds` | `300` | The number of seconds that a session can be idle before the session is terminated. The idle period is reset each time the session's API is called. Value must be between `300` and `3600`. |
| `customContainerTemplate.containers[0]` | `myregistry.azurecr.io/my-container-image:1.0` | The container image to use for the session pool. |
| `customContainerTemplate.containers[0].resources.cpu` | `1.0` | The required CPU in cores. |
| `customContainerTemplate.containers[0].resources.memory` | `2.0Gi` | The required memory. |
| `customContainerTemplate.containers[0].env` | `{"key1": "value1", "key2": "value2"}` | The environment variables to set in the container. |
| `customContainerTemplate.containers[0].command` | `["/bin/sh"]` | The command to run in the container. |
| `customContainerTemplate.containers[0].args` | `["-c", "while true; do echo hello; sleep 10; done"]` | The arguments to pass to the command. |
| `customContainerTemplate.containers[0].ingress.targetPort` | `80` | The session port used for ingress traffic. |
| `sessionNetworkConfiguration.status` | `EgressDisabled` | Designates whether outbound network traffic is allowed from the session. Valid values are `EgressDisabled` (default) and `EgressEnabled`. |

---

> [!IMPORTANT]
> If the session is used to run untrusted code, don't include information or data that you don't want the untrusted code to access. Assume the code is malicious and has full access to the container, including its environment variables, secrets, and files. 

### Working with sessions

Your application interacts with a session using the session pool's management API.

A pool management endpoint for custom container sessions follows this format: `https://<SESSION_POOL>.<ENVIRONMENT_ID>.<REGION>.azurecontainerapps.io`.

To retrieve the session pool's management endpoint, use the `az containerapp sessionpool show` command:

```bash
az containerapp sessionpool show \
    --name <SESSION_POOL_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --query "properties.poolManagementEndpoint" \
    --output tsv
```

All requests to the pool management endpoint must include an `Authorization` header with a bearer token. To learn how to authenticate with the pool management API, see [Authentication](sessions.md#authentication).

Every request to the API requires query string parameter of `identifier` with value of the session ID. The session ID is a unique identifier for the session that allows you to interact with specific sessions. To learn more about session identifiers, see [Session identifiers](sessions.md#session-identifiers).

The following example shows a request to a custom container session by a user ID.

Before you send the request, replace the placeholders between the `<>` brackets with values specific to your request.

```http
POST https://<SESSION_POOL_NAME>.<ENVIRONMENT_ID>.<REGION>.azurecontainerapps.io/api/execute-command?identifier=<USER_ID>
Authorization: Bearer <TOKEN>

{
  "command": "echo 'Hello, world!'"
}
```

This request is forwarded to the custom container session with the identifier for the user's ID. If the session isn't already running, Azure Container Apps allocates a session from the pool before forwarding the request.

In the example, the session's container receives the request at `http://0.0.0.0:<INGRESS_PORT>/api/execute-command`.

## Next steps

> [!div class="nextstepaction"]
> [Azure Container Apps dynamic sessions overview](./sessions.md)
