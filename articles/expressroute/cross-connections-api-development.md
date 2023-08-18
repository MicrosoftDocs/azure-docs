---
title: 'Azure ExpressRoute CrossConnnections API development and integration'
description: This article provides a detailed overview for ExpressRoute partners about the expressRouteCrossConnections resource type.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: conceptual
ms.date: 02/06/2020
ms.author: duau

---


# ExpressRoute CrossConnnections API development and integration

The ExpressRoute Partner Resource Manager API allows ExpressRoute partners to manage the layer-2 and layer-3 configuration of customer ExpressRoute circuits. The ExpressRoute Partner Resource Manager API introduces a new resource type, **expressRouteCrossConnections**. Partners use this resource to manage customer ExpressRoute circuits.

## Workflow

The expressRouteCrossConnections resource is a shadow resource to the ExpressRoute circuit. When an Azure customer creates an ExpressRoute circuit and selects a specific ExpressRoute partner, Microsoft creates an expressRouteCrossConnections resource in the partner's Azure ExpressRoute management subscription. In doing so, Microsoft defines a resource group to create the expressRouteCrossConnections resource in. The naming standard for the resource group is **CrossConnection-*PeeringLocation***; where PeeringLocation = the ExpressRoute Location. For example, if a customer creates an ExpressRoute circuit in Denver, the CrossConnection will be created in the partner's Azure subscription in the following resource group: **CrossConnnection-Denver**.

ExpressRoute partners manage layer-2 and layer-3 configuration by issuing REST operations against the expressRouteCrossConnections resource.

## Benefits

Benefits of moving to the expressRouteCrossConnections resource:

* Any future enhancements for ExpressRoute partners will be made available on the ExpressRouteCrossConnection resource.

* Partners can apply [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) to the expressRouteCrossConnection resource. These controls can define permissions for which users accounts can modify the expressRouteCrossConnection resource and add/update/delete peering configurations.

* The expressRouteCrossConnection resource exposes APIs that can be helpful in troubleshooting ExpressRoute connections. This includes ARP table, BGP Route Table Summary, and BGP Route Table details. This capability is not supported by classic deployment APIs.

* Partners can also look up the advertised communities on Microsoft peering by using the *RouteFilter* resource.

## API development and integration steps

To develop against the Partner API, ExpressRoute partners leverage a test customer and test partner setup. The test customer setup will be used to create ExpressRoute circuits in test peering locations that map to dummy devices and ports. The test partner setup is used to manage the ExpressRoute circuits created in the test peering location.

### 1. Enlist subscriptions

To request the test partner and test customer setup, enlist two Pay-As-You-Go Azure subscriptions to your ExpressRoute engineering contact:
* **ExpressRoute_API_Provider_Sub:** This subscription will be used to manage production ExpressRoute circuits created in peering locations.

* **ExpressRoute_API_Dev_Provider_Sub:** This subscription will be used to manage ExpressRoute circuits created in test peering locations on dummy devices and ports.

* **ExpressRoute_API_Dev_Customer_Sub:** This subscription will be used to create ExpressRoute circuits in test peering locations that map to dummy devices and ports.

The test peering locations: dummy devices and ports are not exposed to production customers by default. In order to create ExpressRoute circuits that map to the test setup, a subscription feature flag needs to be enabled.

### 2. Register the Dev_Provider subscription to access the expressRouteCrossConnections API

In order to access the expressRouteCrossConnections API, the partner subscription needs to be enrolled in the **Microsoft.Network Resource Provider**. Follow the steps in the [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal) article to complete the registration process.

### 3. Set up authentication for Azure Resource Manager REST API calls

Most Azure services require client code to authenticate with Resource Manager, using valid credentials, prior to calling service APIs. Authentication is coordinated between the various actors by Azure AD and provides the client with an access token as proof of authentication.

The authentication process involves two main steps:

1. [Register the client](/rest/api/azure/#register-your-client-application-with-azure-ad).
2. [Create the access request](/rest/api/azure/#create-the-request).

### 4. Provide Network Contributor permission to the client application

Once authentication has been successfully configured, you need to grant Network Contributor access to your client application, under the Dev_Provider_Sub. To grant permission, sign in to the [Azure portal](https://portal.azure.com/#home) and complete the following steps:

1. Navigate to Subscriptions and select the Dev_Provider_Sub
2. Navigate to Access Control (IAM)
3. Add Role Assignment
4. Select the Network Contributor Role
5. Assign Access to Azure AD User, Group, or Service Principal
6. Select your client application
7. Save changes

### 5. Develop

Develop against the [expressRouteCrossConnections API](/rest/api/expressroute/expressroutecrossconnections).

#### Connectivity Management Workflow
Once you receive the ExpressRoute service key from the target customer, follow the below workflow and sample API operations to configure ExpressRoute connectivity:
1. **List expressRouteCrossConnection:** In order to manage ExpressRoute connectivity, you need to identify the *Name* and *ResourceGroup* of the target expressRouteCrossConnection resource. The *Name* of the expressRouteCrossConnection is the target service key of the customer's ExpressRoute circuit. In order to find the *ResourceGroupName*, you need to LIST all expressRouteCrossConnections in the provider subscription and search the results for the target service key. From here, you can record the *ResourceGroupName* and form the GET expressRouteCrossConnection API call.

  ```
  GET /subscriptions/<ProviderManagementSubscription>/providers/Microsoft.Network/expressRouteCrossConnections?api-version=2018-02-01 HTTP/1.1
  Host: management.azure.com
  Authorization: Bearer eyJ0eXAiOiJKV...
  User-Agent: ARMClient/1.2.0.0
  Accept: application/json
  x-ms-request-id: f484de7d-6c19-412f-a5eb-e5c9dd247d3c


  ---------- Response (601 ms) ------------

  HTTP/1.1 200 OK
  Pragma: no-cache
  x-ms-request-id: 620ec7bf-4fd1-446f-96e9-97fbae16722f
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Cache-Control: no-cache
  Server: Microsoft-HTTPAPI/2.0; Microsoft-HTTPAPI/2.0
  x-ms-ratelimit-remaining-subscription-reads: 14999
  x-ms-correlation-request-id: 6e484d0b-2f2e-4cef-9e18-87a9b7441bc4
  x-ms-routing-request-id: WESTUS:20180501T192531Z:6e484d0b-2f2e-4cef-9e18-87a9b7441bc4
  X-Content-Type-Options: nosniff
  Date: Tue, 01 May 2018 19:25:31 GMT

  {
    "value": [
      {
        "name": "24e6ea2b-6940-4bec-b0b3-3a9e5471e512",
        "id": "/subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/24e6ea2b-6940-4bec-b0b3-3a9e5471e512",
        "etag": "W/\"19fa7ada-5189-4817-a9d6-499b02e379cc\"",
        "type": "Microsoft.Network/expressRouteCrossConnections",
        "location": "eastus2euap",
        "properties": {
          "provisioningState": "Succeeded",
          "expressRouteCircuit": {
            "id": "/subscriptions/<TargetCustomerSubscription>/resourceGroups/Karthikcrossconnectiontest/providers/Microsoft.Network/expressRouteCircuits/TestCircuit2"
          },
          "peeringLocation": "EUAP Test",
          "bandwidthInMbps": 200,
          "serviceProviderProvisioningState": "Provisioned",
          "peerings": []
        }
      },
      {
        "name": "9ee700ad-50b2-4b98-a63a-4e52f855ac24",
        "id": "/subscriptions/8030cec9-2c0c-4361-9949-1655c6e4b0fa/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/<ProviderManagementSubscription>",
        "etag": "W/\"f07a267f-4a5c-4538-83e5-de1fcb183801\"",
        "type": "Microsoft.Network/expressRouteCrossConnections",
        "location": "eastus2euap",
        "properties": {
          "provisioningState": "Succeeded",
          "expressRouteCircuit": {
            "id": "/subscriptions/<ProviderManagementSubscription>/resourceGroups/Karthikcrossconnectiontest/providers/Microsoft.Network/expressRouteCircuits/TestCircuitXYZ"
          },
          "peeringLocation": "EUAP Test",
          "bandwidthInMbps": 200,
          "serviceProviderProvisioningState": "NotProvisioned",
          "peerings": []
        }
      }
    ]
  }
  ```

2. **GET expressRouteCrossConnection:** Once you have identified both the *Name* and *ResourceGroupName* of the target expressRouteCrossConnection resource, you need to perform the GET expressRouteCrossConnection API call.

  ```
  GET /subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24?api-version=2018-02-01 HTTP/1.1
  Host: management.azure.com
  Authorization: Bearer eyJ0eXAiOiJKV...
  User-Agent: ARMClient/1.2.0.0
  Accept: application/json
  x-ms-request-id: d17924c4-f977-4c82-b933-d66c5fa334dd


  ---------- Response (3317 ms) ------------

  HTTP/1.1 200 OK
  Pragma: no-cache
  x-ms-request-id: 41621c90-2e59-4220-9a32-3b29b1198bf5
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Cache-Control: no-cache
  Server: Microsoft-HTTPAPI/2.0; Microsoft-HTTPAPI/2.0
  x-ms-ratelimit-remaining-subscription-reads: 14999
  x-ms-correlation-request-id: 85e08ce4-5a8f-4fe4-a434-e3fddef250d4
  x-ms-routing-request-id: WESTUS:20180501T193230Z:85e08ce4-5a8f-4fe4-a434-e3fddef250d4
  X-Content-Type-Options: nosniff
  Date: Tue, 01 May 2018 19:32:29 GMT

  {
    "name": "9ee700ad-50b2-4b98-a63a-4e52f855ac24",
    "id": "/subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24",
    "etag": "W/\"f07a267f-4a5c-4538-83e5-de1fcb183801\"",
    "type": "Microsoft.Network/expressRouteCrossConnections",
    "location": "eastus2euap",
    "properties": {
      "provisioningState": "Succeeded",
      "expressRouteCircuit": {
        "id": "/subscriptions/<TargetCustomerSubscription>/resourceGroups/Karthikcrossconnectiontest/providers/Microsoft.Network/expressRouteCircuits/TestCircuitXYZ"
      },
      "peeringLocation": "EUAP Test",
      "bandwidthInMbps": 200,
      "serviceProviderProvisioningState": "NotProvisioned",
      "primaryAzurePort": "EUAP-ARMTEST-06GMR-CIS-1-PRI-A",
      "secondaryAzurePort": "EUAP-ARMTEST-06GMR-CIS-2-SEC-A",
      "sTag": 3,
      "peerings": []
    }
  }
  ```
3. **PUT expressRouteCrossConnection:** Once you provision layer-2 connectivity, update the *ServiceProviderProvisioningState* to **Provisioned**. At this point, the customer can configure Microsoft or Private Peering and create a connection from the ExpressRoute circuit to a virtual network gateway deployed in the customer's subscription.

  ```
  PUT /subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24?api-version=2018-02-01 HTTP/1.1
  Host: management.azure.com
  Authorization: Bearer eyJ0eXAiOiJKV...
  User-Agent: ARMClient/1.2.0.0
  Accept: application/json
  x-ms-request-id: d867c3c9-2acf-4c54-a0f0-d7ca50fc7b9b

  {
    "properties": {
      "serviceProviderProvisioningState": "Provisioned",
      "peeringLocation": "EUAP Test",
      "expressRouteCircuit": {
        "id": "/subscriptions/<ProviderManagementSubscription>/resourceGroups/Karthikcrossconnectiontest/providers/Microsoft.Network/expressRouteCircuits/TestCircuitXYZ"
      },
      "bandwidthInMbps": 200
    },
    "location": "East US 2 EUAP"
  }
  ---------- Response (1740 ms) ------------

  HTTP/1.1 200 OK
  Pragma: no-cache
  Retry-After: 10
  x-ms-request-id: 0a8d458b-8fe3-44e6-89c9-1b156b946693
  Azure-AsyncOperation: https://management.azure.com/subscriptions/8030cec9-2c0c-4361-9949-1655c6e4b0fa/providers/Microsoft.Network/locations/eastus2euap/operations/0a8d458b-8fe3-44e6-89c9-1b156b946693?api-version=2018-02-01
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Cache-Control: no-cache
  Server: Microsoft-HTTPAPI/2.0; Microsoft-HTTPAPI/2.0
  x-ms-ratelimit-remaining-subscription-writes: 1199
  x-ms-correlation-request-id: d2d38c28-0dbe-4b40-8824-c74968c46b50
  x-ms-routing-request-id: WESTUS:20180501T222105Z:d2d38c28-0dbe-4b40-8824-c74968c46b50
  X-Content-Type-Options: nosniff
  Date: Tue, 01 May 2018 22:21:04 GMT

  {
    "name": "9ee700ad-50b2-4b98-a63a-4e52f855ac24",
    "id": "/subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24",
    "etag": "W/\"ecdcb1a4-873b-4dad-ae56-a4b17795a84a\"",
    "type": "Microsoft.Network/expressRouteCrossConnections",
    "location": "eastus2euap",
    "properties": {
      "provisioningState": "Updating",
      "expressRouteCircuit": {
        "id": "/subscriptions/<TargetCustomerSubscription>/resourceGroups/Karthikcrossconnectiontest/providers/Microsoft.Network/expressRouteCircuits/TestCircuitXYZ"
      },
      "peeringLocation": "EUAP Test",
      "bandwidthInMbps": 200,
      "serviceProviderProvisioningState": "Provisioned",
      "primaryAzurePort": "",
      "secondaryAzurePort": "",
      "sTag": 0,
      "peerings": []
    }
  }

  C:\Users\kaanan\Documents\Expressroute\Partner APIs\ARMClient-master\ARMClient-master>armclient get https://management.azure.com/subscriptions/<ProviderManagementSubscription>/providers/Microsoft.Network/locations/eastus2euap/operations/0a8d458b-8fe3-44e6-89c9-1b156b946693?api-version=2018-02-01
  {
    "status": "Succeeded"
  }
  ```

4. **(Optional) PUT expressRouteCrossConnection to configure Private Peering** If you manage layer-3 BGP connectivity, you can enable Private Peering

  ```
  PUT /subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24/peerings/AzurePrivatePeering?api-version=2018-02-01 HTTP/1.1
  Host: management.azure.com
  Authorization: Bearer eyJ0eXAiOiJKV...
  User-Agent: ARMClient/1.2.0.0
  Accept: application/json
  x-ms-request-id: 9c1413a5-6d27-4e87-b075-1fedb15d63a3

  {
    "properties": {
      "peeringType": "AzurePrivatePeering",
      "peerASN": 500,
      "primaryPeerAddressPrefix": "10.0.0.0/30",
      "secondaryPeerAddressPrefix": "10.0.0.4/30",
      "sharedKey": "A1B2C3D4",
      "vlanId": 200
    },
    "name": "AzurePrivatePeering"
  }
  ---------- Response (2354 ms) ------------

  HTTP/1.1 201 Created
  Pragma: no-cache
  Retry-After: 10
  x-ms-request-id: 344eccc8-2958-4958-aa6f-3958f3fd5648
  Azure-AsyncOperation: https://management.azure.com/subscriptions/<ProviderManagementSubscription>/providers/Microsoft.Network/locations/eastus2euap/operations/344eccc8-2958-4958-aa6f-3958f3fd5648?api-version=2018-02-01
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Cache-Control: no-cache
  Server: Microsoft-HTTPAPI/2.0; Microsoft-HTTPAPI/2.0
  x-ms-ratelimit-remaining-subscription-writes: 1199
  x-ms-correlation-request-id: b5d08e36-339c-423a-ac2c-b6ec2063c8a6
  x-ms-routing-request-id: WESTUS:20180501T194026Z:b5d08e36-339c-423a-ac2c-b6ec2063c8a6
  X-Content-Type-Options: nosniff
  Date: Tue, 01 May 2018 19:40:26 GMT

  {
    "name": "AzurePrivatePeering",
    "id": "/subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24/peerings/AzurePrivatePeering",
    "properties": {
      "provisioningState": "Updating",
      "peeringType": "AzurePrivatePeering",
      "azureASN": 0,
      "peerASN": 500,
      "primaryPeerAddressPrefix": "10.0.0.0/30",
      "secondaryPeerAddressPrefix": "10.0.0.4/30",
      "sharedKey": "A1B2C3D4",
      "state": "Disabled",
      "vlanId": 200,
      "lastModifiedBy": ""
    }
  }

  C:\Users\kaanan\Documents\Expressroute\Partner APIs\ARMClient-master\ARMClient-master>armclient get https://management.azure.com/subscriptions/<ProviderManagementSubscription>/providers/Microsoft.Network/locations/eastus2euap/operations/344eccc8-2958-4958-aa6f-3958f3fd5648?api-version=2018-02-01
  {
    "status": "Succeeded"
  }
  ```

  5. **(Optional) PUT expressRouteCrossConnection to configure Microsoft Peering** If you manage layer-3 BGP connectivity, you can enable Microsoft Peering

  ```
  PUT /subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24/peerings/MicrosoftPeering?api-version=2018-02-01 HTTP/1.1
  Host: management.azure.com
  Authorization: Bearer eyJ0eXAiOiJKV...
  User-Agent: ARMClient/1.2.0.0
  Accept: application/json
  x-ms-request-id: af4527eb-7b68-4a50-b953-c0606524d8f3

  {
    "properties": {
      "peeringType": "MicrosoftPeering",
      "peerASN": 900,
      "primaryPeerAddressPrefix": "123.0.0.0/30",
      "secondaryPeerAddressPrefix": "123.0.0.4/30",
      "vlanId": 300,
      "microsoftPeeringConfig": {
        "advertisedPublicPrefixes": [
          "123.1.0.0/24"
        ],
        "customerASN": 45,
        "routingRegistryName": "ARIN"
      }
    },
    "name": "MicrosoftPeering"
  }
  ---------- Response (2530 ms) ------------

  HTTP/1.1 201 Created
  Pragma: no-cache
  Retry-After: 10
  x-ms-request-id: e3aa0bbd-4709-4092-a1f1-aa78080929d0
  Azure-AsyncOperation: https://management.azure.com/subscriptions/8030cec9-2c0c-4361-9949-1655c6e4b0fa/providers/Microsoft.Network/locations/eastus2euap/operations/e3aa0bbd-4709-4092-a1f1-aa78080929d0?api-version=2018-02-01
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Cache-Control: no-cache
  Server: Microsoft-HTTPAPI/2.0; Microsoft-HTTPAPI/2.0
  x-ms-ratelimit-remaining-subscription-writes: 1199
  x-ms-correlation-request-id: 8e26bc5d-f1cd-4305-a373-860aaf7bb694
  x-ms-routing-request-id: WESTUS:20180501T213857Z:8e26bc5d-f1cd-4305-a373-860aaf7bb694
  X-Content-Type-Options: nosniff
  Date: Tue, 01 May 2018 21:38:56 GMT

  {
    "name": "MicrosoftPeering",
    "id": "/subscriptions/<ProviderManagementSubscription>/resourceGroups/CrossConnection-EUAPTest/providers/Microsoft.Network/expressRouteCrossConnections/9ee700ad-50b2-4b98-a63a-4e52f855ac24/peerings/MicrosoftPeering",
    "properties": {
      "provisioningState": "Updating",
      "peeringType": "MicrosoftPeering",
      "azureASN": 0,
      "peerASN": 900,
      "primaryPeerAddressPrefix": "123.0.0.0/30",
      "secondaryPeerAddressPrefix": "123.0.0.4/30",
      "state": "Disabled",
      "vlanId": 300,
      "lastModifiedBy": "",
      "microsoftPeeringConfig": {
        "advertisedPublicPrefixes": [
          "123.1.0.0/24"
        ],
        "advertisedPublicPrefixesState": "NotConfigured",
        "customerASN": 45,
        "legacyMode": 0,
        "routingRegistryName": "ARIN"
      }
    }
  }

  C:\Users\kaanan\Documents\Expressroute\Partner APIs\ARMClient-master\ARMClient-master>armclient get https://management.azure.com/subscriptions/<ProviderManagementSubscription>/providers/Microsoft.Network/locations/eastus2euap/operations/e3aa0bbd-4709-4092-a1f1-aa78080929d0?api-version=2018-02-01
  {
    "status": "Succeeded"
  }
  ```
## REST API

See [ExpressRoute CrossConnections REST API](/rest/api/expressroute/expressroutecrossconnections) for REST API documentation.

## Next steps

For more information on all ExpressRoute REST APIs, see [ExpressRoute REST APIs](/rest/api/expressroute/).
