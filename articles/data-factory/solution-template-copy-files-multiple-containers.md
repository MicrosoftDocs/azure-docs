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
ms.devlang: na
ms.topic: conceptual
ms.date: 11/1/2018
---
# Copy files from multiple containers

The solution template described in this article helps you to copy files from multiple containers in one file-based storage to another. For example, maybe you want to migrate your data lake from AWS S3 to Azure Data Lake Store. Or maybe you want to replicate everything from one Azure Blob Storage account to another Azure Blob Storage account. This template is designed for these use cases.

If you want to copy files from a single container or folder, it's more efficient for you to have one single copy activity in your pipeline. This template is more than you need for this simple use case.

## About this solution template

This template enumerates the containers from your source storage store, and then copies each of the containers from the source storage store to the destination store. 

The template contains three activities:
1. A **GetMetadata** activity to scan your source storage store and get the container list.
2. A **ForEach** activity to get the container list from previous activity and then pass each container to the Copy activity. 
3. A **Copy** activity to copy each container from the source storage store to the destination store.

The template defines two parameters:
1. The parameter *root directory on source store* is the path of the root directory in your data source store. There are multiple containers under the root directory.  The default value of this parameter is `/`.
2. The parameter *destination directory on destination store* is the path where the files will be copied in your destination store. The default value of this parameter is `/`.

## How to use this solution template

1. Select the **FullCopyFiles** template.

    ![Choose the template](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image1.png)

2. In the **FullCopyFiles** windows, drop down the source storage store and Select **+ New** to create a new connection to your source storage store.  

    ![Create a new connection to the source](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image2.png)

3. Input the connection information for your source storage store, as shown in the following example:

    ![Enter the connection information](media/solution-template-copy-files-multiple-containers/copy-files-multiple-containers-image3.png)

## Next steps

- [Introduction to Azure Data Factory](introduction.md)
