<properties
   pageTitle="Azure Backup - Backup of Azure IaaS VMs with encrypted disks | Microsoft Azure"
   description="Learn how Azure Backup handles data encrypted using BitLocker or dmcrypt during IaaS VM backup. This article prepares you for the differences in backup and restore experiences when dealing with encrypted disks."
   services="backup"
   documentationCenter=""
   authors="aashishr"
   manager="shreeshd"
   editor=""/>
<tags
   ms.service="backup"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage-backup-recovery"
   ms.date="11/26/2015"
   ms.author="aashishr"/>

# Dealing with encrypted disks during VM backup

For enterprises looking to encrypt their VM data in Azure, the solution to use is Bitlocker on Windows or dmcrypt on Linux machines. Both of these are volume-level encryption solutions. This article deals with the specifics of setting up backup for such Azure VMs, and the impact on restore workflows because of encrypted data.

## How it works

The overall solution consists of two layers - the VM layer and the Storage layer.

1. The VM layer deals with the data as seen by the guest operating system and the applications running in the virtual machine. It is also the layer that runs the encryption software (Bitlocker or dmcrypt), transparently encrypting data on the volumes before writing it to the disks.
2. The Storage layer deals with the page blobs and the disks attached to the VM. It has no knowledge of the data being written to the disk, and whether it is encrypted or not. This is the layer at which the VM backup functionality operates.

![How Bitlocker encryption and Azure VM backup coexist](./media/backup-azure-vms-encryption/how-it-works.png)

The entire encryption of data happens transparently and seamlessly in the VM layer. Thus the data written to the page blobs attached to the VM is encrypted data. When [Azure Backup takes a snapshot of the VM’s disks and transfers data](backup-azure-vms-introduction.md#how-does-azure-back-up-virtual-machines), it copies the encrypted data present on the page blobs.

## 
