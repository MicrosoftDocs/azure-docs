---
title: Set up inbound private endpoint for Azure API Management
description: Learn how to restrict inbound access to an Azure API Management instance by using an Azure private endpoint and Azure Private Link.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 12/13/2024
---

# Connect privately to API Management using an inbound private endpoint

[!INCLUDE [premium-dev-standard-standardv2-basic.md](../../includes/api-management-availability-premium-dev-standard-standardv2-basic.md)]

You can configure an inbound [private endpoint](../private-link/private-endpoint-overview.md) for your API Management instance to allow clients in your private network to securely access the instance over [Azure Private Link](../private-link/private-link-overview.md). 

> [!NOTE]
> Private endpoint support in the Standard v2 tier is currently in limited preview. To sign up, fill [this form](https://aka.ms/privateendpointpreview).

* The private endpoint uses an IP address from an Azure virtual network in which it's hosted.

* Network traffic between a client on your private network and API Management traverses over the virtual network and a Private Link on the Microsoft backbone network, eliminating exposure from the public internet.

* Configure custom DNS settings or an Azure DNS private zone to map the API Management hostname to the endpoint's private IP address. 

:::image type="content" source="media/private-endpoint/api-management-private-endpoint.png" alt-text="Diagram that shows a secure inbound connection to API Management using private endpoint.":::

[!INCLUDE [api-management-private-endpoint](../../includes/api-management-private-endpoint.md)]

## Limitations

* Only the API Management instance's Gateway endpoint supports inbound Private Link connections. 
* Each API Management instance supports at most 100 Private Link connections.
* Connections aren't supported on the [self-hosted gateway](self-hosted-gateway-overview.md) or on a [workspace gateway](workspaces-overview.md#workspace-gateway). 
* In the classic API Management tiers, private endpoints aren't supported in instances injected in an internal or external virtual network.


## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md). 
    - When using an instance in the classic Developer or Premium tier, don't deploy (inject) the instance into an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) virtual network.
- A virtual network containing a subnet to host the private endpoint. The subnet may contain other Azure resources.
- (Recommended) A virtual machine in the same or a different subnet in the virtual network, to test the private endpoint.
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

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

When you use the Azure portal to create a private endpoint, as shown in the next section, network policies are disabled automatically as part of the creation process. 

### Create private endpoint - portal

You can create a private endpoint for your API Management instance in the Azure portal.

#### [Classic](#tab/classic)

In the classic API Management tiers, you can create a private endpoint when you create the instance. In an existing instance, use the instance's **Network** blade in the Azure portal.

1. Navigate to your API Management service in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network**.

1. Select **Inbound private endpoint connections** > **+ Add endpoint**.

    :::image type="content" source="media/private-endpoint/add-endpoint-from-instance.png" alt-text="Screenshot showing how to add a private endpoint using the Azure portal.":::

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

1. Select the **Next: Resource** button at the bottom of the screen. The following information about your API Management instance is already populated:
    * Subscription
    * Resource type
    * Resource name
    
1. In **Resource**, in **Target sub-resource**, select **Gateway**.

    :::image type="content" source="media/private-endpoint/create-private-endpoint.png" alt-text="Screenshot showing settings to create a private endpoint in the Azure portal.":::

    > [!IMPORTANT]
    > Only the **Gateway** sub-resource is supported for API Management. Other sub-resources aren't supported.

1. Select the **Next: Virtual Network** button at the bottom of the screen.

1. In **Virtual Network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select your virtual network. |
    | Subnet | Select your subnet. |
    | Private IP configuration | In most cases, select **Dynamically allocate IP address.** |
    | Application security group | Optionally select an [application security group](../virtual-network/application-security-groups.md). |

1. Select the **Next: DNS** button at the bottom of the screen.

1. In **Private DNS integration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Integrate with private DNS zone | Leave the default of **Yes**. |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. |
    | Private DNS zones | The default value is displayed: **(new) privatelink.azure-api.net**.

1. Select the **Next: Tabs** button at the bottom of the screen. If you desire, enter tags to organize your Azure resources.

1. Select the **Next: Review + create** button at the bottom of the screen. Select **Create**.

### List private endpoint connections to the instance

After the private endpoint is created and the service updated, it appears in the list on the API Management instance's **Inbound private endpoint connections** page in the portal.


Note the endpoint's **Connection status**:

* **Approved** indicates that the API Management resource automatically approved the connection. 
* **Pending** indicates that the connection must be manually approved by the resource owner.

### Approve pending private endpoint connections

If a private endpoint connection is in pending status, an owner of the API Management instance must manually approve it before it can be used.

If you have sufficient permissions, approve a private endpoint connection on the API Management instance's **Private endpoint connections** page in the portal. In the connection's context (...) menu, select **Approve**.

You can also use the API Management [Private Endpoint Connection - Create Or Update](/rest/api/apimanagement/private-endpoint-connection/create-or-update) REST API to approve pending private endpoint connections.

#### [Standard v2](#tab/v2)

> [!NOTE]
> * Currently you can't set up a private endpoint when creating a Standard v2 instance or using the instances's **Network** blade in the Azure portal.
> * As shown in this article, you must create and manage private endpoint resources separately from an API Management Standard v2 instance.

1. In the [Azure portal](https://portal.azure.com/), go to the **Private Link Center**.

1. Select **Private endpoints** > **+ Create**.

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

1. Select the **Next: Resource** button at the bottom of the screen. 

1. In **Resource**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Your subscription is selected. |
    | Resource type | Select **Microsoft.ApiManagement/service**. |
    | Resource | Select your API Management Standard v2 instance. |
    | Target sub-resource | Select **Gateway**. |
    
    :::image type="content" source="media/private-endpoint/create-private-endpoint.png" alt-text="Screenshot showing settings to create a private endpoint in the Azure portal.":::

    > [!IMPORTANT]
    > Only the **Gateway** sub-resource is supported for API Management. Other sub-resources aren't supported.

1. Select the **Next: Virtual Network** button at the bottom of the screen.

1. In **Virtual Network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select your virtual network. |
    | Subnet | Select your subnet. |
    | Network policy for private endpoints | Leave the default of **Disabled**. |    
    | Private IP configuration | In most cases, select **Dynamically allocate IP address.** |
    | Application security group | Optionally select an [application security group](../virtual-network/application-security-groups.md). |

1. Select the **Next: DNS** button at the bottom of the screen.

1. In **Private DNS integration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Integrate with private DNS zone | Leave the default of **Yes**. |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. |
    | Private DNS zones | The default value is displayed: **(new) privatelink.azure-api.net**.

1. Select the **Next: Tabs** button at the bottom of the screen. If you desire, enter tags to organize your Azure resources.

1. Select the **Next: Review + create** button at the bottom of the screen. Select **Create**.

### List private endpoint connections

After the private endpoint is created and the service updated, it appears in the list on the **Private endpoints** page in the **Private Link Center**.

Confirm that the endpoint's **Connection status** is **Approved**. 

---

## Optionally disable public network access

To optionally limit incoming traffic to the API Management instance only to private endpoints, disable the public network access property. 

> [!NOTE] 
> Public network access can only be disabled in API Management instances configured with a private endpoint, not with other networking configurations.

To disable the public network access property using the Azure CLI, run the following [az apim update](/cli/azure/apim#az-apim-update) command, substituting the names of your API Management instance and resource group:

```azurecli
az apim update --name my-apim-service --resource-group my-resource-group --public-network-access false
```

You can also use the [API Management Service - Update](/rest/api/apimanagement/api-management-service/update) REST API to disable public network access, by setting the `publicNetworkAccess` property to `Disabled`.

## Validate private endpoint connection

After the private endpoint is created, confirm its DNS settings in the portal:

#### [Classic](#tab/classic)

1. Navigate to your API Management service in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network** > **Inbound private endpoint connections**, and select the private endpoint you created.

1. In the left-hand navigation, under **Settings**, select **DNS configuration**.

1. Review the DNS records and IP address of the private endpoint. The IP address is a private address in the address space of the subnet where the private endpoint is configured.


#### [Standard v2](#tab/v2)

1. In the **Private Link Center**, select **Private endpoints** and then the name of your private endpoint.

1. In the left-hand navigation, under **Settings**, select **DNS configuration**.

1. Review the DNS records and IP address of the private endpoint. The IP address is a private address in the address space of the subnet where the private endpoint is configured.

---

### Test in virtual network

Connect to a virtual machine you set up in the virtual network.

Run a utility such as `nslookup` or `dig` to look up the IP address of your default Gateway endpoint over Private Link. For example:

```
nslookup my-apim-service.privatelink.azure-api.net
```

Output should include the private IP address associated with the private endpoint.

API calls initiated within the virtual network to the default Gateway endpoint should succeed.

### Test from internet

From outside the private endpoint path, attempt to call the API Management instance's default Gateway endpoint. If public access is disabled, output includes an error with status code `403` and a message similar to:

```
Request originated from client public IP address 192.0.2.12, public network access on this 'Microsoft.ApiManagement/service/my-apim-service' is disabled.
       
To connect to 'Microsoft.ApiManagement/service/my-apim-service', please use the Private Endpoint from inside your virtual network. 
```

## Related content

* Use [policy expressions](api-management-policy-expressions.md#ref-context-request) with the `context.request` variable to identify traffic from the private endpoint.
* Learn more about [private endpoints](../private-link/private-endpoint-overview.md) and [Private Link](../private-link/private-link-overview.md), including [Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
* [Manage private endpoint connections](../private-link/manage-private-endpoint.md).
* [Troubleshoot Azure private endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).
* Use a [Resource Manager template](https://azure.microsoft.com/resources/templates/api-management-private-endpoint/) to create a classic API Management instance and a private endpoint with private DNS integration.
* [Connect Azure Front Door Premium to an Azure API Management with Private Link (Preview)](../frontdoor/standard-premium/how-to-enable-private-link-apim.md).
