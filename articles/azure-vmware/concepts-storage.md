---
title: Concepts - Storage
description: Learn about storage capacity, storage policies, fault tolerance, and storage integration in Azure VMware Solution private clouds.
ms.topic: conceptual
ms.custom: contperf-fy21q4
ms.date: 04/23/2021
---

# Azure VMware Solution storage concepts

Azure VMware Solution private clouds provide native, cluster-wide storage with VMware vSAN. All local storage from each host in a cluster is used in a vSAN datastore, and data-at-rest encryption is available and enabled by default. You can use Azure Storage resources to extend storage capabilities of your private clouds.

## vSAN clusters

The [AVS36 SKU](https://azure.microsoft.com/pricing/details/azure-vmware/) includes two 1.6-TB NVMe cache and eight 1.9-TB raw storage capacity. These are then split into two disk groups. The size of the raw capacity tier of a cluster is the per-host capacity times the number of hosts. For example, a four host cluster provides 61.6-TB raw capacity in the vSAN capacity tier.

Local storage in cluster hosts is used in cluster-wide vSAN datastore. All datastores are created as part of private cloud deployment and are available for use immediately. The **cloudadmin** user and all users assigned to the CloudAdmin role can manage datastores with these vSAN privileges:

- Datastore.AllocateSpace
- Datastore.Browse
- Datastore.Config
- Datastore.DeleteFile
- Datastore.FileManagement
- Datastore.UpdateVirtualMachineMetadata

>[!IMPORTANT]
>You can't change the name of datastores or clusters.

## Storage policies and fault tolerance

That default storage policy is set to RAID-1 (Mirroring), FTT-1, and thick provisioning.  Unless you adjust the storage policy or you apply a new policy, the cluster continues to grow with this configuration. In a three-host cluster, FTT-1 accommodates a single host's failure. Microsoft governs failures regularly and replaces the hardware when events are detected from an architecture perspective.

:::image type="content" source="media/vsphere-vm-storage-policies.png" alt-text="Screenshot that shows the vSphere Client VM Storage Policies.":::


|Provisioning type  |Description  |
|---------|---------|
|**Thick**      | Is reserved or pre-allocated storage space. It protects systems by allowing them to function even if the vSAN datastore is full because the space is already reserved. For example, if you create a 10-GB virtual disk with thick provisioning, the full amount of virtual disk storage capacity is pre-allocated on the physical storage of the virtual disk and consumes all the space allocated to it in the datastore. It won't allow other virtual machines (VMs) to share the space from the datastore.         |
|**Thin**      | Consumes the space that it needs initially and grows to the data space demand used in the datastore. Outside the default (thick provision), you can create VMs with FTT-1 thin provisioning. For dedupe setup, use thin provisioning for your VM template.         |

>[!TIP]
>If you're unsure if the cluster will grow to four or more, then deploy using the default policy.  If you're sure your cluster will grow, then instead of expanding the cluster after your initial deployment, we recommend to deploy the extra hosts during deployment. As the VMs are deployed to the cluster, change the disk's storage policy in the VM settings to either RAID-5 FTT-1 or RAID-6 FTT-2. 
>
>:::image type="content" source="media/vsphere-vm-storage-policies-2.png" alt-text="Screenshot ":::


## Data-at-rest encryption

vSAN datastores use data-at-rest encryption by default using keys stored in Azure Key Vault. The encryption solution is KMS-based and supports vCenter operations for key management.  When a host is removed from a cluster, data on SSDs is invalidated immediately.

## Azure storage integration

You can use Azure storage services in workloads running in your private cloud. The Azure storage services include Storage Accounts, Table Storage, and Blob Storage. The connection of workloads to Azure storage services doesn't traverse the internet. This connectivity provides more security and enables you to use SLA-based Azure storage services in your private cloud workloads.

## Alerts and monitoring

Microsoft provides alerts when capacity consumption exceeds 75%.  You can monitor capacity consumption metrics that are integrated into Azure Monitor. For more information, see [Configure Azure Alerts in Azure VMware Solution](configure-alerts-for-azure-vmware-solution.md).

## Next steps

Now that you've covered Azure VMware Solution storage concepts, you may want to learn about:

- [Scale clusters in the private cloud][tutorial-scale-private-cloud]
- [Azure NetApp Files with Azure VMware Solution](netapp-files-with-azure-vmware-solution.md)
- [vSphere role-based access control for Azure VMware Solution](concepts-identity.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->
[tutorial-scale-private-cloud]: ./tutorial-scale-private-cloud.md
[concepts-identity]: ./concepts-identity.md
