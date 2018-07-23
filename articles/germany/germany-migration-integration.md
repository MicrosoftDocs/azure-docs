---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating integration resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Integration

## Service Bus

### Metadata

Service Bus and Event Hubs services do not have data export--import capabilities. However, since all Service Bus and Event Hub resources are ARM expressible, you can use the [ARM export resource group as a template](../azure-resource-manager/resource-manager-export-template-powershell.md) capability to export your Service Bus and Event Hubs resources in Azure Germany. After that, adopt the exported template for  public Azure and recreate the resources.

**Note**: This would not copy the data (i.e. messages), it would only replicate the Metadata.

### Metadata Service Bus

- Namespaces
- Queues
- Topics
- Subscriptions
- Rules
- AuthorizationRules (see also below)

### Metadata Event Hubs

- Namespaces
- event hubs
- consumer groups
- Authorization Rules (see also below)

### Keys

The Export/Recreate steps above will not copy over the SAS keys associated with AuthorizationRule. If you are interested in preserving the SAS keys, they can explicitly the SAS key value using the `New-AzureRmServiceBuskey` cmdlet with optional parameter `-Keyvalue` to accept the key as string and will update with provided value. The updated cmdlet is available below [release 6.4.0 (July 2018)](https://www.powershellgallery.com/packages/AzureRM/6.4.0) or [GitHub](<https://github.com/Azure/azure-powershell/releases/tag/v6.4.0-July2018)

Usage example:

    New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>

    New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Queue <queuename> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>

    New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Topic <topicname> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>

> [!NOTE]
> You will need to update your applications to use a new connection string even if you preserve the keys because the DNS host names are different between Azure Germany and public Azure.

Sample connection strings:

Azure Germany

    Endpoint=sb://myBFProdnamespaceName.**servicebus.cloudapi.de**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=

Public Azure

    Endpoint=sb://myProdnamespaceName.**servicebus.windows.net**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=
