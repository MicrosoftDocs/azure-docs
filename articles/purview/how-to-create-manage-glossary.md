---
title: Create and manage glossaries in Microsoft Purview
description: Learn how to create and manage business glossaries in Microsoft Purview.
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/14/2022
---

# Create and manage business glossaries

In Microsoft Purview, you can create multiple business glossaries to support separate glossaries for any context in your business. This article provides the steps to create and manage business glossaries in the Microsoft Purview Data Catalog.

## Create a new glossary

To create a business glossary, follow these steps:

1. On the home page, select **Data catalog** on the left pane, and then select the **Manage glossary** button in the center of the page.

    :::image type="content" source="media/how-to-create-manage-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the button for managing a glossary highlighted." border="true":::

1. On the **Business glossary** page, select **+ New glossary**.

   :::image type="content" source="media/how-to-create-manage-glossary/select-new-glossary.png" alt-text="Screenshot of the button and pane for creating a new glossary." border="true":::

1. Give your glossary a **Name** and a **Description**.

1. You'll need to select at least one **Steward**, an Azure Active Directory user or group who will manage the glossary.

1. You'll also need to select at least one **Expert**, an Azure Active Directory user or group who can be contacted for more information about the glossary.

1. You can give additional information about the stewards or experts here, and when you're finished, select **Create**.

   :::image type="content" source="media/how-to-create-manage-glossary/create-new-glossary.png" alt-text="Screenshot that shows the new glossary template with all sections filled out.":::

1. Once your new glossary is created, you'll be able to see it in the list of glossaries. You can switch between glossaries by selecting their names.

   :::image type="content" source="media/how-to-create-manage-glossary/glossary-created.png" alt-text="Screenshot showing the business glossary page, with the new glossary highlighted and selected.":::

## Manage or delete a glossary

1. To edit or delete a glossary, hover over the glossary and select the ellipsis button next to the glossary's name.

   :::image type="content" source="media/how-to-create-manage-glossary/edit-or-delete-glossary.png" alt-text="Screenshot showing the business glossary page, with a glossary highlighted, showing the ellipsis button selected and the edit and delete options pop up available.":::

1. If you select **Edit glossary**, you can edit the description and the steward or the expert, but at this time you can't change the glossary name. Select **Save** to save the changes.

   :::image type="content" source="media/how-to-create-manage-glossary/edit-glossary.png" alt-text="Screenshot of edit glossary page, with all values filled and the save button highlighted.":::

1. If you select **Delete glossary**, you'll be asked to confirm the deletion. All terms associated with the glossary will be deleted if you delete the glossary. Select **Delete** again to delete the glossary.

   :::image type="content" source="media/how-to-create-manage-glossary/delete-glossary.png" alt-text="Screenshot of the delete glossary window.":::

## Next steps

* For more information about creating and managing glossary terms, see the [glossary terms article](how-to-create-manage-glossary.md).
