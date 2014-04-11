Now that the app has been updated to use Mobile Services for back end storage, you can test it against Mobile Services, using either the Android emulator or an Android phone.

1. From the **Run** menu, click **Run** to start the project.

	This executes your app, built with the Android SDK, that uses the client library to send a query that returns items from your mobile service.

5. As before, type meaningful text, then click **Add**.

   	This sends a new item as an insert to the mobile service.

    You can restart the app to see that the changes were persisted to the database in Azure. You can also examine the database using the Azure Management portal:  the next two steps do this to view the changes in your database.


4. In the Azure Management Portal, click manage for the database associated with your mobile service.

    ![](./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started-data/manage-sql-azure-database.png)

5. In the Management portal execute a query to view the changes made by the Windows Store app. Your query will be similar to the following query but use your database name instead of `todolist`.

        SELECT * FROM [todolist].[todoitems]

    ![](./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started-data/sql-azure-query.png)

This concludes the **Get started with data** tutorial for Android.