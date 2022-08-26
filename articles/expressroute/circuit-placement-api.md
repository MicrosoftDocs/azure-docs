---
title: 'Azure ExpressRoute CrossConnnections circuit placement API'
description: This article provides a detailed overview for ExpressRoute partners about the ExpressRoute CrossConnections circuit placement API.
services: expressroute
author: mialdrid
ms.service: expressroute
ms.topic: conceptual
ms.date: 10/19/2021
ms.author: mialdrid
---

# ExpressRoute circuit placement API

The ExpressRoute partner circuit placement API allows ExpressRoute partners to provision circuit connectivity on a specific port pair. Specifically, if an ExpressRoute partner manages multiple port pairs at one peering location, they can use this API to select which port pair will facilitate the ExpressRoute circuit.

This API uses the expressRouteCrossConnection resource type. For more information, see [ExpressRoute CrossConnection API development and integration](cross-connections-api-development.md).

## Register provider subscription to the expressRouteProviderPort resource type
To use the circuit placement API, you first need to enroll your subscription to access the port resource type.

1.  Sign in to Azure and select the subscription you wish to enroll.

    ```azurepowershell-interactive
    Connect-AzAccount 

    Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
    ```

1. Register your subscription.

    ```azurepowershell-interactive
    Register-AzProviderFeature -FeatureName AllowExpressRoutePorts -ProviderNamespace Microsoft.Network
    ```

Once enrolled, verify that **Microsoft.Network** resource provider is registered to your subscription. Registering a resource provider configures your subscription to work with the resource provider.

## Workflow

1. ExpressRoute customers share the service key of the target ExpressRoute circuit.

1. ExpressRoute partner executes a GET using the expressRouteProviderPorts API to identify the **PortPairDescription** of the target port pair. The ExpressRoute partner can query a list of PortPairDescriptions across all port pairs in the subscription, or scope the query for a specific peering location.

1. Once the target PortPairDescription gets identified, the ExpressRoute partner does GET/PUT expressRouteCrossConnection to move the ExpressRoute circuit to the target port pair.

ExpressRoute partners manage layer-2 and layer-3 configuration by issuing REST operations against the expressRouteCrossConnections resource.

## API development and integration steps

### GET using the expressRouteProviderPorts API to list port pairs

The ExpressRoute partner can list all port pairs within the target provider subscription or they can list the port pairs within a specific peering location,

### To get a list of all port pairs for a provider

```rest
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/expressRouteProviderPorts?api-version={api-version}
{
    "parameters": {
      "api-version": "2021-12-01",
      "subscriptionId": "subid"
    },
    "responses": {
        "200": {
          "body": {
            "value": [
              {
                "portPairDescriptor": "bvtazureixpportpair1",
                "id": "/subscriptions/subid/providers/Microsoft.Network/ExpressRouteProviderPort/bvtazureixpportpair1",
                "type": "Microsoft.Network/expressRouteProviderPort",
                "location": "uswest",
                "etag": "W/\"c0e6477e-8150-4d4f-9bf6-bb10e6acb63a\"",
                "properties": {
                    "portPairDescriptor": "bvtazureixpportpair",
                    "primaryAzurePort": "bvtazureixp01a",
                    "secondaryAzurePort": "bvtazureixp01b",
                    "peeringLocation": "SiliconValley",
                    "overprovisionFactor": 4,
                    "portBandwidthInMbps": 4000,
                    "usedBandwidthInMbps": 2500,
                    "remainingBandwidthInMbps": 1500
                }
              },
              {
                "portPairDescriptor": "bvtazureixpportpair2",
                "id": "/subscriptions/subid/providers/Microsoft.Network/ ExpressRouteProviderPort/bvtazureixpportpair2",
                "type": "Microsoft.Network/expressRouteProviderPort",
                "location": "uswest",
                "etag": "W/\"c0e6477e-8150-4d4f-9bf6-bb10e6acb63a\"",
                "properties": {
                    "portPairDescriptor": "bvtazureixpportpair2",
                    "primaryAzurePort": "bvtazureixp02a",
                    "secondaryAzurePort": "bvtazureixp02b",
                    "peeringLocation": "seattle",
                    "overprovisionFactor": 4,
                    "portBandwidthInMbps": 4000,
                    "usedBandwidthInMbps": 1200,
                    "remainingBandwidthInMbps": 1800
                }
              }
            ]
          }
        }
      }
    }
  }
}
```

**Response status code**

* 200 (OK)  The request is success. It will fetch list of ports.
* 4XX (Bad Request)  One of validations failed – for example: Provider subid isn't valid.

### To get a list of all port pairs by location

```rest
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/expressRouteProviderPorts?location={locationName}&api-version={api-version}
{
  "parameters": {
    "api-version": "2021-12-01",
    "locationName": "SiliconValley",
    "subscriptionId": "subid"
  },
  "responses": {
    "200": {
      "body": {
        "value": [
          {
            "portPairDescriptor": "bvtazureixpportpair1",
            "id": "/subscriptions/subid/providers/Microsoft.Network/ ExpressRouteProviderPort /bvtazureixpportpair1",
            "type": "Microsoft.Network/expressRouteProviderPort",
            "location": "uswest",
            "etag": "W/\"c0e6477e-8150-4d4f-9bf6-bb10e6acb63a\"",
            "properties": {
              "portPairDescriptor": "bvtazureixpportpair",
              "primaryAzurePort": "bvtazureixp01a",
              "secondaryAzurePort": "bvtazureixp01b",
              "peeringLocation": "SiliconValley",
              "overprovisionFactor": 4,
              "portBandwidthInMbps": 4000,
              "usedBandwidthInMbps": 2500,
              "remainingBandwidthInMbps": 1500
            }
          }
        ]
      }
    }
  }
}
```

**Response status code**

* 200 (OK) The request is success. It will fetch list of ports.
* 4XX (Bad Request) One of validations failed – for example: Provider subid isn't valid or location isn't valid.

### To get a specific port pair using the port pair descriptor ID.

```rest
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/expressRouteProviderPorts/{portPairDescriptor}?api-version={api-version}

{
  "parameters": {
    "api-version": "2021-12-01",
    "portPairDescriptor": " bvtazureixpportpair1",
    "subscriptionId": "subid"
  },
  "responses": {
    "200": {
      "body": {
        "value": [
          {
            "portPairDescriptor": "bvtazureixpportpair1",
            "id": "/subscriptions/subid/providers/Microsoft.Network/ExpressRouteProviderPort/bvtazureixpportpair1",
            "type": "Microsoft.Network/expressRouteProviderPort",
            "location": "uswest",
            "etag": "W/\"c0e6477e-8150-4d4f-9bf6-bb10e6acb63a\"",
            "properties": {
              "portPairDescriptor": "bvtazureixpportpair",
              "primaryAzurePort": "bvtazureixp01a",
              "secondaryAzurePort": "bvtazureixp01b",
              "peeringLocation": "SiliconValley",
              "overprovisionFactor": 4,
              "portBandwidthInMbps": 4000,
              "usedBandwidthInMbps": 2500,
              "remainingBandwidthInMbps": 15
            }
          }
        ]
      }
    }
  }
}
```

**Status code	description**

* 200 (OK) The request is success. It will fetch port detail.
* 204 The port pair with the mentioned descriptor ID isn't available.
* 4XX (Bad Request) One of validations failed – For example: Provider subid isn't valid.

### Move a target ExpressRoute Circuit to a specific port pair

Once the portPairDescriptor of the target port pair is identified, the ExpressRoute partner can use the [ExpressRouteCrossConnection API](/rest/api/expressroute/express-route-cross-connections/create-or-update) to move the ExpressRoute circuit to a specific port pair.

Currently this API is used by providers to update provisioning state of circuit. This same API will be used by providers to update port pair of the circuit.

Currently the primaryAzurePort and secondaryAzurePort are read-only properties. Now we've disabled the read-only properties for these ports.

```rest
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/expressRouteCrossConnections/{crossConnectionName}?api-version={api-version}
{
"parameters": {
    "api-version": "2021-12-01",
    "crossConnectionName": "The name of the cross connection",
    "subscriptionId": "subid"
  }
},
{
Request   "body": {
    " primaryAzurePort ": " bvtazureixp03a"
     "secondaryAzurePort": "bvtazureixp03b",
  }
}
Response:
{
  "name": "<circuitServiceKey>",
  "id": "/subscriptions/subid/resourceGroups/CrossConnectionSiliconValley/providers/Microsoft.Network/expressRouteCrossConnections/<circuitServiceKey>",
  "type": "Microsoft.Network/expressRouteCrossConnections",
  "location": "brazilsouth",
  "properties": {
    "provisioningState": "Enabled",
    "expressRouteCircuit": {
      "id": "/subscriptions/subid/resourceGroups/ertest/providers/Microsoft.Network/expressRouteCircuits/er1"
    },
    "peerings": [],
    "peeringLocation": "SiliconValley",
    "bandwidthInMbps": 1000,
    "primaryAzurePort": "bvtazureixp03a",
    "secondaryAzurePort": "bvtazureixp03b",
    "sTag": 2,
    "serviceProviderProvisioningState": "NotProvisioned"
  }
}
```

## Next steps

For more information on all ExpressRoute REST APIs, see [ExpressRoute REST APIs](/rest/api/expressroute/).
