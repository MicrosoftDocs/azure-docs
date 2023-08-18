---
title: Troubleshoot your IoT Edge for Linux on Windows networking | Microsoft Docs 
description: Learn about troubleshooting and diagnostics for Azure IoT Edge for Linux on Windows (EFLOW), like retrieving component status and logs.
author: PatAltimore

ms.author: fcabrera
ms.date: 11/15/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Troubleshoot your IoT Edge for Linux on Windows networking

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

If you experience networking issues using Azure IoT Edge for Linux on Windows (EFLOW) in your environment, use this article as a guide for troubleshooting and diagnostics. Also, check [Troubleshoot your IoT Edge for Linux on Windows device](./troubleshoot-iot-edge-for-linux-on-windows.md) for more EFLOW virtual machine troubleshooting help.

## Isolate the issue

When troubleshooting IoT Edge for Linux on Windows networking, there are four network features that could be causing issues:

- IP addresses configuration
- Domain Name System (DNS) configuration
- Firewall and port configurations
- Other components

For more information about EFLOW networking concepts, see [IoT Edge for Linux on Windows networking](./iot-edge-for-linux-on-windows-networking.md). Also, for more information about EFLOW networking configurations, see [Networking configuration for Azure IoT Edge for Linux on Windows](./how-to-configure-iot-edge-for-linux-on-windows-networking.md).

## Check IP addresses

Your first step when troubleshooting IoT Edge for Linux on Windows networking should be to check the VM IP address configurations. If IP communication is misconfigured, then all inbound and outbound connections will fail.

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the IP address returned by the VM lifecycle agent. Make note of the IP address and compare it with the one obtained from inside the VM in the later steps.
    ```powershell
    Get-EflowVmAddr
    ```
1. Connect to the EFLOW virtual machine.
    ```powershell
    Connect-EflowVm
    ```
1. Check the _eth0_ VM network interface configuration.
   ```bash
    ifconfig eth0
    ```
   In the output, you should see the _eth0_ configuration information. Ensure that the _inet_ address is correctly set. 
    ```Output
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.31.100.171  netmask 255.255.240.0  broadcast 172.31.111.255
        inet6 fe80::215:5dff:fe2a:2f62  prefixlen 64  scopeid 0x20<link>
        ether 00:15:5d:2a:2f:62  txqueuelen 1000  (Ethernet)
        RX packets 115746  bytes 11579209 (11.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 976  bytes 154184 (150.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    ```

If the _inet_ IP address is blank or different from the one provided by using the `Get-EflowVmAddr` cmdlet, you need to troubleshoot why the EFLOW VM has an invalid or no IP address assigned. Use the following table to troubleshoot the issue:

| Virtual Switch | IP Address Assignation | Troubleshoot | 
| ---------------| -----------------------|--------------|
| External | Static IP | Ensure that the IP configuration is correctly set up. All three parameters *ip4Address*, *ip4GateWayAddress*, and *ip4PrefixLength* should be used. The IP address assigned to the VM should be valid and not being used by other device on the external network. You can check EFLOW VM interface configurations by checking the files under `/etc/systemd/network/`. |
| External | DHCP | Ensure that there's a DHCP server on the external network. If no DHCP server is available, then use static IP configurations. Also, make sure that DHCP server has no firewall policy regarding MAC addresses. If it has, you can get the EFLOW MAC address by using the `Get-EflowVmAddr` cmdlet. | 
| Default switch | DHCP | Generally, the issue is related to a malfunction of the default switch. Try rebooting the Windows host OS. If the problem persists, try disabling and enabling Hyper-V | 
| Internal | Static IP | Ensure that the IP configuration is correctly set up. All three parameters *ip4Address*, *ip4GateWayAddress*, and *ip4PrefixLength* should be used. The IP address assigned to the VM should be valid and not being used by other device on the internal network. Also, to get connected to internet, you'll need to set up a NAT table. Follow the NAT configuration steps in [Azure IoT Edge for Linux on Windows virtual switch creation](./how-to-create-virtual-switch.md).|
| Internal | DHCP | Ensure that there's a DHCP server on the internal network. To set up a DHCP server and a NAT table on Windows Server, follow the steps in [Azure IoT Edge for Linux on Windows virtual switch creation](./how-to-create-virtual-switch.md). If no DHCP server is available, then use static IP configurations.|

>[!WARNING]
> In some cases, if you are using the external virtual switch on a Windows Server or client VM, you may need some extra configurations. For more information about nested virtualization configurations, see [Nested virtualization for Azure IoT Edge for Linux on Windows](./nested-virtualization.md).

If you're still having issues with the IP address assignation, try setting up another Windows or Linux virtual machine and assign the same switch and IP configuration. If you have the same issue with the new non-EFLOW VM, the issue is likely with the virtual switch or IP configuration and it's not specific to EFLOW. 

## Check Domain Name System (DNS) configuration

Your second step when troubleshooting IoT Edge for Linux on Windows networking should be to check the DNS servers assigned to the EFLOW VM. To check the EFLOW VM DNS configuration, see [Networking configuration for Azure IoT Edge for Linux on Windows](how-to-configure-iot-edge-for-linux-on-windows-networking.md). If address resolution is working, then the issue is likely related to firewall or security configurations on the network. 

The EFLOW VM uses the _systemd-resolved_ service to manage the DNS resolution. For more information about this service, see [Systemd-resolved](https://wiki.archlinux.org/title/Systemd-resolved). To set up a specific DNS server address, you can use the `Set-EflowVmDnsServers` cmdlet. If you need further information about the DNS configuration, you can check the _/etc/systemd/resolved.conf_ and the _system-resolved_ service using the `sudo systemctl status systemd-resolved` command. Also, you can set a specific DNS server as part of the module configuration, see [Option 2: Set DNS server in IoT Edge deployment per module](troubleshoot-common-errors.md).

The address resolution could fail for multiple reasons. First, the DNS servers could be configured correctly, however they can't be reached from the EFLOW VM. If the DNS servers respond to ICMP ping traffic, you can try pinging the DNS servers to check network connectivity. 

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Connect to the EFLOW virtual machine.
    ```powershell
    Connect-EflowVm
    ```
1. Ping the DNS server address and check the response.
   ```bash
   ping <DNS-Server-IP-Address>
    ```
   >[!TIP]
   > If the server is reachable, you should get a response, and your issue may be related to other DNS server configurations. If there's no response, then you probably have a connection issue to the server.

Second, some network environments will limit the access of the DNS servers to specific allowlist addresses. If so, first make sure that you can access the DNS server from the Windows host OS, and then check with your networking team if you need to add the EFLOW IP address to an allowlist. 

Finally, some network environment will block public DNS servers, like Google DNS (_8.8.8.8_ and _8.8.4.4_). If so, talk with your network environment team to define a valid DNS server, and then set it up using the `Set-EflowVmDnsServers` cmdlet. 

## Check your firewall and port configuration rules

Azure IoT Edge for Linux on Windows allows communication from an on-premises server to Azure cloud using supported Azure IoT Hub protocols. For more information about IoT Hub protocols,  see [choosing a communication protocol](../iot-hub/iot-hub-devguide-protocols.md). For more information about IoT Hub firewall and port configurations, see [Troubleshoot your IoT Edge device](troubleshoot.md).

The IoT Edge for Linux on Windows is still dependent on the underlying Windows host OS and the network configuration. Hence, it's imperative to ensure proper network and firewall rules are set up for secure edge to cloud communication. The following table can be used as a guideline when configuration firewall rules for the underlying servers where Azure IoT Edge for Linux on Windows runtime is hosted:

|Protocol|Port|Incoming|Outgoing|Guidance|
|--|--|--|--|--|
|MQTT|8883|BLOCKED (Default)|BLOCKED (Default)| Configure *Outgoing (Outbound)* to be *Open* when using MQTT as the communication protocol. <br><br> 1883 for MQTT isn't supported by IoT Edge. - Incoming (Inbound) connections should be blocked.|
|AMQP|5671|BLOCKED (Default)|OPEN (Default)| Default communication protocol for IoT Edge. <br><br> Must be configured to be *Open* if Azure IoT Edge isn't configured for other supported protocols or AMQP is the desired communication protocol. <br><br>5672 for AMQP isn't supported by IoT Edge.<br><br>Block this port when Azure IoT Edge uses a different IoT Hub supported protocol.<br><br>Incoming (Inbound) connections should be blocked.|
|HTTPS|443|BLOCKED (Default)|OPEN (Default)|Configure *Outgoing (Outbound)* to be *Open* on port 443 for IoT Edge provisioning. This configuration is required when using manual scripts or Azure IoT Device Provisioning Service (DPS). <br><br><a id="anchortext">*Incoming (Inbound)* connection</a> should be *Open* only for two specific scenarios: <br>1. If you have a transparent gateway with downstream devices that may send method requests. In this case, port 443 doesn't need to be open to external networks to connect to IoT Hub or provide IoT Hub services through Azure IoT Edge. Thus the incoming rule could be restricted to only open *Incoming (Inbound)* from the internal network.<br>2. For *client to device (C2D)* scenarios.<br><br>80 for HTTP isn't supported by IoT Edge.<br><br>If non-HTTP protocols (for example, AMQP or MQTT) can't be configured in the enterprise; the messages can be sent over WebSockets. Port 443 will be used for WebSocket communication in that case.|

>[!NOTE]
> If you are using an external virtual switch, make sure to add the appropriate firewall rules for the module port mappings you're using inside the EFLOW virtual machine. 

For more information about EFLOW VM firewall, see [IoT Edge for Linux on Windows Security](./iot-edge-for-linux-on-windows-security.md). To check the EFLOW virtual machine rules, use the following steps:

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Connect to the EFLOW virtual machine.
    ```powershell
    Connect-EflowVm
    ```
1. List the [iptables](https://linux.die.net/man/8/iptables) firewall rules.
    ```powershell
    sudo iptables -L
    ```

To add a firewall rule to the EFLOW VM, you can use the [EFLOW Util - Firewall Rules](https://github.com/Azure/iotedge-eflow/tree/main/eflow-util#get-eflowvmfirewallrules) sample PowerShell cmdlets. Also, you can achieve the same rules creation by following these steps:

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Connect to the EFLOW virtual machine
    ```powershell
    Connect-EflowVm
    ```
1. Add a firewall rule to accept incoming traffic to _\<port\>_ of _\<protocol\>_ ( _udp_ or _tcp_) traffic. 
    ```powershell
    sudo iptables -A INPUT -p <protocol> --dport <port> -j ACCEPT
    ```
1. Finally, persist the rules so that they're recreated on every VM boot
    ```powershell
    sudo iptables-save | sudo tee /etc/systemd/scripts/ip4save
    ```

## Check other configurations

There are multiple other reasons why network communication could fail. The following section will just list a couple of issues that users have encountered in the past.

- **EFLOW virtual machine won't respond to ping (ICMP traffic) requests.**
    
    By default ICMP ping traffic response is disabled on the EFLOW VM firewall. To respond to ping requests, allow the ICMP traffic by using the following PowerShell cmdlet:

    `Invoke-EflowVmCommand "sudo iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT"`

- **Failed device discovery using multicast traffic.**
    
    First, to allow device discovery via multicast, the Hyper-V VM must be configured to use an external switch. Second, the IoT Edge custom module must be configured to use the host network via the container create options:
    
    ```json
    {
      "HostConfig": {
        "NetworkMode": "host"
      },
      "NetworkingConfig": {
        "EndpointsConfig": {
          "host": {}
        }
      }
    }
    ```
- **Firewall rules added, but traffic still not able to reach the IoT Edge module.**
    
    If communication is still not working after addling the appropriate firewall rules, try completely disabling the firewall to troubleshoot.
    
    ```bash
    sudo iptables -F
    sudo iptables -X
    sudo iptables -P INPUT ACCEPT
    sudo iptables -P OUTPUT ACCEPT
    sudo iptables -P FORWARD ACCEPT
    ```
    Once finished, reboot the VM (`Stop-EflowVm` and `Start-EflowVm`) to get the EFLOW VM firewall back to normal state. 

- **Can't connect to internet when using multiple NICs.**
    
    Generally, this issue is related to a routing problem. Check [How to configure Azure IoT Edge for Linux on Windows Industrial IoT & DMZ configuration](how-to-configure-iot-edge-for-linux-on-windows-iiot-dmz.md) to set up a static route. 


## Next steps

Do you think that you found a bug in the IoT Edge platform? [Submit an issue](https://github.com/Azure/iotedge/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
