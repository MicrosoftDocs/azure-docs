---
title: Deploy Zerto disaster recovery on Azure VMware Solution
description: Learn how to implement Zerto disaster recovery for on-premises VMware or Azure VMware Solution virtual machines. 
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 12/11/2023
ms.custom: engagement-fy23
# Customer intent: As an IT administrator, I want to implement Zerto disaster recovery for my on-premises VMware and Azure VMware Solution virtual machines, so that I can ensure minimal downtime and data loss during adverse situations.
---

# Deploy Zerto disaster recovery on Azure VMware Solution

Zerto is a disaster recovery solution designed to minimize downtime of VMs should a disaster occur. Zerto's platform is built on the foundation of Continuous Data Protection (CDP) that enables minimal or close to no data loss. The platform provides the level of protection wanted for many business-critical and mission-critical enterprise applications. Zerto also automates and orchestrates failover and failback to ensure minimal downtime in a disaster. Overall, Zerto simplifies management through automation and ensures fast and highly predictable recovery times.

## Prerequisites
**On‑Premises VMware to Azure VMware Solution Disaster Recovery**
- An Azure VMware Solution private cloud deployed in the designated secondary region
- VPN or ExpressRoute connectivity between the on‑premises datacenter and Azure VMware Solution

**Azure VMware Solution to Azure VMware Solution Disaster Recovery**
- Azure VMware Solution private clouds deployed in both primary and secondary regions
- Connectivity, like ExpressRoute Global Reach, between the source and target Azure VMware Solution private cloud.

**Azure VMware Solution IaaS VMs to Cloud Disaster Recovery**
- Network connectivity, ExpressRoute based, from Azure VMware Solution to the virtual network used for disaster recovery.
- Follow the [Zerto Virtual Replication Azure Quickstart Guide](https://help.zerto.com/bundle/Install.MA.HTML.10.0_U1/page/Prerequisites_Requirements_Microsoft_Azure_Environments.htm) for all remaining prerequisites and configuration steps.

## Core components of the Zerto platform

| Component | Description |
| --- | --- |
| **Zerto Virtual Manager Appliance (ZVML)**   | ZVML is a management appliance that runs on a secure Linux operating system. The ZVML enables Day 0 and Day 2 disaster recovery configuration. For example, configuring primary and disaster recovery sites, protecting VMs, recovering VMs, and so on. However, it doesn't handle the replication data of the protected customer Virtual Machines.     |
| **Virtual Replication appliance (vRA)**   | Linux VM to handle data replication from the source to the replication target. One instance of vRA is installed per ESXi host, delivering a true scale architecture that grows and shrinks along with the private cloud's hosts. The vRA manages data replication to and from protected VMs to its local or remote target, storing the data in the journal.    |
| **Zerto ESXi host driver**   | Installed on each VMware ESXi host configured for Zerto disaster recovery. The host driver intercepts a vSphere VM's IO and sends the replication data to the chosen vRA for that host. The vRA is then responsible for replicating the VM's data to one or more disaster recovery targets.    |
| **Zerto Cloud Appliance (ZCA)**   | Windows VM only used when Zerto is used to recover vSphere VMs as Azure Native IaaS VMs. The ZCA is composed of:<ul><li>**ZVM:** A Windows service that hosts the UI and integrates with the native APIs of Azure for management and orchestration.</li><li>**VRA:** A Windows service that replicates the data from or to Azure.</li></ul> The ZCA integrates natively with the platform it gets deployed on, allowing you to use Azure Blob storage within a storage account on Microsoft Azure. As a result, it ensures the most cost-efficient deployment on each of these platforms.   |
| **Virtual Protection Group (VPG)**   | Logical group of VMs created on the ZVM. Zerto allows configuring disaster recovery, Backup, and Mobility policies on a VPG. This mechanism enables a consistent set of policies to be applied to a group of VMs.  |

To learn more about Zerto platform architecture, see the [Zerto Platform Architecture Guide](https://help.zerto.com/bundle/Admin.VC.HTML.10.8/page/The_Zerto_Solution_Architecture.htm).

In this article, learn how to implement disaster recovery for on-premises VMware or Azure VMware Solution-based virtual machines (VMs). The solution in this article uses [Zerto disaster recovery](https://www.zerto.com/solutions/use-cases/disaster-recovery/). Instances of Zerto are deployed at both the protected and the recovery sites.

Zerto is a disaster recovery solution designed to minimize downtime of VMs should a disaster occur. Zerto's platform is built on the foundation of Continuous Data Protection (CDP) that enables minimal or close to no data loss. The platform provides the level of protection wanted for many business-critical and mission-critical enterprise applications. Zerto also automates and orchestrates failover and failback to ensure minimal downtime in a disaster. Overall, Zerto simplifies management through automation and ensures fast and highly predictable recovery times.

## Disaster recovery limitations, unsupported, and known issues
- AV64 node types are supported in Zerto version 10.0.8 only with VAIO in Gen1. [Deploy Zerto](https://help.zerto.com/bundle/Install.AVS.HTML.10.8/page/deploying_zerto_10_8_on_azure_vmware_solution_avs_.html)
- DNS and network configuration changes for Zerto Virtual Machine aren't supported after installation.
- Azure resource group modifications aren't supported after Zerto installation.
- Virtual Machine(s) replications may be disrupted during Azure VMware Solution upgrade maintenance.
- Virtual Machine(s) replications may be disrupted during Azure VMware Solution host replacement maintenance.
## Zerto‑Supported external Datastores in Azure VMware Solution

Azure VMware Solution fully supports using Azure NetApp Files and Azure Elastic SAN as persistent storage through both Network File System (NFS) and Virtual Machine File System (VMFS) datastores.
You can provision NFS datastores backed by Azure NetApp Files volumes or VMFS datastores backed by Azure Elastic SAN volumes, then attach them to any Azure VMware Solution cluster as needed. This flexibility allows you to deploy virtual machines with the right balance of performance and cost.
When configuring Zerto, simply choose your Azure NetApp Files or Elastic SAN datastore as the Recovery Datastore within the VPG creation or editing workflow.

Dive deeper into how these storage options integrate with Azure VMware Solution:
- [Azure NetApp datastores to Azure VMware Solution hosts](/azure/azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts?tabs=azure-portal) and 
- [Azure Elastic SAN datastores to Azure VMware Solution hosts](/azure/azure-vmware/configure-azure-elastic-san)


## Supported Zerto scenarios in Azure VMware Solution
### Scenario 1: On-premises VMware vSphere to Azure VMware Solution disaster recovery

In this scenario, the primary site is an on-premises vSphere-based environment. The disaster recovery site is an Azure VMware Solution private cloud. 

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-1-diagram.png" alt-text="Diagram showing Scenario 1 for the Zerto disaster recovery solution on Azure VMware Solution."lightbox="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-1-diagram.png":::

### Scenario 2: Azure VMware Solution to Azure VMware Solution cloud disaster recovery

In this scenario, the primary site is an Azure VMware Solution private cloud in one Azure Region. The disaster recovery site is an Azure VMware Solution private cloud in a different Azure Region.

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-2-diagram.png" alt-text="Diagram showing scenario 2 for the Zerto disaster recovery solution on Azure VMware Solution."lightbox="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-2-diagram.png":::

### Scenario 3: Azure VMware Solution to Azure VMs cloud disaster recovery

In this scenario, the primary site is an Azure VMware Solution private cloud in one Azure Region. Azure Blobs and Azure VMs (Hyper-V based) are used in times of Disaster.

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-3-diagram.png" alt-text="Diagram showing Scenario 3 for the Zerto disaster recovery solution on Azure VMware Solution."lightbox="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-3-diagram.png":::


- Follow the [Zerto Virtual Replication Azure Quickstart Guide](https://help.zerto.com/bundle/Install.MA.HTML.10.0_U1/page/Prerequisites_Requirements_Microsoft_Azure_Environments.htm) for the rest of the prerequisites.

## Install Zerto on Azure VMware Solution

To deploy Zerto on Azure VMware Solution, follow these [instructions](https://help.zerto.com/category/AVS).

## Support

Zerto disaster recovery is a solution sold and supported by Zerto handles installation, configuration, upgrades, uninstallation, and lifecycle management. Customers must contact Zerto for the first point of contact. 

For advanced troubleshooting, Zerto support team coordinates with Microsoft for necessary logs. These logs will be shared by Microsoft Support in accordance with a Severity 3 and 4 priority level.

For further details, please reach out to the [Zerto Support](https://www.zerto.com/myzerto/support/)

## FAQs

### Can I create Microsoft support ticket for Zerto issues?

No, Zerto customers should reach out Zerto for all supports related issues including installation, configuration, upgrades, uninstallation, licenses and lifecycle management. Microsoft will assist only infrastructure level.

### Who supports Zerto on-premises related issues?

Zerto supports on-premises issues, including site pairing, connectivity.

### Does Zerto support external datastores for VM replication?
Azure VMware Solution fully supports using Azure NetApp Files and Azure Elastic SAN as persistent storage through both Network File System (NFS) and Virtual Machine File System (VMFS) datastores.
- [Azure NetApp datastores to Azure VMware Solution hosts](/azure/azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts?tabs=azure-portal) and 
- [Azure Elastic SAN datastores to Azure VMware Solution hosts](/azure/azure-vmware/configure-azure-elastic-san)

### Does Zerto support Static IP configuration in VRA installation?

Zerto strongly recommend installing the VRAs at the cluster level and inputting an IP Pool range of dedicated VRA IPs within the “VRA Network Details”. Allowing Zerto to automatically manage installation of VRAs as cluster changes occur in the Azure VMware Solution environment.

### Can I upgrade Zerto product version in Azure VMware Solution?

Yes, Zerto upgrades are part of self-service, as Zerto customers, you can upgrade in ZVM web console.

### How to download Zerto ZVM appliance log

Zerto logs can be collected from ZVM console.

### Can I use a preexisting Zerto product license on Azure VMware Solution?

You can reuse preexisting Zerto product licenses for Azure VMware Solution environments. If you need new Zerto licenses, email Zerto at **info@zerto.com** to acquire new licenses.

