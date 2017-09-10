---
title: Create an application gateway using URL routing rules - Azure CLI 2.0 | Microsoft Docs
description: This page provides instructions to create and configure an application gateway using URL routing rules.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/26/2017
ms.author: gwallace

---
# Create an application gateway by using path-based routing with Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-url-route-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-url-route-arm-ps.md)
> * [Azure CLI 2.0](application-gateway-create-url-route-cli.md)

With URL path-based routing, you associate routes based on the URL path of HTTP requests. It checks whether there's a route to a back-end server pool configured for the URL listed in the application gateway, and then it sends the network traffic to the defined pool. A common use for URL path-based routing is to load balance requests for different content types to different back-end server pools.

Application gateways have two rule types: basic and URL path-based rules. The basic rule type provides round-robin service for the back-end pools. Path-based rules, in addition to round-robin distribution, also use the path pattern of the request URL when choosing the appropriate back-end pool.

## Scenario

In the following example, Application Gateway serves traffic for contoso.com with two back-end server pools: a default server pool and an image server pool.

Requests for http://contoso.com/image* are routed to the image server pool (**imagesBackendPool**). If the path pattern doesn't match, a default server pool (**appGatewayBackendPool**) is selected.

![URL route](./media/application-gateway-create-url-route-cli/scenario.png)

## Sign in to Azure

Open the **Azure Command Prompt** and sign in. 

```azurecli
az login -u "username"
```

> [!NOTE]
> You can also use `az login` without the switch for device login that requires entering a code at aka.ms/devicelogin.

After you enter the preceding command, you receive a code. Go to https://aka.ms/devicelogin in a browser to continue the sign-in process.

![Cmd showing device login][1]

In the browser, enter the code you received. This redirects you to a sign-in page.

![Browser to enter code][2]

Enter the code to sign in, and then close the browser to continue.

![Successfully signed in][3]

## Add a path-based rule to an existing application gateway

The following steps show you how to add a path-based rule to an existing application gateway.

### Create a new back-end pool

Configure the application gateway setting **imagesBackendPool** for the load-balanced network traffic in the back-end pool. In this example, you configure different back-end pool settings for the new back-end pool. Each back-end pool can have its own back-end pool setting.  Back-end HTTP settings are used by rules to route traffic to the correct back-end pool members. This determines the protocol and port that's used when sending traffic to the back-end pool members. Cookie-based sessions are also determined by the back-end HTTP settings.  If enabled, cookie-based session affinity sends traffic to the same back end as previous requests for each packet.

```azurecli-interactive
az network application-gateway address-pool create \
--gateway-name AdatumAppGateway \
--name imagesBackendPool  \
--resource-group myresourcegroup \
--servers 10.0.0.6 10.0.0.7
```

### Create a new front-end port

Configure the front-end port for an application gateway. The front-end port configuration object is used by a listener to define what port the application gateway listens for traffic on the listener.

```azurecli-interactive
az network application-gateway frontend-port create --port 82 --gateway-name AdatumAppGateway --resource-group myresourcegroup --name port82
```

### Create a new listener

This step configures the listener for the public IP address and port used to receive incoming network traffic. The following example takes the previously configured front-end IP configuration, front-end port configuration, and a protocol (http or https, which are case sensitive) and configures the listener. In this example, the listener listens to HTTP traffic on port 82 on the public IP address that you created earlier.

```azurecli-interactive
az network application-gateway http-listener create --name imageListener --frontend-ip appGatewayFrontendIP  --frontend-port port82 --resource-group myresourcegroup --gateway-name AdatumAppGateway
```

### Create the URL path map

This step configures the relative path used by the application gateway to define the mapping between the URL path and the back-end pool assigned to handle the incoming traffic.

> [!IMPORTANT]
> Each path must start with "/", and the only place an asterisk is allowed is at the end. Valid examples are /xyz, /xyz* or /xyz/*. The string fed to the path matcher does not include any text after the first "?" or "#", and those characters are not allowed. 

The following example creates one rule for "/images/*" path routing traffic to back-end "imagesBackendPool." This rule ensures that traffic for each set of URLs is routed to the back end. For example, http://adatum.com/images/figure1.jpg goes to "imagesBackendPool." If the path doesn't match any of the pre-defined path rules, the rule path map configuration also configures a default back-end address pool. For example, http://adatum.com/shoppingcart/test.html goes to pool1, because it's defined as the default pool for unmatched traffic.

```azurecli-interactive
az network application-gateway url-path-map create \
--gateway-name AdatumAppGateway \
--name imagespathmap \
--paths /images/* \
--resource-group myresourcegroup2 \
--address-pool imagesBackendPool \
--default-address-pool appGatewayBackendPool \
--default-http-settings appGatewayBackendHttpSettings \
--http-settings appGatewayBackendHttpSettings \
--rule-name images
```

## Next steps

To learn about Secure Sockets Layer (SSL) offload, go to [Configure an application gateway for SSL offload](application-gateway-ssl-cli.md).


[scenario]: ./media/application-gateway-create-url-route-cli/scenario.png
[1]: ./media/application-gateway-create-url-route-cli/figure1.png
[2]: ./media/application-gateway-create-url-route-cli/figure2.png
[3]: ./media/application-gateway-create-url-route-cli/figure3.png
