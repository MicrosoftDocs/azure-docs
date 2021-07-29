---
title: Load balance client connections to HPC Cache
description: How to configure a DNS server for round-robin load balancing for Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 07/29/2021
ms.author: v-erkel
---

# Load balance HPC Cache traffic

This article explains some basic methods for balancing client traffic to all the mount points on your Azure HPC Cache.

Your cache has at least three different IP addresses. Caches with large throughput values have up to 12. <!-- xxx check what's our maximum number of nodes? I think it's one IP per node. --> It's important to use all of the IP addresses to get the full benefits of Azure HPC Cache.

There are various options for load-balancing your client mounts:

* Manually choose a different mount IP for each client
* Include IP address rotation in your client mounting scripts
* Configure a DNS system to automatically route client requests among all the available addresses (round-robin DNS)

The right load-balancing system for you depends on the complexity of your workflow, the number of IP addresses in your cache, and a large number of other factors. Consult your Azure advisor if you need help deciding <!-- xxx something xxx -->

## Assign IPs manually

Your cache's mount IP addresses are shown on the cache **Overview** and **Mount instructions** pages in the Azure portal, and on the success message that prints when you create a cache with Azure CLI or PowerShell.

You can use the **Mount instructions** page to generate a customized mount command for each client. Select all of the  **Cache mount address** values when creating multiple commands.

Read [Mount the Azure HPC Cache](hpc-cache-mount.md) for details.

## Use a load-balancing script

There are several ways to programmatically randomize clients among the available IP addresses.

This example script uses client IP addresses as a randomizing element to distribute clients to all of the HPC Cache's available IP addresses.

xxx start here xxx 

```bash
function mount_round_robin() {
    # to ensure the nodes are spread out somewhat evenly the default
    # mount point is based on this node's IP octet4 % vFXT node count.
    declare -a AVEREVFXT_NODES="($(echo ${NFS_IP_CSV} | sed "s/,/ /g"))"
    OCTET4=$((`hostname -i | sed -e 's/^.*\.\([0-9]*\)/\1/'`))
    DEFAULT_MOUNT_INDEX=$((${OCTET4} % ${#AVEREVFXT_NODES[@]}))
    ROUND_ROBIN_IP=${AVEREVFXT_NODES[${DEFAULT_MOUNT_INDEX}]}

    DEFAULT_MOUNT_POINT="${BASE_DIR}/default"

    # no need to write again if it is already there
    if ! grep --quiet "${DEFAULT_MOUNT_POINT}" /etc/fstab; then
        echo "${ROUND_ROBIN_IP}:${NFS_PATH}    ${DEFAULT_MOUNT_POINT}    nfs hard,proto=tcp,mountproto=tcp,retry=30 0 0" >> /etc/fstab
        mkdir -p "${DEFAULT_MOUNT_POINT}"
        chown nfsnobody:nfsnobody "${DEFAULT_MOUNT_POINT}"
    fi
    if ! grep -qs "${DEFAULT_MOUNT_POINT} " /proc/mounts; then
        retrycmd_if_failure 12 20 mount "${DEFAULT_MOUNT_POINT}" || exit 1
    fi
}
```



configuring a DNS system for load balancing client traffic to your Azure HPC Cache.

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
