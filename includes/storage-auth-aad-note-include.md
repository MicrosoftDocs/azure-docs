---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 03/21/2019
ms.author: tamram
ms.custom: "include file"
---

> [!NOTE]
> - RBAC role assignments may take up to two minutes to propagate.
>
> To authorize blob and queue operations with an OAuth token, you must use HTTPS.
>
> - The Azure portal now supports using Azure AD credentials to read and write blob and queue data, as part of the preview release. To access blob and queue data in the Azure portal, a user must be assigned the Azure Resource Manager **Reader** role, in addition to the appropriate role for blob or queue access. For more information, see [Grant access to Azure containers and queues with RBAC in the Azure portal](../articles/storage/common/storage-auth-aad-rbac.md). 
> 
> - [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) currently uses your storage account key to access blob and queue data. If the key is not available, then Azure AD authorization is used for access to blobs. Azure AD authorization is not currently supported for queues. 
>
> - Azure Files supports authentication with Azure AD over SMB for domain-joined VMs only (preview). To learn about using Azure AD over SMB for Azure Files, see [Overview of Azure Active Directory authentication over SMB for Azure Files (preview)](../articles/storage/files/storage-files-active-directory-overview.md).