---
title: Migration from Azure Germany web resources to public Azure
description: Provides help for migrating web resources
author: gitralf
ms.author: ralfwi 
ms.date: 8/13/2018
ms.topic: article
ms.custom: bfmigrate
---

# Web

## App Service - Web Apps

The migration of App Services from Azure Germany to global Azure isn't supported at this time. The recommended approach is to export as Resource Manager template and redeploy after changing the location property to the new destination region.

> [!IMPORTANT]
> Change Location, Key Vault secrets, certs, and other GUIDs to be consistent with new region (location).

### Next steps

- Refresh your knowledge about App Services by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/app-service/#step-by-step-tutorials).
- Make yourself familiar how to [export an ARM template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [App Service Overview](../app-service/app-service-web-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy the application](../azure-resource-manager/resource-group-template-deploy.md)












## Notification Hubs

This service is also covered under [Internet of Things](./germany-migration-iot.md#notification-hub).

You can export and import all registration tokens along with tags from one Hub to another. Here's how:

- [Export the existing Hub registrations](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) into an Azure Blob Storage container.
- Create a new Notification Hub in the target environment
- [Import your Registration Tokens](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) from Azure Blob Storage to your new Hub

### Next Steps

Refresh your knowledge about Notification Hubs by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/notification-hubs/#step-by-step-tutorials).

### References

- [Notification Hubs overview](../notification-hubs/notification-hubs-push-notification-overview.md)