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

This article explains how to either upload a VHD from your local machine to an Azure managed disk or copy a managed disk to another region, using AzCopy. This process, direct upload, also enables you to upload a VHD up to 32 TiB in size directly into a managed disk. Currently, direct upload is supported for standard HDD, standard SSD, and premium SSD managed disks. It isn't supported for ultra disks, yet.

If you're providing a backup solution for IaaS VMs in Azure, we recommend using direct upload to restore customer backups to managed disks. When uploading a VHD from a source external to Azure, speeds would depend on your local bandwidth. When uploading or copying from an Azure VM, then your bandwidth would be the same as standard HDDs.