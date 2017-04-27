---
title: Azure Government Storage | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: ryansoc
manager: zakramer

ms.assetid: 83df022b-d791-4efb-9fdf-8afe47a885d5
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 12/22/2016
ms.author: ryansoc

---
# Azure Government Storage
## Azure Storage
For details on this service and how to use it, see [Azure Storage public documentation](../storage/index.md).

### Storage Service Availability by Azure Government Region

| Service | USGov Virginia | USGov Iowa | Notes
| --- | --- | --- | --- |
| [Blob Storage] (../storage/storage-introduction.md#blob-storage) |GA |GA |
| [Table Storage] (../storage/storage-introduction.md#table-storage) |GA  |GA |
| [Queue Storage] (../storage/storage-introduction.md#queue-storage) |GA | GA |
| [File Storage] (../storage/storage-introduction.md#file-storage) |GA |GA |
| [Hot/Cool Blob Storage] (../storage/storage-blob-storage-tiers.md) |NA |NA |
| [Storage Service Encryption] (../storage/storage-service-encryption.md) |GA |GA |
| [Premium Storage] (../storage/storage-premium-storage.md) |GA |NA | Includes DS-series Virtual Machines. |
| [Blob Import/Export] (../storage/storage-import-export-service.md) |GA |GA |
| [StorSimple] (../storsimple/storsimple-ova-overview.md) |GA |GA |

> [!NOTE]
> Zone Redundant Storage (ZRS) is not available in US Gov Virginia and US Gov Iowa.
>
>

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

> [!NOTE]
> If error 53 "The network path was not found." is returned, while [Mounting the file share] (../storage/storage-dotnet-how-to-use-files.md#mount-the-file-share). It could be due to firewall blocking the outbound port. Try mounting the file share on VM that's in the same Azure Subscription as storage account.
>
>

> [!NOTE]
> When deploying StorSimple Manager Service, use https://portal.azure.us/ and https://manage.windowsazure.us/ URLs for Azure portal and Classic portal respectively. For deployment instructions for StorSimple Virtual Array, see [StorSimple Virtual Array system requirements] (../storsimple/storsimple-ova-system-requirements.md) and for StorSimple 8000 series, see [StorSimple software, high availability, and networking requirements] (../storsimple/storsimple-system-requirements.md) and go to Deploy section from left navigation. For general StorSimple documentation, see [What is StorSimple?] (../storsimple/index.md).
>
>

### Considerations
The following information identifies the Azure Government boundary for Azure Storage:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| Data entered, stored, and processed within an Azure Storage product can contain export controlled data. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. |Azure Storage metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter Regulated/controlled data into the following fields:  Resource groups, Deployment names, Resource names, Resource tags |

## Next Steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
