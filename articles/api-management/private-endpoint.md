---
title: Set up private endpoint with private link
titleSuffix: 
description: Learn how to restrict access to an API Management instance by using an Azure private endpoint.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 11/15/2021

---

# Connect privately to API Management using a private endpoint

Azure Private Link enables customers to access APIM services over a private endpoint in their virtual networks, traffic between virtual network and APIM travels the Microsoft backbone network. No longer need to go through public internet, which improves the security of our customers.

Scenarios:

- Customers can create private link connections to APIM service. Up to 100 supported for now. 

- Customers can use the private endpoint to send inbound traffic on secure connection. 

- Customers can use policy to distinguish traffic that comes from the private link endpoint. 

- Customers can limit incoming only to private endpoints, preventing data exfiltration.

> [!IMPORTANT]
> Private endpoint support in API Management is currently in preview.  

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]
## Limitations

* To use this feature in preview, please contact Azure support to enable your subscription.
* Requires non-VNET-injected  Api Management service
* Only Gateway/Proxy endpoint. [Or is it only Internal VNet that's not supported?]
* Maximum of 100 Private Endpoint Connections per service.
* Currently not supported in the following regions: XXX
* Not supported on self-hosted gateway


## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md). 
- Ensure that the APIM instance is hosted on the stv2 infrastructure. [How?]
- Do not deploy the instance into an [external] or [internal] virtual network.
- A virtual network and subnet in the same region and subscription as your API Management instance. The subnet may contain other Azure resources.     [is this a constraint?]
- Recommended: Deploy a VM in a different network subnet for testing purposes.

From portal UI for private endpoint: "Your private endpoint must be in the  same region as your virtual network, but can be in a different region from the private link resource that you are connecting to. Learn more"

## Steps

1. Created APIM in South Central US. Premium tier

2. Deployed in AZ

1. Create a VNet/subnet in the same region as APIM instance
1

## Disable network policies in subnet

[Disable network policies](../private-link/disable-private-endpoint-network-policy.md) such as network security groups in the subnet for the private endpoint. Update your subnet configuration with [az network vnet subnet update][az-network-vnet-subnet-update]:

```azurecli
az network vnet subnet update \
 --name $SUBNET_NAME \
 --vnet-name $NETWORK_NAME \
 --resource-group $RESOURCE_GROUP \
 --disable-private-endpoint-network-policies
```

## Get available private endpoint types in subscription

Validate the API Management private endpoint type is available in subscription by using [Available Private Endpoint Types - List](/rest/api/virtualnetwork/available-private-endpoint-types) API.

Output should include:

```JSON
[...]

      "name": "Microsoft.ApiManagement.service",
      "id": "/subscriptions/e44f251c-c67e-4760-9ed6-bf99a306ecff/providers/Microsoft.Network/AvailablePrivateEndpointTypes/Microsoft.ApiManagement.service",
      "type": "Microsoft.Network/AvailablePrivateEndpointTypes",
      "resourceName": "Microsoft.ApiManagement/service",
      "displayName": "Microsoft.ApiManagement/service",
      "apiVersion": "2021-04-01-preview"
    }
[...]
```

### Get the available private Link resources for the API Management service

Use APIM Get Private Link Resources API:

```rest
GET ttps://management.azure.com/subscriptions/e44f251c-c67e-4760-9ed6-bf99a306ecff/resourceGroups/danlep1117a/providers/Microsoft.ApiManagement/service/danlep-pe/privateLinkResources?api-version=2021-04-01-preview
```

Output:

```JSON
{
      "id": "/subscriptions/e44f251c-c67e-4760-9ed6-bf99a306ecff/resourceGroups/danlep1117a/providers/Microsoft.ApiManagement/service/danlep-pe/privateLinkResources/Gateway",
      "name": "Gateway",
      "properties": {
        "groupId": "Gateway",
        "requiredMembers": [
          "Gateway"
        ],
        "requiredZoneNames": [
          "privateLink.azure-api.net"
        ]
      },
      "resourceGroup": "danlep1117a",
      "type": "Microsoft.ApiManagement/service/privateLinkResources"
    }
```

## Create private endpoint - portal

Auto-approval flow?
Required RBAC permissions: The operator who is both a Network Admin and Service Admin creates private Endpoint connections using Auto-Approval Flow

:::image type="content" source="media/private-endpoint/create-private-endpoint.png" alt-text="Create a private endpoint in Azure portal":::


## Create private endpoint - manual approval flow

The operator who is a Network Admin but not Service Admin creates private endpoint connections using Manual -approval flow 

[INCOMPLETE EXAMPLE]

```rest
PUT https://management.azure.com/subscriptions/4f5285a3-9fd7-40ad-91b1-d8fc3823983d/resourceGroups/lrptest/providers/Microsoft.Network/privateEndpoints/samir-10272021?api-version=2020-11-01
```

## Get pending private endpoint connections

Use the APIM Get Private Endpoints REST API.

```rest
GET https://management.azure.com/subscriptions/a200340d-6b82-494d-9dbf-687ba6e33f9e/resourceGroups/glebrg/providers/Microsoft.ApiManagement/service/glebegtest/privateEndpointConnections?api-version=2021-08-01
```

or use portal UI to view and approve

## Disable public network access

```rest
PATCH https://management.azure.com/subscriptions/4f5285a3-9fd7-40ad-91b1-d8fc3823983d/resourceGroups/lrptest/providers/Microsoft.ApiManagement/service/apim-privateendpoint-demo?api-version=2021-08-01
Authorization: Bearer {{authToken.response.body.access_token}}
Content-Type: application/json

```
JSON body: [?]

```json
{
  "properties": {
    "publicNetworkAccess": "Disabled"
  }
}

```

## Next steps
> [!div class="nextstepaction"]
> 
