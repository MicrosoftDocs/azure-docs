---
title: How to migrate Azure API Management across regions
description: Learn how to migrate an API Management instance from one region to another.
services: api-management
documentationcenter: ''
author: miaojiang
manager: erikre
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/26/2019
ms.author: apimpm

---
# How to migrate Azure API Management across regions
To migrate API Management instances from one Azure region to another, you can use the [backup and restore](api-management-howto-disaster-recovery-backup-restore.md) feature. You should choose the same API Management pricing tier in the source and target regions. 

> [!NOTE]
> Backup and restore won't work while migrating between different cloud types. For that, you'll need to export the resource [as a template](../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates). Then, adapt the exported template for the target Azure region and re-create the resource. 

## Option 1: Use a different API Management instance name

1. In the target region, create a new API Management instance with the same pricing tier as the source API Management instance. The new instance should have a different name. 
1. Backup existing API Management instance to a storage account.
1. Restore the backup created in Step 2 to the new API Management instance created in the new region in Step 1.
1. If you have a custom domain pointing to the source region API Management instance, update the custom domain CNAME to point to the new API Management instance. 


## Option 2: Use the same API Management instance name

> [!NOTE]
> This option will result in downtime during the migration.

1. Back up the API Management instance in the source region to a storage account.
1. Delete the API Management in the source region. 
1. Create a new API Management instance in the target region with the same name as the one in the source region.
1. Restore the backup created in Step 1 to the new API Management instance in the target region.  


## <a name="next-steps"> </a>Next steps
* For more information about the backup and restore feature, see [how to implement disaster recovery](api-management-howto-disaster-recovery-backup-restore.md).
* For information on migration Azure resources, see [Azure cross-region migration guidance](https://github.com/Azure/Azure-Migration-Guidance).
* [Optimize and save on your cloud spending](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
