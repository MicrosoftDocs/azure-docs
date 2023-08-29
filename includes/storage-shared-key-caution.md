---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: azure-storage
ms.topic: include
ms.date: 02/07/2023
ms.author: tamram
ms.custom: include file
---

> [!CAUTION]
> Authorization with Shared Key is not recommended as it may be less secure. For optimal security, disable authorization via Shared Key for your storage account, as described in [Prevent Shared Key authorization for an Azure Storage account](../articles/storage/common/shared-key-authorization-prevent.md).
>
> Use of access keys and connection strings should be limited to initial proof of concept apps or development prototypes that don't access production or sensitive data. Otherwise, the token-based authentication classes available in the Azure SDK should always be preferred when authenticating to Azure resources.
>
> Microsoft recommends that clients use either Azure AD or a shared access signature (SAS) to authorize access to data in Azure Storage. For more information, see [Authorize operations for data access](../articles/storage/common/authorize-data-access.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json).
