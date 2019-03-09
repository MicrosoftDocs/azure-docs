---
title: Import or export data with Azure App Configuration | Microsoft Docs
description: Learn how to import or export data to or from Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/24/2019
ms.author: yegu
ms.custom: mvc
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. These allow you to work with configuration data in bulk as well as exchange data between your app configuration store and code project. For example, you can setup one app configuration store for testing and another for production and copy application settings between them via a file so that you do not have to enter the data twice.

This article provides a guide for importing and exporting data with App Configuration.

## Import data

Import brings configuration data into App Configuration store from an existing source, instead of manually entering them. You can use the import function to migrate data into an app configuration store or aggregate data from multiple sources. App Configuration support importing from a JSON, YAML or Properties file.

You can import data using either the [Azure portal](https://aka.ms/azconfig/portal) or  [Azure CLI](./scripts/cli-import.md). From the Azure portal, follow these steps:

1. Browse to your app configuration store and click **Import/Export**.

2. In the **Import** tab, choose **Source service** and **Configuration File**.

3. Choose **For language** and **File type**.

4. Click on the **Folder** icon and browse to the file to import.

    ![Import file](./media/import-file.png)

5. Choose a **Separator** and optionally enter a **Prefix** to use for imported key names.

6. Optionally choose a **Label**.

7. Click **Apply** to complete the import.

    ![Import file complete](./media/import-file-complete.png)

## Export data

Export writes configuration data stored in App Configuration to another destination. You can use the export function, for example, to save data in an app configuration store to a file that will be embedded with your application code during deployment.

You can export data using either the [Azure portal](https://aka.ms/azconfig/portal) or  [Azure CLI](./scripts/cli-export.md). From the Azure portal, follow these steps:

1. Browse to your app configuration store and click **Import/Export**.

2. In the **Export** tab, choose **Target service** and **Configuration File**.

3. Optionally enter a **Prefix** and choose a **Label** and a point-in-time for keys to be exported.

4. Choose a **File type** and **Separator**.

5. Click **Apply** to complete the export.

    ![Export file complete](./media/export-file-complete.png)

## Next steps

* [Quickstart: Create an ASP.NET web app](./quickstart-aspnet-core-app.md)  
