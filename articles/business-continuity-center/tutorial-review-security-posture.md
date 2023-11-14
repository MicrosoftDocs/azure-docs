---
title: Review security posture
description: Learn how to review security posture
ms.topic: tutorial
ms.service: backup
ms.custom:
  - ignite-2023
ms.date: 10/30/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Review security posture (preview)

Azure Backup offers security features at the vault level to safeguard the backup data stored in it. These security measures encompass the settings associated with the Azure Backup solution for the vault and apply to the protected data sources contained within the vault.

Azure Business Continuity center (preview) allows you to view the Security level for each protected item from the Security posture view.

## View security level

Follow these steps to view the security level for protected items:

1. In Azure Business Continuity center, select the **Security posture** view under **Security + Threat management**.

    :::image type="content" source="./media/tutorial-review-security-posture/select-security-posture.png" alt-text="Screenshot shows the security posture selection.":::

2. In this view, you can see a list of all the protected items and their security level across subscription, resource groups, location, type, and so on, along with their properties.

    :::image type="content" source="./media/tutorial-review-security-posture/view-security-level.png" alt-text="Screenshot shows the security level of selected items in a table selection." lightbox="./media/tutorial-review-security-posture/view-security-level.png":::

3. To effectively look for specific items, you can utilize the various filters, such as subscriptions, resource groups, location, resource type, and so on. 

4.	Azure Business Continuity center allows you to change the default view using the **scope picker** from **Currently showing: Protection status details of Azure managed Active resources**, and select **Change**.

    :::image type="content" source="./media/tutorial-review-security-posture/select-active-under-change-scope.png" alt-text="Screenshot shows the change scope view." lightbox="./media/tutorial-review-security-posture/select-active-under-change-scope.png":::

5. To change the scope for **Security posture** view from the scope picker, select the required options:
    - **Resource status**: 
        - **Active resources** - Resources that are currently active, which are not deleted.
        - **Deprovisioned resources** - Describes resources that no longer exist, yet their backup and recovery points are retained.

6. The BCDR Security assessment score shows the percentage and count of the protected items having adequate or maximum security.

    :::image type="content" source="./media/tutorial-review-security-posture/bcdr-security-assessment.png" alt-text="Screenshot shows bcdr security assessment selection view." lightbox="./media/tutorial-review-security-posture/bcdr-security-assessment.png":::

7. Summary cards display an aggregated count for each security level, considering the applied filters. These cards can be selected to refine the filtering of the Protected items table. The security level reflects the security settings configured through the implemented solutions for data protection.

    :::image type="content" source="./media/tutorial-review-security-posture/summary-cards-view.png" alt-text="Screenshot shows the summary cards view." lightbox="./media/tutorial-review-security-posture/summary-cards-view.png":::

8. You can also **search** by specific item name to get the information specific to it.

    :::image type="content" source="./media/tutorial-review-security-posture/search-specific-item.png" alt-text="Screenshot shows the search specific item search box view." lightbox="./media/tutorial-review-security-posture/search-specific-item.png":::

9. Use **Select columns** from the menu at the top of the view to add or remove columns. 

    :::image type="content" source="./media/tutorial-review-security-posture/select-columns.png" alt-text="Screenshot shows the select columns selection." lightbox="./media/tutorial-review-security-posture/select-columns.png":::

10. You can select the item name or select the more icon **…** > **View details** action menu to navigate and view further details for an item. 

    :::image type="content" source="./media/tutorial-review-security-posture/select-view-details.png" alt-text="Screenshot shows the view details selection." lightbox="./media/tutorial-review-security-posture/select-view-details.png":::

11.	Azure Business Continuity center provides in-built help to learn more about these security levels. Select **learn more** to access it.

    :::image type="content" source="./media/tutorial-review-security-posture/select-learn-more.png" alt-text="Screenshot shows learn more selection." lightbox="./media/tutorial-review-security-posture/select-learn-more.png":::

12.	The help provides guidance on the various security levels and the settings that are required to meet each level. 

    :::image type="content" source="./media/tutorial-review-security-posture/select-security-level-details.png" alt-text="Screenshot shows the security levels details selection." lightbox="./media/tutorial-review-security-posture/select-security-level-details.png":::

## Modify security level

In Azure Business Continuity center, you can change the security level for a protected item. 

Follow these steps to modify the security level for an item: 

1.	On the **Security posture** view under **Security + Threat management**, select **item name** for a datasource. 

    :::image type="content" source="./media/tutorial-review-security-posture/select-item-name.png" alt-text="Screenshot shows the item name selection for a datasource." lightbox="./media/tutorial-review-security-posture/select-item-name.png":::

2.	On the item details page, you can view the vault used to protect the item. Select the vault name.

    :::image type="content" source="./media/tutorial-review-security-posture/select-vault-name.png" alt-text="Screenshot shows the select vault name selection on item details page." lightbox="./media/tutorial-review-security-posture/select-vault-name.png":::

3.	On the vault **properties** page, modify the security settings as required.

    :::image type="content" source="./media/tutorial-review-security-posture/modify-security-settings.png" alt-text="Screenshot shows the modify security settings on properties page.":::

    It might take a while to get the security level settings implemented in Azure Business Continuity center.

5.	When you modify the security setting for a vault, it gets applied to all the protected datasources by Azure Backup in that vault.

## Next steps

- Manage vaults [Add link]().
- [Review security posture](tutorial-review-security-posture.md).
