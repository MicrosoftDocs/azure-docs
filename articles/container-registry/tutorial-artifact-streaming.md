---
title: "Tutorial: Artifact Streaming in Azure Container Registry (Preview)"
description: "Artifact Streaming is a feature in Azure Container Registry to enhance and supercharge managing, scaling, and deploying artifacts through containerized platforms."
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: tutorial  #Don't change.
ms.date: 10/31/2023

#customer intent: As a developer, I want artifact streaming capabilities so that I can efficiently deliver and serve containerized applications to end-users in real-time.
---

# Tutorial: Artifact Streaming in Azure Container Registry (Preview)

Azure Container Registry (ACR) artifact streaming is designed to accelerate containerized workloads for Azure customers using Azure Kubernetes Service (AKS). Artifact streaming empowers customers to easily scale workloads without having to wait for slow pull times for their node.

For example, consider the scenario where you have a containerized application that you want to deploy to multiple regions. Traditionally, you have to create multiple container registries and enable geo-replication to ensure that your container images are available in all regions. This can be time-consuming and can degrade performance of the application.

Leverage artifact streaming to store container images within a single registry and manage and stream container images to Azure Kubernetes Service (AKS) clusters in multiple regions. Artifact streaming deploys container applications to multiple regions without having to create multiple registries or enable geo-replication.

Artifact streaming is only available in the **Premium** SKU [service tiers](container-registry-skus.md)

This article is part one in a four-part tutorial series. In this tutorial, you learn how to:

* [Artifact Streaming (Preview)](tutorial-artifact-streaming.md)
* [Artifact Streaming - Azure CLI](tutorial-artifact-streaming-cli.md)
* [Artifact Streaming - Azure Portal](tutorial-artifact-streaming-portal.md)
* [Troubleshoot Artifact Streaming](tutorial-artifact-streaming-troubleshoot.md)

## Preview limitations

Artifact streaming is currently in preview. The following limitations apply:

* Only images with Linux AMD64 architecture are supported in the preview release.
* The preview release doesn't support Windows-based container images and ARM64 images.
* The preview release partially supports multi-architecture images (only AMD64 architecture is enabled).
* For creating Ubuntu based node pools in AKS, choose Ubuntu version 20.04 or higher.
* For Kubernetes, use Kubernetes version 1.26 or higher or k8s version > 1.25. 
* Only premium SKU registries support generating streaming artifacts in the preview release. Non-premium SKU registries do not offer this functionality during the preview release.
* Customer-Managed Keys (CMK) registries are not supported in the preview release.
* Kubernetes regcred is currently not supported.

## Benefits of using artifact streaming

Benefits of enabling and using artifact streaming at a registry level include:

* Reduce image pull latency and fast container startup.
* Seamless and agile experience for software developers and system architects.
* Time and performance effective scaling mechanism to design, build, and deploy container applications and cloud solutions at high scale.
* Simplify the process of deploying containerized applications to multiple regions using a single container registry and streaming container images to multiple regions.
* Supercharge the process of deploying containerized platforms by simplifying the process of deploying and managing container images.

## Considerations before using artifact streaming

Here is a brief overview on how to use artifact streaming with Azure Container Registry (ACR). 

* Customers with new and existing registries can enable artifact streaming for specific repositories or tags. 
* Once you enable artifact streaming, two versions of the artifact are stored in the your container registry: the original artifact and the artifact streaming artifact. 
* If you disable or turn off artifact streaming for repositories or artifacts, the artifact streaming copy and original artifact still exist.
* If you delete a repository or artifact with artifact streaming and soft delete enabled, then both the original and artifact streaming versions are deleted. However, only the original version is available on the soft delete blade.

## Next steps

> [!div class="nextstepaction"]
> [Enable Artifact Streaming- Azure CLI](tutorial-artifact-streaming-cli.md)
