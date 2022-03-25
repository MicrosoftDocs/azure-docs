---
title: Setup networking infrastructure in Azure 
description: tba
ms.topic: how-to
ms.subservice: baremetal-nutanix
ms.date: 03/31/2021
---

# Setup networking infrastructure in Azure

After you have performed the steps in [Setup an Account](setup-an-account.md), perform the following steps to set up the required networking infrastructure in Azure. 
 
1.	Configure a DNS server. 
See [Create a DNS server](https://docs.microsoft.com/en-us/azure/dns/private-dns-getstarted-portal) for instructions on how to create a DNS server in the Azure portal.  
Create the following VNets:  
    1. Management/bare-metal nodes VNet 
Note: You can choose to create the Cluster management/bare-metal nodes VNet from the Nutanix Cluster console while creating a cluster or create it in advance. 
    1. Prism Central Vnet 
    1. VPN/ER (Hub) VNet 
A Nutanix cluster in Azure runs in an Azure virtual network. If you do not want to automatically create a Azure virtual network during the cluster creation process, manually create an Azure virtual network by using the Azure portal. 
See Creating a virtual network (VNet) and subnet in Azure. 
See the Microsoft Azure documentation at Create a virtual network in Azure. See az network vnet subnet for instructions on how to manage subnets in the Azure portal for Nutanix clusters. 
Note: While you create these VNets, set the “fastpathenabled” tag with the 
“True” value on these VNets. 
1.	Create NAT gateway for the cluster management subnet and PC subnet. 
You must configure a NAT gateway and assign it to the cluster management subnet you created earlier so that the subnet has access to the internet. 
Note: Set the “fastpathenabled” tag with the “True” value for the NAT gateway. See Creating a NAT gateway in Azure. 
See the Microsoft Azure documentation at Set up a NAT Gateway for up-to-date and detailed instructions on how to configure the NAT gateway. 
1. Create cluster management/bare-metal subnets:  
   1. Bare-metal nodes (req ≥ /24) 
   1. Flow gateway external traffic (req ≥ /24) 
   1. Flow gateway internal traffic (req ≥ /24)  
See [Add, change, or delete a virtual network subnet](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-subnet). 
1.	Create a subnet for Prism Central.
> [!NOTE]:
> Delegate the PC subnet to the “Microsoft. BareMetal/AzureHostedService” service.
5. Create VPN/ER (Hub) gateway subnets. 
1. Apply tag for all resources used for the cluster deployment using the Tag tab on the Azure portal. 
   1. VNets - Cluster Management VNet, PC VNet, VPN VNet, ER VNet 
   1. NAT Gateway 
   1. VPN/ER Gateway  
   Set the “fastpathenabled” tag with the “True” value on the new subscription and all above resources. 
8.	Delegate the cluster management subnet to the “Microsoft. BareMetal/AzureHostedService” service. 
Specify the DNS server listed earlier. 
In your Azure portal, go to your cluster management VNet > under **Subnets**, click on the cluster management subnet > in the right pane, select 
“Microsoft.BareMetal/AzureHostedService” in the Delegate subnet to a service list.  
See [Add or remove a subnet delegation](https://docs.microsoft.com/en-us/azure/virtual-network/manage-subnet-delegation).  
9.	Verify that the cluster management subnet has the NAT gateway and AzureHostedService configured. 
In your Azure portal, go to your cluster management VNet > under Subnets, click on the cluster management subnet > in the right pane, you can see the NAT gateway name in the NAT gateway list, and the subnet delegation in the Delegate subnet to a service list. 
10.	Create subnets in the Cluster VNet to deploy a Flow gateway. 
a.	Create one non-delegated subnet (Azure native subnet) in the Cluster VNet. 
b.	Create another non-delegated (external) subnet for Flow gateway. 
c.	Create the Azure NAT gateway and attach it to the non-delegated subnet. 
11.	Create Prism Central VNet to deploy Nutanix Prism Central (PC). 
a.	Create a VNet with one delegated subnet. 
b.	Create the Azure NAT gateway and attach to the delegated subnet. 
c.	Establish VNet peering between Cluster VNet and PC VNet. 
12.	Deploy a Jump Host (JH) instance to access the Nutanix Cluster nodes. 
Note: The Jump Host may be deployed in the Cluster VNet or a new VNet. If the Jump Host must be deployed in a new VNet, it must be peered with the Cluster VNet. 
13.	Allow outbound internet access on your Azure portal so that the Nutanix Clusters console can successfully provision and orchestrate Nutanix clusters in Azure. Note: The outbound internet access can be available either through NAT gateway or VPN. 
14.	Ensure that Azure Directory Service resolves the specified FQDN:  
gateway-external-api.console.nutanix.com. 


## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
