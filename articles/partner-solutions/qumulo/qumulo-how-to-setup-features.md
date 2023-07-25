---
title: Azure Native Qumulo Scalable File Service feature set up
description: Learn about features available with Azure Native Qumulo Scalable File Service offers you.

ms.topic: overview
ms.date: 07/25/2023
#assign-reviewer: @flang-msft

---

# Set-up features for Azure Native Qumulo Scalable File Service

In this article we will describe key capabilities of Azure Native Qumulo Scalable File Service. 

## Multiprotocol support 
Azure Native Qumulo Scalable File Service provide multi file-sharing protocols such as NFS, SMB, FTP, and S3. Qumulo’s permissions model blends POSIX, Windows/NFSv4.1 ACLs, and S3 access levels, enabling the same files or objects to be simultaneously accessed across all our supported protocols.

Key links to get started: 
1. [Create an SMB Share]( https://care.qumulo.com/hc/en-us/articles/360000722428-Create-an-SMB-Share#in-this-article-0-0)
1. [Create an NFS Export](https://care.qumulo.com/hc/en-us/articles/360000723928-Create-an-NFS-Export#in-this-article-0-0)
1. [Create an S3 Bucket and configure the S3 API](https://docs.qumulo.com/administrator-guide/s3-api/creating-managing-s3-buckets.html)
1. [Managing multiprotocol permissions](https://care.qumulo.com/hc/en-us/articles/360020316894-Cross-Protocol-Permissions-XPP-#in-this-article-0-0)
1. [Create a Snapshot Policy](https://care.qumulo.com/hc/en-us/articles/115012699607-Taking-Directory-Snapshots-on-Demand-or-by-Using-a-Snapshot-Policy#in-this-article-0-0)
1. [Create a Continous Replication Relationship](https://care.qumulo.com/hc/en-us/articles/360018873374-Replication-Continuous-Replication-with-2-11-2-and-above#in-this-article-0-0)
1. [Create a Directory Quota](https://care.qumulo.com/hc/en-us/articles/115009394288-Quotas-in-Qumulo-Core)

## Monitoring and Auditing 

Azure Native Qumulo Scalable File Service provides built-in system and data analytics to provide instant, real-time insight to file system capacity and activity. You can also integrate  Qumulo events using Azure Monitoring Agent and then use Azure Monitor to track Qumulo system operations. 

Key links to get started: 
1. [Real-time Dashboard](https://care.qumulo.com/hc/en-us/articles/360037604954-Qumulo-Core-Dashboard#in-this-article-0-0)
1. [Open Metrics REST API - custom analytics](https://docs.qumulo.com/administrator-guide/metrics/openmetrics-api-specification.html)
1. [Audit Logging with Azure Monitor]( https://care.qumulo.com/hc/en-us/articles/1500010560881-Auditing-Qumulo-on-Azure-using-Azure-Monitor#in-this-article-0-0)

## Authentication 

Azure Native Qumulo Scalable File Service enables you connect to [Azure Active Directory](https://care.qumulo.com/hc/en-us/articles/115007276068-Join-your-Qumulo-Cluster-to-Active-Directory#in-this-article-0-0) or [Active Directory Domain Services](https://care.qumulo.com/hc/en-us/articles/1500005254761-Qumulo-on-Azure-Connect-to-Azure-Active-Directory).

## Developer Tools 

Qumulo provides a rich set of developer tools to enable easier integration and management. 

Key links to get started:
1. [Qumulo CLI](https://care.qumulo.com/hc/en-us/articles/115013331308-QQ-CLI-Comprehensive-List-of-Commands#in-this-article-0-0)
1. [Qumulo REST API](https://care.qumulo.com/hc/en-us/articles/115007063227-Getting-Started-with-Qumulo-Core-REST-API#in-this-article-0-0)
1. [Qumulo PowerShell Toolkit](https://github.com/Qumulo/PowerShellToolkit)
