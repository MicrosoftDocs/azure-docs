---
title: Azure Native Qumulo overview
description: Learn about what Azure Native Qumulo offers you.
ms.topic: overview
ms.date: 01/21/2025
---

# What is Azure Native Qumulo?

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and Qumulo developed this service and manage it together.

Azure Native Qumulo (ANQ) is a fully managed service that provisions a Qumulo file system and creates a resource (for managing the file system) under your Azure subscription. ANQ provides the same multi-protocol support, interfaces, and functionality as Qumulo on premises. ANQ makes it possible to configure file protocols, quotas, replication, and other features regardless of underlying infrastructure or storage and without tracking resource quotas or costs. The service receives the latest updates and features continuously and, if any issues occur, replaces compute and storage resources automatically.

You can find Azure Native Qumulo in the [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview).

The Azure Native Qumulo offering on Azure Marketplace enables you to create and manage a Qumulo file system using the Azure portal. You can also create and manage Qumulo resources by using the Azure portal through the resource provider `Qumulo.Storage/fileSystem`. Qumulo manages the service while giving you full administrative rights to configure details including file system shares, exports, quotas, snapshots, and Active Directory users.

## Capabilities

Azure Native Qumulo Scalable File Service provides the following capabilities:

- **Multi-protocol support** - ANQ supports all standard file system protocols NFS, SMB, FTP, and S3.
- **Exabyte scale storage scaling** - Each Qumulo instance can be scaled up to exabytes of storage capacity.
- **Elastic performance** - ANQ enables workflows to consume capacity and performance independently of each other. The base configuration includes 1 GB/s throughput and 10,000 IOPS, which can scale to over 1 TB/s and exceed 6 million IOPS.
- **Private access** - The service is directly connected to your own virtual network (sometimes called VNet injection).
- **Cloud Data Fabric** - CDF enables seamless integration with on-premises or other cloud region Qumulo instances.

## Subscribe to Qumulo

[!INCLUDE [subscribe](../includes/subscribe.md)] *Azure Native Qumulo*.

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Next step

> [!div class="nextstepaction"]
> [Create a resource](create.md)