---
title: Migrate web resources from Azure Germany to global Azure
description: This article provides information about migrating web resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate web resources from Azure Germany to global Azure

This article has information that can help you migrate Azure web resources from Azure Germany to global Azure.

## Web apps

Migrating apps that you created by using the Web Apps feature of Azure App Service from Azure Germany to global Azure isn't supported at this time. We recommend that you export a web app as an Azure Resource Manager template. Then, redeploy after you change the location property to the new destination region.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

For more information, see these articles:
- [App Service overview](../app-service/app-service-web-overview.md)
- [Export an Azure Resource Manager template by using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy a template](../azure-resource-manager/resource-group-template-deploy.md)

## Notification Hubs

To migrate settings from one Azure Notification Hubs instance to another instance, you can export and import all registration tokens with their tags:

1. [Export the existing hub registrations](https://msdn.microsoft.com/library/azure/dn790624.aspx) to an Azure Blob storage container.
1. Create a new notification hub in the target environment.
1. [Import your registration tokens](https://msdn.microsoft.com/library/azure/dn790624.aspx) from Azure Blob storage to your new hub.

For more information, see the [Notification Hubs overview](../notification-hubs/notification-hubs-push-notification-overview.md).

# Next steps

- Refresh your knowledge by completing these [step-by-step tutorials](https://docs.microsoft.com/azure/app-service/#step-by-step-tutorials):
  - [App Service tutorials](https://docs.microsoft.com/azure/app-service/#step-by-step-tutorials)
  - [Notification Hubs tutorials](https://docs.microsoft.com/azure/notification-hubs/#step-by-step-tutorials)
- Learn how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md), or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).
