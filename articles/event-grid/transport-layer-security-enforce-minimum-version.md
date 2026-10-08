---
title: Enforce a minimum TLS version for requests to Event Grid Basic resources
description: Require a minimum version of Transport Layer Security (TLS) for inbound requests to Azure Event Grid Basic resources.
ms.topic: how-to
ms.date: 10/08/2026
ms.author: spelluru
author: spelluru
---

# Enforce a minimum TLS version for requests to Event Grid Basic resources

Communication between a client and an Azure Event Grid resource is encrypted by using Transport Layer Security (TLS). For information about TLS, see [Transport Layer Security](https://datatracker.ietf.org/wg/tls/about/).

For Event Grid Basic custom topics, domains, and partner namespaces, you can configure the minimum TLS version accepted for inbound client requests. A configured minimum of TLS 1.2 requires clients to use TLS 1.2 or a newer protocol version that the service supports. A configured minimum of TLS 1.3 requires clients to use TLS 1.3. Event Grid doesn't accept requests that use a protocol version below the configured minimum.

API version `2026-06-15-preview` defaults the minimum TLS version to TLS 1.2 and rejects TLS 1.0 and TLS 1.1. With this API version, you can explicitly configure TLS 1.3 as the minimum. TLS 1.3 isn't the default, and existing resources aren't automatically configured to require TLS 1.3. This behavior is specific to API version `2026-06-15-preview` and doesn't establish the behavior of earlier API versions.

Protocol support and negotiation at the service endpoint are different from minimum TLS enforcement at the resource level. An endpoint can negotiate a protocol that the service supports, and Event Grid then evaluates the request against the resource's configured minimum TLS version.

> [!IMPORTANT]
> Before you configure TLS 1.3 as the minimum TLS version, verify that every client and service that connects to the Event Grid resource supports TLS 1.3. Clients that don't support TLS 1.3 can't communicate with a resource that requires TLS 1.3.

## Permissions for topics and domains

To set the `minimumTlsVersionAllowed` property for an Event Grid topic or domain, you must have permission to create and manage the resource. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.EventGrid/topics/write** or **Microsoft.EventGrid/domains/write** action. Built-in roles with these actions include:

- The Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../role-based-access-control/built-in-roles.md#contributor) role
- The [Azure Event Grid Contributor](../role-based-access-control/built-in-roles.md#eventgrid-contributor) role

Role assignments must be scoped to the Event Grid topic or domain, or to a higher level, to permit a user to configure its minimum TLS version. For more information about role scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

Restrict these role assignments to users who require the ability to create an Event Grid topic or domain or update its properties. Use the principle of least privilege so that users have only the permissions that they need. For more information, see [Best practices for Azure RBAC](../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role. The Owner role includes all actions, so a user with one of these administrative roles can also create and manage Event Grid topics or domains. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

## Network considerations

When a client sends a request to an Event Grid topic or domain, it first establishes a connection to the endpoint. Event Grid checks the resource's minimum TLS setting when it processes the request. If the request uses a protocol version below the configured minimum, Event Grid rejects the request.

Consider the following behavior:

- A network trace can show successful TCP connection establishment and TLS negotiation before Event Grid rejects a request that uses a protocol version below the configured minimum.
- Endpoint scanning identifies the protocols that the service endpoint can negotiate. It doesn't identify the minimum TLS version configured on an individual topic, domain, or partner namespace.

## Webhook delivery is separate

A Web Hook event subscription has a separate minimum TLS setting for outbound event delivery from Event Grid to the webhook. The resource-level setting described in this article controls inbound requests and doesn't define the protocol that Event Grid uses to deliver events to a webhook.

## Next step

To configure the setting, see [Configure the minimum TLS version for an Event Grid topic or domain](transport-layer-security-configure-minimum-version.md).
