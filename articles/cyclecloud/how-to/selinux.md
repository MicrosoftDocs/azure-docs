---
title: SELinux Support
description: SELinux support for Azure CycleCloud.
author: staer
ms.date: 07/01/2025
ms.author: danharri
---

# SELinux and Azure CycleCloud

Most modern Red Hat based Linux distributions (RHEL, CentOS) come with [Security Enhanced Linux](https://selinuxproject.org/page/Main_Page) (SELinux) installed and set to `enforcing` by default. SELinux is a security enhancement to Linux that gives administrators more control over access control. Azure CycleCloud supports SELinux by default, but to support a number of HPC applications, CycleCloud modifies the SELinux environment for the administrator.

## HPC clusters and SELinux

Many Azure CycleCloud HPC clusters use a shared NFS home directory to make it easier to submit jobs and share information between compute nodes. Clusters that use a shared home directory include PBS Pro, Grid Engine, and Slurm.

The default SELinux home directory policy prevents using an NFS mount or anything besides **/home** for a home directory. For this reason, if [user management](~/articles/cyclecloud/concepts/user-management.md) is enabled, CycleCloud automatically runs the necessary commands to allow both a nonstandard **/shared/home** directory and NFS home directories.

To enable a nonstandard home directory, run the following commands to copy the security context from **/home** to **/shared/home** and reset the security context recursively on the new home directory:

```bash
semanage fcontext -a -e /home /shared/home
restorecon -R /shared/home
```

::: moniker range="=cyclecloud-7"
> [!NOTE]
> Generally, the primary node in most HPC clusters exports the filesystem used as the home directory for all of the `execute` nodes. In this case, _/shared/home_ isn't an NFS mount on the primary node but instead is a symlink to _/mnt/exports/shared/home_, which is the directory exported through NFS.
::: moniker-end

::: moniker range=">=cyclecloud-8"
> [!NOTE]
> Generally speaking, the `scheduler` node in most HPC clusters exports the filesystem used as the home directory for all of the `execute` nodes. In this case, _/shared/home_ isn't an NFS mount on the `scheduler` node but instead is a symlink to _/mnt/exports/shared/home_, which is the directory exported via NFS.
::: moniker-end

For VMs that mount the shared filesystem, you must explicitly enable NFS home directories so users can sign in to the VM:

```bash
setsebool -P use_nfs_home_dirs 1
```

To run the preceding commands, the operating system installs some packages if they're not already installed. The `policycoreutils` package provides the `restorecon` and `setsebool` commands. The `policycoreutils-python` or `policycoreutils-python-utils` package provides the `semanage` command, depending on the OS version.

> [!NOTE]
> Most Azure CycleCloud clusters use _/shared/home_ as the cluster's home directory, but some configurations use a different path. If this is the case, run the same commands using the alternative path instead of _/shared/home_.


## Disabling SELinux

In some cases, an application doesn't work correctly due to SELinux. To make debugging easier, CycleCloud lets a cluster administrator set the SELinux mode to `permissive` or `disabled` through the following configuration option:

```
cyclecloud.selinux.policy = permissive  # or `disabled`
```

To change the SELinux policy at the OS level, use the `setenforce 0` command to temporarily set SELinux to `permissive` mode. Then, modify the _/etc/selinux/config_ file to permanently change the SELinux mode.

To run `setenforce`, install the `libselinux-utils` package if it's not already installed on the OS.

> [!IMPORTANT]
> After setting SELinux to disabled, you must restart the VM to fully disable SELinux. The VM stays in permissive mode until you restart it.