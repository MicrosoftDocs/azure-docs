---
title: Azure Container Apps custom container sessions
description: 
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 04/04/2024
ms.author: cshoe
---

# Azure Container Apps custom container sessions

In addition to the built-in code interpreter that Azure Container Apps dynamic sessions provides, you can also use custom containers to define your own session sandboxes.

> [!NOTE]
> Azure Container Apps dynamic sessions is currently in preview.

## Uses for custom container sessions

You can use custom containers to build any solution where you need to run code or applications in fast, ephemeral, and secure sandboxed environments that have Hyper-V and optional network isolation. Some examples include:

* Running code interpreters to execute untrusted code in secure sandboxes, but with a language that's not supported by the built-in code interpreter or you need full control over the code interpreter environment.

* Running any application in hostile, multi-tenant scenarios where you need to ensure each tenant or user has their own sandboxed environments that are isolated from each other and from the host application. Some examples include applications that run user-provided code or gives end user access to a cloud-based shell or development environment.

## Using custom container sessions

To use custom container sessions, you first create a session pool with a custom container image. Azure Container Apps automatically starts containers in their own Hyper-V sandboxes using the provided image. Once the container has started, it is available for use by the session pool. When your application requests a session, it's instantly allocated one from the pool. The session remains active until it's idle for a period of time, at which point it's automatically stopped and destroyed.

### Creating a custom container session pool

To create a custom container session pool, you need to provide a container image and some pool configuration settings.

You communicate with each session using HTTP requests. The custom container must expose an HTTP server on a port that you specify to respond to these requests.

# [Azure CLI](#tab/azure-cli)

To create a custom container session pool using the Azure CLI, ensure you have the latest versions of the Azure CLI and the Azure Container Apps extension. Run the following command:

```bash
az upgrade
az extension add --name containerapps --upgrade --allow-preview
```

Custom container session pools require an Azure Container Apps environment. If you don't have an environment, use the `az containerapp env create` command to create one. The following example creates an environment named `my-environment` in the resource group `my-resource-group`:

```bash
az containerapp env create --name my-environment --resource-group my-resource-group --location westus2
```

Use the `az containerapp sessionpool create` command to create a custom container session pool. The following example creates a session pool named `my-session-pool` with a custom container image `myregistry.azurecr.io/my-container-image:1.0`:

```bash
az containerapp sessionpool create \
    --name my-session-pool --resource-group my-resource-group \
    --environment my-environment \
    --container-type CustomContainer \
    --image myregistry.azurecr.io/my-container-image:1.0 \ 
    --registry-server myregistry.azurecr.io --registry-username my-username --registry-password my-password \
    --cpu 1.0 --memory 2.0Gi \
    --target-port 80 --cooldown-period 300 --egress-enabled false \
    --max-concurrent-sessions 10 --ready-session-instances 5 \
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
| `--cooldown-period` | `300` | The period (in seconds) since the last request sent to the session, after which the session will be deleted. |
| `--egress-enabled` | `false` | Whether the session can make outbound network requests. |
| `--max-concurrent-sessions` | `10` | The maximum number of sessions that can be allocated at the same time. |
| `--ready-session-instances` | `5` | The target number of sessions that will be ready in the session pool all the time. |
| `--env-vars` | `"key1=value1" "key2=value2"` | The environment variables to set in the container. |

To update the session pool, use the `az containerapp sessionpool update` command.

# [Azure Resource Manager](#tab/arm)

To create a custom container session pool using ARM, you need to create a session pool resource with the `Microsoft.ContainerApps/sessionPools` resource type. The following example shows an ARM template snippet that creates a custom container session pool:

```json
{
  "type": "Microsoft.ContainerApps/sessionPools",
  "apiVersion": "2024-02-02-preview",
  "name": "my-session-pool",
  "location": "westus2",
  "properties": {
    "environmentId": "/subscriptions/<subscription-id>/resourceGroups/my-resource-group/providers/Microsoft.ContainerApps/environments/my-environment",
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

---

> [!IMPORTANT]
> If the session is used for running untrusted code, assume that the code is malicious and has full access to the container, including environment variables and secrets. Don't include environment variables or secrets that you don't want the untrusted code to access.

### Working with sessions

Your application interacts with a session using the session pool's management API. A pool management endpoint for custom container sessions looks like this: `https://<your-session-pool>.<environment-identifier>.<region>.azurecontainerapps.io`.

To retrieve the pool's management endpoint, use the `az containerapp sessionpool show` command:

```bash
az containerapp sessionpool show --name my-session-pool --resource-group my-resource-group \
    --query "properties.poolManagementEndpoint" --output tsv
```

On all requests to the pool management endpoint, you must include an `Authorization` header with a bearer token. To learn how to authenticate with the pool management API, see [Authentication](sessions.md#authentication).

You must also include a query parameter `identifier` with the session ID. The session ID is a unique identifier for the session that you want to interact with. To learn more about session identifiers, see [Session identifiers](sessions.md#session-identifiers).

The following example shows a request to a custom container session with the identifier `user-123`:

```http
POST https://<your-session-pool>.<environment-identifier>.<region>.azurecontainerapps.io/api/execute-command?identifier=user-123
Authorization: Bearer <your-token>

{
  "command": "echo 'Hello, world!'"
}
```

This request is forwarded to the custom container session with the identifier `user-123`. If the session isn't already running, Azure Container Apps allocates a session from the pool before forwarding the request.

In the example, the session's container receives the request at `http://0.0.0.0:<ingress_port>/api/execute-command`.

## Next steps

> [!div class="nextstepaction"]
> [Azure Container Apps dynamic sessions overview](./sessions.md)
