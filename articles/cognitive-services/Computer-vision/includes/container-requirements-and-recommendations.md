---
title: Container requirements and recommendations.
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 8/26/2019
ms.author: dapine
---

The following table describes the minimum and recommended CPU cores and memory to allocate for each Recognize Text container.

| Container | Minimum | Recommended |TPS<br>(Minimum, Maximum)|
|-----------|---------|-------------|--|
|Recognize Text|1 core, 8-GB memory, 0.5 TPS|2 cores, 8-GB memory, 1 TPS|0.5, 1|

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* TPS - transactions per second

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.