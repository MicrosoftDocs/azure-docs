---
title: Configure High Availability Ports for Azure Load Balancer| Microsoft Docs
description: Learn how to use high availability ports for load balancing internal traffic on all ports 
services: load-balancer
documentationcenter: na
author: rdhillon
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/17/2017
ms.author: kumud
---

# How to configure high availability ports for Internal Load Balancer

This article provides an example deployment of high availability (HA) ports on an Internal Load Balancer. For Network Virtual Appliances specific configurations, refer to the corresponding provider websites.

Figure 1 illustrates the following configuration of the deployment example described in this article:
- The NVAs are deployed in the backend pool of an Internal Load Balancer behind the HA ports configuration. 
- The UDR applied on the DMZ Subnet routes all traffic to the <?> by making the next hop as the Internal Load Balancer Virtual IP. 
- Internal Load Balancer distributes the traffic to one of the active NVAs according to the LB algorithm.
- NVA processes the traffic and forwards it to the original destination in the backend subnet.
- The return path can also take the same route if a corresponding UDR is configured in the backend subnet. 

![ha ports example deployment](./media/load-balancer-configure-ha-ports/haports.png)

Figure 1 - Network Virtual Appliances deployed behind an internal Load Balancer with high availability ports 

## Configuring HA Ports

The configuration of the HA ports involves setting up an Internal Load Balancer, with the NVAs in the backend pool, a corresponding load balancer health probe configuration to detect NVA health, and the Load Balancer rule with HA ports. The general Load Balancer related configuration is covered in [Get Started](load-balancer-get-started-ilb-arm-portal.md). This article highlights the HA ports configuration.

The configuration essentially involves setting the frontend port and backend port value to **0**, and the protocol value to **All**. This article describes how to configure high availability ports using Azure portal, PowerShell, and Azure CLI 2.0.

### Configure HA ports load balancer rule with the Azure portal

The Azure portal includes the **HA Ports** option via a checkbox for this configuration. When selected, the related port and protocol configuration is automatically populated. 

![ha ports configuration via Azure portal](./media/load-balancer-configure-ha-ports/haports-portal.png)

Figure 2 - HA Ports configuration via Portal

### Configure HA ports load balancer rule with PowerShell

Use the following command to create the HA Ports Load Balancer rule while creating the Internal Load Balancer with PowerShell:

```powershell
lbrule = New-AzureRmLoadBalancerRuleConfig -Name "HAPortsRule" -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Probe $healthProbe -Protocol "All" -FrontendPort 0 -BackendPort 0
```

### Configure HA ports load balancer rule with Azure CLI 2.0

At Step # 4 of [Creating an internal Load Balancer Set](load-balancer-get-started-ilb-arm-cli.md), use the following command to create the HA ports Load Balancer rule.

```azurecli
azure network lb rule create --resource-group contoso-rg --lb-name contoso-ilb --name haportsrule --protocol all --frontend-port 0 --backend-port 0 --frontend-ip-name feilb --backend-address-pool-name beilb
```

### Configure HA Ports LB Rule via Resource Manager Template

The sample template available in the public repository uses a parameter file containing the default values used to generate the scenario described in this article. To deploy this template using click to deploy, follow [this link](http://<github link for template>), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

For instructions on how to deploy this template via PowerShell or CLI, see [Create an internal load balancer using a template](load-balancer-get-started-ilb-arm-template.md).


## Next steps

- Learn more about [high availability ports](load-balancer-ha-ports-overview.md)
