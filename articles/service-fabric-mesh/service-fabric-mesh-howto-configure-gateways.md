---
title: Configure a Gateway to route requests 
description: Learn how to configure the gateway that handles incoming traffic for your application(s) running on Service Fabric Mesh.
author: dkkapur

ms.topic: conceptual
ms.date: 11/28/2018
ms.author: dekapur
ms.custom: mvc, devcenter 
---

# Configure a Gateway resource to route requests

A Gateway resource is used to route incoming traffic to the network that houses your application. Configure it to specify rules through which requests are directed to specific services or endpoints based on the structure of the request. See [Introduction to networking in Service Fabric Mesh](service-fabric-mesh-networks-and-gateways.md) for more information on networks and gateways in Mesh. 

Gateway resources need to be declared as part of your deployment template (JSON or yaml), and are dependent on a Network resource. This document outlines the various properties that can be set for your gateway and covers a sample gateway config.

## Options for configuring your Gateway resource

Since the Gateway resource serves as a bridge between your application's network and the underlying infrastructure's network (the `open` network). You should only need to configure one (in the Mesh preview, there is a limit of one gateway per app). The declaration for the resource consists of two main parts: resource metadata and the properties. 

### Gateway resource metadata

A gateway is declared with the following metadata:
* `apiVersion` - needs to be set to "2018-09-01-preview" (or later, in the future)
* `name` - a string name for this gateway
* `type` - "Microsoft.ServiceFabricMesh/gateways"
* `location` - should be set to the location of your app / network; usually will be a reference to the location parameter in your deployment
* `dependsOn` - the network for which this gateway will serve as an ingress point for

Here's how it looks in an Azure Resource Manager (JSON) deployment template: 

```json
{
  "apiVersion": "2018-09-01-preview",
  "name": "myGateway",
  "type": "Microsoft.ServiceFabricMesh/gateways",
  "location": "[parameters('location')]",
  "dependsOn": [
    "Microsoft.ServiceFabricMesh/networks/myNetwork"
  ],
  "properties": {
    [...]
  }
}
```

### Gateway properties

The properties section is used to define  the networks between which the gateway lies, and the rules for routing requests. 

#### Source and destination network 

Each gateway requires a `sourceNetwork` and `destinationNetwork`. The source network is defined as the network from which your app will receive inbound requests. Its name property should always be set to "Open". The destination network is the network that the requests are targeting. The name value for this should be set to the resource name of your app's local network (should include full reference to the resource). See below for a sample config of what this looks like for a deployment in a network called "myNetwork".

```json 
"properties": {
  "description": "Service Fabric Mesh Gateway",
  "sourceNetwork": {
    "name": "Open"
  },
  "destinationNetwork": {
    "name": "[resourceId('Microsoft.ServiceFabricMesh/networks', 'myNetwork')]"
  },
  [...]
}
```

#### Rules 

A gateway can have multiple routing rules that specify how incoming traffic will be handled. A routing rule defines the relationship between the listening port and the destination endpoint for a given application. For TCP routing rules, there is a 1:1 mapping between Port:Endpoint. For HTTP routing rules, you can set more complex routing rules that examine the path of the request, and optionally headers, to decide how the request will be routed. 

Routing rules are specified on a per port basis. Each ingress port has its own array of rules within the properties section of your gateway config. 

#### TCP routing rules 

A TCP routing rule consists of the following properties: 
* `name` - reference to the rule that can be any string of your choice 
* `port` - port to listen on for incoming requests 
* `destination` - endpoint specification that includes `applicationName`, `serviceName`, and `endpointName`, for where the requests need to be routed to

Here is an example TCP routing rule:

```json
"properties": {
  [...]
  "tcp": [
    {
      "name": "web",
      "port": 80,
      "destination": {
        "applicationName": "myApp",
        "serviceName": "myService",
        "endpointName": "myListener"
      }
    }
  ]
}
```


#### HTTP routing rules 

An HTTP routing rule consists of the following properties: 
* `name` - reference to the rule that can be any string of your choice 
* `port` - port to listen on for incoming requests 
* `hosts` - an array of policies that apply to requests coming to the various "hosts" on the port specified above. Hosts are the set of applications and services that may be running in the network and can serve incoming requests, i.e. a web app. Host policies are interpreted in order, so you should create the following in descending levels of specificity
    * `name` - the DNS name of the host for which the following routing rules are specified. Using "*" here would create routing rules for all hosts.
    * `routes` - an array of policies for this specific host
        * `match` - specification of the incoming request structure for this rule to apply, based on a `path`
            * `path` - contains a `value` (incoming URI), `rewrite` (how you want the request to be forwarded), and a `type` (can currently only be "Prefix")
            * `header` - is an optional array of headers values to match in the request's header that if the request matches the path specification (above).
              * each entry contains `name` (string name of the header to match), `value` (string value of the header in the request), and a `type` (can currently only be "Exact")
        * `destination` - if the request matches, it will be routed to this destination, which is specified using an `applicationName`, `serviceName`, and `endpointName`

Here is an example HTTP routing rule that would apply to requests coming on port 80, to all hosts served by apps in this network. If the request URL has a structure that matches the path specification, i.e., `<IPAddress>:80/pickme/<requestContent>`, then it will be directed to the `myListener` endpoint.  

```json
"properties": {
  [...]
  "http": [
    {
      "name": "web",
      "port": 80,
      "hosts": [
        {
          "name": "*",
          "routes": [
            {
              "match": {
                "path": {
                  "value": "/pickme",
                  "rewrite": "/",
                  "type": "Prefix"
                }
              },
              "destination": {
                "applicationName": "meshApp",
                "serviceName": "myService",
                "endpointName": "myListener"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Sample config for a Gateway resource 

Here is what a full Gateway resource config looks like (this is adapted from the ingress sample available in the [Mesh samples repo](https://github.com/Azure-Samples/service-fabric-mesh/blob/2018-09-01-preview/templates/ingress/meshingress.linux.json)):

```json
{
  "apiVersion": "2018-09-01-preview",
  "name": "ingressGatewayLinux",
  "type": "Microsoft.ServiceFabricMesh/gateways",
  "location": "[parameters('location')]",
  "dependsOn": [
    "Microsoft.ServiceFabricMesh/networks/meshNetworkLinux"
  ],
  "properties": {
    "description": "Service Fabric Mesh Gateway for Linux mesh samples.",
    "sourceNetwork": {
      "name": "Open"
    },
    "destinationNetwork": {
      "name": "[resourceId('Microsoft.ServiceFabricMesh/networks', 'meshNetworkLinux')]"
    },
    "http": [
      {
        "name": "web",
        "port": 80,
        "hosts": [
          {
            "name": "*",
            "routes": [
              {
                "match": {
                  "path": {
                    "value": "/hello",
                    "rewrite": "/",
                    "type": "Prefix"
                  }
                },
                "destination": {
                  "applicationName": "meshAppLinux",
                  "serviceName": "helloWorldService",
                  "endpointName": "helloWorldListener"
                }
              },
              {
                "match": {
                  "path": {
                    "value": "/counter",
                    "rewrite": "/",
                    "type": "Prefix"
                  }
                },
                "destination": {
                  "applicationName": "meshAppLinux",
                  "serviceName": "counterService",
                  "endpointName": "counterServiceListener"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

This gateway is configured for a Linux application, "meshAppLinux", that consists of at least two services, "helloWorldService" and "counterService", which listens on port 80. Depending on the URL structure of the incoming request, it will route the request to one of these services. 
* "\<IPAddress>:80/helloWorld/\<request\>" would result in a request being directed to the "helloWorldListener" in the helloWorldService. 
* "\<IPAddress>:80/counter/\<request\>" would result in a request being directed to the "counterListener" in the counterService. 

## Next steps
* Deploy the [Ingress sample](https://github.com/Azure-Samples/service-fabric-mesh/tree/2018-09-01-preview/templates/ingress) to see gateways in action
