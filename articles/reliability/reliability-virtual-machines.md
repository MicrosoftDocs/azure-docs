---
title: Reliability in Azure Virtual Machines
description: Find out about reliability in Azure Virtual Machines 
author: ericd-mst-github
ms.author: erd
ms.topic: overview
ms.custom: subject-reliability
ms.service: virtual-machines
ms.date: 07/18/2023
---

# Reliability in Virtual Machines

This article contains [specific reliability recommendations for Virtual Machines](#reliability-recommendations), as well as detailed information on VM regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). 


For an architectural overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Reliability recommendations

[!INCLUDE [Reliability recommendations](includes/reliability-recommendations-include.md)]
 
### Reliability recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**High Availability**](#high-availability) |:::image type="icon" source="media/icon-recommendation-high.svg":::| [Run production workloads on two or more VMs using Azure Virtual Machine Scale Sets Flex](#-run-production-workloads-on-two-or-more-vms-using-virtual-machine-scale-sets-flex) |
||:::image type="icon" source="media/icon-recommendation-high.svg"::: |[Deploy VMs across availability zones or use Virtual Machine Scale Sets Flex with zones](#-deploy-vms-across-availability-zones-or-use-virtual-machine-scale-sets-flex-with-zones) | 
||:::image type="icon" source="media/icon-recommendation-high.svg":::|[Migrate VMs using availability sets to Virtual Machine Scale Sets Flex](#-migrate-vms-using-availability-sets-to-virtual-machine-scale-sets-flex) | 
||:::image type="icon" source="media/icon-recommendation-high.svg"::: |[Use managed disks for VM disks](#-use-managed-disks-for-vm-disks)|
|[**Disaster Recovery**](#disaster-recovery)| :::image type="icon" source="media/icon-recommendation-medium.svg":::  |[Replicate VMs using Azure Site Recovery](#-replicate-vms-using-azure-site-recovery) |
||:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[Back up data on your VMs with Azure Backup service](#-back-up-data-on-your-vms-with-azure-backup-service) |
|[**Performance**](#performance) |:::image type="icon" source="media/icon-recommendation-low.svg":::  | [Host application and database data on a data disk](#-host-application-and-database-data-on-a-data-disk)| 
||:::image type="icon" source="media/icon-recommendation-high.svg"::: | [Production VMs should be using SSD disks](#-production-vms-should-be-using-ssd-disks)| 
||:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[Enable Accelerated Networking (AccelNet)](#-enable-accelerated-networking-accelnet) |
||:::image type="icon" source="media/icon-recommendation-low.svg"::: |[When AccelNet is enabled, you must manually update the GuestOS NIC drive](#-when-accelnet-is-enabled-you-must-manually-update-the-guestos-nic-driver) | 
|[**Management**](#management)|:::image type="icon" source="media/icon-recommendation-low.svg":::  |[VM-9: Watch for VMs in Stopped state](#-review-vms-in-stopped-state) |  
||:::image type="icon" source="media/icon-recommendation-high.svg"::: |[Use maintenance configurations for the VM](#-use-maintenance-configurations-for-the-vm) |
|[**Security**](#security)|:::image type="icon" source="media/icon-recommendation-medium.svg":::  |[VVMs shouldn't have a Public IP directly associated](#-vms-shouldnt-have-a-public-ip-directly-associated) |
||:::image type="icon" source="media/icon-recommendation-low.svg":::  |[Virtual Network Interfaces have an NSG associated](#-vm-network-interfaces-have-a-network-security-group-nsg-associated)  |
||:::image type="icon" source="media/icon-recommendation-medium.svg":::  |[IP Forwarding should only be enabled for Network Virtual Appliances](#-ip-forwarding-should-only-be-enabled-for-network-virtual-appliances) | 
||:::image type="icon" source="media/icon-recommendation-low.svg"::: |[Network access to the VM disk should be set to "Disable public access and enable private access"](#-network-access-to-the-vm-disk-should-be-set-to-disable-public-access-and-enable-private-access) | 
||:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[Enable disk encryption and data at rest encryption by default](#-enable-disk-encryption-and-data-at-rest-encryption-by-default)  | 
|[**Networking**](#networking) | :::image type="icon" source="media/icon-recommendation-low.svg":::  |[Customer DNS Servers should be configured in the Virtual Network level](#-dns-servers-should-be-configured-in-the-virtual-network-level) |
|[**Storage**](#storage) |:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[Shared disks should only be enabled in clustered servers](#-shared-disks-should-only-be-enabled-in-clustered-servers) | 
|[**Compliance**](#compliance)| :::image type="icon" source="media/icon-recommendation-low.svg":::  |[Ensure that your VMs are compliant with Azure Policies](#-ensure-that-your-vms-are-compliant-with-azure-policies) |
|[**Monitoring**](#monitoring)| :::image type="icon" source="media/icon-recommendation-low.svg":::  |[Enable VM Insights](#-enable-vm-insights) | 
||:::image type="icon" source="media/icon-recommendation-low.svg"::: |[Configure diagnostic settings for all Azure resources](#-configure-diagnostic-settings-for-all-azure-resources) | 

### High availability
 
#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **Run production workloads on two or more VMs using Virtual Machine Scale Sets Flex** 

To safeguard application workloads from downtime due to the temporary unavailability of a disk or VM, it's recommended that you run production workloads on two or more VMs using Virtual Machine Scale Sets Flex. 

To run production workloads, you can use:

- [Azure Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview) to create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule.

- **Availability zones**. For more information on availability zones and VMs, see [Availability zone support](#availability-zone-support).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-1/vm-1.kql":::

----

#### :::image type="icon" source="media/icon-recommendation-high.svg"::: *Deploy VMs across availability zones or use Virtual Machine Scale Sets Flex with zones** 
    
When you create your VMs, use availability zones to protect your applications and data against unlikely datacenter failure. For more information about availability zones for VMs, see [Availability zone support](#availability-zone-support) in this document.

For information on how to enable availability zones support when you create your VM, see [create availability zone support](#create-a-resource-with-availability-zone-enabled).

For information on how to migrate your existing VMs to availability zone support, see [migrate to availability zone support](#migrate-to-availability-zone-support). 


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-2/vm-2.kql":::

----


#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **Migrate VMs using availability sets to Virtual Machine Scale Sets Flex**

Availability sets will be retired soon. Modernize your workloads by migrating them from VMs to Virtual Machine Scale Sets Flex. 

With Virtual Machine Scale Sets Flex, you can deploy your VMs in one of two ways:

- Across zones
- In the same zone, but across fault domains (FDs) and update domains (UD) automatically. 

In an N-tier application, it's recommended that you place each application tier into its own Virtual Machine Scale Sets Flex.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-3/vm-3.kql":::

----


#### :::image type="icon" source="media/icon-recommendation-high.svg"::: *Use managed disks for VM disks**

To provide better reliability for VMs in an availability set, use managed disks. Managed disks are sufficiently isolated from each other to avoid single points of failure. Also, managed disks aren’t subject to the IOPS limits of VHDs created in a storage account.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-5/vm-5.kql":::

---

### Disaster recovery

#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Replicate VMs using Azure Site Recovery**

When you replicate Azure VMs using Site Recovery, all VM disks are continuously replicated to the target region asynchronously. The recovery points are created every few minutes, which gives you a Recovery Point Objective (RPO) in the order of minutes. You can conduct disaster recovery drills as many times as you want, without affecting the production application or the ongoing replication.

To learn how to run a disaster recovery drill, see [Run a test failover](/azure/site-recovery/site-recovery-test-failover-to-azure).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-4/vm-4.kql":::

---

#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **Back up data on your VMs with Azure Backup service**

The Azure Backup service provides simple, secure, and cost-effective solutions to back up your data and recover it from the Microsoft Azure cloud. For more information, see [What is the Azure Backup Service](/azure/backup/backup-overview).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-7/vm-7.kql":::

---

### Performance

####  :::image type="icon" source="media/icon-recommendation-low.svg"::: **Host application and database data on a data disk**

A data disk is a managed disk that’s attached to a VM. Use the data disk to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose. Hosting your data on a data disk makes it easy to back up or restore your data. You can also migrate the disk without having to move the entire VM and Operating System. Also, you can select a different disk SKU, with different type, size, and performance that meet your requirements. For more information on data disks, see [Data Disks](/azure/virtual-machines/managed-disks-overview#data-disk).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-6/vm-6.kql":::

---


#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **Production VMs should be using SSD disks** 


Premium SSD disks offer high-performance, low-latency disk support for I/O-intensive applications and production workloads. Standard SSD Disks are a cost-effective storage option optimized for workloads that need consistent performance at lower IOPS levels. 

It's recommended that you:

- Use Standard HDD disks for Dev/Test scenarios and less critical workloads at lowest cost.
- Use Premium SSD disks instead of Standard HDD disks with your premium-capable VMs. For any Single Instance VM using premium storage for all Operating System Disks and Data Disks, Azure guarantees VM connectivity of at least 99.9%. 

If you want to upgrade from Standard HDD to Premium SSD disks, consider the following issues:

- Upgrading requires a VM reboot and this process takes 3-5 minutes to complete. 
- If VMs are mission-critical production VMs, evaluate the improved availability against the cost of premium disks.
    

For more information on Azure managed disks and disks types, see [Azure managed disk types](/azure/virtual-machines/disks-types#premium-ssd).



# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-8/vm-8.kql":::

---

### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **Enable Accelerated Networking (AccelNet)** 

AccelNet enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the data path, which reduces latency, jitter, and CPU utilization for the most demanding network workloads on supported VM types.

For more information on Accelerated Networking, see [Accelerated Networking](/azure/virtual-network/accelerated-networking-overview?tabs=redhat.)


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-10/vm-10.kql":::

---


#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **When AccelNet is enabled, you must manually update the GuestOS NIC driver** 

When AccelNet is enabled, the default Azure Virtual Network interface in the GuestOS is replaced for a Mellanox interface. As a result, the GuestOS NIC driver is provided from Mellanox, a third party vendor.  Although Marketplace images maintained by Microsoft are offered with the latest version of Mellanox drivers, once the VM is deployed, you need to manually update GuestOS NIC driver every six months.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-11/vm-11.kql":::

---

### Management

#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Review VMs in stopped state** 
VM instances go through different states, including provisioning and power states. If a VM is in a stopped state, the VM may be facing an issue or is no longer necessary and could be removed to help reduce costs.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-9/vm-9.kql":::

---

#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **Use maintenance configurations for the VM**

To ensure that VM updates/interruptions are done in a planned time frame, use maintenance configuration settings to schedule and manage updates. For more information on managing VM updates with maintenance configurations, see [Managing VM updates with Maintenance Configurations](../virtual-machines/maintenance-configurations.md).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-22/vm-22.kql":::

---

### Security

#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **VMs shouldn't have a Public IP directly associated** 

If a VM requires outbound internet connectivity, it's recommended that you use NAT Gateway or Azure Firewall. NAT Gateway or Azure Firewall help to increase security and resiliency of the service, since both services have higher availability and [Source Network Address Translation (SNAT)](/azure/load-balancer/load-balancer-outbound-connections) ports. For inbound internet connectivity, it's recommended that you use a load balancing solution such as Azure Load Balancer and Application Gateway.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-12/vm-12.kql":::

---


#### :::image type="icon" source="media/icon-recommendation-low.svg"::: *VM network interfaces have a Network Security Group (NSG) associated**

It's recommended that you associate an NSG to a subnet, or a network interface, but not both. Since rules in an NSG associated to a subnet can conflict with rules in an NSG associated to a network interface, you can have unexpected communication problems that require troubleshooting. For more information, see [Intra-Subnet traffic](/azure/virtual-network/network-security-group-how-it-works#intra-subnet-traffic).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-13/vm-13.kql":::

---


#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **IP forwarding should only be enabled for network virtual appliances** 

IP forwarding enables the virtual machine network interface to:

- Receive network traffic not destined for one of the IP addresses assigned to any of the IP configurations assigned to the network interface.

- Send network traffic with a different source IP address than the one assigned to one of a network interface’s IP configurations.

The IP forwarding setting must be enabled for every network interface that's attached to the VM receiving traffic to be forwarded. A VM can forward traffic whether it has multiple network interfaces, or a single network interface attached to it. While IP forwarding is an Azure setting, the VM must also run an application that's able to forward the traffic, such as firewall, WAN optimization, and load balancing applications.

To learn how to enable or disable IP forwarding, see [Enable or disable IP forwarding](/azure/virtual-network/virtual-network-network-interface?tabs=azure-portal#enable-or-disable-ip-forwarding).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-14/vm-14.kql":::

---


#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Network access to the VM disk should be set to "Disable public access and enable private access"**

It's recommended that you set VM disk network access to “Disable public access and enable private access” and create a private endpoint. To learn how to create a private endpoint, see [Create a private endpoint](/azure/virtual-machines/disks-enable-private-links-for-import-export-portal#create-a-private-endpoint).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-17/vm-17.kql":::

---


#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **Enable disk encryption and data at rest encryption by default** 

There are several types of encryption available for your managed disks, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE) and encryption at host.

- Azure Disk Encryption helps protect and safeguard your data to meet your organizational security and compliance commitments.
- Azure Disk Storage Server-Side Encryption (also referred to as encryption-at-rest or Azure Storage encryption) automatically encrypts data stored on Azure managed disks (OS and data disks) when persisting on the Storage Clusters.
- Encryption at host ensures that data stored on the VM host hosting your VM is encrypted at rest and flows encrypted to the Storage clusters.
- Confidential disk encryption binds disk encryption keys to the VM’s TPM and makes the protected disk content accessible only to the VM.

For more information about managed disk encryption options, see [Overview of managed disk encryption options](../virtual-machines/disk-encryption-overview.md).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-19/vm-19.kql":::

---

### Networking

#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **DNS Servers should be configured in the Virtual Network level**

Configure the DNS Server in the Virtual Network to avoid name resolution inconsistency across the environment. For more information on name resolution for resources in Azure virtual networks, see [Name resolution for VMs and cloud services](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances?tabs=redhat).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-15/vm-15.kql":::

---


### Storage

#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **Shared disks should only be enabled in clustered servers**

*Azure shared disks* is a feature of *Azure managed disks* that enables you to attach a managed disk to multiple VMs simultaneously. When you attach a managed disk to multiple VMs, you can either deploy new or migrate existing clustered applications to Azure.  Shared disks should only be used in those situations where the disk is assigned to more than one VM member of a cluster.

To learn more about how to enable shared disks for managed disks, see [Enable shared disk](/azure/virtual-machines/disks-shared-enable?tabs=azure-portal).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-16/vm-16.kql":::

---


### Compliance

#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Ensure that your VMs are compliant with Azure Policies**

It’s important to keep your virtual machine (VM) secure for the applications that you run. Securing your VMs can include one or more Azure services and features that cover secure access to your VMs and secure storage of your data. For more information on how to keep your VM and applications secure, see [Azure Policy Regulatory Compliance controls for Azure Virtual Machines](/azure/virtual-machines/security-controls-policy).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-18/vm-18.kql":::

---

### Monitoring

#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Enable VM Insights** 

Enable [VM Insights](/azure/azure-monitor/vm/vminsights-overview) to get more visibility into the health and performance of your virtual machine. VM Insights gives you information on the performance and health of your VMs and virtual machine scale sets, by monitoring their running processes and dependencies on other resources. VM Insights can help deliver predictable performance and availability of vital applications by identifying performance bottlenecks and network issues. Insights can also help you understand whether an issue is related to other dependencies.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-20/vm-20.kql":::

---


#### :::image type="icon" source="media/icon-recommendation-low.svg"::: **Configure diagnostic settings for all Azure resources**

Platform metrics are sent automatically to Azure Monitor Metrics by default and without configuration. Platform logs provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on and are one of the following types:

- **Resource logs** that aren’t collected until they’re routed to a destination.
- **Activity logs** that exist on their own but can be routed to other locations.

Each Azure resource requires its own diagnostic setting, which defines the following criteria:

- **Sources** The type of metric and log data to send to the destinations defined in the setting. The available types vary by resource type.
- **Destinations**: One or more destinations to send to.

A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), create multiple settings. Each resource can have up to five diagnostic settings.

Fore information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-21/vm-21.kql":::

---



## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Virtual machines support availability zones with three availability zones per supported Azure region and are also zone-redundant and zonal. For more information, see [availability zones support](availability-zones-service-support.md). The customer is responsible for configuring and migrating their virtual machines for availability. 

To learn more about availability zone readiness options, see:

- See [availability options for VMs](../virtual-machines/availability.md)
- Review [availability zone service and region support](availability-zones-service-support.md)
- [Migrate existing VMs](migrate-vm.md) to availability zones

 
### Prerequisites

- Your virtual machine SKUs must be available across the zones in for your region. To review which regions support availability zones, see the [list of supported regions](availability-zones-service-support.md#azure-regions-with-availability-zone-support). 

- Your VM SKUs must be available across the zones in your region. To check for VM SKU availability, use one of the following methods:

    - Use PowerShell to [Check VM SKU availability](../virtual-machines/windows/create-PowerShell-availability-zone.md#check-vm-sku-availability).
    - Use the Azure CLI to [Check VM SKU availability](../virtual-machines/linux/create-cli-availability-zone.md#check-vm-sku-availability).
    - Go to [Foundational Services](availability-zones-service-support.md#an-icon-that-signifies-this-service-is-foundational-foundational-services).
    

### SLA improvements

Because availability zones are physically separate and provide distinct power source, network, and cooling, SLAs (Service-level agreements) increase. For more information, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/).

#### Create a resource with availability zone enabled

Get started by creating a virtual machine (VM) with availability zone enabled from the following deployment options below:
- [Azure CLI](../virtual-machines/linux/create-cli-availability-zone.md)
- [PowerShell](../virtual-machines/windows/create-powershell-availability-zone.md)
- [Azure portal](../virtual-machines/create-portal-availability-zone.md)

### Zonal failover support

You can set up virtual machines to fail over to another zone using the Site Recovery service. For more information, see [Site Recovery](../site-recovery/site-recovery-overview.md).

### Fault tolerance

Virtual machines can fail over to another server in a cluster, with the VM's operating system restarting on the new server. You should refer to the failover process for disaster recovery, gathering virtual machines in recovery planning, and running disaster recovery drills to ensure their fault tolerance solution is successful.

For more information, see the [site recovery processes](../site-recovery/site-recovery-failover.md#before-you-start).


### Zone down experience

During a zone-wide outage, you should expect a brief degradation of performance until the virtual machine service self-healing rebalances underlying capacity to adjust to healthy zones. Self-healing isn't dependent on zone restoration; it's expected that the Microsoft-managed service self-healing state compensates for a lost zone, using capacity from other zones.

You should also prepare for the possibility that there's an outage of an entire region. If there's a service disruption for an entire region, the locally redundant copies of your data would temporarily be unavailable. If geo-replication is enabled, three other copies of your Azure Storage blobs and tables are stored in a different region. When there's a complete regional outage or a disaster in which the primary region isn't recoverable, Azure remaps all of the DNS entries to the geo-replicated region.

#### Zone outage preparation and recovery

The following guidance is provided for Azure virtual machines during a service disruption of the entire region where your Azure virtual machine application is deployed:

- Configure [Azure Site Recovery](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-1-initiate-a-failover-by-using-azure-site-recovery) for your VMs
- Check the [Azure Service Health Dashboard](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-2-wait-for-recovery) status if Azure Site Recovery hasn't been configured
- Review how the [Azure Backup service](../backup/backup-azure-vms-introduction.md) works for VMs
    - See the [support matrix](../backup/backup-support-matrix-iaas.md) for Azure VM backups
- Determine which [VM restore option and scenario](../backup/about-azure-vm-restore.md) works best for your environment

### Low-latency design

Cross Region (secondary region), Cross Subscription (preview), and Cross Zonal (preview) are available options to consider when designing a low-latency virtual machine solution. For more information on these options, see the [supported restore methods](../backup/backup-support-matrix-iaas.md#supported-restore-methods).

>[!IMPORTANT]
>By opting out of zone-aware deployment, you forego protection from isolation of underlying faults. Use of SKUs that don't support availability zones or opting out from availability zone configuration forces reliance on resources that don't obey zone placement and separation (including underlying dependencies of these resources). These resources shouldn't be expected to survive zone-down scenarios. Solutions that leverage such resources should define a disaster recovery strategy and configure a recovery of the solution in another region.

### Safe deployment techniques

When you opt for availability zones isolation, you should utilize safe deployment techniques for application code and application upgrades. In addition to [configuring Azure Site Recovery](#zone-outage-preparation-and-recovery), and implement any one of the following safe deployment techniques for VMs:

- [Virtual Machine Scale Sets](/azure/virtual-machines/flexible-virtual-machine-scale-sets)
- [Azure Load Balancer](../load-balancer/load-balancer-overview.md)
- [Azure Storage Redundancy](../storage/common/storage-redundancy.md)


As Microsoft periodically performs planned maintenance updates, there may be rare instances when these updates require a reboot of your virtual machine to apply the required updates to the underlying infrastructure. To learn more, see [availability considerations](../virtual-machines/maintenance-and-updates.md#availability-considerations-during-scheduled-maintenance) during scheduled maintenance. 

Before you upgrade your next set of nodes in another zone, you should perform the following tasks:

- Check the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) for the virtual machines service status for your expected regions.
- Ensure that [replication](../site-recovery/azure-to-azure-quickstart.md) is enabled on your VMs.


### Migrate to availability zone support

To learn how to migrate a VM to availability zone support, see [Migrate Virtual Machines and Virtual Machine Scale Sets to availability zone support](./migrate-vm.md).

- Move a VM to another subscription or resource group
    - [CLI](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-cli)
    - [PowerShell](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-powershell)
- [Azure Resource Mover](/azure/resource-mover/tutorial-move-region-virtual-machines)
- [Move Azure VMs to availability zones](../site-recovery/move-azure-vms-avset-azone.md)
- [Move region maintenance configuration resources](../virtual-machines/move-region-maintenance-configuration-resources.md)
  
## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

You can use Cross Region restore to restore Azure VMs via paired regions. With Cross Region restore, you can restore all the Azure VMs for the selected recovery point if the backup is done in the secondary region. For more information on Cross Region restore, refer to the Cross Region table row entry in our [restore options](../backup/backup-azure-arm-restore-vms.md#restore-options).

### Disaster recovery in multi-region geography


In the case of a region-wide service disruption, Microsoft works diligently to restore the virtual machine service. However, you still must rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data strategies for disaster recovery](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan).

#### Outage detection, notification, and management

Hardware or physical infrastructure for the virtual machine may fail unexpectedly. Unexpected failures can include local network failures, local disk failures, or other rack level failures. When detected, the Azure platform automatically migrates (heals) your virtual machine to a healthy physical machine in the same data center. During the healing procedure, virtual machines experience downtime (reboot) and in some cases loss of the temporary drive. The attached OS and data disks are always preserved.

For more detailed information on virtual machine service disruptions, see [disaster recovery guidance](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance).

#### Set up disaster recovery and outage detection 

When setting up disaster recovery for virtual machines, understand what [Azure Site Recovery provides](../site-recovery/site-recovery-overview.md#what-does-site-recovery-provide). Enable disaster recovery for virtual machines with the below methods:

- Set up disaster recovery to a [secondary Azure region for an Azure VM](../site-recovery/azure-to-azure-quickstart.md)
- Create a Recovery Services vault
    - [Bicep](../site-recovery/quickstart-create-vault-bicep.md)
    - [ARM template](../site-recovery/quickstart-create-vault-template.md)
- Enable disaster recovery for [Linux virtual machines](../virtual-machines/linux/tutorial-disaster-recovery.md)
- Enable disaster recovery for [Windows virtual machines](../virtual-machines/windows/tutorial-disaster-recovery.md)
- Fail over virtual machines to [another region](../site-recovery/azure-to-azure-tutorial-failover-failback.md)
- Fail over virtual machines to the [primary region](../site-recovery/azure-to-azure-tutorial-failback.md#fail-back-to-the-primary-region)

### Disaster recovery in single-region geography

With disaster recovery setup, Azure VMs continuously replicate to a different target region. If an outage occurs, you can fail over VMs to the secondary region, and access them from there.

When you replicate Azure VMs using [Site Recovery](../site-recovery/site-recovery-overview.md), all the VM disks are continuously replicated to the target region asynchronously. The recovery points are created every few minutes, which grants you a Recovery Point Objective (RPO) in the order of minutes. You can conduct disaster recovery drills as many times as you want, without affecting the production application or the ongoing replication. For more information, see [Run a disaster recovery drill to Azure](../site-recovery/tutorial-dr-drill-azure.md).

For more information, see [Azure VMs architectural components](../site-recovery/azure-to-azure-architecture.md#architectural-components) and [region pairing](../virtual-machines/regions.md#region-pairs).

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the [Shared Responsibility Model](./availability-zones-overview.md#shared-responsibility-model). Shared responsibility means that for customer-enabled DR (customer-responsible services), you must address DR for any service they deploy and control. To ensure that recovery is proactive, you should always pre-deploy secondaries because there's no guarantee of capacity at time of impact for those who haven't preallocated.

For deploying virtual machines, you can use [flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration) mode on Virtual Machine Scale Sets. All VM sizes can be used with flexible orchestration mode. Flexible orchestration mode also offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains either within a region or within an availability zone.

## Additional guidance

- [Well-Architected Framework for virtual machines](/azure/architecture/framework/services/compute/virtual-machines/virtual-machines-review)
- [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture)
- [Accelerated networking with Azure VM disaster recovery](/azure/site-recovery/azure-vm-disaster-recovery-with-accelerated-networking)
- [Express Route with Azure VM disaster recovery](../site-recovery/azure-vm-disaster-recovery-with-expressroute.md)
- [Virtual Machine Scale Sets](../virtual-machine-scale-sets/index.yml)

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/reliability/availability-zones-overview)
