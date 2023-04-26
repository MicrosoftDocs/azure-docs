---
author: nayenama
ms.author: nayenama
ms.service: purview
ms.topic: include
ms.date: 03/23/2023
---

1. To find a data asset, use Microsoft Purview's [search](../how-to-search-catalog.md) or [browse](../how-to-browse-catalog.md) functionality.

    :::image type="content" source="./media/how-to-self-service-request-access/search-or-browse.png" alt-text="Screenshot of the Microsoft Purview governance portal, with the search bar and browse buttons highlighted.":::

1. Select the asset to go to asset details.

1. Select **Request access**.

    :::image type="content" source="./media/how-to-self-service-request-access/request-access.png" alt-text="Screenshot of a data asset's overview page, with the Request button highlighted in the mid-page menu.":::

    > [!NOTE]
    > If this option isn't available, a [self-service access workflow](../how-to-workflow-self-service-data-access-hybrid.md) either hasn't been created, or hasn't been assigned to the collection where the resource is registered. Contact the collection administrator, data source administrator, or workflow administrator of your collection for more information.
    > Or, for information on how to create a self-service access workflow, see our [self-service access workflow documentation](../how-to-workflow-self-service-data-access-hybrid.md).

1. The **Request access** window will open. You can provide comments on why data access is requested.
1. Select **Send** to trigger the self-service data access workflow.

    > [!NOTE]
    > If you want to request access on behalf of another user, select the checkbox **Request for someone else** and populate the email id of that user.

    :::image type="content" source="./media/how-to-self-service-request-access/send.png" alt-text="Screenshot of a data asset's overview page, with the Request access window overlaid. The Send button is highlighted at the bottom of the Request access window.":::

    > [!NOTE]
    > A request access to resource set will actually submit the data access request for the folder one level up which contains all these resource set files.

1. Data owners will be notified of your request and will either approve or reject the request.