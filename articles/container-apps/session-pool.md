---
title: Use session pools in Azure Container Apps
description: Learn to use and manage session pools in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 03/31/2026
ms.author: cshoe
---

# Use session pools in Azure Container Apps

Session pools provide subsecond session allocation times and manage the lifecycle of each session.

## Common concepts for both pools

The process for creating a pool is slightly different depending on whether you're creating a code interpreter session pool or a custom container pool. The following concepts apply to both.

To create session pools using the Azure CLI, ensure you have the latest versions of the Azure CLI and the Azure Container Apps extension:

```bash
# Upgrade the Azure CLI
az upgrade

# Install or upgrade the Azure Container Apps extension
az extension add --name containerapp --upgrade --allow-preview true -y
```

Common session pool commands include:

- `az containerapp sessionpool create`
- `az containerapp sessionpool show`
- `az containerapp sessionpool list`
- `az containerapp sessionpool update`
- `az containerapp sessionpool delete`

Use `--help` with any command to see available arguments and supported values.

To check the status of a session pool, use the `az containerapp sessionpool show` command:

```bash
az containerapp sessionpool show \
    --name <SESSION_POOL_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --query "properties.poolManagementEndpoint" \
    --output tsv
```

When you create or update a pool, you can set a maximum number of concurrent sessions, an idle cooldown period, and whether outbound network traffic is allowed for sessions.

> [!IMPORTANT]
> If you enable egress, code running in the session can access the internet. Use caution when the code is untrusted because it can be used to perform malicious activities such as denial-of-service attacks.

> [!IMPORTANT]
> If the session is used to run untrusted code, don't include information or data that you don't want the untrusted code to access. Assume the code is malicious and has full access to the container, including its environment variables, secrets, and files.

## Configure a pool

Use `az containerapp sessionpool create --help` to see the latest CLI arguments for session pool configuration. This section focuses on advanced configuration options that apply across API versions.

### Session lifecycle configuration

When you create or update a session pool, you can configure how sessions are terminated by setting `properties.dynamicPoolConfiguration.lifecycleConfiguration`. Starting with API version `2025-01-01`, choose one of two lifecycle types.

For the full API specification, see the [SessionPools API spec](/rest/api/resource-manager/containerapps/container-apps-session-pools/create-or-update?tabs=HTTP).

#### Timed (default)

With the `Timed` lifecycle, a session is deleted after a period of inactivity. Any request sent to a session resets the cooldown timer, extending the session's time-to-live by `cooldownPeriodInSeconds`.

> [!NOTE]
> `Timed` is supported for all session pool types and works the same as `executionType: Timed` in earlier API versions.

```json
{
  "dynamicPoolConfiguration": {
    "lifecycleConfiguration": {
      "cooldownPeriodInSeconds": 600,
      "lifecycleType": "Timed"
    }
  }
}
```

| Property | Description |
| --- | --- |
| `cooldownPeriodInSeconds` | The session is deleted when there are no requests for this duration. |
| `maxAlivePeriodInSeconds` | Not supported for `Timed` lifecycle. |

## Management endpoint

> [!IMPORTANT]
> The session identifier is sensitive information which requires a secure process as you create and manage its value. To protect this value, your application must ensure each user or tenant only has access to their own sessions.
>
> Failure to secure access to sessions could result in misuse or unauthorized access to data stored in your users' sessions. For more information, see [Session identifiers](./sessions-usage.md#identifiers)

All requests to the pool management endpoint must include an `Authorization` header with a bearer token. To learn how to authenticate with the pool management API, see [Authentication](sessions-usage.md#authentication).

Most API requests also require the query string parameter `identifier` with the session ID. This unique session ID enables your application to interact with specific sessions. Pool-wide operations like listing sessions don't require an identifier. To learn more about session identifiers, see [Session identifiers](./sessions-usage.md#identifiers).

## Image caching

When a session pool is created or updated, Azure Container Apps caches the container image in the pool. This caching helps speed up the process of creating new sessions.

Any changes to the image aren't automatically reflected in the sessions. To update the image, update the session pool with a new image tag. Use a unique tag for each image update to ensure that the new image is pulled.

## Code interpreter session pool

# [Azure CLI](#tab/code-interpreter-azure-cli)

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
| `--container-type` | The type of code interpreter to use. Supported values include `PythonLTS`, `NodeLTS`, `Shell`, and `CustomContainer`. |
| `--max-sessions` | The maximum number of allocated sessions allowed concurrently. The maximum value is `600`. |
| `--cooldown-period` | The number of allowed idle seconds before termination. The idle period is reset each time the session's API is called. The allowed range is between `300` and `3600`. |
| `--network-status` | Specifies whether outbound network traffic is allowed from the session. Valid values are `EgressDisabled` (default) and `EgressEnabled`. |

# [Azure portal](#tab/code-interpreter-azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar at the top of the portal, search for and select **Container Apps Session Pools**.

1. Select **Create**.

1. In the **Basics** tab, enter the following values:

    | Setting | Action |
    |---------|--------|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select an existing resource group or select **Create new**. |
    | Session pool name | Enter a name for your session pool. |
    | Region | Select a supported region. |
    | Pool type | Select **Code interpreter**. |
    | Container type | Select **PythonLTS**, **NodeLTS**, or **Shell**. |

1. In the **Configuration** section, enter the following values:

    | Setting | Action |
    |---------|--------|
    | Maximum sessions | Enter the maximum number of concurrent sessions. The maximum value is `600`. |
    | Cooldown period (seconds) | Enter the number of idle seconds before a session is terminated. The allowed range is `300` to `3600`. |
    | Outbound network | Select **Disabled** to block outbound traffic, or **Enabled** to allow it. |

    > [!IMPORTANT]
    > If you enable outbound network access, code running in the session can access the internet. Use caution when the code is untrusted.

1. Select **Review + create**.

1. After validation passes, select **Create**.

---

### Code interpreter management endpoint

To use code interpreter sessions with LLM framework integrations or by calling the management API endpoints directly, you need the pool's management API endpoint.

The endpoint is in the format `https://<REGION>.dynamicsessions.io/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/sessionPools/<SESSION_POOL_NAME>`.

To retrieve the management API endpoint for a session pool, see the common section above for an example command.

The following endpoints are available for managing sessions in a pool:

| Endpoint path | Method | Description |
|----------|--------|-------------|
| `code/execute` | `POST` | Execute code in a session. |
| `files/upload` | `POST` | Upload a file to a session. |
| `files/content/{filename}` | `GET` | Download a file from a session. |
| `files` | `GET` | List the files in a session. |
| `.management/getSession` | `POST` | Get details about a specific session. |
| `.management/listSessions` | `POST` | List all sessions in the pool with pagination. |

You build the full URL for each endpoint by concatenating the pool's management API endpoint with the endpoint path. The query string must include an `identifier` parameter containing the session identifier, and an `api-version` parameter with the value `2024-02-02-preview`. API versions can change, so always confirm the latest version in the REST API docs before using it in production.

For example: `{sessionManagementEndpoint}/code/execute?api-version=2024-02-02-preview&identifier=<IDENTIFIER>`

For the `getSession` and `listSessions` endpoints, see [Retrieve session information](./sessions-usage.md#retrieve-session-information) for request and response details.

For REST API references, see [Container Apps data-plane APIs](/rest/api/containerapps/#data-plane-apis) and the [Container Apps data-plane operations overview](/rest/api/data-plane/containerapps/operation-groups).

## Custom container session pool

To create a custom container session pool, you need to provide a container image and pool configuration settings.

You invoke or communicate with each session using HTTP requests. The custom container must expose an HTTP server on a port that you specify to respond to these requests.

The following capabilities apply only to custom container session pools.

### Custom container management endpoint

For custom container session pools, get the management endpoint from the Azure portal or the Azure CLI output. The endpoint is returned as `poolManagementEndpoint`.

The endpoint is in the format `https://<SESSION_POOL_NAME>.<ENVIRONMENT_ID>.<REGION>.azurecontainerapps.io`. 

Custom container pools support the same management endpoints as code interpreter pools, plus custom application endpoints you define:

| Endpoint path | Method | Description |
|----------|--------|-------------|
| `*` (custom paths) | `POST`, `GET` | Custom endpoints defined by your container application. |
| `.management/getSession` | `POST` | Get details about a specific session. |
| `.management/listSessions` | `POST` | List all sessions in the pool with pagination. |

For the `getSession` and `listSessions` endpoints, see [Retrieve session information](./sessions-usage.md#retrieve-session-information) for request and response details.

#### OnContainerExit

With the `OnContainerExit` lifecycle, a session remains active until the container exits on its own or the maximum alive period is reached.

```json
{
  "dynamicPoolConfiguration": {
    "lifecycleConfiguration": {
      "maxAlivePeriodInSeconds": 6000,
      "lifecycleType": "OnContainerExit"
    }
  }
}
```

| Property | Description |
| --- | --- |
| `maxAlivePeriodInSeconds` | Maximum time the session can stay alive before being deleted. |
| `cooldownPeriodInSeconds` | Not supported for `OnContainerExit` lifecycle. |

#### Container probes

Container probes let you define health checks for session containers so the pool can detect unhealthy sessions and replace them to keep the `readySessionInstances` target healthy.

Session pools support **Liveness** and **Startup** probes. For more information about probe behavior, see [Health probes in Azure Container Apps](/azure/container-apps/health-probes?tabs=arm-template).

When creating or updating a session pool, specify probes in `properties.customContainerTemplate.containers`. For the complete request body schema, see the [SessionPools Create or Update API reference](/rest/api/resource-manager/containerapps/container-apps-session-pools/create-or-update). The following example shows a partial configuration with probe definitions:

```json
{
  "properties": {
    "customContainerTemplate": {
      "containers": [
        {
          "name": "my-session-container",
          "image": "myregistry.azurecr.io/my-session-image:latest",
          "probes": [
            {
              "type": "Liveness",
              "httpGet": {
                "path": "/health",
                "port": 8080
              },
              "periodSeconds": 10,
              "failureThreshold": 3
            },
            {
              "type": "Startup",
              "httpGet": {
                "path": "/ready",
                "port": 8080
              },
              "periodSeconds": 5,
              "failureThreshold": 30
            }
          ]
        }
      ]
    },
    "dynamicPoolConfiguration": {
      "readySessionInstances": 5
    }
  }
}
```

# [Azure CLI](#tab/custom-container-azure-cli)

Custom container session pools require a workload profiles-enabled Azure Container Apps environment. If you don't have an environment, use the `az containerapp env create -n <ENVIRONMENT_NAME> -g <RESOURCE_GROUP> --location <LOCATION>` command to create one.

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
| `--network-status` | `EgressDisabled` | Specifies whether outbound network traffic is allowed from the session. Valid values are `EgressDisabled` (default) and `EgressEnabled`. |
| `--max-sessions` | `10` | The maximum number of sessions that can be allocated at the same time. |
| `--ready-sessions` | `5` | The target number of sessions that are ready in the session pool all the time. Increase this number if sessions are allocated faster than the pool is being replenished. |
| `--env-vars` | `"key1=value1" "key2=value2"` | The environment variables to set in the container. |
| `--location` | `"Supported Location"` | The location of the session pool. |

To update the session pool, use the `az containerapp sessionpool update` command.

# [Azure portal](#tab/custom-container-azure-portal)

Custom container session pools require a workload profiles-enabled Azure Container Apps environment.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar at the top of the portal, search for and select **Container Apps Session Pools**.

1. Select **Create**.

1. In the **Basics** tab, enter the following values:

    | Setting | Action |
    |---------|--------|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select an existing resource group or select **Create new**. |
    | Session pool name | Enter a name for your session pool. |
    | Pool type | Select **Custom container**. |
    | Maximum concurrent sessions | Enter the maximum number of sessions that can be allocated at the same time. |
    | Session cooldown period (seconds) | Enter the number of idle seconds before a session is terminated. The allowed range is `300` to `3600`. |
    | Ready session instances | Enter the target number of sessions to keep ready in the pool at all times. |
    | Network egress | Select **Disabled** to block outbound traffic, or **Enabled** to allow it. |

1. In the **Container Apps environment** section, enter the following values:

    | Setting | Action |
    |---------|--------|
    | Region | Select a supported region. |
    | Container Apps environment | Select an existing environment or select **Create new environment**. |

    > [!NOTE]
    > The environment houses your Log Analytics workspace. You can also add a virtual network and Application Insights. To see environments from all regions, select **Show environments in all regions**.

1. In the **Container** tab, enter the following values:

    In the **Session custom container source** section, enter the following values:

    | Setting | Action |
    |---------|--------|
    | Name | Enter a name for the container. |
    | Build type | Select the build type for the container. |
    | Subscription | Select the subscription that contains your container registry. |
    | Registry | Select your container registry. |
    | Image | Select the container image. |
    | Image tag | Select the image tag. |
    | Command override | (Optional) Enter a command to override the container's default entrypoint. Example: `/bin/bash`. |
    | Arguments override | (Optional) Enter arguments to pass to the command override. Example: `-c, while true; do echo hello; sleep 10; done`. |

    > [!NOTE]
    > You can update these settings after creating the session pool.

    In the **Ingress** section, enter the following value:

    | Setting | Action |
    |---------|--------|
    | Target port | Enter the port that the session container exposes for HTTP traffic. Default is `80`. |

    In the **Container resource allocation** section, select the **CPU and memory** allocation for the container.

    Optionally, add environment variables in the **Environment variables** section.

1. Select **Review + create**.

1. After validation passes, select **Create**.

# [Azure Resource Manager](#tab/custom-container-arm)

To use Azure Resource Manager for session pools, see the [SessionPools REST API overview](/rest/api/resource-manager/containerapps/container-apps-session-pools).

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
