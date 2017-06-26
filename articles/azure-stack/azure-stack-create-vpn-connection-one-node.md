---
title: Create a Site-to-Site VPN connection between two Virtual Networks in different Azure Stack PoC Environments | Microsoft Docs
description: Step-by-step procedure that allows a cloud administrator to create a Site-to-Site VPN connection between two one-node POC environments.
services: azure-stack
documentationcenter: ''
author: ScottNapolitan
manager: darmour
editor: ''

ms.assetid: 3f1b4e02-dbab-46a3-8e11-a777722120ec
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 4/24/2017
ms.author: scottnap

---
# Create a Site-to-Site VPN connection between two Virtual Networks in different Azure Stack PoC Environments
## Overview
This article shows you how to create a Site-to-Site VPN Connection between two virtual networks in two separate Azure Stack Proof-of-Concept (POC) environments. While you configure the connections, you will learn how VPN gateways in Azure Stack work.

> [!NOTE]
> This document applies specifically to the Azure Stack TP2 POC.
> 
> 

### Connection diagram
The following diagram shows what the configuration should look like when you’re done:

![](media/azure-stack-create-vpn-connection-one-node-tp2/image1.png)

### Before you begin
To complete this configuration, ensure you have the following items before you get started:

* Two Servers that meet the Azure Stack POC hardware requirements
  defined by the [Azure Stack Deployment
  Prerequisites](azure-stack-deploy.md),
  and the other prerequisites defined by that document.
* The Azure Stack Technical Preview 2 Deployment Package.

## Deploy the POC environments
You will deploy two Azure Stack POC environments to
complete this configuration.

* For each POC that you deploy, you can follow the deployment instructions
  detailed in the article [Deploy Azure Stack
  POC](azure-stack-run-powershell-script.md).
  Each POC environment in this document is generically referred to as *POC1* and *POC2*.

## Configure Quotas for Compute, Network and Storage
First, you need to configure *Quotas* for compute, network, and storage. These services can be associated with a *Plan*, and then an *Offer* that tenants can subscribe to.

> [!NOTE]
> You need to do these steps for each Azure Stack POC
> environment.
> 
> 

Creating Quotas for Services has changed from TP1. The
steps to create quotas in TP2 can be found at
<http://aka.ms/mas-create-quotas>. You can accept the defaults for all
quota settings for this exercise.

## Create a Plan and Offer
[Plans](azure-stack-key-features.md) are
groupings of one or more services. As a provider, you can create plans
to offer to your tenants. In turn, your tenants subscribe to your offers
to use the plans and services they include.

> [!NOTE]
> You need to perform these steps for each Azure Stack POC
> environment.
> 
> 

1. First create a Plan. To do this, you can follow the steps in the
   [Create a
   Plan](azure-stack-create-plan.md)
   online article.
2. Create an Offer following the steps described in [Create an Offer in
   Azure
   Stack](azure-stack-create-offer.md).
3. Log in to the portal as a tenant administrator and [subscribe to the
   Offer you
   created](azure-stack-subscribe-plan-provision-vm.md).

## Create the Network Resources in POC 1
Now you are going to actually create the resources you need to set up your configuration. The following steps illustrate what you'll be doing. These instructions show how to create resources using the portal, but the same thing can be accomplished using PowerShell.

![](media/azure-stack-create-vpn-connection-one-node-tp2/image2.png)

### Log in as a tenant
A service administrator can log in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [Create a tenant
account](azure-stack-add-new-user-aad.md) before
you log in.

### Create the virtual network & VM subnet
1. Log in using a tenant account.
2. In the Azure portal, click
   **New**.
   
    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)
3. Select **Networking** from the Marketplace menu.
4. Click the **Virtual network** item on the menu.
5. Click **Create** near the bottom of the resource
   description blade. Enter the following values into the appropriate
   fields according to this table.
   
   | **Field** | **Value** |
   | --- | --- |
   | Name |vnet-01 |
   | Address space |10.0.10.0/23 |
   | Subnet name |subnet-01 |
   | Subnet address range |10.0.10.0/24 |
6. You should see the Subscription you created earlier populated in the
   **Subscription** field.
7. For Resource Group, you can either create a new Resource Group or if
   you already have one, select **Use existing**.
8. Verify the default location.
9. Click **Create**.

### Create the Gateway Subnet
1. Open the Virtual Network resource you just created (Vnet-01) from
   the dashboard.
2. On the Settings blade, select **Subnets**.
3. Click **Gateway Subnet** to add a gateway subnet to
   the virtual network.
   
    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image4.png)
4. The name of the subnet is set to **GatewaySubnet** by default.
   Gateway subnets are special and must have this specific name to function properly.
5. In the **Address range** field, type **10.0.11.0/24**.
6. Click **Create** to create the gateway subnet.

### Create the Virtual Network Gateway
1. In the Azure portal, click **New**.
   
2. Select **Networking** from the Marketplace menu.
3. Select **Virtual network gateway** from the list of
   network resources.
4. Review the description and click **Create**.
5. In the **Name** field type **GW1**.
6. Click the **Virtual network** item to choose a virtual network.
   Select **Vnet-01** from the list.
7. Click the **Public IP address** menu item. When the **Choose public
   IP address** blade opens click **Create new**.
8. In the **Name** field, type **GW1-PiP** and click **OK**.
9. The **Gateway type** should have **VPN** selected by default. Keep
   this setting.
10. The **VPN type** should have **Route-based** selected by default.
    Keep this setting.
11. Verify that **Subscription** and **Location** are correct. You can pin
    the resource to the Dashboard if you like. Click **Create**.

### Create the Local Network Gateway
The implementation of a *local network gateway* in this Azure Stack evaluation deployment is a bit different than in an actual Azure deployment.

Just like in Azure, you have the concept of a local network gateway. However, in an Azure deployment a local network gateway represents an on-premise (at the tenant)  physical device you use to connect to a virtual network gateway in Azure. But in this Azure Stack evaluation deployment, both ends of the connection are virtual network gateways!

A way to think about this more generically is that the Local Network Gateway resource is always meant to indicate the remote gateway at the other end of the connection. Because of the way the POC was designed, you need to provide the IP address of the external network adapter on the NAT VM of the other POC as the Public IP Address of the Local Network Gateway. You will then create NAT mappings on the NAT VM to make sure that both ends are connected properly.


### Get the IP address of the external adapter of the NAT VM
1. Log in to the Azure Stack physical machine for POC2.
2. Press the [Windows Key] + R to open the **Run** menu and type
   **mstsc** and press Enter.
3. In the **Computer** field type the name **MAS-BGPNAT01** and click
    **Connect**.
4. Click the Start Menu and right-click **Windows PowerShell** and select
   **Run As Administrator**.
5. Type **ipconfig /all**.
6. Find the Ethernet Adapter that is connected to your on-premise
   network, and take note of the IPv4 address bound to that adapter. In
   our example environment, it’s **10.16.167.195** but yours will be
   something different.
7. Record this address. This is what you will use as the Public IP
   Address of the Local Network Gateway resource you create in POC1.

### Create the Local Network Gateway Resource
1. Log in to the Azure Stack physical machine for POC1.
2. In the **Computer** field, type the name **MAS-CON01** and click
   **Connect**.
3. In the Azure portal, click **New**.
   
4. Select **Networking** from the Marketplace menu.
5. Select **local network gateway** from the list of resources.
6. In the **Name** field type **POC2-GW**.
7. You don’t know the IP address of the other gateway yet, but that’s ok
   because you can come back and change it later. For now, type
   **10.16.167.195** in the **IP address** field.
8. In the **Address Space** field type the address space of the Vnet
   that you will create in POC2. This is going to be
   **10.0.20.0/23** so type that value.
9. Verify that your **Subscription**, **Resource Group** and
   **location** are all correct and click **Create**.

### Create the Connection
1. In the Azure portal, click
   **New**.
   
2. Select **Networking** from the Marketplace menu.
3. Select **Connection** from the list of resources.
4. In the **Basic** settings blade, choose **Site-to-site (IPSec)** as
   the **Connection type**.
5. Select the **Subscription**, **Resource Group** and **Location** and
   click **Ok**.
6. In the **Settings** blade, choose the **Virtual Network Gateway**
   (**GW1**) you created previously.
7. Choose the **local Network Gateway** (**POC2-GW**) you
   created previously.
8. In the **Connection Name** field, type **POC1-POC2**.
9. In the **Shared Key (PSK)** field type **12345** and click **OK**.

### Create a VM
To validate data traveling through the VPN Connection, you
need VMs to send and receive data in each POC. Create a VM in
POC1 now and put it on your VM subnet in your virtual network.

1. In the Azure portal, click **New**.
   
2. Select **Virtual Machines** from the Marketplace menu.
3. In the list of virtual machine images, select the **Windows Server 2012 R2 Datacenter** image.
4. On the **Basics** blade, in the **Name** field type **VM01**.
5. Type a valid user name and password. You’ll use this account to log
   in to the VM after it has been created.
6. Provide a **Subscription**, **Resource Group** and **Location** and
   then click **OK**.
7. On the **Size** blade, choose a VM size for this instance and then
   click **Select**.
8. On the **Settings** blade, you can accept the defaults; just ensure
   that the Virtual network selected is **VNET-01** and the Subnet is
   set to **10.0.10.0/24**. Click **OK**.
9. Review the settings on the **Summary** blade and click **OK**.

## Create the Network Resources in POC 2
### Log in as a tenant
A service administrator can log in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [Create a tenant
account](azure-stack-add-new-user-aad.md) before
you log in.

### Create the virtual network and VM subnet
1. Log in using a tenant account.
2. In the Azure portal, click **New**.
   
3. Select **Networking** from the Marketplace menu.
4. Click **Virtual network** on the menu.
5. Click **Create** near the bottom of the resource
   description blade. Type the following values for the appropriate
   fields listed in the table below.
   
   | **Field** | **Value** |
   | --- | --- |
   | Name |vnet-02 |
   | Address space |10.0.20.0/23 |
   | Subnet name |subnet-02 |
   | Subnet address range |10.0.20.0/24 |
6. You should see the Subscription you created previously populated in the
   **Subscription** field.
7. For Resource Group, you can either create a new Resource Group or if
   you already have one select **Use existing**.
8. Verify the default **location**. If you want, you can pin the
   virtual network to the Dashboard for easy access.
9. Click **Create**.

### Create the Gateway Subnet
1. Open the Virtual network resource you created (**Vnet-02**)
   from the Dashboard.
2. On the **Settings** blade, select **Subnets**.
3. Click  **Gateway subnet** to add a gateway subnet to
   the virtual network.
   
4. The name of the subnet is set to **GatewaySubnet** by default.
   Gateway subnets are special and must have this specific name to function properly.
5. In the **Address range** field, type **10.0.20.0/24**.
6. Click **Create** to create the gateway subnet.

### Create the Virtual Network Gateway
1. In the Azure portal, click **New**.
   
2. Select **Networking** from the Marketplace menu.
3. Select **Virtual network gateway** from the list of
   network resources.
4. Review the description and click **Create**.
5. In the **Name** field type **GW2**.
6. Click  **Virtual network** to choose a virtual network.
   Select **Vnet-02** from the list.
7. Click **Public IP address**. When the **Choose public
   IP address** blade opens click **Create new**.
8. In the **Name** field, type **GW2-PiP** and click **OK**.
9. The **Gateway type** should have **VPN** selected by default. Keep
   this setting.
10. The **VPN type** should have **Route-based** selected by default.
    Keep this setting.
11. Verify **Subscription** and **Location** are correct. You can pin
    the resource to the Dashboard if you like. Click **Create**.

### Create the Local Network Gateway
#### Get the IP address of the external Adapter of the NAT VM
1. Log in to the Azure Stack physical machine for POC1.
2. Press and hold [Windows Key] + R to open the **Run** menu and type
   **mstsc** and press enter.
3. In the **Computer** field type the name **MAS-BGPNAT01** and click
    **Connect**.
4. Click the Start menu, right-click  **Windows PowerShell** and select
   **Run As Administrator**.
5. Type **ipconfig /all**.
6. Find the Ethernet adapter that is connected to your on-premise
   network, and note the IPv4 address bound to that adapter. In
   the example environment it’s **10.16.169.131** but yours will be different.
7. Record this address. This is what you will use later as the Public IP
   Address of the Local Network Gateway resource you create in POC1.

#### Create the Local Network Gateway Resource
1. Log in to the Azure Stack physical machine for POC2.
2. In the **Computer** field type the name **MAS-CON01** and click **Connect**.
3. In the Azure portal, click **New**.
   
4. Select **Networking** from the Marketplace menu.
5. Select **local network gateway** from the list of resources.
6. In the **Name** field type **POC1-GW**.
7. Now you need the Public IP Address you recorded for the Virtual
   network gateway in POC1. Type **10.16.169.131** in the **IP address**
   field.
8. In the **Address Space** field type the address space of
   **Vnet-01** from POC1 - **10.0.0.0/16**.
9. Verify that your **Subscription**, **Resource Group** and
   **location** are all correct and click **Create**.

## Create the Connection
1. In the Azure portal, click **New**.
   
2. Select **Networking** from the Marketplace menu.
3. Select **Connection** from the list of resources.
4. In the **Basic** settings blade, choose **Site-to-site (IPSec)** as
   the **Connection type**.
5. Select the **Subscription**, **Resource Group** and **Location** and
   click **OK**.
6. In the **Settings** blade, choose the **Virtual Network Gateway**
   (**GW1**) you created previously.
7. Choose the **Local Network Gateway** (**POC1-GW**) you
   created previously.
8. In the **Connection Name** field, type **POC2-POC1**.
9. In the **Shared Key (PSK)** field type **12345**. If you choose a
   different value, remember that it MUST match the value for Shared
   Key you created on POC1. Click **OK**.

## Create a VM
Create a VM in POC1 now and put it on your VM subnet in your virtual
network.

1. In the Azure portal, click **New**.
   
2. Select **Virtual Machines** from the Marketplace menu.
3. In the list of virtual machine images, select the **Windows Server 2012 R2 Datacenter** image.
4. On the **Basics** blade, in the **Name** field type **VM02**.
5. Type a valid user name and password. You’ll use this account to log
   in to the VM after it has been created.
6. Provide a **Subscription**, **Resource Group** and **Location** and
   then click **OK**.
7. On the **Size** blade, choose a VM size for this instance and then
   click **Select**.
8. On the Settings blade, you can accept the defaults; just ensure
   that the virtual network selected is **VNET-02** and the subnet is
   set to **20.0.0.0/24**. Click **OK**.
9. Review the settings on the **Summary** blade and click **OK**.

## Configure the NAT VM in each POC for gateway traversal
Because the POC was designed to be self-contained and isolated from the
network on which the physical host is deployed, the “External” VIP network
that the gateways are connected to is not actually external, but instead
is hidden behind a router doing Network Address Translation (NAT). The
router is actually a Windows Server VM (**MAS-BGPNAT01**) running the
Routing and Remote Access Services (RRAS) role in the POC
infrastructure. You must configure NAT on the MAS-BGPNAT01 VM to allow
the Site-to-Site VPN Connection to connect on both ends. To do this, you must create a Static NAT mapping that maps the external interface on the BGPNAT VM to the VIP of the Edge Gateway Pool for the ports required for a VPN Connection.

> [!NOTE]
> This configuration is required for POC environments only.
> 
> 

### Configure NAT
You need to follow these steps in BOTH POC environments.

1. Log in to the Azure Stack physical machine for POC1.
2. Press and hold [Windows Key] + R to open the **Run** menu and type
   **mstsc** and press **Enter**.
3. In the **Computer** field type the name **MAS-BGPNAT01** and click **Connect**.
4. Click on the Start menu and right-click **Windows PowerShell** and select
   **Run As Administrator**.
5. Type **ipconfig /all**.
6. Find the Ethernet Adapter that is connected to your on-premise
   network, and note the IPv4 address bound to that adapter. In
   the example environment, it’s **10.16.169.131** (circled in red below), but
   yours will be different.
   
    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image16.png)
7. Type the following PowerShell commands to designate the external NAT
   address for the ports that the IKE authentication. Remember to
   change the IP address to the one that matches your environment.
   
       Add-NetNatExternalAddress -NatName BGPNAT -IPAddress 10.16.169.131 -PortStart 499 -PortEnd 501
       Add-NetNatExternalAddress -NatName BGPNAT -IPAddress 10.16.169.131 -PortStart 4499 -PortEnd 4501
8. Next, you create a static NAT mapping to map the external
    address to the Gateway Public IP Address to map the ISAKMP port 500
    for PHASE 1 of the IPSEC tunnel.
   
        Add-NetNatStaticMapping -NatName BGPNAT -Protocol UDP -ExternalIPAddress 10.16.169.131 -InternalIPAddress 192.168.102.1 -ExternalPort 500 -InternalPort 500
> [!NOTE] 
> The `-InternalAddress` parameter here is the Public IP Address of the Virtual Network Gateway you created earlier.  To find this IP address, look at the properties of the Virtual Network Gateway blade, and find the value for the Public IP Address.       

9. Finally, you must configure NAT traversal which uses port 4500 to
   successfully establish the complete IPEC tunnel over NAT devices.
   
        Add-NetNatStaticMapping -NatName BGPNAT -Protocol UDP -ExternalIPAddress 10.16.169.131 -InternalIPAddress 192.168.102.1 -ExternalPort 4500 -InternalPort 4500
> [!NOTE] 
> The `-InternalAddress` parameter here is the Public IP Address of the Virtual Network Gateway you created earlier.  To find this IP address, look at the properties of the Virtual Network Gateway blade, and find the value for the Public IP Address.       

10. Repeat steps 1-9 in POC2.

## Test the connection
Now that the Site-to-Site connection has been established you should
validate that you can get traffic flowing through it. This task is simple
as it just involves logging in to one of the VMs you created in either POC
environment and pinging the VM you created in the other environment. To
ensure that you are putting the traffic through the Site-to-Site
connection, you want to make sure that you ping the Direct IP (DIP)
address of the VM on the remote subnet, not the VIP. To do this, you need to find and note the address on the other end of the connection.

### Log in to the tenant VM in POC1
1. Log in to the Azure Stack physical machine for POC1, and log in to the Portal using a tenant account.
2. Click **Virtual Machines** in the left navigation bar.
3. Find **VM01** that you created previously in the list of VMs and click it.
4. On the blade for the virtual machine click **Connect**.
   
     ![](media/azure-stack-create-vpn-connection-one-node-tp2/image17.png)
5. Open a Command prompt from inside the VM and type **ipconfig /all**.
6. Find the **IPv4 Address** in the output and note it. This is
   the address you will ping from POC2. In the example environment, the
   address is **10.0.10.4**, but in your environment it might
   be different. It should however fall within the **10.0.10.0/24**
   subnet that was created previously.

### Log in to the tenant VM in POC2
1. Log in to the Azure Stack physical machine for POC2 and log in to the portal using a tenant account.
2. Click **Virtual Machines** in the left navigation bar.
3. Find **VM02** that you created previously in the list of VMs and click it.
4. On the blade for the virtual machine click **Connect**.
   
5. Open a Command prompt from inside the VM and type **ipconfig /all**.
6. You should see an IPv4 address that falls within 10.0.20.0/24. In the example
   environment, the address is 10.0.20.4, but yours might be different.
7. Now from the VM in POC2 you want to ping the VM in POC1, through
   the tunnel. To do this you ping the DIP that you recorded from VM01.
   In the example environment this is 10.0.10.4, but be sure to ping the address you
   noted in your lab. You should see a result that looks like this:
   
    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image19b.png)
8. A reply from the remote VM indicates a successful test! You can
   close the VM Connect window. Or you can try doing some other
   data transfers like a file copy to test your connection.

### Viewing data transfer statistics through the gateway connection
If you want to know how much data is passing through your Site-to-Site
connection, this information is available in the Connection blade. This test
is also another good way to verify that the ping you just sent actually
went through the VPN connection.

1. While still logged in to tenant VM in POC2, log in to the
   **Microsoft Azure Stack POC Portal** using your tenant account.
2. Click the **Browse** menu item and select **Connections**.
3. Click the **POC2-POC1** connection in the list.
4. On the Connection blade, you can see statistics for **Data in** and
   **Data out**. In the following screen shot you see some larger numbers than just
   a ping will create. That’s because of some additional file transfers
   as well. You should see some non-zero values there.
   
    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image20.png)

