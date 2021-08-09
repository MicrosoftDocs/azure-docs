---
title: Manage Azure portal settings and preferences
description: Change Azure portal settings such as default subscription/directory, timeouts, menu mode, contrast, theme, notifications, language/region and more.
ms.date: 06/21/2021
ms.topic: how-to
---

# Manage Azure portal settings and preferences

You can change the default settings of the Azure portal to meet your own preferences.

Most settings are available from the **Settings** menu in the top right section of global page header.

:::image type="content" source="./media/set-preferences/settings-top-header.png" alt-text="Screenshot showing the settings icon in the global page header.":::

> [!NOTE]
> We're in the process of moving all users to the newest settings experience described in this topic. For information about the older experience, see [Manage Azure portal settings and preferences (older version)](original-preferences.md).

## Settings overview

The settings **Overview** pane shows key settings in one glance and lets you switch directories or view and activate subscription filters.

In the **Directories** section, you can switch to a recently used directory by selecting **Switch** next to the desired directory. For a full list of directories to which you have access, select **See all**.

If you've [opted in to the new subscription filtering experience](#opt-into-the-new-subscription-filtering-experience), you can change the active filter to view the subscriptions or resources of your choice in the *Subscriptions + filters** section. To view all available filters, select **See all**.

To change other settings, select any of the items in the pane, or select an item in the left menu bar. You can also use the search menu near the top of the screen to find a setting.

:::image type="content" source="./media/set-preferences/azure-portal-settings-overview.png" alt-text="Screenshot showing the Settings overview in the Azure portal.":::

## Directories

In **Directories**, you can select **All Directories** to see a full list of directories to which you have access.

To mark a directory as a favorite, select its star icon. Those directories will be listed in the  **Favorites** section.

To switch to a different directory, select the directory that you want to work in, then select the **Switch** button near the bottom of the screen. You'll be prompted to confirm before switching. If you'd like the new directory to be the default directory whenever you sign in to the Azure portal, you can select the box to make it your startup directory.

:::image type="content" source="./media/set-preferences/azure-portal-settings-directory.png" alt-text="Screenshot showing the Directories settings pane.":::

## Subscriptions + filters

You can choose the subscriptions that are filtered by default when you sign in to the Azure portal by selecting the directory and subscription filter icon in the global page header. This can be helpful if you have a primary list of subscriptions you work with but use others occasionally.

:::image type="content" source="./media/set-preferences/azure-portal-subscriptions-topbar-icon.png" alt-text="Screenshot showing the subscription filter icon.":::

### Opt into the new subscription filtering experience

The new subscription filtering experience can help you manage large numbers of subscriptions. You can opt in to this experience at any time when you select the directory and subscription filter icon. If you decide to return to the [previous experience](original-preferences.md#choose-your-default-subscription), you can do so from the **Subscriptions + filters** pane.

:::image type="content" source="./media/set-preferences/azure-portal-subscription-filtering-opt-in.png" alt-text="Screenshot showing the opt-in option for the new subscription filter settings.":::

> [!IMPORTANT]
> If you have access to delegated subscriptions through [Azure Lighthouse](../lighthouse/overview.md), be sure that all directories and subscriptions are selected before you select the **Try it now** link, or else the new experience may not show all of the subscriptions to which you have access. If that happens, you can select **Switch back to the previous view** in the **Subscriptions + filters** pane, then repeat the opt in process with all directories and subscriptions selected. For more information, see [Work in the context of a delegated subscription](../lighthouse/how-to/view-manage-customers.md#work-in-the-context-of-a-delegated-subscription).

In the new experience, the **Subscriptions + filters** pane lets you create customized filters.  When you activate one of your filters, the full portal experience will be scoped to show only the subscriptions to which the filter applies. You can do this by selecting **Activate** in the **Subscription + filters** pane, or in the **Subscriptions + filters** section of the overview pane.

:::image type="content" source="./media/set-preferences/azure-portal-settings-filtering.png" alt-text="Screenshot showing the Subscriptions + filters settings pane.":::

The **Default** filter shows all subscriptions to which you have access. This filter is used if there are no other filters, or when the active filter fails to include any subscriptions.

You'll also see a filter named **Imported-filter**, which includes all subscriptions that had been selected before opting in to the new filtering experience.

### Create a filter

To create additional filters of your choice, select **Create a filter** in the **Subscriptions + filters** pane. You can create up to ten filters.

Each filter must have a unique name that is between 8 and 50 characters long and contains only letters, numbers, and hyphens.

:::image type="content" source="./media/set-preferences/azure-portal-settings-filtering-create.png" alt-text="Screenshot showing the Create a filter options.":::

After you've named your filter, enter at least one condition. In the **Filter type** field, select either **Subscription name**, **Subscription ID**, or **Subscription state**. Then select an operator and enter a value to filter on.

:::image type="content" source="./media/set-preferences/azure-portal-settings-filtering-create-operators.png" alt-text="Screenshot showing the list of operators for filter creation.":::

When you're finished adding conditions, select **Create**. Your filter will then appear in the list in **Subscriptions + filters**.

### Modify or delete a filter

You can modify or rename an existing filter by selecting the pencil icon in that filter's row. Make your changes, and then select **Apply**.

> [!NOTE]
> If you modify a filter that is currently active, and the changes result in 0 subscriptions, the **Default** filter will become active instead. You can't activate a filter which doesn't include any subscriptions.

To delete a filter, select the trash can icon in that filter's row. You can't delete the **Default** filter or any filter that is currently active.

## Appearance

The **Appearance** pane lets you choose menu behavior, your color theme, and whether to use a high-contrast theme.

:::image type="content" source="./media/set-preferences/azure-portal-settings-appearance.png" alt-text="Screenshot showing the Appearance settings pane.":::

### Set menu behavior

The **Menu behavior** section lets you choose how the default Azure portal menu behaves.

- **Flyout**: The menu will be hidden until you need it. You can select the menu icon in the upper left hand corner to open or close the menu.
- **Docked**: The menu will always be visible. You can collapse the menu to provide more working space.

### Choose a theme or enable high contrast

The theme that you choose affects the background and font colors that appear in the Azure portal. In the **Theme** section, you can select from one of four preset color themes. Select each thumbnail to find the theme that best suits you.

Alternatively, you can choose a theme from the **High contrast theme** section. These themes can make the Azure portal easier to read, especially if you have a visual impairment. Selecting either the white or black high-contrast theme will override any other theme selections.

## Startup views

This pane allows you to set options for what you see when you first sign in to the Azure portal.

:::image type="content" source="./media/set-preferences/azure-portal-settings-startup-views.png" alt-text="Screenshot showing the Startup views settings pane.":::

### Startup page

Choose one of the following options for the page you'll see when you first sign in to the Azure portal.

- **Home**: Displays the home page, with shortcuts to popular Azure services, a list of resources you've used most recently, and useful links to tools, documentation, and more.
- **Dashboard**: Displays your most recently used dashboard. Dashboards can be customized to create a workspace designed just for you. For example, you can build a dashboard that is project, task, or role focused. For more information, see [Create and share dashboards in the Azure portal](azure-portal-dashboards.md).

### Startup directory

Choose one of the following options for the directory to work in when you first sign in to the Azure portal.

- **Sign in to your last visited directory**: When you sign in to the Azure portal, you'll start in whichever directory you'd been working in last time.
- **Select a directory**: Choose this option to select one of your directory. You'll start in that directory every time you sign in to the Azure portal, even if you had been working in a different directory last time.

## Language + region

Choose your language and the regional format that will influence how data such as dates and currency will appear in the Azure portal.

:::image type="content" source="./media/set-preferences/azure-portal-settings-language-region.png" alt-text="Screenshot showing the Language + region settings pane.":::

> [!NOTE]
> These language and regional settings affect only the Azure portal. Documentation links that open in a new tab or window use your browser's settings to determine the language to display.

### Language

Use the drop-down list to select from the list of available languages. This setting controls the language you see for text throughout the Azure portal.

### Regional format

Select an option to control the way dates, time, numbers, and currency are shown in the Azure portal.

The options shown in the **Regional format** drop-down list changes based on the option you selected for **Language**. For example, if you select **English** as your language, and then select **English (United States)** as the regional format, currency is shown in U.S. dollars. If you select **English** as your language and then select **English (Europe)** as the regional format, currency is shown in euros.

Select **Apply** to update your language and regional format settings.

## Contact information

This pane lets you update the email address that is used for updates on Azure services, billing, support, or security issues.

You can also opt in or out from additional emails about Microsoft Azure and other products and services on this page.

## Signing out + notifications

This pane lets you manage pop-up notifications and session timeouts.

:::image type="content" source="./media/set-preferences/azure-portal-settings-sign-out-notifications.png" alt-text="Screenshot showing the Signing out + notifications pane.":::

### Signing out

The inactivity timeout setting helps to protect resources from unauthorized access if you forget to secure your workstation. After you've been idle for a while, you're automatically signed out of your Azure portal session. As an individual, you can change the timeout setting for yourself. If you're an admin, you can set it at the directory level for all your users in the directory.

### Change your individual timeout setting (user)

In the drop-down menu next to **Sign me out when inactive**, choose the duration after which your Azure portal session is signed out if you're idle.

:::image type="content" source="./media/set-preferences/azure-portal-settings-sign-out-inactive.png" alt-text="Screenshot showing the user timeout settings option.":::

Select **Apply** to save your changes. After that, if you're inactive during the portal session, Azure portal will sign out after the duration you set.

If your admin has enabled an inactivity timeout policy, you can still set your own, as long as it's shorter than the directory-level setting. To do so, select **Override the directory inactivity timeout policy**, then enter a time interval for the **Override value**.

:::image type="content" source="./media/set-preferences/azure-portal-settings-sign-out-inactive-user.png" alt-text="Screenshot showing the directory inactivity timeout override setting.":::

### Change the directory timeout setting (admin)

Admins in the [Global Administrator role](../active-directory/roles/permissions-reference.md#global-administrator) can enforce the maximum idle time before a session is signed out. This inactivity timeout setting applies at the directory level. The setting takes effect for new sessions. It won't apply immediately to any users who are already signed in. For more information about directories, see [Active Directory Domain Services Overview](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview).

If you're a Global Administrator, and you want to enforce an idle timeout setting for all users of the Azure portal, select **Enable directory level idle timeout** to turn on the setting. Next, enter the **Hours** and **Minutes** for the maximum time that a user can be inactive before their session is automatically signed out. After you select **Apply**, this setting will apply to all users in the directory.

:::image type="content" source="./media/set-preferences/azure-portal-settings-sign-out-inactive-admin.png" alt-text="Screenshot showing the directory level idle timeout options.":::

To confirm that the inactivity timeout policy is set correctly, select **Notifications** from the global page header and verify that a success notification is listed.

:::image type="content" source="./media/set-preferences/confirmation.png" alt-text="Screenshot showing a notification for successful inactivity timeout policy.":::

### Enable or disable pop-up notifications

Notifications are system messages related to your current session. They provide information such as showing your current credit balance, confirming your last action, or letting you know when resources you created become . When pop-up notifications are turned on, the messages briefly display in the top corner of your screen.

To enable or disable pop-up notifications, select or clear **Enable pop-up notifications**.

To read all notifications received during your current session, select **Notifications** from the global header.

:::image type="content" source="media/set-preferences/read-notifications.png" alt-text="Screenshot showing the Notifications icon in the global header.":::

To view notifications from previous sessions, look for events in the Activity log. For more information, see [View the Activity log](../azure-monitor/essentials/activity-log.md#view-the-activity-log).

## Export, restore, or delete settings

The settings **Overview** pane lets you export, restore, or delete settings.

:::image type="content" source="./media/set-preferences/azure-portal-settings-overview-export-settings.png" alt-text="Screenshot showing the settings export, restore, and delete options.":::

### Export user settings

Information about your custom settings is stored in Azure. You can export the following user data:

- Private dashboards in the Azure portal
- User settings like favorite subscriptions or directories
- Themes and other custom portal settings

It's a good idea to export and review your settings if you plan to delete them. Rebuilding dashboards or redoing settings can be time-consuming.

To export your portal settings, select **Export settings** from the top of the settings **Overview** pane. This creates a *.json* file that contains your user settings data.

Due to the dynamic nature of user settings and risk of data corruption, you can't import settings from the *.json* file.

### Restore default settings

If you've made changes to the Azure portal settings and want to discard them, select **Restore default settings** from the top of the settings **Overview** pane. You'll be prompted to confirm this action. When you do so, any changes you've made to your Azure portal settings will be lost. This option doesn't affect dashboard customizations.

### Delete user settings and dashboards

Information about your custom settings is stored in Azure. You can delete the following user data:

- Private dashboards in the Azure portal
- User settings like favorite subscriptions or directories
- Themes and other custom portal settings

It's a good idea to export and review your settings before you delete them. Rebuilding [dashboards](azure-portal-dashboards.md) or redoing custom settings can be time-consuming.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

To delete your portal settings, select **Delete all settings and private dashboards** from the top of the settings **Overview** pane. You'll be prompted to confirm the deletion. When you do so, all settings customizations will return to the default settings, and all of your private dashboards will be lost.

## Next steps

- [Learn about keyboard shortcuts in the Azure portal](azure-portal-keyboard-shortcuts.md)
- [View supported browsers and devices](azure-portal-supported-browsers-devices.md)
- [Add, remove, and rearrange favorites](azure-portal-add-remove-sort-favorites.md)
- [Create and share custom dashboards](azure-portal-dashboards.md)
- [Watch Azure portal how-to videos](azure-portal-video-series.md)
