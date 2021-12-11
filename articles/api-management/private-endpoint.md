---
title: Set up private endpoint with private link
titleSuffix: 
description: Learn how to restrict access to an API Management instance by using an Azure private endpoint and Azure Private Link.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 12/10/2021

---

# Connect privately to API Management using a private endpoint

You can configure a [private endpoint](../private-link/private-endpoint-overview.md) for your API Management instance to allow clients located in your private network to securely access the instance over [Azure Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from your Azure VNet address space. Network traffic between a client on your private network and API Management traverses over the VNet and a Private Link on the Microsoft backbone network, eliminating exposure from the public Internet.

With a private endpoint and Private Link, you can:

- Create Private Link connections to an API Management instance. Up to 100 connections are currently supported. 

- Use the private endpoint to send inbound traffic on a secure connection. 

- Use policy to distinguish traffic that comes from the private endpoint. 

- Limit incoming traffic only to private endpoints, preventing data exfiltration.

> [!IMPORTANT]
> * API Management support for private endpoints is currently in private preview.
> * To enable private endpoints, the API Management instance can't already be configured with an external or internal [virtual network](virtual-network-concepts.md).  
> * A private endpoint connection supports only incoming traffic to the API Management instance. 

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Limitations

* To use this feature in preview, please contact [...] to enable your subscription.
* Only the API Management instance's Gateway endpoint currently supports Private Link connections. Connections are not supported on the [self-hosted gateway](self-hosted-gateway-overview.md). 
* Each API Management instance currently supportss at most 100 private endpoint connections.
* Currently not supported in the following regions: [...]

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md). 
    - Ensure that the API Management instance is hosted on the [`stv2` compute platform](compute-infrastructure.md). For example, create a new instance or, if you already have an instance in the Premium service tier, enable [zone redundancy](zone-redundance.md). 
    - Do not deploy the instance into an external or internal virtual network.
- A virtual network and subnet to host the private endpoint. The subnet may contain other Azure resources.
- (Recommended) A virtual machine in the same or a different subnet in the virtual network, to test the private endpoint.

## Steps to configure private endpoint

1. [Disable network policies in subnet](#disable-network-policies-in-subnet)
1. [Get available private endpoint types in subscription](#get-available-private-endpoint-types-in-subscription)
1. [Create private endpoint - portal](#create-private-endpoint--portal)
1. [List private endpoint connections to the instance](#list-private-endpoint-connections-to-the-instance)
1. [Approve pending private endpoint connections](#approve-pending-private-endpoint-connections)
1. [Optionally disable public network access](#optionally-disable-public-network-access)

### Disable network policies in subnet

[Disable network policies](../private-link/disable-private-endpoint-network-policy.md) such as network security groups in the subnet used for the private endpoint. When you use the Azure portal to create a private endpoint, the `PrivateEndpointNetworkPolicies` setting is automatically disabled as part of the create process. 

If you use other tools such as Azure PowerShell, the Azure CLI, or REST API, update the subnet configuration manually. For examples, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md).

### Get available private endpoint types in subscription

Verify that the API Management private endpoint type is available in your subscription and location. In the portal, find this information by going to the **Private Link Center**, and select **Supported resources**.  

You can also find this information by using the [Available Private Endpoint Types - List](/rest/api/virtualnetwork/available-private-endpoint-types) REST API.

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

### Create private endpoint - portal

Use the following steps to create a private endpoint that links to your API Management instance as a private link resource.

Typically a network administrator creates a private endpoint. Depending on your Azure role-based access control (RBAC) permissions, your private endpoint is either *automatically approved* to send traffic to the API Management instance, or requires the resource owner to *manually approve* the connection.


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
    | Resource group | Select an existing resource group, or create a new one. It must be in the same region as your virtual network.|
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

### List private endpoint connections to the instance

To list private endpoint connections to the service instance, use the [Private Endpoint Connection - List By Service](/rest/api/apimanagement/current-ga/private-endpoint-connection/list-by-service) REST API.

```rest
GET ttps://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/privateEndpointConnections?api-version=2021-08-01
```

Output shows properties of each private endpoint connection including the provisioning state.

### Approve pending private endpoint connections

Before a pending private endpoint connection can be used, an owner of the API Management instance must manually approve it.

To approve a private endpoint connection, use the API Management [Private Endpoint Connection - Create Or Update](/rest/api/apimanagement/current-ga/private-endpoint-connection/create-or-update) REST API.

```rest
PATCH https://management.azure.comsubscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}privateEndpointConnections/{privateEndpointConnectionName}?api-version=2021-08-01
```

You can also manage private endpoint connections using the [Azure portal](../private-link/manage-private-endpoint.md).

### Optionally disable public network access

To optionally limit incoming traffic to the API Management instance only to private endpoints, disable public network access. Use the [API Management Service - Create Or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) REST API.

```rest
PATCH https://management.azure.comsubscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}?api-version=2021-08-01
Authorization: Bearer {{authToken.response.body.access_token}}
Content-Type: application/json

```
JSON body:

```json
{
  [...]
  "properties": {
    "publicNetworkAccess": "Disabled"
  }
}
```

## Validate private endpoint connection

After the private endpoint is created, confirm its DNS settings in the portal:

1. In the portal, navigate to the **Private Link Center**.
1. Select **Private endpoints** and select the private endpoint you created.
1. In the left-hand navigation, select **DNS configuration**.
1. Review the DNS records and IP address of the private endpoint. The IP address is a private address in the address space of the subnet where the private endpoint is configured.

### Test in virtual network

Connect to a virtual machine you set up in the virtual network.

Run a utility such as `nslookup` or `dig` to look up the IP address of your default Gateway endpoint over Private Link. For example:

```
nslookup my-apim-service.azure-api.net
```

Output should include the private IP address associated with the private endpoint.

API calls initiated within the virtual network to the default Gateway endpoint should succeed.

### Test from internet

From outside the private endpoint path, attempt to cal the API Management instance's default Gateway endpoint. If public access is disabled, output will include an error with status code `403` and a message similar to:

```
Request originated from client public IP address xxx.xxx.xxx.xxx, public network access on this 'Microsoft.ApiManagement/service/my-apim-service' is disabled.
       
To connect to 'Microsoft.ApiManagement/service/my-apim-service', please use the Private Endpoint from inside your virtual network. 
```

## Next steps

* Learn more about [private endpoints](../private-link/private-endpoint-overview.md) and [Private Link](../private-link/private-link-overview.md).

