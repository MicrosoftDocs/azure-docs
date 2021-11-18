---
title: Set up private endpoint with private link
titleSuffix: 
description: Learn how to restrict access to an API Management instance by using an Azure private endpoint and Azure Private Link.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 11/18/2021

---

# Connect privately to API Management using a private endpoint

You can configure a [private endpoint](../private-link/private-endpoint-overview.md) for your API Management instance to allow clients located in your private network to securely access the instance over [Azure Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from your Azure VNet address space. Network traffic between a client on your private network and API Management traverses over the VNet and a Private Link on the Microsoft backbone network, eliminating exposure from the public Internet.

With a private endpoint and zprivate Link:

- Customers can create Private Link connections to an API Management instance. Up to 100 connections are currently supported. 

- Customers can use the private endpoint to send inbound traffic on a secure connection. 

- Customers can use policy to distinguish traffic that comes from the private endpoint. 

- Customers can limit incoming traffic only to private endpoints, preventing data exfiltration.

> [!IMPORTANT]
> API Management support for private endpoints is currently in preview.  

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Limitations

* To use this feature in preview, please contact Azure support to enable your subscription.
* The API Management instance must not already be configured with an external or internal [virtual network](virtual-network-overview.md). [Or is it only Internal VNet that's not supported?]
* Only the API Management instance's Gateway endpoint currently supports Private Link connections. Connections are not support on the [self-hosted gateway](self-hosted-gateway-overview.md). 
* Each API Management instance currently support at most 100 private endpoint connections.
* Currently not supported in the following regions: XXX

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md). 
    - Ensure that the API Management instance is hosted on the stv2 infrastructure. [How?]
    - Do not deploy the instance into an external or internal virtual network.
- A virtual network and subnet in the same region and subscription as your API Management instance, to host the private endpoint. The subnet may contain other Azure resources.     [is this  a constraint?]
- (Recommended) Deploy a virtual machine in a different network subnet for testing purposes.

[From portal UI for private endpoint: "Your private endpoint must be in the  same region as your virtual network, but can be in a different region from the private link resource that you are connecting to. Learn more"]

## Steps

1. Created APIM in South Central US. Premium tier

2. Deployed in AZ

1. Create a VNet/subnet in the same region as APIM instance
1

## Disable network policies in subnet

[Disable network policies](../private-link/disable-private-endpoint-network-policy.md) such as network security groups in the subnet used for the private endpoint. When you use the Azure portal to create a private endpoint, the `PrivateEndpointNetworkPolicies` setting is automatically disabled as part of the create process. 

If you use other tools such as Azure Azure PowerShell or the Azure CLI, update the subnet configuration manually. For examples, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md).

## Get available private endpoint types in subscription

Verify that the API Management private endpoint type is available in your subscription by using [Available Private Endpoint Types - List](/rest/api/virtualnetwork/available-private-endpoint-types) API.

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/locations/{region}/availablePrivateEndpointTypes?api-version=2021-03-01
```

Output should include the `Microsoft.ApiManagement.service` endpoint type:
az
```JSON
[...]

      "name": "Microsoft.ApiManagement.service",
      "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Network/AvailablePrivateEndpointTypes/Microsoft.ApiManagement.service",
      "type": "Microsoft.Network/AvailablePrivateEndpointTypes",
      "resourceName": "Microsoft.ApiManagement/service",
      "displayName": "Microsoft.ApiManagement/service",
      "apiVersion": "2021-04-01-preview"
    }
[...]
```

[This section probably not required]
### Get the available private Link resources for the API Management service

Use APIM Get Private Link Resources API:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}/privateLinkResources?api-version=2021-04-01-preview
```

Output:

```JSON
{
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}/privateLinkResources/Gateway",
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

Use the following steps to create a private endpoint that links to your API Management instance as a private link resource.

Depending on your Azure role-based access control (RBAC) permissions, your private endpoint is either automatically approved to send traffic to the API Management instance, or requires the resource owner to approve the connection.


|Approval method     |Minimum RBAC permissions  |
|---------|---------|
|Automatic     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`<br/>`Microsoft.ApiManagement/service/**`<br/>`Microsoft.ApiManagement/service/privateEndpointConnections/**`        |
|Manual     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`           |

1. On the upper-left side of the screen in the portal, select **Create a resource** > **Networking** > **Private Link**, or in the search box enter **Private Link**.

1. Select **Create**.

1. In **Private Link Center**, select **Private endpoints** in the left-hand menu.

1. In **Private endpoints**, select **+ Add**.

1. In the **Basics** tab of **Create a private endpoint**, enter, or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or create a new one.|
    | **Instance details** |  |
    | Name  | Enter a name such as **myPrivateEndpoint**. |
    | Region | Select a location for the private endpoint. It must be in the same region as your virtual network. |

1. Select the **Resource** tab or the **Next: Resource** button at the bottom of the page.
    
1. In **Resource**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory**. |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.ApiManagement/service**. |
    | Resource | Select your API Management service instance.  |
    | Target sub-resource | Select **Gateway**. |

    :::image type="content" source="media/private-endpoint/create-private-endpoint.png" alt-text="Create a private endpoint in Azure portal":::

1. Select the **Configuration** tab or the **Next: Configuration** button at the bottom of the screen.

1. In **Configuration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select your virtual network. |
    | Subnet | Select your subnet. |
    | **Private DNS integration** |  |
    | Integrate with private DNS zone | Leave the default of **Yes**. |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. |
    | Private DNS zones | Leave the default of **(new) privatelink.azure-api.net**.
    

1. Select **Review + create**.

1. Select **Create**.

After the private endpoint is created, note the endpoint's **Connection status**.

:::image type="content" source="media/private-endpoint/private-endpoint-connection.png" alt-text="Private endpoint connection status":::


* **Approved** indicates that the API Management resource automatically approved the connection. 
* **Pending** indicates that the connection must be manually approved by the resource owner.


## Get pending private endpoint connections

An owner of the API Management instance must manually approve a pending private endpoint connection.

To view pending connections, use the APIM Get Private Endpoints REST API.

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}privateEndpointConnections?api-version=2021-08-01
```

To approve a private endpoint connection, use the APIM Create Private Endpoints REST API.

```rest
PATCH https://management.azure.comsubscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}privateEndpointConnections/samirPe9connection?api-version=2021-08-01
```

You can also manage private endpoint connections using the [Azure portal](../private-link/manage-private-endpoin.md).

## Disable public network access

```rest
PATCH https://management.azure.comsubscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}?api-version=2021-08-01
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
