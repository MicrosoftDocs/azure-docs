---
title: Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace
titleSuffix: Azure Service Bus
description: Configure a service bus namespace to require a minimum version of Transport Layer Security (TLS) for clients making requests against Azure Service Bus.
services: service-bus
author: EldertGrootenboer

ms.service: service-bus-messaging
ms.custom: ignite-2022
ms.topic: article
ms.date: 09/26/2022
ms.author: egrootenboer
---

# Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace

Communication between a client application and an Azure Service Bus namespace is encrypted using Transport Layer Security (TLS). TLS is a standard cryptographic protocol that ensures privacy and data integrity between clients and services over the Internet. For more information about TLS, see [Transport Layer Security](https://datatracker.ietf.org/wg/tls/about/).

Azure Service Bus supports choosing a specific TLS version for namespaces. Currently Azure Service Bus uses TLS 1.2 on public endpoints by default, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

Azure Service Bus namespaces permit clients to send and receive data with TLS 1.0 and above. To enforce stricter security measures, you can configure your Service Bus namespace to require that clients send and receive data with a newer version of TLS. If a Service Bus namespace requires a minimum version of TLS, then any requests made with an older version will fail.

> [!IMPORTANT]
> If you are using a service that connects to Azure Service Bus, make sure that that service is using the appropriate version of TLS to send requests to Azure Service Bus before you set the required minimum version for a Service Bus namespace.

## Permissions necessary to require a minimum version of TLS

To set the  `MinimumTlsVersion`  property for the Service Bus namespace, a user must have permissions to create and manage Service Bus namespaces. Azure role-based access control (Azure RBAC) roles that provide these permissions include the  **Microsoft.ServiceBus/namespaces/write**  or  **Microsoft.ServiceBus/namespaces/\***  action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../role-based-access-control/built-in-roles.md#contributor) role
- The [Azure Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner) role

Role assignments must be scoped to the level of the Service Bus namespace or higher to permit a user to require a minimum version of TLS for the Service Bus namespace. For more information about role scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create a Service Bus namespace or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [**Owner**](../role-based-access-control/built-in-roles.md#owner) role. The  **Owner**  role includes all actions, so a user with one of these administrative roles can also create and manage Service Bus namespaces. For more information, see [**Azure roles, Microsoft Entra roles, and classic subscription administrator roles**](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

## Network considerations

When a client sends a request to Service Bus namespace, the client establishes a connection with the Service Bus namespace endpoint first, before processing any requests. The minimum TLS version setting is checked after the TLS connection is established. If the request uses an earlier version of TLS than that specified by the setting, the connection will continue to succeed, but the request will eventually fail.

> [!NOTE]
> Due to backwards compatibility, namespaces that do not have the `MinimumTlsVersion` setting specified or have specified this as 1.0, we do not do any TLS checks when connecting via the SBMP protocol.

[!INCLUDE [service-bus-amqp-support-retirement](../../includes/service-bus-amqp-support-retirement.md)]

Here're a few important points to consider:

- A network trace would show the successful establishment of a TCP connection and successful TLS negotiation, before a 401 is returned if the TLS version used is less than the minimum TLS version configured.
- Penetration or endpoint scanning on `yournamespace.servicebus.windows.net` will indicate the support for TLS 1.0, TLS 1.1, and TLS 1.2, as the service continues to support all these protocols. The minimum TLS version, enforced at the namespace level, indicates what the lowest TLS version the namespace will support. 

## Next steps

See the following documentation for more information.

- [Configure the minimum TLS version for a Service Bus namespace](transport-layer-security-configure-minimum-version.md)
- [Configure Transport Layer Security (TLS) for a Service Bus client application](transport-layer-security-configure-client-version.md)
- [Use Azure Policy to audit for compliance of minimum TLS version for a Service Bus namespace](transport-layer-security-audit-minimum-version.md)
