---
title: Migrate Azure web resources from Azure Germany to global Azure
description: This article provides information about migrating your Azure web resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate web resources to global Azure

This article has information that can help you migrate Azure web resources from Azure Germany to global Azure.

## Web Apps

Migrating apps that you created by using the Web Apps feature of Azure App Service from Azure Germany to global Azure isn't supported at this time. We recommend that you export a web app as an Azure Resource Manager template. Then, redeploy after you change the location property to the new destination region.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

For more information:

- Refresh your knowledge by completing the [App Service tutorials](https://docs.microsoft.com/azure/app-service/#step-by-step-tutorials).
- Get information about how to [export Azure Resource Manager templates](../azure-resource-manager/manage-resource-groups-portal.md#export-resource-groups-to-templates).
- Review the [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).
- Review the [App Service overview](../app-service/overview.md).
- Get an [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn how to [redeploy a template](../azure-resource-manager/resource-group-template-deploy.md).

## Notification Hubs

To migrate settings from one Azure Notification Hubs instance to another instance, export and import all registration tokens with their tags:

1. [Export the existing notification hub registrations](/previous-versions/azure/azure-services/dn790624(v=azure.100)) to an Azure Blob storage container.
1. Create a new notification hub in the target environment.
1. [Import your registration tokens](/previous-versions/azure/azure-services/dn790624(v=azure.100)) from Blob storage to your new notification hub.

For more information:

- Refresh your knowledge by completing the [Notification Hubs tutorials](https://docs.microsoft.com/azure/notification-hubs/#step-by-step-tutorials).
- Review the [Notification Hubs overview](../notification-hubs/notification-hubs-push-notification-overview.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
