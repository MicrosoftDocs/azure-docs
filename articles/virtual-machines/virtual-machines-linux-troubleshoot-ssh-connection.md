<properties
	pageTitle="Troubleshoot SSH connection to an Azure VM | Microsoft Azure"
	description="Troubleshoot and fix SSH errors like SSH connection failed or SSH connection refused for an Azure virtual machine running Linux."
	keywords="ssh connection refused,ssh error,azure ssh,SSH connection failed"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="top-support-issue,azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="support-article"
	ms.date="06/14/2016"
	ms.author="iainfou"/>

# Troubleshoot Secure Shell connections to a Linux-based Azure virtual machine

There are various reasons that you might get Secure Shell (SSH) errors when you try to connect to a Linux-based Azure virtual machine (VM). This article will help you find and correct the problems.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](http://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](http://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure Support, read the [Microsoft Azure support FAQ](http://azure.microsoft.com/support/faq/).

## VMs created by using the Resource Manager deployment model

You can reset credentials or SSHD using either Azure CLI commands directly or the [Azure VMAccessForLinux extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess). The Azure CLI provides a direct way to interact with the VM.

### Azure CLI pre-reqs

If you haven't already, [install the Azure CLI and connect to your Azure subscription](../xplat-cli-install.md). Sign in by using the `azure login` command and make sure you are in Resource Manager mode (`azure config mode arm`).

Make sure [Microsoft Azure Linux Agent](virtual-machines-linux-agent-user-guide.md) version 2.0.5 or later is installed.

## Azure CLI - Reset SSHD
You can reset SSHD to make sure the SSH configuration itself is valid:

```bash
azure vm reset-access -g <resource group> -n <vm name> -r
```

## Azure CLI - Reset SSH credentials for a user
Reset the password for a giver user:

```bash
azure vm reset-access -g <resource group> <vm name> -u <username> -p <new password>
```

Reset the SSH key for a given user:

```bash
azure vm reset-access -g <resource group> -n <vm name> -u <usernamer> -M <~/.ssh/azure_id_rsa.pub>
```

## VM Access Extension - reset SSHD
Create a file named PrivateConf.json with the following content:

```bash
{  
	"reset_ssh":"True"
}
```

Then manually run the `VMAccessForLinux` extension to reset your SSHD connection:

```bash
azure vm extension set <resource group> <vm name> VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
```

## VM Access Extension - Reset SSH credentials for a user
To reset the password for a given user, create a file named PrivateConf.json with the following contents:

```bash
{
	"username":"Username", "password":"NewPassword"
}
```

Or to reset the SSH key for a given user, create a file named PrivateConf.json with the following contents:

```bash
{
	"username":"Username", "ssh_key":"ContentsOfNewSSHKey"
}
```

Then manually run the `VMAccessForLinux` extension to reset your SSH user credentials:

```
azure vm extension set <resource group> <vmname> VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
```

If you want to try other troubleshooting approaches, you can follow steps in [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](virtual-machines-linux-using-vmaccess-extension.md).


## Troubleshoot VMs created by using the Classic deployment model

Try these steps to resolve the most common SSH connection failures for VMs that were created by using the classic deployment model. After each step, try reconnecting to the VM.

- Reset remote access from the [Azure portal](https://portal.azure.com). On the Azure portal, select **Browse** > **Virtual machines (classic)** > *your Linux virtual machine* > **Reset Remote...**.

- Restart the VM. On the [Azure portal](https://portal.azure.com), select **Browse** > **Virtual machines (classic)** > *your Linux virtual machine* > **Restart**.

	-OR-

	On the [Azure classic portal](https://manage.windowsazure.com), select **Virtual machines** > **Instances** > **Restart**.

- Redeploy the VMe to a new Azure node. For information about how to do this, see [Redeploy virtual machine to new Azure node](virtual-machines-windows-redeploy-to-new-node.md).

	Note that after this operation finishes, ephemeral disk data will be lost and dynamic IP addresses that are associated with the virtual machine will be updated.

- Follow the instructions in [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md) to:
	- Reset the password or SSH key.
	- Create a new _sudo_ user account.
	- Reset the SSH configuration.

- Check the VM's resource health for any platform issues.<br>
	 Select **Browse** > **Virtual Machines (classic)** > *your Linux virtual machine* > **Settings** > **Check Health**.


## Troubleshoot SSH errors in more detail

There are many possible reasons that the SSH client still might not be able to reach the SSH service on the VM. The following diagram shows the components that are involved.

![Diagram that shows components of SSH service](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot1.png)

The following steps will help you isolate the source of the failure and figure out solutions or workarounds.

### Take preliminary steps

First, check the status of the VM in the portal.

In the [Azure classic portal](https://manage.windowsazure.com), for VMs that were created by using the classic deployment model:

1. Select **Virtual machines** > *VM name*.
2. Select the VM's **Dashboard** to check its status.
3. Select **Monitor** to see recent activity for compute, storage, and network resources.
4. Select **Endpoints** to ensure that there is an endpoint for SSH traffic.

In the [Azure portal](https://portal.azure.com):

1. For VMs created by using the classic deployment model, select **Browse** > **Virtual machines (classic)** > *VM name*.

	-OR-

	For VMs created by using the Resource Manager model, select **Browse** > **Virtual machines** > *VM name*.

	The status pane for the VM should show **Running**. Scroll down to show recent activity for compute, storage, and network resources.

2. Select **Settings** to examine endpoints, IP addresses, and other settings.

	To identify endpoints in VMs that were created by using Resource Manager, verify that a [network security group](../virtual-network/virtual-networks-nsg.md) has been defined. Also verify that the rules have been applied to the network security group and that they're referenced in the subnet.

To verify network connectivity, check the configured endpoints and see if you can reach the VM through another protocol, such as HTTP or another service.

After these steps, try the SSH connection again.


### Find the source of the issue

The SSH client on your computer might fail to reach the SSH service on the Azure VM due to issues or misconfigurations in the following:

- SSH client computer
- Organization edge device
- Cloud service endpoint and access control list (ACL)
- Network security groups
- Linux-based Azure VM

#### Source 1: SSH client computer

To eliminate your computer as the source of the failure, verify that it can make SSH connections to another on-premises, Linux-based computer.

![Diagram that highlights SSH client computer components](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot2.png)

If this fails, check for these on your computer:

- A local firewall setting that is blocking inbound or outbound SSH traffic (TCP 22)
- Locally installed client proxy software that is preventing SSH connections
- Locally installed network monitoring software that is preventing SSH connections
- Other types of security software that either monitor traffic or allow/disallow specific types of traffic

If one of these conditions apply, temporarily disable the software and try an SSH connection to an on-premises computer to find out the reason the connection is being blocked on your computer. Then work with your network administrator to correct the software settings to allow SSH connections.

If you are using certificate authentication, verify that you have these permissions to the .ssh folder in your home directory:

- Chmod 700 ~/.ssh
- Chmod 644 ~/.ssh/\*.pub
- Chmod 600 ~/.ssh/id_rsa (or any other files that have your private keys stored in them)
- Chmod 644 ~/.ssh/known_hosts (contains hosts that you’ve connected to via SSH)

#### Source 2: Organization edge device

To eliminate your organization edge device as the source of the failure, verify that a computer that's directly connected to the Internet can make SSH connections to your Azure VM. If you are accessing the VM over a site-to-site VPN or an Azure ExpressRoute connection, skip to [Source 4: Network security groups](#nsg).

![Diagram that highlights organization edge device](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot3.png)

If you don't have a computer that is directly connected to the Internet, you can easily create a new Azure VM in its own resource group or cloud service and use it. For more information, see [Create a virtual machine running Linux in Azure](virtual-machines-linux-quick-create-cli.md). Delete the resource group or VM and cloud service when you're done with your testing.

If you can create an SSH connection with a computer that's directly connected to the Internet, check your organization edge device for:

- An internal firewall that's blocking SSH traffic with the Internet
- A proxy server that's preventing SSH connections
- Intrusion detection or network monitoring software running on devices in your edge network that's preventing SSH connections

Work with your network administrator to correct the settings of your organization edge devices to allow SSH traffic with the Internet.

#### Source 3: Cloud service endpoint and ACL

> [AZURE.NOTE] This source applies only to VMs that were created by using the classic deployment model. For VMs that were created by using Resource Manager, skip to [source 4: Network security groups](#nsg).

To eliminate the cloud service endpoint and ACL as the source of the failure, verify that another Azure VM in the same virtual network can make SSH connections to your VM.

![Diagram that highlights cloud service endpoint and ACL](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot4.png)

If you don't have another VM in the same virtual network, you can easily create a new one. For more information, see [Create a Linux VM on Azure using the CLI](virtual-machines-linux-quick-create-cli.md). Delete the extra VM when you are done with your testing.

If you can create an SSH connection with a VM in the same virtual network, check the following:

- **The endpoint configuration for SSH traffic on the target VM.** The private TCP port of the endpoint should match the TCP port on which the SSH service on the VM is listening. (The default port is 22). For VMs created by using the Resource Manager deployment model, verify the SSH TCP port number in the Azure portal by selecting **Browse** > **Virtual machines (v2)** > *VM name* > **Settings** > **Endpoints**.

- **The ACL for the SSH traffic endpoint on the target virtual machine.** An ACL enables you to specify allowed or denied incoming traffic from the Internet, based on its source IP address. Misconfigured ACLs can prevent incoming SSH traffic to the endpoint. Check your ACLs to ensure that incoming traffic from the public IP addresses of your proxy or other edge server is allowed. For more information, see [About network access control lists (ACLs)](../virtual-network/virtual-networks-acl.md).

To eliminate the endpoint as a source of the problem, remove the current endpoint, create a new endpoint, and specify the SSH name (TCP port 22 for the public and private port number). For more information, see [Set up endpoints on a virtual machine in Azure](virtual-machines-windows-classic-setup-endpoints.md).

<a id="nsg"></a>
#### Source 4: Network security groups

Network security groups enable you to have more granular control of allowed inbound and outbound traffic. You can create rules that span subnets and cloud services in an Azure virtual network. Check your network security group rules to ensure that SSH traffic to and from the Internet is allowed.
For more information, see [About network security groups](../virtual-network/virtual-networks-nsg.md).

#### Source 5: Linux-based Azure virtual machine

The last source of possible problems is the Azure virtual machine itself.

![Diagram that highlights Linux-based Azure virtual machine](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot5.png)

If you haven't done so already, follow the instructions [to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md).

Try connecting from your computer again. If it still fails, these are some of the possible issues:

- The SSH service is not running on the target virtual machine.
- The SSH service is not listening on TCP port 22. To test this, install a telnet client on your local computer and run "telnet *cloudServiceName*.cloudapp.net 22". This will determine if the virtual machine allows inbound and outbound communication to the SSH endpoint.
- The local firewall on the target virtual machine has rules that are preventing inbound or outbound SSH traffic.
- Intrusion detection or network monitoring software that's running on the Azure virtual machine is preventing SSH connections.


## Additional resources

- For more information about troubleshooting virtual machines that were created by using the classic deployment model, see [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md).

- For more information about troubleshooting virtual machines that were created by using the Resource Manager deployment model, see:
	- [Troubleshoot Windows Remote Desktop connections to a Windows-based Azure virtual machine](virtual-machines-windows-troubleshoot-rdp-connection.md)
	-	[Troubleshoot access to an application running on an Azure virtual machine](virtual-machines-linux-troubleshoot-app-connection.md)