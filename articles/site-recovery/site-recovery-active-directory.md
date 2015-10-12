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

If there are a small number of applications and a single domain controller in the environment and will be failing over the entire site together, then we recommend using ASR replication to replicate the domain controller machine to secondary site (applicable for both Site to Site and Site to Azure). The same VM can be used for Test Failover as well.

####Option 2
If there are a large number of applications and there is more than one domain controller in the environment or you plan to failover few applications at a time, then we recommend that in addition to enabling ASR replication on domain controller VM (to be used for Test Failvoer) you also setup an additional domain controller on the DR site (secondary on-premises site or in Azure). 

>[AZURE.NOTE] Even if you are going with Option-2, for doing a test failover you would still be required to setup ASR replication for the domain controller. Go through [Test Failover Considerations][site-recovery-active-directory/#considerations-for-test-failover] section for more details. 


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

After this you should [reconfigure dns server for the virtual network][../virtual-network/virtual-networks-install-replica-active-directory-domain-controller.md/#reconfigure-dns-server-for-the-virtual-network] to use the DNS server in Azure
  
![Azure Network](./media/site-recovery-active-directory/azure-network.png)

##Considerations for Test failover
For Test Failover (TFO) scenarios using AD , the production workload should not be impacted. If you are using AD replication, care should be taken not to impact the AD running in production during TFO. 

1. Create another virtual network (let’s call it AzureTestNetwork) and use the same IP ranges as used in the network created earlier. This network will be used during TFO. Don’t add site to site connectivity and point to site connectivity in the network just yet.
2. Go to AD virtual machine in ASR and do a test failover of it in AzureTestNetwork.
3. Once the IaaS virtual machine is created for AD in AzureTestNetwork, check the IP that has been provided to this virtual machine.
4. If the IP is not same as what was given to DNS of AzureTestNetwork, modify the DNS IP to the IP that AD VM has got. Azure starts giving IP from the 4th IP of the IP range defined in virtual network. If the IP range added in the network is 10.0.0.0 – 10.0.0.255, the first VM that is created in this network would get IP 10.0.0.4. As AD would be the first machine to be failed over in a DR drill, you can predict the IP that this VM is going to get and accordingly add that as the DNS IP in AzureTestNetwork.
5. Once the testing is complete, you can mark the test failover complete from the Jobs view in ASR. This will delete the virtual machines that were created on AzureTestNetwork.

##Summary
Using Azure Site Recovery, you can create a complete automated disaster recovery plan for your AD. You can initiate the failover within seconds from anywhere in the event of a disruption and get the AD up and running in a few minutes. In case you have an AD for multiple applications such as SharePoint and SAP in your primary site and you decide to failover the complete site, you can failover the AD using ASR first and then failover the other applications using application specific recovery plans.


Refer to [Site recovery workload guidance](../site-recovery/site-recovery-workload.md) for more details on protecting various workloads using ASR.


