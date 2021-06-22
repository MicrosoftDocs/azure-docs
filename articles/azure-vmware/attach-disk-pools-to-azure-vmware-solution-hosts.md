---
title: Attach disk pools to Azure VMware Solution hosts
description: Learn how to attach a disk pool surfaced through an iSCSI target as the VMware datastore of an Azure VMware Solution private cloud. 
ms.topic: how-to 
ms.date: 06/28/2021

#Customer intent: As an Azure service administrator, I want to scale my AVS hosts using disk pools instead of scaling clusters. So that I can use block storage for active working sets and tier less frequently accessed data from vSAN to disks. I can also replicate data from on-premises or primary VMware environment to disk storage for the secondary site.   

---

# Attach disk pools to Azure VMware Solution hosts

[Azure disk pools](../virtual-machines/disks-pools.md) offer persistent block storage to applications and workloads backed by Azure Disks. You can use disks as the persistent storage for Azure VMWare Solution for optimal cost and performance. For example, you can scale up by using disk pools instead of scaling clusters if you host storage-intensive workloads. You can also use disks to replicate data from on-premises or primary VMware environment to disk storage for the secondary site.

Azure Disks are attached to the managed iSCSI controller, a virtual machine deployed under the managed resource group. Disks get deployed as storage targets to a disk pool, and each storage target shows as an iSCSI LUN under the iSCSI target. You can expose a disk pool as an iSCSI target connected to Azure VMware Solution hosts as a datastore. A disk pool surfaces as a single endpoint for all underlying disks added as storage targets. Each disk pool can have only one iSCSI controller.

>[!TIP]
>To scale storage independent of the Azure VMware Solution hosts, we support surfacing Premium Disks](/azure/virtual-machines/disks-types#premium-ssd) as the datastores.

The diagram shows how disk pools work with Azure VMware Solution hosts. Each iSCSI controller can access each managed disk over iSCSI, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI.


:::image type="content" source="media/disk-pools/azure-disks-attached-to-managed-iscsi-controllers.png" alt-text="Diagram showing how disk pools work with Azure VMware Solution hosts. Each iSCSI controller can access each managed disk over iSCSI, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI." border="false":::


## Supported regions

You can only connect the disk pool to an Azure VMware Solution private cloud in the same region. For a list of supported regions, see [Regional availability](/azure/virtual-machines/disks-pools#regional-availability).  If your private cloud is deployed in a non-supported region, you can redeploy it in a supported region. Azure VMware Solution private cloud and disk pool colocation provide the best performance with minimal network latency.


## Prerequisites

- Scalability and performance requirements of your workloads identified. For details, see [Planning for Azure disk pools](../virtual-machines/disks-pools-planning.md).

- [Azure VMware Solution private cloud](deploy-azure-vmware-solution.md) deployed with a [virtual network configured](deploy-azure-vmware-solution.md#step-3-connect-to-azure-virtual-network-with-expressroute). For more information, see [Network planning checklist](tutorial-network-checklist.md) and [Configure networking for your VMware private cloud](tutorial-configure-networking.md). 

   - If you select Ultra Disks, use either the Ultra Performance or ErGw3AZ (10 Gbps) SKU for the Azure VMware Solution private cloud and then [enable ExpressRoute FastPath](/azure/expressroute/expressroute-howto-linkvnet-arm#configure-expressroute-fastpath).

   - If you select Premium SSD-Managed Disks, use either the Standard (1 Gbps) or High Performance (2 Gbps) SKU for the Azure VMware Solution private cloud.

- Disk pool as the backing storage deployed and exposed as an iSCSI target with each disk as an individual LUN. For details, see [Deploy an Azure disk pool](../virtual-machines/disks-pools-deploy.md).

   >[!IMPORTANT]
   > The disk pool must be deployed in the same subscription as the VMware cluster, and it must be attached to the same VNET as the VMware cluster.

## Attach a disk pool to your private cloud
You'll attach a disk pool surfaced through an iSCSI target as the VMware datastore of an Azure VMware Solution private cloud.

1. Install `vmware `extension.

   - Check if the extension is installed: 

      ```azurecli
      az extension show --name vmware
      ```

   - If the extension is not installed:

      ```azurecli
      az extension add --name vmware
      ```

   - If the extension is already installed, check if the version is "3.0.0" (yet to be released). If an older version is installed, update the extension:

      ```azurecli
      az extension update --name vmware
      ```

2. Display help on the datastores cmdlets:

   ```azurecli
   az vmware datastore -h
   ```

3. Create and attach an iSCSI datastore in the Azure VMware Solution private cloud cluster using Microsoft.StoragePool provided iSCSI target.

   ```azurecli
   az vmware datastore disk-pool-volume create --name iSCSIDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud --target-id /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/ResourceGroup1/providers/Microsoft.StoragePool/diskPools/mpio-diskpool/iscsiTargets/mpio-iscsi-target --lun-name lun0
   ```

4. Show the details of an iSCSI datastore in a private cloud cluster.
   
   ```azurecli
   az vmware datastore show --name MyCloudSANDatastore1 --resource-group MyResourceGroup --cluster -Cluster-1 --private-cloud MyPrivateCloud
   ```

5. List all the datastores in a private cloud cluster.

   ```azurecli
   az vmware datastore list --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud
   ```

## Delete an iSCSI datastore from your private cloud
When you delete a private cloud datastore, the disk pool resources don't get deleted. There is no maintenance window required for this operation.

1. Power off the VMs and remove all objects associated with the iSCSI datastores, which include:
   - VMs (remove from inventory)
   - Templates
   - Snapshots

2. Delete the private cloud datastore.

   ```azurecli
   az vmware datastore delete --name MyCloudSANDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud
   ```


## Next steps

Now that you've attached a disk pool to your Azure VMware Solution hosts, you may want to learn about:

- [Managing an Azure disk pool](../virtual-machines/disks-pools-manage.md ).  Once you've deployed a disk pool, there are various management actions available to you. You can add or remove a disk to or from a disk pool, Update iSCSI LUN mapping, or add ACLs (Only applicable if ACL mode is set to Static).

- [Deleting a disk pool](/azure/virtual-machines/disks-pools-deprovision#delete-a-disk-pool). When you delete a disk pool, all the resources in the managed resource group are also deleted.

- [Disabling iSCSI support on a disk](/azure/virtual-machines/disks-pools-deprovision#disable-iscsi-support). If you disable iSCSI support on a disk pool, you effectively can no longer use a disk pool.

- [Moving disk pools to a different subscription](/azure/virtual-machines/disks-pools-move-resource). Moving a disk pool involves moving the disk pool itself, the disks contained in the disk pool, the disk pool's managed resource group, and all the resources contained in the managed resource group.

