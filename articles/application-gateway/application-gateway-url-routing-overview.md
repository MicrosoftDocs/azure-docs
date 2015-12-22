<properties 
   pageTitle="URL based routing overview | Microsoft Azure"
   description="This page provides an overview of the Application Gateway URL based routing"
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="carmonm"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="12/21/2015"
   ms.author="joaoma"/>

# URL based routing 


URL based routing uses the URL path to define which back end server pool Application gateway will send the network traffic. To each URL path is assigned a route and associated to a back end server pool.

This scenario is commonly used to load balance different content types to different back end server pools.

In the following example, Application Gateway is load balancing traffic for contoso.com. Application gateway is configured with two back end server pools: *VideoServerPool* and *ImageServerPool*. 

Two URL routes are created for each back end server pool, *http://contoso.com/video** routes to *VideoServerPool* and *http://contoso.com/image** routes to *ImageServerPool*.

When a client request is made, Application Gateway will query the URL path used and checks if there is a defined route. If query matches one of the assigned routes, it will send traffic to a specific back end pool.

In the case of a client trying to access http://contoso.com/video, the application gateway will match the URL path with a route and send to the back end server pool responsible for the URL path which in this example is *VideoServerPool*.

![figure1](./media/application-gateway-url-routing-overview/figure1.png)


>[AZURE.NOTE]What happens if a route is not defined to a back end pool? Application gateway supports a default back end pool in case of URL path doesn't match any of the routes.
 
## UrlPathMap configuration element

UrlPathMap is a new configuration element for Application Gateway. This configuration element stores an array of URL paths their mappings to a back end server pool. It also configures a default back end server pool in case the client request doesn't match any of the URL path mappings.

	"urlPathMaps": [
    {
        "name": "<urlPathMapName>",
        "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/ urlPathMaps/<urlPathMapName>",
        "properties": {
            "defaultBackendAddressPool": {
                "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/backendAddressPools/<poolName>"
            },
            "defaultBackendHttpSettings": {
                "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/backendHttpSettingsList/<settingsName>"
            },
            "pathRules": [
                {
                    "paths": [
                        <pathPattern>
                    ],
                    "backendAddressPool": {
                        "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/backendAddressPools/<poolName2>"
                    },
                    "backendHttpsettings": {
                        "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/backendHttpsettingsList/<settingsName2>"
                    },
                    
                },
                
            ],
            
        }
    }
],


## Routing rules 

An Application Gateway rule binds the listener and the back end server pool and defines which back end server pool the traffic should be directed to when it hits a particular listener.

There are two rules for application gateway:

-**Basic** - The basic rule is round-robin load distribution. This rule associates a listener to a *HttpBackendSetting* and *BackendAddressPool*.



-**PathBasedRouting**- URL based routing introduces a new rule type which takes a listener and a *UrlPathMap* element.The *UrlPathMap* contains the array for the URL based routes and the mapping to *BackendAddressPool*. 

 An example of **PathBasedRouting** rule:

	"requestRoutingRules": [
      {

        "name": "<ruleName>",
        "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/requestRoutingRules/<ruleName>",
        "properties": {
            "ruleType": "PathBasedRouting",
            "httpListener": {
                "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/httpListeners/<listenerName>"
            },
            "urlPathMap": {
                "id": "/subscriptions/<subscriptionId>/../microsoft.network/applicationGateways/<gatewayName>/ urlPathMaps/<urlPathMapName>"
            },
            
        }
    ]


.


