---
title: Configure DHCPv6 for Linux VMs
titlesuffix: Azure Load Balancer
description: How to configure DHCPv6 for Linux VMs.
services: load-balancer
documentationcenter: na
author: KumudD
keywords: ipv6, azure load balancer, dual stack, public ip, native ipv6, mobile, iot
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/22/2019
ms.author: kumud
---

# Configure DHCPv6 for Linux VMs


Some of the Linux virtual-machine images in the Azure Marketplace do not have Dynamic Host Configuration Protocol version 6 (DHCPv6) configured by default. To support IPv6, DHCPv6 must be configured in the Linux OS distribution that you are using. The various Linux distributions configure DHCPv6 in a variety of ways because they use different packages.

> [!NOTE]
> Recent SUSE Linux and CoreOS images in the Azure Marketplace have been pre-configured with DHCPv6. No additional changes are required when you use these images.

This document describes how to enable DHCPv6 so that your Linux virtual machine obtains an IPv6 address.

> [!WARNING]
> By improperly editing network configuration files, you can lose network access to your VM. We recommended that you test your configuration changes on non-production systems. The instructions in this article have been tested on the latest versions of the Linux images in the Azure Marketplace. For more detailed instructions, consult the documentation for your own version of Linux.

## Ubuntu

1. Edit the */etc/dhcp/dhclient6.conf* file, and add the following line:

        timeout 10;

2. Edit the network configuration for the eth0 interface with the following configuration:

   * On **Ubuntu 12.04 and 14.04**, edit the */etc/network/interfaces.d/eth0.cfg* file. 
   * On **Ubuntu 16.04**, edit the */etc/network/interfaces.d/50-cloud-init.cfg* file.

         iface eth0 inet6 auto
             up sleep 5
             up dhclient -1 -6 -cf /etc/dhcp/dhclient6.conf -lf /var/lib/dhcp/dhclient6.eth0.leases -v eth0 || true

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```
Beginning with Ubuntu 17.10, the default network configuration mechanism is [NETPLAN]( https://netplan.io).  At install/instantiation time, NETPLAN reads network configuration from YAML configuration files at this location: /{lib,etc,run}/netplan/*.yaml.

Please include a *dhcp6:true* statement for each ethernet interface in your configuration.  For example:
  
        network:
          version: 2
          ethernets:
            eno1:
              dhcp6: true

During early boot, the netplan “network renderer” writes configuration to /run to hand off control of devices to the specified networking daemon
For reference information about NETPLAN, see https://netplan.io/reference.
 
## Debian

1. Edit the */etc/dhcp/dhclient6.conf* file, and add the following line:

        timeout 10;

2. Edit the */etc/network/interfaces* file, and add the following configuration:

        iface eth0 inet6 auto
            up sleep 5
            up dhclient -1 -6 -cf /etc/dhcp/dhclient6.conf -lf /var/lib/dhcp/dhclient6.eth0.leases -v eth0 || true

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## RHEL, CentOS, and Oracle Linux

1. Edit the */etc/sysconfig/network* file, and add the following parameter:

        NETWORKING_IPV6=yes

2. Edit the */etc/sysconfig/network-scripts/ifcfg-eth0* file, and add the following two parameters:

        IPV6INIT=yes
        DHCPV6C=yes

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## SLES 11 and openSUSE 13

Recent SUSE Linux Enterprise Server (SLES) and openSUSE images in Azure have been pre-configured with DHCPv6. No additional changes are required when you use these images. If you have a VM that's based on an older or custom SUSE image, do the following:

1. Install the `dhcp-client` package, if needed:

    ```bash
    sudo zypper install dhcp-client
    ```

2. Edit the */etc/sysconfig/network/ifcfg-eth0* file, and add the following parameter:

        DHCLIENT6_MODE='managed'

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## SLES 12 and openSUSE Leap

Recent SLES and openSUSE images in Azure have been pre-configured with DHCPv6. No additional changes are required when you use these images. If you have a VM that's based on an older or custom SUSE image, do the following:

1. Edit the */etc/sysconfig/network/ifcfg-eth0* file, and replace the `#BOOTPROTO='dhcp4'` parameter with the following value:

        BOOTPROTO='dhcp'

2. To the */etc/sysconfig/network/ifcfg-eth0* file, add the following parameter:

        DHCLIENT6_MODE='managed'

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## CoreOS

Recent CoreOS images in Azure have been pre-configured with DHCPv6. No additional changes are required when you use these images. If you have a VM based on an older or custom CoreOS image, do the following:

1. Edit the */etc/systemd/network/10_dhcp.network* file:

        [Match]
        eth0

        [Network]
        DHCP=ipv6

2. Renew the IPv6 address:

    ```bash
    sudo systemctl restart systemd-networkd
    ```
