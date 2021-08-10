---
title: Connect to an internal virtual network using Azure API Management
description: Learn how to set up and configure Azure API Management in a virtual network using internal mode
author: vladvino

ms.service: api-management
ms.topic: how-to
ms.date: 08/10/2021
ms.author: apimpm
ms.custom: devx-track-azurepowershell
---

# Connect to a virtual network in internal mode using Azure API Management 
With Azure virtual networks (VNETs), Azure API Management can manage internet-inaccessible APIs using several VPN technologies to make the connection. You can deploy API Management either via [external](./api-management-using-with-vnet.md) or internal modes. For VNET connectivity options, requirements, and considerations, see [Using a virtual network with Azure API Management](virtual-network-concepts.md).

In this article, you'll learn how to deploy API Management in internal VNET mode. In this mode, you can only view the following service endpoints within a VNET whose access you control.
* The API gateway
* The developer portal
* Direct management
* Git 

> [!NOTE]
> None of the service endpoints are registered on the public DNS. The service endpoints remain inaccessible until you [configure DNS](#dns-configuration) for the VNET.

Use API Management in internal mode to:

* Make APIs hosted in your private datacenter securely accessible by third parties outside of it by using Azure VPN connections or Azure ExpressRoute.
* Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
* Manage your APIs hosted in multiple geographic locations, using a single gateway endpoint.

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-vnet-internal.png" alt-text="Connect to internal VNET":::

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

Some prerequisites differ depending on the version (v1 or v2) of the [hosting platform](hosting-infrastructure.md) for your API Management instance. 

   > [!TIP]
    > When you use the portal to create or update your API Management instance, the instance is hosted on the v2 platform.

### [v1](#tab/v1)

+ **An API Management instance.** For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

* **A virtual network and subnet** in the same region and subscription as your API Management instance.

    The subnet must be dedicated to API Management instances. Attempting to deploy an Azure API Management instance to a Resource Manager VNET subnet that contains other resources will cause the deployment to fail.

   > [!NOTE]
   > When you deploy an API Management service in an internal virtual network on the v1 platform, it's hosted behind an internal load balancer in the [Basic SKU](../load-balancer/skus.md).

### [v2](#tab/v2)

+ **An API Management instance.** For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

* **A virtual network and subnet** in the same region and subscription as your API Management instance. The subnet may contain other Azure resources.

[!INCLUDE [api-management-public-ip-for-vnet](../../includes/api-management-public-ip-for-vnet.md)]

   > [!NOTE]
   > When you deploy an API Management service in an internal virtual network on the v2 platform, it's hosted behind an internal load balancer in the [Standard SKU](../load-balancer/skus.md), using the public IP address resource.

---

## Enable VNET connection

### Enable VNET connectivity using the Azure portal (v2 platform)

1. Go to the [Azure portal](https://portal.azure.com) to find your API management instance. Search for and select **API Management services**.
1. Choose your API Management instance.
1. Select **Virtual network**.
1. Select the **Internal** access type.
1. In the list of locations (regions) where your API Management service is provisioned: 
    1. Choose a **Location**.
    1. Select **Virtual network**, **Subnet**, and **IP address**. 
        * The VNET list is populated with Resource Manager VNETs available in your Azure subscriptions, set up in the region you are configuring.
1. Select **Apply**. The **Virtual network** page of your API Management instance is updated with your new VNET and subnet choices.
   :::image type="content" source="media/api-management-using-with-internal-vnet/api-management-using-with-internal-vnet.png" alt-text="Set up internal VNET in Azure portal":::
1. Continue configuring VNET settings for the remaining locations of your API Management instance.
1. In the top navigation bar, select **Save**, then select **Apply network configuration**.

    It can take 15 to 45 minutes to update the API Management instance.

After successful deployment, you should see your API Management service's **private** virtual IP address and **public** virtual IP address on the **Overview** blade. For more information about the IP addresses, see [Routing](#routing) in this article.

:::image type="content" source="media/api-management-using-with-internal-vnet/api-management-internal-vnet-dashboard.png" alt-text="Public and private IP addressed in Azure portal"::: 

> [!NOTE]
> Since the gateway URL is not registered on the public DNS, the test console available on the Azure portal will not work for an **Internal** VNET deployed service. Instead, use the test console provided on the **Developer portal**.

### Enable connectivity using a Resource Manager template

#### API version 2021-01-01-preview (v2 platform)

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-internal-vnet-publicip)

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-internal-vnet-publicip%2Fazuredeploy.json)

#### API version 2020-12-01 (v1 platform)

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-internal-vnet)

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-internal-vnet%2Fazuredeploy.json)

### Enable connectivity using Azure PowerShell cmdlets (v1 platform)

[Create](/powershell/module/az.apimanagement/new-azapimanagement) or [update](/powershell/module/az.apimanagement/update-azapimanagementregion) an API Management instance in a VNET.

## DNS configuration

In external VNET mode, Azure manages the DNS. For internal VNET mode, you have to manage your own DNS. We recommend:
1. Configure an Azure [DNS private zone](../dns/private-dns-overview.md).
1. Link the Azure DNS private zone to the VNET into which you've deployed your API Management service. 

Learn how to [set up a private zone in Azure DNS](../dns/private-dns-getstarted-portal.md).

> [!NOTE]
> The API Management service does not listen to requests on its IP addresses. It only responds to requests to the host name configured on its service endpoints. These endpoints include:
> * API gateway
> * The Azure portal
> * The developer portal
> * Direct management endpoint
> * Git

### Access on default host names
When you create an API Management service (`contosointernalvnet`, for example), the following service endpoints are configured by default:

| Endpoint | Endpoint configuration |
| ----- | ----- |
| API Gateway | `contosointernalvnet.azure-api.net` |
| Developer portal | `contosointernalvnet.portal.azure-api.net` |
| The new developer portal | `contosointernalvnet.developer.azure-api.net` |
| Direct management endpoint | `contosointernalvnet.management.azure-api.net` |
| Git | `contosointernalvnet.scm.azure-api.net` |

To access these API Management service endpoints, you can create a virtual machine in a subnet connected to the VNET in which API Management is deployed. Assuming the internal virtual IP address for your service is 10.1.0.5, you can map the hosts file as follows. On Windows, this file is at `%SystemDrive%\drivers\etc\hosts`. 

| Internal virtual IP address | Endpoint configuration |
| ----- | ----- |
| 10.1.0.5 | `contosointernalvnet.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.portal.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.developer.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.management.azure-api.net` |
| 10.1.0.5 | `contosointernalvnet.scm.azure-api.net` |

You can then access all the service endpoints from the virtual machine you created.

If you use a custom DNS server in a VNET, you can also create DNS A-records and access these endpoints from anywhere in your VNET.

### Access on custom domain names

If you don't want to access the API Management service with the default host names: 

1. Set up [custom domain names](configure-custom-domain.md) for all your service endpoints, as shown in the following image:

    :::image type="content" source="media/api-management-using-with-internal-vnet/api-management-custom-domain-name.png" alt-text="Set up custom domain name":::

2. Create records in your DNS server to access the endpoints accessible from within your VNET.

## Routing

The following virtual IP addresses are configured for an API Management instance in an internal virtual network.

| Virtual IP address | Description |
| ----- | ----- |
| **Private virtual IP address** | A load balanced IP address from within the API Management instance's subnet range (DIP), over which you can access the API gateway, developer portal, management, and Git endpoints.<br/><br/>Register this address with the DNS servers used by the VNET.     |  
| **Public virtual IP address** | Used *only* for control plane traffic to the management endpoint over port 3443. Can be locked down to the [ApiManagement][ServiceTags] service tag. | 


* DIP addresses will be assigned to each virtual machine in the service and used to access resources *within* the VNET. A VIP address will be used to access resources *outside* the VNET. If IP restriction lists secure resources within the VNET, you must specify the entire subnet range where the API Management service is deployed to grant or restrict access from the service.
* The load-balanced public and private IP addresses can be found on the **Overview** blade in the Azure portal.

> [!NOTE]
> The VIP address(es) of the API Management instance will change when:
> * The VNET is enabled or disabled. 
> * API Management is moved from **External** to **Internal** virtual network mode, or vice versa.
> * [Zone redundancy](zone-redundancy.md) settings are enabled, updated, or disabled in a location for your instance (Premium SKU only).
>
> You may need to update DNS registrations, routing rules, and IP restriction lists within the VNET.

## Next steps

Learn more about:

* [Network configuration when setting up Azure API Management in a VNET][Common network configuration problems]
* [VNET FAQs](../virtual-network/virtual-networks-faq.md)
* [Creating a record in DNS](/previous-versions/windows/it-pro/windows-2000-server/bb727018(v=technet.10))

[api-management-using-internal-vnet-menu]: ./media/api-management-using-with-internal-vnet/updated-api-management-using-with-internal-vnet.png
[api-management-internal-vnet-dashboard]: ./media/api-management-using-with-internal-vnet/updated-api-management-internal-vnet-dashboard.png
[api-management-custom-domain-name]: ./media/api-management-using-with-internal-vnet/updated-api-management-custom-domain-name.png

[Create API Management service]: get-started-create-service-instance.md
[Common network configuration problems]: api-management-using-with-vnet.md#network-configuration

[ServiceTags]: ../virtual-network/network-security-groups-overview.md#service-tags

<!-- WHEHRE TO PUT THIHS
The API Management service in an internal virtual network is hosted behind an internal load balancer. The load balancer SKU depends on the management API used to create the service. For more information, see [Azure Load Balancer SKUs](../load-balancer/skus.md).

| API version | Hosted behind |
| ----------- | ------------- |
| 2020-12-01 | An internal load balancer in the Basic SKU |
| 2020-01-01-preview, with a public IP address from your subscription | An internal load balancer Standard SKU |


>
