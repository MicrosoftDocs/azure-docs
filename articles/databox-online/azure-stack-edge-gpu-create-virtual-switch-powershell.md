---
title: Create a new virtual switch in Azure Stack Edge via PowerShell
description: Describes how to create a virtual switch on an Azure Stack Edge device by using PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 04/06/2021
ms.author: alkohli
---

# Create a new virtual switch in Azure Stack Edge Pro GPU via PowerShell

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to create a new virtual switch on your Azure Stack Edge Pro GPU device. For example, you would create a new virtual switch if you want your virtual machines to connect through a different physical network port.

## VM deployment workflow

1. Connect to the PowerShell interface on your device.
2. Query available physical network interfaces.
3. Create a virtual switch.
4. Verify the virtual network and subnet that are automatically created.

## Prerequisites

Before you begin, make sure that:

- You've access to a client machine that can access the PowerShell interface of your device. See [Connect to the PowerShell interface](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface). 

    The client machine should be running a [Supported OS](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device).

- Use the local UI to enable compute on one of the physical network interfaces on your device as per the instructions in [Enable compute network](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md#enable-compute-network) on your device. 


## Connect to the PowerShell interface

[Connect to the PowerShell interface of your device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

## Query available network interfaces

1. Use the following command to display a list of physical network interfaces on which you can create a new virtual switch. You will select one of these network interfaces.

    ```powershell
    Get-NetAdapter -Physical
    ```
    Here is an example output:
    
    ```powershell
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
    - Not used by any existing virtual switches. Currently, only one vswitch can be configured per network interface. 
    
    To check the existing virtual switch and network interface association, run the `Get-HcsExternalVirtualSwitch` command.
 
    Here is an example output.

    ```powershell
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

```powershell
[10.100.10.10]: P> Add-HcsExternalVirtualSwitch -InterfaceAlias Port5 -WaitForSwitchCreation $true
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

Name                          : vswitch-Port5
InterfaceAlias                : {Port5}
EnableIov                     : True
MacAddressPools               :
IPAddressPools                :
ConfigurationSource           : Dsc
EnabledForCompute             : False
SupportsAcceleratedNetworking : False
DbeDhcpHostVnicName           : 9b301c40-3daa-49bf-a20b-9f7889820129
Type                          : External

[10.100.10.10]: PS>
```

## Verify network, subnet 

After you have created the new virtual switch, Azure Stack Edge Pro GPU automatically creates a virtual network and subnet that corresponds to it. You can use this virtual network when creating VMs.

<!--To identify the virtual network and subnet associated with the new switch that you created, use the `Get-HcsVirtualNetwork` command. This cmdlet will be released in April some time. -->

## Next steps

- [Deploy VMs on your Azure Stack Edge Pro GPU device via Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md)

- [Deploy VMs on your Azure Stack Edge Pro GPU device via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)
