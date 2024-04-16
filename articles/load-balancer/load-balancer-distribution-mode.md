---
title: Configure Azure Load Balancer distribution mode
titleSuffix: Azure Load Balancer
description: In this article, get started configuring the distribution mode for Azure Load Balancer to support source IP affinity.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.custom: template-how-to, devx-track-azurecli
ms.date: 01/22/2024
ms.author: mbender
---

# Configure the distribution mode for Azure Load Balancer

Azure Load Balancer supports two distribution modes for distributing traffic to your applications:

* Hash-based
* Source IP affinity

To learn more about the different distribution modes supported by Azure Load Balancer, see [Azure Load Balancer distribution modes](distribution-mode-concepts.md).

In this article, you learn how to configure the distribution mode for your Azure Load Balancer.


## Configure distribution mode

---

# [**Azure portal**](#tab/azure-portal)

You can change the configuration of the distribution mode by modifying the load-balancing rule in the portal.

1. Sign in to the Azure portal and locate the resource group containing the load balancer you wish to change by clicking on **Resource Groups**.
2. In the load balancer overview screen, select **Load-balancing rules** under **Settings**.
3. In the load-balancing rules screen, select the load-balancing rule that you wish to change the distribution mode.
4. Under the rule, the distribution mode is changed by changing the **Session persistence** drop-down box. 

The following options are available: 

* **None (hash-based)** - Specifies that successive requests from the same client can be handled by any virtual machine.
* **Client IP (two-tuple: source IP and destination IP)** - Specifies that successive requests from the same client IP address are handled by the same virtual machine.
* **Client IP and protocol (three-tuple: source IP, destination IP, and protocol type)** - Specifies that successive requests from the same client IP address and protocol combination are handled by the same virtual machine.

5. Choose the distribution mode and then select **Save**.

:::image type="content" source="./media/load-balancer-distribution-mode/session-persistence.png" alt-text="Change session persistence on load balancer rule." border="true" lightbox="./media/load-balancer-distribution-mode/session-persistence.png":::


# [**PowerShell**](#tab/azure-powershell)

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Use PowerShell to change the load-balancer distribution settings on an existing load-balancing rule. The following command updates the distribution mode: 

```azurepowershell-interactive
$lb = Get-AzLoadBalancer -Name MyLoadBalancer -ResourceGroupName MyResourceGroupLB
$lb.LoadBalancingRules[0].LoadDistribution = 'default'
Set-AzLoadBalancer -LoadBalancer $lb
```

Set the value of the `LoadDistribution` element for the type of load balancing required. 

* Specify **SourceIP** for two-tuple (source IP and destination IP) load balancing. 

* Specify **SourceIPProtocol** for three-tuple (source IP, destination IP, and protocol type) load balancing. 

* Specify **Default** for the default behavior of five-tuple load balancing.

# [**CLI**](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

Use Azure CLI to change the load-balancer distribution settings on an existing load-balancing rule.  The following command updates the distribution mode:

```azurecli-interactive
az network lb rule update \
    --lb-name myLoadBalancer \
    --load-distribution Default \
    --name myHTTPRule \
    --resource-group myResourceGroupLB 
```
Set the value of `--load-distribution` for the type of load balancing required.

* Specify **SourceIP** for two-tuple (source IP and destination IP) load balancing. 

* Specify **SourceIPProtocol** for three-tuple (source IP, destination IP, and protocol type) load balancing. 

* Specify **Default** for the default behavior of five-tuple load balancing.

For more information on the command used in this article, see [az network lb rule update](/cli/azure/network/lb/rule#az-network-lb-rule-update)

---

## Next steps

* [Azure Load Balancer overview](load-balancer-overview.md)
* [Get started with configuring an internet-facing load balancer](quickstart-load-balancer-standard-public-powershell.md)
* [Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
