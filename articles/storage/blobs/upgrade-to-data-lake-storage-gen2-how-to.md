---
title: Upgrade Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities  | Microsoft Docs
description: Shows you how to use Resource Manager templates to upgrade from Azure Blob storage to Data Lake Storage.
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 07/29/2020
ms.author: normesta

---

#  Upgrade Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities

This article helps you unlock new capabilities such as file and directory-level security and faster operations. Put some more material here.

## Upgrade your Storage account

Steps here for the Azure portal experience.

## Migrate data, workloads, and applications 

1. Configure [services in your workloads](data-lake-storage-integrate-with-azure-services.md) to point to either the **Blob service** endpoint or the **Data Lake storage** endpoint.

   > [!div class="mx-imgBorder"]
   > ![Account endpoints](./media/upgrade-to-data-lake-storage-gen2-how-to/storage-endpoints.png)
  
2. Test custom applications to ensure that they work as expected with your upgraded account. 

   [Multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md) enables most applications to continue using Blob APIs without modification. If you encounter issues or you want to use APIs to work with directory operations and ACLs, consider moving some of your code to use Data Lake Storage Gen2 APIs. See guides for [.NET](data-lake-storage-directory-file-acl-dotnet.md), [Java](data-lake-storage-directory-file-acl-java.md), [Python](data-lake-storage-directory-file-acl-python.md), [Node.js](data-lake-storage-acl-javascript.md), and [REST](https://docs.microsoft.com/rest/api/storageservices/data-lake-storage-gen2). 

3. Test any custom scripts to ensure that they work as expected with your upgraded account. 

   As is the case with Blob APIs, many of your scripts will likely work without requiring you to modify them. As needed, upgrade script files to use Data Lake Storage Gen2 [PowerShell cmdlets](data-lake-storage-directory-file-acl-powershell.md), and [Azure CLI commands](data-lake-storage-directory-file-acl-cli.md).
 

## See also

[Introduction to Azure Data Lake storage Gen2](data-lake-storage-introduction.md)