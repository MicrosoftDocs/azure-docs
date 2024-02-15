---
title: Configure load balancer TCP reset and idle timeout
titleSuffix: Azure Load Balancer
description: In this article, learn how to configure Azure Load Balancer TCP idle timeout and reset.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 02/12/2024
ms.author: mbender
ms.custom: template-how-to
---

# Configure TCP reset and idle timeout for Azure Load Balancer

Azure Load Balancer rules have a default timeout range of 4 minutes to 100 minutes for Load Balancer rules, Outbound Rules, and Inbound NAT rules. The default setting is 4 minutes. If a period of inactivity is longer than the timeout value, there's no guarantee that the TCP or HTTP session is maintained between the client and your service. 

The following sections describe how to change idle timeout and tcp reset settings for load balancer resources.

## Set tcp reset and idle timeout
---
# [**Portal**](#tab/tcp-reset-idle-portal)

To set the idle timeout and tcp reset for a load balancer, edit the load-balanced rule. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left-hand menu, select **Resource groups**.
1. Select the resource group for your load balancer. In this example, the resource group is named **myResourceGroup**.
1. Select your load balancer. In this example, the load balancer is named **myLoadBalancer**.
1. In **Settings**, select **Load balancing rules**.

    :::image type="content" source="./media/load-balancer-tcp-idle-timeout/portal-lb-rules.png" alt-text="Edit load balancer rules." border="true" lightbox="./media/load-balancer-tcp-idle-timeout/portal-lb-rules.png":::

1. Select your load-balancing rule. In this example, the load-balancing rule is named **myLBrule**.
1. In the load-balancing rule, input your timeout value into **Idle timeout (minutes)**.  
1. Under **TCP reset**, select **Enabled**.
   
    :::image type="content" source="./media/load-balancer-tcp-idle-timeout/portal-lb-rules-tcp-reset.png" alt-text="Set idle timeout and tcp reset." border="true" lightbox="./media/load-balancer-tcp-idle-timeout/portal-lb-rules-tcp-reset.png":::

1. Select **Save**.

# [**PowerShell**](#tab/tcp-reset-idle-powershell)

To set the idle timeout and tcp reset, set values in the following load-balancing rule parameters with [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer):

* **IdleTimeoutInMinutes**
* **EnableTcpReset**

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

Replace the following examples with the values from your resources:

* **myResourceGroup**
* **myLoadBalancer**

```azurepowershell
$lb = Get-AzLoadBalancer -Name "myLoadBalancer" -ResourceGroup "myResourceGroup"
$lb.LoadBalancingRules[0].IdleTimeoutInMinutes = '15'
$lb.LoadBalancingRules[0].EnableTcpReset = 'true'
Set-AzLoadBalancer -LoadBalancer $lb
```

# [**Azure CLI**](#tab/tcp-reset-idle-cli)

To set the idle timeout and tcp reset, use the following parameters for [az network lb rule update](/cli/azure/network/lb/rule?az_network_lb_rule_update):

* **--idle-timeout**
* **--enable-tcp-reset**

Validate your environment before you begin:

* Sign in to the Azure portal and check that your subscription is active by running `az login`.
* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
  * If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

Replace the following examples with the values from your resources:

* **myResourceGroup**
* **myLoadBalancer**
* **myLBrule**


```azurecli
az network lb rule update \
    --resource-group myResourceGroup \
    --name myLBrule \
    --lb-name myLoadBalancer \
    --idle-timeout 15 \
    --enable-tcp-reset true
```
---
## Next steps

For more information on tcp idle timeout and reset, see [Load Balancer TCP Reset and Idle Timeout](load-balancer-tcp-reset.md)

For more information on configuring the load balancer distribution mode, see [Configure a load balancer distribution mode](load-balancer-distribution-mode.md).
