---
title: Azure Linux VM Agent overview 
description: Learn how to install and configure the Azure Linux VM Agent (waagent) to manage your virtual machine's interaction with the Azure fabric controller.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.custom: GGAL-freshness822, devx-track-linux
ms.collection: linux
ms.date: 03/28/2023
---
# Azure Linux VM Agent overview

The Microsoft Azure Linux VM Agent (waagent) manages Linux and FreeBSD provisioning, along with virtual machine (VM) interaction with the Azure fabric controller. In addition to the Linux agent providing provisioning functionality, Azure provides the option of using cloud-init for some Linux operating systems.

The Linux agent provides the following functionality for Linux and FreeBSD Azure Virtual Machines deployments. For more information, see the [Azure Linux VM Agent readme on GitHub](https://github.com/Azure/WALinuxAgent/blob/master/README.md).

### Image provisioning

- Creates a user account
- Configures SSH authentication types
- Deploys SSH public keys and key pairs
- Sets the host name
- Publishes the host name to the platform DNS
- Reports the SSH host key fingerprint to the platform
- Manages the resource disk
- Formats and mounts the resource disk
- Configures swap space

### Networking

- Manages routes to improve compatibility with platform DHCP servers
- Ensures the stability of the network interface name

### Kernel

- Configures virtual NUMA (disabled for kernel 2.6.37)
- Consumes Hyper-V entropy for */dev/random*
- Configures SCSI timeouts for the root device, which can be remote

### Diagnostics

- Provides console redirection to the serial port

### System Center Virtual Machine Manager deployments

- Detects and bootstraps the Virtual Machine Manager agent for Linux when it's running in a System Center Virtual Machine Manager 2012 R2 environment

### VM Extension

- Injects components authored by Microsoft and partners into Linux VMs to enable software and configuration automation

You can find a VM Extension reference implementation on [GitHub](https://github.com/Azure/azure-linux-extensions).

## Communication

Information flow from the platform to the agent occurs through two channels:

- A boot-time attached DVD for VM deployments. This DVD includes an Open Virtualization Format (OVF)-compliant configuration file that contains all provisioning information other than the SSH key pairs.
- A TCP endpoint that exposes a REST API that's used to get deployment and topology configuration.

## Requirements

Testing has confirmed that the following systems work with the Azure Linux VM Agent.

> [!NOTE]
> This list might differ from the [endorsed Linux distributions on Azure](../linux/endorsed-distros.md).

| Distribution | x64 | ARM64 |
|:-----|:-----:|:-----:|
| Alma Linux | 9.x+ | 9.x+ |
| CentOS | 7.x+,  8.x+ | 7.x+ |
| Debian | 10+ | 11.x+ |
| Flatcar Linux | 3374.2.x+ | 3374.2.x+ |
| Azure Linux | 2.x | 2.x |
| openSUSE | 12.3+ | *Not supported* |
| Oracle Linux | 6.4+, 7.x+, 8.x+ | *Not supported* |
| Red Hat Enterprise Linux | 6.7+, 7.x+,  8.x+ | 8.6+, 9.0+ |
| Rocky Linux | 9.x+ | 9.x+ |
| SLES | 12.x+, 15.x+ | 15.x SP4+ |
| Ubuntu | 18.04+, 20.04+, 22.04+ | 20.04+, 22.04+ |

> [!IMPORTANT]
> RHEL/Oracle Linux 6.10 is the only RHEL/OL 6 version with Extended Lifecycle Support available. [The extended maintenance ends on June 30, 2024](https://access.redhat.com/support/policy/updates/errata).

Other supported systems:

- The Agent works on more systems than those listed in the documentation. However, we do not test or provide support for distros that are not on the endorsed list. In particular, FreeBSD is not endorsed. The customer can try FreeBSD 8 and if they  run into problems they can open an issue in our [Github repository](https://github.com/Azure/WALinuxAgent) and we may be able to help.

The Linux agent depends on these system packages to function properly:

- Python 2.6+
- OpenSSL 1.0+
- OpenSSH 5.3+
- File system utilities: sfdisk, fdisk, mkfs, parted
- Password tools: chpasswd, sudo
- Text processing tools: sed, grep
- Network tools: ip-route
- Kernel support for mounting UDF file systems

Ensure that your VM has access to IP address 168.63.129.16. For more information, see [What is IP address 168.63.129.16?](../../virtual-network/what-is-ip-address-168-63-129-16.md).

## Installation

The preferred method of installing and upgrading the Azure Linux VM Agent uses an RPM or a DEB package from your distribution's package repository. All the [endorsed distribution providers](../linux/endorsed-distros.md) integrate the Azure Linux VM Agent package into their images and repositories.

For advanced installation options, such as installing from a source or to custom locations or prefixes, see [Microsoft Azure Linux VM Agent](https://github.com/Azure/WALinuxAgent).

## Command-line options

### Flags

- `verbose`: Increases verbosity of the specified command.
- `force`: Skips interactive confirmation for some commands.

### Commands

- `help`: Lists the supported commands and flags.
- `deprovision`: Attempts to clean the system and make it suitable for reprovisioning. The operation deletes:
  - All SSH host keys, if `Provisioning.RegenerateSshHostKeyPair` is `y` in the configuration file.
  - `Nameserver` configuration in */etc/resolv.conf*.
  - The root password from */etc/shadow*, if `Provisioning.DeleteRootPassword` is `y` in the configuration file.
  - Cached DHCP client leases.
  
  The client resets the host name to `localhost.localdomain`.

  > [!WARNING]
  > Deprovisioning doesn't guarantee that the image is cleared of all sensitive information and suitable for redistribution.

- `deprovision+user`: Performs everything in `deprovision` and deletes the last provisioned user account (obtained from */var/lib/waagent*) and associated data. Use this parameter when you deprovision an image that was previously provisioned on Azure so that it can be captured and reused.
- `version`: Displays the version of waagent.
- `serialconsole`: Configures GRUB to mark ttyS0, the first serial port, as the boot console. This option ensures that kernel boot logs are sent to the serial port and made available for debugging.
- `daemon`: Runs waagent as a daemon to manage interaction with the platform. This argument is specified to waagent in the waagent *init* script.
- `start`: Runs waagent as a background process.

## Configuration

The */etc/waagent.conf* configuration file controls the actions of waagent. Here's an example of a configuration file:

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

Configuration options are of three types: `Boolean`, `String`, or `Integer`. You can specify the `Boolean` configuration options as `y` or `n`. The special keyword `None` might be used for some string type configuration entries.

### Provisioning.Enabled

```txt
Type: Boolean  
Default: y
```

This option allows the user to enable or disable the provisioning functionality in the agent. Valid values are `y` and `n`. If provisioning is disabled, SSH host and user keys in the image are preserved and configuration in the Azure provisioning API is ignored.

> [!NOTE]
> The `Provisioning.Enabled` parameter defaults to `n` on Ubuntu Cloud Images that use cloud-init for provisioning.

### Provisioning.DeleteRootPassword

```txt
Type: Boolean  
Default: n
```

If the value is `y`, the agent erases the root password in the */etc/shadow* file during the provisioning process.

### Provisioning.RegenerateSshHostKeyPair

```txt
Type: Boolean  
Default: y
```

If the value is `y`, the agent deletes all SSH host key pairs from */etc/ssh/* during the provisioning process, including ECDSA, DSA, and RSA. The agent generates a single fresh key pair.

Configure the encryption type for the fresh key pair by using the `Provisioning.SshHostKeyPairType` entry. Some distributions re-create SSH key pairs for any missing encryption types when the SSH daemon is restarted--for example, after a reboot.

### Provisioning.SshHostKeyPairType

```txt
Type: String  
Default: rsa
```

You can set this option to an encryption algorithm type that the SSH daemon supports on the VM. The typically supported values are `rsa`, `dsa`, and `ecdsa`. The *putty.exe* file on Windows doesn't support `ecdsa`. If you intend to use *putty.exe* on Windows to connect to a Linux deployment, use `rsa` or `dsa`.

### Provisioning.MonitorHostName

```txt
Type: Boolean  
Default: y
```

If the value is `y`, waagent monitors the Linux VM for a host name change, as returned by the `hostname` command. Waagent then automatically updates the networking configuration in the image to reflect the change. To push the name change to the DNS servers, networking restarts on the VM. This restart results in brief loss of internet connectivity.

### Provisioning.DecodeCustomData

```txt
Type: Boolean  
Default: n
```

If the value is `y`, waagent decodes `CustomData` from Base64.

### Provisioning.ExecuteCustomData

```txt
Type: Boolean  
Default: n
```

If the value is `y`, waagent runs `CustomData` after provisioning.

### Provisioning.AllowResetSysUser

```txt
Type: Boolean
Default: n
```

This option allows the password for the system user to be reset. It's disabled by default.

### Provisioning.PasswordCryptId

```txt
Type: String  
Default: 6
```

This option specifies the algorithm that `crypt` uses when it's generating a password hash. Valid values are:

- `1`: MD5  
- `2a`: Blowfish  
- `5`: SHA-256  
- `6`: SHA-512  

### Provisioning.PasswordCryptSaltLength

```txt
Type: String  
Default: 10
```

This option specifies the length of random salt used in generating a password hash.

### ResourceDisk.Format

```txt
Type: Boolean  
Default: y
```

If the value is `y`, waagent formats and mounts the resource disk that the platform provides, unless the file system type that the user requested in `ResourceDisk.Filesystem` is `ntfs`. The agent makes a single Linux partition (ID 83) available on the disk. This partition isn't formatted if it can be successfully mounted.

### ResourceDisk.Filesystem

```txt
Type: String  
Default: ext4
```

This option specifies the file system type for the resource disk. Supported values vary by Linux distribution. If the string is `X`, then `mkfs.X` should be present on the Linux image.

### ResourceDisk.MountPoint

```txt
Type: String  
Default: /mnt/resource 
```

This option specifies the path at which the resource disk is mounted. The resource disk is a *temporary* disk and might be emptied when the VM is deprovisioned.

### ResourceDisk.MountOptions

```txt
Type: String  
Default: None
```

This option specifies disk mount options to be passed to the `mount -o` command. The value is a comma-separated list of values, for example, `nodev,nosuid`. For more information, see the `mount(8)` manual page.

### ResourceDisk.EnableSwap

```txt
Type: Boolean  
Default: n
```

If you set this option, the agent creates a swap file (*/swapfile*) on the resource disk and adds it to the system swap space.

### ResourceDisk.SwapSizeMB

```txt
Type: Integer  
Default: 0
```

This option specifies the size of the swap file in megabytes.

### Logs.Verbose

```txt
Type: Boolean  
Default: n
```

If you set this option, log verbosity is boosted. Waagent logs to */var/log/waagent.log* and uses the system `logrotate` functionality to rotate logs.

### OS.EnableRDMA

```txt
Type: Boolean  
Default: n
```

If you set this option, the agent attempts to install and then load an RDMA kernel driver that matches the version of the firmware on the underlying hardware.

### OS.RootDeviceScsiTimeout

```txt
Type: Integer  
Default: 300
```

This option configures the SCSI timeout in seconds on the OS disk and data drives. If it's not set, the system defaults are used.

### OS.OpensslPath

```txt
Type: String  
Default: None
```

You can use this option to specify an alternate path for the *openssl* binary to use for cryptographic operations.

### HttpProxy.Host, HttpProxy.Port

```txt
Type: String  
Default: None
```

If you set this option, the agent uses this proxy server to access the internet.

### AutoUpdate.Enabled

```txt
Type: Boolean
Default: y
```

Enable or disable autoupdate for goal state processing. The default value is `y`.

## Automatic log collection in the Azure Linux Guest Agent

As of version 2.7+, the Azure Linux Guest Agent has a feature to automatically collect some logs and upload them. This feature currently requires `systemd`. It uses a new `systemd` slice called `azure-walinuxagent-logcollector.slice` to manage resources while it performs the collection.

The purpose is to facilitate offline analysis. The agent produces a *.zip* file of some diagnostics logs before uploading them to the VM's host. Engineering teams and support professionals can retrieve the file to investigate issues for the VM owner. For technical information on the files that the Azure Linux Guest Agent collects, see the *azurelinuxagent/common/logcollector_manifests.py* file in the [agent's GitHub repository](https://github.com/Azure/WALinuxAgent).

You can disable this option by editing */etc/waagent.conf*. Update `Logs.Collect` to `n`.

## Ubuntu Cloud Images

Ubuntu Cloud Images use [cloud-init](https://launchpad.net/ubuntu/+source/cloud-init) to do many configuration tasks that the Azure Linux VM Agent would otherwise manage. The following differences apply:

- `Provisioning.Enabled` defaults to `n` on Ubuntu Cloud Images that use cloud-init to perform provisioning tasks.
- The following configuration parameters have no effect on Ubuntu Cloud Images that use cloud-init to manage the resource disk and swap space:
  
  - `ResourceDisk.Format`
  - `ResourceDisk.Filesystem`
  - `ResourceDisk.MountPoint`
  - `ResourceDisk.EnableSwap`
  - `ResourceDisk.SwapSizeMB`

To configure the resource disk mount point and swap space on Ubuntu Cloud Images during provisioning, see the following resources:
  
- [Ubuntu wiki: AzureSwapPartitions](https://go.microsoft.com/fwlink/?LinkID=532955&clcid=0x409)
- [Deploy applications to a Windows virtual machine in Azure with the Custom Script Extension](../windows/tutorial-automate-vm-deployment.md)
