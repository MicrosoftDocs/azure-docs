---
title: Set up inbound private endpoint for Azure API Management
description: Learn how to restrict inbound access to an Azure API Management instance by using an Azure private endpoint and Azure Private Link.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 11/17/2025
ms.custom:
  - build-2025
  - sfi-image-nochange
---

# Connect privately to API Management by using an inbound private endpoint

[!INCLUDE [premium-dev-standard-basic-premiumv2-standardv2.md](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2.md)]

You can configure an inbound [private endpoint](../private-link/private-endpoint-overview.md) for your API Management instance to allow clients in your private network to securely access the instance over [Azure Private Link](../private-link/private-link-overview.md). 

* The private endpoint uses an IP address from an Azure virtual network in which it's hosted.

* Network traffic between a client on your private network and API Management traverses over the virtual network and a Private Link on the Microsoft backbone network, eliminating exposure from the public internet.

* Configure custom DNS settings or an Azure DNS private zone to map the API Management hostname to the endpoint's private IP address. 

:::image type="content" source="media/private-endpoint/api-management-private-endpoint.png" alt-text="Diagram that shows a secure inbound connection to API Management using private endpoint.":::

[!INCLUDE [api-management-private-endpoint](../../includes/api-management-private-endpoint.md)]

## Limitations

* Only the API Management instance's **Gateway endpoint** supports inbound Private Link connections. 
* Each API Management instance supports at most 100 Private Link connections.
* Connections aren't supported on the [self-hosted gateway](self-hosted-gateway-overview.md) or on a [workspace gateway](workspaces-overview.md#workspace-gateway). 
* In the classic API Management tiers, private endpoints aren't supported in instances injected in an internal or external virtual network.

## Typical scenarios

Use an inbound private endpoint to enable private-only access directly to the API Management gateway to limit exposure of sensitive data or backends.

Supported configurations include:

* Pass client requests through a firewall and configure rules to route requests privately to the API Management gateway.
* Configure Azure Front Door (or Azure Front Door with Azure Application Gateway) to receive external traffic and then route traffic privately to the API Management gateway. For example, see [Connect Azure Front Door Premium to an Azure API Management with Private Link](../frontdoor/standard-premium/how-to-enable-private-link-apim.md).

    > [!NOTE]
    > Currently, routing traffic privately from Azure Front Door to an API Management Premium v2 instance isn't supported.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md). 
    - When using an instance in the classic Developer or Premium tier, don't deploy (inject) the instance into an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) virtual network.
- Availability of the API Management private endpoint type in your subscription and region. 
- A virtual network containing a subnet to host the private endpoint. The subnet can contain other Azure resources, but it can't be delegated to another service. 
- (Recommended) A virtual machine in the same or a different subnet in the virtual network, to test the private endpoint.
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Approval method for private endpoint

Typically, a network administrator creates a private endpoint. Depending on your Azure role-based access control (RBAC) permissions, a private endpoint that you create is either *automatically approved* to send traffic to the API Management instance, or requires the resource owner to *manually approve* the connection.


|Approval method     |Minimum RBAC permissions  |
|---------|---------|
|Automatic     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`<br/>`Microsoft.ApiManagement/service/**`<br/>`Microsoft.ApiManagement/service/privateEndpointConnections/**`        |
|Manual     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`           |

## Steps to configure private endpoint

Follow these steps to create and configure a private endpoint for your API Management instance.

### Create private endpoint - portal


#### [Classic](#tab/classic)

In the Classic tiers, you can create a private endpoint when you create an API Management instance in the Azure portal, or you can add a private endpoint to an existing instance.


### Create private endpoint when creating API Management instance

1. In the **Create API Management service wizard**, select the **Networking** tab.

1. In **Connectivity type**, select **Private endpoint**.

1. Select **+ Add**.

1. On the **Create private endpoint** page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or create a new one. It must be in the same region as your virtual network.|
    | Location |  Select a location for the private endpoint. It must be in the same region as your virtual network. It can differ from the region where your API Management instance is hosted.  |
    | Name  | Enter a name for the endpoint such as *myPrivateEndpoint*. |
    | Sub-resource | Select **Gateway**. |

1. Under **Networking**, enter or select the virtual network and subnet for your private endpoint.

1. Under **Private DNS integration**, select **Integrate with private DNS zone**. The default DNS zone is displayed: **privatelink.azure-api.net**.

1. Select **OK**.

1. Continue with the creation of the API Management instance.

### Create private endpoint for existing API Management instance

1. Go to your API Management service in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network**.

1. Select **Inbound private endpoint connections** > **+ Add endpoint**.

    :::image type="content" source="media/private-endpoint/add-endpoint-from-instance.png" alt-text="Screenshot showing how to add a private endpoint using the Azure portal.":::

1. In the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or create a new one. It must be in the same region as your virtual network.|
    | **Instance details** |  |
    | Name  | Enter a name for the endpoint such as *myPrivateEndpoint*. |
    | Network Interface Name | Enter a name for the network interface, such as *myInterface* |
    | Region | Select a location for the private endpoint. It must be in the same region as your virtual network. It can differ from the region where your API Management instance is hosted. |

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

1. Select **Next: Tabs** at the bottom of the screen. If you want, enter tags to organize your Azure resources.

1. Select **Next: Review + create** at the bottom of the screen. Select **Create**.


### List private endpoint connections to the instance

After you create the private endpoint and update the service, the private endpoint appears in the list on the API Management instance's **Inbound private endpoint connections** page in the portal.


Note the endpoint's **Connection state**:

* **Approved** indicates that the API Management resource automatically approved the connection. 
* **Pending** indicates that the connection must be manually approved by the resource owner.

### Approve pending private endpoint connections

If a private endpoint connection is in a pending state, an owner of the API Management instance must manually approve it before it can be used.

If you have sufficient permissions, approve a private endpoint connection on the API Management instance's **Private endpoint connections** page in the portal. In the connection's context (...) menu, select **Approve**.

You can also use the API Management [Private Endpoint Connection - Create Or Update](/rest/api/apimanagement/private-endpoint-connection/create-or-update) REST API to approve pending private endpoint connections.

#### [Standard v2](#tab/v2)

You can create a private endpoint when you create an API Management instance in the Azure portal, or you can add a private endpoint to an existing instance.

### Create private endpoint when creating API Management Standard v2 instance

1. In the **Create API Management service wizard**, select the **Networking** tab.

1. In **Network configuration**, select **Inbound private link and/or outbound virtual network integration**.

1. Next to **Private endpoints**, select **Create new**.

1. On the **Create private endpoint** page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or create a new one. It must be in the same region as your virtual network.|
    | Location |  Select a location for the private endpoint. It must be in the same region as your virtual network. It can differ from the region where your API Management instance is hosted.  |
    | Name  | Enter a name for the endpoint such as *myPrivateEndpoint*. |
    | Sub-resource | Select **Gateway**. |

1. Under **Networking**, enter or select the virtual network and subnet for your private endpoint.

1. Under **Private DNS integration**, select **Integrate with private DNS zone**. The default DNS zone is displayed: **privatelink.azure-api.net**.

1. Select **OK**.

1. Optionally configure settings for [outbound virtual network integration](integrate-vnet-outbound.md).

1. Continue with the creation of the API Management instance.

### Create private endpoint for existing API Management Standard v2 instance

1. In the [Azure portal](https://portal.azure.com/), go to your API Management Standard v2 instance.

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network** > **Edit**.

1. Under **Inbound features**, next to  **Private endpoints**, select **Create new**.

1. On the **Create private endpoint** page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or create a new one. It must be in the same region as your virtual network.|
    | Location |  Select a location for the private endpoint. It must be in the same region as your virtual network. It can differ from the region where your API Management instance is hosted.  |
    | Name  | Enter a name for the endpoint such as *myPrivateEndpoint*. |
    | Sub-resource | Select **Gateway**. |

1. Under **Configure virtual network**, enter or select the virtual network and subnet for your private endpoint.

1. Under **Private DNS integration**, select **Enable**, and select your **Subscription** and **Resource group**. The default DNS zone is displayed: **privatelink.azure-api.net**.

1. Select **Create**. By default, the endpoint's **Connection state** is **Approved**.


### List private endpoint connections

To list private endpoint connections to the API Management instance:

1. In the [Azure portal](https://portal.azure.com/), go to your API Management Standard v2 instance.

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network**.

1. Next to **Private endpoints**, select the link.

1. On the **Private endpoints** page, review the private endpoints to the API Management instance.

1. To change the connection state or delete the endpoint, select an endpoint, then select the context **(...)** menu. Choose the appropriate command on the menu.

#### [Premium v2](#tab/premv2)

 For an API Management Premium v2 instance, currently you must create a [private endpoint](/azure/private-link/create-private-endpoint-portal) resource separately in Private Link services.

### Create private endpoint for existing API Management Premium v2 instance

1. In the [Azure portal](https://portal.azure.com/), go to **Private endpoints**.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a private endpoint**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group, or create a new one. It must be in the same region as your virtual network.|
    | **Instance details** |  |
    | Name  | Enter a name for the endpoint such as *myPrivateEndpoint*. |
    | Network Interface Name | Enter a name for the network interface, such as *myInterface* |
    | Region | Select a location for the private endpoint. It must be in the same region as your virtual network. It can differ from the region where your API Management instance is hosted. |

1. Select the **Next: Resource** button at the bottom of the screen. 

1. In **Resource**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Your subscription is selected. |
    | Resource type | Select **Microsoft.ApiManagement/service**. |
    | Resource | Select your API Management Premium v2 instance. |
    | Target sub-resource | Select **Gateway**. |
    
    :::image type="content" source="media/private-endpoint/create-private-endpoint-private-link-center.png" alt-text="Screenshot showing settings to create a private endpoint in the Azure portal.":::

    > [!IMPORTANT]
    > Only the **Gateway** sub-resource is supported for API Management. Other sub-resources aren't supported.

1. Select the **Next: Virtual Network** button at the bottom of the screen.

1. In **Networking**, enter or select this information:

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

1. Select **Next: Tabs** at the bottom of the screen. If you want, enter tags to organize your Azure resources.

1. Select **Next: Review + create** at the bottom of the screen. Select **Create**.

### List private endpoint connections

After you create the private endpoint and update the service, the private endpoint appears in the list on the **Private endpoints** page.

Make sure the endpoint's **Connection status** is **Approved**. 

---

## Optionally disable public network access

To limit incoming traffic to the API Management instance only to private endpoints, disable the public network access property. 


> [!IMPORTANT]
> * You can disable public network access *after* you configure a private endpoint.
> * You can disable public network access in an *existing* API Management instance, not during the deployment process. 

> [!NOTE] 
> You can disable public network access in API Management instances configured with a private endpoint, not with other networking configurations.

#### [Classic](#tab/classic)

To disable the public network access property in the classic tiers by using the Azure CLI, run the following [az apim update](/cli/azure/apim#az-apim-update) command, substituting the names of your API Management instance and resource group:

```azurecli
az apim update --name my-apim-service --resource-group my-resource-group --public-network-access false
```

You can also use the [API Management Service - Update](/rest/api/apimanagement/api-management-service/update) REST API to disable public network access, by setting the `publicNetworkAccess` property to `Disabled`.

#### [Standard v2](#tab/v2)

Use the portal to disable the public network access property in a Standard v2 instance.

1. In the [Azure portal](https://portal.azure.com/), go to your API Management Standard v2 instance.

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network** > **Edit**.

1. Under **Inbound features**, in the **Public network access** section, select **Disable**.

#### [Premium v2](#tab/premv2)

In the Premium v2 tier, use the [API Management Service - Update](/rest/api/apimanagement/api-management-service/update) REST API to disable public network access, by setting the `publicNetworkAccess` property to `Disabled`.

---

## Validate private endpoint connection

After you create the private endpoint, confirm its DNS settings in the portal.

#### [Classic](#tab/classic)

1. Go to your API Management service in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network** > **Inbound private endpoint connections**, and select the private endpoint you created.

1. In the left-hand navigation, under **Settings**, select **DNS configuration**.

1. Review the DNS records and IP address of the private endpoint. The IP address is a private address in the address space of the subnet where you configured the private endpoint.


#### [Standard v2](#tab/v2)

1. Go to your API Management service in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, under **Deployment + infrastructure**, select **Network** > **Edit**, and select the private endpoint you created.

1. On the **Private endpoint** page, review the endpoint's virtual network and private DNS integration settings.

#### [Premium v2](#tab/premv2)

1. In the [Azure portal](https://portal.azure.com/), go to **Private endpoints**, then select the name of your private endpoint.

1. In the left-hand navigation, under **Settings**, select **DNS configuration**.

1. Review the DNS records and IP address of the private endpoint. The IP address is a private address in the address space of the subnet where you configured the private endpoint.
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

[!INCLUDE [api-management-standard-v2-limitation](../../includes/api-management-standard-v2-limitation.md)]

## Related content

* Use [policy expressions](api-management-policy-expressions.md#ref-context-request) with the `context.request` variable to identify traffic from the private endpoint.
* Learn more about [private endpoints](../private-link/private-endpoint-overview.md) and [Private Link](../private-link/private-link-overview.md), including [Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
* [Manage private endpoint connections](../private-link/manage-private-endpoint.md).
* [Troubleshoot Azure private endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).
* Use a [Resource Manager template](https://azure.microsoft.com/resources/templates/api-management-private-endpoint/) to create a classic API Management instance and a private endpoint.
