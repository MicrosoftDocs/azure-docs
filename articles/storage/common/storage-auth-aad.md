---
title: Authenticate access to Azure Storage using Azure Active Directory (Preview) | Microsoft Docs
description: Authenticate access to Azure Storage using Azure Active Directory (Preview).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 05/22/2018
ms.author: tamram
---

# Authenticate access to Azure Storage using Azure Active Directory (Preview)

Azure Storage supports authentication and authorization with Azure Active Directory (AD) for the Blob and Queue services. With Azure AD, you can use role-based access control (RBAC) to grant access to users, groups, or application service principals. 

Authorizing applications that access Azure Storage using Azure AD provides superior security and ease of use over other authorization options. While you can continue to use Shared Key authorization with your applications, using Azure AD circumvents the need to store your account access key with your code. Similarly, you can continue to use shared access signatures (SAS) to grant fine-grained access to resources in your storage account, but Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS.

## About the preview

Keep in mind the following points about the preview:

- Azure AD integration is available for the Blob and Queue services only in the preview.
- Azure AD integration is available for GPv1, GPv2, and Blob storage accounts in all public regions. 
- Only storage accounts created with the Resource Manager deployment model are supported. 
- Support for caller identity information in Azure Storage Analytics logging is coming soon.
- Azure AD authorization of access to resources in standard storage accounts is currently supported. Authorization of access to page blobs in premium storage accounts will be supported soon.
- Azure Storage supports both built-in and custom RBAC roles. You can assign roles scoped to the subscription, the resource group, the storage account, or an individual container or queue.
- The Azure Storage client libraries that currently support Azure AD integration include:
    - [.NET](https://www.nuget.org/packages/WindowsAzure.Storage/9.2.0-Preview)
    - [Java](http://mvnrepository.com/artifact/com.microsoft.azure/azure-storage)(use 7.1.0-Preview)
    - Python
        - [Blob](https://github.com/Azure/azure-storage-python/releases/tag/v1.2.0rc1-blob)
        - [Queue](https://github.com/Azure/azure-storage-python/releases/tag/v1.2.0rc1-queue)

> [!IMPORTANT]
> This preview is intended for non-production use only. Production service-level agreements (SLAs) will not be available until Azure AD integration for Azure Storage is declared generally available. If Azure AD integration is not yet supported for your scenario, continue to use Shared Key authorization or SAS tokens in your applications. For additional information about the preview, see [Authenticate access to Azure Storage using Azure Active Directory (Preview)](storage-auth-aad.md).
>
> During the preview, RBAC role assignments may take up to five minutes to propagate.
>
> Azure AD integration with Azure Storage requires that you use HTTPS for Azure Storage operations.


For additional information about Azure AD integration for Azure Blobs and Queues, see the Azure Storage team blog post, [Announcing the Preview of Azure AD Authentication for Azure Storage](https://azure.microsoft.com/blog/announcing-the-preview-of-aad-authentication-for-storage/).

## Next Steps

- To learn more about RBAC roles for Azure Storage, see [Manage access rights to storage data with RBAC (Preview)](storage-auth-aad-rbac.md).
- To learn how to authenticate with Azure AD from your Azure Storage applications, see [Authenticate with Azure AD from an Azure Storage application (Preview)](storage-auth-aad-app.md)
- To learn how to authenticate with Azure AD from an Azure VM Managed Service Identity (MSI), see [Authenticate with Azure AD from an Azure VM Managed Service Identity (Preview)](storage-auth-aad-msi.md).
- To learn how to log into Azure CLI and PowerShell with an Azure AD identity, see [Use an Azure AD identity to access Azure Storage with CLI or PowerShell (Preview)](storage-auth-aad-script.md).


