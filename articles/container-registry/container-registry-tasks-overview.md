---
title: Automate building and patching container images with Azure Container Registry Tasks (ACR Tasks)
description: An introduction to ACR Tasks, a suite of features in Azure Container Registry that provides secure, automated container image build, management, and patching in the cloud.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 06/12/2019
ms.author: danlep
---

# Automate container image builds and maintenance with ACR Tasks

Containers provide new levels of virtualization, isolating application and developer dependencies from infrastructure and operational requirements. What remains, however, is the need to address how this application virtualization is managed and patched over the container lifecycle.

## What is ACR Tasks?

**ACR Tasks** is a suite of features within Azure Container Registry. It provides cloud-based container image building for Linux, Windows, and ARM, and can automate [OS and framework patching](#automate-os-and-framework-patching) for your Docker containers. ACR Tasks not only extends your "inner-loop" development cycle to the cloud with on-demand container image builds, but also enables automated builds on source code commit or when a container's base image is updated. With base image update triggers, you can automate your OS and application framework patching workflow, maintaining secure environments while adhering to the principals of immutable containers.

Build and test container images with ACR Tasks in four ways:

* [Quick task](#quick-task): Build and push container images on-demand, in Azure, without needing a local Docker Engine installation. Think `docker build`, `docker push` in the cloud. Build from local source code or a Git repository.
* [Build on source code commit](#automatic-build-on-source-code-commit): Trigger a container image build automatically when code is committed to a Git repository.
* [Build on base image update](#automate-os-and-framework-patching): Trigger a container image build  when that image's base image has been updated.
* [Multi-step tasks](#multi-step-tasks): Define multi-step tasks that build images, run containers as commands, and push images to a registry. This feature of ACR Tasks supports on-demand task execution and parallel image build, test, and push operations.

## Quick task

The inner-loop development cycle, the iterative process of writing code, building, and testing your application before committing to source control, is really the beginning of container lifecycle management.

Before you commit your first line of code, ACR Tasks's [quick task](container-registry-tutorial-quick-task.md) feature can provide an integrated development experience by offloading your container image builds to Azure. With quick tasks, you can verify your automated build definitions and catch potential problems prior to committing your code.

Using the familiar `docker build` format, the [az acr build][az-acr-build] command in the Azure CLI takes a *context* (the set of files to build), sends it ACR Tasks and, by default, pushes the built image to its registry upon completion.

For an introduction, see the quickstart to [build and run a container image](container-registry-quickstart-task-cli.md) in Azure Container Registry.  

The following table shows a few examples of supported context locations for ACR Tasks:

| Context location | Description | Example |
| ---------------- | ----------- | ------- |
| Local filesystem | Files within a directory on the local filesystem. | `/home/user/projects/myapp` |
| GitHub master branch | Files within the master (or other default) branch of a GitHub repository.  | `https://github.com/gituser/myapp-repo.git` |
| GitHub branch | Specific branch of a GitHub repo.| `https://github.com/gituser/myapp-repo.git#mybranch` |
| GitHub subfolder | Files within a subfolder in a GitHub repo. Example shows combination of a branch and subfolder specification. | `https://github.com/gituser/myapp-repo.git#mybranch:myfolder` |
| Remote tarball | Files in a compressed archive on a remote webserver. | `http://remoteserver/myapp.tar.gz` |

ACR Tasks is designed as a container lifecycle primitive. For example, integrate ACR Tasks into your CI/CD solution. By executing [az login][az-login] with a [service principal][az-login-service-principal], your CI/CD solution could then issue [az acr build][az-acr-build] commands to kick off image builds.

Learn how to use quick tasks in the first ACR Tasks tutorial, [Build container images in the cloud with Azure Container Registry Tasks](container-registry-tutorial-quick-task.md).

## Automatic build on source code commit

Use ACR Tasks to automatically trigger a container image build when code is committed to a Git repository. Build tasks, configurable with the Azure CLI command [az acr task][az-acr-task], allow you to specify a Git repository and optionally a branch and Dockerfile. When your team commits code to the repository, an ACR Tasks-created webhook triggers a build of the container image defined in the repo.

> [!IMPORTANT]
> If you previously created tasks during the preview with the `az acr build-task` command, those tasks need to be re-created using the [az acr task][az-acr-task] command.

Learn how to trigger builds on source code commit in the second ACR Tasks tutorial, [Automate container image builds with Azure Container Registry Tasks](container-registry-tutorial-build-task.md).

## Automate OS and framework patching

The power of ACR Tasks to truly enhance your container build workflow comes from its ability to detect an update to a base image. When the updated base image is pushed to your registry, or a base image is updated in a public repo such as in Docker Hub, ACR Tasks can automatically build any application images based on it.

Container images can be broadly categorized into *base* images and *application* images. Your base images typically include the operating system and application frameworks upon which your application is built, along with other customizations. These base images are themselves typically based on public upstream images, for example: [Alpine Linux][base-alpine], [Windows][base-windows], [.NET][base-dotnet], or [Node.js][base-node]. Several of your application images might share a common base image.

When an OS or app framework image is updated by the upstream maintainer, for example with a critical OS security patch, you must also update your base images to include the critical fix. Each application image must then also be rebuilt to include these upstream fixes now included in your base image.

Because ACR Tasks dynamically discovers base image dependencies when it builds a container image, it can detect when an application image's base image is updated. With one preconfigured [build task](container-registry-tutorial-base-image-update.md#create-a-task), ACR Tasks then **automatically rebuilds every application image** for you. With this automatic detection and rebuilding, ACR Tasks saves you the time and effort normally required to manually track and update each and every application image referencing your updated base image.

Learn about OS and framework patching in the third ACR Tasks tutorial, [Automate image builds on base image update with Azure Container Registry Tasks](container-registry-tutorial-base-image-update.md).

> [!NOTE]
> Currently, base image updates trigger builds only when both the base and application images reside in the same Azure container registry, or the base resides in a public Docker Hub or Microsoft Container Registry repository.

## Multi-step tasks

Multi-step tasks provide step-based task definition and execution for building, testing, and patching container images in the cloud. Task steps define individual container image build and push operations. They can also define the execution of one or more containers, with each step using the container as its execution environment.

For example, you can create a multi-step task that automates the following:

1. Build a web application image
1. Run the web application container
1. Build a web application test image
1. Run the web application test container which performs tests against the running application container
1. If the tests pass, build a Helm chart archive package
1. Perform a `helm upgrade` using the new Helm chart archive package

Multi-step tasks enable you to split the building, running, and testing of an image into more composable steps, with inter-step dependency support. With multi-step tasks in ACR Tasks, you have more granular control over image building, testing, and OS and framework patching workflows.

Learn about multi-step tasks in [Run multi-step build, test, and patch tasks in ACR Tasks](container-registry-tasks-multi-step.md).

## View task logs

Each task run generates log output that you can inspect to determine whether the task steps ran successfully. If you use the [az acr build](/cli/azure/acr#az-acr-build), [az acr run](/cli/azure/acr#az-acr-run), or [az acr task run](/cli/azure/acr/task#az-acr-task-run) command to trigger the task, log output for the task run is streamed to the console and also stored for later retrieval. View the logs for a task run in the Azure portal, or use the [az acr task logs](/cli/azure/acr/task#az-acr-task-logs) command.

Starting in July 2019, data and logs for task runs in a registry will be retained by default for 30 days and then automatically purged. If you want to archive the data for a task run, enable archiving using the [az acr task update-run](/cli/azure/acr/task#az-acr-task-update-run) command. The following example enables archiving for the task run *cf11* in registry *myregistry*.

```azurecli
az acr task update-run --registry myregistry --run-id cf11 --no-archive false
```

## Next steps

When you're ready to automate OS and framework patching by building your container images in the cloud, check out the three-part [ACR Tasks tutorial series](container-registry-tutorial-quick-task.md).

Optionally install the [Docker Extension for Visual Studio Code](https://code.visualstudio.com/docs/azure/docker) and the [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) extension to work with your Azure container registries. Pull and push images to an Azure container registry, or run ACR Tasks, all within Visual Studio Code.

<!-- LINKS - External -->
[base-alpine]: https://hub.docker.com/_/alpine/
[base-dotnet]: https://hub.docker.com/r/microsoft/dotnet/
[base-node]: https://hub.docker.com/_/node/
[base-windows]: https://hub.docker.com/r/microsoft/nanoserver/
[sample-archive]: https://github.com/Azure-Samples/acr-build-helloworld-node/archive/master.zip
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-acr-task]: /cli/azure/acr
[az-login]: /cli/azure/reference-index#az-login
[az-login-service-principal]: /cli/azure/authenticate-azure-cli

<!-- IMAGES -->
[quick-build-01-fork]: ./media/container-registry-tutorial-quick-build/quick-build-01-fork.png
[quick-build-02-browser]: ./media/container-registry-tutorial-quick-build/quick-build-02-browser.png
