---
title: "Troubleshoot connectivity issues with Azure Lab Services"
description: "Learn how to troubleshoot common connectivity issues with Azure Lab Services."
author: modularity
ms.author: ladunlap
ms.service: azure-lab-services
ms.topic: troubleshooting-general
ms.date: 02/01/2024

#customer intent: As an Azure Lab Services user, I want to troubleshoot connectivity issues so that I can access my virtual machines.

---

# Troubleshoot connectivity issues with Azure Lab Services

This article provides guidance on how to troubleshoot common connectivity issues with Azure Lab Services.

> [!IMPORTANT]
> Azure Lab Services is a managed offering where some of the backing resources for a Lab are not directly accessible. This impacts the ability to utilize other Azure VM troubleshooting guides like [Troubleshoot RDP connections on an Azure Virtual Machine](https://learn.microsoft.com/troubleshoot/azure/virtual-machines/troubleshoot-rdp-connection).

## Connection speed

### Symptoms

- Slow Remote Desktop Protocol (RDP) connection

### Causes

- Specific lab VM
- Use of VPN
- Firewall on the network
- Specific Internet Service Provider (ISP)

### Resolution

1. Quantify the RDP connection speed

The utility PsPing can be used to measure the response time to the machine. Steps are included in the blog [How to ensure the best RDP experience for lab users](https://techcommunity.microsoft.com/t5/azure-lab-services-blog/how-to-ensure-the-best-rdp-experience-for-lab-users/ba-p/2813369). 

1. Determine the scope of the problem:

- Is it a specific machine?
- Is there a VPN being used?
- Is it slow on a specific network?
- Is there a firewall on the network?
- Is it slow with a specific ISP?

#### Specific machine
Adjust the [settings in the client experience](https://learn.microsoft.com/windows-server/administration/performance-tuning/role/remote-desktop/session-hosts#client-experience-settings) to reduce the volume of data being transmitted.

#### Use of VPN
A good troubleshooting step is to turn off the VPN to see if that improves the connection speed. If it's the VPN and it's required, then review the VPN settings and configuration to possibly allow RDP or SSH connections to be “passed through” connections aren’t routed to distant regions or routed incorrectly. 

#### Specific network or firewall
A network can affect the connectivity to Azure Lab Services, from an enterprise level network to a student's home router/Wi-Fi combination. For example, a students’ home router might have built-in firewalls that block or limit the RDP/SSH connections. Check if there's a firewall enabled on the network and if it's configured to limit the RDP/SSH connections.

#### Specific internet service provider (ISP)
It isn't common to have multiple ISPs to connect to. If the slowdown is on a specific network and other options were explored, then you may want to contact your ISP to see if they have any limiters on RDP/SSH connections.

## Virtual Machine not running

### Symptoms

- Students receive the message, "Remote Desktop can't connect to the remote computer … Make sure the remote computer is turned on and connected to the network, and that remote access is enabled"

### Causes

- The virtual machine that the students are trying to connect to isn't running
- The lab VM may still be starting
- Idle settings can impact lab VM connections

### Resolution

Open the [Lab portal](https://labs.azure.com) and check that the virtual machine shows as running. If it's not running, the student can start the virtual machine from their lab portal. It might take between 2 to 5 minutes to get the machine fully running.

Adjusting the [lab automatic shutdown settings](https://learn.microsoft.com/azure/lab-services/how-to-enable-shutdown-disconnect) may improve the student connection experience. Since turning on and off the virtual machine takes time, adjusting the settings may decrease the chances of the student trying to connect while the machine is changing state. The automatic shutdown settings are part of a cost savings strategy, though they may need to be adjusted to improve the student experience. 

- Shut down idle virtual machines: If the duration is too short, there may not be enough time from when the student starts the machine and then connects, or if the student is not active (in-classroom learning for example), the virtual machine may be shutdown. 
- Shut down virtual machines when users disconnect: If there's too small a time delay, you can run into issues where an accidental disconnect starts a shutdown. Students would need to start the virtual machine again to connect.  
- Shut down virtual machines when users don't connect: If students don't connect to the virtual machine after some time and if the duration is too short, the virtual machine will be shutdown. The timing can affect students starting the virtual machine themselves, or if schedules are used in the lab.  Changing the idle setting to a longer duration is an option but has potential cost implications. If schedules are being used, the virtual machines can be started closer to when the class time starts. 


## Outbound from the School/University/Enterprise/Home Network (local Firewalls)

### Symptoms

- The network can be a point of interference when firewall(s), switches, routers or other network appliances block or limit RDP/SSH (3389/22) ports

### Causes

- School or local network router at the student’s home
- Modern routers, especially WIFI 6, have default behavior to block or restrict the RDP/SSH connections
- Campus firewalls restricting outbound RDP/SSH connections to the internet
- Operating system restricting outbound RDP/SSH connectivity

### Resolution

Consider removing the RDP/SSH restriction or add an exemption for the [lab public IP address](https://learn.microsoft.com/azure/lab-services/how-to-configure-firewall-settings#find-public-ip-for-a-lab), which can be added to the allowlist for the firewall or router. 

## Misconfigurations on the Student Virtual Machine

### Symptoms

- Students are administrators on their lab VM, where they can make system changes including the network configuration

### Causes

- Updating the IP Address to a static IP instead of specified as a dynamic IP
- Disabling DCHP (preventing automatically getting an IP address)
- Specifying DNS servers (This shouldn't be specified on the virtual machine. If custom DNS is needed, use Advanced Networking and specify custom DNS servers on the virtual network.) 
- Updating local user groups and permissions

### Resolution

A lab template can be set up with a [script to autoreset the networking](https://techcommunity.microsoft.com/t5/azure-lab-services-blog/running-a-powershell-shutdown-script-on-windows-lab-services/ba-p/3273163) on machine shutdown. Otherwise, students or teachers would need to [reimage the lab VM](https://learn.microsoft.com/azure/lab-services/how-to-reset-and-redeploy-vm), which will get them back to a good state.

## Unable to connect an outgoing VPN from a Student VM

### Symptoms

- Students are attempting to use a VPN connection initiated from a student VM (to the campus/university network for example) and the VPN fails to connect

### Causes

- The VPN having issues with the Azure Lab Services network configuration

### Resolution

[!INCLUDE [contact Azure support](includes/lab-services-contact-azure-support.md)]

## Confirm no lab deployment issues

### Symptoms

- If the lab has a failure the machine connections may not work properly

### Causes

- The Azure activity log is the most comprehensive list of events and results

### Resolution

The [activity log](https://learn.microsoft.com/azure/azure-monitor/essentials/activity-log?tabs=powershell) can be filtered on the resource group that the lab is located in. The events may take a few minutes to be available in the log. These event logs contain more detailed information that can be used for troubleshooting and should be included if a support ticket needs to be created.


## Advanced Networking Troubleshooting Items 
The list below contains troubleshooting items that only apply to [advanced networking scenarios](https://learn.microsoft.com/azure/lab-services/concept-lab-services-supported-networking-scenarios). 

### Missing a Network Security Group 
When troubleshooting a lab plan that has advanced networking configured, one of the first checks is to confirm that the lab services network subnet has a network security group connected to it.  This will let the RDP/SSH connections to be allowed through.  Without a network security group, all connections are blocked to the virtual machines (template VM and student VMs). 

### Using Azure Virtual Machine RDP Troubleshooting 
There are unique troubleshooting techniques with labs that are configured with advanced networking.  Advanced networking enables additional troubleshooting by creating an Azure Virtual Machine connected directly to the virtual network that the lab plan is connected to. Using this Azure VM (outside of Azure Lab Services), you can use the Azure Virtual Machine RDP Troubleshooting guide, including the in-Azure connection troubleshooter, to determine if the network is configured correctly.

### NSG Rules are blocking RDP/SSH connections 
Using the Azure VM that is connected directly to the virtual network (from the previous section), you can diagnose virtual machine network connectivity directly in the Azure Portal.  The blocking or limiting of the RDP/SSH connections via security rules can be done at the subnet with a Network Security Group or by using Azure Virtual Network Manager, the easiest way to see the full list of rules is via the Azure Virtual Machine network effective security rules. 

### Default User Defined Route (Route table problem) 
Advanced networking allows the network to be customized as needed, including modifying the route table.  A user-defined route table directs traffic to the appropriate destinations.  There is a special route, the “internet route” (0.0.0.0/0) which directs traffic not bound for another local address to the Internet.  Azure Lab Services advanced networking does not support updating the ‘next hop’ for the 0.0.0.0/0 route to anything except the internet.  Changing this to a specific IP address (for example, directing outbound internet traffic to a firewall or other network appliance) will break connectivity to the lab by introducing an asymmetric routing issue.  When debugging issues, check for a custom route table and make sure that the default route is set to have 0.0.0.0/0 to the Internet.  

## Advanced troubleshooting and data collection

If you're still experiencing issues after following the above steps, you may need to collect additional data for further troubleshooting. This could include logs from your virtual machine, network trace data, or other relevant information.

[!INCLUDE [contact Azure support](includes/lab-services-contact-azure-support.md)]