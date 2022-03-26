---
title: Create a NAT gateway in Azure
description: 
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Create a NAT gateway in Azure

Create NAT gateway for the cluster management subnet and PC subnet. 
> [!NOTE]
> Ensure that you add the tags **fastpathenabled: True** while creating the NAT gateway, and not after the NAT gateway is created. 
1.	Sign into the Azure portal with your Azure account and then navigate to **Subscriptions**. 
2.	Open the resource group that you have created. 
3.	Click **+Add**. 
4.	On the New page, in the search box, enter NAT gateway. Select NAT gateway in the search results. 
5.	On the NAT gateway page, click **Create**.  
The Create network address translation (NAT) gateway page appears. 
6.	In the Basics tab, enter or select the following information: 
   *	Project details: select your subscription and the resource group. 
   *  Instance details: Add a name for the NAT gateway, select (US) East US as a region. 
7.	Click **Next: Outbound IP** at the bottom of the page. 
8.	On the Outbound IP page, add Public IP Addresses and Public IP Prefixes. 
You can click the **Create a new public IP address** link to add a new IP address. The IP Prefix is optional. 
9.	Click **Next: Subnet** at the bottom of the page. 
10.	Select the Host VNet that you have created and then the Host-Subnet as a subnet.  
11.	Click **Next: Tags**. 
12.	Add the tag **fastpathenabled** and set its value as True.   
13.	Click **Next: Review + create** at the bottom of the page. 
14.	Click **Create**. 
15.	When the deployment is complete, click **Go to resource group**.  
16.	Click the Host VNet and then the Host-Subnet that you created. 
17.	Select the **NAT gateway** in the NAT gateway list and click **Save**. 
 
 


## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
