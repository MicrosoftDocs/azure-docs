---
title: Configure multiple NICs for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Configuration for attaching multiple network interfaces to Azure IoT Edge for Linux on Windows virtual machine
author: PatAltimore
ms.reviewer: fcabrera
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 7/22/2022
ms.author: patricka
---

# Azure IoT Edge for Linux on Windows virtual multiple NIC configurations

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

By default, the Azure IoT Edge for Linux on Windows (EFLOW) virtual machine has a single network interface card (NIC) assigned. However, you can configure the EFLOW VM with multiple network interfaces by using the EFLOW support for attaching multiple network interfaces to the virtual machine. This functionality may be helpful in numerous scenarios where you may have a networking division or separation into different networks or zones. In order to connect the EFLOW virtual machine to the different networks, you may need to attach different network interface cards to the EFLOW virtual machine. 

This article describes how to configure the Azure IoT Edge for Linux on Windows VM to support multiple NICs and connect to multiple networks. This process is divided into the following steps:

- Create and assign a virtual switch
- Create and assign a network endpoint
- Check the VM network configurations

For more information about networking concepts and configurations, see [Azure IoT Edge for Linux on Windows Networking](./iot-edge-for-linux-on-windows-networking.md) and [How to configure Azure IoT Edge for Linux on Windows networking](./how-to-configure-iot-edge-for-linux-on-windows-networking.md).

## Prerequisites
- A Windows device with EFLOW already set up. For more information on EFLOW installation and configuration, see [Create and provision an IoT Edge for Linux on Windows device using symmetric keys](./how-to-provision-single-device-linux-on-windows-symmetric.md).
- Virtual switch different from the default one used during EFLOW installation. For more information on creating a virtual switch, see [Create a virtual switch for Azure IoT Edge for Linux on Windows](./how-to-create-virtual-switch.md).

## Create and assign a virtual switch
During the EFLOW VM deployment, the VM had a switch assigned for all communications between the Windows host OS and the virtual machine. You always use the switch for VM lifecycle management communications, and it's not possible to delete it. 

The following steps in this section show how to assign a network interface to the EFLOW virtual machine. Ensure that the virtual switch and the networking configuration align with your networking environment. For more information about networking concepts like type of switches, DHCP and DNS, see [Azure IoT Edge for Linux on Windows networking](./iot-edge-for-linux-on-windows-networking.md).

1. Open an elevated _PowerShell_ session by starting with **Run as Administrator**.

1. Check that the virtual switch you assign to the EFLOW VM is available.
    ```powershell
    Get-VMSwitch -Name "{switchName}" -SwitchType {switchType}
    ```
1. Assign the virtual switch to the EFLOW VM.
    ```powershell
    Add-EflowNetwork -vSwitchName "{switchName}" -vSwitchType {switchType}
    ```
    For example, if you wanted to assign the external virtual switch named **OnlineExt**, you should use the following command
    ```powershell
    Add-EflowNetwork -vSwitchName "OnlineExt" -vSwitchType "External"
    ```
    :::image type="content" source="./media/how-to-configure-multiple-nics/ps-cmdlet-add-eflow-network.png" alt-text="EFLOW attach virtual switch":::

1. Check that you correctly assigned the virtual switch to the EFLOW VM.
    ```powershell
    Get-EflowNetwork -vSwitchName "{switchName}"
    ```

For more information about attaching a virtual switch to the EFLOW VM, see [PowerShell functions for Azure IoT Edge for Linux on Windows](./reference-iot-edge-for-linux-on-windows-functions.md).


## Create and assign a network endpoint
Once you successfully assign the virtual switch to the EFLOW VM, create a networking endpoint assigned to virtual switch to finalize the network interface creation. If you're using Static IP, ensure to use the appropriate parameters: _ip4Address_, _ip4GatewayAddress_ and _ip4PrefixLength_.

1. Open an elevated _PowerShell_ session by starting with **Run as Administrator**.

1. Create the EFLOW VM network endpoint

    - If you're using DHCP, you don't need Static IP parameters.
        ```powershell
        Add-EflowVmEndpoint -vSwitchName "{switchName}" -vEndpointName "{EndpointName}"
        ```

    - If you're using Static IP
        ```powershell
        Add-EflowVmEndpoint -vSwitchName "{switchName}" -vEndpointName "{EndpointName}" -ip4Address "{staticIp4Address}" -ip4GatewayAddress "{gatewayIp4Address}" -ip4PrefixLength "{prefixLength}"
        ```

        For example, if you wanted to create and assign the **OnlineEndpoint** endpoint with the external virtual switch named **OnlineExt**, and Static IP configurations (_ip4Address=192.168.0.103, ip4GatewayAddress=192.168.0.1, ip4PrefixLenght=24_) you should use the following command:
        ```powershell
        Add-EflowVmEndpoint -vSwitchName "OnlineExt" -vEndpointName "OnlineEndpoint" -ip4Address "192.168.0.103" -ip4GatewayAddress "192.168.0.1" -ip4PrefixLength "24"
        ```

        :::image type="content" source="./media/how-to-configure-multiple-nics/ps-cmdlet-add-eflow-endpoint.png" alt-text="EFLOW attach network endpoint":::

1. Check that you correctly created the network endpoint and assigned it to the EFLOW VM. You should see two network interfaces assigned to the virtual machine.
    ```powershell
    Get-EflowVmEndpoint
    ``` 
    :::image type="content" source="./media/how-to-configure-multiple-nics/ps-cmdlet-get-eflow-vm-endpoint.png" alt-text="EFLOW get attached network interfaces":::


For more information about creating and attaching a network endpoint to the EFLOW VM, see [PowerShell functions for Azure IoT Edge for Linux on Windows](./reference-iot-edge-for-linux-on-windows-functions.md).


## Check the VM network configurations
The final step is to make sure the networking configurations applied correctly and the EFLOW VM has the new network interface configured. The new interface shows up as _"eth1"_ if it's the first extra interface added to the VM. 

1. Open PowerShell in an elevated session. You can do so by opening the **Start** pane on Windows and typing in "PowerShell". Right-click the **Windows PowerShell** app that shows up and select **Run as administrator**.

1. Connect to the EFLOW VM.
     ```powershell
    Connect-EflowVm
    ``` 
1. Once inside the VM, check the network interfaces and their configurations using the _ifconfig_ command.
    ```bash
    ifconfig
    ``` 
    
    The default interface **eth0** is the one used for all the VM management. You should see another interface, like **eth1**, which is the new interface you assigned to the VM. Following the examples, if you previously assigned a new endpoint with the static IP 192.168.0.103 you should see the interface **eth1** with the _inet addr: 192.168.0.103_.

   :::image type="content" source="./media/how-to-configure-multiple-nics/ps-cmdlet-eflow-ifconfig.png" alt-text="Screenshot of EFLOW virtual machine network interfaces.":::

## Next steps
Follow the steps in [How to configure networking for Azure IoT Edge for Linux on Windows](./how-to-configure-iot-edge-for-linux-on-windows-networking.md) to make sure you applied all the networking configurations correctly.
