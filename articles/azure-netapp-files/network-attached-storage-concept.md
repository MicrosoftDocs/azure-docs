---
title: Understand NAS concepts in Azure NetApp Files | Microsoft Docs
description: This article covers important information about NAS volumes when using Azure NetApp Files.  
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 06/26/2023
ms.author: anfdocs
---
# Understand NAS concepts in Azure NetApp Files 

Network Attached Storage (NAS) is a way for a centralized storage system to present data to multiple networked clients across a WAN or LAN.  

:::image type="content" source="../media/azure-netapp-files/nas-diagram.png" alt-text="Diagram of NAS protocols with Azure NetApp Files." lightbox="../media/azure-netapp-files/nas-diagram.png":::

Datasets in a NAS environment can be structured (data in a well-defined format, such as databases) or unstructured (data not stored in a structured database format, such as images, media files, logs, home directories, etc.). Regardless of the structure, the data is served through a standard conversation between a NAS client and the Azure NetApp Files NAS services. The conversation happens following these basic steps:

1. A client requests access to a NAS share in Azure NetApp Files using either SMB or NFS.
1. Access controls can be as basic as a client hostname/IP address or more complex, such as username authentication and share-level permissions.
1. Azure NetApp Files receives this request and checks the access controls to verify if the client is allowed to access the NAS share.
1. Once the share-level access has been verified successfully, the client attempts to populate the NAS share’s contents via a basic read/listing.
1. Azure NetApp Files then checks file-level permissions. If the user attempting access to the share does not have the proper permissions, then access is denied--even if the share-level permissions allowed access. 
1. Once this process is complete, file and folder access controls take over in the same way you’d expect for any Linux or Windows client. 
1. Azure NetApp Files configuration handles share permission controls. File and folder permissions are always controlled from the NAS clients accessing the shares by the NAS administrator. 

## NAS use cases 

NAS is a common protocol across many industries, including oil & gas, high performance computing, media and entertainment, EDA, financial services, healthcare, genomics, manufacturing, higher education, and many others. Workloads can vary from simple file shares and home directories to applications with thousands of cores pushing operations to a single share, as well as more modernized application stacks, such as Kubernetes and container deployments. 

To learn more about use cases and workloads, see [Solution architectures using Azure NetApp Files](azure-netapp-files-solution-architectures.md).

## Next steps 
* [Understand NAS protocols](network-attached-storage-protocols.md)
* [Azure NetApp Files NFS FAQ](faq-nfs.md)
* [Azure NetApp Files SMB FAQ](faq-smb.md)
