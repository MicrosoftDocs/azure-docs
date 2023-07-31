---
title: Using dynamic DNS to register hostnames in Azure
description: Learn how to set up dynamic DNS to register hostnames in your own DNS servers.
services: dns
author: greg-lindsay
manager: kumud
ms.assetid: c315961a-fa33-45cf-82b9-4551e70d32dd
ms.service: dns
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: devx-track-linux
ms.date: 04/27/2023
ms.author: greglin
---

# Use dynamic DNS to register hostnames in your own DNS server

[Azure provides name resolution](virtual-networks-name-resolution-for-vms-and-role-instances.md) for virtual machines (VM) and role instances. When your name resolution needs exceed the capabilities provided by Azure's default DNS, you can provide your own DNS servers. Using your own DNS servers gives you the ability to tailor your DNS solution to suit your own specific needs. For example, you may need to access on-premises resources via your Active Directory domain controller.

When your custom DNS servers are hosted as Azure VMs, you can forward hostname queries for the same virtual network to Azure to resolve hostnames. If you don't wish to use this option, you can register your VM hostnames in your DNS server using dynamic DNS (DDNS). Azure doesn't have the credentials to directly create records in your DNS servers, so alternative arrangements are often needed. Some common scenarios, with alternatives follow:

## Windows clients
Non-domain-joined Windows clients attempt unsecured DDNS updates when they boot, or when their IP address changes. The DNS name is the hostname plus the primary DNS suffix. Azure leaves the primary DNS suffix blank, but you can set the suffix in the VM, via the [user interface](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc794784(v=ws.10)) or [PowerShell](/powershell/module/dnsclient/set-dnsclient).

Domain-joined Windows clients register their IP addresses with the domain controller by using secure DDNS. The domain-join process sets the primary DNS suffix on the client and creates and maintains the trust relationship.

## Linux clients
Linux clients generally don't register themselves with the DNS server on startup, they assume the DHCP server does it. Azure's DHCP servers don't have the credentials to register records in your DNS server. You can use a tool called `nsupdate`, which is included in the Bind package, to send DDNS updates. Because the DDNS protocol is standardized, you can use `nsupdate` even when you're not using Bind on the DNS server.

You can use the hooks that are provided by the DHCP client to create and maintain the hostname entry in the DNS server. During the DHCP cycle, the client executes the scripts in */etc/dhcp/dhclient-exit-hooks.d/*. You can use the hooks to register the new IP address using `nsupdate`. For example:

```bash
#!/bin/sh
requireddomain=mydomain.local

# only execute on the primary nic
if [ "$interface" != "eth0" ]
then
    return
fi

# When you have a new IP, perform nsupdate
if [ "$reason" = BOUND ] || [ "$reason" = RENEW ] ||
   [ "$reason" = REBIND ] || [ "$reason" = REBOOT ]
then
   host=`hostname`
   nsupdatecmds=/var/tmp/nsupdatecmds
     echo "update delete $host.$requireddomain a" > $nsupdatecmds
     echo "update add $host.$requireddomain 3600 a $new_ip_address" >> $nsupdatecmds
     echo "send" >> $nsupdatecmds

     nsupdate $nsupdatecmds
fi
```

You can also use the `nsupdate` command to perform secure DDNS updates. For example, when you're using a Bind DNS server, a public-private key pair is generated (`http://linux.yyz.us/nsupdate/`). The DNS server is configured (`http://linux.yyz.us/dns/ddns-server.html`) with the public part of the key, so that it can verify the signature on the request. To provide the key-pair to `nsupdate`, use the `-k` option, for the DDNS update request to be signed.

When you're using a Windows DNS server, you can use Kerberos authentication with the `-g` parameter in `nsupdate`, but it's not available in the Windows version of `nsupdate`. To use Kerberos, use `kinit` to load the credentials. For example, you can load credentials from a [keytab file](https://www.itadmintools.com/2011/07/creating-kerberos-keytab-files.html)), then `nsupdate -g` picks up the credentials, from the cache.

If needed, you can add a DNS search suffix to your VMs. The DNS suffix is specified in the */etc/resolv.conf* file. Most Linux distros automatically manage the content of this file, so usually you can't edit it. However, you can override the suffix by using the DHCP client's `supersede` command. To override the suffix, add the following line to the */etc/dhcp/dhclient.conf* file:

```
supersede domain-name <required-dns-suffix>;
```
