---
title: Authenticating requests to Azure Storage using Azure Active Directory (Preview) | Microsoft Docs
description: Authenticating requests to Azure Storage using Azure Active Directory (Preview).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 05/18/2018
ms.author: tamram
---

# Authenticating requests to Azure Storage using Azure Active Directory (Preview)

Azure Storage supports authentication with Azure Active Directory (AD). Azure AD integration is available in preview for Azure Blobs and Queues. With Azure AD, you can use role-based access control (RBAC) to grant access to your Azure Storage resources to users, groups, or applications. The preview enables you to grant permissions that are scoped to the level of an individual container or queue. 

Authenticating from your Azure Storage applications with Azure AD provides superior security and ease of use over existing authentication options. While you can continue to use Shared Key authentication with your applications, using Azure AD circumvents the need to store your account access key with your code. Similarly, you can continue to use shared access signatures (SAS) to grant fine-grained access to resources in your storage account, but Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS.    

## About the preview

Keep in mind the following points about the preview:

- Azure AD integration is available for blobs and queues only in the preview.
- Azure AD integration is available for GPv1 and GPv2 storage accounts created with the Resource Manager deployment model only. Both standard and premium storage accounts are supported.
- Azure Storage supports both built-in and custom RBAC roles.
- You can define permissions at the container or queue level only during the preview.
- Microsoft recommends using non-production workloads with this preview technology. 
- Role assignments can be made at the scope of a Subscription, Resource Group, Storage Account, or Container/Queue. This is not a limitation of the preview, but will apply to RBAC role assignments going forward.

If Azure AD integration is not yet supported for your scenario, continue to use Shared Key authentication or SAS tokens in your applications. 









## Next Steps

To learn more about RBAC, see [Get started with Role-Based Access Control in the Azure portal](../../role-based-access-control/overview.md).




