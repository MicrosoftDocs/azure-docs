---
title: Configure replication for storage spaces direct (S2d) VMs in Azure Site Recovery | Microsoft Docs
description: This article describes how to configure replication for VMs having S2D, from one Azure region to another using Site Recovery.
services: site-recovery
author: asgang
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 01/29/2019
ms.author: asgang

---


# Replicate Azure virtual machines using storage spaces direct to another Azure region

This article describes how to enable replication of Azure VMs running storage spaces direct.

>[!NOTE]
>Only crash consistent points are supported for storage spaces direct clusters.
>

##Introduction 
[Storage spaces direct (S2D)][https://docs.microsoft.com/windows-server/storage/storage-spaces/deploy-storage-spaces-direct] is a software-defined, shared nothing storage. It provides a way to create guest clusters on Azure.  A guest cluster in Microsoft Azure is a Failover Cluster comprised of IaaS VMs. This allows hosted VM workloads to failover across the guest clusters achieving higher availability SLA for applications than a single Azure VM can provide. It is especially usefully in scenarios where VM hosting a critical application that needs to be patched or requires configuration changes.

#Disaster Recovery of Azure Virtual Machines using storage spaces direct

![keyvaultpermissions](./media/azure-to-azure-how-to-enable-replication-ade-vms/keyvaultpermissions.png)

If the user enabling disaster recovery (DR) does not have the required permissions to copy the keys, the below script can be given to the security administrator with appropriate permissions to copy the encryption secrets and keys to the target region.

>[!NOTE]
>To enable replication of ADE VM from portal, you at least need "List" permissions on the key vaults, secrets and keys
>

## Copy ADE keys to DR region using PowerShell Script

1. Open the 'CopyKeys' raw script code in a browser window by clicking on [this link](https://aka.ms/ade-asr-copy-keys-code).
2. Copy the script to a file and name it 'Copy-keys.ps1'.
2. Open the Windows PowerShell application and go to the folder location where the file exists.
3. Launch 'Copy-keys.ps1'
4. Provide the Azure login credentials.
5. Select the **Azure subscription** of your VMs.
6. Wait for the resource groups to load and then select the **resource group** of your VMs.
7. Select the VMs from the list of VMs displayed. Only VMs enabled with Azure disk encryption are shown in the list.
8. Select the **target location**.
9. **Disk encryption key vaults**: By default, Azure Site Recovery creates a new key vault in the target region with name having "asr" suffix based on the source VM disk encryption keys. In case key vault created by Azure Site Recovery already exists, it is reused. You can select a different key vault from the list if necessary.
10. **Key encryption key vaults**: By default, Azure Site Recovery creates a new key vault in the target region with name having "asr" suffix based on the source VM key encryption keys. In case key vault created by Azure Site Recovery already exists, it is reused. You can select a different key vault from the list if necessary.

## Enable replication


## Next steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
