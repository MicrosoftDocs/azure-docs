---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: include
ms.custom: include file
ms.date: 09/27/2018
ms.author: diberry
---

1. Open Visual Studio 2017 Community edition.
1. Create a new **Console App (.Net Core)** project and name the project `QnaMakerQuickstart`. Accept the defaults for the remaining settings.
1. In the Solution Explorer, right-click on the project name, **QnaMakerQuickstart**, then select **Manage NuGet Packages...**.
1. In the NuGet window, select **Browser**, then search for **Newtonsoft.JSON** and install the package. This package is used to parse the JSON returned from the QnaMaker HTTP response. 