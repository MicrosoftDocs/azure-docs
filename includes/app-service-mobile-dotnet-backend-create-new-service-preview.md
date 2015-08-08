

Follow these steps to create a new Mobile App backend.

1. Log into the [Azure Portal].

2. In the top left of the window, click the **+NEW** button > **Web + Mobile** > **Mobile App**, then provide a name for your Mobile App backend.

3. Create a new resource group with the same name as your app.

4. Create a new App Service plan and choose a pricing tier and location.

5. Click **Create**. This creates a Mobile App backend where you will later deploy your server project. In the next step, you will create a new SQL database.


    > [AZURE.NOTE] As part of this tutorial, you create a new SQL Database instance and server. You can reuse this new database and administer it as you would any other SQL Database instance. If you already have a database in the same location as the new mobile app backend, you can instead choose **Use existing Database** and then select that database. The use of a database in a different location is not recommended because of additional bandwidth costs and higher latencies.


6. In the new Mobile App backend, click **Settings** > **Mobile App** > **Data** > **Add**. In the **Add data connection** blade, click **SQL Database** > **Create a new database** and type the name of the new database. Click **Server**, type the name of a new server, provide a login name and password, make sure **Allow azure services to access server** is checked, and click **OK** twice. This creates the new database and server.

    ![](./media/app-service-mobile-dotnet-backend-create-new-service-preview/dotnet-backend-create-db.png)


7. Back in the **Add data connection** blade, select **Connection string**, enter the login and password that you just provided when creating the database, and click **OK**.  If you use an existing database, provide the login credentials for that database. 

You have now provisioned an Azure Mobile App backend that can be used by your mobile client applications. Next, you will download a server  project for a simple "todo list" backend and publish it to Azure.

<!-- URLs. -->
[Azure Portal]: https://portal.azure.com/
