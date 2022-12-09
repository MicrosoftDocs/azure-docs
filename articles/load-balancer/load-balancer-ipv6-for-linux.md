---
title: Configure DHCPv6 for Linux VMs
titleSuffix: Azure Load Balancer
description: In this article, learn how to configure DHCPv6 for Linux VMs.
services: load-balancer
documentationcenter: na
author: mbender-ms
keywords: ipv6, azure load balancer, dual stack, public ip, native ipv6, mobile, iot
ms.service: load-balancer
ms.topic: article
ms.custom: FY23 content-maintenance
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/02/2022
ms.author: mbender
---

# Configure DHCPv6 for Linux VMs


Some of the Linux virtual-machine images in the Azure Marketplace don't have Dynamic Host Configuration Protocol version 6 (DHCPv6) configured by default. To support IPv6, DHCPv6 must be configured in the Linux OS distribution that you're using. The various Linux distributions configure DHCPv6 in various ways because they use different packages.

> [!NOTE]
> Recent SUSE Linux and CoreOS images in the Azure Marketplace have been pre-configured with DHCPv6. No additional changes are required when you use these images.

This document describes how to enable DHCPv6 so that your Linux virtual machine obtains an IPv6 address.

> [!WARNING]
> By improperly editing network configuration files, you can lose network access to your VM. We recommended that you test your configuration changes on non-production systems. The instructions in this article have been tested on the latest versions of the Linux images in the Azure Marketplace. For more detailed instructions, consult the documentation for your own version of Linux.

## Ubuntu

1. Edit the */etc/dhcp/dhclient6.conf* file, and add the following line:

    ```config
    timeout 10;
    ```

1. Edit the network configuration for the eth0 interface with the following configuration:

   * On **Ubuntu 12.04 and 14.04**, edit the */etc/network/interfaces.d/eth0.cfg* file. 
   * On **Ubuntu 16.04**, create a new override file in the cloud.cfg.d folder that will retain your configuration, for example a */etc/cloud/cloud.config.d/91-azure-network.cfg* file.  Ensure that "dhcp6: true" is reflected under the required interface, as shown by the sample below:

    ```config
    iface eth0 inet6 auto
        up sleep 5
        up dhclient -1 -6 -cf /etc/dhcp/dhclient6.conf -lf /var/lib/dhcp/dhclient6.eth0.leases -v eth0 || true
    
    network:
        ethernets:
            eth0:
                addresses: 172.16.0.30/24
                dhcp4: true
                dhcp6: true
    ```

1.  Save the file and reboot.

1. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

Beginning with Ubuntu 17.10, the default network configuration mechanism is [NETPLAN]( https://netplan.io).  At install/instantiation time, NETPLAN reads network configuration from YAML configuration files at this location: /{lib,etc,run}/netplan/*.yaml.

Include a *dhcp6:true* statement for each ethernet interface in your configuration.  For example:

```config
network:
  version: 2
  ethernets:
    eno1:
      dhcp6: true
```

During early boot, the netplan “network renderer” writes configuration to /run to hand off control of devices to the specified networking daemon
For reference information about NETPLAN, see https://netplan.io/reference.
 
## Debian

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

## RHEL, CentOS, and Oracle Linux

1. Edit the */etc/sysconfig/network* file, and add the following parameter:

    ```config
    NETWORKING_IPV6=yes
    ```

1. Edit the */etc/sysconfig/network-scripts/ifcfg-eth0* file, and add the following two parameters:

    ```config
    IPV6INIT=yes
    DHCPV6C=yes
    ```

1. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## SLES 11 and openSUSE 13

Recent SUSE Linux Enterprise Server (SLES) and openSUSE images in Azure have been pre-configured with DHCPv6. No other changes are required when you use these images. If you have a VM that's based on an older or custom SUSE image, follow the steps below:

1. Install the `dhcp-client` package, if needed:

    ```bash
    sudo zypper install dhcp-client
    ```

1. Edit the */etc/sysconfig/network/ifcfg-eth0* file, and add the following parameter:

    ```config
    DHCLIENT6_MODE='managed'
    

1. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## SLES 12 and openSUSE Leap

Recent SLES and openSUSE images in Azure have been pre-configured with DHCPv6. No other changes are required when you use these images. If you have a VM that's based on an older or custom SUSE image, follow the steps below:

1. Edit the */etc/sysconfig/network/ifcfg-eth0* file, and replace the `#BOOTPROTO='dhcp4'` parameter with the following value:

    ```config
    BOOTPROTO='dhcp'
    ```

1. To the */etc/sysconfig/network/ifcfg-eth0* file, add the following parameter:

    ```config
    DHCLIENT6_MODE='managed'
    ```

1. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## CoreOS

Recent CoreOS images in Azure have been pre-configured with DHCPv6. No other changes are required when you use these images. If you have a VM based on an older or custom CoreOS image, follow the steps below:

1. Edit the */etc/systemd/network/10_dhcp.network* file:

    ```config
    [Match]
    eth0

    [Network]
    DHCP=ipv6
    ```

1. Renew the IPv6 address:

    ```bash
    sudo systemctl restart systemd-networkd
    ```
