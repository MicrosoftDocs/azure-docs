---
title: Deploy Zerto disaster recovery on Azure VMware Solution
description: Learn how to implement Zerto disaster recovery for on-premises VMware or Azure VMware Solution virtual machines. 
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 12/11/2023
ms.custom: engagement-fy23
---

# Deploy Zerto disaster recovery on Azure VMware Solution

> [!IMPORTANT]
> ### Zerto limitations on Azure VMware Solution
> - AV64 node type is again supported as of Zerto version 3.7.11 (previously it wasn't).
> - Zerto supports from Version Zerto 10.0 U5 onwards.
> - DNS and network configuration changes for Zerto Virtual Machine aren't supported after installation.
> - Azure resource group modifications aren't supported after Zerto installation.

> [!Note]
> ### Known Issues with Zerto on Azure VMware Solution
> - Virtual Machine(s) replications may be disrupted during Azure VMware Solution upgrade maintenance.
> - Virtual Machine(s) replications may be disrupted during Azure VMware Solution host replacement maintenance.
> - For other Zerto related know issues [Click here](https://help.zerto.com/bundle/Install.AVS.HTML.10.0_U5/page/known_issues_and_limitations.html)

In this article, learn how to implement disaster recovery for on-premises VMware or Azure VMware Solution-based virtual machines (VMs). The solution in this article uses [Zerto disaster recovery](https://www.zerto.com/solutions/use-cases/disaster-recovery/). Instances of Zerto are deployed at both the protected and the recovery sites.

Zerto is a disaster recovery solution designed to minimize downtime of VMs should a disaster occur. Zerto's platform is built on the foundation of Continuous Data Protection (CDP) that enables minimal or close to no data loss. The platform provides the level of protection wanted for many business-critical and mission-critical enterprise applications. Zerto also automates and orchestrates failover and failback to ensure minimal downtime in a disaster. Overall, Zerto simplifies management through automation and ensures fast and highly predictable recovery times.

## Core components of the Zerto platform

| Component | Description |
| --- | --- |
| **Zerto Virtual Manager Appliance (ZVMA)**   | ZVMA is a management appliance that runs on a secure Linux operating system. The ZVMA enables Day 0 and Day 2 disaster recovery configuration. For example, configuring primary and disaster recovery sites, protecting VMs, recovering VMs, and so on. However, it doesn't handle the replication data of the protected customer Virtual Machines.     |
| **Virtual Replication appliance (vRA)**   | Linux VM to handle data replication from the source to the replication target. One instance of vRA is installed per ESXi host, delivering a true scale architecture that grows and shrinks along with the private cloud's hosts. The vRA manages data replication to and from protected VMs to its local or remote target, storing the data in the journal.    |
| **Zerto ESXi host driver**   | Installed on each VMware ESXi host configured for Zerto disaster recovery. The host driver intercepts a vSphere VM's IO and sends the replication data to the chosen vRA for that host. The vRA is then responsible for replicating the VM's data to one or more disaster recovery targets.    |
| **Zerto Cloud Appliance (ZCA)**   | Windows VM only used when Zerto is used to recover vSphere VMs as Azure Native IaaS VMs. The ZCA is composed of:<ul><li>**ZVM:** A Windows service that hosts the UI and integrates with the native APIs of Azure for management and orchestration.</li><li>**VRA:** A Windows service that replicates the data from or to Azure.</li></ul>The ZCA integrates natively with the platform it gets deployed on, allowing you to use Azure Blob storage within a storage account on Microsoft Azure. As a result, it ensures the most cost-efficient deployment on each of these platforms.   |
| **Virtual Protection Group (VPG)**   | Logical group of VMs created on the ZVM. Zerto allows configuring disaster recovery, Backup, and Mobility policies on a VPG. This mechanism enables a consistent set of policies to be applied to a group of VMs.  |

To learn more about Zerto platform architecture, see the [Zerto Platform Architecture Guide](https://www.zerto.com/wp-content/uploads/2021/07/Zerto-Platform-Architecture-Guide.pdf).

## Supported Zerto scenarios

You can use Zerto with Azure VMware Solution for the following three scenarios. 

> [!NOTE]
> For Azure NetApp Files (ANFs), [Azure VMware Solution](/azure/azure-vmware/introduction) supports Network File System (NFS) datastores as a persistent storage option. You can create NFS datastores with Azure NetApp Files volumes and attach them to clusters of your choice. You can also create virtual machines (VMs) for optimal cost and performance. To use ANF datastores, select them as a Recovery Datastore in the Zerto VPG wizard when creating or editing a VPG.

> [!TIP]
> Explore more about ANF datastores and how to [Attach Azure NetApp datastores to Azure VMware Solution hosts](/azure/azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts?tabs=azure-portal).

### Scenario 1: On-premises VMware vSphere to Azure VMware Solution disaster recovery

In this scenario, the primary site is an on-premises vSphere-based environment. The disaster recovery site is an Azure VMware Solution private cloud. 

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-1-diagram.png" alt-text="Diagram showing Scenario 1 for the Zerto disaster recovery solution on Azure VMware Solution."lightbox="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-1-diagram.png":::

### Scenario 2: Azure VMware Solution to Azure VMware Solution cloud disaster recovery

In this scenario, the primary site is an Azure VMware Solution private cloud in one Azure Region. The disaster recovery site is an Azure VMware Solution private cloud in a different Azure Region.

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-2-diagram.png" alt-text="Diagram showing scenario 2 for the Zerto disaster recovery solution on Azure VMware Solution."lightbox="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-2-diagram.png":::

### Scenario 3: Azure VMware Solution to Azure VMs cloud disaster recovery

In this scenario, the primary site is an Azure VMware Solution private cloud in one Azure Region. Azure Blobs and Azure VMs (Hyper-V based) are used in times of Disaster.

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-3-diagram.png" alt-text="Diagram showing Scenario 3 for the Zerto disaster recovery solution on Azure VMware Solution."lightbox="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-3-diagram.png":::

## Prerequisites

### On-premises VMware to Azure VMware Solution disaster recovery

- Azure VMware Solution private cloud deployed as a secondary region.

- VPN or ExpressRoute connectivity between on-premises and Azure VMware Solution.

### Azure VMware Solution to Azure VMware Solution cloud disaster recovery

- Azure VMware Solution private cloud must be deployed in the primary and secondary regions.

   :::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-2a-prerequisite.png" alt-text="Diagram shows the first prerequisite for Scenario 2 of the Zerto disaster recovery solution on Azure VMware Solution.":::

- Connectivity, like ExpressRoute Global Reach, between the source and target Azure VMware Solution private cloud.

### Azure VMware Solution IaaS VMs cloud disaster recovery

- Network connectivity, ExpressRoute based, from Azure VMware Solution to the virtual network used for disaster recovery.

- Follow the [Zerto Virtual Replication Azure Quickstart Guide](https://help.zerto.com/bundle/Install.MA.HTML.10.0_U1/page/Prerequisites_Requirements_Microsoft_Azure_Environments.htm) for the rest of the prerequisites.

## Install Zerto on Azure VMware Solution

To deploy Zerto on Azure VMware Solution, follow these [instructions](https://help.zerto.com/bundle/Install.AVS.HTML.10.0_U5/page/zerto_deployment_and_configuration.html).

## Support

Zerto disaster recovery is a solution sold and supported by Zerto handles installation, configuration, upgrades, uninstallation, and lifecycle management. Customers must contact Zerto for the first point of contact. 

For advanced troubleshooting, Zerto support team coordinates with Microsoft for necessary logs. These logs will be shared by Microsoft Support in accordance with a Severity 3 and 4 priority level.

For further details, please reach out to the [Zerto Support](https://www.zerto.com/myzerto/support/)

## FAQs

### Can I create Microsoft support ticket for Zerto issues?

No, Zerto customers should reach out Zerto for all supports related issues including installation, configuration, upgrades, uninstallation, licenses and lifecycle management. Microsoft will assist only infrastructure level.

### Who support Zerto on-premises related issues?

Zerto supports on-premises issues, including site pairing, connectivity.

### Does Zerto supports Static IP configuration in VRA installation?

Zerto strongly recommend installing the VRAs at the cluster level and inputting an IP Pool range of dedicated VRA IPs within the “VRA Network Details”. Allowing Zerto to automatically manage installation of VRAs as cluster changes occur in the Azure VMware Solution environment.

### Can I upgrade Zerto product version in Azure VMware Solution?

Yes, Zerto upgrades are part of self-service, as Zerto customers, you can upgrade in ZVM web console.

### How to download Zerto ZVM appliance log?

[ZVM Appliance Log Collection](https://help.zerto.com/bundle/Linux.ZVM.HTML.10.0_U5/page/ZVM_Linux_Log_Collection.htm)

### Can I use a preexisting Zerto product license on Azure VMware Solution?

You can reuse preexisting Zerto product licenses for Azure VMware Solution environments. If you need new Zerto licenses, email Zerto at **info@zerto.com** to acquire new licenses.

