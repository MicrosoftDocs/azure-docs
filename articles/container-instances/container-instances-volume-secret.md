---
title: Mount a secret volume in Azure Container Instances
description: Learn how to mount a secret volume to store sensitive information for access by your container instances
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 07/19/2018
ms.author: danlep
---

# Mount a secret volume in Azure Container Instances

Use a *secret* volume to supply sensitive information to the containers in a container group. The *secret* volume stores your secrets in files within the volume, accessible by the containers in the container group. By storing secrets in a *secret* volume, you can avoid adding sensitive data like SSH keys or database credentials to your application code.

All *secret* volumes are backed by [tmpfs][tmpfs], a RAM-backed filesystem; their contents are never written to non-volatile storage.

> [!NOTE]
> *Secret* volumes are currently restricted to Linux containers. Learn how to pass secure environment variables for both Windows and Linux containers in [Set environment variables](container-instances-environment-variables.md). While we're working to bring all features to Windows containers, you can find current platform differences in the [overview](container-instances-overview.md#linux-and-windows-containers).

## Mount secret volume - Azure CLI

To deploy a container with one or more secrets by using the Azure CLI, include the `--secrets` and `--secrets-mount-path` parameters in the [az container create][az-container-create] command. This example mounts a *secret* volume consisting of two secrets, "mysecret1" and "mysecret2," at `/mnt/secrets`:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name secret-volume-demo \
    --image mcr.microsoft.com/azuredocs/aci-helloworld \
    --secrets mysecret1="My first secret FOO" mysecret2="My second secret BAR" \
    --secrets-mount-path /mnt/secrets
```

The following [az container exec][az-container-exec] output shows opening a shell in the running container, listing the files within the secret volume, then displaying their contents:

```console
$ az container exec --resource-group myResourceGroup --name secret-volume-demo --exec-command "/bin/sh"
/usr/src/app # ls -1 /mnt/secrets
mysecret1
mysecret2
/usr/src/app # cat /mnt/secrets/mysecret1
My first secret FOO
/usr/src/app # cat /mnt/secrets/mysecret2
My second secret BAR
/usr/src/app # exit
Bye.
```

## Mount secret volume - YAML

You can also deploy container groups with the Azure CLI and a [YAML template](container-instances-multi-container-yaml.md). Deploying by YAML template is the preferred method when deploying container groups consisting of multiple containers.

When you deploy with a YAML template, the secret values must be **Base64-encoded** in the template. However, the secret values appear in plaintext within the files in the container.

The following YAML template defines a container group with one container that mounts a *secret* volume at `/mnt/secrets`. The secret volume has two secrets, "mysecret1" and "mysecret2."

```yaml
apiVersion: '2018-10-01'
location: eastus
name: secret-volume-demo
properties:
  containers:
  - name: aci-tutorial-app
    properties:
      environmentVariables: []
      image: mcr.microsoft.com/azuredocs/aci-helloworld:latest
      ports: []
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
      volumeMounts:
      - mountPath: /mnt/secrets
        name: secretvolume1
  osType: Linux
  restartPolicy: Always
  volumes:
  - name: secretvolume1
    secret:
      mysecret1: TXkgZmlyc3Qgc2VjcmV0IEZPTwo=
      mysecret2: TXkgc2Vjb25kIHNlY3JldCBCQVIK
tags: {}
type: Microsoft.ContainerInstance/containerGroups
```

To deploy with the YAML template, save the preceding YAML to a file named `deploy-aci.yaml`, then execute the [az container create][az-container-create] command with the `--file` parameter:

```azurecli-interactive
# Deploy with YAML template
az container create --resource-group myResourceGroup --file deploy-aci.yaml
```

## Mount secret volume - Resource Manager

In addition to CLI and YAML deployment, you can deploy a container group using an Azure [Resource Manager template](/azure/templates/microsoft.containerinstance/containergroups).

First, populate the `volumes` array in the container group `properties` section of the template. When you deploy with a Resource Manager template, the secret values must be **Base64-encoded** in the template. However, the secret values appear in plaintext within the files in the container.

Next, for each container in the container group in which you'd like to mount the *secret* volume, populate the `volumeMounts` array in the `properties` section of the container definition.

The following Resource Manager template defines a container group with one container that mounts a *secret* volume at `/mnt/secrets`. The secret volume has two secrets, "mysecret1" and "mysecret2."

<!-- https://github.com/Azure/azure-docs-json-samples/blob/master/container-instances/aci-deploy-volume-secret.json -->
[!code-json[volume-secret](~/azure-docs-json-samples/container-instances/aci-deploy-volume-secret.json)]

To deploy with the Resource Manager template, save the preceding JSON to a file named `deploy-aci.json`, then execute the [az group deployment create][az-group-deployment-create] command with the `--template-file` parameter:

```azurecli-interactive
# Deploy with Resource Manager template
az group deployment create --resource-group myResourceGroup --template-file deploy-aci.json
```

## Next steps

### Volumes

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount an emptyDir volume in Azure Container Instances](container-instances-volume-emptydir.md)
* [Mount a gitRepo volume in Azure Container Instances](container-instances-volume-gitrepo.md)

### Secure environment variables

Another method for providing sensitive information to containers (including Windows containers) is through the use of [secure environment variables](container-instances-environment-variables.md#secure-values).

<!-- LINKS - External -->
[tmpfs]: https://wikipedia.org/wiki/Tmpfs

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az-container-create
[az-container-exec]: /cli/azure/container#az-container-exec
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
