---
title: Connect to a virtual network using Azure API Management
description: Learn how to set up a connection to a virtual network in Azure API Management and access web services through it.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 12/15/2021
ms.author: danlep
ms.custom: references_regions, devx-track-azurepowershell
---
# Connect to a virtual network using Azure API Management

Azure API Management can be deployed inside an Azure virtual network (VNET) to access backend services within the network. For VNET connectivity options, requirements, and considerations, see [Using a virtual network with Azure API Management](virtual-network-concepts.md).

This article explains how to set up VNET connectivity for your API Management instance in the *external* mode, where the developer portal, API gateway, and other API Management endpoints are accessible from the public internet, and backend services are located in the network. For configurations specific to the *internal* mode, where the endpoints are accessible only within the VNET, see [Connect to an internal virtual network using Azure API Management](./api-management-using-with-internal-vnet.md).

:::image type="content" source="media/api-management-using-with-vnet/api-management-vnet-external.png" alt-text="Connect to external VNET":::

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

Some prerequisites differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

> [!TIP]
> When you use the portal to create or update the network connection of an existing API Management instance, the instance is hosted on the `stv2` compute platform.

### [stv2](#tab/stv2)

+ **An API Management instance.** For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

* **A virtual network and subnet** in the same region and subscription as your API Management instance. The subnet may contain other Azure resources.

* **A network security group** attached to the subnet above. A network security group (NSG) is required to explicitly allow inbound connectivity, because the load balancer used internally by API Management is secure by default and rejects all inbound traffic. For more strict configuration refer to **Required ports** below.

[!INCLUDE [api-management-public-ip-for-vnet](../../includes/api-management-public-ip-for-vnet.md)]

### [stv1](#tab/stv1)

+ **An API Management instance.** For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

* **A virtual network and subnet** in the same region and subscription as your API Management instance.

    The subnet must be dedicated to API Management instances. Attempting to deploy an Azure API Management instance to a Resource Manager VNET subnet that contains other resources will cause the deployment to fail.

---

## Enable VNET connection

### Enable VNET connectivity using the Azure portal (`stv2` compute platform)

1. Go to the [Azure portal](https://portal.azure.com) to find your API management instance. Search for and select **API Management services**.
1. Choose your API Management instance.

1. Select **Virtual network**.
1. Select the **External** access type.
    :::image type="content" source="media/api-management-using-with-vnet/api-management-menu-vnet.png" alt-text="Select VNET in Azure portal.":::

1. In the list of locations (regions) where your API Management service is provisioned: 
    1. Choose a **Location**.
    1. Select **Virtual network**, **Subnet**, and **IP address**. 
    * The VNET list is populated with Resource Manager VNETs available in your Azure subscriptions, set up in the region you are configuring.

        :::image type="content" source="media/api-management-using-with-vnet/api-management-using-vnet-select.png" alt-text="VNET settings in the portal.":::

1. Select **Apply**. The **Virtual network** page of your API Management instance is updated with your new VNET and subnet choices.

1. Continue configuring VNET settings for the remaining locations of your API Management instance.

7. In the top navigation bar, select **Save**, then select **Apply network configuration**.

    It can take 15 to 45 minutes to update the API Management instance.

### Enable connectivity using a Resource Manager template

Use the following templates to deploy an API Management instance and connect to a VNET. The templates differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

### [stv2](#tab/stv2)

#### API version 2021-01-01-preview 

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-external-vnet-publicip)

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-external-vnet-publicip%2Fazuredeploy.json)

### [stv1](#tab/stv1)

#### API version 2020-12-01

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-external-vnet)

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-external-vnet%2Fazuredeploy.json)

### Enable connectivity using Azure PowerShell cmdlets 

[Create](/powershell/module/az.apimanagement/new-azapimanagement) or [update](/powershell/module/az.apimanagement/update-azapimanagementregion) an API Management instance in a VNET.

---

[!INCLUDE [api-management-recommended-nsg-rules](../../includes/api-management-recommended-nsg-rules.md)]

## Connect to a web service hosted within a virtual network
Once you've connected your API Management service to the VNET, you can access backend services within it just as you do public services. When creating or editing an API, type the local IP address or the host name (if a DNS server is configured for the VNET) of your web service into the **Web service URL** field.

:::image type="content" source="media/api-management-using-with-vnet/api-management-using-vnet-add-api.png" alt-text="Add API from VNET":::


## Custom DNS server setup 
In external VNET mode, Azure manages the DNS by default. You can optionally configure a custom DNS server. The API Management service depends on several Azure services. When API Management is hosted in a VNET with a custom DNS server, it needs to resolve the hostnames of those Azure services.  
* For guidance on custom DNS setup, including forwarding for Azure-provided hostnames, see [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).  
* For reference, see the [required ports](#required-ports) and network requirements.

> [!IMPORTANT]
> If you plan to use a custom DNS server(s) for the VNET, set it up **before** deploying an API Management service into it. Otherwise, you'll need to update the API Management service each time you change the DNS Server(s) by running the [Apply Network Configuration Operation](/rest/api/apimanagement/current-ga/api-management-service/apply-network-configuration-updates).

### DNS access
  Outbound access on `port 53` is required for communication with DNS servers. If a custom DNS server exists on the other end of a VPN gateway, the DNS server must be reachable from the subnet hosting API Management.


## Routing

+ A load-balanced public IP address (VIP) is reserved to provide access to all service endpoints and resources outside the VNET.
  + Load balanced public IP addresses can be found on the **Overview/Essentials** blade in the Azure portal.
+ An IP address from a subnet IP range (DIP) is used to access resources within the VNET.

> [!NOTE]
> The VIP address(es) of the API Management instance will change when:
> * The VNET is enabled or disabled. 
> * API Management is moved from **External** to **Internal** virtual network mode, or vice versa.
> * [Zone redundancy](zone-redundancy.md) settings are enabled, updated, or disabled in a location for your instance (Premium SKU only).

[!INCLUDE [api-management-virtual-network-troubleshooting](../../includes/api-management-virtual-network-troubleshooting.md)]

## Next steps

Learn more about:

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
