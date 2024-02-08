---
title: Inspect and analyze packet capture files
titleSuffix: Azure Network Watcher
description: Learn how to inspect and analyze packet capture network data previously captured using Azure Network Watcher.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 02/07/2024
#CustomerIntent: As a network administrator, I want to inspect packets captured by Network Watcher to investigate network issues.
---

# Inspect and analyze Network Watcher packet capture files

Using the packet capture feature of Azure Network Watcher, you can initiate and manage capture sessions on your Azure virtual machines (VMs) and virtual machine scale sets from the Azure portal, PowerShell, Azure CLI, and programmatically through the SDK and REST API.

Packet capture allows you to address scenarios that require packet level data by providing the information in a readily usable format. Using freely available tools to inspect the data, you can examine communications sent to and from your VMs or scale sets to gain insights into your network traffic. Some example uses of packet capture data include investigating network or application issues, detecting network misuse and intrusion attempts, or maintaining regulatory compliance.

In this article, you learn how to open a packet capture file provided by Network Watcher using a popular open source tool. You'll also learn how to calculate a connection latency, identify abnormal traffic, and examine networking statistics.

## Prerequisites

- A packet capture file created using Network Watcher. For more information, see [Manage packet captures for virtual machines using the Azure portal](network-watcher-packet-capture-manage-portal.md).

- Wireshark. For more information, see [https://www.wireshark.org/](https://www.wireshark.org/).

## Calculate network latency

In this example, you learn how to view the initial Round Trip Time (RTT) of a Transmission Control Protocol (TCP) conversation between two endpoints.

When a TCP connection is established, the first three packets sent in the connection follow a pattern referred to as the three-way handshake. By examining the first two packets sent in this handshake, an initial request from the client and a response from the server, you can calculate the latency. This latency is referred to as the Round Trip Time (RTT). For more information on the TCP protocol and the three-way handshake, see [Explanation of the three-way handshake via TCP/IP](https://support.microsoft.com/en-us/help/172983/explanation-of-the-three-way-handshake-via-tcp-ip).

1. Launch Wireshark.

1. Load the **.cap** file from your packet capture session.

1. Select a [SYN] packet in your capture. This packet is the first packet sent by the client to initiate a TCP connection.

1. Right-click on the packet and select **Follow**, then select **TCP Stream**.

    :::image type="content" source="./media/packet-capture-inspect/follow-tcp-stream.png" alt-text="Screenshot shows how to filter TCP stream packets in Wireshark." lightbox="./media/packet-capture-inspect/follow-tcp-stream.png":::

1. Expand the **Transmission Control Protocol** section of the [SYN] packet, and then the **Flags** section.

1. Confirm that the **Syn** bit is set to 1, then right-click on it.

1. Select **Apply as Filter**, and then select **... and selected** to show the packets with **Syn** bit set to 1 within the TCP stream.

    The first two packets involved in the TCP handshake are the [SYN], [SYN, ACK] packets. You don't need the last packet in the handshake, which is the [ACK] packet. The client sends the [SYN] packet. Once the server receives the [SYN] packet, it sends the [ACK] packet as an acknowledgment of receiving the [SYN] from the client.

    :::image type="content" source="./media/packet-capture-inspect/syn-filter.png" alt-text="Screenshot shows how to apply a filter to see the [SYN] and [SYN, ACK] packets in a TCP stream in Wireshark." lightbox="./media/packet-capture-inspect/syn-filter.png":::

1. Select the [SCK] packet. 

1. Expand the **SEQ/ACK** section to see the iRTT in seconds.

    :::image type="content" source="./media/packet-capture-inspect/view-latency.png" alt-text="Screenshot shows how to see the latency represented as iRTT in seconds in Wireshark." lightbox="./media/packet-capture-inspect/view-latency.png":::

## Find unwanted protocols

You can have many applications running on an Azure virtual machine. Many of these applications communicate over the network, sometimes without your explicit permission. Using packet capture to record network communication, you can investigate how applications communicate over the network, allowing you to identify and address any potential issues.

In this example, you learn how to analyze a packet capture to find unwanted protocols that might indicate unauthorized communication from an application running on your virtual machine.

1. Launch Wireshark.

1. Load the **.cap** file from your packet capture session.

1. From the **Statistics** menu, select **Protocol Hierarchy**.

    :::image type="content" source="./media/packet-capture-inspect/protocol-hierarchy.png" alt-text="Screenshot shows how to get to Protocol Hierarchy from the Statistics menu in Wireshark." lightbox="./media/packet-capture-inspect/protocol-hierarchy.png":::

1. In the **Protocol Hierarchy Statistics** window, you can see a list of all the protocols that were in use during the capture session and the number of packets transmitted and received using each protocol. This view is useful for finding unwanted network traffic on your virtual machines or network.

    :::image type="content" source="./media/packet-capture-inspect/protocol-hierarchy-statistics.png" alt-text="Screenshot shows the Protocol Hierarchy Statistics window in Wireshark." lightbox="./media/packet-capture-inspect/protocol-hierarchy-statistics.png":::

    In the example, you can see that there was traffic using the BitTorrent protocol, which is used for peer-to-peer file sharing. As an administrator, if you don't expect to see BitTorrent traffic on this particular virtual machine, then you can remove the peer-to-peer software that's installed on this virtual machine, or block the traffic using a network security group or a firewall.

## Find destinations and ports

Understanding the types of traffic, the endpoints, and the ports communicated over is important when monitoring or troubleshooting applications and resources in your network. By analyzing a packet capture file, you can learn the top destinations your virtual machine communicated with and the ports that were used.

1. Launch Wireshark.

1. Load the **.cap** file from your packet capture session.

1. From the **Statistics** menu, select **IPv4 Statistics** and then select **Destinations and Ports**.

    :::image type="content" source="./media/packet-capture-inspect/destinations-ports.png" alt-text="Screenshot shows how to get to Destinations and Ports window in Wireshark." lightbox="./media/packet-capture-inspect/destinations-ports.png":::

1. In the **Destinations and Ports** window, you can see the top destinations and ports that were communicated with during the capture session. You display only communication with a specific protocol by using a filter. For example, you can see if there was any communication using the Remote Desktop Protocol (RDP) protocol by entering **rdp** in the **Display filter** box.

    :::image type="content" source="./media/packet-capture-inspect/rdp-filter.png" alt-text="Screenshot shows the RDP destinations and the ports that were used in Wireshark." lightbox="./media/packet-capture-inspect/rdp-filter.png":::
    
    Similarly, you can filter for other protocols you're interested in.

## Next step

To learn about the other network diagnostic tools of Network Watcher, see:

> [!div class="nextstepaction"]
> [Network Watcher diagnostic tools](network-watcher-overview.md#network-diagnostic-tools)
