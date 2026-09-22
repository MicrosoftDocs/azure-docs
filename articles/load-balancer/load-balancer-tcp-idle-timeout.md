---
title: Configure load balancer TCP reset and idle timeout
titleSuffix: Azure Load Balancer
description: In this article, learn how to configure Azure Load Balancer TCP idle timeout and reset.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 08/05/2026
ai-usage: ai-assisted
ms.author: mbender
ms.custom:
  - template-how-to
  - sfi-image-nochange
# Customer intent: "As a network administrator, I want to configure TCP reset and idle timeout settings for my load balancer, so that I can ensure proper session management and maintain connections for longer periods of inactivity."
---

# Configure TCP reset and idle timeout for Azure Load Balancer

Standard Load Balancer supports an idle timeout range of 4 minutes to 100 minutes for load-balancing rules and inbound NAT rules. [Outbound rules](./outbound-rules.md#idletimeout) support an idle timeout range of 4 minutes to 120 minutes. The default setting is 4 minutes for all rule types. If a period of inactivity exceeds the timeout value, the TCP or HTTP session between the client and your service isn't guaranteed to be maintained.

> [!NOTE]
> The procedures in this article configure a Standard Load Balancer. Basic Load Balancer (retired) supported an idle timeout of up to 60 minutes and doesn't support TCP reset configuration.

The following sections describe how to change idle timeout and TCP reset settings for load balancer resources.

## Set TCP reset and idle timeout
---
# [**Portal**](#tab/tcp-reset-idle-portal)

To set the idle timeout and TCP reset for a load balancer, edit the load-balanced rule.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left-hand menu, select **Resource groups**.
1. Select the resource group for your load balancer. In this example, the resource group is named **myResourceGroup**.
1. Select your load balancer. In this example, the load balancer is named **myLoadBalancer**.
1. In **Settings**, select **Load balancing rules**.
1. Select your load-balancing rule. In this example, the load-balancing rule is named **myLBrule**.
1. In the load-balancing rule, input your timeout value into **Idle timeout (minutes)**.  
1. Under **TCP reset**, select **Enabled**.
1. Select **Save**.
1. Reopen **myLBrule** and confirm that **Idle timeout (minutes)** shows your value and **TCP reset** shows **Enabled**.

# [**PowerShell**](#tab/tcp-reset-idle-powershell)

To set the idle timeout and TCP reset, set values in the following load-balancing rule parameters with [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer):

* **IdleTimeoutInMinutes**
* **EnableTcpReset**

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

Replace the following examples with the values from your resources:

* **myResourceGroup**
* **myLoadBalancer**
* **myLBrule**

Select the rule by name so that you update the intended rule rather than whichever rule happens to be first in the collection.

```azurepowershell
$lb = Get-AzLoadBalancer -Name "myLoadBalancer" -ResourceGroup "myResourceGroup"
$rule = $lb.LoadBalancingRules | Where-Object { $_.Name -eq "myLBrule" }
$rule.IdleTimeoutInMinutes = '15'
$rule.EnableTcpReset = $true
Set-AzLoadBalancer -LoadBalancer $lb
```

Confirm the saved values on the intended rule:

```azurepowershell
$Rule |  Select-Object Name, IdleTimeoutInMinutes, EnableTcpReset
```

# [**Azure CLI**](#tab/tcp-reset-idle-cli)

To set the idle timeout and TCP reset, use the following parameters for [az network lb rule update](/cli/azure/network/lb/rule?az_network_lb_rule_update):

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

Confirm the saved values on the intended rule:

```azurecli
az network lb rule show \
    --resource-group myResourceGroup \
    --name myLBrule \
    --lb-name myLoadBalancer \
    --query "{name:name, idleTimeoutInMinutes:idleTimeoutInMinutes, enableTcpReset:enableTcpReset}"
```
---
## Next steps

For more information on TCP idle timeout and reset, see [Load Balancer TCP Reset and Idle Timeout](load-balancer-tcp-reset.md).

For more information on configuring the load balancer distribution mode, see [Configure a load balancer distribution mode](load-balancer-distribution-mode.md).
