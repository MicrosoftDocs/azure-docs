---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/03/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Disable Cross Subscription Restore for Backup Vaults](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4d479a11-f2b5-4f0a-bb1e-d2332aa95cda) |Disable or PermanentlyDisable Cross Subscription Restore for your Backup vault so that restore targets cannot be in different subscription from the vault subscription. Learn more at: [https://aka.ms/csrstatechange](https://aka.ms/csrstatechange). |Modify, Disabled |[1.1.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Backup/BackupVaults_CrossSubscriptionRestore_Modify.json) |
|[\[Preview\]: Immutability must be enabled for backup vaults](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2514263b-bc0d-4b06-ac3e-f262c0979018) |This policy audits if the immutable vaults property is enabled for Backup vaults in the scope. This helps protect your backup data from being deleted before its intended expiry. Learn more at [https://aka.ms/AB-ImmutableVaults](https://aka.ms/AB-ImmutableVaults). |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Backup/BackupVaults_Immutability_Audit.json) |
|[\[Preview\]: Soft delete should be enabled for Backup Vaults](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9798d31d-6028-4dee-8643-46102185c016) |This policy audits if soft delete is enabled for Backup vaults in the scope. Soft delete can help you recover your data after it has been deleted. Learn more at [https://aka.ms/AB-SoftDelete](https://aka.ms/AB-SoftDelete) |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Backup/BackupVaults_SoftDelete_Audit.json) |
