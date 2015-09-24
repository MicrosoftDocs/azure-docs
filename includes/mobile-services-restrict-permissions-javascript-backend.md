
To secure your endpoints, you must restrict access to only authenticated clients. 

1. In the [Azure Management portal](https://manage.windowsazure.com/), navigate to your mobile service, then click  **Data** > your table name (**TodoItem**) > **Permissions**. 

2. Set all of the table operation permissions to **Only authenticated users**. 

	 This ensures that all operations against the table require an authenticated user, which is required for this tutorial. You can set differnt permissions on each operations to support your specific scenario.  
