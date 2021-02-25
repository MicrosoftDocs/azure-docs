---
title: Configure private IP addresses for VMs - Azure CLI
description: Learn how to configure private IP addresses for virtual machines using the Azure command-line interface (CLI).
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
editor: ''
tags: azure-resource-manager

ms.assetid: 40b03a1a-ea00-454c-b716-7574cea49ac0
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang: azurecli
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/16/2017
ms.author: allensu

---
# Configure private IP addresses for a virtual machine using the Azure CLI


[!INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

[!INCLUDE [virtual-networks-static-ip-scenario-include](../../includes/virtual-networks-static-ip-scenario-include.md)]

> [!NOTE]
> The following sample Azure CLI commands expect an existing simple environment. If you want to run the commands as they are displayed in this document, first build the test environment described in [create a vnet](quick-create-cli.md).

## Specify a static private IP address when creating a VM

To create a VM named *DNS01* in the *FrontEnd* subnet of a VNet named *TestVNet* with a static private IP of *192.168.1.101*, complete the following steps:

1. If you haven't yet, install and configure the latest [Azure CLI](/cli/azure/install-azure-cli) and log in to an Azure account using [az login](/cli/azure/reference-index).

2. Run the [az network nic create](/cli/azure/network/nic) command to create a NIC with a static private IP. The list shown after the output explains the parameters used. 
   
    ```azurecli
    az network nic create \
    --resource-group TestRG \
    --name TestNIC \
    --location centralus \
    --subnet FrontEnd \
    --private-ip-address 192.168.1.101 \
    --vnet-name TestVNet
    ```

    Expected output:
   
    ```json
    {
        "newNIC": {
            "dnsSettings": {
            "appliedDnsServers": [],
            "dnsServers": []
            },
            "enableIPForwarding": false,
            "ipConfigurations": [
            {
                "etag": "W/\"<guid>\"",
                "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC/ipConfigurations/ipconfig1",
                "name": "ipconfig1",
                "properties": {
                "primary": true,
                "privateIPAddress": "192.168.1.101",
                "privateIPAllocationMethod": "Static",
                "provisioningState": "Succeeded",
                "subnet": {
                    "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
                    "resourceGroup": "TestRG"
                }
                },
                "resourceGroup": "TestRG"
            }
            ],
            "provisioningState": "Succeeded",
            "resourceGuid": "<guid>"
        }
    }
    ```
    
    Parameters:

    * `--private-ip-address`: Static private IP address for the NIC.
    * `--vnet-name`: Name of the VNet in which to create the NIC.
    * `--subnet`: Name of the subnet in which to create the NIC.

3. Run the [azure vm create](/cli/azure/vm/nic) command to create the VM using the public IP and NIC created previously. The list shown after the output explains the parameters used.
   
    ```azurecli
    az vm create \
    --resource-group TestRG \
    --name DNS01 \
    --location centralus \
    --image Debian \
    --admin-username adminuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --nics TestNIC
    ```

    Expected output:
   
    ```json
    {
        "fqdns": "",
        "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/DNS01",
        "location": "centralus",
        "macAddress": "00-0D-3A-92-C1-66",
        "powerState": "VM running",
        "privateIpAddress": "192.168.1.101",
        "publicIpAddress": "",
        "resourceGroup": "TestRG"
    }
    ```
   
   Parameters other than the basic [az vm create](/cli/azure/vm) parameters.

   * `--nics`: Name of the NIC to which the VM is attached.
   
It’s recommended that you do not statically assign the private IP assigned to the Azure virtual machine within the operating system of a VM, unless necessary, such as when [assigning multiple IP addresses to a Windows VM](virtual-network-multiple-ip-addresses-cli.md). If you do manually set the private IP address within the operating system, ensure that it is the same address as the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings), or you can lose connectivity to the virtual machine. Learn more about [private IP address](virtual-network-network-interface-addresses.md#private) settings.

## Retrieve static private IP address information for a VM

Run the following Azure CLI command to observe the values for *Private IP alloc-method* and *Private IP address*:

```azurecli
az vm show -g TestRG -n DNS01 --show-details --query 'privateIps'
```

Expected output:

```json
"192.168.1.101"
```

To display the specific IP information of the NIC for that VM, query the NIC specifically:

```azurecli
az network nic show \
-g testrg \
-n testnic \
--query 'ipConfigurations[0].{PrivateAddress:privateIpAddress,IPVer:privateIpAddressVersion,IpAllocMethod:p
rivateIpAllocationMethod,PublicAddress:publicIpAddress}'
```

The output is something like:

```json
{
    "IPVer": "IPv4",
    "IpAllocMethod": "Static",
    "PrivateAddress": "192.168.1.101",
    "PublicAddress": null
}
```

## Remove a static private IP address from a VM

You cannot remove a static private IP address from a NIC in Azure CLI for Azure Resource Manager deployments. You must:
- Create a new NIC that uses a dynamic IP
- Set the NIC on the VM do the newly created NIC. 

To change the NIC for the VM used in the previous commands, complete the following steps:

1. Run the **azure network nic create** command to create a new NIC using dynamic IP allocation with a new IP address. Because no IP address is specified, the allocation method is **Dynamic**.

    ```azurecli
    az network nic create     \
    --resource-group TestRG     \
    --name TestNIC2     \
    --location centralus     \
    --subnet FrontEnd    \
    --vnet-name TestVNet
    ```        
   
    Expected output:

    ```json
    {
        "newNIC": {
            "dnsSettings": {
            "appliedDnsServers": [],
            "dnsServers": []
            },
            "enableIPForwarding": false,
            "ipConfigurations": [
            {
                "etag": "W/\"<guid>\"",
                "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC2/ipConfigurations/ipconfig1",
                "name": "ipconfig1",
                "properties": {
                "primary": true,
                "privateIPAddress": "192.168.1.4",
                "privateIPAllocationMethod": "Dynamic",
                "provisioningState": "Succeeded",
                "subnet": {
                    "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
                    "resourceGroup": "TestRG"
                }
                },
                "resourceGroup": "TestRG"
            }
            ],
            "provisioningState": "Succeeded",
            "resourceGuid": "0808a61c-476f-4d08-98ee-0fa83671b010"
        }
    }
    ```

2. Run the **azure vm set** command to change the NIC used by the VM.
   
    ```azurecli
   az vm nic set --resource-group TestRG --vm-name DNS01 --nics TestNIC2
    ```

    Expected output:
   
    ```json
    [
        {
            "id": "/subscriptions/0e220bf6-5caa-4e9f-8383-51f16b6c109f/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC3",
            "primary": true,
            "resourceGroup": "TestRG"
        }
    ]
    ```

    > [!NOTE]
    > If the VM is large enough to have more than one NIC, run the **azure network nic delete** command to delete the old NIC.

## Next steps

Learn about managing [IP address settings](virtual-network-network-interface-addresses.md).
