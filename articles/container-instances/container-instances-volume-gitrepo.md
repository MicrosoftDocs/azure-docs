---
title: Mount gitRepo volume to container group
description: Learn how to mount a gitRepo volume to clone a Git repository into your container instances
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
ms.custom: devx-track-azurecli
services: container-instances
ms.date: 06/17/2022
---

# Mount a gitRepo volume in Azure Container Instances

Learn how to mount a *gitRepo* volume to clone a Git repository into your container instances.

> [!NOTE]
> Mounting a *gitRepo* volume is currently restricted to Linux containers. While we are working to bring all features to Windows containers, you can find current platform differences in the [overview](container-instances-overview.md#linux-and-windows-containers).

## gitRepo volume

The *gitRepo* volume mounts a directory and clones the specified Git repository into it at container startup. By using a *gitRepo* volume in your container instances, you can avoid adding the code for doing so in your applications.

When you mount a *gitRepo* volume, you can set three properties to configure the volume:

| Property | Required | Description |
| -------- | -------- | ----------- |
| `repository` | Yes | The full URL, including `http://` or `https://`, of the Git repository to be cloned.|
| `directory` | No | Directory into which the repository should be cloned. The path must not contain or start with "`..`".  If you specify "`.`", the repository is cloned into the volume's directory. Otherwise, the Git repository is cloned into a subdirectory of the given name within the volume directory. |
| `revision` | No | The commit hash of the revision to be cloned. If unspecified, the `HEAD` revision is cloned. |

## Mount gitRepo volume: Azure CLI

To mount a gitRepo volume when you deploy container instances with the [Azure CLI](/cli/azure), supply the `--gitrepo-url` and `--gitrepo-mount-path` parameters to the [az container create][az-container-create] command. You can optionally specify the directory within the volume to clone into (`--gitrepo-dir`) and the commit hash of the revision to be cloned (`--gitrepo-revision`).

This example command clones the Microsoft [aci-helloworld][aci-helloworld] sample application into `/mnt/aci-helloworld` in the container instance:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name hellogitrepo \
    --image mcr.microsoft.com/azuredocs/aci-helloworld \
    --dns-name-label aci-demo \
    --ports 80 \
    --gitrepo-url https://github.com/Azure-Samples/aci-helloworld \
    --gitrepo-mount-path /mnt/aci-helloworld
```

To verify the gitRepo volume was mounted, launch a shell in the container with [az container exec][az-container-exec] and list the directory:

```azurecli
az container exec --resource-group myResourceGroup --name hellogitrepo --exec-command /bin/sh
```

```output
/usr/src/app # ls -l /mnt/aci-helloworld/
total 16
-rw-r--r--    1 root     root           144 Apr 16 16:35 Dockerfile
-rw-r--r--    1 root     root          1162 Apr 16 16:35 LICENSE
-rw-r--r--    1 root     root          1237 Apr 16 16:35 README.md
drwxr-xr-x    2 root     root          4096 Apr 16 16:35 app
```

## Mount gitRepo volume: Resource Manager

To mount a gitRepo volume when you deploy container instances with an [Azure Resource Manager template](/azure/templates/microsoft.containerinstance/containergroups), first populate the `volumes` array in the container group `properties` section of the template. Then, for each container in the container group in which you'd like to mount the *gitRepo* volume, populate the `volumeMounts` array in the `properties` section of the container definition.

For example, the following Resource Manager template creates a container group consisting of a single container. The container clones two GitHub repositories specified by the *gitRepo* volume blocks. The second volume includes additional properties specifying a directory to clone to, and the commit hash of a specific revision to clone.

<!-- https://github.com/Azure/azure-docs-json-samples/blob/master/container-instances/aci-deploy-volume-gitrepo.json -->
[!code-json[volume-gitrepo](~/resourcemanager-templates/container-instances/aci-deploy-volume-gitrepo.json)]

The resulting directory structure of the two cloned repos defined in the preceding template is:

```
/mnt/repo1/aci-helloworld
/mnt/repo2/my-custom-clone-directory
```

To see an example of container instance deployment with an Azure Resource Manager template, see [Deploy multi-container groups in Azure Container Instances](container-instances-multi-container-group.md).

## Private Git repo authentication

To mount a gitRepo volume for a private Git repository, specify credentials in the repository URL. Typically, credentials are in the form of a user name and a personal access token (PAT) that grants scoped access to the repository.

For example, the Azure CLI `--gitrepo-url` parameter for a private GitHub repository would appear similar to the following (where "gituser" is the GitHub user name, and "abcdef1234fdsa4321abcdef" is the user's personal access token):

```console
--gitrepo-url https://gituser:abcdef1234fdsa4321abcdef@github.com/GitUser/some-private-repository
```

For an Azure Repos Git repository, specify any user name (you can use "azurereposuser" as in the following example) in combination with a valid PAT:

```console
--gitrepo-url https://azurereposuser:abcdef1234fdsa4321abcdef@dev.azure.com/your-org/_git/some-private-repository
```

For more information about personal access tokens for GitHub and Azure Repos, see the following:

GitHub: [Creating a personal access token for the command line][pat-github]

Azure Repos: [Create personal access tokens to authenticate access][pat-repos]

## Next steps

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount an emptyDir volume in Azure Container Instances](container-instances-volume-emptydir.md)
* [Mount a secret volume in Azure Container Instances](container-instances-volume-secret.md)

<!-- LINKS - External -->
[aci-helloworld]: https://github.com/Azure-Samples/aci-helloworld
[pat-github]: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
[pat-repos]: /azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[az-container-exec]: /cli/azure/container#az_container_exec
