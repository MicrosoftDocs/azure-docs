---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 09/06/2018
ms.author: tamram
ms.custom: "include file"
---

> [!IMPORTANT]
> - The preview of Azure AD authentication for blobs and queues is intended for non-production use only. Production service-level agreements (SLAs) are not currently available. If Azure AD authentication is not yet supported for your scenario, continue to use Shared Key authorization or SAS tokens in your applications.
>
> - During the preview, RBAC role assignments may take up to five minutes to propagate.
>
> - You must use HTTPS to authenticate with Azure AD when calling blob and queue operations.
>
> - In the preview release, the Azure portal does not use Azure AD credentials to read and write blob and queue data. Instead, the portal continues to rely on the account access key. To view or update blob or queue data in the portal, the user must be assigned an RBAC role that encompasses  [Microsoft.Storage/storageAccounts/listkeys/action](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-account-key-operator-service-role), which grants permissions to call [Storage Accounts - List Keys](https://docs.microsoft.com/rest/api/storagerp/storageaccounts/listkeys). The Contributor and Reader roles for blobs and queues do not currently include the **listkeys** action as part of the preview release and so do not provide data access through the Azure portal. To explore identity-based access to blob and queue data during the preview release, use PowerShell or Azure CLI.
