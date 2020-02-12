---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 02/12/2020
ms.author: dacoulte
---

|Name |Description |Effect(s) |Version |
|---|---|---|---|
|[Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Service%20Fabric/ServiceFabric_AuditClusterProtectionLevel_Audit.json) |Service Fabric provides three levels of protection (None, Sign and EncryptAndSign) for node-to-node communication using a primary cluster certificate. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed |Audit, Disabled |1.0.0 |
|[Service Fabric clusters should only use Azure Active Directory for client authentication](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Service%20Fabric/ServiceFabric_AuditADAuth_Audit.json) |Audit usage of client authentication only via Azure Active Directory in Service Fabric |Audit, Disabled |1.0.0 |
