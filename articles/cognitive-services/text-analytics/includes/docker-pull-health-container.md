---
title: Docker pull for the health container
titleSuffix: Azure Cognitive Services
description: Docker pull command for Text Analytics for health container
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 07/07/2020
ms.author: aahi
---

Fill out and submit the [Cognitive Services containers request form](https://aka.ms/cognitivegate) to request access to the container.

[!INCLUDE [Request access to the container registry](../../../../includes/cognitive-services-containers-request-access-only.md)]

Use the docker login command with credentials provided in your onboarding email to connect to our private container registry for Cognitive Services containers.

```bash
docker login containerpreview.azurecr.io -u <username> -p <password>
```

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download this container image from our private container registry.

```
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-healthcare:latest
```
