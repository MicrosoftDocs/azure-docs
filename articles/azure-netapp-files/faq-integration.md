---
title: Integration FAQs for Azure NetApp Files 
description: Answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.
ms.service: azure-netapp-files
ms.topic: concept-article
author: b-hchen
ms.author: anfdocs
ms.date: 06/13/2025
ms.custom:
  - build-2025
# Customer intent: As an IT administrator, I want to understand how to integrate Azure NetApp Files with Azure VMware Solution, so that I can effectively expand our cloud storage capabilities and optimize resource utilization.
---
# Integration FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about using other products or services with Azure NetApp Files.  

## Can I use Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Yes, you can use Azure NetApp Files to expand your AVS private cloud storage via [Azure NetApp Files datastores](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md). You can also mount Azure NetApp Files NFS volumes on AVS Windows VMs or Linux VMs. You can map Azure NetApp Files SMB shares on AVS Windows VMs. For more information, see [Azure NetApp Files with Azure VMware Solution]( ../azure-vmware/netapp-files-with-azure-vmware-solution.md). 

## What regions are supported for using Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Using Azure NetApp Files NFS or SMB volumes with AVS for *Guest OS mounts* is supported in [all AVS and Azure NetApp Files enabled regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware,netapp).

## Which Unicode Character Encoding does Azure NetApp Files support for the creation and display of file and directory names?   

For information on Unicode character support, see [Understand volume languages](understand-volume-languages.md) and [Understand path lengths](understand-path-lengths.md).

## Does Azure Databricks support mounting Azure NetApp Files NFS volumes?

No, [Azure Databricks](/azure/databricks/) does not support mounting any NFS volumes including Azure NetApp Files NFS volumes. Contact the Azure Databricks team for more details. 

## Can I use MuleSoft's Azure Storage connector with Azure NetApp Files SMB volumes?

Yes, it is possible to use an Azure NetApp Files SMB volume using MuleSoft's Azure Storage Connector. [View considerations when using MuleSoft with Azure NetApp Files](faq-smb.md#does-azure-netapp-files-have-an-smb-credits-limit) 


## Next steps  

- [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
