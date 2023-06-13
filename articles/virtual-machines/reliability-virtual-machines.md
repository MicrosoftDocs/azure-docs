---
title: Reliability in Azure Virtual Machines
description: Find out about reliability in Azure Virtual Machines 
author: ericd-mst-github
ms.author: erd
ms.topic: overview
ms.custom: subject-reliability
ms.service: virtual-machines
ms.date: 06/12/2023
---

# Reliability in Virtual Machines

This article contains [specific reliability recommendations for Virtual Machines](#reliability-recommendations), as well as detailed information on VM regional resiliency with [availability zones](#availability-zone-support) and [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). 

For an architectural overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Reliability recommendations

This section contains recommendations for achieving resiliency and availability for your Azure Virtual Machines.  All recommendations fall into one of two categories:

- **Health items** cover areas such as configuration items and the proper function of the major components that make up your Azure Workload, such as Azure Resource configuration settings, dependencies on other services, and so on.

- **Risk items** cover areas such as availability and recovery requirements, testing, monitoring, deployment, and other items that if left unresolved increase the chances of problems in the environment. Usually the Well-Architected Framework best practices.


### Reliability recommendations priority matrix

Each recommendation is marked in accordance with the following priority matrix:

| Image | Priority | Description
|----|----|----|
|![This is a high recommendation.](../reliability/media/icon-recommendation-high.svg)|High|Immediate fix needed.|
|![This is a medium recommendation.](../reliability/media/icon-recommendation-medium.svg)|Medium|Fix within 3-6 months.|
|![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg)|Low|Needs to be reviewed.|

 
### Reliability recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**High Availability**](#high-availability) | ![This is a high recommendation for VM-1.](../reliability/media/icon-recommendation-high.svg) | [VM-1: Run production workloads on two or more VMs](#this-is-a-high-recommendation-vm-1-run-production-workloads-on-two-or-more-vms) |
||![This is a high recommendation VM-2.](../reliability/media/icon-recommendation-high.svg) |[VM-2: Deploy VMs across availability zones](#this-is-a-high-recommendation-vm-2-deploy-vms-across-availability-zones) | 
||![This is a high recommendation for VM-3.](../reliability/media/icon-recommendation-high.svg) |[VM-3: If Availability Set is required, then put each application tier into a separate Availability Set](#this-is-a-high-recommendation-vm-3-if-availability-set-is-required-then-put-each-application-tier-into-a-separate-availability-set) | 
||![This is a high recommendation for VM-5.](../reliability/media/icon-recommendation-high.svg) |[VM-5: Use managed disks for VM disks](#this-is-a-high-recommendation-vm-5-use-managed-disks-for-vm-disks)|
|[**Disaster Recovery**](#disaster-recovery)| ![This is a medium recommendation for VM-4.](../reliability/media/icon-recommendation-medium.svg) |[VM-4: If Availability Set is required, then put each application tier into a separate Availability Set](#this-is-a-low-recommendation-vm-4-replicate-vms-using-azure-site-recovery) |
||![This is a medium recommendation for VM-7](../reliability/media/icon-recommendation-medium.svg) |[VM-7: Backup data on your VMs with Azure Backup service](#this-is-a-medium-recommendation-vm-7-backup-data-on-your-vms-with-azure-backup-service) |
|[**Performance**](#performance) |![This is a low recommendation for VM-6.](../reliability/media/icon-recommendation-low.svg) | [VM-6: Host application and database data on a data disk](#this-is-a-low-recommendation-vm-6-host-application-and-database-data-on-a-data-disk)| 
||![This is a high recommendation for VM-8.](../reliability/media/icon-recommendation-high.svg) | [VM-8: Production VMs should be using SSD disks](#this-is-a-high-recommendation-vm-8-production-vms-should-be-using-ssd-disks)| 
||![This is a medium recommendation for VM-10.](../reliability/media/icon-recommendation-medium.svg)|[VM-10: Enable Accelerated Networking (AccelNet)](#this-is-a-medium-recommendation-vm-10-enable-accelerated-networking-accelnet) |
|| ![This is a low recommendation for VM-11.](../reliability/media/icon-recommendation-low.svg) |[VM-11: Accelerated Networking is enabled, make sure you update the GuestOS NIC driver every 6 months](#this-is-a-low-recommendation-vm-11-accelerated-networking-is-enabled-make-sure-you-update-the-guestos-nic-driver-every-6-months) | 
|[**Management**](#management)|![This is a low recommendation for VM-9.](../reliability/media/icon-recommendation-low.svg) |[VM-9: Watch for VMs in Stopped state](#this-is-a-low-recommendation-vm-9-watch-for-vms-in-stopped-state) |  
|| ![This is a high recommendation for VM-22.](../reliability/media/icon-recommendation-high.svg) |[VM-22: Use maintenance configurations for the VM](#this-is-a-high-recommendation-vm-22-use-maintenance-configurations-for-the-vm) |
|[**Security**](#security)|![This is a medium recommendation for VM-12.](../reliability/media/icon-recommendation-medium.svg) |[VM-12: VMs should not have a Public IP directly associated](#this-is-a-medium-recommendation-vm-12-vms-should-not-have-a-public-ip-directly-associated) |
||![This is a low recommendation for VM-13.](../reliability/media/icon-recommendation-low.svg) |[VM-13: Virtual Network Interfaces have an NSG associated](#this-is-a-low-recommendation-vm-13-virtual-network-interfaces-have-an-nsg-associated)  |
|| ![This is a medium recommendation for VM-14.](../reliability/media/icon-recommendation-medium.svg) |[VM-14: IP Forwarding should only be enabled for Network Virtual Appliances](#this-is-a-medium-recommendation-vm-14-ip-forwarding-should-only-be-enabled-for-network-virtual-appliances) | 
|| ![This is a low recommendation for VM-17.](../reliability/media/icon-recommendation-low.svg)|[VM-17: Network access to the VM disk should be set to "Disable public access and enable private access"](#this-is-a-low-recommendation-vm-17-network-access-to-the-vm-disk-should-be-set-to-disable-public-access-and-enable-private-access) | 
||![This is a medium recommendation for VM-19.](../reliability/media/icon-recommendation-medium.svg)|[VM-19: Enable disk encryption and data at rest encryption by default](#this-is-a-medium-recommendation-vm-19-enable-disk-encryption-and-data-at-rest-encryption-by-default)  | 
|[**Networking**](#networking) |  ![This is a low recommendation for VM-15.](../reliability/media/icon-recommendation-low.svg) |[VM-15: Customer DNS Servers should be configured in the Virtual Network level](#this-is-a-low-recommendation-vm-15-customer-dns-servers-should-be-configured-in-the-virtual-network-level) |
|[**Storage**](#storage) | ![This is a medium recommendation for VM-16.](../reliability/media/icon-recommendation-medium.svg)|[VM-16: Shared disks should only be enabled in clustered servers](#this-is-a-medium-recommendation-vm-16-shared-disks-should-only-be-enabled-in-clustered-servers) | 
|[**Compliance**](#compliance)| ![This is a low recommendation for VM-18.](../reliability/media/icon-recommendation-low.svg) |[VM-18: Ensure that your VMs are compliant with Azure Policies](#this-is-a-low-recommendation-vm-18-ensure-that-your-vms-are-compliant-with-azure-policies) |
|[**Monitoring**](#monitoring)| ![This is a low recommendation for VM-20.](../reliability/media/icon-recommendation-low.svg) |[VM-20: Enable VM Insights](#this-is-a-low-recommendation-vm-20-enable-vm-insights) | 
||![This is a low recommendation for VM-21.](../reliability/media/icon-recommendation-low.svg)|[VM-21: Configure diagnostic settings for all Azure resources](#this-is-a-low-recommendation-vm-21-configure-diagnostic-settings-for-all-azure-resources) | 


### High availability

#### ![This is a high recommendation.](../reliability/media/icon-recommendation-high.svg) **VM-1: Run production workloads on two or more VMs** 

To safeguard application workloads from downtime due to the temporary unavailability of a disk or VM, customers can use availability sets. Two or more virtual machines in an availability set provide redundancy for the application. Azure then creates these VMs and disks in separate fault domains with different power, network, and server components. Then, deploy multiple VMs in different Availability Zones, or put them into an Availability Set or Virtual Machine Scale Set, with a Load Balancer in front of them.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-1/vm-1.kql":::

----


#### ![This is a high recommendation.](../reliability/media/icon-recommendation-high.svg) **VM-2: Deploy VMs across availability zones** 
    
When you create your VMs, make sure to use availability zones to protect your applications and data against unlikely datacenter failure. For more information about availability zones for VMs, see [Availability zone support](#availability-zone-support) in this document.

For information on how to enable availability zones support when you create your VM, see [create availability zone support](#create-a-resource-with-availability-zone-enabled).

For information on how to migrate your existing VMs to availability zone support, see [Availability zone support redeployment and migration](#availability-zone-redeployment-and-migration). 


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-2/vm-2.kql":::

----


#### ![This is a high recommendation.](../reliability/media/icon-recommendation-high.svg) **VM-3: If Availability Set is required, then put each application tier into a separate Availability Set**

If the region where you are running your application doesn’t support availability zones, put your VMs into an availability set. In an N-tier application, don’t put VMs from different tiers into the same availability set. VMs in an availability set are placed across fault domains (FDs) and update domains (UD). However, to get the redundancy benefit of FDs and UDs, every VM in the availability set must be able to handle the same client requests.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-3/vm-3.kql":::

----


#### ![This is a high recommendation.](../reliability/media/icon-recommendation-high.svg) **VM-5: Use managed disks for VM disks**

Make sure to use managed disks, as managed disks provide better reliability for VMs in an availability set. Managed disks are sufficiently isolated from each other to avoid single points of failure. Also, managed disks aren’t subject to the IOPS limits of VHDs created in a storage account.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-5/vm-5.kql":::

---

### Disaster recovery

#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-4: Replicate VMs using Azure Site Recovery**
When you replicate Azure VMs using Site Recovery, all the VM disks are continuously replicated to the target region asynchronously. The recovery points are created every few minutes. This gives you a Recovery Point Objective (RPO) in the order of minutes. You can conduct disaster recovery drills as many times as you want, without affecting the production application or the ongoing replication.

To learn how to run a disaster recovery drill, see [Run a test failover](/azure/site-recovery/site-recovery-test-failover-to-azure).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-4/vm-4.kql":::

---

#### ![This is a medium recommendation.](../reliability/media/icon-recommendation-medium.svg) **VM-7: Backup data on your VMs with Azure Backup service**

The Azure Backup service provides simple, secure, and cost-effective solutions to back up your data and recover it from the Microsoft Azure cloud. For more information, see [What is the Azure Backup Service](/azure/backup/backup-overview).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-7/vm-7.kql":::

---

### Performance

####  ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-6: Host application and database data on a data disk**

A data disk is a managed disk that’s attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose. Hosting you data on a data disk also helps with flexibility when backuping or restoring data, as well as migrating the disk without having to migrate the entire Virtual Machine and Operating System. You will be able to also select a different disk sku, with different type, size, and performance that meet your requirements. For more information on data disks, see [Data Disks](/azure/virtual-machines/managed-disks-overview#data-disk).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-6/vm-6.kql":::

---


#### ![This is a high recommendation.](../reliability/media/icon-recommendation-high.svg) **VM-8: Production VMs should be using SSD disks** 

We have identified that you are using standard disks with your premium-capable Virtual Machines and we recommend you consider upgrading the standard disks to premium disks. For any Single Instance Virtual Machine using premium storage for all Operating System Disks and Data Disks, we guarantee you will have Virtual Machine Connectivity of at least 99.9%. Consider these factors when making your upgrade decision. The first is that upgrading requires a VM reboot and this process takes 3-5 minutes to complete. The second is if the VMs in the list are mission-critical production VMs, evaluate the improved availability against the cost of premium disks.
    
Premium SSD disks offer high-performance, low-latency disk support for I/O-intensive applications and production workloads. Standard SSD Disks are a cost effective storage option optimized for workloads that need consistent performance at lower IOPS levels. Use Standard HDD disks for Dev/Test scenarios and less critical workloads at lowest cost.

For more information on Azure managed disks and disks types, see [Azure managed disk types](/azure/virtual-machines/disks-types#premium-ssd).


For more information on availability sets, see [Availability sets](/azure/virtual-machines/availability#availability-sets).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-8/vm-8.kql":::

---

### ![This is a medium recommendation.](../reliability/media/icon-recommendation-medium.svg) **VM-10: Enable Accelerated Networking (AccelNet)** 

AccelNet enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the data path, which reduces latency, jitter, and CPU utilization for the most demanding network workloads on supported VM types.

For more information on Accelerated Networking, see [Accelerated Networking](/azure/virtual-network/accelerated-networking-overview?tabs=redhat.)


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-10/vm-10.kql":::

---


#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-11: Accelerated Networking is enabled, make sure you update the GuestOS NIC driver every 6 months** 

When AccelNet is enabled, the default Azure Virtual Network interface in the GuestOS is replaced for a Mellanox and consecutively its driver is provided from a 3rd party vendor. Marketplace images maintained by Microsoft are offered with the latest version of Mellanox drivers, however, once the Virtual Machine is deployed, the customer is responsible for maintaining the driver up to date.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-11/vm-11.kql":::

---

### Management

#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-9: Watch for VMs in Stopped state** 
Azure Virtual Machines (VM) instances go through different states. There are provisioning and power states. If a Virtual Machine is not running that indicates the Virtual Machine might facing an issue or is no longer necessary and could be removed helping to reduce costs.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-9/vm-9.kql":::

---

#### ![This is a high recommendation.](../reliability/media/icon-recommendation-high.svg) **VM-22: Use maintenance configurations for the VM**

The maintenance configuration settings allows user to schedule and manage updates, ensuring the VM updates/interruptions are done in planned time frame. For more information on managing VM updates with maintenance configurations, see [Managing VM updates with Maintenance Configurations](maintenance-configurations.md).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-22/vm-22.kql":::

---

### Security

#### ![This is a medium recommendation.](../reliability/media/icon-recommendation-medium.svg) **VM-12: VMs should not have a Public IP directly associated** 

If a VM requires outbound internet connectivity, we recommend the use of NAT Gateway or Azure Firewall. NAT Gateway or Azure Firewall help to increase security and resiliency of the service, since both services have much higher availability and [Source Network Address Translation (SNAT)](/azure/load-balancer/load-balancer-outbound-connections) ports. For inbound internet connectivity, we recommend using a load balancing solution such as Azure Load Balancer and Application Gateway.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-12/vm-12.kql":::

---


#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-13: Virtual Network Interfaces have an NSG associated**

Unless you have a specific reason to, we recommend that you associate a network security group to a subnet, or a network interface, but not both. Since rules in a network security group associated to a subnet can conflict with rules in a network security group associated to a network interface, you can have unexpected communication problems that require troubleshooting. For more information, see [Intra-Subnet traffic](/azure/virtual-network/network-security-group-how-it-works#intra-subnet-traffic).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-13/vm-13.kql":::

---


#### ![This is a medium recommendation.](../reliability/media/icon-recommendation-medium.svg) **VM-14: IP Forwarding should only be enabled for Network Virtual Appliances** 

IP forwarding enables the virtual machine network interface to:

- Receive network traffic not destined for one of the IP addresses assigned to any of the IP configurations assigned to the network interface.

- Send network traffic with a different source IP address than the one assigned to one of a network interface’s IP configurations.

The setting must be enabled for every network interface that is attached to the virtual machine that receives traffic that the virtual machine needs to forward. A virtual machine can forward traffic whether it has multiple network interfaces or a single network interface attached to it. While IP forwarding is an Azure setting, the virtual machine must also run an application able to forward the traffic, such as firewall, WAN optimization, and load balancing applications.

To learn how to enable or disable IP forwarding, see [Enable or disable IP forwarding](/azure/virtual-network/virtual-network-network-interface?tabs=azure-portal#enable-or-disable-ip-forwarding).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-14/vm-14.kql":::

---


#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-17: Network access to the VM disk should be set to "Disable public access and enable private access"**

It is recommended that you set VM disk network access to “Disable public access and enable private access” and create a private endpoint. To learn how to create a private endpoint, see [Create a private endpoint](/azure/virtual-machines/disks-enable-private-links-for-import-export-portal#create-a-private-endpoint).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-17/vm-17.kql":::

---


#### ![This is a medium recommendation.](../reliability/media/icon-recommendation-medium.svg) **VM-19: Enable disk encryption and data at rest encryption by default** 

There are several types of encryption available for your managed disks, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE) and encryption at host.

- Azure Disk Encryption helps protect and safeguard your data to meet your organizational security and compliance commitments.
- Azure Disk Storage Server-Side Encryption (also referred to as encryption-at-rest or Azure Storage encryption) automatically encrypts data stored on Azure managed disks (OS and data disks) when persisting on the Storage Clusters.
- Encryption at host ensures that data stored on the VM host hosting your VM is encrypted at rest and flows encrypted to the Storage clusters.
- Confidential disk encryption binds disk encryption keys to the virtual machine’s TPM and makes the protected disk content accessible only to the VM.

For more information about managed disk encryption options, see [Overview of managed disk encryption options](./disk-encryption-overview.md).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-19/vm-19.kql":::

---

### Networking

#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-15: Customer DNS Servers should be configured in the Virtual Network level**

Configure the DNS Server in the Virtual Network to avoid name resolution inconsistency across the environment. For more information on Name resolution for resources in Azure virtual networks, see [Name resolution for VMs and cloud services](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances?tabs=redhat).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-15/vm-15.kql":::

---


### Storage

#### ![This is a medium recommendation.](../reliability/media/icon-recommendation-medium.svg) **VM-16: Shared disks should only be enabled in clustered servers**

Azure shared disks is a feature for Azure managed disks that enables you to attach a managed disk to multiple virtual machines (VMs) simultaneously. Attaching a managed disk to multiple VMs allows you to either deploy new or migrate existing clustered applications to Azure, and should only be used in those situations where the disk will be assigned to more than one Virtual Machine member of a Cluster.

To learn more about how to enable shared disks for managed disks, see [Enable shared disk](/azure/virtual-machines/disks-shared-enable?tabs=azure-portal).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-16/vm-16.kql":::

---


### Compliance

#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-18: Ensure that your VMs are compliant with Azure Policies**

It’s important to keep your virtual machine (VM) secure for the applications that you run. Securing your VMs can include one or more Azure services and features that cover secure access to your VMs and secure storage of your data. To get more information on how to keep your VM and applications secure, see [Azure Policy Regulatory Compliance controls for Azure Virtual Machines](/azure/virtual-machines/security-controls-policy).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-18/vm-18.kql":::

---

### Monitoring

#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-20: Enable VM Insights** 

Enable [VM Insights](/azure/azure-monitor/vm/vminsights-overview). to get more visibility into the health and performance of your virtual machine. VM insights monitors the performance and health of your virtual machines and virtual machine scale sets. It monitors their running processes and dependencies on other resources. VM insights can help deliver predictable performance and availability of vital applications by identifying performance bottlenecks and network issues. It can also help you understand whether an issue is related to other dependencies.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-20/vm-20.kql":::

---


#### ![This is a low recommendation.](../reliability/media/icon-recommendation-low.svg) **VM-21: Configure diagnostic settings for all Azure resources**

Platform metrics are sent automatically to Azure Monitor Metrics by default and without configuration. Platform logs provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on:

- Resource logs aren’t collected until they’re routed to a destination.
- Activity logs exist on their own but can be routed to other locations.
- 
Each Azure resource requires its own diagnostic setting, which defines the following criteria:

- Sources: The type of metric and log data to send to the destinations defined in the setting. The available types vary by resource type.
- Destinations: One or more destinations to send to.

A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), create multiple settings. Each resource can have up to five diagnostic settings.

Fore information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal).


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machines/code/vm-21/vm-21.kql":::

---



## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.

Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Virtual machines support availability zones with three availability zones per supported Azure region and are also zone-redundant and zonal. For more information, see [availability zones support](../reliability/availability-zones-service-support.md). The customer will be responsible for configuring and migrating their virtual machines for availability. Refer to the following readiness options below for availability zone enablement:

- See [availability options for VMs](./availability.md)
- Review [availability zone service and region support](../reliability/availability-zones-service-support.md)
- [Migrate existing VMs](../reliability/migrate-vm.md) to availability zones

 
### Prerequisites

- Your virtual machine SKUs must be available across the zones in for your region. To review which regions support availability zones, see the [list of supported regions](../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support). 

- Your VM SKUs must be available across the zones in your region. To check for VM SKU availability, use one of the following methods:

    - Use PowerShell to [Check VM SKU availability](windows/create-PowerShell-availability-zone.md#check-vm-sku-availability).
    - Use the Azure CLI to [Check VM SKU availability](linux/create-cli-availability-zone.md#check-vm-sku-availability).
    - Go to [Foundational Services](../reliability/availability-zones-service-support.md#an-icon-that-signifies-this-service-is-foundational-foundational-services).
    

### SLA improvements

Because availability zones are physically separate and provide distinct power source, network, and cooling, SLAs (Service-level agreements) increase. For more information, see the [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/).

#### Create a resource with availability zone enabled

Get started by creating a virtual machine (VM) with availability zone enabled from the following deployment options below:
- [Azure CLI](./linux/create-cli-availability-zone.md)
- [PowerShell](./windows/create-powershell-availability-zone.md)
- [Azure portal](./create-portal-availability-zone.md)

### Zonal failover support

Customers can set up virtual machines to failover to another zone using the Site Recovery service. For more information, see [Site Recovery](../site-recovery/site-recovery-overview.md).

### Fault tolerance

Virtual machines can failover to another server in a cluster, with the VM's operating system restarting on the new server. Customers should refer to the failover process for disaster recovery, gathering virtual machines in recovery planning, and running disaster recovery drills to ensure their fault tolerance solution is successful.

For more information, see the [site recovery processes](../site-recovery/site-recovery-failover.md#before-you-start).


### Zone down experience

During a zone-wide outage, you should expect a brief degradation of performance until the virtual machine service self-healing re-balances underlying capacity to adjust to healthy zones. This isn't dependent on zone restoration; it's expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones.

Customers should also prepare for the possibility that there's an outage of an entire region. If there's a service disruption for an entire region, the locally redundant copies of your data would temporarily be unavailable. If geo-replication is enabled, three additional copies of your Azure Storage blobs and tables are stored in a different region. In the event of a complete regional outage or a disaster in which the primary region isn't recoverable, Azure remaps all of the DNS entries to the geo-replicated region.

#### Zone outage preparation and recovery

The following guidance is provided for Azure virtual machines in the case of a service disruption of the entire region where your Azure virtual machine application is deployed:

- Configure [Azure Site Recovery](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-1-initiate-a-failover-by-using-azure-site-recovery) for your VMs
- Check the [Azure Service Health Dashboard](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-2-wait-for-recovery) status if Azure Site Recovery hasn't been configured
- Review how the [Azure Backup service](../backup/backup-azure-vms-introduction.md) works for VMs
    - See the [support matrix](../backup/backup-support-matrix-iaas.md) for Azure VM backups
- Determine which [VM restore option and scenario](../backup/about-azure-vm-restore.md) will work best for your environment

### Low-latency design

Cross Region (secondary region), Cross Subscription (preview), and Cross Zonal (preview) are available options to consider when designing a low-latency virtual machine solution. For more information on these options, see the [supported restore methods](../backup/backup-support-matrix-iaas.md#supported-restore-methods).

>[!IMPORTANT]
>By opting out of zone-aware deployment, you forego protection from isolation of underlying faults. Use of SKUs that don't support availability zones or opting out from availability zone configuration forces reliance on resources that don't obey zone placement and separation (including underlying dependencies of these resources). These resources shouldn't be expected to survive zone-down scenarios. Solutions that leverage such resources should define a disaster recovery strategy and configure a recovery of the solution in another region.

### Safe deployment techniques

When you opt for availability zones isolation, you should utilize safe deployment techniques for application code, as well as application upgrades. In addition to configuring Azure Site Recovery, below are recommended safe deployment techniques for VMs:

- [Virtual Machine Scale Sets](/azure/virtual-machines/flexible-virtual-machine-scale-sets)
- [Availability Sets](./availability-set-overview.md)
- [Azure Load Balancer](../load-balancer/load-balancer-overview.md)
- [Azure Storage Redundancy](../storage/common/storage-redundancy.md)



 As Microsoft periodically performs planned maintenance updates, there may be rare instances when these updates require a reboot of your virtual machine to apply the required updates to the underlying infrastructure. To learn more, see [availability considerations](./maintenance-and-updates.md#availability-considerations-during-scheduled-maintenance) during scheduled maintenance. 

Follow the health signals below for monitoring before upgrading your next set of nodes in another zone:

- Check the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) for the virtual machines service status for your expected regions
- Ensure that [replication](../site-recovery/azure-to-azure-quickstart.md) is enabled on your VMs


### Availability zone redeployment and migration

For migrating existing virtual machine resources to a zone redundant configuration, refer to the below resources:

- Move a VM to another subscription or resource group
    - [CLI](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-cli)
    - [PowerShell](/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-azure-powershell)
- [Azure Resource Mover](/azure/resource-mover/tutorial-move-region-virtual-machines)
- [Move Azure VMs to availability zones](../site-recovery/move-azure-vms-avset-azone.md)
- [Move region maintenance configuration resources](./move-region-maintenance-configuration-resources.md)

## Disaster recovery: cross-region failover

In the case of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](../site-recovery/azure-to-azure-architecture.md).

Customers can use Cross Region to restore Azure VMs via paired regions. You can restore all the Azure VMs for the selected recovery point if the backup is done in the secondary region. For more details on Cross Region restore, refer to the Cross Region table row entry in our [restore options](../backup/backup-azure-arm-restore-vms.md#restore-options).


### Cross-region disaster recovery in multi-region geography

While Microsoft is working diligently to restore the virtual machine service for region-wide service disruptions, customers will have to rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data strategies for disaster recovery](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan).

#### Outage detection, notification, and management

When the hardware or the physical infrastructure for the virtual machine fails unexpectedly. This can include local network failures, local disk failures, or other rack level failures. When detected, the Azure platform automatically migrates (heals) your virtual machine to a healthy physical machine in the same data center. During the healing procedure, virtual machines experience downtime (reboot) and in some cases loss of the temporary drive. The attached OS and data disks are always preserved.

For more detailed information on virtual machine service disruptions, see [disaster recovery guidance](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance).

#### Set up disaster recovery and outage detection 

When setting up disaster recovery for virtual machines, understand what [Azure Site Recovery provides](../site-recovery/site-recovery-overview.md#what-does-site-recovery-provide). Enable disaster recovery for virtual machines with the below methods:

- Set up disaster recovery to a [secondary Azure region for an Azure VM](../site-recovery/azure-to-azure-quickstart.md)
- Create a Recovery Services vault
    - [Bicep](../site-recovery/quickstart-create-vault-bicep.md)
    - [ARM template](../site-recovery/quickstart-create-vault-template.md)
- Enable disaster recovery for [Linux virtual machines](./linux/tutorial-disaster-recovery.md)
- Enable disaster recovery for [Windows virtual machines](./windows/tutorial-disaster-recovery.md)
- Failover virtual machines to [another region](../site-recovery/azure-to-azure-tutorial-failover-failback.md)
- Failover virtual machines to the [primary region](../site-recovery/azure-to-azure-tutorial-failback.md#fail-back-to-the-primary-region)

### Single-region geography disaster recovery

With disaster recovery set up, Azure VMs will continuously replicate to a different target region. If an outage occurs, you can fail over VMs to the secondary region, and access them from there.

When you replicate Azure VMs using [Site Recovery](../site-recovery/site-recovery-overview.md), all the VM disks are continuously replicated to the target region asynchronously. The recovery points are created every few minutes. This gives you a Recovery Point Objective (RPO) in the order of minutes. You can conduct disaster recovery drills as many times as you want, without affecting the production application or the ongoing replication. For more information, see [Run a disaster recovery drill to Azure](../site-recovery/tutorial-dr-drill-azure.md).

For more information, see [Azure VMs architectural components](../site-recovery/azure-to-azure-architecture.md#architectural-components) and [region pairing](./regions.md#region-pairs).

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the Shared Responsibility Model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there's no guarantee of capacity at time of impact for those who haven't pre-allocated.

For deploying virtual machines, customers can use [flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration) mode on Virtual Machine Scale Sets. All VM sizes can be used with flexible orchestration mode. Flexible orchestration mode also offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone.

## Additional guidance

- [Well-Architected Framework for virtual machines](/azure/architecture/framework/services/compute/virtual-machines/virtual-machines-review)
- [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture)
- [Accelerated networking with Azure VM disaster recovery](/azure/site-recovery/azure-vm-disaster-recovery-with-accelerated-networking)
- [Express Route with Azure VM disaster recovery](../site-recovery/azure-vm-disaster-recovery-with-expressroute.md)
- [Virtual Machine Scale Sets](../virtual-machine-scale-sets/index.yml)

## Next steps
> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/reliability/availability-zones-overview)
