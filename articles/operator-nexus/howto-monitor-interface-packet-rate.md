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
  
  After choosing the desired subscription and resource type, you'll need to narrow down to the specific network fabric device you want to monitor.

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

- **Out packet rate:** Conversely, the network interface sent packets at the rate measured by this metric. It indicates the flow of outgoing data packets from the device to other network destinations.
  
   :::image type="content" source="media/metrics-interface-out-pkt-avg.png" alt-text="Screenshot of Azure portal showing the average interface out packet rate metric chart." lightbox="media/metrics-interface-out-pkt-avg.png":::
  
- Analyze the trend of the packet rate over time.
  
- Look for any unusual spikes or dips in the graph, which could indicate potential issues such as network congestion or packet loss.
   
- Compare the In Packet Rate and Out Packet Rate to assess the overall network traffic flow.
