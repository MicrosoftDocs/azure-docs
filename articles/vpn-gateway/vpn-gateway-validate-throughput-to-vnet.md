---
title: 'Validate VPN throughput to a Microsoft Azure Virtual Network | Microsoft Docs'
description: The purpose of this document is to help a user validate the network throughput from their on-premises resources to an Azure virtual machine.
services: vpn-gateway
author: cherylmc
manager: jasmc

ms.service: vpn-gateway
ms.topic: troubleshooting
ms.date: 05/29/2019
ms.author: radwiv
ms.reviewer: chadmat;genli

---
# How to validate VPN throughput to a virtual network

A VPN gateway connection enables you to establish secure, cross-premises connectivity between your Virtual Network within Azure and your on-premises IT infrastructure.

This article shows how to validate network throughput from the on-premises resources to an Azure virtual machine (VM). It also provides troubleshooting guidance. 

>[!NOTE]
>This article is intended to help diagnose and fix common issues. If you're unable to solve the issue by using the following information, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
>
>

## Overview

The VPN gateway connection involves the following components:

- On-premises VPN device (view a list of [validated VPN devices)](vpn-gateway-about-vpn-devices.md#devicetable).
- Public Internet
- Azure VPN gateway
- Azure VM

The following diagram shows the logical connectivity of an on-premises network to an Azure virtual network through VPN.

![Logical Connectivity of Customer Network to MSFT Network using VPN](./media/vpn-gateway-validate-throughput-to-vnet/VPNPerf.png)

## Calculate the maximum expected ingress/egress

1.	Determine your application's baseline throughput requirements.
2.	Determine your Azure VPN gateway throughput limits. For help, see the "Gateway SKUs" section of [About VPN Gateway](vpn-gateway-about-vpngateways.md#gwsku).
3.	Determine the [Azure VM throughput guidance](../virtual-machines/virtual-machines-windows-sizes.md) for your VM size.
4.	Determine your Internet Service Provider (ISP) bandwidth.
5.	Calculate your expected throughput - Least bandwidth of (VM, Gateway, ISP) * 0.8.

If your calculated throughput does not meet your application's baseline throughput requirements, you need to increase the bandwidth of the resource that you identified as the bottleneck. To resize an Azure VPN Gateway, see [Changing a gateway SKU](vpn-gateway-about-vpn-gateway-settings.md#gwsku). To resize a virtual machine, see [Resize a VM](../virtual-machines/virtual-machines-windows-resize-vm.md). If you are not experiencing expected Internet bandwidth, you may also want to contact your ISP.

## Validate network throughput by using performance tools

This validation should be performed during non-peak hours, as VPN tunnel throughput saturation during testing does not give accurate results.

The tool we use for this test is iPerf, which works on both Windows and Linux and has both client and server modes. It is limited to 3 Gbps for Windows VMs.

This tool does not perform any read/write operations to disk. It solely produces self-generated TCP traffic from one end to the other. It generated statistics based on experimentation that measures the bandwidth available between client and server nodes. When testing between two nodes, one acts as the server and the other as a client. Once this test is completed, we recommend that you reverse the roles to test both upload and download throughput on both nodes.

### Download iPerf
Download [iPerf](https://iperf.fr/download/iperf_3.1/iperf-3.1.2-win64.zip). For details, see [iPerf documentation](https://iperf.fr/iperf-doc.php).

 >[!NOTE]
 >The third-party products that this article discusses are manufactured by companies that are independent of Microsoft. Microsoft makes no warranty, implied or otherwise, about the performance or reliability of these products.
 >
 >

### Run iPerf (iperf3.exe)
1. Enable an NSG/ACL rule allowing the traffic (for public IP address testing on Azure VM).

2. On both nodes, enable a firewall exception for port 5001.

	**Windows:** Run the following command as an administrator:

	```CMD
	netsh advfirewall firewall add rule name="Open Port 5001" dir=in action=allow protocol=TCP localport=5001
	```

	To remove the rule when testing is complete, run this command:

	```CMD
	netsh advfirewall firewall delete rule name="Open Port 5001" protocol=TCP localport=5001
	```
	 
	**Azure Linux:**  Azure Linux images have permissive firewalls. If there is an application listening on a port, the traffic is allowed through. Custom images that are secured may need ports opened explicitly. Common Linux OS-layer firewalls include `iptables`, `ufw`, or `firewalld`.

3. On the server node, change to the directory where iperf3.exe is extracted. Then run iPerf in server mode and set it to listen on port 5001 as the following commands:

	 ```CMD
	 cd c:\iperf-3.1.2-win65

	 iperf3.exe -s -p 5001
	 ```

4. On the client node, change to the directory where iperf tool is extracted and then run the following command:

	```CMD
	iperf3.exe -c <IP of the iperf Server> -t 30 -p 5001 -P 32
	```

	The client is inducing traffic on port 5001 to the server for 30 seconds. The flag '-P ' that indicates we are using 32 simultaneous connections to the server node.

	The following screen shows the output from this example:

	![Output](./media/vpn-gateway-validate-throughput-to-vnet/06theoutput.png)

5. (OPTIONAL) To preserve the testing results, run this command:

	```CMD
	iperf3.exe -c IPofTheServerToReach -t 30 -p 5001 -P 32  >> output.txt
	```

6. After completing the previous steps, execute the same steps with the roles reversed, so that the server node will now be the client and vice-versa.

## Address slow file copy issues
You may experience slow file coping when using Windows Explorer or dragging and dropping through an RDP session. This problem is normally due to one or both of the following factors:

- File copy applications, such as Windows Explorer and RDP, do not use multiple threads when copying files. For better performance, use a multi-threaded file copy application such as [Richcopy](https://technet.microsoft.com/magazine/2009.04.utilityspotlight.aspx) to copy files by using 16 or 32 threads. To change the thread number for file copy in Richcopy, click **Action** > **Copy options** > **File copy**.<br><br>
![Slow file copy issues](./media/vpn-gateway-validate-throughput-to-vnet/Richcopy.png)<br>
- Insufficient VM disk read/write speed. For more information, see [Azure Storage Troubleshooting](../storage/common/storage-e2e-troubleshooting.md).

## On-premises device external facing interface
If the on-premises VPN device Internet-facing IP address is included in the [local network](vpn-gateway-howto-site-to-site-resource-manager-portal.md#LocalNetworkGateway) address space definition in Azure, you may experience inability to bring up the VPN, sporadic disconnects, or performance issues.

## Checking latency
Use tracert to trace to Microsoft Azure Edge device to determine if there are any delays exceeding 100 ms between hops.

From the on-premises network, run *tracert* to the VIP of the Azure Gateway or VM. Once you see only * returned, you know you have reached the Azure edge. When you see DNS names that include "MSN" returned, you know you have reached the Microsoft backbone.<br><br>
![Checking Latency](./media/vpn-gateway-validate-throughput-to-vnet/08checkinglatency.png)

## Next steps
For more information or help, check out the following links:

- [Optimize network throughput for Azure virtual machines](../virtual-network/virtual-network-optimize-network-bandwidth.md)
- [Microsoft Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
