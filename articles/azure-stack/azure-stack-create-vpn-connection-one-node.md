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
ms.date: 5/23/2017
ms.author: scottnap

---
# Create a Site-to-Site VPN connection between two Virtual Networks in different Azure Stack PoC Environments
## Overview
This article shows you how to create a Site-to-Site VPN Connection between two virtual networks in two separate Azure Stack Proof-of-Concept (POC) environments. While you configure the connections, you will learn how VPN gateways in Azure Stack work.

### Connection diagram
The following diagram shows what the configuration should look like when you’re done:

![The final configuration](media/azure-stack-create-vpn-connection-one-node-tp2/OneNodeS2SVPN.png)

### Before you begin
To complete this configuration, ensure you have the following items before you get started:

* Two Servers that meet the Azure Stack POC hardware requirements
  defined by the [Azure Stack Deployment
  Prerequisites](azure-stack-deploy.md),
  and the other prerequisites defined by that article.
* The Azure Stack Technical Preview Deployment Package.

## Deploy the POC environments
You must deploy two Azure Stack POC environments to
complete this configuration.

* For each POC that you deploy, follow the deployment instructions
  in the article [Deploy Azure Stack
  POC](azure-stack-run-powershell-script.md).
  Each POC environment in this document is generically referred to as *POC1* and *POC2*.

## Prepare an offer on POC1 and POC2
On both POC1 and POC2, prepare an offer so that a user can subscribe to the offer and deploy virtual machines. Use the following article to create an offer: [Make virtual machines available to your Azure Stack users](azure-stack-tutorial-tenant-vm.md)

## Review and complete the network configuration table
The following table summarizes the network configuration for both POC environments. Use the procedure following the table to fill in the External BGPNAT address specific for your network.

**Network configuration table**
|   |POC1|POC2|
|---------|---------|---------|
|Virtual network name     |VNET-01|VNET-02 |
|Virtual network address space |10.0.10.0/23|10.0.20.0/23|
|Subnet name     |Subnet-01|Subnet-02|
|Subnet address range|10.0.10.0/24 |10.0.20.0/24 |
|Gateway subnet     |10.0.11.0/24|10.0.21.0/24|
|External BGPNAT address     |         |         |


The external BGPNAT IP addresses in the example environment are 10.16.167.195 for POC1 and 10.16.169.131 for POC2. Use the following procedure to determine the external BGPNAT IP addresses for your POC hosts and record them in the table.

### Get the IP address of the external adapter of the NAT VM
1. Log in to the Azure Stack physical machine for POC1.
2. Edit the following Powershell code to replace your administrator password, and then run on the POC host:

   ```
   cd \AzureStack-Tools-master\connect
   Import-Module .\AzureStack.Connect.psm1
   $Password = ConvertTo-SecureString "<your administrator password>" `
    -AsPlainText `
    -Force
   Get-AzureStackNatServerAddress `
    -HostComputer "mas-bgpnat01" `
    -Password $Password
   ```
3. Record the IP address in the Network configuration table.

Repeat this procedure on POC2.

## Create the Network Resources in POC1
Now you create the network resources you need to set up your gateways. These instructions show you how to create resources using the portal, but the same thing can be accomplished using PowerShell.

![](media/azure-stack-create-vpn-connection-one-node-tp2/image2.png)

### Log in as a tenant
A service administrator can log in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [Create a tenant
account](azure-stack-add-new-user-aad.md) before
you log in.

### Create the virtual network & VM subnet
1. Log in to the user portal using a tenant account.
2. In the portal, click **New**.

    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image3.png)

3. Select **Networking** from the Marketplace menu.
4. Click the **Virtual network** item on the menu.
5. Use the network configuration table to fill in the values for the **Name**, **Address space**, **Subnet name**, and **Subnet address range**.

6. You should see the Subscription you created earlier populated in the
   **Subscription** field.
7. For Resource Group, you can either create a Resource Group or if
   you already have one, select **Use existing**.
8. Verify the default location.
9. Click **Pin to dashboard**.
10. Click **Create**.

### Create the Gateway Subnet
1. Open the Virtual Network resource you created (VNET-01) from
   the dashboard.
2. On the Settings blade, select **Subnets**.
3. Click **Gateway Subnet** to add a gateway subnet to
   the virtual network.
   
    ![](media/azure-stack-create-vpn-connection-one-node-tp2/image4.png)
4. The name of the subnet is set to **GatewaySubnet** by default.
   Gateway subnets are special and must have this specific name to function properly.
5. In the **Address range** field, verify the address is **10.0.11.0/24**.
6. Click **OK** to create the gateway subnet.

### Create the Virtual Network Gateway
1. In the Azure portal, click **New**.
   
2. Select **Networking** from the Marketplace menu.
3. Select **Virtual network gateway** from the list of
   network resources.
4. In the **Name** field type **GW1**.
5. Click the **Virtual network** item to choose a virtual network.
   Select **VNET-01** from the list.
6. Click the **Public IP address** menu item. When the **Choose public
   IP address** blade opens click **Create new**.
7. In the **Name** field, type **GW1-PiP** and click **OK**.
8. The **VPN type** should have **Route-based** selected by default.
    Keep this setting.
9. Verify that **Subscription** and **Location** are correct. You can pin
    the resource to the Dashboard if you like. Click **Create**.

### Create the Local Network Gateway
The implementation of a *local network gateway* in this Azure Stack evaluation deployment is a bit different than in an actual Azure deployment.

Just like in Azure, you have the concept of a local network gateway. However, in an Azure deployment a *local network gateway* represents an on-premise (at the tenant)  physical device you use to connect to a virtual network gateway in Azure. But in this Azure Stack evaluation deployment, both ends of the connection are virtual network gateways!

A way to think about this more generically is that the Local Network Gateway resource is always meant to indicate the remote gateway at the other end of the connection. Because of the way the POC was designed, you need to provide the IP address of the external network adapter on the NAT VM of the other POC as the Public IP Address of the local network gateway. You then create NAT mappings on the NAT VM to make sure that both ends are connected properly.


### Create the Local Network Gateway Resource
1. Log in to the Azure Stack physical machine for POC1.
2. In the user portal, click **New**.
3. Select **Networking** from the Marketplace menu.
4. Select **local network gateway** from the list of resources.
5. In the **Name** field type **POC2-GW**.
6. In the **IP address** field, type the External BGPNAT address for POC2 that you recorded in the table.
7. In the **Address Space** field, type the address space of the VNET
   that you will create in POC2. This will be
   **10.0.20.0/23** so type that value.
8. Verify that your **Subscription**, **Resource Group** and
   **location** are all correct and click **Create**.

### Create the Connection
1. In the user portal, click **New**.
2. Select **Networking** from the Marketplace menu.
3. Select **Connection** from the list of resources.
4. In the **Basics** settings blade, choose **Site-to-site (IPSec)** as
   the **Connection type**.
5. Select the **Subscription**, **Resource Group** and **Location** and
   click **OK**.
6. In the **Settings** blade,  click **Virtual network gateway** click **GW1**.
7. Click **Local network gateway**, and click **POC2-GW**.
8. In the **Connection Name** field, type **POC1-POC2**.
9. In the **Shared key (PSK)** field type **12345** and click **OK**.
10. On the **Summary** blade, click **OK**.

### Create a VM
To validate data traveling through the VPN Connection, you
need virtual machines to send and receive data in each POC. Create a virtual machine in
POC1 now and put it on your VM subnet in your virtual network.

1. In the Azure portal, click **New**.
2. Select **Virtual Machines** from the Marketplace menu.
3. In the list of virtual machine images, select the **Windows Server 2016 Datacenter Eval** image.
4. On the **Basics** blade, in the **Name** field type **VM01**.
5. Type a valid user name and password. You’ll use this account to log
   in to the VM after it has been created.
6. Provide a **Subscription**, **Resource Group** and **Location** and
   then click **OK**.
7. On the **Size** blade, click a virtual machine size for this instance and then
   click **Select**.
8. On the **Settings** blade, you can accept the defaults. Just ensure
   the virtual network selected is **VNET-01** and the subnet is
   set to **10.0.10.0/24**. Click **OK**.
9. Review the settings on the **Summary** blade and click **OK**.



## Create the Network Resources in POC2
### Log in as a tenant
A service administrator can log in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [Create a tenant
account](azure-stack-add-new-user-aad.md) before
you log in.

### Create the virtual network and VM subnet

1. Log in using a tenant account.
2. In the user portal, click **New**.
3. Select **Networking** from the Marketplace menu.
4. Click the **Virtual network** item on the menu.
5. Use the network configuration table to fill in the values for the POC2 **Name**, **Address space**, **Subnet name**, and **Subnet address range**.

6. You should see the Subscription you created earlier populated in the **Subscription** field.
7. For Resource Group, you can either create a new Resource Group or if you already have one, select **Use existing**.
8. Verify the default **Location**.
9. Click **Pin to dashboard**.
10. Click **Create**.

### Create the Gateway Subnet
1. Open the Virtual network resource you created (**VNET-02**)
   from the Dashboard.
2. On the **Settings** blade, select **Subnets**.
3. Click  **Gateway subnet** to add a gateway subnet to
   the virtual network.
4. The name of the subnet is set to **GatewaySubnet** by default.
   Gateway subnets are special and must have this specific name to function properly.
5. In the **Address range** field, verify the address is **10.0.21.0/24**.
6. Click **OK** to create the gateway subnet.

### Create the Virtual Network Gateway
1. In the Azure portal, click **New**.
   
2. Select **Networking** from the Marketplace menu.
3. Select **Virtual network gateway** from the list of network resources.
4. In the **Name** field type **GW2**.
5. Click  **Virtual network** to choose a virtual network. Select **VNET-02** from the list.
6. Click **Public IP address**. When the **Choose public
   IP address** blade opens click **Create new**.
7. In the **Name** field, type **GW2-PiP** and click **OK**.
8. The **VPN type** should have **Route-based** selected by default.
    Keep this setting.
9. Verify **Subscription** and **Location** are correct. You can pin
    the resource to the dashboard if you like. Click **Create**.

### Create the Local Network Gateway Resource

2. In the POC2 user portal, click **New**.
   
4. Select **Networking** from the Marketplace menu.
5. Select **Local network gateway** from the list of resources.
6. In the **Name** field type **POC1-GW**.
7. In the **IP address** field, type the External BGPNAT address for POC1 that you recorded in the table earlier.
8. In the **Address Space** field, type the address space of
   **VNET-01** from POC1 - **10.0.10.0/23**.
9. Verify that your **Subscription**, **Resource Group** and **Location** are all correct and click **Create**.

## Create the Connection
1. In the user portal, click **New**.
   
2. Select **Networking** from the Marketplace menu.
3. Select **Connection** from the list of resources.
4. In the **Basic** settings blade, choose **Site-to-site (IPSec)** as
   the **Connection type**.
5. Select the **Subscription**, **Resource Group** and **Location** and
   click **OK**.
6. In the **Settings** blade, click **Virtual network gateway** and click **GW2**.
7. Click **Local network gateway** and click **POC1-GW**.
8. In the **Connection name** field, type **POC2-POC1**.
9. In the **Shared key (PSK)** field type **12345**. If you choose a different value, remember that it **MUST** match the value for shared key you created on POC1. Click **OK**.
10. Review the **Summary** blade and click **OK**.

## Create a virtual machine
Create a virtual machine in POC2 now and put it on your VM subnet in your virtual
network.

1. In the Azure portal, click **New**.
2. Select **Virtual Machines** from the Marketplace menu.
3. In the list of virtual machine images, select the **Windows Server 2016 Datacenter Eval** image.
4. On the **Basics** blade, in the **Name** field type **VM02**.
5. Type a valid user name and password. You’ll use this account to log
   in to the virtual machine after it has been created.
6. Provide a **Subscription**, **Resource Group** and **Location** and
   then click **OK**.
7. On the **Size** blade, click a virtual machine size for this instance and then
   click **Select**.
8. On the **Settings** blade, you can accept the defaults; just ensure
   that the Virtual network selected is **VNET-02** and the subnet is
   set to **10.0.20.0/24**. Click **OK**.
9. Review the settings on the **Summary** blade and click **OK**.

## Configure the NAT virtual machine on each POC for gateway traversal
Because the POC was designed to be self-contained and isolated from the
network on which the physical host is deployed, the “External” VIP network
that the gateways are connected to is not actually external, but instead
is hidden behind a router doing Network Address Translation (NAT). The
router is actually a Windows Server virtual machine (**MAS-BGPNAT01**) running the
Routing and Remote Access Services (RRAS) role in the POC
infrastructure. You must configure NAT on the MAS-BGPNAT01 virtual machine to allow
the Site-to-Site VPN Connection to connect on both ends. To do this, you must create a Static NAT mapping that maps the external interface on the BGPNAT virtual machine to the VIP of the Edge Gateway Pool for the ports required for a VPN Connection.

> [!NOTE]
> This configuration is required for POC environments only.
> 
> 

### Configure the NAT
> [!IMPORTANT]
> You must complete this procedure for **both** POC environments.

1. Determine the **Internal IP address** to use in the following PowerShell script. Open the virtual network gateway (GW1 and GW2), on the **Overview** blade note the value for the **Public IP address**.
![The internal IP address](media/azure-stack-create-vpn-connection-one-node-tp2/InternalIP.PNG)
2. Log in to the Azure Stack physical machine for POC1.
3. Copy and edit the following PowerShell script and run in an elevated Windows PowerShell ISE to configure the NAT on each POC. Edit the script to replace the **External BGPNAT address** and **Internal IP address**:

   ```
   # Designate the external NAT address for the ports that use the IKE authentication.
   Invoke-Command `
    -ComputerName mas-bgpnat01 `
     {Add-NetNatExternalAddress `
      -NatName BGPNAT `
      -IPAddress <External BGPNAT address> `
      -PortStart 499 `
      -PortEnd 501}
   Invoke-Command `
    -ComputerName mas-bgpnat01 `
     {Add-NetNatExternalAddress `
      -NatName BGPNAT `
      -IPAddress <External BGPNAT address> `
      -PortStart 4499 `
      -PortEnd 4501}
   # create a static NAT mapping to map the external address to the Gateway
   # Public IP Address to map the ISAKMP port 500 for PHASE 1 of the IPSEC tunnel
   Invoke-Command `
    -ComputerName mas-bgpnat01 `
     {Add-NetNatStaticMapping `
      -NatName BGPNAT `
      -Protocol UDP `
      -ExternalIPAddress <External BGPNAT address> `
      -InternalIPAddress <Internal IP address> `
      -ExternalPort 500 `
      -InternalPort 500}
   # Finally, configure NAT traversal which uses port 4500 to
   # successfully establish the complete IPSEC tunnel over NAT devices
   Invoke-Command `
    -ComputerName mas-bgpnat01 `
     {Add-NetNatStaticMapping `
      -NatName BGPNAT `
      -Protocol UDP `
      -ExternalIPAddress <External BGPNAT address> `
      -InternalIPAddress <Internal IP address> `
      -ExternalPort 4500 `
      -InternalPort 4500}
   ```

Repeat this procedure on POC2.

## Test the connection
Now that the Site-to-Site connection has been established you should
validate that you can get traffic flowing through it. This task is simple
as it just involves logging in to one of the virtual machines you created in either POC
environment to ping the virtual machine you created in the other environment. To
ensure that you are sending the traffic through the Site-to-Site
connection, you want to ensure you ping the Direct IP (DIP)
address of the virtual machine on the remote subnet, not the VIP. To do this, you need to find and note the address on the other end of the connection.

### Log in to the tenant VM in POC1
1. Log in to the Azure Stack physical machine for POC1, and log in to the user portal using a tenant account.
2. Click **Virtual Machines** in the left navigation bar.
3. Find **VM01** that you created previously in the list of VMs and click it.
4. On the blade for the virtual machine click **Connect**, and open the VM01.rdp file.
   
     ![The Connect button](media/azure-stack-create-vpn-connection-one-node-tp2/image17.png)
5. Log in with the account you configured when you created the virtual machine.
6. Open an elevated **Windows PowerShell** window.
7. Type **ipconfig /all**.
8. Find the **IPv4 Address** in the output and note it. This is
   the address you will ping from POC2. In the example environment, the
   address is **10.0.10.4**, but in your environment it might
   be different. It should however fall within the **10.0.10.0/24**
   subnet that you created previously.
9. Run the following PowerShell command to create a firewall rule that allows the virtual machine to respond to pings:

   ```
   New-NetFirewallRule `
    –DisplayName “Allow ICMPv4-In” `
    –Protocol ICMPv4
   ```

### Log in to the tenant VM in POC2
1. Log in to the Azure Stack physical machine for POC2 and log in to the user portal using a tenant account.
2. Click **Virtual Machines** in the left navigation bar.
3. Find **VM02** that you created previously in the list of virtual machines and click it.
4. On the blade for the virtual machine click **Connect**.
5. Log in with the account you configured when you created the virtual machine.
6. Open an elevated **Windows PowerShell** window.
7. Type **ipconfig /all**.
8. You should see an IPv4 address that falls within **10.0.20.0/24**. In the example
   environment, the address is **10.0.20.4**, but yours might be different.
9. Run the following PowerShell command to create a firewall rule that allows the virtual machine to respond to pings:

   ```
   New-NetFirewallRule `
    –DisplayName “Allow ICMPv4-In” `
    –Protocol ICMPv4
   ```

10. Now from the virtual machine on POC2, ping the virtual machine on POC1, through
   the tunnel. To do this you ping the DIP that you recorded from VM01.
   In the example environment this is **10.0.10.4**, but be sure to ping the address you
   noted in your lab. You should see a result that looks like the following:
   
    ![A successful ping](media/azure-stack-create-vpn-connection-one-node-tp2/image19b.png)
11. A reply from the remote virtual machine indicates a successful test! You can
   close the virtual machine window. Or you can try doing some other
   data transfers like a file copy to test your connection.

### Viewing data transfer statistics through the gateway connection
If you want to know how much data is passing through your Site-to-Site
connection, this information is available in the Connection blade. This test
is also another good way to verify that the ping you just sent actually
went through the VPN connection.

1. While still logged in to tenant virtual machine in POC2, sign in to the
   user portal using your tenant account.
2. Click the **All resources** menu item and find the **POC2-POC1** connection and click it. **Connections**.
4. On the Connection Overview blade, you can see statistics for **Data in** and
   **Data out**. In the following screen shot you see some larger numbers than just
   a ping creates. That’s because of some additional file transfers
   as well. You should see some non-zero values there.
   
    ![Data in and out](media/azure-stack-create-vpn-connection-one-node-tp2/image20.png)

