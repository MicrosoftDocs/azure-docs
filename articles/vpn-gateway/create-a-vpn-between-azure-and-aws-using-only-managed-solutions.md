---
title: 'Create a VPN between Azure and AWS using only managed solutions'
description: How to create an VPN between Azure and AWS using only the VPN managed solution from each one.
services: vpn-gateway
titleSuffix: Azure VPN Gateway
author: ricmmartins

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 11/09/2020
ms.author: ricmmartins

---


# How to create a VPN between Azure and AWS using only managed solutions

What if you can establish a connection between Azure and AWS using only managed solutions instead to have to use virtual machines? Did you know that since the beginning of 2019 you could do this?

Yes, you can! Since [February/2019](https://aws.amazon.com/about-aws/whats-new/2019/02/aws-site-to-site-vpn-now-supports-ikev2/) AWS started to support IKEv2 on Site-to-Site VPN allowing their VPN managed solution to work both as initiator and responder mode, like Azure does. 

That said, if before you had to use an appliance or virtual machine acting as VPN Server on the other side when using the AWS Virtual Private Gateway, now you don't need anymore. You can simply connect the AWS Virtual Private Gateway with the Azure VPN Gateway directly without worry to manage IaaS resources like virtual machines.

So in this article I'll show to you how to setup this. Below the draw of our lab:

![draw](/media/create-a-vpn-between-azure-and-aws-using-only-managed-solutions/draw.png)

## Configuring Azure 

### 1. Create a resource group on Azure to deploy the  resources on that:

![newrg](images/newrg.png)

![create](images/create.png)

Choose the subscription, the name and the region to be deployed:

![creating](images/creating.png)

### 2. Create a Virtual Network and a subnet

![createvnet](images/createvnet.png)

![createvnetbutton](images/createvnetbutton.png)

Define the subscription, resource group, name and region to be deployed:

![vnetdefinitions](images/vnetdefinitions.png)

Set the address space for the virtual network and for the subnet. 
Here I'm defining the virtual network address space to **172.10.0.0/16**, changing the "default" subnet name to **"subnet-01"** and defining the subnet address range to **172.10.1.0/24**:

![vnetaddr](images/vnetaddr.png)

![vnetvalidation](images/vnetvalidation.png)

	
### 3. Create the VPN Gateway

The Azure VPN Gateway is a resource composed of 2 or more VM's that are deployed to a specific subnet called Gateway Subnet where the recommendation is to use a /27. He contain routing tables and run specific gateway services. Note that you can't access those VM's.

 To create, go to your Resource Group, then click to **+ Add**
 
 ![addvpngw](images/addvpngw.PNG)
 
 ![newvpngw](images/newvpngw.png)
 
 ![createvpngw](images/createvpngw.png)
 
 Then fill the fields like below:
 
 ![vpngwsummary](images/vpngwsummary.png)
 
 After click to Review + create, in a few minutes the Virtual Network Gateway will be ready:
 
 ![vpnready](images/vpnready.png)
 
 ## Configuring AWS
 
 ### 4. Create the Virtual Private Cloud (VPC)
 
 ![createvpc](images/createvpc.png)
 
 ### 5. Create a subnet inside the VPC (Virtual Network)
 
 ![createsubnetvpc](images/createsubnetvpc.png)
 
 ### 6. Ceate a customer gateway pointing to the public ip address of Azure VPN Gateway
 
 The Customer Gateway is an AWS resource with information to AWS about the customer gateway device, which in this case is the Azure VPN Gateway.
 
 ![createcustomergw](images/createcustomergw.png)
 
 ### 7. Create the virtual private gateway then attach to the VPC
 
 ![createvpg](images/createvpg.png)
 
 ![attachvpgtovpc](images/attachvpgtovpc.png)
 
 ![attachvpgtovpc2](images/attachvpgtovpc2.png)
 
 ### 8. Create a site-to-site VPN Connection
 
 ![createvpnconnection](images/createvpnconnection.png)
 
 Set the routing as static pointing to the azure subnet-01 prefix **(172.10.1.0/24)**
 
 ![setstaticroute](images/setstaticroute.png)
 
 After fill the options, click to create.
 
 ### 9. Download the configuration file
 
 Please note that you need to change the Vendor, Platform and Software to **Generic** since Azure isn't a valid option:
 
 ![downloadconfig](images/downloadconfig.png)
 
 In this configuration file you will note that there are the Shared Keys and the Public Ip Address for each of one of the two IPSec tunnels created by AWS:
 
 ![ipsec1](images/ipsec1.png)
  
 ![ipsec1config](images/ipsec1config.png)
  
 ![ipsec2](images/ipsec2.png)
   
 ![ipsec2config](images/ipsec2config.png)
 
 After the creation, you should have something like this:
 
 ![awsvpnconfig](images/awsvpnconfig.png)
 
 ## Adding the AWS information on Azure Configuration
 
 ### 10. Now let’s create the Local Network Gateway
 
 The Local Network Gateway is an Azure resource with information to Azure about the customer gateway device, in this case the AWS Virtual Private Gateway
 
 ![newlng](images/newlng.png)
 
 ![createnewlng](images/createnewlng.png)

Now you need to specify the public ip address from the AWS Virtual Private Gateway and the VPC CIDR prefix. 

Please note that the public address from the AWS Virtual Private Gateway is described at the configuration file you have downloaded.

As mentioned earlier, AWS creates two IPSec tunnels to high availability purposes. I'll use the public ip address from the IPSec Tunnel #1 for now.

![lngovwerview](images/lngovwerview.png)

### 11. Then let's create the connection on the Virtual Network Gateway

![createconnection](images/createconnection.png)

![createconnection2](images/createconnection2.png)

You should fill the fields according below. Please note that the Shared key was obtained at the configuration file downloaded earlier and In this case, I'm using the Shared Key for the Ipsec tunnel #1 created by AWS and described at the configuration file.

![createconnection3](images/createconnection3.png)

After a few minutes, you can see the connection established:

![connectionstablished](images/connectionstablished.png)

In the same way, we can check on AWS that the 1st tunnel is up:

![awsconnectionstablished](images/awsconnectionstablished.png)

Now let's edit the route table associated with our VPC

![editawsroute](images/editawsroute.png)

And add the route to Azure subnet through the Virtual Private Gateway:

![saveawsroute](images/saveawsroute.png)

### 12. Adding high availability

Now we can create a 2nd connection to ensure high availability. To do this let's create another Local Network Gateway which we will point to the public ip address of the IPSec tunnel #2 on the AWS

![createlngstandby](images/createlngstandby.png)

Then we can create the 2nd connection on the Virtual Network Gateway:

![createconnectionstandby](images/createconnectionstandby.png)

And in a few moments we'll have:

![azuretunnels](images/azuretunnels.png)

![awstunnels](images/awstunnels.png)

With this, our VPN connection is established on both sides and the work is done. 

### 13. Let's test!

First, let's add an Internet Gateway to our VPC at AWS. The Internet Gateway is a logical connection between an Amazon VPN and the Internet. This resource will allow us to connect through the test VM from their public ip through internet. This is not required for the VPN connection, is just for our test:

![createigw](images/createigw.png)

After create, let's attach to the VPC:
 
![attachigw](images/attachigw.png)

![attachigw2](images/attachigw2.png)

Now we can create a route to allow connections to **0.0.0.0/0** (Internet) through the Internet Gateway:

![allowinternetigw](images/allowinternetigw.png)

On Azure the route was automatically created. You can check selecting the Azure VM > Networking > Network Interface > Effective routes. Note that we have 2 (1 per connection):

![azureeffectiveroutes](images/azureeffectiveroutes.png)

Now I've created a Linux VM on Azure and our environment looks like this:

![azoverview](images/azoverview.png)

And I did the same VM creation on AWS that looks like this:

![awsoverview](images/awsoverview.png)

Then we can test the connectivity betweeen Azure and AWS through our VPN connection:

![azureping](images/azureping.png)

![awsping](images/awsping.png)
