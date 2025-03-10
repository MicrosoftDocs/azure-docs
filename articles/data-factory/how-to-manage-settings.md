---
title: Managing Azure Data Factory settings and preferences
description: Learn how to manage Azure Data Factory settings and preferences.
author: n0elleli
ms.author: noelleli
ms.topic: tutorial
ms.date: 01/05/2024
ms.subservice: authoring
---

# Manage Azure Data Factory settings and preferences

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can change the default settings of your Azure Data Factory to meet your own preferences. 
Azure Data Factory settings are available in the Settings menu in the top right section of the global page header as indicated in the screenshot below. 

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-1.png" alt-text="Screenshot of settings gear in top right corner of page banner.":::

Clicking the **Settings** gear button will open a flyout. 

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-2.png" alt-text="Screenshot of settings flyout with three setting options.":::

Here you can find the settings and preferences that you can set for your data factory. 

## Theme

Choose your theme to change the look of the Azure Data Factory studio.

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-7.png" alt-text="Screenshot of settings flyout with the Theme section highlighted.":::

Use the toggle button to select your data factory theme. This setting controls the look of your data factory. 

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-8.png" alt-text="Screenshot of settings flyout with the Theme switched to Dark theme.":::

To apply changes, select your **Theme** and make sure to hit the **Ok** button. Your page will reflect the changes made. 

> [!NOTE]
> The new Dark theme is currently in public preview and is only available in Azure Data Factory.

## Language and Region

Choose your language and the regional format that will influence how data such as dates and currency will appear in your data factory. 

### Language

Use the drop-down list to select from the list of available languages. This setting controls the language you see for text throughout your data factory. There are 18 languages supported in addition to English. 

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-3.png" alt-text="Screenshot of drop-down list of languages that users can choose from.":::

To apply changes, select a language and make sure to hit the **Apply** button. Your page will refresh and reflect the changes made. 

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-4.png" alt-text="Screenshot of Apply button in the bottom left corner to make language changes.":::

> [!NOTE]
> Applying language changes will discard any unsaved changes in your data factory. 

### Regional Format

Use the drop-down list to select from the list of available regional formats. This setting controls the way dates, time, numbers, and currency are shown in your data factory. 

The default shown in **Regional format** will automatically change based on the option you selected for **Language**. You can still use the drop-down list to select a different format. 

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-5.png" alt-text="Screenshot of drop-down list of regional formats that users can choose from. ":::

For example, if you select **English** as your language and select **English (United States)** as the regional format, currency will be show in U.S. (United States) dollars. If you select **English** as your language and select **English (Europe)** as the regional format, currency will be show in euros. 

To apply changes, select a **Regional format** and make sure to hit the **Apply** button. Your page will refresh and reflect the changes made. 

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-6.png" alt-text="Screenshot of Apply button in the bottom left corner to make regional format changes.":::

> [!NOTE]
> Applying regional format changes will discard any unsaved changes in your data factory.

## Factory Settings

Additionally, you can set specific settings for your Data Factory. In the **Navigate** tab, you'll find **Factory settings** under **General**. In your Factory settings, you can adjust a few settings.

:::image type="content" source="media/how-to-manage-settings/azure-data-factory-settings-9.png" alt-text="Screenshot of general Factory settings.":::

* **Show billing report**

You can select your preferences for your billing report under **Show billing report**. Choose to see your billing **by pipeline** or **by factory**. By default, this setting will be set to **by factory**.

* **Factory environment**

You can set different environment labels for your factory. Choose from **Development**, **Test**, or **Production**. By default, this setting will be set to **None**.

* **Staging**

You can set your **default staging linked service** and **default staging storage folder**. This can be overridden in your factory resource. 

## Related content
- [Manage the ADF preview experience](how-to-manage-studio-preview-exp.md)
- [Introduction to Azure Data Factory](introduction.md)
- [Build a pipeline with a copy activity](quickstart-create-data-factory-powershell.md)
- [Build a pipeline with a data transformation activity](tutorial-transform-data-spark-powershell.md)
