---
title: Understanding cloud-init 
description: Deep dive for understanding provisioning an Azure VM using cloud-init.
author: mattmcinnes 
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: mattmcinnes
ms.reviewer: cynthn
ms.subservice: cloud-init
ms.custom: devx-track-linux
---

# Diving deeper into cloud-init

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

To learn more about [cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) or troubleshoot it at a deeper level, you need to understand how it works. This document highlights the important parts, and explains the Azure specifics.

When cloud-init is included in a generalized image, and a VM is created from that image, it processes configurations and run-through five stages during the initial boot. These stages matter, as it shows you at what point cloud-init applies configurations.

## Understand Cloud-Init configuration

Configuring a VM to run on a platform, means cloud-init needs to apply multiple configurations, as an image consumer, the main configurations you interact with is `User data` (customData), which supports multiple formats. For more information, see [User-Data Formats & cloud-init 21.2 documentation](https://cloudinit.readthedocs.io/en/latest/topics/format.html#user-data-formats). You also have the ability to add and run scripts (/var/lib/cloud/scripts) for other configuration.

Some configurations are already baked into Azure Marketplace images that come with cloud-init, such as:

* **Cloud data source** - cloud-init contains code that can interact with cloud platforms, these codes are called 'datasources'. When a VM is created from a cloud-init image in [Azure](https://cloudinit.readthedocs.io/en/latest/reference/datasources/azure.html#azure), cloud-init loads the Azure datasource, which interacts with the Azure metadata endpoints to get the VM specific configuration.
* **Runtime config** (/run/cloud-init).
* **Image config** (/etc/cloud), like `/etc/cloud/cloud.cfg`, `/etc/cloud/cloud.cfg.d/*.cfg`. An example of where this configuration is used in Azure, it's common for the Linux OS images with cloud-init to have an Azure datasource directive that tells cloud-init what datasource it should use, this configuration saves cloud-init time:

   ```bash
   sudo cat /etc/cloud/cloud.cfg.d/90_dpkg.cfg
   ```

   ```output
   # to update this file, run dpkg-reconfigure cloud-init
   datasource_list: [ Azure ]
   ```

## Cloud-init boot stages (processing configuration)

When you are provisioning VMs with cloud-init, there are five stages of boot, which process configuration, and shown in the logs.

1. [Generator Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#generator): The cloud-init systemd generator starts, and determines that cloud-init should be included in the boot goals, and if so, it enables cloud-init.
2. [Cloud-init Local Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#local): Here cloud-init looks for the local "Azure" datasource, which enables cloud-init to interface with Azure, and apply a networking configuration, including fallback.
3. [Cloud-init init Stage (Network)](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#network): Networking should be online, and the NIC and route table information should be generated. At this stage, the modules listed in `cloud_init_modules` in `/etc/cloud/cloud.cfg` runs. The VM in Azure is mounted, the ephemeral disk is formatted, the hostname is set, along with other tasks.

   The following are some of the `cloud_init_modules`:

   ```config
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
   ```

   After this stage, cloud-init sends a signal to the Azure platform that the VM has been provisioned successfully. Some modules may have failed, not all module failures result in a provisioning failure.

4. [Cloud-init Config Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#config): At this stage, the modules in `cloud_config_modules` defined and listed in `/etc/cloud/cloud`.cfg runs.
5. [Cloud-init Final Stage](https://cloudinit.readthedocs.io/en/latest/topics/boot.html#final): At this final stage, the modules in `cloud_final_modules`, listed in `/etc/cloud/cloud.cfg`, runs. Here modules that need to be run late in the boot process run, such as package installations and run scripts etc.

   - During this stage, you can run scripts by placing them in the directories under `/var/lib/cloud/scripts`:
     - `per-boot` - scripts within this directory, run on every reboot
     - `per-instance` - scripts within this directory run when a new instance is first booted
     - `per-once` - scripts within this directory run only once

## Next steps

[Troubleshooting cloud-init](cloud-init-troubleshooting.md).
