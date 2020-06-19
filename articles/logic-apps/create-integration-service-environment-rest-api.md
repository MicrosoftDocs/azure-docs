---
title: Create integration service environments (ISEs) with Logic Apps REST API
description: Create an integration service environment (ISE) by using the Logic Apps REST API so you can access Azure virtual networks (VNETs) from Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: rarayudu, logicappspm
ms.topic: conceptual
ms.date: 05/29/2020
---

# Create an integration service environment (ISE) by using the Logic Apps REST API

This article shows how to create an [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) through the Logic Apps REST API for scenarios where your logic apps and integration accounts need access to an [Azure virtual network](../virtual-network/virtual-networks-overview.md). An ISE is a dedicated environment that uses dedicated storage and other resources that are kept separate from the "global" multi-tenant Logic Apps service. This separation also reduces any impact that other Azure tenants might have on your apps' performance. An ISE also provides you with your own static IP addresses. These IP addresses are separate from the static IP addresses that are shared by the logic apps in the public, multi-tenant service.

You can also create an ISE by using the [sample Azure Resource Manager quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-integration-service-environment) or by using the [Azure portal](../logic-apps/connect-virtual-network-vnet-isolated-environment.md).

> [!IMPORTANT]
> Logic apps, built-in triggers, built-in actions, and connectors that run in 
> your ISE use a pricing plan different from the consumption-based pricing plan. 
> To learn how pricing and billing work for ISEs, see the 
> [Logic Apps pricing model](../logic-apps/logic-apps-pricing.md#fixed-pricing). 
> For pricing rates, see [Logic Apps pricing](../logic-apps/logic-apps-pricing.md).

## Prerequisites

* The same [prerequisites](../logic-apps/connect-virtual-network-vnet-isolated-environment.md#prerequisites) and [requirements to enable access for your ISE](../logic-apps/connect-virtual-network-vnet-isolated-environment.md#enable-access) as when you create an ISE in the Azure portal

* A tool that you can use to create your ISE by calling the Logic Apps REST API with an HTTPS PUT request. For example, you can use [Postman](https://www.getpostman.com/downloads/), or you can build a logic app that performs this task.

## Send the request

To create your ISE by calling the Logic Apps REST API, make this HTTPS PUT request:

`PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/integrationServiceEnvironments/{integrationServiceEnvironmentName}?api-version=2019-05-01`

> [!IMPORTANT]
> The Logic Apps REST API 2019-05-01 version requires that you make your own HTTP PUT request for ISE connectors.

Deployment usually takes within two hours to finish. Occasionally, deployment might take up to four hours. To check deployment status, in the [Azure portal](https://portal.azure.com), on your Azure toolbar, select the notifications icon, which opens the notifications pane.

> [!NOTE]
> If deployment fails or you delete your ISE, Azure might take up to an hour 
> before releasing your subnets. This delay means means you might have to wait 
> before reusing those subnets in another ISE.
>
> If you delete your virtual network, Azure generally takes up to two hours 
> before releasing up your subnets, but this operation might take longer. 
> When deleting virtual networks, make sure that no resources are still connected. 
> See [Delete virtual network](../virtual-network/manage-virtual-network.md#delete-a-virtual-network).

## Request header

In the request header, include these properties:

* `Content-type`: Set this property value to `application/json`.

* `Authorization`: Set this property value to the bearer token for the customer who has access to the Azure subscription or resource group that you want to use.

<a name="request-body"></a>

## Request body

Here is the request body syntax, which describes the properties to use when you create your ISE. To create an ISE that permits using a self-signed certificate that's installed at the `TrustedRoot` location, include the `certificates` object inside the ISE definition's `properties` section. For an existing ISE, you can send a PATCH request for only the `certificates` object. For more information about using self-signed certificates, see also [HTTP connector - Self-signed certificates](../connectors/connectors-native-http.md#self-signed).

```json
{
   "id": "/subscriptions/{Azure-subscription-ID/resourceGroups/{Azure-resource-group}/providers/Microsoft.Logic/integrationServiceEnvironments/{ISE-name}",
   "name": "{ISE-name}",
   "type": "Microsoft.Logic/integrationServiceEnvironments",
   "location": "{Azure-region}",
   "sku": {
      "name": "Premium",
      "capacity": 1
   },
   "properties": {
      "networkConfiguration": {
         "accessEndpoint": {
            // Your ISE can use the "External" or "Internal" endpoint. This example uses "External".
            "type": "External"
         },
         "subnets": [
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-1}",
            },
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-2}",
            },
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-3}",
            },
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-4}",
            }
         ]
      },
      // Include `certificates` object to enable self-signed certificate support
      "certificates": {
         "testCertificate": {
            "publicCertificate": "{base64-encoded-certificate}",
            "kind": "TrustedRoot"
         }
      }
   }
}
```

### Request body example

This example request body shows the sample values:

```json
{
   "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Logic/integrationServiceEnvironments/Fabrikam-ISE",
   "name": "Fabrikam-ISE",
   "type": "Microsoft.Logic/integrationServiceEnvironments",
   "location": "WestUS2",
   "sku": {
      "name": "Premium",
      "capacity": 1
   },
   "properties": {
      "networkConfiguration": {
         "accessEndpoint": {
            // Your ISE can use the "External" or "Internal" endpoint. This example uses "External".
            "type": "External"
         },
         "subnets": [
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-1",
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-2",
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-3",
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-4",
            }
         ]
      },
      "certificates": {
         "testCertificate": {
            "publicCertificate": "LS0tLS1CRUdJTiBDRV...",
            "kind": "TrustedRoot"
         }
   }
}
```

## Next steps

* [Add resources to integration service environments](../logic-apps/add-artifacts-integration-service-environment-ise.md)
* [Manage integration service environments](../logic-apps/ise-manage-integration-service-environment.md#check-network-health)

