---
title: Configure load balancer TCP reset and idle timeout in Azure
titleSuffix: Azure Load Balancer
description: In this article, learn how to configure Azure Load Balancer TCP idle timeout.
services: load-balancer
documentationcenter: na
author: asudbring
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/09/2020
ms.author: allensu
---

# Configure TCP idle timeout for Azure Load Balancer

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

Azure Load Balancer has an idle timeout setting of 4 minutes to 120 minutes. By default, it is set to 4 minutes. If a period of inactivity is longer than the timeout value, there's no guarantee that the TCP or HTTP session is maintained between the client and your cloud service. Learn more about [TCP idle timeout](load-balancer-tcp-reset.md).

The following sections describe how to change idle timeout settings for public IP and load balancer resources.


## Configure the TCP idle timeout for your public IP

```azurepowershell-interactive
$publicIP = Get-AzPublicIpAddress -Name MyPublicIP -ResourceGroupName MyResourceGroup
$publicIP.IdleTimeoutInMinutes = "15"
Set-AzPublicIpAddress -PublicIpAddress $publicIP
```

`IdleTimeoutInMinutes` is optional. If it isn't set, the default timeout is 4 minutes. The acceptable timeout range is 4 to 120 minutes.

## Set the TCP idle timeout on rules

To set the idle timeout for a load balancer, the 'IdleTimeoutInMinutes' is set on the load-balanced rule. For example:

```azurepowershell-interactive
$lb = Get-AzLoadBalancer -Name "MyLoadBalancer" -ResourceGroup "MyResourceGroup"
$lb | Set-AzLoadBalancerRuleConfig -Name myLBrule -IdleTimeoutInMinutes 15
```

## Next steps

[Internal load balancer overview](load-balancer-internal-overview.md)

[Get started configuring an Internet-facing load balancer](quickstart-load-balancer-standard-public-powershell.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)
