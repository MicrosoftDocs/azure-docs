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

## Base images

Dockerfiles defining most container images specify a parent image from which it is based, often referred to as its *base image*. Base images typically contain the operating system, for example [Alpine Linux][base-alpine] or [Windows Nano Server][base-windows], on which the rest of the container's layers are applied. They might also include application frameworks such as [Node.js][base-node] or [.NET Core][base-dotnet].

### Base image updates

A base image is often updated by the image maintainer to include new features or improvements to the OS or framework in the image. Security patches are another common cause for a base image update.

When a base image is updated, you're presented with the need to rebuild your own container images based on it to include the new features and fixes. ACR Build includes the ability to automatically build images for you when a container's base image is updated.

### Base image update scenario

This tutorial walks you through a base image update scenario. The [code sample][code-sample] includes two Dockerfiles: an application image, and an image it specifies as its base. In the following sections, you create an ACR Build task that automatically triggers a build of the application image when a new version of the base image is pushed to your container registry.

[Dockerfile-app][dockerfile-app]: A very small Node.js web application that renders a static web page displaying the Node.js version on which it's based. The version string is actually simulated, in that it displays the contents of an environment variable, `NODE_VERSION`, that's defined in the base image.

[Dockerfile-base][dockerfile-base]: The image that `Dockerfile-app` specifies as its base. It is itself based on a [Node][base-node] image, and includes the `NODE_VERSION` environment variable.

In the following sections, you create a build task, update the `NODE_VERSION` value in the base image Dockerfile, then use ACR Build to build the base image. When ACR Build pushes the new base image to your registry, it automatically triggers a build of the application image. Optionally, you run the container images locally to see the different version strings in the built images.

## Create the build task

Start by creating a build task with [az acr build-task create][az-acr-build-task-create]:

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

This build task specifies that any time the base image specified in referenced by `Dockerfile-app` is updated, ACR Build will build the application container image from the code in the repository. In addition, any time code is committed to the repository specified in the `--context` parameter, ACR Build will build the image.

## List builds

Next, list the builds that ACR Build and completed for your registry:

```azurecli-interactive
az acr build-task list-builds --registry $ACR_NAME --output table
```

If you completed the previous tutorial (and didn't delete its resources), you should see output similar to the following. Take note of the number of builds, and the latest build ID, so you can compare the output after you update the base image in the next section.

```console
TODO: BUILD LIST TABLE OUTPUT HERE
```

## Update base image

Here you simulate a framework patch the base image. Edit **Dockerfile-base**, and add an "a" after the version number defined in `NODE_VERSION`:

```Dockerfile
ENV NODE_VERSION 9.11.1a
```

Use ACR Build to build the updated base image. Take note of the build ID in the output.

```azurecli-interactive
az acr build --registry $ACR_NAME --image baseimages/node:9-alpine --file Dockerfile-base --context .
```

Once the build is complete and ACR Build has pushed the new base image to your registry, it triggers a build of the application image. It may take few moments for the ACR Build task you created earlier to trigger the application image build, as it must detect the newly completed and pushed base image.

## List builds

Now that you've updated the base image, list your builds again to compare to the earlier list. If at first the output doesn't differ, periodically run the command to see the new builds appear in the list.

```azurecli-interactive
az acr build-task list-builds --registry $ACR_NAME --output table
```

If you'd like to perform the following optional step of running the newly built container to see the updated version number, take note of the **BUILD ID** values (for example, "eastus5").

### Run the newly built image (optional)

If you have Docker installed, run the new application image locally once its build has completed. Replace `<build-id>` with the BUILD ID you obtained in the previous step.

```bash
docker run -d -p 8080:80 $ACR_NAME.azurecr.io/helloworld:<build-id>
```

Navigate to http://localhost:8080 in your browser, and you should see your updated Node.js version number (with the "a") in the web page:

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
[base-alpine]: https://hub.docker.com/_/alpine/
[base-dotnet]: https://hub.docker.com/r/microsoft/dotnet/
[base-node]: https://hub.docker.com/_/node/
[base-windows]: https://hub.docker.com/r/microsoft/nanoserver/
[code-sample]: https://github.com/Azure-Samples/acr-build-helloworld-node
[dockerfile-base]: https://github.com/Azure-Samples/acr-build-helloworld-node/blob/master/Dockerfile-base
[dockerfile-app]: https://github.com/Azure-Samples/acr-build-helloworld-node/blob/master/Dockerfile-app
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