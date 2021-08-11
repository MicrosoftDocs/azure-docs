---
title: Attach disk pools to Azure VMware Solution hosts (Preview)
description: Learn how to attach a disk pool surfaced through an iSCSI target as the VMware datastore of an Azure VMware Solution private cloud. Once the datastore is configured, you can create volumes on it and attach them to your VMware instance.
ms.topic: how-to 
ms.date: 07/13/2021

#Customer intent: As an Azure service administrator, I want to scale my AVS hosts using disk pools instead of scaling clusters. So that I can use block storage for active working sets and tier less frequently accessed data from vSAN to disks. I can also replicate data from on-premises or primary VMware environment to disk storage for the secondary site.  

---

# Attach disk pools to Azure VMware Solution hosts (Preview)

[Azure disk pools](../virtual-machines/disks-pools.md) offer persistent block storage to applications and workloads backed by Azure Disks. You can use disks as the persistent storage for Azure VMware Solution for optimal cost and performance. For example, you can scale up by using disk pools instead of scaling clusters if you host storage-intensive workloads. You can also use disks to replicate data from on-premises or primary VMware environments to disk storage for the secondary site. To scale storage independent of the Azure VMware Solution hosts, we support surfacing [ultra disks](../virtual-machines/disks-types.md#ultra-disk) and [premium SSD](../virtual-machines/disks-types.md#premium-ssd) as the datastores.  

>[!IMPORTANT]
>Azure disk pools on Azure VMware Solution (Preview) is currently in public preview.
>This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
>For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure managed disks are attached to one iSCSI controller virtual machine deployed under the Azure VMware Solution resource group. Disks get deployed as storage targets to a disk pool, and each storage target shows as an iSCSI LUN under the iSCSI target. You can expose a disk pool as an iSCSI target connected to Azure VMware Solution hosts as a datastore. A disk pool surfaces as a single endpoint for all underlying disks added as storage targets. Each disk pool can have only one iSCSI controller.

The diagram shows how disk pools work with Azure VMware Solution hosts. Each iSCSI controller accesses managed disk using a standard Azure protocol, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI.


:::image type="content" source="media/disk-pools/azure-disks-attached-to-managed-iscsi-controllers.png" alt-text="Diagram showing how disk pools work with Azure VMware Solution hosts." border="false":::


## Supported regions

You can only connect the disk pool to an Azure VMware Solution private cloud in the same region. For a list of supported regions, see [Regional availability](../virtual-machines/disks-pools.md#regional-availability).  If your private cloud is deployed in a non-supported region, you can redeploy it in a supported region. Azure VMware Solution private cloud and disk pool colocation provide the best performance with minimal network latency.


## Prerequisites

- Scalability and performance requirements of your workloads are identified. For details, see [Planning for Azure disk pools](../virtual-machines/disks-pools-planning.md).

- [Azure VMware Solution private cloud](deploy-azure-vmware-solution.md) deployed with a [virtual network configured](deploy-azure-vmware-solution.md#connect-to-azure-virtual-network-with-expressroute). For more information, see [Network planning checklist](tutorial-network-checklist.md) and [Configure networking for your VMware private cloud](tutorial-configure-networking.md). 

   - If you select ultra disks, use Ultra Performance for the Azure VMware Solution private cloud and then [enable ExpressRoute FastPath](../expressroute/expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).

   - If you select premium SSDs, use Standard (1 Gbps) for the Azure VMware Solution private cloud.  You must use Standard\_DS##\_v3 to host iSCSI.  If you encounter quota issues, request an increase in [vCPU quota limits](../azure-portal/supportability/per-vm-quota-requests.md) per Azure VM series for Dsv3 series.

- Disk pool as the backing storage deployed and exposed as an iSCSI target with each disk as an individual LUN. For details, see [Deploy an Azure disk pool](../virtual-machines/disks-pools-deploy.md).

   >[!IMPORTANT]
   > The disk pool must be deployed in the same subscription as the VMware cluster, and it must be attached to the same VNET as the VMware cluster.

## Attach a disk pool to your private cloud
You'll attach to a disk pool surfaced through an iSCSI target as the VMware datastore of an Azure VMware Solution private cloud.

>[!IMPORTANT]
>While in **Public Preview**, only attach a disk pool to a test or non-production cluster.

1. Check if the subscription is registered to `Microsoft.AVS`:

   ```azurecli
   az provider show -n "Microsoft.AVS" --query registrationState
   ```

   If it's not already registered, then register it:

   ```azurecli
   az provider register -n "Microsoft.AVS"
   ```

1. Check if the subscription is registered to `CloudSanExperience` AFEC in Microsoft.AVS:

   ```azurecli
   az feature show --name "CloudSanExperience" --namespace "Microsoft.AVS"
   ```

   - If it's not already registered, then register it:

      ```azurecli
      az feature register --name "CloudSanExperience" --namespace "Microsoft.AVS"
      ```

      The registration may take approximately 15 minutes to complete and you can check the current status it:
      
      ```azurecli
      az feature show --name "CloudSanExperience" --namespace "Microsoft.AVS" --query properties.state
      ```

      >[!TIP]
      >If the registration is stuck in an intermediate state for longer than 15 minutes to complete, unregister and then re-register the flag:
      >
      >```azurecli
      >az feature unregister --name "CloudSanExperience" --namespace "Microsoft.AVS"
      >az feature register --name "CloudSanExperience" --namespace "Microsoft.AVS"
      >```

1. Check if the `vmware `extension is installed: 

   ```azurecli
   az extension show --name vmware
   ```

   - If the extension is already installed, check if the version is **3.0.0**. If an older version is installed, update the extension:

      ```azurecli
      az extension update --name vmware
      ```

   - If it's not already installed, install it:

      ```azurecli
      az extension add --name vmware
      ```

3. Create and attach an iSCSI datastore in the Azure VMware Solution private cloud cluster using `Microsoft.StoragePool` provided iSCSI target:

   ```azurecli
   az vmware datastore disk-pool-volume create --name iSCSIDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud --target-id /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/ResourceGroup1/providers/Microsoft.StoragePool/diskPools/mpio-diskpool/iscsiTargets/mpio-iscsi-target --lun-name lun0
   ```

   >[!TIP]
   >You can display the help on the datastores:
   >
   >   ```azurecli
   >   az vmware datastore -h
   >   ```
   

4. Show the details of an iSCSI datastore in a private cloud cluster:
   
   ```azurecli
   az vmware datastore show --name MyCloudSANDatastore1 --resource-group MyResourceGroup --cluster -Cluster-1 --private-cloud MyPrivateCloud
   ```

5. List all the datastores in a private cloud cluster:

   ```azurecli
   az vmware datastore list --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud
   ```

## Delete an iSCSI datastore from your private cloud

When you delete a private cloud datastore, the disk pool resources don't get deleted. There's no maintenance window required for this operation.

1. Power off the VMs and remove all objects associated with the iSCSI datastores, which includes:

   - VMs (remove from inventory)

   - Templates

   - Snapshots

2. Delete the private cloud datastore:

   ```azurecli
   az vmware datastore delete --name MyCloudSANDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud
   ```

## Next steps

Now that you've attached a disk pool to your Azure VMware Solution hosts, you may want to learn about:

- [Managing an Azure disk pool](../virtual-machines/disks-pools-manage.md ).  Once you've deployed a disk pool, there are various management actions available to you. You can add or remove a disk to or from a disk pool, update iSCSI LUN mapping, or add ACLs.

- [Deleting a disk pool](../virtual-machines/disks-pools-deprovision.md#delete-a-disk-pool). When you delete a disk pool, all the resources in the managed resource group are also deleted.

- [Disabling iSCSI support on a disk](../virtual-machines/disks-pools-deprovision.md#disable-iscsi-support). If you disable iSCSI support on a disk pool, you effectively can no longer use a disk pool.

- [Moving disk pools to a different subscription](../virtual-machines/disks-pools-move-resource.md). Move an Azure disk pool to a different subscription, which involves moving the disk pool itself, contained disks, managed resource group, and all the resources. 

- [Troubleshooting disk pools](../virtual-machines/disks-pools-troubleshoot.md). Review the common failure codes related to Azure disk pools (preview). It also provides possible resolutions and some clarity on disk pool statuses.
