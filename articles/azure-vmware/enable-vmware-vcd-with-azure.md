---
title: Enable VMware Cloud Director (VCD) with Azure VMware Solution 
description: This article explains how to use Azure VMware Solution to enable enterprise and hosters to use Azure VMware Solution for private clouds underlying resources for virtual datacenters.
ms.topic: how-to
author: rdutt
ms.service: azure-vmware
ms.date: 4/07/2025
---

# Enable VMware Cloud Director (VCD) with Azure VMware Solution

In this document you will learn about enabling and using VMware Cloud director on Azure VMware solution.

[VMware Cloud director](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/overview.html) also referred to as VCD, is a cloud services platform that delivers secure, isolated, and elastic virtual data center compute, network, storage, and security in a self-service model. VMware Cloud Director obtains its resources from an underlying virtual infrastructure.

Eligible Enterprise and hoster can install VMware Cloud director on Azure VMware solution and integrate it with Azure VMware Solution private cloud datacenter to enable multi tenancy, using its underlying resources to deliver the secure, isolated virtual datacenters that VCD offers.

## Audience and scope
VMware Cloud Director is currently available for eligible hosters and select Enterprise customers only. Please contact your account team for more information.

## VCD on Azure VMware Solution Architecture Overview

Azure VMware Solution provides private clouds that contain VMware vSphere clusters built from dedicated bare-metal Azure infrastructure. The minimum initial deployment is three hosts, with the option to add more hosts, up to a maximum of 16 hosts per cluster. All provisioned private clouds have VMware vCenter Server, VMware vSAN, VMware vSphere, and VMware NSX. 

VMware Cloud Director enables multi-tenancy by using organizations. Each organization can have one or more organization virtual data centers (VDC). Every Organization's VDC can have its own dedicated Tier-1 router (Organization VDC Edge Gateway), which connects to the provider managed shared Tier-0 router.

:::image type="content" source="media/vmware-vcd/VCD_architecture-diagram.png" alt-text="Diagram showing typical architecture of VMware Cloud Director in Azure VMware Solution." lightbox="media/vmware-vcd/VCD_architecture-diagram.png":::

## How to install and configure VMware Cloud Director on Azure VMware Solution

You can self-install and self-manage VMware Cloud Director on Azure VMware Solution. This document will cover VCD appliance-based installation. 

A VMware Cloud Director server group consists of one or more VMware Cloud Director servers which runs a collection of services called a VMware Cloud Director cell. All cells share a single VMware Cloud Director database and transfer server storage and connect to the vSphere and network resources. 

The VMware Cloud Director appliance includes an embedded PostgreSQL database with a high availability function. 


### VCD Installation Pre-requisites 

Ensure all installation pre-requisites are completed before proceeding with installation.

- Review [VCD appliance sizing guidelines](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/vcd-appliance-sizing-guidelines.html) to determine resource requirements of VCD appliances.
- [VCD network configuration requirements](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/vmware-cloud-director-installation-and-upgrade-guide-10-6/vmware-cloud-director-hardware-and-software-requirements-install/network-configuration-requirements-install.html)
    - You must use NTP to synchronize the clocks of all VMware Cloud Director servers, including the database server. The maximum allowable drift between the clocks of synchronized servers is 2 seconds.
    - All host names that you specify during installation and configuration must be resolvable by DNS using forward and reverse lookup of the fully qualified domain name or the unqualified hostname.
    - The VMware Cloud Director cell server must have the following network interfaces.
    - One IP address is required for the appliance, HTTP traffic, and console traffic.
    - One network interface is required for internal database communication.
    - The appliance, HTTP traffic, and console traffic use eth0. The internal database traffic uses eth1.

- [VCD Network Security Requirements](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/vmware-cloud-director-installation-and-upgrade-guide-10-6/vmware-cloud-director-hardware-and-software-requirements-install/network-security-requirements-for-vcd-install.html)

- [VCD SSL Certificate Creation and Management of Your VMware Cloud Director Appliance](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/vmware-cloud-director-installation-and-upgrade-guide-10-6/deployment-uprade-and-administration-of-the-vcd-appliance-install/ssl-certificate-creation-and-management-of-the-vcd-appliance-install.html#GUID-6F367859-1D82-452C-924F-ED91E8D4571B-en)

-	Download VCD binaries from Broadcom support portal or [create a support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) to obtain the VCD binaries.

### Prepare the Transfer server storage for your VCD appliances

Transfer server storage is used for appliance cluster management and for providing temporary storage for uploads, downloads, and catalog items. Each member of the server group mounts this volume at the same mountpoint: /opt/vmware/vcloud-director/data/transfer. You can use Linux NFS server to create transfer share on Azure VMware Solution. 

Prepare the transfer share by following [requirements for the NFS server configuration](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/vmware-cloud-director-installation-and-upgrade-guide-10-6/deployment-uprade-and-administration-of-the-vcd-appliance-install/preparing-the-transfer-server-storage-for-your-vmware-cloud-director-appliance-install.html), so that VMware Cloud Director can write files to an NFS-based transfer server storage location and read files from it. 


### Install VCD appliances on Azure VMware Solution

To configure High availability for your VMware Cloud Director database, deploy one primary and two standby instances of the VMware Cloud Director appliance. Optionally, you can horizontally scale your server group by additionally deploying application cells.

VMware Cloud Director is deployed in two stages:
- Stage 1: Deploy the Open Virtual Appliance (OVA) with basic settings.
- Stage 2: Configure VMware Cloud Director by logging in to the VAMI page. https://<VCD_FQDN_or_IP>:5480


**Procedure:**

1.	Deploy the VMware Cloud Director appliance as a primary cell. 
    - The primary cell is the first member in the VMware Cloud Director server group. The embedded database is configured as the VMware Cloud Director database. 
    - The database name is vcloud, and the database user is vcloud.

:::image type="content" source="media/vmware-vcd/VCD_ovf_install.png" alt-text="Diagram showing ovf installation of VMware Cloud Director in Azure VMware Solution." border="false" lightbox="media/vmware-vcd/VCD_ovf_install.png":::


2.	For initial configuration of primary appliance, login to VCD’s Virtual Appliance Management Interface (VAMI) at https://VCD_eth1_ip_address:5480
    - Fill the form (NFS Share, DB Password, and Admin User, VCD Settings) and start the configuration.
    - When the initial configuration is complete, you can access the VMware Cloud Director instance.
    - Verify that the primary cell is up and running by logging  to the VCD Service Provider Admin Portal at https://primary_eth0_ip_address/provider
    - To verify the PostgreSQL database health, log in as root to the appliance management user interface at https://primary_eth1_ip_address:5480. The primary node must be in a running status.
3.	Deploy two instances of the VMware Cloud Director appliance as standby cells. Log in to the VAMI interface of the standby cell and enter the same NFS mount used in the Primary Cell configuration.
    - After the initial standby appliance deployment, the replication manager begins synchronizing its database with the primary appliance database.
    - During this time, the VMware Cloud Director database and therefore the VMware Cloud Director UI are unavailable.
4.	You can monitor the cluster status by using the VMware Cloud Director appliance management user interface.
    - Verify that all cells in the HA cluster are running. See View Your VMware Cloud Director Appliance Cluster Health and Failover Mode.
5.	(Optional) Deploy one or more instances of the VMware Cloud Director appliance as VMware Cloud Director Application cells.

Once VCD is installed, you can then add Azure VMware solution vCenter and NSX-T to VMware Cloud Director to start using its resources.

## Add Azure VMware solution vCenter and NSX-T to VCD

VMware Cloud Director derives its resources from an underlying virtual infrastructure. After you register vSphere resources in VMware Cloud Director, you can allocate these resources for organizations to use.

> [!Note]
> Review and complete the following pre-requisites before adding Azure VMware solution private cloud to VCD.

### Pre-configuration steps

-	Retrieve Azure VMware solution vCenter VMCA certificate manually by going to https://<your vCenterFQDN> and then select **download trusted root CA certificate**. Locate the VMCA in the zip file contents and then add it to VCD’s trusted certificates. 
    - You must perform this task before adding Azure VMware Solution vCenter server is added to VCD, else it may impact features such as Console proxy, Powering on VM with guest customization and OVF/Media uploads. Learn more using this link.
-	Please [create a support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) to perform customization on NSX-T before you integrate Azure VMware Solution NSX-T manager with VMware cloud director and create provider gateway.
    - You must perform this task before adding Azure VMware Solution NSX-T manager is added to VCD, else adding provide gateway will fail.
-	Integrate Azure VMware Solution vCenter and NSX-T using “CloudAdmin” role
    - CloudAdmin credentials can be found under your Azure private cloud portal. 
    - Learn about [CloudAdmin role and permissions](https://learn.microsoft.com/azure/azure-vmware/architecture-identity).

:::image type="content" source="media/vmware-vcd/VCD_cloudadmin_creds.png" alt-text="Diagram showing how to obtain cloud admin credentials." border="false" lightbox="media/vmware-vcd/VCD_cloudadmin_creds.png":::


-	Create a resource pool to map with Provide Virtual datacenter (PVDC). The cluster or resource pool must be available for use in a connected vCenter server instance. 

### Add Azure VMware Solution vCenter server and NSX-T manager to VCD 
-	Ensure the above pre-configuration steps are completed.
-	Navigate to VMware Cloud Director Service Provider portal https://<your VCD FQDN>/provider as administrator. 
-	Under **Infrastructure resources**, select **vCenter server** and select **ADD**.
    - Provide the name, Azure VMware solution vCenter URL, and “CloudAdmin” credential. 
    - Ensure status is **Normal**, and connection is **connected**.

### Add Azure VMware Solution vCenter server and NSX-T manager to VCD     
- Ensure the above pre-configuration steps are completed.
- Navigate to VMware Cloud Director Service Provider portal https://<your VCD FQDN>/provider as administrator. 
- Under **Infrastructure** resources, select **NSX-T** and select **ADD**.
    - Provide a name, the URL of the Azure VMware solution NSX Manager instance, and the CloudAdmin credentials of the NSX Manager account.

## What's Next
Follow [VCD Service Provider Admin Guide](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/vmware-cloud-director-service-provider-portal-guide-10-6.html) to complete rest of the VCD Provider configuration such as creating PVDC, network pools importing provider gateway etc.

Learn about [VMware Cloud Director Network scenarios on Azure VMware Solution](enable-vmware-vcd-with-azure-network.md)


## FAQs

### How do I Install and configure VMware Cloud Director on Microsoft Azure VMware Solutions?

Eligible Enterprise and hosters can self-install and self-managed VMware Cloud Director on Azure VMware Solution. Use **CloudAdmin** role to integrate VMware Cloud Director with Azure VMware solution vCenter and NSX-T. 

### What limitations does **CloudAdmin** role have for VMware Cloud Director in Azure VMware Solution?

**CloudAdmin** Role is restricted role, and it currently does not allow BGP configuration or prefix on NSX-T Tier-0, NSX projects/NSX tenancy, VM encryption and CMK with VMware Cloud Director on Azure VMware Solution. Note:  VM encryption works at vCenter level. Learn more about CloudAdmin role and permissions under, [Architecture - Identity and access](https://learn.microsoft.com/azure/azure-vmware/architecture-identity)

### How is VMware Cloud Director supported on Azure VMware Solution?

VMware Cloud Director on Azure VMware solution is supported for eligible enterprise customers and hosters only. BYOL (Bring your own license) VCD customers must open a support ticket directly with Broadcom for VCD issues. Non-BYOL customers open all support tickets to Microsoft support. Broadcom and Microsoft support teams collaborate as necessary to address and resolve VMware Cloud Director issues on Azure VMware Solution. Please contact your account team to learn more.

### VCD responsibility matrix on Azure VMware Solution

The customer is responsible for installing, configuring, monitoring and managing lifecycle of VMware Cloud Director. This includes applying security vulnerabilities patching and upgrading VCD. Learn about [Azure VMware Solution responsibility matrix.](https://learn.microsoft.com/azure/azure-vmware/introduction#azure-vmware-solution-responsibility-matrix---microsoft-vs-customer)

### Can I use non vSAN storage using VMware Cloud Director with Azure VMware Solution?

You can configure external storage such as Azure Network file storage with VMware Cloud Director on Azure VMware Solution. Learn more about [Attach Azure NetApp Files datastores to Azure VMware Solution VMs](https://learn.microsoft.com/azure/azure-vmware/netapp-files-with-azure-vmware-solution)

### Do I need to have any customizations done on my private cloud before I can integrate it with VMware Cloud Director.

Please create a support ticket to perform customization on NSX-T before you integrate it with VMware cloud director and prior to importing NSX-T tier-0 as provider gateway.

### How to import VMCA certificate from Azure VMware solution to VMware Cloud Director?
To integrate Azure VMware Solution with VMware Cloud Director, you will need to retrieve vCenter VMCA certificate manually by navigating to https://<your vCneterFQDN>and then select “download trusted root CA certificate”. Locate the VMCA in the zip file contents and then add it to VCD’s trusted certificates. Learn more using this link.

You must perform this task before adding Azure VMware Solution vCenter is added to VCD, else it may impact features such as Console proxy, Powering on VM with guest customization and OVF/Media uploads.

### How to migrate workloads to VMware Cloud Director on Azure VMware Solution

[VMware Cloud Director Availability](https://www.vmware.com/products/cloud-infrastructure/cloud-director-availability) can be used to migrate VMware Cloud Director workload into the VMware Cloud Director on Azure VMware Solution. 

VMware cloud director tenants can drive self-serve one-way warm migration from the on-premises Cloud Director Availability vSphere plugin, or they can run the Cloud Director Availability plugin from the provider-managed Cloud Director instance and move workloads into Azure VMware Solution.

VMware Cloud Director Availability can be enabled using Run commands in Azure VMware Solution. Learn more about Deploy [VMware Cloud Director Availability in Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/deploy-vmware-cloud-director-availability-in-azure-vmware-solution)

### How VCD tenant's virtual datacenter access Azure native services in their Azure vNET.

Learn about [VMware Cloud Director Network scenarios on Azure VMware Solution](enable-vmware-vcd-with-azure-network.md)


## Learn More

Learn more about [VMware Cloud Director](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/overview.html)

Learn more about [Architecture - Network interconnectivity - Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/architecture-networking)
