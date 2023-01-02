---
title: "include file"
description: "include file"
services: storage
author: normesta
ms.service: storage
ms.topic: "include"
ms.date: 11/04/2021
ms.author: normesta
ms.custom: "include file"
---

Static websites have some limitations. For example, If you want to configure headers, you'll have to use Azure Content Delivery Network (Azure CDN). There's no way to configure headers as part of the static website feature itself. Also, AuthN and AuthZ are not supported. 

If these features are important for your scenario, consider using [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/). It's a great alternative to static websites and is also appropriate in cases where you don't require a web server to render content. You can configure headers and  AuthN / AuthZ is fully supported. Azure Static Web Apps also provides a fully managed continuous integration and continuous delivery (CI/CD) workflow from GitHub source to global deployment.
