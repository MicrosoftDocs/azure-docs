---
title: Azure Native Qumulo Scalable File Service feature setup
description: Learn about features available with Azure Native Qumulo Scalable File Service offers you.

ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/13/2003
---

# Get Started with Azure Native Qumulo Scalable File Service: Key Features and Set-Up Guides

In this article, you learn about the key capabilities of Azure Native Qumulo Scalable File Service.

## Multiprotocol support

Azure Native Qumulo Scalable File Service provides multi file-sharing protocols such as NFS, SMB, FTP, and S3. Qumulo’s permissions model blends POSIX, Windows/NFSv4.1 ACLs, and S3 access levels. The permissions model enables the same files or objects to be simultaneously accessed across all our supported protocols.

Key links to get started:

- [Create an SMB Share]( https://care.qumulo.com/hc/en-us/articles/360000722428-Create-an-SMB-Share#in-this-article-0-0)
- [Create an NFS Export](https://care.qumulo.com/hc/en-us/articles/360000723928-Create-an-NFS-Export#in-this-article-0-0)
- [Create an S3 Bucket and configure the S3 API](https://docs.qumulo.com/administrator-guide/s3-api/creating-managing-s3-buckets.html)
- [Managing multiprotocol permissions](https://care.qumulo.com/hc/en-us/articles/360020316894-Cross-Protocol-Permissions-XPP-#in-this-article-0-0)
- [Create a Snapshot Policy](https://care.qumulo.com/hc/en-us/articles/115012699607-Taking-Directory-Snapshots-on-Demand-or-by-Using-a-Snapshot-Policy#in-this-article-0-0)
- [Create a Continuous Replication Relationship](https://care.qumulo.com/hc/en-us/articles/360018873374-Replication-Continuous-Replication-with-2-11-2-and-above#in-this-article-0-0)
- [Create a Directory Quota](https://care.qumulo.com/hc/en-us/articles/115009394288-Quotas-in-Qumulo-Core)

## Monitoring and auditing

Azure Native Qumulo Scalable File Service provides built-in system and data analytics that offer instant, real-time insight into file system capacity and activity. Additionally, you can integrate Qumulo events using Azure Monitoring Agent and then use Azure Monitor to track Qumulo system operations.

Key links to get started:

- [Real-time Dashboard](https://care.qumulo.com/hc/en-us/articles/360037604954-Qumulo-Core-Dashboard#in-this-article-0-0)
- [Open Metrics REST API - custom analytics](https://docs.qumulo.com/administrator-guide/metrics/openmetrics-api-specification.html)
- [Audit Logging with Azure Monitor]( https://care.qumulo.com/hc/en-us/articles/1500010560881-Auditing-Qumulo-on-Azure-using-Azure-Monitor#in-this-article-0-0)

## Authentication

Azure Native Qumulo Scalable File Service enables you to connect to:

- [Microsoft Entra ID](https://care.qumulo.com/hc/en-us/articles/115007276068-Join-your-Qumulo-Cluster-to-Active-Directory#in-this-article-0-0), or
- [Active Directory Domain Services](https://care.qumulo.com/hc/en-us/articles/1500005254761-Qumulo-on-Azure-Connect-to-Azure-Active-Directory).

## Developer tools

Qumulo offers a comprehensive suite of developer tools that facilitate seamless integration and streamlined management.

Key links to get started:

- [Qumulo CLI](https://care.qumulo.com/hc/en-us/articles/115013331308-QQ-CLI-Comprehensive-List-of-Commands#in-this-article-0-0)
- [Qumulo REST API](https://care.qumulo.com/hc/en-us/articles/115007063227-Getting-Started-with-Qumulo-Core-REST-API#in-this-article-0-0)
- [Qumulo PowerShell Toolkit](https://github.com/Qumulo/PowerShellToolkit)

## Next steps

- For more help with using Azure Native Qumulo Scalable File Service, see the [Qumulo documentation](https://docs.qumulo.com/cloud-guide/azure/).
- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)
