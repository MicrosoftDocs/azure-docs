---
title: Azure Application Gateway URL-based content routing overview
description: This page provides an overview of the Azure Application Gateway URL-based content routing, UrlPathMap configuration and PathBasedRouting rule .
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.date: 1/8/2019
ms.author: victorh
ms.topic: conceptual
---
# URL Path Based Routing overview

URL Path Based Routing allows you to route traffic to back-end server pools based on URL Paths of the request. 

One of the scenarios is to route requests for different content types to different backend server pools.

In the following example, Application Gateway is serving traffic for contoso.com from three back-end server pools for example: VideoServerPool, ImageServerPool, and DefaultServerPool.

![imageURLroute](./media/application-gateway-url-route-overview/figure1.png)

Requests for http\://contoso.com/video/* are routed to VideoServerPool, and http\://contoso.com/images/* are routed to ImageServerPool. DefaultServerPool is selected if none of the path patterns match.

> [!IMPORTANT]
> Rules are processed in the order they are listed in the portal. It is highly recommended to configure multi-site listeners first prior to configuring a basic listener.  This ensures that traffic gets routed to the right back end. If a basic listener is listed first and matches an incoming request, it gets processed by that listener.

## UrlPathMap configuration element

The urlPathMap element is used to specify Path patterns to back-end server pool mappings. The following code example is the snippet of urlPathMap element from template file.

```json
"urlPathMaps": [{
    "name": "{urlpathMapName}",
    "id": "/subscriptions/{subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/urlPathMaps/{urlpathMapName}",
    "properties": {
        "defaultBackendAddressPool": {
            "id": "/subscriptions/    {subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/backendAddressPools/{poolName1}"
        },
        "defaultBackendHttpSettings": {
            "id": "/subscriptions/{subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/backendHttpSettingsList/{settingname1}"
        },
        "pathRules": [{
            "name": "{pathRuleName}",
            "properties": {
                "paths": [
                    "{pathPattern}"
                ],
                "backendAddressPool": {
                    "id": "/subscriptions/{subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/backendAddressPools/{poolName2}"
                },
                "backendHttpsettings": {
                    "id": "/subscriptions/{subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/backendHttpsettingsList/{settingName2}"
                }
            }
        }]
    }
}]
```

### PathPattern

PathPattern is a list of path patterns to match. Each must start with / and the only place a "*" is allowed is at the end following a "/." The string fed to the path matcher does not include any text after the first ? or #, and those chars are not allowed here. Otherwise, any characters allowed in a URL are allowed in PathPattern.

The supported patterns depend on whether you deploy Application Gateway v1 or v2:

#### v1

Path rules are case insensitive.

|v1 path pattern  |Is supported?  |
|---------|---------|
|`/images/*`     |yes|
|`/images*`     |no|
|`/images/*.jpg`     |no|
|`/*.jpg`     |no|
|`/Repos/*/Comments/*`     |no|
|`/CurrentUser/Comments/*`     |yes|

#### v2

Path rules are case sensitive.

|v2 path pattern  |Is supported?  |
|---------|---------|
|`/images/*`     |yes|
|`/images*`     |yes|
|`/images/*.jpg`     |no|
|`/*.jpg`     |no|
|`/Repos/*/Comments/*`     |no|
|`/CurrentUser/Comments/*`     |yes|

You can check out a [Resource Manager template using URL-based routing](https://azure.microsoft.com/documentation/templates/201-application-gateway-url-path-based-routing) for more information.

## PathBasedRouting rule

RequestRoutingRule of type PathBasedRouting is used to bind a listener to a urlPathMap. All requests that are received for this listener are routed based on policy specified in urlPathMap.
Snippet of PathBasedRouting rule:

```json
"requestRoutingRules": [
    {

"name": "{ruleName}",
"id": "/subscriptions/{subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/requestRoutingRules/{ruleName}",
"properties": {
    "ruleType": "PathBasedRouting",
    "httpListener": {
        "id": "/subscriptions/{subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/httpListeners/<listenerName>"
    },
    "urlPathMap": {
        "id": "/subscriptions/{subscriptionId}/../microsoft.network/applicationGateways/{gatewayName}/ urlPathMaps/{urlpathMapName}"
    },

}
    }
]
```

## Next steps

After learning about URL-based content routing, go to [create an application gateway using URL-based routing](application-gateway-create-url-route-portal.md) to create an application gateway with URL routing rules.
