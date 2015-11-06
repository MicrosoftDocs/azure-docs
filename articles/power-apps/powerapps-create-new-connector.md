
<properties
	pageTitle="Add or create a new API and give users permissions in PowerApps | Microsoft Azure"
	description="Add, create, and configure a new API, connection or connection profile, and give permissions and rights with user access"
	services="powerapps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/05/2015"
   ms.author="litran"/>


# Add a new API, add a connection, and give users access

APIs exist within an [App Service environment](powerapps-create-new-ase.md). APIs can be created from the Azure Marketplace, from your API Hub (Existing API), or Swagger 2.0. The Azure Marketplace offers many pre-built APIs available to you that can be easily added to your PowerApps apps. API Hub (Existing API) lets you upload your own API (JSON format) or Swagger 2.0. 

This topic:

- Lists the steps to add an API to PowerApps apps, and give users within your company permissions to use the API, including changing its properties.
- Lists the steps to add a connection to your API, and give users within your company permissions to use the connection.

Once you create the API, you can create a connection to that API.

When these steps are complete, your users can add these APIs to their PowerApps apps created in PowerApps Studio. 

#### Prerequisites to get started

- Enable [PowerApps in your Azure subscription](powerapps-get-started-azure-portal.md).
- Create an [App Service environment](powerapps-create-new-ase.md).

## Add a new API to your app service environment
There are 3 different sources you can add a new API from:

- [Azure Marketplace](powerapps-create-api-azuremarketplace.md)
- [Import from an existing API app]()
- [Import from Swagger 2.0]()

### Delete a API
You can also delete an API you previously added. In PowerApps, select the **Manage APIs**, select the API, and select **Delete**. 


## Give user access to an API 

Now that the API is created and added to your app service environment, it's time to give users within your company the permissions to use it. 

1. In PowerApps extension, select **Manage APIs**, and select your API. For example, if you created a SharePoint Online API, select it to open its blade. Select **API user access**:  
![][1]  
2. Select **Add** to add the users, and select the rights. When done, select **Add** to save your changes. The Users or Groups count increases in the **API user access** window.

## Add a new connection to your API

After that the API is created, user can choose the create a specific connection that users in their company can consume directly instead of establishing their own connection. This allows the API to successfully connect to your "backend" system. For PowerApps Enterprise public preview, only SQL connector and Bing Search's connections can be added and configured. More will be added in the future. 

- [Create SQL Connector's connection](powerapps-create-connection-sql-connector.md)
- [Create Bing Search's connection]()

## Give user access to the connection
Now give users within your company permissions to use the connection.

1. Open your API, select **Connections**, and then select your specific connection. This opens a new blade that lists your connection name at the top. 
2. In this new blade, select **Connection user access**.  In the following example, the **Sales database on-premises** connection is selected. The new blade opens and this is where you select **Connection user access**:  
![][2]  
3. In **Connection user access**, select **Add**, and then select the permission you want to give:  
![][3]  
4. Add your user or group and select **Add** in the blades to save your changes.
  
Now that users have permissions to the API and its connection, your users can add these APIs to their PowerApps apps. Specifically: 

- Users can see the API listed under **My Connections** in PowerApps studio.
- Users can see the connection under **Available Connections** in PowerApps studio.

## Summary and next steps
In this topic, you:

- Added an API to your PowerApps and gave users within your company the rights to use it. You can also use these steps to manage the runtime access at any time. For example, if userA leaves your company, you can use the Azure portal to easily remove this user's permissions. Same scenario if a UserB joins your company.
- Added a connection (which is similar to a connection string) to your connection profile. This step lets the API hosted in Azure to connect to your system, like an on-premises SQL Server. You also gave users within your company permissions to use the connection. 
- You worked with different blades, depending on the task. To add a connection, you open the API and use its blade. To grant user access, you open the API or the connection, depending on what you're giving access. 
- You can also delete any of the APIs you create within your App Service environment.

Next, you can [manage and monitor your PowerApps](powerapps-manage-monitor-usage.md).

[1]: ./media/powerapps-create-new-connector/runtimeuseraccess.png
[2]: ./media/powerapps-create-new-connector/runtimeaccessconn.png
[3]: ./media/powerapps-create-new-connector/selectpermission.png