---
title: "include file"
description: "include file"
services: storage
author: codemillmatt
ms.service: storage
ms.topic: "include"
ms.date: 11/23/2019
ms.author: masoucou
ms.custom: "include file"
---

### Copy your credentials from the Azure portal

When the sample application makes a request to Azure Storage, it must be authorized. To authorize a request, add your storage account credentials to the application as a connection string. View your storage account credentials by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Locate your storage account.
3. In the **Settings** section of the storage account overview, select **Access keys**. Here, you can view your account access keys and the complete connection string for each key.
4. Find the **Connection string** value under **key1**, and select the **Copy** button to copy the connection string. You will add the connection string value to an environment variable in the next step.

    ![Screenshot showing how to copy a connection string from the Azure portal](./media/storage-copy-connection-string-portal/portal-connection-string.png)

### Configure your storage connection string

After you have copied your connection string, set it to a class level variable in your *MainPage.xaml.cs* file. Open up *MainPaage.xaml.cs* and find the `storageConnectionString` variable. Replace `<yourconnectionstring>` with your actual connection string.

Here's the code:

```csharp
string storageConnectionString = "<yourconnectionstring>";
```