<properties umbracoNaviHide="0" pageTitle="Intro to Windows Azure" metaKeywords="" metaDescription="" linkid="manage-linux-fundamentals-intro-to-windows-azure" urlDisplayName="Intro to Windows Azure" headerExpose="" footerExpose="" disqusComments="1" />
<div chunk="../../../DevCenter/Shared/Chunks/intro-to-windows-azure.md" />


<h1 id = "linuxonwindowsazure"> Introduction to Linux on Windows Azure  </h1>
This topic provides an overview of some aspects of using Linux virtual machines in the Windows Azure cloud. Deploying a Linux virtual machine is a straightforward process when using a pre-existing image in the Windows Azure gallery. For a tutorial, see Create a Linux virtual machine. 

## Table of Contents ##

* [Authentication: Usernames, Passwords and SSH keys.](#authentication)
* [Generation and use of SSH keys for logging into Linux virtual machines.](#keygeneration)
* [Obtaining superuser privileges using sudo](#superuserprivileges)
* [Firewall configuration](#firewallconfiguration)
* [Hostname changes](#hostnamechanges)
* [Virtual machine image capture](#virtualmachine)
* [Attaching Disks](#attachingdisks)

<h2 id="authentication"> Authentication: Usernames, Passwords and SSH Keys </h2>

When creating a Linux virtual machine using the Windows Azure Management Portal, you are asked to provide a username, password and (optionally) an SSH public key. The choice of a username for deploying a Linux virtual machine on Windows Azure is subject to the following constraint: names of system accounts already present in the virtual machine are not allowed – “root” for example.  If you don’t provide the SSH public key, you will be able to log in to the virtual machine using the specified username and password. If you elect to upload an SSH public key in the Management Portal, password-based authentication will be disabled and you will be required to use the corresponding SSH private key to authenticate with the virtual machine and log in.

<h2 id="keygeneration">SSH Key Generation </h2>

The current version of the Management Portal only accepts SSH public keys that are encapsulated in an X509 certificate. Please follow the steps below to generate and use SSH keys with Windows Azure.

1.	Use openssl to generate an X509 certificate with a 2048-bit RSA keypair.
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout myPrivateKey.key -out myCert.pem
Please answer the few questions that the openssl prompts for (you may leave them blank). The content in these fields is not used by the platform.
2.	Change the permissions on the private key to secure it.
chmod 600 myPrivateKey.key
3.	Convert the  myCert.pem to myCert.cer (DER encoded X509 certificate)
openssl  x509 -outform der -in myCert.pem -out myCert.cer
4.	Upload the myCert.cer while creating the Linux virtual machine. The provisioning process will automatically install the public key in this certificate into the authorized_keys file for the specified user in the virtual machine.
5.	Connect to the Linux virtual machine using ssh.
ssh –i  myPrivateKey.key –p port  username@servicename.cloudapp.net
You will be prompted to accept the fingerprint of the host’s public key the first time you log in.
6.	You may optionally copy myPrivateKey.key to ~/.ssh/id_rsa so that your openssh client can automatically pick this up without the use of the –i option.

<h2 id="superuserprivileges">Obtaining Superuser Privileges Using Sudo</h2> 

The user account that is specified during virtual machine instance deployment on Windows Azure is a privileged account. This account is configured by the Windows Azure Linux Agent to be able to elevate privileges to root (superuser account) using the sudo tool. Once you’re logged in using this user account, you will be able to run commands as root using “sudo command”. You can optionally obtain a root shell using “sudo –s”.

<h2 id="firewallconfiguration"> Firewall Configuration </h2>

The Windows Azure platform provides an inbound packet filter that restricts connectivity to ports specified in the Management Portal. By default, the only allowed port is SSH. You may open up access to additional ports on your Linux virtual machine by adding rules in the Management Portal.
The Linux images in the Windows Azure gallery do not enable the iptables firewall inside the Linux virtual machines. If desired, the iptables firewall may be configured to provide additional capabilities.

<h2 id="hostnamechanges"> Hostname Changes </h2>

When you initially deploy an instance of a Linux image, you are required to provide a host name for the virtual machine. Once the virtual machine is running, this hostname is published to the platform DNS servers so that multiple virtual machines connected to each other can perform IP address lookups using hostnames. If hostname changes are desired after a virtual machine has been deployed, please use the “hostname newname” command. The Windows Azure Linux Agent includes functionality to automatically detect this name change and appropriately configure the virtual machine to persist this change and additionally, publish this change to the platform DNS servers. Please refer to the README file for the Windows Azure Linux Agent for additional details and configuration options related to this functionality.

<h2 id="virtualmachine"> Virtual Machine Image Capture </h2>

The Windows Azure platform provides the ability to capture the state of an existing virtual machine into an image that can be subsequently be used to deploy additional virtual machine instances. The Windows Azure Linux Agent may be used to rollback some of the customization that was performed during the provisioning process. You may follow the steps below to capture a virtual machine as an image:

1.	Run “waagent –deprovision” to undo provisioning customization. Or “waagent –deprovision+user” to optionally, delete the user account specified during provisioning and all associated data.
2.	Shut down/power off the virtual machine using the Management Portal/tools.
3.	Click capture in the Management Portal or use the tools to capture the virtual machine as an image.

<h2 id="attachingdisks">Attaching Disks </h2>
This is covered step-by-step in the Tutorial on how to create a Linux virtual machine.
