---
title: Mainframe rehosting on Azure virtual machines | Microsoft Docs
description: Rehost your mainframe workloads such as IBM Z-based systems using virtual machines (VMs) on Microsoft Azure.
services: virtual-machines-linux
documentationcenter:
author: njray
manager: edprice
editor: edprice
tags:
keywords:
---

# Mainframe rehosting on Azure virtual machines

Migrating workloads from mainframe environments to the cloud enables you to modernize your infrastructure and often save on costs. Many workloads can be transferred to Azure with only minor code changes, such as updating the names of databases.

The term *mainframe* generally refers to a large computer system, but the vast majority currently deployed are IBM System Z servers or IBM plug-compatible systems running MVS, DOS, VSE, OS/390, or z/OS.

An Azure virtual machine (VM) is used to isolate and manage the resources for a specific application on a single instance. Mainframes such as IBM z/OS use Logical Partitions (LPARS) for this purpose. A mainframe might use one LPAR for a CICS region with associated COBOL programs, and a separate LPAR for IBM Db2 database. A typical [n-tier application on Azure](https://docs.microsoft.com/azure/architecture/reference-architectures/n-tier/n-tier-sql-server) deploys Azure VMs into a virtual network that can be segmented into subnets for each tier.

Azure VMs can run mainframe emulation environments and compilers that support lift-and-shift scenarios. Development and testing are often among the first workloads to migrate from a mainframe to an Azure dev/test environment. Common server components that you can emulate include online transaction process (OLTP), batch, and data ingestion systems as the following figure shows.

![Emulation environments on Azure enable you to run z/OS-based systems.](media/01-overview.png)

Some mainframe workloads can be migrated to Azure with relative ease, while others can be rehosted on Azure using a partner solution. For detailed guidance about choosing a partner solution, the [Azure Mainframe Migration center](https://azure.microsoft.com/migration/mainframe/) can help.

## Set up dev/test environment using a Micro Focus rehosting platform

Micro Focus Enterprise Server is one of the largest mainframe rehosting platforms available. You can use it run your z/OS workloads on a less expensive x86 platform on Azure.

To get started, see the following articles:

- [Install Micro Focus Enterprise Server 4.0 and Enterprise Developer 4.0 on Azure](./microfocus/set-up-micro-focus-on-azure.md)
- [Set up Micro Focus CICS BankDemo for Micro Focus Enterprise Developer 4.0 in Azure](./microfocus/demo.md)

## TmaxSoft OpenFrame on Azure

TmaxSoft OpenFrame is a popular mainframe rehosting solution that makes it easy to lift your existing mainframe assets and shift them to Azure. An OpenFrame environment on Azure is suitable for development, demos, testing, or production workloads.

To get started, download the [Install TmaxSoft OpenFrame on Azure](https://azure.microsoft.com/resources/install-tmaxsoft-openframe-on-azure/) ebook.

## Set up a dev/test environment using IBM Z Dev/Test 12.0

IBM Z Development and Test Environment (IBM zD&T) sets up a non-production environment on Azure that you can use for development, testing, and demos of z/OS-based applications.

The emulation environment on Azure can host a variety of Z instances through Application Developers Controlled Distributions (ADCDs). You can run zD&T Personal Edition, zD&T Parallel Sysplex, and zD&T Enterprise Edition on Azure and Azure Stack.

To get started, see the following articles:

-   [Set up IBM zD&T 12.0 on Azure](./ibm/install-ibm-z-environment.md)
-   [Set up ADCD on zD&T](./ibm/demo.md)

## Migrate IBM DB2 pureScale to Azure

The IBM DB2 pureScale environment provides a database cluster for Azure with high availability and scalability on Linux operating systems. Though not identical to the original environment, IBM DB2 pureScale on Linux delivers similar high-availability and scalability features as IBM DB2 for z/OS running in a Parallel Sysplex configuration on the mainframe.

To get started, see [IBM DB2 pureScale on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/ibm-db2-purescale-azure).

## Considerations

When you migrate mainframe workloads to Azure infrastructure as a service (IaaS), you can choose from several types of on-demand, scalable computing resources, including Azure VMs. Azure offers a range of [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/overview) and [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/overview) VMs.

### High availability and failover

Azure offers commitment-based service-level agreements (SLAs), where multiple 9s availability is the default, optimized with local or geo-based replication of services. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.

For Azure IaaS such as VMs, failover relies on specific system functionality, such as failover clustering instances and [availability sets](https://docs.microsoft.com/azure/virtual-machines/windows/regions-and-availability#availability-sets). When you use Azure platform as a service (PaaS) resources, such as [Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-technical-overview) and [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/introduction), the platform handles failovers automatically.

### Scalability

Mainframes typically scale up, while cloud environment scale out. Azure offers a range of [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) and [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) sizes to meet your needs. The cloud also scales up or down to match exact user specifications. Compute power, storage, and services
[scale](https://docs.microsoft.com/azure/architecture/best-practices/auto-scaling) on demand under a usage-based billing model.

### Storage

In the cloud, you have a range of flexible, scalable storage options, and you pay only for what you need. [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-introduction) offers a massively scalable object store for data objects, a file system service for the cloud, a reliable messaging store, and a NoSQL store. For VMs, managed and unmanaged disks provide persistent, secure disk storage.

### Backup and recovery

Maintaining your own disaster recovery site can be an expensive proposition. Azure has easy-to-implement and cost-effective options for
[backup](https://docs.microsoft.com/azure/backup/backup-introduction-to-azure-backup), [recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview), and [redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy)
at local or regional levels, or via geo-redundancy.

## Azure Government for mainframe migrations

Many public sector entities would love to move their mainframe applications to a more modern, flexible platform. Microsoft Azure Government is a physically separated instance of cloud services based on the global Microsoft Azure platform but packaged for federal, state, and local government systems. It provides world-class security, protection, and compliance services specifically for United States government agencies and their partners.

Azure Government earned a Provisional Authority to Operate (P-ATO) for FedRAMP High Impact for systems that need this type of environment. 

To get started, download [Microsoft Azure Government cloud for mainframe applications](https://azure.microsoft.com/resources/microsoft-azure-government-cloud-for-mainframe-applications/en-us/).

## Learn more

If you are considering a mainframe migration, our extensive [partner](partner-workloads.md) ecosystem is available to help you. For detailed guidance about choosing a partner solution,
refer to the [Platform Modernization Alliance](https://www.platformmodernization.org/pages/mainframe.aspx).

See also:

-   [Mainframe migration](https://docs.microsoft.com/azure/architecture/cloud-adoption/infrastructure/mainframe-migration/overview)
-   [Troubleshooting](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/)
-   [Demystifying mainframe to Azure migration](https://azure.microsoft.com/resources/demystifying-mainframe-to-azure-migration/en-us/)

<!-- INTERNAL LINKS -->
[microfocus-get-started]: /microfocus/get-started.md
[microfocus-setup]: /microfocus/set-up-micro-focus-on-azure.md
[microfocus-demo]: /microfocus/demo.md
[ibm-get-started]: /ibm/get-started.md
[ibm-install-z]: /ibm/install-ibm-z-environment.md
[ibm-demo]: /ibm/demo.md
