---
title: Manage public content in private container registry
description: Practices and workflows in Azure Container Registry to manage dependencies on public images from Docker Hub and other public content
ms.topic: article
ms.date: 10/27/2020
---


# Manage public content with Azure Container Registry

An [Azure container registry](container-registry-overview.md) hosts your container images and other artifacts in a private, authenticated Azure environment. However, your environment may have dependencies on public content such as public container images, [Helm charts](https://helm.sh/), [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) policies, or other artifacts. For example, you might run [nginx](https://hub.docker.com/_/nginx) for service routing or `docker build FROM alpine` by pulling images directly from Docker Hub or another public registry. 

Without proper controls, having dependencies on public registry content can introduce risks to your image development and deployment workflows. Mitigating the risks involves keeping local copies of public content. For more information, see the [Open Container Initiative blog](https://opencontainers.org/posts/blog/2020-10-30-consuming-public-content/). 

This article is an overview of practices and workflows to maintain copies of public image content in an Azure container registry:

* Authenticate with Docker Hub
* Import public images 
* Maintain separate registries for base images 
* Use [ACR Tasks](container-registry-tasks-overview.md) to automatically retrieve and validate base image updates
* Use ACR Tasks to automatically rebuild application images that depend on base image updates
 
The concepts in this article apply equally to public container images and to other supported [registry content](container-registry-image-formats.md) such as Helm charts and other artifacts.

## Authenticate with Docker Hub

If you pull public images from Docker Hub, for example as part of a build or deployment workflow, we recommend that you authenticate using a Docker Hub account instead of making an anonymous pull request.

> [!NOTE]
> As of November 1, 2020, download rate limits apply to anonymous and authenticated requests to Docker Hub from Docker Free Plan accounts and are enforced by IP address. Download rate limits are higher for authenticated requests; rates are unlimited when you use an authenticated paid account. For details, see [Docker pricing and subscriptions](https://www.docker.com/pricing) and the [Docker Terms of Service](https://www.docker.com/legal/docker-terms-service).

For example, if you use [Docker Engine](https://docs.docker.com/engine/) to pull images, authenticate interactively using the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command in the Docker CLI. When prompted, provide your Docker username and password.

```bash
docker login
```

For other authentication examples and scenarios, see [Download rate limit](https://docs.docker.com/docker-hub/download-rate-limit/).

### Docker Hub access token

Docker Hub supports [personal access tokens](https://docs.docker.com/docker-hub/access-tokens/) as alternatives to a Docker password when authenticating to Docker Hub. Tokens are recommended for automated services that pull images from Docker Hub. You can generate multiple tokens for different users or services, and revoke tokens when no longer needed.

To authenticate using `docker login`, omit the password on the command line. When prompted for a password, enter the token instead. If you enabled two-factor authentication for your Docker Hub account, you must use a personal access token when logging in from the Docker CLI.

### Authenticate from Azure services

Several Azure services including App Service and Azure Container Instances support pulling images from public registries such as Docker Hub for container deployments. If you need to deploy an image from Docker Hub, we recommend configuring settings to authenticate using a Docker Hub account. Examples

**App Service** settings:

* **Image source**: Docker Hub
* **Repository access**: Private
* **Login**: Docker Hub username
* **Password**: Docker Hub password

For details, see [Docker Hub authenticated pulls on App Service](https://azure.github.io/AppService/2020/10/15/Docker-Hub-authenticated-pulls-on-App-Service.html).

**Azure Container Instances** settings:

* **Image source**: Docker Hub or other registry
* **Image type**: Private
* **Image registry login server**: docker.io
* **Image registry user name**: Docker Hub username
* **Image registry password**: Docker Hub password
* **Image**: docker.io/\<repo name\>:<tag>

Later sections of this article provide details about managing the images in a private Azure container registry instead, removing the dependency on Docker Hub. 

## Import images to an Azure container registry
 
To begin managing copies of public images, create an Azure container registry if you don't already have one. Create a registry using the [Azure CLI](container-registry-get-started-azure-cli.md), [Azure portal](container-registry-get-started-portal.md), [Azure PowerShell](container-registry-get-started-powershell.md), or other tools. 

As a recommended one-time step, [import](container-registry-import-images.md) base images and other public content to your Azure container registry. The [az acr import](/cli/azure/acr#az_acr_import) command supports image import from public registries such as Docker Hub and Microsoft Container Registry and from other private container registries. Image import to your registry doesn't need a local Docker installation, so you can import images of any OS type and also import multi-architecture images. 

To import from Docker Hub, we recommend that you provide credentials for your Docker Hub account, to avoid download rate limits that apply to anonymous pull requests. For example:

```azurecli
az acr import \
  --name myregistry \
  --source docker.io/library/hello-world:latest \
  --image hello-world:latest
  --username <Docker Hub username>
  --password <Docker Hub password>
```
 
When importing images, consider the geographic location of your image deployments and when possible choose a registry in a nearby Azure region. Import to a [geo-replicated](container-registry-geo-replication.md) registry when you need to support deployments in multiple regions.

## Maintain base images in separate registry
 
For most organizations, we recommend a dedicated registry (or registries) to manage base images, separate from a registry to host application images. This arrangement decouples the management of base images from consumption by developers, build systems, or downstream deployments. While it's possible to share a single registry with multiple development teams, different teams might have different requirements for specific images or registry capabilities such as [virtual network access](container-registry-private-link.md) or [geo-replication](container-registry-geo-replication.md).

## Automate base image updates

Expanding on image import, use [ACR Tasks](container-registry-tasks-overview.md) to detect and control base image updates in your Azure container registry. ACR Tasks is a suite of features to build, run, push, and patch container images in Azure, either manually or in response to certain triggers. 

For example, create a task to build a local image that mirrors a base image in a public registry such as Docker Hub. The task automatically detects the dependency on the image in Docker Hub. When a [base image update](container-registry-tasks-base-images.md) occurs in the public source, the update triggers an automatic image rebuild and push to the private registry. 

Using a [multi-step task](container-registry-tasks-multi-step.md) defined in a YAML file, you can gate the import of an updated base image to your private registry depending on the outcome of testing and validation steps. For example, you could create a task to carry out these steps:

* Build a local test image that mirrors the updated public image, adding a functional test script
* Run the test container, gathering test outputs such as vulnerability scan results
* If the image tests successfully, import the public image to the base images registry

> [!NOTE]
> To trigger a task on a base image update, the base image must have a stable tag, such as `node:9-alpine`. A stable tag is recommended for a base image that can be updated with OS and framework patches to a latest stable release. For details, see [Recommendations for tagging and versioning container images](container-registry-image-tag-version.md).

## Automate application image updates

Developers of application images should ensure that their dependencies on public content are migrated to a private registry and that their code references the migrated content. For example, a `Docker FROM` statement in a Dockerfile should reference an image in a private base image registry instead of a public registry. 

Similar to automating a base image update in an Azure container registry, set up an [ACR Task](container-registry-tasks-overview.md) to automate builds of application images. You can set up an automated image build task to track base image updates in your private base registry. For examples of application image build triggered by base image updates, see:

* [Tutorial: Automate container image builds when a base image is updated in an Azure container registry](container-registry-tutorial-base-image-update.md)
* [Tutorial: Automate container image builds when a base image is updated in another private container registry](container-registry-tutorial-private-base-image-update.md)

 To automate the developer workflow further, use an ACR task to:

* Track both base image updates and [source code updates](container-registry-tasks-overview.md#trigger-task-on-source-code-update)
* Use a [multi-step task](container-registry-tasks-multi-step.md) deinition to add unit or functional testing to your updated application images, or test downstream deployments.

> [!NOTE]
> A single preconfigured task can automatically rebuild every application image that references a dependent base image. With this automatic detection and rebuilding, ACR Tasks saves you the time and effort normally required to manually track and update every application image that references your updated base image.
 
## Next steps
 
* Learn more about using [ACR Tasks](container-registry-tasks-overview.md) to build, run, push, and patch container images in Azure.
* For a detailed example of using ACR tasks to import and maintain public artifacts and the applications that depend on them, see [How to consume and maintain public content with Azure Container Registry Tasks](https://github.com/SteveLasker/azure-docs/blob/consuming-public-content/articles/container-registry/container-registry-consuming-public-content.md)
