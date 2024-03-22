---
title: Set up inbound private endpoint for Azure API Management
description: Learn how to restrict inbound access to an Azure API Management instance by using an Azure private endpoint and Azure Private Link.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 03/20/2023
---

# Connect privately to API Management using an inbound private endpoint

You can configure an inbound [private endpoint](../private-link/private-endpoint-overview.md) for your API Management instance to allow clients in your private network to securely access the instance over [Azure Private Link](../private-link/private-link-overview.md). 

* The private endpoint uses an IP address from an Azure VNet in which it's hosted.

* Network traffic between a client on your private network and API Management traverses over the VNet and a Private Link on the Microsoft backbone network, eliminating exposure from the public internet.

* Configure custom DNS settings or an Azure DNS private zone to map the API Management hostname to the endpoint's private IP address. 

:::image type="content" source="media/private-endpoint/api-management-private-endpoint.png" alt-text="Diagram that shows a secure inbound connection to API Management using private endpoint.":::

[!INCLUDE [api-management-private-endpoint](../../includes/api-management-private-endpoint.md)]


[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Limitations

* Only the API Management instance's Gateway endpoint supports inbound Private Link connections. 
* Each API Management instance supports at most 100 Private Link connections.
* Connections aren't supported on the [self-hosted gateway](self-hosted-gateway-overview.md). 

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md). 
    - The API Management instance must be hosted on the [`stv2` compute platform](compute-infrastructure.md). For example, create a new instance or, if you already have an instance in the Premium service tier, enable [zone redundancy](../reliability/migrate-api-mgt.md). 
    - Do not deploy (inject) the instance into an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) virtual network.
- A virtual network and subnet to host the private endpoint. The subnet may contain other Azure resources.
- (Recommended) A virtual machine in the same or a different subnet in the virtual network, to test the private endpoint.

## Approval method for private endpoint

Typically, a network administrator creates a private endpoint. Depending on your Azure role-based access control (RBAC) permissions, a private endpoint that you create is either *automatically approved* to send traffic to the API Management instance, or requires the resource owner to *manually approve* the connection.


|Approval method     |Minimum RBAC permissions  |
|---------|---------|
|Automatic     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`<br/>`Microsoft.ApiManagement/service/**`<br/>`Microsoft.ApiManagement/service/privateEndpointConnections/**`        |
|Manual     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`           |

## Steps to configure private endpoint

1. [Get available private endpoint types in subscription](#get-available-private-endpoint-types-in-subscription)
1. [Disable network policies in subnet](#disable-network-policies-in-subnet)
1. [Create private endpoint - portal](#create-private-endpoint---portal)
1. [List private endpoint connections to the instance](#list-private-endpoint-connections-to-the-instance)
1. [Approve pending private endpoint connections](#approve-pending-private-endpoint-connections)
1. [Optionally disable public network access](#optionally-disable-public-network-access)

### Get available private endpoint types in subscription

Verify that the API Management private endpoint type is available in your subscription and location. In the portal, find this information by going to the **Private Link Center**. Select **Supported resources**.  

You can also find this information by using the [Available Private Endpoint Types - List](/rest/api/virtualnetwork/available-private-endpoint-types) REST API.

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/locations/{region}/availablePrivateEndpointTypes?api-version=2021-03-01
```

Output should include the `Microsoft.ApiManagement.service` endpoint type:

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

### Disable network policies in subnet

Network policies such as network security groups must be disabled in the subnet used for the private endpoint. 

If you use tools such as Azure PowerShell, the Azure CLI, or REST API to configure private endpoints, update the subnet configuration manually. For examples, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md).

When you use the Azure portal to create a private endpoint, as shown in the next section, network policies are disabled automatically as part of the creation process 

### Create private endpoint - portal

1. Navigate to your API Management service in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, select **Network**.

1. Select **Inbound private endpoint connections** > **+ Add endpoint**.

    :::image type="content" source="media/private-endpoint/add-endpoint-from-instance.png" alt-text="Add a private endpoint using Azure portal":::

1. In the **Basics** tab of **Create a private endpoint**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or create a new one. It must be in the same region as your virtual network.|
    | **Instance details** |  |
    | Name  | Enter a name for the endpoint such as *myPrivateEndpoint*. |
    | Network Interface Name | Enter a name for the network interface, such as *myInterface* |
    | Region | Select a location for the private endpoint. It must be in the same region as your virtual network. It may differ from the region where your API Management instance is hosted. |

1. Select the **Resource** tab or the **Next: Resource** button at the bottom of the page. The following information about your API Management instance is already populated:
    * Subscription
    * Resource group
    * Resource name
    
1. In **Resource**, in **Target sub-resource**, select **Gateway**.

    :::image type="content" source="media/private-endpoint/create-private-endpoint.png" alt-text="Create a private endpoint in Azure portal":::

1. Select the **Virtual Network** tab or the **Next: Virtual Network** button at the bottom of the screen.

1. In **Networking**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select your virtual network. |
    | Subnet | Select your subnet. |
    | Private IP configuration | In most cases, select **Dynamically allocate IP address.** |
    | Application security group | Optionally select an [application security group](../virtual-network/application-security-groups.md). |

1. Select the **DNS** tab or the **Next: DNS** button at the bottom of the screen.

1. In **Private DNS integration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Integrate with private DNS zone | Leave the default of **Yes**. |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. |
    | Private DNS zones | The default value is displayed: **(new) privatelink.azure-api.net**.

1. Select the **Tags** tab or the **Next: Tabs** button at the bottom of the screen. If you desire, enter tags to organize your Azure resources.

1.  Select **Review + create**.

1. Select **Create**.

### List private endpoint connections to the instance

After the private endpoint is created, it appears in the list on the API Management instance's **Inbound private endpoint connections** page in the portal.

You can also use the [Private Endpoint Connection - List By Service](/rest/api/apimanagement/current-ga/private-endpoint-connection/list-by-service) REST API to list private endpoint connections to the service instance.



Note the endpoint's **Connection status**:

* **Approved** indicates that the API Management resource automatically approved the connection. 
* **Pending** indicates that the connection must be manually approved by the resource owner.

### Approve pending private endpoint connections

If a private endpoint connection is in pending status, an owner of the API Management instance must manually approve it before it can be used.

If you have sufficient permissions, approve a private endpoint connection on the API Management instance's **Private endpoint connections** page in the portal. 

You can also use the API Management [Private Endpoint Connection - Create Or Update](/rest/api/apimanagement/current-ga/private-endpoint-connection/create-or-update) REST API.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}privateEndpointConnections/{privateEndpointConnectionName}?api-version=2021-08-01
```

### Optionally disable public network access

To optionally limit incoming traffic to the API Management instance only to private endpoints, disable public network access. Use the [API Management Service - Create Or Update](/rest/api/apimanagement/current-ga/api-management-service/create-or-update) REST API to set the `publicNetworkAccess` property to `Disabled`.

> [!NOTE] 
> The `publicNetworkAccess` property can only be used to disable public access to API Management instances configured with a private endpoint, not with other networking configurations such as VNet injection.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{apimServiceName}?api-version=2021-08-01
Authorization: Bearer {{authToken.response.body.access_token}}
Content-Type: application/json

```
Use the following JSON body:

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

1. Navigate to your API Management service in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, select **Network** > **Inbound private endpoint connections**, and select the private endpoint you created.

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

From outside the private endpoint path, attempt to call the API Management instance's default Gateway endpoint. If public access is disabled, output will include an error with status code `403` and a message similar to:

```
Request originated from client public IP address xxx.xxx.xxx.xxx, public network access on this 'Microsoft.ApiManagement/service/my-apim-service' is disabled.
       
To connect to 'Microsoft.ApiManagement/service/my-apim-service', please use the Private Endpoint from inside your virtual network. 
```

## Next steps

* Use [policy expressions](api-management-policy-expressions.md#ref-context-request) with the `context.request` variable to identify traffic from the private endpoint.
* Learn more about [private endpoints](../private-link/private-endpoint-overview.md) and [Private Link](../private-link/private-link-overview.md), including [Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
* Learn more about [managing private endpoint connections](../private-link/manage-private-endpoint.md).
* [Troubleshoot Azure private endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).
* Use a [Resource Manager template](https://azure.microsoft.com/resources/templates/api-management-private-endpoint/) to create an API Management instance and a private endpoint with private DNS integration.

