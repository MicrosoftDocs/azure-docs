---
title: 'Tutorial: Configure network in an Azure FXT Edge Filer cluster'
description: How to customize network settings after creating the Azure FXT Edge Filer cluster 
author: femila
ms.author: femila 
ms.service: fxt-edge-filer
ms.topic: tutorial
ms.date: 10/07/2021
---

# Tutorial: Configure the cluster's network settings

Before you use a newly created Azure FXT Edge Filer cluster, you should check and customize several network settings for your workflow.

This tutorial explains the network settings that you might need to adjust for a new cluster.

You will learn:

> [!div class="checklist"]
>
> * Which network settings might need to be updated after creating a cluster
> * Which Azure FXT Edge Filer use cases require an AD server or a DNS server
> * How to configure round-robin DNS (RRDNS) to automatically load balance client requests to the FXT cluster

The amount of time it takes to complete these steps depends on how many configuration changes are needed in your system:

* If you only need to read through the tutorial and check a few settings, it should take 10 to 15 minutes.
* If you need to configure round-robin DNS, that task can take an hour or more.

## Adjust network settings

Several network-related tasks are part of setting up a new Azure FXT Edge Filer cluster. Check this list and decide which ones apply to your system.

To learn more about network settings for the cluster, read [Configuring network services](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/network_overview.html) in the Cluster Configuration Guide.

* Configure round-robin DNS for the client-facing network (optional)

  Load balance cluster traffic by configuring the DNS system as described in [Configure DNS for the FXT Edge Filer cluster](#configure-dns-for-load-balancing).

* Verify NTP settings

* Configure Active Directory and username/group name downloads (if needed)

  If your network hosts use Active Directory or another kind of external directory service, you must modify the cluster’s directory services configuration to set up how the cluster downloads username and group information. Read **Cluster** > **Directory Services**  in the Cluster Configuration Guide for details.

  An AD server is required if you want SMB support. Configure AD before starting to set up SMB.

* Define VLANs (optional)
  
  Configure any additional VLANs needed before defining your cluster’s vservers and global namespace. Read [Working with VLANs](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/network_overview.html#vlan-overview) in the Cluster Configuration Guide to learn more.

* Configure proxy servers (if needed)

  If your cluster uses a proxy server to reach external addresses, follow these steps to set it up:

  1. Define the proxy server in the **Proxy Configuration** settings page
  1. Apply the proxy server configuration with the **Cluster** > **General Setup** page or the **Core Filer Details** page.
  
  For more information, read [Using web proxies](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/proxy_overview.html) in the Cluster Configuration Guide.

* Upload [encryption certificates](#encryption-certificates) for the cluster to use (optional)

### Encryption certificates

The FXT Edge Filer cluster uses X.509 certificates for these functions:

* To encrypt cluster administration traffic

* To authenticate on behalf of a client to third-party KMIP servers

* For verifying cloud providers’ server certificates

If you need to upload certificates to the cluster, use the **Cluster** > **Certificates** settings page. Details are in the [Cluster > Certificates](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_certificates.html) page of the Cluster Configuration Guide.

To encrypt cluster management communication, use the **Cluster** > **General Setup** settings page to select which certificate to use for administrative TLS.

Make sure your administrative machines meet the cluster's [encryption standards](supported-ciphers.md).

> [!Note]
> Cloud service access keys are stored by using the **Cloud Credentials** configuration page. The [Add a core filer](add-storage.md#add-a-core-filer) section above shows an example; read the Cluster Configuration Guide [Cloud Credentials](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_cloud_credentials.html) section for details.

## Configure DNS for load balancing

This section explains the basics of configuring a round-robin DNS (RRDNS) system to distribute client load among all client-facing IP addresses in your FXT Edge Filer cluster.

### Decide whether or not to use DNS

Load balancing is always recommended, but you don't have to always use DNS. For example, with some types of client workflows it might make more sense to use a script to assign cluster IP addresses evenly among clients when they mount the cluster. Some methods are described in [Mount the cluster](mount-clients.md).

Keep these things in mind when deciding whether or not to use a DNS server:

* If your system is accessed by NFS clients only, DNS is not required. It is possible to specify all network addresses by using numeric IP addresses.

* If your system supports SMB (CIFS) access, DNS is required, because you must specify a DNS domain for the Active Directory server.

* DNS is required if you want to use Kerberos authentication.

### Round-robin DNS configuration details

A round-robin DNS (RRDNS) system automatically routes client requests among multiple addresses.

To set this system up, you need to customize the DNS server's configuration file so that when it gets mount requests to the FXT Edge Filer's main domain address, it assigns the traffic among all of the cluster's mount points. Clients mount the cluster using its domain name as the server argument, and are routed to the next mount IP automatically.

There are two main steps to configure RRDNS:

1. Modify your DNS server’s ``named.conf`` file to set cyclic order for queries to your FXT cluster. This option causes the server to cycle through all of the available IP values. Add a statement like the following:

   ```bash
   options {
       rrset-order {
           class IN A name "fxt.contoso.com" order cyclic;
       };
   };
   ```

1. Configure A records and pointer (PTR) records for each available IP address as in the following example.

   These ``nsupdate`` commands provide an example of configuring DNS correctly for an Azure FXT Edge Filer cluster with the domain name fxt.contoso.com and three mount addresses (10.0.0.10, 10.0.0.11, and 10.0.0.12):

   ```bash
   update add fxt.contoso.com. 86400 A 10.0.0.10
   update add fxt.contoso.com. 86400 A 10.0.0.11
   update add fxt.contoso.com. 86400 A 10.0.0.12
   update add client-IP-10.contoso.com. 86400 A 10.0.0.10
   update add client-IP-11.contoso.com. 86400 A 10.0.0.11
   update add client-IP-12.contoso.com. 86400 A 10.0.0.12
   update add 10.0.0.10.in-addr.arpa. 86400 PTR client-IP-10.contoso.com
   update add 11.0.0.10.in-addr.arpa. 86400 PTR client-IP-11.contoso.com
   update add 12.0.0.10.in-addr.arpa. 86400 PTR client-IP-12.contoso.com
   ```

   These commands create an A record for each of the cluster's mount addresses, and also set up pointer records to support reverse DNS checks appropriately.

   The diagram below shows the basic structure of this configuration.

   :::image type="complex" source="media/round-robin-dns-diagram-fxt.png" alt-text="Diagram showing client mount point DNS configuration.":::
   <The diagram shows connections among three categories of elements: the single FXT Edge Filer cluster domain name (at the left), three IP addresses (middle column), and three internal-use reverse DNS client interfaces (right column). A single oval at the left labeled "fxt.contoso.com" is connected by arrows pointing toward three ovals labeled with IP addresses: 10.0.0.10, 10.0.0.11, and 10.0.0.12. The arrows from the fxt.contoso.com oval to the three IP ovals are labeled "A". Each of the IP address ovals is connected by two arrows to an oval labeled as a client interface - the oval with IP 10.0.0.10 is connected to "client-IP-10.contoso.com", the oval with IP 10.0.0.11 is connected to "client-IP-11.contoso.com", and the oval with IP 10.0.0.12 is connected to "client-IP-11.contoso.com". The connections between the IP address ovals and the client interface ovals are two arrows: one arrow labeled "PTR" that points from the IP address oval to the client interface oval, and one arrow labeled "A" that points from the client interface oval to the IP address oval.>
:::image-end:::

After the RRDNS system is configured, tell your client machines to use it to resolve the FXT cluster address in their mount commands.

### Enable DNS in the cluster

Specify the DNS server that the cluster uses in the **Cluster** > **Administrative Network** settings page. Settings on that page include:

* DNS server address
* DNS domain name
* DNS search domains

For more details, read [DNS Settings](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_admin_network.html#gui-dns) in the Cluster Configuration Guide.

## Next steps

This is the last basic configuration step for the Azure FXT Edge Filer cluster.

* Learn about the system's LEDs and other indicators in [Monitor hardware status](monitor.md).
* Learn more about how clients should mount the FXT Edge Filer cluster in [Mount the cluster](mount-clients.md).
* For more information about operating and managing an FXT Edge Filer cluster, see the [Cluster Configuration Guide](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/ops_conf_index.html).
