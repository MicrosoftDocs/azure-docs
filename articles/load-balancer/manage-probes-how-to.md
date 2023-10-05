---
title: Manage health probes for Azure Load Balancer - Azure portal
description: In this article, learn how to manage health probes for Azure Load Balancer using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 05/05/2023
ms.custom: template-how-to
---

# Manage health probes for Azure Load Balancer using the Azure portal

Azure Load Balancer uses health probes to monitor the health of backend instances. In this article, you'll learn how to manage health probes for Azure Load Balancer.

There are three types of health probes:

| | Standard SKU | Basic SKU |
| --- | --- | --- |
| **Probe types** | TCP, HTTP, HTTPS | TCP, HTTP |
| **Probe down behavior** | All probes down, all TCP flows continue. | All probes down, all TCP flows expire. | 

Health probes have the following properties:

| Health Probe configuration | Details |
| --- | --- | 
| Name | Name of the health probe. This is a name you get to define for your health probe |
| Protocol | Protocol of health probe. This is the protocol type you would like the health probe to leverage. Available options are: TCP, HTTP, HTTPS |
| Port | Port of the health probe. The destination port you would like the health probe to use when it connects to the virtual machine to check the virtual machine's health status. You must ensure that the virtual machine is also listening on this port (that is, the port is open). |
| Interval (seconds) | Interval of health probe. The amount of time (in seconds) between consecutive health check attemps to the virtual machine |
| Used by | The list of load balancer rules using this specific health probe. You should have at least one rule using the health probe for it to be effective |
| Path | The URI used for requesting health status from the virtual machine instance by the health probe (only applicable for HTTP(s) probes).

>[!IMPORTANT]
>Load Balancer health probes originate from the IP address 168.63.129.16 and must not be blocked for probes to mark your instance as up. To see this probe traffic within your backend instance, review [the Azure Load Balancer FAQ](./load-balancer-faqs.yml).
>
>
>Regardless of configured time-out threshold, HTTP(S) load balancer health probes will automatically mark the instance as down if the server returns any status code that isn't HTTP 200 OK or if the connection is terminated via TCP reset.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A standard public load balancer in your subscription. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](quickstart-load-balancer-standard-public-portal.md). The load balancer name for the examples in this article is **myLoadBalancer**.

## TCP health probe

In this section, you'll learn how to add and remove a TCP health probe. A public load balancer is used in the examples.

### Add a TCP health probe

In this example, you'll create a TCP health probe to monitor port 80.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Health probes** in **Settings**.

5. Select **+ Add** in **Health probes** to add a probe.

    :::image type="content" source="./media/manage-probes-how-to/add-probe.png" alt-text="Screenshot of the health probes page for Azure Load Balancer":::

6. Enter or select the following information in **Add health probe**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **TCP**. |
    | Port | Enter the **TCP** port you wish to monitor. For this example, it's **port 80**. |
    | Interval | Enter an interval between probe checks. For this example, it's the default of **5**. |

7. Select **Add**.

### Remove a TCP health probe

In this example, you'll remove a TCP health probe.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Health probes** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-probes-how-to/remove-tcp-probe.png" alt-text="Screenshot of TCP probe removal.":::

## HTTP health probe

In this section, you'll learn how to add and remove an HTTP health probe. A public load balancer is used in the examples.

### Add an HTTP health probe

In this example, you'll create an HTTP health probe.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Health probes** in **Settings**.

5. Select **+ Add** in **Health probes** to add a probe.

    :::image type="content" source="./media/manage-probes-how-to/add-probe.png" alt-text="Screenshot of the health probes page for Azure Load Balancer":::

6. Enter or select the following information in **Add health probe**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **HTTP**. |
    | Port | Enter the **TCP** port you wish to monitor. For this example, it's **port 80**. |
    | Path | Enter a URI used for requesting health status. For this example, it's **/**. |
    | Interval | Enter an interval between probe checks. For this example, it's the default of **5**. |

7. Select **Add**.

### Remove an HTTP health probe

In this example, you'll remove an HTTP health probe.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Health probes** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-probes-how-to/remove-http-probe.png" alt-text="Screenshot of HTTP probe removal.":::

## HTTPS health probe

In this section, you'll learn how to add and remove an HTTPS health probe. A public load balancer is used in the examples.

### Add an HTTPS health probe

In this example, you'll create an HTTPS health probe.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Health probes** in **Settings**.

5. Select **+ Add** in **Health probes** to add a probe.

    :::image type="content" source="./media/manage-probes-how-to/add-probe.png" alt-text="Screenshot of the health probes page for Azure Load Balancer":::

6. Enter or select the following information in **Add health probe**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **HTTPS**. |
    | Port | Enter the **TCP** port you wish to monitor. For this example, it's **port 443**. |
    | Path | Enter a URI used for requesting health status. For this example, it's **/**. |
    | Interval | Enter an interval between probe checks. For this example, it's the default of **5**. |

7. Select **Add**.

### Remove an HTTPS health probe

In this example, you'll remove an HTTPS health probe.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

3. Select **myLoadBalancer** or your load balancer.

4. In the load balancer page, select **Health probes** in **Settings**.

5. Select the three dots next to the rule you want to remove.

6. Select **Delete**.

    :::image type="content" source="./media/manage-probes-how-to/remove-https-probe.png" alt-text="Screenshot of HTTPS probe removal.":::

## Next steps

In this article, you learned how to manage health probes for an Azure Load Balancer.

For more information about Azure Load Balancer, see:
- [What is Azure Load Balancer?](load-balancer-overview.md)
- [Frequently asked questions - Azure Load Balancer](load-balancer-faqs.yml)
- [Azure Load Balancer health probes](load-balancer-custom-probe-overview.md)
