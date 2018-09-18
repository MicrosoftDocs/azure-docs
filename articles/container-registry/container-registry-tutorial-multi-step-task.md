---
title: Tutorial - Build, push, and test container images with Azure Container Registry Tasks
description: In this tutorial, you learn how to create and run a task-based workflow for building, testing, and pushing container images in the cloud.
services: container-registry
author: mmacy

ms.service: container-registry
ms.topic: article
ms.date: 09/19/2018
ms.author: marsma
---

# Tutorial: Automate container image build, test, and push with multi-step tasks

Multi-step tasks extend the single image build-and-push capability of ACR Tasks to enable multi-step, multi-container-based workflows. With multi-step tasks, you can build and push several images, in series or in parallel, and run those images as functions within a single task run. Each step of a task is run in the cloud using Azure's compute resources,

In this tutorial, the last in the series:

> [!div class="checklist"]
> * Define a multi-step task in `acr-task.yaml`
> * Perform a quick run of the multi-step task
> * Create a commit trigger-based multi-step task
> * Trigger the multi-step task with a Git commit
> * View the results of both task runs

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you'd like to use the Azure CLI locally, you must have the Azure CLI version **2.0.46** or later installed. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI][azure-cli].

> [!IMPORTANT]
> The multi-step tasks feature of ACR Tasks is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Prerequisites

To complete this tutorial, need a private Docker registry in Azure Container Registry. If you need one, see [Quickstart - Create a private Docker registry in Azure with the Azure CLI](container-registry-get-started-azure-cli.md).

## Create a task file

Multi-step tasks in ACR Tasks are defined in plain text files using standard YAML syntax. This tutorial uses `acr-task.yaml` as the file name for task definition, but you can use any filename for your task files as long as they have a *.yaml or *.yml suffix.

Create a new file named `acr-task.yaml` and copy the following YAML into it.

```yaml
version: 1.0-preview-1
steps:
  - build: -t {{.Run.Registry}}/taskmultistep:{{.Run.ID}} -f Dockerfile .
  - push: ["{{.Run.Registry}}/taskmultistep:{{.Run.ID}}"]
```

This `acr-task.yaml` includes one global property, `version`, that applies the full run of the task, and two steps, `build` and `push`. There is one other step type, `cmd`, that runs a container as a function in your task. The `cmd` step type is discussed later in this tutorial.

## Run the multi-step task

Now that you've defined your task, perform a quick run by executing the following `az acr run` command:

```azurecli-interactive
az acr run -r $ACR_NAME -f acr-task.yaml .
```

## Clean up resources

To remove all resources you've created in this tutorial series, including the container registry, container instance, key vault, and service principal, issue the following commands:

```azurecli-interactive
az group delete --resource-group $RES_GROUP
az ad sp delete --id http://$ACR_NAME-pull
```

## Next steps

We invite you to provide feedback while you use the ACR Tasks preview. Several feedback channels are available:

* [Issues](https://aka.ms/acr/issues) - View existing bugs and issues, and log new ones
* [UserVoice](https://aka.ms/acr/uservoice) - Vote on existing feature requests or create new requests
* [Discuss](https://aka.ms/acr/feedback) - Engage in Azure Container Registry discussion with the Stack Overflow community

<!-- IMAGES -->

<!-- LINKS - External -->
[pricing]: https://azure.microsoft.com/pricing/details/container-registry/
[task-examples]: https://github.com/Azure-Samples/acr-tasks
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-run]: /cli/azure/acr/run#az-acr-run
