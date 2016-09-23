
<properties
	pageTitle="Create a Site-to-Site VPN connection between two Virtual Networks in different Azure Stack PoC Environments | Microsoft Azure"
	description="Step-by-step procedure that will allow a cloud administrator to create a Site-to-Site VPN connection between two one-node POC environments in TP2."
	services="azure-stack"
	documentationCenter=""
	authors="ScottNapolitan"
	manager="darmour"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/26/2016"
	ms.author="scottnap"/>

# Create a Site-to-Site VPN connection between two Virtual Networks in different Azure Stack PoC Environments

Overview
=========

This article walks you through the steps to create a Site-to-Site
VPN Connection between two virtual networks in two separate Azure Stack
Proof-of-Concept (POC) environments. The purpose of this is to help
people who are evaluating Site-to-Site gateways understand how to set up
VPN connections between virtual networks in two different Azure Stack
deployments.  In the process of doing so, you will gain an understanding how VPN Gateways work in Azure Stack.

> This document applies specifically to the Azure Stack TP2 POC.

Connection diagram
==================

Following is a diagram that shows what our configuration should look like
when we’re done.

![](media/azure-stack-create-vpn-connection-one-node-tp2/image1.png)

Before you begin
================

To complete this configuration, you need the following
items so make sure you have these things before you get started.

-   Two Servers that meet the Azure Stack POC hardware requirements
    defined by the [Azure Stack Deployment
    Prerequisites](azure-stack-deploy.md),
    and the other prerequisites defined by that document.

-   The Azure Stack Technical Preview 2 Deployment Package.

Deploying the POC environments
==============================

You need to deploy **two** Azure Stack POC environments to
complete this configuration.

-   For the first POC, you can simply follow the deployment instructions
    detailed in the article [Deploy Azure Stack
    POC](azure-stack-run-powershell-script.md).

-   For the second POC, you need to change the external network
    address range, which requires changing settings in files in the
    Cloud Deployment files **before you deploy the POC**.

**Note**: It is important that you make changes to the Deployment
before you deploy the second POC because you cannot change this after it
has been deployed.

Deploying POC Environment 1
---------------------------

For the first POC deployment, you must first prepare the deployment
machine and then run the PowerShell deployment script. You can find
step-by-step instructions online on [How to Deploy Azure Stack
POC](azure-stack-run-powershell-script.md).

Deploying POC Environment 2
---------------------------

Before you deploy the second POC, you must change the
external (VIP) address range, and the hardcoded IP addresses of
several services. The Azure Stack POC deployment is designed to be
self-contained and isolated from the test of the network. By default,
the Azure Stack POC deployment uses the same address ranges for its
networks so that the experience is consistent for all users evaluating
Azure Stack. However, since we want to connect two Azure Stack POC
deployments, it is necessary to change the External VIP range in one
environment so that it is different from the other.

### Change the External Address (VIP) Range

1.  Open the One Node Customer Configuration Template from the
    CloudDeployment package. If you downloaded the package to your C:
    drive, the path to this file looks like this.

> C:\\CloudDeployment\\CustomerConfig.xml

1.  Open the file with your preferred text editor.

2.  Find the Network Configuration section, which should be near the top
    of the document. Find the network with the name “External”.

> &lt;Network Id="External" Name="External" VLanId="0"&gt;
>
> &lt;!-- Default Gateway should be .0 --&gt;
>
> &lt;IPv4 Subnet="192.168.102.0/24" DefaultGateway="192.168.102.0"
> /&gt;
>
> &lt;/Network&gt;

1.  Change the **Subnet** entry to **192.168.112.0/24** and the
    **DefaultGateway** entry to **192.168.112.0**.

2.  Be sure to save the file.

### Change the Gateway Pool Public IP Address

Next, change the IP Address of the Fabric multi-tenant
Gateway

1.  Open the fabric Gateway configuration template with your preferred
    text editor. If you downloaded your POC deployment package to your
    C: drive, you would find this file in the following location.

> C:\\CloudDeployment\\Configuration\\Roles\\Fabric\\Gateway\\OneNodeRole.xml

2.  Look for the following entry.

> &lt;PublicInfo&gt;
>
> &lt;VIPs&gt;
>
> &lt;VIP Id="GatewayPublicIPaddress" Name="PublicIPExternaVIP"
> NetworkId="External" IPv4Address="192.168.102.1/24" /&gt;
>
> &lt;/VIPs&gt;
>
> &lt;/PublicInfo&gt;

3.  Change the value for **Ipv4Address** from **192.168.102.1/24** to
    **192.168.112.1/24**.

4.  Save the file.

### Change the VIPs of External Facing Service Endpoints

Finally, change the VIP addresses of a few externally facing
fabric services so that they correspond with the correct VIP address
pool range. There are a handful of such services, and you will need to
edit the Configuration file (OneNodeRole.xml) for each one. After making
the change described for each file, make sure you save the file so that the changes get picked up during
deployment.  In our example, we're going to change each entry from 192.168.102.0/24 to 192.168.112.0/24 for each occurrence.

#### Active Directory Federation Services (ADFS)

  | **Path to config file: ** |  C:\\CloudDeployment\\Configuration\\Roles\\Fabric\\ADFS\\OneNodeRole.xml |
  |---------------------------|---------------------------------------------------------------------------|
  | **Default Value: **       | &lt;VIP Id="Adfs" Name="Active Directory Federation Services" NetworkId="External" IPv4Address="192.168.102.2/24" EnableOutboundNat="True"&gt; |
  | **New Value: **           | &lt;VIP Id="Adfs" Name="Active Directory Federation Services" NetworkId="External" IPv4Address="192.168.112.2/24" EnableOutboundNat="True"&gt; |
  | **Default Value:**        | &lt;VIP Id="Graph" Name="Azure Stack Graph" NetworkId="External" IPv4Address="192.168.102.8/24" EnableOutboundNat="True"&gt; |
  | **New Value:**             | &lt;VIP Id="Graph" Name="Azure Stack Graph" NetworkId="External" IPv4Address="192.168.112.8/24" EnableOutboundNat="True"&gt; |

#### Fabric Ring Services

  |**Path to config file: **  | C:\\CloudDeployment\\Configuration\\Roles\\Fabric\\FabricRingServices\\OneNodeRole.xml |
  | --------------------------| ---------------------------------------------------------------------------------------|
  |**Default Value: **        | &lt;VIP Id="XrpExternal" Name="XRP External (extension)" NetworkId="External" IPv4Address="192.168.102.7/24" EnableOutboundNat="True"&gt; |
  | **New Value: **            | &lt;VIP Id="XrpExternal" Name="XRP External (extension)" NetworkId="External" IPv4Address="192.168.112.7/24" EnableOutboundNat="True"&gt; |

#### Key Vault Service

  | **Path to config file: **  | C:\\CloudDeployment\\Configuration\\Roles\\Fabric\\KeyVault\\OneNodeRole.xml |
  | ---------------------------|------------------------------------------------------------------------------|
  | **Default Value: **        | &lt;VIP Id="KeyVaultDataPlane" Name="Key Vault Data Plane API" NetworkId="External" IPv4Address="192.168.102.3/24" EnableOutboundNat="True"&gt; |
  | **New Value: **            | &lt;VIP Id="KeyVaultDataPlane" Name="Key Vault Data Plane API" NetworkId="External" IPv4Address="192.168.112.3/24" EnableOutboundNat="True"&gt; |

#### Microsoft Azure Stack Resource Manager

  | **Path to config file: **  | C:\\CloudDeployment\\Configuration\\Roles\\Fabric\\WAS\\OneNodeRole.xml |
  | ---------------------------| ------------------------------------------------------------------------|
  |**Default Value:**         |&lt;VIP Id="WapApi" Name="Azure Stack Resource Manager" NetworkId="External" IPv4Address="192.168.102.4/24" EnableOutboundNat="True"&gt; |
  | **New Value:**             | &lt;VIP Id="WapApi" Name="Azure Stack Resource Manager" NetworkId="External" IPv4Address="192.168.112.4/24" EnableOutboundNat="True"&gt; |

#### Azure Consistent Storage Services (WOSS)

  | **Path to config file: **  | C:\\CloudDeployment\\Configuration\\Roles\\Fabric\\WOSS\\OneNodeRole.xml |
  |--------------------------- | -------------------------------------------------------------------------|
  | **Default Value:**         | &lt;VIP Id="AcsRestApi" Name="Acs Rest API" NetworkId="External" IPv4Address="192.168.102.6/24" EnableOutboundNat="True" InterfaceName="SLBTraffic" &gt; |
  | **New Value:**             | &lt;VIP Id="AcsRestApi" Name="Acs Rest API" NetworkId="External" IPv4Address="192.168.112.6/24" EnableOutboundNat="True" InterfaceName="SLBTraffic" &gt; |

Once you have made the necessary changes and saved them, you can proceed
with the second POC deployment. From here it should work exactly like
the first POC deployment. Again, you can find step-by-step instructions
online on [How to Deploy Azure Stack
POC](azure-stack-run-powershell-script.md).

Configure Quotas for Compute, Network and Storage
=================================================

You need to configure Quotas for Compute, Network and Storage so
that these services can be associated with a Plan and then an Offer that
tenants can subscribe to.

**Note:** You need to do these steps for each Azure Stack POC
environment.

The experience to create Quotas for Services has changed from TP1. The
steps on how to create Quotas in TP2 can be found at
<http://aka.ms/mas-create-quotas>. You can accept the defaults for all
quota settings for this exercise.

Create a Plan and Offer
=======================

[Plans](azure-stack-key-features.md) are
groupings of one or more services. As a provider, you can create plans
to offer to your tenants. In turn, your tenants subscribe to your offers
to use the plans and services they include.

**Note:** You will need to do these steps for each Azure Stack POC
environment.

1.  First create a Plan. To do this, you can follow the steps in the
    [Create a
    Plan](azure-stack-create-plan.md)
    online article.

2.  Create an Offer following the steps described in [Create an Offer in
    Azure
    Stack](azure-stack-create-offer.md).

3.  Log in to the Portal as a Tenant Administrator and [subscribe to the
    Offer you
    created](azure-stack-subscribe-plan-provision-vm.md.

Create the Network Resources in POC 1
=====================================

Now we are going to actually create the resources we need to set up
our configuration. The following steps illustrate what we’ll be doing. These
instructions will be showing how to create resources via the Portal, but
the same thing can be accomplished via PowerShell.

![](media/azure-stack-create-vpn-connection-one-node-tp2/image2.png)
Log in as a tenant
-----------------

A service administrator can log in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [Create a tenant
account](azure-stack-add-new-user-aad.md) before
you log in.

Create the virtual network & VM subnet
--------------------------------------

1.  Log in using a tenant account.

2.  In the Azure portal, click the
    **New** icon.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)
3.  Select **Networking** from the Marketplace menu.

4.  Click the **Virtual network** item on the menu.

5.  Click the **Create** button near the bottom of the resource
    description blade. Enter the following values into the appropriate
    fields according to this table.

| **Field**             | **Value** |
|----------------------- | ------ |
| Name                  |vnet-01 |
| Address space         | 10.0.0.0/16 |
| Subnet name           | subnet-01 |
| Subnet address range  | 10.0.0.0/24 |

1.  You should see the Subscription you created earlier populated in the
    **Subscription** field.

2.  For Resource Group, you can either create a new Resource Group or if
    you already have one, select Use existing.

3.  Verify the default location.

4.  Click the **Create** button.

Create the Gateway Subnet
-------------------------

1.  Open the Virtual network resource you just created (Vnet-01) from
    the Dashboard.

2.  On the Settings blade, select Subnets

3.  Click the **Gateway Subnet** button to add a Gateway Subnet to
    the Virtual network.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image4.png)
4.  The name of the Subnet is set to **GatewaySubnet** by default.
    Gateway subnets are special and must have this specific name in
    order to function properly.

5.  In the **Address range** field, enter **10.0.1.0/24**.

6.  Click on the **Create** button to create the Gateway subnet.

Create the Virtual Network Gateway
----------------------------------

1.  In the Azure portal, click on the
    **New** icon.

    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

2.  Select **Networking** from the Marketplace menu.

3.  Select **Virtual network gateway** from the list of
    network resources.

4.  Review the description and click **Create**.

5.  In the **Name** field type **GW1**.

6.  Click the **Virtual network** item to Choose a virtual network.
    Select **Vnet-01** from the list.

7.  Click the **Public IP address** menu item. When the Choose public
    IP address blade opens click on the Create new button.

8.  In the **Name** field, enter **GW1-PiP** and click **Ok.**

9.  The **Gateway type** should have **VPN** selected by default. Keep
    this setting.

10. The **VPN type** should have **Route-based** selected by default.
    Keep this setting.

11. Verify **Subscription** and **Location** are correct. You can pin
    the resource to the Dashboard if you like. Click **Create**.

Create the Local Network Gateway
--------------------------------

The Local Network Gateway resource is a little weird in our scenario.
It’s the same resource you find in Azure, however in Azure it’s
typically meant to represent a physical, on-premise device you would
use to connect to the virtual network gateway in Azure. In our example,
both ends of the connection are actually virtual network gateways!

A way to think about this more generically is that the Local Network
Gateway resource is always meant to indicate the remote gateway at the
other end of the connection. Because of the way the POC was designed, we
actually need to provide the address of the external network
adapter on the NAT VM of the other POC as the Public IP Address of the
Local Network Gateway. We will then create NAT mappings on the NAT VM to
make sure that both ends are connected properly.

### Get the IP address of the external Adapter of the NAT VM

1.  Log in to the Azure Stack physical machine for POC2.

2.  [Windows Key]+ R to open the **Run** menu and type
    **mstsc** and hit enter.

3.  In the **Computer** field enter the name **MAS-BGPNAT01** and click
    the **Connect** button.

4.  Click the Start Menu and right-click on PowerShell and select
    **Run As Administrator**.

5.  Type **IPConfig /all**.

6.  Find the Ethernet Adapter that is connected to your on-premise
    network, and take note of the IPv4 address bound to that adapter. In
    my environment, it’s **10.16.169.132** but yours will be
    something different.

7.  Record this address. This is what we will use as the Public IP
    Address of the Local Network Gateway resource we create in POC1.

### Create the Local Network Gateway Resource

1.  Log in to the Azure Stack physical machine for POC1.

2.  In the **Computer** field, enter the name **MAS-CON01** and click the
    **Connect** button.

3.  In the Azure portal, click the **New** icon.

    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

4.  Select **Networking** from the Marketplace menu.

5.  Select **local network gateway** from the list of resources.

6.  In the **Name** field enter **POC2-GW**.

7.  We don’t know the IP address of our other Gateway yet, but that’s ok
    because we can come back and change it later. For now, enter
    **10.16.169.132** in the **IP address field**.

8.  In the **Address Space** field enter the address space of the Vnet
    that we will be creating in POC2. This is going to be
    **20.0.0.0/16** so enter that value.

9.  Verify that your **Subscription**, **Resource Group** and
    **location** are all correct and click **Create**.

Create the Connection
----------------------

1.  In the Azure portal, click the
    **New** icon.

  ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

2.  Select **Networking** from the Marketplace menu.

3.  Select **Connection** from the list of resources.

4.  In the **Basic** settings blade, choose **Site-to-site (IPSec)** as
    the **Connection type**.

5.  Select the **Subscription**, **Resource Group** and **Location** and
    click **Ok**.

6.  In the **Settings** blade, choose the **Virtual Network Gateway**
    (**GW1**) you created earlier.

7.  Choose the **local** **Network Gateway** (**POC2-GW**) you
    created earlier.

8.  In the **Connection Name** field, enter **POC1-POC2**.

9.  In the **Shared Key (PSK)** field enter **12345**. Click **Ok**.

Create a VM
-----------

In order to validate data traveling through the VPN Connection, you
need VMs to send and receive data in each POC. Let’s create a VM in
POC1 now and put it on our VM subnet in our virtual network.

1. In the Azure portal, click on the
    **New** icon.

     ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

2.  Select **Compute** from the Marketplace menu.

3.  In the list of virtual machine images, select the **Windows Server
    2012 R2 Datacenter** image.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image6.png)

4.  On the **Basics** blade, in the **Name** field enter the value
    **VM01**.

5.  Enter a valid User name and password. You’ll use this account to log
    in to the VM after it has been created.

6.  Provide a **Subscription**, **Resource Group** and **Location** and
    then click **Ok**.

7.  On the **Size** blade, choose a VM size for this instance and then
    click **Select**.

8.  On the Settings blade, you can accept the defaults, just make sure
    that the Virtual network selected is **VNET-01** and the Subnet is
    set to **10.0.0.0/24**. Click **Ok**.

9.  Review the settings on the **Summary** blade and click **Ok**.

Create the Network Resources in POC 2
=====================================

Log in as a tenant
-----------------

A service administrator can log in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [Create a tenant
account](azure-stack-add-new-user-aad.md) before
you log in.

Create the virtual network & VM subnet
--------------------------------------

1. Log in using a tenant account.

2. In the Azure portal, click on the
    **New** icon.

     ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

3.  Select **Networking** from the Marketplace menu.

4.  Click on the **Virtual network** item on the menu.

5.  Click the **Create** button near the bottom of the resource
    description blade. Enter the following values for the appropriate
    fields listed in the table below.

|**Field**              |**Value** |
| ----------------------|----------|
| Name                  | vnet-02 |
| Address space         | 20.0.0.0/16 |
| Subnet name           | subnet-02 |
| Subnet address range  | 20.0.0.0/24 |

6.  You should see the Subscription you created earlier populated in the
    **Subscription** field.

7.  For Resource Group, you can either create a new Resource Group or if
    you already have one, select Use existing.

8.  Verify the default **location**. If you want, you can pin the
    virtual network to the Dashboard for easy access.

9.  Click the **Create** button.

Create the Gateway Subnet
-------------------------

1.  Open the Virtual network resource you created (**Vnet-02**)
    from the Dashboard.

2.  On the **Settings** blade, select **Subnets.**

3.  Click the **Gateway Subnet** button to add a Gateway Subnet to
    the Virtual network.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image4.png)

4.  The name of the Subnet is set to **GatewaySubnet** by default.
    Gateway subnets are special and must have this specific name in
    order to function properly.

5.  In the **Address range** field, enter **20.0.1.0/24**.

6.  Click the **Create** button to create the Gateway subnet.

Create the Virtual Network Gateway
----------------------------------

1. In the Azure portal, click the
    **New** icon.

      ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

2.  Select **Networking** from the Marketplace menu.

3.  Select **Virtual network gateway** from the list of
    network resources.

4.  Review the description and click **Create**.

5.  In the **Name** field type **GW2**.

6.  Click the **Virtual network** item to choose a virtual network.
    Select **Vnet-02** from the list.

7.  Click the **Public IP address** menu item. When the Choose public
    IP address blade opens click on the Create new button.

8.  In the **Name** field, enter **GW2-PiP** and click **Ok.**

9.  The **Gateway type** should have **VPN** selected by default. Keep
    this setting.

10. The **VPN type** should have **Route-based** selected by default.
    Keep this setting.

11. Verify **Subscription** and **Location** are correct. You can pin
    the resource to the Dashboard if you like. Click **Create**.

Create the Local Network Gateway
--------------------------------

### Get the IP address of the external Adapter of the NAT VM

1.  Log in to the Azure Stack physical machine for POC1.

2.  Press and hold [Windows Key] + R to open the **Run** menu and type
    **mstsc** and hit enter.

3.  In the **Computer** field enter the name **MAS-BGPNAT01** and click
    the **Connect** button.

4.  Click on the Start Menu and right-click on PowerShell and select
    **Run As Administrator**.

5.  Type **IPConfig /all**.

6.  Find the Ethernet Adapter that is connected to your on-premise
    network, and take note of the IPv4 address bound to that adapter. In
    my environment it’s **10.16.169.131** but yours will be
    something different.

7.  Record this address. This is what we will later use as the Public IP
    Address of the Local Network Gateway resource we create in POC1.

### Create the Local Network Gateway Resource

1.  Log in to the Azure Stack physical machine for POC2.

2.  In the **Computer** field enter the name **MAS-CON01** and click the
    **Connect** button.

3. In the Azure portal, click the **New** icon.

	 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

4.  Select **Networking** from the Marketplace menu.

5.  Select **local network gateway** from the list of resources.

6.  In the **Name** field enter **POC1-GW**.

7.  Now we need the Public IP Address we recorded for the Virtual
    network gateway in POC1. Enter **10.16.169.131** in the **IP address
    field**.

8.  In the **Address Space** field enter the address space of
    **Vnet-01** from POC1 - **10.0.0.0/16**.

9.  Verify that your **Subscription**, **Resource Group** and
    **location** are all correct and click **Create**.

Create the Connection
----------------------

1. In the Azure portal, click the
    **New** icon.

	  ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

2.  Select **Networking** from the Marketplace menu.

3.  Select **Connection** from the list of resources.

4.  In the **Basic** settings blade, choose **Site-to-site (IPSec)** as
    the **Connection type**.

5.  Select the **Subscription**, **Resource Group** and **Location** and
    click **Ok**.

6.  In the **Settings** blade, choose the **Virtual Network Gateway**
    (**GW1**) you created earlier.

7.  Choose the **local** **Network Gateway** (**POC1-GW**) you
    created earlier.

8.  In the **Connection Name** field, enter **POC2-POC1**.

9.  In the **Shared Key (PSK)** field enter **12345**. If you choose a
    different value, remember that it MUST match the value for Shared
    Key you assigned in POC1. Click **Ok**.

Create a VM
-----------

Create a VM in POC1 now and put it on our VM subnet in our virtual
network.

1.  In the Azure portal, click on the
    **New** icon.

	![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

2.  Select **Compute** from the Marketplace menu.

3.  In the list of virtual machine images, select the **Windows Server
    2012 R2 Datacenter** image.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image6.png)

4.  On the **Basics** blade, in the **Name** field enter the value
    **VM02**.

5.  Enter a valid User name and password. You’ll use this account to log
    in to the VM after it has been created.

6.  Provide a **Subscription**, **Resource Group** and **Location** and
    then click **Ok**.

7.  On the **Size** blade, choose a VM size for this instance and then
    click **Select**.

8.  On the Settings blade, you can accept the defaults, just make sure
    that the Virtual network selected is **VNET-02** and the Subnet is
    set to **20.0.0.0/24**. Click **Ok**.

9.  Review the settings on the **Summary** blade and click **Ok**.

Configure the NAT VM in each POC for gateway traversal
======================================================

Because the POC was designed to be self-contained and isolated from the
network on which the physical host is deployed, the “External” VIP network
that the gateways are connected to is not actually external, but instead
is hidden behind a router doing Network Address Translation (NAT). The
router is actually a Windows Server VM (**MAS\_BGPNAT01**) running the
Routing and Remote Access Services (RRAS) role in the POC
infrastructure. We need to configure NAT on the MAS-BGPNAT01 VM to allow
the Site-to-Site VPN Connection to connect on both ends.
> **NOTE: This configuration is required for POC environments only.**

Configure NAT
-------------

You need to follow these steps in BOTH POC environments.

1.  Log in to the Azure Stack physical machine for POC1.

2.  Press and hold [Windows Key] + R to open the **Run** menu and type
    **mstsc** and hit enter.

3.  In the **Computer** field enter the name **MAS-BGPNAT01** and click
    the **Connect** button.

4.  Click on the Start Menu and right-click on PowerShell and select
    **Run As Administrator**.

5.  Type **IPConfig /all**.

6.  Find the Ethernet Adapter that is connected to your on-premise
    network, and take note of the IPv4 address bound to that adapter. In
    my environment, it’s **10.16.169.131** (circled in red below), but
    yours will be something different.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image16.png)

7.  Enter the following PowerShell command to designate the external NAT
    address for the ports that the IKE authentication. Remember to
    change the IP Address to the one that matches your environment.

 >        Add-NetNatExternalAddress -NatName BGPNAT -IPAddress 10.16.169.131 PortStart 499 -PortEnd 501

8. Next, we will create a static NAT mapping to map the external
    address to the Gateway Public IP Address to map the ISAKMP port 500
    for PHASE 1 of the IPSEC tunnel.

 >      Add-NetNatStaticMapping -NatName BGPNAT -Protocol UDP -ExternalIPAddress 10.16.169.131 -InternalIPAddress 192.168.102.1
 >     -ExternalPort 500 -InternalPort 500

9.  Finally, we will need to do NAT traversal which uses port 4500 to
    successfully establish the complete IPEC tunnel over NAT devices.

 >     Add-NetNatStaticMapping -NatName BGPNAT -Protocol UDP
 >     -ExternalIPAddress 10.16.169.131 -InternalIPAddress 192.168.102.1
 >     -ExternalPort 4500 -InternalPort 4500

10.  Repeat steps 1-9 in POC2.

Test the connection
===================

Now that the Site-to-Site connection has been established we should
validate that we can get traffic flowing through it. This task is simple
as it just involves logging in to one of the VMs we created in either POC
environment and pinging the VM we created in the other environment. To
ensure that we are putting the traffic through the Site-to-Site
connection, we want to make sure that we ping the Direct IP (DIP)
address of the VM on the remote subnet, not the VIP. To do this, we will
need to find out what the address is on the other end of our connection.

Log in to the tenant VM in POC1
------------------------------

1.  Log in to the Azure Stack physical machine for POC1, and Log in to the Portal using a tenant account.

3.  Click the **Virtual Machines** icon in the left navigation bar.

4.  Find **VM01** that you created earlier in the list of VMs and click
    on it.

5. On the blade for the virtual machine
    click **Connect**.

	 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image17.png)

6.  Open a Command Prompt from inside the VM and type **IPConfig /all**.

7.  Find the **IPv4 Address** in the output and take note of it. This is
    the address you will ping from POC2. In my test environment, the
    address is **10.0.0.4**, but in your environment it might
    be different. It should however fall within the **10.0.0.0/24**
    subnet that we created earlier.

Log in to the tenant VM in POC2
------------------------------

1.  Log in to the Azure Stack physical machine for POC2 and Log in to the portal using a tenant account.

3.  Click the **Virtual Machines** icon in the left navigation bar.

4.  Find **VM02** that you created earlier in the list of VMs and click
    on it.

5.  On the blade for the virtual machine
    click **Connect**.

	 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image17.png)

6.  Open a Command Prompt from inside the VM and type **IPConfig /all**.

7.  You should see an IPv4 address that falls within 20.0.0.0/24. In my
    test lab, the address is 20.0.0.4, but yours might be different.

8.  Now from the VM in POC2 we want to ping the VM in POC1, through
    the tunnel. To do this we ping the DIP that we recorded from VM01.
    In my lab this is 10.0.0.4, but be sure to ping the address you
    found in your lab. You should see a result that looks like this.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image16.png)

9.  A reply from the remote VM indicates a successful test! You can
    close the VM Connect window or, if you like, try doing some other
    data transfers to test your connection (like a file copy).

Viewing data transfer statistics through the gateway connection
---------------------------------------------------------------

If you want to know how much data is passing through your Site-to-Site
connection, this information is available in the Connection blade. This test
is also another good way to verify that the ping you just sent actually
went through the VPN connection.

1.  While still logged in to **ClientVM** in POC2, Log in to the
    **Microsoft Azure Stack POC Portal** using your tenant account.

2.  Click the **Browse** menu item and select **Connections**.

3.  Click the **POC2-POC1** connection in the list.

4.  On the connection blade, you can see statistics for Data in and
    Data out. In the picture below you see some larger numbers than just
    ping would account for. That’s because we did some file transfers
    as well. You should see some non-zero values there.

 ![](media/azure-stack-create-vpn-connection-one-node-tp2/image20.png)
