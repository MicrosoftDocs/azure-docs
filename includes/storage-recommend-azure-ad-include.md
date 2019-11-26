---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 06/20/2019
ms.author: tamram
ms.custom: "include file"
---

> [!TIP]
> Azure Storage supports authorizing requests to Blob and Queue storage using Azure Active Directory (Azure AD). Authorizing users or applications using an OAuth 2.0 token returned by Azure AD provides superior security and ease of use over Shared Key authorization. With Azure AD, there is no need to store the account access key with your code and risk potential security vulnerabilities.
>
> Additionally, Azure Storage supports the user delegation shared access signature (SAS) for Blob storage. The user delegation SAS is signed with Azure AD credentials. When your application design requires shared access signatures for access to Blob storage, use Azure AD credentials to create a user delegation SAS for superior security.
>
> Microsoft recommends using Azure AD with your Azure Storage applications when possible. For more information, see [Authorize access to Azure blobs and queues using Azure Active Directory](../articles/storage/common/storage-auth-aad.md).
