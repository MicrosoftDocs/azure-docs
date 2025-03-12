---
title: Azure Native Qumulo overview
description: Learn about what Azure Native Qumulo offers you.
ms.topic: overview
ms.date: 01/21/2025
---

# What is Azure Native Qumulo?

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and Qumulo developed this service and manage it together.

You can find Azure Native Qumulo (ANQ) in the [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview).

Qumulo is an industry leader in distributed file system and object storage. Qumulo provides a scalable, performant, and simple-to-use cloud-native file system that can support a wide variety of data workloads. The file system uses standard file-sharing protocols, such as NFS, SMB, FTP, and S3.

The Azure Native Qumulo offering on Azure Marketplace allows you to create and manage a Qumulo file system by using the Azure portal with a seamlessly integrated experience. You can also create and manage Qumulo resources by using the Azure portal through the resource provider `Qumulo.Storage/fileSystem`. Qumulo manages the service while giving you full admin rights to configure details like file system shares, exports, quotas, snapshots, and Active Directory users.

## Capabilities

Azure Native Qumulo Scalable File Service provides the following capabilities:

- **Seamless onboarding** - Easily include Qumulo as a natively integrated service on Azure. The service can be deployed quickly.
- **Multi-protocol support** - ANQ supports all standard file system protocols: NFS, SMB, FTP, and S3.
- **Exabyte scale storage scaling** - Each Qumulo instance can be scaled up to exabytes of storage capacity.
- **Unified billing** - Get a single bill for all resources that you consume on Azure for the Qumulo service.
- **Elastic performance** - Workflows to consume capacity and performance independently of each other. 1 GB/s throughput is included in the base configuration.
- **Private access** - The service is directly connected to your own virtual network (sometimes called _VNet injection_).
- **Global Namespaces** - This capability enables all workloads on Azure Native Qumulo Scalable File Service or on-premises Qumulo instance to be pointed to a single namespace.

### Storage class

Azure Native Qumulo offers multiple storage class options for your workloads.

- Hot LRS
- Hot ZRS 
- Cold LRS

See Qumulo's documentation to learn more about [storage class options](https://docs.qumulo.com/azure-native-administrator-guide/getting-started/how-azure-native-qumulo-works.html#using-cold-workloads). 

### Billing

See Qumulo's documentation for [billing information](https://docs.qumulo.com/azure-native-administrator-guide/getting-started/how-azure-native-qumulo-works.html#usage-billing-and-metering-for-azure-native-qumulo). 

You can choose between available plans when you create your Qumulo resource. 

## Subscribe to Qumulo

[!INCLUDE [subscribe](../includes/subscribe.md)] *Azure Native Qumulo*.

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

> [!NOTE]
> 
> When you create the service instance, the following entities are also created and mapped to a Qumulo file system namespace:
> 
> - A delegated subnet that enables the Qumulo service to inject service endpoints (eNICs) into your virtual network.
> - A managed resource group that has internal networking and other resources required for the Qumulo service.
> - A Qumulo resource in the region of your choosing. This entity stores and manages your data.
> - A Software as a Service (SaaS) resource, based on the plan that you select in the Azure Marketplace offer for Qumulo. This resource is used for billing.

## Qumulo links

To learn more about Azure Native Qumulo, see the [Qumulo documentation](https://docs.qumulo.com/azure-native-administrator-guide/).

### Developer tools

Qumulo offers a comprehensive suite of developer tools that facilitate seamless integration and streamlined management:

- [Qumulo CLI](https://care.qumulo.com/hc/en-us/articles/115013331308-QQ-CLI-Comprehensive-List-of-Commands#in-this-article-0-0)
- [Qumulo REST API](https://care.qumulo.com/hc/en-us/articles/115007063227-Getting-Started-with-Qumulo-Core-REST-API#in-this-article-0-0)
- [Qumulo PowerShell Toolkit](https://github.com/Qumulo/PowerShellToolkit)

## Next steps

- [Quickstart: Get started with Azure Native Qumulo](create.md)