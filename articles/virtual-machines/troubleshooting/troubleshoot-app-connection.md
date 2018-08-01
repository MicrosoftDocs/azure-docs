---
title: Troubleshoot VM application access in Azure | Microsoft Docs
description: Use these detailed troubleshooting steps to isolate issues in connecting to applications running on virtual machines in Azure.
services: virtual-machines
documentationcenter: ''
author: genlin
manager: jeconnoc
editor: ''
tags: top-support-issue,azure-service-management,azure-resource-manager
keywords: cannot start application, program won't open, listen port blocked, unable to start program, listen port blocked

ms.assetid: b9ff7cd0-0c5d-4c3c-a6be-3ac47abf31ba
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: troubleshooting
ms.date: 05/11/2018
ms.author: genli

---
# Troubleshoot application connectivity issues on virtual machines in Azure

There are various reasons when you cannot start or connect to an application running on an Azure virtual machine (VM). Reasons include the application not running or listening on the expected ports, the listening port blocked, or networking rules not correctly passing traffic to the application. This article describes a methodical approach to find and correct the problem.

If you are having issues connecting to your VM using RDP or SSH, see one of the following articles first:

* [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](troubleshoot-rdp-connection.md)
* [Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine](troubleshoot-ssh-connection.md).

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

## Quick-start troubleshooting steps
If you have problems connecting to an application, try the following general troubleshooting steps. After each step, try connecting to your application again:

* Restart the virtual machine
* Recreate the endpoint / firewall rules / network security group (NSG) rules
  * [Resource Manager model - Manage Network Security Groups](../../virtual-network/manage-network-security-group.md)
  * [Classic model - Manage Cloud Services endpoints](../../cloud-services/cloud-services-enable-communication-role-instances.md)
* Connect from different location, such as a different Azure virtual network
* Redeploy the virtual machine
  * [Redeploy Windows VM](redeploy-to-new-node-windows.md)
  * [Redeploy Linux VM](redeploy-to-new-node-linux.md)
* Recreate the virtual machine

For more information, see [Troubleshooting Endpoint Connectivity (RDP/SSH/HTTP, etc. failures)](https://social.msdn.microsoft.com/Forums/azure/en-US/538a8f18-7c1f-4d6e-b81c-70c00e25c93d/troubleshooting-endpoint-connectivity-rdpsshhttp-etc-failures?forum=WAVirtualMachinesforWindows).

## Detailed troubleshooting overview
There are four main areas to troubleshoot the access of an application that is running on an Azure virtual machine.

![troubleshoot cannot start application](./media/virtual-machines-common-troubleshoot-app-connection/tshoot_app_access1.png)

1. The application running on the Azure virtual machine.
   * Is the application itself running correctly?
2. The Azure virtual machine.
   * Is the VM itself running correctly and responding to requests?
3. Azure network endpoints.
   * Cloud service endpoints for virtual machines in the Classic deployment model.
   * Network Security Groups and inbound NAT rules for virtual machines in Resource Manager deployment model.
   * Can traffic flow from users to the VM/application on the expected ports?
4. Your Internet edge device.
   * Are firewall rules in place preventing traffic from flowing correctly?

For client computers that are accessing the application over a site-to-site VPN or ExpressRoute connection, the main areas that can cause problems are the application and the Azure virtual machine.

To determine the source of the problem and its correction, follow these steps.

## Step 1: Access application from target VM
Try to access the application with the appropriate client program from the VM on which it is running. Use the local host name, the local IP address, or the loopback address (127.0.0.1).

![start application directly from the VM](./media/virtual-machines-common-troubleshoot-app-connection/tshoot_app_access2.png)

For example, if the application is a web server, open a browser on the VM and try to access a web page hosted on the VM.

If you can access the application, go to [Step 2](#step2).

If you cannot access the application, verify the following settings:

* The application is running on the target virtual machine.
* The application is listening on the expected TCP and UDP ports.

On both Windows and Linux-based virtual machines, use the **netstat -a** command to show the active listening ports. Examine the output for the expected ports on which your application should be listening. Restart the application or configure it to use the expected ports as needed and try to access the application locally again.

## <a id="step2"></a>Step 2: Access application from another VM in the same virtual network
Try to access the application from a different VM but in the same virtual network, using the VM's host name or its Azure-assigned public, private, or provider IP address. For virtual machines created using the classic deployment model, do not use the public IP address of the cloud service.

![start application from a different VM](./media/virtual-machines-common-troubleshoot-app-connection/tshoot_app_access3.png)

For example, if the application is a web server, try to access a web page from a browser on a different VM in the same virtual network.

If you can access the application, go to [Step 3](#step3).

If you cannot access the application, verify the following settings:

* The host firewall on the target VM is allowing the inbound request and outbound response traffic.
* Intrusion detection or network monitoring software running on the target VM is allowing the traffic.
* Cloud Services endpoints or Network Security Groups are allowing the traffic:
  * [Classic model - Manage Cloud Services endpoints](../../cloud-services/cloud-services-enable-communication-role-instances.md)
  * [Resource Manager model - Manage Network Security Groups](../../virtual-network/manage-network-security-group.md)
* A separate component running in your VM in the path between the test VM and your VM, such as a load balancer or firewall, is allowing the traffic.

On a Windows-based virtual machine, use Windows Firewall with Advanced Security to determine whether the firewall rules exclude your application's inbound and outbound traffic.

## <a id="step3"></a>Step 3: Access application from outside the virtual network
Try to access the application from a computer outside the virtual network as the VM on which the application is running. Use a different network as your original client computer.

![start application from a computer outside the virtual network](./media/virtual-machines-common-troubleshoot-app-connection/tshoot_app_access4.png)

For example, if the application is a web server, try to access the web page from a browser running on a computer that is not in the virtual network.

If you cannot access the application, verify the following settings:

* For VMs created using the classic deployment model:
  
  * Verify that the endpoint configuration for the VM is allowing the incoming traffic, especially the protocol (TCP or UDP) and the public and private port numbers.
  * Verify that access control lists (ACLs) on the endpoint are not preventing incoming traffic from the Internet.
  * For more information, see [How to Set Up Endpoints to a Virtual Machine](../windows/classic/setup-endpoints.md).
* For VMs created using the Resource Manager deployment model:
  
  * Verify that the inbound NAT rule configuration for the VM is allowing the incoming traffic, especially the protocol (TCP or UDP) and the public and private port numbers.
  * Verify that Network Security Groups are allowing the inbound request and outbound response traffic.
  * For more information, see [What is a network security group?](../../virtual-network/security-overview.md)

If the virtual machine or endpoint is a member of a load-balanced set:

* Verify that the probe protocol (TCP or UDP) and port number are correct.
* If the probe protocol and port is different than the load-balanced set protocol and port:
  * Verify that the application is listening on the probe protocol (TCP or UDP) and port number (use **netstat –a** on the target VM).
  * Verify that the host firewall on the target VM is allowing the inbound probe request and outbound probe response traffic.

If you can access the application, ensure that your Internet edge device is allowing:

* The outbound application request traffic from your client computer to the Azure virtual machine.
* The inbound application response traffic from the Azure virtual machine.

## Step 4 If you cannot access the application, use IP Verify to check the settings. 

For more information, see [Azure network monitoring overview](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview). 

## Additional resources
[Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](troubleshoot-rdp-connection.md)

[Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine](troubleshoot-ssh-connection.md)


