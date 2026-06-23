---
title: Cosmos DB Initiative
description: Cosmos DB Initiative.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Cosmos DB guardrails initiative
This article describes the Policy guardrails in place to ensure Cosmos DB is deployed securely.

## Cosmos DB GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Cosmos%20DB)

## Cosmos DB Policies Built in

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Cosmos DB accounts should use private link | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. You can map private endpoints to your Cosmos DB account, reduces data leakage risks. Learn more about private links at: `/azure/cosmos-db/how-to-configure-private-endpoints`. | 1.0.0 | Built in | Audit | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f58440f8a-10c5-4151-bdce-dfbaad4a20b7) |
| Azure Cosmos DB should disable public network access | Disabling public network access improves security by ensuring that your Cosmos DB account isn't exposed on the public internet. Creating private endpoints can limit exposure of your Cosmos DB account. Learn more at: `/azure/cosmos-db/how-to-configure-private-endpoints#blocking-public-network-access-during-account-creation`. | 1.0.0 | Built in | AuditDeny | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f797b37f7-06b8-444c-b1ad-fc62867f335a) |
| Cosmos DB database accounts should have local authentication methods disabled | Disabling local authentication methods improves security by ensuring that Cosmos DB database accounts exclusively require Microsoft Entra ID identities for authentication. Learn more at: `/azure/cosmos-db/how-to-setup-rbac#disable-local-auth`. | 1.1.0 | Built in | AuditDeny | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f5450f5bd-9c72-4390-a9c4-a7aba4edfdd2) |


## Cosmos DB Policies Custom

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest | Use customer-managed keys to manage the encryption at rest of your Azure Cosmos DB. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more at `https://aka.ms/cosmosdb-cmk`. | 1.1.0 | Custom | AuditDeny | N/A |
| Configure Cosmos DB database accounts to disable local authentication | Disable local authentication methods so that your Cosmos DB database accounts exclusively require Microsoft Entra ID identities for authentication. Learn more at: `/azure/cosmos-db/how-to-setup-rbac#disable-local-auth`. | 1.0.0 | Custom | Modify | N/A |
| Azure Cosmos DB accounts shouldn't exceed the maximum number of days allowed since last account key regeneration. | Regenerate your keys in the specified time to keep your data more protected. | 1.0.0 | Custom | Audit | N/A |
| Configure Cosmos DB accounts to disable public network access | Disable public network access for your Cosmos DB resource so that it's not accessible over the public internet to reduce data leakage risks. Learn more at: `/azure/cosmos-db/how-to-configure-private-endpoints#blocking-public-network-access-during-account-creation`. | 1.0.1 | Custom | Modify | N/A |
| Deploy Advanced Threat Protection for Cosmos DB Accounts | This policy enables Advanced Threat Protection across Cosmos DB accounts. | 1.0.0 | Custom | Deploy | N/A |
