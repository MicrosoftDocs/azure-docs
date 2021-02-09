---
title: How to migrate - Portal
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

## Migrate your Cloud Service Resources (Web/Worker Role Deployments in a Cloud Service)

1. Go to Cloud Services (classic) Portal Blade. 
2. Select the Cloud Service you want to migrate.
3. Select the Migrate to ARM blade.
    1. If migrating a Cloud Services (classic) without a virtual network, skip to step 4. 

    :::image type="content" source="media/in-place-migration-portal-1.png" alt-text="Image shows the Migrate to ARM blade in the Azure portal.":::

    2. If migrating a Cloud Services (classic) located inside a virtual network (classic), a banner message will appear prompting you to move the virtual network (classic) first. Migration happens at the virtual network level and the tool migrates all the Cloud Services in that virtual network. 
    
    :::image type="content" source="media/in-place-migration-portal-2.png" alt-text="Image shows moving a virtual network classic in the Azure portal.":::
 

4. Validate the virtual network for migration
    - If Validate is successful, then the virtual network & all deployments in it are supported & ready migration. 


 

    - If Validate fails, the virtual network, Cloud Service or deployments within Cloud Service satisfying an unsupported scenario. The validate API result provides a list of all the unsupported scenarios which needs to be fixed. The list of unsupported scenarios specifies the available mitigation's.

    :::image type="content" source="media/in-place-migration-portal-3.png" alt-text="Image shows validation error in the Azure portal.":::
    

5. Prepare the virtual network for Migration
    - If Prepare is successful, the migration is ready for commit. You can also Abort the migration and rollback. Both Abort and commit buttons should now be visible. 
    
    :::image type="content" source="media/in-place-migration-portal-4.png" alt-text="Image shows validation passing in the Azure portal.":::

     - If Prepare fails, the migration is using one of the unsupported scenarios. Please fix the error and retry Prepare. Prepare can also be transient and retrying should fix it. 

    :::image type="content" source="media/in-place-migration-portal-5.png" alt-text="Image shows validation failure error.":::

     - Test the deployment using Cloud Service (extended support) APIs. After Prepare, all Cloud Services in a virtual network is available for read operations using both Cloud Services (classic) and Cloud Services (extended support) Azure portal blade. 
 
    :::image type="content" source="media/in-place-migration-portal-6.png" alt-text="Image shows testing APIs in portal blade.":::

6.	(Optional) Abort virtual network Migration
    - If abort is successful, the migration has rollback and Cloud Services should not be visible on CS-ES portal blade. Prepare needs to be redone for migration. 
    
    :::image type="content" source="media/in-place-migration-portal-7.png" alt-text="Image shows validation passing.":::

     - If abort fails, there was an internal server error. Retry should fix the issue. If not, please contact support. 
 
    :::image type="content" source="media/in-place-migration-portal-8.png" alt-text="Image shows validation failure error message.":::

7.	Commit virtual network Migration
    - If commit is successful, the migration is completed and all cloud services in the virtual network will be displayed on CS-ES portal blade. Abort is no longer available. 
    - If commit fails, there was internal server error. Retry should fix the issue. If not, please contact support.


## Next steps
