---
title: Operator best practices - Container image management in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for how to manage and secure container images in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/26/2018
ms.author: iainfou
---

# Best practices for container image management and security in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), the security of your containers is a key consideration. Containers that include out-of-date base images or application runtime introduce a security risk and possible attack vector. To minimize these risks, you should integrate tools that scan for and remediate issues in your containers.

This article focuses on how to secure your containers in AKS. You learn how to:

> [!div class="checklist"]
> * Scan for and remediate image vulnerabilities
> * Use a trusted registry with digitally signed container images
> * Automatically trigger and redeploy container images when a base image is updated

You can also read the best practices for [cluster security][best-practices-cluster-security] and for [pod security][best-practices-pod-security].

## Secure the images and run time

**Best practice guidance** - Scan your container images for vulnerabilities, and only deploy images that have passed validation. Regularly update the base images and application runtime, then redeploy workloads in the AKS cluster.

One concern with the adoption of container-based workloads is verifying the security of images and runtime used to build your own applications. How do you make sure that you don't introduce security vulnerabilities into your deployments? Your deployment workflow should include a process to scan container images using tools such as [Twistlock][twistlock] or [Aqua][aqua], and then only allow verified images to be deployed.

![Scan and remediate container images, validate, and deploy](media/operator-best-practices-container-security/scan-container-images-simplified.png)

In a real-world example, you can use a continuous integration and continuous deployment (CI/CD) pipeline to automate the image scans, verification, and deployments. Azure Container Registry includes these vulnerabilities scanning capabilities.

## Use a trusted registry

**Best practice guidance** - Limit the image registries that pods and deployments can use. Only allow trusted registries where you validate and control the images that are available.

For additional security, you can also digitally sign your container images. You then only permit deployments of signed images. This process provides an additional layer of security in that limit to only images digitally signed and trusted by you, not just images that pass a vulnerability check.

Trusted registries that provide digitally signed container images add complexity to your environment, but may be required for certain policy or regulatory compliance. Azure Container Registry supports the use of trusted registries and signed images.

For more information about digitally signed images, see [Content trust in Azure Container Registry][acr-content-trust].

## Automatically build new images on base image update

**Best practice guidance** - As you use base images for application images, use automation to build new images when the base image is updated. As those base images typically include security fixes, don't continue to use outdated application images without the incorporated base image update.

Each time a base image is updated, any downstream container images should also be updated. This build process should be integrated into validation and deployment pipelines such as [Azure Pipelines][azure-pipelines] to make sure that your applications continue to run on the updated based images. Once your application container images are validated, the AKS deployments can then be updated to run the latest, secure images.

Azure Container Registry Tasks can also automatically update container images when the base image is updated. This feature allows you to build a small number of base images, and regularly keep them updated with bug and security fixes.

For more information about base image updates, see [Automate image builds on base image update with Azure Container Registry Tasks][acr-base-image-update].

## Next steps

This article focused on how to secure your containers. To implement some of these areas, see the following articles:

* [Automate image builds on base image update with Azure Container Registry Tasks][acr-base-image-update]
* [Content trust in Azure Container Registry][acr-content-trust]

<!-- EXTERNAL LINKS -->
[azure-pipelines]: /azure/devops/pipelines/?view=vsts
[twistlock]: https://www.twistlock.com/
[aqua]: https://www.aquasec.com/

<!-- INTERNAL LINKS -->
[best-practices-cluster-security]: operator-best-practices-cluster-security.md
[best-practices-pod-security]: developer-best-practices-pod-security.md
[acr-content-trust]: ../container-registry/container-registry-content-trust.md
[acr-base-image-update]: ../container-registry/container-registry-tutorial-base-image-update.md
