---
title: Copy files from multiple containers with Azure Data Factory | Microsoft Docs
description: Learn how to use a solution template to copy files from multiple containers with Azure Data Factory.
services: data-factory
documentationcenter: ''
author: dearandyxu
ms.author: yexu
ms.reviewer: douglasl
manager: craigg
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/1/2018
---
# Copy files from multiple containers with Azure Data Factory

The solution template described in this article helps you to copy files from multiple files, containers, or buckets between file stores. For example, maybe you want to migrate your data lake from AWS S3 to Azure Data Lake Store. Or maybe you want to replicate everything from one Azure Blob Storage account to another Azure Blob Storage account. This template is designed for these use cases.

If you want to copy files from a single container or bucket, it's more efficient to use the **Copy Data Tool** to create a pipeline with a single Copy activity. This template is more than you need for this simple use case.

## About this solution template

This template enumerates the containers from your source storage store, and then copies each of the containers from the source storage store to the destination store. 

The template contains three activities:
-   A **GetMetadata** activity to scan your source storage store and get the container list.
-   A **ForEach** activity to get the container list from the **GetMetadata** activity and then iterate over the list and pass each container to the Copy activity.
-   A **Copy** activity to copy each container from the source storage store to the destination store.

The template defines two parameters:
-   The parameter *SourceFilePath* is the path of your data source store, where you can get a list of the containers or buckets. In most cases, the path is the root directory, which contains multiple container folders. The default value of this parameter is `/`.
-   The parameter *DestinationFilePath* is the path where the files will be copied in your destination store. The default value of this parameter is `/`.

## How to use this solution template

1. Go to template **Copy multiple files containers between File Stores**, and create a **new connection** to your source storage store. The source storage store is the place where you want to copy files from multiple containers or buckets.

    ![Create a new connection to the source](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image1.png)

2. Create a **new connection** to your destination storage store.

    ![Create a new connection to the destination](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image2.png)

3. Click **Use this template**.

    ![Use this template](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image3.png)
	
4. You will see the pipeline available in the panel, as shown in the following example:

    ![Show the pipeline](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image4.png)

5. Click **Debug**, input **Parameters** and click **Finish**.

    ![Run the pipeline](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image5.png)

6. Review the result.

    ![Review the result](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image6.png)

## Next steps

- [Introduction to Azure Data Factory](introduction.md)
