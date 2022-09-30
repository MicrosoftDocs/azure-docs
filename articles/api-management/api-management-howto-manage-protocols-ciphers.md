---
title: Manage protocols and ciphers in Azure API Management | Microsoft Docs
description: Learn how to manage protocols (TLS) and ciphers (DES) in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 09/07/2021
ms.author: danlep
---

# Manage protocols and ciphers in Azure API Management

Azure API Management supports multiple versions of Transport Layer Security (TLS) protocol for:
* Client side
* Backend side
* The 3DES cipher

This guide shows you how to manage protocols and ciphers configuration for an Azure API Management instance.

![Manage protocols and ciphers in APIM](./media/api-management-howto-manage-protocols-ciphers/api-management-protocols-ciphers.png)

## Prerequisites

* An API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).

## How to manage TLS protocols and 3DES cipher

1. Navigate to your **API Management instance** in the Azure portal.
1. Scroll to the **Security** section in the side menu.
1. Under the Security section, select **Protocols + ciphers**.  
1. Enable or disable desired protocols or ciphers.
1. Click **Save**. Changes will be applied within an hour.  

> [!NOTE]
> Some protocols or cipher suites (like backend-side TLS 1.2) can't be enabled or disabled from the Azure portal. Instead, you'll need to apply the REST call. Use the `properties.customProperties` structure in the [Create/Update API Management Service REST API](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) article.

## Next steps

* Learn more about [TLS](/dotnet/framework/network-programming/tls).
