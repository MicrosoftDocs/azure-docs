---
title: Base image updates - Tasks
description: Learn about base images for application container images, and about how a base image update can trigger an Azure Container Registry task.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# About base image updates for ACR Tasks

This article provides background information about updates to an application's base image and how these updates can trigger an Azure Container Registry task.

## What are base images?

Dockerfiles defining most container images specify a parent image from which the image is based, often referred to as its *base image*. Base images typically contain the operating system, for example [Alpine Linux][base-alpine] or [Windows Nano Server][base-windows], on which the rest of the container's layers are applied. They might also include application frameworks such as [Node.js][base-node] or [.NET Core][base-dotnet]. These base images are themselves typically based on public upstream images. Several of your application images might share a common base image.

A base image is often updated by the image maintainer to include new features or improvements to the OS or framework in the image. Security patches are another common cause for a base image update. When these upstream updates occur, you must also update your base images to include the critical fix. Each application image must then also be rebuilt to include these upstream fixes now included in your base image.

In some cases, such as a private development team, a base image might specify more than OS or framework. For example, a base image could be a shared service component image that needs to be tracked. Members of a team might need to track this base image for testing, or need to regularly update the image when developing application images.

## Maintain copies of base images

For any content in your registries that depends on base content maintained in a public registry such as Docker Hub, we recommend that you copy the content to an Azure container registry or another private registry. Then, ensure that you build your application images by referencing the private base images. Azure Container Registry provides an [image import](container-registry-import-images.md) capability to easily copy content from public registries or other Azure container registries. The next section describes using ACR Tasks to track base image updates when building application updates. You can track base image updates in your own Azure container registries and optionally in upstream public registries.

## Track base image updates

ACR Tasks includes the ability to automatically build images for you when a container's base image is updated. You can use this ability to maintain and update copies of public base images in your Azure container registries, and then to rebuild application images that depend on base images.

ACR Tasks dynamically discovers base image dependencies when it builds a container image. As a result, it can detect when an application image's base image is updated. With one preconfigured build task, ACR Tasks can automatically rebuild every application image that references the base image. With this automatic detection and rebuilding, ACR Tasks saves you the time and effort normally required to manually track and update each and every application image referencing your updated base image.

## Base image locations

For image builds from a Dockerfile, an ACR task detects dependencies on base images in the following locations:

* The same Azure container registry where the task runs
* Another private Azure container registry in the same or a different region 
* A public repo in Docker Hub 
* A public repo in Microsoft Container Registry

If the base image specified in the `FROM` statement resides in one of these locations, the ACR task adds a hook to ensure the image is rebuilt anytime its base is updated.

## Base image notifications

The time between when a base image is updated and when the dependent task is triggered depends on the base image location:

* **Base images from a public repo in Docker Hub or MCR** - For base images in public repositories, an ACR task checks for image updates at a random interval of between 10 and 60 minutes. Dependent tasks are run accordingly.
* **Base images from an Azure container registry** - For base images in Azure container registries, an ACR task immediately triggers a run when its base image is updated. The base image may be in the same ACR where the task runs or in a different ACR in any region.

## Additional considerations

* **Base images for application images** - Currently, an ACR task only tracks base image updates for application (*runtime*) images. It doesn't track base image updates for intermediate (*buildtime*) images used in multi-stage Dockerfiles.  

* **Enabled by default** - When you create an ACR task with the [az acr task create][az-acr-task-create] command, by default the task is *enabled* for trigger by a base image update. That is, the `base-image-trigger-enabled` property is set to True. If you want to disable this behavior in a task, update the property to False. For example, run the following [az acr task update][az-acr-task-update] command:

  ```azurecli
  az acr task update --registry myregistry --name mytask --base-image-trigger-enabled False
  ```

* **Trigger to track dependencies** - To enable an ACR task to determine and track a container image's dependencies -- which include its base image -- you must first trigger the task to build the image **at least once**. For example, trigger the task manually using the [az acr task run][az-acr-task-run] command.

* **Stable tag for base image** - To trigger a task on base image update, the base image must have a *stable* tag, such as `node:9-alpine`. This tagging is typical for a base image that is updated with OS and framework patches to a latest stable release. If the base image is updated with a new version tag, it does not trigger a task. For more information about image tagging, see the [best practices guidance](container-registry-image-tag-version.md). 

* **Other task triggers** - In a task triggered by base image updates, you can also enable triggers based on [source code commit](container-registry-tutorial-build-task.md) or [a schedule](container-registry-tasks-scheduled.md). A base image update can also trigger a [multi-step task](container-registry-tasks-multi-step.md).

## Next steps

See the following tutorials for scenarios to automate application image builds after a base image is updated:

* [Automate container image builds when a base image is updated in the same registry](container-registry-tutorial-base-image-update.md)

* [Automate container image builds when a base image is updated in a different registry](container-registry-tutorial-private-base-image-update.md)


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
[az-acr-task-run]: /cli/azure/acr/task#az-acr-task-run
[az-acr-task-update]: /cli/azure/acr/task#az-acr-task-update
[az-login]: /cli/azure/reference-index#az-login
[az-login-service-principal]: /cli/azure/authenticate-azure-cli

<!-- IMAGES -->
[quick-build-01-fork]: ./media/container-registry-tutorial-quick-build/quick-build-01-fork.png
[quick-build-02-browser]: ./media/container-registry-tutorial-quick-build/quick-build-02-browser.png
