

Follow these steps to create a new mobile app.

1. Log into the [Azure Portal].

3. In the top left of the window, click the **+NEW** button > **Web + Mobile** > **Mobile App**, then provide a name for your mobile app. 

	Names must be 8-50 characters long and contain only alphnumeric characters.  

7. Choose a location. In this tutorial, we use **South Central US**.

    > [AZURE.NOTE] As part of this tutorial, you create a new SQL Database instance and server. You can reuse this new database and administer it as you would any other SQL Database instance. If you already have a database in the same location as the new mobile app backend, you can instead choose **Use existing Database** and then select that database. The use of a database in a different location is not recommended because of additional bandwidth costs and higher latencies.

3. Choose your app service plan and a pricing tier, or create a new one. In this tutorial, we use **Standard 1**.

4. Create a new resource group with the same name as your mobile app, and then click **Create**. 
	
	This creates the web app that is the .NET backend of your mobile app. Next, you will configure storage and other optional services.

5. In the new web app, click **Settings** > **Mobile App** > **Data** > **Add**.

    ![](./media/app-service-mobile-dotnet-backend-create-new-service-preview/Mobile-create-datablade.png)

	You will create a new SQL Database, but you can also choose to use an existing database. 

5. In the **Add data connection** blade, click **SQL Database** > **Create a new database**, type the name of the new database, click **Server**, type the name of a new server, provide an administrator login name and password, make sure **Allow azure services to access server** is checked, then click **OK** twice. 

    ![](./media/app-service-mobile-dotnet-backend-create-new-service-preview/dotnet-backend-create-db.png)

	This creates the new database and server.

8. Back in the **Add data connection** blade, select **Connection string** and enter the server administrator login name and password that you just provided when creating the database, then click **OK**. 
 
	When you use an existing database, provide the administrator login credentials for that database server. 

You now have created the most basic mobile app backend that can be used by your mobile apps. Next, you will download the Visual Studio project that implements the backend and publish it to Azure.

<!-- URLs. -->
[Azure Portal]: https://portal.azure.com/
