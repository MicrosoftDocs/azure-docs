---
title: Networking for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to configure custom networking for Azure IoT Edge for Linux on Windows virtual machine.
author: PatAltimore
manager: kgremban
ms.author: fcabrera
ms.date: 10/21/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Networking configuration for Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article helps you decide which networking option is best for your scenario and provide insights into IoT Edge for Linux on Windows (EFLOW) configuration requirements.

To connect the IoT Edge for Linux on Windows (EFLOW) virtual machine over a network to your host, to other virtual machines on your Windows host, and to other devices/locations on an external network, the virtual machine networking must be configured accordingly. 

The easiest way to establish basic networking on Windows Client SKUs is by using the **default switch**, which is already created when enabling the Windows Hyper-V feature. However, on Windows Server SKUs devices, networking it's a bit more complicated as there's no **default switch** available. For more information about virtual switch creation for Windows Server, see [Create virtual switch for Linux on Windows](./how-to-create-virtual-switch.md). 

For more information about EFLOW networking concepts, see [IoT Edge for Linux on Windows networking](./iot-edge-for-linux-on-windows-networking.md). 

## Configure VM virtual switch

The first step before deploying the EFLOW virtual machine is to determine which type of virtual switch you use. For more information about EFLOW supported virtual switches, see [EFLOW virtual switch choices](./iot-edge-for-linux-on-windows-networking.md). Once you determine the type of virtual switch that you want to use, make sure to create the virtual switch correctly. For more information about virtual switch creation, see [Create a virtual switch for Hyper-V virtual machines](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines).

>[!NOTE]
> If you're using Windows client and you want to use the **default switch**, then no switch creation is needed and no `-vSwitchType` and `-vSwitchName` parameters are needed. 

>[!NOTE]
> If you're using a Windows virtual machine inside VMware infrastructure and **external switch**, please see [EFLOW nested virtualization](./nested-virtualization.md). 

After creating the virtual switch and before starting your deployment, make sure that your virtual switch name and type is correctly set up and is listed under the Windows host OS. To list all the virtual switches in your Windows host OS, in an elevated PowerShell session, use the following PowerShell cmdlet:

```powershell
Get-VmSwitch
```
Depending on the virtual switches of the Windows host, the output should be similar to the following:

```Output
Name           SwitchType NetAdapterInterfaceDescription
----           ---------- ------------------------------
Default Switch Internal
IntOff         Internal
EFLOW-Ext      External
```

To use a specific virtual switch(**internal** or **external**), make sure you specify the correct parameters: `-vSwitchName` and `vSwitchType`. For example, if you want to deploy the EFLOW VM with an **external switch** named **EFLOW-Ext**, then in an elevated PowerShell session use the following command:

```powershell
Deploy-Eflow -vSwitchType "External" -vSwitchName "EFLOW-Ext"
```


## Configure VM IP address allocation

The second step after deciding the type of virtual switch you're using is to determine the type of IP address allocation of the virtual switch. For more information about IP allocation options, see [EFLOW supported IP allocations](./iot-edge-for-linux-on-windows-networking.md). Depending on the type of virtual switch you're using, make sure to use a supported IP address allocation mechanism.

By default, if no **static IP** address is set up, the EFLOW VM tries to allocate an IP address to the virtual switch using **DHCP**. Make sure that there's a DHCP server on the virtual switch network; if not available, the EFLOW VM installation fails to allocate an IP address and installation fails. If you're using the **default switch**, then there's no need to check for a DHCP server, as the virtual switch already has DHCP by default. However, if using an **internal** or **external** virtual switch, you can check using the following steps:

1. Open a command prompt.
1. Display all the IP configurations and information
    ```cmd
    ipconfig /all
    ```
1. If you're using an **external** virtual switch, check the network interface used for creating the virtual switch. If you're using an **internal** virtual switch, just look for the name used for the switch. Once the switch is located, check if `DHCP Enabled` says **Yes** or **No**, and check the `DHCP server` address. 

If you're using a **static IP**, you have to specify three parameters during EFLOW deployment: `-ip4Address`, `ip4GatewayAddress` and `ip4PrefixLength`. If one parameter is missing or incorrect, the EFLOW VM installation fails to allocate an IP address and installation fails. For more information about EFLOW VM deployment, see [PowerShell functions for IoT Edge for Linux on Windows](./reference-iot-edge-for-linux-on-windows-functions.md#deploy-eflow). For example, if you want to deploy the EFLOW VM with an **external switch** named **EFLOW-Ext**, and a static IP configuration, with an IP address equal to **192.168.0.2**, gateway IP address equal to **192.168.0.1** and IP prefix length equal to **24**, then in an elevated PowerShell session use the following command:

```powershell
Deploy-Eflow -vSwitchType "External" -vSwitchName "EFLOW-Ext" -ip4Address "192.168.0.2" -ip4GatewayAddress "192.168.0.1" -ip4PrefixLength "24"
```

>[!TIP]
> The EFLOW VM will keep the same MAC address for the main (used during deployment) virtual switch across reboots. If you are using DHCP MAC address reservation, you can get the main virtual switch MAC address using the PowerShell cmdlet: `Get-EflowVmAddr`.

### Check IP allocation
There are multiple ways to check the IP address that was allocated to the EFLOW VM. First, using an elevated PowerShell session, use the EFLOW cmdlet:

```bash
Get-EflowVmAddr
```
The output should be something similar to the following:

```Output
C:\> Get-EflowVmAddr

[03/31/2022 12:54:31] Querying IP and MAC addresses from virtual machine (DESKTOP-EFLOW)

 - Virtual machine MAC: 00:15:5d:4e:15:2c
 - Virtual machine IP : 172.27.120.111 retrieved directly from virtual machine
00:15:5d:4e:15:2c
172.27.120.111
``` 

Another way, is using the `Connect-Eflow` cmdlet to remote into the VM, and then you can use the `ifconfig eth0` bash command, and check for the *eth0* interface. The output should be similar to the following:

```Output
eth0      Link encap:Ethernet  HWaddr 00:15:5d:4e:15:2c
          inet addr:172.27.120.111  Bcast:172.27.127.255  Mask:255.255.240.0
          inet6 addr: fe80::215:5dff:fe4e:152c/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:5636 errors:0 dropped:0 overruns:0 frame:0
          TX packets:2214 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:766832 (766.8 KB)  TX bytes:427274 (427.2 KB)
```

## Configure VM DNS servers

By default, the EFLOW virtual machine has no DNS configuration. Deployments using **DHCP** tries to obtain the DNS configuration propagated by the DHCP server. If you're using a **static IP**, the DNS server needs to be set up manually. For more information about EFLOW VM DNS, see [EFLOW DNS configuration](./iot-edge-for-linux-on-windows-networking.md).

To check the DNS servers used by the default interface (*eth0*), you can use the following command:

```bash
resolvectl | grep eth0 -A 8
```

The output should be something similar to the following. Check the IP addresses of the "Current DNS Servers" and "DNS Servers" fields of the list. If there's no IP address, or the IP address isn't a valid DNS server IP address, then the DNS service won't work.

```Output
Link 2 (eth0)
      Current Scopes: DNS
       LLMNR setting: yes
MulticastDNS setting: no
  DNSOverTLS setting: no
      DNSSEC setting: no
    DNSSEC supported: no
  Current DNS Server: 172.27.112.1
         DNS Servers: 172.27.112.1
```

If you need to manually set up the DNS server addresses, you can use the EFLOW PowerShell cmdlet `Set-EflowVmDNSServers`. For more information about EFLOW VM DNS configuration, see [PowerShell functions for IoT Edge for Linux on Windows](./reference-iot-edge-for-linux-on-windows-functions.md#set-eflowvmdnsservers). 

### Check DNS resolution
There are multiple ways to check the DNS resolution. 

First, from inside the EFLOW VM, use the `resolvectl query` command to query a specific URL. For example, to check if the name resolution is working for the address _microsoft.com_, use:

```bash
resolvectl query microsoft.com
```
The output should be similar to the following:

```output
PS C:\> resolvectl query
microsoft.com: 40.112.72.205
               40.113.200.201
               13.77.161.179
               104.215.148.63
               40.76.4.15

-- Information acquired via protocol DNS in 1.9ms.
-- Data is authenticated: no
```

You can also use the `dig` command to query a specific URL. For example, to check if the name resolution is working for the address _microsoft.com_, use:

```bash
dig microsoft.com
```
The output should be similar to the following:

```Output
PS C:\> dig microsoft.com
; <<>> DiG 9.16.22 <<>> microsoft.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 36427
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;microsoft.com.                 IN      A

;; ANSWER SECTION:
microsoft.com.          0       IN      A       40.112.72.205
microsoft.com.          0       IN      A       40.113.200.201
microsoft.com.          0       IN      A       13.77.161.179
microsoft.com.          0       IN      A       104.215.148.63
microsoft.com.          0       IN      A       40.76.4.15

;; Query time: 11 msec
;; SERVER: 127.0
```

## Next steps

Read more about [Azure IoT Edge for Linux on Windows Security](./iot-edge-for-linux-on-windows-security.md).

Stay up-to-date with the latest [IoT Edge for Linux on Windows updates](./iot-edge-for-linux-on-windows-updates.md).
