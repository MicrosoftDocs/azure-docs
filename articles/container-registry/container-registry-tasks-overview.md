---
title: Automate OS and framework patching with Azure Container Registry Tasks (ACR Tasks)
description: An introduction to ACR Tasks, a suite of features in Azure Container Registry that provides secure, automated container image build and patching in the cloud.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 09/24/2018
ms.author: danlep
---

# Automate OS and framework patching with ACR Tasks

Containers provide new levels of virtualization, isolating application and developer dependencies from infrastructure and operational requirements. What remains, however, is the need to address how this application virtualization is patched.

## What is ACR Tasks?

**ACR Tasks** is a suite of features within Azure Container Registry. It provides cloud-based container image building for Linux, Windows, and ARM, and can automate [OS and framework patching](#automate-os-and-framework-patching) for your Docker containers. ACR Tasks not only extends your "inner-loop" development cycle to the cloud with on-demand container image builds, but also enables automated builds on source code commit or when a container's base image is updated. With base image update triggers, you can automate your OS and application framework patching workflow, maintaining secure environments while adhering to the principals of immutable containers.

Build and test container images with ACR Tasks in four ways:

* [Quick task](#quick-task): Build and push container images on-demand, in Azure, without needing a local Docker Engine installation. Think `docker build`, `docker push` in the cloud. Build from local source code or a Git repository.
* [Build on source code commit](#automatic-build-on-source-code-commit): Trigger a container image build automatically when code is commited to a Git repository.
* [Build on base image update](#automate-os-and-framework-patching): Trigger a container image build  when that image's base image has been updated.
* [Multi-step tasks](#multi-step-tasks-preview) (preview): Define multi-step tasks that build images, run containers as commands, and push images to a registry. This preview feature of ACR Tasks supports on-demand task execution and parallel image build, test, and push operations.

## Quick task

The inner-loop development cycle, the iterative process of writing code, building, and testing your application before committing to source control, is really the beginning of container lifecycle management.

Before you commit your first line of code, ACR Tasks's [quick task](container-registry-tutorial-quick-task.md) feature can provide an integrated development experience by offloading your container image builds to Azure. With quick tasks, you can verify your automated build definitions and catch potential problems prior to committing your code.

Using the familiar `docker build` format, the [az acr build][az-acr-build] command in the Azure CLI takes a *context* (the set of files to build), sends it ACR Tasks and, by default, pushes the built image to its registry upon completion.

The following table shows a few examples of supported context locations for ACR Tasks:

| Context location | Description | Example |
| ---------------- | ----------- | ------- |
| Local filesystem | Files within a directory on the local filesystem. | `/home/user/projects/myapp` |
| GitHub master branch | Files within the master (or other default) branch of a GitHub repository.  | `https://github.com/gituser/myapp-repo.git` |
| GitHub branch | Specific branch of a GitHub repo.| `https://github.com/gituser/myapp-repo.git#mybranch` |
| GitHub PR | Pull request in a GitHub repo. | `https://github.com/gituser/myapp-repo.git#pull/23/head` |
| GitHub subfolder | Files within a subfolder in a GitHub repo. Example shows combination of PR and subfolder specification. | `https://github.com/gituser/myapp-repo.git#pull/24/head:myfolder` |
| Remote tarball | Files in a compressed archive on a remote webserver. | `http://remoteserver/myapp.tar.gz` |

ACR Tasks is designed as a container lifecycle primitive. For example, integrate ACR Tasks into your CI/CD solution. By executing [az login][az-login] with a [service principal][az-login-service-principal], your CI/CD solution could then issue [az acr build][az-acr-build] commands to kick off image builds.

Learn how to use quick tasks in the first ACR Tasks tutorial, [Build container images in the cloud with Azure Container Registry Tasks](container-registry-tutorial-quick-task.md).

## Automatic build on source code commit

Use ACR Tasks to automatically trigger a container image build when code is committed to a Git repository. Build tasks, configurable with the Azure CLI command [az acr task][az-acr-task], allow you to specify a Git repository and optionally a branch and Dockerfile. When your team commits code to the repository, an ACR Tasks-created webhook triggers a build of the container image defined in the repo.

> [!IMPORTANT]
> If you previously created tasks during the preview with the `az acr build-task` command, those tasks need to be re-created using the [az acr task][az-acr-task] command.

Learn how to trigger builds on source code commit in the second ACR Tasks tutorial, [Automate container image builds with Azure Container Registry Tasks](container-registry-tutorial-build-task.md).

## Automate OS and framework patching

The power of ACR Tasks to truly enhance your container build workflow comes from its ability to detect an update to a base image. When the updated base image is pushed to your registry, ACR Tasks can automatically build any application images based on it.

Container images can be broadly categorized into *base* images and *application* images. Your base images typically include the operating system and application frameworks upon which your application is built, along with other customizations. These base images are themselves typically based on public upstream images, for example: [Alpine Linux][base-alpine], [Windows][base-windows], [.NET][base-dotnet], or [Node.js][base-node]. Several of your application images might share a common base image.

When an OS or app framework image is updated by the upstream maintainer, for example with a critical OS security patch, you must also update your base images to include the critical fix. Each application image must then also be rebuilt to include these upstream fixes now included in your base image.

Because ACR Tasks dynamically discovers base image dependencies when it builds a container image, it can detect when an application image's base image is updated. With one preconfigured [build task](container-registry-tutorial-base-image-update.md#create-a-task), ACR Tasks then **automatically rebuilds every application image** for you. With this automatic detection and rebuilding, ACR Tasks saves you the time and effort normally required to manually track and update each and every application image referencing your updated base image.

Learn about OS and framework patching in the third ACR Tasks tutorial, [Automate image builds on base image update with Azure Container Registry Tasks](container-registry-tutorial-base-image-update.md).

> [!NOTE]
> Base image updates trigger builds only when both the base and application images reside in the same Azure container registry, or the base resides in a public Docker Hub repository.

## Multi-step tasks (preview)

Multi-step tasks, a preview capability of ACR Tasks, provides step-based task definition and execution for building, testing, and patching container images in the cloud. Task steps define individual container image build and push operations. They can also define the execution of one or more containers, with each step using the container as its execution environment.

For example, you can create a multi-step task that automates the following:

1. Build a web application image
1. Run the web application container
1. Build a web application test image
1. Run the web application test container which performs tests against the running application container
1. If the tests pass, build a Helm chart archive package
1. Perform a `helm upgrade` using the new Helm chart archive package

Multi-step tasks enable you to split the building, running, and testing of an image into more composable steps, with inter-step dependency support. With multi-step tasks in ACR Tasks, you have more granular control over image building, testing, and OS and framework patching workflows.

Learn about multi-step tasks in [Run multi-step build, test, and patch tasks in ACR Tasks](container-registry-tasks-multi-step.md).

> [!IMPORTANT]
> The multi-step task capability of ACR Tasks is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this capability may change prior to general availability (GA)

## Next steps

When you're ready to automate OS and framework patching by building your container images in the cloud, check out the three-part ACR Tasks tutorial series.

> [!div class="nextstepaction"]
> [Build container images in the cloud with Azure Container Registry Tasks](container-registry-tutorial-quick-task.md)

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
[az-acr-task]: /cli/azure/acr#az-acr-task
[az-login]: /cli/azure/reference-index#az-login
[az-login-service-principal]: /cli/azure/authenticate-azure-cli#log-in-with-a-service-principal

<!-- IMAGES -->
[quick-build-01-fork]: ./media/container-registry-tutorial-quick-build/quick-build-01-fork.png
[quick-build-02-browser]: ./media/container-registry-tutorial-quick-build/quick-build-02-browser.png