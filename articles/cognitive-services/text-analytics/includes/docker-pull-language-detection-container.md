---
title: Docker pull for the Language Detection container
titleSuffix: Azure Cognitive Services
description: Docker pull command for Language Detection container
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 08/20/2019
ms.author: dapine
---

## Pull the Language Detection container

Container images for Text Analytics are available on the Microsoft Container Registry.

| Container | Container Registry / Repository / Image Name |
|-----------|------------|
| Language Detection | `mcr.microsoft.com/azure-cognitive-services/language` |

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry.

For a full description of available tags for the Text Analytics containers, see the [Language Detection](https://go.microsoft.com/fwlink/?linkid=2018759) container on the Docker Hub.


### Docker pull for the Language Detection container

```
docker pull mcr.microsoft.com/azure-cognitive-services/language:latest
```
