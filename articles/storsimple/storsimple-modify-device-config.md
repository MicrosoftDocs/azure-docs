<properties 
   pageTitle="Modify the StorSimple device configuration | Microsoft Azure" 
   description="Describes how to use the StorSimple Manager service to reconfigure a StorSimple device that has already been deployed." 
   services="storsimple" 
   documentationCenter="NA" 
   authors="SharS" 
   manager="carolz" 
   editor=""/>

<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD" 
   ms.date="08/14/2015"
   ms.author="v-sharos@microsoft.com"/>

# Use the StorSimple Manager service to modify your StorSimple device configuration

## Overview 

The Management Portal **Configure** page contains all the device parameters that you can reconfigure on a StorSimple device that is managed by a StorSimple Manager service. This tutorial explains how you can use the **Configure** page to perform the following device-level tasks:

- Modify device settings 
- Modify time settings 
- Modify DNS settings 
- Modify network interfaces
- Swap or reassign IPs

## Modify device settings

The device settings include the friendly name of the device and the device description.

A StorSimple device that is connected to the StorSimple Manager service is assigned a default name. The default name typically reflects the serial number of the device. For example, a default device name that is 15 characters long, such as 8600-SHX0991003G44HT, indicates the following:

- **8600**  – Indicates the device model.
- **SHX** – Indicates the manufacturing site.
- **0991003** - Indicates a specific product.
- **G44HT**- The last 5 digits are incremented to create unique serial numbers. This might not be a sequential set.

You can use the Management Portal to change the device name and assign it a unique friendly name of your choice. The friendly name can contain any characters and can be a maximum of 64 characters long.

You can also specify a device description. A device description usually helps identify the owner and the physical location of the device. The description field must contain fewer than 256 characters.
 
## Modify time settings

Your device must synchronize time in order to authenticate with your cloud storage service provider. Select your time zone from the drop-down list, and specify up to two Network Time Protocol (NTP) servers. The primary NTP server is required and is specified when you use Windows PowerShell for StorSimple to configure your device. You can specify the default Windows Server **time.windows.com** as your NTP server. You can view the primary NTP server configuration through the Management Portal, but you must use the Windows PowerShell interface to change it.

The secondary NTP server configuration is optional. You can use the Management Portal to configure a secondary NTP server. 

When configuring the NTP server, ensure that your network allows the NTP traffic to pass from your datacenter to the Internet. When specifying a public NTP server, you must make sure that your network firewalls and other security devices are configured to allow NTP traffic to travel to and from the outside network. If bidirectional NTP traffic is not permitted, you must use an internal NTP server (a Windows domain controller provides this function). If your device cannot synchronize time, it may not be able to communicate with your cloud storage provider.

To see a list of public NTP servers, go to the [NTP Servers Web](http://support.ntp.org/bin/view/Servers/WebHome). 

### What happens if the device is deployed in a different time zone?

If the device is deployed in a different time zone, the device time zone will change. Given that all the backup policies use the device time zone, the backup policies will automatically adjust in accordance with the new time zone. No user intervention is required.

## Modify DNS settings

A DNS server is used when your device attempts to communicate with your cloud storage service provider. For high availability, you are required to configure both the primary and the secondary DNS servers during the initial device deployment. To reconfigure the primary DNS server, you will need to use the Windows PowerShell interface on your StorSimple device.

To modify the secondary DNS server, you can use the Management Portal.

<!-- If a secondary DNS server is not configured, you will not be able to create volume containers or provision volumes on the device.-->

## Modify network interfaces

Your device has six device network interfaces, four of which are 1 GbE and two of which are 10 GbE. These interfaces are labeled as DATA 0 – DATA 5. DATA 0, DATA 1, DATA 4, and DATA 5 are 1 GbE, whereas DATA 2 and DATA 3 are 10 GbE network interfaces.

Configure **Network Interface Settings** for each of the interfaces to be used. To ensure high availability, we recommend that you have at least two iSCSI interfaces and two cloud-enabled interfaces on your device. We recommend but do not require that unused interfaces be disabled.

When you configure any of the network interfaces, you must configure a virtual IP (VIP).

DATA 0 is cloud-enabled by default. When configuring DATA 0, you are also required to configure two fixed IP addresses, one for each controller. These fixed IP addresses can be used to access the device controllers directly and are useful when you install updates on the device or when you access the controllers for the purpose of troubleshooting.

In StorSimple 8000 Series Update 1, the routing metric of DATA 0 is set to the lowest; therefore, if your device is running StorSimple 8000 Series Update 1, all the cloud traffic will be routed through DATA 0. Make a note of this if you have more than one cloud-enabled network interface on your StorSimple device.

>[AZURE.NOTE] The fixed IP addresses for the controller are used for servicing the updates to the device. Therefore, the fixed IPs must be routable and able to connect to the Internet.

For each network interface, the following parameters are displayed:

- **Speed** – Not a user-configurable parameter. DATA 0, DATA 1, DATA 4, and DATA 5 are always 1 GbE, whereas DATA 2 and DATA 3 are 10 GbE interfaces.

     >[AZURE.NOTE] Speed and duplex are always auto-negotiated. Jumbo frames are not supported.
 
- **Interface state** – An interface can be enabled or disabled. If enabled, the device will attempt to use the interface. We recommend that only those interfaces that are connected to the network and used be enabled. Disable any interfaces that you are not using.

- **Interface type** – This parameter allows you to isolate iSCSI traffic from cloud storage traffic. This parameter can be one of the following:

    - **Cloud enabled** – when enabled, the device will use this interface to communicate with the cloud.
    - **iSCSI enabled** – when enabled, the device will use this interface to communicate with the iSCSI host.

    We recommend that you isolate iSCSI traffic from cloud storage traffic. Also note if your host is within the same subnet as your device, you do not need to assign a gateway; however, if your host is in a different subnet than your device, you will need to assign a gateway.

- **IP address** – This can be IPv4 or IPv6 or both. Both the IPv4 and IPv6 address families are supported for the device network interfaces. When using IPv4, specify a 32-bit IP address (*xxx.xxx.xxx.xxx*) in dot-decimal notation. When using IPv6, simply supply a 4-digit prefix, and a 128-bit address will be generated automatically for your device network interface based on that prefix.

- **Subnet** – This refers to the subnet mask and is configured via the Windows PowerShell interface.

- **Gateway** – This is the default gateway that should be used by this interface when it attempts to communicate with nodes that are not within the same IP address space (subnet). The default gateway must be in the same address space (subnet) as the interface IP address, as determined by the subnet mask.

- **Fixed IP address** – This field is available only while you configure the DATA 0 interface. For operations such as updates or troubleshooting the device, you may need to connect directly to the device controller. The fixed IP address can be used to access both the active and the passive controller on your device.

You can reconfigure Controller 0 and Controller 1 through the Management Portal.

>[AZURE.NOTE] 
>
>- To ensure proper operation, verify the interface speed and duplex on the switch that each device interface is connected to. Switch interfaces should either negotiate with or be configured for Gigabit Ethernet (1000 Mbps) and be full-duplex. Interfaces operating at slower speeds or in half-duplex will result in performance issues.
>
>- To minimize disruptions and downtime, we recommend that you enable portfast on each of the switch ports that the iSCSI network interface of your device will be connecting to. This will ensure that network connectivity can be established quickly in the event of a failover.
 
## Swap or reassign IPs

Currently, if any network interface on the controller is assigned a VIP that is in use (by the same device or another device in the network), then the controller will fail over. Therefore, you have to follow the proper procedure if you are swapping VIPs for the device network interface, because you will create a duplicate IP situation.

Perform the following steps to swap or reassign the VIPs for any of the network interfaces:

#### To reassign IPs

1. Clear the IP address for both interfaces.

2. After the IP addresses are cleared, assign the new IP addresses to the respective interfaces.

## Next steps

[Configure MPIO for your StorSimple device](storsimple-configure-mpio-windows-server.md).
 
     