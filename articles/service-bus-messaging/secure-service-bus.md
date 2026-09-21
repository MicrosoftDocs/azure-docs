---
title: Secure your Azure Service Bus deployment
description: Learn how to secure Azure Service Bus, with best practices for protecting your messaging namespaces, entities, and data.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-service-bus
ms.topic: best-practice
ms.custom: horz-security
ms.date: 09/11/2026
ai-usage: ai-generated
---

# Secure your Azure Service Bus deployment

Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. Because Service Bus namespaces carry business-critical data between distributed applications, it's important to follow security best practices to protect messages, credentials, and the messaging infrastructure.

This article provides security recommendations to help protect your Azure Service Bus deployment.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Service-specific security

Service Bus applies many security controls at the namespace level, including network access, local authentication, and encryption settings. You can also scope access permissions to individual queues, topics, and subscriptions. Therefore, tier selection and role-assignment scope are both security decisions.

- **Choose the Premium tier for private network isolation and key control**: Private endpoints, virtual network rules, Geo-Replication, and customer-managed key encryption require Premium-tier namespaces. Standard-tier namespaces support IP firewall rules but not the trusted-services exception. For more information, see [Service Bus Premium and Standard messaging tiers](service-bus-premium-messaging.md).

## Network security

By default, a Service Bus namespace is reachable from the public internet by any client that presents valid credentials. Restrict network access so that only trusted networks can reach the namespace.

- **Disable public network access and use private endpoints**: Connect clients to Premium-tier namespaces over Azure Private Link so that traffic traverses the Microsoft backbone instead of the public internet. Turn off public network access to eliminate internet exposure. For more information, see [Allow access to Azure Service Bus namespaces via private endpoints](private-link-service.md).
- **Restrict access with IP firewall rules**: Limit access to specific IPv4 addresses or CIDR ranges, such as your on-premises NAT gateway or Azure ExpressRoute addresses, so the namespace rejects connections from all other addresses. For more information, see [Configure IP firewall rules for a Service Bus namespace](service-bus-ip-filtering.md).
- **Bind the namespace to virtual networks with service endpoints**: Use virtual network rules so that only workloads in authorized subnets can reach the namespace. For more information, see [Allow access to a Service Bus namespace from specific virtual networks](service-bus-service-endpoints.md).
- **Add the namespace to a network security perimeter when you don't use Geo-Replication**: Place the namespace and other PaaS resources such as Azure Key Vault inside a network security perimeter to control public access through explicit rules and allow communication between resources in the perimeter. Don't associate the namespace with a network security perimeter if you need Service Bus Geo-Replication. For more information, see [Network security perimeter for Azure Service Bus](network-security-perimeter.md).
- **Enforce a minimum TLS version**: Configure the namespace minimum TLS version after validating client compatibility. Service Bus uses TLS 1.3 on public endpoints by default, still permits TLS 1.2 for backward compatibility, and rejects requests that use a protocol version below the configured minimum. For more information, see [Enforce a minimum required version of TLS for a Service Bus namespace](transport-layer-security-enforce-minimum-version.md).

## Identity and access management

Service Bus supports Microsoft Entra ID authentication with Azure role-based access control (RBAC) and shared access signature (SAS) authentication. Prefer Microsoft Entra ID, which avoids long-lived shared secrets and provides identity-level auditing and Conditional Access.

- **Authenticate with Microsoft Entra ID**: Use Microsoft Entra ID and OAuth 2.0 tokens instead of SAS keys so applications don't store credentials in code. For more information, see [Azure Service Bus authentication and authorization](service-bus-authentication-and-authorization.md).
- **Disable local (SAS) authentication**: Set `disableLocalAuth` on the namespace to reject SAS-based access and require Microsoft Entra ID for all connections, which eliminates static shared secrets. For more information, see [Disable local authentication with Azure Service Bus](disable-local-authentication.md).
- **Use managed identities for applications**: Grant Azure compute resources a managed identity so they authenticate to Service Bus without hardcoded credentials. For more information, see [Use managed identities to access Azure Service Bus resources](service-bus-managed-service-identity.md).
- **Assign least-privilege built-in roles**: Grant each principal the narrowest built-in role: Azure Service Bus Data Sender to send, Azure Service Bus Data Receiver to receive, and Azure Service Bus Data Owner only for full control. Scope the assignment to a specific queue, topic, or subscription rather than the whole namespace when possible. For more information, see [Azure built-in roles for Service Bus](service-bus-managed-service-identity.md#assign-a-service-bus-role-to-the-managed-identity).
- **Limit shared access signatures when SAS authentication is unavoidable**: Scope each shared access policy to a single queue or topic, grant only the Listen or Send rights the client needs, and rotate the primary and secondary keys regularly. For more information, see [Service Bus SAS authentication](service-bus-sas.md).
- **Enforce Conditional Access for Service Bus administrators**: Apply Conditional Access policies that require multifactor authentication and compliant devices for identities that can create or modify namespaces, network rules, RBAC role assignments, and the customer-managed keys in Key Vault that the namespace depends on. For more information, see [Common Conditional Access policy: Require MFA for Azure management](/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt).

## Data protection

Service Bus encrypts all data at rest with Microsoft-managed keys by default and encrypts data in transit with TLS. Customer-managed keys give you more control over the encryption key lifecycle.

- **Encrypt data at rest by using customer-managed keys**: On Premium-tier namespaces, use a key stored in Azure Key Vault (or Key Vault Managed HSM) to encrypt the Microsoft-managed key, so you can rotate, disable, or revoke access to the key. Enable soft delete and purge protection on the vault. For more information, see [Configure customer-managed keys for encrypting Service Bus data at rest](configure-customer-managed-key.md).

## Logging and monitoring

Collect resource logs and metrics so you can detect anomalous access and investigate security incidents.

- **Send resource logs to a Log Analytics workspace**: Create diagnostic settings to capture Service Bus resource logs, and route them to a Log Analytics workspace, storage account, or event hub for retention and analysis. For more information, see [Monitor Azure Service Bus](monitor-service-bus.md).
- **Monitor namespace and entity metrics**: Use Azure Monitor metrics and Service Bus insights to track connection, throttling, and message activity that can indicate abuse. For more information, see [Azure Service Bus insights](service-bus-insights.md).

## Compliance and governance

Use Azure Policy to enforce and audit security configurations consistently across your Service Bus namespaces.

- **Audit and enforce configuration with Azure Policy**: Assign the built-in Service Bus policy definitions that check whether namespaces use customer-managed keys, require Microsoft Entra ID authentication, use private endpoints, and have resource logs enabled. For more information, see [Azure Policy built-in definitions for Service Bus](policy-reference.md).
- **Lock production namespaces against accidental changes**: Apply an Azure Resource Manager `CanNotDelete` or `ReadOnly` lock to production Service Bus namespaces so that users can't accidentally delete or modify network rules, encryption settings, and entities. For more information, see [Lock your resources to protect your infrastructure](/azure/azure-resource-manager/management/lock-resources).

## Backup and recovery

Service Bus Premium provides geographic resilience features: Geo-Replication can replicate entity metadata and message data to a secondary region, while Geo-Disaster Recovery replicates metadata only.

- **Enable Geo-Replication for Premium namespaces**: Continuously replicate namespace metadata and message data to a secondary region, and choose synchronous replication when you need RPO 0. Forced promotion with asynchronous replication can cause data loss or duplication. For more information, see [Azure Service Bus Geo-Replication](service-bus-geo-replication.md).
- **Use Geo-Disaster Recovery for Premium entity-metadata resilience**: When you only need metadata resilience for queues, topics, and subscriptions, pair namespaces and fail over through an alias. Recreate RBAC role assignments, network configurations, identities, encryption settings, and local authentication settings in the secondary namespace, because they aren't replicated. For more information, see [Azure Service Bus Geo-Disaster Recovery](service-bus-geo-dr.md).

## Next steps

- [Architecture best practices for Azure Service Bus](/azure/well-architected/service-guides/azure-service-bus)
- [Zero Trust guidance center](/security/zero-trust/zero-trust-overview)
