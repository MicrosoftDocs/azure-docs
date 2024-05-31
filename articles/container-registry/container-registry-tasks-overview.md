---
title: Overview of Azure Container Registry tasks
description: Learn about Azure Container Registry tasks, a suite of features that provide automated building, management, and patching of container images in the cloud.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 01/24/2024
ms.service: container-registry
---

# Automate container image builds and maintenance with Azure Container Registry tasks

Containers provide new levels of virtualization by isolating application and developer dependencies from infrastructure and operational requirements. What remains is the need to address how this application virtualization is managed and patched over the container lifecycle.

Azure Container Registry tasks are a suite of features that:

- Provide cloud-based container image building for [platforms](#image-platforms) like Linux, Windows, and ARM.
- Extend the early parts of an application development cycle to the cloud with on-demand container image builds.
- Enable automated builds triggered by source code updates, updates to a container's base image, or timers.

For example, with triggers for updates to a base image, you can automate [OS and framework patching](#automate-os-and-framework-patching) for your Docker containers. These triggers can help you maintain secure environments while adhering to the principles of immutable containers.

> [!IMPORTANT]
> Azure Container Registry task runs are temporarily paused from Azure free credits. This pause might affect existing task runs. If you encounter problems, open a [support case](../azure-portal/supportability/how-to-create-azure-support-request.md) for our team to provide additional guidance.

> [!WARNING]
> Any information that you provide on the command line or as part of a URI might be logged as part of Azure Container Registry diagnostic tracing. This information includes sensitive data such as credentials and GitHub personal access tokens. Exercise caution to prevent any potential security risks. Don't include sensitive details on command lines or URIs that are subject to diagnostic logging.

## Task scenarios

Azure Container Registry tasks support several scenarios to build and maintain container images and other artifacts. This article describes [quick tasks](#quick-tasks), [automatically triggered tasks](#automatically-triggered-tasks), and [multi-step tasks](#multi-step-tasks).

Each task has an associated [source code context](#context-locations), which is the location of source files that are used to build a container image or other artifact. Example contexts include a Git repository and a local file system.

Tasks can also take advantage of [run variables](container-registry-tasks-reference-yaml.md#run-variables), so you can reuse task definitions and standardize tags for images and artifacts.

## Quick tasks

The *inner-loop* development cycle is the iterative process of writing code, building, and testing your application before committing to source control. It's really the beginning of container lifecycle management.

The *quick task* feature in Azure Container Registry tasks can provide an integrated development experience by offloading your container image builds to Azure. You can build and push a single container image to a container registry on demand, in Azure, without needing a local Docker Engine installation. Think `docker build`, `docker push` in the cloud. With quick tasks, you can verify your automated build definitions and catch potential problems before committing your code.

By using the familiar `docker build` format, the [az acr build][az-acr-build] command in the Azure CLI takes a [context](#context-locations). The command then sends the context to Azure Container Registry and (by default) pushes the built image to its registry upon completion.

Azure Container Registry tasks are designed as a container lifecycle primitive. For example, you can integrate Azure Container Registry tasks into your continuous integration and continuous delivery (CI/CD) solution. If you run [az login][az-login] with a [service principal][az-login-service-principal], your CI/CD solution can then issue [az acr build][az-acr-build] commands to start image builds.

To learn how to use quick tasks, see the [quickstart](container-registry-quickstart-task-cli.md) and [tutorial](container-registry-tutorial-quick-task.md) for building and deploying container images by using Azure Container Registry tasks.

> [!TIP]
> If you want to build and push an image directly from source code, without a Dockerfile, Azure Container Registry provides the [az acr pack build][az-acr-pack-build] command (preview). This tool builds and pushes an image from application source code by using [Cloud Native Buildpacks](https://buildpacks.io/).

## Automatically triggered tasks

Enable one or more *triggers* to build an image.

### Trigger a task on a source code update

You can trigger a container image build or multi-step task when code is committed, or a pull request is made or updated, to a public or private Git repository in GitHub or Azure DevOps. For example, configure a build task with the Azure CLI command [az acr task create][az-acr-task-create] by specifying a Git repository and optionally a branch and Dockerfile. When your team updates code in the repository, a webhook created in Azure Container Registry tasks triggers a build of the container image defined in the repo.

Azure Container Registry tasks support the following triggers when you set a Git repo as a task's context:

| Trigger | Enabled by default |
| ------- | ------------------ |
| Commit | Yes |
| Pull request | No |

> [!NOTE]
> Currently, Azure Container Registry tasks don't support commit or pull-request triggers in GitHub Enterprise repos.

To learn how to trigger builds on source code commits, see [Automate container image builds with Azure Container Registry tasks](container-registry-tutorial-build-task.md).

#### Personal access token

To configure a trigger for source code updates, you need to provide the task a personal access token to set the webhook in the public or private GitHub or Azure DevOps repo. Required scopes for the personal access token are as follows:

| Repo type |GitHub  |Azure DevOps  |
|---------|---------|---------|
|Public repo    | repo:status<br/>public_repo        | Code (Read)        |
|Private repo   | repo (Full control)    | Code (Read)      |

To create a personal access token, see the [GitHub](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) or [Azure DevOps](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate) documentation.

### Automate OS and framework patching

The power of Azure Container Registry tasks to enhance your container build workflow comes from their ability to detect an update to a *base image*. A base image is a feature of most container images. It's a parent image on which one or more application images are based. Base images typically contain the operating system and sometimes application frameworks.

You can set up an Azure Container Registry task to track a dependency on a base image when it builds an application image. When the updated base image is pushed to your registry, or a base image is updated in a public repo such as in Docker Hub, Azure Container Registry tasks can automatically build any application images based on it. With this automatic detection and rebuilding, Azure Container Registry tasks save you the time and effort that's normally required to manually track and update every application image that references your updated base image.

For more information, see [About base image updates for Azure Container Registry tasks](container-registry-tasks-base-images.md) and [Tutorial: Automate container image builds when a base image is updated in an Azure container registry](container-registry-tutorial-base-image-update.md).

### Schedule a task

You can schedule a task by setting up one or more *timer triggers* when you create or update the task. Scheduling a task is useful for running container workloads on a defined schedule, or running maintenance operations or tests on images pushed regularly to your registry. For more information, see [Run an Azure Container Registry task on a defined schedule](container-registry-tasks-scheduled.md).

## Multi-step tasks

Extend the single-image build-and-push capability of Azure Container Registry tasks with multi-step workflows that are based on multiple containers.

Multi-step tasks provide step-based task definition and execution for building, testing, and patching container images in the cloud. Task steps defined in a [YAML file](container-registry-tasks-reference-yaml.md) specify individual build and push operations for container images or other artifacts. They can also define the execution of one or more containers, with each step using the container as its execution environment.

For example, you can create a multi-step task that automates the following steps:

1. Build a web application image.
1. Run the web application container.
1. Build a web application test image.
1. Run the web application test container, which performs tests against the running application container.
1. If the tests pass, build a Helm chart archive package.
1. Perform a `helm upgrade` task by using the new Helm chart archive package.

Multi-step tasks enable you to split the building, running, and testing of an image into more composable steps, with dependency support between steps. With multi-step tasks in Azure Container Registry tasks, you have more granular control over workflows for image building, testing, and OS and framework patching.

[Learn more about running multi-step build, test, and patch tasks in Azure Container Registry tasks](container-registry-tasks-multi-step.md).

## Context locations

The following table shows examples of supported context locations for Azure Container Registry tasks:

| Context location | Description | Example |
| ---------------- | ----------- | ------- |
| Local file system | Files within a directory on the local file system. | `/home/user/projects/myapp` |
| GitHub main branch | Files within the main (or other default) branch of a public or private GitHub repository.  | `https://github.com/gituser/myapp-repo.git` |
| GitHub branch | Specific branch of a public or private GitHub repo.| `https://github.com/gituser/myapp-repo.git#mybranch` |
| GitHub subfolder | Files within a subfolder in a public or private GitHub repo. The example shows combination of a branch and subfolder specification. | `https://github.com/gituser/myapp-repo.git#mybranch:myfolder` |
| GitHub commit | Specific commit in a public or private GitHub repo. The example shows combination of a commit hash (SHA) and subfolder specification. | `https://github.com/gituser/myapp-repo.git#git-commit-hash:myfolder` |
| Azure DevOps subfolder | Files within a subfolder in a public or private Azure repo. The example shows combination of branch and subfolder specification. | `https://dev.azure.com/user/myproject/_git/myapp-repo#mybranch:myfolder` |
| Remote tarball | Files in a compressed archive on a remote web server. | `http://remoteserver/myapp.tar.gz` |
| Artifact in container registry | [OCI artifact](container-registry-manage-artifact.md) files in a container registry repository. | `oci://myregistry.azurecr.io/myartifact:mytag` |

> [!NOTE]
> When you're using a Git repo as a context for a task that's triggered by a source code update, you need to provide a [personal access token](#personal-access-token).

## Image platforms

By default, Azure Container Registry tasks build images for the Linux OS and the AMD64 architecture. Specify the `--platform` tag to build Windows images or Linux images for other architectures. Specify the OS and optionally a supported architecture in *OS/architecture* format (for example, `--platform Linux/arm`). For ARM architectures, optionally specify a variant in *OS/architecture/variant* format (for example, `--platform Linux/arm64/v8`).

| OS | Architecture|
| --- | ------- |
| Linux | AMD64<br/>ARM<br/>ARM64<br/>386 |
| Windows | AMD64 |

## Task output

Each task run generates log output that you can inspect to determine whether the task steps ran successfully. When you trigger a task manually, log output for the task run is streamed to the console and stored for later retrieval. When a task is triggered automatically (for example, by a source code commit or a base image update), task logs are only stored. View the run logs in the Azure portal, or use the [az acr task logs](/cli/azure/acr/task#az-acr-task-logs) command.

[Learn more about viewing and managing task logs](container-registry-tasks-logs.md).

## Related content

- When you're ready to automate container image builds and maintenance in the cloud, see [Tutorial: Build and deploy container images in the cloud with Azure Container Registry tasks](container-registry-tutorial-quick-task.md).

- Optionally, learn about the [Docker extension](https://code.visualstudio.com/docs/azure/docker) and the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) for Visual Studio Code. You can use these extensions to pull images from a container registry, push images to a container registry, or run Azure Container Registry tasks, all within Visual Studio Code.

<!-- LINKS - Internal -->
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-acr-pack-build]: /cli/azure/acr/pack#az-acr-pack-build
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-login]: /cli/azure/reference-index#az-login
[az-login-service-principal]: /cli/azure/authenticate-azure-cli
