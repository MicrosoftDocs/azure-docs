---
title: Create a path-based rule for an application gateway - Azure portal | Microsoft Docs
description: Learn how to create a path-based rule for an application gateway by using the Azure portal.
services: application-gateway
documentationcenter: na
author: georgewallace
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 87bd93bc-e1a6-45db-a226-555948f1feb7
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/03/2017
ms.author: gwallace

---
# Create a path-based rule for an application gateway by using the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-url-route-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-url-route-arm-ps.md)
> * [Azure CLI 2.0](application-gateway-create-url-route-cli.md)

With URL path-based routing, you associate routes based on the URL path of HTTP requests. It checks whether there's a route to a back-end server pool configured for the URL listed in the application gateway, and then it sends the network traffic to the defined pool. A common use for URL path-based routing is to load balance requests for different content types to different back-end server pools.

Application gateways have two rule types: basic and URL path-based rules. The basic rule type provides round-robin service for the back-end pools. Path-based rules, in addition to round-robin distribution, also use the path pattern of the request URL when choosing the appropriate back-end pool.

## Scenario

The following scenario creates a path-based rule in an existing application gateway.
This scenario assumes that you have already followed the steps in [Create an application gateway with the portal](application-gateway-create-gateway-portal.md).

![URL route][scenario]

## <a name="createrule"></a>Create the path-based rule

A path-based rule requires its own listener. Before you create the rule, be sure to verify that you have an available listener to use.

### Step 1

Go to the [Azure portal](http://portal.azure.com) and select an existing application gateway. Click **Rules**.

![Application Gateway overview][1]

### Step 2

Click the **Path-based** button to add a new path-based rule.

### Step 3

The **Add path-based rule** blade has two sections. The first section is where you defined the listener, the name of the rule, and the default path settings. The default path settings are for routes that don't fall under the custom path-based route. 
The second section of the **Add path-based rule** blade is where you define the path-based rules themselves.

**Basic settings**

* **Name**: A friendly name for the rule that's accessible in the portal.
* **Listener**: The listener that's used for the rule.
* **Default backend pool**: The back end to be used for the default rule.
* **Default HTTP settings**: The HTTP settings to be used for the default rule.

**Path-based rule settings**

* **Name**: A friendly name for the path-based rule.
* **Paths**: The path the rule looks for when forwarding traffic.
* **Backend pool**: The back end to be used for the rule.
* **HTTP setting**: The HTTP settings to be used for the rule.

> [!IMPORTANT]
> The **Paths** setting is the list of path patterns to match. Each pattern must start with a forward slash, and an asterisk is only allowed at the end. Valid examples: /xyz, /xyz*, and /xyz/*.  

![Add path-based rule blade with information filled out][2]

Adding a path-based rule to an existing application gateway is an easy process through the Azure portal. After you create a path-based rule, you can edit it to include additional rules. 

![Add additional path-based rules][3]

This step configures a path-based route. It's important to understand that requests are not rewritten. As requests come in, the application gateway inspects the request and, based on the URL pattern, sends the request to the appropriate back-end pool.

## Next steps

To learn how to configure SSL offloading with Azure Application Gateway, see [Configure an application gateway for SSL offload by using the Azure portal](application-gateway-ssl-portal.md).

[1]: ./media/application-gateway-create-url-route-portal/figure1.png
[2]: ./media/application-gateway-create-url-route-portal/figure2.png
[3]: ./media/application-gateway-create-url-route-portal/figure3.png
[scenario]: ./media/application-gateway-create-url-route-portal/scenario.png
