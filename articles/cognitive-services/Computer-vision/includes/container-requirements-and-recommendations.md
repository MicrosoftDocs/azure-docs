---
title: Container requirements and recommendations
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 09/18/2019
ms.author: dapine
---

> [!NOTE]
> The requirements and recommendations are based on benchmarks with a single request per second, using an 8-MB image of a scanned business letter that contains 29 lines and a total of 803 characters.

#### [Read](#tab/read)

The following table describes the minimum and recommended allocation of resources for each Read container.

| Container | Minimum | Recommended |TPS<br>(Minimum, Maximum)|
|-----------|---------|-------------|--|
| Read | 1 cores, 8-GB memory, 0.24 TPS | 8 cores, 16-GB memory, 1.17 TPS | 0.24, 1.17 |

#### [Recognize Text](#tab/recognize-text)

The following table describes the minimum and recommended allocation of resources for each Recognize Text container.

| Container | Minimum | Recommended |TPS<br>(Minimum, Maximum)|
|-----------|---------|-------------|--|
| Recognize Text | 1 core, 8-GB memory, 0.12 TPS | 8 cores, 16-GB memory, 0.60 TPS | 0.12, 0.60 |

***

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* TPS - transactions per second.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.
