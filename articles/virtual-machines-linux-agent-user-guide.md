<properties 
	pageTitle="Linux Agent User Guide for Azure" 
	description="Learn how to install and configure Linux Agent (waagent) to manage your virtual machine's interaction with Azure Fabric Controller." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="szarkos" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="szark"/>



#Azure Linux Agent User Guide

##Introduction

The Azure Linux Agent (/usr/sbin/waagent) manages interaction between a virtual machine and the Azure Fabric Controller. It does the following:

* **Image Provisioning**
  - Create a user account
  - Configure SSH authentication types
  - Deploy SSH public keys and key pairs
  - Sets the host name
  - Publishes the host name to the platform DNS
  - Reports SSH host key fingerprint to the platform
  - Manages the resource disk
  - Formats and mounts the resource disk
  - Configures swap space
* **Networking**
  - Manages routes to improve compatibility with platform DHCP servers
  - Ensures the stability of the network interface name
* **Kernel**
  - Configures virtual NUMA
  - Consumes Hyper-V entropy for /dev/random
  - Configures SCSI timeouts for the root device (which could be remote)
* **Diagnostics**
  - Redirects the console to the serial port
* **SCVMM Deployments**
    - Detects and bootstraps the VMM agent for Linux when running in a System Center Virtual Machine Manager 2012 R2 environment
* **VM Extension**
    - Inject component authored by Microsoft and Partners into Linux VM (IaaS) to enable software and configuration automation
    - VM Extension reference implementation on [https://github.com/Azure/azure-linux-extensions](https://github.com/Azure/azure-linux-extensions)


##Communication

The information flow from the platform to the agent occurs via two channels:

* A boot-time attached DVD for IaaS deployments. This DVD includes an OVF-compliant configuration file that includes all provisioning information other than the actual SSH keypairs.

* A TCP endpoint exposing a REST API used to obtain deployment and topology configuration.

###Getting the Linux Agent
You can get the Latest Linux Agent directly from:

- [The different Distribution providers endorsing Linux on Azure](http://support.microsoft.com/kb/2805216)
- or from the [GitHub Open Source Repository for the Azure Linux Agent](https://github.com/Azure/WALinuxAgent)


## Requirements
The following systems have been tested and are known to work with the Azure Linux Agent. **Please note that this list may differ from the official list of supported systems on the Microsoft Azure Platform**, as described here:
[http://support.microsoft.com/kb/2805216](http://support.microsoft.com/kb/2805216)

###Supported Linux Distributions

* CoreOS
* CentOS 6.2+
* Debian 7.0+
* Ubuntu 12.04+
* openSUSE 12.3+
* SLES 11 SP2+
* Oracle Linux 6.4+

Other Supported Systems:

* FreeBSD 9+ (Azure Linux Agent v2.0.10+)


The Linux agent depends on some system packages in order to function properly:

* Python 2.6+
* Openssl 1.0+
* Openssh 5.3+
* Filesystem utilities: sfdisk, fdisk, mkfs, parted
* Password tools: chpasswd, sudo
* Text processing tools: sed, grep
* Network tools: ip-route


##Installation

Installation using an RPM or a DEB package from your distribution's package repository is the preferred method of installing and upgrading the Azure Linux Agent.

If installing manually, the 'waagent' script should be copied to /usr/sbin/waagent and installed by running: 

	# sudo chmod 755 /usr/sbin/waagent
	# sudo /usr/sbin/waagent -install -verbose

The agent's log file is kept at /var/log/waagent.log.


##Command Line Options

###Flags

- verbose: Increase verbosity of specified command
- force: Skip interactive confirmation for some commands

###Commands

- help: Lists the supported commands and flags.

- install: Manual installation of the agent
 * Checks the system for required dependencies

 * Creates the SysV init script (/etc/init.d/waagent), the logrotate configuration file (/etc/logrotate.d/waagent and configures the image to run the init script on boot

 * Writes sample configuration file to /etc/waagent.conf

 * Any existing configuration file is moved to /etc/waagent.conf.old

 * Detects kernel version and applies the VNUMA workaround if necessary

 * Moves udev rules that may interfere with networking (/lib/udev/rules.d/75-persistent-net-generator.rules, /etc/udev/rules.d/70-persistent-net.rules) to /var/lib/waagent/  

- uninstall: Remove waagent and associated files
 * Unregisters the init script from the system and deletes it

 * Deletes the logrotate configuration and the waagent config file in /etc/waagent.conf

 * Restores any moved udev rules that were moved during installation

 * Automatic reverting of the VNUMA workaround is not supported, please edit the GRUB configuration files by hand to re-enable NUMA if required.

- deprovision: Attempt to clean the system and make it suitable for re-provisioning. This operation deleted the following:
 * All SSH host keys (if Provisioning.RegenerateSshHostKeyPair is 'y' in the configuration file)

 * Nameserver configuration in /etc/resolv.conf

 * Root password from /etc/shadow (if Provisioning.DeleteRootPassword is 'y' in the configuration file)

 * Cached DHCP client leases

 * Resets host name to localhost.localdomain

 **Warning:** Deprovision does not guarantee that the image is cleared of all sensitive information and suitable for redistribution.

- deprovision+user: Performs everything under -deprovision (above) and also deletes the last provisioned user account (obtained from /var/lib/waagent) and associated data. This parameter is when de-provisioning an image that was previously provisioning on Azure so it may be captured and re-used.

- version: Displays the version of waagent

- serialconsole: Configures GRUB to mark ttyS0 (the first serial port) as
   the boot console. This ensures that kernel bootup logs are sent to the
   serial port and made available for debugging.

- daemon: Run waagent as a daemon to manage interaction with the platform.
   This argument is specified to waagent in the waagent init script.

##Configuration

A configuration file (/etc/waagent.conf) controls the actions of waagent. 
A sample configuration file is shown below:
	
	#
	# Azure Linux Agent Configuration	
	#
	Role.StateConsumer=None 
	Role.ConfigurationConsumer=None 
	Role.TopologyConsumer=None
	Provisioning.Enabled=y
	Provisioning.DeleteRootPassword=n
	Provisioning.RegenerateSshHostKeyPair=y
	Provisioning.SshHostKeyPairType=rsa
	Provisioning.MonitorHostName=y
	ResourceDisk.Format=y
	ResourceDisk.Filesystem=ext4
	ResourceDisk.MountPoint=/mnt/resource 
	ResourceDisk.EnableSwap=n 
	ResourceDisk.SwapSizeMB=0
	LBProbeResponder=y
	Logs.Verbose=n
	OS.RootDeviceScsiTimeout=300
	OS.OpensslPath=None

The various configuration options are described in detail below. Configuration options are of three types; Boolean, String or Integer. The Boolean configuration options can be specified as "y" or "n". The special keyword "None" may be used for some string type configuration entries as detailed below.

**Role.StateConsumer:**

Type: String  
Default: None

If a path to an executable program is specified, it is invoked when waagent has provisioned the image and the "Ready" state is about to be reported to the Fabric. The argument specified to the program will be "Ready". The agent will not wait for the program to return before continuing.

**Role.ConfigurationConsumer:**

Type: String  
Default: None

If a path to an executable program is specified, the program is invoked when the Fabric indicates that a configuration file is available for the virtual machine. The path to the XML configuration file is provided as an argument to the executable. This may be invoked multiple times whenever the configuration file changes. A sample file is provided in the Appendix. The current path of this file is /var/lib/waagent/HostingEnvironmentConfig.xml.

**Role.TopologyConsumer:**

Type: String  
Default: None

If a path to an executable program is specified, the program is invoked when the Fabric indicates that a new network topology layout is available for the virtual machine.The path to the XML configuration file is provided as an argument to the executable. This may be invoked multiple times whenever the network topology changes (due to service healing for example). A sample file is provided in the Appendix. The current location of this file is /var/lib/waagent/SharedConfig.xml.

**Provisioning.Enabled:**

Type: Boolean  
Default: y

This allows the user to enable or disable the provisioning functionality in the agent. Valid values are "y" or "n". If provisioning is disabled, SSH host and user keys in the image are preserved and any configuration specified in the Azure provisioning API is ignored.

	Note that this parameter defaults to "n" on Ubuntu Cloud Images that use cloud-init for provisioning.

**Provisioning.DeleteRootPassword:**

Type: Boolean  
Default: n

If set, the root password in the /etc/shadow file is erased during the provisioning process.

**Provisioning.RegenerateSshHostKeyPair:**

Type: Boolean  
Default: y

If set, all SSH host key pairs (ecdsa, dsa and rsa) are deleted during the provisioning process from /etc/ssh/. And a single fresh key pair is generated.

The encryption type for the fresh key pair is configurable by the Provisioning.SshHostKeyPairType entry. Please note that some distributions will re-create SSH key pairs for any missing encryption types when the SSH daemon is restarted (for example, upon a reboot).

**Provisioning.SshHostKeyPairType:**

Type: String  
Default: rsa

This can be set to an encryption algorithm type that is supported by the SSH daemon on the virtual machine. The typically supported values are "rsa", "dsa" and "ecdsa". Note that "putty.exe" on Windows does not support "ecdsa". So, if you intend to use putty.exe on Windows to connect to a Linux deployment, please use "rsa" or "dsa".

**Provisioning.MonitorHostName:**

Type: Boolean  
Default: y

If set, waagent will monitor the Linux virtual machine for hostname changes (as returned by the "hostname" command) and automatically update the networking configuration in the image to reflect the change. In order to push the name change to the DNS servers, networking will be restarted in the virtual machine. This will result in brief loss of Internet connectivity.

**ResourceDisk.Format:**

Type: Boolean  
Default: y

If set, the resource disk provided by the platform will be formatted and mounted by waagent if the filesystem type requested by the user in "ResourceDisk.Filesystem" is anything other than "ntfs". A single partition of type Linux (83) will be made available on the disk. Note that this partition will not be formatted if it can be successfully mounted.

**ResourceDisk.Filesystem:**

Type: String  
Default: ext4

This specifies the filesystem type for the resource disk. Supported values vary by Linux distribution. If the string is X, then mkfs.X should be present on the Linux image. SLES 11 images should typically use 'ext3'. FreeBSD images should use 'ufs2' here.

**ResourceDisk.MountPoint:**

Type: String  
Default: /mnt/resource 

This specifies the path at which the resource disk is mounted. Note that the resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned.

**ResourceDisk.EnableSwap:**

Type: Boolean  
Default: n 

If set, a swap file (/swapfile) is created on the resource disk and added to the system swap space.

**ResourceDisk.SwapSizeMB:**

Type: Integer  
Default: 0

The size of the swap file in megabytes.

**LBProbeResponder:**

Type: Boolean  
Default: y

If set, waagent will respond to load balancer probes from the platform (if present).

**Logs.Verbose:**

Type: Boolean  
Default: n

If set, log verbosity is boosted. Waagent logs to /var/log/waagent.log and leverages the system logrotate functionality to rotate logs.

**OS.RootDeviceScsiTimeout:**

Type: Integer  
Default: 300

This configures the SCSI timeout in seconds on the OS disk and data drives. If not set, the system defaults are used.

**OS.OpensslPath:**

Type: String  
Default: None

This can be used to specify an alternate path for the openssl binary to use for cryptographic operations.



##Ubuntu Cloud Images

Note that Ubuntu Cloud Images utilize [cloud-init](https://launchpad.net/ubuntu/+source/cloud-init) to perform many configuration tasks that would otherwise be managed by the Azure Linux Agent.  Please note the following differences:


- **Provisioning.Enabled** defaults to "n" on Ubuntu Cloud Images that use cloud-init to perform provisioning tasks.

- The following configuration parameters have no effect on Ubuntu Cloud Images that use cloud-init to manage the resource disk and swap space:

 - **ResourceDisk.Format**
 - **ResourceDisk.Filesystem**
 - **ResourceDisk.MountPoint**
 - **ResourceDisk.EnableSwap**
 - **ResourceDisk.SwapSizeMB**

- Please see the following resources to configure the resource disk mount point and swap space on Ubuntu Cloud Images during provisioning:

 - [Ubuntu Wiki: Configure Swap Partitions](http://go.microsoft.com/fwlink/?LinkID=532955&clcid=0x409)
 - [Injecting Custom Data into an Azure Virtual Machine](./virtual-machines-how-to-inject-custom-data.md)

