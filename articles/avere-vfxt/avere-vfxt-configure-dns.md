---
title: Avere vFXT DNS - Azure
description: Configuring a DNS server for round-robin load balancing with Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/07/2021
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

When clients access the cluster, round-robin DNS (RRDNS) automatically balances their requests among all available interfaces.

To set this system up, you need to customize the DNS server's configuration file so that when it gets mount requests to the vFXT cluster's main domain address, it assigns the traffic among all of the vFXT cluster's mount points. Clients mount the vFXT cluster using its domain name as the server argument, and are routed to the next mount IP automatically.

There are two main steps to configure RRDNS:

1. Modify your DNS server’s ``named.conf`` file to set cyclic order for queries to your vFXT cluster. This option causes the server to cycle through all of the available IP values. Add a statement like the following:

   ```bash
   options {
       rrset-order {
           class IN A name "vfxt.contoso.com" order cyclic;
       };
   };
   ```

1. Configure A records and pointer (PTR) records for each available IP address as in the following example.

   These ``nsupdate`` commands provide an example of configuring DNS correctly for a vFXT cluster with the domain name vfxt.contoso.com and three mount addresses (10.0.0.10, 10.0.0.11, and 10.0.0.12):

   ```bash
   update add vfxt.contoso.com. 86400 A 10.0.0.10
   update add vfxt.contoso.com. 86400 A 10.0.0.11
   update add vfxt.contoso.com. 86400 A 10.0.0.12
   update add client-IP-10.contoso.com. 86400 A 10.0.0.10
   update add client-IP-11.contoso.com. 86400 A 10.0.0.11
   update add client-IP-12.contoso.com. 86400 A 10.0.0.12
   update add 10.0.0.10.in-addr.arpa. 86400 PTR client-IP-10.contoso.com
   update add 11.0.0.10.in-addr.arpa. 86400 PTR client-IP-11.contoso.com
   update add 12.0.0.10.in-addr.arpa. 86400 PTR client-IP-12.contoso.com
   ```

   These commands create an A record for each of the cluster's mount addresses, and also set up pointer records to support reverse DNS checks appropriately.

   The diagram below shows the basic structure of this configuration.

   :::image type="complex" source="media/round-robin-dns-diagram-vfxt.png" alt-text="Diagram showing client mount point DNS configuration.":::
   <The diagram shows connections among three categories of elements: the single vFXT cluster domain name (at the left), three IP addresses (middle column), and three internal-use reverse DNS client interfaces (right column). A single oval at the left labeled "vfxt.contoso.com" is connected by arrows pointing toward three ovals labeled with IP addresses: 10.0.0.10, 10.0.0.11, and 10.0.0.12. The arrows from the vfxt.contoso.com oval to the three IP ovals are labeled "A". Each of the IP address ovals is connected by two arrows to an oval labeled as a client interface - the oval with IP 10.0.0.10 is connected to "client-IP-10.contoso.com", the oval with IP 10.0.0.11 is connected to "client-IP-11.contoso.com", and the oval with IP 10.0.0.12 is connected to "client-IP-11.contoso.com". The connections between the IP address ovals and the client interface ovals are two arrows: one arrow labeled "PTR" that points from the IP address oval to the client interface oval, and one arrow labeled "A" that points from the client interface oval to the IP address oval.>
:::image-end:::

After the RRDNS system is configured, tell your client machines to use it to resolve the cluster address in their mount commands.

## Cluster DNS settings

Specify the DNS server that the vFXT cluster uses in the **Cluster** > **Administrative Network** settings page. Settings on that page include:

* DNS server address
* DNS domain name
* DNS search domains

Read [DNS Settings](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_admin_network.html#gui-dns) in the Avere Cluster Configuration Guide for more details about using this page.
