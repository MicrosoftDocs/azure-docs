
<properties
	pageTitle="Add or create a new API and give users permissions in PowerApps | Microsoft Azure"
	description="Add, create, and configure a new API, connection or connection profile, and give permissions and rights with user access"
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
   ms.date="10/19/2015"
   ms.author="mandia"/>


# Add a new API, add a connection, and give users access

APIs exist within an [App Service environment](powerapps-create-new-ase.md). APIs can be created from the Azure Marketplace, or within your API Hub (Existing API). The Azure Marketplace offers pre-built APIs available to you that can be easily added to your PowerApps apps. API Hub (Existing API) lets you upload your own API (JSON format). You can create your own API using **IS THERE AN SDK OR SOMETHING?**.

This topic:

- Lists the steps to add an API and give users within your company permissions to use the API, including changing its properties.
- Lists the steps to add a connection to your API, and give users within your company permissions to use the connection.

When these steps are complete, your users can add these APIs to their PowerApps apps. 

#### Prerequisites to get started

- Enable [PowerApps in your Azure subscription](powerapps-portal-signup.md).
- Create an [App Service environment](powerapps-create-new-ase.md).

## Add a new API to your app service environment
There are two ways to create an API:

- Using your new PowerApps blade
- Using the app service environment you created (update steps 1-2 with slide 29)

This section lists both steps. 


### Create an API from your PowerApps blade
1. In the Azure portal, select **PowerApps**. In PowerApps, select **Registered APIs**:  
![][11]  
2. In Registered APIs, select **Add**:  
![][12]  
3. In **Add API**, enter the API properties:     
![][13]  
In **Name**, enter a descriptive name for your API. For example, if you're adding the SQL API, you can name it *SQLOrdersDB* or *SQLAddNewCustomer*.  

	In **Source**, select: 
	- **Marketplace** to select an already-created API, including SharePoint, Twitter, Bing, and more. 
	- **Import from API App** to choose an API you created (the .json and .manifest files are needed). 
	- **Import from other backend** to add the .json file to an API app. **EXPLAIN MORE ABOUT THIS**  

4. Choose the API you want to add and configure that API's properties. Every API has different properties. For example, the SQL API can connect to an Azure SQL Database or an on-premises SQL Server. These options determine the settings or properties you configure. 
	
	In the following example, the SharePoint Online API is selected and SharePoint Online-specific properties are displayed:
	![][4]  

		> [AZURE.TIP] When you add an API, you're adding the API to your app service environment. Once in the app service environment, it can be used by other apps within the same app service environment, including PowerApps.

5. Select **OK** and **Add** to complete these steps.  

The API is now added to your list of **Registered APIs**. 

### Create an API from your app service environment
1. In the Azure portal, select **PowerApps**. In PowerApps, select **Settings**, and then select **App Service environment**:  
![][1]  
2. In your app service environment, select **Registered APIs**, and then select **Add** to add a new API:  
![][14]  
3. In **Add API**, enter the API properties:     
![][13]  
In **Name**, enter a descriptive name for your API. For example, if you're adding the SQL API, you can name it *SQLOrdersDB* or *SQLAddNewCustomer*.  

	In **Source**, select: 
	- **Marketplace** to select an already-created API, including SharePoint, Twitter, Bing, and more. 
	- **Import from API App** to choose an API you added to your app service environment. Typically, this is chosen when you create a custom API app and the custom API app is added to your app service environment. 
	- **Import from other backend** to add the .json file to an API app. **EXPLAIN MORE ABOUT THIS**

4. Choose the API you want to add and configure that API's properties. Every API has different properties. For example, the SQL API can connect to an Azure SQL Database or an on-premises SQL Server. These options determine the settings or properties you configure. 
	
	In the following example, the SharePoint Online API is selected and SharePoint Online-specific properties are displayed:
	![][4]  

		> [AZURE.TIP] When you add an API, you're adding the API to your app service environment. Once in the app service environment, it can be used by other apps within the same app service environment, including PowerApps.

5. Select **OK** and **Add** to complete these steps.  

The API is now added to your list of **Registered APIs**. 

#### Delete the API
You can also delete APIs you add. In PowerApps, select **Registered APIs**, select the API, and select **Delete**. 


## Give PowerApps users access to the API
Now that the API is created and added to your app service environment, it's time to give users within your company the permissions to use it. 

1. In PowerApps, select **Registered APIs**, and select your API. For example, if you created a SharePoint Online API, select it to open its blade. Select **App user access**:  
![][5]  
2. Select **Add** to add users, and select the rights. When done, select **Add** to save your changes. The Users or Groups count increases in the **App user access** window.


## Configure the API authentication properties
1. Back in your API blade, select **All settings**, and select **General**:  
![][6]  
2. In General settings, set the following properties. Remember, the settings vary depending on the API you're using:  

	Property | Description
--- | ---
URL scheme | Select HTTP or HTTPS. HTTPS is recommended.
Authenticate with backend service | Options include: <ul><li>None: No additional security is enabled when authenticating. This is similar to anonymous authentication.</li><li>Accessible via API management: <strong>NEED A DESCRIPTION HERE</strong></li><li>HTTP Basic Authentication: Prompts for a username and password. If you choose this option, be sure to choose HTTPS for the URL scheme. Otherwise, the user name and password are passed in clear text.</li></ul> 
OAuth Settings | When using a PaaS (Platform as a Service) API, that service may have additional username and password. Enter this username and password. When you do this, OAuth is enabled and allows the app to automatically authenticate with the PaaS.<br/><br/>Twitter is a great example. Enter your Twitter username and password. This allows the app to automatically authenticate with Twitter with no additional sign-in prompts. 

3. **Save** your changes.

In these Settings, you can also upload a policy file and view the API definition, which is the Swagger file associated with your API. 


## Add a new connection to your API

> [AZURE.NOTE] For PowerApps preview, only the SQL API and Bing Search API can be added and configured. More APIs will be added in the future. 

After the API is created, the next step is to create the "connection", which is just like a connection string. This allows the API to successfully connect to your "backend" system. Conceptually, this is the same as on-premises; meaning a connection string that contains the server name, username, password, and other properties. 

Create the connection: 

1. In the Azure portal, open **PowerApps**, select **Registered APIs**, and select your API. In your API, select **Connections**:  
![][15]  
2. In Connections, select **Add**:  
![][8]  
3. Enter a **Name** for the connection and enter the connection string. Entering the connection string requires you to know some specific properties about the service you're connecting to. For example, if you're connecting to on-premises SQL Server, then you need to know the username, password, and other properties required to successfully make the connection. 
4. Select **Add** to save your changes.

## Give users runtime access to the connection
Now give users within your company permissions to use the connection.

1. Open your API, select **Connections**, and then select your specific connection. This opens a new blade that lists your connection name at the top. 
2. In this new blade, select **App user access**.  In the following example, the **Sales database on-premises** connection is selected. The new blade opens and this is where you select **App user access**:  
![][9]  
3. In **App user access**, select **Add**, and then select the permission you want to give:  
![][10]  
	For example, you can give the Sales group within your company *Can use and edit* permissions to a SQL API. When the Sales group uses their PowerApps app with this SQL API, they can insert rows (like add a new customer), update records (increase quantity ordered) , and other 'Edit' tasks (remove a product from a sales order). For those groups that report on this information, you can give them *Can use* permission to this SQL API.
4. Add your user or group and select **Add** in the blades to save your changes.
  

Now that users have permissions to the API and its connection, your users can add these APIs to their PowerApps apps. Specifically: 

- Users can see the API listed under **My Connections** in PowerApps studio.
- Users can see the connection under **Available Connections** in PowerApps studio.



## Summary and next steps
In this topic, you:

- Added an API to your PowerApps and gave users within your company the rights to use it. You can also use these steps to manage the runtime access at any time. For example, if userA leaves your company, you can use the Azure portal to easily remove this user's permissions. Same scenario if a UserB joins your company.
- Added a connection (which is similar to a connection string) to your connection profile. This step lets the API hosted in Azure to connect to your system, like an on-premises SQL Server. You also gave users within your company permissions to use the connection. 
- You worked with different blades, depending on the task. To add a connection, you open the API and use its blade. To grant user access, you open the API or the connection, depending on what you're giving access. 
- You can also delete any of the APIs you create within your app service environment.

Next, you can [manage and monitor your PowerApps](powerapps-manage-monitor-usage.md).


[1]: ./media/powerapps-create-new-connector/settingsase.png
[4]: ./media/powerapps-create-new-connector/sharepoint.png
[5]: ./media/powerapps-create-new-connector/runtimeuseraccess.png
[6]: ./media/powerapps-create-new-connector/generalsettings.png
[8]: ./media/powerapps-create-new-connector/addconnection.png
[9]: ./media/powerapps-create-new-connector/runtimeaccessconn.png
[10]: ./media/powerapps-create-new-connector/selectpermission.png
[11]: ./media/powerapps-create-new-connector/registeredapis.png
[12]: ./media/powerapps-create-new-connector/addapi.png
[13]: ./media/powerapps-create-new-connector/apiproperties.png
[14]: ./media/powerapps-create-new-connector/asenewapi.png
[15]: ./media/powerapps-create-new-connector/connections.png