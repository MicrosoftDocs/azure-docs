

Follow these steps to create a new mobile app.

1. Log into the [Azure Portal].

2. In the top left of the window, click the **+NEW** button > **Web + Mobile** > **Mobile App**, then provide a name for your mobile app.

3. Choose your app service plan, or create a new one. In this tutorial's app service plan, we use **Standard 1** as the pricing tier and **South Central US** as the location.

4. Create a new resource group with the same name as your mobile app. 

5. Click **Create**. This creates the .NET backend of your mobile app. In the next step, you will create a new SQL database.


    > [AZURE.NOTE] As part of this tutorial, you create a new SQL Database instance and server. You can reuse this new database and administer it as you would any other SQL Database instance. If you already have a database in the same location as the new mobile app backend, you can instead choose **Use existing Database** and then select that database. The use of a database in a different location is not recommended because of additional bandwidth costs and higher latencies.


6. In the new mobile app, click **Settings** > **Mobile App** > **Data** > **Add**. In the **Add data connection** blade, click **SQL Database** > **Create a new database** and type the name of the new database. Click **Server**, type the name of a new server, provide a login name and password, make sure **Allow azure services to access server** is checked, and click **OK** twice. This creates the new database and server.

    ![](./media/app-service-mobile-dotnet-backend-create-new-service-preview/dotnet-backend-create-db.png)


7. Back in the **Add data connection** blade, select **Connection string**, enter the login and password that you just provided when creating the database, and click **OK**.  If you use an existing database, provide the login credentials for that database. 

You have now created a basic mobile app backend that can be used by your mobile apps. Next, you will download the Visual Studio project that implements the backend and publish it to Azure.

<!-- URLs. -->
[Azure Portal]: https://portal.azure.com/
