---
title: Attach Azure disk pools to Azure VMware Solution hosts 
description: Learn how to attach an Azure disk pool surfaced through an iSCSI target as the VMware vSphere datastore of an Azure VMware Solution private cloud. Once the datastore is configured, you can create volumes on it and consume them from your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/02/2021
#Customer intent: As an Azure service administrator, I want to scale my AVS hosts using disk pools instead of scaling clusters. So that I can use block storage for active working sets and tier less frequently accessed data from vSAN to disks. I can also replicate data from on-premises or primary VMware vSphere environment to disk storage for the secondary site.
ms.custom: ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Attach disk pools to Azure VMware Solution hosts 

[Azure disk pools](../virtual-machines/disks-pools.md) offer persistent block storage to applications and workloads backed by Azure Disks. You can use disks as the persistent storage for Azure VMware Solution for optimal cost and performance. For example, you can scale up by using disk pools instead of scaling clusters if you host storage-intensive workloads. You can also use disks to replicate data from on-premises or primary VMware vSphere environments to disk storage for the secondary site. To scale storage independent of the Azure VMware Solution hosts, we support surfacing [ultra disks](../virtual-machines/disks-types.md#ultra-disks), [premium SSD](../virtual-machines/disks-types.md#premium-ssds) and [standard SSD](../virtual-machines/disks-types.md#standard-ssds) as the datastores.  

>[!IMPORTANT]
>We are officially halting the preview of Azure Disk Pools, and it will not be made generally available.
>New customers will not be able to register the `Microsoft.StoragePool` resource provider on their subscription and deploy new Disk Pools.
> Existing subscriptions registered with Microsoft.StoragePool may continue to deploy and manage disk pools for the time being.

Azure managed disks are attached to one iSCSI controller virtual machine deployed under the Azure VMware Solution resource group. Disks get deployed as storage targets to a disk pool, and each storage target shows as an iSCSI LUN under the iSCSI target. You can expose a disk pool as an iSCSI target connected to Azure VMware Solution hosts as a datastore. A disk pool surfaces as a single endpoint for all underlying disks added as storage targets. Each disk pool can have only one iSCSI controller.

The diagram shows how disk pools work with Azure VMware Solution hosts. Each iSCSI controller accesses managed disk using a standard Azure protocol, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI.


:::image type="content" source="media/disk-pools/azure-disks-attached-to-managed-iscsi-controllers.png" alt-text="Diagram showing how disk pools work with Azure VMware Solution hosts." border="false":::


## Supported regions

You can only connect the disk pool to an Azure VMware Solution private cloud in the same region. For a list of supported regions, see [Regional availability](../virtual-machines/disks-pools.md#regional-availability).  If your private cloud is deployed in a non-supported region, you can redeploy it in a supported region. Azure VMware Solution private cloud and disk pool colocation provide the best performance with minimal network latency.


## Prerequisites

- Scalability and performance requirements of your workloads are identified. For details, see [Planning for Azure disk pools](../virtual-machines/disks-pools-planning.md).

- [Azure VMware Solution private cloud](deploy-azure-vmware-solution.md) deployed with a [virtual network configured](deploy-azure-vmware-solution.md#connect-to-azure-virtual-network-with-expressroute). For more information, see [Network planning checklist](tutorial-network-checklist.md) and [Configure networking for your VMware private cloud](tutorial-configure-networking.md). 

   - If you select ultra disks, use an Ultra Performance ExpressRoute virtual network gateway for the disk pool network connection to your Azure VMware Solution private cloud and then [enable ExpressRoute FastPath](../expressroute/expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).

   - If you select premium SSDs or standard SSDs, use a Standard (1 Gbps) or High Performance (2 Gbps) ExpressRoute virtual network gateway for the disk pool network connection to your Azure VMware Solution private cloud.  

- You must use Standard\_DS##\_v3 to host iSCSI.  If you encounter quota issues, request an increase in [vCPU quota limits](../azure-portal/supportability/per-vm-quota-requests.md) per Azure VM series for Dsv3 series.

- Disk pool as the backing storage deployed and exposed as an iSCSI target with each disk as an individual LUN. For details, see [Deploy an Azure disk pool](../virtual-machines/disks-pools-deploy.md).

   >[!IMPORTANT]
   > The disk pool must be deployed in the same subscription as the VMware cluster, and it must be attached to the same VNET as the VMware cluster.

## Add a disk pool to your private cloud
You'll attach to a disk pool surfaced through an iSCSI target as the VMware datastore of an Azure VMware Solution private cloud.

>[!IMPORTANT]
>While in **Public Preview**, only attach a disk pool to a test or non-production cluster.

# [Azure CLI](#tab/azure-cli)

Check if the subscription is registered to `Microsoft.AVS`.

```azurecli
az provider show -n "Microsoft.AVS" --query registrationState
```

If it's not already registered, then register it.

```azurecli
az provider register -n "Microsoft.AVS"
```

Check if the subscription is registered to `CloudSanExperience` AFEC in Microsoft.AVS.

```azurecli
az feature show --name "CloudSanExperience" --namespace "Microsoft.AVS"
```

If it's not already registered, then register it.

```azurecli
az feature register --name "CloudSanExperience" --namespace "Microsoft.AVS"
```

The registration may take approximately 15 minutes to complete, you can use the following command to check status:

```azurecli
az feature show --name "CloudSanExperience" --namespace "Microsoft.AVS" --query properties.state
```

>[!TIP]
>If the registration is stuck in an intermediate state for longer than 15 minutes to complete, unregister and then re-register the flag.
>
>```azurecli
>az feature unregister --name "CloudSanExperience" --namespace "Microsoft.AVS"
>az feature register --name "CloudSanExperience" --namespace "Microsoft.AVS"
>```

Check if the `vmware `extension is installed. 

```azurecli
az extension show --name vmware
```

If the extension is already installed, check if the version is **3.0.0**. If an older version is installed, update the extension.

```azurecli
az extension update --name vmware
```

If it's not already installed, install it.

```azurecli
az extension add --name vmware
```

### Attach the iSCSI LUN

Create and attach an iSCSI datastore in the Azure VMware Solution private cloud cluster using `Microsoft.StoragePool` provided iSCSI target. The disk pool attaches to a virtual network through a delegated subnet, which is done with the Microsoft.StoragePool/diskPools resource provider.  If the subnet isn't delegated, the deployment fails.

```azurecli
#Initialize input parameters
resourceGroupName='<yourRGName>'
name='<desiredDataStoreName>'
cluster='<desiredCluster>'
privateCloud='<privateCloud>'
lunName='<desiredLunName>'

az vmware datastore disk-pool-volume create --name $name --resource-group $resourceGroupName --cluster $cluster --private-cloud $privateCloud --target-id /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/ResourceGroup1/providers/Microsoft.StoragePool/diskPools/mpio-diskpool/iscsiTargets/mpio-iscsi-target --lun-name $lunName
```

>[!TIP]
>You can display the help on the datastores.
>
>   ```azurecli
>   az vmware datastore -h
>   ```


To confirm that the attach succeeded, you can use the following commands:

Show the details of an iSCSI datastore in a private cloud cluster.

```azurecli
az vmware datastore show --name MyCloudSANDatastore1 --resource-group MyResourceGroup --cluster -Cluster-1 --private-cloud MyPrivateCloud
```

List all the datastores in a private cloud cluster.

```azurecli
az vmware datastore list --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud
```

# [Portal](#tab/azure-portal)

### Preview registration

First, register your subscription to the Microsoft.AVS and CloudSanExperience.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Subscriptions**.
1. Select the subscription you want to use and select **Resource providers** under **Settings**.
1. Search for **Microsoft.AVS**, select it, and select **Register**.
1. Select **Preview features** under **Settings**.
1. Search for and register **CloudSanExperience**.

### Connect your disk pool

Now that your subscription has been properly registered, you can connect your disk pool to your Azure VMware Solution private cloud cluster.

> [!IMPORTANT]
> Your disk pool attaches to a virtual network through a delegated subnet, which is done with the Microsoft.StoragePool resource provider. If the subnet isn't delegated, the deployment fails. See [Delegate subnet permission](../virtual-machines/disks-pools-deploy.md#delegate-subnet-permission) for details.

1. Navigate to your Azure VMware Solution.
1. Select **Storage (preview)** under **Manage**.
1. Select **Connect a disk pool**.
1. Select the subscription you'd like to use.
1. Select your disk pool, and the client cluster you'd like to connect it to.
1. Enable your LUNs (if any), provide a datastore name (by default, the LUN is used), and select **Connect**.

:::image type="content" source="media/attach-disk-pools-to-azure-vmware-solution-hosts/connect-a-disk-pool-temp.png" alt-text="Screenshot of the connect a disk pool experience." lightbox="media/attach-disk-pools-to-azure-vmware-solution-hosts/connect-a-disk-pool-temp.png":::

When the connection succeeds, you will see the datastores added in vCenter.

:::image type="content" source="media/attach-disk-pools-to-azure-vmware-solution-hosts/vsphere-datastores.png" alt-text="Screenshot of the vSphere experience, disk pools have been attached as datastores." lightbox="media/attach-disk-pools-to-azure-vmware-solution-hosts/vsphere-datastores.png":::

---

## Disconnect a disk pool from your private cloud

When you disconnect a disk pool, the disk pool resources aren't deleted. There's no maintenance window required for this operation. But, be careful when you do it.

First, power off the VMs and remove all objects associated with the disk pool datastores, which includes:

   - VMs (remove from inventory)

   - Templates

   - Snapshots

Then, delete the private cloud datastore.

1. Navigate to your Azure VMware Solution in the Azure portal.
1. Select **Storage** under **Manage**.
1. Select the disk pool you want to disconnect from and select **Disconnect**.

:::image type="content" source="media/attach-disk-pools-to-azure-vmware-solution-hosts/disconnect-a-disk-pool.png" alt-text="Screenshot of the Azure VMware Solution storage page, list of attached disk pools with disconnect highlighted." lightbox="media/attach-disk-pools-to-azure-vmware-solution-hosts/disconnect-a-disk-pool.png":::

## Next steps

Now that you've attached a disk pool to your Azure VMware Solution hosts, you may want to learn about:

- [Managing an Azure disk pool](../virtual-machines/disks-pools-manage.md).  Once you've deployed a disk pool, there are various management actions available to you. You can add or remove a disk to or from a disk pool, update iSCSI LUN mapping, or add ACLs.

- [Deleting a disk pool](../virtual-machines/disks-pools-deprovision.md#delete-a-disk-pool). When you delete a disk pool, all the resources in the managed resource group are also deleted.

- [Disabling iSCSI support on a disk](../virtual-machines/disks-pools-deprovision.md#disable-iscsi-support). If you disable iSCSI support on a disk pool, you effectively can no longer use a disk pool.

- [Moving disk pools to a different subscription](../virtual-machines/disks-pools-move-resource.md). Move an Azure disk pool to a different subscription, which involves moving the disk pool itself, contained disks, managed resource group, and all the resources. 

- [Troubleshooting disk pools](../virtual-machines/disks-pools-troubleshoot.md). Review the common failure codes related to Azure disk pools (preview). It also provides possible resolutions and some clarity on disk pool statuses.
