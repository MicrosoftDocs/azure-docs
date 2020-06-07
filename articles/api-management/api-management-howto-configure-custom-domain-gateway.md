---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Configure a custom domain name for your self-hosted Azure API Management gateway | Microsoft Docs
description: This topic describes the steps for configuring a custom domain name for self-hosted Azure API Management gateway.
services: api-management
documentationcenter: ''
author: vladvino
manager: gwallace
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 03/31/2020
ms.author: apimpm
---

# Configure a custom domain name

When you provision a [self-hosted Azure API Management gateway](self-hosted-gateway-overview.md) it is not assigned host name and has to be referenced by its IP address. This article shows how to map an existing custom DNS name (also referred to as hostname) a self-hosted gateway.

## Prerequisites

To perform the steps described in this article, you must have:

-   An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

-   An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
- A self-hosted gateway. For more information, see [How to provision self-hosted gateway](api-management-howto-provision-self-hosted-gateway.md)
-   A custom domain name that is owned by you or your organization. This topic does not provide instructions on how to procure a custom domain name.
-   A DNS record hosted on a DNS server that maps the custom domain name to the self-hosted gateway's IP address. This topic does not provide instructions on how to host a DNS record.
-   You must have a valid certificate with a public and private key (.PFX). Subject or subject alternative name (SAN) has to match the domain name (this enables API Management instance to securely expose URLs over TLS).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Add custom domain certificate to your API Management service

1. Select **Certificates** from under **Security**.
2. Select **+ Add**.
3. Enter a resource name for the certificate into **ID** field.
4. Select the file containing the certificate (.PFX) by selecting the **Certificate** field or the folder icon adjacent to it.
5. Enter the password for the certificate into the **Password** field.
6. Select **Create** to add the certificate to your API Management service.

## Use the Azure portal to set a custom domain name for your self-hosted gateway

1. Select the **Gateways** from under **Settings**.
2. Select the self-hosted gateway you want to configure the domain name for.
3. Select **Hostnames** under **Settings**.
4. Select **+ Add**
5. Enter resource name for the hostname into the **Name** field.
6. Enter domain name in the **Hostname** field.
7. Select a certificate from the **Certificate** dropdown.
8. Select **Negotiate client certificate** checkbox if any of the APIs exposed via this gateway use client certificate authentication.
    > [!WARNING]
    > This setting is shared by all domain names configured for the gateway.
9. Select **Add** to assign the custom domain name to the selected self-hosted gateway.

## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)
