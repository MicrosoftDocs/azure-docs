---
title: Custom container sessions in Azure Container Apps
description: Learn to run a container in a custom session in Azure Container Apps.
services: container-apps
author: anthonychu
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 10/24/2024
ms.author: antchu
ms.collection: ce-skilling-ai-copilot
---

# Azure Container Apps custom container sessions

In addition to the built-in code interpreter that Azure Container Apps dynamic sessions provide, you can also use custom containers to define your own session sandboxes.

## Uses for custom container sessions

Custom containers allow you to build solutions tailored to your needs. They enable you to execute code or run applications in environments that are fast and ephemeral and offer secure, sandboxed spaces with Hyper-V. Additionally, they can be configured with optional network isolation. Some examples include:

* **Code interpreters**: When you need to execute untrusted code in secure sandboxes by a language not supported in the built-in interpreter, or you need full control over the code interpreter environment.

* **Isolated execution**: When you need to run applications in hostile, multitenant scenarios where each tenant or user has their own sandboxed environment. These environments are isolated from each other and from the host application. Some examples include applications that run user-provided code, code that grants end user access to a cloud-based shell, AI agents, and development environments.

## Using custom container sessions

To use custom container sessions, you first create a session pool with a custom container image. Azure Container Apps automatically starts containers in their own Hyper-V sandboxes using the provided image. Once the container starts up, it's available to the session pool.

When your application requests a session, an instance is instantly allocated from the pool. The session remains active until it enters an idle state, which is then automatically stopped and destroyed.

### Creating a custom container session pool

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

#### Image caching

When a session pool is created or updated, Azure Container Apps caches the container image in the pool. This caching helps speed up the process of creating new sessions.

Any changes to the image aren't automatically reflected in the sessions. To update the image, update the session pool with a new image tag. Use a unique tag for each image update to ensure that the new image is pulled.

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

Each API request must also include the query string parameter `identifier` with the session ID. This unique session ID enables your application to interact with specific sessions. To learn more about session identifiers, see [Session identifiers](sessions.md#session-identifiers).

> [!IMPORTANT]
> The session identifier is sensitive information which requires a secure process as you create and manage its value. To protect this value, your application must ensure each user or tenant only has access to their own sessions.
> Failure to secure access to sessions may result in misuse or unauthorized access to data stored in your users' sessions. For more information, see [Session identifiers](sessions.md#session-identifiers)

#### Forwarding requests to the session's container:

Anything in the path following the base pool management endpoint is forwarded to the session's container.

For example, if you make a call to `<POOL_MANAGEMENT_ENDPOINT>/api/uploadfile`, the request is routed to the session's container at `0.0.0.0:<TARGET_PORT>/api/uploadfile`.

#### Continuous session interaction:

You can continue making requests to the same session. If there are no requests to the session for longer than the cooldown period, the session is automatically deleted.

#### Sample request

The following example shows a request to a custom container session by a user ID.

Before you send the request, replace the placeholders between the `<>` brackets with values specific to your request.

```http
POST https://<SESSION_POOL_NAME>.<ENVIRONMENT_ID>.<REGION>.azurecontainerapps.io/<API_PATH_EXPOSED_BY_CONTAINER>?identifier=<USER_ID>
Authorization: Bearer <TOKEN>
{
  "command": "echo 'Hello, world!'"
}
```

This request is forwarded to the custom container session with the identifier for the user's ID. If the session isn't already running, Azure Container Apps allocates a session from the pool before forwarding the request.

In the example, the session's container receives the request at `http://0.0.0.0:<INGRESS_PORT>/<API_PATH_EXPOSED_BY_CONTAINER>`.

### Using managed identity

A managed identity from Microsoft Entra ID allows your custom container session pools and their sessions to access other Microsoft Entra protected resources. For more about managed identities in Microsoft Entra ID, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

You can enable managed identities for your custom container session pools. Both system-assigned and user-assigned managed identities are supported.

There are two ways to use managed identities with custom container session pools:

* **Image pull authentication**: Use the managed identity to authenticate with the container registry to pull the container image.

* **Resource access**: Use the session pool's managed identity in a session to access other Microsoft Entra protected resources. Due to its security implications, this capability is disabled by default.

    > [!IMPORTANT]
    > If you enable access to managed identity in a session, any code or programs running in the session can create Entra tokens for the pool's managed identity. Since sessions typically run untrusted code, use this feature with caution.

# [Azure CLI](#tab/azure-cli)

To enable managed identity for a custom container session pool, use Azure Resource Manager.

# [Azure Resource Manager](#tab/arm)

To enable managed identity for a custom container session pool, add an `identity` property to the session pool resource. The `identity` property must have a `type` property with the value `SystemAssigned` or `UserAssigned`. For details on how to configure this property, see [Configure managed identities](managed-identity.md?tabs=arm%2Cdotnet#configure-managed-identities).

The following example shows an ARM template snippet that enables a user-assigned identity for a custom container session pool and use it for image pull authentication. Before you send the request, replace the placeholders between the `<>` brackets with the appropriate values for your session pool and session identifier.

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
    "customContainerTemplate": {
      "registryCredentials": {
          "server": "myregistry.azurecr.io",
          "identity": "<IDENTITY_RESOURCE_ID>"
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
    },
    "managedIdentitySettings": [
      {
        "identity": "<IDENTITY_RESOURCE_ID>",
        "lifecycle": "None"
      }
    ]
  },
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "<IDENTITY_RESOURCE_ID>": {}
    }
  }
}
```

This template contains the following additional settings for managed identity:

| Parameter | Value | Description |
|---------|-------|-------------|
| `customContainerTemplate.registryCredentials.identity` | `<IDENTITY_RESOURCE_ID>` | The resource ID of the managed identity to use for image pull authentication. |
| `managedIdentitySettings.identity` | `<IDENTITY_RESOURCE_ID>` | The resource ID of the managed identity to use in the session. |
| `managedIdentitySettings.lifecycle` | `None` | The session lifecycle where the managed identity is available.<br><br>- `None` (default): The session can't access the identity. It's only used for image pull.<br><br>- `Main`: In addition to image pull, the main session can also access the identity. **Use with caution.** |

---

## Logging

Console logs from custom container sessions are available in the Azure Log Analytics workspace associated with the Azure Container Apps environment in a table named `AppEnvSessionConsoleLogs_CL`.

## Billing

Custom container sessions are billed based on the resources consumed by the session pool. For more information, see [Azure Container Apps billing](billing.md#custom-container).

## Next steps

> [!div class="nextstepaction"]
> [Azure Container Apps dynamic sessions overview](./sessions.md)
