---
title: Export or delete Azure portal settings
description: Learn how you can export or delete your user settings, private dashboards, and custom settings in the Azure portal.  
services: azure-portal
keywords: 
author: santhoshsomayajula
ms.date: 01/29/2020
ms.topic: how-to

ms.service: azure-portal
ms.custom: 
manager:  mtillman
ms.author: mblythe
---
# Export or delete user settings

You can use settings and features in the Azure portal to create a custom experience. Information about your custom settings is stored in Azure. You can export or delete the following user data:

* Private dashboards in the Azure portal
* User settings like favorite subscriptions or directories, and last logged-in directory
* Themes and other custom portal settings

It's a good idea to export and review your settings before you delete them. Rebuilding dashboards or redoing custom settings can be time-consuming.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## Export or delete your portal settings

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the header of the portal, select ![settings icon](media/azure-portal-export-delete-settings/settings-icon.png) **Settings**.

1. Select **Export all settings** or **Delete all settings and private dashboards**.

    ![Azure portal settings and settings options](media/azure-portal-export-delete-settings/azure-portal-settings-with-export-delete.png)

      The following table describes these actions.

      | Action | Description |
      | --- | --- |
      | **Export all settings** | Creates a *.json* file that contains your user settings like your color theme, favorites, and private dashboards.|
      | **Delete all settings and private dashboards** | Deletes all links to private dashboards and other custom settings you've made to the portal. |

> [!NOTE]
> Due to the dynamic nature of user settings and risk of data corruption, you can't import settings from the *.json* file.
>
>

## Next steps

* [Share Azure dashboards by using Role-Based Access Control](azure-portal-dashboard-share-access.md)
* [Add, remove, and rearrange favorites](azure-portal-add-remove-sort-favorites.md)
