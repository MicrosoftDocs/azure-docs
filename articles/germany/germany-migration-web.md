---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating web resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Web

## App Service - Web Apps

This service is also covered under [Compute](./germany-migration-compute.md#app-service---web-apps).

The migration of App Services from Azure Germany to global Azure isn't supported at this time. The recommended approach is to export as Resource Manager template and redeploy after changing the location property to the new destination region.

> [!IMPORTANT]
> Change Location, Key Vault secrets, certs, and other GUIDs to be consistent with new region (location).

### Next steps

Refresh your knowledge about App Services by following these [Step-by-Step tutorials](../app-service/#step-by-step-tutorials).

### References

- [App Service Overview](../app-service/app-service-web-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Azure locations](https://azure.microsoft.com/en-us/global-infrastructure/locations/)
- [Redeploy the application](../azure-resource-manager/resource-group-template-deploy.md)












## Notification Hubs

You can export and import all registration tokens along with tags from one Hub to another. Here's how:

- [Export the existing Hub registrations](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) into an Azure Blob Storage container.
- Create a new Notification Hub in the target environment
- [Import your Registration Tokens](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) from Azure Blob Storage to your new Hub
