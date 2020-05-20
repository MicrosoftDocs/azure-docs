---
title: Troubleshoot Azure HPC Cache NFS storage targets
description: Tips to avoid and fix configuration errors and other problems that can cause failure when creating an NFS storage target
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 03/18/2020
ms.author: rohogue
---

# Troubleshoot NAS configuration and NFS storage target issues

This article gives solutions for some common configuration errors and other issues that could prevent Azure HPC Cache from adding an NFS storage system as a storage target.

This article includes details about how to check ports and how to enable root access to a NAS system. It also includes detailed information about less common issues that might cause NFS storage target creation to fail.

> [!TIP]
> Before using this guide, read [prerequisites for NFS storage targets](hpc-cache-prereqs.md#nfs-storage-requirements).

If the solution to your problem is not included here, please [open a support ticket](hpc-cache-support-ticket.md) so that Microsoft Service and Support can work with you to investigate and solve the problem.

## Check port settings

Azure HPC Cache needs read/write access to several UDP/TCP ports on the back-end NAS storage system. Make sure these ports are accessible on the NAS system and also that traffic is permitted to these ports through any firewalls between the storage system and the cache subnet. You might need to work with firewall and network administrators for your data center to verify this configuration.

The ports are different for storage systems from different vendors, so check your system's requirements when setting up a storage target.

In general, the cache needs access to these ports:

| Protocol | Port  | Service  |
|----------|-------|----------|
| TCP/UDP  | 111   | rpcbind  |
| TCP/UDP  | 2049  | NFS      |
| TCP/UDP  | 4045  | nlockmgr |
| TCP/UDP  | 4046  | mountd   |
| TCP/UDP  | 4047  | status   |

To learn the specific ports needed for your system, use the following ``rpcinfo`` command. This command  below lists the ports and formats the relevant results in a table. (Use your system's IP address in place of the *<storage_IP>* term.)

You can issue this command from any Linux client that has NFS infrastructure installed. If you use a client inside the cluster subnet, it also can help verify connectivity between the subnet and the storage system.

```bash
rpcinfo -p <storage_IP> |egrep "100000\s+4\s+tcp|100005\s+3\s+tcp|100003\s+3\s+tcp|100024\s+1\s+tcp|100021\s+4\s+tcp"| awk '{print $4 "/" $3 " " $5}'|column -t
```

Make sure that all of the ports returned by the ``rpcinfo`` query allow unrestricted traffic from the Azure HPC Cache's subnet.

Check these settings both on the NAS itself and also on any firewalls between the storage system and the cache subnet.

## Check root access

Azure HPC Cache needs access to your storage system's exports to create the storage target. Specifically, it mounts the exports as user ID 0.

Different storage systems use different methods to enable this access:

* Linux servers generally add ``no_root_squash`` to the exported path in ``/etc/exports``.
* NetApp and EMC systems typically control access with export rules that are tied to specific IP addresses or networks.

If using export rules, remember that the cache can use multiple different IP addresses from the cache subnet. Allow access from the full range of possible subnet IP addresses.

> [!NOTE]
> By default, Azure HPC Cache squashes root access. Read [Configure additional cache settings](configuration.md#configure-root-squash) for details.

Work with your NAS storage vendor to enable the right level of access for the cache.

### Allow root access on directory paths
<!-- linked in prereqs article -->

For NAS systems that export hierarchical directories, Azure HPC Cache needs root access to each export level.

For example, a system might show three exports like these:

* ``/ifs``
* ``/ifs/accounting``
* ``/ifs/accounting/payroll``

The export ``/ifs/accounting/payroll`` is a child of ``/ifs/accounting``, and ``/ifs/accounting`` is itself a child of ``/ifs``.

If you add the ``payroll`` export as an HPC cache storage target, the cache actually mounts ``/ifs/`` and accesses the payroll directory from there. So Azure HPC Cache needs root access to ``/ifs`` in order to access the ``/ifs/accounting/payroll`` export.

This requirement is related to the way the cache indexes files and avoids file collisions, using file handles that the storage system provides.

A NAS system with hierarchical exports can give different file handles for the same file if the file is retrieved from different exports. For example, a client could mount ``/ifs/accounting`` and access the file ``payroll/2011.txt``. Another client mounts ``/ifs/accounting/payroll`` and accesses the file ``2011.txt``. Depending on how the storage system assigns file handles, these two clients might receive the same file with different file handles (one for ``<mount2>/payroll/2011.txt`` and one for ``<mount3>/2011.txt``).

The back-end storage system keeps internal aliases for file handles, but Azure HPC Cache cannot tell which file handles in its index reference the same item. So it is possible that the cache can have different writes cached for the same file, and apply the changes incorrectly because it does not know that they are the same file.

To avoid this possible file collision for files in multiple exports, Azure HPC Cache automatically mounts the shallowest available export in the path (``/ifs`` in the example) and uses the file handle given from that export. If multiple exports use the same base path, Azure HPC Cache needs root access to that path.

## Enable export listing
<!-- link in prereqs article -->

The NAS must list its exports when the Azure HPC Cache queries it.

On most NFS storage systems, you can test this by sending the following query from a Linux client: ``showmount -e <storage IP address>``

Use a Linux client from the same virtual network as your cache, if possible.

If that command doesn't list the exports, the cache will have trouble connecting to your storage system. Work with your NAS vendor to enable export listing.

## Adjust VPN packet size restrictions
<!-- link in prereqs article and configuration article -->

If you have a VPN between the cache and your NAS device, the VPN might block full-sized 1500-byte Ethernet packets. You might have this problem if large exchanges between the NAS and the Azure HPC Cache instance do not complete, but smaller updates work as expected.

There isn't a simple way to tell whether or not your system has this problem unless you know the details of your VPN configuration. Here are a few methods that can help you check for this issue.

* Use packet sniffers on both sides of the VPN to detect which packets transfer successfully.
* If your VPN allows ping commands, you can test sending a full-sized packet.

  Run a ping command over the VPN to the NAS with these options. (Use your storage system's IP address in place of the *<storage_IP>* value.)

   ```bash
   ping -M do -s 1472 -c 1 <storage_IP>
   ```

  These are the options in the command:

  * ``-M do`` - Do not fragment
  * ``-c 1`` - Send only one packet
  * ``-s 1472`` - Set the size of the payload to 1472 bytes. This is the maximum size payload for a 1500-byte packet after accounting for the Ethernet overhead.

  A successful response looks like this:

  ```bash
  PING 10.54.54.11 (10.54.54.11) 1472(1500) bytes of data.
  1480 bytes from 10.54.54.11: icmp_seq=1 ttl=64 time=2.06 ms
  ```

  If the ping fails with 1472 bytes, there is probably a packet size problem.

To fix the problem, you might need to configure MSS clamping on the VPN to make the remote system properly detect the maximum frame size. Read the [VPN Gateway IPsec/IKE parameters documentation](../vpn-gateway/vpn-gateway-about-vpn-devices.md#ipsec) to learn more.

In some cases, changing the MTU setting for the Azure HPC Cache to 1400 can help. However, if you restrict the MTU on the cache you must also restrict the MTU settings for clients and back-end storage systems that interact with the cache. Read [Configure additional Azure HPC Cache settings](configuration.md#adjust-mtu-value) for details.

## Check for ACL security style

Some NAS systems use a hybrid security style that combines access control lists (ACLs) with traditional POSIX or UNIX security.

If your system reports its security style as UNIX or POSIX without including the acronym "ACL", this issue does not affect you.

For systems that use ACLs, Azure HPC Cache needs to track additional user-specific values in order to control file access. This is done by enabling an access cache. There isn't a user-facing control to turn on the access cache, but you can open a support ticket to request that it be enabled for the affected storage targets on your cache system.

## Next steps

If you have a problem that was not addressed in this article, [open a support ticket](hpc-cache-support-ticket.md) to get expert help.
