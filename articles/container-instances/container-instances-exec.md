---
title: Execute commands in running containers in Azure Container Instances
description: Learn how execute a command in a container that's currently running in Azure Container Instances
services: container-instances
author: mmacy
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 03/30/2018
ms.author: marsma
---

# Execute a command in a running Azure container instance

Azure Container Instances provides support for executing a command in a running container. Running a command in a container you've already started is especially helpful during application development and troubleshooting.

A few examples for when you might use this feature:

* Launch an interactive shell with `/bin/bash` to investigate a faulting application.
* Execute `cat /dev/null > my-big-log-file` to clear up disk space.
* Verify a successful volume mount with `ls /mnt/my-azure-file-share`.

> [!NOTE]
> You can't currently use the `exec` command on a Windows *client* machine. You must use either Linux or macOS to launch a process in a running container. Executing commands in running Windows containers is **supported**.

## Run a command with Azure CLI

Execute a command in a running container with the [az container exec][az-container-exec] command of the [Azure CLI](azure-cli):

```azurecli
az container exec \
    --resource-group <group-name> \
    --name <container-group-name> \
    --exec-command "<command>"
```

For example, to launch a Bash shell in an Nginx container:

```azurecli
az container exec \
    --resource-group myResourceGroup \
    --name mynginx \
    --exec-command "/bin/bash"
```

## Multi-container groups

If your [container group](container-instances-container-groups.md) has multiple containers, such as an application container and a logging sidecar, you must also specify the container name.

For example, in the container group *mynginx* are two containers, *nginx-app* and *logger*. To launch a shell on the *nginx-app* container, include the `--container-name` argument:

```azurecli
az container exec \
    --resource-group myResourceGroup \
    --name mynginx \
    --container-name nginx-app
    --exec-command "/bin/bash"
```

## Next steps

Learn about other troubleshooting tools and common deployment issues in [Troubleshoot container and deployment issues in Azure Container Instances](container-instances-troubleshooting.md).

<!-- LINKS - internal -->
[az-container-create]: /cli/azure/container#az_container_create
[az-container-exec]: /cli/azure/container#az_container_exec
[azure-cli]: /cli/azure