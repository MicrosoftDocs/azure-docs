<properties urlDisplayName="Intro to Linux" pageTitle="Introduction to Linux in Azure - Azure Tutorial" metaKeywords="Azure Linux vm, Linux vm" description="Learn about using Linux virtual machines on Azure." metaCanonical="" services="virtual-machines" documentationCenter="Python" title="Introduction to Linux on Azure" authors="szark" solutions="" manager="timlt" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="szark" />





#Introduction to Linux on Azure

This topic provides an overview of some aspects of using Linux virtual machines in the Azure cloud. Deploying a Linux virtual machine is a straightforward process when using a pre-existing image in the gallery. 

## Table of Contents ##

* [Authentication: Usernames, Passwords and SSH keys.](#authentication)
* [Generation and use of SSH keys for logging into Linux virtual machines.](#keygeneration)
* [Obtaining superuser privileges using sudo](#superuserprivileges)
* [Firewall configuration](#firewallconfiguration)
* [Hostname changes](#hostnamechanges)
* [Virtual machine image capture](#virtualmachine)
* [Attaching Disks](#attachingdisks)

## <a id="authentication"></a>Authentication: Usernames, Passwords and SSH Keys

When creating a Linux virtual machine using the Azure Management Portal, you are asked to provide a username, password and (optionally) an SSH public key. The choice of a username for deploying a Linux virtual machine on Azure is subject to the following constraint: names of system accounts (UID <100) already present in the virtual machine are not allowed, 'root' for example.

 - See [How to Use SSH with Linux on Azure](../linux-use-ssh-key/)


### <a id="keygeneration"></a>SSH Key Generation

The current version of the Management Portal only accepts SSH public keys that are encapsulated in an X509 certificate. Please follow the steps below to generate and use SSH keys with Azure.

1. Use openssl to generate an X509 certificate with a 2048-bit RSA keypair.
		
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout myPrivateKey.key -out myCert.pem

	Please answer the few questions that the openssl prompts for (you may leave them blank). The content in these fields is not used by the platform.

2. Change the permissions on the private key to secure it.

		chmod 600 myPrivateKey.key

3. Convert the `myCert.pem` to `myCert.cer` (DER encoded X509 certificate)

		openssl  x509 -outform der -in myCert.pem -out myCert.cer

4. Upload the `myCert.cer` while creating the Linux virtual machine. The provisioning process will automatically install the public key in this certificate into the `~/.ssh/authorized_keys` file for the specified user in the virtual machine.

5. Connect to the Linux virtual machine using ssh.

		ssh -i  myPrivateKey.key -p port  username@servicename.cloudapp.net

	You will be prompted to accept the fingerprint of the host's public key the first time you log in.

6. You may optionally copy `myPrivateKey.key` to `~/.ssh/id_rsa` so that your openssh client can automatically pick this up without the use of the -i option.
   Alternatively you can modify `~/.ssh/config` to include a section for your virtual machine:

        Host servicename.cloudapp.net
          IdentityFile %d/.ssh/myPrivateKey.key


### Generate a Key from an Existing OpenSSH Compatible Key
The previous example describes how to create a new key for use with Windows Azure. In some cases users may already have an existing OpenSSH compatible public & private key pair and wish to use the same keys with Windows Azure.

OpenSSH private keys are directly readable by the `openssl` utility. The following command will take an existing SSH private key (id_rsa in the example below) and create the `.pem` public key that is needed for Windows Azure:

	# openssl req -x509 -key ~/.ssh/id_rsa -nodes -days 365 -newkey rsa:2048 -out myCert.pem

The **myCert.pem** file is the public key that may then be used to provision a Linux virtual machine on Windows Azure. During provisioning the `.pem` file will be translated into an `openssh` compatible public key and placed in `~/.ssh/authorized_keys`.


## <a id="superuserprivileges"></a>Obtaining Superuser Privileges Using `sudo`

The user account that is specified during virtual machine instance deployment on Azure is a privileged account. This account is configured by the Azure Linux Agent to be able to elevate privileges to root (superuser account) using the `sudo` utility. Once logged in using this user account, you will be able to run commands as root using the command syntax

	# sudo <COMMAND>

You can optionally obtain a root shell using **sudo -s**.

- See [Using root privileges on Linux virtual machines in Azure](../virtual-machines-linux-use-root-privileges/)


## <a id="firewallconfiguration"></a>Firewall Configuration

Azure provides an inbound packet filter that restricts connectivity to ports specified in the Management Portal. By default, the only allowed port is SSH. You may open up access to additional ports on your Linux virtual machine by configuring endpoints in the Management Portal:

 - See: [How to Set Up Endpoints to a Virtual Machine](../virtual-machines-set-up-endpoints/)

The Linux images in the Azure Gallery do not enable the *iptables* firewall by default. If desired, the firewall may be configured to provide additional filtering.


## <a id="hostnamechanges"></a>Hostname Changes

When you initially deploy an instance of a Linux image, you are required to provide a host name for the virtual machine. Once the virtual machine is running, this hostname is published to the platform DNS servers so that multiple virtual machines connected to each other can perform IP address lookups using hostnames.

If hostname changes are desired after a virtual machine has been deployed, please use the command

	# sudo hostname <newname>

The Azure Linux Agent includes functionality to automatically detect this name change and appropriately configure the virtual machine to persist this change and publish this change to the platform DNS servers.

 - [Azure Linux Agent User Guide](../virtual-machines-linux-agent-user-guide/)

### Ubuntu Images
Ubuntu images utilize cloud-init, which provides additional capabilities for bootstrapping a virtual machine.

 - See [Custom Data and Cloud-Init on Microsoft Azure](http://azure.microsoft.com/blog/2014/04/21/custom-data-and-cloud-init-on-windows-azure/)


## <a id="virtualmachine"></a>Virtual Machine Image Capture

Azure provides the ability to capture the state of an existing virtual machine into an image that can subsequently be used to deploy additional virtual machine instances. The Azure Linux Agent may be used to rollback some of the customization that was performed during the provisioning process. You may follow the steps below to capture a virtual machine as an image:

1. Run **waagent -deprovision** to undo provisioning customization. Or **waagent -deprovision+user** to optionally, delete the user account specified during provisioning and all associated data.

2. Shut down/power off the virtual machine.

3. Click *Capture* in the Management Portal or use the Powershell or CLI tools to capture the virtual machine as an image.

 - See: [How to Capture a Linux Virtual Machine to Use as a Template](../virtual-machines-linux-capture-image/)


## <a id="attachingdisks"></a>Attaching Disks

Each virtual machine has a temporary, local *resource disk* attached. Because data on a resource disk may not be durable across reboots, it is often used by applications and processes running in the virtual machine for transient and **temporary** storage of data. It is also used to store the page or swap files for the operating system.

On Linux, the resource disk is typically managed by the Azure Linux Agent and automatically mounted to **/mnt/resource** (or **/mnt** on Ubuntu images).

	>[WACOM.NOTE] Note that the resource disk is a **temporary** disk, and might be deleted and reformatted when the VM is rebooted.

On Linux the data disk might be named by the kernel as `/dev/sdc`, and users will need to partition, format and mount that resource. This is covered step-by-step in the tutorial: [How to Attach a Data Disk to a Virtual Machine](../virtual-machines-linux-how-to-attach-disk/).

 - See also: [Configure Software RAID on Linux](../virtual-machines-linux-configure-raid/)

