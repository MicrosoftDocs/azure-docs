<properties
	pageTitle="Add or create a new API and give users permissions in PowerApps | Microsoft Azure"
	description="IT Pro: Add, create, and configure a new API, connection or connection profile, and give permissions and rights with user access in the Azure portal"
	services=""
    suite="powerapps"
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
   ms.date="11/20/2015"
   ms.author="litran"/>


# Add a new API, add a connection, and give users access

APIs exist within an [App Service environment](powerapps-get-started-azure-portal.md). APIs can be created from available APIs for PowerApps, from your API app that hosted on the App Service Environment, or from Swagger 2.0. There are many pre-built APIs available to you that can be easily added to your PowerApps. You can also upload your own API (JSON format) or Swagger 2.0. 

This topic:

- Lists the steps to add an API to PowerApps, and give users within your company permissions to use the API, including changing its properties.
- Lists the steps to add a connection to your API, and give users within your company permissions to use the connection.


#### Prerequisites to get started

- Enable [PowerApps in your Azure subscription](powerapps-get-started-azure-portal.md).
- Create an [App Service environment](powerapps-get-started-azure-portal.md).

## Add a new API to your app service environment
There are three different sources that can be used to create an API:

- [Available APIs](powerapps-register-from-available-apis.md)
- [From APIs hosted in your App Service Environment](powerapps-register-api-hosted-in-app-service.md)
- [From Swagger 2.0 API definition](powerapps-register-existing-api-from-api-definition.md)

## Delete a API
You can also delete an API you previously added. In PowerApps, select the **Manage APIs**, select the API, and select **Delete**:  
![][4]

## Give users access to the API
Now that the API is created and added to your app service environment, it's time to give users within your company the permissions to use it. 

1. In PowerApps, select **Manage APIs**, and select your API. For example, if you created a *MS Power BI* API, select it to open its blade. Select **API user access**:  
![][1]  

2. Select **Add** to add users, and select the rights. When done, select **Add** to save your changes. The Users or Groups count increases in the **API user access** window.


## Add a new connection to your API
After the API is created, the next step is to create the "connection", which is just like a connection string. This allows the API to successfully connect to your "backend" system. For PowerApps Enterprise public preview, only SQL Server's connection can be added and configured. More will be added in the future. 

- [Create SQL Server's connection](powerapps-create-api-sqlserver.md)

## Give users runtime access to the connection
Now give users within your company permissions to use the connection.

1. Open your API, select **Connections**, and then select your specific connection. This opens a new blade that lists your connection name at the top. 
2. In this new blade, select **Connection user access**.  In the following example, the **Hybrid Tunnel** connection is selected. The new blade opens and this is where you select **Connection user access**:  

	![][2]
  
3. In **Connection user access**, select **Add**, and then select the permission you want to give:  

	![][3]
  
4. Add your user or group and select **Add** in the blades to save your changes.

Now that users have permissions to the API and its connection, your users can add these APIs to their apps created in PowerApps. Specifically: 

- Users can see the API listed under **Available Connections** in PowerApps.
- Users can see the connection under **My Connections** in PowerApps.


## Summary and next steps
In this topic, you:

- Added an API to your PowerApps and gave users within your company the rights to use it. You can also use these steps to manage the runtime access at any time. For example, if userA leaves your company, you can use the Azure portal to easily remove this user's permissions. Same scenario if a UserB joins your company.
- Added a connection (which is similar to a connection string) to your connection profile. This step lets the API hosted in Azure to connect to your system, like an on-premises SQL Server. You also gave users within your company permissions to use the connection. 
- You worked with different blades, depending on the task. To add a connection, you open the API and use its blade. To grant user access, you open the API or the connection, depending on what you're giving access. 
- You can also delete any of the APIs you create within your app service environment.

Next, you can [manage and monitor your PowerApps](powerapps-manage-monitor-usage.md).

[1]: ./media/powerapps-manage-api-connection-user-access/apiuseraccess.png
[2]: ./media/powerapps-manage-api-connection-user-access/connectionuseraccess.png
[3]: ./media/powerapps-manage-api-connection-user-access/selectpermission.png
[4]: ./media/powerapps-manage-api-connection-user-access/deleteapi.png
