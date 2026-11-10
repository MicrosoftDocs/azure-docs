---
title: Container Registry Initiative
titleSuffix: Azure Enclave
description: Container Registry Initiative.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: overview
ms.date: 09/29/2026
---

# Container Registry guardrails initiative
This article describes the Policy guardrails in place to ensure Azure Container Registry is deployed securely.

## Initiative details

Azure Enclave assigns the Container Registry guardrails initiative (policy set definition ID `b3fe25eb-cdc6-475f-96a5-04ac270f630d`) to workload resource groups.

The `Effect` values in the tables show the effects supported by the policy definitions. The effective behavior of a policy assignment can vary based on Azure Enclave policy configuration and policy parameters.

## Container Registry GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Container%20Registry)

## Container Registry Policies Built in

| Name | Description | Version | Type | Supported definition effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Configure Container registries to disable public network access | Disable public network access for your Container Registry resource so that it's not accessible over the public internet. This action reduces data leakage risks. Learn more at https://aka.ms/acr/portal/public-network and https://aka.ms/acr/private-link. | 1.0.0 | BuiltIn | Modify, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa3701552-92ea-433e-9d17-33b7f1208fc9) |
| Container registries should not allow unrestricted network access | Azure container registries by default accept connections over the internet from hosts on any network. To protect your registries from potential threats, allow access from only specific private endpoints, public IP addresses, or address ranges. If your registry doesn't have network rules configured, it appears in the unhealthy resources. Learn more about Container Registry network rules at https://aka.ms/acr/privatelink, https://aka.ms/acr/portal/public-network, and https://aka.ms/acr/vnet. | 2.0.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fd0793b48-0edc-4296-a390-4c75d1bdfd71) |
| Container registries should have anonymous authentication disabled. | Disable anonymous pull for your registry so that data isn't accessible by an unauthenticated user. Disabling local authentication methods like admin user, repository scoped access tokens, and anonymous pull improves security by ensuring that container registries exclusively require Microsoft Entra ID identities for authentication. Learn more at: https://aka.ms/acr/authentication. | 1.0.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f9f2dea28-e834-476c-99c5-3507b4728395) |
| Configure container registries to disable anonymous authentication. | Disable anonymous pull for your registry so that data isn't accessible by an unauthenticated user. Disabling local authentication methods like admin user, repository scoped access tokens, and anonymous pull improves security by ensuring that container registries exclusively require Microsoft Entra ID identities for authentication. Learn more at: https://aka.ms/acr/authentication. | 1.0.0 | BuiltIn | Modify, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcced2946-b08a-44fe-9fd9-e4ed8a779897) |
| Container registries should have SKUs that support Private Links | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your container registries instead of the entire service, you reduce data leakage risks. Learn more at: https://aka.ms/acr/private-link. | 1.0.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fbd560fc0-3c69-498a-ae9f-aa8eb7de0e13) |
| Container registries should use private link | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your container registries instead of the entire service, you're also protected against data leakage risks. Learn more at: https://aka.ms/acr/private-link. | 1.0.1 | BuiltIn | Audit, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fe8eef0a8-67cf-4eb4-9386-14b0e78733d4) |
| Public network access should be disabled for Container registries | Disabling public network access improves security by ensuring that container registries aren't exposed on the public internet. Creating private endpoints can limit exposure of container registry resources. Learn more at: https://aka.ms/acr/portal/public-network and https://aka.ms/acr/private-link. | 1.0.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0fdf0491-d080-4575-b627-ad0e843cba0f) |
| Container registries should be encrypted with a customer-managed key | Use customer-managed keys to manage the encryption at rest of the contents of your registries. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more at https://aka.ms/acr/CMK. | 1.1.2 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f5b9159ae-1701-4a6f-9a7a-aa9c8ddd0580) |
