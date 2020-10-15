---
title: 'Tutorial: Resource sets, asset details, schemas, and classifications'
description: This tutorial describes how to use resource sets, asset details, schemas, and classifications. 
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 09/30/2020
---

# Tutorial: Resource sets, asset details, schemas, and classifications

Explore the key components of your catalog: resource sets, asset details, schemas, and classifications.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * View resource sets.
> * View asset details.
> * Edit the schema and add classifications.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* Complete [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).
* Complete [Tutorial: Navigate the home page and search for an asset](starter-kit-tutorial-2.md ).
* Complete [Tutorial: Browse assets and view their lineage](starter-kit-tutorial-3.md ).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## View resource sets

A resource set is a single object in the catalog that represents many physical objects in storage. The objects usually share a common schema and, in most cases, a naming convention or folder structure. For example, the date format is *yyyy/mm/dd*. For more information about resource sets, see [Resource sets in Azure Babylon](concept-resource-sets.md).

1. Go to your Azure Babylon portal at `https://web.babylon.azure.com/resource/<your Azure Babylon account name>`.

2. Enter *Contoso_staging_positivecashflow** in the **Search assets** box, and then select **Contoso_staging_positivecashflow.json** in the search results.

   If you've completed the prerequisite first three tutorials, you'll see the details shown in the following screenshot. Observe each field carefully. At the top, next to the asset name, is the asset type. In this case, it's an Azure Blob resource set.

   :::image type="content" source="./media/starter-kit-tutorial-4/overview-tab.png" alt-text="Screenshot showing the Overview tab of a resource set asset page.":::

## View asset details

1. Select the **Overview** tab to display the **Description**, **Glossary terms**, and such **Properties** as the **qualifiedName**.

1. Under **Properties**, note the following two fields:

   * **partitionCount**: Indicates the number of physical files that are associated with this resource set.
   * **schemaCount**: Indicates the number of variations of schema that were found within this resource set.

   Azure Babylon populates these properties within 24 hours after you complete the scan described in [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).

1. Select the **Contacts** tab and review the **Experts**, and **Owners** values.

## Edit the schema and add classifications

1. Select the **Schema** tab. Observe the column names and the classifications that are associated with them. Also observe that the scan populated the properties automatically.

   :::image type="content" source="./media/starter-kit-tutorial-4/schema-tab.png" alt-text="Screenshot showing the Schema tab.":::

1. Edit the asset. Select the **Edit** button at the top left, and then select the **Schema** tab.

1. Add a **Description** for a column or rename the column to a more friendly name.

1. Add a classification at the asset level by selecting **Add a classification**.

   :::image type="content" source="./media/starter-kit-tutorial-4/edit-schema.png" alt-text="Schema edit page":::

1. When you're finished with your changes, select **Save**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * View resource sets.
> * View asset details.
> * Edit the schema and add classifications.

Advance to the next tutorial to learn about the glossary and how to define and import new terms for assets.

> [!div class="nextstepaction"]
> [Create and import glossary terms](starter-kit-tutorial-5.md)

