---
title: Azure CycleCloud Upgrade or Migrate | Microsoft Docs
description: Upgrading to a newer CycleCloud version or migrate to a new host.
services: azure cyclecloud
author: mvrequa
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: mirequa
---

# Upgrade CycleCloud

It is possible to upgrade the CycleCloud application in-place as new versions become
available. CycleCloud versions _7.5.0_ and later are released via
[Download Center](https://www.microsoft.com/en-us/download/details.aspx?id=57182)
as either a Debian or RPM package.

To upgrade, copy the installer to the host running CycleCloud and run the platform-specific
package upgrade command:

For Debian:

```bash
dpkg -i cyclecloud_7.5.2-amd64.deb
```

For RedHat-variant:

```bash
rpm -U cyclecloud_7.5.2.rpm
```

> [!NOTE]
> Legacy versions of CycleCloud ( < 7.5.0) allowed the installation directory to be configured. If CycleCloud is installed in a directory other than _/opt/cycle_server_ please follow the local migration steps below.

## Migrate CycleCloud to a New Host

While the first time installation of CycleCloud configures the service user and
startup configuration, these will be absent if the installation data is simply
copied from host-to-host.

These instructions describe how to migrate a CycleCloud installation to another
host.

### A Note on Running Clusters

Clusters managed by CycleCloud are sending information to CycleCloud via HTTPs
and AMQP. The access information to setup these communication protocols are received
by the nodes at launch time. So if the hostname or IP address of CycleCloud changes
while nodes are running then communication might be broken. It's recommended to
terminate all clusters before migrating.

One exception to this is nodes that are configured with `IsReturnProxy = true`.
In this case, the channels of communication are initiated outbound from CycleCloud
and will be re-established after migration automatically.

To migrate a CycleCloud host:
1. Stop cycle_server on the source host: `service cycle_server stop` (LSB init scripts) or `systemctl stop cycle_server` (*systemd* init)
2. Run `groupadd cycle_server` and `useradd cycle_server` on the target host. Use the original GID and UID if possible.
1. Install openjdk version 8 on the target host by running `apt-get -y install openjdk-8-jre-headless` or `yum install -y java-1.8.0-openjdk`
1. Transfer to the target host using `rsync -a /opt/cycle_server username@remote_host:/opt/cycle_server` or another meta-data preserving transfer tool.
1. Enable the LSB init or *systemd* init for CycleCloud by running `/opt/cycle_server/util/autostart.sh on`
1. Start the CycleCloud service with either `service cycle_server start` or `systemctl start cycle_server`

The instructions are shortened if instead of migrating to a new host
it's intended to migrate the installation from a non-standard
directory to _/opt/cycle_server_:
1. Stop cycle_server on the source host: `service cycle_server stop` (LSB init scripts) or `systemctl stop cycle_server` (*systemd* init)
1. Transfer to the default location `rsync -a /usr/share/hpc/cycle_server /opt/cycle_server`.
1. Enable the LSB init or *systemd* init for CycleCloud by running `/opt/cycle_server/util/autostart.sh on`
1. Start the CycleCloud service with either `service cycle_server start` or `systemctl start cycle_server`

After migrating to a new host, or migrating to the default installation
directory, upgrades can be performed as described in the first section.

