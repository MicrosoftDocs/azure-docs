---
title: Automate building and patching container images with Azure Container Registry Tasks (ACR Tasks)
description: An introduction to ACR Tasks, a suite of features in Azure Container Registry that provides secure, automated container image build, management, and patching in the cloud.
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 09/05/2019
ms.author: danlep
---

# Automate container image builds and maintenance with ACR Tasks

Containers provide new levels of virtualization, isolating application and developer dependencies from infrastructure and operational requirements. What remains, however, is the need to address how this application virtualization is managed and patched over the container lifecycle.

## What is ACR Tasks?

**ACR Tasks** is a suite of features within Azure Container Registry. It provides cloud-based container image building for [platforms](#image-platforms) including Linux, Windows, and ARM, and can automate [OS and framework patching](#automate-os-and-framework-patching) for your Docker containers. ACR Tasks not only extends your "inner-loop" development cycle to the cloud with on-demand container image builds, but also enables automated builds triggered by source code updates, updates to a container's base image, or timers. For example, with base image update triggers, you can automate your OS and application framework patching workflow, maintaining secure environments while adhering to the principles of immutable containers.

## Task scenarios

ACR Tasks supports several scenarios to build and maintain container images and other artifacts. See the following sections in this article for details.

* **[Quick task](#quick-task)** - Build and push a single container image to a container registry on-demand, in Azure, without needing a local Docker Engine installation. Think `docker build`, `docker push` in the cloud.
* **Automatically triggered tasks** - Enable one or more *triggers* to build an image:
  * **[Trigger on source code update](#trigger-task-on-source-code-update)** 
  * **[Trigger on base image update](#automate-os-and-framework-patching)** 
  * **[Trigger on a schedule](#schedule-a-task)** 
* **[Multi-step task](#multi-step-tasks)** - Extend the single image build-and-push capability of ACR Tasks with multi-step, multi-container-based workflows. 

Each ACR Task has an associated [source code context](#context-locations) - the location of a set of source files used to build a container image or other artifact. Example contexts include a Git repository or a local filesystem.

Tasks can also take advantage of [run variables](container-registry-tasks-reference-yaml.md#run-variables), so you can reuse task definitions and standardize tags for images and artifacts.

## Quick task

The inner-loop development cycle, the iterative process of writing code, building, and testing your application before committing to source control, is really the beginning of container lifecycle management.

Before you commit your first line of code, ACR Tasks's [quick task](container-registry-tutorial-quick-task.md) feature can provide an integrated development experience by offloading your container image builds to Azure. With quick tasks, you can verify your automated build definitions and catch potential problems prior to committing your code.

Using the familiar `docker build` format, the [az acr build][az-acr-build] command in the Azure CLI takes a [context](#context-locations) (the set of files to build), sends it ACR Tasks and, by default, pushes the built image to its registry upon completion.

For an introduction, see the quickstart to [build and run a container image](container-registry-quickstart-task-cli.md) in Azure Container Registry.  

ACR Tasks is designed as a container lifecycle primitive. For example, integrate ACR Tasks into your CI/CD solution. By executing [az login][az-login] with a [service principal][az-login-service-principal], your CI/CD solution could then issue [az acr build][az-acr-build] commands to kick off image builds.

Learn how to use quick tasks in the first ACR Tasks tutorial, [Build container images in the cloud with Azure Container Registry Tasks](container-registry-tutorial-quick-task.md).

> [!TIP]
> If you want to build and push an image directly from source code, without a Dockerfile, Azure Container Registry provides the [az acr pack build][az-acr-pack-build] command (preview). This tool builds and pushes an image from application source code using [Cloud Native Buildpacks](https://buildpacks.io/).

## Trigger task on source code update

Trigger a container image build or multi-step task when code is committed, or a pull request is made or updated, to a Git repository in GitHub or Azure DevOps. For example, configure a build task with the Azure CLI command [az acr task create][az-acr-task-create] by specifying a Git repository and optionally a branch and Dockerfile. When your team updates code in the repository, an ACR Tasks-created webhook triggers a build of the container image defined in the repo. 

ACR Tasks supports the following triggers when you set a Git repo as the task's context:

| Trigger | Enabled by default |
| ------- | ------------------ |
| Commit | Yes |
| Pull request | No |

To configure the trigger, you provide the task a personal access token (PAT) to set the webhook in the GitHub or Azure DevOps repo.

Learn how to trigger builds on source code commit in the second ACR Tasks tutorial, [Automate container image builds with Azure Container Registry Tasks](container-registry-tutorial-build-task.md).

## Automate OS and framework patching

The power of ACR Tasks to truly enhance your container build workflow comes from its ability to detect an update to a base image. When the updated base image is pushed to your registry, or a base image is updated in a public repo such as in Docker Hub, ACR Tasks can automatically build any application images based on it.

Container images can be broadly categorized into *base* images and *application* images. Your base images typically include the operating system and application frameworks upon which your application is built, along with other customizations. These base images are themselves typically based on public upstream images, for example: [Alpine Linux][base-alpine], [Windows][base-windows], [.NET][base-dotnet], or [Node.js][base-node]. Several of your application images might share a common base image.

When an OS or app framework image is updated by the upstream maintainer, for example with a critical OS security patch, you must also update your base images to include the critical fix. Each application image must then also be rebuilt to include these upstream fixes now included in your base image.

Because ACR Tasks dynamically discovers base image dependencies when it builds a container image, it can detect when an application image's base image is updated. With one preconfigured [build task](container-registry-tutorial-base-image-update.md#create-a-task), ACR Tasks then **automatically rebuilds every application image** for you. With this automatic detection and rebuilding, ACR Tasks saves you the time and effort normally required to manually track and update each and every application image referencing your updated base image.

For image builds from a Dockerfile, an ACR task tracks a base image update when the base image is in one of the following locations:

* The same Azure container registry where the task runs
* Another Azure container registry in the same region 
* A public repo in Docker Hub
* A public repo in Microsoft Container Registry

> [!NOTE]
> * The base image update trigger is enabled by default in an ACR task. 
> * Currently, ACR Tasks only tracks base image updates for application (*runtime*) images. ACR Tasks doesn't track base image updates for intermediate (*buildtime*) images used in multi-stage Dockerfiles. 

Learn more about OS and framework patching in the third ACR Tasks tutorial, [Automate image builds on base image update with Azure Container Registry Tasks](container-registry-tutorial-base-image-update.md).

## Schedule a task

Optionally schedule a task by setting up one or more *timer triggers* when you create or update the task. Scheduling a task is useful for running container workloads on a defined schedule, or running maintenance operations or tests on images pushed regularly to your registry. For details, see [Run an ACR task on a defined schedule](container-registry-tasks-scheduled.md).

## Multi-step tasks

Multi-step tasks provide step-based task definition and execution for building, testing, and patching container images in the cloud. Task steps defined in a [YAML file](container-registry-tasks-reference-yaml.md) specify individual build and push operations for container images or other artifacts. They can also define the execution of one or more containers, with each step using the container as its execution environment.

For example, you can create a multi-step task that automates the following:

1. Build a web application image
1. Run the web application container
1. Build a web application test image
1. Run the web application test container, which performs tests against the running application container
1. If the tests pass, build a Helm chart archive package
1. Perform a `helm upgrade` using the new Helm chart archive package

Multi-step tasks enable you to split the building, running, and testing of an image into more composable steps, with inter-step dependency support. With multi-step tasks in ACR Tasks, you have more granular control over image building, testing, and OS and framework patching workflows.

Learn about multi-step tasks in [Run multi-step build, test, and patch tasks in ACR Tasks](container-registry-tasks-multi-step.md).

## Context locations

The following table shows a few examples of supported context locations for ACR Tasks:

| Context location | Description | Example |
| ---------------- | ----------- | ------- |
| Local filesystem | Files within a directory on the local filesystem. | `/home/user/projects/myapp` |
| GitHub master branch | Files within the master (or other default) branch of a GitHub repository.  | `https://github.com/gituser/myapp-repo.git` |
| GitHub branch | Specific branch of a GitHub repo.| `https://github.com/gituser/myapp-repo.git#mybranch` |
| GitHub subfolder | Files within a subfolder in a GitHub repo. Example shows combination of a branch and subfolder specification. | `https://github.com/gituser/myapp-repo.git#mybranch:myfolder` |
| Remote tarball | Files in a compressed archive on a remote webserver. | `http://remoteserver/myapp.tar.gz` |

## Image platforms

By default, ACR Tasks builds images for the Linux OS and the amd64 architecture. Specify the `--platform` tag to build Windows images or Linux images for other architectures. Specify the OS and optionally a supported architecture in OS/architecture format (for example, `--platform Linux/arm`). For ARM architectures, optionally specify a variant in OS/architecture/variant format (for example, `--platform Linux/arm64/v8`):

| OS | Architecture|
| --- | ------- | 
| Linux | amd64<br/>arm<br/>arm64<br/>386 |
| Windows | amd64 |

## View task logs

Each task run generates log output that you can inspect to determine whether the task steps ran successfully. If you use the [az acr build](/cli/azure/acr#az-acr-build), [az acr run](/cli/azure/acr#az-acr-run), or [az acr task run](/cli/azure/acr/task#az-acr-task-run) command to trigger the task, log output for the task run is streamed to the console and also stored for later retrieval. When a task is automatically triggered, for example by a source code commit or a base image update, task logs are only stored. View the logs for a task run in the Azure portal, or use the [az acr task logs](/cli/azure/acr/task#az-acr-task-logs) command.

By default, data and logs for task runs in a registry are retained for 30 days and then automatically purged. If you want to archive the data for a task run, enable archiving using the [az acr task update-run](/cli/azure/acr/task#az-acr-task-update-run) command. The following example enables archiving for the task run *cf11* in registry *myregistry*.

```azurecli
az acr task update-run --registry myregistry --run-id cf11 --no-archive false
```

## Next steps

When you're ready to automate container image builds and maintenance in the cloud, check out the [ACR Tasks tutorial series](container-registry-tutorial-quick-task.md).

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
[az-acr-pack-build]: /cli/azure/acr/pack#az-acr-pack-build
[az-acr-task]: /cli/azure/acr/task
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-login]: /cli/azure/reference-index#az-login
[az-login-service-principal]: /cli/azure/authenticate-azure-cli

<!-- IMAGES -->
[quick-build-01-fork]: ./media/container-registry-tutorial-quick-build/quick-build-01-fork.png
[quick-build-02-browser]: ./media/container-registry-tutorial-quick-build/quick-build-02-browser.png
