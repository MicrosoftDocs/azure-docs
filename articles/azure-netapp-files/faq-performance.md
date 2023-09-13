---
title: Performance FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about Azure NetApp Files Performance.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 08/18/2022
---
# Performance FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files Performance.

## What should I do to optimize or tune Azure NetApp Files performance?

You can take the following actions per the performance requirements: 
- Ensure that the Virtual Machine is sized appropriately.
- Enable Accelerated Networking for the VM.
- Select the desired service level and size for the capacity pool.
- Create a volume with the desired quota size for the capacity and performance.

There is no need to set accelerated networking for the NICs in the dedicated subnet of Azure NetApp Files. [Accelerated networking](../virtual-network/virtual-machine-network-throughput.md) is a capability that only applies to Azure virtual machines. Azure NetApp Files NICs are optimized by design.

## How do I convert throughput-based service levels of Azure NetApp Files to IOPS?

You can convert MB/s to IOPS by using the following formula:  

`IOPS = (MBps Throughput / KB per IO) * 1024`

## How do I change the service level of a volume?

You can change the service level of an existing volume by moving the volume to another capacity pool that uses the [service level](azure-netapp-files-service-levels.md) you want for the volume. See [Dynamically change the service level of a volume](dynamic-change-volume-service-level.md). 

## How do I monitor Azure NetApp Files performance?

Azure NetApp Files provides volume performance metrics. You can also use Azure Monitor for monitoring usage metrics for Azure NetApp Files. See [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md) for the list of performance metrics for Azure NetApp Files.

## What's the performance impact of Kerberos on NFSv4.1?

See [Performance impact of Kerberos on NFSv4.1 volumes](performance-impact-kerberos.md) for information about security options for NFSv4.1, the performance vectors tested, and the expected performance impact. 

## What's the performance impact of using `nconnect` with Kerberos?

[!INCLUDE [nconnect krb5 performance warning](includes/kerberos-nconnect-performance.md)]

## Does Azure NetApp Files support SMB Direct?

No, Azure NetApp Files does not support SMB Direct. 

## Is NIC Teaming supported in Azure?

NIC Teaming is not supported in Azure. Although multiple network interfaces are supported on Azure virtual machines, they represent a logical rather than a physical construct. As such, they provide no fault tolerance.  Also, the bandwidth available to an Azure virtual machine is calculated for the machine itself and not any individual network interface.

## Are jumbo frames supported?

Jumbo frames are not supported with Azure virtual machines.

## Next steps  

- [Performance impact of Kerberos on NFSv4.1 volumes](performance-impact-kerberos.md)
- [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
- [Performance benchmark test recommendations for Azure NetApp Files](azure-netapp-files-performance-metrics-volumes.md)
- [Performance benchmarks for Linux](performance-benchmarks-linux.md)
- [Performance impact of Kerberos on NFSv4.1 volumes](performance-impact-kerberos.md)
- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)