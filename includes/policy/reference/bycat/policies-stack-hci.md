---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 03/18/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Azure Stack HCI servers should have consistently enforced application control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdad3a6b9-4451-492f-a95c-69efc6f3fada) |At a minimum, apply the Microsoft WDAC base policy in enforced mode on all Azure Stack HCI servers. Applied Windows Defender Application Control (WDAC) policies must be consistent across servers in the same cluster. |Audit, Disabled, AuditIfNotExists |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/WdacComplianceAtCluster_Audit.json) |
|[\[Preview\]: Azure Stack HCI servers should meet Secured-core requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5e6bf724-0154-49bc-985f-27b2e07e636b) |Ensure that all Azure Stack HCI servers meet the Secured-core requirements. To enable the Secured-core server requirements: 1. From the Azure Stack HCI clusters page, go to Windows Admin Center and select Connect. 2. Go to the Security extension and select Secured-core. 3. Select any setting that is not enabled and click Enable. |Audit, Disabled, AuditIfNotExists |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/SecuredCoreComplianceAtCluster_Audit.json) |
|[\[Preview\]: Azure Stack HCI systems should have encrypted volumes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fee8ca833-1583-4d24-837e-96c2af9488a4) |Use BitLocker to encrypt the OS and data volumes on Azure Stack HCI systems. |Audit, Disabled, AuditIfNotExists |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataAtRestEncryptedAtCluster_Audit.json) |
|[\[Preview\]: Host and VM networking should be protected on Azure Stack HCI systems](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F36f0d6bc-a253-4df8-b25b-c3a5023ff443) |Protect data on the Azure Stack HCI hosts network and on virtual machine network connections. |Audit, Disabled, AuditIfNotExists |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataInTransitProtectedAtCluster_Audit.json) |
