---
title: Troubleshoot networking - Azure IoT Edge for Linux on Windows | Microsoft Docs 
description: Use this article to learn standard networking diagnostic skills for Azure IoT Edge for Linux on Windows, like retrieving component status and logs
author: PatAltimore

ms.author: patricka
ms.date: 05/04/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Troubleshoot your IoT Edge for Linux on Windows networking

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

If you experience networking issues running Azure IoT Edge for Linux on Windows (EFLOW) in your environment, use this article as a guide for troubleshooting and diagnostics. Also, ensure to check [Troubleshoot your IoT Edge for Linux on Windows device](./troubleshoot-iot-edge-for-linux-on-windows.md) for more EFLOW virtual machine troubleshooting help. 

# Isolate the issue

Your first step when troubleshooting IoT Edge for Linux on Windows networking should be to understand which network component is causing the issue. The are three main components that could be causing issues:

- IP addresses configuration
- DNS
- Firewall

For more information about EFLOW networking concepts, see [IoT Edge for Linux on Windows networking](./iot-edge-for-linux-on-windows-networking.md). Also, for more information about EFLOW networking configurations, see [Networking configuration for Azure IoT Edge for Linux on Windows](./how-to-configure-iot-edge-for-linux-on-windows-networking.md).

## Check IP addresses

Your first step when troubleshooting IoT Edge for Linux on Windows networking should be to check the VM IP address configurations. If IP communication is misconfigured, then probably all inbound/outbound connections will fail. 

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the IP address returned by the VM lifecycle agent. Compare this IP address with the one obtained from inside the VM in the later steps.
    ```powershell
    Get-EflowVmAddr
    ```
1. Connect to the EFLOW virtual machine
    ```powershell
    Connect-EflowVm
    ```
1. Check the _eth0_ VM network interface configuration
   ```bash
    ifconfig eth0
    ```
   You should see the _eth0_ configuration and information. Ensure that the _inet_ address is correctly set. 
    ```
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.31.100.171  netmask 255.255.240.0  broadcast 172.31.111.255
        inet6 fe80::215:5dff:fe2a:2f62  prefixlen 64  scopeid 0x20<link>
        ether 00:15:5d:2a:2f:62  txqueuelen 1000  (Ethernet)
        RX packets 115746  bytes 11579209 (11.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 976  bytes 154184 (150.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    ```

If the IP address (_inet_) is blank or different from the one provided by using the `Get-EflowVmAddr` cmdlet, you need to troubleshoot why the EFLOW VM has an invalid or no IP address assigned.  

| Virtual Switch | IP Address Assignation | Troubleshoot | 
| ---------------| -----------------------|--------------|
| External | Static IP | Ensure that the IP configuration was correctly set up. All three parameters `ip4Address` `ip4GateWayAddress` and `ip4PrefixLength` should be used, and the IP address assigned to the VM should be valid and free on the external network. You can check EFLOW VM interface configurations by checking the files under `/etc/systemd/network/`. |
| External | DHCP | Ensure that there's a DHCP server on the external network. If no DHCP server is available, then use Static IP configurations. Also, make sure that DHCP server has no firewall policy regarding MAC addresses, and if it has, you can get the EFLOW MAC address by using the `Get-EflowVmAddr` cmdlet. | 
| Default Switch | DHCP | Generally the issue is related to a malfunction of the Default Switch. Try rebooting the Windows host OS. If the problem persists, try disabling and enabling Hyper-V | 
| Internal | Static IP | Ensure that the IP configuration was correctly set up. All three parameters `ip4Address` `ip4GateWayAddress` and `ip4PrefixLength` should be used, and the IP address assigned to the VM should be valid and free on the internal network. Also, to get connected to internet, you will need to set up a NAT table, so ensure to follow NAT configuration steps on [Azure IoT Edge for Linux on Windows virtual switch creation](./how-to-create-virtual-switch.md).|
| Internal | DHCP | Ensure that there's a DHCP server on the internal network. To set up a DHCP server and a NAT table on Windows Server, follow the steps on [Azure IoT Edge for Linux on Windows virtual switch creation](./how-to-create-virtual-switch.md). If no DHCP server is available, then use Static IP configurations.|

>[!WARNING]
> In some cases, if you are using External virtual switch on a Windows Server/Client VM, you may need some extra configurations. For more information about nested virtualization configurations, see [Nested virtualization for Azure IoT Edge for Linux on Windows](./nested-virtualization.md).

If you're still seeing issues with the IP address assignation, try setting up another Windows/Linux virtual machine and assign the same switch and IP configuration. If you face the same issue with the new non-EFLOW VM, then probably the issue it's on the virtual switch or IP configuration and it's not specific to EFLOW. 

## Check DNS

Your second step when troubleshooting IoT Edge for Linux on Windows networking should be to check the DNS servers assigned to the EFLOW VM. To check the EFLOW VM DNS configuration, see [Networking configuration for Azure IoT Edge for Linux on Windows](how-to-configure-iot-edge-for-linux-on-windows-networking.md). If address resolution is working, then your issue is probably related to firewall or security configurations on the network. 

The address resolution could fail for multiple reasons. First, the DNS servers could be configured correctly, however they cannot be reached from the EFLOW VM. If the DNS servers respond to ICMP ping traffic, you can try pinging the DNS Servers to check network connectivity. 

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Connect to the EFLOW virtual machine
    ```powershell
    Connect-EflowVm
    ```
1. Ping the DNS server address
   ```bash
   ping <DNS-Server-IP-Address>
    ```
   If the server is reachable, you should get a response and your issue may be related to other DNS server configurations. If there's no response, then you probably have a connection issue to the server.

Second, some networking environments will limit the access of the DNS servers to specific whitelisted addresses. If this is the case, first make sure that you can access the DNS server from the Windows host OS, and then check with your networking team if you need to whitelist the EFLOW IP address. 

Finally, some networking environment will block public DNS servers, like Google DNS (8.8.8.8 and 8.8.4.4). If this is the case, talk with your networking environment team to define a valid DNS server, and then set it up using the `Set-EflowVmDnsServers` cmdlet. 





## Check your firewall and port configuration rules

Azure IoT Edge allows communication from an on-premises server to Azure cloud using supported IoT Hub protocols, see [choosing a communication protocol](../iot-hub/iot-hub-devguide-protocols.md). For enhanced security, communication channels between Azure IoT Edge and Azure IoT Hub are always configured to be Outbound. This configuration is based on the [Services Assisted Communication pattern](/archive/blogs/clemensv/service-assisted-communication-for-connected-devices), which minimizes the attack surface for a malicious entity to explore. Inbound communication is only required for [specific scenarios](#anchortext) where Azure IoT Hub needs to push messages to the Azure IoT Edge device. Cloud-to-device messages are protected using secure TLS channels and can be further secured using X.509 certificates and TPM device modules. The Azure IoT Edge Security Manager governs how this communication can be established, see [IoT Edge Security Manager](../iot-edge/iot-edge-security-manager.md).

While IoT Edge provides enhanced configuration for securing Azure IoT Edge runtime and deployed modules, it is still dependent on the underlying machine and network configuration. Hence, it is imperative to ensure proper network and firewall rules are set up for secure edge to cloud communication. The following table can be used as a guideline when configuration firewall rules for the underlying servers where Azure IoT Edge runtime is hosted:

|Protocol|Port|Incoming|Outgoing|Guidance|
|--|--|--|--|--|
|MQTT|8883|BLOCKED (Default)|BLOCKED (Default)|<ul> <li>Configure Outgoing (Outbound) to be Open when using MQTT as the communication protocol.<li>1883 for MQTT is not supported by IoT Edge. <li>Incoming (Inbound) connections should be blocked.</ul>|
|AMQP|5671|BLOCKED (Default)|OPEN (Default)|<ul> <li>Default communication protocol for IoT Edge. <li> Must be configured to be Open if Azure IoT Edge is not configured for other supported protocols or AMQP is the desired communication protocol.<li>5672 for AMQP is not supported by IoT Edge.<li>Block this port when Azure IoT Edge uses a different IoT Hub supported protocol.<li>Incoming (Inbound) connections should be blocked.</ul></ul>|
|HTTPS|443|BLOCKED (Default)|OPEN (Default)|<ul> <li>Configure Outgoing (Outbound) to be Open on 443 for IoT Edge provisioning. This configuration is required when using manual scripts or Azure IoT Device Provisioning Service (DPS). <li><a id="anchortext">Incoming (Inbound) connection</a> should be Open only for specific scenarios: <ul> <li>  If you have a transparent gateway with leaf devices that may send method requests. In this case, Port 443 does not need to be open to external networks to connect to IoTHub or provide IoTHub services through Azure IoT Edge. Thus the incoming rule could be restricted to only open Incoming (Inbound) from the internal network. <li> For Client to Device (C2D) scenarios.</ul><li>80 for HTTP is not supported by IoT Edge.<li>If non-HTTP protocols (for example, AMQP or MQTT) cannot be configured in the enterprise; the messages can be sent over WebSockets. Port 443 will be used for WebSocket communication in that case.</ul>|


## Last resort: stop and recreate all containers

Sometimes, a system might require significant special modification to work with existing networking or operating system constraints. For example, a system could require a different data disk mount and proxy settings. If you tried all steps above and still get container failures, it's possible that somewhere the docker system caches or persisted network settings are not up to date with the latest reconfiguration. In this case, the last resort option is to use [`docker prune`](https://docs.docker.com/engine/reference/commandline/system_prune/) get a clean start from scratch. 



## Next steps

Do you think that you found a bug in the IoT Edge platform? [Submit an issue](https://github.com/Azure/iotedge/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
