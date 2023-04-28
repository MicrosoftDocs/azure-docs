---
title: Use the Microsoft Purview governance portal
description: This article describes how to use the Microsoft Purview governance portal. 
author: nayenama
ms.author: nayenama
ms.service: purview
ms.topic: conceptual
ms.date: 02/13/2023
---

# Use the Microsoft Purview governance portal

This article gives an overview of some of the main features of Microsoft Purview.

## Prerequisites

* An Active Microsoft Purview account is already created in Azure portal
* The user has permissions to access [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

## Launch Microsoft Purview account

* You can launch the Microsoft Purview account directly by going to `https://web.purview.azure.com`, selecting **Azure Active Directory** and the account name. Or by going to `https://web.purview.azure.com/resource/yourpurviewaccountname`

* To launch your Microsoft Purview account from the [Azure portal](https://portal.azure.com), go to Microsoft Purview accounts in Azure portal, select the account you want to launch and launch the account.

  :::image type="content" source="./media/use-purview-studio/open-purview-studio.png" alt-text="Screenshot of Microsoft Purview window in Azure portal, with the Microsoft Purview governance portal button highlighted." border="true":::

>[!TIP]
>If you can't access the portal, [confirm you have the necessary permissions](catalog-permissions.md#permissions-to-access-the-microsoft-purview-governance-portal).

## Home page

**Home** is the starting page for the Microsoft Purview client.

:::image type="content" source="./media/use-purview-studio/purview-homepage.png" alt-text="Screenshot of the homepage.":::

The following list summarizes the main features of **Home page**. Each number in the list corresponds to a highlighted number in the preceding screenshot.

1. Friendly name of the catalog. You can set catalog name in **Management** > **Account information**.

2. Catalog analytics shows the number of:

   * Data sources
   * Assets
   * Glossary terms

3. The search box allows you to search for data assets across the data catalog.

4. The quick access buttons give access to frequently used functions of the application. The buttons that are presented, depend on the role assigned to your user account at the root collection.

   * For *collection admin*, the available button is **Knowledge center**.
   * For *data curator*, the buttons are **Browse assets**, **Manage glossary**, and **Knowledge center**.
   * For *data reader*, the buttons are **Browse assets**, **View glossary**, and **Knowledge center**.
   * For *data source admin* + *data curator*, the buttons are **Browse assets**, **Manage glossary**, and **Knowledge center**.
   * For *data source admin* + *data reader*, the buttons are **Browse assets**, **View glossary**, and **Knowledge center**.
  
   > [!NOTE]
   > For more information about Microsoft Purview roles, see [Access control in Microsoft Purview](catalog-permissions.md).

5. The left navigation bar helps you locate the main pages of the application.   
6. The **Recently accessed** tab shows a list of recently accessed data assets. For information about accessing assets, see [Search the Data Catalog](how-to-search-catalog.md) and [Browse by asset type](how-to-browse-catalog.md).  **My items** tab is a list of data assets owned by the logged-on user.
7. **Links** contains links to region status, documentation, pricing, overview, and Microsoft Purview status
8. The top navigation bar contains information about release notes/updates, change purview account, notifications, help, and feedback sections.

## Knowledge center

Knowledge center is where you can find all the videos and tutorials related to Microsoft Purview.

## Localization

Microsoft Purview is localized in 18 languages. To change the language used, go to the **Settings** from the top bar and select the desired language from the dropdown.

:::image type="content" source="./media/use-purview-studio/localization.png" alt-text="Screenshot of how to localize the Microsoft Purview governance portal.":::

> [!NOTE]
> Only generally available features are localized. Features still in preview are in English regardless of which language is selected.


## Guided tours

Each UX in the Microsoft Purview governance portal will have guided tours to give overview of the page. To start the guided tour, select **help** on the top bar and select **guided tours**.

:::image type="content" source="./media/use-purview-studio/guided-tour.png" alt-text="Screenshot of the guided tour.":::

## Next steps

> [!div class="nextstepaction"]
> [Add a security principal](tutorial-scan-data.md)
