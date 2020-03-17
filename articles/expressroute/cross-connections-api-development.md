---
title: 'Azure ExpressRoute CrossConnnections API development and integration'
description: This article provides a detailed overview for ExpressRoute partners about the expressRouteCrossConnections resource type.
services: expressroute
author: mialdrid

ms.service: expressroute
ms.topic: conceptual
ms.date: 02/06/2020
ms.author: mialdrid

---


# ExpressRoute CrossConnnections API development and integration

The ExpressRoute Partner Resource Manager API allows ExpressRoute partners to manage the layer-2 and layer-3 configuration of customer ExpressRoute circuits. The ExpressRoute Partner Resource Manager API introduces a new resource type, **expressRouteCrossConnections**. Partners use this resource to manage customer ExpressRoute circuits.

## Workflow

The expressRouteCrossConnections resource is a shadow resource to the ExpressRoute circuit. When an Azure customer creates an ExpressRoute circuit and selects a specific ExpressRoute partner, Microsoft creates an expressRouteCrossConnections resource in the partner's Azure ExpressRoute management subscription. In doing so, Microsoft defines a resource group to create the expressRouteCrossConnections resource in. The naming standard for the resource group is **CrossConnection-*PeeringLocation***; where PeeringLocation = the ExpressRoute Location. For example, if a customer creates an ExpressRoute circuit in Denver, the CrossConnection will be created in the partner's Azure subscription in the following resource group: **CrossConnnection-Denver**.

ExpressRoute partners manage layer-2 and layer-3 configuration by issuing REST operations against the expressRouteCrossConnections resource.

## Benefits

Benefits of moving to the expressRouteCrossConnections resource:

* Any future enhancements for ExpressRoute partners will be made available on the ExpressRouteCrossConnection resource.

* Partners can apply [Role-Based Access Control](https://docs.microsoft.com/azure/role-based-access-control/overview) to the expressRouteCrossConnection resource. These controls can define permissions for which users accounts can modify the expressRouteCrossConnection resource and add/update/delete peering configurations.

* The expressRouteCrossConnection resource exposes APIs that can be helpful in troubleshooting ExpressRoute connections. This includes ARP table, BGP Route Table Summary, and BGP Route Table details. This capability is not supported by classic deployment APIs.

* Partners can also look up the advertised communities on Microsoft peering by using the *RouteFilter* resource.

## API development and integration steps

To develop against the Partner API, ExpressRoute partners leverage a test customer and test partner setup. The test customer setup will be used to create ExpressRoute circuits in test peering locations that map to dummy devices and ports. The test partner setup is used to manage the ExpressRoute circuits created in the test peering location.

### 1. Enlist subscriptions

To request the test partner and test customer setup, enlist two Pay-As-You-Go Azure subscriptions to your ExpressRoute engineering contact:
* **ExpressRoute_API_Dev_Provider_Sub:** This subscription will be used to manage ExpressRoute circuits created in test peering locations on dummy devices and ports.

* **ExpressRoute_API_Dev_Customer_Sub:** This subscription will be used to create ExpressRoute circuits in test peering locations that map to dummy devices and ports.

The test peering locations: dummy devices and ports are not exposed to production customers by default. In order to create ExpressRoute circuits that map to the test setup, a subscription feature flag needs to be enabled.

### 2. Register the Dev_Provider subscription to access the expressRouteCrossConnections API

In order to access the expressRouteCrossConnections API, the partner subscription needs to be enrolled in the **Microsoft.Network Resource Provider**. Follow the steps in the [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal) article to complete the registration process.

### 3. Set up authentication for Azure Resource Manager REST API calls

Most Azure services require client code to authenticate with Resource Manager, using valid credentials, prior to calling service APIs. Authentication is coordinated between the various actors by Azure AD and provides the client with an access token as proof of authentication.

The authentication process involves two main steps:

1. [Register the client](https://docs.microsoft.com/rest/api/azure/#register-your-client-application-with-azure-ad).
2. [Create the access request](https://docs.microsoft.com/rest/api/azure/#create-the-request).

### 4. Provide Network Contributor permission to the client application

Once authentication has been successfully configured, you need to grant Network Contributor access to your client application, under the Dev_Provider_Sub. To grant permission, sign in to the [Azure portal](https://ms.portal.azure.com/#home) and complete the following steps:

1. Navigate to Subscriptions and select the Dev_Provider_Sub
2. Navigate to Access Control (IAM)
3. Add Role Assignment
4. Select the Network Contributor Role
5. Assign Access to Azure AD User, Group, or Service Principal
6. Select your client application
7. Save changes

### 5. Develop

Develop against the [expressRouteCrossConnections API](https://docs.microsoft.com/rest/api/expressroute/expressroutecrossconnections).

## REST API

See [ExpressRoute CrossConnections REST API](https://docs.microsoft.com/rest/api/expressroute/expressroutecrossconnections) for REST API documentation.

## Next steps

For more information on all ExpressRoute REST APIs, see [ExpressRoute REST APIs](https://docs.microsoft.com/rest/api/expressroute/).