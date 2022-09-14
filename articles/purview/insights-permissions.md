---
title: Permissions for Data Estate Insights in Microsoft Purview
description: This article describes what permissions are needed to access access and managed Data Estate Insights in Microsoft Purview.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/16/2022
---

# Access control in Data Estate Insights within Microsoft Purview

Like all other permissions in Microsoft Purview, Data Estate Insights access is given through collections. This article describes what permissions are needed to access Data Estate Insights in Microsoft Purview.

## Insights reader role

The insights reader role gives users read permission to the Data Estate Insights application in Microsoft Purview. However, a user with this role will only have access to information for collections that they also have at least data reader access to.

As Data Estate Insights application gives a bird's eye view of your data estate and catalog usage from a governance and risk perspective, it's intended for users who need to manage and report on this high-level information, like a Chief Data Officer. You may not want, or need, all your data readers to have access to the Data Estate Insights dashboards.


## Role assignment

* **Insights Reader** role can be assigned to any Data Map user, by the **Data Curator of the root collection**. Users assigned the Data Curator role on subcollections don't have the privilege of assigning insights reader.

    :::image type="content" source="media/insights-permissions/insights-reader.png" alt-text="Screenshot of root collection, showing the role assignments tab, with the add user button selected next to Insights reader.":::

* A **Data Curator** of any collection also has read permission to Data Estate Insights application. Their scope of insights will be limited to the metadata assigned to collections. In other words, a Data Curator at a subcollection will only view KPIs and aggregations on collections they have access to. A Data Curator can still view and edit assets from Data Estate Insights app, without any extra permissions.

* A **Data Reader** at any collection node, can see Data Estate Insights app on the left navigation bar, however, when they hover on the icon, they'll receive a message saying they need to contact Data Curator at root collection for access. Once a Data Reader has been assigned the Insights Reader role, they can view KPIs and aggregations based on the collections they have Data Reader permission on. 
A Data Reader can't edit assets or select ***"Export to CSV"*** from the app.

> [!NOTE]
> All roles other than Data Curator, will need explicit role assignment as **Insights Reader** to be able to click into the Data Estate Insights app.

## Next steps

Learn how to use Data Estate Insights with sources below:

* [Learn how to use Asset insights](asset-insights.md)
* [Learn how to use Data Stewardship](data-stewardship.md)
* [Learn how to use Classification insights](classification-insights.md)
* [Learn how to use Glossary insights](glossary-insights.md)
* [Learn how to use Label insights](sensitivity-insights.md)
