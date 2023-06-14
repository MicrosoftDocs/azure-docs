---
title: Troubleshoot registry performance
description: Symptoms, causes, and resolution of common problems with the performance of a registry
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Troubleshoot registry performance

This article helps you troubleshoot problems you might encounter with the performance of an Azure container registry. 

## Symptoms

May include one or more of the following:

* Pull or push images with the Docker CLI takes longer than expected
* Deployment of images to a service such as Azure Kubernetes Service takes longer than expected
* You're not able to complete a large number of concurrent pull or push operations in the expected time
* You see an HTTP 429 error similar to `Too many requests`
* Pull or push operations in a geo-replicated registry take longer than expected, or push fails with error `Error writing blob` or `Error writing manifest`

## Causes

* Your network connection speed may slow registry operations - [solution](#check-expected-network-speed)
* Image layer compression or extraction may be slow on the client - [solution](#check-client-hardware)  
* You're reaching a configured limit in your registry service tier or environment - [solution](#review-configured-limits)
* Your geo-replicated registry has replicas in nearby regions - [solution](#configure-geo-replicated-registry)
* You're pulling from a geographically distant registry replica - [solution](#configure-dns-for-geo-replicated-registry)

If you don't resolve your problem here, see [Advanced troubleshooting](#advanced-troubleshooting) and [Next steps](#next-steps) for other options.

## Potential solutions

### Check expected network speed

Check your internet upload and download speed, or use a tool such as AzureSpeed to test [upload](https://www.azurespeed.com/Azure/Uploadß) and [download](https://www.azurespeed.com/Azure/Download) from Azure blob storage, which hosts registry image layers.

Check your image size against the maximum supported size and the supported download or upload bandwidth for your registry service tier. If your registry is in the Basic or Standard tier, consider upgrading to improve performance. 

For image deployment to other services, check the regions where the registry and target are located. Consider locating the registry and the deployment target in the same or network-close regions to improve performance.

Related links:

* [Azure Container Registry service tiers](container-registry-skus.md)    
* [Container registry FAQ](container-registry-faq.yml)
* [Performance and scalability targets for Azure Blob Storage](../storage/blobs/scalability-targets.md)

### Check client hardware

The disk type and CPU on the docker client can affect the speed of extracting or compressing image layers on the client as part of pull or push operations. For example, layer extraction on a hard disk drive will take longer than on a solid-state disk. Compare pull operations for comparable images from your Azure container registry and a public registry such as Docker Hub.

### Review configured limits

If you're concurrently pushing or pulling multiple or many multi-layered images to your registry, review the supported ReadOps and WriteOps limits for the registry service tier. If your registry is in the Basic or Standard tier, consider upgrading to increase the limits. Check also with your networking provider about network throttling that may occur with many concurrent operations. 

Review your Docker daemon configuration for the maximum concurrent uploads or downloads for each push or pull operation on the client. Configure higher limits if needed.

Because each image layer requires a separate registry read or write operation, check the number of layers in your images. Consider strategies to reduce the number of image layers.

Related links:

* [Azure Container Registry service tiers](container-registry-skus.md)
* [dockerd](https://docs.docker.com/engine/reference/commandline/dockerd/)

### Configure geo-replicated registry

A Docker client that pushes an image to a geo-replicated registry might not push all image layers and its manifest to a single replicated region. This situation may occur because Azure Traffic Manager routes registry requests to the network-closest replicated registry. If the registry has two nearby replication regions, image layers and the manifest could be distributed to the two sites, and the push operation fails when the manifest is validated.

To optimize DNS resolution to the closest replica when pushing images, configure a geo-replicated registry in the same Azure regions as the source of the push operations, or the closest region when working outside of Azure.

To troubleshoot operations with a geo-replicated registry, you can also temporarily disable Traffic Manager routing to one or more replications.

Related links:

* [Geo-replication in Azure Container Registry](container-registry-geo-replication.md)

### Configure DNS for geo-replicated registry

If pull operations from a geo-replicated registry appear slow, the DNS configuration on the client might resolve to a geographically distant DNS server. In this case, Traffic Manager might be routing requests to a replica that is network-close to the DNS server but distant from the client. Run a tool such as `nslookup` or `dig` (on Linux) to determine the replica that Traffic Manager routes registry requests to. For example:

```console
nslookup myregistry.azurecr.io
```

A potential solution is to configure a closer DNS server.

Related links:

* [Geo-replication in Azure Container Registry](container-registry-geo-replication.md)
* [Troubleshoot push operations with geo-replicated registries](container-registry-geo-replication.md#troubleshoot-push-operations-with-geo-replicated-registries)
* [Temporarily disable routing to replication](container-registry-geo-replication.md#temporarily-disable-routing-to-replication)
* [Traffic Manager FAQs](../traffic-manager/traffic-manager-faqs.md)

### Advanced troubleshooting

If your permissions to registry resources allow, [check the health of the registry environment](container-registry-check-health.md). If errors are reported, review the [error reference](container-registry-health-error-reference.md) for potential solutions.

If [collection of resource logs](monitor-service.md) is enabled in the registry, review the ContainterRegistryRepositoryEvents log. This log stores information for operations such as push or pull events. Query the log for [repository-level operation failures](monitor-service.md#repository-level-operation-failures). 

Related links:

* [Logs for diagnostic evaluation and auditing](./monitor-service.md)
* [Container registry FAQ](container-registry-faq.yml)
* [Best practices for Azure Container Registry](container-registry-best-practices.md)

## Next steps

If you don't resolve your problem here, see the following options.

* Other registry troubleshooting topics include:
  * [Troubleshoot registry login](container-registry-troubleshoot-login.md)
  * [Troubleshoot network issues with registry](container-registry-troubleshoot-access.md)
* [Community support](https://azure.microsoft.com/support/community/) options
* [Microsoft Q&A](/answers/products/)
* [Open a support ticket](https://azure.microsoft.com/support/create-ticket/)