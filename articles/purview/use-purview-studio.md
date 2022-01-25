---
title: Use the Azure Purview Studio
description: This article describes how to use Azure Purview Studio. 
author: nayenama
ms.author: nayenama
ms.service: purview
ms.topic: conceptual
ms.date: 09/27/2021
---

# Use Azure Purview Studio

This article gives an overview of some of the main features of Azure Purview.

## Prerequisites

* An Active Azure Purview account is already created in Azure portal and the user has permissions to access [Azure Purview Studio](https://web.purview.azure.com/resource/).

## Launch Azure Purview account

* To launch your Azure Purview account, go to Azure Purview accounts in Azure portal, select the account you want to launch and launch the account.

  :::image type="content" source="./media/use-purview-studio/open-purview-studio.png" alt-text="Screenshot of Azure Purview window in Azure portal, with Azure Purview Studio button highlighted." border="true":::

* Another way to launch Azure Purview account is to go to `https://web.purview.azure.com`, select **Azure Active Directory** and an account name to launch the account.

## Home page

**Home** is the starting page for the Azure Purview client.

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
   > For more information about Azure Purview roles, see [Access control in Azure Purview](catalog-permissions.md).

5. The left navigation bar helps you locate the main pages of the application.   
6. The **Recently accessed** tab shows a list of recently accessed data assets. For information about accessing assets, see [Search the Data Catalog](how-to-search-catalog.md) and [Browse by asset type](how-to-browse-catalog.md).  **My items** tab is a list of data assets owned by the logged-on user.
7. **Links** contains links to region status, documentation, pricing, overview, and Azure Purview status
8. The top navigation bar contains information about release notes/updates, change purview account, notifications, help, and feedback sections.

## Knowledge center

Knowledge center is where you can find all the videos and tutorials related to Azure Purview.

## Guided tours

Each UX in Azure Purview Studio will have guided tours to give overview of the page. To start the guided tour, select **help** on the top bar and select **guided tours**.

:::image type="content" source="./media/use-purview-studio/guided-tour.png" alt-text="Screenshot of the guided tour.":::

## Next steps

> [!div class="nextstepaction"]
> [Add a security principal](tutorial-scan-data.md)
