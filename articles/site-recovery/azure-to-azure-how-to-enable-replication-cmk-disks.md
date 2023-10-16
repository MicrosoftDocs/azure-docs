---
title: Enable replication of encrypted Azure VMs in Azure Site Recovery
description: This article describes how to configure replication for VMs with customer-managed key (CMK) enabled disks from one Azure region to another by using Site Recovery.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 10/09/2023
ms.author: ankitadutta

---

# Replicate machines with Customer-Managed Keys (CMK) enabled disks

This article describes how to replicate Azure VMs with Customer-Managed Keys (CMK) enabled managed disks, from one Azure region to another.

## Prerequisite
You must create the Disk Encryption set(s) in the target region for the target subscription before enabling replication for your virtual machines that have CMK-enabled managed disks.

## Enable replication

Use the following procedure to replicate machines with Customer-Managed Keys (CMK) enabled disks. 
As an example, the primary Azure region is East Asia, and the secondary region is South East Asia.

1. In the vault > **Site Recovery** page, under **Azure virtual machines**, select **Enable replication**.
1. In the **Enable replication** page, under **Source**, do the following:
   - **Region**: Select the Azure region from where you want to protect your VMs. 
   For example, the source location is *East Asia*.
   - **Subscription**: Select the subscription to which your source VMs belong. This can be any subscription within the same Microsoft Entra tenant where your recovery services vault exists.
   - **Resource group**: Select the resource group to which your source virtual machines belong. All the VMs in the selected resource group are listed for protection in the next step.
   - **Virtual machine deployment model**: Select Azure deployment model of the source machines.
   - **Disaster recovery between availability zones**: Select **Yes** if you want to perform zonal disaster recovery on virtual machines.

     :::image type="fields needed to configure replication" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/source.png" alt-text="Screenshot that highlights the fields needed to configure replication.":::
1. Select **Next**.
1. In **Virtual machines**, select each VM that you want to replicate. You can only select machines for which replication can be enabled. You can select up to ten VMs. Then select **Next**.

   :::image type="Virtual machine selection" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/virtual-machine-selection.png" alt-text="Screenshot that highlights where you select virtual machines.":::

1. In **Replication settings**, you can configure the following settings:
    1. Under **Location and Resource group**,
       - **Target location**: Select the location where your source virtual machine data must be replicated. Depending on the location of selected machines, Site Recovery will provide you the list of suitable target regions. We recommend that you keep the target location the same as the Recovery Services vault location.
       - **Target subscription**: Select the target subscription used for disaster recovery. By default, the target subscription will be same as the source subscription.
       - **Target resource group**: Select the resource group to which all your replicated virtual machines belong.
           - By default, Site Recovery creates a new resource group in the target region with an *asr* suffix in the name.
           - If the resource group created by Site Recovery already exists, it's reused.
           - You can customize the resource group settings.
           - The location of the target resource group can be any Azure region, except the region in which the source VMs are hosted.
           
            >[!Note]
            > You can also create a new target resource group by selecting **Create new**. 
        
         :::image type="Location and resource group" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/resource-group.png" alt-text="Screenshot of Location and resource group."::: 

    1. Under **Network**,
       - **Failover virtual network**: Select the failover virtual network.
         >[!Note]
         > You can also create a new failover virtual network by selecting **Create new**.
       - **Failover subnet**: Select the failover subnet.
       
         :::image type="Network" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/network.png" alt-text="Screenshot of Network."::: 

    1. **Storage**: Select **View/edit storage configuration**. **Customize target settings** page opens.
    
         :::image type="Storage" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/storage.png" alt-text="Screenshot of Storage."::: 
  
       - **Replica-managed disk**: Site Recovery creates new replica-managed disks in the target region to mirror the source VM's managed disks with the same storage type (Standard or premium) as the source VM's managed disk.
       - **Cache storage**: Site Recovery needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating them to the target location. This storage account should be Standard. 
         
    1. **Availability options**: Select appropriate availability option for your VM in the target region. If an availability set that was created by Site Recovery already exists, it's reused. Select **View/edit availability options** to view or edit the availability options.
        >[!NOTE]
        >- While configuring the target availability sets, configure different availability sets for differently sized VMs.
        >- You cannot change the availability type - single instance, availability set or availability zone, after you enable replication. You must disable and enable replication to change the availability type.  

         :::image type="Availability option" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/availability-option.png" alt-text="Screenshot of availability option."::: 
   
    1. **Capacity reservation**: Capacity Reservation lets you purchase capacity in the recovery region, and then failover to that capacity. You can either create a new Capacity Reservation Group or use an existing one. For more information, see [how capacity reservation works](../virtual-machines/capacity-reservation-overview.md).
    Select **View or Edit Capacity Reservation group assignment** to modify the capacity reservation settings. On triggering Failover, the new VM will be created in the assigned Capacity Reservation Group.
    
         :::image type="Capacity reservation" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/capacity-reservation.png" alt-text="Screenshot of capacity reservation.":::

    1. **Storage encryption settings**: Site Recovery needs the disk encryption set(s)(DES) to be used for replica and target managed disks. You must pre-create Disk encryption sets in the target subscription and the target region before enabling the replication. By default, a Disk encryption set is not selected. You must select **View/edit configuration** to choose a Disk encryption set per source disk.
       
       >[!Note]
       >Ensure that the Target DES is present in the Target Resource Group, and that the Target DES has Get, Wrap Key, Unwrap Key access to a Key Vault in the same region.
    
        :::image type="Storage encryption settings" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/storage-encryption-settings.png" alt-text="Screenshot of storage encryption settings.":::

1. Select **Next**.
1. In **Manage**, do the following:
    1. Under **Replication policy**,
       - **Replication policy**: Select the replication policy. Defines the settings for recovery point retention history and app-consistent snapshot frequency. By default, Site Recovery creates a new replication policy with default settings of 24 hours for recovery point retention.
       - **Replication group**: Create replication group to replicate VMs together to generate Multi-VM consistent recovery points. Note that enabling multi-VM consistency can impact workload performance and should only be used if machines are running the same workload and you need consistency across multiple machines.
    1. Under **Extension settings**, 
       - Select **Update settings** and **Automation account**.
   
   :::image type="manage" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/manage.png" alt-text="Screenshot that displays the manage tab.":::

1. Select **Next**
1. In **Review**, review the VM settings and select **Enable replication**.

   :::image type="review" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/review.png" alt-text="Screenshot that displays the review tab.":::

>[!NOTE]
>During initial replication, the status might take some time to refresh, without apparent progress. Click **Refresh**  to get the latest status.

## FAQs

* **I have enabled CMK on an existing replicated item, how can I ensure that CMK is applied on the target region as well?**

    You can find out the name of the replica managed disk (created by Azure Site Recovery in the target region) and attach DES to this replica disk. However, you will not be able to see the DES details in the Disks blade once you attach it. Alternatively, you can choose to disable the replication of the VM and enable it again. It will ensure you see DES and key vault details in the Disks blade for the replicated item.

* **I have added a new CMK enabled disk to the replicated item. How can I replicate this disk with Azure Site Recovery?**

    You can add a new CMK enabled disk to an existing replicated item using PowerShell. Find the code snippet for guidance:
   
     ```powershell
     #set vaultname and resource group name for the vault.
     $vaultname="RSVNAME"
     $vaultrgname="RSVRGNAME"

     #set VMName
     $VMName = "VMNAME"

     #get the vault object
     $vault = Get-AzRecoveryServicesVault -Name $vaultname -ResourceGroupName $vaultrgname

     #set job context to this vault
     $vault | Set-AzRecoveryServicesAsrVaultContext

     =============

     #set resource id of disk encryption set
     $diskencryptionset = "RESOURCEIDOFTHEDISKENCRYPTIONSET"

     #set resource id of cache storage account
     $primaryStorageAccount = "RESOURCEIDOFCACHESTORAGEACCOUNT"

     #set resource id of recovery resource group
     $RecoveryResourceGroup = "RESOURCEIDOFRG"
     
     #set resource id of disk to be replicated
     $dataDisk =  "RESOURCEIDOFTHEDISKTOBEREPLICATED"

     #setdiskconfig
     $diskconfig = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig `
               -ManagedDisk `
               -DiskId $dataDisk `
               -LogStorageAccountId $primaryStorageAccount `
               -RecoveryResourceGroupId $RecoveryResourceGroup `
               -RecoveryReplicaDiskAccountType Standard_LRS `
               -RecoveryTargetDiskAccountType Standard_LRS `
               -RecoveryDiskEncryptionSetId $diskencryptionset

    
     #get fabric object from the source region.
     $fabric = Get-AzRecoveryServicesAsrFabric
     #use to fabric name to get the container.
     $primaryContainerName =Get-AzRecoveryServicesAsrProtectionContainer -Fabric $fabric[1]

     #get the context of the protected item
     $protectedItemObject = Get-AsrReplicationProtectedItem -ProtectionContainer $primaryContainerName | where { $_.FriendlyName -eq $VMName };$protectedItemObject

     #initiate enable replication using below command
     $protectedItemObject |Add-AzRecoveryServicesAsrReplicationProtectedItemDisk -AzureToAzureDiskReplicationConfiguration $diskconfig
     ```


* **I have enabled both platform and customer managed keys, how can I protect my disks?**

    Enabling double encryption with both platform and customer managed keys is supported by Site Recovery. Follow the instructions in this article to protect your machine. You need to create a double encryption enabled DES in the target region in advance. At the time of enabling the replication for such a VM, you can provide this DES to Site Recovery.
