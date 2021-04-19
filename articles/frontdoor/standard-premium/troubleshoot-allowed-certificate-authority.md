---
title: 'Allowed certificate authorities for Azure Front Door Standard/Premium (Preview)'
description: This article lists all the certificate authorities allowed when you create your own certificate.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: troubleshooting
ms.date: 02/18/2021
ms.author: qixwang
---

# Allowed certificate authorities for Azure Front Door Standard/Premium (Preview)

When you enable the HTTPS feature using your own certificate for an Azure Front Door Standard/Premium custom domain. You need an allowed certificate authority (CA) to create your TLS/SSL certificate. Otherwise, if you use a non-allowed CA or a self-signed certificate, your request will be rejected.

[!INCLUDE [cdn-front-door-allowed-ca](../../../includes/cdn-front-door-allowed-ca.md)]
