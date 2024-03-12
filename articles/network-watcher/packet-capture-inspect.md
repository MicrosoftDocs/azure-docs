---
title: Inspect and analyze packet capture files
titleSuffix: Azure Network Watcher
description: Learn how to inspect and analyze network data that Azure Network Watcher previously captured for packets.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 02/07/2024
#CustomerIntent: As a network administrator, I want to inspect packets captured by Network Watcher to investigate network problems.
---

# Inspect and analyze Network Watcher packet capture files

By using the packet capture feature of Azure Network Watcher, you can initiate and manage capture sessions on your Azure virtual machines (VMs) and virtual machine scale sets:

- From the Azure portal, PowerShell, and the Azure CLI.
- Programmatically through the SDK and REST API.

With packet capture, you can address scenarios that require packet-level data by providing the information in a readily usable format. By using freely available tools to inspect the data, you can examine communications sent to and from your VMs or scale sets to gain insights into your network traffic. Example uses of packet capture data include investigating network or application problems, detecting network misuse and intrusion attempts, and maintaining regulatory compliance.

In this article, you learn how to use a popular open-source tool to open a packet capture file that Network Watcher provided. You also learn how to calculate connection latency, identify abnormal traffic, and examine network statistics.

## Prerequisites

- A packet capture file created through Network Watcher. For more information, see [Manage packet captures for virtual machines using the Azure portal](packet-capture-vm-portal.md).

- Wireshark. For more information, see the [Wireshark website](https://www.wireshark.org/).

## Calculate network latency

In this example, you learn how to view the initial round-trip time (RTT) of a Transmission Control Protocol (TCP) conversation between two endpoints.

When a TCP connection is established, the first three packets sent in the connection follow a pattern called the three-way handshake. By examining the first two packets sent in this handshake (an initial request from the client and a response from the server), you can calculate the latency. This latency is the RTT. For more information on the TCP protocol and the three-way handshake, see [Explanation of the three-way handshake via TCP/IP](https://support.microsoft.com/en-us/help/172983/explanation-of-the-three-way-handshake-via-tcp-ip).

1. Launch Wireshark.

1. Load the *.cap* file from your packet capture session.

1. Select a [SYN] packet in your capture. This packet is the first packet that the client sends to initiate a TCP connection.

1. Right-click the packet, select **Follow**, and then select **TCP Stream**.

    :::image type="content" source="./media/packet-capture-inspect/follow-tcp-stream.png" alt-text="Screenshot that shows how to filter TCP stream packets in Wireshark." lightbox="./media/packet-capture-inspect/follow-tcp-stream.png":::

1. Expand the **Transmission Control Protocol** section of the [SYN] packet, and then expand the **Flags** section.

1. Confirm that the **Syn** bit is set to **1**, and then right-click it.

1. Select **Apply as Filter**, and then select **...and selected** to show the packets that have the **Syn** bit set to **1** within the TCP stream.

    The first two packets involved in the TCP handshake are the [SYN] and [SYN, ACK] packets. You don't need the last packet in the handshake, which is the [ACK] packet. The client sends the [SYN] packet. After the server receives the [SYN] packet, it sends the [ACK] packet as an acknowledgment of receiving the [SYN] packet from the client.

    :::image type="content" source="./media/packet-capture-inspect/syn-filter.png" alt-text="Screenshot that shows how to apply a filter to show the packets in a TCP stream in Wireshark." lightbox="./media/packet-capture-inspect/syn-filter.png":::

1. Select the [SCK] packet.

1. Expand the **SEQ/ACK analysis** section to show the initial RTT in seconds.

    :::image type="content" source="./media/packet-capture-inspect/view-latency.png" alt-text="Screenshot that shows the latency represented as initial round-trip time in seconds in Wireshark." lightbox="./media/packet-capture-inspect/view-latency.png":::

## Find unwanted protocols

You can have many applications running on an Azure virtual machine. Many of these applications communicate over the network, sometimes without your explicit permission. By using packet capture to record network communication, you can investigate how applications communicate over the network. The investigation helps you identify and address any potential problems.

In this example, you learn how to analyze a packet capture to find unwanted protocols that might indicate unauthorized communication from an application running on your virtual machine.

1. Open Wireshark.

1. Load the *.cap* file from your packet capture session.

1. On the **Statistics** menu, select **Protocol Hierarchy**.

    :::image type="content" source="./media/packet-capture-inspect/protocol-hierarchy.png" alt-text="Screenshot that shows how to get to Protocol Hierarchy from the Statistics menu in Wireshark." lightbox="./media/packet-capture-inspect/protocol-hierarchy.png":::

1. The **Protocol Hierarchy Statistics** window lists all the protocols that were in use during the capture session, along with the number of packets transmitted and received for each protocol. This view is useful for finding unwanted network traffic on your virtual machines or network.

    :::image type="content" source="./media/packet-capture-inspect/protocol-hierarchy-statistics.png" alt-text="Screenshot that shows the Protocol Hierarchy Statistics window in Wireshark." lightbox="./media/packet-capture-inspect/protocol-hierarchy-statistics.png":::

    This example shows traffic for the BitTorrent protocol, which is used for peer-to-peer file sharing. As an administrator, if you don't expect to see BitTorrent traffic on this virtual machine, you can either:

    - Remove the peer-to-peer software that's installed on this virtual machine.
    - Block the traffic by using a network security group or a firewall.

## Find destinations and ports

Understanding the types of traffic, the endpoints, and the ports for communication is important when you're monitoring or troubleshooting applications and resources in your network. By analyzing a packet capture file, you can learn the top destinations that your virtual machine communicated with and the ports that they used.

1. Launch Wireshark.

1. Load the *.cap* file from your packet capture session.

1. On the **Statistics** menu, select **IPv4 Statistics** and then select **Destinations and Ports**.

    :::image type="content" source="./media/packet-capture-inspect/destinations-ports.png" alt-text="Screenshot that shows how to get to the Destinations and Ports window in Wireshark." lightbox="./media/packet-capture-inspect/destinations-ports.png":::

1. The **Destinations and Ports** window lists the top destinations and ports that the VM communicated with during the capture session. You display only communication through a specific protocol by using a filter. For example, you can see if any communication used Remote Desktop Protocol (RDP) by entering **rdp** in the **Display filter** box.

    :::image type="content" source="./media/packet-capture-inspect/rdp-filter.png" alt-text="Screenshot that shows the RDP destinations and the ports that were used in Wireshark." lightbox="./media/packet-capture-inspect/rdp-filter.png":::

    Similarly, you can filter for other protocols that you're interested in.

## Next step

To learn about the other network diagnostic tools of Network Watcher, see:

> [!div class="nextstepaction"]
> [Network Watcher diagnostic tools](network-watcher-overview.md#network-diagnostic-tools)
