---
title: Load balance client connections to HPC Cache
description: How to configure a DNS server for round-robin load balancing for Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 09/01/2021
ms.author: v-erkel
---

# Load balance HPC Cache traffic

This article explains some basic methods for balancing client traffic to all of the mount points on your Azure HPC Cache.

Every HPC Cache has at least three different IP addresses, and caches with larger throughput values can have up to 12. It's important to use all the IP addresses to get the full benefits of Azure HPC Cache.

There are various options for load-balancing your client mounts:

* Manually choose a different mount IP for each client
* Include IP address rotation in your client mounting scripts
* Configure a DNS system to automatically route client requests among all the available addresses (round-robin DNS)

The right load-balancing system for you depends on the complexity of your workflow, the number of IP addresses in your cache, and a large number of other factors. Consult your Azure advisor if you need help deciding which approach is best for you.

## Assign IP addresses manually

Your cache's mount IP addresses are shown on the cache **Overview** and **Mount instructions** pages in the Azure portal, and on the success message that prints when you create a cache with Azure CLI or PowerShell.

You can use the **Mount instructions** page to generate a customized mount command for each client. Select all the  **Cache mount address** values when creating multiple commands.

Read [Mount the Azure HPC Cache](hpc-cache-mount.md) for details.

## Use scripted load balancing

There are several ways to programmatically rotate client mounts among the available IP addresses.

This example mount command uses the hash function ``cksum`` and the client host name to automatically distribute the client connections among all available IP addresses on your HPC Cache. As long as all of your client machines have unique hostnames, this command can be run on each of them to make sure that all available mount points are used.

``
mount -o hard,proto=tcp,mountproto=tcp,retry=30 $(X=(10.0.0.{1..3});echo ${X[$(($(hostname|cksum|cut -f 1 -d ' ')%3))]}):/${NAMESPACE} /mnt
``

To use this example in your workflow, customize these terms:

* In the ```X=``` expression, use a space-separated list of all of the cache's mount addresses, in sorted order.

  The expression ``(X=(10.0.0.{7..9})`` sets the variable X as this set of mount addresses: {10.0.0.7, 10.0.0.8, 10.0.0.9}. Use the cache's base IP address and the exact addresses shown in your cache Overview page. If the addresses aren't consecutive, list them all in numeric order.

* In the ```%3``` term, use the actual number of mount IP addresses that your cache has (typically 3, 6, 9, or 12).

  For example, use ``%9`` if your cache exposes nine client mount IP addresses.

* For the expression ``${NAMESPACE}`` use the storage target namespace path that the client will access.

  You can use a variable that you have defined (*NAMESPACE* in the example), or pass the literal value instead.
  
  The command example at the end of this section uses a literal value for the namespace path, ``/blob-target-1``.

* If you want to use a custom local path on your client machines, change the value ``/mnt`` to the path you want.

Here is an example of a populated client mount command:

```bash
mount -o hard,proto=tcp,mountproto=tcp,retry=30 $(X=(10.7.0.{1..3});echo ${X[$(($(hostname|cksum|cut -f 1 -d ' ')%3))]}):/blob-target-1 /hpc-cache/blob1 
```

## Use DNS load balancing

This section explains the basics of configuring a DNS system to load balance client traffic to all of the mount points on your Azure HPC Cache.

This document *does not include* instructions for setting up and managing a DNS server in the Azure environment. ***[ can you do it with built-in Azure DNS? ]***

DNS is not required in order to mount clients using the NFS protocol and numeric IP addresses. DNS *is* needed if you want to use domain names instead of IP addresses to reach hardware NAS systems, or if your workflow includes certain advanced protocol settings. Read [Storage target DNS access](hpc-cache-prerequisites.md#dns-access) for more information.

### Configure round-robin distribution for cache mount points

A round-robin DNS (RRDNS) system automatically routes client requests among multiple addresses.

To set this system up, you need to customize the DNS server's configuration file so that when it gets mount requests to the HPC Cache's main domain address, it assigns the traffic among all of the HPC Cache system's mount points. Clients mount the HPC Cache using its domain name as the server argument, and are routed to the next available mount IP automatically.

There are two main steps to configure RRDNS:

1. Modify your DNS server’s ``named.conf`` file to set cyclic order for queries to your HPC Cache. This option ensures that all of the available values are cycled through. Add a statement like the following:

   ```bash
   options {
       rrset-order {
           class IN A name "hpccache.contoso.com" order cyclic;
       };
   };
   ```

1. Configure A records and pointers for each available IP address as in the following example.

   These ``nsupdate`` commands provide an example of configuring DNS correctly for an HPC Cache with the domain name hpccache.contoso.com and three mount addresses (10.0.0.10, 10.0.0.11, and 10.0.0.12):

   ```bash
   update add hpccache.contoso.com. 86400 A 10.0.0.10
   update add hpccache.contoso.com. 86400 A 10.0.0.11
   update add hpccache.contoso.com. 86400 A 10.0.0.12
   update add client-IP-10.contoso.com. 86400 A 10.0.0.10
   update add client-IP-11.contoso.com. 86400 A 10.0.0.11
   update add client-IP-12.contoso.com. 86400 A 10.0.0.12
   update add 10.0.0.10.in-addr.arpa. 86400 PTR client-IP-10.contoso.com
   update add 11.0.0.10.in-addr.arpa. 86400 PTR client-IP-11.contoso.com
   update add 12.0.0.10.in-addr.arpa. 86400 PTR client-IP-12.contoso.com
   ```

   These commands create an A record for each of the HPC Cache's mount addresses, and also set up pointer (PTR) records to support reverse DNS checks appropriately.

   The diagram below shows the basic structure of this configuration.

   :::image type="complex" source="media/rrdns-diagram-hpc.png" alt-text="Diagram showing client mount point DNS configuration.":::
   <The diagram shows connections among three categories of elements: the single HPC Cache domain name (at the left), three IP addresses (middle column), and three internal-use reverse DNS client interfaces (right column). A single circle at the left labeled "hpccache.contoso.com" is connected by arrows pointing toward three circles labeled with IP addresses: 10.0.0.10, 10.0.0.11, and 10.0.0.12. The arrows from the hpccache.contoso.com circle to the three IP circles are labeled "A". Each of the IP address circles is connected by two arrows to a circle labeled as a client interface - the circle with IP 10.0.0.10 is connected to "client-IP-10.contoso.com", the circle with IP 10.0.0.11 is connected to "client-IP-11.contoso.com", and the circle with IP 10.0.0.12 is connected to "client-IP-11.contoso.com". The connections between the IP address circles and the client interface circles are two arrows: one arrow labeled "PTR" that points from the IP address circle to the client interface circle, and one arrow labeled "A" that points from the client interface circle to the IP address circle.>
:::image-end:::

### Configure the HPC Cache to use the custom DNS server

When your DNS system is ready, use the **Networking** page in the portal to tell the cache to use it. Follow the instructions in [Set a custom DNS configuration](configuration.md#set-a-custom-dns-configuration).

## Next steps

* For help balancing client load, [contact support](hpc-cache-support-ticket.md).
* To move data to the cache's storage targets, read [Populate new Azure Blob storage](hpc-cache-ingest.md).
