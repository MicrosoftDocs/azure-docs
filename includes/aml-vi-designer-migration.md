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

    After upgrading, all of your visual interface experiments and web services convert to pipeline drafts and real-time endpoints in the designer.
    
1. Go to the designer section of the workspace to see your list of pipeline drafts.
    
    Visual interface web services can be found by navigating to **Endpoints** > **Real-time endpoints**.

1. Select a pipeline draft to open it.

    If there was an error during the conversion process, a message will appear to help you resolve the issue. 

### Known issues

 Below are known migration issues that need to be addressed manually:

- **Import Data** or **Export Data** modules
        
        If you have an **Import Data** or **Export Data** module in the experiment, you need to update the data source to use a datastores. To learn how to create a datastore, see [How to Access Data in Azure storage services](../articles/machine-learning/service/how-to-access-data.md). Your cloud storage account information have been added in the comments of the **Import Data** or **Export Data** module for your convenience. 
      