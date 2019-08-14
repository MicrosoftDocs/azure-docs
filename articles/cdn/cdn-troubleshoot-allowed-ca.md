---
title: Allowed certificate authorities for enabling custom HTTPS on Azure CDN | Microsoft Docs
description: If you are using your own certificate to enable HTTPS on a custom domain, you must use an allowed certificate authority (CA) to create it.  
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2018
ms.author: magattus
ms.custom: mvc

---

# Allowed certificate authorities for enabling custom HTTPS on Azure CDN

For an Azure Content Delivery Network (CDN) custom domain on an **Azure CDN Standard from Microsoft** endpoint, when you [enable the HTTPS feature by using your own certificate](cdn-custom-ssl.md?tabs=option-2-enable-https-with-your-own-certificate#ssl-certificates), you must use an allowed certificate authority (CA) to create your SSL certificate. Otherwise, if you use a non-allowed CA or a self-signed certificate, your request will be rejected.

> [!NOTE]
> The option of using your own certificate to enable custom HTTPS is available only with **Azure CDN Standard from Microsoft** profiles. 
>

[!INCLUDE [cdn-front-door-allowed-ca](../../includes/cdn-front-door-allowed-ca.md)]

