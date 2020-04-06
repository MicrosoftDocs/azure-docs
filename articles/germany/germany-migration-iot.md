---
title: Migrate Azure IoT resources from Azure Germany to global Azure
description: This article provides information about migrating your Azure IoT resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 11/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate IoT resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers' needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft's global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

This article has information that can help you migrate Azure IoT resources from Azure Germany to global Azure.

## Azure Cosmos DB

You can use Azure Cosmos DB Data Migration Tool to migrate data to Azure Cosmos DB. Azure Cosmos DB Data Migration Tool is an open-source solution that imports data to Azure Cosmos DB from different sources.

Azure Cosmos DB Data Migration Tool is available as a graphical interface tool or as command-line tool. The source code is available in the [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool) GitHub repository. A [compiled version of the tool](https://www.microsoft.com/download/details.aspx?id=46436) is available in the Microsoft Download Center.

To migrate Azure Cosmos DB resources, we recommend that you complete the following steps:

1. Review application uptime requirements and account configurations to determine the best action plan.
1. Clone the account configurations from Azure Germany to the new region by running the data migration tool.
1. If using a maintenance window is possible, copy data from the source to the destination by running the data migration tool.
1. If using a maintenance window isn't an option, copy data from the source to the destination by running the tool, and then complete these steps:
   1. Use a config-driven approach to make changes to read/write in an application.
   1. Complete a first-time sync.
   1. Set up an incremental sync and catch up with the change feed.
   1. Point reads to the new account and validate the application.
   1. Stop writes to the old account, validate that the change feed is caught up, and then point writes to the new account.
   1. Stop the tool and delete the old account.
1. Run the tool to validate that data is consistent across old and new accounts.

For more information:

- Read an [introduction to Azure Cosmos DB](../cosmos-db/introduction.md).
- Learn how to [import data to Azure Cosmos DB](../cosmos-db/import-data.md).

## Functions

Migrating Azure Functions resources from Azure Germany to global Azure isn't supported at this time. We recommend that you export a Resource Manager template, change the location, and then redeploy to the target region.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

For more information:

- Refresh your knowledge by completing the [Functions tutorials](https://docs.microsoft.com/azure/azure-functions).
- Learn how to [export Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md) or read the overview of [Azure Resource Manager](../azure-resource-manager/management/overview.md).
- Review the [Azure Functions overview](../azure-functions/functions-overview.md).
- Read an [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Notification Hubs

To migrate settings from one instance of Azure Notification Hubs to another instance, export and then import all registration tokens and tags:

1. [Export the existing notification hub registrations](/previous-versions/azure/azure-services/dn790624(v=azure.100)) to an Azure Blob storage container.
1. Create a new notification hub in the target environment.
1. [Import your registration tokens](/previous-versions/azure/azure-services/dn790624(v=azure.100)) from Blob storage to your new notification hub.

For more information:

- Refresh your knowledge by completing the [Notification Hubs tutorials](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-android-push-notification-google-fcm-get-started).
- Review the [Notification Hubs overview](../notification-hubs/notification-hubs-push-notification-overview.md).

## IoT Hub

Although you can migrate Azure IoT Hub instances from Azure Germany to global Azure, the migration isn't seamless.

> [!NOTE]
> This migration might cause downtime and data loss in your Azure IoT application. All telemetry messages, C2D commands, and job-related information (schedules and history) aren't migrated. You must reconfigure your devices and back-end applications to start using the new connection strings.

### Step 1: Re-create the IoT hub

IoT Hub doesn't support cloning natively. However, you can use the Azure Resource Manager feature to [export a resource group as a template](../azure-resource-manager/templates/export-template-portal.md) to export your IoT Hub metadata. Configured routes and other IoT hub settings are included in the exported metadata. Then, redeploy the template in global Azure. You might find it easier to re-create the IoT hub in the Azure portal by looking at the details in the exported JSON.

### Step 2: Migrate device identities

To migrate device identities:

1. In the source tenant in Azure Germany, use the [ExportDevices](../iot-hub/iot-hub-bulk-identity-mgmt.md) Resource Manager API to export all device identities, device twins, and module twins (including the keys) to a storage container. You can use a storage container in Azure Germany or global Azure. Make sure that the generated shared access signature URI has sufficient permissions. 
1. Run the [ImportDevices](../iot-hub/iot-hub-bulk-identity-mgmt.md) Resource Manager API to import all device identities from the storage container to the cloned IoT hub in global Azure.
1. Reconfigure your devices and back-end services to start using the new connection strings. The host name changes from **\*.azure-devices.de** to **\*.azure-devices.com**.  

> [!NOTE]
> The root certificate authority is different in Azure Germany and global Azure. Account for this when you reconfigure your devices and back-end applications that interact with the IoT Hub instance.

For more information:

- Learn how to [export IoT Hub bulk identities](../iot-hub/iot-hub-bulk-identity-mgmt.md#export-devices).
- Learn how to [import IoT Hub bulk identities](../iot-hub/iot-hub-bulk-identity-mgmt.md#import-devices).
- Review the [Azure IoT Hub overview](../iot-hub/about-iot-hub.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
