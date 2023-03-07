---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Configure a custom domain name for your self-hosted Azure API Management gateway | Microsoft Docs
description: This topic describes the steps for configuring a custom domain name for self-hosted Azure API Management gateway.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/31/2020
ms.author: danlep
---

# Configure a custom domain name for a self-hosted gateway

When you provision a [self-hosted Azure API Management gateway](self-hosted-gateway-overview.md), it is not assigned a host name and has to be referenced by its IP address. This article shows how to map an existing custom DNS name (also referred to as hostname) to a self-hosted gateway.

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

To perform the steps described in this article, you must have:

-   An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

-   An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
- A self-hosted gateway. For more information, see [How to provision self-hosted gateway](api-management-howto-provision-self-hosted-gateway.md)
-   A custom domain name that is owned by you or your organization. This topic does not provide instructions on how to procure a custom domain name.
-   A DNS record hosted on a DNS server that maps the custom domain name to the self-hosted gateway's IP address. This topic does not provide instructions on how to host a DNS record.
-   You must have a valid certificate with a public and private key (.PFX). The subject or subject alternative name (SAN) has to match the domain name (this enables the API Management instance to securely expose URLs over TLS).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Add custom domain certificate to your API Management service

Add a custom domain certificate (.PFX) file to your API Management instance, or reference a certificate stored in Azure Key Vault. Follow steps in [Secure backend services using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md).

> [!NOTE]
> We recommend using a key vault certificate for the self-hosted gateway domain.

## Use the Azure portal to set a custom domain name for your self-hosted gateway

1. Select the **Gateways** from under **Deployment and infrastructure**.
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

> [!NOTE]
> If clients connecting to the self-hosted gateway using the custom domain expect to be presented with all intermediate certificates in the chain, you must upload individual CA certificates to your API Management Service and associate them with the self-hosted gateway. For instructions on how to achieve this, see [Create custom CA for self-hosted gateway](api-management-howto-ca-certificates.md#create-custom-ca-for-self-hosted-gateway) .
## Next steps

[Upgrade and scale your service](upgrade-and-scale.md)
