---
title: Mount a gitRepo volume Azure Container Instances
description: Learn how to mount a gitRepo volume to clone a Git repository into your container instances
services: container-instances
author: mmacy
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 04/16/2018
ms.author: marsma
---

# Mount a gitRepo volume in Azure Container Instances

Learn how to mount a *gitRepo* volume to clone a Git repository into your container instances.

> [!NOTE]
> Mounting a *gitRepo* volume is currently restricted to Linux containers. While we are working to bring all features to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

## gitRepo volume

The *gitRepo* volume mounts a directory and clones the specified Git repository into it at container startup. By using a *gitRepo* volume in your container instances, you can avoid adding the code for doing so in your applications.

When you mount a *gitRepo* volume, you can set three properties to configure the volume:

| Property | Required | Description |
| -------- | -------- | ----------- |
| `repository` | Yes | The full URL, including `http://` or `https://`, of the Git repository to be cloned.|
| `directory` | No | Directory into which the repository should be cloned. The path must not contain or start with "`..`".  If you specify "`.`", the repository is cloned into the volume's directory. Otherwise, the Git repository is cloned into a subdirectory of the given name within the volume directory. |
| `revision` | No | The commit hash of the revision to be cloned. If unspecified, the `HEAD` revision is cloned. |

## Mount a gitRepo volume: Azure CLI

To mount a gitRepo volume when you deploy container instances with the [Azure CLI](/cli/azure), supply the `--gitrepo-url` and `--gitrepo-mount-path` parameters to the [az container create][] command.

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name hellogitrepo \
    --image microsoft/aci-hellofiles \
    --dns-name-label aci-demo \
    --ports 80 \
    --gitrepo-url https://github.com/Azure-Samples/aci-helloworld \
    --gitrepo-mount-path /mnt/aci-helloworld
```

You can optionally specify additional parameters that specify the directory within the volume to clone into (`--gitrepo-dir`) and the commit hash to specify which revision should be cloned (`--gitrepo-revision`).

## Mount a gitRepo volume: Resource Manager

To mount a gitRepo volume when you deploy container instances with an [Azure Resource Manager template](/azure/templates/microsoft.containerinstance/containergroups), first populate the `volumes` array in the container group `properties` section of the template. Then, for each container in the container group in which you'd like to mount the *gitRepo* volume, populate the `volumeMounts` array in the `properties` section of the container definition.

For example, the following Resource Manager template creates a container group consisting of a single container. The container clones two GitHub repositories specified by the *gitRepo* volume blocks. The second volume includes additional properties specifying a directory to clone to, and the commit hash of a specific revision to clone.

<!-- https://github.com/Azure/azure-docs-json-samples/blob/master/container-instances/aci-deploy-volume-gitrepo.json -->
[!code-json[volume-gitrepo](~/azure-docs-json-samples/container-instances/aci-deploy-volume-gitrepo.json)]

The resulting directory structure of the two cloned repos defined in the preceding template is:

```
/mnt/repo1/aci-helloworld
/mnt/repo2/my-custom-clone-directory
```

To see an example of container instance deployment with an Azure Resource Manager template, see [Deploy multi-container groups in Azure Container Instances](container-instances-multi-container-group.md).

## Next steps

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount an emptyDir volume in Azure Container Instances](container-instances-volume-emptydir.md)
* [Mount a secret volume in Azure Container Instances](container-instances-volume-secret.md)
