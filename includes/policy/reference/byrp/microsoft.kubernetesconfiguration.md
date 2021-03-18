---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 03/17/2021
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure Kubernetes clusters with specified GitOps configuration using HTTPS secrets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6f560f4-f582-4b67-b123-a37dcd1bf7ea) |Deploy a 'sourceControlConfiguration' to Kubernetes clusters to assure that the clusters get their source of truth for workloads and configurations from the defined git repo. This definition requires HTTPS user and key secrets stored in Key Vault. For instructions, visit [https://aka.ms/K8sGitOpsPolicy](https://aka.ms/K8sGitOpsPolicy). |deployIfNotExists, auditIfNotExists, disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Kubernetes/Deploy-GitOps-to-Kubernetes-cluster-HTTPS-secrets_DINE.json) |
|[Configure Kubernetes clusters with specified GitOps configuration using no secrets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1d61c4d2-aef2-432b-87fc-7f96b019b7e1) |Deploy a 'sourceControlConfiguration' to Kubernetes clusters to assure that the clusters get their source of truth for workloads and configurations from the defined git repo. This definition requires no secrets. For instructions, visit [https://aka.ms/K8sGitOpsPolicy](https://aka.ms/K8sGitOpsPolicy). |deployIfNotExists, auditIfNotExists, disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Kubernetes/Deploy-GitOps-to-Kubernetes-cluster-no-secrets_DINE.json) |
|[Configure Kubernetes clusters with specified GitOps configuration using SSH secrets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc050047b-b21b-4822-8a2d-c1e37c3c0c6a) |Deploy a 'sourceControlConfiguration' to Kubernetes clusters to assure that the clusters get their source of truth for workloads and configurations from the defined git repo. This definition requires a SSH private key secret in Key Vault. For instructions, visit [https://aka.ms/K8sGitOpsPolicy](https://aka.ms/K8sGitOpsPolicy). |deployIfNotExists, auditIfNotExists, disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Kubernetes/Deploy-GitOps-to-Kubernetes-cluster-SSH-secrets_DINE.json) |
