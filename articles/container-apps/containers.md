---
title: Containers in Azure Container Apps Preview
description: Learn how containers are managed and configured in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Containers in Azure Container Apps Preview

Azure Container Apps manages the details of Kubernetes and container orchestrations for you. Containers in Azure Container Apps can use any runtime, programming language, or development stack of your choice.

:::image type="content" source="media/containers/azure-container-apps-containers.png" alt-text="Azure Container Apps: Containers":::

Azure Container Apps supports:

- Any Linux-based container image
- Containers from any public or private container registry

Additional features include:

- There is no required base container image.
- Changes to the `template` ARM configuration section triggers a new [container app revision](application-lifecycle-management.md).
- If a container crashes, it automatically restarts.

> [!NOTE]
> The only supported protocols for a container app's fully qualified domain name (FQDN) are HTTP and HTTPS through ports 80 and 443 respectively.

## Configuration

The following example configuration shows the options available when setting up a container.

```json
{
  ...
  "template": {
    "containers": [
      {
        "image": "myacr.azurecr.io/myrepo/api-service:v1",
        "name": "my-container-image",
        "command": ["/bin/queue"],
        "args": [],
        "env": [
          {
            "name": "HTTP_PORT",
            "value": "8080"
          }
        ],
        "resources": {
            "cpu": 1,
            "memory": "250Mb"
        }
    }]
  }
}
```

| Setting | Description | Remarks |
|---|---|---|
| `image` | The container image name for your container app. | This value takes the form of `repository/image-name:tag`. |
| `name` | Friendly name of the container. | Used for reporting and identification. |
| `command` | The container's startup command. | Equivalent to Docker's [entrypoint](https://docs.docker.com/engine/reference/builder/) field.  |
| `args` | Start up command arguments. | Entries in the array are joined together to create a parameter list to pass to the startup command. |
| `env` | An array of key/value pairs that define environment variables. | Use `secretRef` instead of the `value` field to refer to a secret. |
| `resources.cpu` | The number of CPUs allocated to the container. | Values must adhere to the following rules: the value must be greater than zero and less than 2, and can be any decimal number, with a maximum of one decimal place. For example, `1.1` is valid, but `1.55` is invalid. The default is 0.5 CPU per container. |
| `resources.memory` | The amount of RAM allocated to the container. | This value is up to `4Gi`. The only allowed units are [gibibytes](https://simple.wikipedia.org/wiki/Gibibyte) (`Gi`). Values must adhere to the following rules: the value must be greater than zero and less than `4Gi`, and can be any decimal number, with a maximum of two decimal places. For example, `1.25Gi` is valid, but `1.555Gi` is invalid. The default is `1Gi` per container.  |

The total amount of CPUs and memory requested for all the containers in a container app must add up to one of the following combinations.

| vCPUs | Memory in Gi |
|---|---|
| 0.5 | 1.0 |
| 1.0 | 2.0 |
| 1.5 | 3.0 |
| 2.0 | 4.0 |

- All of the CPU requests in all of your containers must match one of the values in the vCPUs column.
- All of the memory requests in all your containers must match the memory value in the memory column in the same row of the CPU column.

## Multiple containers

You can define multiple containers in a single container app. Groups of containers are known as [pods](https://kubernetes.io/docs/concepts/workloads/pods). The containers in a pod share hard disk and network resources and experience the same [application lifecycle](application-lifecycle-management.md).

You run multiple containers together by defining more than one container in the configuration's `containers` array.

Reasons to run containers together in a pod include:

- Use a container as a sidecar to your primary app.
- Use of a shared disk space and virtual network.
- Share scale rules among containers.
- Group together multiple containers that need to always run together.
- Enable direct communication among containers on the same host.

## Container registries

You can deploy images hosted on private registries where credentials are provided through the Container Apps configuration.

To use a container registry, you first define the required fields to the [configuration's](azure-resource-manager-api-spec.md) `registries` section.

```json
{
  ...
  "registries": {
    "server": "docker.io",
    "username": "my-registry-user-name",
    "passwordSecretRef": "my-password-secretref-name"
  }
}
```

With this set up, the saved credentials can be used when you reference a container image in an `image` in the `containers` array.

The following example shows how to deploy an app from the Azure Container Registry.

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

## Limitations

Azure Container Apps has the following limitations:

- **Privileged containers**: Azure Container Apps can't run privileged containers. If your program attempts to run a process that requires root access, the application inside the container experiences a runtime error.

- **Operating system**: Linux-based container images are required.

## Next steps

> [!div class="nextstepaction"]
> [Environment](environment.md)
