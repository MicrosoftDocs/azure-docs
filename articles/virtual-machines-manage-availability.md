<properties 
	pageTitle="Manage the availability of virtual machines - Azure" 
	description="Learn how to use multiple virtual machines to ensure high availability for your Azure application." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="kenazk" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/13/2015" 
	ms.author="kenazk"/>

#Manage the availability of virtual machines

## Understand planned versus unplanned maintenance
There are two types of Azure platform events that can affect the availability of your virtual machines: planned maintenance and unplanned maintenance.

- **Planned maintenance events** are periodic updates made by Microsoft to the underlying Azure platform to improve overall reliability, performance, and security of the platform infrastructure that your virtual machines run on. The majority of these updates are performed without any impact upon your virtual machines or cloud services. However, there are instances where these updates require a reboot of your virtual machine to apply the required updates to the platform infrastructure. 

- **Unplanned maintenance events** occur when the hardware or physical infrastructure underlying your virtual machine has faulted in some way. This may include local network failures, local disk failures, or other rack level failures. When such a failure is detected, the Azure platform will automatically migrate your virtual machine from the unhealthy physical machine hosting your virtual machine to a healthy physical machine. Such events are rare, but may also cause your virtual machine to reboot. 

## Follow best practices when you design your application for high availability
To reduce the impact of downtime due to one or more of these events, we recommend the following high availability best practices for your virtual machines:

* [Configure multiple virtual machines in an Availability Set for redundancy] 
* [Configure each application tier into separate Availability Sets] 
* [Combine the Load Balancer with Availability Sets] 
* [Avoid single instance virtual machines in Availability Sets] 

### Configure multiple virtual machines in an Availability Set for redundancy 
To provide redundancy to your application, we recommend that you group two or more virtual machines in an Availability Set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine will be available and meet the 99.95% Azure SLA. For more information about service level agreements, see the “Cloud Services, Virtual Machines, and Virtual Network” section in [Service Level Agreements](../../../support/legal/sla/). 

Each virtual machine in your Availability Set is assigned an Update Domain (UD) and a Fault Domain (FD) by the underlying Azure platform. For a given Availability Set, five non-user-configurable UDs are assigned to indicate groups of virtual machines and underlying physical hardware that can be rebooted at the same time. When more than five virtual machines are configured within a single Availability Set, the sixth virtual machine will be placed into the same UD as the first virtual machine, the seventh in the same UD as the second virtual machine, and so on. The order of UDs being rebooted may not proceed sequentially during planned maintenance, but only one UD will be rebooted at a time.

FDs define the group of virtual machines that share a common power source and network switch. By default, the virtual machines configured within your Availability Set are separated across two FDs. While placing your virtual machines into an Availability Set does not protect your application from operating system nor application-specific failures, it does limit the impact of potential physical hardware failures, network outages, or power interruptions.   

<!--Image reference-->
   ![UD FD configuration](./media/virtual-machines-manage-availability/ud-fd-configuration.png)

>[AZURE.NOTE] For instructions, see [How to Configure an Availability Set for Virtual Machines] [].

### Configure each application tier into separate Availability Sets
If the virtual machines in your availability set are all nearly identical and serve the same purpose for your application, we recommend that you configure an Availability Set for each tier of your application.  If you place two different tiers in the same Availability Set, all virtual machines in the same application tier could be rebooted at once. By configuring at least two virtual machines in an Availability Set for each tier, you guarantee that at least one virtual machine in each tier will be available.   

For example, you could put all the VMs in the front-end of your application running IIS, Apache, Nginx, etc., in a single availability set. Make sure that only front-end virtual machines are placed in the same Availability Set. Similarly, make sure that only data-tier virtual machines are placed in their own Availability Set, like your replicated SQL Server VMs or your MySQL VMs.

<!--Image reference-->
   ![Application tiers](./media/virtual-machines-manage-availability/application-tiers.png)

 
### Combine the Load Balancer with Availability Sets
Combine the Azure Load Balancer with an Availability Set to get the most application resiliency. The Azure Load Balancer distributes traffic between multiple virtual machines. For our Standard tier virtual machines, the Azure Load Balancer is included. Note that not all Virtual Machine tiers include the Azure Load Balancer. For more information on load balancing your virtual machines, please read [Load Balancing Virtual Machines](load-balance-virtual-machines.md). 

If the load balancer is not configured to balance traffic across multiple virtual machines, then any planned maintenance event will affect the only traffic-serving virtual machine, causing an outage to your application tier. Placing multiple virtual machines of the same tier under the same load balancer and Availability Set enables traffic to be continuously served by at least one instance. 

### Avoid single instance virtual machines in Availability Sets
Avoid leaving a single instance virtual machine in an Availability Set by itself. Virtual machines in this configuration do not qualify for SLA guarantee and will face downtime during Azure planned maintenance events.  Furthermore, if you deploy a single VM instance within an availability set, you will receive no advanced warning or notification of platform maintenance. In this configuration, your single virtual machine instance can and will be rebooted with no advanced warning when platform maintenance occurs.

[Configure multiple virtual machines in an Availability Set for redundancy]: #configure-multiple-virtual-machines-in-an-availability-set-for-redundancy 
[Configure each application tier into separate Availability Sets]: #configure-each-application-tier-into-separate-availability-sets 
[Combine the Load Balancer with Availability Sets]: #combine-the-load-balancer-with-availability-sets 
[Avoid single instance virtual machines in Availability Sets]: #avoid-single-instance-virtual-machines-in-availability-sets 

 
<!-- Link references -->
[How to Configure An Availability Set for Virtual Machines]: virtual-machines-how-to-configure-availability.md


