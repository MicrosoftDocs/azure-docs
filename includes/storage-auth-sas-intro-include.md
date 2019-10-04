---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 07/25/2019
ms.author: tamram
ms.custom: "include file"
---

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which Azure Storage resources a client is allowed to access, what permissions they have on those resources, and how long the SAS is valid.

Every SAS is signed with a key. You can sign a SAS in one of two ways:

- With a key created using Azure Active Directory (Azure AD) credentials. A SAS signed with Azure AD credentials is a *user delegation* SAS.
- With the storage account key. Both a *service SAS* and an *account SAS* are signed with the storage account key.
