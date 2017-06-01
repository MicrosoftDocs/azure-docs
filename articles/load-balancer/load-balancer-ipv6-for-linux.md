---
title: Configuring DHCPv6 for Linux VMs | Microsoft Docs
description: How to configure DHCPv6 for Linux VMs.
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
editor: ''
keywords: ipv6, azure load balancer, dual stack, public ip, native ipv6, mobile, iot

ms.assetid: b32719b6-00e8-4cd0-ba7f-e60e8146084b
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/14/2016
ms.author: kumud
---

# Configuring DHCPv6 for Linux VMs

Some of the Linux virtual machine images in the Azure Marketplace do not have DHCPv6 configured by default. To support IPv6, DHCPv6 must be configured in within the Linux OS distribution that you are using. Different Linux distributions have different ways of configuring DHCPv6 because they use different packages.

> [!NOTE]
> Recent SUSE Linux and CoreOS images in the Azure Marketplace have been pre-configured with DHCPv6. No additional changes are required when using those images.

This document describes how to enable DHCPv6 so that your Linux virtual machine obtains an IPv6 address.

> [!WARNING]
> Improperly editing network configuration files can cause you to lose network access to your VM. We recommended that you test your configuration changes on non-production systems. The instructions in this article have been tested on the latest versions of the Linux images in the Azure Marketplace. Consult the documentation for your specific version of Linux for more detailed instructions.

## Ubuntu

1. Edit the file `/etc/dhcp/dhclient6.conf` and add the following line:

        timeout 10;

2. Edit the network configuration for the eth0 interface with the following configuration:

   * On **Ubuntu 12.04 and 14.04**, edit the file `/etc/network/interfaces.d/eth0.cfg`
   * On **Ubuntu 16.04**, edit the file `/etc/network/interfaces.d/50-cloud-init.cfg`

         iface eth0 inet6 auto
             up sleep 5
             up dhclient -1 -6 -cf /etc/dhcp/dhclient6.conf -lf /var/lib/dhcp/dhclient6.eth0.leases -v eth0 || true

3. Renew IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## Debian

1. Edit the file `/etc/dhcp/dhclient6.conf` and add the following line:

        timeout 10;

2. Edit the file `/etc/network/interfaces` and add the following configuration:

        iface eth0 inet6 auto
            up sleep 5
            up dhclient -1 -6 -cf /etc/dhcp/dhclient6.conf -lf /var/lib/dhcp/dhclient6.eth0.leases -v eth0 || true

3. Renew IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## RHEL / CentOS / Oracle Linux

1. Edit the file `/etc/sysconfig/network` and add the following parameter:

        NETWORKING_IPV6=yes

2. Edit the file `/etc/sysconfig/network-scripts/ifcfg-eth0` and add the following two parameters:

        IPV6INIT=yes
        DHCPV6C=yes

3. Renew IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## SLES 11 & openSUSE 13

Recent SLES and openSUSE images in Azure have been pre-configured with DHCPv6. No additional changes are required when using those images. If you have a VM based on an older or custom SUSE image, use the following steps:

1. Install the `dhcp-client` package, if needed:

    ```bash
    sudo zypper install dhcp-client
    ```

2. Edit the file `/etc/sysconfig/network/ifcfg-eth0` and add the following parameter:

        DHCLIENT6_MODE='managed'

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## SLES 12 and openSUSE Leap

Recent SLES and openSUSE images in Azure have been pre-configured with DHCPv6. No additional changes are required when using those images. If you have a VM based on an older or custom SUSE image, use the following steps:

1. Edit the file `/etc/sysconfig/network/ifcfg-eth0` and replace this parameter

        #BOOTPROTO='dhcp4'

    with the following value:

        BOOTPROTO='dhcp'

2. Add the following parameter to `/etc/sysconfig/network/ifcfg-eth0`:

        DHCLIENT6_MODE='managed'

3. Renew the IPv6 address:

    ```bash
    sudo ifdown eth0 && sudo ifup eth0
    ```

## CoreOS

Recent CoreOS images in Azure have been pre-configured with DHCPv6. No additional changes are required when using those images. If you have a VM based on an older or custom CoreOS image, use the following steps:

1. Edit the file `/etc/systemd/network/10_dhcp.network`

        [Match]
        eth0

        [Network]
        DHCP=ipv6

2. Renew the IPv6 address:

    ```bash
    sudo systemctl restart systemd-networkd
    ```
