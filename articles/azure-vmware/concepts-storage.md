---
title: Concepts - Storage
description: Learn about storage capacity, storage policies, fault tolerance, and storage integration in Azure VMware Solution private clouds.
ms.topic: conceptual
ms.custom: contperf-fy21q4
ms.service: azure-vmware
ms.date: 6/6/2023
---

# Azure VMware Solution storage concepts

Azure VMware Solution private clouds provide native, cluster-wide storage with VMware vSAN. Local storage from each host in a cluster is used in a vSAN datastore, and data-at-rest encryption is available and enabled by default. You can use Azure Storage resources to extend storage capabilities of your private clouds.

## vSAN clusters

Local storage in each cluster host is claimed as part of a vSAN datastore. For the AV36 SKU, all diskgroups use an NVMe cache tier of 1.6 TB with the raw, per host, SSD-based capacity of 15.4 TB. The size of the raw capacity tier of a cluster is the per host capacity times the number of hosts. For example, a four host cluster provides 61.6-TB raw capacity in the vSAN capacity tier. Check the hardware specification for the [AV36P and AV52 SKU](introduction.md) storage device details.

Local storage in cluster hosts is used in the cluster-wide vSAN datastore. All datastores are created as part of private cloud deployment and are available for use immediately. The **cloudadmin** user and all users assigned to the CloudAdmin role can manage datastores with these vSAN privileges:

- Datastore.AllocateSpace
- Datastore.Browse
- Datastore.Config
- Datastore.DeleteFile
- Datastore.FileManagement
- Datastore.UpdateVirtualMachineMetadata

>[!IMPORTANT]
>You can't change the name of datastores or clusters. Azure CLI and PowerShell support changing the name of the resource clusters (Cluster-2 to Cluster-12), however this should not be used, because it creates a meta-data mismatch between the Azure portal resource cluster name and the vSphere cluster name.

## Storage policies and fault tolerance

The default storage policy is set to **RAID-1 FTT-1**, with Object Space Reservation set to Thin provisioning. Unless you adjust the storage policy or apply a new policy, the cluster grows with this configuration. This is the policy that will be applied to the workload VMs. To set a different storage policy, see [Configure storage policy](configure-storage-policy.md).

In a three-host cluster, FTT-1 accommodates a single host's failure. Microsoft governs failures regularly and replaces the hardware when events are detected from an operations perspective.

>[!NOTE]
>When you log on to the vSphere Client, you may notice a VM Storage Policy called **vSAN Default Storage Policy** with **Object Space Reservation** set to **Thin** provisioning. Please note that this is not the default storage policy applied to the cluster. This policy exists for historical purposes and will eventually be modified to **Thin** provisioning. 

>[!NOTE]
>All of the software-defined data center (SDDC) management VMs (vCenter Server, NSX-T Manager, NSX-T Data Center Edges, and others) use the **Microsoft vSAN Management Storage Policy**, with **Object Space Reservation** set to **Thin** provisioning.

>[!TIP]
>If you're unsure if the cluster will grow to four or more, then deploy using the default policy.  If you're sure your cluster will grow, then instead of expanding the cluster after your initial deployment, we recommend deploying the extra hosts during deployment. As the VMs are deployed to the cluster, change the disk's storage policy in the VM settings to either RAID-5 FTT-1 or RAID-6 FTT-2. In reference to [SLA for Azure VMware Solution](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/), note that more than 6 hosts should be configured in the cluster to use an FTT-2 policy (RAID-1, or RAID-6). Also note that the storage policy is not automatically updated based on cluster size. Similarly, changing the default does not automatically update the running VM policies.  


## Data-at-rest encryption

vSAN datastores use data-at-rest encryption by default using keys stored in Azure Key Vault. The encryption solution is KMS-based and supports vCenter Server operations for key management.  When a host is removed from a cluster, all data on SSDs is invalidated immediately.

## Datastore capacity expansion options

The existing cluster vSAN storage capacity can be expanded by connecting Azure storage resources such as [Azure NetApp Files volumes as additional datastores](./attach-azure-netapp-files-to-azure-vmware-solution-hosts.md). Virtual machines can be migrated between vSAN and Azure NetApp Files datastores using storage vMotion.
Azure NetApp Files is available in [Ultra, Premium and Standard performance tiers](../azure-netapp-files/azure-netapp-files-service-levels.md) to allow for adjusting performance and cost to the requirements of the workloads. 

## Azure storage integration

You can use Azure storage services in workloads running in your private cloud. The Azure storage services include Storage Accounts, Table Storage, and Blob Storage. The connection of workloads to Azure storage services doesn't traverse the internet. This connectivity provides more security and enables you to use SLA-based Azure storage services in your private cloud workloads. 

## Alerts and monitoring

Microsoft provides alerts when capacity consumption exceeds 75%. In addition, you can monitor capacity consumption metrics that are integrated into Azure Monitor. For more information, see [Configure Azure Alerts in Azure VMware Solution](configure-alerts-for-azure-vmware-solution.md).

## Next steps

Now that you've covered Azure VMware Solution storage concepts, you may want to learn about:

- [Configure storage policy](configure-storage-policy.md) - Each VM deployed to a vSAN datastore is assigned at least one VM storage policy. You can assign a VM storage policy in an initial deployment of a VM or when you perform other VM operations, such as cloning or migrating.

- [Scale clusters in the private cloud][tutorial-scale-private-cloud] - You can scale the clusters and hosts in a private cloud as required for your application workload. Performance and availability limitations for specific services should be addressed on a case by case basis.

- [Azure NetApp Files with Azure VMware Solution](netapp-files-with-azure-vmware-solution.md) - You can use Azure NetApp Files to migrate and run the most demanding enterprise file-workloads in the cloud: databases, and general purpose computing applications, with no code changes. Azure NetApp Files volumes can be attached to virtual machines, and as [datastores](./attach-azure-netapp-files-to-azure-vmware-solution-hosts.md) to extend the vSAN datastore capacity without adding more nodes.

- [vSphere role-based access control for Azure VMware Solution](concepts-identity.md) - You use vCenter Server to manage VM workloads and NSX-T Manager to manage and extend the private cloud. Access and identity management use the CloudAdmin role for vCenter Server and restricted administrator rights for NSX-T Manager.


<!-- LINKS - external-->

<!-- LINKS - internal -->
[tutorial-scale-private-cloud]: ./tutorial-scale-private-cloud.md
[concepts-identity]: ./concepts-identity.md
