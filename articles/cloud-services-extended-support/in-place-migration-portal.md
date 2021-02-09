---
title: How to migrate - portal
description: How to migrate to Cloud Services (extended support) using the Azure portal
ms.topic: how-to
ms.service: cloud-services-extended-support
author: tanmaygore
ms.author: tagore
ms.reviewer: mimckitt
ms.date: 2/08/2021
ms.custom: 
---

# How to migrate to Cloud Services (extended support) using the Azure portal

## Before you Begin

Review the [Migrate Azure Cloud Services (classic) to Azure Cloud Services (extended support)](in-place-migration-overview.md) overview document and complete the prerequisites required before beginning any migration steps. 

## Migrate your Cloud Service Resources

1. Go to Cloud Services (classic) portal blade. 
2. Select the Cloud Service you want to migrate.
3. Select the **Migrate to ARM** blade.

    > [!NOTE]
    > If migrating a Cloud Services (classic) located inside a virtual network (classic), a banner message will appear prompting you to move the virtual network (classic) first. You will be brought to the virtual network (classic) blade to complete the remainder of the migration for both the virtual network (classic) and the Cloud Services (classic).
    > :::image type="content" source="media/in-place-migration-portal-2.png" alt-text="Image shows moving a virtual network classic in the Azure portal.":::
 

4. Validate the migration. 

    If validation is successful, then all deployments are supported and ready to be prepared.  

    :::image type="content" source="media/in-place-migration-portal-1.png" alt-text="Image shows the Migrate to ARM blade in the Azure portal.":::

    If validate fails, a list of unsupported scenarios will be displayed and need to be fixed before migration can continue. 

    :::image type="content" source="media/in-place-migration-portal-3.png" alt-text="Image shows validation error in the Azure portal.":::

5. Prepare the for migration.

    If the prepare is successful, the migration is ready for commit.
    
    :::image type="content" source="media/in-place-migration-portal-4.png" alt-text="Image shows validation passing in the Azure portal.":::

    If the prepare fails, review the error, address any issues and retry the prepare. 

    :::image type="content" source="media/in-place-migration-portal-5.png" alt-text="Image shows validation failure error.":::

      After Prepare, all Cloud Services in a virtual network is available for read operations using both Cloud Services (classic) and Cloud Services (extended support) Azure portal blade. 
 
    :::image type="content" source="media/in-place-migration-portal-6.png" alt-text="Image shows testing APIs in portal blade.":::

6.	**(Optional)** Abort migration. 
    
    If you chose to discontinue the migration, use the **Abort** button. If the abort is successful, the migration will rollback.  

    :::image type="content" source="media/in-place-migration-portal-7.png" alt-text="Image shows validation passing.":::

    If abort fails, select **Retry abort**. A retry should fix the issue. If not, contact support. 
 
    :::image type="content" source="media/in-place-migration-portal-8.png" alt-text="Image shows validation failure error message.":::

7.	Commit Migration

    >[!IMPORTANT]
    > Once you commit to the migration, there is no option to rollback. 
    
    Type in "yes" to confirm and commit to the migration. The migration is now complete. You should now see the migrated Cloud Services (classic) visable in the Cloud Services (extended support) blade.  

## Next steps
[Enable remote desktop](enable-rdp.md) for your new Cloud Services (extended support) deployment
