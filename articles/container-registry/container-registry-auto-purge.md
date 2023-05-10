---
title: Purge tags and manifests
description: Use a purge command to delete multiple tags and manifests from an Azure container registry based on age and a tag filter, and optionally schedule purge operations.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Automatically purge images from an Azure container registry

When you use an Azure container registry as part of a development workflow, the registry can quickly fill up with images or other artifacts that aren't needed after a short period. You might want to delete all tags that are older than a certain duration or match a specified name filter. To delete multiple artifacts quickly, this article introduces the `acr purge` command you can run as an on-demand or [scheduled](container-registry-tasks-scheduled.md) ACR Task. 

The `acr purge` command is currently distributed in a public container image (`mcr.microsoft.com/acr/acr-cli:0.5`), built from source code in the [acr-cli](https://github.com/Azure/acr-cli) repo in GitHub. `acr purge` is currently in preview.

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the ACR task examples in this article. If you'd like to use it locally, version 2.0.76 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install]. 

> [!WARNING]
> Use the `acr purge` command with caution--deleted image data is UNRECOVERABLE. If you have systems that pull images by manifest digest (as opposed to image name), you should not purge untagged images. Deleting untagged images will prevent those systems from pulling the images from your registry. Instead of pulling by manifest, consider adopting a *unique tagging* scheme, a [recommended best practice](container-registry-image-tag-version.md).

If you want to delete single image tags or manifests using Azure CLI commands, see [Delete container images in Azure Container Registry](container-registry-delete.md).

## Use the purge command

The `acr purge` container command deletes images by tag in a repository that match a name filter and that are older than a specified duration. By default, only tag references are deleted, not the underlying [manifests](container-registry-concepts.md#manifest) and layer data. The command has an option to also delete manifests. 

> [!NOTE]
> `acr purge` does not delete an image tag or repository where the `write-enabled` attribute is set to `false`. For information, see [Lock a container image in an Azure container registry](container-registry-image-lock.md).

`acr purge` is designed to run as a container command in an [ACR Task](container-registry-tasks-overview.md), so that it authenticates automatically with the registry where the task runs and performs actions there. The task examples in this article use the `acr purge` command [alias](container-registry-tasks-reference-yaml.md#aliases) in place of a fully qualified container image command.

> [!IMPORTANT]
- The standard command to execute the `acr purge` is `az acr run --registry <YOUR_REGISTRY> --cmd 'acr purge --optional parameter' /dev/null`.
- We recommend running the complete `acr purge` command to use the ACR Purge. For example, run the `acr purge --help` as `az acr run --registry <YOUR_REGISTRY> --cmd 'acr purge --help' /dev/null`.

At a minimum, specify the following when you run `acr purge`:

* `--filter` - A repository name *regular expression* and a tag name *regular expression* to filter images in the registry. Examples: `--filter "hello-world:.*"` matches all tags in the `hello-world` repository, `--filter "hello-world:^1.*"` matches tags beginning with `1` in the `hello-world` repository, and `--filter ".*/cache:.*"` matches all tags in the repositories ending in `/cache`. You can also pass multiple `--filter` parameters.
* `--ago` - A Go-style [duration string](https://go.dev/pkg/time/) to indicate a duration beyond which images are deleted. The duration consists of a sequence of one or more decimal numbers, each with a unit suffix. Valid time units include "d" for days, "h" for hours, and "m" for minutes. For example, `--ago 2d3h6m` selects all filtered images last modified more than two days, 3 hours, and 6 minutes ago, and `--ago 1.5h` selects images last modified more than 1.5 hours ago.

`acr purge` supports several optional parameters. The following two are used in examples in this article:

* `--untagged` - Specifies that all manifests that don't have associated tags (*untagged manifests*) are deleted. This parameter also deletes untagged manifests in addition to tags that are already being deleted.
* `--dry-run` - Specifies that no data is deleted, but the output is the same as if the command is run without this flag. This parameter is useful for testing a purge command to make sure it does not inadvertently delete data you intend to preserve.
* `--keep` - Specifies that the latest x number of to-be-deleted tags are retained.
* `--concurrency` - Specifies a number of purge tasks to process concurrently. A default value is used if this parameter is not provided.

> [!NOTE]
>  The `--untagged` filter doesn't respond to the `--ago` filter.
For additional parameters, run `acr purge --help`. 

`acr purge` supports other features of ACR Tasks commands including [run variables](container-registry-tasks-reference-yaml.md#run-variables) and [task run logs](container-registry-tasks-logs.md) that are streamed and also saved for later retrieval.

### Run in an on-demand task

The following example uses the [az acr run][az-acr-run] command to run the `acr purge` command on-demand. This example deletes all image tags and manifests in the `hello-world` repository in *myregistry* that were modified more than 1 day ago and all untagged manifests. The container command is passed using an environment variable. The task runs without a source context.

```azurecli
# Environment variable for container command line
PURGE_CMD="acr purge --filter 'hello-world:.*' \
  --untagged --ago 1d"

az acr run \
  --cmd "$PURGE_CMD" \
  --registry myregistry \
  /dev/null
```

### Run in a scheduled task

The following example uses the [az acr task create][az-acr-task-create] command to create a daily [scheduled ACR task](container-registry-tasks-scheduled.md). The task purges tags modified more than 7 days ago in the `hello-world` repository. The container command is passed using an environment variable. The task runs without a source context.

```azurecli
# Environment variable for container command line
PURGE_CMD="acr purge --filter 'hello-world:.*' \
  --ago 7d"

az acr task create --name purgeTask \
  --cmd "$PURGE_CMD" \
  --schedule "0 0 * * *" \
  --registry myregistry \
  --context /dev/null
```

Run the [az acr task show][az-acr-task-show] command to see that the timer trigger is configured.

### Purge large numbers of tags and manifests

Purging a large number of tags and manifests could take several minutes or longer. To purge thousands of tags and manifests, the command might need to run longer than the default timeout time of 600 seconds for an on-demand task, or 3600 seconds for a scheduled task. If the timeout time is exceeded, only a subset of tags and manifests are deleted. To ensure that a large-scale purge is complete, pass the `--timeout` parameter to increase the value. 

For example, the following on-demand task sets a timeout time of 3600 seconds (1 hour):

```azurecli
# Environment variable for container command line
PURGE_CMD="acr purge --filter 'hello-world:.*' \
  --ago 1d --untagged"

az acr run \
  --cmd "$PURGE_CMD" \
  --registry myregistry \
  --timeout 3600 \
  /dev/null
```

## Example: Scheduled purge of multiple repositories in a registry

This example walks through using `acr purge` to periodically clean up multiple repositories in a registry. For example, you might have a development pipeline that pushes images to the `samples/devimage1` and `samples/devimage2` repositories. You periodically import development images into a production repository for your deployments, so you no longer need the development images. On a weekly basis, you purge the `samples/devimage1` and `samples/devimage2` repositories, in preparation for the coming week's work.

### Preview the purge

Before deleting data, we recommend running an on-demand purge task using the `--dry-run` parameter. This option allows you to see the tags and manifests that the command will purge, without removing any data. 

In the following example, the filter in each repository selects all tags. The `--ago 0d` parameter matches images of all ages in the repositories that match the filters. Modify the selection criteria as needed for your scenario. The `--untagged` parameter indicates to delete manifests in addition to tags. The container command is passed to the [az acr run][az-acr-run] command using an environment variable.

```azurecli
# Environment variable for container command line
PURGE_CMD="acr purge \
  --filter 'samples/devimage1:.*' --filter 'samples/devimage2:.*' \
  --ago 0d --untagged --dry-run"

az acr run \
  --cmd "$PURGE_CMD" \
  --registry myregistry \
  /dev/null
```

Review the command output to see the tags and manifests that match the selection parameters. Because the command is run with `--dry-run`, no data is deleted.

Sample output:

```console
[...]
Deleting tags for repository: samples/devimage1
myregistry.azurecr.io/samples/devimage1:232889b
myregistry.azurecr.io/samples/devimage1:a21776a
Deleting manifests for repository: samples/devimage1
myregistry.azurecr.io/samples/devimage1@sha256:81b6f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e788b
myregistry.azurecr.io/samples/devimage1@sha256:3ded859790e68bd02791a972ab0bae727231dc8746f233a7949e40f8ea90c8b3
Deleting tags for repository: samples/devimage2
myregistry.azurecr.io/samples/devimage2:5e788ba
myregistry.azurecr.io/samples/devimage2:f336b7c
Deleting manifests for repository: samples/devimage2
myregistry.azurecr.io/samples/devimage2@sha256:8d2527cde610e1715ad095cb12bc7ed169b60c495e5428eefdf336b7cb7c0371
myregistry.azurecr.io/samples/devimage2@sha256:ca86b078f89607bc03ded859790e68bd02791a972ab0bae727231dc8746f233a

Number of deleted tags: 4
Number of deleted manifests: 4
[...]
```

### Schedule the purge

After you've verified the dry run, create a scheduled task to automate the purge. The following example schedules a weekly task on Sunday at 1:00 UTC to run the previous purge command:

```azurecli
# Environment variable for container command line
PURGE_CMD="acr purge \
  --filter 'samples/devimage1:.*' --filter 'samples/devimage2:.*' \
  --ago 0d --untagged"

az acr task create --name weeklyPurgeTask \
  --cmd "$PURGE_CMD" \
  --schedule "0 1 * * Sun" \
  --registry myregistry \
  --context /dev/null
```

Run the [az acr task show][az-acr-task-show] command to see that the timer trigger is configured.

## Next steps

Learn about other options to [delete image data](container-registry-delete.md) in Azure Container Registry.

For more information about image storage, see [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- LINKS - External -->

[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-acr-run]: /cli/azure/acr#az_acr_run
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-task-show]: /cli/azure/acr/task#az-acr-task-show
