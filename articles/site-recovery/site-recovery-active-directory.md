<properties
	pageTitle="ASR Guidance for Active Directory | Microsoft Azure" 
	description="This article explains in detail about how you can create a disaster recovery solution for your AD using Azure Site recovery, perform a planned/unplanned/test failovers using one-click recovery plan, supported configurations and prerequisites." 
	services="site-recovery" 
	documentationCenter="" 
	authors="prateek9us" 
	manager="abhiag" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery" 
	ms.date="10/06/2015" 
	ms.author="pratshar"/>

#Automated DR solution for Active Directory and DNS using ASR


All the enterprise applications such as SharePoint, Dynamics AX and SAP depend on AD and DNS infrastructure to function correctly. While creating a disaster recovery (DR) solution for any such application, it is important to protect and recover AD before the other components of the application come up in the event of a disruption.

Azure Site Recovery  is an Azure based service that provides disaster recovery capabilities by orchestrating replication, failover and recovery of virtual machines. Azure Site Recovery supports a number of replication technologies to consistently replicate, protect, and seamlessly failover virtual machines and applications to private/public or hoster’s clouds. 

Using Azure Site Recovery, you can create a complete automated disaster recovery plan for your AD. You can initiate the failover within seconds from anywhere in the event of a disruption and get the AD up and running in a few minutes. In case you have an AD for multiple applications such as SharePoint and SAP in your primary site and you decide to failover the complete site, you can failover AD first using ASR and then failover the other applications using application specific recovery plans.

This article explains in detail about how you can create a disaster recovery solution for your AD, perform a planned/unplanned/test failovers using one-click recovery plan, supported configurations and prerequisites.  The audience is expected to be familiar with AD and Azure Site Recovery.There are two recommended options based on the complexity of the customer’s on-premises environment to protect AD.

####Option 1

If there are a small number of applications and a single domain controller in the environment and you will be failing over the entire site together, then we recommend using ASR replication to replicate the domain controller machine to secondary site (applicable for both Site to Site and Site to Azure). The same replicated virtual machine can be used for Test Failover as well.

####Option 2
If there are a large number of applications and there is more than one domain controller in the environment or you plan to failover of few applications at a time, then we recommend that in addition to enabling ASR replication on domain controller virtual machine (to be used for Test Failvoer) you also setup an additional domain controller on the DR site (secondary on-premises site or in Azure). 

>[AZURE.NOTE] Even if you are going with Option-2, for doing a test failover you would still be required to setup ASR replication for the domain controller. Go through [Test Failover Considerations](#considerations-for-test-failover) section for more details. 


Sections below explain how to enable protection on domain controller in ASR and how to setup a domain controller in Azure. 


##Prerequisites

Implementing disaster recovery for AD using Azure Site Recovery requires the following pre-requisites completed.

- An on-premises deployment of the Active Directory and DNS server
- Azure Site Recovery Services vault has been created in Microsoft Azure subscription 
- If Azure is your recovery site, run the Azure Virtual Machine Readiness Assessment tool  on VMs to ensure that they are compatible with Azure VMs and Azure Site Recovery Services


##Enable protection for Domain Controller/DNS using ASR


###Protect VM
Enable protection of Domain Controller/DNS VM in ASR. Perform relevant Azure Site Recovery configuration based on whether the VM is deployed on Hyper-V or on VMware.The recommended Crash consistent frequency to configure is 15 minutes.

###Configure VM network settings
- For the Domain Controller/DNS virtual machine, configure network settings in ASR so that the VM geta attached to the right network after a failover. 
- For example when you are using Azure as the DR site you can select the VM in the ‘VMM Cloud’ or the ‘Protection Group’ to configure the network settings as shown in the snapshot below.
- 
![VM Network Settings](./media/site-recovery-active-directory/VM-Network-Settings.png)

##Enable protection for AD using AD replication
###Site to Site scenario

Create a domain controller on the secondary(DR) site and while promoting the server to domain controller role give the name of the same domain that is being used on the primary site. you can use the Active Directory Sites and Services snap-in to configure settings on the site link object to which the sites are added. By configuring settings on a site link, you can control when replication occurs between two or more sites, and how often. You can refer to ['Scheduling Replication Between Sites'](https://technet.microsoft.com/en-us/library/cc731862.aspx "") for more details.

###Site to Azure scenario
Follow these instructions to create a [domain controller in an Azure virtual network](../virtual-network/virtual-networks-install-replica-active-directory-domain-controller.md). While promoting the server to domain controller role give the name of the same domain that is being used on the primary site.

After this you should [reconfigure dns server for the virtual network](../virtual-network/virtual-networks-install-replica-active-directory-domain-controller.md#reconfigure-dns-server-for-the-virtual-network) to use the DNS server in Azure
  
![Azure Network](./media/site-recovery-active-directory/azure-network.png)

##Considerations for Test failover
Test Failover is done in a network that is isolated from production network so that there is no impact to the production workload. Most applications also require the presence of a domain controller and a DNS Server to function. Therefore, before an application is failed over, a domain controller needs be created in the isolated network to be used for Test Failover. The easiest way to do that is to first enable protection on the domain controller/DNS virtual machine using ASR and before triggering Test Failover of the recovery plan of the application, trigger test failover of the domain controller virtual machine. Below is the step by step guidance to do the Test Failover:

1. Enable protection on the domain controller/DNS virtual machine as you do for any other virtual machine.
2. Create an isolated network. Any virtual network created in Azure by default is isolated from other network. It is recommended that IP range for this network is same as that of your production network. Don't enable site to site connectivity on this network.
3. Provide DNS IP in the network created in the step above as the IP that you expect the DNS VM to get. If you are using Azure as the DR site then you can provide the IP for the VM that will be used on failover in 'Target IP' setting in VM properties. If your DR site is on-premises and you are using DHCP then follow the instruction given here to [setup DNS and DHCP for test failover](site-recovery-failover.md#run-a-test-failover) 

>[AZURE.NOTE] The IP given to a virtual machine on a Test Failover is same as the IP it would get on doing a planned or unplanned failover given that this IP is available in the Test Failover network. If the same IP is not available in the test failover network, virutal machine will get some other IP available in the test failover network.

4. Go to the domain controller virtual machine and do test failover of it in the isolated network. 
5. Do test failover of the recovery plan of the application.
6. Once testing is complete, mark the test failover of job of domain controller virtual machine and the recovery plan 'Complete' in from jobs tab in ASR. 

###DNS not on same virtual machine as domain controller: 
In case DNS is not on the same virtual machine as domain controller you’ll need to create a DNS for the test failover. In case they are on the same VM you can skip this section. You can use a fresh DNS server and create all the required zones. For example, if your Active Directory domain is contoso.com, you can create a zone with the name contoso.com. The entries corresponding to Active Directory must be updated in DNS. Do this as follows:

- Ensure the following settings are in place before any other virtual machine in the recovery plan comes up:
	- The zone must be named after the forest root name.
	- The zone must be file backed.
	- The zone must be enabled for secure and non-secure updates.
	- The resolver of the domain controller virtual machine should point to the IP address of the DNS virtual machine.
- Run the following command on domain controller virtual machine Directory: nltest /dsregdns.

- **Add zone**—Use the following script to add a zone on the DNS server, allow non-secure updates, and add an entry for itself to DNS:

	    dnscmd /zoneadd contoso.com  /Primary 
	    dnscmd /recordadd contoso.com  contoso.com. SOA %computername%.contoso.com. hostmaster. 1 15 10 1 1 
	    dnscmd /recordadd contoso.com %computername%  A <IP_OF_DNS_VM> 
	    dnscmd /config contoso.com /allowupdate 1


##Summary
Using Azure Site Recovery, you can create a complete automated disaster recovery plan for your AD. You can initiate the failover within seconds from anywhere in the event of a disruption and get the AD up and running in a few minutes. In case you have an AD for multiple applications such as SharePoint and SAP in your primary site and you decide to failover the complete site, you can failover the AD using ASR first and then failover the other applications using application specific recovery plans.


Refer to [Site recovery workload guidance](../site-recovery/site-recovery-workload.md) for more details on protecting various workloads using ASR.


