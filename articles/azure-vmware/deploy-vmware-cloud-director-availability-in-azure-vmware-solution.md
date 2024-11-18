--- 
title: Deploy VMware Cloud Director Availability in Azure VMware Solution
description: Learn how to install and configure VMware Cloud Director Availability in Azure VMware Solution
author: suzuber
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/15/2024
--- 

# Deploy VMware Cloud Director Availability in Azure VMware Solution

In this article, learn how to deploy VMware Cloud Director Availability in Azure VMware Solution.

Customers can use [VMware Cloud Director Availability](https://docs.vmware.com/en/VMware-Cloud-Director-Availability/index.html), a Disaster Recovery as a Service (DRaaS) solution, to protect and migrate workloads both to and from the VMware Cloud Director service associated with Azure VMware Solution. The native integration of VMware Cloud Director Availability with VMware Cloud Director and VMware Cloud Director service (CDS) enables provider and their tenants to efficiently manage migration and disaster recovery for workloads through the VMware Cloud Director Availability provider and tenant portal. 

## VMware Cloud Director Availability scenarios on Azure VMware Solution

You can use VMware Cloud Director Availability with Azure VMware Solution for the following two scenarios:

- On-Premises to Azure VMware Solution

    VMware Cloud Director Availability provides migration, protection, failover, and reverse failover of VMs, vApps, and templates across on-premises VMware vCenter, VMware Cloud Director, or VMware Cloud Director service (CDS) to VMware CDS on Azure VMware Solution. 

- Azure VMware Solution to Azure VMware Solution

    VMware Cloud Director Availability provides a flexible solution for multitenant customers. The flexible solution enables smooth workload migration between Cloud Director service (CDS) instances hosted on Azure VMware Solution SDDC, which empowers efficient cloud-to-cloud migration at the tenant level when using CDs with Azure VMware Solution.

## Key components of VMware Cloud Director Availability

VMware Cloud Director Availability consists of the following types of appliances.

### Replication Management Appliance

This appliance, also known as the manager, enables communication with VMware Cloud Director. The enabled communication gives VMware Cloud Director Availability the capability to discover resources like: Organization Virtual datacenter (OrgVDC), storage policies, datastores, and networks managed by VMware Cloud director and used by tenants.

The manager plays a vital role in identifying vApps and virtual machines (VMs) eligible for replication of migration and suitable destinations for incoming replications and migrations. It also provides user interface (UI) and API interfaces, which serve as a communication bridge for users interacting with VMware Cloud Director availability.

The responsibility of the manager extends to communication with local and remote replicators and collecting data about each protected or migrated workload.

### Replication appliance instances

VMware Cloud Director Availability Cloud Replication appliance serves as the entity responsible for transferring replication data to and from ESXi hosts in the cloud. For outgoing replications or migrations, it communicates with the VM Kernel interface of an ESXi host; capturing, encrypting, and optionally compressing the replication data. The data is sent to a remote replicator, whether in the cloud or on-premises.

For incoming replications or migrations, the cloud replicator receives data from a replicator (whether in the cloud or on-premises), decrypts and decompresses it, and then transfers it to ESXi to be written to a datastore. You can deploy more replicators to scale as number of migrations or protections increases.

### Tunnel appliance

Tunnel appliance is the single-entry point to VMware Cloud Director Availability instance in the cloud and its role is to manage incoming management and replication traffic. Tunnel handles both data and management traffic and forwards it respectively to cloud replicators and manager.

### On-premises Cloud director replication appliance

This appliance is deployed in tenant on-premises datacenters. It creates a pairing relation to VMware Cloud Director Availability in the cloud and can protect or migrate VMs running locally to the cloud and vice versa.

VMware Cloud Director Availability installation in the Azure VMware Solution cloud site consists of one Replication Manager, one Tunnel Appliance, and two Replicator Appliances. You can deploy more replicators using Azure portal.

The following diagram shows VMware Cloud Director Availability appliances installed in both on-premises and Azure VMware Solution.

:::image type="content" source="media/deploy-vmware-cloud-director-availability/vmware-cloud-director-availability-diagram.png" alt-text="Diagram shows VMware Cloud Director Availability appliances installed in both on-premises and Azure VMware Solution." lightbox="media/deploy-vmware-cloud-director-availability/vmware-cloud-director-availability-diagram.png"::: 

## Install and configure VMware Cloud Director Availability on Azure VMware Solution

Verify the following prerequisites to ensure you're ready to install and configure VMware Cloud Director Availability using Run commands.

### Prerequisites

- Verify the Azure VMware Solution private cloud is configured. 
- Verify the VMware-Cloud-Director-Availability-Providerrelease.number.xxxxxxx-build_sha_OVF10.ova version 4.7 is uploaded under the correct datastore. 
- Verify the subnet, DNS zone and records for the VMware Cloud Director Availability appliances are configured. 
- Verify the subnet has outbound Internet connectivity to communicate with: VMware Cloud Director service, remote VMware Cloud Director Availability sites, and the upgrade repository. 
- Verify the DNS zone has a forwarding capability for the public IP addresses that need to be reached.  

For using VMware Cloud Director Availability outside of the local network segment, [turn on public IP addresses to an NSX-T Edge node for NSX-T Data Center](enable-public-ip-nsx-edge.md).

- Verify the Cloud Director service is associated, and the Transport Proxy is configured with the Azure VMware Solution private cloud SDDC.

## Install and manage VMware Cloud Directory Availability using Run commands

Customers can deploy VMware Cloud Director Availability using Azure Run commands on Azure portal.

> [!IMPORTANT]
> Converting from manual installation of VMware Cloud Director Availability to Run command is not supported. Existing customers using VMware Cloud Director Availability can use Run commands and install VMware Cloud Director Availability to fully leverage the classic engine and Disaster Recovery capabilities. 

To access Run commands for VCDA:
1. Navigate to Azure VMware Solution private cloud
1. Under **Operations**, select **Run command**
1. Select **VMware.VCDA.AVS package**

The Azure VMware Solution private cloud portal provides a range of Run commands for VCDA as are shown in the following screenshot. The commands empower you to perform various operations, including installation, configuration, uninstallation, scaling, and more.  

The Run command **Install-VCDAAVS** installs and configures the VMware Cloud Director Availability instance in Azure VMware Solution. The instance includes VMware Cloud Director Replication Manager, Tunnel, and two Replicators. You can add more replicators by using **Install-VCDARepliactor** to scale. 

> [!NOTE]
> Run the **Initialize-AVSSite** command before you run the install command. 

You can also use Run commands to perform many other functions such as start, stop VMware Cloud Director Availability VMs, uninstall VMware Cloud Director availability, and more. 

The following image shows the Run commands that are available under **VMware.VCDA.AVS** for VMware Cloud Director Availability on Azure VMware Solution.

:::image type="content" source="media/deploy-vmware-cloud-director-availability/vmware-cloud-director-availability-run-command.png" alt-text="Screenshot shows multiple VMware Cloud Director Availability Run commands available within the VMware Cloud Director Availability Run command package."lightbox="media/deploy-vmware-cloud-director-availability/vmware-cloud-director-availability-run-command.png"::: 

Refer to [VMware Cloud Director Availability in Azure VMware Soltion](https://docs.vmware.com/en/VMware-Cloud-Director-Availability/4.7/VMware-Cloud-Director-Availability-in-AVS/GUID-2BF88B54-5775-4414-8213-D3B41BCDE3EB.html) for detailed instructions on utilizing the Run commands to effectively install and manage VMware Cloud Director Availability within your Azure solution private cloud. 

## FAQs

### How do I install and configure VMware Cloud Director Availability in Azure VMware Solution and what are the prerequisites? 

Deploy VMware Cloud Director Availability using Run commands to enable classic engines and to access Disaster Recovery functionality. See prerequisites and procedures in [Run command in Azure VMware Solution](https://docs.vmware.com/en/VMware-Cloud-Director-Availability/4.7/VMware-Cloud-Director-Availability-in-AVS/GUID-6D0E6E0B-74BC-4669-9A26-5ACC46B2B296.html).

### How is VMware Cloud Director Availability supported?

VMware Cloud Director Availability is a VMware owned and supported product on Azure VMware Solution. For any support queries on VMware Cloud Director availability, contact VMware support for assistance. Both VMware and Microsoft support teams collaborate as necessary to address and resolve VMware Cloud Director Availability issues within Azure VMware Solution.

### What are Run commands in Azure VMware Solution? 

For more information, go to [Run Command in Azure VMware Solution](/azure/azure-vmware/concepts-run-command).

### How can I add more Replicators in my existing VMware Cloud Director Availability instance in Azure VMware Solution?

You can use Run Command **Install-VCDAReplicator** to install and configure new VMware Cloud Director Availability replicator virtual machines in Azure VMware Solution.

### How can I upgrade VMware Cloud Director availability?

VMware Cloud Director Availability can be upgraded using [Appliances upgrade sequence and prerequisites](https://docs.vmware.com/en/VMware-Cloud-Director-Availability/4.7/VMware-Cloud-Director-Availability-Install-Config-Upgrade-Cloud/GUID-51B25D13-8224-43F1-AE54-65EDDA9E5FAD.html).

## Next steps

Learn more about VMware Cloud Director Availability Run commands in Azure VMware Solution, [VMware Cloud Director availability](https://docs.vmware.com/en/VMware-Cloud-Director-Availability/index.html).
