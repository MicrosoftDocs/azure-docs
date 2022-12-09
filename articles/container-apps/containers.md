---
title: Containers in Azure Container Apps
description: Learn how containers are managed and configured in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/02/2022
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Containers in Azure Container Apps

Azure Container Apps manages the details of Kubernetes and container orchestration for you. Containers in Azure Container Apps can use any runtime, programming language, or development stack of your choice.

:::image type="content" source="media/containers/azure-container-apps-containers.png" alt-text="Azure Container Apps: Containers":::

Azure Container Apps supports:

- Any Linux-based x86-64 (`linux/amd64`) container image
- Containers from any public or private container registry

Features include:

- There's no required base container image.
- Changes to the `template` ARM configuration section trigger a new [container app revision](application-lifecycle-management.md).
- If a container crashes, it automatically restarts.

> [!NOTE]
> The only supported protocols for a container app's fully qualified domain name (FQDN) are HTTP and HTTPS through ports 80 and 443 respectively.

## Configuration


The following code is an example of the `containers` array in the [`properties.template`](azure-resource-manager-api-spec.md#propertiestemplate) section of a container app resource template.  The excerpt shows the available configuration options when setting up a container.

```json
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
        "mountPath": "/myfiles",
        "volumeName": "azure-files-volume"
      }
    ]
    "probes":[
        {
            "type":"liveness",
            "httpGet":{
            "path":"/health",
            "port":8080,
            "httpHeaders":[
                {
                    "name":"Custom-Header",
                    "value":"liveness probe"
                }]
            },
            "initialDelaySeconds":7,
            "periodSeconds":3
        },
        {
            "type":"readiness",
            "tcpSocket":
                {
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
                    }]
            },
            "initialDelaySeconds": 3,
            "periodSeconds": 3
        }]
  }
],

```

| Setting | Description | Remarks |
|---|---|---|
| `image` | The container image name for your container app. | This value takes the form of `repository/image-name:tag`. |
| `name` | Friendly name of the container. | Used for reporting and identification. |
| `command` | The container's startup command. | Equivalent to Docker's [entrypoint](https://docs.docker.com/engine/reference/builder/) field.  |
| `args` | Start up command arguments. | Entries in the array are joined together to create a parameter list to pass to the startup command. |
| `env` | An array of key/value pairs that define environment variables. | Use `secretRef` instead of the `value` field to refer to a secret. |
| `resources.cpu` | The number of CPUs allocated to the container. | Values must adhere to the following rules: the value must be greater than zero and less than or equal to 2, and can be any decimal number, with a maximum of two decimal places. For example, `1.25` is valid, but `1.555` is invalid. The default is 0.5 CPU per container. |
| `resources.memory` | The amount of RAM allocated to the container. | This value is up to `4Gi`. The only allowed units are [gibibytes](https://simple.wikipedia.org/wiki/Gibibyte) (`Gi`). Values must adhere to the following rules: the value must be greater than zero and less than or equal to `4Gi`, and can be any decimal number, with a maximum of two decimal places. For example, `1.25Gi` is valid, but `1.555Gi` is invalid. The default is `1Gi` per container.  |
| `volumeMounts` | An array of volume mount definitions. | You can define a temporary volume or multiple permanent storage volumes for your container.  For more information about storage volumes, see [Use storage mounts in Azure Container Apps](storage-mounts.md).|
| `probes`| An array of health probes enabled in the container. | This feature is based on Kubernetes health probes. For more information about probes settings, see [Health probes in Azure Container Apps](health-probes.md).|

The total CPU and memory allocations requested for all the containers in a container app must add up to one of the following combinations.

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

- The total of the CPU requests in all of your containers must match one of the values in the vCPUs column.
- The total of the memory requests in all your containers must match the memory value in the memory column in the same row of the CPU column.

## Multiple containers

You can define multiple containers in a single container app to implement the [sidecar pattern](/azure/architecture/patterns/sidecar). The containers in a container app share hard disk and network resources and experience the same [application lifecycle](./application-lifecycle-management.md).

Examples of sidecar containers include:

- An agent that reads logs from the primary app container on a [shared volume](storage-mounts.md?pivots=aca-cli#temporary-storage) and forwards them to a logging service.
- A background process that refreshes a cache used by the primary app container in a shared volume.

> [!NOTE]
> Running multiple containers in a single container app is an advanced use case. You should use this pattern only in specific instances in which your containers are tightly coupled. In most situations where you want to run multiple containers, such as when implementing a microservice architecture, deploy each service as a separate container app.

To run multiple containers in a container app, add more than one container in the containers array of the container app template.

## Container registries

You can deploy images hosted on private registries by providing credentials in the Container Apps configuration.

To use a container registry, you define the required fields in `registries` array in the [`properties.configuration`](azure-resource-manager-api-spec.md) section of the container app resource template.  The `passwordSecretRef` field identifies the name of the secret in the `secrets` array name where you defined the password.

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

With the registry information added, the saved credentials can be used to pull a container image from the private registry when your app is deployed.

The following example shows how to configure Azure Container Registry credentials in a container app.

```json
{
  ...
  "configuration": {
      "secrets": [
          {
              "name": "acr-password",
              "value": "my-acr-password"
          }
      ],
...
      "registries": [
          {
              "server": "myacr.azurecr.io",
              "username": "someuser",
              "passwordSecretRef": "acr-password"
          }
      ]
  }
}
```

> [!NOTE]
> Docker Hub [limits](https://docs.docker.com/docker-hub/download-rate-limit/) the number of Docker image downloads. When the limit is reached, containers in your app will fail to start. You're recommended to use a registry with sufficient limits, such as [Azure Container Registry](../container-registry/container-registry-intro.md).

### Managed identity with Azure Container Registry

You can use an Azure managed identity to authenticate with Azure Container Registry instead of using a username and password. For more information, see [Managed identities in Azure Container Apps](managed-identity.md).

When assigning a managed identity to a registry, use the managed identity resource ID for a user-assigned identity, or "system" for the system-assigned identity.

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

- **Privileged containers**: Azure Container Apps can't run privileged containers. If your program attempts to run a process that requires root access, the application inside the container experiences a runtime error.

- **Operating system**: Linux-based (`linux/amd64`) container images are required.

## Next steps

> [!div class="nextstepaction"]
> [Revisions](revisions.md)
