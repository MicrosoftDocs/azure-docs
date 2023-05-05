---
title: Integration FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 02/13/2023
---
# Integration FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.  

## Can I use Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Yes, Azure NetApp Files can be used to expand your AVS private cloud storage via [Azure NetApp Files datastores](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md). In addition, you can mount Azure NetApp Files NFS volumes on AVS Windows VMs or Linux VMs. You can map Azure NetApp Files SMB shares on AVS Windows VMs. For more information, see [Azure NetApp Files with Azure VMware Solution]( ../azure-vmware/netapp-files-with-azure-vmware-solution.md). 

## What regions are supported for using Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Using Azure NetApp Files NFS or SMB volumes with AVS for *Guest OS mounts* is supported in [all AVS and ANF enabled regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware,netapp).

## Which Unicode Character Encoding is supported by Azure NetApp Files for the creation and display of file and directory names?   

Azure NetApp Files only supports file and directory names that are encoded with the [UTF-8 Unicode Character Encoding](https://en.wikipedia.org/wiki/UTF-8), *C locale* (or _C.UTF-8_) format for both NFS and SMB volumes. As such only strict ASCII characters are valid.

If you try to create files or directories with names that use supplementary characters or surrogate pairs such as non-regular characters and emoji that are not supported by C.UTF-8, the operation will fail. In this case, an error from a Windows client might read “The file name you specified is not valid or too long. Specify a different file name.” 

## Next steps  

- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
