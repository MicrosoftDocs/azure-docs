---
title: Azure Linux VM Agent Overview 
description: Learn how to install and configure Linux Agent (waagent) to manage your virtual machine's interaction with Azure Fabric Controller.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.custom: GGAL-freshness822
ms.collection: linux
ms.date: 10/17/2016

---
# Understanding and using the Azure Linux Agent

The Microsoft Azure Linux Agent (waagent) manages Linux & FreeBSD provisioning, and VM interaction with the Azure Fabric Controller. In addition to the Linux Agent providing provisioning functionality, Azure also provides the option of using cloud-init for some Linux OSes. The Linux Agent provides the following functionality for Linux and FreeBSD IaaS deployments:

> [!NOTE]
> For more information, see the [README](https://github.com/Azure/WALinuxAgent/blob/master/README.md).
> 
> 

* **Image Provisioning**
  
  * Creation of a user account
  * Configuring SSH authentication types
  * Deployment of SSH public keys and key pairs
  * Setting the host name
  * Publishing the host name to the platform DNS
  * Reporting SSH host key fingerprint to the platform
  * Resource Disk Management
  * Formatting and mounting the resource disk
  * Configuring swap space
* **Networking**
  
  * Manages routes to improve compatibility with platform DHCP servers
  * Ensures the stability of the network interface name
* **Kernel**
  
  * Configures virtual NUMA (disable for kernel <`2.6.37`)
  * Consumes Hyper-V entropy for /dev/random
  * Configures SCSI timeouts for the root device (which could be remote)
* **Diagnostics**
  
  * Console redirection to the serial port
* **SCVMM Deployments**
  
  * Detects and bootstraps the VMM agent for Linux when running in a System Center Virtual Machine Manager 2012 R2 environment
* **VM Extension**
  
  * Inject component authored by Microsoft and Partners into Linux VM (IaaS) to enable software and configuration automation
  * VM Extension reference implementation on [https://github.com/Azure/azure-linux-extensions](https://github.com/Azure/azure-linux-extensions)

## Communication

The information flow from the platform to the agent occurs via two channels:

* A boot-time attached DVD for IaaS deployments. This DVD includes an OVF-compliant configuration file that includes all provisioning information other than the actual SSH keypairs.
* A TCP endpoint exposing a REST API used to obtain deployment and topology configuration.

## Requirements

The following systems have been tested and are known to work with the Azure Linux Agent:

> [!NOTE]
> This list may differ from the official list of [supported distros](../linux/endorsed-distros.md).
>
>

* CentOS 7.x and 8.x
* Red Hat Enterprise Linux 6.7+, 7.x, and 8.x
* Debian 10+
* Ubuntu 18.04+
* openSUSE 12.3+
* SLES 12.x and 15.x
* Oracle Linux 6.4+, 7.x and 8.x

> [!IMPORTANT]
> RHEL/Oracle Linux 6.10 is the only RHEL/OL 6 version with ELS support available, [the extended maintenance ends on 06/30/2024](https://access.redhat.com/support/policy/updates/errata)

Other Supported Systems:

* FreeBSD 10+ (Azure Linux Agent v2.0.10+)

The Linux agent depends on some system packages in order to function properly:

* Python 2.6+
* OpenSSL 1.0+
* OpenSSH 5.3+
* Filesystem utilities: sfdisk, fdisk, mkfs, parted
* Password tools: chpasswd, sudo
* Text processing tools: sed, grep
* Network tools: ip-route
* Kernel support for mounting UDF filesystems.

Ensure your VM has access to IP address 168.63.129.16. For more information, see [What is IP address 168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md).

## Installation

Installation using an RPM or a DEB package from your distribution's package repository is the preferred method of installing and upgrading the Azure Linux Agent. All the [endorsed distribution providers](../linux/endorsed-distros.md) integrate the Azure Linux agent package into their images and repositories.

Refer to the documentation in the [Azure Linux Agent repo on GitHub](https://github.com/Azure/WALinuxAgent) for advanced installation options, such as installing from source or to custom locations or prefixes.

## Command-Line Options

### Flags

* verbose: Increase verbosity of specified command
* force: Skip interactive confirmation for some commands

### Commands

* help: Lists the supported commands and flags.
* deprovision: Attempt to clean the system and make it suitable for reprovisioning. The following operation deletes:
  
  * All SSH host keys (if Provisioning.RegenerateSshHostKeyPair is 'y' in the configuration file)
  * Nameserver configuration in `/etc/resolv.conf`
  * Root password from `/etc/shadow` (if Provisioning.DeleteRootPassword is 'y' in the configuration file)
  * Cached DHCP client leases
  * Resets host name to localhost.localdomain

> [!WARNING]
> Deprovisioning does not guarantee that the image is cleared of all sensitive information and suitable for redistribution.

>
>

* deprovision+user: Performs everything in -deprovision (above) and also deletes the last provisioned user account (obtained from `/var/lib/waagent`) and associated data. This parameter is when de-provisioning an image that was previously provisioning on Azure so it may be captured and reused.
* version: Displays the version of waagent
* serialconsole: Configures GRUB to mark ttyS0 (the first serial port) as
   the boot console. This ensures that kernel bootup logs are sent to the
   serial port and made available for debugging.
* daemon: Run waagent as a daemon to manage interaction with the platform. This argument is specified to waagent in the waagent init script.
* start: Run waagent as a background process

## Configuration

A configuration file (/etc/waagent.conf) controls the actions of waagent. 
The following shows a sample configuration file:

```config
Provisioning.Enabled=y
Provisioning.DeleteRootPassword=n
Provisioning.RegenerateSshHostKeyPair=y
Provisioning.SshHostKeyPairType=rsa
Provisioning.MonitorHostName=y
Provisioning.DecodeCustomData=n
Provisioning.ExecuteCustomData=n
Provisioning.AllowResetSysUser=n
Provisioning.PasswordCryptId=6
Provisioning.PasswordCryptSaltLength=10
ResourceDisk.Format=y
ResourceDisk.Filesystem=ext4
ResourceDisk.MountPoint=/mnt/resource
ResourceDisk.MountOptions=None
ResourceDisk.EnableSwap=n
ResourceDisk.SwapSizeMB=0
LBProbeResponder=y
Logs.Verbose=n
OS.RootDeviceScsiTimeout=300
OS.OpensslPath=None
HttpProxy.Host=None
HttpProxy.Port=None
AutoUpdate.Enabled=y
```

The following various configuration options are described. Configuration options are of three types; Boolean, String, or Integer. The Boolean configuration options can be specified as "y" or "n". The special keyword "None" may be used for some string type configuration entries as the following details:

**Provisioning.Enabled:**  

```txt
Type: Boolean  
Default: y
```

This allows the user to enable or disable the provisioning functionality in the agent. Valid values are "y" or "n". If provisioning is disabled, SSH host and user keys in the image are preserved and any configuration specified in the Azure provisioning API is ignored.

> [!NOTE]
> The `Provisioning.Enabled` parameter defaults to "n" on Linux Images that use cloud-init for provisioning.
>
>

**Provisioning.DeleteRootPassword:**  

```txt
Type: Boolean  
Default: n
```

If set, the root password in the /etc/shadow file is erased during the provisioning process.

**Provisioning.RegenerateSshHostKeyPair:**  

```txt
Type: Boolean  
Default: y
```

If set, all SSH host key pairs (ecdsa, dsa, and rsa) are deleted during the provisioning process from `/etc/ssh/`. And a single fresh key pair is generated.

The encryption type for the fresh key pair is configurable by the Provisioning.SshHostKeyPairType entry. Some distributions re-create SSH key pairs for any missing encryption types when the SSH daemon is restarted (for example, upon a reboot).

**Provisioning.SshHostKeyPairType:**  

```txt
Type: String  
Default: rsa
```

This can be set to an encryption algorithm type that is supported by the SSH daemon on the virtual machine. The typically supported values are "rsa", "dsa" and "ecdsa". "putty.exe" on Windows does not support "ecdsa". So, if you intend to use putty.exe on Windows to connect to a Linux deployment, use "rsa" or "dsa".

**Provisioning.MonitorHostName:**  

```txt
Type: Boolean  
Default: y
```

If set, waagent monitors the Linux virtual machine for hostname changes (as returned by the "hostname" command) and automatically update the networking configuration in the image to reflect the change. In order to push the name change to the DNS servers, networking is restarted in the virtual machine. This results in brief loss of Internet connectivity.

**Provisioning.DecodeCustomData:**

```txt
Type: Boolean  
Default: n
```

If set, waagent decodes CustomData from Base64.

**Provisioning.ExecuteCustomData:**

```txt
Type: Boolean  
Default: n
```

If set, waagent executes CustomData after provisioning.

**Provisioning.AllowResetSysUser:**

```txt
Type: Boolean
Default: n
```

This option allows the password for the sys user to be reset; default is disabled.

**Provisioning.PasswordCryptId:**

```txt
Type: String  
Default: 6
```

Algorithm used by crypt when generating password hash.  
 1 - MD5  
 2a - Blowfish  
 5 - SHA-256  
 6 - SHA-512  

**Provisioning.PasswordCryptSaltLength:**

```txt
Type: String  
Default: 10
```

Length of random salt used when generating password hash.

**ResourceDisk.Format:**

```txt
Type: Boolean  
Default: y
```

If set, the resource disk provided by the platform is formatted and mounted by waagent if the filesystem type requested by the user in "ResourceDisk.Filesystem" is anything other than "ntfs". A single partition of type Linux (83) is made available on the disk. This partition is not formatted if it can be successfully mounted.

**ResourceDisk.Filesystem:**

```txt
Type: String  
Default: ext4
```

This specifies the filesystem type for the resource disk. Supported values vary by Linux distribution. If the string is X, then mkfs.X should be present on the Linux image.

**ResourceDisk.MountPoint:**  

```txt
Type: String  
Default: /mnt/resource 
```

This specifies the path at which the resource disk is mounted. The resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned.

**ResourceDisk.MountOptions:**

```txt
Type: String  
Default: None
```

Specifies disk mount options to be passed to the mount -o command. This is a comma-separated list of values, ex. 'nodev,nosuid'. See mount(8) for details.

**ResourceDisk.EnableSwap:**  

```txt
Type: Boolean  
Default: n
```

If set, a swap file (/swapfile) is created on the resource disk and added to the system swap space.

**ResourceDisk.SwapSizeMB:**

```txt
Type: Integer  
Default: 0
```

The size of the swap file in megabytes.

**Logs.Verbose:**  

```txt
Type: Boolean  
Default: n
```

If set, log verbosity is boosted. Waagent logs to `/var/log/waagent.log` and utilizes the system logrotate functionality to rotate logs.

**OS.EnableRDMA**

```txt
Type: Boolean  
Default: n
```

If set, the agent attempts to install and then load an RDMA kernel driver that matches the version of the firmware on the underlying hardware.

**OS.RootDeviceScsiTimeout:**

```txt
Type: Integer  
Default: 300
```

This setting configures the SCSI timeout in seconds on the OS disk and data drives. If not set, the system defaults are used.

**OS.OpensslPath:**

```txt
Type: String  
Default: None
```

This setting can be used to specify an alternate path for the openssl binary to use for cryptographic operations.

**HttpProxy.Host, HttpProxy.Port:**

```txt
Type: String  
Default: None
```

If set, the agent uses this proxy server to access the internet.

**AutoUpdate.Enabled:**

```txt
Type: Boolean
Default: y
```

Enable or disable auto-update for goal state processing; default is enabled.

## Linux guest agent automatic logs collection

As of version 2.7+, The Azure Linux guest agent has a feature to automatically collect some logs and upload them. This feature currently requires systemd, and utilizes a new systemd slice called azure-walinuxagent-logcollector.slice to manage resources while performing the collection. The log collector's goal is to facilitate offline analysis, and therefore produces a ZIP file of some diagnostics logs before uploading them to the VM's Host. The ZIP file can then be retrieved by Engineering Teams and Support professionals to investigate issues at the behest of the VM owner. More technical information on the files collected by the guest agent can be found in the azurelinuxagent/common/logcollector_manifests.py file in the [agent's GitHub repository](https://github.com/Azure/WALinuxAgent).

This can be disabled by editing ```/etc/waagent.conf``` updating ```Logs.Collect``` to ```n```

## Ubuntu Cloud Images

Ubuntu Cloud Images utilize [cloud-init](https://launchpad.net/ubuntu/+source/cloud-init) to perform many configuration tasks that would otherwise be managed by the Azure Linux Agent. The following differences apply:

* **Provisioning.Enabled** defaults to "n" on Ubuntu Cloud Images that use cloud-init to perform provisioning tasks.
* The following configuration parameters have no effect on Ubuntu Cloud Images that use cloud-init to manage the resource disk and swap space:
  
  * **ResourceDisk.Format**
  * **ResourceDisk.Filesystem**
  * **ResourceDisk.MountPoint**
  * **ResourceDisk.EnableSwap**
  * **ResourceDisk.SwapSizeMB**

* For more information, see the following resources to configure the resource disk mount point and swap space on Ubuntu Cloud Images during provisioning:
  
  * [Ubuntu Wiki: Configure Swap Partitions](https://go.microsoft.com/fwlink/?LinkID=532955&clcid=0x409)
  * [Injecting Custom Data into an Azure Virtual Machine](../windows/tutorial-automate-vm-deployment.md)
