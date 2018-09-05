---

title: How to use Azure API Management with internal virtual networks | Microsoft Docs
description: Learn how to set up and configure Azure API Management on an internal virtual network
services: api-management
documentationcenter: ''
author: vladvino
manager: kjoshi
editor: ''

ms.assetid: dac28ccf-2550-45a5-89cf-192d87369bc3
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/29/2017
ms.author: apimpm

---
# Using Azure API Management service with an internal virtual network
With Azure Virtual Networks, Azure API Management can manage APIs not accessible on the internet. A number of VPN technologies are available to make the connection. API Management can be deployed in two main modes inside a virtual network:
* External
* Internal


When API Management deploys in internal virtual network mode, all the service endpoints (gateway, the Developer portal, the Azure portal, direct management, and Git) are only visible inside a virtual network that you control the access to. None of the service endpoints are registered on the public DNS server.

Using API Management in internal mode, you can achieve the following scenarios:
* Make APIs hosted in your private datacenter securely accessible by third parties outside of it by using site-to-site or Azure ExpressRoute VPN connections.
* Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
* Manage your APIs hosted in multiple geographic locations by using a single gateway endpoint. 


## Prerequisites

To perform the steps described in this article, you must have:

+ **An active Azure subscription**.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ **An Azure API Management instance**. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

## <a name="enable-vpn"> </a>Creating an API Management in an internal virtual network
The API Management service in an internal virtual network is hosted behind an internal load balancer (ILB).

### Enable a virtual network connection using the Azure portal

1. Browse to your Azure API Management instance in the [Azure portal](https://portal.azure.com/).
2. Select **Virtual network**.
3. Configure the API Management instance to be deployed inside the virtual network.

    ![Menu for setting up an Azure API Management in an internal virtual network][api-management-using-internal-vnet-menu]

4. Select **Save**.

After the deployment succeeds, you should see the internal virtual IP address of your service on the dashboard.

![API Management dashboard with an internal virtual network configured][api-management-internal-vnet-dashboard]

> [!NOTE]
> The Test console available on the Azure Portal will not work for **Internal** VNET deployed service, as the Gateway Url is not registered on the Public DNS. You should instead use the Test Console provided on the **Developer portal**.

### Enable a virtual network connection by using PowerShell cmdlets
You can also enable virtual network connectivity by using PowerShell cmdlets.

* Create an API Management service inside a virtual network: Use the cmdlet [New-AzureRmApiManagement](/powershell/module/azurerm.apimanagement/new-azurermapimanagement) to create an Azure API Management service inside a virtual network and configure it to use the internal virtual network type.

* Deploy an existing API Management service inside a virtual network: Use the cmdlet [Update-AzureRmApiManagementDeployment](/powershell/module/azurerm.apimanagement/update-azurermapimanagementdeployment) to move an existing API Management service inside a virtual network and configure it to use the internal virtual network type.

## <a name="apim-dns-configuration"></a>DNS configuration
When API Management is in external virtual network mode, the DNS is managed by Azure. For internal virtual network mode, you have to manage your own routing.

> [!NOTE]
> API Management service does not listen to requests coming from IP addresses. It only responds to requests to the host name configured on its service endpoints. These endpoints include gateway, the Azure portal and the Developer portal, direct management endpoint, and Git.

### Access on default host names
When you create an API Management service, named "contoso" for example, the following service endpoints are configured by default:

   * Gateway or proxy: contoso.azure-api.net

   * The Azure portal and the Developer portal: contoso.portal.azure-api.net

   * Direct management endpoint: contoso.management.azure-api.net

   * Git: contoso.scm.azure-api.net

To access these API Management service endpoints, you can create a virtual machine in a subnet connected to the virtual network in which API Management is deployed. Assuming the internal virtual IP address for your service is 10.0.0.5, you can map the hosts file, %SystemDrive%\drivers\etc\hosts, as follows:

   * 10.0.0.5     contoso.azure-api.net

   * 10.0.0.5     contoso.portal.azure-api.net

   * 10.0.0.5     contoso.management.azure-api.net

   * 10.0.0.5     contoso.scm.azure-api.net

You can then access all the service endpoints from the virtual machine you created. 
If you use a custom DNS server in a virtual network, you can also create A DNS records and access these endpoints from anywhere in your virtual network. 

### Access on custom domain names

   1. If you don’t want to access the API Management service with the default host names, you can set up custom domain names for all your service endpoints as shown in the following image: 

   ![Setting up a custom domain for API Management][api-management-custom-domain-name]

   2. Then you can create records in your DNS server to access the endpoints that are only accessible from within your virtual network.

## <a name="routing"> </a> Routing
+ A load balanced private virtual IP address from the subnet range will be reserved and used to access the API Management service endpoints from within the vnet.
+ A load balanced public IP address (VIP) will also be reserved to provide access to the management service endpoint only over port 3443.
+ An IP address from a subnet IP range (DIP) will be used to access resources within the vnet and a public IP address (VIP) will be used to access resources outside the vnet.
+ Load balanced public and private IP addresses can be found on the Overview/Essentials blade in the Azure portal.

## <a name="related-content"> </a>Related content
To learn more, see the following articles:
* [Common network configuration problems while setting up Azure API Management in a virtual network][Common network configuration problems]
* [Virtual network FAQs](../virtual-network/virtual-networks-faq.md)
* [Creating a record in DNS](https://msdn.microsoft.com/library/bb727018.aspx)

[api-management-using-internal-vnet-menu]: ./media/api-management-using-with-internal-vnet/api-management-internal-vnet-menu.png
[api-management-internal-vnet-dashboard]: ./media/api-management-using-with-internal-vnet/api-management-internal-vnet-dashboard.png
[api-management-custom-domain-name]: ./media/api-management-using-with-internal-vnet/api-management-custom-domain-name.png

[Create API Management service]: get-started-create-service-instance.md
[Common network configuration problems]: api-management-using-with-vnet.md#network-configuration-issues

