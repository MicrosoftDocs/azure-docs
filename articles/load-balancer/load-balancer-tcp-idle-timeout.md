---
title: Configure load balancer TCP reset and idle timeout
titleSuffix: Azure Load Balancer
description: In this article, learn how to configure Azure Load Balancer TCP idle timeout and reset.
services: load-balancer
documentationcenter: na
author: asudbring
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/26/2020
ms.author: allensu
---

# Configure TCP reset and idle timeout for Azure Load Balancer

Azure Load Balancer has the following idle timeout range:

4 minutes to 100 minutes for Outbound Rules
4 minutes to 30 minutes for Load Balancer rules and Inbound NAT rules

By default, it's set to 4 minutes. If a period of inactivity is longer than the timeout value, there's no guarantee that the TCP or HTTP session is maintained between the client and your service. 

Learn more about [TCP idle timeout](load-balancer-tcp-reset.md).

The following sections describe how to change idle timeout and tcp reset settings for load balancer resources.

---
# [**Portal**](#tab/tcp-reset-idle-portal)

To set the idle timeout and tcp reset for a load balancer, edit the load-balanced rule. 

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left-hand menu, select **Resource groups**.

3. Select the resource group for your load balancer. In this example, the resource group is named **myResourceGroup**.

4. Select your load balancer. In this example, the load balancer is named **myLoadBalancer**.

5. In **Settings**, select **Load balancing rules**.

     :::image type="content" source="./media/load-balancer-tcp-idle-timeout/portal-lb-rules.png" alt-text="Edit load balancer rules." border="true":::

6. Select your load-balancing rule. In this example, the load-balancing rule is named **myLBrule**.

7. In the load-balancing rule, move the slider in **Idle timeout (minutes)** to your timeout value.  

8. Under **TCP reset**, select **Enabled**.

   :::image type="content" source="./media/load-balancer-tcp-idle-timeout/portal-lb-rules-tcp-reset.png" alt-text="Set idle timeout and tcp reset." border="true":::

9. Select **Save**.

# [**PowerShell**](#tab/tcp-reset-idle-powershell)

To set the idle timeout and tcp reset, use the following parameters for [Set-AzLoadBalancerRuleConfig](/powershell/module/az.network/set-azloadbalancerruleconfig):

* **-IdleTimeoutInMinutes**
* **-EnableTcpReset**

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

Replace the following with the values from your resources:

* **myResourceGroup**
* **myLoadBalancer**
* **myLBrule**
* Port **80** for the backend and frontend port.

> [!IMPORTANT]
> The **Set-AzLoadBalancerRuleConfig** overwrites all settings in the load-balancing rule with the specified parameters. Make note of all of your settings and replace them in the command. In this example **-DisableOutboundSNAT** is set in the rule disabling outbound internet access for the backend pool. </br> For more information about outbound connections with load balancer, see **[Outbound proxy Azure Load Balancer](load-balancer-outbound-connections.md)**. </br> For more information about load balancer outbound rules, see **[Outbound rules Azure Load Balancer](outbound-rules.md)**

```azurepowershell
$lb = Get-AzLoadBalancer -Name "myLoadBalancer" -ResourceGroup "myResourceGroup"
$parameters = @{
    Name = 'myLBrule'
    FrontendIpConfiguration = $lb.FrontendIpConfigurations[0]
    Probe = $lb.Probes[0]
    BackendAddressPool = $lb.BackendAddressPools[0]
    Protocol = 'Tcp'
    FrontendPort ='80'
    BackendPort = '80'
    IdleTimeoutInMinutes = '15'
}
$lb | Set-AzLoadBalancerRuleConfig @parameters -EnableTcpReset -DisableOutboundSNAT
$lb | Set-AzLoadBalancer

```

# [**Azure CLI**](#tab/tcp-reset-idle-cli)

To set the idle timeout and tcp reset, use the following parameters for [az network lb rule update](/cli/azure/network/lb/rule?az_network_lb_rule_update):

* **--idle-timeout**
* **--enable-tcp-reset**

Validate your environment before you begin:

* Sign in to the Azure portal and check that your subscription is active by running `az login`.
* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
  * If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

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

[Internal load balancer overview](load-balancer-internal-overview.md)

[Get started configuring an Internet-facing load balancer](quickstart-load-balancer-standard-public-powershell.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)
