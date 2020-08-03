---
title: Troubleshoot registry performance
description: Symptoms, causes, and resolution of common problems with the performance of a registry
ms.topic: article
ms.date: 07/31/2020
---

# Troubleshoot registry performance

This article helps you troubleshoot problems you might encounter with the performance of an Azure container registry. 

## Symptoms

* Pull or push images with the Docker CLI takes longer than expected
* Deployment of images to a service such as Azure Kubernetes Service takes longer than expected
* You're not able to complete a large number of concurrent pull or push operations in the expected time
* Push operations in a geo-replicated registry fail with error `Error writing blob` or `Error writing manifest`

## Causes

* Your network connection speed may slow registry operations - [solution](#check-network-speed)
* You're reaching a limit in your registry service tier  - [solution](#review-service-imits)
* Your geo-replicated registry has replicas in nearby regions - [solution](#configure-geo-replicated-registry)

If you don't resolve your problem here, see [Next steps](#next-steps) for other options.

## Potential solutions

### Check expected network speed

Check your internet upload and download speed, or use a tool such as AzureSpeed to test [upload](https://www.azurespeed.com/Azure/Uploadß) and [download](https://www.azurespeed.com/Azure/Download) from Azure blob storage, which hosts registry image layers.

Check your image size against the maximum supported size and the supported download or upload bandwidth for your registry service tier. If your registry is in the Basic or Standard tier, consider upgrading to improve performance. 

For image deployment to other services, check the regions where the registry and target are located. Consider locating the registry and the deployment target in the same or network-close regions to improve performance.

Related links:

* [Azure Container Registry service tiers](container-registry-skus.md)
* [Container registry FAQ](container-registry-faq.md)
* [Performance and scalability targets for Azure Blob Storage](../storage/blobs/scalability-targets.md)

### Review service limits

If you're concurrently pushing or pulling multiple or many multi-layered images to your registry, review the supported ReadOps and WriteOps limits for the registry service tier. If your registry is in the Basic or Standard tier, consider upgrading to increase the limits.

Because each image layer requires a separate registry read or write operation, check the number of layers in your images. Consider strategies to reduce the number of image layers.

* [Azure Container Registry service tiers](container-registry-skus.md)

### Configure geo-replicated registry

A Docker client that pushes an image to a geo-replicated registry might not push all image layers and its manifest to a single replicated region. This may occur because Azure Traffic Manager routes registry requests to the network-closest replicated registry. If the registry has two nearby replication regions, image layers and the manifest could be distributed to the two sites, and the push operation fails when the manifest is validated.

To optimize DNS resolution to the closest replica when pushing images, configure a geo-replicated registry in the same Azure regions as the source of the push operations, or the closest region when working outside of Azure.

To troubleshoot operations with a geo-replicated registry, you can also temporarily disable Traffic Manager routing to one or more replications.


Related links:

* [Troubleshoot push operations with geo-replicated registries](container-registry-geo-replication.md#troubleshoot-push-operations-with-geo-replicated-registries)
* [Temporarily disable routing to replication](container-registry-geo-replication.md#temporarily-disable-routing-to-replication)

## Further troubleshooting

If your permissions to registry resources allow, check the health of the registry environment or review registry logs.

Related links:

* [Check registry health](container-registry-check-health.md)
* [Logs for diagnostic evaluation and auditing](container-registry-diagnostics-audit-logs.md)
* [Container registry FAQ](container-registry-faq.md)

## Next steps

* Other registry troubleshooting topics include:
  * [Troubleshoot registry login](container-registry-troubleshoot-login.md)
  * [Troubleshoot network access to registry](container-registry-troubleshoot-access.md)
* [Community support](https://azure.microsoft.com/support/community/) options
* [Microsoft Q&A](https://docs.microsoft.com/answers/products/)
* [Open a support ticket](https://azure.microsoft.com/support/create-ticket/)


