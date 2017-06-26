---
title: How to use Azure API Management with Internal virtual network | Microsoft Docs
description: Learn how to setup and configure Azure API Management in Internal virtual network.
services: api-management
documentationcenter: ''
author: solankisamir
manager: kjoshi
editor: ''

ms.assetid: dac28ccf-2550-45a5-89cf-192d87369bc3
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/09/2017
ms.author: apimpm

---
# Using Azure API Management service with Internal Virtual Network
With Azure Virtual Networks (VNETs), API Management can manage APIs not accessible on the Internet. A number of VPN technologies are available to make the connection and API Management can be deployed in two main modes inside the VNET:
* External
* Internal

## <a name="overview"> </a>Overview
When API Management is deployed in an Internal Virtual network mode, all the service endpoints (gateway, developer portal, publisher portal, direct management and Git) are only visible inside a Virtual network that you control access to. None of the service endpoints are registered on the Public DNS Server.

Using API Management in Internal mode, you can achieve the following scenarios
* Securely make APIs hosted in your private datacenter accessible by 3rd parties outside of it using Site-to-Site or ExpressRoute VPN connections.
* Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-prem APIs through a common gateway.
* Manage your APIs hosted in multiple geographic locations using a single Gateway endpoint. 

## <a name="enable-vpn"> </a>Creating an API Management in Internal Virtual network
The API Management service in Internal Virtual network is hosted behind an Internal Load Balancer(ILB). The IP Address of the ILB is in the [RFC1918](http://www.faqs.org/rfcs/rfc1918.html) range.  

### Enable VNET connection using Azure portal
First create the API Management service by following the steps [Create API Management service][Create API Management service]. Then set-up API Management to be deployed inside a Virtual network.

![Menu for Setting up APIM in Internal Virtual Network][api-management-using-internal-vnet-menu]

After the deployment succeeds, you should see the Internal Virtual IP Address of your service on the dashboard.

![API Management Dashboard with Internal VNET configured][api-management-internal-vnet-dashboard]

### Enable VNET connection using Powershell cmdlets
You can also enable VNET connectivity using the PowerShell cmdlets.

* **Create an API Management service inside a VNET**: Use the cmdlet [New-AzureRmApiManagement](/powershell/module/azurerm.apimanagement/new-azurermapimanagement) to create an Azure API Management service inside a VNET and configure it to use the Internal VNET type.

* **Deploy an existing API Management service inside a VNET**: Use the cmdlet [Update-AzureRmApiManagementDeployment](/powershell/module/azurerm.apimanagement/update-azurermapimanagementdeployment) to move an existing Azure API Management service inside a Virtual network and configure it to use Internal VNET type.

## <a name="apim-dns-configuration"></a>DNS configuration
When using API Management in External Virtual network mode, DNS is managed by Azure. For Internal Virtual network mode, you have to manage your own DNS.

> [!NOTE]
> API Management service does not listen to requests coming on IP addresses. It only responds to requests to the Hostname configured on its service endpoints (which includes gateway, developer portal, publisher Portal, direct management endpoint, and git).

### Access on default host names:
When you create an API Management service in public Azure cloud, named "contoso" for example, the following service endpoints are configured by default.

>	Gateway / Proxy - contoso.azure-api.net

> Publisher Portal and Developer Portal - contoso.portal.azure-api.net

> Direct Management Endpoint - contoso.management.azure-api.net

>	GIT - contoso.scm.azure-api.net

To access these API Management service endpoints, you can create a Virtual Machine in a subnet connected to the Virtual network in which API Management is deployed. Assuming the Internal Virtual IP Address for your service is 10.0.0.5, you can do the hosts file mapping (%SystemDrive%\drivers\etc\hosts) as follows:

> 10.0.0.5	  contoso.azure-api.net

> 10.0.0.5	  contoso.portal.azure-api.net

> 10.0.0.5	  contoso.management.azure-api.net

> 10.0.0.5	  contoso.scm.azure-api.net

You can then access all the service endpoints from the Virtual Machine you created. 
If using a Custom DNS server in a Virtual network, you can also create A DNS records and access these endpoints from anywhere in your Virtual network. 

### Access on custom domain names:
If you don’t want to access the API Management service with the default host names, you can setup custom domain names for all your service endpoints like below

![Setting up custom domain for API Management][api-management-custom-domain-name]

Then you can create A records in your DNS Server to access these endpoints which are only accessible from within your Virtual network.

## <a name="related-content"> </a>Related content
* [Common Network configuration issues while setting up APIM in VNET][Common Network Configuration Issues]
* [Virtual Network faqs](../virtual-network/virtual-networks-faq.md)
* [Creating A record in DNS](https://msdn.microsoft.com/en-us/library/bb727018.aspx)

[api-management-using-internal-vnet-menu]: ./media/api-management-using-with-internal-vnet/api-management-internal-vnet-menu.png
[api-management-internal-vnet-dashboard]: ./media/api-management-using-with-internal-vnet/api-management-internal-vnet-dashboard.png
[api-management-custom-domain-name]: ./media/api-management-using-with-internal-vnet/api-management-custom-domain-name.png

[Create API Management service]: api-management-get-started.md#create-service-instance
[Common Network Configuration Issues]: api-management-using-with-vnet.md#network-configuration-issues
