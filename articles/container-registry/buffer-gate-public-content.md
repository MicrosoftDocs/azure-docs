---
title: How to manage public content in private registry
description: ....
ms.topic: article
ms.date: 10/21/2020
---


# How to manage public content with Azure Container Registry

An Azure container registry hosts your container images and other artifacts in a private, authenticated environment. However, your content may have dependencies on public content such as public container images. For example, you might host application images that are built by pulling base OS images directly from Docker Hub or another public registry. Or, you might keep copies of certain public images in your registry for container development teams, but don't have robust processes to maintain them. For more information about the risks introduced by dependencies on public content, see [Steve's blog post]().

This article covers features and workflows in Azure Container Regitry to help you manage public content:

* Import local copies of all base images. 
* Maintain separate registries for base images 
* Use [ACR Tasks](container-registry-tasks-overview.md) to automatically retrieve and validate base image updates
* Use ACR Tasks to automatically rebuild and push updated application images dependent on base image updates
 
This article refers mainly to Docker images, but concepts apply to other supported [registry content](container-registry-image-formats.md) such as Helm charts and other artifacts.

## Image import
 
Use [image import](container-registry-import-images.md) in your workflows to import Docker images from public registries easily to your Azure container registries. The [az acr import](/cli/azure/acr)
Basic, manual feature to move/import base images to ACR from multiple public clouds  (other ACR, DH, GCR, quay, etc.)
 
Import to (or georeplicate to) same region where you'll deploy - "bring the content to the region"
 
## Maintain base images in separate registry(ies)
 
"Regardless of the size of the company, you'll likely want to have a separate registry for managing base images. While it's possible to share a registry with multiple development teams, it's difficult to know how each team may work, possibly requiring VNet features, or other registry specific capabilities.
 
Depending on your workflow, you may want two registries for base images, one for staging and validating base images, and one for storing verified base images ready for use by your dev teams.
 
Decouple management of base images from consumption by dev teams.
 
## Adopt tagging scheme for base image updates
 
See container-registry-image-tag-version.md
 
* Build images from stable service tags - can continue to receive security patches and framework updates.
 
## Protect images using Image/tag locking
 
Support your build and deployment workflows from unintentional image updates.
 
https://docs.microsoft.com/en-us/azure/container-registry/container-registry-image-lock
 
* Lock repo from new content
* Block pulls or deletes
 
## Automate base image updates
 
Expanding on basic image import, they should create a process by which they import the base images they depend upon into their corporate registry.
 
1. Automate base image updates by buffering to a staging registry, tests are run as part of the build process. If the tests succeed, the mirrored image is imported to a base-images repository. Use ACR tasks to automate base artifact validation:
 
* Pull to staging registry - build both "mirrored" image and "test" image, including test/validation scripts
* Scan [build image to run a vulnerability scanner such as Aqua]
* Test [build image to run a test script]
* If validated, move to base images reg repo
 
NEED --> Example multistep task to accomplish this? something like
https://github.com/Azure-Samples/acr-tasks/blob/master/build-test-update-hello-world.yaml or https://github.com/SteveLasker/Presentations/tree/master/demo-scripts/buffering-building-patching
 
## Trigger downstream app image builds based on base image update
 
Using ACR Tasks, tracking base image updates in the base reg repo:
 
Concepts: container-registry-tasks-base-images.md
 
Walkthroughs: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-base-image-update (base in same reg)
https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-private-base-image-update (base in separate reg)


## Next steps
 
See Sample E2E scenario
 
https://github.com/SteveLasker/Presentations/tree/master/demo-scripts/buffering-building-patching


========



 and your might host copies of certain public images for your organization's deployments.

Dependencies on public content can introduce numerous risks to your organization
 
[Intro] Main message is: Use ACR to keep local copies of all artifacts that organization depends on for development and deployments.
 
Example: Companies should never base their FROM statements on external registries
 
Should mitigate Docker TOS changes but also a best practice
