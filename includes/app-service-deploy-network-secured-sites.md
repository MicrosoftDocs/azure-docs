---
title: "include file"
description: "include file"
services: app-service
author: jasonfreeberg
ms.service: app-service
ms.topic: "include"
ms.date: 08/27/2021
ms.author: jafreebe
ms.custom: "include file"
---


Depending on your web apps's networking configuration, direct access to the site from your local environment may be blocked. To deploy your code in this scenario, you can publish your ZIP to a storage system accessible from the web app and trigger the app to *pull* the ZIP from the storage location, instead of *pushing* the ZIP to the web app. See [this article on deploying to network secured web apps](https://azure.github.io/AppService/2021/03/01/deploying-to-network-secured-sites-2.html) for more information. 
