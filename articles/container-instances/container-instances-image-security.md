---
title: Azure Container Instances security considerations
description: Recommendations to secure images and secrets for Azure Container Instances, and general security considerations for any container platform
services: container-instances
author: dlepow
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 04/29/2019
ms.author: danlep
ms.custom: 
---

# Security considerations for Azure Container Instances

This article introduces security considerations for using Azure Container Instances to run container apps. Topics include:

> [!div class="checklist"]
> * **Security recommendations** for managing images and secrets for Azure Container Instances
> * **Considerations for the container ecosystem**  throughout the container lifecycle, for any container platform

## Security recommendations for Azure Container Instances

### Use a private registry

Containers are built from images that are stored in one or more repositories. These repositories can belong to a public registry, like [Docker Hub](https://hub.docker.com), or to a private registry. An example of a private registry is the [Docker Trusted Registry](https://docs.docker.com/datacenter/dtr/2.0/), which can be installed on-premises or in a virtual private cloud. You can also use cloud-based private container registry services, including [Azure Container Registry](../container-registry/container-registry-intro.md). 

A publicly available container image does not guarantee security. Container images consist of multiple software layers, and each software layer might have vulnerabilities. To help reduce the threat of attacks, you should store and retrieve images from a private registry, such as Azure Container Registry or Docker Trusted Registry. In addition to providing a managed private registry, Azure Container Registry supports [service principal-based authentication](../container-registry/container-registry-authentication.md) through Azure Active Directory for basic authentication flows. This authentication includes role-based access for read-only (pull), write (push), and owner permissions.

### Monitor and scan container images

Security monitoring and scanning solutions such as [Twistlock](https://azuremarketplace.microsoft.com/marketplace/apps/twistlock.twistlock?tab=Overview) and [Aqua Security](https://azuremarketplace.microsoft.com/marketplace/apps/aqua-security.aqua-security?tab=Overview) are available through the Azure Marketplace. You can use them to scan container images in a private registry and identify potential vulnerabilities. It’s important to understand the depth of scanning that the different solutions provide. 

### Protect credentials

Containers can spread across several clusters and Azure regions. So, you must secure credentials required for logins or API access, such as passwords or tokens. Ensure that only privileged users can access those containers in transit and at rest. Inventory all credential secrets, and then require developers to use emerging secrets-management tools that are designed for container platforms.  Make sure that your solution includes encrypted databases, TLS encryption for secrets data in transit, and least-privilege [role-based access control](../role-based-access-control/overview.md). [Azure Key Vault](../key-vault/key-vault-secure-your-key-vault.md) is a cloud service that safeguards encryption keys and secrets (such as certificates, connection strings, and passwords) for containerized applications. Because this data is sensitive and business critical, secure access to your key vaults so that only authorized applications and users can access them.

## Considerations for the container ecosystem

The following security measures, implemented well and managed effectively, can help you secure and protect your container ecosystem. These measures apply throughout the container lifecycle, from development through production deployment, and to a range of container orchestrators, hosts, and platforms. 

### Use vulnerability management as part of your container development lifecycle 

By using effective vulnerability management throughout the container development lifecycle, you improve the odds that you identify and resolve security concerns before they become a more serious problem. 

### Scan for vulnerabilities 

New vulnerabilities are discovered all the time, so scanning for and identifying vulnerabilities is a continuous process. Incorporate vulnerability scanning throughout the container lifecycle:

* As a final check in your development pipeline, you should perform a vulnerability scan on containers before pushing the images to a public or private registry. 
* Continue to scan container images in the registry both to identify any flaws that were somehow missed during development and to address any newly discovered vulnerabilities that might exist in the code used in the container images.  

### Map image vulnerabilities to running containers 

You need to have a means of mapping vulnerabilities identified in container images to running containers, so security issues can be mitigated or resolved.  

### Ensure that only approved images are used in your environment 

There’s enough change and volatility in a container ecosystem without allowing unknown containers as well. Allow only approved container images. Have tools and processes in place to monitor for and prevent the use of unapproved container images. 

An effective way of reducing the attack surface and preventing developers from making critical security mistakes is to control the flow of container images into your development environment. For example, you might sanction a single Linux distribution as a base image, preferably one that is lean (Alpine or CoreOS rather than Ubuntu), to minimize the surface for potential attacks. 

Image signing or fingerprinting can provide a chain of custody that enables you to verify the integrity of the containers. For example, Azure Container Registry supports Docker's [content trust](https://docs.docker.com/engine/security/trust/content_trust) model, which allows image publishers to sign images that are pushed to a registry, and image consumers to pull only signed images.

### Permit only approved registries 

An extension of ensuring that your environment uses only approved images is to permit only the use of approved container registries. Requiring the use of approved container registries reduces your exposure to risk by limiting the potential for the introduction of unknown vulnerabilities or security issues. 

### Ensure the integrity of images throughout the lifecycle 

Part of managing security throughout the container lifecycle is to ensure the integrity of the container images in the registry and as they are altered or deployed into production. 

* Images with vulnerabilities, even minor, should not be allowed to run in a production environment. Ideally, all images deployed in production should be saved in a private registry accessible to a select few. Keep the number of production images small to ensure that they can be managed effectively.

* Because it’s hard to pinpoint the origin of software from a publicly available container image, build images from the source to ensure knowledge of the origin of the layer. When a vulnerability surfaces in a self-built container image, customers can find a quicker path to a resolution. With a public image, customers would need to find the root of a public image to fix it or get another secure image from the publisher. 

* A thoroughly scanned image deployed in production is not guaranteed to be up-to-date for the lifetime of the application. Security vulnerabilities might be reported for layers of the image that were not previously known or were introduced after the production deployment. 

  Periodically audit images deployed in production to identify images that are out of date or have not been updated in a while. You might use blue-green deployment methodologies and rolling upgrade mechanisms to update container images without downtime. You can scan images by using tools described in the preceding section. 

* Use a continuous integration (CI) pipeline with integrated security scanning to build secure images and push them to your private registry. The vulnerability scanning built into the CI solution ensures that images that pass all the tests are pushed to the private registry from which production workloads are deployed. 

  A CI pipeline failure ensures that vulnerable images are not pushed to the private registry that’s used for production workload deployments. It also automates image security scanning if there’s a significant number of images. Otherwise, manually auditing images for security vulnerabilities can be painstakingly lengthy and error prone. 

### Enforce least privileges in runtime 

The concept of least privileges is a basic security best practice that also applies to containers. When a vulnerability is exploited, it generally gives the attacker access and privileges equal to those of the compromised application or process. Ensuring that containers operate with the lowest privileges and access required to get the job done reduces your exposure to risk. 

### Reduce the container attack surface by removing unneeded privileges 

You can also minimize the potential attack surface by removing any unused or unnecessary processes or privileges from the container runtime. Privileged containers run as root. If a malicious user or workload escapes in a privileged container, the container will then run as root on that system.

### Whitelist files and executables that the container is allowed to access or run 

Reducing the number of variables or unknowns helps you maintain a stable, reliable environment. Limiting containers so they can access or run only preapproved or whitelisted files and executables is a proven method of limiting exposure to risk.  

It’s a lot easier to manage a whitelist when it’s implemented from the beginning. A whitelist provides a measure of control and manageability as you learn what files and executables are required for the application to function correctly. 

A whitelist not only reduces the attack surface but can also provide a baseline for anomalies and prevent the use cases of the "noisy neighbor" and container breakout scenarios. 

### Enforce network segmentation on running containers  

To help protect containers in one subnet from security risks in another subnet, maintain network segmentation (or nano-segmentation) or segregation between running containers. Maintaining network segmentation may also be necessary for using containers in industries that are required to meet compliance mandates.  

For example, the partner tool [Aqua](https://azuremarketplace.microsoft.com/marketplace/apps/aqua-security.aqua-security?tab=Overview) provides an automated approach for nano-segmentation. Aqua monitors container network activities in runtime. It identifies all inbound and outbound network connections to/from other containers, services, IP addresses, and the public internet. Nano-segmentation is automatically created based on monitored traffic. 

### Monitor container activity and user access 

As with any IT environment, you should consistently monitor activity and user access to your container ecosystem to quickly identify any suspicious or malicious activity. Azure provides container monitoring solutions including:

* [Azure Monitor for containers](../azure-monitor/insights/container-insights-overview.md) to monitor the performance of your workloads deployed to Kubernetes environments hosted on Azure Kubernetes Service (AKS). Azure Monitor for containers gives you performance visibility by collecting memory and processor metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. 

* The [Azure Container Monitoring solution](../azure-monitor/insights/containers.md) helps you view and manage other Docker and Windows container hosts in a single location. For example:

  * View detailed audit information that shows commands used with containers. 
  * Troubleshoot containers by viewing and searching centralized logs without having to remotely view Docker or Windows hosts.  
  * Find containers that may be noisy and consuming excess resources on a host.
  * View centralized CPU, memory, storage, and network usage and performance information for containers.  

  The solution supports container orchestrators including Docker Swarm, DC/OS, unmanaged Kubernetes, Service Fabric, and Red Hat OpenShift. 

### Monitor container resource activity 

Monitor your resource activity, like files, network, and other resources that your containers access. Monitoring resource activity and consumption is useful both for performance monitoring and as a security measure. 

[Azure Monitor](../azure-monitor/overview.md) enables core monitoring for Azure services by allowing the collection of metrics, activity logs, and diagnostic logs. For example, the activity log tells you when new resources are created or modified. 

Metrics are available that provide performance statistics for different resources and even the operating system inside a virtual machine. You can view this data with one of the explorers in the Azure portal and create alerts based on these metrics. Azure Monitor provides the fastest metrics pipeline (5 minutes down to 1 minute), so you should use it for time-critical alerts and notifications. 

### Log all container administrative user access for auditing 

Maintain an accurate audit trail of administrative access to your container ecosystem, container registry, and container images. These logs might be necessary for auditing purposes and will be useful as forensic evidence after any security incident. You can use the [Azure Container Monitoring solution](../azure-monitor/insights/containers.md) to achieve this purpose. 

## Next steps

* Learn more about managing container vulnerabilities with solutions from [Twistlock](https://www.twistlock.com/solutions/microsoft-azure-container-security/) and [Aqua Security](https://www.aquasec.com/solutions/azure-container-security/).

* Learn more about [container security in Azure](https://azure.microsoft.com/resources/container-security-in-microsoft-azure/).