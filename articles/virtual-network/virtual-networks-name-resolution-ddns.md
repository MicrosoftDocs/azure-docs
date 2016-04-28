<properties
   pageTitle="Using Dynamic DNS to register hostnames"
   description="This page gives details on how to set up Dynamic DNS to register hostnames in your own DNS servers."
   services="virtual-network"
   documentationCenter="na"
   authors="GarethBradshawMSFT"
   manager="carmonm"
   editor="tysonn" />
<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/26/2016"
   ms.author="joaoma" />


# Using Dynamic DNS to register hostnames in your own DNS server
[Azure provides name resolution](virtual-networks-name-resolution-for-vms-and-role-instances.md) for virtual machines (VMs) and role instances. However, when your name resolution needs go beyond those provided by Azure, you can provide your own DNS servers. This gives you the power to tailor your DNS solution to suit your own specific needs. For example, you may need to access on-premises resources via your Active Directory domain controller.

When your custom DNS servers are hosted as Azure VMs you can forward hostname queries for the same vnet to Azure to resolve hostnames. If you do not wish to use this route, you can register your VM hostnames in your DNS server using Dynamic DNS.  Azure doesn't have the ability (e.g. credentials) to directly create records in your DNS servers, so alternative arrangements are often needed. Here are some common scenarios with alternatives.

## Windows clients
Non-domain-joined Windows clients attempt unsecured Dynamic DNS (DDNS) updates when they boot or when their IP address changes. The DNS name is the hostname plus the primary DNS suffix. Azure leaves the primary DNS suffix blank, but you can set this in the VM, via the [UI](https://technet.microsoft.com/library/cc794784.aspx) or [by using automation](https://social.technet.microsoft.com/forums/windowsserver/3720415a-6a9a-4bca-aa2a-6df58a1a47d7/change-primary-dns-suffix).  

Domain-joined Windows clients register their IP addresses with the domain controller by using secure Dynamic DNS. The domain-join process sets the primary DNS suffix on the client and creates and maintains the trust relationship.

## Linux clients
Linux clients generally don't register themselves with the DNS server on startup, they assume the DHCP server does it. Azure's DHCP servers do not have the ability or credentials to register records in your DNS server.  You can use a tool called *nsupdate*, which is included in the Bind package, to send Dynamic DNS updates. Because the Dynamic DNS protocol is standardized, you can use *nsupdate* even when you're not using Bind on the DNS server.  

You can use the hooks that are provided by the DHCP client to create and maintain the hostname entry in the DNS server. During the DHCP cycle, the client executes the scripts in */etc/dhcp/dhclient-exit-hooks.d/*. This can be used to register the new IP address by using *nsupdate*. For example:

    	#!/bin/sh
    	requireddomain=mydomain.local

    	# only execute on the primary nic
    	if [ "$interface" != "eth0" ]
    	then
    		return
    	fi

		# when we have a new IP, perform nsupdate
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

		#done
		exit 0;

You can also use the *nsupdate* command to perform secure Dynamic DNS updates. For example, when you're using a Bind DNS server, a public-private key pair is [generated](http://linux.yyz.us/nsupdate/).  The DNS server is [configured](http://linux.yyz.us/dns/ddns-server.html) with the public part of the key so that it can verify the signature on the request. You must use the *-k* option to provide the key-pair to *nsupdate* in order for the Dynamic DNS update request to be signed.

When you're using a Windows DNS server, you can use Kerberos authentication with the *-g* parameter in *nsupdate* (not available in the Windows version of *nsupdate*). To do this, use *kinit* to load the credentials (e.g. from a [keytab file](http://www.itadmintools.com/2011/07/creating-kerberos-keytab-files.html)). Then *nsupdate -g* will pick up the credentials from the cache.

If needed, you can add a DNS search suffix to your VMs. The DNS suffix is specified in the */etc/resolv.conf* file. Most Linux distros automatically manage the content of this file, so usually you can't edit it. However, you can override the suffix by using the DHCP client's *supersede* command. To do this, in */etc/dhcp/dhclient.conf*, add:

		supersede domain-name <required-dns-suffix>;

