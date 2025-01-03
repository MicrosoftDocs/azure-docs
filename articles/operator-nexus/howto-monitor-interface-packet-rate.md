---
title: How to monitor interface In and Out packet rate for Network Fabric Devices via Azure portal
description: Learn how to track incoming and outgoing packet rates for network fabric devices on Azure portal for effective network monitoring.
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# How to monitor interface In and Out packet rate for network fabric devices

In the domain of network management, monitoring the Interface In and Out Packet Rate is crucial for ensuring optimal network performance and troubleshooting potential issues. This guide walks you through the steps to access and analyze these metrics for all network fabric devices using the Azure portal.

## Step 1: Access the Azure portal

  Sign in to Azure portal.
	
## Step 2: Choose the resource type and subscription

- Once logged in, you land on the Azure portal dashboard.

- Utilize the search bar at the top of the page and type in "Monitor" then select it from the search results.

- Within the Monitor page, locate and click on "Metrics."

- In the Metrics blade, utilize the search bar to quickly find and select the appropriate subscription and set the resource type from the dropdown menus at the top of the page.

  :::image type="content" source="media/scope-resource-type.png" alt-text="Screenshot of Azure portal showing the scope and resource type." lightbox="media/scope-resource-type.png":::
	
## Step 3: Select the network fabric devices
  
  After choosing your preferred subscription and resource type, you'll then need to focus on choosing the particular network fabric device you wish to monitor. Alternatively, you can choose the resource group to include all network devices within it.

  :::image type="content" source="media/select-network-device-resource.png" alt-text="Screenshot of Azure portal showing the list of resource types." lightbox="media/select-network-device-resource.png":::
	
## Step 4: View the In & Out packet rate metric

- After locating the desired network fabric device, click on it to open its monitoring page.

- Within the monitoring page, navigate to the "Metrics" tab.

- In the list of available metrics, you can select either the "In Packet Rate" or "Out Packet Rate" metric, depending on which one you want to monitor.

  **Interface In Pkts**

  :::image type="content" source="media/metrics-interface-in-pkts.png" alt-text="Screenshot of Azure portal showing the interface in packet rate metric chart." lightbox="media/metrics-interface-in-pkts.png":::

 
	
  **Interface Out Pkts**

  :::image type="content" source="media/metrics-interface-out-pkts.png" alt-text="Screenshot of Azure portal showing the interface out packet rate metric chart." lightbox="media/metrics-interface-out-pkts.png":::

- The metric chart will display the packet rate over time, typically captured at 5-minute intervals.

- You can adjust the time range using the time selector at the top right corner of the chart to view historical data.

## Step 5: Analyze the metrics
 
**Understanding In and Out Packets:** 

 - **In packet rate:** This metric refers to the rate at which the network interface received packets. Essentially, it measures the flow of incoming data packets to the device.
	
	:::image type="content" source="media/metrics-interface-in-pkt-avg.png" alt-text="Screenshot of Azure portal showing the average interface in packet rate metric chart." lightbox="media/metrics-interface-in-pkt-avg.png":::

- Below is the equivalent show command run on the device to retrieve the interface's "In" and "Out" packet rate.

  ```bash
  show int eth17/1
  ```

  ```Output
  Ethernet17/1 is up, line protocol is up (connected)
  Hardware is Ethernet, address is c4ca.2b69.bcc7
  Description: "AR-CE1:Et17/1 to CR1-TOR1-Port31"
  Internet address is 10.100.12.1/31
  Broadcast address is 255.255.255.255
  IPv6 link-local address is fe80::c6ca:2bff:fe69:bcc7/64
  IPv6 global unicast address(es):
    fda0:d59c:df06:c::1, subnet is fda0:d59c:df06:c::/127
  IP MTU 9214 bytes, Ethernet MRU 10240 bytes, BW 100000000 kbit
  Full-duplex, 100Gb/s, auto negotiation: off, uni-link: disabled
  Up 39 days, 14 hours, 26 minutes, 33 seconds
  Loopback Mode : None
  2 link status changes since last clear
  Last clearing of "show interface" counters 39 days, 14:39:49 ago
  5 minutes input rate 1.62 Mbps (0.0% with framing overhead), **166 packets/sec**
  5 minutes output rate 215 kbps (0.0% with framing overhead), 86 packets/sec
     453326486 packets input, 522128942184 bytes
     Received 18 broadcasts, 119342 multicast
     0 runts, 0 giants
     0 input errors, 0 CRC, 0 alignment, 0 symbol, 0 input discards
     0 PAUSE input
     239392039 packets output, 127348527379 bytes
     Sent 16 broadcasts, 119510 multicast
     0 output errors, 0 collisions
     0 late collision, 0 deferred, 0 output discards
     0 PAUSE output

  ```

- **Out packet rate:** Conversely, the network interface sent packets at the rate measured by this metric. It indicates the flow of outgoing data packets from the device to other network destinations.
  
   :::image type="content" source="media/metrics-interface-out-pkt-avg.png" alt-text="Screenshot of Azure portal showing the average interface out packet rate metric chart." lightbox="media/metrics-interface-out-pkt-avg.png":::
  
- Analyze the trend of the packet rate over time.
  
- Look for any unusual spikes or dips in the graph, which could indicate potential issues such as network congestion or packet loss.
   
- Compare the In Packet Rate and Out Packet Rate to assess the overall network traffic flow.
