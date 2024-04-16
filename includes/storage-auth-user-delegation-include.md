---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: azure-storage
ms.topic: "include"
ms.date: 01/15/2020
ms.author: tamram
ms.custom: "include file"
---

## About the user delegation SAS

A SAS token for access to a container or blob may be secured by using either Microsoft Entra credentials or an account key. A SAS secured with Microsoft Entra credentials is called a user delegation SAS, because the OAuth 2.0 token used to sign the SAS is requested on behalf of the user.

Microsoft recommends that you use Microsoft Entra credentials when possible as a security best practice, rather than using the account key, which can be more easily compromised. When your application design requires shared access signatures, use Microsoft Entra credentials to create a user delegation SAS for superior security. For more information about the user delegation SAS, see [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas).

> [!CAUTION]
> Any client that possesses a valid SAS can access data in your storage account as permitted by that SAS. It's important to protect a SAS from malicious or unintended use. Use discretion in distributing a SAS, and have a plan in place for revoking a compromised SAS.

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../articles/storage/common/storage-sas-overview.md).
