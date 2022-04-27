---
title: Overview of Linux provisioning
description: Overview of how to bring your Linux VM images or create new images to use in Azure.
author: danielsollondon
ms.service: virtual-machines
ms.subservice: imaging
ms.collection: linux
ms.topic: overview
ms.workload: infrastructure
ms.date: 06/22/2020
ms.author: danis
ms.reviewer: cynthn

---


# Azure Linux VM provisioning

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

When you create a VM from a generalized image (Azure Compute Gallery or Managed Image), the control plane will allow you to create a VM, and pass parameters and settings to the VM. This is called VM *provisioning*. During provisioning, the platform makes required VM Create parameter values (hostname, username, password, SSH keys, customData) available to the VM as it boots. 

A provisioning agent baked inside the image will interface with the platform, connecting up to multiple independent provisioning interfaces), set the properties and signal to the platform it has completed. 

The provisioning agents can be the [Azure Linux Agent](../extensions/agent-linux.md), or [cloud-init](./using-cloud-init.md). These are [prerequisites](create-upload-generic.md) of creating generalized images.

The provisioning agents, provide support for all endorsed [Azure Linux distributions](./endorsed-distros.md), and you will find the endorsed distro images in many cases will ship with both cloud-init and the Linux Agent. This gives you the option to have cloud-init to handle the provisioning, then the Linux Agent will provide support to handle [Azure Extensions](../extensions/features-windows.md). Providing support for extensions means the VM will then be eligible to support additional Azure services, such as VM Password Reset, Azure Monitoring, Azure Backup, Azure Disk encryption etc.

After provisioning completes, cloud-init will run on each boot. Cloud-init will monitor for changes to the VM, like networking changes, mounting, and formatting the ephemeral disk, and starting the Linux Agent. The Linux Agent continually runs on the server, seeking a 'goal state' (new configuration) from the Azure platform, so whenever you install extensions, the agent will be able to process them.

Whilst there are currently two provisioning agents, cloud-init should be the provisioning agent you choose, and the Linux Agent should be installed for extension support. This allows you to take advantage of platform optimizations, and allows you to disable/remove the Linux Agent, for more details on how to create images without the agent, and how to remove it, please review this [documentation](disable-provisioning.md).

If you have a Linux kernel that cannot support running either agent, but wish to set some of the VM Create properties, such as hostname, customData, userName, password, ssh keys, then in this document discusses how you can [create generalized images without an agent](no-agent.md), and meet platform requirements.


## Provisioning agent responsibilities

**Image provisioning**
  
- Creation of a user account
- Configuring SSH authentication types
- Deployment of SSH public keys and key pairs
- Setting the host name
- Publishing the host name to the platform DNS
- Reporting SSH host key fingerprint to the platform
- Resource Disk Management
- Formatting and mounting the resource disk
- Consuming and processing `customData`
 
**Networking**
  
- Manages routes to improve compatibility with platform DHCP servers
- Ensures the stability of the network interface name

**Kernel**
  
- Configures virtual NUMA (disable for kernel <`2.6.37`)
- Consumes Hyper-V entropy for `/dev/random`
- Configures SCSI timeouts for the root device (which could be remote)

**Diagnostics**
  
- Console redirection to the serial port

## Communication
The information flow from the platform to the agent occurs via two channels:

- A boot-time attached DVD for IaaS deployments. The DVD includes an OVF-compliant configuration file that includes all provisioning information, other than the actual SSH key pairs.
- A TCP endpoint exposing a REST API used to obtain deployment, and topology configuration.


## Azure provisioning agent requirements
The Linux Agent, and cloud-init, depend on some system packages in order to function properly:
- Python 2.6+
- OpenSSL 1.0+
- OpenSSH 5.3+
- Filesystem utilities: `sfdisk`, `fdisk`, `mkfs`, `parted`
- Password tools: chpasswd, sudo
- Text processing tools: sed, grep
- Network tools: ip-route
- Kernel support for mounting UDF filesystems.

## Next steps

If you need to, you can [disable provisioning and remove the Linux agent](disable-provisioning.md).
