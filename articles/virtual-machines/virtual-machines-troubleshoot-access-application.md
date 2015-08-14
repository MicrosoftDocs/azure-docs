<properties
	pageTitle="Troubleshoot Access to an Application Running on an Azure Virtual Machine"
	description="If you can't access an application running on an Azure virtual machine, use these steps to isolate the source of the problem."
	services="virtual-machines"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/01/2015"
	ms.author="dkshir"/>

# Troubleshoot Access to an Application Running on an Azure Virtual Machine

If you can't access an application running on an Azure virtual machine, this article describes a methodical approach for isolating the source of the problem and correcting it.

> [AZURE.NOTE]  For help in connecting to an Azure virtual machine, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-troubleshoot-remote-desktop-connections.md) or [Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine](virtual-machines-troubleshoot-ssh-connections.md).

There are four main areas to troubleshoot the access of an application that is running on an Azure virtual machine.

![](./media/virtual-machines-troubleshoot-access-application/tshoot_app_access1.png)

1.	The application running on the Azure virtual machine.
2.	The Azure virtual machine.
3.	Azure endpoints for the cloud service that contains the virtual machine (for virtual machines created using the Service Management API), inbound NAT rules (for virtual machines created in Resource Manager), and Network Security Groups.
4.	Your Internet edge device.

For client computers that are accessing the application over a site-to-site VPN or ExpressRoute connection, the main areas that can cause problems are the application and the Azure virtual machine.
To determine the source of the problem and its correction, follow these steps.

## Step 1: Can you access the application from the target virtual machine?

Try to access the application with the appropriate client program from the virtual machine on which the application is running, Use the local host name, the local IP address, or the loopback address (127.0.0.1).

![](./media/virtual-machines-troubleshoot-access-application/tshoot_app_access2.png)

For example, if the application is a web server, run a browser on the virtual machine and try to access a web page hosted on the virtual machine.

If you can access the application, go to [Step 2](#step2).

If you cannot access the application, verify the following:

- The application is running on the target virtual machine.
- The application is listening on the expected TCP and UDP ports.

On both Windows and Linux-based virtual machines, use the **netstat -a** command to show the active listening ports. Examine the output for the expected ports on which your application should be listening. Restart the application or configure it to use the expected ports as needed.

## <a id="step2"></a>Step 2: Can you access the application from another virtual machine in the same virtual network?

Try to access the application from a different virtual machine in the same virtual network as the virtual machine on which the application is running using the virtual machine's host name or its Azure-assigned public, private, or provider IP address. For virtual machines created using the Service Management API, do not use the public IP address of the cloud service.

![](./media/virtual-machines-troubleshoot-access-application/tshoot_app_access3.png)

For example, if the application is a web server, try to access a web page from a browser on a different virtual machine in the same virtual network.

If you can access the application, go to [Step 3](#step3).

If you cannot access the application, verify the following:

- The host firewall on the target virtual machine is allowing the inbound request and outbound response traffic.
- Intrusion detection or network monitoring software running on the target virtual machine is allowing the traffic.
- Network Security Groups are allowing the traffic.
- A separate component running in your virtual network in the path between the test virtual machine and the virtual machine, such as a load balancer or firewall, is allowing the traffic.

On a Windows-based virtual machine, use Windows Firewall with Advanced Security to determine whether the firewall rules exclude your application's inbound and outbound traffic.

## <a id="step3"></a>Step 3: Can you access the application from a computer that is outside the virtual network, but not connected to the same network as your computer?

Try to access the application from a computer outside the virtual network as the virtual machine on which the application is running, but is not on the same network as your original client computer.

![](./media/virtual-machines-troubleshoot-access-application/tshoot_app_access4.png)

For example, if the application is a web server, try to access the web page from a browser running on a computer that is not in the virtual network.

If you cannot access the application, verify the following:

- For virtual machines created using the Service Management API, that the endpoint configuration for the virtual machine is allowing the incoming traffic, especially the protocol (TCP or UDP) and the public and private port numbers. For more information, see [How to Set Up Endpoints to a Virtual Machine]( virtual-machines-set-up-endpoints.md).
- For virtual machines created using the Service Management API, that access control lists (ACLs) on the endpoint are not preventing incoming traffic from the Internet. For more information, see [How to Set Up Endpoints to a Virtual Machine]( virtual-machines-set-up-endpoints.md).
- For virtual machines created in Resource Manager, that the inbound NAT rule configuration for the virtual machine is allowing the incoming traffic, especially the protocol (TCP or UDP) and the public and private port numbers.
- That Network Security Groups are allowing the inbound request and outbound response traffic. For more information, see [What is a Network Security Group (NSG)?](virtual-networks-nsg.md).

If the virtual machine or endpoint is a member of a load-balanced set:

- Verify that the probe protocol (TCP or UDP) and port number are correct.
- If the probe protocol and port is different than the load-balanced set protocol and port:
	- Verify that the application is listening on the probe protocol (TCP or UDP) and port number (use **netstat –a** on the target virtual machine).
	- The host firewall on the target virtual machine is allowing the inbound probe request and outbound probe response traffic.

If you can access the application, ensure that your Internet edge device is allowing:

- The outbound application request traffic from your client computer to the Azure virtual machine.
- The inbound application response traffic from the Azure virtual machine.

## Next steps

If you have run through steps 1 through 3 in this article and need additional help to correct the problem, you can:

- Get help from Azure experts across the world. Submit your issue to either the MSDN Azure or Stack Overflow forums. See [Microsoft Azure Forums](http://azure.microsoft.com/support/forums/) for more information.
- File an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click **Get support** under **Technical and billing support**.

## Additional resources

[Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-troubleshoot-remote-desktop-connections.md)

[Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine](virtual-machines-troubleshoot-ssh-connections.md)
