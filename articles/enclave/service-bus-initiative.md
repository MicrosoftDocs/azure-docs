---
title: Service Bus Initiative
description: Service Bus Initiative.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: overview
ms.date: 09/29/2026
---

# Service Bus guardrails initiative
This article describes the Policy guardrails in place to ensure Azure Service Bus is deployed securely.

## Initiative details

Azure Enclave assigns the Service Bus guardrails initiative (policy set definition ID `8fcdb3f1-1369-426d-9917-81edfee903ab`) to workload resource groups.

The `Effect` values in the tables show the effects supported by the policy definitions. The effective behavior of a policy assignment can vary based on Azure Enclave policy configuration and policy parameters.

## Service Bus GitHub repository
[GitHub Repository](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Service%20Bus)

## Built-in Service Bus policies


| Name | Description | Version | Type | Supported definition effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Service Bus Premium namespaces should use a customer-managed key for encryption | Azure Service Bus supports the option of encrypting data at rest with either Microsoft-managed keys (default) or customer-managed keys. Choosing to encrypt data by using customer-managed keys enables you to assign, rotate, disable, and revoke access to the keys that Service Bus uses to encrypt data in your namespace. Service Bus only supports encryption by using customer-managed keys for premium namespaces. | 1.0.0 | BuiltIn | Audit, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f295fc8b1-dc9f-4f53-9c61-3f313ceab40a) |
| Service Bus namespaces should have double encryption enabled | Enabling double encryption helps protect and safeguard your data to meet your organizational security and compliance commitments. When you enable double encryption, data in the storage account is encrypted twice, once at the service level and once at the infrastructure level, by using two different encryption algorithms and two different keys. | 1.0.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2febaf4f25-a4e8-415f-86a8-42d9155bef0b) |
| Azure Service Bus namespaces should use private link | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Service Bus namespaces, you reduce data leakage risks. Learn more at [Allow access to a Service Bus namespace via private endpoints](/azure/service-bus-messaging/private-link-service). | 1.0.0 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1c06e275-d63d-4540-b761-71f364c2111d) |
| Service Bus Namespaces should disable public network access | Azure Service Bus should have public network access disabled. Disabling public network access improves security by ensuring that the resource isn't exposed on the public internet. You can limit exposure of your resources by creating private endpoints instead. Learn more at [Allow access to a Service Bus namespace via private endpoints](/azure/service-bus-messaging/private-link-service). | 1.1.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcbd11fd3-3002-4907-b6c8-579f0e700e13) |
| Resource logs in Service Bus should be enabled | Audit enabling of resource logs. This action enables you to recreate activity trails to use for investigation purposes when a security incident occurs or when your network is compromised. | 5.0.0 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ff8d36e2f-389b-4ee4-898d-21aeb69a0f45) |
| Azure Service Bus namespaces should have local authentication methods disabled | Disabling local authentication methods improves security by ensuring that Azure Service Bus namespaces exclusively require Microsoft Entra ID identities for authentication. Learn more at: https://aka.ms/disablelocalauth-sb. | 1.0.1 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcfb11c26-f069-4c14-8e36-56c394dae5af) |
| Configure Azure Service Bus namespaces to disable local authentication | Disable local authentication methods so that your Azure ServiceBus namespaces exclusively require Microsoft Entra ID identities for authentication. Learn more at: https://aka.ms/disablelocalauth-sb. | 1.0.1 | BuiltIn | Modify, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f910711a6-8aa2-4f15-ae62-1e5b2ed3ef9e) |
