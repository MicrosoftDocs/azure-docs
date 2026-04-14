---
title: Deploy Azure API Management Instance to External Virtual Network
description: Learn how to deploy (inject) your Azure API instance to a virtual network in external mode and access API backends through it.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 01/08/2026
ms.author: danlep
---
# Deploy your Azure API Management instance to a virtual network - external mode

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

You can deploy Azure API Management inside an Azure virtual network to access backend services within the network. For virtual network connectivity options, requirements, and considerations, see:

* [Using a virtual network with Azure API Management](virtual-network-concepts.md)
* [Network resource requirements for API Management injection into a virtual network](virtual-network-injection-resources.md)

This article explains how to set up virtual network connectivity for your API Management Developer tier or Premium tier instance in the *external* mode. In this mode, the developer portal, API gateway, and other API Management endpoints are accessible from the public internet, and backend services can be located in the network.

:::image type="content" source="media/api-management-using-with-vnet/api-management-vnet-external.png" alt-text="Diagram showing API Management in an external virtual network.":::

For configurations specific to the *internal* mode, where the endpoints are accessible only within the virtual network, see [Deploy your Azure API Management instance to a virtual network - internal mode](./api-management-using-with-internal-vnet.md).

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [api-management-service-update-behavior](../../includes/api-management-service-update-behavior.md)]

[!INCLUDE [api-management-virtual-network-prerequisites](../../includes/api-management-virtual-network-prerequisites.md)]

## Enable virtual network connection

### Enable virtual network connectivity by using the Azure portal

1. Go to the [Azure portal](https://portal.azure.com) to find your API management instance. Search for and select **API Management services**.
1. Select your API Management instance.
1. In the sidebar menu, under **Deployment + infrastructure**, select **Network**.
1. Select the **External** access type.
    :::image type="content" source="media/api-management-using-with-vnet/api-management-menu-vnet.png" alt-text="Screenshot of network settings in the Azure portal.":::

1. In the list of locations (regions) where your API Management service is provisioned:
    1. Choose a **Location**.
    1. Select **Virtual network**, **Subnet**, and (optionally) **Public IP address**.
    * The virtual network list is populated with virtual networks available in your Azure subscriptions, set up in the region you're configuring.

        :::image type="content" source="media/api-management-using-with-vnet/api-management-using-vnet-select.png" alt-text="Screenshot showing virtual network configuration in the portal.":::

1. Select **Apply**. The **Network** page of your API Management instance is updated with your new virtual network and subnet choices.

1. Select **Verify** to confirm that the prerequisites are met and the API Management service can successfully update.

1. Continue configuring virtual network settings for the remaining locations of your API Management instance.

1. In the top navigation bar, select **Save**.

### Enable connectivity by using a Resource Manager template

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-external-vnet-publicip) (API version 2021-08-01)

     :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-external-vnet-publicip%2Fazuredeploy.json":::

[!INCLUDE [api-management-recommended-nsg-rules](../../includes/api-management-recommended-nsg-rules.md)]

## Connect to a web service hosted within a virtual network

After you connect your API Management service to the virtual network, you can access backend services within the virtual network just as you do public services. When creating or editing an API, type the local IP address or the host name (if a DNS server is configured for the virtual network) of your web service into the **Web service URL** field.

:::image type="content" source="media/api-management-using-with-vnet/api-management-using-vnet-add-api.png" alt-text="Screenshot showing how to add API from virtual network in the portal.":::

## Custom DNS server setup

In external virtual network mode, Azure manages the DNS by default. You can optionally configure a custom DNS server.

The API Management service depends on several Azure services. When API Management is hosted in a virtual network with a custom DNS server, it needs to resolve the hostnames of those Azure services.

* For guidance on custom DNS setup, including forwarding for Azure-provided hostnames, see [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).  
* Outbound network access on port `53` is required for communication with DNS servers. For more settings, see [Virtual network configuration reference](virtual-network-reference.md).

> [!IMPORTANT]
> If you plan to use custom DNS servers for the virtual network, set them up **before** deploying an API Management service into the virtual network. Otherwise, you need to update the API Management service each time you change the DNS servers by running the [Apply Network Configuration Operation](/rest/api/apimanagement/current-ga/api-management-service/apply-network-configuration-updates). You can also apply a network configuration on the **Network/Network status** blade in the Azure portal.

## Routing

* A load-balanced public IP address (VIP) is reserved to provide access to the API Management endpoints and resources outside the virtual network.
  * You can find the public VIP on the **Overview/Essentials** blade in the Azure portal.

For more information and considerations, see [IP addresses of Azure API Management](api-management-howto-ip-addresses.md#ip-addresses-of-api-management-in-a-virtual-network).

[!INCLUDE [api-management-virtual-network-vip-dip](../../includes/api-management-virtual-network-vip-dip.md)]

[!INCLUDE [api-management-virtual-network-forced-tunneling](../../includes/api-management-virtual-network-forced-tunneling.md)]

## <a name="network-configuration-issues"> </a>Common network configuration issues

This section has moved. See [Virtual network configuration reference](virtual-network-reference.md).

[!INCLUDE [api-management-virtual-network-troubleshooting](../../includes/api-management-virtual-network-troubleshooting.md)]

## Related content

Learn more about:

* [Virtual network configuration reference](virtual-network-reference.md)
* [Connecting a virtual network to backend using VPN Gateway](../vpn-gateway/design.md#s2smulti)
* [Connecting a virtual network from different deployment models](../vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md)
* [Debug your APIs using request tracing](api-management-howto-api-inspector.md)
* [Virtual Network frequently asked questions](../virtual-network/virtual-networks-faq.md)
* [Service tags](../virtual-network/network-security-groups-overview.md#service-tags)

[api-management-using-vnet-menu]: ./media/api-management-using-with-vnet/api-management-menu-vnet.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-using-with-vnet/api-management-using-vnet-add-api.png
[api-management-vnet-public]: ./media/api-management-using-with-vnet/api-management-vnet-external.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content

[UDRs]: ../virtual-network/virtual-networks-udr-overview.md
[NetworkSecurityGroups]: ../virtual-network/network-security-groups-overview.md
[ServiceEndpoints]: ../virtual-network/virtual-network-service-endpoints-overview.md
[ServiceTags]: ../virtual-network/network-security-groups-overview.md#service-tags
