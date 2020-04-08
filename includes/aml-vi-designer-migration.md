---
title: "include file"
description: "include file"
services: machine-learning
ms.service: machine-learning
ms.custom: "include file"
ms.topic: "include"
author: xiaoharper
ms.author: zhanxia
ms.date: 10/18/2019
---

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).

1. Upgrade your workspace to Enterprise edition.

    After upgrading, all of your visual interface experiments will convert to pipeline drafts in the designer.
    
    > [!NOTE]
    > You don't need to upgrade to the Enterprise edition to convert visual interface web services to real-time endpoints.
    
1. Go to the designer section of the workspace to view your list of pipeline drafts. 
    
    Converted web services can be found by navigating to **Endpoints** > **Real-time endpoints**.

1. Select a pipeline draft to open it.

    If there was an error during the conversion process, an error message will appear with instructions to resolve the issue. 

### Known issues

 Below are known migration issues that need to be addressed manually:

- **Import Data** or **Export Data** modules
        
    If you have an **Import Data** or **Export Data** module in the experiment, you need to update the data source to use a datastores. To learn how to create a datastore, see [How to Access Data in Azure storage services](../articles/machine-learning/how-to-access-data.md). Your cloud storage account information have been added in the comments of the **Import Data** or **Export Data** module for your convenience. 
      