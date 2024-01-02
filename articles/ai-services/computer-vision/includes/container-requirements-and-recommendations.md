---
title: Container requirements and recommendations
titleSuffix: Azure AI services
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-vision
ms.topic: include
ms.date: 04/09/2021
ms.author: aahi
---

> [!NOTE]
> The requirements and recommendations are based on benchmarks with a single request per second, using a 523-KB image of a scanned business letter that contains 29 lines and a total of 803 characters. The recommended configuration resulted in approximately 2x faster response compared with the minimum configuration.

The following table describes the minimum and recommended allocation of resources for each Read OCR container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| Read 3.2 2022-04-30 | 4 cores, 8-GB memory  | 8 cores, 16-GB memory |
| Read 3.2 2021-04-12 | 4 cores, 16-GB memory | 8 cores, 24-GB memory |

* Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.
