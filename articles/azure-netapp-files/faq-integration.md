---
title: Integration FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.
ms.service: azure-netapp-files
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 02/13/2023
---
# Integration FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.  

## Can I use Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Yes, you can use Azure NetApp Files to expand your AVS private cloud storage via [Azure NetApp Files datastores](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md). You can also mount Azure NetApp Files NFS volumes on AVS Windows VMs or Linux VMs. You can map Azure NetApp Files SMB shares on AVS Windows VMs. For more information, see [Azure NetApp Files with Azure VMware Solution]( ../azure-vmware/netapp-files-with-azure-vmware-solution.md). 

## What regions are supported for using Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Using Azure NetApp Files NFS or SMB volumes with AVS for *Guest OS mounts* is supported in [all AVS and Azure NetApp Files enabled regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware,netapp).

## Which Unicode Character Encoding does Azure NetApp Files support for the creation and display of file and directory names?   

Azure NetApp Files only supports file and directory names that are encoded with the [UTF-8 Unicode Character Encoding](https://en.wikipedia.org/wiki/UTF-8), *C locale* (or _C.UTF-8_) format for both NFS and SMB volumes. Only strict ASCII characters are valid.

If you try to create files or directories using supplementary characters or surrogate pairs such as nonregular characters or emoji unsupported by C.UTF-8, the operation fails. A Windows client produces an error message similar to “The file name you specified is not valid or too long. Specify a different file name.” 

For more information, see [Understand volume languages](understand-volume-languages.md).

## Does Azure Databricks support mounting Azure NetApp Files NFS volumes?

No, [Azure Databricks](/azure/databricks/) does not support mounting any NFS volumes including Azure NetApp Files NFS volumes. Contact the Azure Databricks team for more details. 


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
