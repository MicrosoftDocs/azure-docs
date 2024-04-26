---
title: Enforce a minimum TLS version for requests to an Azure Event Grid topic, domain, or subscription
description: Configure an Azure Event Grid topic or domain to require a minimum version of Transport Layer Security (TLS) for clients making requests against the topic, domain, or subscription.
ms.service: event-grid
ms.topic: how-to
ms.date: 01/22/2024
ms.author: spelluru
author: spelluru
---

# Enforce a minimum required version of Transport Layer Security (TLS) for an Event Grid topic, domain, or subscription

Communication between a client application and an Azure Grid topic, domain, or subscription is encrypted using Transport Layer Security (TLS). For information about TLS in general, see [Transport Layer Security](https://datatracker.ietf.org/wg/tls/about/).

Azure Event Grid supports choosing a specific TLS version for topics, domains, or subscriptions (when using a Web Hook destination). Currently Azure Event Grid uses TLS 1.2 on public endpoints by default, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

Azure Event Grid topics or domains permit clients to send and receive data with TLS 1.0 and above. To enforce stricter security measures, you can configure your Event Grid topic or domain to require that clients send and receive data with a newer version of TLS. If an Event Grid topic or domain requires a minimum version of TLS, then any requests made with an older version fail. 

When creating a Web Hook event subscription, you can configure it to use the same TLS version as the topic or explicitly specify the minimum TLS version. If you do so, Event Grid will fail to deliver events to a Web Hook that doesn't support the minimum version of TLS or above.

> [!IMPORTANT]
> If the client is a service, ensure that the service uses the appropriate version of TLS to send requests to Event Grid before you set the required minimum version for an Event Grid topic or domain.

## Permissions necessary to require a minimum version of TLS

To set the  `MinimumTlsVersion`  property for the Event Grid topic or domain, a user must have permissions to create and manage Event Grid topics or domains. Azure role-based access control (Azure RBAC) roles that provide these permissions include the  **Microsoft.EventGrid/topics/write**  action or **Microsoft.EventGrid/domains/write** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../role-based-access-control/built-in-roles.md#contributor) role
- The [Azure Event Grid Contributor](../role-based-access-control/built-in-roles.md#eventgrid-contributor) role

Role assignments must be scoped to the level of the Event Grid topic (or domain) or at a higher level to permit a user to require a minimum version of TLS for the Event Grid topic or domain. For more information about role scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create an Event Grid topic or domain, or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [**Owner**](../role-based-access-control/built-in-roles.md#owner) role. The  **Owner**  role includes all actions, so a user with one of these administrative roles can also create and manage Event Grid topics or domains. For more information, see [**Azure roles, Microsoft Entra roles, and classic subscription administrator roles**](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

## Network considerations

When a client sends a request to an Event Grid topic or domain, the client establishes a connection with the Event Grid topic or domain endpoint first, before processing any requests. The minimum TLS version setting is checked after the TLS connection is established. If the request uses an earlier version of TLS than that specified by the setting, the connection continues to succeed, but the request will eventually fail.

Here are a few important points to consider:

- A network trace would show the successful establishment of a TCP connection and successful TLS negotiation, before a 401 is returned if the TLS version used is less than the minimum TLS version configured.
- Penetration or endpoint scanning on `<TOPICorDOMAIN>.<REGION>.eventgrid.azure.net` will indicate the support for TLS 1.0, TLS 1.1, and TLS 1.2, as the service continues to support all these protocols. The minimum TLS version, enforced at the topic or domain level, indicates what the lowest TLS version the topic or domain supports.

## Next steps

See the following article for more information: [Configure the minimum TLS version for an Event Grid topic or domain](transport-layer-security-configure-minimum-version.md)
