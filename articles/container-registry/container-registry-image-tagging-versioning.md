---
title: Tag and version images in Azure Container Registry
description: Best practices for tagging and versioning Docker container images
services: container-registry
author: stevelasker

ms.service: container-registry
ms.topic: article
ms.date: 06/27/2019
ms.author: steve.lasker
---

# Best practices for tagging and versioning container images

When developing or deploying container images or using a container registry, you need a strategy for tagging and versioning your container images and related artifacts.

## Stable tags

*Stable tags* mean a developer, or a build system, can continue to pull a specific tag, which continues to get updates. Stable doesn’t mean the contents are frozen. Rather, stable implies the image should be stable for the intent of that version. To stay “stable”, it might be serviced to apply OS patches or framework updates.

**Recommendation**: Use stable tags to build base images. Avoid deployments with stable tags, because those tags continue to receive updates and cause inconsistencies in production environments.


### Example

A framework team ships version 1.0. They know they’ll ship updates, including minor updates. To support stable tags for a given major and minor version, they have two sets of stable tags.

* `:1` – a stable tag for the major version. `1` represents the “newest” or “latest” 1.* version.
* `:1.0`- a stable tag for version 1.0, allowing a developer to bind to updates of 1.0, and not be rolled forward to 1.1 when it is released.

The team also uses the `:latest` tag, which points to the latest stable tag, no matter what the current major version is.

As base image updates are available, or any type of servicing release of the framework, the stable tags are updated to the newest digest that represents the most current stable release of that version.

In this case, both the major and minor tags are continually being serviced. From a base image scenario, this allows the image owner to provide serviced images.

## Unique tags

Unique tagging simply means that every image pushed to a registry has a unique tag. Tags are not reused.

**Recommendation**: Use unique tags for deployments, especially in an orchestrated environment that scales service instances on multiple nodes. You likely want deliberate deployments of a consistent version of components. Your hosts won’t accidentally pull a newer version, inconsistent with the other nodes.

### Values for unique tags

There are a number of options, each with advantages and disadvantages.

* **Date-time stamp** - This approach is fairly common, since you can clearly tell when the image was built. But, how do correlate it back to your build system? Do you have to find the build that was completed at the same time? What time zone are you in? Are all your build systems calibrated to UTC?
* **Git commit**  – This approach works until you start supporting base image updates. If a base image update happens, your build system  kicks off with the same Git commit as the previous build. However, the base image has new content. Using a Git commit provides a *semi*-stable tag.
* **Manifest digest** - Each container image pushed to a container registry is associated with a manifest, identified by a unique SHA-256 hash, or digest. While unique, the digest is long, difficult to read, and uncorrelated with your build environment.
* **Build ID** - This option is closest to the best as it's likely incremental, and it allows you to correlate back to the specific build to find all the artifacts and logs. However, like a manifest digest, it might be difficult for a human to read.

If your organization has several build systems, prefixing the tag with the build system name is a variation on this option: `<build-system>-<build-id>`. For example, you could differentiate builds from the API team’s Jenkins build system and the web team's Azure Pipelines build system.

## Next steps

For a more detailed discussion of the concepts in this article, see the blog post [Docker Tagging: Best practices for tagging and versioning docker images](https://stevelasker.blog/2018/03/01/docker-tagging-best-practices-for-tagging-and-versioning-docker-images/).

To help maximize the performance and cost-effective use of your Azure container registry, see also [Best practices for Azure Container Registry](container-registry-best-practices.md).

<!-- IMAGES -->


<!-- LINKS - Internal -->

