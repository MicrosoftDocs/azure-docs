---
title: Manage public content in private container registry
description: Practices and workflows in Azure Container Registry to manage dependencies on public images from Docker Hub and other public content
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Manage public content with Azure Container Registry

This article is an overview of practices and workflows to use a local registry such as an [Azure container registry](container-registry-intro.md) to maintain copies of public content, such as container images in Docker Hub. 


## Risks with public content

Your environment may have dependencies on public content such as public container images, [Helm charts](https://helm.sh/), [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) policies, or other artifacts. For example, you might run [nginx](https://hub.docker.com/_/nginx) for service routing or `docker build FROM alpine` by pulling images directly from Docker Hub or another public registry. 

Without proper controls, having dependencies on public registry content can introduce risks to your image development and deployment workflows. To mitigate the risks, keep local copies of public content when possible. For details, see the [Open Container Initiative blog](https://opencontainers.org/posts/blog/2020-10-30-consuming-public-content/). 

## Authenticate with Docker Hub

As a first step, if you currently pull public images from Docker Hub as part of a build or deployment workflow, we recommend that you [authenticate using a Docker Hub account](https://docs.docker.com/docker-hub/download-rate-limit/#how-do-i-authenticate-pull-requests) instead of making an anonymous pull request.

When making frequent anonymous pull requests you might see Docker errors similar to `ERROR: toomanyrequests: Too Many Requests.` or `You have reached your pull rate limit.` Authenticate to Docker Hub to prevent these errors.

> [!NOTE]
> Effective November 2, 2020, [download rate limits](https://docs.docker.com/docker-hub/download-rate-limit) apply to anonymous and authenticated requests to Docker Hub from Docker Free Plan accounts and are enforced by IP address and Docker ID, respectively. 
>
> When estimating your number of pull requests, take into account that when using cloud provider services or working behind a corporate NAT, multiple users will be presented to Docker Hub in aggregate as a subset of IP addresses. Adding Docker paid account authentication to requests made to Docker Hub will avoid potential service disruptions due to rate-limit throttling.
>
> For details, see [Docker pricing and subscriptions](https://www.docker.com/pricing) and the [Docker Terms of Service](https://www.docker.com/legal/docker-terms-service).

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

# [Azure CLI](#tab/azure-cli)

As a recommended one-time step, [import](container-registry-import-images.md) base images and other public content to your Azure container registry. The [az acr import](/cli/azure/acr#az-acr-import) command in the Azure CLI supports image import from public registries such as Docker Hub and Microsoft Container Registry and from other private container registries. 

`az acr import` doesn't require a local Docker installation. You can run it with a local installation of the Azure CLI or directly in Azure Cloud Shell. It supports images of any OS type, multi-architecture images, or OCI artifacts such as Helm charts.

Depending on your organization's needs, you can import to a dedicated registry or a repository in a shared registry.

```azurecli-interactive
az acr import \
  --name myregistry \
  --source docker.io/library/hello-world:latest \
  --image hello-world:latest \
  --username <Docker Hub username> \
  --password <Docker Hub token>
```

# [Azure PowerShell](#tab/azure-powershell)

As a recommended one-time step, [import](container-registry-import-images.md) base images and other public content to your Azure container registry. The [Import-AzContainerRegistryImage](/powershell/module/az.containerregistry/import-azcontainerregistryimage) command in the Azure PowerShell supports image import from public registries such as Docker Hub and Microsoft Container Registry and from other private container registries. 

`Import-AzContainerRegistryImage` doesn't require a local Docker installation. You can run it with a local installation of the Azure PowerShell or directly in Azure Cloud Shell. It supports images of any OS type, multi-architecture images, or OCI artifacts such as Helm charts.

Depending on your organization's needs, you can import to a dedicated registry or a repository in a shared registry.

```azurepowershell-interactive
$Params = @{
   SourceImage       = 'library/busybox:latest' 
   ResourceGroupName = $resourceGroupName 
   RegistryName      = $RegistryName 
   SourceRegistryUri = 'docker.io'
   TargetTag         = 'busybox:latest'
}
Import-AzContainerRegistryImage @Params
```

Credentials are required if the source registry is not available publicly or the admin user is disabled.

---

## Update image references

Developers of application images should ensure that their code references local content under their control.

* Update image references to use the private registry. For example, update a `FROM baseimage:v1` statement in a Dockerfile to `FROM myregistry.azurecr.io/mybaseimage:v1`
* Configure credentials or an authentication mechanism to use the private registry. The exact mechanism depends on the tools you use to access the registry and how you manage user access.
    * If you use a Kubernetes cluster or Azure Kubernetes Service to access the registry, see the [authentication scenarios](authenticate-kubernetes-options.md).
    * Learn more about [options to authenticate](container-registry-authentication.md) with an Azure container registry.

## Automate application image updates

Expanding on image import, set up an [Azure Container Registry task](container-registry-tasks-overview.md) to automate application image builds when base images are updated. An automated build task can track both [base image updates](container-registry-tasks-base-images.md) and [source code updates](container-registry-tasks-overview.md#trigger-task-on-source-code-update).

For a detailed example, see [How to consume and maintain public content with Azure Container Registry Tasks](tasks-consume-public-content.md). 

> [!NOTE]
> A single preconfigured task can automatically rebuild every application image that references a dependent base image. 
 
## Next steps
* Learn more about [ACR Tasks](container-registry-tasks-overview.md) to build, run, push, and patch container images in Azure.
* See [How to consume and maintain public content with Azure Container Registry Tasks](tasks-consume-public-content.md) for an automated gating workflow to update base images to your environment. 
* See the [ACR Tasks tutorials](container-registry-tutorial-quick-task.md) for more examples to automate image builds and updates.
