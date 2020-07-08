---
title: Docker pull for the Sentiment Analysis container
titleSuffix: Azure Cognitive Services
description: Docker pull command for Sentiment Analysis container
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

#### Docker pull for the Sentiment Analysis v3 container

The sentiment analysis container v3 container is available in several languages. To download the container for the English container, use the command below. 

```
docker pull mcr.microsoft.com/azure-cognitive-services/sentiment:3.0-en
```

To download the container for another language, replace `en` with one of the language codes below. 

| Text Analytics Container | Language code |
|--|--|
| English | `en` |
| Spanish | `es` |
| French | `fr` |
| Italian | `it` |
| German | `de` |
| Chinese - simplified | `zh` |
| Chinese - traditional | `zht` |
| Japanese | `ja` |
| Portuguese | `pt` |
| Dutch | `nl` |

For a full description of available tags for the Text Analytics containers, see [Docker Hub](https://go.microsoft.com/fwlink/?linkid=2018654).