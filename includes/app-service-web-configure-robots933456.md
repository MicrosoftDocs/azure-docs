---
title: "Include file"
description: "Include file"
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: "include"
ms.date: 03/02/2020
ms.author: cephalin
ms.custom: "include file"
---

## Ignore the robots933456 message in logs

You might see the following message in the container logs:

```
2019-04-08T14:07:56.641002476Z "-" - - [08/Apr/2019:14:07:56 +0000] "GET /robots933456.txt HTTP/1.1" 404 415 "-" "-"
```

You can safely ignore this message. `/robots933456.txt` is a dummy URL path that App Service uses to check if the container is capable of serving requests. A 404 response indicates that the path doesn't exist, and it signals to App Service that the container is healthy and ready to respond to requests.
