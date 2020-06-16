---
title: Security recommendations for Azure Key Vault
description: Security recommendations for Azure Key Vault. Implementing this guidance will help you fulfill your security obligations as described in our shared responsibility model
services: key-vault
author: msmbaldwin
manager: rkarlin
ms.service: key-vault
ms.subservice: general
ms.topic: article
ms.date: 09/30/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security recommendations for Azure Key Vault

This article contains security recommendations for Azure Key Vault. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model. For more information on what Microsoft does to fulfill service provider responsibilities, read [Shared responsibilities for cloud computing](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91).

Some of the recommendations included in this article can be automatically monitored by Azure Security Center. Azure Security Center is the first line of defense in protecting your resources in Azure. It periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to address them.

- For more information on Azure Security Center recommendations, see [Security recommendations in Azure Security Center](../../security-center/security-center-recommendations.md).
- For information on Azure Security Center see the [What is Azure Security Center?](../../security-center/security-center-intro.md)

## Data protection

| Recommendation | Comments | Security Center |
|-|----|--|
|Enable soft-delete | [Soft-delete](overview-soft-delete.md) allows you to recover deleted vaults and vault objects |  - |
| Limit access to vault data  | Follow the principle of least privilege and limit which members of your organization have access to vault data |  - |

## Identity and access management

| Recommendation | Comments | Security Center |
|-|----|--|
| Limit the number of users with contributor access | If a user has Contributor permissions to a key vault management plane, the user can grant themselves access to the data plane by setting a Key Vault access policy. You should tightly control who has Contributor role access to your key vaults. Ensure that only those with a need for access authorized persons can access and manage your vaults. You can read [Secure access to a key vault](secure-your-key-vault.md)) | - |

## Monitoring

| Recommendation | Comments | Security Center |
|-|----|--|
 Diagnostics logs in Key Vault should be enabled | Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. | [Yes](../../security-center/security-center-identity-access.md) |
| Restrict who can access your Azure Key vault logs | [Key Vault logs](logging.md)) save information about the activities performed on your vault such as creation or deletion of vaults, keys, secrets and may be used during an investigation |  - |

## Networking

| Recommendation | Comments | Security Center |
|-|----|--|
|Limit network exposure | Network access should be limited to the virtual networks used by solutions requiring vault access. Review information on [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md)) | - |

## Next steps

Check with your application provider to see if there are additional security requirements. For more information on developing secure applications, see [Secure Development Documentation](../../security/fundamentals/abstract-develop-secure-apps.md).
