---
title: Create a new virtual switch in Azure Stack Edge via PowerShell
description: Describes how to create a virtual switch on an Azure Stack Edge device by using PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 09/08/2023
ms.author: alkohli
---

# Create a new virtual switch in Azure Stack Edge Pro GPU via PowerShell

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to create a new virtual switch on your Azure Stack Edge Pro GPU device. For example, you would create a new virtual switch if you want your virtual machines to connect through a different physical network port. For more information, see [Use the Azure portal to manage network interfaces on the VMs on your Azure Stack Edge Pro GPU](azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal.md).

## VM deployment workflow

1. Connect to the PowerShell interface on your device.
2. Query available physical network interfaces.
3. Create a virtual switch.
4. Verify the virtual network and subnet that are automatically created.

## Prerequisites

Before you begin, make sure that:

- You've access to a client machine that can access the PowerShell interface of your device. See [Connect to the PowerShell interface](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface). 

    The client machine should be running a [Supported OS](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device).

- Use the local UI to enable compute on one of the physical network interfaces on your device as per the instructions in [Enable compute network](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md#configure-virtual-switches) on your device. 


## Connect to the PowerShell interface

[Connect to the PowerShell interface of your device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

## Query available network interfaces

1. Use the following command to display a list of physical network interfaces on which you can create a new virtual switch. You will select one of these network interfaces.

    ```powershell
    Get-NetAdapter -Physical
    ```
    Here is an example output:
    
    ```output
        [10.100.10.10]: PS>Get-NetAdapter -Physical
        
        Name                      InterfaceDescription                    ifIndex Status       MacAddress       LinkSpeed
        ----                      --------------------                    ------- ------       ----------        -----
        Port2                     QLogic 2x1GE+2x25GE QL41234HMCU NIC ...      12 Up           34-80-0D-05-26-EA ...ps
        Ethernet                  Remote NDIS Compatible Device                11 Up           F4-02-70-CD-41-39 ...ps
        Port1                     QLogic 2x1GE+2x25GE QL41234HMCU NI...#3       9 Up           34-80-0D-05-26-EB ...ps
        Port5                     Mellanox ConnectX-4 Lx Ethernet Ad...#2       8 Up           0C-42-A1-C0-E3-99 ...ps
        Port3                     QLogic 2x1GE+2x25GE QL41234HMCU NI...#4       7 Up           34-80-0D-05-26-E9 ...ps
        Port6                     Mellanox ConnectX-4 Lx Ethernet Adapter       6 Up           0C-42-A1-C0-E3-98 ...ps
        Port4                     QLogic 2x1GE+2x25GE QL41234HMCU NI...#2       4 Up           34-80-0D-05-26-E8 ...ps
        
        [10.100.10.10]: PS>
    ```
2. Choose a network interface that is:

    - In the **Up** status. 
    - Not used by any existing virtual switches. Currently, only one virtual switch can be configured per network interface. 
    
    To check the existing virtual switch and network interface association, run the `Get-HcsExternalVirtualSwitch` command.
 
    Here is an example output.

    ```output
    [10.100.10.10]: PS>Get-HcsExternalVirtualSwitch

    Name                          : vSwitch1
    InterfaceAlias                : {Port2}
    EnableIov                     : True
    MacAddressPools               :
    IPAddressPools                : {}
    ConfigurationSource           : Dsc
    EnabledForCompute             : True
    SupportsAcceleratedNetworking : False
    DbeDhcpHostVnicName           : f4a92de8-26ed-4597-a141-cb233c2ba0aa
    Type                          : External
    
    [10.100.10.10]: PS>
    ```
    In this instance, Port 2 is associated with an existing virtual switch and shouldn't be used.

## Create a virtual switch

Use the following cmdlet to create a new virtual switch on your specified network interface. After this operation is complete, your compute instances can use the new virtual network.

```powershell
Add-HcsExternalVirtualSwitch -InterfaceAlias <Network interface name> -WaitForSwitchCreation $true
```

Use the `Get-HcsExternalVirtualSwitch` command to identify the newly created switch. The new switch that is created is named as `vswitch-<InterfaceAlias>`. 

Here is an example output:

```output
[1HXG613.microsoftdatabox.com]: PS>Get-HcsExternalVirtualSwitch

Name                          : vSwitch1
InterfaceAlias                : {Port2}
EnableIov                     : True
MacAddressPools               : {}
IPAddressPools                : {Name: 'KubernetesNodeIPs', AddressRange: '10.126.75.200-10.126.75.202', Name:
                                'KubernetesServiceIPs', AddressRange: '10.126.75.206-10.126.75.208'}
BGPPeers                      : {}
ConfigurationSource           : ClusterNetwork
EnabledForCompute             : True
EnabledForStorage             : False
EnabledForMgmt                : True
SupportsAcceleratedNetworking : False
DbeDhcpHostVnicName           : bc29af45-88b7-43af-ab27-78cc6427bc5f
VirtualNetworks               : {}
EnableEmbeddedTeaming         : True
InternalVnetName              :
Type                          : External
Mtu                           : 1500

Name                          : vSwitch2
InterfaceAlias                : {Port3, Port4}
EnableIov                     : True
MacAddressPools               : {}
IPAddressPools                : {}
BGPPeers                      : {}
ConfigurationSource           : ClusterNetwork
EnabledForCompute             : False
EnabledForStorage             : True
EnabledForMgmt                : False
SupportsAcceleratedNetworking : False
DbeDhcpHostVnicName           : 25c6bdc4-2991-41db-8757-1fb08a219ea7
VirtualNetworks               : {}
EnableEmbeddedTeaming         : True
InternalVnetName              :
Type                          : External
Mtu                           : 1500

Name                          : TestvSwitch
InterfaceAlias                : {Port5}
EnableIov                     : True
MacAddressPools               : {}
IPAddressPools                : {}
BGPPeers                      : {}
ConfigurationSource           : User
EnabledForCompute             : False
EnabledForStorage             : False
EnabledForMgmt                : False
SupportsAcceleratedNetworking : True
DbeDhcpHostVnicName           : ed7eb61d-7dd8-4648-bb8e-04fe5b0b6fd6
VirtualNetworks               : {Name: 'TestvSwitch-internal', AddressSpace: '192.0.2.0/24', SwitchName:
                                'TestvSwitch', GatewayIPAddress: '192.0.2.0/24', DnsServers: '192.0.2.0/24', VlanId:
                                '0'EnabledForK8s: FalseIPAddressPools:    VirtualMachineIPs , 192.0.2.0/24}
EnableEmbeddedTeaming         : False
InternalVnetName              : TestvSwitch-internal
Type                          : External
Mtu                           : 9000

[1HXG613.microsoftdatabox.com]: PS>
```

## Verify network, subnet for switch

After you have created the new virtual switch, Azure Stack Edge Pro GPU automatically creates a virtual network and subnet that corresponds to it. You can use this virtual network when creating VMs.

To identify the virtual network and the subnet associated with the new switch that you created, use the `Get-HcsVirtualNetwork` cmdlet. 

## Create virtual LANs

To add a virtual local area network (LAN) configuration on a virtual switch, use the following cmdlet.

```powershell
Add-HcsVirtualNetwork-VirtualSwitchName <Virtual Switch name> -Name <Virtual Network Name> –VlanId <Vlan Id> –AddressSpace <Address Space> –GatewayIPAddress <Gateway IP>–DnsServers <Dns Servers List> -DnsSuffix <Dns Suffix name>
``` 

The following parameters can be used with the `Add-HcsVirtualNetwork-VirtualSwitchName` cmdlet.


|Parameter  |Description  |
|---------|---------|
|Name     |Name for the virtual LAN network        |
|VirtualSwitchName    |Virtual switch name where you want to add the virtual LAN configuration         |
|AddressSpace     |Subnet address space for the virtual LAN network         |
|GatewayIPAddress     |Gateway for the virtual network         |
|DnsServers     |List of DNS Server IP addresses         |
|DnsSuffix     |DNS name without the host part for the virtual LAN network subnet         |
|VlanId        |VlanId can be set to 0 if you need an untagged network. If a tagged or trunk configuration is supported, specify a VlanID in the range 1-4094.            |

Here is an example output.

```output
PS C:\> Add-HcsVirtualNetwork -VirtualSwitchName vSwitch1 -Name vlanNetwork100 -VlanId 100 -AddressSpace 5.5.0.0/16 -GatewayIPAddress 5.5.0.1 -DnsServers "5.5.50.50,5.5.50.100" -DnsSuffix "name.domain.com"
PS C:\> Get-HcsVirtualNetwork 
Name             : vlanNetwork100
AddressSpace     : 5.5.0.0/16
SwitchName       : vSwitch1
GatewayIPAddress : 5.5.0.1
DnsServers       : {5.5.50.50, 5.5.50.100}
DnsSuffix        : name.domain.com
VlanId           : 100
MacAddressPools  :
IPAddressPools   : {}
BGPPeers         :
EnabledForK8s    : False
```

> [!NOTE]
> - You can configure multiple virtual LANs on the same virtual switch. 
> - The gateway IP address must in the same subnet as the parameter passed in as address space.
> -	You can't remove a virtual switch if there are virtual LANs configured. To delete this virtual switch, you first need to delete the virtual LAN and then delete the virtual switch.

## Verify network, subnet for virtual LAN

After you've created the virtual LAN, a virtual network and a corresponding subnet are automatically created. You can use this virtual network when creating VMs.

To identify the virtual network and the subnet associated with the new switch that you created, use the `Get-HcsVirtualNetwork` cmdlet.


## Next steps

- [Deploy VMs on your Azure Stack Edge Pro GPU device via Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md)

- [Deploy VMs on your Azure Stack Edge Pro GPU device via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)
