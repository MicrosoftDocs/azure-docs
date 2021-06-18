---
title: Container requirements and recommendations
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/09/2021
ms.author: aahi
---

> [!NOTE]
> The requirements and recommendations are based on benchmarks with a single request per second, using an 8-MB image of a scanned business letter that contains 29 lines and a total of 803 characters.

The following table describes the minimum and recommended allocation of resources for each Read OCR container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| Read 2.0-preview | 1 core, 8-GB memory |    8 cores, 16-GB memory |
| Read 3.2 | 8 cores, 16-GB memory | 8 cores, 24-GB memory |

* Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.
