---
title: Migrating from the v2 read container to v3
titleSuffix: Azure Cognitive Services
description: Learn how to migrate to the v3 Read container  
services: cognitive-services 
author: aahill
manager: nitinme
ms.service: cognitive-services 
ms.subservice: computer-vision 
ms.topic: overview
ms.date: 08/31/2020
ms.author: aahi
---

# Migrate to the Read v3.x container

If you're using version 2 of the Computer Vision Read container, this article will help you upgrade your application to use version 3.x. 

Use this article to learn about 

## Configuration changes

* `ReadEngineConfig:ResultExpirationPeriod` is no longer supported. The Read container has a built Chron job that removes the results and metadata associated with a request after 48 hours.
* `Cache:Redis:Configuration` is no longer supported. The Cache is not used in the v3.x containers, so you do not need to set it.

## API changes

The Read v3.x containers use version 3 of the Computer Vision API and have the following endpoints:

:::image type="content" source="media/container-endpoints.png" alt-text="Read container endpoints.":::

See the [Computer Vision v3 API migration guide](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/upgrade-api-versions) for detailed information on updating your applications.

## Memory requirements

The requirements and recommendations are based on benchmarks with a single request per second, using an 8-MB image of a scanned business letter that contains 29 lines and a total of 803 characters. The following table describes the minimum and recommended allocation of resources for each Read container.

|Container  |Minimum | Recommended  |
|---------|---------|------|
|Read 3.0     | 8 cores, 16-GB memory         | 8 cores, 24-GB memory
|Read 3.1 | 8 cores, 16-GB memory         | 8 cores, 24-GB memory

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the docker run command.

## Storage implementations

>[!NOTE]
> MongoDB is no longer supported in 3.x versions of the container. Instead, the containers support Azure Storage and offline file systems.

| Implementation |	Required runtime argument(s) |
|---------|---------|
|In-memory (default) |	No runtime arguments required. |
|File level	| `Mounts:Shared` directory exists. |
|Azure Blob	| `Storage:ObjectStore:AzureBlob:ConnectionString={AzureStorageConnectionString}` |

For added redundancy the Read v3.x container uses an invisibility timer to ensure requests can be successfully processed in the event of a crash, when running in a multi-container set-up. 

Set the timer with `Queue:Azure:QueueVisibilityTimeoutInMilliseconds`, which sets the time for a message to be invisible when another worker is processing it  

| Default value | Recommended value |
|---------|---------|
| 30000 |	120000 |

To avoid pages from being redundantly processed, we recommend setting the invisible timeout period to 120 seconds. The default value is 30 seconds.

