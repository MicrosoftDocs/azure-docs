---
title: Migration of integration resources from Azure Germany to global Azure
description: This article provides help for migrating integration resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of integration resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Integration resources from Azure Germany to global Azure.

## Service Bus

Service Bus services don't have data export or import capabilities. To migrate Service Bus from Azure Germany to global Azure, you can export the Service Bus resources [as a Resource Manager template](../azure-resource-manager/resource-manager-export-template-powershell.md). Then adopt the exported template for global Azure and recreate the resources.

> [!NOTE]
> This doesn't copy the data (for example messages), it's only recreating the metadata.


> [!IMPORTANT]
> Change location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

### Metadata Service Bus

- Namespaces
- Queues
- Topics
- Subscriptions
- Rules
- AuthorizationRules (see also below)

### Keys

The Export/Recreate steps above won't copy the SAS keys associated with Authorization rules. If you need to preserve the SAS keys, use the `New-AzureRmServiceBuskey` cmdlet with the optional parameter `-Keyvalue` to accept the key as string. The updated cmdlet is available at [PowerShell Gallery release 6.4.0 (July 2018)](https://www.powershellgallery.com/packages/AzureRM/6.4.0) or at [GitHub](https://github.com/Azure/azure-powershell/releases/tag/v6.4.0-July2018).

### Usage example

```powershell
New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>
```

```powershell
New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Queue <queuename> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>
```

```powershell
New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Topic <topicname> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>
```

> [!NOTE]
> You will need to update your applications to use a new connection string even if you preserve the keys because the DNS host names are different between Azure Germany and global Azure.

### Sample connection strings

**Azure Germany**

```cmd
Endpoint=sb://myBFProdnamespaceName.**servicebus.cloudapi.de**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=
```

**Global Azure**

```cmd
Endpoint=sb://myProdnamespaceName.**servicebus.windows.net**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=
```

### Next steps

- Refresh your knowledge about Service Bus by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/service-bus-messaging/#step-by-step-tutorials).
- Make yourself familiar how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [Service Bus Overview](../service-bus-messaging/service-bus-messaging-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)







## Logic Apps

Logic Apps service isn't available in Azure Germany. However, Azure Scheduler (which is available) is being deprecated. Use Azure Logic apps instead to create scheduling jobs.

### Next Steps

- Make yourself familiar with the features that [Azure Logic Apps provides by following the [Step-by-Step tutorials](https://docs.microsoft.com/azure/logic-apps/#step-by-step-tutorials).

### Reference

- [Azure Logic Apps overview](../logic-apps/logic-apps-overview.md) 