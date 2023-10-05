---
title: Connect to an internal virtual network using Azure API Management
description: Learn how to set up and configure Azure API Management in a virtual network using internal mode
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 01/03/2022
ms.author: danlep
---

# Connect to a virtual network in internal mode using Azure API Management 
With Azure virtual networks (VNets), Azure API Management can manage internet-inaccessible APIs using several VPN technologies to make the connection. For VNet connectivity options, requirements, and considerations, see [Using a virtual network with Azure API Management](virtual-network-concepts.md).

This article explains how to set up VNet connectivity for your API Management instance in the *internal* mode. In this mode, you can only access the following API Management endpoints within a VNet whose access you control.
* The API gateway
* The developer portal
* Direct management
* Git 

> [!NOTE]
> * None of the API Management endpoints are registered on the public DNS. The endpoints remain inaccessible until you [configure DNS](#dns-configuration) for the VNet.
> * To use the self-hosted gateway in this mode, also enable private connectivity to the self-hosted gateway [configuration endpoint](self-hosted-gateway-overview.md#fqdn-dependencies). Currently, API Management doesn't enable configuring a custom domain name for the v2 endpoint.

Use API Management in internal mode to:

* Make APIs hosted in your private datacenter securely accessible by third parties outside of it by using Azure VPN connections or Azure ExpressRoute.
* Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
* Manage your APIs hosted in multiple geographic locations, using a single gateway endpoint.

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-vnet-internal.png" alt-text="Connect to internal VNet":::

For configurations specific to the *external* mode, where the API Management endpoints are accessible from the public internet, and backend services are located in the network, see [Connect to a virtual network using Azure API Management](api-management-using-with-vnet.md). 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

[!INCLUDE [api-management-virtual-network-prerequisites](../../includes/api-management-virtual-network-prerequisites.md)]

## Enable VNet connection

### Enable VNet connectivity using the Azure portal (`stv2` platform)

1. Go to the [Azure portal](https://portal.azure.com) to find your API management instance. Search for and select **API Management services**.
1. Choose your API Management instance.
1. Select **Network** > **Virtual network**.
1. Select the **Internal** access type.
1. In the list of locations (regions) where your API Management service is provisioned: 
    1. Choose a **Location**.
    1. Select **Virtual network**, **Subnet**, and **IP address**. 
        * The VNet list is populated with Resource Manager VNets available in your Azure subscriptions, set up in the region you are configuring.
1. Select **Apply**. The **Virtual network** page of your API Management instance is updated with your new VNet and subnet choices.
   :::image type="content" source="media/api-management-using-with-internal-vnet/api-management-using-with-internal-vnet.png" alt-text="Set up internal VNet in Azure portal":::
1. Continue configuring VNet settings for the remaining locations of your API Management instance.
1. In the top navigation bar, select **Save**, then select **Apply network configuration**.

    It can take 15 to 45 minutes to update the API Management instance. The Developer tier has downtime during the process. The Basic and higher SKUs don't have downtime during the process.

After successful deployment, you should see your API Management service's **private** virtual IP address and **public** virtual IP address on the **Overview** blade. For more information about the IP addresses, see [Routing](#routing) in this article.

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-internal-vnet-dashboard.png" alt-text="Public and private IP addressed in Azure portal"::: 

> [!NOTE]
> Since the gateway URL is not registered on the public DNS, the test console available on the Azure portal will not work for an **internal** VNet deployed service. Instead, use the test console provided on the **developer portal**.

### Enable connectivity using a Resource Manager template (`stv2` platform)

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-internal-vnet-publicip) (API version 2021-08-01 )

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-internal-vnet-publicip%2Fazuredeploy.json)

### Enable connectivity using Azure PowerShell cmdlets (`stv1` platform)

[Create](/powershell/module/az.apimanagement/new-azapimanagement) or [update](/powershell/module/az.apimanagement/update-azapimanagementregion) an API Management instance in a VNet.

[!INCLUDE [api-management-recommended-nsg-rules](../../includes/api-management-recommended-nsg-rules.md)]

## DNS configuration

In internal VNet mode, you have to manage your own DNS to enable inbound access to your API Management endpoints. 

We recommend:

1. Configure an Azure [DNS private zone](../dns/private-dns-overview.md).
1. Link the Azure DNS private zone to the VNet into which you've deployed your API Management service. 

Learn how to [set up a private zone in Azure DNS](../dns/private-dns-getstarted-portal.md).


> [!NOTE]
> The API Management service does not listen to requests on its IP addresses. It only responds to requests to the host name configured on its endpoints. These endpoints include:
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

    :::image type="content" source="media/api-management-using-with-internal-vnet/api-mTo access these API Management endpoints 

### Configure DNS records

Create records in your DNS server to access the endpoints accessible from within your VNet. Map the endpoint records to the [private virtual IP address](#routing) for your service.

For testing purposes, you might update the hosts file on a virtual machine in a subnet connected to the VNet in which API Management is deployed. Assuming the [private virtual IP address](#routing) for your service is 10.1.0.5, you can map the hosts file as follows. The hosts mapping file is at  `%SystemDrive%\drivers\etc\hosts` (Windows) or `/etc/hosts` (Linux, macOS). 

| Internal virtual IP address | Endpoint configuration |
| ----- | ----- |
| 10.1.0.5 | `contosointernalvnet.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.portal.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.developer.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.management.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.scm.azure-api.net` |

You can then access all the API Management endpoints from the virtual machine you created.

## Routing

The following virtual IP addresses are configured for an API Management instance in an internal virtual network. 

| Virtual IP address | Description |
| ----- | ----- |
| **Private virtual IP address** | A load balanced IP address from within the API Management instance's subnet range (DIP), over which you can access the API gateway, developer portal, management, and Git endpoints.<br/><br/>Register this address with the DNS servers used by the VNet.     |  
| **Public virtual IP address** | Used *only* for control plane traffic to the management endpoint over port 3443. Can be locked down to the [ApiManagement][ServiceTags] service tag. | 

The load-balanced public and private IP addresses can be found on the **Overview** blade in the Azure portal.

For more information and considerations, see [IP addresses of Azure API Management](api-management-howto-ip-addresses.md#ip-addresses-of-api-management-service-in-vnet).

[!INCLUDE [api-management-virtual-network-vip-dip](../../includes/api-management-virtual-network-vip-dip.md)]

#### Example

If you deploy 1 [capacity unit](api-management-capacity.md) of API Management in the Premium tier in an internal VNet, 3 IP addresses will be used: 1 for the private VIP and one each for the DIPs for two VMs. If you scale out to 4 units, more IPs will be consumed for additional DIPs from the subnet.  

If the destination endpoint has allow-listed only a fixed set of DIPs, connection failures will result if you add new units in the future. For this reason and since the subnet is entirely in your control, we recommend allow-listing the entire subnet in the backend.

[!INCLUDE [api-management-virtual-network-forced-tunneling](../../includes/api-management-virtual-network-forced-tunneling.md)]

## <a name="network-configuration-issues"> </a>Common network configuration issues

This section has moved. See [Virtual network configuration reference](virtual-network-reference.md).

[!INCLUDE [api-management-virtual-network-troubleshooting](../../includes/api-management-virtual-network-troubleshooting.md)]


## Next steps

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


