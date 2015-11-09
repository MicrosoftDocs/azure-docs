<properties
	pageTitle="Create a new SQL Server API in your organization's App Service Environment"
	description="Create a new SQL Server API in your organization's App Service Environment"
	services="power-apps"
	documentationCenter="" 
	authors="rajram"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/03/2015"
   ms.author="rajram"/>


#Create a new SQL Server API in your organization's App Service Environment

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Registered APIs** tile or select it from *Settings*:  


2. In the **Registered APIs** blade, select **Add** to add a new API

3. Configure the API properties:  


	a) Enter a descriptive **name** for your API. For example, if you're adding the SQL connector, you can name it *SQLOrdersDB*.  
	
	b) In **Source**, select **Marketplace** to select a pre-built connector. Select **Existing API** to choose a connector you created (the .json and .manifest files are needed).  
	
	c) Select **API** from Azure Marketplace.  

4. Select **SQL Server** from Azure Marketplace

	
7. Select **OK**. SQL Server API is now added to the list of **Registered APIs** in your app service environment.  

#Configure connectivity to SQL Server on-premises
You can connect to SQL Server on-premise. In order to establish this hybrid connectivity, you can leverage existing hybrid networking solutions in Azure such as

- [ExpressRoute][1]
- [Site-to-site VPN][2]
- [Point-to-site connectivity][3]
	>Note: Every ASE has a virtual  network associated with it. You can establish above mentioned network connectivity to this virtual network.
- [Hybrid connections][4]
	>Note: Every registered API in your ASE has a corresponding web app. You can establish hybrid connections from this web app just like you can from any other web app.

<!--References-->
[1]: https://azure.microsoft.com/en-us/documentation/articles/expressroute-introduction/
[2]: https://azure.microsoft.com/en-us/documentation/articles/vpn-gateway-create-site-to-site-rm-powershell/
[3]: https://azure.microsoft.com/en-us/documentation/articles/vpn-gateway-point-to-site-create/
[4]: https://azure.microsoft.com/en-us/documentation/articles/web-sites-hybrid-connection-get-started/

