---
title: Run container example of docker run command
titleSuffix: Azure Cognitive Services
description: Docker run command for Sentiment Analysis container
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/25/2020
ms.author: aahi
---

To run the *Sentiment Analysis v2* container, execute the following `docker run` command.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/sentiment \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a *Sentiment Analysis* container from the container image
* Allocates one CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.