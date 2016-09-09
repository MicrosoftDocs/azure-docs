<properties 
   pageTitle="How to connect classic VNets to ARM VNets in Azure - Solution Guide"
   description="Learn how to create a VPN connection between classic VNets and new VNets"
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/15/2016"
   ms.author="cherylmc" />

# Connecting classic VNets to new VNets

Azure currently has two management modes: Azure Service Manager (referred to as classic), and Azure Resource Manager (ARM). If you have been using Azure for some time, you probably have Azure VMs and instance roles running on a classic VNet. And your newer VMs and role instances may be running on a VNet created in ARM.

In such situations, you will want to ensure the new infrastructure is able to communicate with your classic resources. You can do so by creating a VPN connection between the two VNets. The figure below illustrates a sample environment with two VNets (classic and ARM), along with a secure tunnel connectivity between the VNets.

![](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure01.png)

>[AZURE.NOTE] This document walks you through an end-to-end solution, for testing purposes. If you already have your VNets setup, and are familiar with VPN gateways and site-to-site connection in Azure, visit [Configure a S2S VPN between an ARM VNet and a classic VNet](virtual-networks-arm-asm-s2s-howto.md).

To test this scenario, you will:

1. [Create a classic VNet environment](#Create-a-classic-VNet-environment).
2. [Create a new VNet environment](#Create-a-new-VNet-environment).
3. [Connect the two VNets](#Connect-the-two-VNets).

You will execute the steps above by first using classic Azure management tools, including the classic portal, network configuration files, and Azure Service Manager PowerShell cmdlets; and later move on to the new management tools, including the new Azure portal, ARM templates, and ARM PowerShell cmdlets.

>[AZURE.IMPORTANT] For VNets to be connected to one another, they cannot have a CIDR block clash. Make sure each VNet has a unique CIDR block! 

## Create a classic VNet environment

You can use an existing classic VNet to connect to a new ARM VNet. In this example, you will see how to create a new classic VNet, with two subnets, a gateway, and a VM for testing purposes.

### Step 1: Create a classic VNet

To create a new VNet that maps to figure 1 above, follow the instructions below.

1. From a PowerShell console, login to your Azure account by running the command below.

		Login-AzureRmAccount

4. Download your Azure network configuration file by running command below.

		Get-AzureVNetConfig -ExportToFile c:\Azure\classicvnets.netcfg

		XMLConfiguration                                OperationDescription                            OperationId                                     OperationStatus                                
		----------------                                --------------------                            -----------                                     ---------------                                
		<?xml version="1.0" encoding="utf-8"?>...       Get-AzureVNetConfig                             04ab3224-7e1c-cc1a-8b75-96c6c300ddb8            Succeeded       

5. Open the file you just downloaded, and add a local network site named *vnet02* that uses *10.2.0.0/16* as an address prefix, and any valid public IP address as a VPN gateway address. You can do so by adding a **LocalNetworkSite** element to the **LocalNetworkSites** element in your configuration file. The file snippet below shows a sample **LocalNetworksSites** element.

	    <LocalNetworkSites>
	      <LocalNetworkSite name="vnet02">
	        <AddressSpace>
	          <AddressPrefix>10.2.0.0/16</AddressPrefix>
	        </AddressSpace>
	        <VPNGatewayAddress>2.0.0.2</VPNGatewayAddress>
	      </LocalNetworkSite>
	    </LocalNetworkSites>		

6. In the **VirtualNetworkSites** element, add a new virtual network with an address prefix of *10.1.0.0/16* and two subnets according the scenario figure above. The file snippet below shows a sample **VirtualNetworkSites** element.
	
	    <VirtualNetworkSites>
	      <VirtualNetworkSite name="vnet01" Location="East US">
	        <AddressSpace>
	          <AddressPrefix>10.1.0.0/16</AddressPrefix>
	        </AddressSpace>
	        <Subnets>
	          <Subnet name="Subnet1">
	            <AddressPrefix>10.1.0.0/24</AddressPrefix>
	          </Subnet>
	          <Subnet name="GatewaySubnet">
	            <AddressPrefix>10.1.200.0/29</AddressPrefix>
	          </Subnet>
	        </Subnets>
	      </VirtualNetworkSite>
	    </VirtualNetworkSites>

7. Save the file, then upload it to Azure by running the command below. Make sure you change the file path as necessary for your environment.

		Set-AzureVNetConfig -ConfigurationPath c:\Azure\classicvnets.netcfg

		OperationDescription                                            OperationId                                                     OperationStatus                                                
		--------------------                                            -----------                                                     ---------------                                                
		Set-AzureVNetConfig                                             e0ee6e66-9167-cfa7-a746-7cab93c22013                            Succeeded 

### Step 2: Create a VM in the classic VNet

To create a VM in the classic VNet by using Azure Service Manager PowerShell cmdlets, follow the instructions below.

1. Retrieve a VM image from Azure. The PowerShell command below retrieves the latest Windows Server 2012 R2 image available.

		$WinImage = (Get-AzureVMImage `
		    | ?{$_.ImageFamily -eq "Windows Server 2012 R2 Datacenter"} `
		    | sort PublishedDate -Descending)[0]		

2. Create a storage account to store the virtual hard drive (VHD) for the VM by running the command below.

		$storage1 = New-AzureStorageAccount `
			-StorageAccountName v1v2teststorage1 `
		    -Location "East US"	

3.  Create the VM by running the commands below. Make sure to replace the user name and password values.

		$vm1 = New-AzureVMConfig -Name "VM01" -InstanceSize "ExtraLarge" `
		    -Image $WinImage.ImageName –AvailabilitySetName "MyAVSet1" `
		    -MediaLocation "https://v1v2teststorage1.blob.core.windows.net/vhd/vm01.vhd"
		Add-AzureProvisioningConfig –VM $vm1 -Windows `
		    -AdminUserName "user" -Password "P@ssw0rd" 

4.  Connect the VM to *Subnet1* by running the commands below.

		Set-AzureSubnet -SubnetNames "Subnet1" -VM $vm1
		Set-AzureStaticVNetIP  -IPAddress "10.1.0.101" -VM $vm1

5. Create a new cloud service to host the VM by running the command below.

		New-AzureService -ServiceName "v1v2svc01" -Location "East US"
 		New-AzureVM -ServiceName "v1v2svc01" –VNetName "vnet01" –VMs $vm1

### Step 3: Create a VPN gateway for the classic VNet 

To create the VPN gateway for vnet01 by using the classic Azure portal, follow the instructions below.

1. Open the classic Azure Portal at https://manage.windowsazure.com. If necessary, specify your credentials.
2. Scroll down on the list of **ALL ITEMS** and click **NETWORKS**.
3. On the list of virtual networks, click **vnet01**, and then click on **CONFIGURE**.
4. Under **site-to-site connectivity**, enable the **Connect to the local network** checkbox.
5. On the **LOCAL NETWORK** list, select **vnet02**, then click **SAVE**, and then click **YES**.
6. Click **DASHBOARD** and notice the message stating a gateway was not yet created, as shown in figure 2 below.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure02.png)

7. Click **CREATE GATEWAY** as shown in figure 3 below to create a VPN gateway for vnet01.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure03.png)

8. In the list of gateway types, click **DYNAMIC**, and then click **YES**. Notice that the dashboard image changes, showing the gateway in yellow, while it is being created. 

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure04.png)

	>[AZURE.NOTE] This operation may take several minutes.

9. Write down the public IP address for the gateway, as seen below, once it is created. You will need this address to create a local network for the ARM VNet later.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure05.png)

## Create a new VNet environment

Now that the classic VNet is up and running with a VM and a gateway, it is time to create the ARM VNet.

### Step 1: Create a new VNet in ARM

To create the ARM VNet, with two subnets, and a local network for the classic VNet by using an ARM template, follow the instructions below.

1. Download the azuredeploy.json and azuredeploy-parameters.json files from [git hub](https://github.com/Azure/azure-quickstart-templates/tree/master/arm-asm-s2s).
2. Open the azuredeploy.json file in Visual Studio, and notice that the template creates four resources: 

	- **Local gateway**: this resource represents the gateway created for the VNet you want to connect to. In this scenario, the gateway for vnet01.
	- **Virtual network**: this resource represents an ARM VNet to be created. In this scenario, vnet02.
	- **Gateway public IP**: this resource represents the public IP address for the gateway to be created for the ARM VNet. 
	- **Gateway**: this resource represents the gateway to be created for the ARM VNet (vnet02).

3. Notice the parameters used in this file. Most of them have a default value. You can change these values according to your needs. 

4. Open the azuredeploy-parameters.json file in Visual Studio. This file contains values to be used for the parameters in the template file.  Edit the following values, if necessary.

	- **subscriptionId**: edit and paste your subscription id. If you do not know your subscription id, run the **Get-AzureSubscription** PowerShell cmdlet to retrieve your id.
	- **location**: specify the Azure location where the VNet will be created. In this scenario, it will be **Central US**.
	- **virtualNetworkName**: this is the name of the ARM VNet to be created. In this scenario, **vnet02**.
	- **localGatewayName**: this is the local network you want to connect to, from your new ARM VNet. In this scenario, **vnet01**.
	- **localGatewayIpAddress**: this is the public IP address for the gateway created for the network you want to connect to. In this scenario, this is the IP address you wrote down in step 9 above, when creating the VPN gateway for **vnet01**.
	- **localGatewayAddressPrefix**: this is the CIDR block for the local network your VNet will connect to. In this scenario, the VNet you will connect to is **vnet01**, and its CIDR block is **10.1.0.0/16**.
	- **gatewayPublicIPName**: this is the name of the IP object to be created for the public IP of the gateway that will be created for the ARM VNet.
	- **gatewayName**: this is the name of the gateway object that will be created for the ARM VNet.
	- **addressPrefix**: this is the CIDR block for the ARM VNet. In this scenario, **10.2.0.0/16**.
	- **subnet1Prefix**: this is the CIDR block for a subnet in the ARM VNet. In this scenario, **10.2.0.0/24**.
	- **gatewaySubnetPrefix**: this is the CIDR block for the gateway subnet in the ARM VNet. In this scenario, **10.2.200.0/29**.
	- **connectionName**: this is the name of the connection object to be created.
	- **sharedKey**: this is the IPSec shared key for the connection. In this scenario, **abc123**.

5. To create the ARM VNet, and its related objects, in a new resource group named **RG1**, run the following PowerShell commands. Make sure you change the path for the template file and the parameters file.  

		New-AzureRmResourceGroup -Name RG1 -Location centralus

		New-AzureRmResourceGroupDeployment -Name deployment01 `
		    -TemplateFile C:\Azure\azuredeploy.json `
		    -TemplateParameterFile C:\Azure\azuredeploy-parameters.json		

	>[AZURE.NOTE] This operation may take several minutes.

7. From your browser, navigate to https://portal.azure.com/ and enter your credentials, if necessary.
8. Click on the **RG1** resource group tile in the Azure portal, as shown below.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure06.png)

9. Notice the resources added to the group by using the ARM template.

### Step 2: Create a new VM in ARM

To create a VM in the new VNet, from the Azure portal, follow the instructions below.

1. From the portal, click the **NEW** button, then click **Compute**, and then click **Windows Server 2012 R2 Datacenter**.
2. At the bottom of the right pane, in the **Select a compute stack**, select **Use the Resource Manager stack** to create the VM in ARM, as seen below, then click **Create**.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure07.png)

3. In the **Basics** blade, enter the VM name, user name, password, subscription, resource group, and location for the VM, and then click **OK**. The figure below shows the settings for this scenario.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure08.png)

4. In the **Choose a size** blade, select a size, and then click **Select**. For this scenario, select **D2**.
5. In the **Settings** blade, click **Virtual network**, and then click **vnet02**.
6. Click **Subnet**, then click **Subnet1**, and then click **OK**. The **Summary** blade should look similar to the figure below.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure09.png)

7. Click **OK**, and then click **Create** to create the VM. You will see a new tile in the portal, showing the VM being provisioned, as seen below.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure10.png)

	>[AZURE.NOTE] This operation may take several minutes. You can move on to the next part of this document.

## Connect the two VNets

Now that you have two VNets with VMs connected to them, it's time to connect the VNets through the gateways previously established, and test the connection.

### Step 1: Configure the gateway for the classic VNet

You need to configure the classic VNet to use the IP address of the gateway created for the ARM VNet (vnet02), then establish a connection from each VNet. To do so, follow the instructions below.

1. To retrieve the IP address used for the gateway in the ARM VNet, run the command below, and notice the output. Write down the address, you will need it to modify the local network settings for the classic VNet later.

		Get-AzurePublicIpAddress | ?{$_.Name -eq "ArmAsmS2sGatewayIp"}

		Name                     : ArmAsmS2sGatewayIp
		ResourceGroupName        : RG1
		Location                 : centralus
		Id                       : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/RG1/providers/Microsoft.Network/publicIPAddresses/ArmAsmS2sGatewayIp
		Etag                     : W/"1ee6c1bd-8be1-488e-a571-77b05b49e33a"
		ProvisioningState        : Succeeded
		Tags                     : 
		PublicIpAllocationMethod : Dynamic
		IpAddress                : 23.99.213.28
		IdleTimeoutInMinutes     : 4
		IpConfiguration          : {
		                             "Id": "/subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/RG1/providers/Microsoft.Network/virtualNetworkGateways/ArmAsmGateway/ipConfigurations/vn
		                           etGatewayConfig"
		                           }
		DnsSettings              : null

3. Download your Azure network configuration file by running the command below.

		Get-AzureVNetConfig -ExportToFile c:\Azure\classicvnets.netcfg

4. Open the file you just downloaded, and edit the **LocalNetworkSite** element for **vnet02** to add the IP address of the gateway for the new VNet obtained in step 1 above. The element should look similar to the sample below.

	      <LocalNetworkSite name="vnet02">
	        <AddressSpace>
	          <AddressPrefix>10.2.0.0/16</AddressPrefix>
	        </AddressSpace>
	        <VPNGatewayAddress>23.99.213.28</VPNGatewayAddress>
	      </LocalNetworkSite>

5. Save the file, then run the command below to configure the classic vnet. Make sure you change the path to point the file you save in step 4 above.

		Set-AzureVNetConfig -ConfigurationPath c:\Azure\classicvnets.netcfg

6. Set the IPSec shared key for the classic VNet gateway by running the command below. You should see an output similar to the one posted below. Make sure you change the VNet names, if you are using your own pre-existing VNets.

		Set-AzureVNetGatewayKey -VNetName vnet01 -LocalNetworkSiteName vnet02 -SharedKey abc123 

		Error          : 
		HttpStatusCode : OK
		Id             : b2154475-bf00-480e-ad1e-aed893014979
		Status         : Successful
		RequestId      : 08257a09d723cb8982c47b85edb0e08a
		StatusCode     : OK

### Step 2: Configure the gateway for the ARM VNet

Now that you have the classic VNet gateway configured, it's time to establish the connection. To do so, follow the instructions below.

2. Create the connection between the gateways, by running the following commands.

		$vnet01gateway = Get-AzureRmLocalNetworkGateway -Name vnet01 -ResourceGroupName RG1
		$vnet02gateway = Get-AzureRmVirtualNetworkGateway -Name ArmAsmGateway -ResourceGroupName RG1
		
		New-AzureRmVirtualNetworkGatewayConnection -Name arm-asm-s2s-connection `
			-ResourceGroupName RG1 -Location "Central US" -VirtualNetworkGateway1 $vnet02gateway `
			-LocalNetworkGateway2 $vnet01gateway -ConnectionType IPsec `
			-RoutingWeight 10 -SharedKey 'abc123'

3. Open the Azure Portal at https://manage.windowsazure.com and, if necessary, enter your credentials.
4. Under **ALL ITEMS**, scroll down and click **NETWORKS**, then click **vnet01**, and then click **DASHBOARD**. Notice the connection between **vnet01** and **vnet02** is now established, as seen below.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure11.png)

5. Although you can manage the classic VNet and its connection from the classic portal, it's recommended to use the new Azure portal. To open the new portal, navigate to https://portal.azure.com.
6. In the new portal, click **BROWSE ALL**, then click **Virtual networks (classic)**, and then click **vnet01**. Notice the **VPN connections** pane shown below.

	![VNet dashboard](..\virtual-network\media\virtual-networks-arm-asm-s2s\figure12.png)

### Step 3: Test the connectivity

Now that you have the two VNets connected, it is time to test the connectivity by pinging one VM from the other.  You will need to change the firewall settings in one of the VMs to allow ICMP, and then ping that VM from the other VM. To do so, follow the instructions below.

1. From the Azure portal, click **BROWSE ALL**, then click **Virtual machines**, and then click **VM02**.
2. From the **VM02** blade, click **Connect**. If needed, click **Open** on your browser security banner to open the RDP file.
3. In the **Remote Desktop Connection** dialog box, click **Connect**.
4. In the **Windows Security** dialog box, enter your VM user name and password. 
5. In the **Remote Desktop Connection** dialog box, click **Yes**.
6. Once you connect to the VM, from **Server Manager**, click **Tools**, and then click **Windows Firewall with Advanced Security**.
7. In the **Windows Firewall with Advanced Security** window, click **Inbound Rules**.
8. In the **Inbound Rules** list, right click **File and Printer Sharing (Echo Request - ICMPv4-In)** and then click **Enable Rule**.
9. In the task bar, click the **Windows PowerShell** button, then run the following command.

		ipconfig

		Connection-specific DNS Suffix  . : 4oxp4ce0c5rulb1iey4cdqhasg.gx.internal.cloudapp.net
		Link-local IPv6 Address . . . . . : fe80::8cea:a98a:5c48:4c58%12
		IPv4 Address. . . . . . . . . . . : 10.2.0.101
		Subnet Mask . . . . . . . . . . . : 255.255.255.0
		Default Gateway . . . . . . . . . : 10.2.0.101

10. Write down the IP address for the VM. In this scenario, **10.2.0.101**. You will ping that address from the other VM to test connectivity between the VNets.
11. From the Azure portal, on the left pane, click **Virtual machines (classic)**, then click **VM01**, and then click **Connect**. If needed, click **Open** on your browser security banner to open the RDP file.
12. In the **Remote Desktop Connection** dialog box, click **Connect**.
13. In the **Windows Security** dialog box, enter your VM user name and password. 
14. In the **Remote Desktop Connection** dialog box, click **Yes**.
15. In the task bar for the remote VM, click the **Windows PowerShell** button, then run the following command.

		ping 10.2.0.101

		Reply from 10.2.0.101: bytes=32 time=32ms TTL=126
		Reply from 10.2.0.101: bytes=32 time=32ms TTL=126
		Reply from 10.2.0.101: bytes=32 time=32ms TTL=126
		Reply from 10.2.0.101: bytes=32 time=32ms TTL=126

## Next Steps

- Learn more about [the Network Resource Provider (NRP) for ARM](resource-groups-networking.md).
- View the general guidelines on how to [create a S2S VPN connection between a classic VNet and an ARM VNet](virtual-networks-arm-asm-s2s-howto.md).
