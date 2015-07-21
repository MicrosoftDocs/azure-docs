

Follow these steps to create a new mobile app.

1. Log into the [Azure Portal].

3. In the top left of the window, click the **+NEW** button. 

5. In the **Create** blade, click **Web + Mobile**. 

7. In the **Web + Mobile** blade, click the **Mobile App** item.

    ![](./media/app-service-mobile-dotnet-backend-create-new-service-preview/new-mobile-app.png)

2. In the **Mobile App** blade, provide a name for your mobile app. It must be at least 8 characters long and lowercase a-z.  

7. Choose a location. In this tutorial, we'll use **South Central US**.

    > [AZURE.NOTE] As part of this tutorial, you create a new SQL Database instance and server. You can reuse this new database and administer it as you would any other SQL Database instance. If you already have a database in the same location as the new mobile app backend, you can instead choose **Use existing Database** and then select that database. The use of a database in a different location is not recommended because of additional bandwidth costs and higher latencies.

3. Choose your app service plan.

5. Choose a pricing tier. In this tutorial, we'll use **Standard 1**.

4. Create a resource group that has the same name as your mobile app, and then click the **Create** button.  

5. In the **Settings** blade, click **Mobile App** -> **Data** to open the **Data Connections** blade.

    ![](./media/app-service-mobile-dotnet-backend-create-new-service-preview/Mobile-create-datablade.png)

5. In the **Add data connection** blade, select **SQL Database**. You can choose an existing database or create a new one. 

6. Select **Create a new database**, and type the name of the new database.

7. Select **Server**, type the name of a new server, and then provide an administrator login name and password. 

    ![](./media/app-service-mobile-dotnet-backend-create-new-service-preview/dotnet-backend-create-db.png)

7. Click the **OK** button in the **New Server** and **New database** blades.

8. In the **Add data connection** blade, select **Connection string**.

8. In the **Connection string** blade, provide the same administrator login name and password that you provided in the **New Server** blade.

    This is the only username and password that you have at this point because the database is brand new. If you select an existing database in the **New database** blade, you can provide the credentials for any user of that database. 

1. Click the **OK** button.
    You've now created a new mobile app backend that can be used by your mobile apps.

> [AZURE.NOTE] After your mobile app is created, navigate in the portal to the sql server you just created (be sure to select the server and not the azure sql db). From there, click the settings part, expand the firewall part, and change the "Allow access to Azure services". If you don't do this, your application won't work.

<!-- URLs. -->
[Azure Portal]: https://portal.azure.com/
