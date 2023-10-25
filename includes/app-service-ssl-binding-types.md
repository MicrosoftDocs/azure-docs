---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 01/09/2023
ms.author: cephalin
ms.custom: "include file"
---

| Setting | Description |
|-|-|
| Custom domain | The domain name to add the TLS/SSL binding for. |
| Private Certificate Thumbprint | The certificate to bind. |
| TLS/SSL Type | - **[SNI SSL](https://en.wikipedia.org/wiki/Server_Name_Indication)**: Multiple SNI SSL bindings may be added. This option allows multiple TLS/SSL certificates to secure multiple domains on the same IP address. Most modern browsers (including Internet Explorer, Chrome, Firefox, and Opera) support SNI (for more information, see [Server Name Indication](https://wikipedia.org/wiki/Server_Name_Indication)).<br />- **IP SSL**: Only one IP SSL binding may be added. This option allows only one TLS/SSL certificate to secure a dedicated public IP address. After you configure the binding, follow the steps in [2. Remap records for IP based SSL](../articles/app-service/configure-ssl-bindings.md#2-remap-records-for-ip-based-ssl).<br/>IP SSL is supported only in **Standard** tier or above. |

