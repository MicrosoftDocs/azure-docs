---
title: Allowed CA for enabling custom HTTPS on Azure Front Door
description: If you're using your own certificate to enable HTTPS on an Azure Front Door custom domain, you must use an allowed certificate authority (CA) to create it.  
services: frontdoor
documentationcenter: ''
author: duongau

ms.assetid: 
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/30/2020
ms.author: duau

---

# Allowed certificate authorities for enabling custom HTTPS on Azure Front Door

When you [enable the HTTPS feature using your own certificate](front-door-custom-domain-https.md?tabs=option-2-enable-https-with-your-own-certificate) for an Azure Front Door custom domain. You need an allowed certificate authority (CA) to create your TLS/SSL certificate. Otherwise, if you use a non-allowed CA or a self-signed certificate, your request will be rejected.

[!INCLUDE [cdn-front-door-allowed-ca](../../includes/cdn-front-door-allowed-ca.md)]
