---
title: How to use Azure API Management with Internal virtual network
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
ms.author: sasolank

---
# Using Azure API Management service with Internal Virtual Network
Azure API Management can help you to manage your APIs not accessible on the Internet. Using Azure Virtual Network(VNET), you can access your API backend using the various VPN technologies. API Management can deployed in two modes in Virtual Network
* External
* Internal

## <a name="overview"> </a>Overview
With API Management is deployed in a Internal Virtual Network mode, all the service Endpoints (Gateway, Developer Portal, Publisher Portal, Direct Management and GIT) are only visible inside a Virtual Network that you control access to. None of the Service Endpoints are registered on the Public DNS Server.

Using API Management in Internal mode, you can achieve the following scenarios
* Securely extend your APIs hosted in your datacenter to Cloud with you can access through Site to Site Vpn or Express Route VPN.
* Enable hybrid Cloud Scenarios by connecting your Cloud Based API’s with On-Prem API’s through a common Gateway.
* Manage your APIs hosted in multiple geographic locations using a single Gateway endpoint. 

## <a name="enable-vpn"> </a>Creating an API Management in Internal VNET
API Management service in Internal Virtual Network is hosted behind an Internal Load Balancer(ILB). The IP Address of the ILB is in the RFC1918 (http://www.faqs.org/rfcs/rfc1918.html) range.  

## <a name="enable-vnet-portal"> </a>Enable VNET connection using Azure portal
First create the API Management service by following the steps [Create API Management service][Create API Management service]. Then configure the API Management inside a Virtual Network.

![Menu for Setting up APIM in Internal Virtual Network][api-management-using-internal-vnet-menu]

After the deployment succeeds, you should see the Internal Virtual IP Address of your service on the dashboard.

![API Management Dashboard with Internal VNET configured][api-management-internal-vnet-dashboard]

## <a name="enable-vnet-powershell"> </a>Enable VNET connection using PowerShell cmdlets
You can also enable VNET connectivity using the PowerShell cmdlets

* **Create an API Management service inside a VNET**: Use the cmdlet [New-AzureRmApiManagement](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.apimanagement/v3.1.0/new-azurermapimanagement) to create an Azure API Management service inside a VNET and configure it to using the Internal VPN type.

* **Deploy an existing API Management service inside a VNET**: Use the cmdlet [Update-AzureRmApiManagementDeployment](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.apimanagement/v3.1.0/update-azurermapimanagementdeployment) to move an existing Azure API Management service inside a Virtual Network and configure it to using Internal VPN type.

# <a name="dns-configuration-apim"></a>DNS Configuration
When using API Management in External Virtual Network Type, DNS is managed by Azure. For Internal Virtual Network type, you have to manage your own DNS.

> [!NOTE]
> API Management service does not listen to requests coming on IP addresses. It only responds to requests to the Hostname configured on its Service Endpoints (which includes Gateway, Developer Portal, Publisher Portal,
> Direct  Management endpoint and GIT).

## Access on Default Host Names:
When you create an API Management service, the following service Endpoints are configured by default.
•	Gateway / Proxy - <serviceName>.azure-api.net
•	Publisher Portal & Developer Portal - <serviceName>.portal.azure-api.net
•	Direct Management Endpoint - <serviceName>.management.azure-api.net
•	GIT - <serviceName>.scm.azure-api.net
To access the API Management instance service endpoints, you can create a Virtual Machine in a subnet connected to the Virtual Network in which API Management is deployed. Assuming the Internal IP Address for your service is 10.0.0.5, you can do the hosts file mapping (%SystemDrive%\drivers\etc\hosts) like below.

10.0.0.5	<serviceName>.azure-api.net
10.0.0.5	<serviceName>.portal.azure-api.net
10.0.0.5	<serviceName>.management.azure-api.net
10.0.0.5	<serviceName>.scm.azure-api.net

You can then access all the service endpoints from the Virtual Machine you created. 
If using the a Custom DNS server in a Virtual Network, you can also create A- DNS record  and access these endpoints from anywhere in your Virtual Network. 

## Access on Custom Domain Names:
If you don’t want to access the API Management service with the default host names, you can setup custom domain name for all your service endpoints like below

![Setting up custom domain for API Management][api-management-custom-domain-name]

Then you can create A records in your DNS Server to access these endpoints which are only accessible from within your Virtual Network.

## <a name="related-content"> </a>Related content
* [Common Network configuration issues while setting up APIM in VNET][api-management-using-with-vnet.md#-common-network-configuration-issues]
* [Virtual Network faqs](../virtual-network/virtual-networks-faq.md)
* [Creating A record in DNS](https://msdn.microsoft.com/en-us/library/bb727018.aspx)

[api-management-using-internal-vnet-menu]: ./media/api-management-using-with-internal-vnet/api-management-internal-vnet-menu.png
[api-management-internal-vnet-dashboard]: ./media/api-management-using-with-internal-vnet/api-management-internal-vnet-dashboard.png
[api-management-custom-domain-name]: ./media/api-management-using-with-internal-vnet/api-management-custom-domain-name.png

[Create API Management service]: api-management-get-started.md#-create-an-api-management-instance
