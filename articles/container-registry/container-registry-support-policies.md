---
title: Azure Container Registry technical support policies
description: Learn about Azure Container Registry (ACR) technical support policies
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
#Customer intent: As a developer, I want to understand what ACR components I need to manage, what components are managed by Microsoft.
---

# Support policies for Azure Container Registry (ACR)

This article provides details about Azure Container Registry (ACR) support policies, supported features, and limitations.

## Features supported by Azure Container Registry

>* [Connect to ACR using Azure private link](container-registry-private-link.md)
>* [Push and pull Helm charts to ACR](container-registry-helm-repos.md)
>* [Encrypt using Customer managed keys](tutorial-enable-customer-managed-keys.md)
>* [Enable Content trust](container-registry-content-trust.md)
>* [Scan Images using Azure Security Center](../defender-for-cloud/defender-for-container-registries-introduction.md)
>* [ACR Tasks](./container-registry-tasks-overview.md)
>* [Import container images to ACR](container-registry-import-images.md)
>* [Image locking in ACR](container-registry-image-lock.md)
>* [Synchronize content with ACR using Connected Registry](intro-connected-registry.md)
>* [Geo replication in ACR](container-registry-geo-replication.md)

## Microsoft/ACR can’t extend support 

* Any local network issues that interrupt the connection to ACR service. 
* Vulnerabilities or issues caused by running third-party container images using ACR Tasks.
* Vulnerabilities or bugs with images in the ACR customer store. 

## Microsoft/ACR extends support 

* General queries about the supported features of ACR.  
* Unable to pull image due to authentication errors, image size, and client-side issues with container runtime.
* Unable to push an image to ACR due to authentication errors, image size, and client-side issues with container runtime.
* Unable to add VNET/Subnet to ACR Firewall across subscription.
* Issues with slow push/pull operations due to client, network, or ACR.
* Issues with integration of ACR with Azure Kubernetes Service (AKS) or with any other Azure service.
* Authentication issues in ACR, authentication errors in integration, repository-based access role(RBAC). 

## Shared responsibility

* Issues with slow push/pull operations caused by a slow-performing client VM, network, or ACR. Here the customers have to provide the time range, image name, and configuration settings.
* Issues with Integration of ACR with any other Azure service. Here the customers have to provide the details of the client used to build and pull the image and push it to ACR. For example, the customer uses the DevOps pipeline to build the image and push it to ACR.

## Customers have to self support
 
* Microsoft/ACR can’t make any changes if there's a detection of base image vulnerability in the security center (Microsoft Defender for Cloud). Customers can reach out for guidance
* Microsoft/ACR can’t make any changes with Dockerfile. Customers have to identify and review it from their end.  

| ACR support                  | Link                                                                       |
| ---------------------------- | -------------------------------------------------------------------------- |
| Create a support ticket      | https://aka.ms/acr/support/create-ticket                                   |
| Service updates and releases | [ACR Blog](https://azure.microsoft.com/blog/tag/azure-container-registry/) |
| Roadmap                      | https://aka.ms/acr/roadmap                                                 |
| FAQ                          | https://aka.ms/acr/faq                                                     |
| Audit Logs                   | https://aka.ms/acr/audit-logs                                              |
| Health-Check-CLI             | https://aka.ms/acr/health-check                                            |
| ACR Links                    | https://aka.ms/acr/links                                                   |
### API and SDK reference

>* [SDK for Python](https://pypi.org/project/azure-mgmt-containerregistry/)
>* [SDK for .NET](https://www.nuget.org/packages/Azure.Containers.ContainerRegistry)
>* [REST API Reference](/rest/api/containerregistry/)

## Upstream bugs

The ACR support will identify the root cause of every issue raised. The team will report all the identified bugs as an [issue in the ACR repository](https://github.com/Azure/acr/issues) with supporting details. The engineering team will review and provide a workaround solution, bug fix, or upgrade with a new release timeline. All the bug fixes integrate from upstream.
Customers can watch the issues, bug fixes, add more details, and follow the new releases.