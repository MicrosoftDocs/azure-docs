---
title: Migrating to the Read v3.x containers
titleSuffix: Azure AI services
description: Learn how to migrate to the v3 Read OCR containers
services: cognitive-services 
author: aahill
manager: nitinme
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 09/28/2021
ms.author: aahi
ms.custom: cogserv-non-critical-vision
---

# Migrate to the Read v3.x OCR containers

If you're using version 2 of the Azure AI Vision Read OCR container, Use this article to learn about upgrading your application to use version 3.x of the container. 


## Configuration changes

* `ReadEngineConfig:ResultExpirationPeriod` is no longer supported. The Read OCR container has a built Cron job that removes the results and metadata associated with a request after 48 hours.
* `Cache:Redis:Configuration` is no longer supported. The Cache isn't used in the v3.x containers, so you don't need to set it.

## API changes

The Read v3.2 container uses version 3 of the Azure AI Vision API and has the following endpoints:

* `/vision/v3.2/read/analyzeResults/{operationId}`
* `/vision/v3.2/read/analyze`
* `/vision/v3.2/read/syncAnalyze`

See the [Azure AI Vision v3 REST API migration guide](./upgrade-api-versions.md) for detailed information on updating your applications to use version 3 of cloud-based Read API. This information applies to the container as well. Sync operations are only supported in containers.

## Memory requirements

The requirements and recommendations are based on benchmarks with a single request per second, using a 523-KB image of a scanned business letter that contains 29 lines and a total of 803 characters. The following table describes the minimum and recommended allocations of resources for each Read OCR container.

|Container  |Minimum | Recommended  |
|---------|---------|------|
|Read 3.2 **2022-04-30** | 4 cores, 8-GB memory | 8 cores, 16-GB memory |

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the docker run command.

## Storage implementations

>[!NOTE]
> MongoDB is no longer supported in 3.x versions of the container. Instead, the containers support Azure Storage and offline file systems.

| Implementation |    Required runtime argument(s) |
|---------|---------|
|File level (default)    | No runtime arguments required. `/share` directory will be used. |
|Azure Blob    | `Storage:ObjectStore:AzureBlob:ConnectionString={AzureStorageConnectionString}` |

## Queue implementations

In v3.x of the container, RabbitMQ is currently not supported. The supported backing implementations are:

| Implementation | Runtime Argument(s) | Intended use |
|---------|---------|-------|
| In Memory (default) | No runtime arguments required. | Development and testing |
| Azure Queues | `Queue:Azure:ConnectionString={AzureStorageConnectionString}` | Production |
| RabbitMQ    | Unavailable | Production |

For added redundancy, the Read v3.x container uses a visibility timer to ensure requests can be successfully processed if a crash occurs when running in a multi-container setup. 

Set the timer with `Queue:Azure:QueueVisibilityTimeoutInMilliseconds`, which sets the time for a message to be invisible when another worker is processing it. To avoid pages from being redundantly processed, we recommend setting the timeout period to 120 seconds. The default value is 30 seconds.

| Default value | Recommended value |
|---------|---------|
| 30000 |    120000 |


## Next steps

* Review [Configure containers](computer-vision-resource-container-config.md) for configuration settings
* Review [OCR overview](overview-ocr.md) to learn more about recognizing printed and handwritten text
* Refer to the [Read API](//westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](FAQ.yml) to resolve issues related to Azure AI Vision functionality.
* Use more [Azure AI containers](../cognitive-services-container-support.md)
