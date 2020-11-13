---
title: "Quickstart: Use Purview Studio"
description: This quickstart describes how to use a purview studio. 
author: nayenama
ms.author: nayenama
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: quickstart
ms.date: 11/12/2020

---

# Quickstart: Use Purview Studio

In this quickstart, Use Purview Studio.

## Prerequisites

* An Active Purview account is already created in Azure portal and the use has permissions to access Purview Studio

## Launch purview account

* To Launch Purview account go to Purview accounts in Azure portal, click the account you want to launch and launch the account.

   :::image type="content" source="./media/use-purview-studio/launch-from-portal.png" alt-text="Screenshot of the selection to launch the Azure Purview account catalog.":::

* Another way to launch Purview account is to go to https://web.purview.azure.com and select Azure active directory and account name to launch the account.

## Home page

**Home** is the starting page for the Azure Purview client.

 :::image type="content" source="./media/use-purview-studio/purview-homepage.png" alt-text="Screenshot of the homepage.":::

The following list summarizes the features of **Home**. Each number in the list corresponds to a highlighted number in the preceding screenshot.

1. Friendly name of the catalog. You can set the same in Management Center --> Account Information.

1. Catalog analytics shows the number of:
    - Users, groups, and applications
    - Data sources
    - Assets
    - Glossary terms
    
1. The [Quick access](#quick-access) buttons take you to other pages and they depend on the data plane role assigned to the user in in IAM Store.

    - For Data source Admin, the quick access buttons are: Register Data Sources and Knowledge Center.
    - For Data Curator, they are Knowledge Center, Browse Assets, Manage Glossary and View Insights.
    - For Data Reader, they are Knowledge Center, Browse Assets, View Glossary and View Insights.
  
  
1. The **Recently accessed** tab shows a list of recently accessed data assets. For information about accessing assets, see [Search the catalog for assets](#search-the-catalog-for-assets) and [Browse by asset type](#browse-by-asset-type).  **My items** tab is a list of data assets owned by the logged-on user.
1. **Useful Links** contains links to region status, documentation, pricing, overview and purview status
1. The top section contains information about Release notes/updates, change purview account, notifications, help and feedback sections

## Knowledge Center

Knowledge center is where you can find all the videos and tutorials related to Purview.

## Guided Tours

Each UX in Azure Purview Studio will have guided tours to give overview of the page. To start the guided tour select help on top bar and click guided tours.

:::image type="content" source="./media/use-purview-studio/guided-tour.png" alt-text="Screenshot of guided tours.":::

> [!div class="nextstepaction"]
> [Add a security principal](add-security-principal.md)