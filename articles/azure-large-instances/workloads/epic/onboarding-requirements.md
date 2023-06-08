---
title: Onboarding requirements
description: Provides an overview of onboarding requirements for Epic for ALI.
ms.topic: conceptual
author: jjaygbay
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Onboarding requirements 

 

When customers receive the environment from Microsoft ALI team, they are encouraged to perform the following steps:  

Check Azure portal to perform the following steps:  

 

Create Azure Virtual Network(s) and ExpressRoute Gateway(s) with High or Ultra Performance Reference and link them with Epic on Azure BareMetal Infrastructure (BMI) stamps using Circuit/peer ID and Authorization Key provided by Microsoft team.  

 

Please ensure that your VNET address space provided in the request is the same as what you configure.  

Set up time synchronization with NTP server.  

Set up a jump box in a VM to connect to Epic on Azure BMI stamps and change the root password at first login and store password in a secure location.  

Install a red hat satellite server in a VM for RHEL 8.4 and patch download.   

Validate Epic on Azure BMI stamps and configure and patch OS per your requirements.  

Check if the stamps are visible on Azure Portal.   

Do NOT place large files like Epic on Azure BMI installation bits on boot volume. Boot volume is small and can fill quickly and may cause the server to hang (50 GB per OS is the boot limit).  

Secure Server IP pool address range.  

This IP address range is used to assign the individual IP address to Epic BareMetal instance servers. The recommended subnet size is a /24 CIDR block. If needed, it can be smaller, with as few as 64 IP addresses.   

From this range, the first 30 IP addresses are reserved for use by Microsoft. Make sure that you account for this when you choose the size of the range. This range must NOT overlap with your on-premises or other Azure IP addresses.   

Your corporate network team or service provider should provide an IP address range that's not currently being used inside your network. This range is an IP address range, which needs to be submitted to Microsoft when asking for an initial deployment.   

  

Optional IP address ranges to eventually submit to Microsoft   

If you choose to use ExpressRoute Global Reach to enable direct routing from on-premises to Epic on Azure BMI instance units, you need to reserve another /29 IP address range. This range may not overlap with any of the other IP addresses ranges you defined before.  

If you choose to use ExpressRoute Global Reach to enable direct routing from an Epic on Azure BMI instance tenant in one Azure region to another Epic on Azure BMI instance tenant in another Azure region, you need to reserve another /29 IP address range. This range may not overlap with the other IP address ranges you defined before.  

  

Enable ExpressRoute Fast Path between VNET and Epic on Azure BMI (Details below) 

Once the connection is created, you should be able to access your Azure ALI servers from anywhere, Azure VMs (hub and spoke) and on-premises.   

In case you would like to see the learned routes from Azure BMI, one of the options is looking at the Effective Routes table of one of your VMs.   

In the Azure Portal, click any of your VMs (any connected to the Hub, or to a Spoke connected to the Hub which is connected to Azure BMI), click “Networking”, click the network interface name, and then click “Effective Routes”.   

Make sure to enable accelerated networking with all VMs connecting to Epic on Azure BMI (link1) or (link2).   

Set up Epic on Azure BMI solution as per your system requirements and take a system backup.  

Take an OS backup.  

Set up volume groups. (See FAQs for detailed steps)  

Set up storage snapshot, backup, and data offload. (See FAQs for detailed steps).  

Azure subscription you use for Azure Large instance deployments is already registered with the ALI  resource provider by Microsoft Operations team during provisioning process. If you don't see your deployed Azure Large Instances under your subscription, register the resource provider with your subscription (See FAQs for detailed steps).  

 

Enable Express Route fast path  

Express Route fast path enables low latency access between VNET VM’s and Epic on Azure BMI. With ER fast path, the data path allows communication between VMs and Epic on Azure BMI instances bypassing few intermediate network hops thus providing improved latency and network throughput.   

Connect to Microsoft Cloud using Global Reach. Learn how Azure ExpressRoute Global Reach can link ExpressRoute circuits together to make a private network between your on-premises networks.  

  

How to enable ER Fast Path for low latency access between Epic on Azure BMI and App servers in VNET  

Before you begin, you need to install the latest version of the Azure resource manager power shell cmdlets, at least 4.0 or later. For more information about installing the power shell cmdlets, see how to install and configure Azure powershell.              

Step 1:  

Ensure you have authorization key for the express route (ER) circuit used for virtual gateway connection to ER circuit. Also obtain ER circuit resource ID.   

If you don’t have this information, please obtain the details from circuit owner (these details are usually provided by Microsoft team as part of provisioning request completion. Please reach out to Microsoft support AzureBMISupportEpic@microsoft.com in case of any inconsistencies).  

Step 2:   

Declare your variables. This example declares the variables using the values for this exercise. Please replace the values with your subscription values.   

$Sub1 = "Replace_With_Your_Subcription_Name"  

$RG1 = "TestRG1"  

$Location1 = "East US"  

$GWName1 = "VNet1GW"  

$Authkey = “Express route circuit auth key”  

  

Connect to your account.  

  

Connect-AzureRmAccount  

  

Check the subscriptions for the account:  

Get-AzureRmSubscription  

  

Specify the subscription that you want to use:  

Select-AzureRmSubscription -SubscriptionName $Sub1  

  

Enable ER fast path on the gateway connection  

Declare variable for Gateway object:  

$gw = Get-AzureRmVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1  

  

Declare variable for Express route circuit ID:  

$id = "/subscriptions/”express route subscrioption ID”/resourceGroups/”ER resource group”/providers/Microsoft.Network/expressRouteCircuits/”circuit”  

  

Enable MSEEv2 using “ExpressRouteGatewayBypass” flag:  

New-AzureRmVirtualNetworkGatewayConnection -Name "Virtual Gateway connection name" -ResourceGroupName $RG1 -Location $Location1 -VirtualNetworkGateway1 $gw -PeerId $id -AuthorizationKey $Authkey -ConnectionType ExpressRoute -ExpressRouteGatewayBypass   

  

Enable Accelerated Networking on VMs   

To take advantage of low latency access on VM’s network stack, please enable accelerated networking (AN) aka SR-IOV on supported VM’s. Please see the below link for more details on supported VM sizes, OS and how to enable AN for existing VM’s  
https://docs.Microsoft.Com/en-us/azure/virtual-network/create-vm-accelerated-networking-cli  



## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure for Large Instances?](../../what-is-azure-for-large-instances.md)

