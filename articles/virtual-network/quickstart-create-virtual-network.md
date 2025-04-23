---
title: 'Quickstart: Create an Azure Virtual Network'
description: Learn how to use the various deployment methods in Azure to create a virtual network.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: quickstart  #Don't change
ms.date: 04/22/2025

#customer intent: As an administrator or network engineer, I want to create a virtual network and test traffic between virtual machines in the same virtual network.

---

# Quickstart: Create an Azure Virtual Network
 
In this quickstart, learn how to create an Azure Virtual Network (VNet) using the Azure portal, Azure CLI, Azure PowerShell, Resource Manager template, Bicep template, and Terraform. Two virtual machines and an Azure Bastion host are deployed to test connectivity between the virtual machines in the same virtual network. The Azure Bastion host facilitates secure and seamless RDP and SSH connectivity to the virtual machines directly in the Azure portal over SSL.

:::image type="content" source="./media/quick-create-portal/virtual-network-qs-resources.png" alt-text="Diagram of resources created in the virtual network quickstart." lightbox="./media/quick-create-portal/virtual-network-qs-resources.png":::

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

>[!VIDEO https://learn-video.azurefd.net/vod/player?id=6b5b138e-8406-406e-8b34-40bdadf9fc6d]

If you don't have a service subscription, [create a free trial account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [Powershell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and then paste it into Cloud Shell to run it. You can also run Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  If you run PowerShell locally, run `Connect-AzAccount` to connect to Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

### [ARM](#tab/arm)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [Bicep](#tab/bicep)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To deploy the Bicep files, either the Azure CLI or Azure PowerShell installed.

### [Terraform](#tab/terraform)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Installation and configuration of Terraform](/azure/developer/terraform/quickstart-configure).

---


### [Portal](#tab/portal)

## <a name="create-a-virtual-network"></a> Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [virtual-network-create-with-bastion.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [create-two-virtual-machines.md](../../includes/create-two-virtual-machines.md)]

### [Powershell](#tab/powershell)

## Create a resource group

Use [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) to create a resource group to host the virtual network. Run the following code to create a resource group named **test-rg** in the **eastus2** Azure region:

```azurepowershell-interactive
$rg = @{
    Name = 'test-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

## Create a virtual network

1. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create a virtual network named **vnet-1** with IP address prefix **10.0.0.0/16** in the **test-rg** resource group and **eastus2** location:

    ```azurepowershell-interactive
    $vnet = @{
        Name = 'vnet-1'
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        AddressPrefix = '10.0.0.0/16'
    }
    $virtualNetwork = New-AzVirtualNetwork @vnet
   ```

1. Azure deploys resources to a subnet within a virtual network. Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create a subnet configuration named **subnet-1** with address prefix **10.0.0.0/24**:

    ```azurepowershell-interactive
    $subnet = @{
        Name = 'subnet-1'
        VirtualNetwork = $virtualNetwork
        AddressPrefix = '10.0.0.0/24'
    }
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
    ```

1. Associate the subnet configuration to the virtual network by using [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork):

    ```azurepowershell-interactive
    $virtualNetwork | Set-AzVirtualNetwork
    ```

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Bastion, see [What is Azure Bastion?](/azure/bastion/bastion-overview).

 [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. Configure a Bastion subnet for your virtual network. This subnet is reserved exclusively for Bastion resources and must be named **AzureBastionSubnet**.

    ```azurepowershell-interactive
    $subnet = @{
        Name = 'AzureBastionSubnet'
        VirtualNetwork = $virtualNetwork
        AddressPrefix = '10.0.1.0/26'
    }
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
    ```

1. Set the configuration:

    ```azurepowershell-interactive
    $virtualNetwork | Set-AzVirtualNetwork
    ```

1. Create a public IP address for Bastion. The Bastion host uses the public IP to access SSH and RDP over port 443.

    ```azurepowershell-interactive
    $ip = @{
            ResourceGroupName = 'test-rg'
            Name = 'public-ip'
            Location = 'eastus2'
            AllocationMethod = 'Static'
            Sku = 'Standard'
            Zone = 1,2,3
    }
    New-AzPublicIpAddress @ip
    ```

1. Use the [New-AzBastion](/powershell/module/az.network/new-azbastion) command to create a new Standard SKU Bastion host in **AzureBastionSubnet**:

    ```azurepowershell-interactive
    $bastion = @{
        Name = 'bastion'
        ResourceGroupName = 'test-rg'
        PublicIpAddressRgName = 'test-rg'
        PublicIpAddressName = 'public-ip'
        VirtualNetworkRgName = 'test-rg'
        VirtualNetworkName = 'vnet-1'
        Sku = 'Basic'
    }
    New-AzBastion @bastion
    ```

It takes about 10 minutes to deploy the Bastion resources. You can create VMs in the next section while Bastion deploys to your virtual network.

## Create virtual machines

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create two VMs named **vm-1** and **vm-2** in the **subnet-1** subnet of the virtual network. When you're prompted for credentials, enter usernames and passwords for the VMs.

1. To create the first VM, use the following code:

    ```azurepowershell-interactive
    # Set the administrator and password for the VM. ##
    $cred = Get-Credential

    ## Place the virtual network into a variable. ##
    $vnet = Get-AzVirtualNetwork -Name 'vnet-1' -ResourceGroupName 'test-rg'

    ## Create a network interface for the VM. ##
    $nic = @{
        Name = "nic-1"
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        Subnet = $vnet.Subnets[0]
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration. ##
    $vmsz = @{
        VMName = "vm-1"
        VMSize = 'Standard_DS1_v2'  
    }
    $vmos = @{
        ComputerName = "vm-1"
        Credential = $cred
    }
    $vmimage = @{
        PublisherName = 'Canonical'
        Offer = '0001-com-ubuntu-server-jammy'
        Skus = '22_04-lts-gen2'
        Version = 'latest'    
    }
    $vmConfig = New-AzVMConfig @vmsz `
        | Set-AzVMOperatingSystem @vmos -Linux `
        | Set-AzVMSourceImage @vmimage `
        | Add-AzVMNetworkInterface -Id $nicVM.Id

    ## Create the VM. ##
    $vm = @{
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        VM = $vmConfig
    }
    New-AzVM @vm
    ```

1. To create the second VM, use the following code:

    ```azurepowershell-interactive
    # Set the administrator and password for the VM. ##
    $cred = Get-Credential

    ## Place the virtual network into a variable. ##
    $vnet = Get-AzVirtualNetwork -Name 'vnet-1' -ResourceGroupName 'test-rg'

    ## Create a network interface for the VM. ##
    $nic = @{
        Name = "nic-2"
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        Subnet = $vnet.Subnets[0]
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration. ##
    $vmsz = @{
        VMName = "vm-2"
        VMSize = 'Standard_DS1_v2'  
    }
    $vmos = @{
        ComputerName = "vm-2"
        Credential = $cred
    }
    $vmimage = @{
        PublisherName = 'Canonical'
        Offer = '0001-com-ubuntu-server-jammy'
        Skus = '22_04-lts-gen2'
        Version = 'latest'    
    }
    $vmConfig = New-AzVMConfig @vmsz `
        | Set-AzVMOperatingSystem @vmos -Linux `
        | Set-AzVMSourceImage @vmimage `
        | Add-AzVMNetworkInterface -Id $nicVM.Id

    ## Create the VM. ##
    $vm = @{
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        VM = $vmConfig
    }
    New-AzVM @vm
    ```

> [!TIP]
> You can use the `-AsJob` option to create a VM in the background while you continue with other tasks. For example, run `New-AzVM @vm1 -AsJob`. When Azure starts creating the VM in the background, you get something like the following output:
>
> ```powershell
> Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
> --     ----            -------------   -----         -----------     --------             -------
> 1      Long Running... AzureLongRun... Running       True            localhost            New-AzVM
> ```

Azure takes a few minutes to create the VMs. When Azure finishes creating the VMs, it returns output to PowerShell.

> [!NOTE]
> VMs in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

### [CLI](#tab/cli)

## Create a resource group

Use [az group create](/cli/azure/group#az-group-create) to create a resource group to host the virtual network. Use the following code to create a resource group named **test-rg** in the **eastus2** Azure region:

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2
```

## Create a virtual network and subnet

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network named **vnet-1** with a subnet named **subnet-1** in the **test-rg** resource group:

```azurecli-interactive
az network vnet create \
    --name vnet-1 \
    --resource-group test-rg \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24
```

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration.

[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)] For more information about Bastion, see [What is Azure Bastion?](~/articles/bastion/bastion-overview.md).

1. Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a Bastion subnet for your virtual network. This subnet is reserved exclusively for Bastion resources and must be named **AzureBastionSubnet**.

    ```azurecli-interactive
    az network vnet subnet create \
        --name AzureBastionSubnet \
        --resource-group test-rg \
        --vnet-name vnet-1 \
        --address-prefix 10.0.1.0/26
    ```

1. Create a public IP address for Bastion. This IP address is used to connect to the Bastion host from the internet. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address named **public-ip** in the **test-rg** resource group:

    ```azurecli-interactive
    az network public-ip create \
        --resource-group test-rg \
        --name public-ip \
        --sku Standard \
        --location eastus2 \
        --zone 1 2 3
    ```

1. Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a Bastion host in **AzureBastionSubnet** for your virtual network:

    ```azurecli-interactive
    az network bastion create \
        --name bastion \
        --public-ip-address public-ip \
        --resource-group test-rg \
        --vnet-name vnet-1 \
        --location eastus2
    ```

It takes about 10 minutes to deploy the Bastion resources. You can create VMs in the next section while Bastion deploys to your virtual network.

## Create virtual machines

Use [az vm create](/cli/azure/vm#az-vm-create) to create two VMs named **vm-1** and **vm-2** in the **subnet-1** subnet of the virtual network. When you're prompted for credentials, enter user names and passwords for the VMs.

1. To create the first VM, use the following command:

    ```azurecli-interactive
    az vm create \
        --resource-group test-rg \
        --admin-username azureuser \
        --authentication-type password \
        --name vm-1 \
        --image Ubuntu2204 \
        --public-ip-address ""
    ```

1. To create the second VM, use the following command:

    ```azurecli-interactive
    az vm create \
        --resource-group test-rg \
        --admin-username azureuser \
        --authentication-type password \
        --name vm-2 \
        --image Ubuntu2204 \
        --public-ip-address ""
    ```

> [!TIP]
> You can also use the `--no-wait` option to create a VM in the background while you continue with other tasks.

The VMs take a few minutes to create. After Azure creates each VM, the Azure CLI returns output similar to the following message:

```output
    {
      "fqdns": "",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm-2",
      "location": "eastus2",
      "macAddress": "00-0D-3A-23-9A-49",
      "powerState": "VM running",
      "privateIpAddress": "10.0.0.5",
      "publicIpAddress": "",
      "resourceGroup": "test-rg"
      "zones": ""
    }
```

> [!NOTE]
> VMs in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

### [ARM](#tab/arm)


---

## Connect to a virtual machine

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **vm-1**.

1. In the **Overview** information for **vm-1**, select **Connect**.

1. On the **Connect to virtual machine** page, select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password that you created when you created the VM, and then select **Connect**.

## Start communication between VMs

1. At the bash prompt for **vm-1**, enter `ping -c 4 vm-2`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-1:~$ ping -c 4 vm-2
    PING vm-2.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.5) 56(84) bytes of data.
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=1 ttl=64 time=1.83 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=2 ttl=64 time=0.987 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=3 ttl=64 time=0.864 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=4 ttl=64 time=0.890 ms
    ```

1. Close the Bastion connection to **vm-1**.

1. Repeat the steps in [Connect to a virtual machine](#connect-to-a-virtual-machine) to connect to **vm-2**.

1. At the bash prompt for **vm-2**, enter `ping -c 4 vm-1`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-2:~$ ping -c 4 vm-1
    PING vm-1.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.4) 56(84) bytes of data.
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=1 ttl=64 time=0.695 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=2 ttl=64 time=0.896 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=3 ttl=64 time=3.43 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=4 ttl=64 time=0.780 ms
    ```

1. Close the Bastion connection to **vm-2**.

## Clean up resources



## Next step -or- Related content

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)

-or-

- [Related article title](link.md)
- [Related article title](link.md)
- [Related article title](link.md)

