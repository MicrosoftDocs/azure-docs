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

Azure Container Registry (ACR) artifact streaming is designed to accelerate containerized workloads for Azure customers using Azure Kubernetes Service (AKS). Artifact streaming empowers customers to easily scale workloads without having to wait for slow pull times for their node

For example if you have a containerized application that you want to deploy to multiple regions. Traditionally, you have to create multiple container registries and enable geo-replication to ensure that your container images are available in all regions. This can be a time-consuming and degrades performance of the application.

Leverage Artifact Streaming with minimal effort you can store the container images within a single registry, manage, and stream the container images to Azure Kubernetes Service (AKS) clusters in multiple regions. Artifact Streaming will deploy container application to multiple regions without having to create multiple registries or enable geo-replication.

Artifact Streaming is only available in the **Premium** SKU [service tiers](container-registry-skus.md)

This article is part one in a four-part tutorial series. In this tutorial, you learn how to:

> [!div class="checklist"]
>*  [Artifact Streaming (Preview)](tutorial-artifact-streaming.md)
> * [Artifact Streaming - Azure CLI](tutorial-artifact-streaming-cli.md)
> * [Artifact Streaming - Azure Portal](tutorial-artifact-streaming-portal.md)
> * [Troubleshoot Artifact Streaming](tutorial-artifact-streaming-troubleshoot.md)

## Preview limitations

Artifact Streaming is currently in preview. The following limitations apply:

* Only images with Linux AMD64 architecture are supported in the preview release.
* The preview release doesn't support Windows-based container images, and ARM64 images.
* The preview release partially support multi-architecture images, only the AMD64 architecture is enabled.
* For creating Ubuntu based node pool in AKS, choose Ubuntu version 20.04 or higher.
* For Kubernetes, use Kubernetes version 1.26 or higher or k8s version > 1.25. 
* Only premium SKU registries support generating streaming artifacts in the preview release. The non-premium SKU registries do not offer this functionality during the preview.
* The CMK (Customer-Managed Keys) registries are NOT supported in the preview release.
* Kubernetes regcred is currently NOT supported.

## Benefits of using Artifact Streaming

Here are some benefits of enabling and using Artifact Streaming at registry level:

1. Seamless and agile experience for software developers and system architects.
1. Reduce image pull latency and fast container start up.
1. Time and performance effective scaling mechanism to design, build, and deploy container applications and cloud solutions at high scale.
1. Simplify the process of deploying containerized applications to multiple regions using a single container registry and streaming container images to multiple regions.
1. Supercharging the process of deploying containerized platforms by simplifying the process of deploying and managing container images.

## Brief considerations before use of Artifact Streaming

Here is a brief on how to use Artifact Streaming with Azure Container Registry (ACR). 

>* Customers with new and existing registries can enable Artifact Streaming for specific repositories or tags. 
>* Once the Artifact Streaming is enabled, two versions of the artifact will be stored in the customer's ACR: the original artifact and the Artifact Streaming artifact. 
>* If the user disables or turns off Artifact Streaming for repositories or artifacts, the Artifact Streaming copy will still be present, but it will not delete the original artifact.
>* If a customer deletes a repository or artifact with Artifact Streaming and Soft Delete enabled, then both the original and Artifact Streaming versions will be deleted. However, only the original version will be available on the soft delete blade.

## Next steps

> [!div class="nextstepaction"]
> [Enable Artifact Streaming- Azure CLI](tutorial-artifact-streaming-cli.md)
