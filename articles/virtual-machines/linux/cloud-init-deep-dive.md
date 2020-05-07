---
title: Understanding cloud-init 
description: Deep dive for understanding provisioning an Azure VM using cloud-init.
author: danielsollondon 
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: conceptual
ms.date: 05/06/2020
ms.author: danis
ms.reviewer: cynthn
---


# Diving deeper into cloud-init
To learn more about [cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) or troubleshoot cloud-init at a deeper level, you need to understand how it works. This document highlights the salient parts, and explains the Azure specifics.

Once cloud-init is installed into a generalized image, and then booted, it will run through 5 stages. These stages matter, as it shows you at what point cloud-init will applies configurations. 

## Cloud-init boot stages

When provisioning with cloud-init, there are 5 stages of boot, which are shown in the logs.

* [Generator Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#generator): The cloud-init systemd generator starts, and determines that cloud-init should be included in the boot goals, and if so, it enables cloud-init.

If you wish to disable cloud-init, you have the option here. For example, create this file `/etc/cloud/cloud-init.disabled`.

* [Cloud-init Local Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#local): Here cloud-init will look for the local "Azure" datasource, which will enable cloud-init to interface with Azure, and apply a networking configuration, including fallback.

* [Cloud-init init Stage (Network)](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#network): Networking should be online and the nic and route table information should be generated. At this stage, the modules in `cloud_init_modules` will be executed in /etc/cloud/cloud.cfg, so a VM in Azure will mount and format the ephermal disk, set the hostname etc.

 This is a sample of the cloud_init_modules:
 - migrator
 - seed_random
 - bootcmd
 - write-files
 - growpart
 - resizefs
 - disk_setup
 - mounts
 - set_hostname
 - update_hostname
 - ssh
 etc.

After this stage, cloud-init will signal to the Azure platform that the VM has provisioned successfully, but note, not all module failures result in a fatal provisioning failure.

* [Cloud-init Config Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#config): At this stage, the modules in `cloud_config_modules` defined and listed in /etc/cloud/cloud.cfg will be executed.


* [Cloud-init Final Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#final): At this final stage, the modules in `cloud_final_modules` (defined and listed in /etc/cloud/cloud.cfg) will be executed. Here modules that need to be run late in the boot process run, such as package installations and run scripts etc. 

In the directories below, you can run scripts, but placing them in the directories below, (/var/lib/cloud/scripts:
    * per-boot -> scripts within this directory, run on every reboot
    * per-instance -> scripts within this directory run when a new instance is first booted
    * per-once-> scripts within this directory run only once


## Configuration processing

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
- Define modules that runs in various stages of cloud-init.


`/etc/cloud/cloud.cfg.d/*.cfg` - cloud-init supports additional configuration directives, these reside within: 

An example of where this is used in Azure, it is common for the Linux OS images with cloud-init to have a Azure datasource directive, that instructs cloud-init what datasource it should use, this saves cloud-init time.

```bash
/etc/cloud/cloud.cfg.d# cat 90_dpkg.cfg
# to update this file, run dpkg-reconfigure cloud-init
datasource_list: [ Azure ]
```

## Next steps

[Troubleshooting cloud-init](cloud-init-troubleshooting.md).
