---
title: Migrate Azure web resources from Azure Germany to global Azure
description: This article provides information about migrating your Azure web resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 12/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate web resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers' needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft's global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

This article has information that can help you migrate Azure web resources from Azure Germany to global Azure.

## Web Apps

Migrating apps that you created by using the Web Apps feature of Azure App Service from Azure Germany to global Azure isn't supported at this time. We recommend that you export a web app as an Azure Resource Manager template. Then, redeploy after you change the location property to the new destination region.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

For more information:

- Refresh your knowledge by completing the [App Service tutorials](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-dotnetcore-sqldb).
- Get information about how to [export Azure Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md).
- Review the [Azure Resource Manager overview](../azure-resource-manager/management/overview.md).
- Review the [App Service overview](../app-service/overview.md).
- Get an [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Notification Hubs

To migrate settings from one Azure Notification Hubs instance to another instance, export and import all registration tokens with their tags:

1. [Export the existing notification hub registrations](/previous-versions/azure/azure-services/dn790624(v=azure.100)) to an Azure Blob storage container.
1. Create a new notification hub in the target environment.
1. [Import your registration tokens](/previous-versions/azure/azure-services/dn790624(v=azure.100)) from Blob storage to your new notification hub.

For more information:

- Refresh your knowledge by completing the [Notification Hubs tutorials](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-android-push-notification-google-fcm-get-started).
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
