---
title: Tutorial - Multi-step container tasks - Azure Container Registry Tasks
description: In this tutorial, you learn how to configure an Azure Container Registry Task to automatically trigger a multi-step workflow to build, run, and push container images in the cloud when you commit source code to a Git repository.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: tutorial
ms.date: 05/02/2019
ms.author: danlep
ms.custom: "seodec18, mvc"
# Customer intent: As a developer or devops engineer, I want to trigger
# a multi-step container workflow automatically when I commit code to a Git repo.
---

# Tutorial: Run a multi-step container workflow in the cloud when you commit source code

In addition to a [quick task](container-registry-tutorial-quick-task.md), ACR Tasks supports multi-steps tasks that can automatically trigger building, running, and pushing container images in the cloud when you commit source code to a Git repository.

In this tutorial, you use an example YAML file to define a multi-step task that builds, runs, and pushes two container images to two different registries when you commit code to a Git repo. To create a task that only automates a single image build on code commit, see [Tutorial: Automate container image builds in the cloud when you commit source code](container-registry-tutorial-build-task.md). For an overview of ACR Tasks, see [Automate OS and framework patching with ACR Tasks](container-registry-tasks-overview.md),

In this tutorial, you:

> [!div class="checklist"]
> * Define a multi-step task using a YAML file
> * Create a task
> * Add credentials to the task to enable access to another registry
> * Test the task
> * View task status
> * Trigger the task with a code commit

This tutorial assumes you've already completed the steps in the [previous tutorial](container-registry-tutorial-quick-task.md). If you haven't already done so, complete the steps in the [Prerequisites](container-registry-tutorial-quick-task.md#prerequisites) section of the previous tutorial before proceeding.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you'd like to use the Azure CLI locally, you must have Azure CLI version **2.0.63** or later installed and logged in with [az login][az-login]. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI][azure-cli].

[!INCLUDE [container-registry-task-tutorial-prereq.md](../../includes/container-registry-task-tutorial-prereq.md)]

## Create a multi-step task

Now that you've completed the steps required to enable ACR Tasks to read commit status and create webhooks in a repository, you can create a multi-step task that triggers building, running, and pushing container images.

### YAML file

To create a multi-step task, you define the steps in a [YAML file](container-registry-tasks-reference-yaml.md). The first example multi-step task for this tutorial is defined in the file `multitask.yaml`, which is in the root of the GitHub repo that you cloned:

```yml
version: v1.0.0
steps:
# Build target image
- build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} -f Dockerfile .
# Run image 
- cmd: -d -p 8080:80 --name test -t {{.Run.Registry}}/hello-world:{{.Run.ID}} 
# Push image
- push:
  - {{.Run.Registry}}/hello-world:{{.Run.ID}}
```

This multi-step task does the following:

1. Uses a `build` step to build an image from the Dockerfile in the working directory. The first is targeted for the `Run.Registry`, the registry where the task is run, and tagged with the ACR Tasks run ID. 
1. Uses a `cmd` step to run the image in a temporary container. This example runs the container in the background and returns the container ID. In a real-world scenario, you might test a running container to ensure it runs correctly.
1. In a `push` step, pushes the image that was built to the run registry.


### Task command

First, populate these shell environment variables with values appropriate for your environment. This step isn't strictly required, but makes executing the multiline Azure CLI commands in this tutorial a bit easier. If you don't populate these environment variables, you must manually replace each value wherever they appear in the example commands.

```azurecli-interactive
ACR_NAME=<registry-name>        # The name of your Azure container registry
GIT_USER=<github-username>      # Your GitHub user account name
GIT_PAT=<personal-access-token> # The PAT you generated in the previous section
```

Now, create the task by executing following [az acr task create][az-acr-task-create] command:

```azurecli-interactive
az acr task create \
    --registry $ACR_NAME \
    --name multitask \
    --context https://github.com/$GIT_USER/acr-build-helloworld-node.git \
    --branch master \
    --file multitask.yaml \
    --git-access-token $GIT_PAT \
```

This task specifies that any time code is committed to the *master* branch in the repository specified by `--context`, ACR Tasks will build the container image from the code in that branch. The Dockerfile specified by `--file` from the repository root is used to build the image. The `--image` argument specifies a parameterized value of `{{.Run.ID}}` for the version portion of the image's tag, ensuring the built image correlates to a specific build, and is tagged uniquely.

Output from a successful [az acr task create][az-acr-task-create] command is similar to the following:

```console
$ az acr task create \
>     --registry $ACR_NAME \
>     --name taskhelloworld \
>     --image helloworld:{{.Run.ID}} \
>     --context https://github.com/$GIT_USER/acr-build-helloworld-node.git \
>     --branch master \
>     --file Dockerfile \
>     --git-access-token $GIT_PAT
{
  "agentConfiguration": {
    "cpu": 2
  },
  "creationDate": "2018-09-14T22:42:32.972298+00:00",
  "id": "/subscriptions/<Subscription ID>/resourceGroups/myregistry/providers/Microsoft.ContainerRegistry/registries/myregistry/tasks/taskhelloworld",
  "location": "westcentralus",
  "name": "taskhelloworld",
  "platform": {
    "architecture": "amd64",
    "os": "Linux",
    "variant": null
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "myregistry",
  "status": "Enabled",
  "step": {
    "arguments": [],
    "baseImageDependencies": null,
    "contextPath": "https://github.com/gituser/acr-build-helloworld-node",
    "dockerFilePath": "Dockerfile",
    "imageNames": [
      "helloworld:{{.Run.ID}}"
    ],
    "isPushEnabled": true,
    "noCache": false,
    "type": "Docker"
  },
  "tags": null,
  "timeout": 3600,
  "trigger": {
    "baseImageTrigger": {
      "baseImageTriggerType": "Runtime",
      "name": "defaultBaseimageTriggerName",
      "status": "Enabled"
    },
    "sourceTriggers": [
      {
        "name": "defaultSourceTriggerName",
        "sourceRepository": {
          "branch": "master",
          "repositoryUrl": "https://github.com/gituser/acr-build-helloworld-node",
          "sourceControlAuthProperties": null,
          "sourceControlType": "GitHub"
        },
        "sourceTriggerEvents": [
          "commit"
        ],
        "status": "Enabled"
      }
    ]
  },
  "type": "Microsoft.ContainerRegistry/registries/tasks"
}
```

## Test the build task

You now have a task that defines your build. To test the build pipeline, trigger a build manually by executing the [az acr task run][az-acr-task-run] command:

```azurecli-interactive
az acr task run --registry $ACR_NAME --name taskhelloworld
```

By default, the `az acr task run` command streams the log output to your console when you execute the command.

```console
$ az acr task run --registry $ACR_NAME --name taskhelloworld

2018/09/17 22:51:00 Using acb_vol_9ee1f28c-4fd4-43c8-a651-f0ed027bbf0e as the home volume
2018/09/17 22:51:00 Setting up Docker configuration...
2018/09/17 22:51:02 Successfully set up Docker configuration
2018/09/17 22:51:02 Logging in to registry: myregistry.azurecr.io
2018/09/17 22:51:03 Successfully logged in
2018/09/17 22:51:03 Executing step: build
2018/09/17 22:51:03 Obtaining source code and scanning for dependencies...
2018/09/17 22:51:05 Successfully obtained source code and scanned for dependencies
Sending build context to Docker daemon  23.04kB
Step 1/5 : FROM node:9-alpine
9-alpine: Pulling from library/node
Digest: sha256:8dafc0968fb4d62834d9b826d85a8feecc69bd72cd51723c62c7db67c6dec6fa
Status: Image is up to date for node:9-alpine
 ---> a56170f59699
Step 2/5 : COPY . /src
 ---> 5f574fcf5816
Step 3/5 : RUN cd /src && npm install
 ---> Running in b1bca3b5f4fc
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN helloworld@1.0.0 No repository field.

up to date in 0.078s
Removing intermediate container b1bca3b5f4fc
 ---> 44457db20dac
Step 4/5 : EXPOSE 80
 ---> Running in 9e6f63ec612f
Removing intermediate container 9e6f63ec612f
 ---> 74c3e8ea0d98
Step 5/5 : CMD ["node", "/src/server.js"]
 ---> Running in 7382eea2a56a
Removing intermediate container 7382eea2a56a
 ---> e33cd684027b
Successfully built e33cd684027b
Successfully tagged myregistry.azurecr.io/helloworld:da2
2018/09/17 22:51:11 Executing step: push
2018/09/17 22:51:11 Pushing image: myregistry.azurecr.io/helloworld:da2, attempt 1
The push refers to repository [myregistry.azurecr.io/helloworld]
4a853682c993: Preparing
[...]
4a853682c993: Pushed
[...]
da2: digest: sha256:c24e62fd848544a5a87f06ea60109dbef9624d03b1124bfe03e1d2c11fd62419 size: 1366
2018/09/17 22:51:21 Successfully pushed image: myregistry.azurecr.io/helloworld:da2
2018/09/17 22:51:21 Step id: build marked as successful (elapsed time in seconds: 7.198937)
2018/09/17 22:51:21 Populating digests for step id: build...
2018/09/17 22:51:22 Successfully populated digests for step id: build
2018/09/17 22:51:22 Step id: push marked as successful (elapsed time in seconds: 10.180456)
The following dependencies were found:
- image:
    registry: myregistry.azurecr.io
    repository: helloworld
    tag: da2
    digest: sha256:c24e62fd848544a5a87f06ea60109dbef9624d03b1124bfe03e1d2c11fd62419
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/node
    tag: 9-alpine
    digest: sha256:8dafc0968fb4d62834d9b826d85a8feecc69bd72cd51723c62c7db67c6dec6fa
  git:
    git-head-revision: 68cdf2a37cdae0873b8e2f1c4d80ca60541029bf


Run ID: da2 was successful after 27s
```

## Trigger a build with a commit

Now that you've tested the task by manually running it, trigger it automatically with a source code change.

First, ensure you're in the directory containing your local clone of the [repository][sample-repo]:

```azurecli-interactive
cd acr-build-helloworld-node
```

Next, execute the following commands to create, commit, and push a new file to your fork of the repo on GitHub:

```azurecli-interactive
echo "Hello World!" > hello.txt
git add hello.txt
git commit -m "Testing ACR Tasks"
git push origin master
```

You may be asked to provide your GitHub credentials when you execute the `git push` command. Provide your GitHub username, and enter the personal access token (PAT) that you created earlier for the password.

```console
$ git push origin master
Username for 'https://github.com': <github-username>
Password for 'https://githubuser@github.com': <personal-access-token>
```

Once you've pushed a commit to your repository, the webhook created by ACR Tasks fires and kicks off a build in Azure Container Registry. Display the logs for the currently running task to verify and monitor the build progress:

```azurecli-interactive
az acr task logs --registry $ACR_NAME
```

Output is similar to the following, showing the currently executing (or last-executed) task:

```console
$ az acr task logs --registry $ACR_NAME
Showing logs of the last created run.
Run ID: da4

[...]

Run ID: da4 was successful after 38s
```

## List builds

To see a list of the task runs that ACR Tasks has completed for your registry, run the [az acr task list-runs][az-acr-task-list-runs] command:

```azurecli-interactive
az acr task list-runs --registry $ACR_NAME --output table
```

Output from the command should appear similar to the following. The runs that ACR Tasks has executed are displayed, and "Git Commit" appears in the TRIGGER column for the most recent task:

```console
$ az acr task list-runs --registry $ACR_NAME --output table

RUN ID    TASK             PLATFORM    STATUS     TRIGGER     STARTED               DURATION
--------  --------------  ----------  ---------  ----------  --------------------  ----------
da4       taskhelloworld  Linux       Succeeded  Git Commit  2018-09-17T23:03:45Z  00:00:44
da3       taskhelloworld  Linux       Succeeded  Manual      2018-09-17T22:55:35Z  00:00:35
da2       taskhelloworld  Linux       Succeeded  Manual      2018-09-17T22:50:59Z  00:00:32
da1                       Linux       Succeeded  Manual      2018-09-17T22:29:59Z  00:00:57
```

## Create a multi-registry multi-step task

ACR Tasks by default is set up to push or pull images from the registry where the task runs. You might want to run a multi-step task that targets one or more registries in addition to the run registry. For example, you might need to build images in one registry, and store images with different tags in a second registry. This example shows you how to create such a task and provide credentials for another registry.

If you don't already have a second registry, create one for this example. To create the task, you need the name of the registry login server, which is of the form *mycontainerregistry.azurecr.io* (all lowercase)

### YAML file

The second example multi-step task for this tutorial is defined in the file `multitaskandregistry.yaml`, which is in the root of the GitHub repo that you cloned:

```yml
version: v1.0.0
steps:
# Build target images
- build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} -f Dockerfile .
- build: -t {{.Values.regLatest}}/hello-world:{{.Run.Date}} -f Dockerfile .
# Run image 
- cmd: -d -p 8080:80 --name test -t {{.Run.Registry}}/hello-world:{{.Run.ID}} 
- cmd: -d -p 8080:80 --name test -t {{.Run.Registry}}/hello-world:{{.Run.ID}} 
# Push images
- push:
  - {{.Run.Registry}}/hello-world:{{.Run.ID}}
  - {{.Values.regLatest}}/hello-world:{{.Run.Date}}
```

This multi-step task does the following:

1. Uses two `build` steps to build images from the Dockerfile in the working directory:
  * The first is targeted for the `Run.Registry`, the registry where the task is run, and tagged with the ACR Tasks run ID. 
  * The second is targeted for a registry identified by the value of `regLatest`, which you set when you create the task (or provide through an external `values.yaml` file). This image is tagged with the run date.
1. Uses a `cmd` step to run each of the built containers. This example runs each container in the background and returns the container ID. In a real-world scenario, you might test each running container to ensure it runs correctly.
1. In a `push` step, pushes the images that were built, the first to the run registry, the second to the registry identified by `regLatest`.

### Task command

Using the shell environment variables defined previously, create the task by executing following [az acr task create][az-acr-task-create] command. Substitue the

```azurecli-interactive
az acr task create \
    --registry $ACR_NAME \
    --name multitask \
    --context https://github.com/$GIT_USER/acr-build-helloworld-node.git \
    --branch master \
    --file multitaskandregistry.yaml \
    --git-access-token $GIT_PAT \
    --set regLatest=<another registry login server>
```

## Next steps

In this tutorial, you learned how to use a task to automatically trigger container image builds in Azure when you commit source code to a Git repository. Move on to the next tutorial to learn how to create tasks that trigger builds when a container image's base image is updated.

> [!div class="nextstepaction"]
> [Automate builds on base image update](container-registry-tutorial-base-image-update.md)

<!-- LINKS - External -->
[sample-repo]: https://github.com/Azure-Samples/acr-build-helloworld-node

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-task]: /cli/azure/acr
[az-acr-task-create]: /cli/azure/acr
[az-acr-task-run]: /cli/azure/acr
[az-acr-task-list-runs]: /cli/azure/acr
[az-login]: /cli/azure/reference-index#az-login

<!-- IMAGES -->
[build-task-01-new-token]: ./media/container-registry-tutorial-build-tasks/build-task-01-new-token.png
[build-task-02-generated-token]: ./media/container-registry-tutorial-build-tasks/build-task-02-generated-token.png
