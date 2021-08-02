---

title: Connect to an internal virtual network using Azure API Management
titleSuffix: Azure API Management
description: Learn how to set up and configure Azure API Management on an internal virtual network
services: api-management
documentationcenter: ''
author: vladvino
editor: ''

ms.service: api-management
ms.topic: how-to
ms.date: 06/08/2021
ms.author: apimpm
ms.custom: devx-track-azurepowershell

---
# Connect to an internal virtual network using Azure API Management 
With Azure Virtual Networks (VNETs), Azure API Management can manage internet-inaccessible APIs using several VPN technologies to make the connection. You can deploy API Management either via [external](./api-management-using-with-vnet.md) or internal modes. In this article, you'll learn how to deploy API Management in internal VNET mode.

When API Management deploys in internal VNET mode, you can only view the following service endpoints within a VNET whose access you control.
* The proxy gateway
* The developer portal
* Direct management
* Git 

> [!NOTE]
> None of the service endpoints are registered on the public DNS. The service endpoints will remain inaccessible until you [configure DNS](#apim-dns-configuration) for the VNET.

Use API Management in internal mode to:

* Make APIs hosted in your private datacenter securely accessible by third parties outside of it by using Azure VPN Connections or Azure ExpressRoute.
* Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
* Manage your APIs hosted in multiple geographic locations, using a single gateway endpoint.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

+ **An active Azure subscription**. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ **An Azure API Management instance (supported SKUs: Developer, Premium and Isolated)**. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

[!INCLUDE [api-management-public-ip-for-vnet](../../includes/api-management-public-ip-for-vnet.md)]

When an API Management service is deployed in a VNET, a [list of ports](./api-management-using-with-vnet.md#required-ports) are used and need to be opened.

## <a name="enable-vpn"> </a>Creating an API Management in an internal VNET
The API Management service in an internal virtual network is hosted behind an internal load balancer. The load balancer SKU depends on the management API used to create the service. For more information, see [Azure Load Balancer SKUs](../load-balancer/skus.md).

| API version | Hosted behind |
| ----------- | ------------- |
| 2020-12-01 | An internal load balancer in the Basic SKU |
| 2020-01-01-preview, with a public IP address from your subscription | An internal load balancer Standard SKU |

### Enable a VNET connection using the Azure portal

1. Navigate to your Azure API Management instance in the [Azure portal](https://portal.azure.com/).
1. Select **Virtual network**.
1. Configure the **Internal** access type. For detailed steps, see [Enable VNET connectivity using the Azure portal](api-management-using-with-vnet.md#enable-vnet-connectivity-using-the-azure-portal).

    ![Menu for setting up an Azure API Management in an internal VNET][api-management-using-internal-vnet-menu]

4. Select **Save**.

After successful deployment, you should see your API Management service's **private** virtual IP address and **public** virtual IP address on the **Overview** blade. 

| Virtual IP address | Description |
| ----- | ----- |
| **Private virtual IP address** | A load balanced IP address from within the API Management-delegated subnet, over which you can access `gateway`, `portal`, `management`, and `scm` endpoints. |  
| **Public virtual IP address** | Used *only* for control plane traffic to `management` endpoint over `port 3443`. Can be locked down to the [ApiManagement][ServiceTags] service tag. |  

![API Management dashboard with an internal VNET configured][api-management-internal-vnet-dashboard]

> [!NOTE]
> Since the Gateway URL is not registered on the public DNS, the test console available on the Azure portal will not work for **Internal** VNET deployed service. Instead, use the test console provided on the **Developer portal**.

### <a name="deploy-apim-internal-vnet"> </a>Deploy API Management into VNET

You can also enable VNET connectivity by using the following methods.


### API version 2020-12-01

* Azure Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-internal-vnet)

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fapi-management-create-with-internal-vnet%2Fazuredeploy.json)

* Azure PowerShell cmdlets - [Create](/powershell/module/az.apimanagement/new-azapimanagement) or [update](/powershell/module/az.apimanagement/update-azapimanagementregion) an API Management instance in a VNET

## <a name="apim-dns-configuration"></a>DNS configuration
In external VNET mode, Azure manages the DNS. For internal VNET mode, you have to manage your own DNS. We recommend:
1. Configuring an Azure DNS private zone.
1. Linking the Azure DNS private zone to the VNET into which you've deployed your API Management service. 

Learn how to [set up a private zone in Azure DNS](../dns/private-dns-getstarted-portal.md).

> [!NOTE]
> API Management service does not listen to requests coming from IP addresses. It only responds to requests to the host name configured on its service endpoints. These endpoints include:
> * Gateway
> * The Azure portal
> * The developer portal
> * Direct management endpoint
> * Git

### Access on default host names
When you create an API Management service (`contosointernalvnet`, for example), the following service endpoints are configured by default:

| Endpoint | Endpoint configuration |
| ----- | ----- |
| Gateway or proxy | `contosointernalvnet.azure-api.net` |
| Developer portal | `contosointernalvnet.portal.azure-api.net` |
| The new developer portal | `contosointernalvnet.developer.azure-api.net` |
| Direct management endpoint | `contosointernalvnet.management.azure-api.net` |
| Git | `contosointernalvnet.scm.azure-api.net` |

To access these API Management service endpoints, you can create a virtual machine in a subnet connected to the VNET in which API Management is deployed. Assuming the internal virtual IP address for your service is 10.1.0.5, you can map the hosts file, `%SystemDrive%\drivers\etc\hosts`, as follows:

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

1. Set up custom domain names for all your service endpoints, as shown in the following image:

   ![Setting up a custom domain for API Management][api-management-custom-domain-name]

2. Create records in your DNS server to access the endpoints accessible from within your VNET.

## <a name="routing"> </a> Routing

* A load balanced *private* virtual IP address from the subnet range (DIP) will be reserved for access to the API Management service endpoints from within the VNET. 
    * Find this private IP address on the service's Overview blade in the Azure portal. 
    * Register this address with the DNS servers used by the VNET.
* A load balanced *public* IP address (VIP) will also be reserved to provide access to the management service endpoint over `port 3443`. 
    * Find this public IP address on the service's Overview blade in the Azure portal. 
    * Only use the *public* IP address for control plane traffic to the `management` endpoint over `port 3443`. 
    * This IP address can be locked down to the [ApiManagement][ServiceTags] service tag.
* DIP addresses will be assigned to each virtual machine in the service and used to access resources *within* the VNET. A VIP address will be used to access resources *outside* the VNET. If IP restriction lists secure resources within the VNET, you must specify the entire subnet range where the API Management service is deployed to grant or restrict access from the service.
* The load balanced public and private IP addresses can be found on the Overview blade in the Azure portal.
* If you remove or add the service in the VNET, the IP addresses assigned for public and private access may change. You may need to update DNS registrations, routing rules, and IP restriction lists within the VNET.

## <a name="related-content"> </a>Related content
To learn more, see the following articles:
* [Common network configuration problems while setting up Azure API Management in a VNET][Common network configuration problems]
* [VNET FAQs](../virtual-network/virtual-networks-faq.md)
* [Creating a record in DNS](/previous-versions/windows/it-pro/windows-2000-server/bb727018(v=technet.10))

[api-management-using-internal-vnet-menu]: ./media/api-management-using-with-internal-vnet/updated-api-management-using-with-internal-vnet.png
[api-management-internal-vnet-dashboard]: ./media/api-management-using-with-internal-vnet/updated-api-management-internal-vnet-dashboard.png
[api-management-custom-domain-name]: ./media/api-management-using-with-internal-vnet/updated-api-management-custom-domain-name.png

[Create API Management service]: get-started-create-service-instance.md
[Common network configuration problems]: api-management-using-with-vnet.md#network-configuration-issues

[ServiceTags]: ../virtual-network/network-security-groups-overview.md#service-tags
