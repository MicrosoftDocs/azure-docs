---
title: Manage rules for Azure Load Balancer - Azure portal
description: In this article, learn how to manage rules for Azure Load Balancer using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 12/13/2022
ms.custom: template-how-to, engagement-fy23
---

# Manage rules for Azure Load Balancer using the Azure portal

Azure Load Balancer supports rules to configure traffic to the backend pool.  In this article, you'll learn how to manage the rules for an Azure Load Balancer.

There are four types of rules:

* **Load-balancing rules** - A load balancer rule is used to define how incoming traffic is distributed to **all** the instances within the backend pool. A load-balancing rule maps a given frontend IP configuration and port to multiple backend IP addresses and ports. An example would be a rule created on port 80 to load balance web traffic.

* **High availability ports** - A load balancer rule configured with **protocol - all** and **port - 0**. These rules enable a single rule to load-balance all TCP and UDP traffic that arrive on all ports of an internal standard load balancer. The HA ports load-balancing rules help with scenarios, such as high availability and scale for network virtual appliances (NVAs) inside virtual networks. The feature can help when a large number of ports must be load-balanced.

* **Inbound NAT rule** - An inbound NAT rule forwards incoming traffic sent to frontend IP address and port combination. The traffic is sent to a **specific** virtual machine or instance in the backend pool. Port forwarding is done by the same hash-based distribution as load balancing.

* **Outbound rule** - An outbound rule configures outbound Network Address Translation (NAT) for **all** virtual machines or instances identified by the backend pool. This rule enables instances in the backend to communicate (outbound) to the internet or other endpoints.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A standard public load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md). The load balancer name for the examples in this article is **myLoadBalancer**.

- A standard internal load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a internal load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-internal-portal.md). The load balancer name for the examples in this article is **myLoadBalancer**.

## Load-balancing rules

In this section, you'll learn how to add and remove a load-balancing rule. A public load balancer is used in the examples.

### Add a load-balancing rule

In this example, you'll create a rule to load balance port 80.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Load balancing rules** in **Settings**.

5. Select **+ Add** in **Load balancing rules** to add a rule.

    :::image type="content" source="./media/manage-rules-how-to/load-balancing-rules.png" alt-text="Screenshot of the load-balancing rules page in a standard load balancer." border="true":::

6. Enter or select the following information in **Add load balancing rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6**. |
    | Frontend IP address | Select the frontend IP address of the load balancer. <br> In this example, it's **myFrontendIP**. |
    | Protocol | Leave the default of **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Backend pool | Select the backend pool of the load balancer. </br> In this example, it's **myBackendPool**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest at the defaults or tailor to your requirements. </br> Select **OK**. |
    | Session persistence | Select **None** or your required persistence. </br> For more information about distribution modes, see [Azure Load Balancer distribution modes](load-balancer-distribution-mode.md). | 
    | Idle timeout (minutes) | Leave the default of **4** or move the slider to your required idle timeout. |
    | TCP reset | Select **Enabled**. </br> For more information on TCP reset, see [Load Balancer TCP Reset and Idle Timeout](load-balancer-tcp-reset.md). |
    | Floating IP | Leave the default of **Disabled** or enable if your deployment requires floating IP. </br> For information on floating IP, see [Azure Load Balancer Floating IP configuration](load-balancer-floating-ip.md). |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** </br> For more information on outbound rules and (SNAT), see [Outbound rules Azure Load Balancer](outbound-rules.md) and [Using Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md).|

7. Select **Add**.

    :::image type="content" source="./media/manage-rules-how-to/add-load-balancing-rule.png" alt-text="Screenshot of the add load balancer rule page." border="true":::

### Remove a load-balancing rule

In this example, you'll remove a load-balancing rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Load balancing rules** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-rules-how-to/remove-load-balancing-rule.png" alt-text="Screenshot of removing a load-balancing rule." border="true":::

## High availability ports

In this section, you'll learn how to add and remove a high availability ports rule. You'll use an internal load balancer in this example. 

HA ports rules are supported on a standard internal load balancer.

### Add high availability ports rule

In this example, you'll create a high availability ports rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Load balancing rules** in **Settings**.

5. Select **+ Add** in **Load balancing rules** to add a rule.

    :::image type="content" source="./media/manage-rules-how-to/load-balancing-rules.png" alt-text="Screenshot of the load-balancing rules page in a standard load balancer." border="true":::

6. Enter or select the following information in **Add load balancing rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHARule**. |
    | IP Version | Select **IPv4** or **IPv6**. |
    | Frontend IP address | Select the frontend IP address of the load balancer. <br> In this example, it's **myFrontendIP**. </br> Select the box next to **HA Ports**. |
    | Backend pool | Select the backend pool of the load balancer. </br> In this example, it's **myBackendPool**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **TCP** in **Protocol**. </br> Enter a TCP port in **Port**. In this example, it's port **80**. Enter a port that meets your requirements. </br> Leave the rest at the defaults or tailor to your requirements. </br> Select **OK**. |
    | Session persistence | Select **None** or your required persistence. </br> For more information about distribution modes, see [Azure Load Balancer distribution modes](load-balancer-distribution-mode.md). | 
    | Idle timeout (minutes) | Leave the default of **4** or move the slider to your required idle timeout. |
    | TCP reset | Select **Enabled**. </br> For more information on TCP reset, see [Load Balancer TCP Reset and Idle Timeout](load-balancer-tcp-reset.md). |
    | Floating IP | Leave the default of **Disabled** or enable if your deployment requires floating IP. </br> For information on floating IP, see [Azure Load Balancer Floating IP configuration](load-balancer-floating-ip.md). |

    For more information on HA ports rule configuration, see **[High availability ports overview](load-balancer-ha-ports-overview.md)**.

7. Select **Add**.

    :::image type="content" source="./media/manage-rules-how-to/add-ha-ports-load-balancing-rule.png" alt-text="Screenshot of the add load balancer HA ports rule page." border="true":::

### Remove a high availability ports rule

In this example, you'll remove a load-balancing rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Load balancing rules** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-rules-how-to/remove-ha-ports-load-balancing-rule.png" alt-text="Screenshot of removing a HA ports load-balancing rule." border="true":::

## Inbound NAT rule

Inbound NAT rules are used to route connections to a specific VM in the backend pool. For more information and a detailed tutorial on configuring and testing inbound NAT rules, see [Tutorial: Configure port forwarding in Azure Load Balancer using the portal](tutorial-load-balancer-port-forwarding-portal.md).

## Outbound rule

You'll learn how to add and remove an outbound rule in this section. You'll use a public load balancer in this example. 

Outbound rules are supported on standard public load balancers.

### Add outbound rule

In this example, you'll create an outbound rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Outbound rules** in **Settings**.

5. Select **+ Add** in **Outbound rules** to add a rule.

    :::image type="content" source="./media/manage-rules-how-to/outbound-rules.png" alt-text="Screenshot of the outbound rules page in a standard load balancer." border="true":::

6. Enter or select the following information in **Add outbound rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myOutboundRule**. |
    | IP Version | Select **IPv4** or **IPv6**. |
    | Frontend IP address | Select the frontend IP address of the load balancer. <br> In this example, it's **myFrontendIP**. | 
    | Protocol | Leave the default of **All**. |
    | Idle timeout (minutes) | Leave the default of **4** or move the slider to meet your requirements. |
    | TCP Reset | Leave the default of **Enabled**. |
    | Backend pool | Select the backend pool of the load balancer. </br> In this example, it's **myBackendPool**. |
    | **Port allocation** |   |
    | Port allocation | Select **Manually choose number of outbound ports**. |
    | **Outbound ports** |  |
    | Choose by | Select **Ports per instance**. |
    | Ports per instance | Enter **10000**. |

7. Select **Add**.

    :::image type="content" source="./media/manage-rules-how-to/add-outbound-rule.png" alt-text="Screenshot of the add outbound rule page." border="true":::

### Remove an outbound rule

In this example, you'll remove an outbound rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Outbound rules** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-rules-how-to/remove-outbound-rule.png" alt-text="Screenshot of removing an outbound rule." border="true":::

## Next steps

In this article, you learned how to managed load-balancing rules for an Azure Load Balancer.

For more information about Azure Load Balancer, see:
- [What is Azure Load Balancer?](load-balancer-overview.md)
- [Frequently asked questions - Azure Load Balancer](load-balancer-faqs.yml)
