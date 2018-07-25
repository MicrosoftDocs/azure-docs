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

This service is also covered under [Internet of Things](./germany-migration-iot#functions).

Migration of Functions between Azure Germany and global Azure isn't supported at this time. The recommended approach is to export Resource Manager template, change the location, and redeploy to target region.

> [!IMPORTANT]
> Change Location, Key Vault secrets, certs, and other GUIDs to be consistent with new region (location).

### Next steps

Refresh your knowledge about Functions by following these [Step-by-Step tutorials](../azure-functions/#step-by-step-tutorials).

### References

- [Azure Functions Overview](../azure-functions/functions-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Azure locations](https://azure.microsoft.com/en-us/global-infrastructure/locations/)
- [Redeploy the application](../azure-resource-manager/resource-group-template-deploy.md)













## Notification Hub

This service is already covered under [Web](./germany-migration-web.md#notification-hubs)

## IoT Hub
