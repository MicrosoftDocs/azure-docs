---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating IoT resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Internet of Things (IoT)

## Azure Cosmos DB

This service is already covered under [Databases](./germany-migration-databases.md#azure-cosmos-db)







## Functions

This service is also covered under [Compute](./germany-migration-compute#functions).

Migration of Functions between Azure Germany and global Azure isn't supported at this time. The recommended approach is to export Resource Manager template, change the location, and redeploy to target region.

> [!IMPORTANT]
> Change Location, Key Vault secrets, certs, and other GUIDs to be consistent with new region (location).

### Next steps

- Refresh your knowledge about Functions by following these [Step-by-Step tutorials](https://docs.microsoft.com/en-us/azure/azure-functions/#step-by-step-tutorials).
- Make yourself familiar how to [export an ARM template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [Azure Functions Overview](../azure-functions/functions-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy the application](../azure-resource-manager/resource-group-template-deploy.md)














## Notification Hub

This service is also covered under [Web](./germany-migration-web.md#notification-hubs).

You can export and import all registration tokens along with tags from one Hub to another. Here's how:

- [Export the existing Hub registrations](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) into an Azure Blob Storage container.
- Create a new Notification Hub in the target environment
- [Import your Registration Tokens](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) from Azure Blob Storage to your new Hub

### Next Steps

Refresh your knowledge about Notification Hubs by following these [Step-by-Step tutorials](https://docs.microsoft.com/en-us/azure/notification-hubs/#step-by-step-tutorials).

### References

- [Notification Hubs overview](../notification-hubs/notification-hubs-push-notification-overview.md)









## IoT Hub

A seamless migration of IoT Hub instances from Azure Germany to global Azure is not possible. You can follow these steps to migrate IoT Hub instances from Azure Germany to global Azure.

> [!NOTE]
> This migration causes downtime and data loss to your IoT application. 

All telemetry messages, C2D commands and Job (schedules and history) related information will not get migrated to global Azure. You will also have to reconfigure your devices and backend applications to start using the new IoT hub connection strings.

- Export all device identities, device twins, module twins (including the keys) from the IoT hub instance in Azure Germany to a storage account in Azure Germany.
- Use the [AzCopy tool](../storage/common/storage-use-azcopy.md) to copy all the exported blobs from Azure Germany to global Azure. See more details under [storage > blob](./germany-migrate-storage.md).
- Create a new IoT hub instance in global Azure.
- Import all artifacts exported in the first step including the keys to this IoT hub instance in global Azure.
- Reconfigure your devices and backend services to start using the new connection strings.

> [!NOTE] 
> The Root CA is different between the Azure Germany and Public Azure, so this need to be accounted for while reconfiguring your devices and backend applications interacting with the IoT Hub instance.

### Next Steps

- [Export IoT Hub bulk identity](../iot-hub/iot-hub-bulk-identity-mgmt.md#export-devices)
- [Import IoT Hub bulk identity](../iot-hub/iot-hub-bulk-identity-mgmt.md#import-devices)

### References

- [Azure IoT Hub overview](../iot-hub/about-iot-hub.md)
