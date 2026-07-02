---
title: Azure Kubernetes Service Initiative
description: Azure Kubernetes Service Initiative.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Azure Kubernetes Service (AKS) guardrails initiative
This article describes the Policy guardrails in place to ensure Azure Kubernetes Service is deployed securely.

## AKS GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/9b782ec8a2b509ab9e5466a80ea4370de172a171/built-in-policies/policyDefinitions/Kubernetes)

## AKS Policies Built in

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Authorized IP ranges should be defined on Kubernetes Services | Restrict access to the Kubernetes classic deployment model by granting API access only to IP addresses in specific ranges. It's recommended to limit access to authorized IP ranges to ensure that only applications from allowed networks can access the cluster. | 2.0.1 | Built in | Audit | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0e246bcf-5f6f-4f87-bc6f-775d4712c7ea) |
| Azure Kubernetes Clusters should enable Key Management Service (KMS) | Use Key Management Service (KMS) to encrypt secret data at rest in etcd for Kubernetes cluster security. Learn more at: `https://aka.ms/aks/kmsetcdencryption`. | 1.0.0 | Built in | Audit | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fdbbdc317-9734-4dd8-9074-993b29c69008) |
| Azure Kubernetes Service Clusters should disable Command Invoke | Disabling command invoke can enhance the security by avoiding bypass of restricted network access or Kubernetes role-based access control | 1.0.1 | Built in | Audit | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f89f2d532-c53c-4f8f-9afa-4927b1114a0d) |
| Azure Kubernetes Service Private Clusters should be enabled | Enable the private cluster feature for your Azure Kubernetes Service cluster to ensure network traffic between your API server and your node pools remains on the private network only. This is a common requirement in many regulatory and industry compliance standards. | 1.0.1 | Built in | AuditDeny | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f040732e8-d947-40b8-95d6-854c95024bf8) |
| Azure Kubernetes Clusters should enable Key Management Service (KMS) | Use Key Management Service (KMS) to encrypt secret data at rest in etcd for Kubernetes cluster security. Learn more at: `https://aka.ms/aks/kmsetcdencryption`. | 1.0.0 | Built in | Audit | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fdbbdc317-9734-4dd8-9074-993b29c69008) |
| Both operating systems and data disks in Azure Kubernetes Service clusters should be encrypted by customer-managed keys | Encrypting OS and data disks using customer-managed keys provides more control and greater flexibility in key management. This is a common requirement in many regulatory and industry compliance standards. | 1.0.1 | Built in | AuditDeny | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7d7be79c-23ba-4033-84dd-45e2a5ccdd67) |
| Azure Role-Based Access Control (RBAC) should be used on Kubernetes Services | To provide granular filtering on the actions that users can perform, use Azure Role-Based Access Control (RBAC) to manage permissions in Kubernetes Service Clusters and configure relevant authorization policies. | 1.0.3 | Built in | Audit | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |
| Azure Kubernetes Service Clusters should use managed identities | Use managed identities to wrap around service principals, simplify cluster management and avoid the complexity required to managed service principals. Learn more at: `https://aka.ms/aks-update-managed-identities` | 1.0.1 | Built in | Audit | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fda6e2401-19da-4532-9141-fb8fbde08431) |

## AKS Policies Custom

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Azure Kubernetes Service clusters should have Defender profile enabled | Microsoft Defender for Containers provides cloud-native Kubernetes security capabilities including environment hardening, workload protection, and run-time protection. When you enable the SecurityProfile.AzureDefender on your Azure Kubernetes Service cluster, an agent is deployed to your cluster to collect security event data. Learn more about Microsoft Defender for Containers in `/azure/defender-for-cloud/defender-for-containers-introduction?tabs=defender-for-container-arch-aks` | 2.0.1 | Custom | Audit | N/A |
