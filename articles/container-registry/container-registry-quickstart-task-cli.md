---
title: Quickstart - Build and run a container image in Azure Container Registry
description: Quickly run tasks with Azure Container Registry to build and run a container image on-demand, in the cloud.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: quickstart
ms.date: 04/02/2019
ms.author: danlep
ms.custom: 
---
# Quickstart: Build and run a container image using Azure Container Registry Tasks

In this quickstart, you use Azure Container Registry Tasks commands to quickly build, push, and run a Docker container image natively within Azure, showing how to offload your "inner-loop" development cycle to the cloud. [ACR Tasks][container-registry-tasks-overview] is a suite of features within Azure Container Registry to help you manage and modify container images across the container lifecycle. 

After this quickstart, explore more advanced features of ACR Tasks. ACR Tasks can automate image builds based on code commits or base image updates, or test multiple containers, in parallel, among other scenarios. 

If you don't have an Azure subscription, create a [free account][azure-account] before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this quickstart. If you'd like to use it locally, version 2.0.58 or later is recommended. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create a resource group

If you don't already have a container registry, first create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a container registry

Create a container registry using the [az acr create][az-acr-create] command. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the following example, *myContainerRegistry008* is used. Update this to a unique value.

```azurecli-interactive
az acr create --resource-group myResourceGroup --name myContainerRegistry008 --sku Basic
```

This example creates a *Basic* registry,  a cost-optimized option for developers learning about Azure Container Registry. For details on available service tiers, see [Container registry SKUs][container-registry-skus].

## Build an image from a Dockerfile

Now use Azure Container Registry to build an image. First, create a working directory and then create a Dockerfile named *Dockerfile* with the following content. This is a simple example to build a Linux container image, but you can create your own standard Dockerfile and build images for other platforms.

```bash
echo FROM hello-world > Dockerfile
```

Run the [az acr build][az-acr-build] command to build the image. When successfully built, the image is pushed to your registry. The following example pushes the `sample/hello-world:v1` image. The `.` at the end of the command sets the location of the Dockerfile, in this case the current directory.

```azurecli-interactive
az acr build --image sample/hello-world:v1 --registry myContainerRegistry008 --file Dockerfile . 
```

Output from a successful build and push is similar to the following:

```console
Packing source code into tar to upload...
Uploading archived source code from '/tmp/build_archive_b0bc1e5d361b44f0833xxxx41b78c24e.tar.gz'...
Sending context (1.856 KiB) to registry: mycontainerregistry008...
Queued a build with ID: ca8
Waiting for agent...
2019/03/18 21:56:57 Using acb_vol_4c7ffa31-c862-4be3-xxxx-ab8e615c55c4 as the home volume
2019/03/18 21:56:57 Setting up Docker configuration...
2019/03/18 21:56:58 Successfully set up Docker configuration
2019/03/18 21:56:58 Logging in to registry: mycontainerregistry008.azurecr.io
2019/03/18 21:56:59 Successfully logged into mycontainerregistry008.azurecr.io
2019/03/18 21:56:59 Executing step ID: build. Working directory: '', Network: ''
2019/03/18 21:56:59 Obtaining source code and scanning for dependencies...
2019/03/18 21:57:00 Successfully obtained source code and scanned for dependencies
2019/03/18 21:57:00 Launching container with name: build
Sending build context to Docker daemon  13.82kB
Step 1/1 : FROM hello-world
latest: Pulling from library/hello-world
Digest: sha256:2557e3c07ed1e38f26e389462d03ed943586fxxxx21577a99efb77324b0fe535
Successfully built fce289e99eb9
Successfully tagged mycontainerregistry008.azurecr.io/sample/hello-world:v1
2019/03/18 21:57:01 Successfully executed container: build
2019/03/18 21:57:01 Executing step ID: push. Working directory: '', Network: ''
2019/03/18 21:57:01 Pushing image: mycontainerregistry008.azurecr.io/sample/hello-world:v1, attempt 1
The push refers to repository [mycontainerregistry008.azurecr.io/sample/hello-world]
af0b15c8625b: Preparing
af0b15c8625b: Layer already exists
v1: digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a size: 524
2019/03/18 21:57:03 Successfully pushed image: mycontainerregistry008.azurecr.io/sample/hello-world:v1
2019/03/18 21:57:03 Step ID: build marked as successful (elapsed time in seconds: 2.543040)
2019/03/18 21:57:03 Populating digests for step ID: build...
2019/03/18 21:57:05 Successfully populated digests for step ID: build
2019/03/18 21:57:05 Step ID: push marked as successful (elapsed time in seconds: 1.473581)
2019/03/18 21:57:05 The following dependencies were found:
2019/03/18 21:57:05
- image:
    registry: mycontainerregistry008.azurecr.io
    repository: sample/hello-world
    tag: v1
    digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/hello-world
    tag: v1
    digest: sha256:2557e3c07ed1e38f26e389462d03ed943586f744621577a99efb77324b0fe535
  git: {}

Run ID: ca8 was successful after 10s
```

## Run the image

Now quickly run the image you built and pushed to your registry. In your container development workflow, this might be a validation step before you deploy the image.

Create a file *quickrun.yaml* in a local working directory with the following content for a single step. Substitute the login server name of your registry for *\<acrLoginServer\>*. The login server name is in the format *\<registry-name\>.azurecr.io* (all lowercase), for example, *mycontainerregistry008.azurecr.io*. This example assumes that you built and pushed the `sample/hello-world:v1` image in the previous section:

```yml
steps:
  - cmd: <acrLoginServer>/sample/hello-world:v1
```

The `cmd` step in this example runs the container in its default configuration, but `cmd` supports additional `docker run` parameters or even other `docker` commands.

Run the container with the following command:

```azurecli-interactive
az acr run --registry myContainerRegistry008 --file quickrun.yaml .
```

Output is similar to the following:

```console
Packing source code into tar to upload...
Uploading archived source code from '/tmp/run_archive_ebf74da7fcb04683867b129e2ccad5e1.tar.gz'...
Sending context (1.855 KiB) to registry: mycontainerre...
Queued a run with ID: cab
Waiting for an agent...
2019/03/19 19:01:53 Using acb_vol_60e9a538-b466-475f-9565-80c5b93eaa15 as the home volume
2019/03/19 19:01:53 Creating Docker network: acb_default_network, driver: 'bridge'
2019/03/19 19:01:53 Successfully set up Docker network: acb_default_network
2019/03/19 19:01:53 Setting up Docker configuration...
2019/03/19 19:01:54 Successfully set up Docker configuration
2019/03/19 19:01:54 Logging in to registry: mycontainerregistry008.azurecr.io
2019/03/19 19:01:55 Successfully logged into mycontainerregistry008.azurecr.io
2019/03/19 19:01:55 Executing step ID: acb_step_0. Working directory: '', Network: 'acb_default_network'
2019/03/19 19:01:55 Launching container with name: acb_step_0

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

2019/03/19 19:01:56 Successfully executed container: acb_step_0
2019/03/19 19:01:56 Step ID: acb_step_0 marked as successful (elapsed time in seconds: 0.843801)

Run ID: cab was successful after 6s
```

## Clean up resources

When no longer needed, you can use the [az group delete][az-group-delete] command to remove the resource group, the container registry, and the container images stored there.

```azurecli
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you used features of ACR Tasks to quickly build, push, and run a Docker container image natively within Azure. Continue to the Azure Container Registry tutorials to learn about using ACR Tasks to automate image builds and updates.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials][container-registry-tutorial-quick-task]

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-rmi]: https://docs.docker.com/engine/reference/commandline/rmi/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/
[azure-account]: https://azure.microsoft.com/free/

<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#az-acr-create
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[azure-cli]: /cli/azure/install-azure-cli
[container-registry-tasks-overview]: container-registry-tasks-overview.md
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: container-registry-skus.md
[azure-cli-install]: /cli/azure/install-azure-cli
