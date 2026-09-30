---
title: Configure a standard service endpoint - PowerShell
titleSuffix: Azure Private Link
description: Learn how to configure a standard service endpoint using Azure PowerShell with network security perimeter and network identifiers.
author: asudbring
ms.author: allensu
ms.service: azure-private-link
ms.topic: how-to
ms.date: 07/08/2026
---

# Configure a standard service endpoint using Azure PowerShell

This article walks you through configuring a [standard service endpoint](service-endpoint-standard-overview.md) using Azure PowerShell. You create a public IP address as a network identifier, associate it with service endpoints on a subnet, configure a network security perimeter, and validate connectivity.

> [!IMPORTANT]
> Standard service endpoint is currently in public preview. This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- **Network Contributor** role or higher on the subscription. Specifically, you need the `Microsoft.Network/publicIPAddresses/joinServiceEndpointNetworkIdentifier/action` permission. For more information, see [network security perimeter role-based access control requirements](network-security-perimeter-role-based-access-control-requirements.md).

- The **AllowServiceEndpointNetworkIdentifier** feature must be registered in your subscription. Use the following commands to register the feature:

    ```azurepowershell-interactive
    $featureParams = @{
        FeatureName       = "AllowServiceEndpointNetworkIdentifier"
        ProviderNamespace = "Microsoft.Network"
    }
    Register-AzProviderFeature @featureParams
    ```

    Verify the registration status:

    ```azurepowershell-interactive
    $featureParams = @{
        FeatureName       = "AllowServiceEndpointNetworkIdentifier"
        ProviderNamespace = "Microsoft.Network"
    }
    Get-AzProviderFeature @featureParams | Select-Object -Property RegistrationState
    ```

    Wait for the state to show **Registered**, then refresh the resource provider registration:

    ```azurepowershell-interactive
    Register-AzResourceProvider -ProviderNamespace "Microsoft.Network"
    ```

- Azure PowerShell installed locally or Azure Cloud Shell. For more information, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

## Sign in to Azure

Connect to your Azure account.

```azurepowershell-interactive
Connect-AzAccount
```

## Create a resource group

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).

```azurepowershell-interactive
$rgParams = @{
    Name     = 'test-rg'
    Location = 'EastUS2'
}
New-AzResourceGroup @rgParams
```

## Create a virtual network

Create a virtual network and subnet with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) and [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig).

```azurepowershell-interactive
$subnetParams = @{
    Name          = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
}
$subnet = New-AzVirtualNetworkSubnetConfig @subnetParams

$vnetParams = @{
    ResourceGroupName = 'test-rg'
    Location          = 'EastUS2'
    Name              = 'vnet-1'
    AddressPrefix     = '10.0.0.0/16'
    Subnet            = $subnet
}
New-AzVirtualNetwork @vnetParams
```

## Create a NAT gateway

Create a NAT gateway and associate it with **subnet-1** to provide outbound internet connectivity for the virtual machine.

1. Create a public IP address for the NAT gateway with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

    ```azurepowershell-interactive
    $natPipParams = @{
        ResourceGroupName = 'test-rg'
        Name              = 'public-ip-nat'
        Location          = 'EastUS2'
        AllocationMethod  = 'Static'
        Sku               = 'Standard'
    }
    $natPip = New-AzPublicIpAddress @natPipParams
    ```

1. Create a NAT gateway with [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway).

    ```azurepowershell-interactive
    $natParams = @{
        ResourceGroupName    = 'test-rg'
        Name                 = 'nat-gateway'
        Location             = 'EastUS2'
        IdleTimeoutInMinutes = 4
        Sku                  = 'Standard'
        PublicIpAddress      = $natPip
    }
    $natGateway = New-AzNatGateway @natParams
    ```

1. Associate the NAT gateway with **subnet-1** by updating the subnet configuration.

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1'

    $subnetUpdateParams = @{
        Name           = 'subnet-1'
        VirtualNetwork = $vnet
        AddressPrefix  = '10.0.0.0/24'
        NatGateway     = $natGateway
    }
    Set-AzVirtualNetworkSubnetConfig @subnetUpdateParams

    $vnet | Set-AzVirtualNetwork
    ```

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview).

>[!NOTE]
>[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. Add an `AzureBastionSubnet` to the virtual network.

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1'

        $subnetParams = @{
        Name           = 'AzureBastionSubnet'
        VirtualNetwork = $vnet
        AddressPrefix  = '10.0.1.0/26'
    }
    Add-AzVirtualNetworkSubnetConfig @subnetParams

    $vnet | Set-AzVirtualNetwork
    ```

1. Create a public IP address for the Bastion host with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

    ```azurepowershell-interactive
    $bastionPipParams = @{
        ResourceGroupName = 'test-rg'
        Name              = 'public-ip-bastion'
        Location          = 'EastUS2'
        AllocationMethod  = 'Static'
        Sku               = 'Standard'
    }
    $bastionPip = New-AzPublicIpAddress @bastionPipParams
    ```

1. Create an Azure Bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion).

    ```azurepowershell-interactive
    $bastionParams = @{
        ResourceGroupName = 'test-rg'
        Name              = 'bastion'
        PublicIpAddress   = $bastionPip
        VirtualNetworkId  = (Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1').Id
        Sku               = 'Basic'
    }
    New-AzBastion @bastionParams
    ```

## Create a virtual machine

Create a VM named **vm-1** in the virtual network. The virtual machine is used to validate connectivity after configuration.

Create a virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). Generate an SSH key pair locally with `ssh-keygen` and attach the public key to the VM configuration.

```azurepowershell-interactive
## Get credentials for virtual machine ##
$cred = Get-Credential

## Generate an SSH key pair locally ##
$sshKeyPath = Join-Path $HOME '.ssh/id_rsa_vm-1'
ssh-keygen -t rsa -b 4096 -f $sshKeyPath -N '""' -q
$sshPublicKey = Get-Content "$sshKeyPath.pub"

## Create network interface for virtual machine ##
$nic = @{
    Name = "nic-1"
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    Subnet = $vnet.Subnets[0]
}
$nicVM = New-AzNetworkInterface @nic

## Create a virtual machine configuration ##
$vmsz = @{
    VMName = 'vm-1'
    VMSize = 'Standard_DS1_v2'  
}
$vmos = @{
    ComputerName = 'vm-1'
    Credential = $cred
    DisablePasswordAuthentication = $true
}
$vmimage = @{
    PublisherName = 'Canonical'
    Offer = '0001-com-ubuntu-server-jammy'
    Skus = '22_04-lts-gen2'
    Version = 'latest'     
}
$vmConfig = New-AzVMConfig @vmsz |
    Set-AzVMOperatingSystem @vmos -Linux |
    Set-AzVMSourceImage @vmimage |
    Add-AzVMNetworkInterface -Id $nicVM.Id
$vmConfig = Add-AzVMSshPublicKey -VM $vmConfig -KeyData $sshPublicKey -Path '/home/azureuser/.ssh/authorized_keys'

## Create the virtual machine ##
$vm = @{
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    VM = $vmConfig
}
New-AzVM @vm
```

Wait for the virtual machine creation to complete before moving on to the next section.

> [!NOTE]
> Virtual machines in a virtual network with an Azure Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Install tools on the virtual machine

Install **cifs-utils** and **Azure CLI** on the virtual machine by running a shell script with [Invoke-AzVMRunCommand](/powershell/module/az.compute/invoke-azvmruncommand).

Save the following script to a local file named `install-tools.sh`:

```bash
#!/bin/bash
sudo apt-get update
sudo apt-get install -y cifs-utils
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

Then run the script on the virtual machine:

```azurepowershell-interactive
$runParams = @{
    ResourceGroupName = 'test-rg'
    VMName            = 'vm-1'
    CommandId         = 'RunShellScript'
    ScriptPath        = './install-tools.sh'
}
Invoke-AzVMRunCommand @runParams
```

## Create a storage account

Create an Azure storage account with a file share to use as the PaaS resource for testing connectivity through the service endpoint.

1. Create a storage account with [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount). Replace `<storage-account-name>` with a globally unique name.

    ```azurepowershell-interactive
    $storageParams = @{
        ResourceGroupName = 'test-rg'
        Name              = '<storage-account-name>'
        Location          = 'EastUS2'
        SkuName           = 'Standard_LRS'
        Kind              = 'StorageV2'
    }
    $storageAccount = New-AzStorageAccount @storageParams
    ```

1. Create a file share with [New-AzRmStorageShare](/powershell/module/az.storage/new-azrmstorageshare).

    ```azurepowershell-interactive
    $shareParams = @{
        ResourceGroupName  = 'test-rg'
        StorageAccountName = '<storage-account-name>'
        Name               = 'fileshare-1'
    }
    New-AzRmStorageShare @shareParams
    ```

## Create a public IP prefix

Create a public IP prefix and a public IP address instance to use as a network identifier.

1. Create a public IP prefix with [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix).

    ```azurepowershell-interactive
    $prefixParams = @{
        ResourceGroupName = 'test-rg'
        Name              = 'public-ip-prefix'
        Location          = 'EastUS2'
        PrefixLength      = 31
        Sku               = 'Standard'
    }
    $ipPrefix = New-AzPublicIpPrefix @prefixParams
    ```

1. Create a public IP address from the prefix with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

    ```azurepowershell-interactive
    $pipParams = @{
        ResourceGroupName = 'test-rg'
        Name              = 'public-ip-1'
        Location          = 'EastUS2'
        AllocationMethod  = 'Static'
        Sku               = 'Standard'
        PublicIpPrefix    = $ipPrefix
    }
    $publicIp = New-AzPublicIpAddress @pipParams
    ```

## Configure service endpoints with a network identifier

This step is the key configuration for a standard service endpoint. You associate a public IP address as a network identifier with service endpoints on a subnet.

A network identifier is a public IP address that you assign to your service endpoint. The public IP isn't used for network routing decisions. When you create a public IP address within your subscription, it's automatically assigned from your service's designated IP pool. Services inside the network security perimeter use this public IP address to recognize service endpoint traffic and configure appropriate access rules.

Update the subnet configuration to add a service endpoint with the public IP address as the network identifier using [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig).

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1'

$networkIdentifier = New-Object Microsoft.Azure.Commands.Network.Models.PSResourceId -Property @{
    Id = $publicIp.Id
}

$subnetUpdateParams = @{
    Name              = 'subnet-1'
    VirtualNetwork    = $vnet
    AddressPrefix     = '10.0.0.0/24'
    ServiceEndpoint   = @('Microsoft.Storage')
    NetworkIdentifier = $networkIdentifier
}
Set-AzVirtualNetworkSubnetConfig @subnetUpdateParams

$vnet | Set-AzVirtualNetwork
```

> [!NOTE]
> The same public IP address can be assigned to all subnets in a region within a subscription. The network identifier is supported across subscriptions during the public preview.

## Create a network security perimeter

Create a network security perimeter and associate your PaaS resources with it.

1. Create a network security perimeter with [New-AzNetworkSecurityPerimeter](/powershell/module/az.network/new-aznetworksecurityperimeter).

    ```azurepowershell-interactive
    $nspParams = @{
        ResourceGroupName = 'test-rg'
        Name              = 'nsp-1'
        Location          = 'EastUS2'
    }
    New-AzNetworkSecurityPerimeter @nspParams
    ```

1. Create a profile in the network security perimeter with [New-AzNetworkSecurityPerimeterProfile](/powershell/module/az.network/new-aznetworksecurityperimeterprofile).

    ```azurepowershell-interactive
    $profileParams = @{
        ResourceGroupName        = 'test-rg'
        SecurityPerimeterName    = 'nsp-1'
        Name                     = 'profile-1'
    }
    New-AzNetworkSecurityPerimeterProfile @profileParams
    ```

1. Associate your storage account with the network security perimeter with [New-AzNetworkSecurityPerimeterAssociation](/powershell/module/az.network/new-aznetworksecurityperimeterassociation). Replace `<subscription-id>` and `<storage-account-name>` with your values.

    ```azurepowershell-interactive
    $assocParams = @{
        ResourceGroupName        = 'test-rg'
        SecurityPerimeterName    = 'nsp-1'
        AssociationName          = 'assoc-storage'
        AccessMode               = 'Learning'
        ProfileId                = "/subscriptions/<subscription-id>/resourceGroups/test-rg/providers/Microsoft.Network/networkSecurityPerimeters/nsp-1/profiles/profile-1"
        PrivateLinkResourceId    = "/subscriptions/<subscription-id>/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
    }
    New-AzNetworkSecurityPerimeterAssociation @assocParams
    ```

## Create a network security perimeter inbound access rule

Add an IP-based inbound access rule in the network security perimeter to authorize traffic from your network identifier. This rule matches the public IP address to enable connectivity from your service endpoints.

Create an inbound access rule with [New-AzNetworkSecurityPerimeterAccessRule](/powershell/module/az.network/new-aznetworksecurityperimeteraccessrule). Replace `<public-ip-prefix-range>` with the address range of your public IP prefix.

```azurepowershell-interactive
$ruleParams = @{
    ResourceGroupName     = 'test-rg'
    SecurityPerimeterName = 'nsp-1'
    ProfileName           = 'profile-1'
    Name                  = 'allow-se-standard'
    Direction             = 'Inbound'
    AddressPrefix         = '<public-ip-prefix-range>'
}
New-AzNetworkSecurityPerimeterAccessRule @ruleParams
```

> [!NOTE]
> To find the address range of your public IP prefix, run `(Get-AzPublicIpPrefix -ResourceGroupName 'test-rg' -Name 'public-ip-prefix').IpPrefix`.

## Validate connectivity

Connect to your virtual machine with Azure Bastion and test connectivity to the storage account to validate that traffic is authorized by the network security perimeter inbound access rule.

### Connect to the virtual machine

1. In the [Azure portal](https://portal.azure.com), search for and select **Virtual machines**.

1. Select **vm-1**.

1. Select **Connect**, then select **Connect via Bastion**.

1. In the **Bastion** page, enter the following information:

    | Setting | Value |
    |---|---|
    | Authentication Type | Select **SSH Private Key from Local File**. |
    | Username | Enter **azureuser**. |
    | Local File | Select the **vm-1-key.pem** file you downloaded when you created the virtual machine. |

1. Select **Connect**.

### Test connectivity to the storage account

1. In the SSH session on **vm-1**, sign in to Azure CLI:

    ```bash
    az login
    ```

1. Mount the Azure file share to validate connectivity to the storage account through the service endpoint. Replace `<storage-account-name>` with the name of your storage account:

    ```bash
    sudo mkdir -p /mnt/fileshare-1
    STORAGE_KEY=$(az storage account keys list \
        --resource-group test-rg \
        --account-name <storage-account-name> \
        --query "[0].value" -o tsv)

    sudo mount -t cifs //<storage-account-name>.file.core.windows.net/fileshare-1 /mnt/fileshare-1 \
        -o username=<storage-account-name>,password=$STORAGE_KEY,serverino,nosharesock,actimeo=30,mfsymlinks
    ```

1. Verify that the file share mounts successfully:

    ```bash
    df -h /mnt/fileshare-1
    ```

1. To confirm that the inbound access rule is working, check the network security perimeter diagnostic logs. For more information about network security perimeter diagnostic logs, see [Diagnostic logging for network security perimeter](network-security-perimeter-diagnostic-logs.md).

<!-- TODO: Awaiting PM input — detailed logging and troubleshooting guidance -->

## Clean up resources

When you no longer need the resources created in this article, delete the resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'test-rg' -Force
```

## Next steps

- [Configure a standard service endpoint using the Azure portal](configure-service-endpoint-standard-portal.md)
- [Configure a standard service endpoint using the Azure CLI](configure-service-endpoint-standard-cli.md)
- [What is a standard service endpoint?](service-endpoint-standard-overview.md)
- [What is a network security perimeter?](network-security-perimeter-concepts.md)
