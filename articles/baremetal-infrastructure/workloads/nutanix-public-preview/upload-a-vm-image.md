---
title: Upload a VM image
description: Public Preview documentation
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Upload a VM image

Note: Ensure that you add the tags fastpathenabled: True while creating the VNets, and not 
after the VNets are created.
1. Sign into the Azure portal with your Azure account created for Private Preview and then 
navigate to Subscriptions.
2. Open the resource group that you have created.
3. Click +Add.
4. In the New page, in the search box, enter Virtual Network. Select Virtual Network in the 
search results.
5. In the Virtual Network page, click Create.
6. In Create virtual network, enter, or select the following information in the Basics tab:
a. Project details: Select your subscription and the resource group.
b. Instance details: add a name for the VNet and select (US) East US from the 
Region list.
7. Click Next: IP Addresses at the bottom of the page.
8. In the IPv4 address space, select the IPv4 address space, and then click + Add 
subnet.
9. In the Add subnet page, add a name for the subnet (such as Host-Subnet) and enter 
the subnet address range. Click Add.
21
10. Click Next: Security and Next: Tags at the bottom of the page.
11. Add the tag fastpathenabled and set its value as True.
12. Click Create in the Review + create page.
13. When the deployment is complete, click Go to resource. You will be redirected to the 
VNet that is created.
14. Click Subnets. In the Subnets page, click the name of the Host-Subnet.
15. Under SUBNET DELEGATION, select Microsoft.BareMetal/AzureHostedService from 
the Delegate subnet to a service list.
16. Click Save.
Note: Add a custom DNS to the VNet. You can use any of the following DNS servers:
• On-prem DNS server
Note: You need to create a Cluster VNet and set up VPN or ExpressRoute 
connectivity to the on-prem DNS server.
• Public DNS server, such as 1.1.1.1 or 8.8.8.8
• Azure DNS server deployed from Microsoft Marketplace
• Nutanix provisioned DNS server with the IP address 20.106.145.8

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
