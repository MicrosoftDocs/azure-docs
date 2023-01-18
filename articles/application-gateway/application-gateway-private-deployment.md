---
title: Private Application Gateway deployment (preview)
titleSuffix: Azure Application Gateway
description: Learn how to restrict access to Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 01/18/2023
ms.author: greglin
---

# Overview
Historically, Application Gateway v2 SKUs, and to a certain extend v1, has required public IP addressing to enable management of the service.  This has required several limitations in using fine-grain controls in Network Security Groups and Route Tables.  Specifically, the following challenges have been observed:

1) All Application Gateways v2 deployments must contain public facing frontend IP configuration to enable communication to the "Gateway Manager" service tag.
1) Network Security Group associations require rules to allow inbound access from GatewayManager and Outbound access to Internet.
1) When introducing a default route (0.0.0.0/0) to forward traffic anywhere other than the internet, metrics, monitoring, and updates of the gateway result in a failed status.

Application Gateway v2 can now address each of these items to further eliminate risk of data exfilitration and control privacy of communication from within the virtual network. These changes include:

1) Private IP only frontend IP configuration
  1) No public IP resource required
1) Elimination of inbound traffic from GatewayManager service tag via Network Security Group
1) Ability to define a _Deny All_ outbound NSG rule to restrict egress traffic to the Internet
1) Support for manipulation of the default route (0.0.0.0/0) from, but not limited to, VPN, ExpressRoute, Azure Route Server, Azure Virtual WAN, or Route Table rules.
1) Full support for DNS resolution via defined resolvers on the virtual network [Learn more](../virtual-network/manage-virtual-network.md#change-dns-servers)

# Onboard to public preview
The functionality of the new controls of private IP frontend configuration, control over NSG rules, and control over route tables, is currently in public preview.  To join the public preview, you can opt-in to the experience via Azure PowerShell, Azure CLI, or REST API.

When joining the preview, please note that all new gateways will begin to provision with the ability to enable any combination of the features above.  If you wish to offboard from the new functionality / return to the current generall available functionality of Application Gateway, you may do so by unregistering the feature.

## Register to the preview

## Unregister from the preview


## Next steps


