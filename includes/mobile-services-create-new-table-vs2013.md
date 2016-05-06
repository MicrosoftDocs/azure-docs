

Before you can store data in your new mobile service, you must create a new storage table in the service. These steps show how to use Visual Studio 2013 to create a new table in the mobile service. Then you update the app to use Mobile Services to store items in Azure instead of in the local collection.


1. In Server Explorer, expand **Azure Mobile Services**, right-click your mobile service, click **Create Table**, then type `TodoItem` in **Table Name**.

	![create table in VS 2013](./media/mobile-services-create-new-table-vs2013/mobile-create-table-vs2013.png)

2. Expand **Advanced**, verify that the table operation permissions default to **Anybody with the Application Key**, then click **Create**. 

	This creates the TodoItem table on the server, where anyone that has the application key can access and change data in the table without having to first be authenticated. 

	>[AZURE.NOTE]The application key is distributed with the application. Because this key is not securely distributed, it cannot be considered a security token. To secure access to your mobile service data, you must instead authenticate users before accessing. For more information, see [Permissions](http://msdn.microsoft.com/library/windowsazure/jj193161.aspx).
	>
	>New tables are created with the Id, __createdAt, __updatedAt, and __version columns. When dynamic schema is enabled, Mobile Services automatically generates new columns based on the JSON object in the insert or update request. For more information, see [Dynamic schema](http://msdn.microsoft.com/library/windowsazure/jj193175.aspx).



