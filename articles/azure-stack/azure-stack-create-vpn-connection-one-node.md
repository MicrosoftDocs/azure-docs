---
title: Create a site-to-site VPN connection between two virtual networks in different Azure Stack Development Kit environments | Microsoft Docs
description: Step-by-step procedure that a cloud administrator uses to create a site-to-site VPN connection between two single-node Azure Stack Development Kit environments.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 3f1b4e02-dbab-46a3-8e11-a777722120ec
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/12/2018
ms.author: sethm
ms.reviewer: scottnap
ROBOTS: NOINDEX


---




# Create a site-to-site VPN connection between two virtual networks in different Azure Stack Development Kit environments
## Overview
This article shows you how to create a site-to-site VPN connection between two virtual networks in two separate Azure Stack Development Kit environments. While you configure the connections, you learn how VPN gateways in Azure Stack work.

### Connection diagram
The following diagram shows what the connection configuration should look like when you’re done.

![Site-to-site VPN connection configuration](media/azure-stack-create-vpn-connection-one-node-tp2/OneNodeS2SVPN.png)

### Before you begin
To complete the connection configuration, ensure that you have the following items before you begin:

* Two servers and other prerequisites that meet the Azure Stack Development Kit hardware requirements, as described in [Quickstart: Evaluate the Azure Stack Development Kit](azure-stack-deploy-overview.md). 
* The [Azure Stack Development Kit](https://azure.microsoft.com/overview/azure-stack/try/) deployment package.

## Deploy the Azure Stack Development Kit environments
To complete the connection configuration, you must deploy two Azure Stack Development Kit environments.
> [!NOTE] 
> For each Azure Stack Development Kit that you deploy, follow the [deployment instructions](azure-stack-run-powershell-script.md). In this article, the Azure Stack Development Kit environments are called *POC1* and *POC2*.


## Prepare an offer on POC1 and POC2
On both POC1 and POC2, prepare an offer so that a user can subscribe to the offer and deploy the virtual machines. For information on how to create an offer, see [Make virtual machines available to your Azure Stack users](azure-stack-tutorial-tenant-vm.md).

## Review and complete the network configuration table
The following table summarizes the network configuration for both Azure Stack Development Kit environments. Use the procedure that appears after the table to add the External BGPNAT address that is specific for your network.

**Network configuration table**
|   |POC1|POC2|
|---------|---------|---------|
|Virtual network name     |VNET-01|VNET-02 |
|Virtual network address space |10.0.10.0/23|10.0.20.0/23|
|Subnet name     |Subnet-01|Subnet-02|
|Subnet address range|10.0.10.0/24 |10.0.20.0/24 |
|Gateway subnet     |10.0.11.0/24|10.0.21.0/24|
|External BGPNAT address     |         |         |

> [!NOTE]
> The external BGPNAT IP addresses in the example environment are 10.16.167.195 for POC1, and 10.16.169.131 for POC2. Use the following procedure to determine the external BGPNAT IP addresses for your Azure Stack Development Kit hosts, and then add them to the previous network configuration table.


### Get the IP address of the external adapter of the NAT VM
1. Sign in to the Azure Stack physical machine for POC1.
2. Edit the following Powershell code to replace your administrator password, and then run the code on the POC host:

   ```powershell
   cd \AzureStack-Tools-master\connect
   Import-Module .\AzureStack.Connect.psm1
   $Password = ConvertTo-SecureString "<your administrator password>" `
    -AsPlainText `
    -Force
   Get-AzureStackNatServerAddress `
    -HostComputer "AzS-bgpnat01" `
    -Password $Password
   ```
3. Add the IP address to the network configuration table that appears in the previous section.

4. Repeat this procedure on POC2.

## Create the network resources in POC1
Now you create the POC1 network resources that you need to set up your gateways. The following instructions show you how to create the resources by using the user portal. You can also use PowerShell code to create the resources.

![Workflow that is used to create resources](media/azure-stack-create-vpn-connection-one-node-tp2/image2.png)

### Sign in as a tenant
A service administrator can sign in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [create a tenant
account](azure-stack-add-new-user-aad.md) before
you sign in.

### Create the virtual network and VM subnet
1. Use a tenant account to sign in to the user portal.
2. In the user portal, select **+ Create a resource**.
3. Go to **Marketplace**, and then select **Networking**.
4. Select **Virtual network**.
5. For **Name**, **Address space**, **Subnet name**, and **Subnet address range**, use the values that appear earlier in the network configuration table.
6. In **Subscription**, the subscription that you created earlier appears.
7. For **Resource Group**, you can either create a resource group or if
   you already have one, select **Use existing**.
8. Verify the default location.
9. Select **Pin to dashboard**.
10. Select **Create**.

### Create the gateway subnet
1. On the dashboard, open the VNET-01 virtual network resource that you created earlier.
2. On the **Settings** blade, select **Subnets**.
3. To add a gateway subnet to
   the virtual network, select **Gateway Subnet**.
   
    ![Add gateway subnet](media/azure-stack-create-vpn-connection-one-node-tp2/image4.png)

4. By default, the subnet name is set to **GatewaySubnet**.
   Gateway subnets are special. To function properly, they must use the *GatewaySubnet* name.
5. In **Address range**, verify that the address is **10.0.11.0/24**.
6. Select **OK** to create the gateway subnet.

### Create the virtual network gateway
1. In the Azure portal, select **+ Create a resource**. 
2. Go to **Marketplace**, and then select **Networking**.
3. From the list of
   network resources, select **Virtual network gateway**.
4. In **Name**, enter **GW1**.
5. Select the **Virtual network** item to choose a virtual network.
   Select **VNET-01** from the list.
6. Select the **Public IP address** menu item. When the **Choose public
   IP address** blade opens, select **Create new**.
7. In **Name**, enter **GW1-PiP**, and then select **OK**.
8.  By default, for **VPN type**, **Route-based** is selected.
    Keep the **Route-based** VPN type.
9. Verify that **Subscription** and **Location** are correct. You can pin
    the resource to the dashboard. Select **Create**.

### Create the local network gateway
The implementation of a *local network gateway* in this Azure Stack evaluation deployment is a bit different than in an actual Azure deployment.

In an Azure deployment, a local network gateway represents an on-premises (at the tenant) physical device, that you use to connect to a virtual network gateway in Azure. In this Azure Stack evaluation deployment, both ends of the connection are virtual network gateways!

A way to think about this more generically is that the local network gateway resource always indicates the remote gateway at the other end of the connection. Because of the way the Azure Stack Development Kit was designed, you need to provide the IP address of the external network adapter on the network address translation (NAT) VM of the other Azure Stack Development Kit as the Public IP Address of the local network gateway. You then create NAT mappings on the NAT VM to make sure that both ends are connected properly.


### Create the local network gateway resource
1. Sign in to the Azure Stack physical machine for POC1.
2. In the user portal, select **+ Create a resource**.
3. Go to **Marketplace**, and then select **Networking**.
4. From the list of resources, select **local network gateway**.
5. In **Name**, enter **POC2-GW**.
6. In **IP address**, enter the External BGPNAT address for POC2. This address appears earlier in the network configuration table.
7. In **Address Space**, for the address space of the POC2 VNET that you create later, enter **10.0.20.0/23**.
8. Verify that your **Subscription**, **Resource Group**, and
   **location** are correct, and then select **Create**.

### Create the connection
1. In the user portal, select **+ Create a resource**.
2. Go to **Marketplace**, and then select **Networking**.
3. From the list of resources, select **Connection**.
4. On the **Basics** settings blade, for the **Connection type**, select **Site-to-site (IPSec)**.
5. Select the **Subscription**, **Resource Group**, and **Location**, and
   then select **OK**.
6. On the **Settings** blade,  select **Virtual network gateway**, and then select **GW1**.
7. Select **Local network gateway**, and then select **POC2-GW**.
8. In **Connection Name**, enter **POC1-POC2**.
9. In **Shared key (PSK)**, enter **12345**, and then select **OK**.
10. On the **Summary** blade, select **OK**.

### Create a VM
To validate the data that travels through the VPN connection, you
need the virtual machines to send and receive data in each Azure Stack Development Kit. Create a virtual machine in
POC1 now, and then in your virtual network, put it on your VM subnet.

1. In the Azure portal, select **+ Create a resource**.
2. Go to **Marketplace**, and then select **Compute**.
3. In the list of virtual machine images, select the **Windows Server 2016 Datacenter Eval** image.
4. On the **Basics** blade, in **Name**, enter **VM01**.
5. Enter a valid username and password. You use this account to sign
   in to the VM after it's created.
6. Provide a **Subscription**, **Resource Group**, and **Location**, and
   then select **OK**.
7. On the **Size** blade, for this instance, select a virtual machine size, and then
   select **Select**.
8. On the **Settings** blade, accept the defaults. Ensure
   that the **VNET-01** virtual network is selected. Verify that the subnet is
   set to **10.0.10.0/24**. Then select **OK**.
9. On the **Summary** blade, review the settings, and then select **OK**.



## Create the network resources in POC2

The next step is to create the network resources for POC2. The following instructions show how to create the resources by using the user portal.

### Sign in as a tenant
A service administrator can sign in as a tenant to test the plans,
offers, and subscriptions that their tenants might use. If you don’t
already have one, [create a tenant
account](azure-stack-add-new-user-aad.md) before
you sign in.

### Create the virtual network and VM subnet

1. Sign in by using a tenant account.
2. In the user portal, select **+ Create a resource**.
3. Go to **Marketplace**, and then select **Networking**.
4. Select **Virtual network**.
5. Use the information appearing earlier in the network configuration table to identify the values for the POC2 **Name**, **Address space**, **Subnet name**, and **Subnet address range**.
6. In **Subscription**, the subscription that you created earlier appears.
7. For **Resource Group**, create a new resource group or, if you already have one, select **Use existing**.
8. Verify the default **Location**.
9. Select **Pin to dashboard**.
10. Select **Create**.

### Create the Gateway Subnet
1. Open the Virtual network resource you created (**VNET-02**)
   from the dashboard.
2. On the **Settings** blade, select **Subnets**.
3. Select  **Gateway subnet** to add a gateway subnet to
   the virtual network.
4. The name of the subnet is set to **GatewaySubnet** by default.
   Gateway subnets are special and must have this specific name to function properly.
5. In the **Address range** field, verify the address is **10.0.21.0/24**.
6. Select **OK** to create the gateway subnet.

### Create the virtual network gateway
1. In the Azure portal, select **+ Create a resource**.  
2. Go to **Marketplace**, and then select **Networking**.
3. From the list of network resources, select **Virtual network gateway**.
4. In **Name**, enter **GW2**.
5. To choose a virtual network, select **Virtual network**. Then select **VNET-02** from the list.
6. Select **Public IP address**. When the **Choose public
   IP address** blade opens, select **Create new**.
7. In **Name**, enter **GW2-PiP**, and then select **OK**.
8. By default, for **VPN type**, **Route-based** is selected.
    Keep the **Route-based** VPN type.
9. Verify that **Subscription** and **Location** are correct. You can pin
    the resource to the dashboard. Select **Create**.

### Create the local network gateway resource

1. In the POC2 user portal, select **+ Create a resource**. 
4. Go to **Marketplace**, and then select **Networking**.
5. From the list of resources, select **Local network gateway**.
6. In **Name**, enter **POC1-GW**.
7. In **IP address**, enter the External BGPNAT address for POC1 that is listed earlier in the network configuration table.
8. In **Address Space**, from POC1, enter the **10.0.10.0/23** address space of
   **VNET-01**.
9. Verify that your **Subscription**, **Resource Group**, and **Location** are correct, and then select **Create**.

## Create the connection
1. In the user portal, select **+ Create a resource**. 
2. Go to **Marketplace**, and then select **Networking**.
3. From the list of resources, select **Connection**.
4. On the **Basic** settings blade, for the **Connection type**, choose **Site-to-site (IPSec)**.
5. Select the **Subscription**, **Resource Group**, and **Location**, and
   then select **OK**.
6. On the **Settings** blade, select **Virtual network gateway**, and then select **GW2**.
7. Select **Local network gateway**, and then select **POC1-GW**.
8. In **Connection name**, enter **POC2-POC1**.
9. In **Shared key (PSK)**, enter **12345**. If you choose a different value, remember that it *must* match the value for the shared key that you created on POC1. Select **OK**.
10. Review the **Summary** blade, and then select **OK**.

## Create a virtual machine
Create a virtual machine in POC2 now, and put it on your VM subnet in your virtual
network.

1. In the Azure portal, select **+ Create a resource**.
2. Go to **Marketplace**, and then select **Compute**.
3. In the list of virtual machine images, select the **Windows Server 2016 Datacenter Eval** image.
4. On the **Basics** blade, for **Name**, enter **VM02**.
5. Enter a valid username and password. You use this account to sign
   in to the virtual machine after it's created.
6. Provide a **Subscription**, **Resource Group**, and **Location**, and
   then select **OK**.
7. On the **Size** blade, select a virtual machine size for this instance, and then
   select **Select**.
8. On the **Settings** blade, you can accept the defaults. Ensure
   that the **VNET-02** virtual network is selected, and verify that the subnet is
   set to **10.0.20.0/24**. Select **OK**.
9. Review the settings on the **Summary** blade, and then select **OK**.

## Configure the NAT virtual machine on each Azure Stack Development Kit for gateway traversal
Because the Azure Stack Development Kit is self-contained and isolated from the
network on which the physical host is deployed, the *external* VIP network
that the gateways are connected to is not actually external. Instead,
the VIP network is hidden behind a router that performs network address translation. 

The
router is a Windows Server virtual machine, called *AzS-bgpnat01*, that runs the
Routing and Remote Access Services (RRAS) role in the Azure Stack Development Kit
infrastructure. You must configure NAT on the AzS-bgpnat01 virtual machine to allow
the site-to-site VPN connection to connect on both ends. 

To configure the VPN connection, you must create a static NAT map route that maps the external interface on the BGPNAT virtual machine to the VIP of the Edge Gateway Pool. A static NAT map route is required for each port in a VPN connection.

> [!NOTE]
> This configuration is required for Azure Stack Development Kit environments only.
> 
> 

### Configure the NAT
> [!IMPORTANT]
> You must complete this procedure for *both* Azure Stack Development Kit environments.

1. Determine the **Internal IP address** to use in the following PowerShell script. Open the virtual network gateway (GW1 and GW2), and then on the **Overview** blade, save the value for the **Public IP address** for later use.
![Internal IP address](media/azure-stack-create-vpn-connection-one-node-tp2/InternalIP.PNG)
2. Sign in to the Azure Stack physical machine for POC1.
3. Copy and edit the following PowerShell script. To configure the NAT on each Azure Stack Development Kit, run the script in an elevated Windows PowerShell ISE. In the script, add values to the *External BGPNAT address* and *Internal IP address* placeholders:

   ```powershell
   # Designate the external NAT address for the ports that use the IKE authentication.
   Invoke-Command `
    -ComputerName AzS-bgpnat01 `
     {Add-NetNatExternalAddress `
      -NatName BGPNAT `
      -IPAddress <External BGPNAT address> `
      -PortStart 499 `
      -PortEnd 501}
   Invoke-Command `
    -ComputerName AzS-bgpnat01 `
     {Add-NetNatExternalAddress `
      -NatName BGPNAT `
      -IPAddress <External BGPNAT address> `
      -PortStart 4499 `
      -PortEnd 4501}
   # create a static NAT mapping to map the external address to the Gateway
   # Public IP Address to map the ISAKMP port 500 for PHASE 1 of the IPSEC tunnel
   Invoke-Command `
    -ComputerName AzS-bgpnat01 `
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
    -ComputerName AzS-bgpnat01 `
     {Add-NetNatStaticMapping `
      -NatName BGPNAT `
      -Protocol UDP `
      -ExternalIPAddress <External BGPNAT address> `
      -InternalIPAddress <Internal IP address> `
      -ExternalPort 4500 `
      -InternalPort 4500}
   ```

4. Repeat this procedure on POC2.

## Test the connection
Now that the site-to-site connection is established, you should
validate that you can get traffic flowing through it. To validate, sign in to one of the virtual machines that you created in either Azure Stack Development Kit
environment. Then, ping the virtual machine that you created in the other environment. 

To ensure that you send the traffic through the site-to-site
connection, ensure that you ping the Direct IP (DIP)
address of the virtual machine on the remote subnet, not the VIP. To do this, find the DIP address on the other end of the connection. Save the address for later use.

### Sign in to the tenant VM in POC1
1. Sign in to the Azure Stack physical machine for POC1, and then use a tenant account to sign in to the user portal.
2. In the left navigation bar, select **Compute**.
3. In the list of VMs, find **VM01** that you created previously, and then select it.
4. On the blade for the virtual machine, click **Connect**, and then open the VM01.rdp file.
   
     ![Connect button](media/azure-stack-create-vpn-connection-one-node-tp2/image17.png)
5. Sign in with the account that you configured when you created the virtual machine.
6. Open an elevated **Windows PowerShell** window.
7. Enter **ipconfig /all**.
8. In the output, find the **IPv4 Address**, and then save the address for later use. This is
   the address that you will ping from POC2. In the example environment, the
   address is **10.0.10.4**, but in your environment it might
   be different. It should fall within the **10.0.10.0/24**
   subnet that you created previously.
9. To create a firewall rule that allows the virtual machine to respond to pings, run the following PowerShell command:

   ```powershell
   New-NetFirewallRule `
    –DisplayName “Allow ICMPv4-In” `
    –Protocol ICMPv4
   ```

### Sign in to the tenant VM in POC2
1. Sign in to the Azure Stack physical machine for POC2, and then use a tenant account to sign in to the user portal.
2. In the left navigation bar, click **Compute**.
3. From the list of virtual machines, find **VM02** that you created previously, and then select it.
4. On the blade for the virtual machine, click **Connect**.
5. Sign in with the account that you configured when you created the virtual machine.
6. Open an elevated **Windows PowerShell** window.
7. Enter **ipconfig /all**.
8. You should see an IPv4 address that falls within **10.0.20.0/24**. In the example
   environment, the address is **10.0.20.4**, but your address might be different.
9. To create a firewall rule that allows the virtual machine to respond to pings, run the following PowerShell command:

   ```powershell
   New-NetFirewallRule `
    –DisplayName “Allow ICMPv4-In” `
    –Protocol ICMPv4
   ```

10. From the virtual machine on POC2, ping the virtual machine on POC1, through
   the tunnel. To do this, you ping the DIP that you recorded from VM01.
   In the example environment, this is **10.0.10.4**, but be sure to ping the address you
   noted in your lab. You should see a result that looks like the following:
   
    ![Successful ping](media/azure-stack-create-vpn-connection-one-node-tp2/image19b.png)
11. A reply from the remote virtual machine indicates a successful test! You can
   close the virtual machine window. To test your connection, you can try other kinds of
   data transfers like a file copy.

### Viewing data transfer statistics through the gateway connection
If you want to know how much data passes through your site-to-site
connection, this information is available on the **Connection** blade. This test
is also another way to verify that the ping you just sent actually
went through the VPN connection.

1. While you're signed in to the tenant virtual machine in POC2, use your tenant account to sign in to the
   user portal.
2. Go to **All resources**, and then select the **POC2-POC1** connection. **Connections** appears.
4. On the **Connection** blade, the statistics for **Data in** and
   **Data out** appear. In the following screenshot, the large numbers are attributed to additional file transfer. You should see some nonzero values there.
   
    ![Data in and out](media/azure-stack-create-vpn-connection-one-node-tp2/image20.png)
