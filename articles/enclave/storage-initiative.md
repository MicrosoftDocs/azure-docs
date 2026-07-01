---
title: Storage Initiative
description: Storage Initiative.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Storage guardrails initiative
This article describes the Policy guardrails in place to ensure Azure Storage Account is deployed securely.

## Storage GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Storage)

## Storage Policies Built in

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Secure transfer to storage accounts should be enabled | Audit requirement of Secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking | 2.0.0 | Built in | AuditDeny | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f404c3081-a854-4457-ae30-26a93ef643f9) |
| Storage account encryption scopes should use customer-managed keys to encrypt data at rest | Use customer-managed keys to manage the encryption at rest of your storage account encryption scopes. Customer-managed keys enable the data to be encrypted with an Azure key-vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more about storage account encryption scopes at `https://aka.ms/encryption-scopes-overview`. | 1.0.0 | Built in | AuditDeny | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb5ec538c-daa0-4006-8596-35468b9148e8) |
| Storage accounts should use private link | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. Mapping private endpoints to your storage account, data leakage risks are reduced. Learn more about private links at - `https://aka.ms/azureprivatelinkoverview` | 2.0.0 | Built in | AuditIfNotExist | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6edd7eda-6dd8-40f7-810d-67160c639cd9) |
| [Deprecated]: Microsoft Defender for Storage (Classic) should be enabled | Microsoft Defender for Storage (Classic) provides detections of unusual and potentially harmful attempts to access or exploit storage accounts. | 1.1.0-deprecated | Built in | AuditIfNotExist | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f308fbb08-4ab8-4e67-9b29-592e93fb94fa) |

## Storage Policies Custom

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Storage accounts should use customer-managed key for encryption | Secure your blob and file storage account with greater flexibility using customer-managed keys. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Using customer-managed keys you to control rotation of the key encryption key or cryptographically erase data. | 1.0.3 | Custom | Audit | N/A |
| Storage accounts should have infrastructure encryption | Enable infrastructure encryption for higher level of assurance that the data is secure. When infrastructure encryption is enabled, data in a storage account is encrypted twice. | 1.0.0 | Custom | AuditDeny | N/A |
| Storage accounts should disable public network access | To improve the security of Storage Accounts, ensure that they aren't exposed to the public internet and can only be accessed from a private endpoint. Disable the public network access property as described in `https://aka.ms/storageaccountpublicnetworkaccess`. This option disables access from any public address space outside the Azure IP range, and denies all log-ins that match IP or virtual network-based firewall rules. This reduces data leakage risks. | 1.0.1 | Custom | AuditDeny | N/A |
| Storage accounts should have the specified minimum Transport Layer Security (TLS) version | Configure a minimum TLS version for secure communication between the client application and the storage account. To minimize security risk, the recommended minimum TLS version is the latest released version, which is currently TLS 1.2. | 1.0.0 | Custom | AuditDeny | N/A |
| Configure your Storage account public access to be disallowed | Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data but might present security risks. To prevent data breaches caused by undesired anonymous access, Microsoft recommends preventing public access to a storage account unless your scenario requires it. | 1.0.0 | Custom | Modify | N/A |
| Table Storage should use customer-managed key for encryption | Secure your table storage with greater flexibility using customer-managed keys. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Using customer-managed keys you to control rotation of the key encryption key or cryptographically erase data. | 1.0.0 | Custom | AuditDeny | N/A |
| Queue Storage should use customer-managed key for encryption | Secure your queue storage with greater flexibility using customer-managed keys. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Using customer-managed keys you to control rotation of the key encryption key or cryptographically erase data. | 1.0.0 | Custom | AuditDeny | N/A |
