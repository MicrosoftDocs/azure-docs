---
title: Manage protocols and ciphers in Azure API Management | Microsoft Learn
description: Learn how to manage transport layer security (TLS) protocols and cipher suites in Azure API Management.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 08/04/2025
ms.author: danlep
---

# Manage protocols and ciphers in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Azure API Management supports multiple versions of Transport Layer Security (TLS) protocol to secure API traffic for:

* Client side (client to API Management gateway)
* Backend side (API Management gateway to backend)

API Management also supports multiple cipher suites used by the API gateway.

Depending on the service tier, API Management supports TLS versions up to 1.2 or TLS 1.3 for client and backend connectivity and several supported cipher suites. This guide shows you how to manage protocols and ciphers configuration for an Azure API Management instance.

:::image type="content" source="media/api-management-howto-manage-protocols-ciphers/api-management-protocols-ciphers.png" alt-text="Screenshot of managing protocols and ciphers in the Azure portal.":::

> [!NOTE]
> * If you're using the self-hosted gateway, see [self-hosted gateway security](self-hosted-gateway-overview.md#security) to manage TLS protocols and cipher suites.
> * The following tiers don't support changes to the default cipher configuration: **Consumption**, **Basic v2**, **Standard v2**, **Premium v2**. 
> * In [workspaces](workspaces-overview.md), the managed gateway doesn't support changes to the default protocol and cipher configuration.

## Prerequisites

* An API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## How to manage TLS protocols and cipher suites

1. In the left navigation of your API Management instance, under **Security**, select **Protocols + ciphers**.  
1. Enable or disable desired protocols or ciphers.
1. Select **Save**.

Changes can take 15 to 45 minutes or longer to apply. An instance in the Developer service tier has downtime during the process. Instances in the Basic and higher tiers don't have downtime during the process.  

> [!NOTE]
> Some protocols or cipher suites (such as backend-side TLS 1.2) can't be enabled or disabled from the Azure portal. Instead, you'll need to apply the REST API call. Use the `properties.customProperties` structure in the [Create/Update API Management Service](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) REST API.

## TLS 1.3 support


<!-- Questions:

1. In v1/Consumption tiers, is TLS 1.2 also enabled by default, or is it only TLS 1.3?
2. Is TLS 1.3 supported in v2 tiers for client-side and backend-side connections?
3. What ciphers are supported in TLS 1.3? Any user configuration possible?
4. Can TLS 1.3 be enabled/disabled via REST API 
5. On backend side, is TLS 1.2 also enabled by default? 
6. Is TLS 1.3 also supported in workspace gateways?     -->

TLS 1.3 support is available in the API Management **Consumption**, **Developer**, **Basic**, **Standard**, and **Premium** service tiers. In most instances created in those service tiers, TLS 1.3 is enabled by default for client-side connections. Enabling backend-side TLS 1.3 is optional.

TLS 1.3 is a major revision of the TLS protocol that provides improved security and performance. It includes features such as reduced handshake latency and improved security against certain types of attacks.

### Optionally enable TLS 1.3 when clients require certificate renegotiation

If your API Management service is detected to have received TLS connections that require certificate renegotiation, enabling client-side TLS 1.3 in your instance is *optional*. TLS-compliant clients that require certificate renegotiation are not compatible with TLS 1.3. 

You can review the recent connections that required certificate renegotiation page and choose whether to enable TLS 1.3 for client-side connections:

1. On the **Protocols + ciphers** page, in the **Client protocol** section, next to **TLS 1.3**, select **View and manage configuration**.
1. Review the list of **Recent client certificate renegotiations**. The list shows API operations where clients recently used client certificate renegotiation.
1. If you choose to enable TLS 1.3 for client-side connections, select **Enable**.
1. Select **Close**.

> [!WARNING]
> * If your APIs are accessed by TLS-compliant clients that rely on certificate renegotiation, enabling TLS 1.3 for client-side connections will cause those clients to fail to connect. 
> * We recommend carefully monitoring the **Recent client certificate renegotiations** list both before and after enabling TLS 1.3 for client-side connections.
> * After enabling TLS 1.3, review gateway request metrics or TLS-related exceptions in Application Insights that indicate TLS connection failures. If necessary, disable TLS 1.3 for client-side connections and downgrade to TLS 1.2.

### Optionally disable TLS 1.3 

If you need to disable TLS 1.3 for client-side connections, you can do so from the **Protocols + ciphers** page:

1. On the **Protocols + ciphers** page, in the **Client protocol** section, next to **TLS 1.3**, select **View and manage configuration**.
1. Select **Disable**.
1. Select **Close**.

### Backend-side TLS 1.3

Enabling backend-side TLS 1.3 is optional. If you enable it, API Management will use TLS 1.3 for connections to your backend services that support it.

You can enable backend-side TLS 1.3 from the **Protocols + ciphers** page:    

1. On the **Protocols + ciphers** page, in the **Backend protocol** section, enable the **TLS 1.3** setting.
1. Select **Save**.

## Related content

* For recommendations on securing your API Management instance, see [Azure security baseline for API Management](/security/benchmark/azure/baselines/api-management-security-baseline).
* Learn about security considerations in the API Management [Architecture best practices for API Management](/azure/well-architected/service-guides/azure-api-management#).
* Learn more about [TLS](/dotnet/framework/network-programming/tls).
