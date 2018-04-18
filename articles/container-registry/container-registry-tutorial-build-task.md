---
title: Tutorial - Automate container image builds with Azure Container Registry Build
description: In this tutorial, you learn how to configure a build task to automatically trigger container image builds in the cloud when you commit source code to a Git repository.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: tutorial
ms.date: 04/20/2018
ms.author: marsma
ms.custom: mvc
# Customer intent: As a developer or devops engineer, I want to trigger
# container image builds automatically when I commit code to a Git repo.
---

# Tutorial: Automate container image builds with Azure Container Registry Build

In addition to [Quick Build](container-registry-tutorial-quick-build.md), ACR Build supports automated Docker container image builds with the *build task*. In this tutorial, you use the Azure CLI to configure a build task to automatically trigger container image builds in the cloud when you commit source code to a Git repository.

In this tutorial, part two in the series:

> [!div class="checklist"]
> * Create a build task
> * Test the build task
> * View build status
> * Trigger the build task with a code commit

This tutorial assumes you've already completed the steps in the [previous tutorial](container-registry-tutorial-quick-build.md). If you haven't already done so, complete the steps in the [Prerequisites](container-registry-tutorial-quick-build.md#prerequisites) section of the previous tutorial before proceeding.

> [!IMPORTANT]
> ACR Build is in currently in preview, and is supported only by Azure container registries in the **EastUS** region. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you'd like to use the Azure CLI locally, you must have Azure CLI version 2.0.31 or later installed. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI 2.0][azure-cli].

## Prerequisites

### Get ACR Build and sample code

This tutorial assumes you've already completed the steps in the [previous tutorial](container-registry-tutorial-quick-build.md) to install ACR Build, and fork and clone the sample repository. If you haven't already done so, complete the steps in the [Prerequisites](container-registry-tutorial-quick-build.md#prerequisites) section of the previous tutorial before proceeding.

### Container registry

You must have an Azure container registry in your Azure subscription to complete this tutorial. If you need a registry, see the [previous tutorial](container-registry-tutorial-quick-build.md), or [Quickstart: Create a container registry using the Azure CLI](container-registry-get-started-azure-cli.md).

The example commands in this tutorial use the environment variable `$ACR_NAME` in place of your registry's name. Set this variable in your shell, or replace the value in each command with the name of your registry.

For example, to set the variable in the Bash shell:

```azurecli-interactive
ACR_NAME=mycontainerregistry
```

## Build task

A build task defines the properties of an automated build, including the location of the container image source code and the event that triggers the build. When an event defined in the build task occurs, such as a commit to a Git repository, ACR Build initiates a container image build in the cloud, and by default, pushes a successfully built image to the Azure container registry specified in the task.

ACR Build currently supports the following build task triggers:

* Commit to a Git repository

## Create a build task

In this section, you first create a GitHub personal access token (PAT) for use with ACR Build. Then, you create a build task that triggers a build when code is committed to your fork of the repository.

### Create a GitHub personal access token

To trigger a build on a commit to a Git repository, ACR Build needs a personal access token (PAT) to access the repository. Follow these steps to generate a PAT in GitHub:

1. Navigate to the PAT creation page on GitHub at https://github.com/settings/tokens/new
1. Enter a short **description** for the token, for example, "ACR Build Task Demo"
1. Under **repo**, enable **repo:status** and **public_repo**

   ![Screenshot of the Personal Access Token generation page in GitHub][build-task-01-new-token]

1. Select the **Generate token** button (you may be asked to confirm your password)
1. Copy and save the generated token in a **secure location** (you use this token when you define a build task in a later step)

   ![Screenshot of the generated Personal Access Token in GitHub][build-task-02-generated-token]

### Create the build task

Now that you've completed the steps required to enable ACR Build to read commit status and create webhooks in a repository, you can create a build task that triggers a container image build on commits to the repo.

Execute the following [az acr build-task create][az-acr-build-task-create] command. Replace `<your-github-username>` with your GitHub username, and `<your-access-token>` with the PAT you generated in a previous step. If you haven't previously populated the `ACR_NAME` environment variable with the name of your Azure container registry (such as in the [previous tutorial](container-registry-tutorial-quick-build.md), replace `$ACR_NAME` with the name of your registry.

```azurecli-interactive
az acr build-task create \
    --registry $ACR_NAME \
    --name buildhelloworld \
    --image helloworld:v1 \
    --context https://github.com/<your-github-username>/acr-build-helloworld-node \
    --branch master \
    --git-access-token <your-access-token>
```

This build task specifies that any time code is committed to branch "master" in the repository specified in the `--context` parameter, ACR Build will build the container image from the code in the repository.

Output from a successful [az acr build-task create][az-acr-build-task-create] command is similar to the following:

```console
$ az acr build-task create --registry mycontainerregistry --name buildhelloworld --image helloworld:v1 --context https://github.com/githubuser/acr-build-helloworld-node --branch master --git-access-token 0123456789abcdef1234567890
{
  "additionalProperties": {},
  "alias": "buildhelloworld",
  "creationDate": "2018-04-05T17:26:14.347346+00:00",
  "id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/mycontainerregistry/buildTasks/buildhelloworld",
  "location": "eastus",
  "name": "buildhelloworld",
  "platform": {
    "additionalProperties": {},
    "cpu": 1,
    "osType": "Linux"
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sourceRepository": {
    "additionalProperties": {},
    "isCommitTriggerEnabled": true,
    "repositoryUrl": "https://github.com/githubuser/acr-build-helloworld-node",
    "sourceControlAuthProperties": null,
    "sourceControlType": "Github"
  },
  "status": "enabled",
  "tags": null,
  "timeout": null,
  "type": "Microsoft.ContainerRegistry/registries/buildTasks"
}
```

## Test the build task

You now have a build task that defines your build. To test the build definition, trigger a build manually by executing the [az acr build-task run][az-acr-build-task-run] command:

```azurecli-interactive
az acr build-task run --registry $ACR_NAME --name buildhelloworld
```

Be default, the `az acr build-task run` command streams the log output to your console when you execute the command. Here, the output shows that build **eastus-2** has been queued and built.

```console
$ az acr build-task run --registry mycontainerregistry --name buildhelloworld
Queued a build with build-id: eastus-2.
Starting to stream the logs...
time="2018-04-05T22:22:25Z" level=info msg="Running command docker login -u 00000000-0000-0000-0000-000000000000 --password-stdin mycontainerregistry.azurecr.io"
Login Succeeded
time="2018-04-05T22:22:30Z" level=info msg="Running command git clone https://x-access-token:*************@github.com/githubuser/acr-build-helloworld-node /root/acr-builder/src"
Cloning into '/root/acr-builder/src'...
time="2018-04-05T22:22:31Z" level=info msg="Running command git checkout master"
Already on 'master'
Your branch is up to date with 'origin/master'.
d5ccfcedc0d81f7ca5e3dbe6e5a7705b579101f1
time="2018-04-05T22:22:31Z" level=info msg="Running command git rev-parse --verify HEAD"
time="2018-04-05T22:22:31Z" level=info msg="Running command docker build -f Dockerfile -t mycontainerregistry.azurecr.io/acihelloworld:v1 ."
Sending build context to Docker daemon  131.1kB
Step 1/6 : FROM node:8.9.3-alpine

[...]

Build complete
Build ID: eastus-2 was successful after 51.751323302s
```

## View build status

You may occasionally find it useful to view the status of an ongoing build you've not triggered manually. For example, while troubleshooting builds that are triggered by source code commits.

In this section, you trigger a manual build, but suppress the default behavior of streaming the build log to your console. Then, you use the `az acr build-task logs` command to monitor the ongoing build.

First, trigger a build manually as you've done previously, but specify the `--no-logs` argument to suppress logging to your console:

```azurecli-interactive
az acr build-task run --registry $ACR_NAME --name buildhelloworld --no-logs
```

Next, use the `az build-task logs` command to view the log of the currently running build:

```azurecli-interactive
az acr build-task logs --registry $ACR_NAME
```

The log for the currently running build is streamed to your console, and should appear similar to the following output (shown here truncated):

```console
$ az acr build-task logs --registry $ACR_NAME
Showing logs for the last updated build...
Build-id: eastus-3

[...]

Build complete
Build ID: eastus-3 was successful after 30.076988169s
```

## Trigger a build with a commit

Now that you've tested the build task by manually running it, trigger it automatically with a source code change.

First, ensure you're in the directory containing your local clone of the repository:

```azurecli-interactive
cd acr-build-helloworld-node
```

Next, execute the following commands to create, commit, and push a new file to your fork of the repo on GitHub:

```azurecli-interactive
echo "Hello World!" > hello.txt
git add hello.txt
git commit -m "Testing ACR Build"
git push origin master
```

You may be asked to provide your GitHub credentials when you execute the `git push` command. Provide your GitHub username, and enter the personal access token (PAT) that you created earlier for the password.

```console
$ git push origin master
Username for 'https://github.com': githubuser
Password for 'https://githubuser@github.com': <personal-access-token>
```

Once you've pushed a commit to your repository, the webhook created by ACR Build fires and kicks off a build in Azure Container Registry. Display the build logs for the currently running build to verify and monitor the build progress:

```azurecli-interactive
az acr build-task logs --registry $ACR_NAME
```

Output is similar to the following, showing the currently executing (or last-executed) build:

```console
$ az acr build-task logs --registry $ACR_NAME
Showing logs for the last updated build...
Build-id: eastus-4

[...]

Build complete
Build ID: eastus-4 was successful after 28.9587031s
```

## Next steps

In this tutorial, you learned how to use a build task to automatically trigger container image builds in Azure when you commit source code to a Git repository.

Learn how Azure Container Registry stores your images in [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-build-task-create]: /cli/azure/acr#az-acr-build-task-create
[az-acr-build-task-run]: /cli/azure/acr#az-acr-build-task-run

<!-- IMAGES -->
[build-task-01-new-token]: ./media/container-registry-tutorial-build-tasks/build-task-01-new-token.png
[build-task-02-generated-token]: ./media/container-registry-tutorial-build-tasks/build-task-02-generated-token.png
