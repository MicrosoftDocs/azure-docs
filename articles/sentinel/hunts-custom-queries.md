---
title: Create custom hunting queries in Microsoft Sentinel
titleSuffix: Microsoft Sentinel
description: Learn how to create a custom query to hunt for threats. 
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 04/24/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Create custom hunting queries in Microsoft Sentinel

Hunt for security threats across your organization's data sources with custom hunting queries. Microsoft Sentinel provides built-in hunting queries to help you find issues in the data you have on your network. But you can create your own custom queries. For more information about hunting queries, see [Threat hunting in Microsoft Sentinel](hunting.md).

## Create a new query

In Microsoft Sentinel, create a custom hunting query from the **Hunting** > **Queries** tab.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**  select **Hunting**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Hunting**.
1. Select the **Queries** tab.
1. From the command bar, select **New query**.

   # [Azure portal](#tab/azure-portal)
   :::image type="content" source="./media/hunts-custom-queries/save-query.png" alt-text="Save query" lightbox="./media/hunts-custom-queries/save-query.png":::

   # [Defender portal](#tab/defender-portal)
   :::image type="content" source="./media/hunts-custom-queries/save-query-defender.png" alt-text="Save query" lightbox="./media/hunts-custom-queries/save-query-defender.png":::
   ---

1. Fill in all the blank fields.

    1. Create entity mappings by selecting entity types, identifiers, and columns.

        :::image type="content" source="media/hunting/map-entity-types-hunting.png" alt-text="Screenshot for mapping entity types in hunting queries.":::

    1. Map MITRE ATT&CK techniques to your hunting queries by selecting the tactic, technique, and sub-technique (if applicable).

        :::image type="content" source="./media/hunting/mitre-attack-mapping-hunting.png" alt-text="New query" lightbox="./media/hunting/new-query.png":::

1.  When your finished defining your query, select **Create**.

## Clone an existing query

Clone a custom or built-in query and edit it as needed.
 
1. From the **Hunting** > **Queries** tab, select the hunting query you want to clone.
1. Select the ellipsis (...) in the line of the query you want to modify, and select **Clone**.

   # [Azure portal](#tab/azure-portal)
   :::image type="content" source="./media/hunts-custom-queries/clone-hunting-query.png" alt-text="Clone query" lightbox="./media/hunts-custom-queries/clone-hunting-query.png":::
   # [Defender portal](#tab/defender-portal)
   :::image type="content" source="./media/hunts-custom-queries/clone-hunting-query-defender.png" alt-text="Clone query" lightbox="./media/hunts-custom-queries/clone-hunting-query-defender.png":::
   ---
1. Edit the query and other fields as appropriate.
1. Select **Create**.

## Edit an existing custom query

Only queries that from a custom content source can be edited. Other content sources have to be edited at that source.

1. From the **Hunting** > **Queries** tab, select the hunting query you want to change. 

1. Select the ellipsis (...) in the line of the query you want to change, and select **Edit**.

1. Update the **Query** field with the updated query. You can also change the entity mapping and techniques.
1. When finished select **Save**.

## Related content

- [KQL quick reference](/azure/data-explorer/kusto/query/kql-quick-reference?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json)
- [Advanced Security Information Model (ASIM) parser](normalization-about-parsers.md)
- [Threat hunting in Microsoft Sentinel](hunting.md)
- [Conduct end-to-end proactive threat hunting in Microsoft Sentinel](hunts.md)

