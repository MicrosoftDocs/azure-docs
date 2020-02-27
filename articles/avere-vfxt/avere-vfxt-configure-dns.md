---
title: Avere vFXT DNS - Azure
description: Configuring a DNS server for round-robin load balancing with Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 12/19/2019
ms.author: rohogue
---

# Avere cluster DNS configuration

This section explains the basics of configuring a DNS system for load balancing your Avere vFXT cluster.

This document *does not include* instructions for setting up and managing a DNS server in the Azure environment.

Instead of using round-robin DNS to load-balance a vFXT cluster in Azure, consider using manual methods to assign IP addresses evenly among clients when they are mounted. Several methods are described in [Mount the Avere cluster](avere-vfxt-mount-clients.md).

Keep these things in mind when deciding whether or not to use a DNS server:

* If your system is accessed by NFS clients only, using DNS is not required - it is possible to specify all network addresses by using numeric IP addresses.

* If your system supports SMB (CIFS) access, DNS is required, because you must specify a DNS domain for the Active Directory server.

* DNS is required if you want to use Kerberos authentication.

## Load balancing

To distribute the overall load, configure your DNS domain to use round-robin load distribution for client-facing IP addresses.

## Configuration details

When clients access the cluster, RRDNS automatically balances their requests among all available interfaces.

For optimal performance, configure your DNS server to handle client-facing cluster addresses as shown in the following diagram.

A cluster vserver is shown on the left, and IP addresses appear in the center and on the right. Configure each client access point with A records and pointers as illustrated.

![Avere cluster round-robin DNS diagram](media/avere-vfxt-rrdns-diagram.png)
<!--- separate text description file provided  [diagram text description](avere-vfxt-rrdns-alt-text.md) -->

Each client-facing IP address must have a unique name for internal use by the cluster. (In this diagram, the client IPs are named vs1-client-IP-* for clarity, but in production you should probably use something more concise, like client*.)

Clients mount the cluster using the vserver name as the server argument.

Modify your DNS server’s ``named.conf`` file to set cyclic order for queries to your vserver. This option ensures that all of the available values are cycled through. Add a statement like the following:

```
options {
    rrset-order {
        class IN A name "vserver1.example.com" order cyclic;
    };
};
```

The following ``nsupdate`` commands provide an example of configuring DNS correctly:

```
update add vserver1.example.com. 86400 A 10.0.0.10
update add vserver1.example.com. 86400 A 10.0.0.11
update add vserver1.example.com. 86400 A 10.0.0.12
update add vs1-client-IP-10.example.com. 86400 A 10.0.0.10
update add vs1-client-IP-11.example.com. 86400 A 10.0.0.11
update add vs1-client-IP-12.example.com. 86400 A 10.0.0.12
update add 10.0.0.10.in-addr.arpa. 86400 PTR vs1-client-IP-10.example.com
update add 11.0.0.10.in-addr.arpa. 86400 PTR vs1-client-IP-11.example.com
update add 12.0.0.10.in-addr.arpa. 86400 PTR vs1-client-IP-12.example.com
```

## Cluster DNS settings

Specify the DNS server that the vFXT cluster uses in the **Cluster** > **Administrative Network** settings page. Settings on that page include:

* DNS server address
* DNS domain name
* DNS search domains

Read [DNS Settings](<https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_admin_network.html#gui-dns>) in the Avere Cluster Configuration Guide for more details about using this page.
