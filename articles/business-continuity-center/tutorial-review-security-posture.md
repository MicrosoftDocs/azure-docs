---
title: Review security posture
description: Learn how to review security posture
ms.topic: tutorial
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
ms.date: 05/30/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Review security posture

This tutorial describes how to review and modify the security level for protected items in Azure Business Continuity Center.

Azure Backup provides security features at the vault level to safeguard the backup data stored in it. These security measures encompass the settings associated with the Azure Backup solution for the vault and apply to the protected data sources contained within the vault.

Azure Business Continuity Center allows you to view the security level for each protected item from the security posture view.

## View security level

To view the security level for protected items, follow these steps:

1. On **Business Continuity Center**, go to **Security + Threat management** > **Security posture**.

    :::image type="content" source="./media/tutorial-review-security-posture/select-security-posture.png" alt-text="Screenshot shows the security posture selection.":::

2. On **Security posture**, you can see a list of all the protected items and their security level across subscription, resource groups, location, type, and so on, along with their properties.

    :::image type="content" source="./media/tutorial-review-security-posture/view-security-level.png" alt-text="Screenshot shows the security level of selected items in a table selection." lightbox="./media/tutorial-review-security-posture/view-security-level.png":::

   To effectively look for specific items, use the filters, such as subscriptions, resource groups, location, resource type, and so on. 

3.	To change the default view in Azure Business Continuity Center using the **scope picker** from **Currently showing: Protection status details of Azure managed Active resources**, select **Change**.

    :::image type="content" source="./media/tutorial-review-security-posture/select-active-under-change-scope.png" alt-text="Screenshot shows the change scope view." lightbox="./media/tutorial-review-security-posture/select-active-under-change-scope.png":::

4. On the **Change scope** blade, to change the scope for **Security posture** view from the scope picker, select the following options, and select **Update**.
    - **Resource status**: 
        - **Active resources** - Resources that are currently active, which are not deleted.
        - **Deprovisioned resources** - Describes resources that no longer exist, yet their backup and recovery points are retained.

   The BCDR Security assessment score shows the percentage and count of the protected items having adequate or maximum security.

   :::image type="content" source="./media/tutorial-review-security-posture/bcdr-security-assessment.png" alt-text="Screenshot shows bcdr security assessment selection view." lightbox="./media/tutorial-review-security-posture/bcdr-security-assessment.png":::

5. On **Security posture**, the summary cards display an aggregated count for each security level, considering the applied filters. Select these cards to refine the filtering of the Protected items table.

   The security level shows the security settings configured through the implemented solutions for data protection.

   :::image type="content" source="./media/tutorial-review-security-posture/summary-cards-view.png" alt-text="Screenshot shows the summary cards view." lightbox="./media/tutorial-review-security-posture/summary-cards-view.png":::

6. To get information for a specific item, search by the item name.

    :::image type="content" source="./media/tutorial-review-security-posture/search-specific-item.png" alt-text="Screenshot shows the search specific item search box view." lightbox="./media/tutorial-review-security-posture/search-specific-item.png":::

7. Use **Select columns** to add or remove columns.

    :::image type="content" source="./media/tutorial-review-security-posture/select-columns.png" alt-text="Screenshot shows the select columns selection." lightbox="./media/tutorial-review-security-posture/select-columns.png":::

8. Select the item name or select the more icon **…** > **View details** action menu to navigate and view further details for an item.

   :::image type="content" source="./media/tutorial-review-security-posture/select-view-details.png" alt-text="Screenshot shows the view details selection." lightbox="./media/tutorial-review-security-posture/select-view-details.png":::

9.	Azure Business Continuity Center provides in-built help to learn more about these security levels. Select **learn more** to access it.

    :::image type="content" source="./media/tutorial-review-security-posture/select-learn-more.png" alt-text="Screenshot shows learn more selection." lightbox="./media/tutorial-review-security-posture/select-learn-more.png":::

     On the **Security level details** blade, the help provides guidance on the various security levels and the settings that are required to meet each level. 

     :::image type="content" source="./media/tutorial-review-security-posture/select-security-level-details.png" alt-text="Screenshot shows the security levels details selection." lightbox="./media/tutorial-review-security-posture/select-security-level-details.png":::

## Modify security level

In Azure Business Continuity Center, you can change the security level for a protected item. 

To modify the security level for an item, follow these steps:

1. On **Business Continuity Center**, go to **Security + Threat management** > **Security posture**, and then select an **item name** for a datasource. 

    :::image type="content" source="./media/tutorial-review-security-posture/select-item-name.png" alt-text="Screenshot shows the item name selection for a datasource." lightbox="./media/tutorial-review-security-posture/select-item-name.png":::

2.	On the **item details** page, you can view the vault used to protect the item. Select the vault name.

    :::image type="content" source="./media/tutorial-review-security-posture/select-vault-name.png" alt-text="Screenshot shows the select vault name selection on item details page." lightbox="./media/tutorial-review-security-posture/select-vault-name.png":::

3.	On the vault **properties** page, modify the security settings as required.

    :::image type="content" source="./media/tutorial-review-security-posture/modify-security-settings.png" alt-text="Screenshot shows the modify-security settings option on properties page.":::

   It might take a while to get the security level settings implemented in Azure Business Continuity Center.

   When you modify the security setting for a vault, it gets applied to all the protected datasources by Azure Backup in that vault.

## Next steps

- [Manage a vault](manage-vault.md).
- [Review security posture](tutorial-review-security-posture.md).
