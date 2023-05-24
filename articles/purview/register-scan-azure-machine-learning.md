---
title: Connect to and manage Azure Machine Learning
description: This guide describes how to connect to Azure Machine Learning in Microsoft Purview.
author: meyetman
ms.author: meyetman
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: template-how-to
---

# Connect to and manage Azure Machine Learning in Microsoft Purview (Preview)

This article outlines how to register Azure Machine Learning and how to authenticate and interact with Azure Machine Learning in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

This integration between Azure Machine Learning and Microsoft Purview applies an auto push model that, once the Azure Machine Learning workspace has been registered in Microsoft Purview, the metadata from workspace is pushed to Microsoft Purview automatically on a daily basis. It isn't necessary to manually scan to bring metadata from the workspace into Microsoft Purview.

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register)| Yes | Yes | No | No | No| No| Yes | No |

When scanning the Azure Machine Learning source, Microsoft Purview supports:

- Extracting technical metadata from Azure Machine Learning, including:
    - Workspace
    - Models
    - Datasets
    - Jobs

## Prerequisites

* You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* You must have an active [Microsoft Purview account](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* An active Azure Machine Learning workspace

* A user must have, at minimum, read access to the Azure Machine Learning workspace to enable auto push from Azure Machine Learning workspace.

## Register

This section describes how to register an Azure Machine Learning workspace in Microsoft Purview by using [the Microsoft Purview governance portal](https://web.purview.azure.com/).

1. Go to your Microsoft Purview account.

1. Select **Data Map** on the left pane.

1. Select **Register**.

1. In **Register sources**, select **Azure Machine Learning (Preview)** > **Continue**.

    :::image type="content" source="./media/register-scan-azure-machine-learning/register-source.png" alt-text="Screenshot of the Azure Machine Learning source entry.":::

1. On the **Register sources (Azure Machine Learning)** screen, do the following:

    1. For **Name**, enter a friendly name that Microsoft Purview lists as the data source for the workspace.

    1. For **Azure subscription** and **Workspace name**, select the subscription and workspace that you want to push from the dropdown. The Azure Machine Learning workspace URL is automatically populated.

    1. For **Select a collection**, choose a collection from the list or create a new one. This step is optional.

1. Select **Register** to register the source.   

## Scan

After you register your Azure Machine Learning workspace, the metadata will be automatically pushed to Microsoft Purview on a daily basis.

## Browse and discover

To access the browse experience for data assets from your Azure Machine Learning workspace, select __Browse Assets__.

:::image type="content" source="./media/register-scan-azure-machine-learning/browse-assets.png" alt-text="Screenshot of the browse assets selection.":::

### Browse by collection

Browse by collection allows you to explore the different collections you're a data reader or curator for.

:::image type="content" source="./media/register-scan-azure-machine-learning/browse-by-collection.png" alt-text="Screenshot of browsing by collection":::

### Browse by source type

1. On the browse by source types page, select __Azure Machine Learning__.

    :::image type="content" source="./media/register-scan-azure-machine-learning/browse-by-type.png" alt-text="Screenshot of the Azure Machine Learning source type.":::

1. The top-level assets under your selected data type are listed. Pick one of the assets to further explore its contents. For example, after selecting Azure Machine Learning, you'll see a list of workspaces with assets in the data catalog.

    :::image type="content" source="./media/register-scan-azure-machine-learning/top-level-assets.png" alt-text="Screenshot of the top level assets.":::

1. Selecting one of the workspaces displays the child assets.

    :::image type="content" source="./media/register-scan-azure-machine-learning/child-assets.png" alt-text="Screenshot of child assets.":::

1. From the list, you can select on any of the asset items to view details. For example, selecting one of the Azure Machine Learning job assets displays the details of the job.

    :::image type="content" source="./media/register-scan-azure-machine-learning/asset-details.png" alt-text="Screenshot of asset details.":::

1. You can also select the __Lineage__ tab to view lineage information for the asset.

    :::image type="content" source="./media/register-scan-azure-machine-learning/asset-lineage.png" alt-text="Screenshot of the asset lineage.":::

## Next steps

Now that you've registered your source, use the following guides to learn more about Microsoft Purview and your data:

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search the data catalog](how-to-search-catalog.md)