---
title: Import or export data with Azure App Configuration
description: Learn how to import or export data to or from Azure App Configuration
services: azure-app-configuration
author: lisaguthrie
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/25/2020
ms.author: lcozzens
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your App Configuration store and code project. For example, you can set up one App Configuration store for testing and another for production. You can copy application settings between them so that you don't have to enter data twice.

This article provides a guide for importing and exporting data with App Configuration. If you’d like to set up an ongoing sync with your GitHub repo, take a look at our [GitHub Action](https://aka.ms/azconfig-gha1).

## Import data

Import brings configuration data into an App Configuration store from an existing source. Use the import function to migrate data into an App Configuration store or aggregate data from multiple sources. App Configuration supports importing from a JSON, YAML, or properties file.

Import data by using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md). From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/Export** from the **Operations** menu.

1. On the **Import** tab, select **Source service** > **Configuration File**.

1. Select **For language** and select your desired input type.

1. Select the **Folder** icon, and browse to the file to import.

    ![Import file](./media/import-file.png)

1. Select a **Separator**, and optionally enter a **Prefix** to use for imported key names.

1. Optionally, select a **Label**.

1. Select **Apply** to finish the import.

    ![Import file finished](./media/import-file-complete.png)

## Export data

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data in an App Configuration store to a file that's embedded with your application code during deployment.

Export data by using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-export.md). From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/Export**.

1. On the **Export** tab, select **Target service** > **Configuration File**.

1. Optionally enter a **Prefix** and select a **Label** and a point-in-time for keys to be exported.

1. Select a **File type** > **Separator**.

1. Select **Apply** to finish the export.

    ![Export file finished](./media/export-file-complete.png)

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)  
