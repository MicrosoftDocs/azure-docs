---
title: Azure CycleCloud Cluster Configuration Reference
description: Read reference information about configuring clusters in Azure CycleCloud. Configuration objects define the configurable properties subordinate to node and nodearray.
author: adriankjohnson
ms.date: 06/29/2025
ms.author: adjohnso
---

# Cluster configuration

Configuration objects are rank 3 and subordinate to `node` and `nodearray`. These objects define the configurable properties for the configuration code that runs on the [nodes](node-nodearray-reference.md) and [CycleCloud Project](~/articles/cyclecloud/how-to/projects.md) configurations.

## Object attributes

Configuration object attributes behave like other objects but provide nested definitions. Internally, CycleCloud merges the configuration sections, so you can have any number of sections.

You don't need quotes for strings or for boolean expressions, true or false.

``` ini
[[[configuration my-project]]]
Attribute1 = Value1
Attribute2 = Value2
KeyAttribute3.Attribute3 = true

[[[configuration cyclecloud.mounts.mount1]]]
Attribute1 = Value1
```

## Supported configurations

CycleCloud supports several default configuration objects. You find these supported objects under the name `cyclecloud`.

### `[[[configuration cyclecloud]]]`

CycleCloud supports the parameterized configuration of many system services.

::: moniker range="=cyclecloud-7"
| Attribute | Type | Description |
| --------- | ---- | ----------- |
| maintenance_converge.enabled  | Boolean | CycleCloud nodes reconfigure every 20 minutes to ensure they're in the correct state. There are times when you might not want this default behavior, such as when you're manually testing and updating the configuration on a node. Set this value to false to make the node configure itself only once. Default: `true` |
| node.prevent_metadata_access | Boolean | Prevents users, other than the root user or cyclecloud user, from accessing the VM metadata from the node. CycleCloud applies these access rules in `iptables`. Default: `true`
| timezone | String | Change the timezone for a node by setting this attribute to any valid timezone string, such as `PST` or `EST`. Default: `UTC` |
| ntp.disabled | Boolean | Opt out of the NTP time service by setting `true`. Default: `false` | 
| ntp.servers | List (String) | A list of NTP servers to use. Default: `pool.ntp.org` |
| keepalive.timeout | Integer | The number of seconds to keep a node "alive" if it doesn't finish installing or configuring software. Default: `14400` (4 hours) |
| discoverable | Boolean | Whether other nodes started by CycleCloud can "discover" (search for) this node. Default: `false` |
| autoscale.forced_shutdown_timeout  | Integer   | The amount of time in minutes before a forced shutdown occurs if autoscale can't scale the node down successfully. Default: `15`  |
| security.limits  | Integer | Linux only. The limits to apply to the node. You can specify domain, type, and item for any [valid value](https://linux.die.net/man/5/limits.conf). Defaults: `security.limits.*.hard.nofile = 524288` and `security.limits.*.soft.nofile = 1048576` |
| mounts | Nested  | For [NFS exporting and mounting](~/articles/cyclecloud/how-to/mount-fileserver.md) and volume mounting.  |
| selinux.policy  | String  | Linux only. [Bypass an enforced `selinux` policy](~/articles/cyclecloud/how-to/selinux.md) for custom images. The policy is already disabled on core CycleCloud images. |
| install_epel | Boolean | Add the extended packages repo for yum on RedHat variant image.  Default: `true` |
| disable_rhui | Boolean | Opt-out of Red Hat repository configs. Default : `false` |
| ganglia.install | Boolean | Opt-out of ganglia installation by setting `false`. Default: `true` |
| fail2ban.enabled | Boolean | Opt-out of fail2ban installation by setting `false`. Default: `true` |
| dns.domain | String | Use nsupdate to force a dynamic DNS record update. This setting is useful only when allowed by DNS policy, and the cluster is using a DNS server that allows dynamic updates. Default: `nil` |
| dns.alias | String | Use nsupdate to force a dynamic DNS record update. This value is useful only when the DNS policy allows it and the cluster uses a DNS server that allows dynamic updates. Default: `nil` |
| replace_sudoers | Boolean | Allow CycleCloud to manage the sudoers configuration. Disabling this setting can interfere with user or scheduler services. Default: `true` | 
::: moniker-end

::: moniker range=">=cyclecloud-8"
| Attribute | Type | Description |
| --------- | ---- | ----------- |
| keepalive.timeout | Integer | The amount of time in seconds to keep a node "alive" if it doesn't finish installing or configuring software. Default: `14400` (4 hours) |
| discoverable | Boolean | Whether or not other nodes that CycleCloud starts can "discover" (search for) this node. Default: `false` |
| security.limits  | Integer | Linux only. The limits to apply to the node. You can specify the domain, type, and item for any [valid value](https://linux.die.net/man/5/limits.conf). Defaults: `security.limits.*.hard.nofile = 524288` and `security.limits.*.soft.nofile = 1048576` |
| mounts | Nested  | For [NFS exporting and mounting](~/articles/cyclecloud/how-to/mount-fileserver.md) and volume mounting.  |
| selinux.policy  | String  | Linux only. [Bypass an enforced `selinux` policy](~/articles/cyclecloud/how-to/selinux.md) on cluster instances. Default: `nil` |
| dns.domain | String | Use `nsupdate` to force a dynamic DNS record update. This update is useful only when DNS policy allows it and the cluster uses a DNS server that permits dynamic updates. Default: `nil` |
| dns.alias | String | Use `nsupdate` to force a dynamic DNS record update. This update is useful only when DNS policy allows it and the cluster uses a DNS server that permits dynamic updates. Default: `nil` |
| samba.enabled | Boolean | Linux only. Installs Samba on a filer for use with Windows execute nodes. Default: `false` |
::: moniker-end

### `[[[configuration cyclecloud.cluster]]]`

The CycleCloud `cluster` namespace holds configurations for distributed services and clustered applications.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| autoscale.idle_time_after_jobs | Integer | Specifies the time in seconds that nodes can be idle after running jobs before they're terminated. Default: `300`. |
| autoscale.idle_time_before_jobs | Integer | Specifies the time in seconds that nodes can be idle before running jobs before they're terminated. Default: `1800`. |
| autoscale.stop_interval | Integer | Sets the time delay in seconds between runs of auto-stop checks. Default: `60`. |
| autoscale.use_node_groups | Boolean | Enables grouped nodes, which is equivalent to placement groups. This setting affects only *PBSPro* and *Grid Engine* clusters. Default: `true`. |

### `[[[configuration cyclecloud.hosts.standalone_dns]]]`

CycleCloud configures the */etc/hosts* file to include a large set of hosts, so forward and reverse name resolution works.  
These configurations replace DNS on the individual nodes.  
Because the configurations aren't managed centrally, they're called stand-alone DNS.  

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| enabled | Boolean | Enable management of the *etc* hosts file. Default: `true`.
| alt_suffix | String | Override the default domain name of the VNET. Example: `contoso.com`
| subnets | List (String) | List of CIDR blocks for extended standalone name resolution.

By default, CycleCloud checks the network interface and builds the _/etc/hosts_ file to include hosts in the subnet mask.  
You can add extra ranges with the `subnets` attribute.

``` ini
[[[configuration cyclecloud.hosts.standalone_dns]]]
alt_suffix = my-domain.local
subnets = 10.0.1.0/24, 10.0.5.0/24
```

To override and disable the standalone service, use the following code:

``` ini
[[[configuration ]]]
cyclecloud.hosts.standalone_dns.enabled = false
```

### `[[[configuration cyclecloud.mounts]]]`

Mounts are an important part of the CycleCloud configuration. Each named mount section matches an entry in _/etc/fstab_.

Here's an example of a mount section named `primary`.

``` ini
  [[[configuration cyclecloud.mounts.primary]]]
    type = nfs
    mountpoint = /usr/share/lsf
    export_path = /mnt/raid/lsf
    options = hard,proto=tcp,mountproto=tcp,retry=30,actimeo=3600,nolock
    address = 10.0.0.14
```

> [!IMPORTANT]
> The mount section name matches the `mount` attribute of a `[[[volume]]]` object.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| type  | String | Set the type attribute to `nfs` for all NFS exports to differentiate from volume mounts and other shared filesystem types. |
| export_path | String | The location of the export on the NFS filer. If you don't specify an `export_path`, the mount's `mountpoint` serves as the `export_path`. |
| fs_type | String | Type of filesystem to use. For example, `ext4` or `xfs`. |
| mountpoint  | String  | The location where the system mounts the filesystem after it applies any extra configuration. If the directory doesn't exist, the system creates it. |
| cluster_name  | String | The name of the CycleCloud cluster that exports the filesystem. If you don't set this value, the system uses the node's local cluster. |
| address  | String | The explicit hostname or IP address of the filesystem. If you don't set this value, the search process tries to find the filesystem in a CycleCloud cluster. |
| options | String | Any non-default options to use when mounting the filesystem. |
| disabled | Boolean | If set to `true`, the node doesn't mount the filesystem. |
| raid_level | Integer | The type of RAID configuration to use when you're using multiple devices or volumes. The default value is `0`, which means RAID0. You can use other RAID levels like `1` or `10`. |
| raid_device_symlink | String | When you create a raid device, specify this attribute to create a symbolic link to the raid device. By default, this attribute isn't set and therefore no symlink is created. Set this attribute if you need access to the underlying raid device. |
| devices  | List (String) | List of devices that compose the `mountpoint`. In general, don't specify this parameter (as CycleCloud sets it for you based on [[[volume]]] sections), but you can manually specify the devices if you want. |
| vg_name | String | Devices are configured on Linux using the Logical Volume Manager (LVM). The volume group name is automatically assigned, but you can set this attribute to use a specific name. The default is `cyclecloud-vgX`, where X is an automatically assigned number. |
| lv_name | String | Devices are configured on Linux using the Logical Volume Manager (LVM). The system automatically assigns this value, so you don't need to specify it. If you want to use a custom logical volume name, specify it with this attribute. Defaults to `lv0`. |
| order | Integer | Specify an order to control the sequence in which mountpoints are mounted. The default order value for all mountpoints is 1000, except for 'ephemeral' which is 0 (ephemeral is always mounted first by default). You can override this behavior on a case-by-case basis as needed. |
| encryption.bits | Integer | The number of bits to use when encrypting the filesystem. Standard values are `128` or `256` bit AES encryption. You must provide this value if you want encryption. |
| encryption.key | String | The encryption key to use when encrypting the filesystem. If you omit this key, the system generates a random 2048-bit key. The automatically generated key is useful when you're encrypting disks that don't persist between reboots (for example, encrypting ephemeral devices). |
| encryption.name | String | The name of the encrypted filesystem, used when saving encryption keys. Defaults to `cyclecloud_cryptX`, where X is an automatically generated number. |
| encryption.key_path | String | The location of the file where the key is written on disk. Defaults to `/root/cyclecloud_cryptX.key`, where X is an automatically generated number. |

### `[[[configuration cyclecloud.exports]]]`

Similar to mounts, you can configure CycleCloud nodes as NFS servers by enabling the server recipe. The export section corresponds to the _/etc/exports_ entry.

Here's an example of using exports with an export object named `nfs_data`:

``` ini
[[[configuration cyclecloud.exports.nfs_data]]]
type = nfs
export_path = /mnt/exports/nfs_data
writable = false
```

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| type  | String | *REQUIRED* Set the type attribute to `nfs` for all NFS exports to differentiate from other shared filesystem types. |
| export_path | String | Set the local path to export as an NFS filesystem. If the directory doesn't exist, CycleCloud creates it. |
| owner | String | Set the user account that owns the exported directory. |
| group | String | Set the group of the user that owns the exported directory. |
| mode | String | Set the default filesystem permissions on the exported directory. |
| network | String | The network interface for exporting the directory. Defaults to all: `*`. |
| sync | Boolean | Synchronous or asynchronous export option. Defaults to `true`. |
| writable | Boolean | The read-only or read/write export option for the filesystem. Defaults to `true`. |
| options | String | Any non-default options for exporting the filesystem. |
