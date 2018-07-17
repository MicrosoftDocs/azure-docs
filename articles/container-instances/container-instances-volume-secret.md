---
title: Mount a secret volume in Azure Container Instances
description: Learn how to mount a secret volume to store sensitive information for access by your container instances
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 07/18/2018
ms.author: marsma
---

# Mount a secret volume in Azure Container Instances

Learn how to mount a *secret* volume in your container instances for the storage and retrieval of sensitive information by the containers in your container groups.

> [!NOTE]
> Mounting a *secret* volume is currently restricted to Linux containers. Learn how to pass secure environment variables for both Windows and Linux containers in [Set environment variables](container-instances-environment-variables.md). While we are working to bring all features to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

## secret volume

You can use a *secret* volume to provide sensitive information to the containers in a container group. The *secret* volume stores your specified secrets in files within the volume, which the containers in your container group can then access. By using secrets in a *secret* volume, you can avoid placing sensitive data like SSH keys or database credentials in your application code.

All *secret* volumes are backed by [tmpfs][tmpfs], a RAM-backed filesystem; their contents are never written to non-volatile storage.

## Mount secret volume - Azure CLI

To deploy a container with one or more secrets by using the Azure CLI, include the `--secrets` and `--secrets-mount-path` parameters in the [az container create][az-container-create] command. This example mounts a *secret* volume, "secretvolume1," consisting of two Base64-encoded secrets, "mysecret1" and "mysecret2":

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name volume-demo-secret \
    --image microsoft/aci-helloworld \
    --secrets mysecret1="TXkgZmlyc3Qgc2VjcmV0IEZPTwo=" mysecret2="TXkgc2Vjb25kIHNlY3JldCBCQVIK" \
    --secrets-mount-path /secretvolume1
```

You can use [az container exec][az-container-exec] to verify the mounting of the secrets volume. In the following output, the files are verified to exist in the secret volume, and their contents are then decoded:

```console
$ az container exec --resource-group myResourceGroup --name volume-demo-secret --exec-command "/bin/sh"
/usr/src/app # ls -1 /secretvolume1/
mysecret1
mysecret2
/usr/src/app # cat /secretvolume1/mysecret1
TXkgZmlyc3Qgc2VjcmV0IEZPTwo=
/usr/src/app # cat /secretvolume1/mysecret1 | base64 -d
My first secret FOO
/usr/src/app # cat /secretvolume1/mysecret2 | base64 -d
My second secret BAR
```

## Mount secret volume - YAML

To mount a *secret* volume in a container instance, you can deploy the container group using the Azure CLI and a YAML file. This YAML defines a container group with a single container that mounts a *secret* volume, "secretvolume1," consisting of two Base64-encoded secrets, "mysecret1" and "mysecret2":

```yaml
apiVersion: '2018-06-01'
location: eastus
name: volume-demo-secret
properties:
  containers:
  - name: aci-tutorial-app
    properties:
      environmentVariables: []
      image: microsoft/aci-helloworld:latest
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
az container create --resource-group myResourceGroup --file deploy-aci.yaml
```

## Mount secret volume - Resource Manager

To mount a *secret* volume in a container instance, you can deploy the container group using an [Azure Resource Manager template](/azure/templates/microsoft.containerinstance/containergroups).

First, populate the `volumes` array in the container group `properties` section of the template. Next, for each container in the container group in which you'd like to mount the *secret* volume, populate the `volumeMounts` array in the `properties` section of the container definition.

For example, the following Resource Manager template creates a container group consisting of a single container. The container mounts a *secret* volume consisting of two Base64-encoded secrets.

<!-- https://github.com/Azure/azure-docs-json-samples/blob/master/container-instances/aci-deploy-volume-secret.json -->
[!code-json[volume-secret](~/azure-docs-json-samples/container-instances/aci-deploy-volume-secret.json)]

To deploy with the Resource Manager template, save the preceding JSON to a file named `deploy-aci.json`, then execute the [az group deployment create][az-group-deployment-create] command with the `--template-file` parameter:

```azurecli-interactive
az group deployment create --resource-group myResourceGroup --template-file deploy-aci.json
```

## Next steps

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount an emptyDir volume in Azure Container Instances](container-instances-volume-emptydir.md)
* [Mount a gitRepo volume in Azure Container Instances](container-instances-volume-gitrepo.md)

<!-- LINKS - External -->
[tmpfs]: https://wikipedia.org/wiki/Tmpfs

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az-container-create
[az-container-exec]: /cli/azure/container#az-container-exec
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
