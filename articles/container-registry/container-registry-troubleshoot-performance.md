---
title: Troubleshoot registry performance
description: Symptoms, causes, and resolution of common problems with the performance of a registry
ms.topic: article
ms.date: 07/31/2020
---

# Troubleshoot registry performance

This article helps you troubleshoot common problems with the performance of an Azure container registry. 

## Symptoms

* Push or pull images with the Docker CLI takes longer than expected
* Deployment of images to a service such as Azure Kubernetes Service takes longer than expected
* Concurrent push or pull operations appear throttled
* Push operation in geo-replicated registry fails with error `Error writing blob` or `Error writing manifest`

## Causes

* Your network upload or download speed may be slow - [solution](#check-network-speed)
* xxxx - [solution](#solution)
* xxxx - [solution](#solution)
* xxxx - [solution](#solution)

If you don't resolve your problem here, see [Next steps](#next-steps) for other options.

## Potential solutions

### Check network speed

Test the upload or download speed from your environment to Azure Storage

xxx

Related links:

* [Container registry FAQ](container-registry-faq.md)
* [Performance and scalability targets for Azure blob storage](../storage/blobs/scalability-targets.md)

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


