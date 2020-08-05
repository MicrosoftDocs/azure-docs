---
title: Set your Azure portal preferences | Microsoft Docs
description: You can change Azure portal default settings to meet your own preferences. Settings include inactive session timeout, default view, menu mode, contrast, theme, notifications, and language and regional formats
services: azure-portal
keywords: settings, timeout, language, regional
author: mgblythe
ms.author: mblythe
ms.date: 08/05/2020
ms.topic: how-to

ms.service: azure-portal
manager:  mtillman
---

# Manage Azure portal preferences

You can change the default settings of the Azure portal to meet your own preferences. Most settings are available from the **Settings** menu in the global page header.

![Screenshot showing global page header icons with settings highlighted](./media/set-preferences/header-settings.png)


## Choose your default subscription

You can change the subscription that opens by default when you sign-in to the Azure portal. This is helpful if you have a primary subscription you work with but use others occasionally. 

:::image type="content" source="media/set-preferences/filter-subscription-default-view.png" alt-text="Filter resource list by subscription.":::

1. Select the directory and subscription filter icon in the top navigation.

1. Select the subscriptions you want as the default subscriptions when you launch the portal. 

    :::image type="content" source="media/set-preferences/default-directory-subscription-filter.png" alt-text="Select the subscriptions you want as the default subscriptions when you launch the portal."::: 


## Choose your default view 

You can change the page that opens by default when you sign-in to the Azure portal.

   ![Screenshot showing Azure portal settings with default view highlighted](./media/set-preferences/default-view.png)

The default view setting controls which Azure portal view is shown when you sign in. You can choose to open Azure Home by default, or the Dashboard view.

* **Home** can’t be customized.  It displays shortcuts to popular Azure services and lists the resources you’ve used most recently. We also give you useful links to resources like Microsoft Learn and the Azure roadmap.
* Dashboards can be customized to create a workspace designed just for you. For example, you can build a dashboard that is project, task, or role focused. If you select **Dashboard**, your default view will go to your most recently used dashboard.

## Choose a portal menu mode

The default mode for the portal menu controls how much space the portal menu takes up on the page.

* When the portal menu is in _flyout_ mode, it’s hidden until you need it. Select the menu icon to open or close the menu.
* If you choose _docked_ mode for the portal menu, it’s always visible. You can collapse the menu to provide more working space. 

## Choose a theme or enable high contrast

The theme that you choose affects the background and font colors that appear in the Azure portal. You can select from one of four preset color themes. Select each thumbnail to find the theme that best suits you.

   ![Screenshot showing Azure portal settings with themes highlighted](./media/set-preferences/theme.png)

You can choose one of the high-contrast themes instead. The high contrast settings make the Azure portal easier to read for people who have a visual impairment and override all other theme selections. For more information, see [Turn on high contrast or change theme](azure-portal-change-theme-high-contrast.md).

## Enable or disable pop-up notifications

Notifications are system messages related to your current session. They provide information like your current credit balance, when resources you just created become available, or confirm your last action, for example. When pop-up notifications are turned on, the messages briefly display in the top corner of your screen. 

To enable or disable pop-up notifications, select or de-select the **Enable pop-up notifications** checkbox.

   ![Screenshot showing Azure portal settings with pop-up notifications highlighted](./media/set-preferences/popup-notifications.png)

To read all notifications received during your current session, select **Notifications** from the global header.

   ![Screenshot showing Azure portal global header with notifications highlighted](./media/set-preferences/read-notifications.png)

If you want to read notifications from previous sessions, look for events in the Activity log. To learn more, read [View and retrieve Azure Activity log events](/azure/azure-monitor/platform/activity-log-view).

## Enable high contrast or change the portal theme

High contrast settings make the Azure portal easier to read. You can also choose a theme that changes the background colors of the portal. If you need more contrast or you want to change the color scheme in the Azure portal, go to the portal settings to make the change.

### Enable high contrast

1. In the header of the [Azure portal](https://portal.azure.com), select **Settings**.

    ![Screenshot that shows the portal settings gear icon in the Azure portal](./media/set-preferences/azure-portal-settings-icon.png)
1. Choose **White** or **Black**.

    ![Screenshot that shows high contrast options in the Azure portal settings](./media/set-preferences/azure-portal-highcontrast-options.png)
1. Select **Apply**.

> [!NOTE]
> If you select a high contrast theme, it will override all other theme selections.

### Change the portal theme

1. In the header of the [Azure portal](https://portal.azure.com), select **Settings**.

    ![Screenshot that shows the portal settings gear icon in the Azure portal](./media/set-preferences/azure-portal-settings-icon.png)

1. Choose a theme.

    ![Screenshot that shows the theme options in the Azure portal settings](./media/set-preferences/azure-portal-theme-options.png)

1. Select **Apply**.

## Change the inactivity timeout setting

The inactivity timeout setting helps to protect resources from unauthorized access if you forget to secure your workstation. After you've been idle for a while, you’re automatically signed out of your Azure portal session. As an individual, you can change the timeout setting for yourself. If you're an admin, you can set it at the directory level for all your users in the portal.

### Change your individual timeout setting - user

Select the drop-down under **Sign me out when inactive**. Choose the duration after which your Azure portal session is  signed out if you’re idle.

   ![Screenshot showing portal settings with inactive timeout settings highlighted](./media/set-preferences/inactive-signout-user.png)

The change is saved automatically. If you’re idle, your Azure portal session will sign out after the duration you set.

This setting can also be made by an admin at the directory level to enforce a maximum idle time. If an admin has made a directory-level timeout setting, you can still set your own inactive sign-out duration. Choose a time setting that is less than what is set at the directory level.

If your admin has enabled an inactivity timeout policy, select the **Override the directory inactivity timeout policy** checkbox. Set a time interval that is less than the policy setting.

   ![Screenshot showing portal settings with override the directory inactivity timeout policy setting highlighted](./media/set-preferences/inactive-signout-override.png)

### Change the directory timeout setting - admin

Admins in the [Global Administrator role](../active-directory/users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator) can enforce the maximum idle time before a session is signed out. The inactivity timeout setting applies at the directory level. For more information about directories, see [Active Directory Domain Services Overview](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview).

If you’re a Global Administrator, and you want to enforce an idle timeout setting for all users of the Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Settings** from the global page header.

1. Select the link text **Configure directory level timeout**.

    ![Screenshot showing portal settings with link text highlighted](./media/set-preferences/settings.png)

1. A new page opens. On the **Configure directory level inactivity timeout** page, select **Enable directory level idle timeout for the Azure portal** to turn on the setting.

1. Next, enter the **Hours** and **Minutes** for the maximum time that a user can be idle before their session is automatically signed out.

1. Select **Apply**.

    ![Screenshot showing page to set directory-level inactivity timeout](./media/set-preferences/configure.png)

To confirm that the inactivity timeout policy is set correctly, select **Notifications** from the global page header. Verify that a success notification is listed.

  ![Screenshot showing successful notification message for directory-level inactivity timeout](./media/set-preferences/confirmation.png)

The setting takes effect for new sessions. It won’t apply immediately to any users who are already signed in.

> [!NOTE]
> If a Global Administrator has configured a directory-level timeout setting, users can override the policy and set their own inactive sign-out duration. However, the user must choose a time interval that is less than what is set at the directory level by the Global Administrator.
>

## Restore default settings

If you’ve made changes to the Azure portal settings and want to discard them, select **Restore default settings**. Any changes you’ve made to portal settings will be lost. This option doesn’t affect dashboard customizations.

## Export or delete user settings

You can use settings and features in the Azure portal to create a custom experience. Information about your custom settings is stored in Azure. You can export or delete the following user data:

* Private dashboards in the Azure portal
* User settings like favorite subscriptions or directories, and last logged-in directory
* Themes and other custom portal settings

It's a good idea to export and review your settings before you delete them. Rebuilding dashboards or redoing custom settings can be time-consuming.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

To export or delete your portal settings:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the header of the portal, select ![settings icon](./media/set-preferences/settings-icon.png) **Settings**.

1. Select **Export all settings** or **Delete all settings and private dashboards**.

    ![Azure portal settings and settings options](./media/set-preferences/azure-portal-settings-with-export-delete.png)

      The following table describes these actions.

      | Action | Description |
      | --- | --- |
      | **Export all settings** | Creates a *.json* file that contains your user settings like your color theme, favorites, and private dashboards.|
      | **Delete all settings and private dashboards** | Deletes all links to private dashboards and other custom settings you've made to the portal. |

> [!NOTE]
> Due to the dynamic nature of user settings and risk of data corruption, you can't import settings from the *.json* file.

## Change language and regional settings

There are two settings that control how the text in the Azure portal appears. The **Language** setting controls the language you see for text in the Azure portal. **Regional format** controls the way dates, time, numbers, and currency are shown.

To change the language that is used in the Azure portal, use the drop-down to select from the list of available languages.

The regional format selection changes to display regional options for only the language you selected. To change that automatic selection, use the drop-down to choose the regional format you want.

For example, if you select English as your language, and then select United States as the regional format, currency is shown in U.S. dollars. If you select English as the language and then select Europe as the regional format, currency is shown  in euros.

Select **Apply** to update your language and regional format settings.

   ![Screenshot showing language and regional format settings](./media/set-preferences/language.png)

>[!NOTE]
>These language and regional settings affect only the Azure portal. Documentation links that open in a new tab or window will use your browser's language settings to determine the language to display.
>

## Next steps

- [Keyboard shortcuts in Azure portal](azure-portal-keyboard-shortcuts.md)
- [Supported browsers and devices](azure-portal-supported-browsers-devices.md)
- [Add, remove, and rearrange favorites](azure-portal-add-remove-sort-favorites.md)
- [Create and share custom dashboards](azure-portal-dashboards.md)
- [Azure portal how-to video series](azure-portal-video-series.md)
