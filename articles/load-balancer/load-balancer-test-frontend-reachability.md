---
title: Testing reachability of Azure Load Balancer frontends with ping
description: Learn how to test Azure Load Balancer frontend IPv4 and IPv6 addresses for reachability from an Azure VM or an external device. Supports ping and traceroute.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 05/06/2023
ms.author: mbender
ms.custom: template-how-to
---

# Testing reachability of Azure Load Balancer frontends with ping

Standard Public Azure Load Balancer frontend IPv4 and IPv6 addresses support testing reachability using ping and tracert. Testing reachability of a load balancer frontend is useful for troubleshooting connectivity issues. In this article, you learn how to use ping and tracert for testing a frontend of an existing Standard public load balancer. It can be completed from an Azure Virtual Machine or from a device outside of Azure.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) and access to the Azure portal.

- A standard public load balancer with an IPv4 frontend in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer](/azure/load-balancer/quickstart-load-balancer-standard-public-portal) to load balance VMs using the Azure portal.

- An Azure Virtual Machine with a public IP address assigned to its network interface. For more information on creating a virtual machine with a public IP, see [Quickstart: Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal).

## Testing from a device outside of Azure

This section describes testing reachability of a standard load balancer frontend from a device outside of Azure. Follow the directions for the operating system that you're using.

### [Windows](#tab/windows-outside)

### [Linux](#tab/linux-outside)

---

Choose either ping or traceroute to test reachability of a standard load balancer frontend from a device outside of Azure.

### [Ping](#tab/ping/windows-outside)

Follow these steps to test reachability of a standard public load balancer frontend using ping from a Windows device outside of Azure:

1. From your Windows device, open the **Search taskbar** and enter `cmd`. Select **Command Prompt**.
2. In the command prompt, type the following command: 

```dos
    ping <Input your load balancer’s public IPv4 address>
```

3. Review ping's output.

### [Ping](#tab/ping/linux-outside)

Follow these steps to test reachability of a standard public load balancer frontend using ping from a Linux device outside of Azure:

1. Open Terminal.
2. Type the following command:

```bash
    ping <Input your load balancer’s public IPv4 address>
```

3. Review ping's output.

### [Traceroute](#tab/traceroute/windows-outside)

Follow these steps to test reachability of a standard public load balancer frontend using tracert from a Windows device outside of Azure:

1. From your Windows device, open the **Search taskbar** and enter `cmd`. Select **Command Prompt**.
2. In the command prompt, type the following command:

```dos
    traceroute -I <Input your load balancer’s public IPv4 address>
```

3. Review tracert's output.

### [Traceroute](#tab/traceroute/linux-outside)

Follow these steps to test reachability of a standard public load balancer frontend using tracert from a Linux device outside of Azure:

1. Open Terminal.
2. Type the following command:

```bash
    tracert -l <Input your load balancer’s public IPv4 address>
```

3. Review tracert's output.

---

## Testing from an Azure Virtual Machine

This section describes how to test reachability of a standard public load balancer frontend from an Azure Virtual Machine. First, you create an inbound Network Security Group (NSG) rule on the virtual machine to allow ICMP traffic. Then, you ping the frontend of the load balancer from the virtual machine.

### Configure inbound NSG rule

1. Sign in to the Azure portal.
1. In the Search bar at the top of the portal, enter **Virtual machines** and select Virtual machines.
1. In **Virtual machines**, select your virtual machine from the list.
1. In the virtual machine’s menu, select **Networking** and then select **Add inbound port rule**.

    :::image type="content" source="media/load-balancer-frontend-reachability-testing/virtual-machine-port-rules-thumb.png" alt-text="Screenshot of Virtual network page listing port rules and selection of add outbound port rule button." lightbox="media/load-balancer-frontend-reachability-testing/virtual-machine-port-rules.png":::

1. In **Add inbound security rule**, enter or select the following information:

    | **Setting** | **Value** |
    | --- | --- |
    | **Source** | Enter **Any** |
    | **Source port ranges** | Enter **\*** |
    | **Destination** | Enter **Any** |
    | **Service** | Ender **Custom** |
    | **Destination port ranges** | Enter **\*** |
    | **Protocol** | Select **ICMP** |
    | **Action** | Select **Allow** |
    | **Priority** | Enter **100** or a priority of your choosing. |
    | **Name** | Enter **AllowICMP** or a name of your choosing |
    | **Description** | Leave as Blank or enter a description |

    :::image type="content" source="media/load-balancer-frontend-reachability-testing/add-inbound-port-rule-thumb.png" alt-text="Screenshot of Add inbound port rule windows with settings allowing ICMP echo messages."lightbox="media/load-balancer-frontend-reachability-testing/add-inbound-port-rule.png":::

1. Select **Add**.

### Connect to the virtual machine

1. Return to **Overview** in the virtual machine’s menu and select **Connect**.
1. Sign in to your virtual machine using RDP, SSH, or Bastion.
1. Depending on your VM’s operating system, follow these steps:

### [Windows](#tab/windowsvm)

### [Linux](#tab/linuxvm/)

---

### Test the Load Balancer’s frontend

Choose either ping or tracert to test reachability of a standard public load balancer frontend from an Azure Virtual Machine.

### [Ping](#tab/ping/windowsvm)

Follow these steps to test reachability of a standard public load balancer frontend using ping from a Windows virtual machine:

1. From your Windows device, open the **Search taskbar** and enter `cmd`. Select **Command Prompt**.
2. In the command prompt, type the following command:

```dos
    ping <Input your load balancer’s public IPv4 address>
```

3. Review ping's output.

### [Ping](#tab/ping/linuxvm)

Follow these steps to test reachability of a standard public load balancer frontend using ping from a Linux virtual machine:

1. Open Terminal.
2. Type the following command:

```bash
    ping <Input your load balancer’s public IPv4 address>
```

3. Review ping's output.

### [Traceroute](#tab/traceroute/windowsvm)

Follow these steps to test reachability of a standard public load balancer frontend using tracert from a Windows virtual machine:

1. From your Windows device, open the **Search taskbar** and enter `cmd`. Select **Command Prompt**.
2. In the command prompt, type the following command:

```dos
    traceroute -I <Input your load balancer’s public IPv4 address>
```

3. Review tracert's output.

### [Traceroute](#tab/traceroute/linuxvm)

Follow these steps to test reachability of a standard public load balancer frontend using tracert from a Linux virtual machine:

1. Open Terminal.
2. Type the following command:

```bash
    tracert -l <Input your load balancer’s public IPv4 address>
```

3. Review tracert's output.

---

## Expected replies with ping

Based on the current health probe state of your backend instances, you receive different replies when testing the Load Balancer’s frontend with ping. Review the following scenarios for the expected reply:

| **Scenario** | **Expected reply** |
| --- | --- |
| **All backend instances are probed DOWN** | Destination host unreachable  |
| **All backend instances turned OFF** | Unresponsive: Request timed out |
| **At least 1 backend instance is probed UP** | Successful echo replies |
| **No backend instances behind Load Balancer/No load balancing rules associated** | Unresponsive: Request timed out |

## Usage considerations

- ICMP pings can't be disabled and are allowed by default on Standard Public Load Balancers.

> [!NOTE]
> ICMP ping requests are not sent to the backend instances; they are handled by the Load Balancer.

## Next steps

- To troubleshoot load balancer issues, see [Troubleshoot Azure Load Balancer](load-balancer-troubleshoot.md).
- Learn how to [Manage rules for Azure Load Balancer using the Azure portal](manage-rules-how-to.md).
