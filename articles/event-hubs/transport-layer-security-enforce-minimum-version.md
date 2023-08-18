---
title: Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Hubs namespace
titleSuffix: Azure Event Hubs
description: Configure a service bus namespace to require a minimum version of Transport Layer Security (TLS) for clients making requests against Azure Event Hubs.
services: event-hubs
author: EldertGrootenboer

ms.service: event-hubs
ms.topic: article
ms.date: 04/25/2022
ms.author: egrootenboer
---

# Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Hubs namespace

Communication between a client application and an Azure Event Hubs namespace is encrypted using Transport Layer Security (TLS). TLS is a standard cryptographic protocol that ensures privacy and data integrity between clients and services over the Internet. For more information about TLS, see [Transport Layer Security](https://datatracker.ietf.org/wg/tls/about/).

Azure Event Hubs supports choosing a specific TLS version for namespaces. Currently Azure Event Hubs uses TLS 1.2 on public endpoints by default, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

Azure Event Hubs namespaces permit clients to send and receive data with TLS 1.0 and above. To enforce stricter security measures, you can configure your Event Hubs namespace to require that clients send and receive data with a newer version of TLS. If an Event Hubs namespace requires a minimum version of TLS, then any requests made with an older version will fail.

> [!IMPORTANT]
> If you are using a service that connects to Azure Event Hubs, make sure that that service is using the appropriate version of TLS to send requests to Azure Event Hubs before you set the required minimum version for an Event Hubs namespace.

## Permissions necessary to require a minimum version of TLS

To set the  `MinimumTlsVersion`  property for the Event Hubs namespace, a user must have permissions to create and manage Event Hubs namespaces. Azure role-based access control (Azure RBAC) roles that provide these permissions include the  **Microsoft.EventHub/namespaces/write**  or  **Microsoft.EventHub/namespaces/\***  action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../role-based-access-control/built-in-roles.md#contributor) role
- The [Azure Event Hubs Data Owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner) role

Role assignments must be scoped to the level of the Event Hubs namespace or higher to permit a user to require a minimum version of TLS for the Event Hubs namespace. For more information about role scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create an Event Hubs namespace or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [**Owner**](../role-based-access-control/built-in-roles.md#owner) role. The  **Owner**  role includes all actions, so a user with one of these administrative roles can also create and manage Event Hubs namespaces. For more information, see [**Azure roles, Azure AD roles, and classic subscription administrator roles**](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

## Network considerations

When a client sends a request to an Event Hubs namespace, the client establishes a connection with the Event Hubs namespace endpoint first, before processing any requests. The minimum TLS version setting is checked after the TLS connection is established. If the request uses an earlier version of TLS than that specified by the setting, the connection will continue to succeed, but the request will eventually fail.

> [!NOTE]
> Due to limitations in the confluent library, errors coming from an invalid TLS version will not surface when connecting through the Kafka protocol. Instead a general exception will be shown.

Here're a few important points to consider:

- A network trace would show the successful establishment of a TCP connection and successful TLS negotiation, before a 401 is returned if the TLS version used is less than the minimum TLS version configured.
- Penetration or endpoint scanning on `yournamespace.servicebus.windows.net` will indicate the support for TLS 1.0, TLS 1.1, and TLS 1.2, as the service continues to support all these protocols. The minimum TLS version, enforced at the namespace level, indicates what the lowest TLS version the namespace will support.
## Next steps

See the following documentation for more information.

- [Configure the minimum TLS version for an Event Hubs namespace](transport-layer-security-configure-minimum-version.md)
- [Configure Transport Layer Security (TLS) for an Event Hubs client application](transport-layer-security-configure-client-version.md)
- [Use Azure Policy to audit for compliance of minimum TLS version for an Event Hubs namespace](transport-layer-security-audit-minimum-version.md)
