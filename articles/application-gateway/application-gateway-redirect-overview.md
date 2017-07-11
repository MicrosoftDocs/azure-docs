---
title: Redirect overview for Azure Application Gateway | Microsoft Docs
description: Learn about the redirect capability in Azure Application Gateway
services: application-gateway
documentationcenter: na
author: georgewallace
manager: timlt
editor: ''
tags: azure-resource-manager

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/10/2017
ms.author: gwallace

---

# Application Gateway redirect overview

Application gateway supports the ability to redirect traffic based on a defined configuration. This capability supports the following scenarios:

1. Redirect HTTP requests to an HTTPS listener
2. Redirect requests to a fixed url
3. Redirect requests under a given path

Redirects are configured on the rules defined on the application gateway. When using a basic rule the redirect configuration is associated with a listener.  When a path based rule is used, the redirect configuration is defined on the URL path map.

## HTTP status codes supported

Application gateway supports multiple status codes that are returned when redirecting traffic. The following table shows the current status codes that are configurable through application gateway when created redirects.

|Type  |Code  |Description  |
|---------|---------|---------|
|**Permanent**     | 301        | The requested resource has moved permanently and the client should use the returned URI.       |
|**Found**    | 302        | The requested resource has temporarily moved and the client should continue to use the current URI.         |
|**See Other**     | 303        | The response to the request is found at a different URI and should be retrieved using a GET method.       |
|**Temporary**    | 307        | The requested resource has temporarily moved and the client should continue to use the current URI.        |

## Next steps

Configure URL redirection on an application gateway