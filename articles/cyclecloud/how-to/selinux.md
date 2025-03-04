---
title: SELinux Support
description: SELinux support for Azure CycleCloud.
author: staer
ms.date: 03/10/2020
ms.author: danharri
---

# SELinux and Azure CycleCloud

Most modern Red Hat based Linux distributions (RHEL, CentOS) come with [Security Enhanced Linux](https://selinuxproject.org/page/Main_Page) (SELinux) installed and set to `enforcing` by default. SELinux is a security enhancement to Linux which allows administrators more control over access control. Azure CycleCloud supports SELinux by default, but to support a number of HPC applications, CycleCloud will modify the SELinux environment on behalf of the administrator.

## HPC Clusters and SELinux

Many Azure Cyclecloud HPC clusters use a shared NFS home directory to facilitate the submission of jobs and ease the sharing of information between compute nodes. Clusters that utilize a shared home directory include PBS Pro, Grid Engine, and Slurm.

The default SELinux home directory policy prevents using an NFS mount or anything besides _/home_ for a home directory. For this reason, if [user management](~/articles/cyclecloud/concepts/user-management.md) is enabled, CycleCloud will automatically run the necessary commands to both allow a non-standard home directory _/shared/home_ as well as allowing NFS home directories.

To enable a non-standard home directory the following commands are run to first copy the the security context from _/home_ to _/shared/home_ and then to reset the security context recursively on the new home directory:

```bash
semanage fcontext -a -e /home /shared/home
restorecon -R /shared/home
```

::: moniker range="=cyclecloud-7"
> [!NOTE]
> Generally speaking, the `master` node in most HPC clusters exports the filesystem used as the home directory for all of the `execute` nodes. In this case, _/shared/home_ is not a NFS mount on the `master` but instead is a symlink to _/mnt/exports/shared/home_ which is the directory exported via NFS.
::: moniker-end

::: moniker range=">=cyclecloud-8"
> [!NOTE]
> Generally speaking, the `scheduler` node in most HPC clusters exports the filesystem used as the home directory for all of the `execute` nodes. In this case, _/shared/home_ is not a NFS mount on the `scheduler` but instead is a symlink to _/mnt/exports/shared/home_ which is the directory exported via NFS.
::: moniker-end

For VMs mounting the shared filesystem, NFS home directories must be explicitly enabled in order for users to log into the VM:

```bash
setsebool -P use_nfs_home_dirs 1
```

To run the above commands, some packages will be installed if they are not already installed on the operating system: `policycoreutils` provides the `restorecon` and `setsebool` commands while `policycoreutils-python` or `policycoreutils-python-utils` provides the `semanage` command depending on the OS version.

> [!NOTE]
> Most Azure CycleCloud clusters use _/shared/home_ as the cluster's home directory but some configurations may use a different path. If this is the case, the same commands are run using the alternative path instead of _/shared/home_.


## Disabling SELinux

In some cases, an application may not work correctly due to SELinux. In order to more easily debug, CycleCloud allows a cluster administrator to set the SELinux mode to `permissive` or `disabled` via the configuration option:

```
cyclecloud.selinux.policy = permissive  # or `disabled`
```

To change the SELinux policy on an OS level a `setenforce 0` command is issued to temporarily set SELinux to `permissive` mode and then the _/etc/selinux/config_ file is modified to permanently change the SELinux mode.

In order to run `setenforce` the package `libselinux-utils` will be installed if not already installed on the OS.

> [!IMPORTANT]
> After setting SELinux to disabled, a restart of the VM is required to fully disable SELinux. The VM remains in permissive mode until restarted.