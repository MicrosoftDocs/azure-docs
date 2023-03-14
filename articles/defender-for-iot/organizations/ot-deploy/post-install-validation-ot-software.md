---
title: Post-installation validation of OT network monitoring software - Microsoft Defender for IoT
description: Learn how to test your system post installation of OT network monitoring software for Microsoft Defender for IoT. Use this article after you've reinstalled software on a pre-configured appliance, or if you've chosen to install software on your own appliances.
ms.date: 12/13/2022
ms.topic: install-set-up-deploy
---

# Post-installation validation of OT network monitoring software

After you've installed OT software on your [OT sensors](install-software-ot-sensor.md) or [on-premises management console](install-software-on-premises-management-console.md), test your system to make sure that processes are running correctly. The same validation process applies to all appliance types.

System health validations are supported via the sensor or on-premises management console UI or CLI, and are available for both the *support* and *cyberx* users.

## General tests

After installing OT monitoring software, make sure to run the following tests:

- **Sanity test**: Verify that the system is running.

- **Version**: Verify that the version is correct.

- **ifconfig**: Verify that all the input interfaces configured during the installation process are running.

## Gateway checks

Use the `route` command to show the gateway's IP address. For example:

``` CLI
<root@xsense:/# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         172.18.0.1      0.0.0.0         UG    0      0        0 eth0
172.18.0.0      0.0.0.0         255.255.0.0     U     0      0        0 eth0
>
```

Use the `arp -a` command to verify that there is a binding between the MAC address and the IP address of the default gateway. For example:

``` CLI
<root@xsense:/# arp -a
cusalvtecca101-gi0-02-2851.network.microsoft.com (172.18.0.1) at 02:42:b0:3a:e8:b5 [ether] on eth0
mariadb_22.2.6.27-r-c64cbca.iot_network_22.2.6.27-r-c64cbca (172.18.0.5) at 02:42:ac:12:00:05 [ether] on eth0
redis_22.2.6.27-r-c64cbca.iot_network_22.2.6.27-r-c64cbca (172.18.0.3) at 02:42:ac:12:00:03 [ether] on eth0
>
```

## DNS checks

Use the `cat /etc/resolv.conf` command to find the IP address that's configured for DNS traffic. For example:
``` CLI
<root@xsense:/# cat /etc/resolv.conf
search reddog.microsoft.com
nameserver 127.0.0.11
options ndots:0
>
```

Use the `host` command to resolve an FQDN. For example:

``` CLI
<root@xsense:/# host www.apple.com
www.apple.com is an alias for www.apple.com.edgekey.net.
www.apple.com.edgekey.net is an alias for www.apple.com.edgekey.net.globalredir.akadns.net.
www.apple.com.edgekey.net.globalredir.akadns.net is an alias for e6858.dscx.akamaiedge.net.
e6858.dscx.akamaiedge.net has address 72.246.148.202
e6858.dscx.akamaiedge.net has IPv6 address 2a02:26f0:5700:1b4::1aca
e6858.dscx.akamaiedge.net has IPv6 address 2a02:26f0:5700:182::1aca
>
```

## Firewall checks

Use the `wget` command to verify that port 443 is open for communication. For example:

``` CLI
<root@xsense:/# wget https://www.apple.com
--2022-11-09 11:21:15--  https://www.apple.com/
Resolving www.apple.com (www.apple.com)... 72.246.148.202, 2a02:26f0:5700:1b4::1aca, 2a02:26f0:5700:182::1aca
Connecting to www.apple.com (www.apple.com)|72.246.148.202|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 99966 (98K) [text/html]
Saving to: 'index.html.1'

index.html.1        100%[===================>]  97.62K  --.-KB/s    in 0.02s

2022-11-09 11:21:15 (5.88 MB/s) - 'index.html.1' saved [99966/99966]

>
```

For more information, see [Check system health](../how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#check-system-health) in our sensor and on-premises management console troubleshooting article.

## Next steps

> [!div class="nextstepaction"]
> [Troubleshoot an OT sensor or on-premises management console](../how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
> 
