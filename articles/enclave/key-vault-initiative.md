---
title: Key Vault Initiative
description: Key Vault Initiative.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: overview
ms.date: 09/29/2026
---

# Key Vault guardrails initiative
This article describes the Policy guardrails in place to ensure Azure Key Vault is deployed securely.

## Initiative details

Azure Enclave assigns the Key Vault guardrails initiative (policy set definition ID `4f4dba0f-a5ee-494b-8df7-f9727dea6f37`) to workload resource groups.

The `Effect` values in the tables show the effects supported by the policy definitions. The effective behavior of a policy assignment can vary based on Azure Enclave policy configuration and policy parameters.

## Key Vault GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Key%20Vault)

## Key Vault Policies Built in

| Name | Description | Version | Type | Supported definition effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Azure Key Vault should disable public network access | Disable public network access for your key vault so that it's not accessible over the public internet. This action reduces data leakage risks. Learn more at: https://aka.ms/akvprivatelink. | 1.1.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f405c5871-3e91-4644-8a63-58e19d68ff5b) |
| Key vaults should have soft delete enabled | Deleting a key vault without soft delete enabled permanently deletes all secrets, keys, and certificates stored in the key vault. Accidental deletion of a key vault can lead to permanent data loss. Soft delete allows you to recover an accidentally deleted key vault for a configurable retention period. | 3.1.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1e66c121-a66a-4b1f-9b83-0fd99bf0fc2d) |
