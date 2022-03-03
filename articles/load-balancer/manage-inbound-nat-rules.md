---
title: Manage inbound NAT rules for Azure Load Balancer
description: In this article, you'll learn how to add and remove and inbound NAT rule in the Azure portal.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: how-to
ms.date: 03/02/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---
# Manage inbound NAT rules for Azure Load Balancer using the Azure portal

An inbound NAT rule is used to forward traffic from a port of the load balancer frontend to a port of a instance in load balancer backend pool. In this article, you'll learn how to add and remove an inbound NAT rule.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- A standard public load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md). The load balancer name for the examples in this article is **myLoadBalancer**.

---

# [**Portal**](#tab/inbound-nat-rule-portal)

## Create an inbound NAT rule

In this example you'll create an inbound NAT rule to forward a range of ports starting at port 500 to backend port 443. A standard public load balancer is used for the example.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Inbound NAT rules** in **Settings**.

5. Select **+ Add** in **Inbound NAT rules** to add the rule.

    :::image type="content" source="./media/manage-inbound-nat-rules/add-rule.png" alt-text="Screenshot of the inbound NAT rules page for Azure Load Balancer":::

6. Enter or select the following information in **Add inbound NAT rule**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myInboundNATrule**. |
    | Type | Select **Backend pool**. |
    | Target backend pool | Select your backend pool. In this example, it's **myBackendPool**. |
    | Frontend IP address | Select your frontend IP address. In this example, it's **myFrontend**. |
    | Frontend port range start | Enter **500**. |
    | Maximum number of machines in backend pool | Enter **1000**. |
    | Backend port | Enter **443**. |
    | Protocol | Select **TCP**. |

7. Leave the rest at the defaults and select **Add**.
    
    :::image type="content" source="./media/manage-inbound-nat-rules/add-inbound-nat-rule.png" alt-text="Screenshot of the add inbound NAT rules page":::

## Remove an inbound NAT rule

In this example, you'll remove an inbound NAT rule.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page in, select **Inbound NAT rules** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-inbound-nat-rules/remove-inbound-nat-rule.png" alt-text="Screenshot of inbound NAT rule removal.":::

# [**CLI**](#tab/inbound-nat-rule-cli)


---


## Next steps
