---
title: Create an Azure Virtual Machine with Accelerated Networking
description: Use Azure portal, Azure CLI, or PowerShell to create Linux or Windows virtual machines with Accelerated Networking enabled for improved network performance.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 01/07/2025
ms.custom: fasttrack-edit, devx-track-azurecli, linux-related-content, innovation-engine
---

# Create an Azure Virtual Machine with Accelerated Networking

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://go.microsoft.com/fwlink/?linkid=2303215)

This article describes how to create a Linux or Windows virtual machine (VM) with Accelerated Networking (AccelNet) enabled by using the Azure CLI command-line interface. 

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create a virtual network

### [Portal](#tab/portal)

[!INCLUDE [virtual-network-create-with-bastion.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-with-bastion.md)]

### [PowerShell](#tab/powershell)

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named **test-rg** in the **eastus** location.

```azurepowershell
$resourceGroup = @{
    Name = "test-rg"
    Location = "EastUS2"
}
New-AzResourceGroup @resourceGroup
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named **vnet-1** with the address prefix **10.0.0.0/16**.

```azurepowershell
$vnet1 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    Name = "vnet-1"
    AddressPrefix = "10.0.0.0/16"
}
$virtualNetwork1 = New-AzVirtualNetwork @vnet1
```

Create a subnet configuration with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following example creates a subnet configuration with a **10.0.0.0/24** address prefix:

```azurepowershell
$subConfig = @{
    Name = "subnet-1"
    AddressPrefix = "10.0.0.0/24"
    VirtualNetwork = $virtualNetwork1
}
$subnetConfig1 = Add-AzVirtualNetworkSubnetConfig @subConfig
```

Create a subnet configuration for Azure Bastion with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following example creates a subnet configuration with a **10.0.1.0/24** address prefix:

```azurepowershell
$subBConfig = @{
    Name = "AzureBastionSubnet"
    AddressPrefix = "10.0.1.0/24"
    VirtualNetwork = $virtualNetwork1
}
$subnetConfig2 = Add-AzVirtualNetworkSubnetConfig @subBConfig
```

Write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork), which creates the subnet:

```azurepowershell
$virtualNetwork1 | Set-AzVirtualNetwork
```

### Create Azure Bastion

Create a public IP address for the Azure Bastion host with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). The following example creates a public IP address named *public-ip-bastion* in the *vnet-1* virtual network.

```azurepowershell
$publicIpParams = @{
    ResourceGroupName = "test-rg"
    Name = "public-ip-bastion"
    Location = "EastUS2"
    AllocationMethod = "Static"
    Sku = "Standard"
}
New-AzPublicIpAddress @publicIpParams
```

Create an Azure Bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion). The following example creates an Azure Bastion host named *bastion* in the *AzureBastionSubnet* subnet of the *vnet-1* virtual network. Azure Bastion is used to securely connect Azure virtual machines without exposing them to the public internet.

```azurepowershell
$bastionParams = @{
    ResourceGroupName = "test-rg"
    Name = "bastion"
    VirtualNetworkName = "vnet-1"
    PublicIpAddressName = "public-ip-bastion"
    PublicIpAddressRgName = "test-rg"
    VirtualNetworkRgName = "test-rg"
}
New-AzBastion @bastionParams -AsJob
```

### [CLI](#tab/cli)

1. Use [az group create](/cli/azure/group#az-group-create) to create a resource group that contains the resources. Be sure to select a supported Windows or Linux region as listed in [Windows and Linux Accelerated Networking](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview).

    ```bash
    export RANDOM_SUFFIX=$(openssl rand -hex 3)
    export RESOURCE_GROUP_NAME="test-rg$RANDOM_SUFFIX"
    export REGION="eastus2"

    az group create \
        --name $RESOURCE_GROUP_NAME \
        --location $REGION
    ```

    Results:
    
    <!-- expected_similarity=0.3 --> 

    ```json
    {
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367",
      "location": "eastus2",
      "managedBy": null,
      "name": "test-rg69e367",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null,
      "type": "Microsoft.Resources/resourceGroups"
    }
    ```
    
1. Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network with one subnet in the resource group:

   ```bash
    export RESOURCE_GROUP_NAME="test-rg$RANDOM_SUFFIX"
    export VNET_NAME="vnet-1$RANDOM_SUFFIX"
    export SUBNET_NAME="subnet-1$RANDOM_SUFFIX"
    export VNET_ADDRESS_PREFIX="10.0.0.0/16"
    export SUBNET_ADDRESS_PREFIX="10.0.0.0/24"

    az network vnet create \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $VNET_NAME \
        --address-prefix $VNET_ADDRESS_PREFIX \
        --subnet-name $SUBNET_NAME \
        --subnet-prefix $SUBNET_ADDRESS_PREFIX
   ```

    Results:
    
    <!-- expected_similarity=0.3 --> 

    ```json
   {
      "newVNet": {
        "addressSpace": {
          "addressPrefixes": [
            "10.0.0.0/16"
          ]
        },
        "enableDdosProtection": false,
        "etag": "W/\"300c6da1-ee4a-47ee-af6e-662d3a0230a1\"",
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/virtualNetworks/vnet-169e367",
        "location": "eastus2",
        "name": "vnet-169e367",
        "provisioningState": "Succeeded",
        "resourceGroup": "test-rg69e367",
        "resourceGuid": "3d64254d-70d4-47e3-a129-473d70ea2ab8",
        "subnets": [
          {
            "addressPrefix": "10.0.0.0/24",
            "delegations": [],
            "etag": "W/\"300c6da1-ee4a-47ee-af6e-662d3a0230a1\"",
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/virtualNetworks/vnet-169e367/subnets/subnet-169e367",
            "name": "subnet-169e367",
            "privateEndpointNetworkPolicies": "Disabled",
            "privateLinkServiceNetworkPolicies": "Enabled",
            "provisioningState": "Succeeded",
            "resourceGroup": "test-rg69e367",
            "type": "Microsoft.Network/virtualNetworks/subnets"
          }
        ],
        "type": "Microsoft.Network/virtualNetworks",
        "virtualNetworkPeerings": []
      }
    }
    ```

1. Create the Bastion subnet with [az network vnet subnet create](/cli/azure/network/vnet/subnet).

    ```bash
    export RESOURCE_GROUP_NAME="test-rg$RANDOM_SUFFIX"
    export VNET_NAME="vnet-1$RANDOM_SUFFIX"
    export SUBNET_NAME="AzureBastionSubnet"
    export SUBNET_ADDRESS_PREFIX="10.0.1.0/24"

    az network vnet subnet create \
        --vnet-name $VNET_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --name AzureBastionSubnet \
        --address-prefix $SUBNET_ADDRESS_PREFIX
    ```
    
    Results:
    
    <!-- expected_similarity=0.3 --> 

    ```json
    {
      "addressPrefix": "10.0.1.0/24",
      "delegations": [],
      "etag": "W/\"a2863964-0276-453f-a104-b37391e8088b\"",
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/virtualNetworks/vnet-169e367/subnets/AzureBastionSubnet",
      "name": "AzureBastionSubnet",
      "privateEndpointNetworkPolicies": "Disabled",
      "privateLinkServiceNetworkPolicies": "Enabled",
      "provisioningState": "Succeeded",
      "resourceGroup": "test-rg69e367",
      "type": "Microsoft.Network/virtualNetworks/subnets"
    }
    ```

### Create Azure Bastion

1. Create a public IP address for the Azure Bastion host with [az network public-ip create](/cli/azure/network/public-ip).

    ```bash
    export RESOURCE_GROUP_NAME="test-rg$RANDOM_SUFFIX"
    export PUBLIC_IP_NAME="public-ip-bastion$RANDOM_SUFFIX"
    export LOCATION="eastus2"
    export ALLOCATION_METHOD="Static"
    export SKU="Standard"

   az network public-ip create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $PUBLIC_IP_NAME \
      --location $LOCATION \
      --allocation-method $ALLOCATION_METHOD \
      --sku $SKU
   ```
    
    Results:
    
    <!-- expected_similarity=0.3 --> 

    ```json
    {
      "publicIp": {
        "ddosSettings": {
          "protectionMode": "VirtualNetworkInherited"
        },
        "etag": "W/\"efa750bf-63f9-4c02-9ace-a747fc405d0f\"",
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/publicIPAddresses/public-ip-bastion69e367",
        "idleTimeoutInMinutes": 4,
        "ipAddress": "203.0.113.173",
        "ipTags": [],
        "location": "eastus2",
        "name": "public-ip-bastion69e367",
        "provisioningState": "Succeeded",
        "publicIPAddressVersion": "IPv4",
        "publicIPAllocationMethod": "Static",
        "resourceGroup": "test-rg69e367",
        "resourceGuid": "fc809493-80c8-482c-9f5a-9d6442472a99",
        "sku": {
          "name": "Standard",
          "tier": "Regional"
        },
        "type": "Microsoft.Network/publicIPAddresses"
      }
    }
    ```

1. Create an Azure Bastion host with [az network bastion create](/cli/azure/network/bastion). Azure Bastion is used to securely connect Azure virtual machines without exposing them to the public internet.

    ```bash
    export RESOURCE_GROUP_NAME="test-rg$RANDOM_SUFFIX"
    export BASTION_NAME="bastion$RANDOM_SUFFIX"
    export VNET_NAME="vnet-1$RANDOM_SUFFIX"
    export PUBLIC_IP_NAME="public-ip-bastion$RANDOM_SUFFIX"
    export LOCATION="eastus2"
   
   az network bastion create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $BASTION_NAME \
      --vnet-name $VNET_NAME \
      --public-ip-address $PUBLIC_IP_NAME \
      --location $LOCATION
    ```

    Results:
    
    <!-- expected_similarity=0.3 --> 

    ```json
    {
      "disableCopyPaste": false,
      "dnsName": "bst-cc1d5c1d-9496-44fa-a8b3-3b2130efa306.bastion.azure.com",
      "enableFileCopy": false,
      "enableIpConnect": false,
      "enableKerberos": false,
      "enableSessionRecording": false,
      "enableShareableLink": false,
      "enableTunneling": false,
      "etag": "W/\"229bd068-160b-4935-b23d-eddce4bb31ed\"",
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/bastionHosts/bastion69e367",
      "ipConfigurations": [
        {
          "etag": "W/\"229bd068-160b-4935-b23d-eddce4bb31ed\"",
          "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/bastionHosts/bastion69e367/bastionHostIpConfigurations/bastion_ip_config",
          "name": "bastion_ip_config",
          "privateIPAllocationMethod": "Dynamic",
          "provisioningState": "Succeeded",
          "publicIPAddress": {
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/publicIPAddresses/public-ip-bastion69e367",
            "resourceGroup": "test-rg69e367"
          },
          "resourceGroup": "test-rg69e367",
          "subnet": {
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/virtualNetworks/vnet-169e367/subnets/AzureBastionSubnet",
            "resourceGroup": "test-rg69e367"
          },
          "type": "Microsoft.Network/bastionHosts/bastionHostIpConfigurations"
        }
      ],
      "location": "eastus2",
      "name": "bastion69e367",
      "provisioningState": "Succeeded",
      "resourceGroup": "test-rg69e367",
      "scaleUnits": 2,
      "sku": {
        "name": "Standard"
      },
      "type": "Microsoft.Network/bastionHosts"
    }
    ```

---

## Create a network interface with Accelerated Networking

### [Portal](#tab/portal)

Accelerated networking is enabled in the portal during virtual machine creation. Create a virtual machine in the following section.

### [PowerShell](#tab/powershell)

Use [New-AzNetworkInterface](/powershell/module/az.Network/New-azNetworkInterface) to create a network interface (NIC) with Accelerated Networking enabled, and assign the public IP address to the NIC.

```azurepowershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-1"
    }
$vnet = Get-AzVirtualNetwork @vnetParams

$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-1"
    Location = "eastus2"
    SubnetId = $vnet.Subnets[0].Id
    EnableAcceleratedNetworking = $true
    }
$nic = New-AzNetworkInterface @nicParams
```

### [CLI](#tab/cli)

1. Use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create a network interface (NIC) with Accelerated Networking enabled. The following example creates a NIC in the subnet of the virtual network.

   ```bash
    export RESOURCE_GROUP_NAME="test-rg$RANDOM_SUFFIX"
    export NIC_NAME="nic-1$RANDOM_SUFFIX"
    export VNET_NAME="vnet-1$RANDOM_SUFFIX"
    export SUBNET_NAME="subnet-1$RANDOM_SUFFIX"

    az network nic create \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $NIC_NAME \
        --vnet-name $VNET_NAME \
        --subnet $SUBNET_NAME \
        --accelerated-networking true
   ```

    Results:
    
    <!-- expected_similarity=0.3 --> 

    ```json
   {
      "NewNIC": {
        "auxiliaryMode": "None",
        "auxiliarySku": "None",
        "disableTcpStateTracking": false,
        "dnsSettings": {
          "appliedDnsServers": [],
          "dnsServers": [],
          "internalDomainNameSuffix": "juswipouodrupijji24xb0rkxa.cx.internal.cloudapp.net"
        },
        "enableAcceleratedNetworking": true,
        "enableIPForwarding": false,
        "etag": "W/\"0e24b553-769b-4350-b1aa-ab4cd04100bf\"",
        "hostedWorkloads": [],
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/networkInterfaces/nic-169e367",
        "ipConfigurations": [
          {
            "etag": "W/\"0e24b553-769b-4350-b1aa-ab4cd04100bf\"",
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/networkInterfaces/nic-169e367/ipConfigurations/ipconfig1",
            "name": "ipconfig1",
            "primary": true,
            "privateIPAddress": "10.0.0.4",
            "privateIPAddressVersion": "IPv4",
            "privateIPAllocationMethod": "Dynamic",
            "provisioningState": "Succeeded",
            "resourceGroup": "test-rg69e367",
            "subnet": {
              "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Network/virtualNetworks/vnet-169e367/subnets/subnet-169e367",
              "resourceGroup": "test-rg69e367"
            },
            "type": "Microsoft.Network/networkInterfaces/ipConfigurations"
          }
        ],
        "location": "eastus2",
        "name": "nic-169e367",
        "nicType": "Standard",
        "provisioningState": "Succeeded",
        "resourceGroup": "test-rg69e367",
        "resourceGuid": "6798a335-bd66-42cc-a92a-bb678d4d146e",
        "tapConfigurations": [],
        "type": "Microsoft.Network/networkInterfaces",
        "vnetEncryptionSupported": false
      }
    }
    ```

---

## Create a VM and attach the NIC

### [Portal](#tab/portal)

[!INCLUDE [create-test-virtual-machine-linux.md](~/reusable-content/ce-skilling/azure/includes/create-test-virtual-machine-linux.md)]

### [PowerShell](#tab/powershell)

Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to set a user name and password for the VM and store them in the `$cred` variable.

```azurepowershell
$cred = Get-Credential
```

> [!NOTE]
> A username is required for the VM. The password is optional and won't be used if set.  SSH key configuration is recommended for Linux VMs.

Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) to define a VM with a VM size that supports accelerated networking, as listed in [Windows Accelerated Networking](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview). For a list of all Windows VM sizes and characteristics, see [Windows VM sizes](/azure/virtual-machines/sizes).

```azurepowershell
$vmConfigParams = @{
    VMName = "vm-1"
    VMSize = "Standard_DS4_v2"
    }
$vmConfig = New-AzVMConfig @vmConfigParams
```

Use [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage) to create the rest of the VM configuration. The following example creates an Ubuntu Server virtual machine:

```azurepowershell
$osParams = @{
    VM = $vmConfig
    ComputerName = "vm-1"
    Credential = $cred
    }
$vmConfig = Set-AzVMOperatingSystem @osParams -Linux -DisablePasswordAuthentication

$imageParams = @{
    VM = $vmConfig
    PublisherName = "Canonical"
    Offer = "ubuntu-24_04-lts"
    Skus = "server"
    Version = "latest"
    }
$vmConfig = Set-AzVMSourceImage @imageParams
```

Use [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to attach the NIC that you previously created to the VM.

```azurepowershell
# Get the network interface object
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-1"
    }
$nic = Get-AzNetworkInterface @nicParams

$vmConfigParams = @{
    VM = $vmConfig
    Id = $nic.Id
    }
$vmConfig = Add-AzVMNetworkInterface @vmConfigParams
```

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the VM with Accelerated Networking enabled. The command will generate SSH keys for the virtual machine for login. Make note of the location of the private key. The private key is needed in later steps for connecting to the virtual machine with Azure Bastion.

```azurepowershell
$vmParams = @{
    VM = $vmConfig
    ResourceGroupName = "test-rg"
    Location = "eastus2"
    SshKeyName = "ssh-key"
    }
New-AzVM @vmParams -GenerateSshKey
```

### [CLI](#tab/cli)

Use [az vm create](/cli/azure/vm#az-vm-create) to create the VM, and use the `--nics` option to attach the NIC you created. Ensure you select a VM size and distribution listed in [Windows and Linux Accelerated Networking](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview). For a list of all VM sizes and characteristics, see [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes).


The following example creates a VM with a size that supports Accelerated Networking, Standard_DS4_v2. The command will generate SSH keys for the virtual machine for login. Make note of the location of the private key. The private key is needed in later steps for connecting to the virtual machine with Azure Bastion.

```bash
export RESOURCE_GROUP_NAME="test-rg$RANDOM_SUFFIX"
export VM_NAME="vm-1$RANDOM_SUFFIX"
export IMAGE="Ubuntu2204"
export SIZE="Standard_DS4_v2"
export ADMIN_USER="azureuser"
export NIC_NAME="nic-1$RANDOM_SUFFIX"

az vm create \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $VM_NAME \
   --image $IMAGE \
   --size $SIZE \
   --admin-username $ADMIN_USER \
   --generate-ssh-keys \
   --nics $NIC_NAME
```

> [!NOTE]
> To create a Windows VM, replace `--image Ubuntu2204` with `--image Win2019Datacenter`. 

Results:
    
<!-- expected_similarity=0.3 --> 

```json
{
    "fqdns": "",
    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/test-rg69e367/providers/Microsoft.Compute/virtualMachines/vm-169e367",
    "location": "eastus2",
    "macAddress": "60-45-BD-84-F0-D5",
    "powerState": "VM running",
    "privateIpAddress": "10.0.0.4",
    "publicIpAddress": "",
    "resourceGroup": "test-rg69e367",
    "zones": ""
}
```

---

## Confirm that accelerated networking is enabled

### Linux

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual machines*.

1. On the **Virtual machines** page, select your new VM.

1. On the VM's **Overview** page, select **Connect** then **Connect via Bastion**.

1. In the Bastion connection screen, change **Authentication Type** to **SSH Private Key from Local File**.

1. Enter the **Username** that you used when creating the virtual machine. In this example, the user is named **azureuser**, replace with the username you created.

1. In **Local File**, select the folder icon and browse to the private key file that was generated when you created the VM. The private key file is typically named `id_rsa` or `id_rsa.pem`.

1. Select **Connect**.

1. A new browser window opens with the Bastion connection to your VM.

1. From a shell on the remote VM, enter `uname -r` and confirm that the kernel version is one of the following versions, or greater:

   - **Ubuntu 16.04**: 4.11.0-1013.
   - **SLES SP3**: 4.4.92-6.18.
   - **RHEL**: 3.10.0-693, 2.6.32-573. RHEL 6.7-6.10 are supported if the Mellanox VF version 4.5+ is installed before Linux Integration Services 4.3+.

   > [!NOTE]
   > Other kernel versions might be supported. For an updated list, see the compatibility tables for each distribution at [Supported Linux and FreeBSD virtual machines for Hyper-V](/windows-server/virtualization/hyper-v/supported-linux-and-freebsd-virtual-machines-for-hyper-v-on-windows), and confirm that SR-IOV is supported. You can find more details in the release notes for [Linux Integration Services for Hyper-V and Azure](https://www.microsoft.com/download/details.aspx?id=55106). *

1. Use the `lspci` command to confirm that the Mellanox VF device is exposed to the VM. The returned output should be similar to the following example:

   ```output
   0000:00:00.0 Host bridge: Intel Corporation 440BX/ZX/DX - 82443BX/ZX/DX Host bridge (AGP disabled) (rev 03)
   0000:00:07.0 ISA bridge: Intel Corporation 82371AB/EB/MB PIIX4 ISA (rev 01)
   0000:00:07.1 IDE interface: Intel Corporation 82371AB/EB/MB PIIX4 IDE (rev 01)
   0000:00:07.3 Bridge: Intel Corporation 82371AB/EB/MB PIIX4 ACPI (rev 02)
   0000:00:08.0 VGA compatible controller: Microsoft Corporation Hyper-V virtual VGA
   0001:00:02.0 Ethernet controller: Mellanox Technologies MT27500/MT27520 Family [ConnectX-3/ConnectX-3 Pro Virtual Function]
   ```

1. Use the `ethtool -S eth0 | grep vf_` command to check for activity on the virtual function (VF). If accelerated networking is enabled and active, you receive output similar to the following example:

   ```output
   vf_rx_packets: 992956
   vf_rx_bytes: 2749784180
   vf_tx_packets: 2656684
   vf_tx_bytes: 1099443970
   vf_tx_dropped: 0
   ```

1. Close the Bastion connection to the VM.

### Windows

Once you create the VM in Azure, connect to the VM and confirm that the Ethernet controller is installed in Windows.

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual machines*.

1. On the **Virtual machines** page, select your new VM.

1. On the VM's **Overview** page, select **Connect** then **Connect via Bastion**.

1. Enter the credentials you used when you created the VM, and then select **Connect**.

1. A new browser window opens with the Bastion connection to your VM.

1. On the remote VM, right-click **Start** and select **Device Manager**.

1. In the **Device Manager** window, expand the **Network adapters** node.

1. Confirm that the **Mellanox ConnectX-4 Lx Virtual Ethernet Adapter** appears, as shown in the following image:

   ![Mellanox ConnectX-3 Virtual Function Ethernet Adapter, new network adapter for accelerated networking, Device Manager](./media/create-vm-accelerated-networking/device-manager.png)
   
      The presence of the adapter confirms that Accelerated Networking is enabled for your VM.

1. Verify the packets are flowing over the VF interface from the output of the following command:
   ```powershell
   PS C:\ > Get-NetAdapter | Where-Object InterfaceDescription –like "*Mellanox*Virtual*" | Get-NetAdapterStatistics

   Name                             ReceivedBytes ReceivedUnicastPackets       SentBytes SentUnicastPackets
   ----                             ------------- ----------------------       --------- ------------------
   Ethernet 2                           492447549                 347643         7468446              34991

   ```

    > [!NOTE]
    > If the Mellanox adapter fails to start, open an administrator command prompt on the remote VM and enter the following command:
    >
    > `netsh int tcp set global rss = enabled`


1. Close the Bastion connection to the VM.

## Next steps

- [How Accelerated Networking works in Linux and FreeBSD VMs](./accelerated-networking-how-it-works.md)

- [Proximity placement groups](/azure/virtual-machines/co-location)
