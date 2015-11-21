<properties
	pageTitle="Create a new SQL Server API in your organization's App Service Environment"
	description="Create SQL Server API and connection to connect to data on-premise"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="linhtranms"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/20/2015"
   ms.author="litran"/>


# Create a new SQL Server API in your organization's App Service Environment

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Manage APIs** tile or select it from *Settings*:  

2. In the **Manage APIs** blade, select **Add** to add a new API

3. Configure the API properties:  


	a) Enter a descriptive **name** for your API. For example, you're adding the SQL Server API for demo, you can name it *SQLServerDemo*.  
	
	b) In **Source**, there are three available options. Select **Available APIs** to select a pre-built APIs for PowerApps. Select **From APIs hosted in App Service Environment** to choose an API you created (the .json and .manifest files are needed). Or select **Import from Swagger 2.0 API Definition**  
	
	c) Select **Available APIs** for Source.  

4. Select **SQL Server** from **Availavle APIs**

	
7. Select **OK**. SQL Server API is now added to the list of **Manage APIs** in your App Service Environment.  

## Configure connectivity to SQL Server on-premises

You can connect to SQL Server on-premise. In order to establish this hybrid connectivity, you can leverage existing hybrid networking solutions in Azure such as:

- [ExpressRoute](../expressroute-introduction.md)
- [Site-to-site VPN](../vpn-gateway-create-site-to-site-rm-powershell.md)
- [Point-to-site connectivity](../vpn-gateway-point-to-site-create.md)  
	>Note: Every ASE has a virtual  network associated with it. You can establish above mentioned network connectivity to this virtual network.
- [Hybrid connections](../web-sites-hybrid-connection-get-started.md)  
	>Note: Every registered API in your ASE has a corresponding web app. You can establish hybrid connections from this web app just like you can from any other web app.
	
The below is an example showing how to create a hybrid connection assuming that you already created a SQL Server API.

1. Select the SQL Server API you just created and click on the Resource group. In this example, I select the API called *sqlconnectordemo* and click on the Resource Group called *DedicatedAses*

	![Resource group](./media/powerapps-create-api-sqlserver/sqlapi.png)

2.  Select **Resources** tile and then select the web app with the same name as your SQL Server API, in this example *sqlconnectordemo*.

	![Sql Web app](./media/powerapps-create-api-sqlserver/sqlwebapp.png)

3.   Select on Networking under Settings, click **Configure your hybrid connection endpoints** and follow [these instructions](../web-sites-hybrid-connection-get-started.md) to create the hybrid connection.

	![Networking](./media/powerapps-create-api-sqlserver/network.png)

5. Once your hybrid connection is created and connected, you have enabled the connection to your on-premise server. Next step, you will create the connection to your data and give users access.

	![Hybrid connection](./media/powerapps-create-api-sqlserver/hybridconn.png)

## Create connection for SQL Server API

1. In the Azure portal, open PowerApps, and select **Manage APIs**. A list of the configured APIs is displayed:
  
	![](./media/powerapps-create-api-sqlserver/apilist.png)

2. Select the API you want, in this case it's **SQLServerDemo** and select **Connections**. 

3. In Connections, select **Add connection**:   

	![](./media/powerapps-create-api-sqlserver/addconnection.png)

4. Enter a name for the connection and enter the connection string. Entering the connection string requires you to know some specific properties about the service you're connecting to. For example, if you're connecting to on-premises SQL Server, then you need to know the username, password, and other properties required to successfully make the connection. 

5. Select **Add** to save your changes.

## Next Steps

Now that you have created the connection, you can follow [these steps](https://github.com/Azure/azure-content-pr/blob/release-power-apps/articles/power-apps/powerapps-create-new-api.md) to configure the users or groups who have access to use this connection to build apps. 


