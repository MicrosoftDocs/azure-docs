---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Use a Custom Domain Name for Self-Hosted Gateway
description: Learn how to configure a custom domain name for self-hosted Azure API Management gateway.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 09/30/2025
ms.author: danlep
---

# Configure a custom domain name for a self-hosted gateway

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

When you provision a [self-hosted Azure API Management gateway](self-hosted-gateway-overview.md), it isn't assigned a host name and must be referenced by its IP address. This article shows how to map an existing custom DNS name (also referred to as hostname) to a self-hosted gateway.

## Prerequisites

- An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

- An API Management instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).
- A self-hosted gateway. For more information, see [How to provision self-hosted gateway](api-management-howto-provision-self-hosted-gateway.md).
- A custom domain name that's owned by you or your organization. This article doesn't provide instructions on how to procure a custom domain name.
- A DNS record hosted on a DNS server that maps the custom domain name to the self-hosted gateway's IP address. This article doesn't provide instructions on how to host a DNS record.
- You must have a valid certificate with a public and private key (.PFX). The subject or subject alternative name (SAN) needs to match the domain name. This enables the API Management instance to securely expose URLs over TLS.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Add a custom domain certificate

Add a custom domain certificate (.PFX) file to your API Management instance, or reference a certificate stored in Azure Key Vault. Follow the steps in [Secure backend services by using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md).

> [!NOTE]
> We recommend using a key vault certificate for the self-hosted gateway domain.

## Set a custom domain name for your self-hosted gateway

1. In the Azure portal, select **Deployment + infrastructure** from the sidebar menu.
1. Select **Self-hosted gateways**, then choose the self-hosted gateway you want to configure the domain name for.
1. Under **Settings**, select **Hostnames**.
1. Select **+ Add**.
1. Enter a resource name for the hostname into the **Name** field.
1. Enter domain name in the **Hostname** field.
1. Select a certificate from the **Certificate** dropdown.
1. Select **Negotiate client certificate** checkbox if any of the APIs exposed via this gateway use client certificate authentication.
    > [!WARNING]
    > This setting is shared by all domain names configured for the gateway.
1. Select **Add** to assign the custom domain name to the selected self-hosted gateway.

> [!NOTE]
> If clients connecting to the self-hosted gateway using the custom domain expect to be presented with all intermediate certificates in the chain, you must upload individual CA certificates to your API Management Service and associate them with the self-hosted gateway. For instructions on how to achieve this, see [Create custom CA for self-hosted gateway](api-management-howto-ca-certificates.md#create-custom-ca-for-a-self-hosted-gateway).

## Related content

- [Upgrade and scale an Azure API Management instance](upgrade-and-scale.md)
