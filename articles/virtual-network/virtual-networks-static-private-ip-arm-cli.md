---
title: How to set a static private IP in ARM mode using the CLI| Microsoft Docs
description: Understanding static IPs (DIPs) and how to manage them in ARM mode using the CLI
services: virtual-network
documentationcenter: na
author: jimdial
manager: carmonm
editor: tysonn
tags: azure-resource-manager

ms.assetid: 40b03a1a-ea00-454c-b716-7574cea49ac0
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/16/2017
ms.author: jdial

---
# How to set a static private IP address in Azure CLI
[!INCLUDE [virtual-networks-static-private-ip-selectors-arm-include](../../includes/virtual-networks-static-private-ip-selectors-arm-include.md)]


## CLI versions to complete the task 

You can complete the task using one of the following CLI versions: 

- [Azure CLI 1.0](virtual-networks-static-private-ip-arm-cli-nodejs.md) – our CLI for the classic and resource management deployment models 
- [Azure CLI 2.0](azure-arm-classic-important-include.md) - our next generation CLI for the resource management deployment model (this article)

[!INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]

This article covers the Resource Manager deployment model. You can also [manage static private IP address in the classic deployment model](virtual-networks-static-private-ip-classic-cli.md).

[!INCLUDE [virtual-networks-static-ip-scenario-include](../../includes/virtual-networks-static-ip-scenario-include.md)]

> [!NOTE]
> The sample Azure CLI 2.0 commands below expect a simple environment already created. If you want to run the commands as they are displayed in this document, first build the test environment described in [create a vnet](virtual-networks-create-vnet-arm-cli.md).

## How to specify a static private IP address when creating a VM

To create a VM named *DNS01* in the *FrontEnd* subnet of a VNet named *TestVNet* with a static private IP of *192.168.1.101*, follow the steps below:

1. If you haven't yet, install and configure the latest [Azure CLI 2.0 (Preview)](/cli/azure/install-az-cli2) and log in to an Azure account using [az login](/cli/azure/#login). 

2. Create a public IP for the VM with the [az network public-ip create](/cli/azure/network/public-ip#create) command. The list shown after the output explains the parameters used.

    > [!NOTE]
    > You may want or need to use different values for your arguments in this and subsequent steps, depending upon your environment.
   
    ```azurecli
    az network public-ip create \
    --name TestPIP \
    --resource-group TestRG \
    --location centralus \
    --allocation-method Static
    ```

    Expected output:
   
   ```json
   {
        "publicIp": {
            "idleTimeoutInMinutes": 4,
            "ipAddress": "52.176.43.167",
            "provisioningState": "Succeeded",
            "publicIPAllocationMethod": "Static",
            "resourceGuid": "79e8baa3-33ce-466a-846c-37af3c721ce1"
        }
    }
    ```

   * `--resource-group`: Name of the resource group in which to create the public IP.
   * `--name`: Name of the public IP.
   * `--location`: Azure region in which to create the public IP.

3. Run the [az network nic create](/cli/azure/network/nic#create) command to create a NIC with a static private IP. The list shown after the output explains the parameters used. 
   
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
    * `--vnet-name`: Name of the VNet in wihch to create the NIC.
    * `--subnet`: Name of the subnet in which to create the NIC.

4. Run the [azure vm create](/cli/azure/vm/nic#create) command to create the VM using the public IP and NIC created above. The list shown after the output explains the parameters used.
   
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
   
   Parameters other than the basic [az vm create](/cli/azure/vm#create) parameters.

   * `--nics`: Name of the NIC to which the VM is attached.
   

## How to retrieve static private IP address information for a VM

To view the static private IP address that you created, run the following Azure CLI command and observe the values for *Private IP alloc-method* and *Private IP address*:

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

## How to remove a static private IP address from a VM

You cannot remove a static private IP address from a NIC in Azure CLI for Resource Manager. You must:
- Create a new NIC that uses a dynamic IP
- Remove the previous NIC from the VM, and 
- Add the new NIC to the VM. 

To change the NIC for the VM used in the commands above, follow the steps below.

1. Run the **azure network nic create** command to create a new NIC using dynamic IP allocation. Notice how you do not need to specify the IP address this time.
   
        azure network nic create -g TestRG -n TestNIC2 -l centralus -m TestVNet -k FrontEnd
   
    Expected output:
   
        info:    Executing command network nic create
        + Looking up the network interface "TestNIC2"
        + Looking up the subnet "FrontEnd"
        + Creating network interface "TestNIC2"
        + Looking up the network interface "TestNIC2"
        data:    Id                              : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC2
        data:    Name                            : TestNIC2
        data:    Type                            : Microsoft.Network/networkInterfaces
        data:    Location                        : centralus
        data:    Provisioning state              : Succeeded
        data:    Enable IP forwarding            : false
        data:    IP configurations:
        data:      Name                          : NIC-config
        data:      Provisioning state            : Succeeded
        data:      Private IP address            : 192.168.1.6
        data:      Private IP Allocation Method  : Dynamic
        data:      Subnet                        : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd
        data:
        info:    network nic create command OK
2. Run the **azure vm set** command to change the NIC used by the VM.
   
        azure vm set -g TestRG -n DNS01 -N TestNIC2
   
    Expected output:
   
        info:    Executing command vm set
        + Looking up the VM "DNS01"
        + Looking up the NIC "TestNIC2"
        + Updating VM "DNS01"
        info:    vm set command OK
3. If wanted, run the **azure network nic delete** command to delete the old NIC.
   
        azure network nic delete -g TestRG -n TestNIC --quiet
   
    Expected output:
   
        info:    Executing command network nic delete
        + Looking up the network interface "TestNIC"
        + Deleting network interface "TestNIC"
        info:    network nic delete command OK

## How to add a static private IP address to an existing VM
To add a static private IP address to the NIC used by the VM created using the script above, run the following command:

    azure network nic set -g TestRG -n TestNIC2 -a 192.168.1.101

Expected output:

    info:    Executing command network nic set
    + Looking up the network interface "TestNIC2"
    + Updating network interface "TestNIC2"
    + Looking up the network interface "TestNIC2"
    data:    Id                              : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC2
    data:    Name                            : TestNIC2
    data:    Type                            : Microsoft.Network/networkInterfaces
    data:    Location                        : centralus
    data:    Provisioning state              : Succeeded
    data:    MAC address                     : 00-0D-3A-90-29-25
    data:    Enable IP forwarding            : false
    data:    Virtual machine                 : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/DNS01
    data:    IP configurations:
    data:      Name                          : NIC-config
    data:      Provisioning state            : Succeeded
    data:      Private IP address            : 192.168.1.101
    data:      Private IP Allocation Method  : Static
    data:      Subnet                        : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd
    data:
    info:    network nic set command OK

## Next steps
* Learn about [reserved public IP](virtual-networks-reserved-public-ip.md) addresses.
* Learn about [instance-level public IP (ILPIP)](virtual-networks-instance-level-public-ip.md) addresses.
* Consult the [Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx).

