---
title: Security recommendations for Queue Storage
titleSuffix: Azure Storage
description: Learn about security recommendations for Queue Storage. Implementing this guidance will help you fulfill your security obligations as described in our shared responsibility model.
author: akashdubey-ms
services: storage
ms.author: akashdubey
ms.date: 05/12/2022
ms.topic: conceptual
ms.service: azure-queue-storage
ms.custom: security-recommendations
---

# Security recommendations for Queue Storage

This article contains security recommendations for Queue Storage. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model. For more information on what Microsoft does to fulfill service provider responsibilities, see [Shared responsibilities for cloud computing](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91/file/225366/1/Shared%20Responsibility%20for%20Cloud%20Computing-2019-10-25.pdf).

Some of the recommendations included in this article can be automatically monitored by Microsoft Defender for Cloud. Microsoft Defender for Cloud is the first line of defense in protecting your resources in Azure. For information on Microsoft Defender for Cloud, see [What is Microsoft Defender for Cloud?](../../defender-for-cloud/defender-for-cloud-introduction.md).

Microsoft Defender for Cloud periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to address them. For more information on Microsoft Defender for Cloud recommendations, see [Security recommendations in Microsoft Defender for Cloud](../../defender-for-cloud/review-security-recommendations.md).

## Data protection

| Recommendation | Comments | Defender for Cloud |
|-|----|--|
| Use the Azure Resource Manager deployment model | Create new storage accounts using the Azure Resource Manager deployment model for important security enhancements, including superior Azure role-based access control (Azure RBAC) and auditing, Resource Manager-based deployment and governance, access to managed identities, access to Azure Key Vault for secrets, and Azure AD-based authentication and authorization for access to Azure Storage data and resources. If possible, migrate existing storage accounts that use the classic deployment model to use Azure Resource Manager. For more information about Azure Resource Manager, see [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md). | - |
| Enable advanced threat protection for all of your storage accounts | [Microsoft Defender for Storage](../../defender-for-cloud/defender-for-storage-introduction.md) provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. Security alerts are triggered in Microsoft Defender for Cloud when anomalous activities occur and are also sent via email to subscription administrators, with details of suspicious activity and recommendations for how to investigate and remediate threats. For more information, see [Protect your Azure Storage accounts](../../defender-for-cloud/defender-for-storage-introduction.md). | [Yes](../../defender-for-cloud/implement-security-recommendations.md) |
| Limit shared access signature (SAS) tokens to HTTPS connections only | Requiring HTTPS when a client uses a SAS token to access queue data helps to minimize the risk of eavesdropping. For more information, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md). | - |

## Identity and access management

| Recommendation | Comments | Defender for Cloud |
|-|----|--|
| Use Azure Active Directory (Azure AD) to authorize access to queue data | Azure AD provides superior security and ease of use over Shared Key authorization for authorizing requests to Queue Storage. For more information, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md). | - |
| Keep in mind the principle of least privilege when assigning permissions to an Azure AD security principal via Azure RBAC | When assigning a role to a user, group, or application, grant that security principal only those permissions that are necessary for them to perform their tasks. Limiting access to resources helps prevent both unintentional and malicious misuse of your data. | - |
| Secure your account access keys with Azure Key Vault | Microsoft recommends using Azure AD to authorize requests to Azure Storage. However, if you must use Shared Key authorization, then secure your account keys with Azure Key Vault. You can retrieve the keys from the key vault at runtime, instead of saving them with your application. | - |
| Regenerate your account keys periodically | Rotating the account keys periodically reduces the risk of exposing your data to malicious actors. | - |
| Keep in mind the principle of least privilege when assigning permissions to a SAS | When creating a SAS, specify only those permissions that are required by the client to perform its function. Limiting access to resources helps prevent both unintentional and malicious misuse of your data. | - |
| Have a revocation plan in place for any SAS that you issue to clients | If a SAS is compromised, you will want to revoke that SAS as soon as possible. To revoke a user delegation SAS, revoke the user delegation key to quickly invalidate all signatures associated with that key. To revoke a service SAS that is associated with a stored access policy, you can delete the stored access policy, rename the policy, or change its expiry time to a time that is in the past. For more information, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).  | - |
| If a service SAS is not associated with a stored access policy, then set the expiry time to one hour or less | A service SAS that is not associated with a stored access policy cannot be revoked. For this reason, limiting the expiry time so that the SAS is valid for one hour or less is recommended. | - |

## Networking

| Recommendation | Comments | Defender for Cloud |
|-|----|--|
| Configure the minimum required version of Transport Layer Security (TLS) for a storage account.  | Require that clients use a more secure version of TLS to make requests against an Azure Storage account by configuring the minimum version of TLS for that account. For more information, see [Configure minimum required version of Transport Layer Security (TLS) for a storage account](../common/transport-layer-security-configure-minimum-version.md?toc=/azure/storage/queues/toc.json)| - |
| Enable the **Secure transfer required** option on all of your storage accounts | When you enable the **Secure transfer required** option, all requests made against the storage account must take place over secure connections. Any requests made over HTTP will fail. For more information, see [Require secure transfer in Azure Storage](../common/storage-require-secure-transfer.md?toc=/azure/storage/queues/toc.json). | [Yes](../../defender-for-cloud/implement-security-recommendations.md) |
| Enable firewall rules | Configure firewall rules to limit access to your storage account to requests that originate from specified IP addresses or ranges, or from a list of subnets in an Azure virtual network (VNet). For more information about configuring firewall rules, see [Configure Azure Storage firewalls and virtual networks](../common/storage-network-security.md?toc=/azure/storage/queues/toc.json). | - |
| Allow trusted Microsoft services to access the storage account | Turning on firewall rules for your storage account blocks incoming requests for data by default, unless the requests originate from a service operating within an Azure VNet or from allowed public IP addresses. Requests that are blocked include those from other Azure services, from the Azure portal, from logging and metrics services, and so on. You can permit requests from other Azure services by adding an exception to allow trusted Microsoft services to access the storage account. For more information about adding an exception for trusted Microsoft services, see [Configure Azure Storage firewalls and virtual networks](../common/storage-network-security.md?toc=/azure/storage/queues/toc.json).| - |
| Use private endpoints | A private endpoint assigns a private IP address from your Azure VNet to the storage account. It secures all traffic between your VNet and the storage account over Private Link. For more information about private endpoints, see [Connect privately to a storage account using an Azure private endpoint](../../private-link/tutorial-private-endpoint-storage-portal.md). | - |
| Use VNet service tags | A service tag represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. For more information about service tags supported by Azure Storage, see [Azure service tags overview](../../virtual-network/service-tags-overview.md). For a tutorial that shows how to use service tags to create outbound network rules, see [Restrict access to PaaS resources](../../virtual-network/tutorial-restrict-network-access-to-resources.md). | - |
| Limit network access to specific networks | Limiting network access to networks hosting clients requiring access reduces the exposure of your resources to network attacks. | [Yes](../../defender-for-cloud/implement-security-recommendations.md) |

## Logging and monitoring

| Recommendation | Comments | Defender for Cloud |
|-|----|--|
| Track how requests are authorized | Enable Azure Storage logging to track how each request made against Azure Storage was authorized. The logs indicate whether a request was made anonymously, by using an OAuth 2.0 token, by using a shared key, or by using a shared access signature (SAS). For more information, see [Azure Storage analytics logging](../common/storage-analytics-logging.md). | - |

## Next steps

- [Azure security documentation](../../security/index.yml)
- [Secure development documentation](../../security/develop/index.yml).
