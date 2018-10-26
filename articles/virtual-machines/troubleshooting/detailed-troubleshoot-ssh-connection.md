---
title: Detailed SSH troubleshooting for an Azure VM | Microsoft Docs
description: More detailed SSH troubleshooting steps for issues connecting to an Azure virtual machine
keywords: ssh connection refused,ssh error,azure ssh,SSH connection failed
services: virtual-machines-linux
documentationcenter: ''
author: genlin
manager: jeconnoc
editor: ''
tags: top-support-issue,azure-service-management,azure-resource-manager

ms.assetid: b8e8be5f-e8a6-489d-9922-9df8de32e839
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: troubleshooting
ms.date: 12/13/2017
ms.author: genli

---
# Detailed SSH troubleshooting steps for issues connecting to a Linux VM in Azure
There are many possible reasons that the SSH client might not be able to reach the SSH service on the VM. If you have followed through the more [general SSH troubleshooting steps](troubleshoot-ssh-connection.md), you need to further troubleshoot the connection issue. This article guides you through detailed troubleshooting steps to determine where the SSH connection is failing and how to resolve it.

## Take preliminary steps
The following diagram shows the components that are involved.

![Diagram that shows components of SSH service](./media/detailed-troubleshoot-ssh-connection/ssh-tshoot1.png)

The following steps help you isolate the source of the failure and figure out solutions or workarounds.

1. Check the status of the VM in the portal.
   In the [Azure portal](https://portal.azure.com), select **Virtual machines** > *VM name*.

   The status pane for the VM should show **Running**. Scroll down to show recent activity for compute, storage, and network resources.

2. Select **Settings** to examine endpoints, IP addresses, network security groups, and other settings.

   The VM should have an endpoint defined for SSH traffic that you can view in **Endpoints** or **[Network security group](../../virtual-network/security-overview.md)**. Endpoints in VMs that were created by using Resource Manager are stored in a network security group. Verify that the rules have been applied to the network security group and are referenced in the subnet.

To verify network connectivity, check the configured endpoints and see if you can connect to the VM through another protocol, such as HTTP or another service.

After these steps, try the SSH connection again.

## Find the source of the issue
The SSH client on your computer might fail to connect to the SSH service on the Azure VM due to issues or misconfigurations in the following areas:

* [SSH client computer](#source-1-ssh-client-computer)
* [Organization edge device](#source-2-organization-edge-device)
* [Cloud service endpoint and access control list (ACL)](#source-3-cloud-service-endpoint-and-acl)
* [Network security groups](#source-4-network-security-groups)
* [Linux-based Azure VM](#source-5-linux-based-azure-virtual-machine)

## Source 1: SSH client computer
To eliminate your computer as the source of the failure, verify that it can make SSH connections to another on-premises, Linux-based computer.

![Diagram that highlights SSH client computer components](./media/detailed-troubleshoot-ssh-connection/ssh-tshoot2.png)

If the connection fails, check for the following issues on your computer:

* A local firewall setting that is blocking inbound or outbound SSH traffic (TCP 22)
* Locally installed client proxy software that is preventing SSH connections
* Locally installed network monitoring software that is preventing SSH connections
* Other types of security software that either monitor traffic or allow/disallow specific types of traffic

If one of these conditions apply, temporarily disable the software and try an SSH connection to an on-premises computer to find out the reason the connection is being blocked on your computer. Then work with your network administrator to correct the software settings to allow SSH connections.

If you are using certificate authentication, verify that you have these permissions to the .ssh folder in your home directory:

* Chmod 700 ~/.ssh
* Chmod 644 ~/.ssh/\*.pub
* Chmod 600 ~/.ssh/id_rsa (or any other files that have your private keys stored in them)
* Chmod 644 ~/.ssh/known_hosts (contains hosts that you’ve connected to via SSH)

## Source 2: Organization edge device
To eliminate your organization edge device as the source of the failure, verify that a computer directly connected to the Internet can make SSH connections to your Azure VM. If you are accessing the VM over a site-to-site VPN or an Azure ExpressRoute connection, skip to [Source 4: Network security groups](#nsg).

![Diagram that highlights organization edge device](./media/detailed-troubleshoot-ssh-connection/ssh-tshoot3.png)

If you don't have a computer that is directly connected to the Internet, create a new Azure VM in its own resource group or cloud service and use that new VM. For more information, see [Create a virtual machine running Linux in Azure](../linux/quick-create-cli.md). Delete the resource group or VM and cloud service when you're done with your testing.

If you can create an SSH connection with a computer that's directly connected to the Internet, check your organization edge device for:

* An internal firewall that's blocking SSH traffic with the Internet
* A proxy server that's preventing SSH connections
* Intrusion detection or network monitoring software running on devices in your edge network that's preventing SSH connections

Work with your network administrator to correct the settings of your organization edge devices to allow SSH traffic with the Internet.

## Source 3: Cloud service endpoint and ACL
> [!NOTE]
> This source applies only to VMs that were created by using the classic deployment model. For VMs that were created by using Resource Manager, skip to [source 4: Network security groups](#nsg).

To eliminate the cloud service endpoint and ACL as the source of the failure, verify that another Azure VM in the same virtual network can connect using SSH.

![Diagram that highlights cloud service endpoint and ACL](./media/detailed-troubleshoot-ssh-connection/ssh-tshoot4.png)

If you don't have another VM in the same virtual network, you can easily create one. For more information, see [Create a Linux VM on Azure using the CLI](../linux/quick-create-cli.md). Delete the extra VM when you are done with your testing.

If you can create an SSH connection with a VM in the same virtual network, check the following areas:

* **The endpoint configuration for SSH traffic on the target VM.** The private TCP port of the endpoint should match the TCP port on which the SSH service on the VM is listening. (The default port is 22). Verify the SSH TCP port number in the Azure portal by selecting **Virtual machines** > *VM name* > **Settings** > **Endpoints**.
* **The ACL for the SSH traffic endpoint on the target virtual machine.** An ACL enables you to specify allowed or denied incoming traffic from the Internet, based on its source IP address. Misconfigured ACLs can prevent incoming SSH traffic to the endpoint. Check your ACLs to ensure that incoming traffic from the public IP addresses of your proxy or other edge server is allowed. For more information, see [About network access control lists (ACLs)](../../virtual-network/virtual-networks-acl.md).

To eliminate the endpoint as a source of the problem, remove the current endpoint, create another endpoint, and specify the SSH name (TCP port 22 for the public and private port number). For more information, see [Set up endpoints on a virtual machine in Azure](../windows/classic/setup-endpoints.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

<a id="nsg"></a>

## Source 4: Network security groups
Network security groups enable you to have more granular control of allowed inbound and outbound traffic. You can create rules that span subnets and cloud services in an Azure virtual network. Check your network security group rules to ensure that SSH traffic to and from the Internet is allowed.
For more information, see [About network security groups](../../virtual-network/security-overview.md).

You can also use IP Verify to validate the NSG configuration. For more information, see [Azure network monitoring overview](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview). 

## Source 5: Linux-based Azure virtual machine
The last source of possible problems is the Azure virtual machine itself.

![Diagram that highlights Linux-based Azure virtual machine](./media/detailed-troubleshoot-ssh-connection/ssh-tshoot5.png)

If you haven't done so already, follow the instructions [to reset a password Linux-based virtual machines](../linux/reset-password.md).

Try connecting from your computer again. If it still fails, the following are some of the possible issues:

* The SSH service is not running on the target virtual machine.
* The SSH service is not listening on TCP port 22. To test, install a telnet client on your local computer and run "telnet *cloudServiceName*.cloudapp.net 22". This step determines if the virtual machine allows inbound and outbound communication to the SSH endpoint.
* The local firewall on the target virtual machine has rules that are preventing inbound or outbound SSH traffic.
* Intrusion detection or network monitoring software that's running on the Azure virtual machine is preventing SSH connections.

## Additional resources
For more information about troubleshooting application access, see [Troubleshoot access to an application running on an Azure virtual machine](../linux/troubleshoot-app-connection.md)
