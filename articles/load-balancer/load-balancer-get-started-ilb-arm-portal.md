---
title: Create an Internal Load Balancer - Azure portal
titleSuffix: Azure Load Balancer
description: Learn how to create an internal load balancer using the Azure portal
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.devlang: na
ms.topic: how-to
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: allensu
---

# Configure High Availability Ports for an internal load balancer

This article provides an example deployment of High Availability Ports on an internal load balancer. For more information on configurations specific to network virtual appliances (NVAs), see the corresponding provider websites.


## Configure High Availability Ports

To configure High Availability Ports, set up an internal load balancer with the NVAs in the back-end pool. Set up a corresponding load balancer health probe configuration to detect NVA health and the load balancer rule with High Availability Ports. The general load balancer-related configuration is covered in [Get started](load-balancer-get-started-ilb-arm-portal.md). This article highlights the High Availability Ports configuration.

The configuration essentially involves setting the front-end port and the back-end port value to **0**. Set the protocol value to **All**. This article describes how to configure High Availability Ports by using the Azure portal, PowerShell, and Azure CLI.

### Configure a High Availability Ports load balancer rule with the Azure portal

To configure High Availability Ports by using the Azure portal, select the **HA Ports** check box. When selected, the related port and protocol configuration is automatically populated. 

![High Availability Ports configuration via the Azure portal](./media/load-balancer-configure-ha-ports/haports-portal.png)



## Next steps

Learn more about [High Availability Ports](load-balancer-ha-ports-overview.md).