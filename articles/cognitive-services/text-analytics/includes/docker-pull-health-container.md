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

Fill out and submit the [Cognitive Services containers request form](https://aka.ms/csgate) to request access to the container.
The form requests information about you, your company, and the user scenario for which you'll use the container. After you've submitted the form, the Azure Cognitive Services team reviews it to ensure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> * On the form, you must use an email address associated with an Azure subscription ID.
> * The Azure resource you use to run the container must have been created with the approved Azure subscription ID. 
> * Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft.

Use the docker login command with credentials provided in your onboarding email to connect to our private container registry for Cognitive Services containers.


```Docker
docker login containerpreview.azurecr.io -u <username> -p <password>
```

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download this container image from our private container registry.

```
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-healthcare:latest
```
