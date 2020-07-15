---
 title: include file
 description: include file
 services: virtual-network
 author: genlin
 ms.service: virtual-network
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: genli
 ms.custom: include file

---

## How to create a classic VNet using Azure CLI
You can use the Azure CLI to manage your Azure resources from the command prompt from any computer running Windows, Linux, or OSX.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](../articles/cli-install-nodejs.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. To create a VNet and a subnet, run the **azure network vnet create** command:
   
            azure network vnet create --vnet TestVNet -e 192.168.0.0 -i 16 -n FrontEnd -p 192.168.1.0 -r 24 -l "Central US"
   
    Expected output:
   
            info:    Executing command network vnet create
            + Looking up network configuration
            + Looking up locations
            + Setting network configuration
            info:    network vnet create command OK
   
   * **--vnet**. Name of the VNet to be created. For the scenario, *TestVNet*
   * **-e (or --address-space)**. VNet address space. For the scenario, *192.168.0.0*
   * **-i (or -cidr)**. Network mask in CIDR format. For the scenario, *16*.
   * **-n (or --subnet-name**). Name of the first subnet. For the scenario, *FrontEnd*.
   * **-p (or --subnet-start-ip)**. Starting IP address for subnet, or subnet address space. For the scenario, *192.168.1.0*.
   * **-r (or --subnet-cidr)**. Network mask in CIDR format for subnet. For the scenario, *24*.
   * **-l (or --location)**. Azure region where the VNet is created. For the scenario, *Central US*.
3. To create a subnet, run the **azure network vnet subnet create** command:
   
            azure network vnet subnet create -t TestVNet -n BackEnd -a 192.168.2.0/24
   
    The expected output for the previous command:
   
            info:    Executing command network vnet subnet create
            + Looking up network configuration
            + Creating subnet "BackEnd"
            + Setting network configuration
            + Looking up the subnet "BackEnd"
            + Looking up network configuration
            data:    Name                            : BackEnd
            data:    Address prefix                  : 192.168.2.0/24
            info:    network vnet subnet create command OK
   
   * **-t (or --vnet-name**. Name of the VNet where the subnet will be created. For the scenario, *TestVNet*.
   * **-n (or --name)**. Name of the new subnet. For the scenario, *BackEnd*.
   * **-a (or --address-prefix)**. Subnet CIDR block. For the scenario, *192.168.2.0/24*.
4. To view the properties of the new vnet, run the **azure network vnet show** command:
   
            azure network vnet show
   
    Expected output for the previous command:
   
            info:    Executing command network vnet show
            Virtual network name: TestVNet
            + Looking up the virtual network sites
            data:    Name                            : TestVNet
            data:    Location                        : Central US
            data:    State                           : Created
            data:    Address space                   : 192.168.0.0/16
            data:    Subnets:
            data:      Name                          : FrontEnd
            data:      Address prefix                : 192.168.1.0/24
            data:
            data:      Name                          : BackEnd
            data:      Address prefix                : 192.168.2.0/24
            data:
            info:    network vnet show command OK

