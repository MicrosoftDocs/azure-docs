---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 12/20/2019
ms.author: tamram
ms.custom: "include file"
---

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which Azure Storage resources a client is allowed to access, what permissions they have on those resources, and how long the SAS is valid.

Every SAS is signed with a key. You can sign a SAS in one of two ways:

- With a key created using Azure Active Directory (Azure AD) credentials. A SAS that is signed with Azure AD credentials is a *user delegation* SAS.
- With the storage account key. Both a *service SAS* and an *account SAS* are signed with the storage account key.

A user delegation SAS offers superior security to a SAS that is signed with the storage account key. Microsoft recommends using a user delegation SAS when possible. For more information, see [Grant limited access to data with shared access signatures (SAS)](../articles/storage/common/storage-sas-overview.md).
