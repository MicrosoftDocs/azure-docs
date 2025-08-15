---
title: How to set up and monitor Azure Firewall DNAT rules for secure traffic management
description: Learn how to configure and monitor Azure Firewall DNAT rules to securely manage incoming traffic by translating destination IP addresses and ports, including support for FQDN filtering for dynamic backend configurations.
services: firewall
author: sujamiya
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 4/29/2025
ms.author: sujamiya
ms.custom: ai-usage
---

# How to set up and monitor Azure Firewall DNAT rules for secure traffic management

Azure Firewall DNAT (Destination Network Address Translation) rules are used to filter and rout inbound traffic. They allow you to translate the public-facing destination IP address and port of incoming traffic to a private IP address and port within your network. This is useful when you want to expose a service running on a private IP (such as a web server or SSH endpoint) to the internet or another network. 

A DNAT rule specifies:
- **Source**: The source IP address or IP group from which the traffic originates.
- **Destination**: The destination IP address of the Azure Firewall instance.
- **Protocol**: The protocol used for the traffic (TCP or UDP).
- **Destination port**: The port on the Azure Firewall instance that receives the traffic.
- **Translated address**: The private IP address or FQDN to which the traffic should be routed.
- **Translated port**: The port on the translated address to which the traffic should be directed.

When a packet matches the DNAT rule, Azure Firewall modifies the packet's destination IP address and port according to the rule before forwarding it to the specified backend server.

Azure Firewall supports *FQDN filtering* in DNAT rules, allowing you to specify a fully qualified domain name (FQDN) as the target for translation instead of a static IP address. This enables dynamic backend configurations and simplifies management in scenarios where the backend server's IP address can change frequently.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure Firewall instance.
- An Azure Firewall policy.

## Create a DNAT rule

1. In the Azure portal, navigate to your Azure Firewall instance.

1. In the left pane, select **Rules**.

1. Select **DNAT rules**.

1. Select **+ Add DNAT rule collection**.

1. In the **Add a rule collection** pane, provide the following information:

   - **Name**: Enter a name for the DNAT rule collection.
   - **Priority**: Specify a priority for the rule collection. Lower numbers indicate higher priority. The range is 100-65000.
   - **Action**: Destination Network Address Translation (DNAT) (default).
   - **Rule collection group**: This is the name of the rule collection group that contains the DNAT rule collection. You can select a default group or one you created earlier.
   - **Rules**:
       - **Name**: Enter a name for the DNAT rule.
       - **Source type**: Select **IP Address** or [**IP Group**](create-ip-group.md).
       - **Source**: Enter the source IP address or select an IP group.
       - **Protocol**: Select the protocol (TCP or UDP).
       - **Destination Ports**: Enter the destination port or port range (For example: single port 80, port range 80-100, or multiple ports 80,443).
       - **Destination (Firewall IP address)**: Enter the destination IP address of the Azure Firewall instance.
       - **Translated type**: Select **IP Address** or **FQDN**.
       - **Translated address or FQDN**: Enter the translated IP address or FQDN.
       - **Translated port**: Enter the translated port.

1. Repeat step 5 for extra rules as needed.

1. Select **Add** to create the DNAT rule collection.

## Monitor and validate DNAT rules

Once you've created DNAT rules, you can monitor and troubleshoot them using the **AZFWNatRule** log. This log provides detailed insights into the DNAT rules applied to incoming traffic, including:

- **Timestamp**: The exact time the traffic flow occurred.
- **Protocol**: The protocol used for communication (For example, TCP or UDP).
- **Source IP and port**: Information about the originating traffic source.
- **Destination IP and port**: The original destination details before translation.
- **Translated IP and port**: The resolved IP address (if using FQDN) and the target port after translation.

It's important to note the following when you're analyzing the **AZFWNatRule** log:

- **Translated field**: For DNAT rules using FQDN filtering, the logs display the resolved IP address in the translated field instead of the FQDN.
- **Private DNS zones**: Supported only within virtual networks (VNets). This feature isn't available for virtual WAN SKUs.
- **Multiple IPs in DNS resolution**: If an FQDN resolves to multiple IP addresses in a private DNS zone or custom DNS servers, Azure Firewall's DNS proxy selects the first IP address from the list. This behavior is by design.
- **FQDN resolution failures**:
    - If Azure Firewall can't resolve an FQDN, the DNAT rule doesn't match, so the traffic isn't processed.
    - These failures are logged in **AZFWInternalFQDNResolutionFailure** logs only if DNS proxy is enabled.
    - Without DNS proxy enabled, resolution failures aren't logged.

### Key considerations

The following considerations are important when using DNAT rules with FQDN filtering:

- **Private DNS zones**: Only supported within the virtual network and not with Azure Virtual WAN.
- **Multiple IPs in DNS resolution**: Azure Firewall's DNS proxy always selects the first IP address from the resolved list (Private DNS zone or custom DNS server). This is an expected behavior.

Analyzing these logs can help diagnose connectivity issues and ensure traffic is routed correctly to the intended backend.

## Next steps

- Learn how to monitor Azure Firewall logs and metrics using [Azure Monitor](monitor-firewall.md).