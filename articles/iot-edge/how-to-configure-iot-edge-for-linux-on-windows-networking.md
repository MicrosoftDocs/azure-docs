---
title: Networking for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to configure custom networking for Azure IoT Edge for Linux on Windows virtual machine.
author: PatAltimore
manager: kgremban
ms.author: fcabrera
ms.date: 03/21/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Networking configuration for Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

To connect the IoT Edge for Linux on Windows (EFLOW) virtual machine to connect over a network to your host, to other virtual machines on your host, and to other devices/locations on an external network, the virtual machine networking must be configured accordingly. 

The easiest way to establish basic networking on Windows Client SKUs is by using the **Default Switch**, which is already created by the Hyper-V feature. However, on Windows Server SKUs devices, networking it's a bit more complicated as there's no Default Switch available.  

For more information about EFLOW networking concepts, see [IoT Edge for Linux on Windows networking](./nested-virtualization.md). 

This article will provide users clarity on which networking option is best for their scenario and provide insight into configuration requirements.

## Configure VM virtual switch

The first step before deploying the EFLOW virtual machine, is to determine which type of virtual switch will be used. For more information about supported virtual switch, see [EFLOW virtual switch choices](./nested-virtualization.md).  Once you determine the type of virtual switch that you want to use, make sure to create the virtual switch correctly. For more information about virtual switch creation, see [Create a virtual switch for Hyper-V virtual machines](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines).

>[!WARNING]
> Windows Server does not come with a **default switch**. Before you can deploy EFLOW to a Windows Server device, you need to create a virtual switch, with DHCP server and NAT table. For more information, see [Create virtual switch for Linux on Windows](./how-to-create-virtual-switch.md).

If you aren't using the **default switch** and you want to set up the EFLOW VM with your custom virtual switch, make sure you specify the correct parameters: `-vSwitchName` and `vSwitchType`. For example, if you want to deploy the EFLOW VM with an **external switch** named **EFLOW-Ext**, then you should use the following command:

```powershell
Deploy-EflowVm -vSwitchType "External" -vSwitchName "EFLOW-Ext"
```


## Configure IP address allocation

The second step after deciding the type of virtual switch to be used, is to determine the type of IP address allocation of the virtual switch. For more information about IP allocation options, see [EFLOW supported IP allocations](./nested-virtualization.md). Depending on the type of virtual switch used, make sure to use 

By default, if no **Static IP** address is set up, the EFLOW VM will try to allocate an IP address to the virtual switch using **DHCP**. Make sure that there's a DHCP server on the virtual switch network; if not available, the EFLOW VM installation will fail to allocate an IP address and installation will fail. If you're using **default switch**, then there's no need to check, as the virtual switch already has DHCP by default. However, if using **internal** or **external** virtual switch, you can check using the following steps:

1. Open a command prompt.
1. Display all the IP configurations and information
    ```cmd
    ipconfig /all
    ```
1. If you are using an **external** virtual switch, check the network interface used for creating the virtual switch. If you are using **internal** virtual swich, just look for the name used for the switch. Once the switch is located, check if `DHCP Enabled` say **Yes** or **No**, and check the `DCHP Server` address. 


If you are using **Static IP**, you'll have to specify three parameters during EFLOW deployment: `-ip4Address`, `ip4GatewayAddress` and `ip4PrefixLength`. If one parameter is missing or incorrect, the EFLOW VM installation will fail to allocate an IP address and installation will fail. For example,  if you want to deploy the EFLOW VM with an **external switch** named **EFLOW-Ext**, and a static IP configuration, with an IP address equal to **192.168.0.2**, gateway IP address equal to **192.168.0.1** and IP prefix length equal to **24**, then you should use the following command:

```powershell
Deploy-EflowVm -vSwitchType "External" -vSwitchName "EFLOW-Ext" -ip4Address "192.168.0.2" -ip4GatewayAddress "192.168.0.1" -ip4PrefixLength "24"
```

>[!TIP]
> The EFLOW VM will keep the same MAC address for the main (used during deployment) virtual switch across reboots. If you are using DHCP MAC address reservation, you can get the main virtual switch MAC address using the PowerShell cmdlet: `Get-EflowVmAddr`.


## Configure DNS servers




## Next steps
