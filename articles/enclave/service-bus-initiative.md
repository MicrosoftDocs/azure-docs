---
title: Service Bus Initiative
description: Service Bus Initiative.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Service Bus guardrails initiative
This article describes the Policy guardrails in place to ensure Azure Service Bus is deployed securely.

## Service Bus GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Service%20Bus)

## Service Bus Policies Custom

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Service Bus Premium namespaces should use a customer-managed key for encryption | Azure Service Bus supports the option of encrypting data at rest with either Microsoft-managed keys (default) or customer-managed keys. Choosing to encrypt data using customer-managed keys enables you to assign, rotate, disable, and revoke access to the keys that Service Bus will use to encrypt data in your namespace. Note that Service Bus only supports encryption with customer-managed keys for premium namespaces. | 1.0.0 | Custom | Audit | N/A |
| Service Bus namespaces should have double encryption enabled | Enabling double encryption helps protect and safeguard your data to meet your organizational security and compliance commitments. When double encryption has been enabled, data in the storage account is encrypted twice, once at the service level and once at the infrastructure level, using two different encryption algorithms and two different keys. | 1.0.0 | Custom | AuditDeny | N/A |
| Azure Service Bus namespaces should use private link | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. Mapping private endpoints to Service Bus namespaces, reduces data leakage risks. [Learn more](/azure/service-bus-messaging/private-link-service). | 1.0.0 | Custom | AuditIfNotExist | N/A |
| Service Bus Namespaces should disable public network access | Azure Service Bus should have public network access disabled. Disabling public network access improves security by ensuring that the resource isn't exposed on the public internet. You can limit exposure of your resources by creating private endpoints instead. [Learn more](/azure/service-bus-messaging/private-link-service) | 1.1.0 | Custom | AuditDeny | N/A |
| Resource logs in Service Bus should be enabled | Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised | 5.0.0 | Custom | AuditIfNotExist | N/A |
| Azure Service Bus namespaces should have local authentication methods disabled | Disabling local authentication methods improves security by ensuring that Azure Service Bus namespaces exclusively require Microsoft Entra ID identities for authentication. [Learn more](https://aka.ms/disablelocalauth-sb). | 1.0.0 | Custom | AuditDeny | N/A |
| Configure Azure Service Bus namespaces to disable local authentication | Disable local authentication methods so that your Azure ServiceBus namespaces exclusively require Microsoft Entra ID identities for authentication. [Learn more](https://aka.ms/disablelocalauth-sb). | 1.0.0 | Custom | Modify | N/A |
