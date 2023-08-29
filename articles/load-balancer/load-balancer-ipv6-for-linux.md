---
title: Configure DHCPv6 for Linux VMs
titleSuffix: Azure Load Balancer
description: In this article, learn how to configure DHCPv6 for Linux VMs.
services: load-balancer
author: mbender-ms
keywords: ipv6, azure load balancer, dual stack, public ip, native ipv6, mobile, iot
ms.service: load-balancer
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 04/21/2023
ms.author: mbender
ms.custom: template-how-to, engagement-fy23, doc-a-thon, devx-track-linux
---

# Configure DHCPv6 for Linux VMs


Some of the Linux virtual-machine images in the Azure Marketplace don't have Dynamic Host Configuration Protocol version 6 (DHCPv6) configured by default. To support IPv6, DHCPv6 must be configured in the Linux OS distribution that you're using. The various Linux distributions configure DHCPv6 in various ways because they use different packages.

> [!NOTE]
> Recent SUSE Linux and CoreOS images in the Azure Marketplace have been pre-configured with DHCPv6. No additional changes are required when you use these images.

This document describes how to enable DHCPv6 so that your Linux virtual machine obtains an IPv6 address.

> [!WARNING]
> By improperly editing network configuration files, you can lose network access to your VM. We recommended that you test your configuration changes on non-production systems. The instructions in this article have been tested on the latest versions of the Linux images in the Azure Marketplace. For more detailed instructions, consult the documentation for your own version of Linux.

# [RHEL/CentOS/Oracle](#tab/redhat) 

For RHEL, CentOS, and Oracle Linux versions 7.4 or higher, follow these steps:

1. Edit the */etc/sysconfig/network* file, and add the following parameter:

    ```config
    NETWORKING_IPV6=yes
    ```

2. Edit the */etc/sysconfig/network-scripts/ifcfg-eth0* file, and add the following two parameters:

    ```config
    IPV6INIT=yes
    DHCPV6C=yes
    ```

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```
 
# [openSUSE/SLES](#tab/suse)  

Recent SUSE Linux Enterprise Server (SLES) and openSUSE images in Azure have been preconfigured with DHCPv6. No other changes are required when you use these images. If you have a VM that's based on an older or custom SUSE image, use one of the following procedures to configure DHCPv6.

## OpenSuSE 13 and SLES 11

1. Install the `dhcp-client` package, if needed:

    ```bash
    sudo zypper install dhcp-client
    ```

2. Edit the */etc/sysconfig/network/ifcfg-eth0* file, and add the following parameter:

    ```config
    DHCLIENT6_MODE='managed'
    

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ``` 
## OpenSUSE Leap and SLES 12

For openSUSE Leap and SLES 12, follow these steps:

1. Edit the */etc/sysconfig/network/ifcfg-eth0* file, and replace the `#BOOTPROTO='dhcp4'` parameter with the following value:

    ```config
    BOOTPROTO='dhcp'
    ```

2. To the */etc/sysconfig/network/ifcfg-eth0* file, add the following parameter:

    ```config
    DHCLIENT6_MODE='managed'
    ```

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ``` 

# [Ubuntu](#tab/ubuntu) 

For Ubuntu versions 17.10 or higher, follow these steps:

1. Edit the **`/etc/dhcp/dhclient.conf`** file, and add the following line:

    ```config
    timeout 10;
    ```

1. Create a new file in the cloud.cfg.d folder that retains your configuration through reboots. **The information in this file will override the default [NETPLAN]( https://netplan.io) config (in YAML configuration files at this location: /etc/netplan/*.yaml)**.

   Create a */etc/cloud/cloud.config.d/91-azure-network.cfg* file.  Ensure that **`dhcp6: true`** is reflected under the required interface, as shown by the following sample:

   ```config
    network:
        version: 2
        ethernets:
            eth0:
                dhcp4: true
                dhcp6: true
                match:
                     driver: hv_netvsc
                set-name: eth0
    ```

1. Save the file and reboot.
1. Use **`ifconfig`** to verify virtual machine received IPv6 address.

    If **`ifconfig`** isn't installed, run the following commands:

    ```bash
    sudo apt update
    sudo apt install net-tools
    ```

    :::image type="content" source="./media/load-balancer-ipv6-for-linux/ipv6-ip-address-ifconfig.png" alt-text="Screenshot of ifconfig showing IPv6 IP address.":::

# [Debian](#tab/debian)

1. Edit the */etc/dhcp/dhclient6.conf* file, and add the following line:

    ```config
    timeout 10;
    ```

1. Edit the */etc/network/interfaces* file, and add the following configuration:

    ```config
    iface eth0 inet6 auto
        up sleep 5
        up dhclient -1 -6 -cf /etc/dhcp/dhclient6.conf -lf /var/lib/dhcp/dhclient6.eth0.leases -v eth0 || true
    ```

1. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## [CoreOS](#tab/coreos)

Recent CoreOS images in Azure have been preconfigured with DHCPv6. No other changes are required when you use these images. If you have a VM based on an older or custom CoreOS image, follow these steps:

1. Edit the */etc/systemd/network/10_dhcp.network* file:

    ```config
    [Match]
    eth0

    [Network]
    DHCP=ipv6
    ```

2. Renew the IPv6 address:

    ```bash
    sudo systemctl restart systemd-networkd
    ```

---
