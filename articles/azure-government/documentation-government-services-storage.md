---
title: Azure Government Storage | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: Azure-Government
cloud: gov
documentationcenter: ''
author: ryansoc
manager: zakramer
editor: ''

ms.assetid: 83df022b-d791-4efb-9fdf-8afe47a885d5
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/13/2016
ms.author: ryansoc

---
# Azure Government Storage
## Azure Storage
For details on this service and how to use it, see [Azure Storage public documentation](../storage/index.md).

### Storage Service Availability by Azure Government Region

| Service | USGov Virginia | USGov Iowa |
| --- | --- | --- |
| [Blob Storage] (../storage/storage-introduction.md#blob-storage) |GA |GA |
| [Table Storage] (../storage/storage-introduction.md#table-storage) |GA  |GA |
| [Queue Storage] (../storage/storage-introduction.md#queue-storage) |GA | GA |
| [File Storage] (../storage/storage-introduction.md#file-storage) |GA |GA |
| [Hot/Cool Blob Storage] (../storage/storage-blob-storage-tiers.md) |NA |NA |
| [Storage Service Encryption] (../storage/storage-service-encryption.md) |GA |GA |
| [Premium Storage] (../storage/storage-premium-storage.md) (includes DS-series VMs) |GA |NA |
| [Blob Import/Export] (../storage/storage-import-export-service.md) (Classic only) |GA |GA |

### Variations
The URLs for storage accounts in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Blob Storage |*.blob.core.windows.net |*.blob.core.usgovcloudapi.net |
| Queue Storage |*.queue.core.windows.net |*.queue.core.usgovcloudapi.net |
| Table Storage |*.table.core.windows.net |*.table.core.usgovcloudapi.net |
| File Storage |*.file.core.windows.net |*.file.core.usgovcloudapi.net | 

> [!NOTE]
> All of your scripts and code needs to account for the appropriate endpoints.  See [Configure Azure Storage Connection Strings](../storage/storage-configure-connection-string.md). 
>
>

For more information on APIs see the <a href="https://msdn.microsoft.com/en-us/library/azure/mt616540.aspx"> Cloud Storage Account Constructor</a>.

The endpoint suffix to use in these overloads is core.usgovcloudapi.net

<a href="http://storageexplorer.com/">Azure Storage Explorer</a> currently doesn't support sign in with account in Azure Government. Use an account name and key to connect to an Azure Storage Account.

### Considerations
The following information identifies the Azure Government boundary for Azure Storage:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| Data entered, stored, and processed within an Azure Storage product can contain export controlled data. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. |Azure Storage metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter Regulated/controlled data into the following fields:  Resource groups, Deployment names, Resource names, Resource tags |

## Next Steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
