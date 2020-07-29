---
title: Upgrade or Migrate
description: Learn about upgrading to a newer version of Azure CycleCloud or migrating to a new host. You can upgrade in place as new versions become available.
author: mvrequa
ms.date: 05/27/2020
ms.author: mirequa
---

# Upgrading CycleCloud

It is possible to upgrade the Azure CycleCloud application in place as new versions become available.

::: moniker range="=cyclecloud-8"

## CycleCloud 8

CycleCloud 8 has a different package name `cyclecloud8` so as to prevent accidental upgrade from one major version to the next. There are incompatible changes between major versions. One may not install both `cyclecloud` and `cyclecloud8` on the same machine.

The supported upgrade path is to remove the `cyclecloud` package and install `cyclecloud8`. Your data and configuration directories within `/opt/cycle_server` will be preserved upon removal of the `cyclecloud` package. Upon installing `cyclecloud8`, the installation scripts will detect existing data and configuration then run through any upgrade migrations automatically.
::: moniker-end

## Upgrading on Debian or Ubuntu

Follow the instructions in [Installing on Debian or Ubuntu](./install-manual.md#installing-on-debian-or-ubuntu) to configure the Microsoft apt repository (if it was not already done during installation).

::: moniker range="<=cyclecloud-7"
Upgrade the CycleCloud package using:

```bash
sudo apt update
sudo apt -y upgrade cyclecloud
```
::: moniker-end

::: moniker range="=cyclecloud-8"
To perform a supported indirect upgrade from CycleCloud 7 to CycleCloud 8:

```bash
sudo apt update
sudo apt -y remove cyclecloud
sudo apt -y install cyclecloud8
```

To perform a direct upgrade of one version of CycleCloud 8 to a newer version:
```bash
sudo apt update
sudo apt -y upgrade cyclecloud8
```
::: moniker-end

## Upgrading on Enterprise Linux (RHEL) clones

Follow the instructions in [Installing on Enterprise Linux (RHEL) clones](./install-manual.md#installing-on-enterprise-linux-rhel-clones) to configure the Microsoft yum repository (if it was not already done during installation).

::: moniker range="<=cyclecloud-7"
Upgrade the CycleCloud package using:

```bash
sudo yum -y upgrade cyclecloud
```
::: moniker-end

::: moniker range="=cyclecloud-8"
To perform a supported indirect upgrade from CycleCloud 7 to CycleCloud 8:

```bash
sudo yum -y remove cyclecloud
sudo yum -y install cyclecloud8
```

To perform a direct upgrade of one version of CycleCloud 8 to a newer version:
```bash
sudo yum -y upgrade cyclecloud8
```
::: moniker-end

::: moniker range="<=cyclecloud-7"
## Upgrading from the Microsoft Download center

In environments where the Microsoft package repositories are unavailable or disallowed by policy, the CycleCloud packages may be downloaded and installed manually.  

CycleCloud is released via [Download Center](https://www.microsoft.com/download/details.aspx?id=57182) as either a Debian or RPM package.

To upgrade, copy the installer to the host running CycleCloud and run the platform-specific package upgrade command.

For Debian, use:

```bash
dpkg -i cyclecloud_7.9.2-amd64.deb
```

For RedHat variants, use:

```bash
rpm -U cyclecloud_7.9.2.rpm
```
::: moniker-end

> [!IMPORTANT]
> Upgrading may have undesired consequences on your CycleCloud environment and any running clusters. Microsoft recommends testing all upgrades in a development or staging environment to minimize risk on production workloads.

## Common Upgrade Questions

**Will my old templates be compatible with this new version?**

Templates should be compatible for minor version upgrades. Upgrades between major version releases may require you to pin clusters to the older version your templates are designed for.

**Is there any downtime associated to the upgrade?**

CycleCloud will be down for a bit while the upgrade occurs. The upgrade typically takes 2-3 minutes.

**Can I upgrade while clusters are running?**

Yes, but the clusters will not be able to communicate with CycleCloud while it's down. This means that autoscale, termination requests, etc will not work until the upgrade is complete.

## Migrate CycleCloud to a New Host

The first installation of CycleCloud configures the service user and startup configuration. These will be absent if the installation data is simply
copied from host to host. The following instructions describe how to migrate a CycleCloud installation to another host.

### A Note on Running Clusters

Clusters managed by CycleCloud are sending information to CycleCloud via HTTPS and AMQP. The access information to setup these communication protocols are received by the nodes at launch time. So if the hostname or IP address of CycleCloud changes while nodes are running then communication might be broken. It's recommended to terminate all clusters before migrating.

One exception to this is nodes that are configured with `IsReturnProxy = true`. In this case, the channels of communication are initiated outbound from CycleCloud and will be automatically re-established after migration.

To migrate a CycleCloud host:

1. Stop cycle_server on the source host: `service cycle_server stop` (LSB init scripts) or `systemctl stop cycle_server` (*systemd* init)
2. Run `groupadd cycle_server` and `useradd cycle_server` on the target host. Use the original GID and UID if possible.
3. Install openjdk version 8 on the target host by running `apt-get -y install openjdk-8-jre-headless` or `yum install -y java-1.8.0-openjdk`
4. Transfer to the target host using `rsync -a /opt/cycle_server username@remote_host:/opt/cycle_server` or another meta-data preserving transfer tool.
5. Enable the LSB init or *systemd* init for CycleCloud by running `/opt/cycle_server/util/autostart.sh on`
6. Start the CycleCloud service with either `service cycle_server start` or `systemctl start cycle_server`

The instructions can be simplified if, instead of migrating to a new host, the installation migration is from a non-standard directory to _/opt/cycle_server_:

1. Stop cycle_server on the source host: `service cycle_server stop` (LSB init scripts) or `systemctl stop cycle_server` (*systemd* init)
2. Transfer to the default location `rsync -a /usr/share/hpc/cycle_server /opt/cycle_server`.
3. Enable the LSB init or *systemd* init for CycleCloud by running `/opt/cycle_server/util/autostart.sh on`
4. Start the CycleCloud service with either `service cycle_server start` or `systemctl start cycle_server`

After migrating to a new host, or migrating to the default installation directory, upgrades can be performed as described in the first section.
