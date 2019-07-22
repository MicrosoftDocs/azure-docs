---
title: Build an Azure Container Registry image from an app
description: Use the az acr pack build command to build a container image from an app and push to Azure Container Registry, without using a Dockerfile.
services: container-registry
author: dlepow
ms.service: container-registry
ms.topic: article
ms.date: 07/22/2019
ms.author: danlep
---

# Build and push an image from an app using a Cloud Native Buildpack

The Azure CLI command `az acr pack build` uses the [`pack`](https://github.com/buildpack/pack) CLI tool, from [Buildpacks](https://buildpacks.io/), to build an app and push its image into an Azure container registry. This feature provides an option to quickly build a container image from your application source code in Node.js, Java, and other languages without having to define a Dockerfile.

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the examples in this article. If you'd like to use it locally, version 2.0.70 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Preview limitations


## Supported builders

The command supports all common buildpacks, including

* CloudFoundry Buildpacks - `cloudfoundry/cnb:bionic` 
* Heroku Buildpacks - `heroku/buildpacks:18`

## Use the build command

To build and push a container image using Cloud Native Buildpacks, run the [az acr pack build][az-acr-pack-build] command. Whereas the [az acr build][az-acr-build] command builds and pushes an image from a Dockerfile source and related code, with `az acr pack build` you specify an application source tree directly.

At a minimum, specify the following when you run `az acr pack build`:

* An Azure container registry where you run the command
* An image name and tag for the resulting image
* One of the [supported context locations](container-registry-tasks-overview.md#quick-task) for ACR Tasks, such as a local directory, a GitHub repo, or a remote tarball
* The name of a container image for a [supported builder](#supported-builders).  

`az acr pack build` supports other features of ACR Tasks commands including [run variables](container-registry-tasks-reference-yaml.md#run-variables) and [task run logs](container-registry-tasks-overview.md#view-task-logs) that are streamed and also saved for later retrieval.

## Example: Build Node.js image with CloudFoundry Buildpacks

The following example builds a container image from the Node.js app in the [Azure-Samples/nodejs-docs-hello-world](https://github.com/Azure-Samples/nodejs-docs-hello-world) repo, using the CloudFoundry Buildpacks builder:

```azurecli
az acr pack build \
    --registry myregistry \
    --image {{.Run.Registry}}/node-app:{{.Run.Date}} \
    --pull --builder cloudfoundry/cnb:bionic \
    https://github.com/Azure-Samples/nodejs-docs-hello-world.git
```

This example builds the `node-app` image tagged with the run date of the command and pushes it to the *myregistry* container registry. Here, the target registry name is explicitly prepended to the image name. If not specified, the registry URL is automatically prepended to the image name.

The `--pull` parameter specifies that the command pulls the latest builder image, which is recommended.

Command output shows the progress of building and pushing the image. 



## Example: Build Java image with Heroku Buildpacks

The following example builds a container image from the Java app in the [buildpack/sample-java-app](https://github.com/buildpack/sample-java-app) repo, using the Heroku Buildpacks builder:

```azurecli
az acr pack build \
    --registry myregistry \
    --image java-app:{{.Run.ID}} \
    --pull --builder heroku/buildpacks:18 \
    https://github.com/buildpack/sample-java-app.git
```

This example builds the `java-app` image tagged with the run ID of the command and pushes it to the *myregistry* container registry.

The `--pull` parameter specifies that the command pulls the latest builder image, which is recommended.


Command output shows the progress of building and pushing the image. 

After the image is successfully built, you can run it with Docker. First sign into your registry:

```azurecli
az acr login --name myregistry
```

Run the image, substituting your image tag for *runid*:

```console
docker run --rm -p 8080:8080 myregistry.azurecr.io/java-app:runid
```

Browse to `localhost:8080` in your favorite browser to see the sample web app. Press `[Ctrl]+[C]` to stop the container.


## Next steps

For more information about ACR Tasks features, see [Automate container image builds and maintenance with ACR Tasks](container-registry-tasks-overview.md).


<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-acr-build]: /cli/azure/acr/task
[az-acr-pack-build]: /cli/azure/acr/pack#az-acr-pack-build