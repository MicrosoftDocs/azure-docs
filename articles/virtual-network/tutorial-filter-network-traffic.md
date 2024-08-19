---
title: "Tutorial: Filter network traffic with a network security group (NSG) - Azure portal"
titlesuffix: Azure Virtual Network
description: In this tutorial, you learn how to filter network traffic to a subnet, with a network security group (NSG), using the Azure portal.
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: tutorial
ms.date: 08/19/2024
ms.author: allensu
ms.custom: template-tutorial
# Customer intent: I want to filter network traffic to virtual machines that perform similar functions, such as web servers.
---

# Tutorial: Filter network traffic with a network security group using the Azure portal

You can use a network security group to filter inbound and outbound network traffic to and from Azure resources in an Azure virtual network.

Network security groups contain security rules that filter network traffic by IP address, port, and protocol. When a network security group is associated with a subnet, security rules are applied to resources deployed in that subnet.

:::image type="content" source="./media/tutorial-filter-network-traffic/virtual-network-filter-resources.png" alt-text="Diagram of resources created during tutorial." lightbox="./media/tutorial-filter-network-traffic/virtual-network-filter-resources.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a network security group and security rules
> - Create application security groups
> - Create a virtual network and associate a network security group to a subnet
> - Deploy virtual machines and associate their network interfaces to the application security groups

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

---

### [Portal](#tab/portal)

[!INCLUDE [virtual-network-create.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create.md)]

### [PowerShell](#tab/powershell)

First create a resource group for all the resources created in this article with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group in the _westus2_ location:

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName test-rg -Location westus2
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual named _vnet-1_:

```azurepowershell-interactive
$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -Name vnet-1 `
  -AddressPrefix 10.0.0.0/16
```

Create a subnet configuration with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig), and then write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork). The following example adds a subnet named _subnet-1_ to the virtual network and associates the _nsg-1_ network security group to it:

```azurepowershell-interactive
Add-AzVirtualNetworkSubnetConfig `
  -Name subnet-1 `
  -VirtualNetwork $virtualNetwork `
  -AddressPrefix "10.0.2.0/24"
$virtualNetwork | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

---

## Create application security groups

An [application security group (ASGs)](application-security-groups.md) enables you to group together servers with similar functions, such as web servers.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Application security group**. Select **Application security groups** in the search results.

1. Select **+ Create**.

1. On the **Basics** tab of **Create an application security group**, enter or select this information:

   | Setting              | Value                     |
   | -------------------- | ------------------------- |
   | **Project details**  |                           |
   | Subscription         | Select your subscription. |
   | Resource group       | Select **test-rg**.       |
   | **Instance details** |                           |
   | Name                 | Enter **asg-web**.        |
   | Region               | Select **East US 2**.     |

1. Select **Review + create**.

1. Select **+ Create**.

1. Repeat the previous steps, specifying the following values:

   | Setting              | Value                     |
   | -------------------- | ------------------------- |
   | **Project details**  |                           |
   | Subscription         | Select your subscription. |
   | Resource group       | Select **test-rg**.       |
   | **Instance details** |                           |
   | Name                 | Enter **asg-mgmt**.       |
   | Region               | Select **East US 2**.     |

1. Select **Review + create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Create an application security group with [New-AzApplicationSecurityGroup](/powershell/module/az.network/new-azapplicationsecuritygroup). An application security group enables you to group servers with similar port filtering requirements. The following example creates two application security groups.

```azurepowershell-interactive
$webAsg = New-AzApplicationSecurityGroup `
  -ResourceGroupName test-rg `
  -Name asg-web `
  -Location westus2

$mgmtAsg = New-AzApplicationSecurityGroup `
  -ResourceGroupName test-rg `
  -Name asg-mgmt `
  -Location westus2
```

### [CLI](#tab/cli)

---

## Create a network security group

A [network security group (NSG)](network-security-groups-overview.md) secures network traffic in your virtual network.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results.

   > [!NOTE]
   > In the search results for **Network security groups**, you may see **Network security groups (classic)**. Select **Network security groups**.

1. Select **+ Create**.

1. On the **Basics** tab of **Create network security group**, enter or select this information:

   | Setting              | Value                     |
   | -------------------- | ------------------------- |
   | **Project details**  |                           |
   | Subscription         | Select your subscription. |
   | Resource group       | Select **test-rg**.       |
   | **Instance details** |                           |
   | Name                 | Enter **nsg-1**.          |
   | Location             | Select **East US 2**.     |

1. Select **Review + create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup). The following example creates a network security group named _nsg-1_:

```powershell-interactive
$nsg = New-AzNetworkSecurityGroup `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -Name nsg-1
```

### [CLI](#tab/cli)

---

## Associate network security group to subnet

In this section, you associate the network security group with the subnet of the virtual network you created earlier.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results.

1. Select **nsg-1**.

1. Select **Subnets** from the **Settings** section of **nsg-1**.

1. In the **Subnets** page, select **+ Associate**:

   :::image type="content" source="./media/tutorial-filter-network-traffic/associate-nsg-subnet.png" alt-text="Screenshot of Associate a network security group to a subnet." border="true" lightbox="./media/tutorial-filter-network-traffic/associate-nsg-subnet.png":::

1. Under **Associate subnet**, select **vnet-1 (test-rg)** for **Virtual network**.

1. Select **subnet-1** for **Subnet**, and then select **OK**.

### [PowerShell](#tab/powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to retrieve the virtual network object, and then use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate the network security group with the subnet. The following example retrieves the virtual network object and updates the subnet configuration to associate the network security group:

```azurepowershell-interactive

# Retrieve the virtual network
$vnet = Get-AzVirtualNetwork -Name "vnet-1" -ResourceGroupName "test-rg"

# Update the subnet configuration to associate the network security group
$subnetConfigParams = @{
  VirtualNetwork       = $vnet
  Name                 = "subnet-1"
  AddressPrefix        = $vnet.Subnets[0].AddressPrefix
  NetworkSecurityGroup = Get-AzNetworkSecurityGroup -Name "nsg-1" -ResourceGroupName "test-rg"
}

Set-AzVirtualNetworkSubnetConfig @subnetConfigParams

# Update the virtual network with the new subnet configuration

$vnet | Set-AzVirtualNetwork

```

### [CLI](#tab/cli)

---

## Create security rules

### [Portal](#tab/portal)

1. Select **Inbound security rules** from the **Settings** section of **nsg-1**.

1. In **Inbound security rules** page, select **+ Add**.

1. Create a security rule that allows ports 80 and 443 to the **asg-web** application security group. In **Add inbound security rule** page, enter or select the following information:

   | Setting                                 | Value                                  |
   | --------------------------------------- | -------------------------------------- |
   | Source                                  | Leave the default of **Any**.          |
   | Source port ranges                      | Leave the default of **(\*)**.         |
   | Destination                             | Select **Application security group**. |
   | Destination application security groups | Select **asg-web**.                    |
   | Service                                 | Leave the default of **Custom**.       |
   | Destination port ranges                 | Enter **80,443**.                      |
   | Protocol                                | Select **TCP**.                        |
   | Action                                  | Leave the default of **Allow**.        |
   | Priority                                | Leave the default of **100**.          |
   | Name                                    | Enter **allow-web-all**.               |

1. Select **Add**.

1. Complete the previous steps with the following information:

   | Setting                                | Value                                  |
   | -------------------------------------- | -------------------------------------- |
   | Source                                 | Leave the default of **Any**.          |
   | Source port ranges                     | Leave the default of **(\*)**.         |
   | Destination                            | Select **Application security group**. |
   | Destination application security group | Select **asg-mgmt**.                   |
   | Service                                | Select **RDP**.                        |
   | Action                                 | Leave the default of **Allow**.        |
   | Priority                               | Leave the default of **110**.          |
   | Name                                   | Enter _allow-rdp-all_.                 |

1. Select **Add**.

### [PowerShell](#tab/powershell)

Create a security rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig). The following example creates a rule that allows traffic inbound from the internet to the _asg-web_ application security group over ports 80 and 443:

```azurepowershell-interactive
$webRule = New-AzNetworkSecurityRuleConfig `
  -Name "Allow-Web-All" `
  -Access Allow `
  -Protocol Tcp `
  -Direction Inbound `
  -Priority 100 `
  -SourceAddressPrefix Internet `
  -SourcePortRange * `
  -DestinationApplicationSecurityGroupId $webAsg.id `
  -DestinationPortRange 80,443

The following example creates a rule that allows traffic inbound from the internet to the *myMgmtServers* application security group over port 3389:

$mgmtRule = New-AzNetworkSecurityRuleConfig `
  -Name "Allow-RDP-All" `
  -Access Allow `
  -Protocol Tcp `
  -Direction Inbound `
  -Priority 110 `
  -SourceAddressPrefix Internet `
  -SourcePortRange * `
  -DestinationApplicationSecurityGroupId $mgmtAsg.id `
  -DestinationPortRange 3389
```

Use [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) to retrieve the existing network security group, and then add the new rules with the `+=` operator. Finally, update the network security group with [Set-AzNetworkSecurityGroup](/powershell/module/az.network/set-aznetworksecuritygroup):

```azurepowershell-interactive
# Retrieve the existing network security group
$nsg = Get-AzNetworkSecurityGroup -Name "nsg-1" -ResourceGroupName "test-rg"

# Add the new rules to the security group
$nsg.SecurityRules += $webRule
$nsg.SecurityRules += $mgmtRule

# Update the network security group with the new rules
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg
```

### [CLI](#tab/cli)

---

> [!CAUTION]
> In this article, RDP (port 3389) is exposed to the internet for the VM that is assigned to the **asg-mgmt** application security group.
>
> For production environments, instead of exposing port 3389 to the internet, it's recommended that you connect to Azure resources that you want to manage using a VPN, private network connection, or Azure Bastion.
>
> For more information on Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md).

## Create virtual machines

Create two virtual machines (VMs) in the virtual network.

### [Portal](#tab/portal)

1. In the portal, search for and select **Virtual machines**.

1. In **Virtual machines**, select **+ Create**, then **Azure virtual machine**.

1. In **Create a virtual machine**, enter or select this information in the **Basics** tab:

   | Setting                   | Value                                                           |
   | ------------------------- | --------------------------------------------------------------- |
   | **Project details**       |                                                                 |
   | Subscription              | Select your subscription.                                       |
   | Resource group            | Select **test-rg**.                                             |
   | **Instance details**      |                                                                 |
   | Virtual machine name      | Enter **vm-web**.                                                 |
   | Region                    | Select **(US) East US 2**.                                      |
   | Availability options      | Leave the default of **No infrastructure redundancy required**. |
   | Security type             | Select **Standard**.                                            |
   | Image                     | Select **Windows Server 2022 Datacenter - x64 Gen2**.           |
   | Azure Spot instance       | Leave the default of unchecked.                                 |
   | Size                      | Select a size.                                                  |
   | **Administrator account** |                                                                 |
   | Username                  | Enter a username.                                               |
   | Password                  | Enter a password.                                               |
   | Confirm password          | Reenter password.                                               |
   | **Inbound port rules**    |                                                                 |
   | Select inbound ports      | Select **None**.                                                |

1. Select **Next: Disks** then **Next: Networking**.

1. In the **Networking** tab, enter or select the following information:

   | Setting                    | Value                                 |
   | -------------------------- | ------------------------------------- |
   | **Network interface**      |                                       |
   | Virtual network            | Select **vnet-1**.                    |
   | Subnet                     | Select **subnet-1 (10.0.0.0/24)**.    |
   | Public IP                  | Leave the default of a new public IP. |
   | NIC network security group | Select **None**.                      |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**. The VM may take a few minutes to deploy.

1. Repeat the previous steps to create a second virtual machine named **vm-mgmt**.

### [PowerShell](#tab/powershell)

Before creating the VMs, retrieve the virtual network object with the subnet with [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork):

```powershell-interactive
$virtualNetwork = Get-AzVirtualNetwork `
 -Name vnet-1 `
 -Resourcegroupname test-rg
```

Create a public IP address for each VM with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress):

```powershell-interactive
$publicIpWeb = New-AzPublicIpAddress `
  -AllocationMethod Dynamic `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -Name vm-web

$publicIpMgmt = New-AzPublicIpAddress `
  -AllocationMethod Dynamic `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -Name vm-mgmt
```

Create two network interfaces with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface), and assign a public IP address to the network interface. The following example creates a network interface, associates the _vm-web_ public IP address to it.

```powershell-interactive
$webNic = New-AzNetworkInterface `
  -Location westus2 `
  -Name vm-web `
  -ResourceGroupName test-rg `
  -SubnetId $virtualNetwork.Subnets[0].Id `
  -PublicIpAddressId $publicIpWeb.Id
```

The following example creates a network interface, associates the _vm-mgmt_ public IP address to it.

```powershell-interactive
$mgmtNic = New-AzNetworkInterface `
  -Location westus2 `
  -Name vm-mgmt `
  -ResourceGroupName test-rg `
  -SubnetId $virtualNetwork.Subnets[0].Id `
  -PublicIpAddressId $publicIpMgmt.Id
```

Create two VMs in the virtual network so you can validate traffic filtering in a later step.

Create a VM configuration with [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig), then create the VM with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a VM that will serve as a web server. The `-AsJob` option creates the VM in the background, so you can continue to the next step:

```azurepowershell-interactive
# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

$webVmConfig = New-AzVMConfig `
  -VMName vm-web `
  -VMSize Standard_DS1_V2 | `
Set-AzVMOperatingSystem -Windows `
  -ComputerName vm-web `
  -Credential $cred | `
Set-AzVMSourceImage `
  -PublisherName MicrosoftWindowsServer `
  -Offer WindowsServer `
  -Skus 2022-Datacenter `
  -Version latest | `
Add-AzVMNetworkInterface `
  -Id $webNic.Id
New-AzVM `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -VM $webVmConfig `
  -AsJob
```

Create a VM to serve as a management server:

```azurepowershell-interactive
# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create the web server virtual machine configuration and virtual machine.
$mgmtVmConfig = New-AzVMConfig `
  -VMName vm-mgmt `
  -VMSize Standard_DS1_V2 | `
Set-AzVMOperatingSystem -Windows `
  -ComputerName vm-mgmt `
  -Credential $cred | `
Set-AzVMSourceImage `
  -PublisherName MicrosoftWindowsServer `
  -Offer WindowsServer `
  -Skus 2022-Datacenter `
  -Version latest | `
Add-AzVMNetworkInterface `
  -Id $mgmtNic.Id
New-AzVM `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -VM $mgmtVmConfig
```

The virtual machine takes a few minutes to create. Don't continue with the next step until Azure finishes creating the VM.

### [CLI](#tab/cli)

---

## Associate network interfaces to an ASG

### [Portal](#tab/portal)

When you created the VMs, Azure created a network interface for each VM, and attached it to the VM.

Add the network interface of each VM to one of the application security groups you created previously:

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results, then select **vm-web**.

1. Select **Application security groups** from the **Networking** section of **vm-web**.

1. Select **Add application security groups**, then in the **Add application security groups** tab, select **asg-web**. Finally, select **Add**.

   :::image type="content" source="./media/tutorial-filter-network-traffic/configure-app-sec-groups.png" alt-text="Screenshot of Configure application security groups." border="true" lightbox="./media/tutorial-filter-network-traffic/configure-app-sec-groups.png":::

1. Repeat the previous steps for **vm-mgmt**, selecting **asg-mgmt** in the **Add application security groups** tab.

### [PowerShell](#tab/powershell)

Use [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) to retrieve the network interface of the virtual machine, and then use [Get-AzApplicationSecurityGroup](/powershell/module/az.network/get-azapplicationsecuritygroup) to retrieve the application security group. Finally, use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to associate the application security group with the network interface. The following example associates the _asg-web_ application security group with the _vm-web_ network interface:

```azurepowershell-interactive
# Retrieve the network interface of the virtual machine
$nic = Get-AzNetworkInterface -Name "vm-web-nic" -ResourceGroupName "test-rg"

# Retrieve the application security group
$asg = Get-AzApplicationSecurityGroup -Name "asg-web" -ResourceGroupName "test-rg"

# Associate the application security group with the network interface
$nic.IpConfigurations[0].ApplicationSecurityGroups = @($asg)

# Update the network interface with the new configuration
Set-AzNetworkInterface -NetworkInterface $nic
```

Repeat the command to associate the _asg-mgmt_ application security group with the _vm-mgmt_ network interface.

```azurepowershell-interactive
# Retrieve the network interface of the virtual machine
$nic = Get-AzNetworkInterface -Name "vm-mgmt-nic" -ResourceGroupName "test-rg"

# Retrieve the application security group
$asg = Get-AzApplicationSecurityGroup -Name "asg-mgmt" -ResourceGroupName "test-rg"

# Associate the application security group with the network interface
$nic.IpConfigurations[0].ApplicationSecurityGroups = @($asg)

# Update the network interface with the new configuration
Set-AzNetworkInterface -NetworkInterface $nic
```

### [CLI](#tab/cli)

---

## Test traffic filters

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-mgmt**.

1. On the **Overview** page, select the **Connect** button and then select **Native RDP**.

1. Select **Download RDP file**.

1. Open the downloaded rdp file and select **Connect**. Enter the username and password you specified when creating the VM.

1. Select **OK**.

1. You may receive a certificate warning during the connection process. If you receive the warning, select **Yes** or **Continue**, to continue with the connection.

   The connection succeeds, because inbound traffic from the internet to the **asg-mgmt** application security group is allowed through port 3389.

   The network interface for **vm-mgmt** is associated with the **asg-mgmt** application security group and allows the connection.

1. Open a PowerShell session on **vm-mgmt**. Connect to **vm-web** using the following:

   ```powershell
   mstsc /v:vm-web
   ```

   The RDP connection from **vm-mgmt** to **vm-web** succeeds because virtual machines in the same network can communicate with each other over any port by default.

   You can't create an RDP connection to the **vm-web** virtual machine from the internet. The security rule for the **asg-web** prevents connections to port 3389 inbound from the internet. Inbound traffic from the Internet is denied to all resources by default.

1. To install Microsoft IIS on the **vm-web** virtual machine, enter the following command from a PowerShell session on the **vm-web** virtual machine:

   ```powershell
   Install-WindowsFeature -name Web-Server -IncludeManagementTools
   ```

1. After the IIS installation is complete, disconnect from the **vm-web** virtual machine, which leaves you in the **vm-mgmt** virtual machine remote desktop connection.

1. Disconnect from the **vm-mgmt** VM.

1. Search for **vm-web** in the portal search box.

1. On the **Overview** page of **vm-web**, note the **Public IP address** for your VM. The address shown in the following example is 20.230.55.178, your address is different:

   :::image type="content" source="./media/tutorial-filter-network-traffic/public-ip-address.png" alt-text="Screenshot of Public IP address of a virtual machine in the Overview page." border="true" lightbox="./media/tutorial-filter-network-traffic/public-ip-address.png":::

1. To confirm that you can access the **vm-web** web server from the internet, open an internet browser on your computer and browse to `http://<public-ip-address-from-previous-step>`.

You see the IIS default page, because inbound traffic from the internet to the **asg-web** application security group is allowed through port 80.

The network interface attached for **vm-web** is associated with the **asg-web** application security group and allows the connection.

### [PowerShell](#tab/powershell)

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to return the public IP address of a VM. The following example returns the public IP address of the _vm-mgmt_ VM:

```azurepowershell-interactive
Get-AzPublicIpAddress `
  -Name vm-mgmt `
  -ResourceGroupName test-rg `
  | Select IpAddress
```

Use the following command to create a remote desktop session with the _vm-mgmt_ VM from your local computer. Replace `<publicIpAddress>` with the IP address returned from the previous command.

```
mstsc /v:<publicIpAddress>
```

Open the downloaded RDP file. If prompted, select **Connect**.

Enter the user name and password you specified when creating the VM (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM), then select **OK**. You may receive a certificate warning during the sign-in process. Select **Yes** to proceed with the connection.

The connection succeeds, because port 3389 is allowed inbound from the internet to the _asg-mgmt_ application security group that the network interface attached to the _vm-mgmt_ VM is in.

Use the following command to create a remote desktop connection to the _vm-web_ VM, from the _vm-mgmt_ VM, with the following command, from PowerShell:

```
mstsc /v:vm-web
```

The connection succeeds because a default security rule within each network security group allows traffic over all ports between all IP addresses within a virtual network. You can't create a remote desktop connection to the _vm-web_ VM from the internet because the security rule for the _asg-web_ doesn't allow port 3389 inbound from the internet.

Use the following command to install Microsoft IIS on the _vm-web_ VM from PowerShell:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

After the IIS installation is complete, disconnect from the _vm-web_ VM, which leaves you in the _vm-mgmt_ VM remote desktop connection. To view the IIS welcome screen, open an internet browser and browse to http:\//vm-web.

Disconnect from the _vm-mgmt_ VM.

On your computer, enter the following command from PowerShell to retrieve the public IP address of the _vm-web_ server:

```azurepowershell-interactive
Get-AzPublicIpAddress `
  -Name vm-web `
  -ResourceGroupName test-rg `
  | Select IpAddress
```

To confirm that you can access the _vm-web_ web server from outside of Azure, open an internet browser on your computer and browse to `http://<public-ip-address-from-previous-step>`. The connection succeeds, because port 80 is allowed inbound from the internet to the _asg-web_ application security group that the network interface attached to the _vm-web_ VM is in.

### [CLI](#tab/cli)

---

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name test-rg -Force
```

### [CLI](#tab/cli)

---

## Next steps

In this tutorial, you:

- Created a network security group and associated it to a virtual network subnet.
- Created application security groups for web and management.
- Created two virtual machines and associated their network interfaces with the application security groups.
- Tested the application security group network filtering.

To learn more about network security groups, see [Network security group overview](./network-security-groups-overview.md) and [Manage a network security group](manage-network-security-group.md).

Azure routes traffic between subnets by default. You may instead, choose to route traffic between subnets through a VM, serving as a firewall, for example.

To learn how to create a route table, advance to the next tutorial.

[!div class="nextstepaction"][Create a route table](./tutorial-create-route-table-portal.md)
