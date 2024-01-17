---
title: Relocation guidance in Azure Storage Account
description: Learn how to relocate Azure Storage Account to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/17/2024
ms.service: azure-storage
ms.topic: how-to
---


# Relocation guidance for Azure Storage Account

This article covers relocation guidance for Azure Storage Account across regions.

## Prerequisites

- Identify all Azure Storage Account dependant resources.
- Confirm that all services and features that are used by Azure Storage Account are supported in the target region.
- For preview features, confirm that your subscription is supported in the target region.
- Capture the below list of internal resources/settings of the Storage Account instance.
    - Lifecycle management policies
    - Static websites
    - Event subscriptions
    - Alerts
    - Content Delivery Network (CDN)
- Confirm that the Storage Account instance is deployed in [one of the paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions) with Geo-redundant storage (GRS) or Read-Access Geo-Redundant Storage (RA-GRS) support.
- Depending on your Storage Account deployment, the following dependent resources may need to be deployed and configured in the target region *prior* to relocation:
    - [Virtual Network, Network Security Groups, and User Defined Route](./relocation-virtual-network.md)
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Automation](./relocation-automation.md)

    >[!IMPORTANT]
    >If the Storage Account instance is operating in a production layer of a landing zone, such as hosting a static website or CDN, then you must reevaluate dependent resources as per configured resources like Traffic Manager.

## Relocation strategies

To relocate Azure Storage account to a new region, you can choose to [redeploy without data migration](#redeploy-without-data-migration) or [redeploy with data migration](#redeploy-with-data-migration-strategy) strategies.

**Azure Resource Mover** doesn't support moving services used by the Azure Storage account. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

## Redeploy without data migration

If your Azure Storage Account instance doesn't have any client specific data and the instance itself needs to be moved alone, you can choose to redeploy without data migration. A simple redeployment without data is also your best option for [Azure Queues](/azure/storage/queues/storage-queues-introduction), as no data migration is required for a service that only supports live messaging transactions.

**To redeploy your Automation instance without data:**

Redeploy the Storage Account instance by using [Bicep, ARM Template, or Terraform](azure/templates/microsoft.storage/storageaccounts?tabs=json&pivots=deployment-language-arm-template).

To view the available configuration templates, see [the complete Azure Template library](/azure/templates/).

## Redeploy with data migration

The Azure Storage platform includes the following data services:

- [Azure Blobs](/azure/storage/blobs/storage-blobs-introduction)
- [Azure Files](/azure/storage/files/storage-files-introduction)
- [Azure Tables](/azure/storage/tables/table-storage-overview)
- [Azure Disks](/azure/virtual-machines/managed-disks-overview)


To move all of the above data types to new region Storage Account, two different approaches can be used:

- [AzCopy Tool](/azure/storage/common/storage-use-azcopy-v10)
- [Azure Data Factory](/azure/data-factory/introduction)

### Prerequisites
