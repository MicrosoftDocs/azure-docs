---
title: Inspect and analyze packet capture files
titleSuffix: Azure Network Watcher
description: Learn how to inspect and analyze packet capture network data previously captured using Azure Network Watcher.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 01/31/2024
#CustomerIntent: As a network administrator, I want to inspect packets captured by Network Watcher to investigate network issues.
---

# Inspect and analyze Network Watcher packet capture files

Using the packet capture feature of Network Watcher, you can initiate and manage capture sessions on your Azure virtual machines (VMs) and virtual machine scale sets from the Azure portal, PowerShell, Azure CLI, and programmatically through the SDK and REST API.

Packet capture allows you to address scenarios that require packet level data by providing the information in a readily usable format. Using freely available tools to inspect the data, you can examine communications sent to and from your VMs or scale sets to gain insights into your network traffic. Some example uses of packet capture data include investigating network or application issues, detecting network misuse and intrusion attempts, or maintaining regulatory compliance.

In this article, you learn how to open a packet capture file provided by Network Watcher using a popular open source tool. You'll also learn how to calculate a connection latency, identify abnormal traffic, and examine networking statistics.

## Prerequisites

- A packet capture file created using Network Watcher. For more information, see [Manage packet captures for virtual machines using the Azure portal](network-watcher-packet-capture-manage-portal.md).

- Wireshark. For more information, see [https://www.wireshark.org/](https://www.wireshark.org/).

## Calculate network latency

In this scenario, we show how to view the initial Round Trip Time (RTT) of a Transmission Control Protocol (TCP) conversation occurring between two endpoints.

When a TCP connection is established, the first three packets sent in the connection follow a pattern commonly referred to as the three-way handshake. By examining the first two packets sent in this handshake, an initial request from the client and a response from the server, we can calculate the latency when this connection was established. This latency is referred to as the Round Trip Time (RTT). For more information on the TCP protocol and the three-way handshake, see the following resource. [https://support.microsoft.com/en-us/help/172983/explanation-of-the-three-way-handshake-via-tcp-ip](https://support.microsoft.com/en-us/help/172983/explanation-of-the-three-way-handshake-via-tcp-ip)

### Step 1

Launch WireShark

### Step 2

Load the **.cap** file from your packet capture. This file can be found in the blob it was saved in our locally on the virtual machine, depending on how you configured it.

### Step 3

To view the initial Round Trip Time (RTT) in TCP conversations, we'll only be looking at the first two packets involved in the TCP handshake. We'll be using the first two packets in the three-way handshake, which are the [SYN], [SYN, ACK] packets. They're named for flags set in the TCP header. The last packet in the handshake, the [ACK] packet, won't be used in this scenario. The [SYN] packet is sent by the client. Once it's received, the server sends the [ACK] packet as an acknowledgment of receiving the SYN from the client. Leveraging the fact that the server’s response requires very little overhead, we calculate the RTT by subtracting the time the [SYN, ACK] packet was received by the client by the time [SYN] packet was sent by the client.

Using WireShark this value is calculated for us.

To more easily view the first two packets in the TCP three-way handshake, we'll utilize the filtering capability provided by WireShark.

To apply the filter in WireShark, expand the “Transmission Control Protocol” Segment of a [SYN] packet in your capture and examine the flags set in the TCP header.

Since we're looking to filter on all [SYN] and [SYN, ACK] packets, under flags confirm that the Syn bit is set to 1, then right-select on the Syn bit -> Apply as Filter -> Selected.

![figure 7][7]

### Step 4

Now that you've filtered the window to only see packets with the [SYN] bit set, you can easily select conversations you're interested in to view the initial RTT. A simple way to view the RTT in WireShark is to select the dropdown marked “SEQ/ACK” analysis. You'll then see the RTT displayed. In this case, the RTT was 0.0022114 seconds, or 2.211 ms.

![figure 8][8]

## Find unwanted protocols

You can have many applications running on a virtual machine instance you've deployed in Azure. Many of these applications communicate over the network, perhaps without your explicit permission. Using packet capture to store network communication, we can investigate how applications are talking on the network and look for any issues.

In this example, we review a previous ran packet capture for unwanted protocols that might indicate unauthorized communication from an application running on your machine.

### Step 1

Using the same capture in the previous scenario, select **Statistics** > **Protocol Hierarchy**.

![protocol hierarchy menu][2]

The protocol hierarchy window appears. This view provides a list of all the protocols that were in use during the capture session and the number of packets transmitted and received using the protocols. This view can be useful for finding unwanted network traffic on your virtual machines or network.

![protocol hierarchy opened][3]

As you can see in the following screen capture, there was traffic using the BitTorrent protocol, which is used for peer to peer file sharing. As an administrator you don't expect to see BitTorrent traffic on this particular virtual machine. Now you aware of this traffic, you can remove the peer to peer software that installed on this virtual machine, or block the traffic using Network Security Groups or a Firewall. Additionally, you can elect to run packet captures on a schedule, so you can review the protocol use on your virtual machines regularly. For an example on how to automate network tasks in Azure, visit [Monitor network resources with Azure Automation](network-watcher-monitor-with-azure-automation.md).

## Finding top destinations and ports

Understanding the types of traffic, the endpoints, and the ports communicated over is important when monitoring or troubleshooting applications and resources on your network. Utilizing a packet capture file, we can quickly learn the top destinations our VM is communicating with and the ports being utilized.

### Step 1

Using the same capture in the previous scenario, select **Statistics** > **IPv4 Statistics** > **Destinations and Ports**

![packet capture window][4]

### Step 2

As we look through the results a line stands out, there were multiple connections on port 111. The most used port was 3389, which is remote desktop, and the remaining are RPC dynamic ports.

While this traffic might mean nothing, it's a port that was used for many connections and is unknown to the administrator.

![figure 5][5]

### Step 3

Now that we've determined an out of place port, we can filter our capture based on the port.

The filter in this scenario would be:

```
tcp.port == 111
```

We enter the filter text in the filter textbox and press enter.

![figure 6][6]

From the results, we can see all the traffic is coming from a local virtual machine on the same subnet. If we still don’t understand why this traffic is occurring, we can further inspect the packets to determine why it's making these calls on port 111. With this information, we can take the appropriate action.

## Next step

Learn about the other diagnostic features of Network Watcher by visiting [Azure network monitoring overview](network-watcher-monitoring-overview.md).

[1]: ./media/network-watcher-deep-packet-inspection/figure1.png
[2]: ./media/network-watcher-deep-packet-inspection/figure2.png
[3]: ./media/network-watcher-deep-packet-inspection/figure3.png
[4]: ./media/network-watcher-deep-packet-inspection/figure4.png
[5]: ./media/network-watcher-deep-packet-inspection/figure5.png
[6]: ./media/network-watcher-deep-packet-inspection/figure6.png
[7]: ./media/network-watcher-deep-packet-inspection/figure7.png
[8]: ./media/network-watcher-deep-packet-inspection/figure8.png













