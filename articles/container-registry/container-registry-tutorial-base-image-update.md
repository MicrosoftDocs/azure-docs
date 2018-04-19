---
title: Tutorial - Automate container image builds on base image update with Azure Container Registry Build
description: In this tutorial, you learn how to configure a build task to automatically trigger container image builds in the cloud when a base image is updated.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: tutorial
ms.date: 04/20/2018
ms.author: marsma
ms.custom: mvc
# Customer intent: As a developer or devops engineer, I want container
# images to be built automatically when the base image of a container is
# updated in the registry.
---

# Tutorial: Automate image builds on base image update with Azure Container Registry Build

ACR Build supports automated build execution when a container's base image is updated, such as for OS and framework patching. In this tutorial, you learn how to create a build task in ACR Build that triggers a build in in the cloud when a container base image is updated.

In this tutorial, the last in the series:

> [!div class="checklist"]
> * Create a base container image
> * Create an application image from the base image
> * Update the base image to trigger an application image build
> * View the build logs

> [!IMPORTANT]
> ACR Build is in currently in preview, and is supported only by Azure container registries in the **EastUS** region. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you'd like to use the Azure CLI locally, you must have the Azure CLI version 2.0.31 or later installed. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI 2.0][azure-cli].

## Prerequisites

### Complete previous tutorials

This tutorial assumes you've already completed the steps in the first two tutorials in the series, in which you:

* Create Azure container registry
* Fork sample repository
* Clone sample repository
* Create GitHub personal access token

If you haven't already done so, complete the first two tutorials before proceeding:

[Build container images in the cloud with Azure Container Registry Build](container-registry-tutorial-quick-build.md)

[Automate container image builds with Azure Container Registry Build](container-registry-tutorial-build-task.md)

### Configure environment

Populate these shell environment variables with values appropriate for your environment. This isn't strictly required, but makes executing the multiline Azure CLI commands in this tutorial a bit easier. If you don't populate these, you must manually replace each value wherever they appear in the example commands.

```azurecli-interactive
ACR_NAME=mycontainerregistry # The name of your Azure container registry
GIT_USER=gituser             # Your GitHub user account name
GIT_PAT=personalaccesstoken  # The PAT you generated in the second tutorial
```

## Create base image

Build the base image with an ACR Build quick build. As discussed in the [first tutorial](container-registry-tutorial-quick-build.md) in the series, this not only builds the image, but pushes it to your container registry if the build is successful.

```azurecli-interactive
az acr build --registry $ACR_NAME --image baseimages/node:9-alpine --file Dockerfile-base --context .
```

## Create application image from base image

Now that you've built the base image, build the application image that specifies the base image in its Dockerfile. In a later step, you update the base image, which triggers a build in ACR Build of the application image.

```azurecli-interactive
az acr build --registry $ACR_NAME --image helloworld:{{.Build.Id}} --file Dockerfile-app --build-arg REGISTRY_NAME=$ACR_NAME.azurecr.io --context .
```

Output from the build operation is similar to the following. Take note the **Build ID**, which you use in the next section. In the example output below, the build ID is "eastus-11".

```console
$ az acr build --registry $ACR_NAME --image helloworld:{{.Build.Id}} --file Dockerfile-app --build-arg REGISTRY_NAME=$ACR_NAME.azurecr.io --context .
Sending build context (4.932 KiB) to ACR
Queued a build with ID: eastus-11
Sending build context to Docker daemon  22.53kB
Step 1/6 : ARG REGISTRY_NAME

[...]

4e90265f7e30: Pushed
eastus-11: digest: sha256:249ba79b075ed12403774852a9aaf4e4611070f1b21a35a5fb61f61424a21b4a size: 1366
time="2018-04-19T02:35:16Z" level=info msg="Running command docker inspect --format \"{{json .RepoDigests}}\" acr22818.azurecr.io/helloworld:eastus-11"
"["acr22818.azurecr.io/helloworld@sha256:249ba79b075ed12403774852a9aaf4e4611070f1b21a35a5fb61f61424a21b4a"]"
time="2018-04-19T02:35:16Z" level=info msg="Running command docker inspect --format \"{{json .RepoDigests}}\" acr22818.azurecr.io/baseimages/node:9-alpine"
"["acr22818.azurecr.io/baseimages/node@sha256:77e1a028356f2c426090396b56d6fcff391dc3d855546e8aa2df2864fd916d63"]"
ACR Builder discovered the following dependencies:
[{"image":{"registry":"acr22818.azurecr.io","repository":"helloworld","tag":"eastus-11","digest":"sha256:249ba79b075ed12403774852a9aaf4e4611070f1b21a35a5fb61f61424a21b4a"},"runtime-dependency":{"registry":"acr22818.azurecr.io","repository":"baseimages/node","tag":"9-alpine","digest":"sha256:77e1a028356f2c426090396b56d6fcff391dc3d855546e8aa2df2864fd916d63"},"buildtime-dependency":null}]
Build complete
Build ID: eastus-11 was successful after 36.22102163s
```

### Run the sample container (optional)

If you have Docker installed, start a container from the image to see the installed Node.js version.

First, login to your registry with [az acr login][az-acr-login]:

```azurecli
az acr login --name $ACR_NAME
```

Next, execute the following `docker run` command. Replace `$BUILD_ID` with the build ID from the previous step.

```bash
docker run -d -p 8080:80 $ACR_NAME.azurecr.io/helloworld:$BUILD_ID
```

Navigate to http://localhost:8080 to see the running application. The text displayed in the web page is similar to the following:

```
Hello World
Version: 9.11.1
```

## Create the build task

Execute the following [az acr build-task create][az-acr-build-task-create] command to create a build task that automates application image builds when the base image is updated:

```azurecli-interactive
az acr build-task create \
    --registry $ACR_NAME \
    --name buildhelloworld \
    --image helloworld:{{.Build.Id}} \
    --build-arg REGISTRY_NAME=$ACR_NAME.azurecr.io \
    --context https://github.com/$GIT_USER/acr-build-helloworld-node \
    --file Dockerfile-app \
    --branch master \
    --git-access-token $GIT_PAT
```

This build task specifies that any time the base image specified in the Dockerfile (`Dockerfile-app`) is updated, ACR Build will build the container image from the code in the repository. In addition, any time code is committed to the repository specified in the `--context` parameter, ACR Build will build the image.

## Update base image

You've now built both the base image and the application image based upon it. Next, update the base image to trigger a build of the application image.

Edit **Dockerfile-base**, and add an **a** after the version number defined in `NODE_VERSION`:

```Dockerfile
ENV NODE_VERSION 9.11.1a
```

Build the updated base image. Retain the stable tag of "9" since this simulates an OS or framework update. After a few moments, this triggers a build of the application image.

```azurecli-interactive
az acr build --registry $ACR_NAME --image baseimages/node:9-alpine --file Dockerfile-base --context .
```

## View build status

View the logs as the base image update triggers the **helloworld** build task and builds the application image. It may take a moment for the webhook created by the build task to trigger the build. If the **build-id** is the same as the previous build you executed, re-run the following command to display the build log of the automatically triggered build.

```azurecli-interactive
az acr build-task logs --registry $ACR_NAME
```

If you'd like to perform the following optional step of running the newly built container to see the updated version number, take note of the **build-id** (for example, "eastus-4").

### Run the newly built image (optional)

If you have Docker installed, run the image locally once build has completed. Replace `<build-id>` with the build-id you obtained in the previous step.

```bash
docker run -d -p 8080:80 $ACR_NAME.azurecr.io/helloworld:<build-id>
```

The output should now display the new Node.js version number:

```console
Hello World
Version: 9.11.1a
```

## Clean up resources

To remove all resources you've created in this tutorial series, including the container registry, container instance, key vault, and service principal, issue the following commands:

```azurecli-interactive
az group delete --resource-group $RES_GROUP
az ad sp delete --id http://$ACR_NAME-pull
```

## Next steps

In this tutorial, you learned how to use a build task to automatically trigger container image builds when the image's base image has been updated. Now, move on to learning about authentication for your container registry.

> [!div class="nextstepaction"]
> [Authentication in Azure Container Registry](container-registry-authentication.md)

<!-- LINKS - External -->
[sample-archive]: https://github.com/Azure-Samples/aci-helloworld/archive/master.zip
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-build-task-create]: /cli/azure/acr#az-acr-build-task-create
[az-acr-build-task-run]: /cli/azure/acr#az-acr-build-task-run
[az-acr-login]: /cli/azure/acr#az-acr-login

<!-- IMAGES -->
[build-task-01-new-token]: ./media/container-registry-tutorial-build-tasks/build-task-01-new-token.png
[build-task-02-generated-token]: ./media/container-registry-tutorial-build-tasks/build-task-02-generated-token.png
[build-task-03-fork]: ./media/container-registry-tutorial-build-tasks/build-task-03-fork.png