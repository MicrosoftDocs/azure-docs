---
title: Understanding cloud-init 
description: Deep dive for understanding provisioning an Azure VM using cloud-init.
author: danielsollondon 
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: conceptual
ms.date: 05/21/2020
ms.author: danis
ms.reviewer: cynthn
---


# Diving deeper into cloud-init
To learn more about [cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) or troubleshoot it at a deeper level, you need to understand how it works. This document highlights the important parts, and explains the Azure specifics.

When cloud-init is included in a generalized image, and a VM is created from that image, it will run through 5 stages during the initial boot. These stages matter, as it shows you at what point cloud-init will apply configurations. 

## Cloud-init boot stages

When provisioning with cloud-init, there are 5 stages of boot, which are shown in the logs.

1. [Generator Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#generator): The cloud-init systemd generator starts, and determines that cloud-init should be included in the boot goals, and if so, it enables cloud-init.

If you wish to disable cloud-init, you have the option here. For example, create this file `/etc/cloud/cloud-init.disabled`.

2. [Cloud-init Local Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#local): Here cloud-init will look for the local "Azure" datasource, which will enable cloud-init to interface with Azure, and apply a networking configuration, including fallback.

3. [Cloud-init init Stage (Network)](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#network): Networking should be online, and the NIC and route table information should be generated. At this stage, the modules listed in `cloud_init_modules` in /etc/cloud/cloud.cfg will be run. The VM in Azure will be mounted, the ephemeral disk is formatted, the hostname is set, along with other tasks.

These are some of the cloud_init_modules:
- `migrator`
- `seed_random`
- `bootcmd`
- `write-files`
- `growpart`
- `resizefs`
- `disk_setup`
- `mounts`
- `set_hostname`
- `update_hostname`
- `ssh`


After this stage, cloud-init will signal to the Azure platform that the VM has been provisioned successfully. Some modules may have failed, not all module failures will result in a provisioning failure.

4. [Cloud-init Config Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#config): At this stage, the modules in `cloud_config_modules` defined and listed in /etc/cloud/cloud.cfg will be run.


5. [Cloud-init Final Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#final): At this final stage, the modules in `cloud_final_modules`, listed in /etc/cloud/cloud.cfg, will be run. Here modules that need to be run late in the boot process run, such as package installations and run scripts etc. 

During this stage, you can run scripts by placing them in the directories under `/var/lib/cloud/scripts`:
- `per-boot` - scripts within this directory, run on every reboot
- `per-instance` - scripts within this directory run when a new instance is first booted
- `per-once` - scripts within this directory run only once


## Configuration processing

<!-- what is this in relation to the stages? -->

Configuring a VM to run on a platform, means cloud-init needs to apply multiple configurations.

- User data (`customData`), there are multiple formats documented [here](https://cloudinit.readthedocs.io/en/latest/topics/format.html#user-data-formats). 
- cloud data source - in [Azure](https://cloudinit.readthedocs.io/en/latest/topics/datasources/azure.html#azure) we mount a CD and connect to endpoints.
- Image config (/etc/cloud)
- Runtime config (/run/cloud-init), like `/etc/cloud/cloud.cfg`, `/etc/cloud/cloud.cfg.d/*.cfg`. See the details later in this section.
- Apply cloud-init module configurations
- Runs scripts (/var/lib/cloud/scripts)


`/etc/cloud/cloud.cfg` - is a global cloud-init configuration file which configures the following, and more:
- Define default users to enable login and configure sudo access
- Enable and disable root login (ssh)
- Enable passwordless login
- Hostname configuration
- Define modules that run in various stages of cloud-init.


`/etc/cloud/cloud.cfg.d/*.cfg` - cloud-init supports additional configurations, these reside within: <!-- is there more here? -->

An example of where this is used in Azure, it is common for the Linux OS images with cloud-init to have an Azure datasource directive, that tells cloud-init what datasource it should use, this saves cloud-init time.

```bash
/etc/cloud/cloud.cfg.d# cat 90_dpkg.cfg
# to update this file, run dpkg-reconfigure cloud-init
datasource_list: [ Azure ]
```

## Next steps

[Troubleshooting cloud-init](cloud-init-troubleshooting.md).
