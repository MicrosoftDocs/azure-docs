---
title: How to migrate Azure API Management between regions
description: Learn how to migrate an API Management instance from one region to another.
services: api-management
author: miaojiang
manager: erikre
editor: ''

ms.service: api-management
ms.topic: how-to
ms.date: 08/11/2021
ms.author: apimpm
ms.custom: subject-moving-resources
#cusomerintent: As an Azure service administrator, I want to move my service resources to another Azure region.
---

# How to move Azure API Management across regions

This article describes how to move an API Management instance to a different Azure region. You might move your instance to another region for a number of reasons. For example:

* To locate your instance closer to your API consumers
* To deploy features available in specific regions only
* To meet internal policy and governance requirements

To move API Management instances from one Azure region to another, use the service's [backup and restore](api-management-howto-disaster-recovery-backup-restore.md) operations. You can use a differnt API Management instance name or the same name. 

> [!NOTE]
> API Management also supports [multi-region deployment](api-management-howto-deploy-multi-region.md), which distributes a single Azure API management service across multiple Azure regions. Multi-region deployment helps reduce request latency perceived by geographically distributed API consumers and improves service availability if one region goes offline.

## Considerations

* You should choose the same API Management pricing tier in the source and target regions. 
* Backup and restore won't work when migrating between different cloud types. For that, you'll need to export the resource [as a template](../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates). Then, adapt the exported template for the target Azure region and re-create the resource. 

## Prerequisites

* Carefully review requirements and limitations of the API Management [backup and restore](api-management-howto-disaster-recovery-backup-restore.md) REST API operations. 
* See [What is not backed up](../api-management-howto-disaster-recovery-backup-restore.md#what-is-not-backed-up) and record settings that you will need to recreate manually after moving the instance.
* Create a [storage account](../storage/common/storage-account-create.md?tabs=azure-portal) with a blob container in the source region to which you will back up the instance. 
 
  You need the following information from the target storage: account name, access key, target blob container name, and backup name.
* [Back up](api-management-howto-disaster-recovery-backup-restore#-back-up-an-api-management-service) the API Management instance in the source region to the storage account. 

## Prepare and move

### Option 1: Use a different API Management instance name

1. In the target region, create a new API Management instance with the same pricing tier as the source API Management instance. The new instance should have a different name. 
1. [Restore](api-management-howto-disaster-recovery-backup-restore.md#-restore-an-api-management-service) the source instance's backup to the new API Management instance.
1. If you have a custom domain pointing to the source region API Management instance, update the custom domain CNAME to point to the new API Management instance. 

### Option 2: Use the same API Management instance name

> [!WARNING]
> This option immediately deletes the original API Management instance and results in downtime during the migration. Ensure that you have a valid backup before proceeding.

1. Delete the API Management in the source region. 
1. Create a new API Management instance in the target region with the same name as the one in the source region.
1. [Restore](api-management-howto-disaster-recovery-backup-restore.md#-restore-an-api-management-service) the source instance's backup to the new API Management instance in the target region.  

## Next steps

* For more information about the backup and restore feature, see [how to implement disaster recovery](api-management-howto-disaster-recovery-backup-restore.md).
* For information on migrating Azure resources, see [Azure cross-region migration guidance](https://github.com/Azure/Azure-Migration-Guidance).
* [Optimize and save on your cloud spending](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
