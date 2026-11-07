---
title: Cosmos DB Initiative
description: Cosmos DB Initiative.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: overview
ms.date: 09/29/2026
---

# Cosmos DB guardrails initiative
This article describes the Policy guardrails in place to ensure Cosmos DB is deployed securely.

## Initiative details

Azure Enclave assigns the Cosmos DB guardrails initiative (policy set definition ID `6bd484ca-ae8d-46cf-9b33-e1feef84bfba`) to workload resource groups.

The `Effect` values in the tables show the effects supported by the policy definitions. The effective behavior of a policy assignment can vary based on Azure Enclave policy configuration and policy parameters.

## Cosmos DB GitHub repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Cosmos%20DB)

## Built-in Cosmos DB policies

| Name | Description | Version | Type | Supported definition effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest | Use customer-managed keys to manage the encryption at rest of your Azure Cosmos DB. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more at https://aka.ms/cosmosdb-cmk. | 1.1.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1f905d99-2ab7-462c-a6b0-f709acca6c8f) |
| CosmosDB accounts should use private link | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your CosmosDB account, data leakage risks are reduced. Learn more about private links at [Configure Azure Private Link for an Azure Cosmos DB account](/azure/cosmos-db/how-to-configure-private-endpoints). | 1.0.0 | BuiltIn | Audit, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f58440f8a-10c5-4151-bdce-dfbaad4a20b7) |
| Azure Cosmos DB should disable public network access | Disabling public network access improves security by ensuring that your CosmosDB account isn't exposed on the public internet. Creating private endpoints can limit exposure of your CosmosDB account. Learn more at [Configure Azure Private Link for an Azure Cosmos DB account](/azure/cosmos-db/how-to-configure-private-endpoints#blocking-public-network-access-during-account-creation). | 1.0.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f797b37f7-06b8-444c-b1ad-fc62867f335a) |
| Cosmos DB database accounts should have local authentication methods disabled | Disabling local authentication methods improves security by ensuring that Cosmos DB database accounts exclusively require Microsoft Entra ID identities for authentication. Learn more at [Set up role-based access control for Azure Cosmos DB](/azure/cosmos-db/how-to-setup-rbac#disable-local-auth). | 1.2.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f5450f5bd-9c72-4390-a9c4-a7aba4edfdd2) |
| Configure Cosmos DB database accounts to disable local authentication | Disable local authentication methods so that your Cosmos DB database accounts exclusively require Microsoft Entra ID identities for authentication. Learn more at [Set up role-based access control for Azure Cosmos DB](/azure/cosmos-db/how-to-setup-rbac#disable-local-auth). | 1.2.0 | BuiltIn | Modify, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fdc2d41d1-4ab1-4666-a3e1-3d51c43e0049) |
| Azure Cosmos DB accounts should not exceed the maximum number of days allowed since last account key regeneration. | Regenerate your keys in the specified time to keep your data more protected. | 1.0.0 | BuiltIn | Audit, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f9d83ccb1-f313-46ce-9d39-a198bfdb51a0) |
| Configure CosmosDB accounts to disable public network access | Disable public network access for your CosmosDB resource so that it's not accessible over the public internet. This can reduce data leakage risks. Learn more at [Configure Azure Private Link for an Azure Cosmos DB account](/azure/cosmos-db/how-to-configure-private-endpoints#blocking-public-network-access-during-account-creation). | 1.0.1 | BuiltIn | Modify, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fda69ba51-aaf1-41e5-8651-607cd0b37088) |
| Deploy Advanced Threat Protection for Cosmos DB Accounts | This policy enables Advanced Threat Protection across Cosmos DB accounts. | 1.0.0 | BuiltIn | DeployIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb5f04e03-92a3-4b09-9410-2cc5e5047656) |
