---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 03/05/2019
ms.author: alkohli
---

If you boot up in a non-DHCP environment, follow these steps to deploy the virtual machine for your Data Box Gateway.

1. [Connect to the Windows PowerShell interface of the device](#connect-to-the-powershell-interface).
2. Use the `Get-HcsIpAddress` cmdlet to list the network interfaces enabled on your virtual device. If your device has a single network interface enabled, the default name assigned to this interface is `Ethernet`.

    The following example shows the usage of this cmdlet:

    ```
    [10.100.10.10]: PS>Get-HcsIpAddress

    OperationalStatus : Up
    Name              : Ethernet
    UseDhcp           : True
    IpAddress         : 10.100.10.10
    Gateway           : 10.100.10.1
    ```

3. Use the `Set-HcsIpAddress` cmdlet to configure the network. See the following example:

    ```
    Set-HcsIpAddress –Name Ethernet –IpAddress 10.161.22.90 –Netmask 255.255.255.0 –Gateway 10.161.22.1
    ```

