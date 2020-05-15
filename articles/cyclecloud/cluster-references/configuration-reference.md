---
title: Azure CycleCloud Cluster Template Reference
description: Configuration reference for cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 03/10/2020
ms.author: adjohnso
---

# Cluster Configuration

Configuration objects are rank 3, and subordinate to `node` and `nodearray`. The configuration object define the configurable properties for the configuration code that runs on the [nodes](node-nodearray-reference.md) and [CycleCloud Project](~/how-to/projects.md) configurations.

## Object Attributes

Configuration object attributes behave like other objects, but are extended to provide nested definitions. Internally, the configuration sections are merged, so there can be an arbitrary number of sections.

No quotes are necessary for strings or for boolean expressions, true or false.

``` ini
[[[configuraton my-project]]]
Attribute1 = Value1
Attribute2 = Value2
KeyAttribute3.Attribute3 = true

[[[configuraton cyclecloud.mounts.mount1]]]
Attribute1 = Value1
```

## Supported Configurations

CycleCloud supports a number of default configuration objects. These supported objects are contained under the name `cyclecloud`.

### `[[[configuration cyclecloud]]]`

CycleCloud supports the parameterized configuration of many system services.

::: moniker range="=cyclecloud-7"
| Attribute | Type | Description |
| --------- | ---- | ----------- |
| maintenance_converge.enabled  | Boolean | CycleCloud nodes are reconfigured every 20 minutes to ensure they are in the correct state. There are times when you may not want this to be the default behavior such as when you are manually testing and updating the configuration on a node. Setting this value to false will make the node configure itself only once. Default: `true` |
| node.prevent_metadata_access | Boolean | Prevents users, other than the root user or cyclecloud user from accessing the VM metadata from the node. These access rules are applied in `iptables`. Default: `true`
| timezone | String | The timezone for a node can be changed by setting this attribute to any valid timezone string, for example `PST`, `EST`. Default: `UTC` |
| ntp.disabled | Boolean | Opt-out of ntp time service by setting `true`. Default: `false` | 
| ntp.servers | List (String) | A list of NTP servers to use. Default: `pool.ntp.org` |
| keepalive.timeout | Integer | The amount of time in seconds to keep a node "alive" if it has not finished installing/configuring software. Default: `14400` (4 hours) |
| discoverable | Boolean | Whether or not this node can be "discovered" (searched for) by other nodes started by CycleCloud. Default: `false` |
| autoscale.forced_shutdown_timeout  | Integer   | The amount of time (in minutes) before a forced shutdown occurs if autoscale cannot scale the node down successfully. Default: `15`  |                                                                                             |
| security.limits  | Integer | Linux only. The limits to apply to the node. Domain, type, and item can be specified for any [valid value](https://linux.die.net/man/5/limits.conf) defined. Defaults: `security.limits.\*.hard.nofile = 524288` and `security.limits.\*.soft.nofile = 1048576` |
| mounts | Nested  | For [NFS exporting and mounting](~/how-to/mount-fileserver.md) and volume mounting.  |
| selinux.policy  | String  | Linux only. [Bypass an enforced `selinux` policy](~/how-to/selinux.md) for custom images. Already disabled on core CycleCloud images. |
| install_epel | Boolean | Add the extended packages repo for yum on RedHat variant image.  Default: `true` |
| disable_rhui | Boolean | Opt-out of Red Hat repository configs. Default : `false` |
| ganglia.install | Boolean | Opt-out of ganglia installation by setting `false`. Default: `true` |
| fail2ban.enabled | Boolean | Opt-out of fail2ban installation by setting `false`. Default: `true` |
| dns.domain | String | Use nsupdate to force a dynamic DNS record update. Useful ONLY when allowed by DNS policy, and the cluster is using a DNS server that allows dynamic updates. Default: `nil` |
| dns.alias | String | Use nsupdate to force a dynamic DNS record update. Useful ONLY when allowed by DNS policy, and the cluster is using a DNS server that allows dynamic updates. Default: `nil` |
| replace_sudoers | Boolean | Allow Cyclecloud to managed the sudoers configuration. Disabling can interfere with user or scheduler services. Default: `true` | 
::: moniker-end

::: moniker range=">=cyclecloud-8"
| Attribute | Type | Description |
| --------- | ---- | ----------- |
| keepalive.timeout | Integer | The amount of time in seconds to keep a node "alive" if it has not finished installing/configuring software. Default: `14400` (4 hours) |
| discoverable | Boolean | Whether or not this node can be "discovered" (searched for) by other nodes started by CycleCloud. Default: `false` |
| security.limits  | Integer | Linux only. The limits to apply to the node. Domain, type, and item can be specified for any [valid value](https://linux.die.net/man/5/limits.conf) defined. Defaults: `security.limits.\*.hard.nofile = 524288` and `security.limits.\*.soft.nofile = 1048576` |
| mounts | Nested  | For [NFS exporting and mounting](~/how-to/mount-fileserver.md) and volume mounting.  |
| selinux.policy  | String  | Linux only. [Bypass an enforced `selinux` policy](~/how-to/selinux.md) on cluster instances. Default: `nil` |
| dns.domain | String | Use nsupdate to force a dynamic DNS record update. Useful ONLY when allowed by DNS policy, and the cluster is using a DNS server that allows dynamic updates. Default: `nil` |
| dns.alias | String | Use nsupdate to force a dynamic DNS record update. Useful ONLY when allowed by DNS policy, and the cluster is using a DNS server that allows dynamic updates. Default: `nil` |
| samba.enabled | Boolean | Linux only. Installs Samba on a filer for use with Windows execute nodes. Default: `false` |
::: moniker-end

### `[[[configuration cyclecloud.cluster]]]`

CycleCloud `cluster` namespace contains configurations for distributed services and clustered applications.  

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| autoscale.idle_time_after_jobs | Integer | Nodes are terminated if they are idle for specified time (in seconds) after they have run jobs. Default: `1800` |
| autoscale.idle_time_before_jobs | Integer | Nodes are terminated if they are idle for specified time (in seconds) before they have run jobs. Default: `1800` |
| autoscale.stop_interval | Integer | Time delay between runs of auto-stop checks (in seconds). Default: `60`. |
| autoscale.use_node_groups | Boolean | Enable grouped nodes - equivalent to placement groups. Effects only *PBSPro* and *Grid Engine* clusters. Default: `true` |

### `[[[configuration cyclecloud.hosts.standalone_dns]]]`

CycleCloud will configure the */etc/hosts* file to contain a large set of hosts so that forward and reverse name resolution is functional.
These configurations act to operate as DNS replacement configured on the individual nodes, 
not centrally managed, therefore called stand-alone DNS. 

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| enabled | Boolean | Enable management of the etc hosts file. Default: `true`.
| alt_suffix | String | Override the default domain name of the VNET. Example: `contoso.com`
| subnets | List (String) | List of CIDR blocks for extended standalone name resolution.

By default, CycleCloud will inspect the network interface and compose the _/etc/hosts_ file to include hosts in the subnet mask. Additional ranges can be added using the `subnets` attribute.

``` ini
[[[configuration cyclecloud.hosts.standalone_dns]]]
alt_suffix = my-domain.local
subnets = 10.0.1.0/24, 10.0.5.0/24
```

To override and disable the standalone service:

``` ini
[[[configuration ]]]
cyclecloud.hosts.standalone_dns.enabled = false
```

### `[[[configuration cyclecloud.mounts]]]`

A significant subdomain of the cyclecloud configuration is mounts. Each named mount section corresponds to an entry in _/etc/fstab_.

An example of a mount section named `primary`.

``` ini
  [[[configuration cyclecloud.mounts.primary]]]
    type = nfs
    mountpoint = /usr/share/lsf
    export_path = /mnt/raid/lsf
    options = hard,proto=tcp,mountproto=tcp,retry=30,actimeo=3600,nolock
    address = 10.0.0.14
```

> [!IMPORTANT]
> The mount section name correlates to the `mount` attribute of a `[[[volume]]]` object.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| type  | String | The type attribute should be set to `nfs` for all NFS exports to differentiate from volume mounts and other shared filesystem types. |
| export_path | String | The location of the export on the NFS filer.  If an `export_path` is not specified, the `mountpoint` of the mount will be used as the `export_path`. |
| fs_type | String | Type of filesystem to use. E.g `ext4`, `xfs`. |
| mountpoint  | String  | The location where the filesystem will be mounted after any additional configuration is applied. If the directory does not already exist, it will be created. |
| cluster_name  | String | The name of the CycleCloud cluster which exports the filesystem.  If not set, the node's local cluster is assumed. |
| address  | String | The explicit hostname or IP address of the filesystem.  If not set, search will attempt to find the filesystem in a CycleCloud cluster. |
| options | String | Any non-default options to use when mounting the filesystem. |
| disabled | Boolean | If set to `true`, the node will not mount the filesystem. |
| raid_level | Integer | The type of RAID configuration to use when multiple devices/volumes are being used. Defaults to a value of `0`, meaning RAID0, but other raid levels can be used such as `1` or `10`.|
| raid_device_symlink | String | When a raid device is created, specifying this attribute will create a symbolic link to the raid device. By default, this attribute is not set and therefore no symlink is created. This should be set in cases where you need access to the underlying raid device. |
| devices  | List (String) | This is a list of devices that should compose the `mountpoint`. In general, this parameter shouldn't be specified (as CycleCloud will set this for you based on [[[volume]]] sections), but you can manually specify the devices if so desired. |
| vg_name | String | Devices are configured on Linux using the Logical Volume Manager (LVM). The volume group name will be automatically assigned, but in cases where a specific name is used, this attribute can be set. The default is set to `cyclecloud-vgX`, where X is an automatically assigned number. |
| lv_name | String | Devices are configured on Linux using the Logical Volume Manager (LVM). This value is automatically assigned and does not need specification, but if you want to use a custom logical volume name, it can be specified using this attribute. Defaults to `lv0`. |
| order | Integer | By specifying an order, you can control the order in which mountpoints are mounted. The default order value for all mountpoints is 1000, except for 'ephemeral' which is 0 (ephemeral is always mounted first by default). You can override this behavior on a case-by-case basis as needed. |
| encryption.bits | Integer | The number of bits to use when encrypting the filesystem. Standard values are `128` or `256` bit AES encryption. This value is required if encryption is desired. |
| encryption.key | String | The encryption key to use when encrypting the filesystem. If omitted, a random 2048 bit key will be generated. The automatically generated key is useful for when you are encrypting disks that do not persist between reboots (e.g. encrypting ephemeral devices). |
| encryption.name | String | The name of the encrypted filesystem, used when saving encryption keys. Defaults to `cyclecloud_cryptX`, where X is an automatically generated number. |
| encryption.key_path | String | The location of the file the key will be written on disk to. Defaults to `/root/cyclecloud_cryptX.key`, where X is a automatically generated number. |

### `[[[configuration cyclecloud.exports]]]`

Similar to mounts, CycleCloud nodes can be configured as NFS servers if the server recipe is enabled. Export section corresponds to _/etc/exports_ entry.

An example of using exports with an export object named `nfs_data`:

``` ini
[[[configuration cyclecloud.exports.nfs_data]]]
type = nfs
export_path = /mnt/exports/nfs_data
writable = false
```

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| type  | String | *REQUIRED* The type attribute must be set to `nfs` for all NFS exports to differentiate from other shared filesystem types. |
| export_path | String | The local path to export as an NFS filesystem. If the directory does not exist already, it will be created. |
| owner | String | The user account that should own the exported directory. |
| group | String | The group of the user that should own the exported directory. |
| mode | String | The default filesystem permissions on the exported directory. |
| network | String | The network interface on which the directory is exported. Defaults to all: `*`. |
| sync | Boolean | Synchronous/asynchronous export option. Defaults to `true`. |
| writable | Boolean | The ro/rw export option for the filesystem. Defaults to `true`. |
| options | String | Any non-default options to use when exporting the filesystem. |
