---
title: Authenticating access to Azure Storage using Azure Active Directory (Preview) | Microsoft Docs
description: Authenticating access to Azure Storage using Azure Active Directory (Preview).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 05/18/2018
ms.author: tamram
---

# Authenticating access to Azure Storage using Azure Active Directory (Preview)

Azure Storage supports authentication with Azure Active Directory (AD) for the Blob and Queue services. With Azure AD, you can use role-based access control (RBAC) to grant access to users, groups, or application service principals. 

Authorizing applications that access Azure Storage using Azure AD provides superior security and ease of use over other authorization options. While you can continue to use Shared Key authorization with your applications, using Azure AD circumvents the need to store your account access key with your code. Similarly, you can continue to use shared access signatures (SAS) to grant fine-grained access to resources in your storage account, but Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS.    

## About the preview

Keep in mind the following points about the preview:

- Azure AD integration is available for the Blob and Queue services only in the preview.
- Azure AD integration is available for GPv1, GPv2, and Blob storage accounts created with the Resource Manager deployment model only. Both standard and premium storage accounts are supported.
- Azure Storage supports both built-in and custom RBAC roles.
- You can assign roles down to the scope of an individual container or queue.
- This preview is intended for non-production use only. Production SLAs will not be available until Azure AD integration for Azure Storage is declared generally available. 

If Azure AD integration is not yet supported for your scenario, continue to use Shared Key authentication or SAS tokens in your applications. 

## Next Steps

To learn more about RBAC, see [Get started with Role-Based Access Control in the Azure portal](../../role-based-access-control/overview.md).




