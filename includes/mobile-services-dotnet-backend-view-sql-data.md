
The final optional step of this tutorial is to check in the SQL Database associated with the mobile service an review the stored data. 

1. In the Azure Management Portal, click manage for the database associated with your mobile service.
 
	![sign-in to manage SQL Database](./media/mobile-services-dotnet-backend-view-sql-data/manage-sql-azure-database.png)

2. In the Management portal execute a query to view the changes made by the Windows Store app. Your query will be similar to the following query but use your database name instead of <code>todolist</code>.</p>

        SELECT * FROM [todolist].[todoitems]

    ![query SQL Database for stored items](./media/mobile-services-dotnet-backend-view-sql-data/sql-azure-query.png)

	Note that the table includes Id, __createdAt, __updatedAt, and __version columns. These columns support offline data sync and are implemented in the [EntityData](http://msdn.microsoft.com/library/microsoft.windowsazure.mobile.service.entitydata.aspx) base class. For more information, see [Get started with offline data sync].