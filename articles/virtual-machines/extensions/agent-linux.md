---
title: Azure Linux VM Agent overview 
description: Learn how to install and configure Azure Linux Agent (waagent) to manage your virtual machine's interaction with the Azure Fabric controller.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.custom: GGAL-freshness822
ms.collection: linux
ms.date: 03/28/2023

---
# Understanding and using the Azure Linux Agent

The Microsoft Azure Linux Agent (waagent) manages Linux and FreeBSD provisioning, and virtual machine interaction with the Azure Fabric controller. In addition to the Linux Agent providing provisioning functionality, Azure also provides the option of using `cloud-init` for some Linux operating systems. The Linux agent provides the following functionality for Linux and FreeBSD Azure Virtual Machines deployments:

> [!NOTE]
> For more information, see [Microsoft Azure Linux Agent](https://github.com/Azure/WALinuxAgent/blob/master/README.md).

- Image provisioning
  
  - Creates a user account
  - Configures SSH authentication types
  - Deploys SSH public keys and key pairs
  - Sets the host name
  - Publishes the host name to the platform DNS
  - Reports SSH host key fingerprint to the platform
  - Manages resource disk
  - Format and mount the resource disk
  - Configures swap space

- Networking
  
  - Manages routes to improve compatibility with platform DHCP servers
  - Ensures the stability of the network interface name

- Kernel
  
  - Configures virtual NUMA (disable for kernel <`2.6.37`)
  - Consumes Hyper-V entropy for */dev/random*
  - Configures SCSI timeouts for the root device, which can be remote

- Diagnostics
  
  - Console redirection to the serial port

- System Center Virtual Machine Manager Deployments
  
  - Detects and bootstraps the Virtual Machine Manager agent for Linux when running in a System Center Virtual Machine Manager 2012 R2 environment

- VM Extension
  
  - Injects component authored by Microsoft and partners into Linux Virtual Machines to enable software and configuration automation
  - VM Extension reference implementation on [https://github.com/Azure/azure-linux-extensions](https://github.com/Azure/azure-linux-extensions)

## Communication

The information flow from the platform to the agent occurs by using two channels:

- A boot-time attached DVD for Virtual Machines deployments. This DVD includes an Open Virtualization Format (OVF)-compliant configuration file that includes all provisioning information other than the SSH key pairs.
- A TCP endpoint exposing a REST API used to obtain deployment and topology configuration.

## Requirements

The following systems have been tested and are known to work with the Azure Linux Agent:

> [!NOTE]
> This list might differ from the [Endorsed Linux distributions on Azure](../linux/endorsed-distros.md).

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

- FreeBSD 10+ (Azure Linux Agent v2.0.10+)

The Linux agent depends on some system packages in order to function properly:

- Python 2.6+
- OpenSSL 1.0+
- OpenSSH 5.3+
- File system utilities: sfdisk, fdisk, mkfs, parted
- Password tools: chpasswd, sudo
- Text processing tools: sed, grep
- Network tools: ip-route
- Kernel support for mounting UDF file systems.

Ensure your virtual machine has access to IP address 168.63.129.16. For more information, see [What is IP address 168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md).

## Installation

The preferred method of installing and upgrading the Azure Linux agent uses an RPM or a DEB package from your distribution's package repository. All the [endorsed distribution providers](../linux/endorsed-distros.md) integrate the Azure Linux agent package into their images and repositories.

For advanced installation options, such as installing from source or to custom locations or prefixes, see [Microsoft Azure Linux Agent](https://github.com/Azure/WALinuxAgent).

## Command-line options

### Flags

- `verbose`: Increase verbosity of specified command
- `force`: Skip interactive confirmation for some commands

### Commands

- `help`: Lists the supported commands and flags
- `deprovision`: Attempt to clean the system and make it suitable for reprovisioning. The operation deletes:
  - All SSH host keys, if `Provisioning.RegenerateSshHostKeyPair` is `y` in the configuration file
  - Nameserver configuration in `/etc/resolv.conf`
  - Root password from `/etc/shadow`, if `Provisioning.DeleteRootPassword` is `y` in the configuration file
  - Cached DHCP client leases
  - Resets host name to `localhost.localdomain`

> [!WARNING]
> Deprovisioning doesn't guarantee that the image is cleared of all sensitive information and suitable for redistribution.

- `deprovision+user`: Performs everything in `deprovision` (previous) and also deletes the last provisioned user account, obtained from `/var/lib/waagent`, and associated data. Use this parameter when you deprovision an image that was previously provision on Azure so that it might be captured and reused.
- `version`: Displays the version of waagent.
- `serialconsole`: Configures GRUB to mark ttyS0, the first serial port, as the boot console. This option ensures that kernel boot logs are sent to the serial port and made available for debugging.
- `daemon`: Run waagent as a daemon to manage interaction with the platform. This argument is specified to waagent in the waagent `init` script.
- `start`: Run waagent as a background process.Filesy

## Configuration

The */etc/waagent.conf* configuration file controls the actions of waagent. This example is a sample configuration file:

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

The following various configuration options are described. Configuration options are of three types: `Boolean`, `String`, or `Integer`. The `Boolean` configuration options can be specified as `y` or `n`. The special keyword `None` might be used for some string type configuration entries.

`Provisioning.Enabled`

```txt
Type: Boolean  
Default: y
```

This option allows the user to enable or disable the provisioning functionality in the agent. Valid values are `y` or `n`. If provisioning is disabled, SSH host and user keys in the image are preserved and configuration in the Azure provisioning API is ignored.

> [!NOTE]
> The `Provisioning.Enabled` parameter defaults to `n` on Ubuntu Cloud Images that use cloud-init for provisioning.

`Provisioning.DeleteRootPassword`

```txt
Type: Boolean  
Default: n
```

If set, the agent erases the root password in the */etc/shadow* file during the provisioning process.

`Provisioning.RegenerateSshHostKeyPair`

```txt
Type: Boolean  
Default: y
```

If set, the agent deletes all SSH host key pairs from */etc/ssh/* during the provisioning process, including ECDSA, DSA, and RSA. The agent generates a single fresh key pair.

Configure the encryption type for the fresh key pair by using the `Provisioning.SshHostKeyPairType` entry. Some distributions re-create SSH key pairs for any missing encryption types when the SSH daemon is restarted, for example, upon a reboot.

`Provisioning.SshHostKeyPairType`

```txt
Type: String  
Default: rsa
```

This option can be set to an encryption algorithm type that the SSH daemon supports on the virtual machine. The typically supported values are `rsa`, `dsa`, and `ecdsa`. *putty.exe* on Windows doesn't support `ecdsa`. If you intend to use *putty.exe* on Windows to connect to a Linux deployment, use `rsa` or `dsa`.

`Provisioning.MonitorHostName`

```txt
Type: Boolean  
Default: y
```

If set, waagent monitors the Linux virtual machine for a hostname change, as returned by the `hostname` command, and automatically updates the networking configuration in the image to reflect the change. In order to push the name change to the DNS servers, networking restart on the virtual machine. This restart results in brief loss of internet connectivity.

`Provisioning.DecodeCustomData`

```txt
Type: Boolean  
Default: n
```

If set, waagent decodes `CustomData` from Base64.

`Provisioning.ExecuteCustomData`

```txt
Type: Boolean  
Default: n
```

If set, waagent runs `CustomData` after provisioning.

`Provisioning.AllowResetSysUser`

```txt
Type: Boolean
Default: n
```

This option allows the password for the system user to be reset. The default is disabled.

`Provisioning.PasswordCryptId`

```txt
Type: String  
Default: 6
```

This option specifies the algorithm used by crypt when generating password hash. Valid values are:

- 1 - MD5  
- 2a - Blowfish  
- 5 - SHA-256  
- 6 - SHA-512  

`Provisioning.PasswordCryptSaltLength`

```txt
Type: String  
Default: 10
```

This option specifies the length of random salt used when generating password hash.

`ResourceDisk.Format`  

```txt
Type: Boolean  
Default: y
```

If set, waagent formats and mounts the resource disk provided by the platform, unless the file system type requested by the user in `ResourceDisk.Filesystem` is `ntfs`. The agent makes a single Linux partition (ID 83) available on the disk. This partition isn't formatted if it can be successfully mounted.

`ResourceDisk.Filesystem`

```txt
Type: String  
Default: ext4
```

This option specifies the file system type for the resource disk. Supported values vary by Linux distribution. If the string is `X`, then `mkfs.X` should be present on the Linux image.

`ResourceDisk.MountPoint`

```txt
Type: String  
Default: /mnt/resource 
```

This option specifies the path at which the resource disk is mounted. The resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned.

`ResourceDisk.MountOptions`

```txt
Type: String  
Default: None
```

Specifies disk mount options to be passed to the `mount -o` command. This value is a comma-separated list of values, for example, `nodev,nosuid`. For more information, see the mount(8) manual page.

`ResourceDisk.EnableSwap`

```txt
Type: Boolean  
Default: n
```

If set, the agent creates a swap file, */swapfile*, on the resource disk and adds it to the system swap space.

`ResourceDisk.SwapSizeMB`

```txt
Type: Integer  
Default: 0
```

Specifies the size of the swap file in megabytes.

`Logs.Verbose`

```txt
Type: Boolean  
Default: n
```

If set, log verbosity is boosted. Waagent logs to `/var/log/waagent.log` and uses the system `logrotate` functionality to rotate logs.

`OS.EnableRDMA`

```txt
Type: Boolean  
Default: n
```

If set, the agent attempts to install and then load an RDMA kernel driver that matches the version of the firmware on the underlying hardware.

`OS.RootDeviceScsiTimeout`

```txt
Type: Integer  
Default: 300
```

This setting configures the SCSI timeout in seconds on the OS disk and data drives. If not set, the system defaults are used.

`OS.OpensslPath`

```txt
Type: String  
Default: None
```

This setting can be used to specify an alternate path for the *openssl* binary to use for cryptographic operations.

`HttpProxy.Host`, `HttpProxy.Port`

```txt
Type: String  
Default: None
```

If set, the agent uses this proxy server to access the internet.

`AutoUpdate.Enabled`

```txt
Type: Boolean
Default: y
```

Enable or disable autoupdate for goal state processing. The default value is enabled.

## Linux guest agent automatic logs collection

As of version 2.7+, The Azure Linux guest agent has a feature to automatically collect some logs and upload them. This feature currently requires `systemd`, and uses a new `systemd` slice called `azure-walinuxagent-logcollector.slice` to manage resources while it performs the collection.

The purpose is to facilitate offline analysis. It produces a *.zip* file of some diagnostics logs before uploading them to the VM's host. Engineering Teams and Support professionals can retrieve the file to investigate issues for the virtual machine owner. More technical information on the files collected by the guest agent can be found in the *azurelinuxagent/common/logcollector_manifests.py* file in the [agent's GitHub repository](https://github.com/Azure/WALinuxAgent).

This option can be disabled by editing */etc/waagent.conf*. Update `Logs.Collect` to `n`.

## Ubuntu Cloud Images

Ubuntu Cloud Images use [cloud-init](https://launchpad.net/ubuntu/+source/cloud-init) to do many configuration tasks that the Azure Linux Agent would otherwise manage. The following differences apply:

- `Provisioning.Enabled` defaults to `n` on Ubuntu Cloud Images that use cloud-init to perform provisioning tasks.
- The following configuration parameters have no effect on Ubuntu Cloud Images that use cloud-init to manage the resource disk and swap space:
  
  - `ResourceDisk.Format`
  - `ResourceDisk.Filesystem`
  - `ResourceDisk.MountPoint`
  - `ResourceDisk.EnableSwap`
  - `ResourceDisk.SwapSizeMB`

- For more information, see the following resources to configure the resource disk mount point and swap space on Ubuntu Cloud Images during provisioning:
  
  - [Ubuntu Wiki: AzureSwapPartitions](https://go.microsoft.com/fwlink/?LinkID=532955&clcid=0x409)
  - [Deploy applications to a Windows virtual machine in Azure with the Custom Script Extension](../windows/tutorial-automate-vm-deployment.md)
