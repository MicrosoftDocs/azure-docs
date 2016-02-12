<properties 
   pageTitle="Using Dynamic DNS to register hostnames"
   description="This page gives some details on how to setup Dynamic DNS to register hostnames in your own DNS servers."
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
   ms.date="01/21/2016"
   ms.author="joaoma" />

# Using Dynamic DNS to Register Hostnames
[Azure provides name resolution](virtual-networks-name-resolution-for-vms-and-role-instances.md) for VMs and role instances.  When your name resolution needs go beyond those provided by Azure you are able to provide your own DNS servers.  This gives you the power to tailor your DNS solution to suit your own specific needs.  For example, accessing your on-premise AD Domain Controller.

Azure doesn't have the ability (e.g. credentials) to directly register records in your DNS servers, so alternative arrangements are often needed.  Below provides some highlevel details of some of the more common scenarios.

## Windows Clients ##
Non-domain joined Windows clients attempt unsecured DDNS updates when they boot or their IP address changes.  The DNS name is the hostname plus the primary DNS suffix.  Azure leaves the primary DNS suffix blank but this can be overridden in the VM, via the [UI](https://technet.microsoft.com/library/cc794784.aspx) or [with automation](https://social.technet.microsoft.com/forums/windowsserver/3720415a-6a9a-4bca-aa2a-6df58a1a47d7/change-primary-dns-suffix).  

Domain-joined Windows clients register their IPs with the Domain Controller using Secure DDNS.  The domain-join process sets the primary DNS suffix on the client and manages the trust relationship.

## Linux Clients ##
Linux clients generally do not register themselves with the DNS server on startup, they assume the DHCP server does it.  The Bind package comes with a tool called *nsupdate* which can be used to send DDNS updates.  As the DDNS protocol is standardised *nsupdate* can be used even when not using Bind on the DNS server.  

The Linux DHCP client provides hooks that allow you to run scripts when an IP address is assigned or changed.  For example, in */etc/dhcp/dhclient-exit-hooks.d/*.  This can be used to register the hostname in DNS. For example:
    
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

The *nsupdate* command can also perform secure DDNS updates.  For example, when using a Bind DNS server, a public-private key pair is [generated](http://linux.yyz.us/nsupdate/) and the DNS Server is [configured](http://linux.yyz.us/dns/ddns-server.html)  with the public part of the key so it can verify the signature of the request.  To sign the DDNS update reuqest, the key-pair must be provided to *nsupdate* using its *-k* option.

When using a Windows DNS Server, Kerberos authentication can be used with nsupdate's *-g* switch (not available in the Windows version of *nsupdate*).  To use this, use *kinit* to load the credentials (e.g. from a [keytab file](http://www.itadmintools.com/2011/07/creating-kerberos-keytab-files.html)) and then *nsupdate -g* will pick up the credentials from the cache.

If needed, a DNS search suffix can be added to your VMs.  The DNS suffix is specified in the */etc/resolv.conf* file.  Most Linux distros automatically manage the content of this file so it usually can't be edited.  However, the suffix can be overridden by using the DHCP client's *supersede* command, in */etc/dhcp/dhclient.conf* add:

		supersede domain-name <required-dns-suffix>;

