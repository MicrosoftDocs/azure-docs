---
title: Migration of web resources from Azure Germany to global Azure
description: This article provides help for migrating web resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of web resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Web resources from Azure Germany to global Azure.

## App Service - Web Apps

The migration of App Services from Azure Germany to global Azure isn't supported at this time. The recommended approach is to export as Resource Manager template and redeploy after changing the location property to the new destination region.

> [!IMPORTANT]
> Change location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

### Next steps

- Refresh your knowledge about App Services by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/app-service/#step-by-step-tutorials).
- Make yourself familiar how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [App Service Overview](../app-service/app-service-web-overview.md)
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