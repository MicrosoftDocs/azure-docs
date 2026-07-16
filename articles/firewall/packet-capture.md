---
title: Use Packet Capture to Troubleshoot Azure Firewall
ms.reviewer: duau
description: Learn how to use Azure Firewall's packet capture capability to capture and analyze network traffic. Configure filters, capture traffic, and analyze results for troubleshooting and debugging.
author: varunkalyana
ms.author: varunkalyana
ms.service: azure-firewall
ms.topic: how-to
ms.date: 12/11/2025
#customer intent: As a network administrator, I want to capture network traffic on Azure Firewall so that I can analyze traffic flows and troubleshoot connectivity issues.
---

# Use packet capture to troubleshoot Azure Firewall

Azure Firewall's packet capture feature lets you capture and analyze network traffic for troubleshooting. This article shows you how to configure filters, capture traffic, and analyze results.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Firewall with Management NIC enabled. See [Deploy and configure Azure Firewall and policy](tutorial-firewall-deploy-portal-policy.md).
  - Management NIC is enabled by default on Basic SKU and Virtual WAN deployments.
  - For Standard or Premium SKU in a virtual network, see [Azure Firewall Management NIC](forced-tunneling.md) to enable it.

## Create a storage account

Create a storage account and obtain a SAS URL for a container where the captured packets are stored.

### Set up the storage account

1. In the Azure portal, select **Create a resource**, search for **Storage accounts**, and select **Create**.
1. On the **Basics** tab, enter the required information for your storage account.
1. On the **Advanced** tab, under **Security**, select **Allow enabling anonymous access on individual containers**. Keep the other default settings.

   :::image type="content" source="media/packet-capture/storage-security.png" alt-text="Screenshot of the storage account Advanced tab showing the Security section with the Allow enabling anonymous access on individual containers option.":::

### Create a container

1. After you create the storage account, go to the resource and select **Containers** under **Data storage**.
1. Select **+ Container** and provide a name for the new container.
1. For **Anonymous access level**, select **Container (anonymous read access for containers and blobs)**.

   :::image type="content" source="media/packet-capture/new-container.png" alt-text="Screenshot of the New container dialog with the Anonymous access level set to Container (anonymous read access for containers and blobs).":::

### Generate a SAS URL

1. After you create the container, select **...** (ellipsis) next to it and select **Generate SAS**.
1. On the **Generate SAS** page, under **Permissions**, clear the **Read** permission and select **Write**.

   :::image type="content" source="media/packet-capture/generate-shared-access-signature.png" alt-text="Screenshot of the Generate SAS page showing the Permissions section with Write permission selected and Read permission cleared.":::

1. Select **Generate SAS token and URL** and copy the generated SAS URL.

> [!IMPORTANT]
> Packet capture fails if the storage account SAS URL isn't configured correctly. Follow all steps precisely:
> - Enable anonymous access on individual containers
> - Set anonymous access level to **Container**
> - Grant **Write** permission only and clear **Read**
>
> Common configuration errors:
> - Missing write permissions on the SAS URL
> - Container-level access not enabled
> - SAS URL pointing to blob storage instead of a container

## Configure and run a packet capture

Configure and start a packet capture on your firewall.

### Access packet capture

1. Go to your firewall in the Azure portal.
1. Under **Help**, select **Packet Capture**.

### Configure capture settings

1. On the Packet Capture page, configure the following settings:
   - **Packet capture name**: Enter a unique name for your capture files.
   - **Output SAS URL**: Paste the SAS URL of the storage container you created.
   
   > [!TIP]
   > Use unique file names for each capture to preserve previous results. Running multiple captures with the same file name to the same SAS URL overwrites existing files.

1. Set the basic capture parameters:
   - **Maximum number of packets**: Enter a value between 100 and 90,000 packets.
   - **Time limit (seconds)**: Enter a value between 30 and 1,800 seconds.
   - **Protocol**: Select the protocol to capture: *Any*, *TCP*, *UDP*, or *ICMP*.
   - **TCP Flags**: If you selected *TCP* or *Any* protocol, choose which packet types to capture: *FIN*, *SYN*, *RST*, *PSH*, *ACK*, or *URG*.
   
   > [!NOTE]
   > Specify both a maximum packet count and a time limit. The capture stops when the first limit is reached.

### Define capture filters

1. In the **Filtering** section, specify which packets to capture:
   - Source IP addresses or subnets
   - Destination IP addresses or subnets
   - Destination ports
   
   > [!NOTE]
   > - At least one filter is required.
   > - Packet capture records bidirectional traffic that matches each filter.
   > - Use comma-separated lists for multiple values (for example, 192.168.1.1, 192.168.2.1 or 192.168.1.0/24).
   > - To capture both incoming and outgoing packets when using SNAT, connecting to the Internet, or processing application rules, include the `AzureFirewallSubnet` address space in the source field.

### Start the capture

1. In the **Status** section, select **Refresh status** to verify no packet capture is currently running.

   :::image type="content" source="media/packet-capture/refresh-status.png" alt-text="Screenshot of the Status section showing the Refresh status button.":::
    
   - If the firewall is ready, the status shows **No packet capture in progress. You can start a new packet capture.**
   
   :::image type="content" source="media/packet-capture/start-capture.png" alt-text="Screenshot of the packet capture interface showing the Start packet capture button.":::
    
   - If a packet capture is already in progress, select **Stop packet capture**, then refresh the status to confirm it stopped before starting a new capture.
    
   :::image type="content" source="media/packet-capture/stop-capture.png" alt-text="Screenshot of the packet capture interface showing the Stop packet capture button.":::

1. Select **Start packet capture** to begin capturing packets with your configured settings.

   > [!NOTE]
   > Azure reports a packet capture operation as successful when captures are obtained from at least half of the firewall's underlying compute instances. The portal doesn't display which instances provided captures, so the status message is the primary indicator of success.

## Analyze the packet capture

After the packet capture completes, the status displays **Packet capture completed successfully. Ready to start a new packet capture**.

   :::image type="content" source="media/packet-capture/capture-complete.png" alt-text="Screenshot of the packet capture status showing the completion message: Packet capture completed successfully.":::

### Download and examine the capture files

1. Go to your storage container in the Azure portal.

   :::image type="content" source="media/packet-capture/packet-capture-containers.png" alt-text="Screenshot of the Azure Storage account showing the containers page with the packet capture container." lightbox="media/packet-capture/packet-capture-containers.png":::

   The capture files are saved in the container's root folder. You see multiple `pcap` files—one for each virtual machine instance in the firewall's backend.

1. Download the `pcap` files.

   :::image type="content" source="media/packet-capture/packet-capture-container-files.png" alt-text="Screenshot of the storage container showing multiple pcap files captured from the firewall instances." lightbox="media/packet-capture/packet-capture-container-files.png":::

1. Analyze the files using a packet analysis tool such as Wireshark.

### Understand packet flow patterns

Each packet capture contains incoming and outgoing packet pairs. For every packet the firewall processes, you see a corresponding pair in the capture. The following table describes four common packet flow patterns:

   | Scenario | Incoming packet | Outgoing packet |
   |--|--|--|
   | Virtual network to virtual network (without SNAT)<br>Virtual network to on-premises (without SNAT) | Source: Client<br>Destination: Server | Source: Client<br>Destination: Server<br><br>Layer 2 headers differ, but Layer 3 and above remain identical. |
   | [Virtual network to virtual network (with SNAT)<br>Virtual network to on-premises (with SNAT)<br>Virtual network to Internet | Source: Client<br>Destination: Server | Source: Firewall<br>Destination: Server<br><br>Layer 3 source IP changes due to SNAT. Layer 4 and above remain unchanged. |
   | Application rule flows | Source: Client<br>Destination: Server | Source: Firewall<br>Destination: Server<br><br>Layer 4 and above differ because the firewall proxies the connection, establishing a new session to the destination.<br><br>Use HTTP or TLS keys to match incoming and outgoing packets. Layer 7 remains the same. |
   | DNAT flows | Source: Client<br>Destination: Firewall public IP | Source: Firewall<br>Destination: DNATed private IP <br><br>Layer 3 destination IP differs from the incoming packet due to DNAT, while Layer 4 remains the same. |

For detailed instructions on these scenarios, see [Using packet capture for troubleshooting Azure Firewall flows](https://techcommunity.microsoft.com/blog/azurenetworksecurityblog/using-packet-capture-for-troubleshooting-azure-firewall-flows/4466692).

## Frequently asked questions

### Can I capture traffic on all ports by setting the destination port to 0?

You must specify at least one destination port in each filter. Capturing traffic on all ports isn't supported.

### Can I use IP address ranges in a filter?

Filters support individual IP addresses or subnets, but not IP address ranges. If you need to capture a range, use a subnet that covers those addresses. Limit your filters to no more than five IP addresses or subnets.

### Can I leave the maximum packets or time limit blank to capture all traffic?

Both values are required. Set them to the maximum permitted values if needed. The capture stops automatically when either limit is reached.

### Can I manually stop a running packet capture?

Yes, select the **Stop packet capture** button to end the capture before it reaches the configured limits.

### Does packet capture support continuous or cyclical captures?

Cyclical (continuous) packet captures aren't supported. If you need an extended or repeated capture for troubleshooting, open an [Azure support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview). Microsoft Support can run longer captures on your behalf.

### Can I set the destination to 0.0.0.0/0 to capture all traffic?

Packet capture is designed to troubleshoot specific flows. Setting the destination to 0.0.0.0/0 results in empty captures and doesn't capture all traffic.

### Can I use an FQDN in a filter instead of IP addresses?

Filters don't support FQDNs. However, you can use DNS to resolve the FQDN to IP addresses and add those IP addresses to your filter.

### Is leaving TCP flags unchecked the same as selecting all flags?

When no TCP flags are selected (the default), all packet types are captured. Select specific flags only when you want to capture particular packet types.

### Can I capture ICMP, TCP, and UDP packets simultaneously?

Yes, select **Any** as the protocol to capture all packet types. The protocol field is designed to filter for specific protocols when needed.

### How do I know if the packet capture was successful?

Azure reports success when captures are obtained from at least half of the underlying compute instances. Empty capture files indicate the operation was successful, but no traffic matching your filters was found. Broaden your filters and run the capture again.

## Next steps

- [Azure Firewall metrics and alerts](metrics.md)
