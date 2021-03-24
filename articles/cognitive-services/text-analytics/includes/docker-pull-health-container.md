---
title: Docker pull for the health container
titleSuffix: Azure Cognitive Services
description: Docker pull command for Text Analytics for health container
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 07/07/2020
ms.author: aahi
---

Fill out and submit the [Cognitive Services request form](https://aka.ms/csgate) to request access to the Text Analytics for health public preview.  This application applies for both the container and the hosted web API public preview.
The form requests information about you, your company, and the user scenario for which you'll use the container. After you've submitted the form, the Azure Cognitive Services team reviews it to ensure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> * On the form, you must use an email address associated with an Azure subscription ID.
> * The Text Analytics resource (billing endpoint and apikey) you use to run the container must have been created with the approved Azure subscription ID. 
> * Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft.

Once approved, use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download this container image from the Microsoft public container registry.

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:latest
```
