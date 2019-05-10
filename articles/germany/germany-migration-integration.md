---
title: Migrate Azure integration resources from Azure Germany to global Azure
description: This article provides information about migrating your Azure integration resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate integration resources to global Azure

This article has information that can help you migrate Azure integration resources from Azure Germany to global Azure.

## Service Bus

Azure Service Bus services don't have data export or import capabilities. To migrate Service Bus resources from Azure Germany to global Azure, you can export the resources [as an Azure Resource Manager template](../azure-resource-manager/manage-resource-groups-portal.md#export-resource-groups-to-templates). Then, adapt the exported template for global Azure and re-create the resources.

> [!NOTE]
> Exporting a Resource Manager template doesn't copy the data (for example, messages). Exporting a template only re-creates the metadata.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Service Bus metadata

The following Service Bus metadata elements are re-created when you export a Resource Manager template:

- Namespaces
- Queues
- Topics
- Subscriptions
- Rules
- Authorization rules

### Keys

The preceding steps to export and re-create don't copy the shared access signature keys that are associated with authorization rules. If you need to preserve the shared access signature keys, use the `New-AzServiceBuskey` cmdlet with the optional parameter `-Keyvalue` to accept the key as a string. The updated cmdlet is available in [Azure PowerShell Az module](/powershell/azure/install-az-ps).

### Usage example

```powershell
New-AzServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>
```

```powershell
New-AzServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Queue <queuename> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>
```

```powershell
New-AzServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Topic <topicname> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>
```

> [!NOTE]
> You must update your applications to use a new connection string even if you preserve the keys. DNS host names are different in Azure Germany and global Azure.

### Sample connection strings

**Azure Germany**

```cmd
Endpoint=sb://myBFProdnamespaceName.**servicebus.cloudapi.de**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=
```

**Global Azure**

```cmd
Endpoint=sb://myProdnamespaceName.**servicebus.windows.net**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=
```

For more information:

- Refresh your knowledge by completing the [Service Bus tutorials](https://docs.microsoft.com/azure/service-bus-messaging/#step-by-step-tutorials).
- Become familiar with how to [export Resource Manager templates](../azure-resource-manager/manage-resource-groups-portal.md#export-resource-groups-to-templates) or read the overview of [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).
- Review the [Service Bus overview](../service-bus-messaging/service-bus-messaging-overview.md).

## Logic Apps

The Azure Logic Apps service isn't available in Azure Germany. However, Azure Scheduler, which is available, is being deprecated. Use Logic Apps to create scheduling jobs in global Azure.

For more information:

- Become familiar with features in Azure Logic Apps by completing the [Logic Apps tutorials](https://docs.microsoft.com/azure/logic-apps/#step-by-step-tutorials).
- Review the [Azure Logic Apps overview](../logic-apps/logic-apps-overview.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
