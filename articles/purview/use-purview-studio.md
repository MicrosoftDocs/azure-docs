---
title: 'Use Purview Studio'
description: This conceptual article describes how to use Azure Purview Studio. 
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/12/2020

---

# Use Purview Studio

This article gives an overview of some of the main features of Azure Purview.

## Prerequisites

* An Active Purview account is already created in Azure portal and the user has permissions to access Purview Studio.

## Launch Purview account

* To launch your Purview account, go to Purview accounts in Azure portal, select the account you want to launch and launch the account.

   :::image type="content" source="./media/use-purview-studio/launch-from-portal.png" alt-text="Screenshot of the selection to launch the Azure Purview account catalog.":::

* Another way to launch Purview account is to go to `https://web.purview.azure.com`, select **Azure Active Directory** and an account name to launch the account.

## Home page

**Home** is the starting page for the Azure Purview client.

 :::image type="content" source="./media/use-purview-studio/purview-homepage.png" alt-text="Screenshot of the homepage.":::

The following list summarizes the main features of **Home page**. Each number in the list corresponds to a highlighted number in the preceding screenshot.

1. Friendly name of the catalog. You can set catalog name in **Management Center** > **Account information**.

2. Catalog analytics shows the number of:
    - Users, groups, and applications
    - Data sources
    - Assets
    - Glossary terms

3. The search box allows you to search for data assets across the data catalog.

4. The quick access buttons give access to frequently used functions of the application. The buttons that are presented, depend on the role assigned to your user account.

    - For *data curator*, the buttons are **Knowledge Center**, **Browse Assets**, **Manage Glossary** and **View Insights**.
    - For *data reader*, the featured buttons are **Knowledge Center**, **Browse Assets**, **View Glossary**, and **View Insights**.
    - For *data source administrator* + *data curator*, the featured buttons are **Knowledge Center**, **Register Data Sources**, **Browse Assets**, and **Manage Glossary**.
    - For *data source administrator* + *data reader*, the featured buttons are **Knowledge Center**, **Register Data Sources**, **Browse Assets**, and **View Glossary**.

5. The left navigation bar helps you locate the main pages of the application. The buttons that are presented, depend on the role assigned to your user account.

    - For *data curator*, the buttons are **Home**, **Glossary**, **Insights**, and **Management center**.
    - For *data reader*, the buttons are **Home**, **Glossary**, **Insights**, and **Management center**.
    - For *data source administrator* + *data curator/reader*, the buttons are **Home**, **Sources**, **Glossary**, **Insights**, and **Management Center**.
  
6. The **Recently accessed** tab shows a list of recently accessed data assets. For information about accessing assets, see [Search the Data Catalog](how-to-search-catalog.md) and [Browse by asset type](how-to-browse-catalog.md#browse-experience).  **My items** tab is a list of data assets owned by the logged-on user.
7. **Useful Links** contains links to region status, documentation, pricing, overview, and Purview status
8. The top navigation bar contains information about release notes/updates, change purview account, notifications, help, and feedback sections.

## Knowledge center

Knowledge center is where you can find all the videos and tutorials related to Purview.

## Guided tours

Each UX in Azure Purview Studio will have guided tours to give overview of the page. To start the guided tour, select **help** on the top bar and select **guided tours**.

:::image type="content" source="./media/use-purview-studio/guided-tour.png" alt-text="Screenshot of the guided tour.":::

> [!Important]
   > Data Source Administrator role by itself does not have access to Purview Studio.

## Next steps

> [!div class="nextstepaction"]
> [Add a security principal](tutorial-scan-data.md)
