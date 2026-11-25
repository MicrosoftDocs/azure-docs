---
title: Manage rules for Azure Load Balancer - Azure portal
description: In this article, learn how to manage rules for Azure Load Balancer using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
ms.topic: how-to 
ms.date: 12/06/2024
ai-usage: ai-assisted
ms.custom:
  - template-how-to
  - engagement-fy23
  - sfi-image-nochange
# Customer intent: As a network engineer, I want to configure and manage load-balancing rules for Azure Load Balancer, so that I can efficiently direct traffic to backend resources and ensure high availability and performance for my applications.
---

# Manage rules for Azure Load Balancer using the Azure portal

Azure Load Balancer supports rules to configure traffic to the backend pool.  In this article, you learn how to manage the rules for an Azure Load Balancer.

There are four types of rules:

- **Load-balancing rules** - A load balancer rule is used to define how incoming traffic is distributed to **all** the instances within the backend pool. A load-balancing rule maps a given frontend IP configuration and port to multiple backend IP addresses and ports. An example would be a rule created on port 80 to load balance web traffic.

- **High availability ports** - A load balancer rule configured with **protocol - all** and **port - 0**. These rules enable a single rule to load-balance all TCP and UDP traffic that arrive on all ports of an internal standard load balancer. The HA ports load-balancing rules help with scenarios, such as high availability and scale for network virtual appliances (NVAs) inside virtual networks. The feature can help when a large number of ports must be load-balanced.

- **Inbound NAT rule** - An inbound NAT rule forwards incoming traffic sent to frontend IP address and port combination. The traffic is sent to a **specific** virtual machine or instance in the backend pool. Port forwarding is done by the same hash-based distribution as load balancing.

- **Outbound rule** - An outbound rule configures outbound Network Address Translation (NAT) for **all** virtual machines or instances identified by the backend pool. This rule enables instances in the backend to communicate (outbound) to the internet or other endpoints.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A standard public load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md). The load balancer name for the public examples in this article is **myPublicLoadBalancer**.

- A standard internal load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create an internal load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-internal-portal.md). The load balancer name for the internal examples in this article is **myInternalLoadBalancer**.

The public and internal load balancers are separate resources. Each procedure in this article states which one to select.

To open any load balancer used in this article, sign in to the [Azure portal](https://portal.azure.com), enter **Load balancer** in the search box at the top of the portal, select **Load balancers** in the search results, and then select the load balancer named in that procedure.

## Load-balancing rules

In this section, you learn how to add and remove a load-balancing rule. A public load balancer is used in the examples.

### Add a load-balancing rule

In this example, you create a rule to load balance port 80 on the public load balancer.

1. Open **myPublicLoadBalancer** in the Azure portal.

1. In the load balancer page, select **Load balancing rules** in **Settings**.

1. Select **+ Add** in **Load balancing rules** to add a rule.

1. Enter or select the following information in **Add load balancing rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6**. |
    | Frontend IP address | Select the frontend IP address of the load balancer. <br> In this example, it's **myFrontendIP**. |
    | Protocol | Leave the default of **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Backend pool | Select the backend pool of the load balancer.</br> In this example, it's **myBackendPool**. |
    | Health probe | Select **Create new**.</br> In **Name**, enter **myHealthProbe**.</br> Select **HTTP** in **Protocol**.</br> Leave the rest at the defaults or tailor to your requirements.</br> Select **OK**. |
    | Session persistence | Select **None** or your required persistence.</br> For more information about distribution modes, see [Azure Load Balancer distribution modes](load-balancer-distribution-mode.md). | 
    | Idle timeout (minutes) | Leave the default of **4** or move the slider to your required idle timeout. |
    | TCP reset | Select **Enabled**.</br> For more information on TCP reset, see [Load Balancer TCP Reset and Idle Timeout](load-balancer-tcp-reset.md). |
    | Floating IP | Leave the default of **Disabled** or enable if your deployment requires floating IP.</br> For information on floating IP, see [Azure Load Balancer Floating IP configuration](load-balancer-floating-ip.md). |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.**</br> For more information on outbound rules and (SNAT), see [Outbound rules Azure Load Balancer](outbound-rules.md) and [Using Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md).|

1. Select **Add**.

1. Confirm that **myHTTPRule** appears in the **Load balancing rules** list. Select **Health status**, and then select **View details** to confirm that the health probe reports your backend instances as healthy. Traffic reaches the backend pool only when at least one instance is healthy.

### Remove a load-balancing rule

In this example, you remove a load-balancing rule.

1. Open **myPublicLoadBalancer** in the Azure portal.

1. In the load balancer page, select **Load balancing rules** in **Settings**.

1. Select the three dots next to the rule you want to remove.

1. Select **Delete**.

1. Confirm that the rule no longer appears in the **Load balancing rules** list.

## High availability ports

In this section, you learn how to add and remove a high availability ports rule. You use an internal load balancer in this example. 

HA ports rules are supported on a standard internal load balancer.

### Add high availability ports rule

In this example, you create a high-availability ports rule on the internal load balancer.

1. Open **myInternalLoadBalancer** in the Azure portal.

1. In the load balancer page, select **Load balancing rules** in **Settings**.

1. Select **+ Add** in **Load balancing rules** to add a rule.

1. Enter or select the following information in **Add load balancing rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHARule**. |
    | IP Version | Select **IPv4** or **IPv6**. |
    | Frontend IP address | Select the frontend IP address of the load balancer. <br> In this example, it's **myFrontendIP**.</br> Select the box next to **HA Ports**. |
    | Backend pool | Select the backend pool of the load balancer.</br> In this example, it's **myBackendPool**. |
    | Health probe | Select **Create new**.</br> In **Name**, enter **myHealthProbe**.</br> Select **TCP** in **Protocol**.</br> Enter a TCP port in **Port**. In this example, it's port **80**. Enter a port that meets your requirements.</br> Leave the rest at the defaults or tailor to your requirements.</br> Select **OK**. |
    | Session persistence | Select **None** or your required persistence.</br> For more information about distribution modes, see [Azure Load Balancer distribution modes](load-balancer-distribution-mode.md). | 
    | Idle timeout (minutes) | Leave the default of **4** or move the slider to your required idle timeout. |
    | TCP reset | Select **Enabled**.</br> For more information on TCP reset, see [Load Balancer TCP Reset and Idle Timeout](load-balancer-tcp-reset.md). |
    | Floating IP | Leave the default of **Disabled** or enable if your deployment requires floating IP.</br> For information on floating IP, see [Azure Load Balancer Floating IP configuration](load-balancer-floating-ip.md). |

    For more information on HA ports rule configuration, see **[High availability ports overview](load-balancer-ha-ports-overview.md)**.

1. Select **Add**.

1. Confirm that **myHARule** appears in the **Load balancing rules** list and shows **HA Ports** as the port configuration.

### Remove a high availability ports rule

In this example, you remove a high availability ports rule.

1. Open **myInternalLoadBalancer** in the Azure portal.

1. In the load balancer page, select **Load balancing rules** in **Settings**.

1. Select the three dots next to the rule you want to remove.

1. Select **Delete**.

1. Confirm that the rule no longer appears in the **Load balancing rules** list.

## Inbound NAT rule

Inbound NAT rules are used to route connections to a specific VM in the backend pool. For more information and a detailed tutorial on configuring and testing inbound NAT rules, see [Tutorial: Configure port forwarding in Azure Load Balancer using the portal](tutorial-load-balancer-port-forwarding-portal.md).

## Outbound rule

You learn how to add and remove an outbound rule in this section. You use a public load balancer in this example. 

Outbound rules are supported on standard public load balancers.

### Add outbound rule

In this example, you create an outbound rule on the public load balancer.

1. Open **myPublicLoadBalancer** in the Azure portal.

1. In the load balancer page, select **Outbound rules** in **Settings**.

1. Select **+ Add** in **Outbound rules** to add a rule.

1. Enter or select the following information in **Add outbound rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myOutboundRule**. |
    | IP Version | Select **IPv4** or **IPv6**. |
    | Frontend IP address | Select the frontend IP address of the load balancer. <br> In this example, it's **myFrontendIP**. | 
    | Protocol | Leave the default of **All**. |
    | Idle timeout (minutes) | Leave the default of **4** or move the slider to meet your requirements. |
    | TCP Reset | Leave the default of **Enabled**. |
    | Backend pool | Select the backend pool of the load balancer.</br> In this example, it's **myBackendPool**. |
    | **Port allocation** |   |
    | Port allocation | Select **Manually choose number of outbound ports**. |
    | **Outbound ports** |  |
    | Choose by | Select **Ports per instance**. |
    | Ports per instance | Enter **10000**. |

1. Select **Add**.

1. Confirm that **myOutboundRule** appears in the **Outbound rules** list with the port allocation you selected.

### Remove an outbound rule

In this example, you remove an outbound rule.

1. Open **myPublicLoadBalancer** in the Azure portal.

1. In the load balancer page, select **Outbound rules** in **Settings**.

1. Select the three dots next to the rule you want to remove.

1. Select **Delete**.

1. Confirm that the rule no longer appears in the **Outbound rules** list. Backend instances lose the outbound connectivity that rule provided unless another outbound path exists.

## Next steps

In this article, you learned how to manage load-balancing rules for an Azure Load Balancer.

For more information about Azure Load Balancer, see:
- [What is Azure Load Balancer?](load-balancer-overview.md)
- [Frequently asked questions - Azure Load Balancer](load-balancer-faqs.yml)
