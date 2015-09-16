
<properties
	pageTitle="Add or create a new connector and give users permissions in PowerApps | Microsoft Azure"
	description="Add, create, and configure a new connector, connection or connection profile, and give permissions and rights with user access"
	services="power-apps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="09/15/2015"
   ms.author="mandia"/>


# Add a new connector, add a connection, and give users access

Connectors exist within an [App Service environment](powerapps-create-new-ase.md). Connectors can be created from the Azure Marketplace, or within your API Hub (Existing API). The Azure Marketplace offers many pre-built connectors available to you that can be easily added to your PowerApps apps. API Hub (Existing API) lets you upload your own connector (JSON format). You can create your own connector using **IS THERE AN SDK OR SOMETHING?**.

This topic:

- Lists the steps to add a connector to PowerApps, and give users within your company permissions to use the connector, including changing its properties.
- Lists the steps to add a connection to your connector in PowerApps, and give users within your company permissions to use the connection.


#### Prerequisites to get started

- Enable [PowerApps in your Azure subscription](powerapps-portal-signup.md).
- Create an [App Service environment](powerapps-create-new-ase.md).

## Add a new connector to your app service environment (slides 3-13)

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Settings**, and then select **App Service environment**:  
![][1]  
2. In your app service environment, select **Connection provider**, and then select **Add** to add a new connector:  
![][2]  
3. Configure the connector properties:  
![][3]  
	a) Enter a descriptive **name** for your connector. For example, if you're adding the SQL connector, you can name it *SQLOrdersDB*.  
	b) In **Source**, select **Marketplace** to select a pre-built connector. Select **Existing API** to choose a connector you created (the .json and .manifest files are needed).  
	c) Select **Connection provider**.  
4. Choose the connector you want to add and configure that connector's properties. Every connector has different properties. For example, the SQL connector can connect to an Azure SQL Database or an on-premises SQL Server. These options determine the settings or properties you configure. 
	
	In the following example, the SharePoint Online connector is selected and SharePoint Online-specific properties are displayed:
	![][4]  

	These connectors are similar to Azure App Service connectors. To configure these connectors, including the required properties, see the [Connector List](../app-service-logic/app-service-logic-connectors-list.md).  
	> [AZURE.TIP] When you add a connector, you're adding the connector to your App Service environment. Once in the app service environment, it can be used by other apps within the same app service environment, especially PowerApps.

5. Select **Add**. The connector is now added to your list of **Connection providers** in your app service environment.  

#### Delete the connector
You can also delete connectors you add. In PowerApps, select the **Connection Provider**, and delete. 

## Give users runtime access to the connector (slides 15 )

Now that the connector is created and added to your app service environment, it's time to give users within your company the permissions to use it. 

1. Open your connection provider, and select your connector. For example, if you created a SharePoint Online connector, select it. Select **Runtime user access**:  
![][5]  
2. Select **Add** to add the users, and select the rights. When done, select **Add** to save your changes. The Users or Groups count increases in the **Runtime user access** window.
3. Back in your connector blade, select **All settings**, and select **General**:  
![][6]  
4. In General settings, set the following properties:  

	Property | Description
--- | ---
URL scheme | Select HTTP or HTTPS. HTTPS is recommended.
Authenticate with backend service | Options include: <ul><li>None: No additional security is enabled when authenticating. This is similar to anonymous authentication.</li><li>Accessible via API management: <strong>NEED A DESCRIPTION HERE</strong></li><li>HTTP Basic Authentication: Prompts for a username and password. If you choose this option, be sure to choose HTTPS for the URL scheme. Otherwise, the user name and password are passed in clear text.</li></ul> 
OAuth Settings | When using a PaaS (Platform as a Service) connector, that service may have additional username and password. Enter this username and password. When you do this, OAuth is enabled and allows the app to automatically authenticate with the PaaS.<br/><br/>Twitter is a great example. Enter your Twitter username and password. This allows the app to automatically authenticate with Twitter with no additional sign-in prompts. 

	> [AZURE.NOTE] The General Settings vary depending on the connector you're using. The [Connector List](../app-service-logic/app-service-logic-connectors-list.md) has links to all the built-in connectors provided with App Service. You can refer to these individual connectors for help configuring these properties. 

5. **Save** your changes.

In these Settings, you can also view the **API definition**, which is the Swagger file associated with your connector. 


## Add a new connection to your connector (slides 31 - )

> [AZURE.NOTE] For PowerApps public preview, only the SQL connector and Bing Search connector can be added and configured. More connectors will be added in the future. 

After that the connector is created, the next step is to create the "connection", which is just like a connection string. This allows the connector to successfully connect to your "backend" system. Conceptually, this is the same as on-premises; meaning a connection string that contains the server name, username, password, and other properties. 

Create the connection: 

1. In the Azure portal, open PowerApps, and select **Connection providers**. A list of the configured connectors is displayed:  
![][7]  
2. Select the connector you want and select **Connections**. In Connections, select **Add connection**:   
![][8]  
3. Enter a name for the connection and enter the connection string. Entering the connection string requires you to know some specific properties about the service you're connecting to. For example, if you're connecting to on-premises SQL Server, then you need to know the username, password, and other properties required to successfully make the connection. 
4. Select **Add** to save your changes.

## Give users runtime access to the connection (slide 39
Now give users within your company permissions to use the connection.

1. Open your connector, select **Connections**, and then select your specific connection. This opens a new blade that lists your connection name at the top. 
2. In this new blade, select **Runtime user access**.  In the following example, the **Sales database on-premises** connection is selected. The new blade opens and this is where you select **Runtime user access**:  
![][9]  
3. Select **Add**, and then select the permission you want to give:  
![][10]  
4. Add your user or group and select **Add** in the blades to save your changes.
  

## Summary and next steps
In this topic, you:

- Added a connector to your PowerApps and gave users within your company the rights to use it. You can also use these steps to manage the runtime access at any time. For example, if userA leaves your company, you can use the Azure portal to easily remove this user's permissions. Same scenario if a UserB joins your company.
- Added a connection (which is similar to a connection string) to your connection profile. This step lets the connector hosted in Azure to connect to your system, like an on-premises SQL Server. You also gave users within your company permissions to use the connection. 
- You worked with different blades, depending on the task. To add a connection, you open the connection provider and use its blade. To grant user access, you open the connection provider or the connection, depending on what you're giving access. 
- You can also delete any of the connectors you create within your App Service environment.

Next, you can [manage and monitor your PowerApps](powerapps-manage-monitor-usage.md).

[1]: ./media/powerapps-create-new-connector/settingsase.png
[2]: ./media/powerapps-create-new-connector/connectionprovider.png
[3]: ./media/powerapps-create-new-connector/addconnectionprovider.png
[4]: ./media/powerapps-create-new-connector/sharepoint.png
[5]: ./media/powerapps-create-new-connector/runtimeuseraccess.png
[6]: ./media/powerapps-create-new-connector/generalsettings.png
[7]: ./media/powerapps-create-new-connector/connectionproviderlist.png
[8]: ./media/powerapps-create-new-connector/addconnection.png
[9]: ./media/powerapps-create-new-connector/runtimeaccessconn.png
[10]: ./media/powerapps-create-new-connector/selectpermission.png