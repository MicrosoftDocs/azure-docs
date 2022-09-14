---
title: How to migrate Azure API Management between regions
description: Learn how to migrate an API Management instance from one region to another.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 08/20/2021
ms.author: danlep
ms.custom: subject-moving-resources
#customerintent: As an Azure service administrator, I want to move my service resources to another Azure region.
---

# How to move Azure API Management across regions

This article describes how to move an API Management instance to a different Azure region. You might move your instance to another region for many reasons. For example:

* Locate your instance closer to your API consumers
* Deploy features available in specific regions only
* Meet internal policy and governance requirements

To move API Management instances from one Azure region to another, use the service's [backup and restore](api-management-howto-disaster-recovery-backup-restore.md) operations. You can use a different API Management instance name or the existing name. 

> [!NOTE]
> API Management also supports [multi-region deployment](api-management-howto-deploy-multi-region.md), which distributes a single Azure API management service across multiple Azure regions. Multi-region deployment helps reduce request latency perceived by geographically distributed API consumers and improves service availability if one region goes offline.

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Considerations

* Choose the same API Management pricing tier in the source and target regions. 
* Backup and restore won't work when migrating between different cloud types. For that scenario, export the resource [as a template](../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates). Then, adapt the exported template for the target Azure region and re-create the resource. 

## Prerequisites

* Review requirements and limitations of the API Management [backup and restore](api-management-howto-disaster-recovery-backup-restore.md) operations. 
* See [What is not backed up](api-management-howto-disaster-recovery-backup-restore.md#what-is-not-backed-up). Record settings and data that you will need to recreate manually after moving the instance.
* Create a [storage account](../storage/common/storage-account-create.md?tabs=azure-portal) in the source region. You will use this account to back up the source instance. 

## Prepare and move

### Option 1: Use a different API Management instance name

1. In the target region, create a new API Management instance with the same pricing tier as the source API Management instance. Use a different name for the new instance.
1. [Back up](api-management-howto-disaster-recovery-backup-restore.md#back-up-an-api-management-service) the existing API Management instance to the storage account. 
1. [Restore](api-management-howto-disaster-recovery-backup-restore.md#restore-an-api-management-service) the source instance's backup to the new API Management instance.
1. If you have a custom domain pointing to the source region API Management instance, update the custom domain CNAME to point to the new API Management instance. 

### Option 2: Use the same API Management instance name

> [!WARNING]
> This option deletes the original API Management instance and results in downtime during the migration. Ensure that you have a valid backup before deleting the source instance.

1. [Back up](api-management-howto-disaster-recovery-backup-restore.md#back-up-an-api-management-service) the existing API Management instance to the storage account. 
1. Delete the API Management instance in the source region. 
1. Create a new API Management instance in the target region with the same name as the one in the source region.
1. [Restore](api-management-howto-disaster-recovery-backup-restore.md#restore-an-api-management-service) the source instance's backup to the new API Management instance in the target region.  

## Verify

1. Ensure that the restore operation completes successfully before accessing your API Management instance in the target region.
1. Configure settings that are not automatically moved during the restore operation. Examples: virtual network configuration, managed identities, developer portal content, and custom domain and custom CA certificates.
1. Access your API Management endpoints in the target region. For example, test your APIs, or access the developer portal.

## Clean up source resources

If you moved the API Management instance using Option 1, after you successfully restore and configure the target instance, you may delete the source instance.

## Next steps

* For more information about the backup and restore feature, see [how to implement disaster recovery](api-management-howto-disaster-recovery-backup-restore.md).
* For information on migrating Azure resources, see [Azure cross-region migration guidance](https://github.com/Azure/Azure-Migration-Guidance).
* [Optimize and save on your cloud spending](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
