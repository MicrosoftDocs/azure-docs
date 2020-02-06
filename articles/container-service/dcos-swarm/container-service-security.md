---
title: (DEPRECATED) Container security in Azure Container Service
description: Considerations for securing Docker containers deployed in Azure Container Service and related Azure services.
author: sauryadas
ms.service: container-service
ms.topic: conceptual
ms.date: 03/28/2017
ms.author: saudas
ms.custom: mvc
---

# (DEPRECATED) Securing Docker containers in Azure Container Service

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

This article introduces considerations and recommendations for securing Docker containers deployed in Azure Container Service. Many of these considerations apply generally to Docker containers deployed in Azure or other environments. 

## Image security

Containers are built from images that are stored in one or more repositories. These repositories can belong to public or private container registries. An example of a public registry is [Docker Hub](https://hub.docker.com/). An example of a private registry is the [Docker Trusted Registry](https://docs.docker.com/datacenter/dtr/2.0/), which can be installed on-premises or in a virtual private cloud. There are also cloud-based private container registry services including [Azure Container Registry](../../container-registry/container-registry-intro.md).

### Public and private images
In general, as with any publicly published software package, a publicly available container image does not guarantee security. Container images consist of multiple software layers, and each software layer could have vulnerabilities. It is key to understand the origin of the container image, including the owner of the image (to determine if it is a reliable source or not), the software layers it consists of, and the software versions. 

For example, if you go to the official [nginx repository](https://hub.docker.com/_/nginx/) in Docker Hub and navigate to the **Tags** tab, you see color-coded vulnerabilities in each image. Each color depicts the vulnerability of a software layer of the image. For more about vulnerability scanning in Docker Hub, see [Understanding official repos on Docker Hub](https://blog.docker.com/2015/06/understanding-official-repos-docker-hub/).

![Nginx images in Docker Hub](./media/container-service-security/docker-hub-nginx.png)

Enterprises care deeply about security, and to protect themselves from security attack should store and retrieve images from a private registry, such as Azure Container Registry or Docker Trusted Registry. In addition to providing a managed private registry, Azure Container Registry supports [service principal-based authentication](../../container-registry/container-registry-authentication.md) through Azure Active Directory for basic authentication flows, including role-based access for read-only, write, and owner permissions.

### Image security scanning

Even when using a private registry, it is a good idea to use image scanning solutions for additional security validation. Each software layer in a container image is potentially prone to vulnerabilities independent of other layers in the container image. As increasingly companies start deploying their production workloads based on container technologies, image scanning becomes important to ensure prevention of security threats against their organizations. 

Security monitoring and scanning solutions such as [Twistlock](https://www.twistlock.com/2016/11/07/twistlock-supports-azure-container-registry) and [Aqua Security](https://blog.aquasec.com/image-vulnerability-scanning-in-azure-container-registry), among others, can be used to scan container images in a private registry and identify potential vulnerabilities. It is important to understand the depth of scanning that the different solutions provide. For example, some solutions might only cross-verify image layers against known vulnerabilities. These solutions might not be able to verify image-layer software built through certain package manager software. Other solutions have deeper scanning integration and can find vulnerabilities in any packaged software.

### Production deployment rules and audit
Once an application is deployed in production, it is essential to set a few rules to ensure that images used in production environments are secure and contain no vulnerabilities.

* As a rule, images with vulnerabilities, even minor, should not be allowed to run in a production environment. In addition, all images deployed in production should ideally be saved in a private registry accessible to a select few. It is also important to keep the number of production images small to ensure that they can be managed effectively.

* Since it is hard to pinpoint the origin of software from a publicly available container image, it is a good practice to build images from source to ensure knowledge of the origin of the layer. When a vulnerability surfaces in a self-built container image, customers can find a quicker path to a resolution. With a public image, customers would need to find the root of a public image to fix it or obtain another secure image from the publisher.

* A thoroughly scanned image deployed in production is not guaranteed to be up to date for the lifetime of the application. Security vulnerabilities might be reported for layers of the image that were not previously known or were introduced after the production deployment. Periodic auditing of images deployed in production is necessary to identify images that are out of date or have not been updated in a while. One might use blue-green deployment methodologies and rolling upgrade mechanisms to update container images without downtime. Image scanning can be done with tools described in the preceding section. 

* A continuous integration (CI) pipeline to build images and integrated security scanning can help maintain secure private registries with secure container images. The vulnerability scanning built into the CI solution ensures that images that pass all the tests are pushed to the private registry from which production workloads are deployed. A CI pipeline failure ensures that vulnerable images are not pushed into the private registry used for production workload deployments. It also automates image security scanning if there are a significant number of images. Otherwise, manually auditing images for security vulnerabilities can be painstakingly lengthy and error prone.

## Host-level container isolation
When a customer deploys container applications on Azure resources, they are deployed at a subscription level in resource groups and are not multi-tenant. This means that if a customer shares a subscription with others, there are no boundaries that can be built between two deployments in the same subscription. Therefore, container-level security is not guaranteed. 

It is also critical to understand that containers share the kernel and the resources of the host (which in Azure Container Service is an Azure VM in a cluster). Therefore, containers running in production must be run in non-privileged user mode. Running a container with root privileges can compromise the entire environment. With root-level access in a container, a hacker can gain access to the full root privileges on the host. In addition, it is important to run containers with read-only file systems. This prevents someone who has access to the compromised container to write malicious scripts to the file system and gain access to other files. Similarly, it is important to limit the resources (such as memory, CPU, and network bandwidth) allocated to a container. This helps prevent hackers from hogging resources and pursuing illegal activities such as credit card fraud or bit coin mining, which could prevent other containers from running on the host or cluster.

## Orchestrator considerations

Each orchestrator available in Azure Container Service has its own security considerations. For example, you should limit direct SSH access to orchestrator nodes in Container Service. Instead, you should use each orchestrator's UI or command-line tools (such as `kubectl` for Kubernetes) to manage the container environment without accessing the hosts.

For additional orchestrator-specific security information, see the following resources:

* **Kubernetes**: [Security Best Practices for Kubernetes Deployment](https://kubernetes.io/blog/2016/08/security-best-practices-kubernetes-deployment/)

* **DC/OS**: [Securing Your Cluster](https://docs.mesosphere.com/1.12/administering-clusters/securing-your-cluster)

* **Docker Swarm**: [Docker Security](https://www.docker.com/docker-security)

## Next steps

* For more about Docker architecture and container security, see [Introduction to Container Security](https://www.docker.com/sites/default/files/WP_IntrotoContainerSecurity_08.19.2016.pdf).

* For information about Azure platform security, see the [Azure Security Center](https://www.microsoft.com/trustcenter/cloudservices/azure).
