<properties
   pageTitle="Classic Deployment Model Endpoints in Resource Manager | Microsoft Azure"
   description="Understand how endpoints from the Classic deployment model are now implemented in Resource Manager"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="05/18/2016"
   ms.author="iainfou"/>

# Resource Manager Approach to Classic Endpoints

Endpoints in the Classic deployment model no longer exist when using the Resource Manager deployment model. A feature new to Resource Manager deployments are Network Security Groups (NSGs) that let you create Access Control List (ACL) rules to allow or deny traffic to your virtual machine (VM). Although ACL rules existed for endpoints in the Classic deployment model, there are some differences in behavior when using Network Security Groups, so it's important to understand your options for controlling the flow of traffic in and out of your VMs. This article provides an overview of network security groups, how they differ from using Classic endpoints, and sample deployment scenarios.


## Quick-steps for Resource Manager deployments
A more detailed overview of these concepts and steps can be round in the rest of this article. The following lets you jump straight in or get a high-level overview of the process.

Endpoints in the Classic deployment model allowed you to control the flow of traffic to your VM or cloud service. Endpoint ACL rules in the Classic deployment model are replaced by Network Security Group ACL rules. Quick steps for implementing Network Security Group ACL rules are:

- Create a Network Security Group
- Define your Network Security Group ACL rules to allow or deny traffic
- Assign your Network Security Group to a network interface or virtual network subnet

If you are wanting to also perform port-forwarding, you need to place a load balancer in front of your VM and use NAT rules. Quick steps for implementing a load balancer and NAT rules would be as follows:

- Create a load balancer
- Create a backend pool and add your VMs to the pool
- Define your NAT rules for the required port forwarding
- Assign your NAT rules to your VMs


## Quick Overview of Resource Manager Concepts
In the Resource Manager deployment model, there is no concept of a Cloud Service. Your resources are logically grouped together as a resource group, however no virtual IP is automatically assigned as with a Cloud Service. Each VM within a resource group can now have its own public IP address assigned. There is also no concept of an endpoint in Resource Manager deployments, since there is no Cloud Service associated with your VM. Potentially, a VM with a public IP address assigned to it has all ports open.

### Network Security Groups
Network Security Groups are a new feature that provide a layer of security for you to only allow specific ports and subnets to access your VMs. You will typically always have a Network Security Group providing this layer of security between your VMs and the outside world. Network Security Groups can be applied to a virtual network subnet or a specific network inteface for a VM. Rather than creating endpoint ACL rules, you now create Network Security Group ACL rules. These rules allow or deny traffic that you specify, providing much greater control than simply creating an endpoint to forward a given port.

> [AZURE.TIP] You can assign your Network Security Groups to multiple subnets or network interfaces. There is not a 1:1 mapping, meaning that you can create a Network Security Group with a common set of of ACL rules and apply the multiple subnets or network interfaces within your resource group. Further, your Network Security Group can applied to resources across your subscription (based on Role Based Access Controls in large subscriptions).

### Load Balancers
One final difference is that in the Classic deployment model, Azure would perform all the Network Address Translation (NAT) and port forwarding on a Cloud Service. When creating an endpoint, you could specify the external port to expose along with the internal port to direct traffic to. Network Security Groups by themselves do not perform this same NAT and port forwarding. An Azure load balancer needs to be created in your resource group that allows you to create NAT rules for such port forwarding. Again, this is granular enough to only apply to specific VMs if needed. The Azure load balancer NAT rules work in conjunction with Network Security Group ACL rules to provide much flexibility and control than was achievable using Cloud Service endpoints.


## Network Security Group ACL Rules
A Network Security Group lets you create Access Control List (ACL) rules that allow or deny traffic in and out of your VM. For example, you may want to permit web traffic on port 80, allow remote management from a specific on-prem subnet, or deny access to FTP on port 25. You can create ACLs that allow or deny specific ports, port ranges, or protocols, and assign these rules to either individual VMs or to a subnet that is part of an Azure virtual network. The following screenshot shows what a list of ACL rules may look like within a Network Security Group:

![List of Network Security Group ACL rules](./media/virtual-machines-windows-endpoint-functionality-resource-manager/example-acl-rules.png)

Note that every NSG has three default rules that are designed to handle the flow of Azure networking traffic, including an explicit `DenyAllInbound` as the final rule. These default rules can be seen in the example above as the last three rules to get applied. ACL rules are applied based on a priority metric that you specify - default ACL rules are given a very low priority (higher the integer is a lower priority) so as to not intefere with your own rules.


## Assigning Network Security Groups
You assign a Network Security Group to a subnet or a network interface. This approach allows you to be as granular as need in applying your ACL rules to only a specific VM, or ensure a common set of ACL rules are applied to all VMs part of a subnet:

![Apply NSGs to network interfaces or subnets](./media/virtual-machines-windows-endpoint-functionality-resource-manager/apply-nsg-to-resources.png)

The behavior of the Network Security Group doesn't change depending on being assigned to a subnet or a network interface. A common deployment scenario has the Network Security Group assigned to a subnet in order to ensure compliance of all VMs attached to that subnet.


## Default Behavior of Network Security Groups
Depending on how and when you create your network security group, default rules may be created to permit RDP access on TCP port 3389 (Linux VMs will permit TCP port 22). These automatic ACL rules will be created under the following conditions:

- If you create a Windows VM through the portal and accept the default action to create a new Network Security Group, an ACL rule to allow TCP port 3389 (RDP) will be created.
- If you create a Linux VM through the portal and accept the default action to create a new Network Security Group, an ACL rule to allow TCP port 22 (SSH) will be created.

Under all other conditions, these default ACL rules will not be created. If you create your Network Security Groups but do not define the ACL rules accordingly, you will be unable to connect to your VM. This would include the following common actions:

- Creating a Network Security Group through the portal as a separate action to creating the VM.
- Creating a Network Security Group programatically through PowerShell, Azure CLI, Rest APIs, etc.
- Creating a VM and assigning it to an existing Network Security Group that does not already have the appropriate ACL rule defined.

In all of the above cases, you will need to create ACL rules for your VM to allow the appropriate remote management connections.


## Default behavior of a VM without a Network Security Group
You can create a VM without creating a Network Security Group. In these situations, you can connect to your VM using RDP or SSH without creating any ACL rules. Similarly, if you installed a web service on port 80, that service will automatically be accessible remotely.

> [AZURE.NOTE] You still need to have a public IP address assigned to a VM in order for any remote connections. This means that not having creating a Network Security Group for the subnet or network interface doesn't immediately open the VM to all external traffic. The default action when creating a VM through the portal is to create a new public IP. For all other forms of creating a VM such as PowerShell, Azure CLI, or Resource Manager template, a public IP won't be automatically created unless explicitly requested.

As you typically will want to secure the flow of traffic, typically all VMs will be protected by a Network Security Group at either the subnet or network interface layer. Similar to endpoints in the Classic deployment model, this means you have to create those ACL rules as desired for each service or application.


## Understanding Load Balancers and NAT Rules
In the Classic deployment model, you could create endpoints that also performed port forwarding. When you create a VM in the Classic deployment model, ACL rules for RDP or SSH would be automatically created, however they would not expose TCP port 3389 or TCP port 22 respectively to the outside world. Instead, a high-value TCP port would be exposed that maps to the appropriate internal port. You could also create your own ACL rules in a similar manner, such as expose a webserver on TCP port 4280 to the outside world. You can see these ACL rules and port mappings in the following screenshot from the Classic portal:

![Port-forwarding with Classic endpoints](./media/virtual-machines-windows-endpoint-functionality-resource-manager/classic-endpoints-port-forwarding.png)

With Network Security Groups, that port-forwarding functionality is not present. Network Security Groups define the security rules to allow or deny traffic. For single-instance quick deployments of a VM, this is a change from the Classic deployment model. A common deployment scenario would typically include a load balancer to distribute traffic to your applications, and in the Resource Manager deployment model it is the Azure load balancer that provides the similar port-forwarding functionality through the use of NAT rules. An example of a load balancer with a NAT rule to perform port-forwarding of TCP port 4222 to the internal TCP port 22 a VM is shown in the following screenshot from the portal:

![Load balancer NAT rulres for port-forwarding](./media/virtual-machines-windows-endpoint-functionality-resource-manager/load-balancer-nat-rules.png)

> [AZURE.NOTE] When you implement a load balancer, the VM itself typically will not have a public IP assigned to it, as when only working with a single VM. Instead, the load balancer will have a public IP address assigned to it. You still need to create your Network Security Group ACL rules to define the flow of traffic in and out of your VM, the load balancer NAT rules are simply to define what traffic flows through the load balancer and gets distributed to the backend VMs. As such, you need to create a NAT rule for traffic to flow through the load balancer and then create a Network Security Group ACL rule to allow the traffic to actually reach the VM.

## Next steps
