---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 09/17/2021
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Kubernetes Service clusters should have Azure Defender profile enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa1840de2-8088-4ea8-b153-b4c723e9cb01) |Azure Defender for Kubernetes provides cloud-native Kubernetes security capabilities including environment hardening, workload protection, and run-time protection.<br/> When you enable the SecurityProfile.AzureDefender on your Azure Kubernetes Service cluster, an agent is deployed to your cluster to collect security event data.<br>Learn more about Azure Defender for Kubernetes in [https://docs.microsoft.com/azure/security-center/defender-for-kubernetes-introduction](../../../../../articles/security-center/defender-for-kubernetes-introduction.md) |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Kubernetes/ASC_Azure_Defender_Kubernetes_AKS_SecurityProfile_Audit.json) |