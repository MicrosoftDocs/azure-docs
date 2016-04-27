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
	ms.date="04/12/2016"
	ms.author="iainfou"/>

# Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine

There could be various causes of SSH errors while trying to connect to a Linux-based Azure virtual machine. This article will help you find and correct them.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click **Get support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).


## Fix common SSH errors

This section lists quick fix steps for common SSH connection issues.

### Virtual machines created using classic deployment model

Try these steps to resolve the most common SSH connection failures:

1. _Reset Remote Access_ from the [Azure portal](https://portal.azure.com).<br>
   Click **Browse** > **Virtual machines (classic)** > your Linux virtual machine > **Reset Remote...**.

2. Restart the virtual machine.<br>
   From the [Azure portal](https://portal.azure.com), click **Browse** > **Virtual machines (classic)** > your Linux virtual machine > **Restart**.<br>
	 From the [Azure classic portal](https://manage.windowsazure.com), open the **Virtual machines** > **Instances** > **Restart**.

3. [Resize the virtual machine](https://msdn.microsoft.com/library/dn168976.aspx).

4. Follow the instructions in [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md) on the virtual machine, to:

	- Reset the password or SSH key.
	- Create a new _sudo_ user account.
	- Reset the SSH configuration.

5. Check VM's Resource Health for any platform issues.<br>
	 Click **Browse** > **Virtual Machines (classic)** > your Linux virtual machine > **Settings** > **Check Health**.


### Virtual machines created using Resource Manager deployment model

To resolve the common SSH issues for virtual machines created using the Resource Manager deployment model, try the following steps.

#### Reset the SSH connection
Using the Azure CLI, make sure the [Microsoft Azure Linux Agent](virtual-machines-linux-agent-user-guide.md) version 2.0.5 or later is installed.

If you haven't already, [install the Azure CLI and connect to your Azure subscription](../xplat-cli-install.md) and log in using the `azure login` command. Make sure you are in the Resource Manager mode:
	```
	azure config mode arm
	```

Reset the SSH connection using either of the following methods:

* Use the `vm reset-access` command as in the following example.

	```
	azure vm reset-access -g YourResourceGroupName -n YourVirtualMachineName -r
	```

This will install the `VMAccessForLinux` extension on your virtual machine.

* Alternatively, create a file named PrivateConf.json with the following content:

	```
	{  
		"reset_ssh":"True"
	}
	```

Then manually run the `VMAccessForLinux` extension to reset your SSH connection.

	```
	azure vm extension set "YourResourceGroupName" "YourVirtualMachineName" VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
	```

#### Reset the SSH credentials

* Run the `vm reset-access` command to set any of the SSH credentials.

	```
	azure vm reset-access TestRgV2 TestVmV2 -u NewUser -p NewPassword
	```

See more information about this by typing `azure vm reset-access -h` on the command line.

* Alternatively, create a file named PrivateConf.json with the following contents.

	```
	{
		"username":"NewUsername", "password":"NewPassword", "expiration":"2016-01-01", "ssh_key":"", "reset_ssh":false, "remove_user":""
	}
	```

Then run the Linux extension using the above file.

	```
	$azure vm extension set "testRG" "testVM" VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
	```

Note that you can follow steps similar to [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md) to try other variations. Remember to modify the Azure CLI instructions for the Resource Manager mode.


## Detailed troubleshooting of SSH errors

If the SSH client still cannot reach the SSH service on the virtual machine, it can be due to many reasons. Here are the components involved.

![Diagram that shows components of SSH service](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot1.png)

The following sections will help you isolate the source of the failure and figure out solutions or workarounds.

### Preliminary steps

First, check the status of virtual machine in the portal.

In the [Azure classic portal](https://manage.windowsazure.com), for virtual machines in classic deployment model:

1. Click **Virtual machines** > *VM name*.
2. Click the VM's **Dashboard** to check its status.
3. Click **Monitor** to see recent activity for compute, storage, and network resources.
4. Click **Endpoints** to ensure that there is an endpoint for SSH traffic.

In the [Azure portal](https://portal.azure.com):

1. For a virtual machine created in classic deployment model, click **Browse** > **Virtual machines (classic)** > *VM name*. For a virtual machine created using the Resource Manager, click **Browse** > **Virtual machines** > *VM name*. The status pane for the virtual machine should show **Running**. Scroll down to show recent activity for compute, storage, and network resources.
2. Click **Settings** to examine endpoints, IP addresses, and other settings. To identify endpoints in virtual machines created with the Resource Manager, check if a [Network Security Group](../virtual-network/virtual-networks-nsg.md) is defined, the rules applied to it and if they are referenced in the subnet.

To verify network connectivity, check the configured endpoints and see if you can reach the VM through another protocol, such as HTTP or another service.

After these steps, try the SSH connection again.


### Find out source of the issue

The SSH client on your computer could fail to reach the SSH service on the Azure virtual machine due to these possible sources of issues or misconfigurations:

- SSH client computer
- Organization edge device
- Cloud service endpoint and access control list (ACL)
- Network Security Groups
- Linux-based Azure virtual machine

#### Source 1: SSH client computer

To eliminate your computer as the source of the failure, check that it can make SSH connections to another on-premises, Linux-based computer.

![Diagram that highlights SSH client computer component](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot2.png)

If this fails, check for these on your computer:

- A local firewall setting that is blocking inbound or outbound SSH traffic (TCP 22)
- Locally installed client proxy software that is preventing SSH connections
- Locally installed network monitoring software that is preventing SSH connections
- Other types of security software that either monitor traffic or allow/disallow specific types of traffic

In all of these cases, temporarily disable the software and try an SSH connection to an on-premises computer to find out the cause. Then, work with your network administrator to correct the settings of the software to allow SSH connections.

If you are using certificate authentication, verify that you have these permissions to the .ssh folder in your home directory:

- Chmod 700 ~/.ssh
- Chmod 644 ~/.ssh/\*.pub
- Chmod 600 ~/.ssh/id_rsa (or any other files that have your private keys stored in)
- Chmod 644 ~/.ssh/known_hosts (contains hosts you’ve connected to via SSH)

#### Source 2: Organization edge device

To eliminate your organization edge device as the source of failure, check that a computer directly connected to the Internet can make SSH connections to your Azure VM. If you are accessing the VM over a site-to-site VPN or ExpressRoute connection, skip to [Source 4: Network security groups](#nsg).

![Diagram that highlights organization edge device](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot3.png)

If you do not have a computer that is directly connected to the Internet, you can easily create a new Azure virtual machine in its own resource group or cloud service and use it. For more information, see [Create a virtual machine running Linux in Azure](virtual-machines-linux-quick-create-cli.md). Delete the resource group or virtual machine and cloud service when you are done with your testing.

If you can create an SSH connection with a computer directly attached to the Internet, check your organization edge device for:

- An internal firewall that is blocking SSH traffic with the Internet
- Your proxy server that is preventing SSH connections
- Intrusion detection or network monitoring software running on devices in your edge network that is preventing SSH connections

Work with your network administrator to correct the settings of your organization edge devices to allow SSH traffic with the Internet.

#### Source 3: Cloud service endpoint and ACL

> [AZURE.NOTE] This source applies only for virtual machines created using classic deployment model. For virtual machines created using the Resource Manager, skip to [source 4: Network security groups](#nsg).

To eliminate the cloud service endpoint and ACL as the source of the failure, for VMs created using the [classic deployment model](../resource-manager-deployment-model.md), check that another Azure VM in the same virtual network can make SSH connections to your VM.

![Diagram that highlights cloud service endpoint and ACL](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot4.png)

If you do not have another VM in the same virtual network, you can easily create a new one. For more information, see [Create a virtual machine running Linux in Azure](virtual-machines-linux-quick-create-cli.md). Delete the extra VM when you are done with your testing.

If you can create an SSH connection with a VM in the same virtual network, check:

- The endpoint configuration for SSH traffic on the target VM. The private TCP port of the endpoint should match the TCP port on which the SSH service on the VM is listening (default is 22). For VMs created in the Resource Manager deployment model using templates, verify the SSH TCP port number in the Azure portal with **Browse** > **Virtual machines (v2)** > *VM name* > **Settings** > **Endpoints**.
- The ACL for the SSH traffic endpoint on the target virtual machine. ACLs allow you to specify allowed or denied incoming traffic from the Internet, based on its source IP address. Misconfigured ACLs can prevent incoming SSH traffic to the endpoint. Check your ACLs to ensure that incoming traffic from public IP addresses of your proxy or other edge server are allowed. For more information, see [About network access control lists (ACLs)](../virtual-network/virtual-networks-acl.md).

To eliminate the endpoint as a source of the problem, remove the current endpoint and create a new endpoint and specify the **SSH** name (TCP port 22 for the public and private port number). For more information, see [Set up endpoints on a virtual machine in Azure](virtual-machines-windows-classic-setup-endpoints.md).

<a id="nsg"></a>
#### Source 4: Network security groups

Network security groups allow you to have more granular control of allowed inbound and outbound traffic. You can create rules that span subnets and cloud services in an Azure virtual network. Check your network security group rules to ensure that SSH traffic to and from the Internet is allowed.
For more information, see [About network security groups](../virtual-network/virtual-networks-nsg.md).

#### Source 5: Linux-based Azure virtual machine

The last source of possible problems is the Azure virtual machine itself.

![Diagram that highlights Linux-based Azure virtual machine](./media/virtual-machines-linux-troubleshoot-ssh-connection/ssh-tshoot5.png)

If you have not done so already, follow the instructions [to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md) on the virtual machine.

Try connecting from your computer again. If it still fails, these are some of the possible problems:

- The SSH service is not running on the target virtual machine.
- The SSH service is not listening on TCP port 22. To test this, install a telnet client on your local computer and run "telnet *cloudServiceName*.cloudapp.net 22". This will find out if the virtual machine allows inbound and outbound communication to the SSH endpoint.
- The local firewall on the target virtual machine has rules that are preventing inbound or outbound SSH traffic.
- Intrusion detection or network monitoring software running on the Azure virtual machine is preventing SSH connections.


## Additional resources

For virtual machines in classic deployment model, [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md)

[Troubleshoot Windows Remote Desktop connections to a Windows-based Azure virtual machine](virtual-machines-windows-troubleshoot-rdp-connection.md)

[Troubleshoot access to an application running on an Azure virtual machine](virtual-machines-linux-troubleshoot-app-connection.md)
