---
title: Integration FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 10/11/2021
---
# Integration FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.  

## Can I use Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

You can mount Azure NetApp Files NFS volumes on AVS Windows VMs or Linux VMs. You can map Azure NetApp Files SMB shares on AVS Windows VMs. For more information, see [Azure NetApp Files with Azure VMware Solution]( ../azure-vmware/netapp-files-with-azure-vmware-solution.md).  

## What regions are supported for using Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Using Azure NetApp Files NFS or SMB volumes with AVS for *Guest OS mounts* is supported in [all AVS and ANF enabled regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware,netapp).

## Does Azure NetApp Files work with Azure Policy?

Yes. Azure NetApp Files is a first-party service. It fully adheres to Azure Resource Provider standards. As such, Azure NetApp Files can be integrated into Azure Policy via *custom policy definitions*. For information about how to implement custom policies for Azure NetApp Files, see 
[Azure Policy now available for Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure/azure-policy-now-available-for-azure-netapp-files/m-p/2282258) on Microsoft Tech Community. 

## Which Unicode Character Encoding is supported by Azure NetApp Files for the creation and display of file and directory names?   

Azure NetApp Files only supports file and directory names that are encoded with the UTF-8 Unicode Character Encoding format for both NFS and SMB volumes.

If you try to create files or directories with names that use supplementary characters or surrogate pairs such as non-regular characters and emoji that are not supported by UTF-8, the operation will fail. In this case, an error from a Windows client might read “The file name you specified is not valid or too long. Specify a different file name.” 

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
