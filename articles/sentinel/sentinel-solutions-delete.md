---
title: Delete installed Microsoft Sentinel out-of-the-box content and solutions
description: Remove solutions and content you deployed in Microsoft Sentinel.
author: cwatson-cat
ms.topic: how-to
ms.date: 03/01/2024
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal.
---

# Delete installed Microsoft Sentinel out-of-the-box content and solutions

If you installed a Microsoft Sentinel out-of-the-box solution, you can remove content items from the solution or delete the installed solution. If you later need to restore deleted content items, select **Reinstall** on the solution. Similarly, you can restore the solution by reinstalling the solution.
 
[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Delete content items

Delete content items for an installed solution deployed by the content hub.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.
1. Select an installed solution where the version is 2.0.0 or higher.
1. On the solutions details page, select **Manage**.
1. Select the content item or items you want to delete.
1. Select **Delete**.

    :::image type="content" source="media/sentinel-solutions-delete/manage-solution-delete-item.png" alt-text="Screenshot of solution with content items selected for deletion.":::

To restore deleted content items, select **Reinstall** on the solution.

## Delete the solution

Delete a solution and the related content templates from the content hub or in the manage solution view. Active, cloned, saved, or custom items associated with a content template aren't deleted.

1. In the content hub, select an installed solution.
1. On the solutions details page, select **Delete**.
1. Select **Yes** to delete the solution and the templates.

    :::image type="content" source="media/sentinel-solutions-delete/manage-solution-delete.png" alt-text="Screenshot of the confirmation prompt to delete the solution.":::

To restore an out-of-the-box solution from the content hub, select the solution and **Install**.

## Related articles

- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- [About Microsoft Sentinel content and solutions](sentinel-solutions.md)
- Microsoft Sentinel solutions catalog in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel)
- [Microsoft Sentinel catalog](sentinel-solutions-catalog.md)
