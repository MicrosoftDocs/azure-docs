1. Log in at the [Azure Portal].

2. Click **+NEW** > **Web + Mobile** > **Mobile App**, then provide a name for your Mobile App backend.

3. For the **Resource Group**, select an existing resource group, or create a new one (using the same name as your app.) 
 
	You can either select another App Service plan or create a new one. For more about App Services plans and how to create a new plan in a different pricing tier and in your desired location, see [Azure App Service plans in-depth overview](../articles/app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).

4. For the **App Service plan**, the default plan (in the [Standard tier](https://azure.microsoft.com/pricing/details/app-service/)) is selected. You can also  select a different plan, or [create a new one](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md#create-an-app-service-plan). The App Service plan's settings determine the [location, features, cost and compute resources](https://azure.microsoft.com/pricing/details/app-service/) associated with your app. 

	After you decide on the plan, click **Create**. This creates the Mobile App backend. 
	
6. In the **Settings** blade for the new Mobile App backend, click **Quick start** > your client app platform > **Connect a database**. 

	![](./media/app-service-mobile-dotnet-backend-create-new-service/dotnet-backend-create-data-connection.png)

7. In the **Add data connection** blade, click **SQL Database** > **Create a new database**, type the database **Name**, choose a pricing tier, then click **Server**.  You can reuse this new database. If you already have a database in the same location, you can instead choose **Use an existing database**. The use of a database in a different location isn't recommended due to bandwidth costs and higher latency.
 
    ![](./media/app-service-mobile-dotnet-backend-create-new-service/dotnet-backend-create-db.png)

8. In the **New server** blade, type a unique server name in the **Server name** field, provide a login and password, check **Allow azure services to access server**, and click **OK**. This creates the new database.

9. Back in the **Add data connection** blade, click **Connection string**, type the login and password values for your database, and click **OK**. Wait a few minutes for the database to be deployed successfully before proceeding.

<!-- URLs. -->
[Azure Portal]: https://portal.azure.com/
