---
title: Containers in Azure Container Apps
description: Learn how containers are managed and configured in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 08/29/2023
ms.author: cshoe
---

# Containers in Azure Container Apps

Azure Container Apps manages the details of Kubernetes and container orchestration for you. Containers in Azure Container Apps can use any runtime, programming language, or development stack of your choice.

:::image type="content" source="media/containers/azure-container-apps-containers.png" alt-text="Azure Container Apps: Containers":::

Azure Container Apps supports:

- Any Linux-based x86-64 (`linux/amd64`) container image
- Containers from any public or private container registry
- [Sidecar](#sidecar-containers) and [init](#init-containers) containers

Features also include:

- Changes to the `template` configuration section trigger a new [container app revision](application-lifecycle-management.md).
- If a container crashes, it automatically restarts.

Jobs features include:

- Job executions use the `template` configuration section to define the container image and other settings when each execution starts.
- If a container exits with a non-zero exit code, the job execution is marked as failed. You can configure a job to retry failed executions.

## Configuration

Most container apps have a single container. In advanced scenarios, an app may also have sidecar and init containers. In a container app definition, the main app and its sidecar containers are listed in the `containers` array in the [`properties.template`](azure-resource-manager-api-spec.md#propertiestemplate) section, and init containers are listed in the `initContainers` array. The following excerpt shows the available configuration options when setting up an app's containers.

```json
{
  "properties": {
    "template": {
      "containers": [
        {
          "name": "main",
          "image": "[parameters('container_image')]",
          "env": [
            {
              "name": "HTTP_PORT",
              "value": "80"
            },
            {
              "name": "SECRET_VAL",
              "secretRef": "mysecret"
            }
          ],
          "resources": {
            "cpu": 0.5,
            "memory": "1Gi"
          },
          "volumeMounts": [
            {
              "mountPath": "/appsettings",
              "volumeName": "appsettings-volume"
            }
          ],
          "probes": [
            {
              "type": "liveness",
              "httpGet": {
                "path": "/health",
                "port": 8080,
                "httpHeaders": [
                  {
                    "name": "Custom-Header",
                    "value": "liveness probe"
                  }
                ]
              },
              "initialDelaySeconds": 7,
              "periodSeconds": 3
            },
            {
              "type": "readiness",
              "tcpSocket": {
                "port": 8081
              },
              "initialDelaySeconds": 10,
              "periodSeconds": 3
            },
            {
              "type": "startup",
              "httpGet": {
                "path": "/startup",
                "port": 8080,
                "httpHeaders": [
                  {
                    "name": "Custom-Header",
                    "value": "startup probe"
                  }
                ]
              },
              "initialDelaySeconds": 3,
              "periodSeconds": 3
            }
          ]
        }
      ]
    },
    "initContainers": [
      {
        "name": "init",
        "image": "[parameters('init_container_image')]",
        "resources": {
          "cpu": 0.25,
          "memory": "0.5Gi"
        },
        "volumeMounts": [
          {
            "mountPath": "/appsettings",
            "volumeName": "appsettings-volume"
          }
        ]
      }
    ]
    ...
  }
  ...
}
```

| Setting | Description | Remarks |
|---|---|---|
| `image` | The container image name for your container app. | This value takes the form of `repository/<IMAGE_NAME>:<TAG>`. |
| `name` | Friendly name of the container. | Used for reporting and identification. |
| `command` | The container's startup command. | Equivalent to Docker's [entrypoint](https://docs.docker.com/engine/reference/builder/) field.  |
| `args` | Start up command arguments. | Entries in the array are joined together to create a parameter list to pass to the startup command. |
| `env` | An array of name/value pairs that define environment variables. | Use `secretRef` instead of the `value` field to refer to a secret. |
| `resources.cpu` | The number of CPUs allocated to the container. | See [vCPU and memory allocation requirements](#allocations) |
| `resources.memory` | The amount of RAM allocated to the container. | See [vCPU and memory allocation requirements](#allocations) |
| `volumeMounts` | An array of volume mount definitions. | You can define a temporary or permanent storage volumes for your container. For more information about storage volumes, see [Use storage mounts in Azure Container Apps](storage-mounts.md).|
| `probes`| An array of health probes enabled in the container. | For more information about probes settings, see [Health probes in Azure Container Apps](health-probes.md).|

### <a name="allocations"></a>vCPU and memory allocation requirements

When you use the Consumption plan, the total CPU and memory allocated to all the containers in a container app must add up to one of the following combinations.

| vCPUs (cores) | Memory |
|---|---|
| `0.25` | `0.5Gi` | 
| `0.5` | `1.0Gi` | 
| `0.75` | `1.5Gi` | 
| `1.0` | `2.0Gi` | 
| `1.25` | `2.5Gi` | 
| `1.5` | `3.0Gi` | 
| `1.75` | `3.5Gi` | 
| `2.0` | `4.0Gi` | 
| `2.25` | `4.5Gi` |
| `2.5` | `5.0Gi` |
| `2.75` | `5.5Gi` |
| `3.0` | `6.0Gi` |
| `3.25` | `6.5Gi` |
| `3.5` | `7.0Gi` |
| `3.75` | `7.5Gi` |
| `4.0` | `8.0Gi` |

> [!NOTE]
> Apps using the Consumption plan in a *Consumption only* environment are limited to a maximum of 2 cores and 4Gi of memory.

## Multiple containers

In advanced scenarios, you can run multiple containers in a single container app. Use this pattern only in specific instances where your containers are tightly coupled.

For most microservice scenarios, the best practice is to deploy each service as a separate container app.

Multiple containers in the same container app share hard disk and network resources and experience the same [application lifecycle](./application-lifecycle-management.md).

There are two ways to run additional containers in a container app: [sidecar containers](#sidecar-containers) and [init containers](#init-containers).

### Sidecar containers

You can define multiple containers in a single container app to implement the [sidecar pattern](/azure/architecture/patterns/sidecar).

Examples of sidecar containers include:

- An agent that reads logs from the primary app container on a [shared volume](storage-mounts.md?pivots=aca-cli#replica-scoped-storage) and forwards them to a logging service.

- A background process that refreshes a cache used by the primary app container in a shared volume.

These scenarios are examples, and don't represent the only ways you can implement a sidecar.

To run multiple containers in a container app, add more than one container in the `containers` array of the container app template.

### <a name="init-containers"></a>Init containers

You can define one or more [init containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) in a container app. Init containers run before the primary app container and are used to perform initialization tasks such as downloading data or preparing the environment.

Init containers are defined in the `initContainers` array of the container app template. The containers run in the order they're defined in the array and must complete successfully before the primary app container starts.

> [!NOTE]
> Init containers in apps using the Dedicated plan or running in a *Consumption only* environment can't access managed identity at run time.

## Container registries

You can deploy images hosted on private registries by providing credentials in the Container Apps configuration.

To use a container registry, you define the registry in the `registries` array in the [`properties.configuration`](azure-resource-manager-api-spec.md) section of the container app resource template.  The `passwordSecretRef` field identifies the name of the secret in the `secrets` array name where you defined the password.

```json
{
  ...
  "registries": [{
    "server": "docker.io",
    "username": "my-registry-user-name",
    "passwordSecretRef": "my-password-secret-name"
  }]
}
```

Saved credentials are used to pull a container image from the private registry as your app is deployed.

The following example shows how to configure Azure Container Registry credentials in a container app.

```json
{
  ...
  "configuration": {
    "secrets": [
      {
        "name": "docker-hub-password",
        "value": "my-docker-hub-password"
      }
    ],
    ...
    "registries": [
      {
        "server": "docker.io",
        "username": "someuser",
        "passwordSecretRef": "docker-hub-password"
      }
    ]
  }
}
```

> [!NOTE]
> Docker Hub [limits](https://docs.docker.com/docker-hub/download-rate-limit/) the number of Docker image downloads. When the limit is reached, containers in your app will fail to start. Use a registry with sufficient limits, such as [Azure Container Registry](../container-registry/container-registry-intro.md) to avoid this problem.

### Managed identity with Azure Container Registry

You can use an Azure managed identity to authenticate with Azure Container Registry instead of using a username and password. For more information, see [Managed identities in Azure Container Apps](managed-identity.md).

To use managed identity with a registry, the identity must be enabled in the app and it must be assigned `acrPull` role in the registry. To configure the registry, use the managed identity resource ID for a user-assigned identity, or `system` for the system-assigned identity in the `identity` property of the registry. Don't configure a username and password when using managed identity.

```json
{
    "identity": {
        "type": "SystemAssigned,UserAssigned",
        "userAssignedIdentities": {
            "<IDENTITY1_RESOURCE_ID>": {}
        }
    }
    "properties": {
        "configuration": {
            "registries": [
            {
                "server": "myacr1.azurecr.io",
                "identity": "<IDENTITY1_RESOURCE_ID>"
            },
            {
                "server": "myacr2.azurecr.io",
                "identity": "system"
            }]
        }
        ...
    }
}
```

For more information about configuring user-assigned identities, see [Add a user-assigned identity](managed-identity.md#add-a-user-assigned-identity).

## Limitations

Azure Container Apps has the following limitations:

- **Privileged containers**: Azure Container Apps doesn't allow privileged containers mode with host-level access.

- **Operating system**: Linux-based (`linux/amd64`) container images are required.

## Next steps

> [!div class="nextstepaction"]
> [Revisions](revisions.md)
