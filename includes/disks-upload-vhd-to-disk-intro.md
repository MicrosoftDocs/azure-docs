---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/27/2020
 ms.author: rogarana
 ms.custom: include file
---

This article explains how to upload a VHD from your local machine to an Azure managed disk. Previously, you had to follow an involved process that included staging your data in a storage account and managing that storage account. Now, all you need to do is create an empty managed disk and upload a VHD directly to it. This simplifies uploading on-premises VMs to Azure and enables you to upload a VHD up to 32 TiB directly into a large managed disk or easily copy your managed disks across regions.

If you are providing a backup solution for IaaS VMs in Azure, we recommend using direct upload to restore customer backups to managed disks. If you are uploading a VHD from a machine external to Azure, speeds will depend on your local bandwidth. If you are using an Azure VM, then your bandwidth will be the same as standard HDDs.

Currently, direct upload is supported for standard HDD, standard SSD, and premium SSD managed disks. It is not yet supported for ultra disks.