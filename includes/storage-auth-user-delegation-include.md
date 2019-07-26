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

## About the user delegation SAS

A SAS is a token that encapsulates all of the information needed to make a request to Azure Storage in a query string that is appended to a container or blob URI. The SAS token includes information about the type of resource, the permissions granted to the client, the interval over which the SAS is valid, and a signature that secures the token. Additional optional parameters may be included as well.

A SAS token may be secured by using either your Azure AD credentials or your account key. A SAS secured with your Azure AD credentials is called a *user delegation* SAS, because the token used to create the SAS is requested on behalf of the user. Microsoft recommends that you use Azure AD credentials when possible as a security best practice, rather than using the account key, which can be more easily compromised. When your application design requires shared access signatures, use Azure AD credentials to create a user delegation SAS for superior security.

> [!CAUTION]
> Any client that possesses a valid SAS can access data in your storage account as permitted by that SAS. It's important to protect a SAS from malicious or unintended use. Use discretion in distributing a SAS, and have a plan in place for revoking a compromised SAS. For more information, see .... 

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-shared-access-signatures.md).
