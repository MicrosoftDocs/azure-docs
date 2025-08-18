---
title: Troubleshooting network virtual appliance issues in Azure
description: Troubleshoot Network Virtual Appliance (NVA) issues in Azure and validate basic Azure Platform requirements for NVA configurations.
services: virtual-network
author: asudbring
manager: dcscontentpm
ms.service: azure-virtual-network
ms.topic: troubleshooting
ms.date: 04/03/2025
ms.author: allensu
# Customer intent: "As a network administrator, I want to troubleshoot connectivity issues with Network Virtual Appliances in Azure, so that I can ensure proper configuration and performance for seamless network operations."
---

# Network virtual appliance issues in Azure

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

You might experience VM or VPN connectivity issues and errors when using a partner Network Virtual Appliance (NVA) in Microsoft Azure. This article provides basic steps to help you validate basic Azure Platform requirements for NVA configurations.

Technical support for partner NVAs and their integration with the Azure platform is provided by the NVA vendor.

> [!NOTE]
> If you have a connectivity or routing problem that involves an NVA, you should [contact the vendor of the NVA](https://mskb.pkisolutions.com/kb/2984655) directly.

[!INCLUDE [support-disclaimer](~/reusable-content/ce-skilling/azure/includes/support-disclaimer.md)]

## Checklist for troubleshooting with NVA vendor

- Software updates for NVA VM software

- Service Account setup and functionality

- User-defined routes (UDRs) on virtual network subnets that direct traffic to NVA

- UDRs on virtual network subnets that direct traffic from NVA

- Routing tables and rules within the NVA (for example, from NIC1 to NIC2)

- Tracing on NVA network interfaces to verify receiving and sending network traffic

- Use of a Standard version Public IP. There must be an NSG created and an explicit rule to allow the traffic to be routed to the NVA.

## Basic troubleshooting steps

- Check the basic configuration

- Check NVA performance

- Advanced network troubleshooting

## Check the minimum configuration requirements for NVAs on Azure

Each NVA has basic configuration requirements to function correctly on Azure. The following section provides the steps to verify these basic configurations. For more information, [contact the vendor of the NVA](https://mskb.pkisolutions.com/kb/2984655).

**Check whether IP forwarding is enabled on NVA**

### [Portal](#tab/portal)

1. Locate the NVA resource in the [Azure portal](https://portal.azure.com), select Networking, and then select the Network interface.

1. On the Network interface page, select IP configuration.

1. Ensure that the IP forwarding checkbox is selected.

### [PowerShell](#tab/powershell)

1. Open PowerShell and sign-in to your Azure account.

1. Execute the following command. Replace the bracketed values with your information:

   ```powershell
   Get-AzNetworkInterface -ResourceGroupName <ResourceGroupName> -Name <NicName>
   ```

1. Check the **EnableIPForwarding** property.

1. If IP forwarding isn't enabled, execute the following commands to enable it:

    ```powershell
    $nic2 = Get-AzNetworkInterface -ResourceGroupName <ResourceGroupName> -Name <NicName>
    $nic2.EnableIPForwarding = 1
    Set-AzNetworkInterface -NetworkInterface $nic2
    $nic2 | Format-List
    ```

   The output should look similar to the following example:

   ```output
   EnableIPForwarding   : True
   NetworkSecurityGroup : null
   ```

---

**Check for NSG when using Standard SKU public IP**

Use of a standard version of public IPs. There must be an NSG created and an explicit rule to allow the traffic to the NVA.

**Check whether the traffic can be routed to the NVA**

1. On [Azure portal](https://portal.azure.com), open **Network Watcher**, select **Next Hop**.

1. Specify a VM that is configured to redirect the traffic to the NVA, and a destination IP address at which to view the next hop. 

1. If the NVA isn't listed as the **next hop**,  check and update the Azure route tables.

**Check whether the traffic can reach the NVA**

1. In [Azure portal](https://portal.azure.com), open **Network Watcher**, and then select **IP Flow Verify**. 

1. Specify the VM and the IP address of the NVA. Check for traffic blockage by any Network security groups (NSG).

1. If there's an NSG rule that blocks the traffic, locate the NSG in **effective security** rules and then update it to allow traffic to pass. Then run **IP Flow Verify** again and use **Connection troubleshoot** to test TCP communications from VM to your internal or external IP address.

**Check whether NVA and VMs are listening for expected traffic**

Connect to the NVA by using RDP or SSH, and then run following command:

For Windows:

```console
netstat -an
```

For Linux:

```console
netstat -an | grep -i listen
```

If the TCP port used by the NVA software isn't listed in the results, configure the application on the NVA and VM to listen on those ports. For further assistance, [contact the NVA vendor](https://mskb.pkisolutions.com/kb/2984655).

## Check NVA performance

### Validate VM CPU

If CPU usage gets close to 100 percent, you might experience issues that affect network packet drops. Your VM reports average CPU for a specific time span in the Azure portal. During a CPU spike, investigate which process on the guest VM is causing the high CPU, and mitigate it, if possible. You might also have to resize the VM to a larger SKU size or, for virtual machine scale set, increase the instance count or set to autoscale on CPU usage. For either of these issues, [contact the NVA vendor for assistance](https://mskb.pkisolutions.com/kb/2984655), as needed.

### Validate VM network statistics

If the VM network use spikes or shows periods of high usage, you might also have to increase the SKU size of the VM to obtain higher throughput capabilities. You can also redeploy the VM by having Accelerated Networking enabled. To verify whether the NVA supports Accelerated Networking feature, [contact the NVA vendor for assistance](https://mskb.pkisolutions.com/kb/2984655), as needed.

## Advanced network administrator troubleshooting

### Capture network trace
Capture a simultaneous network trace on the source VM, the NVA, and the destination VM while you run **[PsPing](/sysinternals/downloads/psping)** or **Nmap**, and then stop the trace.

1. To capture a simultaneous network trace, run the following command:

   **For Windows**
    
    ```console
   netsh trace start capture=yes tracefile=c:\server_IP.etl scenario=netconnection
    ```

   **For Linux**

   ```console
   sudo tcpdump -s0 -i eth0 -X -w vmtrace.cap
    ```

1. Use **PsPing** or **Nmap** from the source VM to the destination VM (for example: `PsPing 10.0.0.4:80` or `Nmap -p 80 10.0.0.4`).

1. Open the network trace from the destination VM by using [Network Monitor](https://download.cnet.com/s/network-monitor) or tcpdump. Apply a display filter for the IP of the Source VM you ran **PsPing** or **Nmap** from, such as `IPv4.address==10.0.0.4 (Windows netmon)` or `tcpdump -nn -r vmtrace.cap src or dst host 10.0.0.4` (Linux).

### Analyze traces

If you don't see the packets incoming to the backend VM trace, there's likely an NSG or UDR interfering or the NVA routing tables are incorrect.

If you do see the packets coming in but no response, then you might need to address a VM application or a firewall issue. For either of these issues, [contact the NVA vendor for assistance as needed](https://mskb.pkisolutions.com/kb/2984655).
