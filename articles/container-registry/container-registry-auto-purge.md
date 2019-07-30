---
title: Automatically remove image resources in Azure Container Registry
description: Purge tags and manifests from an Azure container registry based on age or a tag name filter, and optionally schedule purge operations.
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 07/30/2019
ms.author: danlep
---

# Automatically purge images from an Azure container registry

As you scale your Azure container registry, you might want to delete all tags that are older than a certain date or match a specified name filter, or schedule automatic purges of untagged images. To delete artifacts quickly, this article introduces an `acr purge` command you can run as an on-demand or [scheduled](container-registry-tasks-scheduled.md) ACR Task in your registry. The `acr purge` command is distributed in a public container image available from Microsoft Container Registry.

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the ACR task examples in this article. If you'd like to use it locally, version 2.0.69 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install]. 

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

> [!WARNING]
> Use the `acr purge` command with caution--deleted image data is UNRECOVERABLE. If you have systems that pull images by manifest digest (as opposed to image name), you should not purge untagged images. Deleting untagged images will prevent those systems from pulling the images from your registry. Instead of pulling by manifest, consider adopting a *unique tagging* scheme, a [recommended best practice][tagging-best-practices].

If you want to delete single image tags or manifests using Azure CLI commands, see [Delete container images in Azure Container Registry](container-registry-delete.md).


## Scenarios



## Use the purge command

The `acr purge` container command by deletes images by tag in a repository that match a filter and that are older than a specified date. By default, only the tag references are deleted, not the underlying [manifest](container-registry-concepts.md#manifest) and layer data. You can optionally run the command to delete the manifests as well. Generally you run `acr purge` as a container command in an [ACR Task](container-registry-tasks-overview.md), so that it authenticates with the registry where the task runs. 

At a minimum, specify the following when you run `acr purge`:

* `--registry` - An Azure container registry where you run the command. 
* `--filter` - A repository and a *regular expression* to filter tags in the repository. For example, `--filter hello-world:.*` matches all tags in the `hello-world` repository.
* `--ago` - A time expression in go style duration format to indicate the time after which tags are deleted. For example, `--ago 1d3h6m` selects all images older than 1 day, 3 hours, and 6 minutes. If not specified, the default value is 1 day.

`acr purge` supports several optional parameters. The following two are most likely to be useful when you start using the command:

* `--untagged` - A boolean flag that if set specifies that manifests that do not have any associated tags (*untagged manifests*) are deleted.
* `--dry-run` - A boolean flag that if set specifies that nothing is deleted, but the output is the same as if the command is run without this flag. This parameter is useful for testing a purge command to make sure it runs as expected, without accidentally deleting data.

For additional parameters, run `acr purge --help`. 

### Run in an on-demand task

The following example runs the `acr purge` command in an on-demand ACR task. 

```azurecli


```


### Run in a scheduled task

```azurecli


```

## Example: Dry run deletion of a repo

## Example: Purge untagged manifests 





## Next steps

For more information about image storage in Azure Container Registry see [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- IMAGES -->
[manifest-digest]: ./media/container-registry-delete/01-manifest-digest.png

<!-- LINKS - External -->

[tagging-best-practices]: https://stevelasker.blog/2018/03/01/docker-tagging-best-practices-for-tagging-and-versioning-docker-images/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli


