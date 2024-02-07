---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 06/08/2020
ms.author: shaas
---


This section describes the limits for Azure Storage service, and the required naming conventions for Azure Files, Azure block blobs, and Azure page blobs, as applicable to the Data Box service. Review the storage limits carefully and follow all the recommendations.

For the latest information on Azure storage service limits and best practices for naming shares, containers, and files, go to:

- [Naming and referencing containers](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata)
- [Naming and referencing shares](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Block blobs and page blob conventions](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

> [!IMPORTANT]
> If there are any files or directories that exceed the Azure Storage service limits, or don't conform to Azure Files/Blob naming conventions, then these files or directories aren't ingested into the Azure Storage via the Data Box service.
