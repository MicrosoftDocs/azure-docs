---
title: 'Tutorial: Explore resource sets, details, schemas, and classifications in Azure Purview (preview)'
description: This tutorial describes how to use resource sets, asset details, schemas, and classifications. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 12/01/2020
---
# Tutorial: Explore resource sets, details, schemas, and classifications in Azure Purview (preview)

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this tutorial, you explore the key components of your catalog: resource sets, asset details, schemas, and classifications.

This tutorial is *part 4 of a five-part tutorial series* in which you learn the fundamentals of how to manage data governance across a data estate using Azure Purview. This tutorial builds on the work you completed in [Part 3: Browse assets in Azure Purview (preview) and view their lineage](tutorial-browse-and-view-lineage.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * View resource sets.
> * View asset details.
> * Edit the schema and add classifications.

## Prerequisites

* Complete [Tutorial:  Browse assets in Azure Purview (preview) and view their lineage](tutorial-browse-and-view-lineage.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## View resource sets

A resource set is a single object in the catalog that represents many physical objects in storage. The objects usually share a common schema and, in most cases, a naming convention or folder structure. For example, the date format is *yyyy/mm/dd*. For more information about resource sets, see [Understand resource sets](concept-resource-sets.md).

1. Navigate to your Azure Purview resource in the Azure portal and select **Open Purview Studio**. You're automatically taken to your Purview Studio's home page.

2. Enter **contoso_staging_positivecashflow_ n** in the **Search assets** box, and then select **Contoso_Staging_PositiveCashFlow_{N}.csv** from the search results.

## View asset details

1. The **Overview** tab displays the **Description**, **Glossary terms**, and **Properties**, such as the **qualifiedName**.

   :::image type="content" source="./media/tutorial-schemas-and-classifications/overview-tab.png" alt-text="Screenshot showing the Overview tab of a resource set asset page.":::

1. Under **Properties**, note the following two fields:

   * **partitionCount**: Indicates the number of physical files that are associated with this resource set.
   * **schemaCount**: Indicates the number of variations of schema that were found within this resource set.

   Azure Purview populates these properties within 24 hours after you complete the scan in [part 1 of this tutorial series](tutorial-scan-data.md).

1. Select the **Contacts** tab to review the **Experts** and **Owners** values.

## Edit the schema and add classifications

1. Select the **Schema** tab. Observe the column names and the classifications that are associated with them. Notice that the scan populated the properties automatically.

   :::image type="content" source="./media/tutorial-schemas-and-classifications/schema-tab.png" alt-text="Screenshot showing the Schema tab.":::

1. To edit the asset, select the **Edit** button at the top left. Then, select the **Schema** tab.

1. Add a **Description** for a column or rename the column to a more friendly name.

1. Add a classification at the asset level selecting the **Column level classification** dropdown for a column name that does not have a set classification.

   :::image type="content" source="./media/tutorial-schemas-and-classifications/edit-schema.png" alt-text="Schema edit page":::

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
> [Create and import glossary terms](tutorial-import-create-glossary-terms.md)