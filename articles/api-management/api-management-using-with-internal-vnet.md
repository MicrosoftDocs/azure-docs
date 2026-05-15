---
title: Deploy Azure API Management instance to internal VNet
description: Learn how to deploy (inject) your Azure API instance to a virtual network in internal mode and access API backends through it.
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 04/17/2025
ms.author: danlep
ms.custom: sfi-image-nochange
---

# Deploy your Azure API Management instance to a virtual network - internal mode

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

Azure API Management can be deployed (injected) inside an Azure virtual network (VNet) to access backend services within the network. For VNet connectivity options, requirements, and considerations, see:

* [Using a virtual network with Azure API Management](virtual-network-concepts.md)
* [Network resource requirements for API Management injection into a virtual network](virtual-network-injection-resources.md)

This article explains how to set up VNet connectivity for your API Management instance in the *internal* mode. In this mode, you can only access the following API Management endpoints within a VNet whose access you control.
* The API gateway
* The developer portal
* Direct management
* Git 

> [!NOTE]
> * None of the API Management endpoints are registered on the public DNS. The endpoints remain inaccessible until you [configure DNS](#dns-configuration-for-internal-virtual-network-scenarios) for the VNet.
> * To use the self-hosted gateway in this mode, also enable private connectivity to the self-hosted gateway [configuration endpoint](self-hosted-gateway-overview.md#fqdn-dependencies). 

Use API Management in internal mode to:

* Make APIs hosted in your private datacenter securely accessible by third parties outside of it by using Azure VPN connections or Azure ExpressRoute.
* Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
* Manage your APIs hosted in multiple geographic locations, using a single gateway endpoint.

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-vnet-internal.png" alt-text="Connect to internal VNet":::

For configurations specific to the *external* mode, where the API Management endpoints are accessible from the public internet, and backend services are located in the network, see [Deploy your Azure API Management instance to a virtual network - external mode](api-management-using-with-vnet.md). 

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [api-management-service-update-behavior](../../includes/api-management-service-update-behavior.md)]

[!INCLUDE [api-management-virtual-network-prerequisites](../../includes/api-management-virtual-network-prerequisites.md)]

## Enable VNet connection

### Enable VNet connectivity using the Azure portal

1. Go to the [Azure portal](https://portal.azure.com) to find your API management instance. Search for and select **API Management services**.
1. Choose your API Management instance.
1. Select **Network** > **Virtual network**.
1. Select the **Internal** access type.
1. In the list of locations (regions) where your API Management service is provisioned: 
    1. Choose a **Location**.
    1. Select **Virtual network** and **Subnet**.
        * The VNet list is populated with Resource Manager VNets available in your Azure subscriptions, set up in the region you are configuring.
1. Select **Apply**. The **Virtual network** page of your API Management instance is updated with your new VNet and subnet choices.
   :::image type="content" source="media/api-management-using-with-internal-vnet/api-management-using-with-internal-vnet.png" alt-text="Set up internal VNet in Azure portal":::
1. Continue configuring VNet settings for the remaining locations of your API Management instance.
1. In the top navigation bar, select **Save**.

After successful deployment, you should see your API Management service's **private** virtual IP address and **public** virtual IP address on the **Overview** blade. For more information about the IP addresses, see [Routing](#routing) in this article.

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-internal-vnet-dashboard.png" alt-text="Public and private IP addressed in Azure portal"::: 

> [!NOTE]
> Since the gateway URL is not registered on the public DNS, the test console available on the Azure portal will not work for an **internal** VNet deployed service. Instead, use the test console provided on the **developer portal**.

### Enable connectivity using a Resource Manager template

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-internal-vnet-publicip) (API version 2021-08-01 )

     :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-internal-vnet-publicip%2Fazuredeploy.json":::

[!INCLUDE [api-management-recommended-nsg-rules](../../includes/api-management-recommended-nsg-rules.md)]

> [!NOTE]
> The API Management service does not listen to requests on its IP addresses. It only responds to requests to the hostname configured on its endpoints. These endpoints include:
> * API gateway
> * The Azure portal
> * The developer portal
> * Direct management endpoint
> * Git

### Access on default host names
When you create an API Management service (`contosointernalvnet`, for example), the following endpoints are configured by default:

| Endpoint | Endpoint configuration |
| ----- | ----- |
| API Gateway | `contosointernalvnet.azure-api.net` |
| Developer portal | `contosointernalvnet.portal.azure-api.net` |
| The new developer portal | `contosointernalvnet.developer.azure-api.net` |
| Direct management endpoint | `contosointernalvnet.management.azure-api.net` |
| Git | `contosointernalvnet.scm.azure-api.net` |


### Access on custom domain names

If you don't want to access the API Management service with the default host names, set up [custom domain names](configure-custom-domain.md) for all your endpoints, as shown in the following image:

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-custom-domain-name.png" alt-text="Set up custom domain name":::

## DNS configuration for internal Virtual Network scenarios

When API Management is deployed in internal VNet mode, inbound access depends on customer‑managed DNS. The API Management service responds only to requests addressed to its configured host names and does not listen directly on its private IP address.

DNS must be scoped carefully. Improper zone ownership can break resolution for other Azure services.

### Critical DNS design guidance

`azure-api.net` is a publicly owned Azure domain used by multiple Azure and Microsoft services.

Creating a Private DNS zone or authoritative forward lookup zone for the apex domain (`azure-api.net`) is not supported and can introduce unintended resolution failures.

If a Private DNS zone is created for `azure-api.net`:

- The zone becomes authoritative within the customer DNS scope
- Public records published by Azure are no longer resolvable
- Other Azure services that rely on `*.azure-api.net` may fail name resolution
- Customers must implement complex DNS forwarding to public resolvers to avoid breakage

**Forwarding or controlling the apex domain is strongly discouraged.**

### Recommended DNS approach

DNS configuration should be limited to the exact host names required for the API Management instance.

Recommended approaches:

- Create DNS records for the full FQDNs only, pointing directly to the API Management private virtual IP
- If using Azure Private DNS, create a zone scoped to the specific service FQDN, not the apex public domain
- Alternatively, use an existing corporate DNS forward lookup zone and define explicit A records for each endpoint

Examples of valid scoping:

- `contosointernalvnet.azure-api.net`
- `contosointernalvnet.portal.azure-api.net`
- `contosointernalvnet.developer.azure-api.net`
- `contosointernalvnet.management.azure-api.net`
- `contosointernalvnet.scm.azure-api.net`

**Do not create a Private DNS zone or forward lookup zone for `azure-api.net`.**

### DNS records for default host names

For the default API Management host names, create explicit DNS records that map each endpoint FQDN to the service private virtual IP.

Example:

| Private virtual IP | Host name |
| ------------------ | --------- |
| 10.1.0.5 | `contosointernalvnet.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.portal.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.developer.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.management.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.scm.azure-api.net` |

These records must be resolvable from all VNets and on‑premises networks that require access to the API Management service.

### Access on custom domain names

If you don't want to access the API Management service with the default host names, set up [custom domain names](configure-custom-domain.md) for all your endpoints, as shown in the following image:

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-custom-domain-name.png" alt-text="Set up custom domain name":::

### Testing name resolution

For testing purposes, you might update the hosts file on a virtual machine in a subnet connected to the VNet in which API Management is deployed. Assuming the [private virtual IP address](#routing) for your service is 10.1.0.5, you can map the hosts file as follows. The hosts mapping file is at  `%SystemDrive%\drivers\etc\hosts` (Windows) or `/etc/hosts` (Linux, macOS). 

## Routing

The following virtual IP addresses are configured for an API Management instance in an internal virtual network. 

| Virtual IP address | Description |
| ----- | ----- |
| **Private virtual IP address** | A load balanced IP address from within the API Management instance's subnet range (DIP), over which you can access the API gateway, developer portal, management, and Git endpoints.<br/><br/>Register this address with the DNS servers used by the VNet.     |  
| **Public virtual IP address** | Used *only* for control plane traffic to the management endpoint over port 3443. Can be locked down to the [ApiManagement][ServiceTags] service tag. | 

The load-balanced public and private IP addresses can be found on the **Overview** blade in the Azure portal.

For more information and considerations, see [IP addresses of Azure API Management](api-management-howto-ip-addresses.md#ip-addresses-of-api-management-in-a-virtual-network).

[!INCLUDE [api-management-virtual-network-vip-dip](../../includes/api-management-virtual-network-vip-dip.md)]

#### Example

If you deploy 1 [capacity unit](api-management-capacity.md) of API Management in the Premium tier in an internal VNet, 3 IP addresses will be used: 1 for the private VIP and one each for the DIPs for two VMs. If you scale out to 4 units, more IPs will be consumed for additional DIPs from the subnet.  

If the destination endpoint has allow-listed only a fixed set of DIPs, connection failures will result if you add new units in the future. For this reason and since the subnet is entirely in your control, we recommend allow-listing the entire subnet in the backend.

[!INCLUDE [api-management-virtual-network-forced-tunneling](../../includes/api-management-virtual-network-forced-tunneling.md)]

## <a name="network-configuration-issues"> </a>Common network configuration issues

This section has moved. See [Virtual network configuration reference](virtual-network-reference.md).

[!INCLUDE [api-management-virtual-network-troubleshooting](../../includes/api-management-virtual-network-troubleshooting.md)]


## Related content

Learn more about:

* [Virtual network configuration reference](virtual-network-reference.md)
* [VNet FAQs](../virtual-network/virtual-networks-faq.md)
* [Creating a record in DNS](/previous-versions/windows/it-pro/windows-2000-server/bb727018(v=technet.10))

[api-management-using-internal-vnet-menu]: ./media/api-management-using-with-internal-vnet/updated-api-management-using-with-internal-vnet.png

[api-management-internal-vnet-dashboard]: ./media/api-management-using-with-internal-vnet/updated-api-management-internal-vnet-dashboard.png

[api-management-custom-domain-name]: ./media/api-management-using-with-internal-vnet/updated-api-management-custom-domain-name.png

[Create API Management service]: get-started-create-service-instance.md

[Common network configuration problems]: virtual-network-reference.md

[ServiceTags]: ../virtual-network/network-security-groups-overview.md#service-tags


