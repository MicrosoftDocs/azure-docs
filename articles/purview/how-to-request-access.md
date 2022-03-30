---
title: How to request access to a data source in Azure Purview.
description: This article describes how a user can request access to a data source from within Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/01/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to request access for a data asset

[!INCLUDE [Region Notice](./includes/workflow-regions.md)]

If you discover a data asset in the catalog that you would like access to, you can request access directly through Azure Purview.

The request will trigger a workflow that will request that the owners of the data resource grant you access to that data source.

This article outlines how to make an access request.

1. To find a data asset, use Azure Purview's [search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md) functionality.

    :::image type="content" source="./media/how-to-request-access/search-or-browse.png" alt-text="Screenshot of the Azure Purview studio, with the search bar and browse buttons highlighted.":::

1. Select the asset to go to asset details.

1. Select **Request access**.
    
    :::image type="content" source="./media/how-to-request-access/request-access.png" alt-text="Screenshot of a data asset's overview page, with the Request button highlighted in the mid-page menu.":::

1. The **Request access** window will open. You can provide comments on why data access is requested.
1. Select **Send** to trigger the self-service data access workflow.

    :::image type="content" source="./media/how-to-request-access/send.png" alt-text="Screenshot of a data asset's overview page, with the Request access window overlaid. The Send button is highlighted at the bottom of the Request access window.":::

    > [!NOTE]
    > A request access to resource set will actually submit the data access request for the folder one level up which contains all these resource set files.

1. Data owners will be notified of your request and will either approve or reject the request.


## Next steps

- [What are Azure Purview workflows](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
