---
title: Manage Protocols and Ciphers in Azure API Management
description: Learn how to manage transport layer security (TLS) protocols and cipher suites in Azure API Management.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 01/06/2026
ms.author: danlep
---

# Manage protocols and ciphers in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Azure API Management supports multiple versions of Transport Layer Security (TLS) protocol to secure API traffic for:

* Client side (client to API Management gateway)
* Backend side (API Management gateway to backend)

API Management also supports multiple cipher suites used by the API gateway.

API Management supports TLS versions up to TLS 1.3 for client and backend connectivity and several supported cipher suites. This guide shows you how to manage protocols and ciphers configuration for an Azure API Management instance.

:::image type="content" source="media/api-management-howto-manage-protocols-ciphers/api-management-protocols-ciphers.png" alt-text="Screenshot of managing protocols and ciphers in the Azure portal.":::

> [!NOTE]
> * If you're using the self-hosted gateway, see [self-hosted gateway security](self-hosted-gateway-overview.md#security) to manage TLS protocols and cipher suites.
> * The following tiers don't support changes to the default cipher configuration: **Consumption**, **Basic v2**, **Standard v2**, **Premium v2**. 
> * In [workspaces](workspaces-overview.md), the managed gateway doesn't support changes to the default protocol and cipher configuration.

> [!NOTE]
> Depending on the API Management service tier, changes can take 15 to 45 minutes or longer to apply. An instance in the Developer service tier has downtime during the process. Instances in the Basic and higher tiers don't have downtime during the process.  

## Prerequisites

* An API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## How to manage TLS protocols and cipher suites

1. In the sidebar menu of your API Management instance, under **Security**, select **Protocols + ciphers**.  
1. Enable or disable desired protocols or ciphers.
1. Select **Save**.

> [!NOTE]
> Some protocols or cipher suites (such as backend-side TLS 1.2) can't be enabled or disabled from the Azure portal. Instead, you'll need to apply the REST API call. Use the `properties.customProperties` structure in the [Create/Update API Management Service](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) REST API.

## TLS 1.3 support

TLS 1.3 support is available in all API Management service tiers. In most instances created in those service tiers, TLS 1.3 is permanently enabled by default for client-side connections. Enabling backend-side TLS 1.3 is optional. TLS 1.2 is also enabled by default on both client and backend sides.

TLS 1.3 is a major revision of the TLS protocol that provides improved security and performance. It includes features such as reduced handshake latency and improved security against certain types of attacks.

### Optionally enable TLS 1.3 when clients require certificate renegotiation

TLS 1.3 doesn't support certificate renegotiation. Certificate renegotiation in TLS allows client and server to renegotiate connection parameters mid-session for authentication without terminating the connection.

API Management instances that are detected as reliant on client certificate renegotiation do not have TLS 1.3 enabled by default. In these instances, you can choose to enable TLS 1.3 manually. 

> [!WARNING]
> If your APIs are accessed by TLS-compliant clients that rely on certificate renegotiation, enabling TLS 1.3 for client-side connections will cause those clients to fail to connect. Review APIs that recently used certificate renegotiation before enabling client-side TLS 1.3 in any service that doesn't have it enabled by default.

To enable TLS 1.3 for client-side connections in these instances, configure settings on the **Protocols + ciphers** page:

1. On the **Protocols + ciphers** page, in the **Client protocol** section, next to **TLS 1.3**, select **View and manage configuration**.
1. Review the list of **Recent client certificate renegotiations**. The list shows API operations where clients recently used client certificate renegotiation.
1. If you choose to enable TLS 1.3 for client-side connections, under **Change TLS 1.3 status**, select **Enable**.
1. Select **Close**.

After enabling TLS 1.3, review gateway request metrics or TLS-related exceptions in logs that indicate TLS connection failures. If necessary, disable TLS 1.3 for client-side connections and downgrade to TLS 1.2.

If you need to disable TLS 1.3 for client-side connections in these instances, configure settings on the **Protocols + ciphers** page:

1. On the **Protocols + ciphers** page, in the **Client protocol** section, next to **TLS 1.3**, select **View and manage configuration**.
1. Under **Change TLS 1.3 status**, elect **Disable**.
1. Select **Close**.

### Backend-side TLS 1.3

Enabling backend-side TLS 1.3 is optional. If you enable it, API Management uses TLS 1.3 for connections to your backend services.

> [!WARNING]
> Enabling TLS 1.3 for backend-side connections will cause connection failures with backend services that rely on client certificate renegotiation between API Management and the backends.

You can enable backend-side TLS 1.3 from the **Protocols + ciphers** page:    

1. On the **Protocols + ciphers** page, in the **Backend protocol** section, next to **TLS 1.3**, select **View and manage configuration**.
1. Under **Change TLS 1.3 status**, select **Enable**.
1. Select **Save**.

## Related content

* For recommendations on securing your API Management instance, see [Azure security baseline for API Management](/security/benchmark/azure/baselines/api-management-security-baseline).
* Learn about security considerations in the API Management [Architecture best practices for API Management](/azure/well-architected/service-guides/azure-api-management#).
* Learn more about [TLS](/dotnet/framework/network-programming/tls).
