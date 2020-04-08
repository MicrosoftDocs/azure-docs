---
title: Configure High Availability Ports for Azure Load Balancer
titleSuffix: Azure Load Balancer
description: Learn how to use High Availability Ports for load balancing internal traffic on all ports 
services: load-balancer
documentationcenter: na
author: rdhillon
manager: narayan
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/21/2018
ms.author: allensu
---

# Configure High Availability Ports for an internal load balancer

This article provides an example deployment of High Availability Ports on an internal load balancer. For more information on configurations specific to network virtual appliances (NVAs), see the corresponding provider websites.

>[!NOTE]
>Azure Load Balancer supports two different types: Basic and Standard. This article discusses Standard Load Balancer. For more information about Basic Load Balancer, see [Load Balancer overview](load-balancer-overview.md).

The illustration shows the following configuration of the deployment example described in this article:

- The NVAs are deployed in the back-end pool of an internal load balancer behind the High Availability Ports configuration. 
- The user-defined route (UDR) applied on the DMZ subnet routes all traffic to the NVAs by making the next hop as the internal load balancer virtual IP. 
- The internal load balancer distributes the traffic to one of the active NVAs according to the load balancer algorithm.
- The NVA processes the traffic and forwards it to the original destination in the back-end subnet.
- The return path can take the same route if a corresponding UDR is configured in the back-end subnet. 

![High Availability Ports example deployment](./media/load-balancer-configure-ha-ports/haports.png)

## Configure High Availability Ports

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To configure High Availability Ports, set up an internal load balancer with the NVAs in the back-end pool. Set up a corresponding load balancer health probe configuration to detect NVA health and the load balancer rule with High Availability Ports. The general load balancer-related configuration is covered in [Get started](load-balancer-get-started-ilb-arm-portal.md). This article highlights the High Availability Ports configuration.

The configuration essentially involves setting the front-end port and the back-end port value to **0**. Set the protocol value to **All**. This article describes how to configure High Availability Ports by using the Azure portal, PowerShell, and Azure CLI.

### Configure a High Availability Ports load balancer rule with the Azure portal

To configure High Availability Ports by using the Azure portal, select the **HA Ports** check box. When selected, the related port and protocol configuration is automatically populated. 

![High Availability Ports configuration via the Azure portal](./media/load-balancer-configure-ha-ports/haports-portal.png)

### Configure a High Availability Ports load-balancing rule via the Resource Manager template

You can configure High Availability Ports by using the 2017-08-01 API version for Microsoft.Network/loadBalancers in the Load Balancer resource. The following JSON snippet illustrates the changes in the load balancer configuration for High Availability Ports via the REST API:

```json
    {
        "apiVersion": "2017-08-01",
        "type": "Microsoft.Network/loadBalancers",
        ...
        "sku":
        {
            "name": "Standard"
        },
        ...
        "properties": {
            "frontendIpConfigurations": [...],
            "backendAddressPools": [...],
            "probes": [...],
            "loadBalancingRules": [
             {
                "properties": {
                    ...
                    "protocol": "All",
                    "frontendPort": 0,
                    "backendPort": 0
                }
             }
            ],
       ...
       }
    }
```

### Configure a High Availability Ports load balancer rule with PowerShell

Use the following command to create the High Availability Ports load balancer rule while you create the internal load balancer with PowerShell:

```powershell
lbrule = New-AzLoadBalancerRuleConfig -Name "HAPortsRule" -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Probe $healthProbe -Protocol "All" -FrontendPort 0 -BackendPort 0
```

### Configure a High Availability Ports load balancer rule with Azure CLI

In step 4 of [Create an internal load balancer set](load-balancer-get-started-ilb-arm-cli.md), use the following command to create the High Availability Ports load balancer rule:

```azurecli
az network lb rule create --resource-group contoso-rg --lb-name contoso-ilb --name haportsrule --protocol all --frontend-port 0 --backend-port 0 --frontend-ip-name feilb --backend-address-pool-name beilb
```

## Next steps

Learn more about [High Availability Ports](load-balancer-ha-ports-overview.md).