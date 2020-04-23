---
title: Allowed CA for enabling custom HTTPS on Azure CDN
description: If you are using your own certificate to enable HTTPS on a custom domain, you must use an allowed certificate authority (CA) to create it.  
services: cdn
documentationcenter: ''
author: asudbring
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2018
ms.author: allensu
ms.custom: mvc

---

# Allowed certificate authorities for enabling custom HTTPS on Azure CDN

You must meet specific certificate requirements when you [enable the HTTPS feature by using your own certificate](cdn-custom-ssl.md?tabs=option-2-enable-https-with-your-own-certificate#tlsssl-certificates) for an Azure Content Delivery Network (CDN) custom domain. The **Azure CDN Standard from Microsoft** profile requires a certificate from one of the approved certificate authorities (CA) in the following list. If a certificate from an unapproved CA or if a self-signed certificate is used, the request is rejected. **Azure CDN Standard from Verizon** and **Azure CDN Premium from Verizon** profiles accept any valid certificate from any valid CA.

> [!NOTE]
> The option of using your own certificate to enable the custom domain HTTPS feature is *not* available for **Azure CDN Standard from Akamai** profiles. 
>

[!INCLUDE [cdn-front-door-allowed-ca](../../includes/cdn-front-door-allowed-ca.md)]

