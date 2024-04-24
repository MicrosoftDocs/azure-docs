---
title: Create custom hunting queries in Microsoft Sentinel
titleSuffix: Microsoft Sentinel
description: Learn how to create a custom query to hunt for threats. 
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 04/23/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Create custom hunting queries in Microsoft Sentinel

Create or modify a query and save it as your own query or share it with users who are in the same tenant.

## Create a new query

In Microsoft Sentinel, create a custom hunting query from the **Hunting** > **Queries** tab.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**  select **Hunting**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Hunting**.
1. Select the **Queries** tab.
1. From the command bar, select **New query**.

1. Fill in all the blank fields.

    1. Create entity mappings by selecting entity types, identifiers, and columns.

        :::image type="content" source="media/hunting/map-entity-types-hunting.png" alt-text="Screenshot for mapping entity types in hunting queries.":::

    1. Map MITRE ATT&CK techniques to your hunting queries by selecting the tactic, technique, and sub-technique (if applicable).

        :::image type="content" source="./media/hunting/mitre-attack-mapping-hunting.png" alt-text="New query" lightbox="./media/hunting/new-query.png":::

1.  When your finished defining your query, select **Create**.

**To clone and modify an existing query**:

1. From the table, select the hunting query you want to modify.
1. Select the ellipsis (...) in the line of the query you want to modify, and select **Clone query**.

    :::image type="content" source="./media/hunting/clone-query.png" alt-text="Clone query" lightbox="./media/hunting/clone-query.png":::

1. Modify the query and select **Create**.

**To modify an existing custom query**:

1. From the table, select the hunting query that you wish to modify. Only queries that from a custom content source can be edited. Other content sources have to be edited at that source.

1. Select the ellipsis (...) in the line of the query you want to modify, and select **Edit query**.

1. Modify the **Custom query** field with the updated query. You can also modify the entity mapping and techniques as explained in the "**To create a new query**" section of this documentation.

## Sample query

A typical query starts with a table or parser name followed by a series of operators separated by a pipe character ("\|").

In the example above, start with the table name SecurityEvent and add piped elements as needed.

1. Define a time filter to review only records from the previous seven days.

1. Add a filter in the query to only show event ID 4688.

1. Add a filter in the query on the command line to contain only instances of cscript.exe.

1. Project only the columns you're interested in exploring and limit the results to 1000 and select **Run query**.

1. Select the green triangle and run the query. You can test the query and run it to look for anomalous behavior.

We recommend that your query uses an [Advanced Security Information Model (ASIM) parser](normalization-about-parsers.md) and not a built-in table. This ensures that the query will support any current or future relevant data source rather than a single data source.
