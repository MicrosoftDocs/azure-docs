---
title: Attach Azure NetApp Files to Azure VMware Solution VMs
description: Use Azure NetApp Files with Azure VMware Solution VMs to migrate and sync data across on-premises servers, Azure VMware Solution VMs, and cloud infrastructures. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 05/10/2022
---

# Attach Azure NetApp Files to Azure VMware Solution VMs

[Azure NetApp Files](../azure-netapp-files/azure-netapp-files-introduction.md) is an Azure service for migration and running the most demanding enterprise file-workloads in the cloud: databases, SAP, and high-performance computing applications, with no code changes. In this article, you'll set up, test, and verify the Azure NetApp Files volume as a file share for Azure VMware Solution workloads using the Network File System (NFS) protocol. The guest operating system runs inside virtual machines (VMs) accessing Azure NetApp Files volumes. 

Azure NetApp Files and Azure VMware Solution are created in the same Azure region. Azure NetApp Files is available in many [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp,azure-vmware&regions=all) and supports cross-region replication. For information on Azure NetApp Files configuration methods, see [Storage hierarchy of Azure NetApp Files](../azure-netapp-files/azure-netapp-files-understand-storage-hierarchy.md).

Services where Azure NetApp Files are used:

- **Active Directory connections**: Azure NetApp Files supports [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](../azure-netapp-files/understand-guidelines-active-directory-domain-service-site.md).

- **Share Protocol**: Azure NetApp Files supports Server Message Block (SMB) and Network File System (NFS) protocols. This support means the volumes can be mounted on the Linux client and can be mapped on Windows client.

- **Azure VMware Solution**: Azure NetApp Files shares can be mounted from VMs that are created in the Azure VMware Solution environment.


The diagram shows a connection through Azure ExpressRoute to an Azure VMware Solution private cloud. The Azure VMware Solution environment accesses the Azure NetApp Files share mounted on Azure VMware Solution VMs.

:::image type="content" source="media/netapp-files/netapp-files-topology.png" alt-text="Diagram showing NetApp Files for Azure VMware Solution architecture." border="false":::


## Prerequisites 

> [!div class="checklist"]
> * Azure subscription with Azure NetApp Files enabled
> * Subnet for Azure NetApp Files
> * Linux VM on Azure VMware Solution
> * Windows VMs on Azure VMware Solution


## Create and mount Azure NetApp Files volumes

You'll create and mount Azure NetApp Files volumes onto Azure VMware Solution VMs.

1. [Create a NetApp account](../azure-netapp-files/azure-netapp-files-create-netapp-account.md).

1. [Set up a capacity pool](../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md).

1. [Create an SMB volume for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-create-volumes-smb.md).

1. [Create an NFS volume for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-create-volumes.md).

1. [Delegate a subnet to Azure NetApp Files](../azure-netapp-files/azure-netapp-files-delegate-subnet.md).


## Verify pre-configured Azure NetApp Files 

You'll verify the pre-configured Azure NetApp Files created in Azure on Azure NetApp Files Premium service level.

1. In the Azure portal, under **STORAGE**, select **Azure NetApp Files**. A list of your configured Azure NetApp Files will show. 

   :::image type="content" source="media/netapp-files/azure-netapp-files-list.png" alt-text="Screenshot showing list of pre-configured Azure NetApp Files."::: 

2. Select a configured NetApp Files account to view its settings. For example, select **Contoso-anf2**. 

3. Select **Capacity pools** to verify the configured pool. 

   :::image type="content" source="media/netapp-files/netapp-settings.png" alt-text="Screenshot showing options to view capacity pools and volumes of a configured NetApp Files account.":::

   The Capacity pools page opens showing the capacity and service level. In this example, the storage pool is configured as 4 TiB with a Premium service level.

4. Select **Volumes** to view volumes created under the capacity pool. (See preceding screenshot.)

5. Select a volume to view its configuration.  

   :::image type="content" source="media/netapp-files/azure-netapp-volumes.png" alt-text="Screenshot showing volumes created under the capacity pool.":::

   A window opens showing the configuration details of the volume.

   :::image type="content" source="media/netapp-files/configuration-of-volume.png" alt-text="Screenshot showing configuration details of a volume.":::

   You can see that anfvolume has a size of 200 GiB and is in capacity pool anfpool1. It's exported as an NFS file share via 10.22.3.4:/ANFVOLUME. One private IP from the Azure Virtual Network (VNet) was created for Azure NetApp Files and the NFS path to mount on the VM.

   To learn about Azure NetApp Files volume performance by size or "Quota," see [Performance considerations for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-performance-considerations.md). 

## Verify pre-configured Azure VMware Solution VM share mapping

To make your Azure NetApp Files share accessible to your Azure VMware Solution VM, you'll need to understand SMB and NFS share mapping. Only after configuring the SMB or NFS volumes, can you mount them as documented here.

- **SMB share:** Create an Active Directory connection before deploying an SMB volume. The specified domain controllers must be accessible by the delegated subnet of Azure NetApp Files for a successful connection. Once the Active Directory is configured within the Azure NetApp Files account, it will appear as a selectable item while creating SMB volumes.

- **NFS share:** Azure NetApp Files contributes to creating the volumes using NFS or dual protocol (NFS and SMB). A volume's capacity consumption counts against its pool's provisioned capacity. NFS can be mounted to the Linux server by using the command lines or /etc/fstab entries.

## Next steps

Now that you've covered integrating Azure NetApp Files with your Azure VMware Solution workloads, you may want to learn about:

- [Resource limitations for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-resource-limits.md#resource-limits)
- [Guidelines for Azure NetApp Files network planning](../azure-netapp-files/azure-netapp-files-network-topologies.md)
- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md) 
- [Azure NetApp Files NFS FAQs](../azure-netapp-files/faq-nfs.md)
- [Azure NetApp Files SMB FAQs](../azure-netapp-files/faq-smb.md)
