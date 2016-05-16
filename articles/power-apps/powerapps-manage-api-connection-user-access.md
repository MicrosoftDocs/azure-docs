<properties
	pageTitle="Add or create a new API and give users permissions in PowerApps | Microsoft Azure"
	description="Add, create, and configure a new API, connection or connection profile, and give permissions and rights with user access in the Azure portal"
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
   ms.date="05/02/2016"
   ms.author="litran"/>


# Add a new API, add a connection, and give users access

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 
> 
> - To learn more about PowerApps and to get started, go to [PowerApps](https://powerapps.microsoft.com).  
> - To learn more about the available connections in PowerApps, go to [Available Connections](https://powerapps.microsoft.com/tutorials/connections-list/). 

<!--Archived
APIs exist within an [app service environment](powerapps-get-started-azure-portal.md). APIs can be created from the available APIs for PowerApps, from API apps hosted in your app service environment, or from Swagger 2.0. There are many pre-built APIs available that can easily be added to your PowerApps. You can also upload your own API in JSON format or Swagger 2.0. 

This topic:

- Lists the steps to add an API to PowerApps, and give users within your company permissions to use the API, including changing its properties.
- Lists the steps to add a connection to your API, and give users within your company permissions to use the connection.


#### Prerequisites to get started

- Enable [PowerApps in your Azure subscription](powerapps-get-started-azure-portal.md).
- Create an [App Service environment](powerapps-get-started-azure-portal.md).
- Create an API using any of the following methods:  
	- Create a [Microsoft managed API or an IT managed API](powerapps-register-from-available-apis.md).
	- Create an API hosted within [your App Service Environment](powerapps-register-api-hosted-in-app-service.md).
	- Create using a [Swagger 2.0 API definition](powerapps-register-existing-api-from-api-definition.md).


## Give users access to the API
Now that the API is created and added to your app service environment, it's time to give users within your company the permissions to use it. 

1. In PowerApps, select **Manage APIs**, and select your API. For example, if you created a *MS Power BI* API, select it to open its blade. Select **API user access**:  
![][1]  

2. Select **Add** to add users, and select the rights. When done, select **Add** to save your changes. The Users or Groups count increases in the **API user access** window.


## Add a new connection to your API
The next step is to create the "connection" to your API, which is kind of like a connection string. This allows the API to successfully connect to your "backend" system. For PowerApps Enterprise public preview, only SQL Server's connection can be added and configured. More are being added. 

- [Create SQL Server's connection](powerapps-create-api-sqlserver.md)

## Give users runtime access to the connection
Now give users within your company permissions to use the connection.

1. Open your API, select **Connections**, and then select your specific connection. This opens a new blade that lists your connection name at the top. 
2. In this new blade, select **Connection user access**.  In the following example, the **Hybrid Tunnel** connection is selected. The new blade opens and this is where you select **Connection user access**:  
![][2]
  
3. In **Connection user access**, select **Add**, and then select the permission you want to give:  
![][3]
  
4. Add your user or group. Select **Add** to save your changes.

Now that users have permissions to the API and its connection, your users can add these APIs to their apps created in PowerApps. Specifically: 

- Users can see the API listed under **Available Connections** in PowerApps.
- Users can see the connection under **My Connections** in PowerApps.


## Delete an API
You can also delete an API you previously added. In PowerApps, select the **Manage APIs**, select the API, and select **Delete**:  
![][4]


## Summary and next steps
In this topic, you:

- Added an API and gave users within your company the rights to use it. You can also use these steps to manage the runtime access at any time. For example, if userA leaves your company, you can use the Azure portal to easily remove this user's permissions. Same scenario if a UserB joins your company.
- Added a connection (which is similar to a connection string). This step lets the API hosted in Azure to connect to your system, like an on-premises SQL Server. You also gave users within your company permissions to use the connection. 
- You worked with different blades, depending on the task. To add a connection, you open the API and use its blade. To grant user access, you open the API or the connection, depending on what you're giving access. 
- You can also delete any of the APIs you create within your app service environment.

Next, you can [manage and monitor your PowerApps](powerapps-manage-monitor-usage.md).
-->


[1]: ./media/powerapps-manage-api-connection-user-access/apiuseraccess.png
[2]: ./media/powerapps-manage-api-connection-user-access/connectionuseraccess.png
[3]: ./media/powerapps-manage-api-connection-user-access/selectpermission.png
[4]: ./media/powerapps-manage-api-connection-user-access/deleteapi.png
