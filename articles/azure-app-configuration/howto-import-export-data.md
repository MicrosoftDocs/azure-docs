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

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your app configuration store and code project. For example, you can set up one app configuration store for testing and another for production. You then can copy application settings between them via a file so that you don't have to enter data twice.

This article provides a guide for importing and exporting data with App Configuration.

## Import data

Import brings configuration data into an App Configuration store from an existing source, instead of manually entering it. Use the import function to migrate data into an app configuration store or aggregate data from multiple sources. App Configuration supports importing from a JSON, YAML, or properties file.

Import data by using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md). From the Azure portal, follow these steps:

1. Browse to your app configuration store, and select **Import/Export**.

2. On the **Import** tab, select **Source service** > **Configuration File**.

3. Select **For language** > **File type**.

4. Select the **Folder** icon, and browse to the file to import.

    ![Import file](./media/import-file.png)

5. Select a **Separator**, and optionally enter a **Prefix** to use for imported key names.

6. Optionally, select a **Label**.

7. Select **Apply** to finish the import.

    ![Import file finished](./media/import-file-complete.png)

## Export data

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data in an app configuration store to a file that's embedded with your application code during deployment.

Export data by using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-export.md). From the Azure portal, follow these steps:

1. Browse to your app configuration store, and select **Import/Export**.

2. On the **Export** tab, select **Target service** > **Configuration File**.

3. Optionally enter a **Prefix** and select a **Label** and a point-in-time for keys to be exported.

4. Select a **File type** > **Separator**.

5. Select **Apply** to finish the export.

    ![Export file finished](./media/export-file-complete.png)

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)  
