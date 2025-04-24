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

Azure Native Qumulo offers a high-performance, scalable, and cost-effective cloud file system with Pay-as-you-Go and Pre-Pay pricing options. ANQ separates performance and capacity pricing, giving users full control over storage and data acceleration economics.

The Azure Native Qumulo offering on Azure Marketplace enables you to create and manage a Qumulo file system using the Azure portal, providing a seamless integrated experience. You can also create and manage Qumulo resources by using the Azure portal through the resource provider Qumulo.Storage/fileSystem. Qumulo manages the service while giving you full administrative rights to configure details including file system shares, exports, quotas, snapshots, and Active Directory users.

## Capabilities

Azure Native Qumulo Scalable File Service provides the following capabilities:

- **Seamless onboarding** - Easily include Qumulo as a natively integrated service on Azure. The service can be deployed quickly.
- **Multi-protocol support** - ANQ supports all standard file system protocols NFS, SMB, FTP, and S3.
- **Exabyte scale storage scaling** - Each Qumulo instance can be scaled up to exabytes of storage capacity.
- **Unified billing** - Each ANQ deployment appears as a single line item in your Azure bill, including infrastructure and software.
- **Elastic performance** - ANQ enables workflows to consume capacity and performance independently of each other. The base configuration includes 1 GB/s throughput and 10,000 IOPS, which can scale to over 1 TB/s and exceed 6 million IOPS.
- **Private access** - The service is directly connected to your own virtual network (sometimes called VNet injection).
- **Cloud Data Fabric** - CDF enables seamless integration with on-premises or other cloud region Qumulo instances.

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