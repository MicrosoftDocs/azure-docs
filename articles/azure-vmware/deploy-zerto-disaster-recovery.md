---
title: Deploy Zerto Disaster Recovery on Azure VMware Solution (Initial Availability)
description: Learn how to implement Zerto Disaster Recovery for on-premises VMware or Azure VMware Solution virtual machines. 
ms.topic: how-to 
ms.date: 10/25/2021

---

# Deploy Zerto Disaster Recovery on Azure VMware Solution (Initial Availability)

This article explains how to implement disaster recovery (DR) for on-premises VMware or Azure VMware Solution-based virtual machines (VMs). The solution in this article uses [Zerto Disaster Recovery](https://www.zerto.com/solutions/use-cases/disaster-recovery/). Instances of Zerto are deployed at both the protected and the recovery sites. 

Zerto is a disaster recovery solution designed to minimize downtime of the VMs if there was a disaster. Zerto's platform is built on the foundation of Continuous Data Protection (CDP), which enables minimal or close to no data loss. It provides the level of protection wanted for many business-critical and mission-critical enterprise applications. Zerto also automates and orchestrates failover and failback, ensuring minimal downtime in a disaster. Overall, Zerto simplifies management through automation and ensures fast and highly predictable recovery times.


## Core components of the Zerto platform

| Component | Description |
| --- | --- |
| **Zerto Virtual Manager (ZVM)**   | Management application for Zerto implemented as a Windows service installed on a Windows VM. The private cloud administrator installs and manages the Windows VM. The ZVM enables Day 0 and Day 2 DR configuration. For example, configuring primary and disaster recovery sites, protecting VMs, recovering VMs, and so on. However, it doesn't handle the replication data of the protected customer VMs.     |
| **Virtual Replication appliance (vRA)**   | Linux VM to handle data replication from the source to the replication target. One instance of vRA is installed per ESXi host, delivering a true scale architecture that grows and shrinks along with the private cloud's hosts. The VRA manages data replication to and from protected VMs to its local or remote target, storing the data in the journal.    |
| **Zerto ESXi host driver**   | Installed on each VMware ESXi host configured for Zerto DR. The host driver intercepts a vSphere VM's IO and sends the replication data to the chosen vRA for that host. The vRA is then responsible for replicating the VM's data to one or more DR targets.    |
| **Zerto Cloud Appliance (ZCA)**   | Windows VM only used when Zerto is used to recover vSphere VMs as Azure Native IaaS VMs. The ZCA is composed of:<ul><li>**ZVM:** A Windows service that hosts the UI and integrates with the native APIs of Azure for management and orchestration.</li><li>**VRA:** A Windows service that replicates the data from or to Azure.</li></ul>The ZCA integrates natively with the platform it's deployed on, allowing you to use Azure Blob storage within a storage account on Microsoft Azure. As a result, it ensures the most cost-efficient deployment on each of these platforms.   |
| **Virtual Protection Group (VPG)**   | Logical group of VMs created on the ZVM. Zerto allows configuring DR, Backup, and Mobility policies on a VPG. This mechanism enables a consistent set of policies to be applied to a group of VMs.  |


To learn more about Zerto platform architecture, see the [Zerto Platform Architecture Guide](https://www.zerto.com/wp-content/uploads/2021/07/Zerto-Platform-Architecture-Guide.pdf). 


## Supported Zerto scenarios

You can use Zerto with Azure VMware Solution for the following three scenarios. 

### Scenario 1: On-premises VMware to Azure VMware Solution DR

In this scenario, the primary site is an on-premises vSphere-based environment. The disaster recovery site is an Azure VMware Solution private cloud. 

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-1.png" alt-text="Diagram showing Scenario 1 for the Zerto disaster recovery solution on Azure VMware Solution." border="false":::


### Scenario 2: Azure VMware Solution to Azure VMware Solution cloud DR

In this scenario, the primary site is an Azure VMware Solution private cloud in one Azure Region. The disaster recovery site is an Azure VMware Solution private cloud in a different Azure Region.

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-2.png" alt-text="Diagram showing scenario 2 for the Zerto DR solution on Azure VMware Solution." border="false":::


### Scenario 3: Azure VMware Solution to IaaS VMs cloud DR

In this scenario, the primary site is an Azure VMware Solution private cloud in one Azure Region. Azure Blobs and Azure IaaS (Hyper-V based) VMs are used in times of Disaster.

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-3.png" alt-text="Diagram showing Scenario 3 for the Zerto DR solution on Azure VMware Solution." border="false":::



## Prerequisites

### On-premises VMware to Azure VMware Solution DR

- Azure VMware Solution private cloud deployed as a secondary region.

- VPN or ExpressRoute connectivity between on-premises and Azure VMware Solution.



### Azure VMware Solution to Azure VMware Solution cloud DR

- Azure VMware Solution private cloud must be deployed in the primary and secondary region.

   :::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-scenario-2a-prerequisite.png" alt-text="Diagram shows the first prerequisite for Scenario 2 of the Zerto DR solution on Azure VMware Solution.":::
 
- Connectivity, like ExpressRoute Global Reach, between the source and target Azure VMware Solution private cloud.

### Azure VMware Solution IaaS VMs cloud DR

- Network connectivity, ExpressRoute based, from Azure VMware Solution to the vNET used for disaster recovery.   

- Follow the [Zerto Virtual Replication Azure Enterprise Guidelines](http://s3.amazonaws.com/zertodownload_docs/Latest/Zerto%20Virtual%20Replication%20Azure%20Enterprise%20Guidelines.pdf) for the rest of the prerequisites.



## Install Zerto on Azure VMware Solution

Currently, Zerto DR on Azure VMware Solution is in Initial Availability (IA) phase. In the IA phase, you must contact Microsoft to request and qualify for IA support.

To request IA support for Zerto on Azure VMware Solution, send an email request to zertoonavs@microsoft.com. In the IA phase, Azure VMware Solution only supports manual installation and onboarding of Zerto. However, Microsoft will work with you to ensure that you can manually install Zerto on your private cloud.

> [!NOTE]
> As part of the manual installation, Microsoft will create a new vCenter user account for Zerto. This user account is only for Zerto Virtual Manager (ZVM) to perform operations on the Azure VMware Solution vCenter. When installing ZVM on Azure VMware Solution, don’t select the “Select to enforce roles and permissions using Zerto vCenter privileges” option. 


:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-install-4.png" alt-text="Example shows the vCenter Server Connectivity window with instructions to NOT select the checkbox at the bottom.":::

After the ZVM installation, select the options below from the Zerto Virtual Manager **Site Settings**. 

:::image type="content" source="media/zerto-disaster-recovery/zerto-disaster-recovery-install-5.png" alt-text="Image demonstrates to select all of the blue checkboxes shown in the **Workload Automation** section, located on the left sidebar":::

>[!NOTE]
>General Availability of Azure VMware Solution will enable self-service installation and Day 2 operations of Zerto on Azure VMware Solution.


## Configure Zerto for disaster recovery

To configure Zerto for the on-premises VMware to Azure VMware Solution DR and Azure VMware Solution to Azure VMware Solution Cloud DR scenarios, see the [Zerto Virtual Manager Administration Guide vSphere Environment](https://s3.amazonaws.com/zertodownload_docs/8.5_Latest/Zerto%20Virtual%20Manager%20vSphere%20Administration%20Guide.pdf?cb=1629311409).


For more information, see the [Zerto technical documentation](https://www.zerto.com/myzerto/technical-documentation/). Alternatively, you can download all the Zerto guides part of the [v8.5 Search Tool for Zerto Software PDFs documentation bundle](https://s3.amazonaws.com/zertodownload_docs/8.5_Latest/SEARCH_TOOL.zip?cb=1629311409).



## Ongoing management of Zerto

- As you scale your Azure VMware Solution private cloud operations, you might need to add new Azure VMware Solution hosts for Zerto protection or configure Zerto DR to new Azure VMware Solution vSphere Clusters. In both these scenarios, you'll be required to open a Support Request with the Azure VMware Solution team in the Initial Availability phase. You can open the [support ticket](https://rc.portal.azure.com/#create/Microsoft.Support) from the Azure portal for these Day 2 configurations. 

   :::image type="content" source="media/zerto-disaster-recovery/support-request-zerto-disaster-recovery.png" alt-text="Screenshot showing the support request for Day 2 Zerto DR configurations.":::


- In the GA phase, all the above operations will be enabled in an automated self-service fashion.


## FAQs

### Can I use a pre-existing Zerto product license on Azure VMware Solution?

You can reuse pre-existing Zerto product licenses for Azure VMware Solution environments. If you need new Zerto licenses, email Zerto at **info@zerto.com** to acquire new licenses. 

### How is Zerto supported?

Zerto DR is a solution that is sold and supported by Zerto. For any support issue with Zerto DR, always contact [Zerto support](https://www.zerto.com/company/support-and-service/support/).

Zerto and Microsoft support teams will engage each other as needed to troubleshoot Zerto DR issues on Azure VMware Solution.

