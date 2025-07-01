---
title: Upgrade or Migrate
description: Learn about upgrading to a newer version of Azure CycleCloud or migrating to a new host. You can upgrade in place as new versions become available.
author: mvrequa
ms.date: 07/01/2025
ms.author: mirequa
---

# Upgrading CycleCloud

You can upgrade the Azure CycleCloud application in place when new versions are available.

::: moniker range="=cyclecloud-8"

## CycleCloud 8

CycleCloud 8 uses a different package name, `cyclecloud8`, to prevent accidental upgrades between major versions. Major versions include incompatible changes. You can't install both `cyclecloud` and `cyclecloud8` on the same machine.

To upgrade, remove the `cyclecloud` package and install `cyclecloud8`. When you remove the `cyclecloud` package, you keep your data and configuration directories in `/opt/cycle_server`. When you install `cyclecloud8`, the installation scripts find your existing data and configuration and automatically handle any upgrade migrations.
::: moniker-end

To switch to Insiders builds, follow the steps in 
[Insiders Builds](./install-manual.md#insiders-builds) to add the Insiders repository. After that, use the upgrade commands in this article to upgrade to the latest Insiders build.

## Upgrading on Debian or Ubuntu

Follow the instructions in [Installing on Debian or Ubuntu](./install-manual.md#installing-on-debian-or-ubuntu) to configure the Microsoft apt repository (if you didn't already configure it during installation).

::: moniker range="<=cyclecloud-7"
Upgrade the CycleCloud package with the following command:

```bash
sudo apt update
sudo apt -y upgrade cyclecloud
```
:::

::: moniker range="=cyclecloud-8"
To upgrade from one version of CycleCloud 8 to a newer version, run the following command:
```bash
sudo apt update
sudo apt -y upgrade cyclecloud8
```

> [!TIP]
> To upgrade from CycleCloud 7 to CycleCloud 8, run the following command:

```bash
sudo apt update
sudo apt -y remove cyclecloud
sudo apt -y install cyclecloud8
```
:::

Removing `cyclecloud` doesn't remove the data. Installing `cyclecloud8` doesn't overwrite the data.

## Upgrading on Enterprise Linux (RHEL) clones

Follow the instructions in [Installing on Enterprise Linux (RHEL) clones](./install-manual.md#installing-on-enterprise-linux-rhel-clones) to configure the Microsoft yum repository (if you didn't already configure it during installation).

::: moniker range="<=cyclecloud-7"
Upgrade the CycleCloud package by running:

```bash
sudo yum -y upgrade cyclecloud
```
:::

::: moniker range="=cyclecloud-8"

To upgrade from one version of CycleCloud 8 to a newer version, run the following command:
```bash
sudo yum -y upgrade cyclecloud8
```

To upgrade from CycleCloud 7 to CycleCloud 8, run the following command:

```bash
sudo yum -y remove cyclecloud
sudo yum -y install cyclecloud8
```

Removing `cyclecloud` doesn't remove the data. Installing `cyclecloud8` doesn't overwrite the data.
:::

::: moniker range="<=cyclecloud-7"
## Upgrading from the Microsoft Download Center

If you can't access the Microsoft package repositories or your policy doesn't allow it, you can manually download and install the CycleCloud packages.

CycleCloud is available at the [Download Center](https://www.microsoft.com/download/details.aspx?id=57182) as either a Debian or RPM package.

To upgrade, copy the installer to the host running CycleCloud and run the platform-specific package upgrade command.

For Debian, use:

```bash
dpkg -i cyclecloud_7.9.2-amd64.deb
```

For RedHat variants, use:

```bash
rpm -U cyclecloud_7.9.2.rpm
```
::: 

> [!IMPORTANT]
> Upgrading CycleCloud might cause issues in your environment and affect any running clusters. To reduce risk for production workloads, Microsoft recommends testing all upgrades in a development or staging environment.

## Common upgrade questions

**Will my old templates work with this new version?**

Templates should work for minor version upgrades. For upgrades between major version releases, you might need to pin clusters to the older version that your templates are designed for.

**Is there any downtime during the upgrade?**

CycleCloud is unavailable while the upgrade happens. The upgrade usually takes 2-3 minutes.

**Can I upgrade while clusters are running?**

Yes, but clusters can't communicate with CycleCloud while it's down. This limitation means that autoscale, termination requests, and similar features don't work until the upgrade finishes.

## Migrate CycleCloud to a new host

The first installation of CycleCloud sets up the service user and startup configuration. If you just copy the installation data from one host to another, you don't get these settings. The following instructions explain how to migrate a CycleCloud installation to another host.

### Running clusters

Clusters that CycleCloud manages send information to CycleCloud through HTTPS and AMQP. The nodes get the access information to set up these communication protocols when they launch. If the hostname or IP address of CycleCloud changes while the nodes are running, communication might break. We recommend that you terminate all clusters before migrating.

One exception to this rule is nodes that you configure with `IsReturnProxy = true`. In this case, the communication channels start outbound from CycleCloud and automatically re-establish after migration.

To migrate a CycleCloud host:

1. Stop cycle_server on the source host by running `service cycle_server stop` (LSB init scripts) or `systemctl stop cycle_server` (*systemd* init).
1. Run `groupadd cycle_server` and `useradd cycle_server` on the target host. Use the original GID and UID if possible.
1. Install OpenJDK version 8 on the target host by running `apt-get -y install openjdk-8-jre-headless` or `yum install -y java-1.8.0-openjdk`.
1. Transfer the files to the target host by running `rsync -a /opt/cycle_server username@remote_host:/opt/cycle_server` or by using another metadata-preserving transfer tool.
1. Enable the LSB init or *systemd* init for CycleCloud by running `/opt/cycle_server/util/autostart.sh on`.
1. Start the CycleCloud service with either `service cycle_server start` or `systemctl start cycle_server`.

You can simplify these instructions if you're migrating an installation from a nonstandard directory to _/opt/cycle_server_:

1. Stop cycle_server on the source host with `service cycle_server stop` (LSB init scripts) or `systemctl stop cycle_server` (*systemd* init).
1. Transfer the files to the default location with `rsync -a /usr/share/hpc/cycle_server /opt/cycle_server`.
1. Enable the LSB init or *systemd* init for CycleCloud by running `/opt/cycle_server/util/autostart.sh on`.
1. Start the CycleCloud service with either `service cycle_server start` or `systemctl start cycle_server`.

After migrating to a new host or migrating to the default installation directory, perform upgrades as described in the first section.
