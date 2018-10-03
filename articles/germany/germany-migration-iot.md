---
title: Migration of IoT resources from Azure Germany to global Azure
description: This article provides help for migrating IoT resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of Internet of Things (IoT) resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure IoT resources from Azure Germany to global Azure.

## Azure Cosmos DB

With the Azure Cosmos DB Data Migration tool, you can easily migrate data to Azure Cosmos DB. The Azure Cosmos DB Data Migration tool is an open-source solution that imports data to Azure Cosmos DB from different sources.

The tool is available as a graphical interface tool or as command-line tool. The source code is available in the GitHub repository for [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool), and a compiled version is available on the [Microsoft Download Center](http://www.microsoft.com/download/details.aspx?id=46436).

The recommended steps are:

- Perform a review of application uptime requirements and account configurations to recommend the right action plan.
- Follow the steps to clone the account configurations from Azure Germany to the new region by running the tool
- If a maintenance window is possible, follow the steps to copy data from source to destination by running the tool
- If a maintenance window isn't possible, follow the steps to copy data from source to destination by running the tool and process that we recommend
  - Make changes to read/write in application with config driven approach
  - Perform first-time sync
  - Setup incremental sync/catch up with change feed
  - Point reads to new account and validate application
  - Stop writes to old account, validate change feed is caught up, then point writes to new accounts
  - Stop tool, and delete old account
- Follow the steps to run the tool to validate that data is consistent across the old and new accounts.


### References

- [Azure Cosmos DB](../cosmos-db/introduction.md)
- [Import data to Azure Cosmos DB](../cosmos-db/import-data.md)










## Functions

Migration of Functions between Azure Germany and global Azure isn't supported at this time. The recommended approach is to export Resource Manager template, change the location, and redeploy to target region.

> [!IMPORTANT]
> Change location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

### Next steps

- Refresh your knowledge about Functions by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/azure-functions/#step-by-step-tutorials).
- Make yourself familiar how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [Azure Functions Overview](../azure-functions/functions-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy a template](../azure-resource-manager/resource-group-template-deploy.md)
















## Notification Hubs

To migrate settings from one Notification Hub to another, you can export and import all registration tokens along with tags. Here's how:

- [Export the existing Hub registrations](https://msdn.microsoft.com/library/azure/dn790624.aspx) into an Azure Blob Storage container.
- Create a new Notification Hub in the target environment
- [Import your Registration Tokens](https://msdn.microsoft.com/library/azure/dn790624.aspx) from Azure Blob Storage to your new Hub

### Next Steps

Refresh your knowledge about Notification Hubs by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/notification-hubs/#step-by-step-tutorials).

### References

- [Notification Hubs overview](../notification-hubs/notification-hubs-push-notification-overview.md)








## IoT Hub

A seamless migration of IoT Hub instances from Azure Germany to global Azure isn't possible. You can follow these steps to migrate IoT Hub instances from Azure Germany to global Azure.

> [!NOTE]
> This migration can cause downtime and data loss to your IoT application. All telemetry messages, C2D commands and Job (schedules and history) related information are not migrated to global Azure. You must reconfigure your devices and backend applications to start using the new connection strings.

### Step 1 - Recreate IoT Hub

IoT Hub doesn’t support cloning natively. However, you can use the Azure Resource Manager feature to [export a resource group as a template](../azure-resource-manager/resource-manager-export-template-powershell.md) to export your IoT hub metadata, including configured routes and other IoT hub settings, and redeploy it in global Azure. You may also find it easier to recreate the IoT Hub in the portal by looking at the details in the exported JSON.

### Step 2 - Migrate device identities

- In the source tenant in Azure Germany, use the [ExportDevices](../iot-hub/iot-hub-bulk-identity-mgmt.md) Resource Manager API to export all device identities, device twins, module twins (including the keys) to a storage container. You may use a storage container in either Azure Germany or global Azure, just make sure the generated SAS URI has enough permission. 
- Run the [ImportDevices](../iot-hub/iot-hub-bulk-identity-mgmt.md) Azure Resource Manager API to import all device identities from the storage container into the cloned IoT hub in global Azure.
- Reconfigure your devices and backend services to start using the new connection strings. The hostname changes from `*.azure-devices.de` to `*.azure-devices.com`.  

> [!NOTE]
> The Root CA is different between the Azure Germany and global Azure, so this needs to be accounted for while reconfiguring your devices and backend applications interacting with the IoT Hub instance.

### Next Steps

- [Export IoT Hub bulk identity](../iot-hub/iot-hub-bulk-identity-mgmt.md#export-devices)
- [Import IoT Hub bulk identity](../iot-hub/iot-hub-bulk-identity-mgmt.md#import-devices)

### References

- [Azure IoT Hub overview](../iot-hub/about-iot-hub.md)
