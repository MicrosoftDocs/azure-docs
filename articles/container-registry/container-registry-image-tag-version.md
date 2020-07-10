---
title: Image tag best practices
description: Best practices for tagging and versioning Docker container images when pushing images to and pulling images from an Azure container registry
author: stevelasker
ms.topic: article
ms.date: 07/10/2019
ms.author: stevelas
---

# Recommendations for tagging and versioning container images

When pushing deploying container images to a container registry and then deploying them, you need a strategy for image tagging and versioning. This article discusses two approaches and where each fits during the container lifecycle:

* **Stable tags** - Tags that you reuse, for example, to indicate a major or minor version such as *mycontainerimage:1.0*.
* **Unique tags** - A different tag for each image you push to a registry, such as *mycontainerimage:abc123*.

## Stable tags

**Recommendation**: Use stable tags to maintain **base images** for your container builds. Avoid deployments with stable tags, because those tags continue to receive updates and can introduce inconsistencies in production environments.

*Stable tags* mean a developer, or a build system, can continue to pull a specific tag, which continues to get updates. Stable doesn’t mean the contents are frozen. Rather, stable implies the image should be stable for the intent of that version. To stay “stable”, it might be serviced to apply security patches or framework updates.

### Example

A framework team ships version 1.0. They know they’ll ship updates, including minor updates. To support stable tags for a given major and minor version, they have two sets of stable tags.

* `:1` – a stable tag for the major version. `1` represents the “newest” or “latest” 1.* version.
* `:1.0`- a stable tag for version 1.0, allowing a developer to bind to updates of 1.0, and not be rolled forward to 1.1 when it is released.

The team also uses the `:latest` tag, which points to the latest stable tag, no matter what the current major version is.

When base image updates are available, or any type of servicing release of the framework, images with the stable tags are updated to the newest digest that represents the most current stable release of that version.

In this case, both the major and minor tags are continually being serviced. From a base image scenario, this allows the image owner to provide serviced images.

### Delete untagged manifests

If an image with a stable tag is updated, the previously tagged image is untagged, resulting in an orphaned image. The previous image's manifest and unique layer data remain in the registry. To maintain your registry size, you can periodically delete untagged manifests resulting from stable image updates. For example, [auto-purge](container-registry-auto-purge.md) untagged manifests older than a specified duration, or set a [retention policy](container-registry-retention-policy.md) for untagged manifests.

## Unique tags

**Recommendation**: Use unique tags for **deployments**, especially in an environment that could scale on multiple nodes. You likely want deliberate deployments of a consistent version of components. If your container restarts or an orchestrator scales out more instances, your hosts won’t accidentally pull a newer version, inconsistent with the other nodes.

Unique tagging simply means that every image pushed to a registry has a unique tag. Tags are not reused. There are several patterns you can follow to generate unique tags, including:

* **Date-time stamp** - This approach is fairly common, since you can clearly tell when the image was built. But, how to correlate it back to your build system? Do you have to find the build that was completed at the same time? What time zone are you in? Are all your build systems calibrated to UTC?
* **Git commit**  – This approach works until you start supporting base image updates. If a base image update happens, your build system  kicks off with the same Git commit as the previous build. However, the base image has new content. In general, a Git commit provides a *semi*-stable tag.
* **Manifest digest** - Each container image pushed to a container registry is associated with a manifest, identified by a unique SHA-256 hash, or digest. While unique, the digest is long, difficult to read, and uncorrelated with your build environment.
* **Build ID** - This option may be best since it's likely incremental, and it allows you to correlate back to the specific build to find all the artifacts and logs. However, like a manifest digest, it might be difficult for a human to read.

  If your organization has several build systems, prefixing the tag with the build system name is a variation on this option: `<build-system>-<build-id>`. For example, you could differentiate builds from the API team’s Jenkins build system and the web team's Azure Pipelines build system.

### Lock deployed image tags

As a best practice, we recommend that you [lock](container-registry-image-lock.md) any deployed image tag, by setting its `write-enabled` attribute to `false`. This practice prevents you from inadvertently removing an image from the registry and possibly disrupting your deployments. You can include the locking step in your release pipeline.

Locking a deployed image still allows you to remove other, undeployed images from your registry using Azure Container Registry features to maintain your registry. For example, [auto-purge](container-registry-auto-purge.md) untagged manifests or unlocked images older than a specified duration, or set a [retention policy](container-registry-retention-policy.md) for untagged manifests.

## Next steps

For a more detailed discussion of the concepts in this article, see the blog post [Docker Tagging: Best practices for tagging and versioning docker images](https://stevelasker.blog/2018/03/01/docker-tagging-best-practices-for-tagging-and-versioning-docker-images/).

To help maximize the performance and cost-effective use of your Azure container registry, see [Best practices for Azure Container Registry](container-registry-best-practices.md).

<!-- IMAGES -->


<!-- LINKS - Internal -->

