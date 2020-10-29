---
title: Manage public content in private container registry
description: Practices and workflows in Azure Container Registry to manage dependencies on public images from Docker Hub and other public content
author: dlepow
ms.topic: article
ms.author: danlep
ms.date: 10/29/2020
---

# Manage public content with Azure Container Registry

This article is an overview of practices and workflows to use a local registry such as an [Azure container registry](container-registry-intro.md) to maintain copies of public content, such as container images in Docker Hub. 


## Risks with public content

Your environment may have dependencies on public content such as public container images, [Helm charts](https://helm.sh/), [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) policies, or other artifacts. For example, you might run [nginx](https://hub.docker.com/_/nginx) for service routing or `docker build FROM alpine` by pulling images directly from Docker Hub or another public registry. 

Without proper controls, having dependencies on public registry content can introduce risks to your image development and deployment workflows. To mitigate the risks, keep local copies of public content when possible. For details, see the [Open Container Initiative blog](https://opencontainers.org/posts/blog). 

## Authenticate with Docker Hub

As a first step, if you currently pull public images from Docker Hub as part of a build or deployment workflow, we recommend that you authenticate using a Docker Hub account instead of making an anonymous pull request.

> [!NOTE]
> Effective November 2, 2020, download rate limits apply to anonymous and authenticated requests to Docker Hub from Docker Free Plan accounts and are enforced by IP address. 
>
> When estimating your number of pull requests, take into account that when using cloud provider services or working behind a corporate NAT, multiple users will be presented to Docker Hub in aggregate as a subset of IP addresses.  Adding Docker paid account authentication to requests made to Docker Hub will avoid potential service disruptions due to rate-limit throttling.
>
> For details, see [Docker pricing and subscriptions](https://www.docker.com/pricing) and the [Docker Terms of Service](https://www.docker.com/legal/docker-terms-service).



For authentication examples and scenarios, see [Download rate limit](https://docs.docker.com/docker-hub/download-rate-limit/).

### Docker Hub access token

Docker Hub supports [personal access tokens](https://docs.docker.com/docker-hub/access-tokens/) as alternatives to a Docker password when authenticating to Docker Hub. Tokens are recommended for automated services that pull images from Docker Hub. You can generate multiple tokens for different users or services, and revoke tokens when no longer needed.

To authenticate with `docker login` using a token, omit the password on the command line. When prompted for a password, enter the token instead. If you enabled two-factor authentication for your Docker Hub account, you must use a personal access token when logging in from the Docker CLI.

### Authenticate from Azure services

Several Azure services including App Service and Azure Container Instances support pulling images from public registries such as Docker Hub for container deployments. If you need to deploy an image from Docker Hub, we recommend that you configure settings to authenticate using a Docker Hub account. Examples:

**App Service**

* **Image source**: Docker Hub
* **Repository access**: Private
* **Login**: \<Docker Hub username>
* **Password**: \<Docker Hub token>

For details, see [Docker Hub authenticated pulls on App Service](https://azure.github.io/AppService/2020/10/15/Docker-Hub-authenticated-pulls-on-App-Service.html).

**Azure Container Instances**

* **Image source**: Docker Hub or other registry
* **Image type**: Private
* **Image registry login server**: docker.io
* **Image registry user name**: \<Docker Hub username>
* **Image registry password**: \<Docker Hub token>
* **Image**: docker.io/\<repo name\>:\<tag>

## Import images to an Azure container registry
 
To begin managing copies of public images, you can create an Azure container registry if you don't already have one. Create a registry using the [Azure CLI](container-registry-get-started-azure-cli.md), [Azure portal](container-registry-get-started-portal.md), [Azure PowerShell](container-registry-get-started-powershell.md), or other tools. 

As a recommended one-time step, [import](container-registry-import-images.md) base images and other public content to your Azure container registry. The [az acr import](/cli/azure/acr#az_acr_import) command supports image import from public registries such as Docker Hub and Microsoft Container Registry and from other private container registries. Image import doesn't need a local Docker installation, so you can import images of any OS type and also import multi-architecture images. 

Example:

```azurecli-interactive
az acr import \
  --name myregistry \
  --source docker.io/library/hello-world:latest \
  --image hello-world:latest \
  --username <Docker Hub username> \
  --password <Docker Hub password>
```

## Automate base image updates

Expanding on image import, use an [Azure Container Registry task](container-registry-tasks-overview.md) to detect and control base image updates in your Azure container registry. For example:

* Create a task to build a local image that mirrors a base image in a public registry such as Docker Hub. When an image update occurs in the public source, the update [triggers](container-registry-tasks-base-images.md) an automatic image rebuild and push to the private registry.
* Configure a [multi-step task](container-registry-tasks-multi-step.md) to introduce a testing gate that must be passed before importing updated base images to your private registry. 

For an end-to-end example, see [How to consume and maintain public content with Azure Container Registry Tasks](https://github.com/SteveLasker/azure-docs/blob/consuming-public-content/articles/container-registry/container-registry-consuming-public-content.md). 

## Automate application image updates

Developers of application images should ensure that their code references local content under their control. For example, a `Docker FROM` statement in a Dockerfile should reference an image in a private base image registry instead of a public registry. 

Similar to automating a base image update, set up an ACR task(container-registry-tasks-overview.md) to automate builds of application images. An automated build task can track image updates in your private base registry in addition to [source code updates](container-registry-tasks-overview.md#trigger-task-on-source-code-update).

For a detailed example, see: [Tutorial: Automate container image builds when a base image is updated in an Azure container registry](container-registry-tutorial-base-image-update.md).

> [!NOTE]
> A single preconfigured task can automatically rebuild every application image that references a dependent base image. 
 
## Next steps
 
* Learn more about using [ACR Tasks](container-registry-tasks-overview.md) to build, run, push, and patch container images in Azure.
* For a detailed example of using ACR tasks to maintain and use public artifacts, see [How to consume and maintain public content with Azure Container Registry Tasks](https://github.com/SteveLasker/azure-docs/blob/consuming-public-content/articles/container-registry/container-registry-consuming-public-content.md)
