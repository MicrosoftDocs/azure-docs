---
title: include file
description: include file
services: app-service
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 06/11/2018
ms.author: cephalin
ms.custom: include file
---
 
If Python encounters an error while starting your application, only a simple error page will be returned (e.g. "The page cannot be displayed because an internal server error has occurred.").

To capture Python application errors:

1. In the Azure portal, in your web app, select **Settings**.
2. On the **Settings** tab, select **Application settings**.
3. Under **App settings**, enter the following key/value pair:
    * Key : WSGI_LOG
    * Value : D:\home\site\wwwroot\logs.txt (enter your choice of file name)

You should now see errors in the logs.txt file in the wwwroot folder.
