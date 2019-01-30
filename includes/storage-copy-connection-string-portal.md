---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 04/04/2018
ms.author: tamram
ms.custom: "include file"
---

## Copy your credentials from the Azure portal

The sample application needs to authenticate access to your storage account. To authenticate, add your storage account credentials to the application as a connection string. View your storage account credentials by following these steps:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Locate your storage account.
3. In the **Settings** section of the storage account overview, select **Access keys**. Here, you can view your account access keys and the complete connection string for each key.   
4. Find the **Connection string** value under **key1**, and select the **Copy** button to copy the connection string. You will add the connection string value to an environment variable in the next step.

    ![Screenshot showing how to copy a connection string from the Azure portal](media/storage-copy-connection-string-portal/portal-connection-string.png)
