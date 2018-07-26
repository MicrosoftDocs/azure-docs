---
title: Troubleshooting Network Virtual Appliance issues in Azure | Microsoft Docs
description: Learn how to troubleshoot the Network Virtual Appliance issues in Azure.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: ''
tags: azure-resource-manager

ms.service: virtual-network
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/23/2018
ms.author: genli

---

#  Network virtual appliance issues in Azure

You might receive errors when you use or connect to a network virtual appliance (NVA) in Microsoft Azure. This article provides basic steps to help you troubleshooting the NVA issues.

Microsoft support is limited to the Microsoft Azure platform and services. Technical support for third-party NVAs is provided by the vendor. If you have a problem with a NVA, you should [contact the vendor of the NVA](https://support.microsoft.com/help/2984655/support-for-azure-market-place-for-virtual-machines) directly.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Basic troubleshoot steps

- Check the basic configuration
- Check NVA Performance
- Advanced Network Troubleshooting

## Check the basic configuration for NAVs

Each NVA has basic configuration requirements to function properly on Azure. The following section provide steps about how to validate these basic configuration. For more information, you should contact the vendor of the NVA.

**Check whether IP forwarding is enabled on NVA**

Use Azure portal

1. Locate the NVA resource in the [Azure portal](https://portal.azure.com), select **Networking**, and then select the Network interface.
2. On the **Network interface** page, select **IP configuration**.
3. Make sure that the **IP forwarding** is enabled.

Use PowerShell

1. Open PowerShell and login to your Azure account.
2. Run the following command. You must replace the brackets with your information:

        Get-AzureRmNetworkInterface -ResourceGroupName <ResourceGroupName> -Name <NicName>  

3. Check the **EnableIPForwarding** property.
 
4. If IP forwarding is not enabled, run the following commands to enable it:

          $nic2 = Get-AzureRmNetworkInterface -ResourceGroupName <ResourceGroupName> -Name <NicName>
          $nic2.EnableIPForwarding = 1
          Set-AzureRmNetworkInterface -NetworkInterface $nic2
          Execute: $nic2 #and check for an expected output:
          EnableIPForwarding   : True
          NetworkSecurityGroup : null

**Check whether the traffic can be routed to the NVA**

1. On [Azure portal](https://portal.azure.com), open **Network Watcher**, select **Next Hop**.
2. Specify a VM that you want the next hop to the NVA and a destination IP address to view the next hop. 
3. If the NVA is not listed as the **next hop**. You should check and update the Azure route tables.

**Check whether the traffic can reach the NVA**

1.	On [Azure portal](https://portal.azure.com), open **Network Watcher**, select **IP Flow Verify**. 
2.	Specify a VM and the IP address of the NVA, and then check whether the traffic is blocked by Network security groups (NSG).
3.	If you find there is an NSG rule that blocks the traffic, locate the NSG in **effective security** rules and update to allow traffic to pass. Then run **IP Flow Verify** again and use **Connectivity Check** to test TCP communications from VM to your internal/external IP address.

**Check whether NVA and VMs are listening for expected traffic**

1.	Connect to the NVA by using RDO or SSH, and run following command:

    For Windows:

        netstat -an

    For Linux:

        netstat -an | grep -i listen
2.  If you don't see the TCP port used for the connection listed in the results you will need to configure the application on the NVA and VM to listen and respond to traffic reaching those ports.

## Check NVA Performance

### Validate VM CPU

If CPU usage gets close to 100%, you may experience performance issues. Your VM reports average CPU for a time span. During a CPU spike, investigate what process on the guest is causing the high CPU and mitigate if possible. You may also need to resize the VM to a larger SKU size or, for VMSS, increase the instance count or set to auto scale on CPU utilization.

### Validate VM Network statistics 

If you see the VM’s network utilization spike or have periods of high utilization, you may also need to resize the VM to a larger SKU size to obtain higher throughput capabilities. You can also redeploy the VM with Accelerated Networking enabled. 

## Advanced Network Administrator Troubleshooting

### Capure network trace
Capure a simultaneous network trace on the Source VM, the NVA and the destination VM while you run **PsPing** or **nmap** then stop the trace.

1. To Capure a simultaneous network trace, run the following command:

    For Windows:

        netsh trace start capture=yes tracefile=c:\server_IP.etl scenario=netconnection

    For Linux:

        sudo tcpdump -s0 -i eth0 -X -w vmtrace.cap

2. Use **psping** or **nmap** from the source VM to the destination VM (for example: psping 10.0.0.4:80 or nmap -p 80 10.0.0.4).

3. Open the network trace from the destination VM with Network Monitor or tcpdump. Apply a display filter for the IP of the Source VM you ran **PsPing** or **nmap** from, such as "IPv4.address==10.0.0.4" (Windows netmon) or "tcpdump -nn -r vmtrace.cap src or dst host 10.0.0.4" (Linux).

### Analyze Traces

If you do not see the packets incoming to the backend VM trace, there is likely a NSG or UDR interfering or the NVA routing tables are incorrect.

If you do see the packets coming in but no response, then you may need to address a VM application or a firewall issue.

