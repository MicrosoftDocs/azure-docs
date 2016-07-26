<properties
	pageTitle="Moving Data to and from Azure Storage | Microsoft Azure"
	description="This article provides an overview of the different methods for moving data to and from Azure Storage."
	services="storage"
	documentationCenter=""
	authors="micurd"
	manager="jahogg"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/27/2016"
	ms.author="micurd"/>

# Moving data to and from Azure Storage

If you want to move on-premises data to Azure Storage (or vice versa), there are a variety of ways to do this. The approach that works best for you will depend on your scenario. This article will provide a quick overview of different scenarios and appropriate offerings for each one.

## Building Applications

If you're building an application, developing against the REST API or one of our many client libraries is a great way to move data to and from Azure Storage.

Azure Storage provides rich client libraries for .NET, iOS, Java, Android, Universal Windows Platform (UWP), Xamarin, C++, Node.JS, PHP, Ruby, and Python. The client libraries offer advanced capabilities such as retry logic, logging, and parallel uploads. You can also develop directly against the REST API, which can be called by any language that makes HTTP/HTTPS requests.

See [Get Started with Azure Blob Storage](storage-dotnet-how-to-use-blobs.md) to learn more.

In addition, we also offer the [Data Movement Library](https://www.nuget.org/packages/Microsoft.Azure.Storage.DataMovement) which is a library designed for high-performance copying of data to and from Azure. Please refer to our Data Movement Library [documentation](https://github.com/Azure/azure-storage-net-data-movement) to learn more. 

## Quickly viewing/interacting with your data

If you want an easy way to view your Azure Storage data while also having the ability to upload and download your data, then consider using an Azure Storage Explorer.

Check out our list of [Azure Storage Explorers](storage-explorers.md) to learn more.

## System Administration

If you require or are more comfortable with a command-line utility (e.g. System Administrators), here are a few options for you to consider:

### AzCopy

AzCopy is a Windows command-line utility designed for high-performance copying of data to and from Azure Storage. You can also copy data within a storage account, or between different storage accounts.

See [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md) to learn more.

### Azure PowerShell

Azure PowerShell is a module that provides cmdlets for managing services on Azure. It's a task-based command-line shell and scripting language designed especially for system administration.

See [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md) to learn more.

### Azure CLI

Azure CLI provides a set of open source, cross-platform commands for working with Azure services. Azure CLI is available on Windows, OSX, and Linux.

See [Using the Azure CLI with Azure Storage](storage-azure-cli.md) to learn more.

## Moving large amounts of data with a slow network

One of the biggest challenges associated with moving large amounts of data is the transfer time. If you want to get data to/from Azure Storage without worrying about networks costs or writing code, then Azure Import/Export is an appropriate solution.

See [Azure Import/Export](storage-import-export-service.md) to learn more.

## Backing up your data

If you simply need to backup your data to Azure Storage, Azure Backup is the way to go. This is a powerful solution for backing up on-premises data and Azure VMs.

See [Azure Backup](../backup/backup-introduction-to-azure-backup.md) to learn more.

## Accessing your data on-premises and from the cloud

If you need a solution for accessing your data on-premises and from the cloud, then you should consider using Azure's hybrid cloud storage solution, StorSimple. This solution consists of a physical StorSimple device that intelligently stores frequently used data on SSDs, occasionally used data on HDDs, and inactive/backup/archival data on Azure Storage.

See [StorSimple](../storsimple/storsimple-overview.md) to learn more.

## Recovering your data

When you have on-premises workloads and applications, you'll need a solution that allows your business to continue running in the event of a disaster. Azure Site Recovery handles replication, failover, and recovery of virtual machines and physical servers. Replicated data is stored in Azure Storage, allowing you to eliminate the need for a secondary on-site datacenter.

See [Azure Site Recovery](../site-recovery/site-recovery-overview.md) to learn more.
