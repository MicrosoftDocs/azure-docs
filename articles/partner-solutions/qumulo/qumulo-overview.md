---
title: Azure Native Qumulo Scalable File Service overview
description: Learn about what Azure Native Qumulo Scalable File Service offers you.

ms.topic: overview
ms.custom: template-overview
ms.date: 01/18/2023

---

# What is Azure Native Qumulo Scalable File Service?

Qumulo is an industry leader in distributed file system and object storage. Qumulo provides a scalable, performant, and simple-to-use cloud-native file system that can support a wide variety of data workloads. The file system uses standard file-sharing protocols, such as NFS, SMB, FTP, and S3.

The Azure Native Qumulo Scalable File Service offering on Azure Marketplace enables you to create and manage a Qumulo file system by using the Azure portal with a seamlessly integrated experience. You can also create and manage Qumulo resources by using the Azure portal through the resource provider `Qumulo.Storage/fileSystem`. Qumulo manages the service while giving you full admin rights to configure details like file system shares, exports, quotas, snapshots, and Active Directory users.

> [!NOTE]
> Azure Native Qumulo Scalable File Service stores and processes data only in the region where the service was deployed. No data is stored outside that region.

## Capabilities

Azure Native Qumulo Scalable File Service provides:

- Seamless onboarding: Easily include Qumulo as a natively integrated service on Azure.

- Unified billing: Get a single bill for all resources that you consume on Azure for the Qumulo service. 
<!-- Is the benefit one bill for all Qumulo deployments or one bill for anything you do on Azure including Qumulo? -->
- Private access: The service is directly connected to your own virtual network (sometimes called *VNet injection*).

## Next steps

- For more help with using Azure Native Qumulo Scalable File Service, see the [Qumulo documentation](https://docs.qumulo.com/cloud-guide/azure/).
- To create an instance of the service, see the [quickstart](qumulo-create.md).
