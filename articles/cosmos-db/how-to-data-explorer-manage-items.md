---
title: Manage multiple items in Data Explorer
titleSuffix: Azure Cosmos DB
description: Use the multiple selection feature of the Data Explorer for Azure Cosmos DB to batch delete items directly in the Azure portal.
author: meredithmooreux
ms.author: merae
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/03/2024
#Customer Intent: As a database developer, I want to manage multiple items using the Data Explorer, so that I can delete items in bulk.
---

# View and delete multiple items in Azure Cosmos DB Data Explorer

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

Use the Data Explorer for Azure Cosmos DB to select and delete multiple items directly in the Azure portal. This feature makes it easier to batch manage multiple items without executing a query.

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new API for NoSQL account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## Delete multiple items

First, use the multiple selection feature to perform a delete operation over multiple items.

1. Sign in to the Azure portal (<https://portal.azure.com>).

1. Navigate to your existing Azure Cosmos DB account.

1. In the resource menu, select **Data Explorer**.

1. Navigate to the **Items** page corresponding to any existing database and container.

1. On the **Items** page, select the checkbox corresponding with all items you wish to manage in a single operation.

    :::image type="content" source="media/how-to-data-explorer-manage-items/multiple-selection.png" alt-text="Screenshot of the items management experience in the Azure Cosmos DB Data Explorer with multiple items currently selected.":::

    > [!TIP]
    > Alternatively, you can either select multiple items using the <kbd>Shift</kbd> or <kbd>Ctrl</kbd> keys. You can also use the checkbox in the table header to automatically select all items in the current view.

    > [!NOTE]
    > By default, the items view only includes 100 matching items. Select **Load more** to include more items within the current view.

1. In the command bar, select **Delete**.

    > [!TIP]
    > Alternatively, you can use the <kbd>Alt</kbd> + <kbd>D</kbd> or <kbd>Opt</kbd> + <kbd>D</kbd> keyboard shortcut.

1. In the confirmation dialog, select **Yes** to confirm that the multiple delete operation was intentional.

1. Wait for the operation to complete in the container. The results of the operation are available in the status bar.

## Adjust viewport

Now, use the adjustment features in the Data Explorer to adjust the viewport of items.

1. Navigate to the Data Explorer interface for your existing Azure Cosmos DB account again.

1. On the **Items** page, drag and move the separator between columns to adjust how much content is viewable for each column.

1. Observe that the content rendered for each item updates automatically as the column sizes are adjusted.

## Comments

Use the **Feedback** icon in the command bar of the Data Explorer to give the product team any comments you have about the keyboard shortcuts.

## Related content

- [Delete items by partition key value in Azure Cosmos DB for NoSQL](nosql/how-to-delete-by-partition-key.md)
- [Move data between containers in Azure Cosmos DB](container-copy.md)
