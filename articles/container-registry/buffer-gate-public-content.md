---
title: How to manage public content in private registry
description: ....
ms.topic: article
ms.date: 10/27/2020
---


# Manage public content with Azure Container Registry

An [Azure container registry](container-registry-overview.md) hosts your container images and other artifacts in a private, authenticated Azure environment. Although managed by you, your registry content may have dependencies on content from public container registries. For example, you might build and store application images based on public OS images originating in Docker Hub, Microsoft Container Registry, or another public registry.  

Without proper controls, having dependencies on public registry content can introduce risks to your image development and deployment workfows. A security update to a base image could inadvertently break a production workload, or an internet outage could prevent a build system from pulling a public base image. For more background, see the [Open Container Initiative blog](https://opencontainers.org/posts/blog/2020-10-30-consuming-public-content/). 

This article is an overview of practices and workflows to manage dependencies on public content, by keeping and maintaining local copies of public image content in your Azure container registry.

* Authenticate with Docker Hub
* Import public images 
* Maintain separate registries for base images 
* Use [ACR Tasks](container-registry-tasks-overview.md) to automatically retrieve and validate base image updates
* Use ACR Tasks to automatically rebuild and push updated application images that depend on base image updates
 
While this article refers mainly to Docker images, the concepts apply to other supported [registry content](container-registry-image-formats.md) such as Helm charts and other artifacts.

## Authenticate with Docker Hub

If you pull public images from Docker Hub to an Azure container registry or another private registry, we recommend that you authenticate using a Docker Hub account instead of making an anonymous pull request. As of November 1, 2020, download rate limits apply to anonymous and authenticated requests from Docker Free Plan accounts and are enforced by IP address. Permitted download rates are higher for authenticated requests, and downloads are unlimited for authenticated requests using paid accounts. For details, see [Docker pricing and subscriptions](https://www.docker.com/pricing) and the [Docker Terms of Service](https://www.docker.com/legal/docker-terms-service).

For example, if you use [Docker Engine](https://docs.docker.com/engine/) to pull images, authenticate interactively using the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command in the Docker CLI. When prompted, provide your Docker username and password.

```bash
docker login
```

For other authentication examples and scenarios, see [Download rate limit](https://docs.docker.com/docker-hub/download-rate-limit/).

### Docker Hub access token

Docker Hub supports [personal access tokens](https://docs.docker.com/docker-hub/access-tokens/) as alternatives to your Docker password when authenticating to Docker Hub. Tokens are recommended for automated services that pull images from Docker Hub. You can generate multiple tokens for different users or services, and revoke tokens when no longer needed.

To use `docker login` to authenticate, omit the password on the command line. When prompted for a password, enter your token instead. If you enabled two-factor authentication for your Docker Hub account, you must use a personal access token when logging in from the Docker CLI.

## Import images
 
As a recommended first step, [import](container-registry-import-images.md) base images and other public content to your Azure container registry. The [az acr import](/cli/azure/acr#az_acr_import) command supports image import from public registries such as Docker Hub and Microsoft Container Registry, as well as other private Azure container registries. 

Image import to your registry doesn't need or use a local Docker installation, so you can import images of any OS type and multi-architecture images. However, when importing from Docker Hub, we recommend that you provide credentials for your Docker Hub account, to avoid download rate limits that apply to anonymous pull requests. For example:

```azurecli
az acr import \
  --name myregistry \
  --source docker.io/library/hello-world:latest \
  --image hello-world:latest
  --username <Docker Hub username>
  --password <Docker Hub password>
```
 
When importing images, consider the geographic location of your image deployments, and bring content to a registry in a nearby Azure region. Import to a [geo-replicated](container-registry-geo-replication.md) registry when you need to support deployments in multiple regions.

## Maintain base images in separate registry
 
Regardless of the size of your organization, we recommend a separate registry (or registries) to manage base images. This arrangement decouples the management of base images from consumption by developers, build systems, or downstream deployments. While it's possible to share a single registry with multiple development teams, different teams might have different requirements for specific images or registry capabilities such as [virtual network access](container-registry-private-link.md) or [geo-replication](container-registry-geo-replication.md).

## Automate base image updates

Expanding on image import, use [ACR Tasks](container-registry-tasks-overview.md) to maintain base images in a private registry and introduce base image updates using a controlled verification process. ACR Tasks is a suite of features to build, run, push, and patch container images in Azure, either manually or in response to certain triggers. For example, you can create a task to build a local image that mirrors a base image in a public registry, and the task automatically detects the dependency on the public image. When a [base image update](container-registry-tasks-base-images.md) occurs in the public source, the task can trigger an image rebuild and repush to the private registry. 

Using a [multi-step task](container-registry-tasks-multi-step.md) defined in a YAML file, you can gate the import of an updated base image to your private registry by validating that the upstream changes are appropriate for your environment. For example, you could create a task to carry out these steps:

* Build a local test image that mirrors the updated public image, adding a functional test script
* Run the test container, gathering test outputs such as vulnerability scan results
* If the image tests successfully, import the public image to the base images registry

> [!NOTE]
> To trigger a task based on a base image update, the base image must have a stable tag, such as `node:9-alpine`. A stable tag is recommended for a base image that can be updated with OS and framework patches to a latest stable release. For details, see [Recommendations for tagging and versioning container images](container-registry-image-tag-version.md).

## Automate application image rebuilds

[To be written]
 

Using ACR Tasks, tracking base image updates in the base reg repo:
 
Concepts: container-registry-tasks-base-images.md
 
Walkthroughs: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-base-image-update (base in same reg)
https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-private-base-image-update (base in separate reg)


## Next steps
 
See Steve's E2E scenario

https://github.com/SteveLasker/azure-docs/blob/consuming-public-content/articles/container-registry/container-registry-consuming-public-content.md
 
https://github.com/SteveLasker/Presentations/tree/master/demo-scripts/buffering-building-patching




========

Scratch


 
Support your build and deployment workflows from unintentional image updates.
 
https://docs.microsoft.com/en-us/azure/container-registry/container-registry-image-lock
 
* Lock repo from new content
* Block pulls or deletes
 

 


 and your might host copies of certain public images for your organization's deployments.

Dependencies on public content can introduce numerous risks to your organization
 
[Intro] Main message is: Use ACR to keep local copies of all artifacts that organization depends on for development and deployments.
 
Example: Companies should never base their FROM statements on external registries
 
Should mitigate Docker TOS changes but also a best practice
