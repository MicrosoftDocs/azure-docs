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

Service Bus and Event Hubs services don't have data export or import capabilities. However, you can export the Service Bus and Event Hub resources [as a template](../azure-resource-manager/resource-manager-export-template-powershell.md). Then adopt the exported template for global Azure and recreate the resources.

> [!NOTE]
> This doesn't copy the data (for example messages), it's only recreating the metadata.

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

The Export/Recreate steps above won't copy the SAS keys associated with Authorization rules. If you need to preserve the SAS keys, use the *New-AzureRmServiceBuskey* cmdlet with the optional parameter `-Keyvalue` to accept the key as string. The updated cmdlet is available at [PowerShell Gallery release 6.4.0 (July 2018)](https://www.powershellgallery.com/packages/AzureRM/6.4.0) or at [GitHub](<https://github.com/Azure/azure-powershell/releases/tag/v6.4.0-July2018)

Usage example:

    New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>

    New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Queue <queuename> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>

    New-AzureRmServiceBuskey -ResourceGroupName <resourcegroupname> -Namespace <namespace> -Topic <topicname> -Name <name of Authorization rule> -RegenerateKey <PrimaryKey/SecondaryKey> -KeyValue <string - key value>

> [!NOTE]
> You will need to update your applications to use a new connection string even if you preserve the keys because the DNS host names are different between Azure Germany and public Azure.

Sample connection strings:

Azure Germany

    Endpoint=sb://myBFProdnamespaceName.**servicebus.cloudapi.de**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=

Global Azure

    Endpoint=sb://myProdnamespaceName.**servicebus.windows.net**/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXx=
