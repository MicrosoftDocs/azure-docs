--- 
title: Deploy VMware Cloud Director Availability in Azure VMware Solution
description: Learn how to install and configure VMware Cloud Director Availability in Azure VMware Solution
author: suzuber
ms.topic: how-to
ms.service: azure-vmware
ms.date: 1/22/2024
--- 

# Deploy VMware Cloud Director Availability in Azure VMware Solution

In this article, learn how to deploy VMware Cloud Director Availability in Azure VMware Solution.

Enterprise customers use VMware Cloud Director Availability, a Disaster Recovery as a Service (DRaaS) solution, to use VMware Cloud Director service (VMware CDS) within Azure VMware Soltuion. With VMware Cloud Director Availability, VMware Cloud Director service provider and tenants can protect and migrate their workloads at tenant level. The native integration of VMware Cloud Director Availability with VMware CDS, through its plugin, enables multitenancy tenants to efficiently manage migration and disaster recovery for their virtual data center workloads through the VMware Cloud Director Availability tenant portal. 

The following diagram shows VMware Cloud Director Availability appliances installed in both on-premises and Azure VMware Solution.

:::image type="content" source="media/deploy-vmware-cloud-director-availability/vcda-diagram.png" alt-text="Diagram shows VCDA appliances installed in both on-premises and Azure VMware Solution."lightbox="media/deploy-vmware-cloud-director-availability/vcda-diagram.png"::: 

## VMware Cloud Director Availability useful scenarios in Azure VMware Solution

The two following VMware Cloud Director Availability scenarios are useful in Azure VMware Solution

- On Premise to Azure VMware Solution

    VMware Cloud Director Availability provides migration, protection, failover, and reverse failover of VMs, vApps, and templates across on-premises VMware vCenter, VMware Cloud Director (VCD), or VMware Cloud Director service (VMware CDS) to VMware CDS on Azure VMware Solution. 

- Azure VMware Solution to Azure VMware Solution

    VMware Cloud Director Availability provides a flexible solution for multitenant customers, enabling smooth workload migration between Cloud Director service (CDS) instances hosted on Azure VMware Solution SDDC. This empowers efficient cloud-to-cloud migration at the tenant level when using CDs with Azure VMware Solution

## Prerequisites

- Verify the Azure VMware Solution private cloud is configured. 
- Verify the VMware-Cloud-Director-Availability-Providerrelease.number.xxxxxxx-build_sha_OVF10.ova version 4.7 or later is uploaded under the correct datastore. 
- Verify the subnet, DNS zone and records for the VMware Cloud Director Availability appliances are configured. 
- Verify the subnet has outbound Internet connectivity to communicate with: VMware Cloud Director service, remote VMware Cloud Director Availability sites, and the upgrade repository. 
- Verify the DNS zone has forwarding for the public IP addresses that need to be reached.  

For using VMware Cloud Director Availability outside of the local network segment, [turn on public IP addresses to an NSX-T Edge node for NSX-T Data Center](https://learn.microsoft.com/azure/azure-vmware/enable-public-ip-nsx-edge).

- Verify the Cloud Director service is associated, and the Transport Proxy is configured with the Azure VMware Solution private cloud SDDC.

## Install and manage VMware Cloud Directory Availability using Run commands

Enterprise customers seeking to implement and manage multitenant BCDR in their Azure VMware Solution SDDC using VMware Cloud director Availability can utilize VCDA Run commands accessible on the Azure portal.  

> [!IMPORTANT]
> Converting from manual installation of VCDA to Run command is not supported. Existing customers with any manual VCDA installation are advised to uninstall and reinstall VCDA using Run commands to fully leverage the classic engine and Disaster Recovery capabilities.

To access Run commands for VCDA:
1. Navigate to Azure VMware Solution private cloud
1. Under **Operations**, select **Run command**
1. Select **VMware.VCDA.AVS package**

The Azure VMware Solution private cloud portal provides a range of Run commands for VCDA as are shown in the following screenshot. The commands empower you to perform various operations, including installation, configuration, uninstallation, scaling, and more.  

Run command Install-VCDAAVS Install and configure VMware Cloud Director Availability instance in Azure VMware Solution. This includes VMware Cloud Director Replication Manager, Tunnel and two Replicators. You can add more replicators by using Install-VCDARepliactor to scale. 

:::image type="content" source="media/deploy-vmware-cloud-director-availability/vcda-run-command.png" alt-text="Screenshot shows multiple VCDA run commands available within the VCDA run command package."lightbox="media/deploy-vmware-cloud-director-availability/vcda-run-command.png"::: 

Refer to our guide for detailed instructions on utilizing these run commands to effectively install, uninstall, and manage VCDA within your Azure solution private cloud (VMware Link to be added). 

## FAQs

### How do I install and configure VMware Cloud Director Availability in Azure VMware Solution? What are the prerequisites? 

Deploy VMware Cloud Director Availability using run commands to enable classic engines and to access Disaster Recovery functionality. Follow this link, VMware Cloud Director Availability in Azure VMware Solution Link from VMW.

### How is VMware Cloud Director Availability supported?

VMware Cloud Director Availability is a VMware owned and supported product on Azure VMware Solution. For any support queries on VMware Cloud Director Availability, contact VMware support for assistance. Both VMware and Microsoft support teams collaborate as necessary to address and resolve VMware Cloud Director Availability issues within Azure VMware Solution.
